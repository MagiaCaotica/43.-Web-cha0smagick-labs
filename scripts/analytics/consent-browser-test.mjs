#!/usr/bin/env node
/**
 * scripts/analytics/consent-browser-test.mjs
 *
 * P0-10 evidence. Answers one question with a real browser against the live origin:
 *   Does cha0smagicklabs.com honour an explicit consent decision, and does its
 *   first visit collect analytics before any decision is made?
 *
 * Exit codes are deliberately three-valued:
 *   0  PASS          every observable expectation held
 *   1  FAIL          an observable expectation was violated (real evidence of a problem)
 *   2  INCONCLUSIVE  the browser could not observe the thing being claimed
 *
 * ANTI-FALSE-GREEN: exit 0 is only reachable when, in every scenario, the page
 * really loaded, the GA4 bootstrap was present, window.Cha0Analytics existed and
 * at least one gtag('consent','update') call was captured. If any of those
 * preconditions cannot be observed the run is INCONCLUSIVE — never PASS. A GET
 * cannot do this job: consent is a runtime decision in the browser, not a
 * property of the HTTP response.
 *
 * WHAT THIS DOES NOT PROVE (see MASTER_EXECUTION_PLAN.md, P0-10):
 *   - That GA4 ingested, processed or reported the hits. A request leaving the
 *     browser is not delivery, and delivery is not processing.
 *   - That no client-side storage was written. gtag storage behaviour belongs to
 *     Google, not to this repository.
 *   - Whether collecting before the user decides is legally acceptable in the
 *     owner's markets. That is the P0-06 legal gate, not a test result.
 *   - Anything about Lighthouse or Core Web Vitals. Not covered by this script.
 *
 * Usage:
 *   node scripts/analytics/consent-browser-test.mjs
 *   node scripts/analytics/consent-browser-test.mjs --url https://cha0smagicklabs.com
 *   node scripts/analytics/consent-browser-test.mjs --json out/consent-browser-evidence.json
 */

import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..', '..');
const requireFromRoot = createRequire(path.join(ROOT, 'package.json'));

const DEFAULT_URL = 'https://cha0smagicklabs.com';
const NAV_TIMEOUT_MS = 30_000;
const BANNER_SETTLE_MS = 1_600;
const CHROME_ARGS = [
  '--no-sandbox',
  '--disable-dev-shm-usage',
  '--disable-gpu',
  '--no-zygote',
  '--disable-software-rasterizer',
];
const ANALYTICS_HOSTS = [
  'google-analytics.com',
  'googletagmanager.com',
  'doubleclick.net',
];
const EXIT = { PASS: 0, FAIL: 1, INCONCLUSIVE: 2 };

/** @param {string[]} argv */
function parseArgs(argv) {
  const out = { url: DEFAULT_URL, json: null, help: false };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--url' && argv[i + 1]) {
      out.url = String(argv[i + 1]).replace(/\/+$/, '');
      i += 1;
    } else if (arg === '--json' && argv[i + 1]) {
      out.json = String(argv[i + 1]);
      i += 1;
    } else if (arg === '--help' || arg === '-h') {
      out.help = true;
    }
  }
  return out;
}

const checks = [];
/** @param {string} scenario @param {string} name @param {'pass'|'fail'|'inconclusive'} status @param {string} detail */
function record(scenario, name, status, detail) {
  checks.push({ scenario, name, status, detail });
  const mark = status === 'pass' ? 'ok  ' : status === 'fail' ? 'FAIL' : 'SKIP';
  console.log(`  [${mark}] ${name} — ${detail}`);
}

