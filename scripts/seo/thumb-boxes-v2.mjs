/**
 * thumb-boxes-v2.mjs — Rehace las cajas de miniaturas con rejilla que no desborda,
 * etiquetas a dos líneas y un ancla de precio (pack 8 libros) al final de la caja de libros.
 *
 *   node scripts/seo/thumb-boxes-v2.mjs            # dry-run
 *   node scripts/seo/thumb-boxes-v2.mjs --apply
 */
import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const APPLY = process.argv.includes('--apply');
const BLOG = path.join(ROOT, 'blog');

const B = '1px solid rgba(255,255,255,.09)';
const cardStyle = `display:flex;align-items:center;gap:9px;padding:8px;border:${B};border-radius:10px;background:rgba(255,255,255,.03);text-decoration:none;color:inherit;min-width:0;`;
const labelStyle = `display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;font-size:.87rem;line-height:1.22;color:#efe9db;min-width:0;word-break:break-word;`;
const subStyle = `display:block;font-size:.7rem;color:#98938a;margin-top:2px;`;

const card = (href, label, img, kind) => {
  const w = kind === 'app' ? 44 : 40;
  const h = kind === 'app' ? 44 : 56;
  return `<a href="${href}" style="${cardStyle}">
<img src="${img}" alt="${label.replace(/"/g, '&quot;')}" width="${w}" height="${h}" loading="lazy" style="flex:0 0 ${w}px;width:${w}px;height:${h}px;border-radius:${kind === 'app' ? 9 : 5}px;object-fit:cover;background:#111;">
<span style="${labelStyle}">${label}<span style="${subStyle}">${kind === 'app' ? 'Android · one-time' : 'PDF · one-time'}</span></span>
</a>`;
};

const bundle = `<a href="https://pay.hotmart.com/N108147778I" style="display:flex;align-items:center;justify-content:space-between;gap:12px;margin-top:10px;padding:11px 13px;border:1px solid rgba(201,168,76,.45);border-radius:10px;background:rgba(201,168,76,.10);text-decoration:none;color:inherit;min-width:0;">
<span style="min-width:0;font-size:.86rem;line-height:1.25;color:#f2ecdd;">All 8 books in one pack<span style="display:block;font-size:.72rem;color:#a9a396;">PDF · lifetime access</span></span>
<span style="text-align:right;font-size:.86rem;color:#f2ecdd;white-space:nowrap;"><strong style="color:#e7c25a;">$29.99</strong><span style="display:block;font-size:.7rem;color:#8f8a80;text-decoration:line-through;">$68.92</span></span>
</a>`;

const box = (kind, title, inner, extra = '') => `<!-- thumbboxes:${kind}:start -->
<section class="thumb-box thumb-box--${kind}" style="scroll-margin-top:96px;margin:1.6rem 0;padding:1rem 1.05rem;border:1px solid ${kind === 'apps' ? 'rgba(255,255,255,.10)' : 'rgba(201,168,76,.30)'};border-radius:12px;background:${kind === 'apps' ? 'rgba(255,255,255,.025)' : 'linear-gradient(180deg,rgba(201,168,76,.07),rgba(0,0,0,0))'};">
<p style="margin:0 0 .7rem;font-size:.72rem;letter-spacing:.14em;text-transform:uppercase;color:${kind === 'apps' ? '#9d978c' : '#c9a84c'};font-weight:700;">${title}</p>
<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:8px;">
${inner}
</div>
${extra}
</section>
<!-- thumbboxes:${kind}:end -->
`;

function cardsFrom(block, kind) {
  const out = [];
  for (const m of block.matchAll(/<a href="([^"]+)"[^>]*>\s*<img src="([^"]+)"[^>]*alt="([^"]*)"/g)) {
    out.push({ href: m[1], img: m[2], label: m[3] });
  }
  return out.map((c) => card(c.href, c.label, c.img, kind)).join('\n');
}

let changed = 0, skipped = 0;
for (const f of fs.readdirSync(BLOG).filter((x) => x.endsWith('.html'))) {
  const full = path.join(BLOG, f);
  let html = fs.readFileSync(full, 'utf8');
  if (!html.includes('thumbboxes:apps:start')) { skipped++; continue; }

  const appsM = html.match(/<!-- thumbboxes:apps:start -->[\s\S]*?<!-- thumbboxes:apps:end -->/);
  const booksM = html.match(/<!-- thumbboxes:books:start -->[\s\S]*?<!-- thumbboxes:books:end -->/);
  if (!appsM) { skipped++; continue; }

  const appsBody = cardsFrom(appsM[0], 'app');
  const booksBody = booksM ? cardsFrom(booksM[0], 'book') : '';

  let out = html.replace(appsM[0], box('apps', 'Apps used in this guide', appsBody));
  if (booksM) out = out.replace(booksM[0], box('books', 'Read the source material', booksBody, bundle));

  if (out !== html) { if (APPLY) fs.writeFileSync(full, out, 'utf8'); changed++; }
}

console.log(`${APPLY ? 'APPLIED' : 'DRY-RUN'} | rehacidas: ${changed} | sin cajas: ${skipped}`);
