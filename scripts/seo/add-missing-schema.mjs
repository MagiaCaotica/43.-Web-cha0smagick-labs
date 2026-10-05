#!/usr/bin/env node
// Anade JSON-LD minimo y correcto a las paginas del sitio que no tienen
// NINGUN bloque <script type="application/ld+json">.
//
// Motivo (auditoria 2026-10-04): `measure-head-debt.mjs` reporto 6 paginas sin
// schema. Una pagina sin datos estructurados no puede obtener rich results, y
// el sitio ya declara schema en las otras 914.
//
// Decisiones de diseno:
//  - NO se inventa contenido. El nombre y la descripcion se leen del <title> y
//    del <meta name="description"> que la pagina ya declara; si faltan, se
//    deriva un nombre del nombre de archivo. Nada nuevo se presenta como hecho.
//  - Cada tipo de schema se elige por la RUTA del archivo, no por adivinanza:
//    una pagina legal recibe WebPage, no Article. Declarar Article en una pagina
//    de terminos seria exactamente el tipo de schema spam que
//    `reconcile-faq-schema.mjs` existe para eliminar.
//  - Idempotente: si el archivo ya contiene ld+json, no se toca.
//
// Uso:  node scripts/seo/add-missing-schema.mjs            (dry-run, informe)
//       node scripts/seo/add-missing-schema.mjs --write
//       node scripts/seo/add-missing-schema.mjs --json

import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve('.').split(path.sep).join('/');
const SITE = 'https://cha0smagicklabs.com';
const WRITE = process.argv.includes('--write');
const JSONOUT = process.argv.includes('--json');

// Solo directorios del sitio publicado. `projects/` es ruido interno y
// `auto-shorts` es codigo de terceros vendorizado (ver b15).
const SKIP = /(^|[\\/])(node_modules|\.git|\.github|vendor|projects|auto-shorts)([\\/]|$)/;

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const abs = path.join(dir, e.name);
    if (SKIP.test(abs)) continue;
    if (e.isDirectory()) walk(abs, out);
    else if (e.name.toLowerCase().endsWith('.html')) out.push(abs);
  }
  return out;
}

