#!/usr/bin/env node
/**
 * fix-async-css.mjs — one-shot migration: async-CSS anti-pattern -> blocking stylesheet.
 *
 * WHY (measured, not assumed):
 *   The async pattern
 *     <link rel="preload" href="H" as="style" onload="this.rel='stylesheet'">
 *     <noscript><link rel="stylesheet" href="H"></noscript>
 *   lets the browser FIRST-PAINT before the stylesheet is applied, then re-style
 *   and reflow the whole document. Measured with scripts/analytics/cls-shift-probe.mjs
 *   against http://127.0.0.1:8099 (cold cache, fresh Puppeteer profile per run):
 *     index.html                                  CLS 1.09  (8 entries) -> 0.000 (0 entries, 3/3 runs)
 *     blog/ai-machine-learning-paranormal-research CLS 0.11
 *     blog/all-24-elder-futhark-runes-complete-reference  CLS 0.26
 *     blog/am-i-haunted-or-is-it-pareidolia       CLS 0.26
 *   The `body` shift (y8 -> y0) is the UA default 8px margin being removed after
 *   first paint, which is the signature of "painted before CSS".
 *
 *   Threshold: CLS <= 0.1 (web.dev p75).
 *
 * TRANSFORM (exactly one variant exists in the repo, verified across 622 HTML files):
 *   <link rel="preload" href="H" as="style" onload="this.rel='stylesheet'">
 *   <noscript><link rel="stylesheet" href="H"></noscript>
 *     ->  <link rel="stylesheet" href="H">
 *
 * SCOPE GUARD: only the async <link> plus ITS OWN paired <noscript> (same href,
 * same block) is touched. A <noscript> that has no preceding async <link> is left
 * alone — those pages already have a real blocking <link> and their noscript is inert.
 *
 * USAGE:
 *   node scripts/fix-async-css.mjs            # dry run, prints plan, writes nothing
 *   node scripts/fix-async-css.mjs --apply    # apply
 *   node scripts/fix-async-css.mjs --json out.json
 *   Exit 0 = ok, 1 = error, 2 = nothing to do.
 */
import { readFile, writeFile } from 'node:fs/promises';
import { glob } from 'node:fs/promises';

const SKIP_DIRS = new Set(['node_modules', '.git', 'out', 'dist', '.omo', 'test-results', '.cache']);

// Matches: [indent]<link rel="preload" href="H" as="style" onload="this.rel='stylesheet'">
//          (whitespace, incl. newlines)
//          [indent]<noscript><link rel="stylesheet" href="H"></noscript>[trailing ws]
// H is captured once and the noscript must repeat the SAME href, so a noscript
// belonging to a different link can never be consumed by this.
const RE = new RegExp(
  String.raw`([ \t]*)<link rel="preload" href="([^"]+)" as="style" onload="this\.rel='stylesheet'">` +
    String.raw`\s*<noscript><link rel="stylesheet" href="\2"></noscript>([ \t]*\r?\n?)`,
  'g'
);

const apply = process.argv.includes('--apply');
const jsonIdx = process.argv.indexOf('--json');
const jsonPath = jsonIdx !== -1 ? process.argv[jsonIdx + 1] : null;

// node:fs/promises `glob` yields an AsyncIterator (not an array) in Node >= 22.
async function collectHtml(dir, acc = []) {
  for await (const e of glob(`${dir}/*`, { withFileTypes: true })) {
    if (e.isDirectory()) {
      if (SKIP_DIRS.has(e.name)) continue;
      await collectHtml(`${dir}/${e.name}`, acc);
    } else if (e.isFile() && e.name.toLowerCase().endsWith('.html')) {
      acc.push(`${dir}/${e.name}`);
    }
  }
  return acc;
}

async function main() {
  const files = (await collectHtml('.')).sort();
  const changed = [];
  const untouched = [];
  let totalReplacements = 0;

  for (const rel of files) {
    const path = rel.replace(/\\/g, '/').replace(/^\.\//, '');
    const original = await readFile(path, 'utf8');

    RE.lastIndex = 0;
    let hits = 0;
    const next = original.replace(RE, (_m, indent, href, tail) => {
      hits += 1;
      return `${indent}<link rel="stylesheet" href="${href}">${tail}`;
    });

    if (hits === 0) {
      untouched.push(path);
      continue;
    }
    totalReplacements += hits;

    // Safety invariants. A page may legitimately load several DIFFERENT
    // stylesheets (e.g. ../styles.css AND ../css/style.min.css), so the check is
    // "no href is loaded twice", not "exactly one link".
    // rel/href attribute ORDER varies across the repo, so match the whole tag then
    // pull href out, instead of assuming <link rel="stylesheet" href="...">.
    const leftoverPreload = /rel="preload"[^>]*as="style"/.test(next);
    const hrefs = [...next.matchAll(/<link\b[^>]*\brel="stylesheet"[^>]*>/g)]
      .map((m) => (m[0].match(/\bhref="([^"]+)"/) || [])[1])
      .filter(Boolean);
    const dupes = [...new Set(hrefs.filter((h, i) => hrefs.indexOf(h) !== i))];

    if (leftoverPreload) {
      throw new Error(`INVARIANT FAIL ${path}: preload-as-style still present after transform`);
    }
    if (dupes.length) {
      throw new Error(`INVARIANT FAIL ${path}: duplicate stylesheet href(s) ${dupes.join(', ')}`);
    }

    if (apply) await writeFile(path, next, 'utf8');
    changed.push({ path, replacements: hits });
  }

  const report = {
    apply,
    scanned_html_files: files.length,
    files_changed: changed.length,
    files_untouched: untouched.length,
    total_replacements: totalReplacements,
    changed,
  };

  console.log(JSON.stringify({ ...report, changed: changed.slice(0, 12), changed_truncated: changed.length > 12 }, null, 2));
  if (jsonPath) await writeFile(jsonPath, JSON.stringify(report, null, 2), 'utf8');

  if (changed.length === 0) {
    console.error('NOTHING TO DO: no async-CSS pattern found.');
    process.exit(2);
  }
  if (!apply) {
    console.error(`\nDRY RUN. Re-run with --apply to write ${changed.length} file(s).`);
  }
}

main().catch((err) => {
  console.error(`ERROR: ${err.message}`);
  process.exit(1);
});
