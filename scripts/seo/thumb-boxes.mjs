/**
 * thumb-boxes.mjs — Convierte el bloque plano "Related Resources" de cada artículo
 * en dos cajas con miniaturas:
 *   · Apps: tarjetas con icono, ARRIBA del artículo (tras la meta del post).
 *   · Libros: tarjetas con portada, ABAJO del artículo (donde estaba el bloque).
 *
 * Idempotente: si la página ya tiene los marcadores `thumbboxes`, se salta.
 *
 *   node scripts/seo/thumb-boxes.mjs            # dry-run
 *   node scripts/seo/thumb-boxes.mjs --apply    # escribe
 */
import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const APPLY = process.argv.includes('--apply');
const BLOG = path.join(ROOT, 'blog');

/** href relativo (../apps/x.html) -> { img, type } leído del propio og:image. */
const meta = new Map();
for (const [dir, type] of [['apps', 'app'], ['books', 'book']]) {
  for (const f of fs.readdirSync(path.join(ROOT, dir))) {
    if (!f.endsWith('.html') || f === 'index.html') continue;
    const html = fs.readFileSync(path.join(ROOT, dir, f), 'utf8');
    const m = html.match(/property="og:image" content="([^"]+)"/);
    if (m) meta.set(`${dir}/${f}`, { img: m[1].replace('https://cha0smagicklabs.com/', '../'), type });
  }
}

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function card(href, label) {
  const info = meta.get(href.replace(/^\.\.\//, ''));
  if (!info) return '';
  if (info.type === 'app') {
    return `<a href="../${href.replace(/^\.\.\//, '')}" style="display:flex;align-items:center;gap:10px;flex:1 1 190px;min-width:170px;padding:8px;border:1px solid rgba(255,255,255,.09);border-radius:10px;background:rgba(255,255,255,.03);text-decoration:none;color:inherit;">
<img src="${info.img}" alt="${esc(label)}" width="52" height="52" loading="lazy" style="width:52px;height:52px;border-radius:10px;object-fit:cover;flex:0 0 52px;">
<span style="font-size:.9rem;line-height:1.25;color:#f0ece0;">${esc(label)}<span style="display:block;font-size:.72rem;color:#9a958a;">Android · one-time</span></span></a>`;
  }
  return `<a href="../${href.replace(/^\.\.\//, '')}" style="display:flex;align-items:center;gap:10px;flex:1 1 210px;min-width:190px;padding:8px;border:1px solid rgba(255,255,255,.09);border-radius:10px;background:rgba(255,255,255,.03);text-decoration:none;color:inherit;">
<img src="${info.img}" alt="${esc(label)}" width="48" height="66" loading="lazy" style="width:48px;height:66px;border-radius:6px;object-fit:cover;flex:0 0 48px;">
<span style="font-size:.85rem;line-height:1.25;color:#f0ece0;">${esc(label)}<span style="display:block;font-size:.72rem;color:#9a958a;">PDF · one-time</span></span></a>`;
}

const box = (kind, title, cards) => `<!-- thumbboxes:${kind}:start -->
<section class="thumb-box thumb-box--${kind}" style="margin:2rem 0;padding:1.15rem;border:1px solid rgba(201,168,76,.28);border-radius:12px;background:linear-gradient(180deg,rgba(201,168,76,.07),rgba(0,0,0,0));">
<p style="margin:0 0 .85rem;font-size:.76rem;letter-spacing:.14em;text-transform:uppercase;color:#c9a84c;font-weight:700;">${title}</p>
<div style="display:flex;flex-wrap:wrap;gap:8px;">
${cards.join('\n')}
</div>
</section>
<!-- thumbboxes:${kind}:end -->
`;

/** Devuelve los hrefs de un grupo ("Apps:" / "Books:") dentro del bloque. */
function group(html, name) {
  const m = html.match(new RegExp(`<strong[^>]*>${name}:</strong>([\\s\\S]*?)</div>`));
  if (!m) return [];
  const out = [];
  for (const a of m[1].matchAll(/<a href="([^"]+)"[^>]*>([^<]*)<\/a>/g)) {
    out.push({ href: a[1], label: a[2].trim() });
  }
  return out;
}

let changed = 0, skipped = 0, noBlock = 0;
const files = fs.readdirSync(BLOG).filter((f) => f.endsWith('.html'));

for (const f of files) {
  const full = path.join(BLOG, f);
  let html = fs.readFileSync(full, 'utf8');
  if (html.includes('thumbboxes:apps:start')) { skipped++; continue; }

  const secStart = html.indexOf('<section class="internal-links"');
  if (secStart < 0) { noBlock++; continue; }
  const secEnd = html.indexOf('</section>', secStart) + '</section>'.length;
  const section = html.slice(secStart, secEnd);

  const apps = group(section, 'Apps').map((x) => card(x.href, x.label)).filter(Boolean);
  const books = group(section, 'Books').map((x) => card(x.href, x.label)).filter(Boolean);
  if (!apps.length && !books.length) { noBlock++; continue; }

  const appsBox = apps.length ? box('apps', 'Apps that do this offline', apps) : '';
  const booksBox = books.length ? box('books', 'Go deeper: the books behind this', books) : '';

  // Libros al final: sustituye al bloque plano.
  html = html.slice(0, secStart) + booksBox + html.slice(secEnd);

  // Apps arriba: tras el bloque de metadatos del post.
  if (appsBox) {
    const m = html.match(/<div class="blog-meta">[\s\S]*?<\/div>/);
    if (m) {
      const at = m.index + m[0].length;
      html = html.slice(0, at) + '\n' + appsBox + html.slice(at);
    } else {
      const h2 = html.indexOf('</h2>');
      if (h2 > 0) html = html.slice(0, h2 + 5) + '\n' + appsBox + html.slice(h2 + 5);
    }
  }

  if (APPLY) fs.writeFileSync(full, html, 'utf8');
  changed++;
}

console.log(`${APPLY ? 'APPLIED' : 'DRY-RUN'} | artículos: ${files.length} | cambiados: ${changed} | ya tenían cajas: ${skipped} | sin bloque: ${noBlock}`);
