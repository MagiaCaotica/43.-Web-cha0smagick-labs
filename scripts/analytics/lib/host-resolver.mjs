/**
 * host-resolver.mjs — production reachability for measurement scripts.
 *
 * WHY THIS EXISTS
 * The audit scripts in this directory measure the deployed site. On some
 * networks the local resolver refuses a perfectly valid public name: on this
 * machine `Resolve-DnsName cha0smagicklabs.com` returns "operation refused"
 * while `https://github.com` returns 200. The name exists — DNS-over-HTTPS
 * answers 185.199.109/110/111.153, all GitHub Pages addresses. The defect is
 * the local resolver, not the site, and no amount of retrying fixes it.
 *
 * WHAT THIS DOES
 * 1. If the system resolver already answers, return no extra flags. Behaviour
 *    on a healthy network is byte-identical to before.
 * 2. Otherwise resolve via DNS-over-HTTPS and hand Chrome a
 *    `--host-resolver-rules` mapping. TLS validation, SNI and the Host header
 *    all still use the real hostname, so the certificate is checked against
 *    the real domain. Only name resolution is short-circuited.
 * 3. `httpsGetStatus` does the same for plain HTTPS requests, where a browser
 *    is not involved: it connects to the pinned IP but sends `servername` and
 *    `Host` for the real hostname.
 *
 * WHAT THIS DOES NOT DO
 * It does not disable certificate validation, does not use http://, and does
 * not redirect traffic anywhere but the address DNS-over-HTTPS reported. A
 * measurement taken through this helper is a measurement of the real origin.
 *
 * FAILURE IS VISIBLE
 * If pinning is impossible the helpers return "do nothing" rather than
 * silently degrading, and the caller then fails on its own connectivity. A
 * measurement that cannot reach the site must not be reported as a pass.
 */

import dns from 'node:dns/promises';
import https from 'node:https';

const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1', '::1', '0.0.0.0', '[::1]']);
const IPV4 = /^\d{1,3}(\.\d{1,3}){3}$/;

const DOH_ENDPOINTS = (host) => [
  `https://dns.google/resolve?name=${encodeURIComponent(host)}&type=A`,
  `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(host)}&type=A`,
];

export function hostnameOf(url) {
  try {
    return new URL(url).hostname;
  } catch {
    return '';
  }
}

export function isLocalTarget(url) {
  const host = hostnameOf(url);
  return !host || LOCAL_HOSTS.has(host) || IPV4.test(host);
}

async function systemResolves(host) {
  try {
    await dns.lookup(host);
    return true;
  } catch {
    return false;
  }
}

async function resolveViaDoH(host) {
  for (const endpoint of DOH_ENDPOINTS(host)) {
    try {
      const res = await fetch(endpoint, {
        headers: { accept: 'application/dns-json' },
        signal: AbortSignal.timeout(15_000),
      });
      if (!res.ok) continue;
      const body = await res.json();
      const a = (body.Answer || []).find((r) => r.type === 1 && typeof r.data === 'string');
      if (a) return a.data;
    } catch {
      // try the next endpoint
    }
  }
  return null;
}

/** Chrome flags needed to reach `url`. Empty when the network is healthy. */
export async function hostResolverArgs(url) {
  if (isLocalTarget(url)) return [];
  const host = hostnameOf(url);
  if (await systemResolves(host)) return [];

  const ip = await resolveViaDoH(host);
  if (!ip) {
    console.log(`[host-resolver] ${host} unresolved locally and DNS-over-HTTPS gave no answer.`);
    return [];
  }
  console.log(
    `[host-resolver] local resolver refuses ${host}; pinned to ${ip} from DNS-over-HTTPS.`,
  );
  return [`--host-resolver-rules=MAP ${host} ${ip}`];
}

/** The pinned address for `url`, or null when the system resolver is fine. */
export async function pinnedAddress(url) {
  if (isLocalTarget(url)) return null;
  const host = hostnameOf(url);
  if (await systemResolves(host)) return null;
  const ip = await resolveViaDoH(host);
  if (ip) {
    console.log(`[host-resolver] local resolver refuses ${host}; pinned to ${ip}.`);
  }
  return ip;
}

const MAX_BODY_BYTES = 8 * 1024 * 1024;

/**
 * Read-only HTTPS GET with redirect following.
 * Never throws for an HTTP error status — a 404 is a result, not an exception.
 * Returns { url, finalUrl, status, ms, body, error }. `body` is truncated at
 * 8 MB; the caller decides whether it needs it at all.
 */
export function httpsGetStatus(url, { timeoutMs = 20_000, maxRedirects = 5 } = {}) {
  const started = Date.now();
  return new Promise((resolve) => {
    const finish = (value) => resolve({ url, ms: Date.now() - started, body: '', ...value });

    pinnedAddress(url)
      .catch(() => null)
      .then((ip) => {
        const target = new URL(url);
        // The URL object is deliberately NOT passed as the first argument: when
        // Node sees a URL it overrides options.host, so the pinned address would
        // be ignored and the request would fall back to system DNS. Everything
        // is spelled out in the options instead.
        const options = {
          protocol: target.protocol,
          method: 'GET',
          host: ip || target.hostname,
          port: target.port || 443,
          servername: ip ? target.hostname : undefined,
          path: `${target.pathname}${target.search}`,
          headers: {
            Host: target.host,
            'User-Agent': 'cha0smagicklabs-audit/1.0 (+read-only smoke)',
            Accept: 'text/html,application/xhtml+xml,*/*;q=0.8',
          },
          timeout: timeoutMs,
        };

        const req = https.request(options, (res) => {
          const status = res.statusCode || 0;
          const location = res.headers.location;
          const chunks = [];
          let size = 0;

          res.on('data', (chunk) => {
            if (size >= MAX_BODY_BYTES) return;
            size += chunk.length;
            chunks.push(chunk);
          });
          res.on('end', () => {
            const body = Buffer.concat(chunks).toString('utf8');
            if (location && status >= 300 && status < 400 && maxRedirects > 0) {
              const next = new URL(location, target).toString();
              httpsGetStatus(next, { timeoutMs, maxRedirects: maxRedirects - 1 }).then((r) =>
                finish({
                  finalUrl: next,
                  status: r.status,
                  body: r.body,
                  via: r.via,
                  error: r.error,
                }),
              );
              return;
            }
            finish({ finalUrl: url, status, body });
          });
        });

        req.on('timeout', () => {
          req.destroy();
          finish({ finalUrl: url, status: 0, error: `timeout after ${timeoutMs}ms` });
        });
        req.on('error', (err) => finish({ finalUrl: url, status: 0, error: err.message }));
        req.end();
      });
  });
}

/** httpsGetStatus plus the decoded body, or '' when the request failed. */
export async function httpsGetText(url, options = {}) {
  const r = await httpsGetStatus(url, options);
  return r.status === 0 ? '' : r.body;
}
