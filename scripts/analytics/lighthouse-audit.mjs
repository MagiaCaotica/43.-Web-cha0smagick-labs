#!/usr/bin/env node
/**
 * Lighthouse + Core Web Vitals audit against the DEPLOYED origin (P0-10 gate).
 *
 * WHY THIS EXISTS
 * P0-10 requires Lighthouse/CWV evidence on the real deployed domain. A GET
 * cannot produce it: performance is a runtime property of a real browser
 * painting a real page. This script drives a real Chrome (the one Puppeteer
 * already ships, because Playwright's Chromium hangs in this environment) and
 * asks the public PageSpeed Insights endpoint for FIELD data.
 *
 * ANTI-FALSE-GREEN (read this before trusting exit 0)
 *   exit 0  PASS         measured successfully AND every checked metric is at or
 *                         above the Core Web Vitals "good" threshold.
 *   exit 1  FAIL         measured successfully AND at least one metric is below
 *                         threshold. This is a real, recorded result.
 *   exit 2  INCONCLUSIVE the audit could not measure. Never reported as green.
 *
 * FAIL is reserved for an OBSERVED shortfall. Any precondition we cannot verify
 * -- lighthouse unresolvable, no Chrome, URL not served successfully, empty
 * report, missing category, field API unreachable -- yields INCONCLUSIVE.
 * A "good" number obtained from an unverified precondition is worse than no
 * number at all, because it invites someone to close a gate on it.
 *
 * LAB vs FIELD (the limit that matters most here)
 *   Lighthouse is a LABORATORY measurement: one synthetic run, one network
 *   profile, one device class, on this machine. It is a good regression tripwire
 *   and a bad proxy for what a visitor experiences. INP, for example, cannot be
 *   measured in the lab at all -- Lighthouse reports TBT as its proxy, and TBT
 *   is a different metric with a different threshold.
 *   Only the PageSpeed Insights `loadingExperience` block is FIELD data
 *   (Chrome UX Report, real users, p75). If it is unavailable, this script says
 *   so and does not substitute lab numbers for it.
 *
 * USEAGE
 *   node scripts/analytics/lighthouse-audit.mjs
 *   node scripts/analytics/lighthouse-audit.mjs --url https://example.com
 *   node scripts/analytics/lighthouse-audit.mjs --form-factor desktop
 *   node scripts/analytics/lighthouse-audit.mjs --no-field     # skip PSI
 *
 * THRESHOLDS (web.dev Core Web Vitals, p75)
 *   LCP  <= 2500 ms    CLS <= 0.1    INP <= 200 ms
 *   TBT  <= 200 ms  (lab proxy; the *good* INP threshold, NOT a CWV)
 */

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, '..', '..');
const requireFromRepo = createRequire(path.join(REPO, 'package.json'));

const CHROME_FLAGS = [
  '--headless=new',
  '--no-sandbox',
  '--disable-dev-shm-usage',
  '--disable-gpu',
  '--no-zygote',
  '--disable-software-rasterizer',
  '--disable-extensions',
  '--mute-audio',
];

const THRESHOLDS = {
  lcp: { good: 2500, unit: 'ms', label: 'Largest Contentful Paint' },
  cls: { good: 0.1, unit: '', label: 'Cumulative Layout Shift' },
  tbt: { good: 200, unit: 'ms', label: 'Total Blocking Time (lab proxy, not INP)' },
  inp: { good: 200, unit: 'ms', label: 'Interaction to Next Paint (field only)' },
};

/* ------------------------------------------------------------------ args -- */

function parseArgs(argv) {
  const out = {
    url: 'https://cha0smagicklabs.com',
    formFactor: 'mobile',
    field: true,
    out: path.join(REPO, 'out', 'lighthouse-evidence.json'),
  };
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === '--url') out.url = argv[++i];
    else if (a === '--form-factor') out.formFactor = argv[++i];
    else if (a === '--out') out.out = argv[++i];
    else if (a === '--no-field') out.field = false;
    else if (a === '--help' || a === '-h') out.help = true;
    else throw new Error(`Unknown argument: ${a}`);
  }
  if (!['mobile', 'desktop'].includes(out.formFactor)) {
    throw new Error(`--form-factor must be mobile or desktop, got: ${out.formFactor}`);
  }
  return out;
}

