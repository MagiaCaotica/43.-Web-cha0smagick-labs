#!/usr/bin/env node
/**
 * insert-consent-default.mjs — add a Consent Mode default to HTML files that
 * lack one.
 *
 * WHY
 * 608 of 622 HTML files never call gtag('consent','default',...). In Consent
 * Mode, when that call is absent, GA4 assumes granted. The site therefore
 * announced no default and then, via the opt-out rule, sent granted on most
 * visits. The owner decided (D1) to invert to opt-in: nothing is granted until
 * the visitor accepts.
 *
 * WHAT IT INSERTS
 * A self-contained block that does NOT require gtag to exist beforehand and
 * does NOT redefine it if it does. Copying the canonical 13-file block verbatim
 * would emit a second `function gtag(){}` declaration in the 482 files that
 * already have one, and would throw a ReferenceError in files that have
 * `gtag/js` without a local definition. This form pushes to dataLayer before
 * gtag/js arrives, which is what Consent Mode requires, and is a no-op where
 * the page already defines gtag.
 *
 * IDEMPOTENCE
 * A file that already contains `gtag('consent', 'default'` is skipped, counted
 * separately, and never touched. Re-running the script changes nothing.
 *
 * DRY RUN BY DEFAULT
 * --apply is required to write. The report always prints what would change.
 *
 * EXIT 0 clean run (including dry run) · 1 invariant violation
 */
import fs from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();
const SKIP_DIRS = new Set([
  'node_modules', '.git', 'out', 'dist', '.omo', 'test-results', '.cache', '.next',
]);
const MEASUREMENT_ID = 'G-V6LHCPN9TK';

const argv = process.argv.slice(2);
const APPLY = argv.includes('--apply');
const JSON_OUT = (() => {
  const i = argv.indexOf('--json');
  return i >= 0 ? argv[i + 1] : '';
})();

async function* walk(dir) {
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name) || entry.name.startsWith('.') === false) {
        if (!SKIP_DIRS.has(entry.name)) yield* walk(path.join(dir, entry.name));
      }
      continue;
    }
    if (!entry.name.toLowerCase().endsWith('.html')) continue;
    yield path.join(dir, entry.name);
  }
}

