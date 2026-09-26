#!/usr/bin/env node
/**
 * prod-smoke.mjs — read-only reachability smoke of the deployed site.
 *
 * WHY THIS EXISTS
 * P0-10 requires evidence against the real domain, and the earlier production
 * pass was executed ad hoc from a shell one-liner. A measurement that is not
 * reproducible is not evidence. This script is that measurement, committed.
 *
 * WHAT IT MEASURES
 *   1. The base origin answers at all. If it does not, the run is INCONCLUSIVE
 *      (exit 2) and reports nothing else — an unreachable site must never be
 *      summarised as a pass.
 *   2. /robots.txt answers 200 and declares a sitemap.
 *   3. /sitemap.xml answers 200; its entry count and SHA-256 are recorded, and
 *      compared against the local file so a stale served sitemap is visible.
 *   4. Every URL in that sitemap is fetched once, read-only GET, following
 *      redirects. Statuses are tallied; 4xx, 5xx and transport failures are
 *      listed individually.
 *
 * WHAT IT DOES NOT MEASURE
 * It does not assert that the sitemap is the whole canonical surface. The
 * governed surface in docs/canonical-asset-inventory.md is 568 tracked pages
 * while the sitemap declares 532; the 36-entry difference is a separate
 * reconciliation, not something this script guesses at. Pass --source
 * governed only after that reconciliation is written down.
 * It does not run a browser, so it proves reachability and status, not
 * rendering, consent, layout shift or performance. Those need
 * consent-browser-test.mjs, cls-shift-probe.mjs and lighthouse-audit.mjs.
 *
 * USAGE
 *   node scripts/analytics/prod-smoke.mjs
 *   node scripts/analytics/prod-smoke.mjs --base https://cha0smagicklabs.com
 *   node scripts/analytics/prod-smoke.mjs --concurrency 12 --json out/smoke.json
 *   node scripts/analytics/prod-smoke.mjs --limit 25          # quick pass
 *   node scripts/analytics/prod-smoke.mjs --extra /404.html,/glossary.html
 *
 * EXIT CODES
 *   0  every probed URL answered 2xx/3xx
 *   1  at least one URL answered 4xx/5xx, or a guard failed
 *   2  INCONCLUSIVE — the site could not be reached, so nothing was proved
 */

import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { httpsGetStatus, pinnedAddress } from './lib/host-resolver.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..', '..');

const EXIT = { OK: 0, FAIL: 1, INCONCLUSIVE: 2 };

const DEFAULTS = {
  base: 'https://cha0smagicklabs.com',
  concurrency: 8,
  timeoutMs: 20_000,
  limit: 0,
  extra: '',
  source: 'sitemap',
  json: '',
};

function parseArgs(argv) {
  const out = { ...DEFAULTS };
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === '--base') out.base = argv[++i];
    else if (a === '--concurrency') out.concurrency = Math.max(1, Number(argv[++i]) || 1);
    else if (a === '--timeout') out.timeoutMs = Number(argv[++i]) || DEFAULTS.timeoutMs;
    else if (a === '--limit') out.limit = Number(argv[++i]) || 0;
    else if (a === '--extra') out.extra = argv[++i] || '';
    else if (a === '--source') out.source = argv[++i] || 'sitemap';
    else if (a === '--json') out.json = argv[++i] || '';
    else if (a === '-h' || a === '--help') out.help = true;
    else throw new Error(`unknown argument: ${a}`);
  }
  return out;
}

const sha256 = (text) => crypto.createHash('sha256').update(text).digest('hex');
const join = (base, p) => `${base.replace(/\/+$/, '')}/${String(p).replace(/^\/+/, '')}`;

function locsFrom(xml) {
  return [...xml.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/gi)].map((m) => m[1].trim());
}