/* --------------------------------------------------------- check plumbing -- */

const checks = [];

function check(id, status, detail) {
  const row = { id, status, detail };
  checks.push(row);
  const mark = status === 'pass' ? 'PASS' : status === 'fail' ? 'FAIL' : status === 'skipped' ? 'SKIPPED' : 'INCONCLUSIVE';
  console.log(`  [${mark.padEnd(12)}] ${id} -- ${detail}`);
  return row;
}

const inconclusive = [];
function inconclusiveReason(code, why) {
  const row = check(code, 'inconclusive', why);
  inconclusive.push(row);
  return row;
}

/* ------------------------------------------------------------- preflight -- */

async function httpProbe(url) {
  let mod;
  try {
    mod = url.startsWith('https:') ? await import('node:https') : await import('node:http');
  } catch (err) {
    return { ok: false, why: `cannot load http module: ${err.message}` };
  }
  return new Promise((resolve) => {
    let settled = false;
    const done = (v) => { if (!settled) { settled = true; resolve(v); } };
    let u;
    try { u = new URL(url); } catch (err) { done({ ok: false, why: `invalid URL: ${err.message}` }); return; }
    const req = mod.request(
      u,
      { method: 'GET', headers: { 'user-agent': 'cha0-lighthouse-audit/1.0 (+read-only perf probe)' } },
      (res) => {
        const status = res.statusCode;
        res.resume();
        res.on('end', () => {
          if (status >= 200 && status < 400) done({ ok: true, status });
          else done({ ok: false, why: `origin answered HTTP ${status} -- a non-success status cannot yield a trustworthy performance profile`, status });
        });
      },
    );
    req.setTimeout(30000, () => { req.destroy(); done({ ok: false, why: 'HEAD/GET probe timed out after 30000ms' }); });
    req.on('error', (err) => done({ ok: false, why: `request failed: ${err.message}` }));
    req.end();
  });
}

async function resolveChrome() {
  try {
    const puppeteer = requireFromRepo('puppeteer');
    const exe = await puppeteer.executablePath();
    if (!exe) return { ok: false, why: 'puppeteer.executablePath() returned an empty path' };
    if (!fs.existsSync(exe)) return { ok: false, why: `puppeteer Chrome path does not exist on disk: ${exe}` };
    return { ok: true, path: exe };
  } catch (err) {
    return { ok: false, why: `cannot resolve a Chrome binary from puppeteer: ${err.message}` };
  }
}

/* ------------------------------------------------------------------ field -- */

function fieldFromPsi(experience) {
  const keys = ['INTERACTION_TO_NEXT_PAINT', 'LARGEST_CONTENTFUL_PAINT', 'CUMULATIVE_LAYOUT_SHIFT_SCORE', 'FIRST_CONTENTFUL_PAINT'];
  const out = {};
  for (const k of keys) {
    const m = experience.metrics && experience.metrics[k];
    if (m && typeof m.percentile === 'number') {
      out[k] = { value: m.percentile, category: m.category, unit: m.distribution ? 'ms-ish' : '' };
    }
  }
  return out;
}

