// rebuild-search-index.mjs — regenera js/search-index.json con TODAS las páginas (incluye 32 posts ES nuevos)
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const BASE = 'https://cha0smagicklabs.com';
const entries = [];
const SKIP = new Set(['privacy.html', 'terms.html', 'affiliate-terms.html', 'flash-sale.html', 'checklist-ventas.html', 'affiliate-dashboard.html', '404.html', 'buscar.html', 'search.html']);

function extract(file, url) {
  let h;
  try { h = fs.readFileSync(file, 'utf8'); } catch { return; }
  if (SKIP.has(path.basename(file))) return;
  if (/noindex/.test(h)) return;
  const t = (h.match(/<title>([^<]*)<\/title>/i) || [, ''])[1].trim();
  const d = (h.match(/<meta name="description" content="([^"]*)"/i) || [, ''])[1].trim();
  if (!t || t.length < 8) return;
  entries.push({ t, d, u: url });
}

function scanDir(dir, urlBase, depth = 0) {
  if (depth > 1) return;
  for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
    if (f.name.startsWith('.') || f.name === 'node_modules') continue;
    const full = path.join(dir, f.name);
    if (f.isDirectory()) { scanDir(full, `${urlBase}/${f.name}`, depth + 1); continue; }
    if (!f.name.endsWith('.html')) continue;
    const rel = path.relative(ROOT, full).split(path.sep).join('/');
    extract(full, `${BASE}/${rel}`);
  }
}

for (const d of ['blog', 'tools', 'apps', 'books', 'landing-pages', 'compare']) {
  const dir = path.join(ROOT, d);
  if (fs.existsSync(dir)) scanDir(dir, BASE + '/' + d);
}
for (const f of ['index.html', 'es/index.html']) {
  const full = path.join(ROOT, f);
  if (fs.existsSync(full)) extract(full, `${BASE}/${f}`);
}

fs.writeFileSync(path.join(ROOT, 'js', 'search-index.json'), JSON.stringify(entries));
console.log(`search-index.json regenerado: ${entries.length} entradas (${(fs.statSync(path.join(ROOT, 'js', 'search-index.json')).size / 1024).toFixed(0)}KB)`);
