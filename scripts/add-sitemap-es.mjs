// add-sitemap-es.mjs — añade las 32 posts ES + /es/ al sitemap.xml
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const sitemap = path.join(ROOT, 'sitemap.xml');
let xml = fs.readFileSync(sitemap, 'utf8');

const SLUGS = ['es-como-hacer-un-sigilo-paso-a-paso','es-como-cargar-un-sigilo','es-sigilo-de-dinero-paso-a-paso','es-es-peligroso-un-sigilo-de-dinero','es-que-es-la-magia-del-caos','es-gnosis-magia-del-caos','es-creencia-como-herramienta','es-servitor-primer-servidor','es-como-tener-un-sueno-lucido-esta-noche','es-diario-de-suenos-guia','es-proyeccion-astral-principiantes','es-24-runas-futhark-referencia','es-tirada-de-runas-online-gratis','es-tiradas-de-runas-principiantes','es-cruz-celta-10-posiciones','es-tarot-rider-waite-principiantes','es-carta-muerte-tarot','es-fases-de-la-luna-significado','es-ritual-luna-nueva','es-luna-para-hechizos','es-iching-online-gratis','es-iching-metodo-monedas','es-iching-principiantes','es-iching-vs-tarot','es-limpiar-y-cargar-runas','es-pendulo-principiantes','es-ritual-destierro-espacio','es-runas-para-magia-del-caos','es-libros-magia-del-caos','es-libro-tratado-runas','es-ouija-seguridad','es-goetia-invocar'];

let added = 0;
const block = ['  <url>', '    <loc>https://cha0smagicklabs.com/es/index.html</loc>', '    <lastmod>2026-10-13</lastmod>', '    <changefreq>weekly</changefreq>', '    <priority>0.9</priority>', '  </url>'].join('\n');
if (!xml.includes('/es/index.html')) { xml = xml.replace('</urlset>', block + '\n</urlset>'); added++; }

for (const s of SLUGS) {
  if (xml.includes(`/blog/${s}.html`)) continue;
  const b = ['  <url>', `    <loc>https://cha0smagicklabs.com/blog/${s}.html</loc>`, '    <lastmod>2026-10-13</lastmod>', '    <changefreq>monthly</changefreq>', '    <priority>0.8</priority>', '  </url>'].join('\n');
  xml = xml.replace('</urlset>', b + '\n</urlset>');
  added++;
}
fs.writeFileSync(sitemap, xml);
const count = (xml.match(/<url>/g) || []).length;
console.log(`sitemap: ${added} URLs añadidas — total ${count}`);