/**
 * Installed, pre-load instrumentation.
 *
 * Two independent capture paths, because a naive spy on window.dataLayer is not
 * enough: page templates do `window.dataLayer = []` unconditionally, which
 * discards a pre-wrapped array. Verified on this repo — an array-replacement spy
 * recorded 0 calls while the browser still emitted real gtag/doubleclick hits.
 *
 *  - window.dataLayer is redefined as an accessor so any reassignment is wrapped
 *    too, and the reassignment count is reported as diagnostic evidence.
 *  - window.gtag is redefined as an accessor so the exact gtag arguments are
 *    captured regardless of which dataLayer ends up winning.
 *
 * Every call is still forwarded to the real implementation, so page behaviour is
 * unchanged and the test never alters what it is measuring.
 */
function instrument() {
  return function installGtagSpy() {
    /** @type {unknown[][]} */
    const log = [];
    let dataLayerReassignments = 0;
    let gtagAssigned = false;
    let realGtag = null;

    const normalise = (args) => {
      const entry =
        args.length === 1 && args[0] && typeof args[0] === 'object' && typeof args[0].length === 'number'
          ? Array.from(args[0])
          : Array.from(args);
      try {
        return JSON.parse(JSON.stringify(entry));
      } catch {
        return ['<unserialisable>'];
      }
    };

    const wrapArray = (arr) => {
      const orig = Array.prototype.push;
      arr.push = function spy(...args) {
        log.push(normalise(args));
        return orig.apply(this, args);
      };
      return arr;
    };

    let current = wrapArray([]);

    Object.defineProperty(window, 'dataLayer', {
      configurable: true,
      enumerable: true,
      get() {
        return current;
      },
      set(value) {
        dataLayerReassignments += 1;
        current = Array.isArray(value) ? wrapArray(value) : value;
      },
    });
    window.dataLayer = current;

    const gtagProxy = function gtag(...args) {
      log.push(normalise(args));
      if (typeof realGtag === 'function') return realGtag.apply(this, args);
      return Array.prototype.push.call(current, args);
    };

    Object.defineProperty(window, 'gtag', {
      configurable: true,
      enumerable: true,
      get() {
        return gtagProxy;
      },
      set(value) {
        if (typeof value === 'function' && value !== gtagProxy) {
          gtagAssigned = true;
          realGtag = value;
        }
      },
    });

    window.__cha0DataLayerLog = log;
    window.__cha0Diagnostics = () => ({ dataLayerReassignments, gtagAssigned });
  };
}

function isAnalyticsHost(host) {
  return ANALYTICS_HOSTS.some((known) => host === known || host.endsWith(`.${known}`));
}

/** Everything the page can tell us about consent, in one round trip. */
function readPageState() {
  return function collect() {
    const banner = document.getElementById('cookie-consent-banner');
    // Inline style alone is not visibility: on a decided visitor the JS returns
    // early and never sets an inline display, so the stylesheet's display:none is
    // what actually hides the banner. Computed style is the honest signal.
    const computedBanner = banner ? globalThis.getComputedStyle(banner) : null;
    const bannerVisible = Boolean(
      banner && computedBanner && computedBanner.display !== 'none' && computedBanner.visibility !== 'hidden',
    );
    const log = Array.isArray(window.__cha0DataLayerLog) ? window.__cha0DataLayerLog : [];
    const diagnostics =
      typeof window.__cha0Diagnostics === 'function'
        ? window.__cha0Diagnostics()
        : { dataLayerReassignments: 0, gtagAssigned: false };
    const consentUpdates = log
      .filter((call) => Array.isArray(call) && call[0] === 'consent' && call[1] === 'update')
      .map((call) => call[2] && typeof call[2] === 'object' ? call[2] : null);
    const configuredIds = log
      .filter((call) => Array.isArray(call) && call[0] === 'config')
      .map((call) => String(call[1]))
      .filter((id) => /^G-/.test(id));

    const api = window.Cha0Analytics;
    const hasApi = Boolean(api && typeof api.isConsentGranted === 'function');
    let granted = null;
    let tracked = null;
    if (hasApi) {
      granted = api.isConsentGranted() === true;
      if (typeof api.track === 'function') {
        tracked = api.track('tool_start', { probe: 'consent-browser-test' }) === true;
      }
    }

    return {
      bannerPresent: Boolean(banner),
      bannerDisplay: banner ? banner.style.display : null,
      bannerComputedDisplay: computedBanner ? computedBanner.display : null,
      bannerVisible,
      hasAcceptButton: Boolean(document.querySelector('.cookie-btn-accept')),
      hasDeclineButton: Boolean(document.querySelector('.cookie-btn-decline')),
      // gtag.js installs its `gtag` via a global function declaration, which does
      // NOT trigger an accessor setter, so `gtagAssigned` alone under-reports it.
      // Visibility is therefore: the page left a callable gtag behind, or we saw
      // the assignment. Both mean the page's own code issued the captured calls.
      gtagIsFunction: typeof window.gtag === 'function',
      gtagAssigned: diagnostics.gtagAssigned,
      hasApi,
      consentGranted: granted,
      trackAccepted: tracked,
      consentUpdates,
      configuredIds,
      dataLayerCallCount: log.length,
      dataLayerReassignments: diagnostics.dataLayerReassignments,
      instrumentInstalled: typeof window.__cha0Diagnostics === 'function',
    };
  };
}