// Decodifica en varias pasadas. Una sola pasada NO basta: si el HTML contiene
// `&amp;middot;` (entidad doblemente codificada, que se ve en el sitio) la
// primera pasada produce el texto literal `&middot;` en lugar de `·`.
const ENT = [
  [/&amp;/g, '&'], [/&lt;/g, '<'], [/&gt;/g, '>'], [/&quot;/g, '"'],
  [/&#39;/g, "'"], [/&apos;/g, "'"], [/&mdash;/g, '\u2014'], [/&ndash;/g, '\u2013'],
  [/&middot;/g, '\u00b7'], [/&hellip;/g, '\u2026'], [/&rsquo;/g, '\u2019'],
  [/&lsquo;/g, '\u2018'], [/&ldquo;/g, '\u201c'], [/&rdquo;/g, '\u201d'],
];
function dec(input) {
  let s = String(input);
  for (let pass = 0; pass < 4; pass++) {
    const before = s;
    for (const [re, ch] of ENT) s = s.replace(re, ch);
    if (s === before) break;
  }
  return s;
}

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const clip = (s, max) => {
  s = dec(s).replace(/\s+/g, ' ').trim();
  if (s.length <= max) return s;
  const cut = s.slice(0, max);
  const sp = cut.lastIndexOf(' ');
  return (sp > max * 0.6 ? cut.slice(0, sp) : cut).replace(/[\s,;:.-\u2013\u2014]+$/, '') + '\u2026';
};

const pick = (html, re) => {
  const m = html.match(re);
  return m ? dec(m[1]).replace(/\s+/g, ' ').trim() : '';
};

// Tipo de schema segun la ruta. `legal` y `error` NO son Article.
function schemaTypeFor(rel) {
  if (rel === '404.html') return 'error';
  if (/^(terms|privacy|cookie-policy|refund-policy|disclaimer)\.html$/.test(rel)) return 'legal';
  if (/^landing-pages\/affiliate-/.test(rel)) return 'affiliate';
  if (/^lead-magnet\//.test(rel)) return 'guide';
  return 'webpage';
}

function buildLd(rel, html) {
  const url = `${SITE}/${rel}`;
  const title = clip(pick(html, /<title[^>]*>([\s\S]*?)<\/title>/i) || rel.replace(/\.html$/, ''), 70);
  const desc = clip(pick(html, /<meta[^>]+name=["']description["'][^>]*content=["']([\s\S]*?)["']/i), 160);
  const type = schemaTypeFor(rel);

  const base = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': url,
    url,
    name: title,
    inLanguage: 'es',
    isPartOf: { '@type': 'WebSite', '@id': `${SITE}/`, name: 'Cha0smagick Labs', url: `${SITE}/` },
  };
  if (desc) base.description = desc;

  if (type === 'legal') {
    // Las paginas legales son del propietario, no contenido editorial. Se
    // declaran como WebPage del sitio y se dejan como `draft` en el entity map
    // (external_state: legal_owner_pending). No se afirma autoria.
    return base;
  }
  if (type === 'error') {
    base.name = '404';
    base.description = desc || 'La pagina solicitada no existe en cha0smagicklabs.com.';
    return base;
  }
  if (type === 'affiliate') {
    base.description = desc || 'Panel de afiliados de Cha0smagick Labs.';
    return base;
  }
  // guide (lead-magnet) y webpage: Article es defendible solo en lead-magnet,
  // que es contenido editorial descargable.
  if (type === 'guide') {
    return {
      ...base,
      '@type': 'Article',
      headline: title,
      articleSection: 'Magia de Caos',
      inLanguage: 'es',
      author: { '@type': 'Organization', name: 'Cha0smagick Labs', url: `${SITE}/` },
      publisher: { '@type': 'Organization', name: 'Cha0smagick Labs', url: `${SITE}/` },
    };
  }
  return base;
}

const files = walk(ROOT);
const report = [];
let written = 0;

for (const abs of files) {
  const rel = abs.split(path.sep).join('/').slice(ROOT.length + 1);
  const html = fs.readFileSync(abs, 'utf8');

  if (/type=["']application\/ld\+json["']/i.test(html)) continue;

  const ld = buildLd(rel, html);
  const block = `<script type="application/ld+json">\n${JSON.stringify(ld, null, 2)}\n</script>`;

  let out;
  if (/<\/head>/i.test(html)) {
    out = html.replace(/([ \t]*)<\/head>/i, (m, ind) => `${ind}${block}\n${ind}</head>`);
  } else if (/<body[^>]*>/i.test(html)) {
    out = html.replace(/(<body[^>]*>)/i, `$1\n${block}`);
  } else {
    report.push({ rel, action: 'SKIP', why: 'no head ni body' });
    continue;
  }

  report.push({ rel, action: 'ADD', type: ld['@type'], title: ld.name });
  if (WRITE) {
    fs.writeFileSync(abs, out, 'utf8');
    written++;
  }
}

const add = report.filter((r) => r.action === 'ADD');
if (JSONOUT) {
  console.log(JSON.stringify({ written, total: report.length, added: add.length, report }, null, 2));
} else {
  console.log(`paginas totales revisadas : ${files.length}`);
  console.log(`sin ningun ld+json        : ${report.length}`);
  console.log(`a las que se anade schema: ${add.length}`);
  console.log(`escritas                 : ${written}`);
  for (const r of add) console.log(`  + ${r.rel}  [${r['type']}]  ${r.title}`);
  for (const r of report.filter((x) => x.action === 'SKIP')) console.log(`  ! ${r.rel}  ${r.why}`);
  if (!WRITE && add.length) console.log('\n(dry-run: usa --write para aplicar)');
}