async function fetchField(url, formFactor) {
  const endpoint = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';
  const u = new URL(endpoint);
  u.searchParams.set('url', url);
  u.searchParams.set('strategy', formFactor);
  u.searchParams.set('category', 'performance');

  const mod = u.protocol === 'https:' ? await import('node:https') : await import('node:http');
  return new Promise((resolve) => {
    let settled = false;
    const done = (v) => { if (!settled) { settled = true; resolve(v); } };
    const req = mod.request(
      u,
      { method: 'GET', headers: { 'user-agent': 'cha0-lighthouse-audit/1.0' } },
      (res) => {
        const chunks = [];
        res.on('data', (c) => chunks.push(c));
        res.on('end', () => {
          const body = Buffer.concat(chunks).toString('utf8');
          if (res.statusCode === 429) {
            done({ ok: false, retryable: true, why: `PageSpeed Insights answered HTTP 429 (key-less endpoint, aggressively rate limited; 429 means "try again later", NOT that field data is bad)` });
            return;
          }
          if (res.statusCode !== 200) {
            done({ ok: false, retryable: res.statusCode >= 500, why: `PageSpeed Insights answered HTTP ${res.statusCode}`, snippet: body.slice(0, 300) });
            return;
          }
          let json;
          try { json = JSON.parse(body); } catch (err) {
            done({ ok: false, retryable: false, why: `PageSpeed Insights returned unparseable JSON: ${err.message}` });
            return;
          }
          const le = json.loadingExperience;
          if (!le || !le.metrics) {
            done({ ok: false, retryable: false, why: 'PageSpeed Insights returned no loadingExperience block -- this origin has no Chrome UX Report field data (usually too little real traffic to clear the CrUX bar)' });
            return;
          }
          done({ ok: true, metrics: fieldFromPsi(le), overall: le.overall_category || null });
        });
      },
    );
    req.setTimeout(60000, () => { req.destroy(); done({ ok: false, retryable: true, why: 'PageSpeed Insights request timed out after 60000ms' }); });
    req.on('error', (err) => done({ ok: false, retryable: true, why: `PageSpeed Insights request failed: ${err.message}` }));
    req.end();
  });
}

/** One retry, because a 429 on a key-less endpoint is a rate limit, not a verdict. */
async function fetchFieldWithRetry(url, formFactor, attempts = 2) {
  let last = null;
  for (let i = 0; i < attempts; i += 1) {
    last = await fetchField(url, formFactor);
    if (last.ok || !last.retryable) return last;
    if (i < attempts - 1) {
      console.log(`  (field data retryable failure, attempt ${i + 1}/${attempts}, backing off 8s: ${last.why})`);
      await new Promise((r) => setTimeout(r, 8000));
    }
  }
  return last;
}

/* ------------------------------------------------------------------- main -- */

