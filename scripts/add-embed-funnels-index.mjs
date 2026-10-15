#!/usr/bin/env node
/**
 * add-embed-funnels-index.mjs
 * ---------------------------------------------------------------------------
 * Da de alta las 9 paginas de embed (Gen3) en los dos sitios por los que se
 * descubre una pagina nueva:
 *
 *   1. tools/index.html  -> una tarjeta por pagina, en su propia seccion.
 *   2. sitemap.xml       -> las 9 URLs, con lastmod de la propia pagina.
 *
 * Idempotente por marcadores: se puede ejecutar mil veces sin duplicar nada.
 * Si alguien edita tools/index.html a mano, los marcadores sobreviven y el
 * bloque se regenera limpio.
 *
 * Uso:  node scripts/add-embed-funnels-index.mjs
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { EMBED_TOOLS } from './embed-tools.data.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const INDEX_FILE = path.join(ROOT, 'tools', 'index.html');
const SITEMAP_FILE = path.join(ROOT, 'sitemap.xml');
const CATALOG_FILE = path.join(ROOT, 'data', 'tool-funnels.json');
const SITE = 'https://cha0smagicklabs.com';

const START = '<!-- embed-funnels:start -->';
const END = '<!-- embed-funnels:end -->';

const PLAY_ICON =
  '<svg class="play-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.199l2.807 1.626a1 1 0 0 1 0 1.732l-2.807 1.626L15.206 12l2.492-2.492zM5.864 2.658L16.8 8.99l-2.302 2.302-8.634-8.634z"/></svg>';

const card = (entry, app, book) => {
  const secondary = app
    ? `                <a href="../apps/${app.id}.html" class="play-store-btn compact pulse" target="_blank">${PLAY_ICON} GET IT ON</a>`
    : `                <a href="../books/${book.id}.html" class="try-link">Get the PDF →</a>`;

  const features = entry.compare
    ? entry.compare
        .filter((c) => c.free)
        .slice(0, 3)
        .map((c) => `<span>${c.feature}</span>`)
        .join('\n')
    : entry.bookAdds.slice(0, 3).map((b) => `<span>${b}</span>`).join('\n');

  const cta = entry.lang === 'es' ? 'Probar' : 'Try';

  return `        <div class="tool-card">
            <h3>${entry.name}</h3>
            <p class="desc">${entry.lede.replace(/<[^>]+>/g, '')}</p>
            <div class="features">
${features}
            </div>
            <div class="cta-row">
                <a href="${entry.slug}.html" class="try-link">${cta} ${entry.name} →</a>
${secondary}
            </div>
        </div>`;
};

function main() {
  if (!fs.existsSync(CATALOG_FILE)) {
    console.error('FALLO: falta data/tool-funnels.json (ejecuta build-tool-funnels.mjs)');
    process.exit(1);
  }
  const catalogue = JSON.parse(fs.readFileSync(CATALOG_FILE, 'utf8'));
  const appById = (id) => (catalogue.products.apps || []).find((a) => a.id === id);
  const bookById = (id) => (catalogue.products.books || []).find((b) => b.id === id);

  // ---------------------------------------------------------------- indice
  let index = fs.readFileSync(INDEX_FILE, 'utf8');
  const cards = EMBED_TOOLS.map((e) => {
    const app = e.apps?.length ? appById(e.apps[0]) : null;
    const book = e.book ? bookById(e.book) : null;
    if (!app && !book) throw new Error(`${e.slug}: sin app ni libro resuelto`);
    return card(e, app, book);
  });

  const block = [
    '',
    START,
    '    <!-- Gen3: herramientas embebidas desde GitHub Pages / Streamlit (build-embed-funnels.mjs) -->',
    '    <h2 id="embedded-labs">Free embedded labs, games &amp; compendia</h2>',
    '    <div class="tools-grid">',
    cards.join('\n\n'),
    '    </div>',
    END,
    ''
  ].join('\n');

  if (index.includes(START) && index.includes(END)) {
    const re = new RegExp(`${START}[\\s\\S]*${END}`);
    index = index.replace(re, block.trim());
    console.log('  tools/index.html  bloque regenerado');
  } else {
    // Se inserta tras el ultimo </div> de la primera rejilla (fin del bloque
    // "Core divination"), antes de la seccion atomica.
    const anchor = index.indexOf('<!-- TIER 1: Core Divination -->');
    if (anchor < 0) throw new Error('no encuentro el ancla "<!-- TIER 1: Core Divination -->" en tools/index.html');
    const gridEnd = index.indexOf('\n    </div>', anchor);
    if (gridEnd < 0) throw new Error('no encuentro el cierre de la primera rejilla');
    const at = gridEnd + '\n    </div>'.length;
    index = index.slice(0, at) + '\n' + block + index.slice(at);
    console.log('  tools/index.html  seccion insertada');
  }
  fs.writeFileSync(INDEX_FILE, index, 'utf8');

  // --------------------------------------------------------------- sitemap
  let sitemap = fs.readFileSync(SITEMAP_FILE, 'utf8');
  let added = 0;
  let skipped = 0;

  for (const entry of EMBED_TOOLS) {
    const loc = `${SITE}/tools/${entry.slug}.html`;
    if (sitemap.includes(loc)) {
      skipped++;
      continue;
    }
    const fp = path.join(ROOT, 'tools', `${entry.slug}.html`);
    if (!fs.existsSync(fp)) throw new Error(`falta tools/${entry.slug}.html`);
    const lastmod = new Date(fs.statSync(fp).mtime).toISOString().slice(0, 10);
    const xml = [
      '  <url>',
      `    <loc>${loc}</loc>`,
      `    <lastmod>${lastmod}</lastmod>`,
      '    <changefreq>monthly</changefreq>',
      '    <priority>0.8</priority>',
      '  </url>'
    ].join('\n');
    sitemap = sitemap.replace('</urlset>', xml + '\n</urlset>');
    added++;
  }
  fs.writeFileSync(SITEMAP_FILE, sitemap, 'utf8');

  console.log(`  sitemap.xml       ${added} anadidas, ${skipped} ya estaban`);
  console.log('\nOK  las 9 paginas ya son alcanzables desde tools/index.html y sitemap.xml');
}

main();