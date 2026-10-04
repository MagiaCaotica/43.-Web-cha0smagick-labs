// scripts/seo/report-broken-links.mjs
// Groups every broken relative link by target slug so the fix can be
// mechanical: most of these are old slugs that were renamed, not typos.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
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

const groups = new Map(); // target -> {count, files:Set}
let total = 0;

for (const f of walk(ROOT)) {
  const r = path.relative(ROOT, f).split(path.sep).join('/');
  const h = fs.readFileSync(f, 'utf8');
  for (const a of h.matchAll(/href=["']([^"'#][^"']*)["']/gi)) {
    const href = a[1];
    if (/^(https?:|mailto:|tel:|javascript:|data:)/i.test(href)) continue;
    const clean = href.split('#')[0].split('?')[0];
    if (!clean) continue;
    const target = clean.startsWith('/')
      ? path.join(ROOT, clean.slice(1))
      : path.resolve(path.dirname(f), clean);
    if (fs.existsSync(target) || fs.existsSync(path.join(target, 'index.html'))) continue;
    total++;
    const key = path.relative(ROOT, target).split(path.sep).join('/');
    if (!groups.has(key)) groups.set(key, { count: 0, files: new Set() });
    const g = groups.get(key);
    g.count++;
    g.files.add(r);
  }
}

const sorted = [...groups.entries()].sort((a, b) => b[1].count - a[1].count);
console.log('total broken relative links:', total);
console.log('distinct targets:', sorted.length);
console.log('');
for (const [target, g] of sorted) {
  console.log(`${String(g.count).padStart(5)}  ${g.files.size.toString().padStart(4)} files  ${target}`);
}