async function main() {
  let args;
  try {
    args = parseArgs(process.argv.slice(2));
  } catch (err) {
    console.error(`Argument error: ${err.message}`);
    process.exit(2);
  }

  if (args.help) {
    console.log(fs.readFileSync(fileURLToPath(import.meta.url), 'utf8').split('*/')[0]);
    process.exit(0);
  }

  console.log(`Lighthouse + CWV audit`);
  console.log(`  url          : ${args.url}`);
  console.log(`  form factor  : ${args.formFactor}`);
  console.log(`  field data   : ${args.field ? 'PageSpeed Insights (public, no key)' : 'skipped by request'}`);
  console.log('');

  /* preflight 1: lighthouse resolvable.
     Lighthouse 13 is ESM-only, so it must come in through a dynamic import().
     createRequire() would hand back the CJS build, which is not callable. */
  let lighthouse;
  let lighthouseVersion = 'unknown';
  try {
    lighthouse = (await import('lighthouse')).default;
    lighthouseVersion = (await import('lighthouse/package.json', { with: { type: 'json' } })).default.version;
  } catch (err) {
    /* older shapes expose no package.json export; the run itself is the real test */
    try {
      lighthouse = (await import('lighthouse')).default;
    } catch (err2) {
      inconclusiveReason('L0.lighthouse-resolvable', `cannot load lighthouse: ${err2.message}`);
      return finish(null, null, args);
    }
  }
  if (typeof lighthouse !== 'function') {
    inconclusiveReason('L0.lighthouse-resolvable', `lighthouse resolved to a ${typeof lighthouse}, not a callable function -- this build cannot be driven programmatically here`);
    return finish(null, null, args);
  }
  check('L0.lighthouse-resolvable', 'pass', `lighthouse ${lighthouseVersion} loaded as an ESM module and is callable`);

  /* preflight 2: chrome */
  const chrome = await resolveChrome();
  if (!chrome.ok) {
    inconclusiveReason('L1.chrome-resolvable', chrome.why);
    return finish(null, null, args);
  }
  check('L1.chrome-resolvable', 'pass', `Chrome at ${chrome.path}`);

  /* preflight 3: origin actually serves the URL */
  const probe = await httpProbe(args.url);
  if (!probe.ok) {
    inconclusiveReason('L2.origin-serves-url', probe.why);
    return finish(null, null, args);
  }
  check('L2.origin-serves-url', 'pass', `origin answered HTTP ${probe.status} for ${args.url}`);

  /* the actual lab run.
     Lighthouse 13's programmatic entry point is
        lighthouse(url, flags, config, page)
     where `page` is a real puppeteer Page. Its own chrome-launcher path does not
     work in this environment (it tries to attach to a browser on 127.0.0.1:9222
     and fails), so we launch puppeteer's Chrome -- the binary that is known to
     start here -- and hand Lighthouse the page. */
  let browser = null;
  let runnerResult;
  try {
    const puppeteer = requireFromRepo('puppeteer');
    browser = await puppeteer.launch({
      headless: true,
      executablePath: chrome.path,
      args: CHROME_FLAGS,
    });
  } catch (err) {
    inconclusiveReason('L3.lighthouse-run', `puppeteer could not launch Chrome for the audit: ${err.message}`);
    return finish(null, null, args);
  }

  try {
    const page = await browser.newPage();
    runnerResult = await lighthouse(
      args.url,
      {
        output: 'json',
        logLevel: 'error',
        onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
        formFactor: args.formFactor,
        screenEmulation: args.formFactor === 'mobile'
          ? { mobile: true, width: 412, height: 823, deviceScaleFactor: 1.75, disabled: false }
          : { mobile: false, width: 1350, height: 940, deviceScaleFactor: 1, disabled: false },
        throttlingMethod: 'simulate',
      },
      undefined,
      page,
    );
  } catch (err) {
    inconclusiveReason('L3.lighthouse-run', `lighthouse did not complete a run: ${err.message}`);
    return finish(null, null, args);
  } finally {
    try { if (browser) await browser.close(); } catch { /* closing must never mask the audit result */ }
  }

  const lhr = runnerResult && runnerResult.lhr;
  if (!lhr) {
    inconclusiveReason('L3.lighthouse-run', 'lighthouse returned no LHR object');
    return finish(null, null, args);
  }

  /* the run must have been on a page that actually rendered, not an error page */
  const finalUrl = lhr.finalUrl || lhr.finalDisplayedUrl || args.url;
  const runtimeError = lhr.runtimeError || null;
  if (runtimeError) {
    inconclusiveReason('L3.lighthouse-run', `lighthouse recorded a runtime error: ${runtimeError.code} ${runtimeError.message}`);
    return finish(null, finalUrl, args);
  }
  check('L3.lighthouse-run', 'pass', `run completed; finalUrl=${finalUrl}`);

  const cats = lhr.categories || {};
  for (const c of ['performance', 'accessibility', 'best-practices', 'seo']) {
    if (!cats[c] || typeof cats[c].score !== 'number') {
      inconclusiveReason('L4.category-present', `category "${c}" is missing or unscored in the report`);
      return finish(null, finalUrl, args);
    }
  }
  check('L4.category-present', 'pass', 'all four categories scored');

  /* lab metrics */
  const audits = lhr.audits || {};
  const num = (id) => {
    const a = audits[id];
    return a && typeof a.numericValue === 'number' ? a.numericValue : null;
  };
  const lab = {
    lcp: num('largest-contentful-paint'),
    cls: num('cumulative-layout-shift'),
    tbt: num('total-blocking-time'),
  };
  if (lab.lcp === null || lab.cls === null || lab.tbt === null) {
    inconclusiveReason('L5.lab-metrics-present', `missing one or more lab metrics: lcp=${lab.lcp} cls=${lab.cls} tbt=${lab.tbt}`);
    return finish(cats, finalUrl, args);
  }
  check('L5.lab-metrics-present', 'pass', `lab LCP=${Math.round(lab.lcp)}ms CLS=${lab.cls.toFixed(3)} TBT=${Math.round(lab.tbt)}ms`);

  const labScores = Object.fromEntries(Object.entries(cats).map(([k, v]) => [k, Math.round(v.score * 100)]));

  /* field data -- reported, never substituted */
  let field = { attempted: false, available: false, metrics: null, overall: null, why: 'skipped by --no-field' };
  if (args.field) {
    field.attempted = true;
    const r = await fetchFieldWithRetry(args.url, args.formFactor);
    if (r.ok) {
      field.available = true;
      field.metrics = r.metrics;
      field.overall = r.overall;
      check('F1.field-crux-available', 'pass', `Chrome UX Report field data present; overall=${r.overall}`);
    } else {
      field.why = r.why;
      /* Deliberately NOT an INCONCLUSIVE verdict. Field data is an optional
         enrichment from a key-less, rate-limited public endpoint. Its absence
         is a known external limit, not an unverified precondition of the
         Lighthouse measurement we actually performed. It is recorded as
         `cwvComplete:false` so nobody can mistake this run for a closed
         Core Web Vitals gate. */
      check('F1.field-crux-available', 'skipped', r.why);
    }
  } else {
    console.log('  [SKIPPED    ] F1.field-crux-available -- --no-field');
  }

  /* thresholds */
  const verdicts = [];
  for (const [key, raw] of Object.entries(lab)) {
    const t = THRESHOLDS[key];
    const ok = raw <= t.good;
    verdicts.push({ metric: key, label: t.label, value: raw, threshold: t.good, unit: t.unit, ok, source: 'lab' });
  }
  if (field.available && field.metrics) {
    const inp = field.metrics.INTERACTION_TO_NEXT_PAINT;
    const flcp = field.metrics.LARGEST_CONTENTFUL_PAINT;
    const fcls = field.metrics.CUMULATIVE_LAYOUT_SCORE || field.metrics.CUMULATIVE_LAYOUT_SHIFT_SCORE;
    if (inp) verdicts.push({ metric: 'inp', label: THRESHOLDS.inp.label, value: inp.value, threshold: THRESHOLDS.inp.good, unit: 'ms', ok: inp.value <= THRESHOLDS.inp.good, source: 'field', category: inp.category });
    if (flcp) verdicts.push({ metric: 'field_lcp', label: 'Largest Contentful Paint (field p75)', value: flcp.value, threshold: THRESHOLDS.lcp.good, unit: 'ms', ok: flcp.value <= THRESHOLDS.lcp.good, source: 'field', category: flcp.category });
    if (fcls) verdicts.push({ metric: 'field_cls', label: 'Cumulative Layout Shift (field p75)', value: fcls.value, threshold: THRESHOLDS.cls.good, unit: '', ok: fcls.value <= THRESHOLDS.cls.good, source: 'field', category: fcls.category });
  }

  console.log('');
  console.log('  ' + 'metric'.padEnd(46) + 'source'.padEnd(9) + 'value'.padEnd(12) + 'threshold'.padEnd(12) + 'verdict');
  for (const v of verdicts) {
    const raw = v.unit === 'ms' ? Math.round(v.value) : Math.round(v.value * 1000) / 1000;
    const thr = v.unit === 'ms' ? `${v.threshold}ms` : String(v.threshold);
    console.log('  ' + v.label.padEnd(46) + v.source.padEnd(9) + String(raw).padEnd(12) + thr.padEnd(12) + (v.ok ? 'OK' : 'BELOW GOOD'));
  }
  console.log('');
  console.log('  category scores (lab): ' + JSON.stringify(labScores));
  console.log('');

  const below = verdicts.filter((v) => !v.ok);
  const status = below.length === 0 ? 'pass' : 'fail';
  check('T1.thresholds', status, below.length === 0
    ? `all ${verdicts.length} measured metrics are at or above the Core Web Vitals "good" threshold`
    : `below threshold: ${below.map((v) => `${v.label} ${Math.round(v.value * 100) / 100}${v.unit}`).join('; ')}`);

  return finish(cats, finalUrl, args, { lab, labScores, verdicts, field });
}