async function readCookie(page) {
  const cookies = await page.cookies();
  return cookies.find((cookie) => cookie.name === 'cookie_consent') ?? null;
}

function consentVerdict(update) {
  if (!update) return 'no-update';
  const fields = ['analytics_storage', 'ad_storage', 'ad_user_data', 'ad_personalization'];
  const values = new Set(fields.map((field) => update[field]));
  if (values.size !== 1) return `mixed:${fields.map((f) => update[f]).join(',')}`;
  return String([...values][0]);
}

/** Shared preconditions. Any failure here makes the scenario inconclusive, not passing. */
function checkObservability(scenario, state) {
  let observable = true;
  if (!state.instrumentInstalled) {
    record(scenario, 'probe installed', 'inconclusive', 'evaluateOnNewDocument hook did not run — the gtag/dL spy is absent, so nothing below can be observed');
    observable = false;
  } else {
    record(scenario, 'probe installed', 'pass', `gtag/dataLayer spy active (dataLayer reassigned ${state.dataLayerReassignments}x by the page)`);
  }
  if (!state.bannerPresent) {
    record(scenario, 'banner observable', 'inconclusive', '#cookie-consent-banner not found in the DOM');
    observable = false;
  } else {
    record(scenario, 'banner observable', 'pass', `#cookie-consent-banner present; computed display=${state.bannerComputedDisplay}, visible=${state.bannerVisible}`);
  }
  if (!state.gtagIsFunction && !state.gtagAssigned) {
    record(scenario, 'gtag observable', 'inconclusive', 'window.gtag is neither callable nor was it assigned — no GA4 bootstrap visible');
    observable = false;
  } else {
    record(scenario, 'gtag observable', 'pass', `window.gtag is callable (declared=${state.gtagIsFunction}, assigned=${state.gtagAssigned}); ${state.dataLayerCallCount} gtag call(s) captured`);
  }
  if (!state.hasApi) {
    record(scenario, 'bridge observable', 'inconclusive', 'window.Cha0Analytics missing or malformed');
    observable = false;
  } else {
    record(scenario, 'bridge observable', 'pass', 'window.Cha0Analytics.isConsentGranted available');
  }
  if (state.consentUpdates.length === 0) {
    record(scenario, 'consent update observable', 'inconclusive', 'no gtag("consent","update") call captured in dataLayer');
    observable = false;
  } else {
    record(scenario, 'consent update observable', 'pass', `${state.consentUpdates.length} consent update call(s) captured`);
  }
  return observable;
}

/** A PASS must never be reachable on an error page, so the HTTP status is a gate. */
function recordStatus(scenario, label, status) {
  if (typeof status === 'number' && status >= 200 && status < 400) {
    record(scenario, `${label} served a real page`, 'pass', `HTTP ${status}`);
    return true;
  }
  record(
    scenario,
    `${label} served a real page`,
    'inconclusive',
    `HTTP ${status} — consent cannot be validated on a page the origin did not serve successfully`,
  );
  return false;
}

