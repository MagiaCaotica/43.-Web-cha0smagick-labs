#!/usr/bin/env node
/**
 * CLS SHIFT PROBE — identifies WHICH nodes actually move, by measurement.
 *
 * WHY THIS EXISTS
 * The Lighthouse audit recorded a large desktop-only CLS (0.78–1.24 against a
 * 0.1 threshold) while mobile measured exactly 0.000. A prior hypothesis blamed
 * the exit-intent popup. That hypothesis is FALSIFIED by reading the code:
 *   - `js/conversion.js` `CONFIG.popupDelayMs` is 30000, and `buildPopup()` is
 *     only reachable from `showPopup()`, which is only reachable from a
 *     trigger. A Lighthouse run never reaches 30s, so the popup is never built.
 *   - Even if it were built, the host keeps `style="display:none"` and the
 *     injected stylesheet declares `#exit-intent-popup { display: none; }` plus
 *     `.cm-popup-overlay { position: fixed; inset: 0; }` — so it could not add
 *     document height anyway.
 * This script therefore measures instead of inspecting. It installs a
 * `layout-shift` PerformanceObserver BEFORE navigation (buffered) and reports,
 * per shift, the identity and geometry of the nodes that moved.
 *
 * It measures only. It asserts nothing about the site's correctness and it
 * changes nothing. Its exit code reports whether the measurement ran:
 *   0 = probe ran, report produced
 *   1 = probe failed (bad args, Chrome missing, navigation failed)
 *   2 = inconclusive (ran but observed no layout-shift entries at all)
 *
 * Usage:
 *   node scripts/analytics/cls-shift-probe.mjs
 *   node scripts/analytics/cls-shift-probe.mjs --viewport desktop --wait 15000
 *   node scripts/analytics/cls-shift-probe.mjs --url http://localhost:8080/ --json out.json
 */

import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..', '..');
const requireFromRoot = createRequire(path.join(ROOT, 'package.json'));

const DEFAULT_URL = 'https://cha0smagicklabs.com';
const NAV_TIMEOUT_MS = 45_000;
const CHROME_ARGS = [
  '--no-sandbox',
  '--disable-dev-shm-usage',
  '--disable-gpu',
  '--no-zygote',
  '--disable-software-rasterizer',
];
// Lighthouse's own presets, so the numbers are comparable with the audit run.
const VIEWPORTS = {
  desktop: { width: 1350, height: 940, deviceScaleFactor: 1, isMobile: false },
  mobile: { width: 412, height: 823, deviceScaleFactor: 1.75, isMobile: true },
};
const EXIT = { OK: 0, FAIL: 1, INCONCLUSIVE: 2 };

/** @param {string[]} argv */
function parseArgs(argv) {
  const out = {
    url: DEFAULT_URL, viewport: 'desktop', wait: 12_000, json: null, block: [], help: false,
  };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--url' && argv[i + 1]) { out.url = String(argv[i + 1]); i += 1; }
    else if (arg === '--viewport' && argv[i + 1]) { out.viewport = String(argv[i + 1]).toLowerCase(); i += 1; }
    else if (arg === '--wait' && argv[i + 1]) { out.wait = Number(argv[i + 1]); i += 1; }
    else if (arg === '--json' && argv[i + 1]) { out.json = String(argv[i + 1]); i += 1; }
    else if (arg === '--block' && argv[i + 1]) {
      out.block = String(argv[i + 1]).split(',').map((s) => s.trim()).filter(Boolean);
      i += 1;
    } else if (arg === '--help' || arg === '-h') { out.help = true; }
  }
  return out;
}

