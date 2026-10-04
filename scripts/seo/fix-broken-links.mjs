// Fix internal links that point at pages that no longer exist.
//
// Every rewrite here is gated on the replacement target existing on disk, and
// the new href is computed relative to the file being edited. Targets whose
// correct replacement is genuinely ambiguous (renamed tools with no single
// obvious successor) are deliberately NOT rewritten: guessing would trade a
// 404 for a wrong page, which is worse.
//
//   node scripts/seo/fix-broken-links.mjs --dry --preview 20
//
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const DRY = process.argv.includes('--dry');
const PREVIEW = Number((process.argv.find((a) => a.startsWith('--preview=')) || '').split('=')[1] || 0);
const SHOW = process.argv.includes('--preview');

const EXCLUDE = ['projects', 'node_modules', '.git', 'tools/auto-shorts'];

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (EXCLUDE.includes(e.name)) continue;
    const f = path.join(dir, e.name);
    if (e.isDirectory()) walk(f, out);
    else if (f.endsWith('.html')) out.push(f);
  }
  return out;
}

const files = walk(ROOT);
const exists = new Set(files.map((f) => path.resolve(f)));

function existsOnDisk(relFromRoot) {
  const abs = path.join(ROOT, relFromRoot);
  // fs.existsSync, not the html-only set: some targets are stylesheets.
  return fs.existsSync(abs);
}

// broken href (as written) -> replacement, expressed relative to ROOT.
// Only entries whose replacement exists on disk are kept.
const CANDIDATES = {
  // --- the money path: 453 posts aimed at the retired bundle page instead of
  // the one that carries the Hotmart checkout (V107097103W).
  'bundle.html': 'landing-pages/books-bundle.html',
  'complete-chaos-magick-bundle.html': 'landing-pages/books-bundle.html',

  // --- books: slugs gained a -pdf suffix
  'books/codex-chaoticus.html': 'books/codex-chaoticus-pdf.html',
  'books/treatise-chaos-hunter-runes.html': 'books/tratado-runas-cazadoras-caos-pdf.html',
  'books/magical-servitors-manual.html': 'books/manual-activacion-servidores-magicos-pdf.html',
  'books/tarot-chaos.html': 'books/tarot-chaos-pdf.html',
  'books/mind-the-gap.html': 'books/mind-the-gap-pdf.html',
  'books/ouija-cazadora.html': 'books/ouija-cazadora-pdf.html',
  'books/liber-lvpinux.html': 'books/liber-lvpinux-pdf.html',

  // --- apps: slug corrections
  'apps/eerie-roads.html': 'apps/eerieroads.html',
  'apps/rider-waite-tarot.html': 'apps/unofficial-rider-waite-tarot.html',
  'apps/ching-oracle.html': 'apps/iching-oracle.html',
  'apps/sigil-gym.html': 'apps/psi-gym.html',

  // --- tools renames resolved from evidence, not inference: the surviving
  // page's own <title> is the same product name the dead link's anchor text
  // uses. tools/natal-chart.html was linked as "Free Natal Chart Calculator"
  // and the live page is titled "Carta Natal Gratuita". The dead link said
  // "lunar phase calculator" and the live page is titled "Free Lunar Phase
  // Calculator Online" (tools/lunar-phase.html -- NOT the paid
  // apps/lunar-phase-calculator.html app page).
  'tools/natal-chart.html': 'tools/full-birth-chart.html',
  'tools/lunar-phase-calculator/index.html': 'tools/lunar-phase.html',

  // --- tools renames with a single unambiguous successor
  'tools/zener-test.html': 'tools/zener-esp-trainer.html',
  'tools/i-ching.html': 'tools/iching.html',
  'tools/pendulum.html': 'tools/pendulum-question-builder.html',

  // --- stylesheet
  'styles/main.css': 'css/style.css',

  // --- second favicon path used by 22 tool pages; the canonical one is
  // assets/favicon.ico, which now exists.
  'assets/images/favicon.ico': 'assets/favicon.ico',
};

const MAP = [];
for (const [from, to] of Object.entries(CANDIDATES)) {
  if (!existsOnDisk(to)) {
    console.log(`SKIP (target missing on disk): ${from} -> ${to}`);
    continue;
  }
  MAP.push([from, to]);
}

// Match an href whose path, resolved against the current file, lands on a
// broken key in MAP. Handles "x.html", "../x.html", "/x.html", "./x.html".
// <a> and <link> are both covered: the icon and stylesheet references are dead
// the same way the anchors were. canonical/alternate are absolute URLs, so the
// scheme guard skips them.
function rewrite(html, fileAbs) {
  const dir = path.dirname(fileAbs);
  const hits = [];
  let out = html.replace(
    /(<(?:a|link)\b[^>]*?\shref=")([^"#?]+)([^"]*)(")/gi,
    (m, pre, href, tail, close) => {
      if (!href) return m;
      if (/^(https?:|mailto:|tel:|javascript:|#)/i.test(href)) return m;

      const absHref = href.startsWith('/')
        ? path.join(ROOT, href.slice(1))
        : path.resolve(dir, href);
      const relFromRoot = path.relative(ROOT, absHref).split(path.sep).join('/');

      const hit = MAP.find(([from]) => from === relFromRoot);
      if (!hit) return m;

      const targetAbs = path.join(ROOT, hit[1]);
      let next;
      if (href.startsWith('/')) {
        next = '/' + hit[1];
      } else {
        next = path.relative(dir, targetAbs).split(path.sep).join('/');
      }
      hits.push({ from: href, to: next });
      return pre + next + tail + close;
    }
  );
  return { out, hits };
}

const stats = { scanned: 0, filesTouched: 0, linksFixed: 0 };
const perTarget = new Map();
let shown = 0;

for (const f of files) {
  stats.scanned++;
  const html = fs.readFileSync(f, 'utf8');
  const { out, hits } = rewrite(html, f);
  if (!hits.length) continue;
  stats.filesTouched++;
  stats.linksFixed += hits.length;
  const key = hits[0].from + ' -> ' + hits[0].to;
  perTarget.set(key, (perTarget.get(key) || 0) + hits.length);
  // also tally every other hit, so a target never hides behind the file's first
  for (const h of hits.slice(1)) {
    const k2 = h.from + ' -> ' + h.to;
    perTarget.set(k2, (perTarget.get(k2) || 0) + 1);
  }
  if (SHOW && shown < PREVIEW) {
    shown++;
    console.log(`  ${path.relative(ROOT, f)}\n    ${hits[0].from}  =>  ${hits[0].to}`);
  }
  if (!DRY) fs.writeFileSync(f, out, 'utf8');
}

console.log('\n--- rewrites by target ---');
[...perTarget.entries()].sort((a, b) => b[1] - a[1]).forEach(([k, n]) => console.log(`  ${String(n).padStart(4)}  ${k}`));
console.log(`\nscanned ${stats.scanned} | filesTouched ${stats.filesTouched} | linksFixed ${stats.linksFixed}`);
console.log(DRY ? '[DRY] no files written' : '[APPLIED]');