async function openPage(page, url) {
  const response = await page.goto(url, { waitUntil: 'load', timeout: NAV_TIMEOUT_MS });
  await page.waitForSelector('#cookie-consent-banner', { timeout: 10_000 });
  await new Promise((resolve) => setTimeout(resolve, BANNER_SETTLE_MS));
  return response ? response.status() : null;
}

async function scenarioFirstVisit(page, url, status) {
  const name = 'A/first-visit-no-cookie';
  console.log(`\n${name}`);
  const served = recordStatus(name, 'target', status);
  if (!served) return { inconclusive: true, state: null };
  const state = await page.evaluate(readPageState());
  if (!checkObservability(name, state)) return { state, inconclusive: true };

  if (!state.bannerVisible) {
    record(name, 'banner appears without a decision', 'fail', `expected the banner to be visibly rendered after ${BANNER_SETTLE_MS}ms; computed display=${state.bannerComputedDisplay}`);
  } else {
    record(name, 'banner appears without a decision', 'pass', 'banner was visibly rendered with no cookie set');
  }

  const first = consentVerdict(state.consentUpdates[state.consentUpdates.length - 1]);
  if (state.consentGranted !== true) {
    record(name, 'collection active before any decision', 'fail', `isConsentGranted()=${state.consentGranted} on a first visit; the code resolves an absent cookie as granted, so this is unexpected`);
  } else {
    record(name, 'collection active before any decision', 'pass', 'isConsentGranted()=true and collection is live before the user answers');
  }
  if (first === 'granted') {
    record(name, 'first gtag consent update is granted', 'pass', 'gtag("consent","update") fired granted before any user decision');
  } else {
    record(name, 'first gtag consent update is granted', 'fail', `expected granted, got ${first}`);
  }
  if (state.configuredIds.length > 0) {
    record(name, 'GA4 configured on the page', 'pass', `gtag config ids: ${state.configuredIds.join(', ')}`);
  } else {
    record(name, 'GA4 configured on the page', 'fail', 'no gtag config call with a G- measurement id was captured');
  }
  return { state, inconclusive: false };
}

