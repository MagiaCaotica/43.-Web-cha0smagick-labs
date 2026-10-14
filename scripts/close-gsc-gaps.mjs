// Cierre del ataque a huecos: link visible EN->ES en los pares hreflang, sitemap e indice de busqueda.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const R = path.join(__dirname, '..');
const SITE = 'https://cha0smagicklabs.com';
const MARK = '<!-- es-visible-link -->';

// 1) link visible EN -> ES en cada par que ya tiene hreflang es
const blogDir = path.join(R, 'blog');
let paired = 0;
for (const f of fs.readdirSync(blogDir).filter(n => n.endsWith('.html') && !n.startsWith('es-'))) {
  const p = path.join(blogDir, f);
  let h = fs.readFileSync(p, 'utf8');
  if (h.includes(MARK)) continue;
  const m = h.match(/<link rel="alternate" hreflang="es" href="([^"]+)"/);
  if (!m) continue;
  const es = m[1].replace(/^https?:\/\/[^/]+/, '');
  const fi = h.indexOf('<footer');
  if (fi === -1) continue;
  h = h.slice(0, fi) +
    '    ' + MARK + '\n    <p class="lang-pair"><strong>Lea esta guia en espanol:</strong> ' +
    '<a href="' + es + '">' + es.replace(/^\/blog\//, '').replace(/\.html$/, '').replace(/-/g, ' ') + '</a></p>\n' +
    h.slice(fi);
  fs.writeFileSync(p, h);
  paired++;
}
console.log('pares EN con link visible a ES: ' + paired);

// 2) sitemap: anade las URLs nuevas
const sm = path.join(R, 'sitemap.xml');
let s = fs.readFileSync(sm, 'utf8');
let added = 0;
for (const u of ['/sigil-maker.html']) {
  if (s.includes(SITE + u)) continue;
  s = s.replace('</urlset>', '  <url>\n    <loc>' + SITE + u + '</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.9</priority>\n  </url>\n</urlset>');
  added++;
}
fs.writeFileSync(sm, s);
console.log('sitemap URLs: ' + (s.match(/<loc>/g) || []).length + ' (+' + added + ')');
console.log('done');