async function runPool(items, limit, worker) {
  const results = new Array(items.length);
  let next = 0;
  const runners = Array.from({ length: Math.min(limit, items.length) }, async () => {
    for (;;) {
      const i = next;
      next += 1;
      if (i >= items.length) return;
      results[i] = await worker(items[i], i);
    }
  });
  await Promise.all(runners);
  return results;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    console.log(
      'Usage: node scripts/analytics/prod-smoke.mjs [--base <origin>] [--concurrency n]\n' +
        '         [--timeout ms] [--limit n] [--source sitemap|governed]\n' +
        '         [--extra /a,/b] [--json <path>]',
    );
    return EXIT.OK;
  }

  console.log(`prod-smoke  base=${args.base}  source=${args.source}`);
  const pin = await pinnedAddress(args.base).catch(() => null);
  console.log(pin ? `  resolver pin: ${pin}` : '  resolver: system');

  // ---- guard 1: is the origin reachable at all? -------------------------
  const root = await httpsGetStatus(join(args.base, '/index.html'), { timeoutMs: args.timeoutMs });
  if (root.status === 0) {
    console.error(
      `INCONCLUSIVE: ${args.base} unreachable (${root.error}). Nothing was measured.`,
    );
    return EXIT.INCONCLUSIVE;
  }
  console.log(`  origin reachable: HTTP ${root.status} in ${root.ms}ms`);

  const report = {
    tool: 'prod-smoke.mjs',
    base: args.base,
    resolver_pin: pin,
    started_at: new Date().toISOString(),
    guards: {},
    sitemap: {},
    extra: [],
    counts: {},
    failures: [],
    slowest: [],
    samples: {},
  };

  // ---- guard 2: robots.txt ----------------------------------------------
  const robots = await httpsGetStatus(join(args.base, '/robots.txt'), { timeoutMs: args.timeoutMs });
  const declaresSitemap = /^\s*sitemap\s*:/im.test(textOf(robots));
  report.guards.robots = { status: robots.status, declares_sitemap: declaresSitemap };
  console.log(`  robots.txt: HTTP ${robots.status}, declares sitemap: ${declaresSitemap}`);

  // ---- guard 3: sitemap -------------------------------------------------
  const sm = await httpsGetStatus(join(args.base, '/sitemap.xml'), { timeoutMs: args.timeoutMs });
  const smText = textOf(sm);
  const servedUrls = locsFrom(smText);
  let localUrls = [];
  let localHash = null;
  let localText = '';
  try {
    localText = await fs.readFile(path.join(ROOT, 'sitemap.xml'), 'utf8');
    localUrls = locsFrom(localText);
    localHash = sha256(localText);
  } catch (err) {
    report.sitemap.local_read_error = err.message;
  }
  const servedHash = sha256(smText);
  // Compare content, not bytes. The local file is CRLF; whatever serves it
  // normalises to LF, so a raw SHA-256 comparison reports a mismatch on a
  // perfectly current sitemap. A byte hash alone would cry wolf on every run.
  const normalise = (s) => s.replace(/\r\n/g, '\n').trim();
  const servedHashNorm = sha256(normalise(smText));
  const localHashNorm = localHash === null ? null : sha256(normalise(localText));
  const localLocs = localUrls;
  report.sitemap = {
    status: sm.status,
    served_entries: servedUrls.length,
    local_entries: localLocs.length,
    served_sha256_raw: servedHash,
    local_sha256_raw: localHash,
    served_sha256_normalised: servedHashNorm,
    local_sha256_normalised: localHashNorm,
    raw_identical: localHash !== null && servedHash === localHash,
    normalised_identical: localHashNorm !== null && servedHashNorm === localHashNorm,
    same_entry_set: servedUrls.length === localLocs.length && servedUrls.every((u) => localLocs.includes(u)),
    same_order: JSON.stringify(servedUrls) === JSON.stringify(localLocs),
    line_endings_differ: servedHash !== servedHashNorm || (localHash !== null && localHash !== localHashNorm),
    note:
      localHashNorm !== null && servedHashNorm !== localHashNorm
        ? 'served sitemap content differs from the local file after normalising line endings'
        : 'served sitemap matches the local file once line endings are normalised',
  };
  console.log(
    `  sitemap.xml: HTTP ${sm.status}, served ${servedUrls.length} entries` +
      (localHash
        ? `, local ${localLocs.length}, same set: ${report.sitemap.same_entry_set}, normalised match: ${report.sitemap.normalised_identical}`
        : ''),
  );

  // ---- URL set ----------------------------------------------------------
  let targets = args.source === 'governed' ? [] : servedUrls.slice();
  if (args.source === 'governed') {
    console.error('  --source governed is not implemented: the 532-vs-568 reconciliation is not written down yet.');
    return EXIT.FAIL;
  }
  for (const p of args.extra.split(',').map((s) => s.trim()).filter(Boolean)) {
    const abs = /^https?:\/\//i.test(p) ? p : join(args.base, p);
    if (!targets.includes(abs)) targets.push(abs);
    report.extra.push(abs);
  }
  if (args.limit > 0) targets = targets.slice(0, args.limit);
  console.log(`  probing ${targets.length} URLs with concurrency ${args.concurrency}`);

  // ---- the probe --------------------------------------------------------
  const measured = await runPool(targets, args.concurrency, async (url) => {
    const r = await httpsGetStatus(url, { timeoutMs: args.timeoutMs });
    return { url, status: r.status, ms: r.ms, finalUrl: r.finalUrl, error: r.error };
  });

  const tally = {};
  for (const m of measured) {
    const key = m.status === 0 ? 'transport_error' : `${Math.floor(m.status / 100)}xx`;
    tally[key] = (tally[key] || 0) + 1;
  }
  const bad = measured.filter((m) => m.status === 0 || m.status >= 400);
  const redirected = measured.filter((m) => m.status >= 300 && m.status < 400);
  report.counts = { total: measured.length, ...tally };
  report.failures = bad.map((b) => ({ url: b.url, status: b.status, error: b.error }));
  report.slowest = measured
    .slice()
    .sort((a, b) => b.ms - a.ms)
    .slice(0, 10)
    .map((m) => ({ url: m.url, ms: m.ms, status: m.status }));
  if (redirected.length) {
    report.samples.redirects = redirected.slice(0, 20).map((m) => ({ url: m.url, status: m.status, to: m.finalUrl }));
  }
  report.redirected = redirected.length;
  report.finished_at = new Date().toISOString();

  console.log('\n  --- summary ---');
  console.log(`  total: ${measured.length}  ok(2xx/3xx): ${measured.length - bad.length}  failures: ${bad.length}`);
  for (const [k, v] of Object.entries(tally)) console.log(`   ${k}: ${v}`);
  if (redirected.length) console.log(`   redirects followed: ${redirected.length}`);
  if (report.slowest.length) {
    const s = report.slowest[0];
    console.log(`   slowest: ${s.ms}ms  HTTP ${s.status}  ${s.url}`);
  }
  for (const f of report.failures.slice(0, 40)) {
    console.log(`   FAIL ${f.status || 'ERR'} ${f.error || ''} ${f.url}`);
  }
  if (report.failures.length > 40) console.log(`   ... ${report.failures.length - 40} more`);

  const guardFail =
    robots.status !== 200 || !declaresSitemap || sm.status !== 200 || servedUrls.length === 0;
  const verdict = bad.length === 0 && !guardFail ? 'PASS' : 'FAIL';
  report.verdict = verdict;
  console.log(`\n  VERDICT: ${verdict}  (robots ${robots.status}, sitemap ${sm.status}/${servedUrls.length}, failures ${bad.length})`);

  if (args.json) {
    const target = path.isAbsolute(args.json) ? args.json : path.join(ROOT, args.json);
    await fs.mkdir(path.dirname(target), { recursive: true });
    await fs.writeFile(target, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
    console.log(`  report written: ${path.relative(ROOT, target)}`);
  }

  return verdict === 'PASS' ? EXIT.OK : EXIT.FAIL;
}

/** httpsGetStatus already carries the decoded body; nothing else to fetch. */
function textOf(result) {
  return result.status === 0 ? '' : result.body || '';
}

main()
  .then((code) => process.exit(code))
  .catch((err) => {
    console.error(`prod-smoke crashed: ${err.stack || err.message}`);
    process.exit(EXIT.FAIL);
  });
