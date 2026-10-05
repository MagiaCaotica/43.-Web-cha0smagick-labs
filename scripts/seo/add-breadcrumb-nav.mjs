/**
 * add-breadcrumb-nav.mjs — P3.2a
 *
 * 88 pages ship a BreadcrumbList JSON-LD but render no breadcrumb trail. The
 * house stylesheet already defines .breadcrumb / .breadcrumb-list (13 rules in
 * css/style.css and style.min.css), so the markup can simply be added.
 *
 * IMPORTANT — why this is not a "schema already visible, just unclassed" fix:
 * an earlier probe concluded 81/88 already exposed the labels as visible text.
 * That was a FALSE POSITIVE: it matched "Home" in the page's *main navigation*,
 * not a breadcrumb. `tools/iching.html` was used as the supposed reference and
 * it has no `<nav class="breadcrumb">` either. So all 88 genuinely lack one.
 *
 * Rule: insert immediately before the first `<main`, else before `</body>`.
 * Only the last crumb is plain text with aria-current="page"; the rest link.
 * Paths are rewritten relative to the file's own depth (the site convention is
 * relative links, e.g. `../index.html`).
 *
 * Idempotent: a page already containing `class="breadcrumb"` is skipped.
 *
 *   node scripts/seo/add-breadcrumb-nav.mjs            # dry run
 *   node scripts/seo/add-breadcrumb-nav.mjs --write
 *   node scripts/seo/add-breadcrumb-nav.mjs --json
 */
import fs from 'node:fs';
import path from 'node:path';

const SITE = 'https://cha0smagicklabs.com';
const ROOT = path.resolve('.').replace(/\\/g, '/');
const WRITE = process.argv.includes('--write');
const JSON_OUT = process.argv.includes('--json');
const SKIP = /(^|[\\/])(node_modules|\.git|\.github|vendor|projects|auto-shorts|\.omo)([\\/]|$)/i;

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const files = [];
(function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (SKIP.test(p)) continue;
    if (e.isDirectory()) walk(p);
    else if (e.isFile() && e.name.endsWith('.html')) files.push(p);
  }
})(ROOT);

/** Absolute site path -> relative href from the page's own directory. */
function relativeHref(absUrl, fileRel) {
  let u;
  try {
    u = new URL(absUrl);
  } catch {
    return null;
  }
  if (!/^https?:$/.test(u.protocol)) return null;
  let target = u.pathname;
  if (target.endsWith('/')) target += 'index.html';
  const fromDir = path.posix.dirname('/' + fileRel);
  const rel = path.posix.relative(fromDir, target);
  if (rel === '') return null; // same page -> not a link
  return rel.startsWith('.') ? rel : './' + rel;
}

/** Pull every BreadcrumbList out of the page's ld+json blocks. */
function breadcrumbs(html) {
  const out = [];
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi)) {
    let j;
    try {
      j = JSON.parse(m[1]);
    } catch {
      continue;
    }
    for (const o of Array.isArray(j) ? j : j['@graph'] || [j]) {
      if (o && o['@type'] === 'BreadcrumbList' && Array.isArray(o.itemListElement)) {
        out.push(
          o.itemListElement
            .map((it) => ({
              name: String(it.name ?? '').trim(),
              item: typeof it.item === 'string' ? it.item : (it.item && it.item['@id']) || '',
            }))
            .filter((it) => it.name)
        );
      }
    }
  }
  return out;
}

function buildNav(crumbs, fileRel) {
  const items = crumbs
    .map((c, i) => {
      const last = i === crumbs.length - 1;
      const href = last ? null : relativeHref(c.item, fileRel);
      // If a middle crumb has no usable href, degrade it to text rather than
      // emitting a broken or empty link.
      const inner = esc(c.name);
      return last || !href
        ? `            <li aria-current="page">${inner}</li>`
        : `            <li><a href="${esc(href)}">${inner}</a></li>`;
    })
    .join('\n');
  return [
    '<nav class="breadcrumb" aria-label="Breadcrumb">',
    '        <ol class="breadcrumb-list">',
    items,
    '        </ol>',
    '    </nav>',
  ].join('\n');
}

const report = [];
let changed = 0;
let already = 0;
let noCrumbs = 0;
const crumbs = [];

for (const abs of files) {
  const rel = abs.replace(/\\/g, '/').slice(ROOT.length + 1);
  const html = fs.readFileSync(abs, 'utf8');

  const bc = breadcrumbs(html);
  if (!bc.length) {
    noCrumbs++;
    continue;
  }
  // Guard MUST use substring semantics on any element's class/id, not
  // \bbreadcrumb\b on <nav>. The house stylesheet ships
  //   .breadcrumb, .breadcrumb-nav, .breadcrumb-list
  // so `class="breadcrumbs"`, `class="breadcrumb-nav"` and `id="breadcrumb"`
  // are all already-rendered trails. A narrower guard reported 649 insertions
  // where only ~88 are real, i.e. it would have duplicated a breadcrumb onto
  // ~560 pages that already have one.
  if (/<[a-z][^>]*\b(?:class|id)\s*=\s*["'][^"']*breadcrumb/i.test(html)) {
    already++;
    continue;
  }
  // Pick the richest trail (most crumbs) if a page declares several.
  const best = bc.sort((a, b) => b.length - a.length)[0];
  crumbs.push({ file: rel, n: best.length });

  const nav = buildNav(best, rel);
  const at = html.search(/<main\b/i);
  const out = at !== -1
    ? html.slice(0, at) + nav + '\n\n    ' + html.slice(at)
    : html.replace(/<\/body>/i, nav + '\n</body>');

  report.push({ file: rel, crumbs: best.length });
  if (out !== html) changed++;
  if (WRITE) fs.writeFileSync(abs, out, 'utf8');
}

const byArea = {};
for (const c of crumbs) {
  const a = c.file.includes('/') ? c.file.split('/')[0] : '(root)';
  byArea[a] = (byArea[a] || 0) + 1;
}

if (JSON_OUT) {
  console.log(JSON.stringify({ changed, already, noCrumbs, byArea, files: report.map((r) => r.file) }, null, 2));
} else {
  console.log(`${WRITE ? 'APPLIED' : 'DRY RUN'}  ${changed} breadcrumbs to insert`);
  console.log(`already present: ${already}   no BreadcrumbList schema: ${noCrumbs}`);
  console.log('by area:', JSON.stringify(byArea));
  if (!WRITE && report.length) {
    console.log('\nfirst 12:');
    report.slice(0, 12).forEach((r) => console.log(`  ${r.crumbs} crumbs  ${r.file}`));
    const long = crumbs.filter((c) => c.n > 4);
    console.log(`\ntrails longer than 4 crumbs: ${long.length}`);
    long.slice(0, 10).forEach((c) => console.log(`  ${c.n}  ${c.file}`));
  }
}