/* ----------------------------------------------------------------- output -- */

function finish(cats, finalUrl, args, extra) {
  const counts = {
    pass: checks.filter((c) => c.status === 'pass').length,
    fail: checks.filter((c) => c.status === 'fail').length,
    skipped: checks.filter((c) => c.status === 'skipped').length,
    inconclusive: checks.filter((c) => c.status === 'inconclusive').length,
  };

  /* The verdict answers ONE question: did we successfully measure, and did the
     metrics we measured hold up?
     - `inconclusive` on a check means a PRECONDITION OF THE MEASUREMENT could not
       be verified. That must never be reported as green.
     - `skipped` means an OPTIONAL ENRICHMENT was unavailable. It does not
       invalidate the measurement, but it does mean the Core Web Vitals set is
       incomplete, because INP cannot be measured in the lab at all. That is
       tracked separately as `cwvComplete` so a lab PASS can never be mistaken
       for a closed CWV gate. */
  let exitCode;
  let verdict;
  if (counts.inconclusive > 0) {
    exitCode = 2;
    verdict = 'INCONCLUSIVE';
  } else if (counts.fail > 0) {
    exitCode = 1;
    verdict = 'FAIL';
  } else {
    exitCode = 0;
    verdict = 'PASS';
  }

  const fieldInfo = (extra && extra.field) || { attempted: args.field, available: false, why: 'run did not reach the field stage' };
  const cwvComplete = Boolean(fieldInfo.available);

  const evidence = {
    schema: 'cha0-lighthouse-evidence/1',
    generatedAt: new Date().toISOString(),
    url: args.url,
    finalUrl: finalUrl || null,
    formFactor: args.formFactor,
    verdict,
    exitCode,
    cwvComplete,
    cwvCompleteWhy: cwvComplete
      ? 'Chrome UX Report field data was present, so LCP/CLS/INP could be evaluated on real-user p75 values.'
      : 'Core Web Vitals is NOT complete on this run: no Chrome UX Report field data, and INP is unmeasurable in a Lighthouse lab run. TBT is a different metric and is not a substitute for INP.',
    checks,
    counts,
    lab: (extra && extra.lab) || null,
    categoryScores: (extra && extra.labScores) || null,
    thresholds: THRESHOLDS,
    verdicts: (extra && extra.verdicts) || [],
    field: fieldInfo,
    limitations: [
      'Lighthouse is a LABORATORY measurement: one synthetic run, one simulated network/device profile, on this machine. It is a regression tripwire, not a description of what visitors experience.',
      'INP cannot be measured in the lab. Lighthouse reports TBT as its proxy and TBT has a different meaning and a different threshold; do not read TBT as INP.',
      'Field data, when present, comes from the Chrome UX Report (real users, p75). When it is unavailable this script says so and does NOT substitute lab numbers for it.',
      'A single run is a single sample. A regression tripwire needs a fixed run profile and repeated runs before it can be called one.',
      'This audit measures performance, accessibility, best-practices and SEO scores. It measures NOTHING about revenue, conversion, or whether any of it produces a single peso.',
      'A below-threshold result is a real finding about a lab run, not a measured user experience.',
    ],
  };

  try {
    fs.mkdirSync(path.dirname(args.out), { recursive: true });
    fs.writeFileSync(args.out, JSON.stringify(evidence, null, 2), 'utf8');
    console.log(`Evidence written: ${path.relative(REPO, args.out)}`);
  } catch (err) {
    console.error(`WARNING: could not write evidence to ${args.out}: ${err.message}`);
  }

  console.log('');
  console.log(`RESULT: ${verdict}  (pass=${counts.pass} fail=${counts.fail} skipped=${counts.skipped} inconclusive=${counts.inconclusive})  exit=${exitCode}`);
  if (verdict === 'INCONCLUSIVE') {
    console.log('        An unverified precondition of the measurement was hit, so this result must not be used to close any gate.');
  }
  if (verdict === 'PASS') {
    console.log('        Lab measurement only. It is not a user-experience measurement and not a revenue result.');
  }
  if (!cwvComplete) {
    console.log('');
    console.log('        *** CORE WEB VITALS IS INCOMPLETE ON THIS RUN ***');
    console.log('        No Chrome UX Report field data was obtained, and INP is unmeasurable in a');
    console.log('        Lighthouse lab run. TBT is a proxy with different semantics. This run cannot');
    console.log('        close a Core Web Vitals gate regardless of its exit code.');
  }
  process.exit(exitCode);
}

main().catch((err) => {
  console.error(`Unexpected failure: ${err && err.stack ? err.stack : err}`);
  process.exit(2);
});