const CONSENT_DEFAULT = /gtag\(\s*['"]consent['"]\s*,\s*['"]default['"]/i;
// A consent call with NO command. `gtag('consent', {...})` is not a valid
// Consent Mode command -- the valid ones are default, update, wait_for_update
// -- so these files announce a consent state that GA4 never receives as a
// default. 31 files do this. They must lose the malformed call, otherwise the
// correct default inserted below would sit next to a broken one.
const CONSENT_NO_COMMAND = /gtag\(\s*['"]consent['"]\s*,\s*\{[^}]*\}\s*\)\s*;?/gi;
const HAS_HEAD = /<head[^>]*>/i;
const HAS_GTAG_JS = /googletagmanager\.com\/gtag\/js\?id=/i;
const HAS_CARRIER = /(conversion|shared|analytics-bridge)\.js|conversion\.min\.js|shared\.min\.js|analytics-bridge\.min\.js/i;

function buildBlock(indent) {
  return [
    `${indent}<!-- Consent Mode default: nothing is granted until the visitor accepts.`,
    `${indent}     Self-contained and idempotent: safe whether or not gtag exists yet. -->`,
    `${indent}<script>`,
    `${indent}  window.dataLayer = window.dataLayer || [];`,
    `${indent}  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };`,
    `${indent}  window.gtag('consent', 'default', {`,
    `${indent}    analytics_storage: 'denied',`,
    `${indent}    ad_storage: 'denied',`,
    `${indent}    ad_user_data: 'denied',`,
    `${indent}    ad_personalization: 'denied',`,
    `${indent}    wait_for_update: 500`,
    `${indent}  });`,
    `${indent}</script>`,
  ].join('\n');
}

function insertInto(html) {
  const headMatch = html.match(HAS_HEAD);
  if (!headMatch) return { html: null, anchor: 'none', removedMalformed: 0 };

  // Drop any malformed command-less consent call first, so the real default
  // is the only consent state the page announces.
  let removedMalformed = 0;
  let working = html.replace(CONSENT_NO_COMMAND, () => {
    removedMalformed += 1;
    return '';
  });

  const headOpen = working.match(HAS_HEAD)[0];
  const at = working.indexOf(headOpen) + headOpen.length;
  const after = working.slice(at);
  const nl = after.startsWith('\r\n') ? '\r\n' : '\n';

  // Indentation of the first line inside <head>, so the block matches the file.
  const firstInner = after.match(/^[\r\n]+([ \t]*)\S/);
  const indent = firstInner ? firstInner[1] : '    ';

  return {
    anchor: 'head',
    removedMalformed,
    html: `${working.slice(0, at)}${nl}${buildBlock(indent)}${nl}${after}`,
  };
}

const report = {
  tool: 'insert-consent-default.mjs',
  mode: APPLY ? 'apply' : 'dry-run',
  measurement_id: MEASUREMENT_ID,
  scanned: 0,
  already_had_default: 0,
  malformed_removed: 0,
  changed: 0,
  unchanged: 0,
  no_head: [],
  inserted_with_gtag_js: 0,
  inserted_without_gtag_js: 0,
  no_analytics_carrier: [],
  files: [],
};

for await (const abs of walk(ROOT)) {
  report.scanned += 1;
  const rel = path.relative(ROOT, abs).split(path.sep).join('/');
  const html = await fs.readFile(abs, 'utf8');

  if (CONSENT_DEFAULT.test(html)) {
    report.already_had_default += 1;
    continue;
  }

  const rec = { file: rel };
  if (HAS_GTAG_JS.test(html)) rec.with_gtag_js = true;
  else rec.with_gtag_js = false;
  if (!HAS_CARRIER.test(html)) rec.no_carrier = true;

  const { html: next, anchor, removedMalformed } = insertInto(html);
  if (!next) {
    report.no_head.push(rel);
    report.unchanged += 1;
    report.files.push({ ...rec, action: 'skipped_no_head' });
    continue;
  }

  if (next === html) {
    report.unchanged += 1;
    continue;
  }

  report.changed += 1;
  report.malformed_removed += removedMalformed;
  rec.removed_malformed = removedMalformed;
  if (rec.with_gtag_js) report.inserted_with_gtag_js += 1;
  else report.inserted_without_gtag_js += 1;
  if (rec.no_carrier) report.no_analytics_carrier.push(rel);
  rec.action = APPLY ? 'inserted' : 'would_insert';
  report.files.push(rec);

  if (APPLY) await fs.writeFile(abs, next, 'utf8');
}

report.no_analytics_carrier_count = report.no_analytics_carrier.length;
delete report.no_analytics_carrier;
console.log(JSON.stringify({ ...report, files: report.files.slice(0, 5) }, null, 2));
console.log('---');
console.log(`scanned            ${report.scanned}`);
console.log(`already had default${String(report.already_had_default).padStart(4)}  (untouched)`);
console.log(`${APPLY ? 'inserted' : 'would insert'}  ${String(report.changed).padStart(4)}`);
console.log(`malformed consent calls removed${String(report.malformed_removed).padStart(4)}`);
console.log(`  of those, with gtag/js   ${report.inserted_with_gtag_js}`);
console.log(`  of those, without        ${report.inserted_without_gtag_js}`);
console.log(`no <head>          ${String(report.no_head.length).padStart(4)}  ${report.no_head.slice(0, 5).join(', ')}`);
console.log(`no analytics carrier${String(report.no_analytics_carrier_count).padStart(4)}  (inert insertion, review these)`);
console.log(`unchanged          ${String(report.unchanged).padStart(4)}`);

if (JSON_OUT) {
  await fs.writeFile(JSON_OUT, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  console.log(`report: ${JSON_OUT}`);
}