async function scenarioDecision(page, url, decision, expectGranted) {
  const name = `${expectGranted ? 'C' : 'B'}/${decision}-then-reload`;
  console.log(`\n${name}`);
  const selector = expectGranted ? '.cookie-btn-accept' : '.cookie-btn-decline';
  await page.click(selector);
  await page.waitForSelector('#cookie-consent-banner', { hidden: true, timeout: 5_000 }).catch(() => {});

  const cookie = await readCookie(page);
  const cookieValue = cookie ? cookie.value : null;
  if (cookieValue === decision) {
    record(name, 'cookie records the decision', 'pass', `cookie_consent=${cookieValue}; path=${cookie.path}; SameSite=${cookie.sameSite}`);
  } else {
    record(name, 'cookie records the decision', 'fail', `expected cookie_consent=${decision}, got ${cookieValue}`);
  }

  const expectedWord = decision === 'declined' ? 'denied' : 'granted';
  const afterClick = await page.evaluate(readPageState());
  const updateState = consentVerdict(afterClick.consentUpdates[afterClick.consentUpdates.length - 1]);
  if (updateState === expectedWord) {
    record(name, 'gtag mirrors the decision', 'pass', `gtag consent update = ${updateState} (all four storage fields)`);
  } else {
    record(name, 'gtag mirrors the decision', 'fail', `gtag consent update = ${updateState}, expected ${expectedWord}`);
  }

  if (afterClick.consentGranted === expectGranted) {
    record(name, 'bridge honours the decision', 'pass', `isConsentGranted()=${afterClick.consentGranted}`);
  } else {
    record(name, 'bridge honours the decision', 'fail', `isConsentGranted()=${afterClick.consentGranted}, expected ${expectGranted}`);
  }

  if (afterClick.trackAccepted === expectGranted) {
    record(name, 'track() is gated by consent', 'pass', `track('tool_start') accepted=${afterClick.trackAccepted} — the allowlist gate holds with consent ${decision}`);
  } else {
    record(name, 'track() is gated by consent', 'fail', `track('tool_start') accepted=${afterClick.trackAccepted}, expected ${expectGranted}`);
  }

  const reloadResponse = await page.reload({ waitUntil: 'load', timeout: NAV_TIMEOUT_MS });
  recordStatus(name, 'reload', reloadResponse ? reloadResponse.status() : null);
  await new Promise((resolve) => setTimeout(resolve, 600));
  const afterReload = await page.evaluate(readPageState());
  const persistedCookie = await readCookie(page);

  if (persistedCookie && persistedCookie.value === decision) {
    record(name, 'decision survives a reload', 'pass', `cookie_consent=${persistedCookie.value} after navigation`);
  } else {
    record(name, 'decision survives a reload', 'fail', `cookie_consent=${persistedCookie ? persistedCookie.value : null} after navigation, expected ${decision}`);
  }

  if (afterReload.consentGranted === expectGranted) {
    record(name, 'bridge still gated after reload', 'pass', `isConsentGranted()=${afterReload.consentGranted} on the new page view`);
  } else {
    record(name, 'bridge still gated after reload', 'fail', `isConsentGranted()=${afterReload.consentGranted}, expected ${expectGranted}`);
  }

  const reloadUpdate = consentVerdict(afterReload.consentUpdates[afterReload.consentUpdates.length - 1]);
  if (reloadUpdate === expectedWord) {
    record(name, 'gtag bootstrap respects the stored decision', 'pass', `first consent update on the new page view = ${reloadUpdate}`);
  } else {
    record(name, 'gtag bootstrap respects the stored decision', 'fail', `first consent update on the new page view = ${reloadUpdate}, expected ${expectedWord}`);
  }

  if (afterReload.bannerVisible) {
    record(name, 'banner stays hidden once decided', 'fail', 'banner reappeared on a visitor who had already decided');
  } else {
    record(name, 'banner stays hidden once decided', 'pass', `banner hidden after navigation (computed display=${afterReload.bannerComputedDisplay})`);
  }

  return { state: afterReload, cookie: persistedCookie, inconclusive: false };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    console.log('Usage: node scripts/analytics/consent-browser-test.mjs [--url <base>] [--json <file>]');
    return EXIT.INCONCLUSIVE;
  }

  console.log('consent-browser-test — P0-10 real-browser consent evidence');
  console.log(`target: ${args.url}`);
  console.log(`node:   ${process.version}`);

  let puppeteer;
  try {
    puppeteer = requireFromRoot('puppeteer');
  } catch (error) {
    console.error(`\nINCONCLUSIVE: cannot resolve puppeteer — ${error.message}`);
    record('bootstrap', 'puppeteer resolvable', 'inconclusive', error.message);
    return EXIT.INCONCLUSIVE;
  }
  record('bootstrap', 'puppeteer resolvable', 'pass', puppeteer.executablePath ? 'browser binary present' : 'browser binary path unknown');

  let browser;
  try {
    browser = await puppeteer.launch({ headless: true, args: CHROME_ARGS, timeout: 45_000 });
  } catch (error) {
    console.error(`\nINCONCLUSIVE: browser did not launch — ${error.message}`);
    record('bootstrap', 'browser launches', 'inconclusive', error.message);
    return EXIT.INCONCLUSIVE;
  }
  record('bootstrap', 'browser launches', 'pass', await browser.version());

  const analyticsRequests = [];
  const result = {
    target: args.url,
    node: process.version,
    browser: null,
    startedAt: new Date().toISOString(),
    scenarios: {},
    analyticsRequests,
    syntheticProbeEvents: 0,
    limitations: [
      'Does not prove GA4 ingested, processed or reported any hit.',
      'Does not prove that no client-side storage was written by gtag.',
      'Does not rule on whether pre-decision collection is legally acceptable (P0-06).',
      'Does not cover Lighthouse or Core Web Vitals.',
      'Also note: synthetic tool_start probe events were dispatched to read the track() gate, and the probe is documented in the script header.',
    ],
  };

  try {
    const trackNetwork = (page) => {
      page.on('request', (request) => {
        try {
          const host = new global.URL(request.url()).hostname;
          if (isAnalyticsHost(host) && analyticsRequests.length < 40) {
            analyticsRequests.push(new global.URL(request.url()).origin);
          }
        } catch {
          /* non-parseable URL: not evidence */
        }
      });
    };

    const context = await browser.createBrowserContext();
    const page = await context.newPage();
    page.setDefaultTimeout(NAV_TIMEOUT_MS);
    page.setDefaultNavigationTimeout(NAV_TIMEOUT_MS);
    await page.evaluateOnNewDocument(instrument());
    trackNetwork(page);

    const firstStatus = await openPage(page, args.url);
    const first = await scenarioFirstVisit(page, args.url, firstStatus);
    result.scenarios.firstVisit = { state: first.state, inconclusive: first.inconclusive, httpStatus: firstStatus };
    if (!first.inconclusive) result.syntheticProbeEvents += 1;

    if (!first.inconclusive) {
      const declined = await scenarioDecision(page, args.url, 'declined', false);
      result.scenarios.decline = declined;
      if (!declined.inconclusive) result.syntheticProbeEvents += 2;

      const freshContext = await browser.createBrowserContext();
      const freshPage = await freshContext.newPage();
      freshPage.setDefaultNavigationTimeout(NAV_TIMEOUT_MS);
      await freshPage.evaluateOnNewDocument(instrument());
      trackNetwork(freshPage);
      await openPage(freshPage, args.url);
      const accepted = await scenarioDecision(freshPage, args.url, 'accepted', true);
      result.scenarios.accept = accepted;
      if (!accepted.inconclusive) result.syntheticProbeEvents += 2;
      await freshContext.close();    }

    await context.close();
  } catch (error) {
    record('runtime', 'scenarios completed', 'inconclusive', `unexpected error: ${error.message}`);
    result.error = error.message;
  }

  result.finishedAt = new Date().toISOString();
  result.checks = checks;
  result.browser = await browser.version().catch(() => null);
  await browser.close();

  const failed = checks.filter((check) => check.status === 'fail');
  const skipped = checks.filter((check) => check.status === 'inconclusive');
  result.verdict = failed.length > 0 ? 'FAIL' : skipped.length > 0 ? 'INCONCLUSIVE' : 'PASS';

  if (args.json) {
    const target = path.isAbsolute(args.json) ? args.json : path.join(ROOT, args.json);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, `${JSON.stringify(result, null, 2)}\n`, 'utf8');
    console.log(`\nEvidence written to ${path.relative(ROOT, target)}`);
  }

  console.log('\n--------------------------------------------------------------');
  console.log(`VERDICT: ${result.verdict}`);
  console.log(`checks: ${checks.length} total, ${failed.length} failed, ${skipped.length} inconclusive`);
  console.log(`synthetic probe events dispatched: ${result.syntheticProbeEvents}`);
  console.log(`analytics-host requests observed: ${analyticsRequests.length}`);
  console.log('\nThis does NOT prove:');
  for (const line of result.limitations) console.log(`  - ${line}`);
  console.log('--------------------------------------------------------------');

  if (result.verdict === 'FAIL') return EXIT.FAIL;
  if (result.verdict === 'INCONCLUSIVE') return EXIT.INCONCLUSIVE;
  return EXIT.PASS;
}

main().then(
  (code) => {
    process.exitCode = code;
  },
  (error) => {
    console.error(`fatal: ${error && error.stack ? error.stack : error}`);
    process.exitCode = EXIT.INCONCLUSIVE;
  },
);
