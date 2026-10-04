// scripts/seo/verify-final.mjs
// Independent verification of every SEO fix applied 2026-10-03.
// Read-only. Recomputes each metric from scratch instead of trusting the
// fix scripts' own counters, so a bug in a fixer cannot hide itself here.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const SITE = 'https://cha0smagicklabs.com';
const EXCLUDE = ['projects', 'node_modules', '.git', 'tools/auto-shorts'];

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory()) {
      if (EXCLUDE.some((x) => e.name === x)) continue;
      walk(path.join(dir, e.name), out);
    } else if (e.name.endsWith('.html')) out.push(path.join(dir, e.name));
  }
  return out;
}

const files = walk(ROOT);
const rel = (f) => path.relative(ROOT, f).split(path.sep).join('/');
const sitemapUrl = (r) =>
  r === 'index.html' ? `${SITE}/` : r.endsWith('/index.html') ? `${SITE}/${r.slice(0, -10)}` : `${SITE}/${r}`;

const m = {
  scanned: files.length,
  canonicalSelf: 0, canonicalOther: 0, canonicalNone: 0, canonicalDupes: 0,
  titleDupes: 0, titleBrandH1: 0, h1Missing: 0, h1Multiple: 0,
  descMissing: 0, descDupes: 0, authorMetaMissing: 0, dateModifiedMissing: 0,
  noindex: 0, doubleEncoded: 0, htmlUnbalanced: 0, bookExpand: 0, brokenRelLinks: 0,
  directoryHref: 0,
};
const titleCount = new Map();
const descCount = new Map();
const brokenSamples = [];

for (const f of files) {
  const r = rel(f);
  const h = fs.readFileSync(f, 'utf8');
  const base = path.basename(r);

  // canonical must point at this exact page
  const c = h.match(/<link[^>]+rel=["']canonical["'][^>]*href=["']([^"']+)["']/i);
  if (!c) m.canonicalNone++;
  else if (c[1].replace(/\/$/, '') === sitemapUrl(r).replace(/\/$/, '')) m.canonicalSelf++;
  else { m.canonicalOther++; if (m.canonicalOther <= 3) brokenSamples.push(`  canon ${r} -> ${c[1]}`); }

  // titles
  const t = h.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (t) {
    const raw = t[1].trim();
    titleCount.set(raw, (titleCount.get(raw) ?? 0) + 1);
    // the "X | X" pattern the old generator emitted
    const parts = raw.split('|').map((x) => x.trim().toLowerCase()).filter(Boolean);
    if (parts.length >= 2 && new Set(parts).size < parts.length) m.titleBrandH1++;
  }

  // h1
  const h1s = [...h.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)];
  if (h1s.length === 0) m.h1Missing++;
  if (h1s.length > 1) m.h1Multiple++;
  for (const x of h1s) {
    const txt = x[1].replace(/<[^>]+>/g, '').trim().toLowerCase();
    if (txt === 'cha0smagick labs') m.titleBrandH1++;
  }

  // description
  const d = h.match(/<meta[^>]+name=["']description["'][^>]*content=["']([\s\S]*?)["']/i);
  if (!d) m.descMissing++;
  else descCount.set(d[1].trim(), (descCount.get(d[1].trim()) ?? 0) + 1);

  if (!/<meta[^>]+name=["']author["']/i.test(h)) m.authorMetaMissing++;
  if (!/dateModified/i.test(h)) m.dateModifiedMissing++;
  if (/<meta[^>]+name=["']robots["'][^>]*noindex/i.test(h)) m.noindex++;
  if (/&amp;amp;/.test(h)) m.doubleEncoded++;
  if (/class="book-expand"/.test(h)) m.bookExpand++;

  // crude tag balance on the two containers we injected into
  const so = (h.match(/<section\b/g) ?? []).length;
  const sc = (h.match(/<\/section>/g) ?? []).length;
  const uo = (h.match(/<ul\b/g) ?? []).length;
  const uc = (h.match(/<\/ul>/g) ?? []).length;
  if (so !== sc || uo !== uc) m.htmlUnbalanced++;

  // relative links must resolve. Root-absolute hrefs ("/blog/", "/css/x.css")
  // resolve from the web root, not from the file's directory, so they must be
  // checked against ROOT or they all look broken.
  for (const a of h.matchAll(/href=["']([^"'#][^"']*)["']/gi)) {
    const href = a[1];
    if (/^(https?:|mailto:|tel:|javascript:|data:)/i.test(href)) continue;
    const clean = href.split('#')[0].split('?')[0];
    if (!clean) continue;
    const target = clean.startsWith('/')
      ? path.join(ROOT, clean.slice(1))
      : path.resolve(path.dirname(f), clean);
    const relToRoot = path.relative(ROOT, target).split(path.sep).join('/');
    if (!fs.existsSync(target) && !fs.existsSync(path.join(target, 'index.html'))) {
      m.brokenRelLinks++;
      if (brokenSamples.length <= 40) brokenSamples.push(`  link ${r} -> ${href}`);
    } else if (relToRoot.endsWith('/index.html')) {
      m.directoryHref++;
    }
  }
}

for (const [k, v] of titleCount) if (v > 1) m.titleDupes += v - 1;
for (const [k, v] of descCount) if (v > 1) m.descDupes += v - 1;

// sitemap
const sm = fs.readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf8');
const locs = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((x) => x[1].trim());
const smUniq = new Set(locs).size;
const publicPages = files.filter((f) => !rel(f).startsWith('projects/'));
const inSitemap = new Set(locs.map((u) => u.replace(/^https?:\/\/[^/]+/, '')));
const notInSitemap = publicPages.map(rel).filter((r) => !inSitemap.has(sitemapUrl(r).replace(SITE, '')));

console.log(JSON.stringify(m, null, 2));
console.log('sitemap: total', locs.length, 'unique', smUniq, 'open', (sm.match(/<urlset/g) ?? []).length, 'close', (sm.match(/<\/urlset>/g) ?? []).length);
console.log('public html', publicPages.length, 'not in sitemap', notInSitemap.length);
if (notInSitemap.length) console.log('  ' + notInSitemap.slice(0, 12).join('\n  '));
if (brokenSamples.length) console.log('SAMPLES:\n' + brokenSamples.join('\n'));