const USAGE = `CLS SHIFT PROBE — reports which DOM nodes cause layout shift.

  --url <url>        page to measure (default ${DEFAULT_URL})
  --viewport <name>  desktop | mobile (default desktop)
  --wait <ms>        settle time after load before reading the buffer (default 12000)
  --block <list>     comma-separated URL substrings to abort, for ablation runs
                     (e.g. --block fonts.gstatic.com,/css/style.css)
  --json <path>      also write the full report to this file
  -h, --help         this text

Ablation discipline: a blocked run only means something next to a control run
of the same command without --block. Blocked requests can shift timing, so a
single pair is evidence, not proof.

Exit codes: 0 probe ran · 1 probe failed · 2 no layout-shift entries observed`;

/**
 * Page-side source, injected before any document script via CDP
 * `Page.addScriptToEvaluateOnNewDocument`. It must be fully self-contained:
 * it is stringified into the page, so it cannot close over anything in Node.
 *
 * Puppeteer 25 no longer exposes `Page.evaluateOnNewDocument`, and a plain
 * `page.evaluate` after load would miss every shift that already happened.
 * CDP is the only way to observe from the first byte of the document.
 */
const PROBE_SOURCE = `(() => {
  const r2 = (n) => Math.round(n * 100) / 100;
  const describe = (node) => {
    if (!node || !node.tagName) return { where: 'unknown (no node)', path: 'none', ownText: '', inDom: false };
    const sel = (el) => {
      if (!el || !el.tagName) return 'none';
      const tag = String(el.tagName).toLowerCase();
      const rawCls = typeof el.className === 'string' ? el.className.trim() : '';
      const cls = rawCls ? '.' + rawCls.split(/\\s+/).slice(0, 3).join('.') : '';
      return tag + (el.id ? '#' + el.id : '') + cls;
    };
    // Bare <li> nodes are indistinguishable without their ancestry, and an
    // unclassed <li> is exactly the shape a symptom like this arrives in.
    const path = [];
    for (let el = node, depth = 0; el && el.tagName && depth < 5; el = el.parentElement, depth += 1) {
      path.push(sel(el));
    }
    return {
      where: sel(node),
      path: path.join(' < '),
      ownText: (node.textContent || '').trim().replace(/\\s+/g, ' ').slice(0, 70),
      inDom: node.isConnected === true,
    };
  };
  const rect = (r) => (r ? { x: r2(r.x), y: r2(r.y), w: r2(r.width), h: r2(r.height) } : null);
  window.__clsEntries = [];
  try {
    const po = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        window.__clsEntries.push({
          value: entry.value,
          startTime: Math.round(entry.startTime),
          hadRecentInput: entry.hadRecentInput === true,
          // clientWidth drops below innerWidth exactly when a classic
          // scrollbar appears, which re-wraps text and inflates line boxes.
          vw: window.innerWidth,
          cw: document.documentElement.clientWidth,
          sources: (entry.sources || []).map((s) => ({
            node: describe(s.node),
            previousRect: rect(s.previousRect),
            currentRect: rect(s.currentRect),
          })),
        });
      }
    });
    po.observe({ type: 'layout-shift', buffered: true });
    window.__clsObserverInstalled = true;
  } catch (err) {
    window.__clsObserverError = String((err && err.message) || err);
  }
})();`;

/** Rounds to two decimals so the report stays readable. Node-side twin of
 *  the identical helper inside PROBE_SOURCE. */
function r2(n) { return Math.round(n * 100) / 100; }

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) { console.log(USAGE); return EXIT.OK; }

  const viewport = VIEWPORTS[args.viewport];
  if (!viewport) {
    console.error(`FAIL: unknown --viewport "${args.viewport}" (expected desktop or mobile)`);
    return EXIT.FAIL;
  }

  let puppeteer;
  try {
    puppeteer = requireFromRoot('puppeteer');
  } catch (err) {
    console.error(`FAIL: cannot resolve puppeteer from the repo root — ${err.message}`);
    return EXIT.FAIL;
  }

  let browser;
  try {
    browser = await puppeteer.launch({ headless: true, args: CHROME_ARGS, timeout: 60_000 });
  } catch (err) {
    console.error(`FAIL: could not launch Chrome — ${err.message}`);
    return EXIT.FAIL;
  }

  let status = 0;
  let report = null;
  try {
    const page = await browser.newPage();
    await page.setViewport(viewport);

    const blockedHits = [];
    if (args.block.length) {
      await page.setRequestInterception(true);
      page.on('request', (req) => {
        const hit = args.block.find((frag) => req.url().includes(frag));
        if (hit) { blockedHits.push(req.url()); req.abort().catch(() => {}); } else { req.continue().catch(() => {}); }
      });
    }

    // Must be installed before the document starts, or early shifts are lost.
    const client = await page.createCDPSession();
    await client.send('Page.enable');
    await client.send('Page.addScriptToEvaluateOnNewDocument', { source: PROBE_SOURCE });

    const response = await page.goto(args.url, { waitUntil: 'load', timeout: NAV_TIMEOUT_MS });
    const httpStatus = response ? response.status() : null;
    await new Promise((r) => setTimeout(r, args.wait));

    const observed = await page.evaluate(() => ({
      installed: window.__clsObserverInstalled === true,
      observerError: window.__clsObserverError || null,
      entries: window.__clsEntries || [],
      scrollHeight: document.documentElement.scrollHeight,
      innerWidth: window.innerWidth,
    }));

    // Layout shifts that follow real user input are excluded by the spec.
    const counted = observed.entries.filter((e) => !e.hadRecentInput);
    const total = counted.reduce((acc, e) => acc + e.value, 0);
    const ranked = counted
      .map((e) => ({ ...e, value: r2(e.value) }))
      .sort((a, b) => b.value - a.value);

    report = {
      probe: 'cls-shift-probe',
      generated_at: new Date().toISOString(),
      url: args.url,
      http_status: httpStatus,
      viewport: args.viewport,
      viewport_px: { width: viewport.width, height: viewport.height },
      settle_ms: args.wait,
      blocked_patterns: args.block,
      blocked_request_count: blockedHits.length,
      blocked_sample: blockedHits.slice(0, 8),
      observer_installed: observed.installed,
      observer_error: observed.observerError,
      total_cls: r2(total),
      threshold_cls: 0.1,
      verdict: total <= 0.1 ? 'pass' : 'fail',
      entry_count: counted.length,
      document_scroll_height: observed.scrollHeight,
      shifts: ranked.map((e) => ({
        value: e.value,
        at_ms: e.startTime,
        inner_width: e.vw,
        client_width: e.cw,
        scrollbar_present: typeof e.vw === 'number' && typeof e.cw === 'number' ? e.vw > e.cw : null,
        nodes: e.sources.map((s) => ({
          selector: s.node.where,
          ancestry: s.node.path,
          own_text: s.node.ownText,
          in_dom_at_read_time: s.node.inDom,
          from: s.previousRect,
          to: s.currentRect,
        })),
      })),
    };

    if (!observed.installed) {
      console.error(`FAIL: the layout-shift PerformanceObserver was not installed. Page reported: ${observed.observerError || 'no error, but the injection never ran'}`);
      return EXIT.FAIL;
    }
    if (observed.entries.length === 0) {
      report.verdict = 'inconclusive';
      report.note = 'No layout-shift entries were observed. Either the page is stable or this Chrome build does not report them; the probe cannot distinguish those two cases.';
      console.log(JSON.stringify(report, null, 2));
      return EXIT.INCONCLUSIVE;
    }

    console.log(JSON.stringify(report, null, 2));
    status = EXIT.OK;
  } catch (err) {
    console.error(`FAIL: ${err && err.message ? err.message : err}`);
    return EXIT.FAIL;
  } finally {
    await browser.close().catch(() => {});
  }

  if (args.json) {
    const target = path.isAbsolute(args.json) ? args.json : path.join(ROOT, args.json);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
    console.error(`\nWrote ${target}`);
  }
  return status;
}

main()
  .then((code) => { process.exitCode = code; })
  .catch((err) => { console.error(err); process.exitCode = EXIT.FAIL; });
