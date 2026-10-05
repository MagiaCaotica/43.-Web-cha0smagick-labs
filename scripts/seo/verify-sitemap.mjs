#!/usr/bin/env node
// Gate de coherencia entre `sitemap.xml`, el disco y el repositorio.
//
// Por que existe: los tres bugs de sitemap que ha tenido el sitio NO se
// detectaban mirando el XML, porque cada uno hacia que el XML pareciera
// correcto:
//   - `42fb1a4c` el sitemap anunciaba `/blog/index.html`, una URL que la propia
//     pagina canonicaliza a `/blog/`.
//   - `checklist-ventas.html` esta en `.gitignore` (linea 33, "Checklist personal
//     de ventas (no subir)") y el sitemap lo anuncia igual: en produccion es un 404.
//   - Otros `/landing-pages/*.html` sirven pero su checkout es un placeholder.
//
// Reglas que aplica (todas son errores, no avisos):
//   E1  URL del sitemap sin archivo en disco.
//   E2  URL del sitemap cuyo archivo NO esta trackeado por git  -> 404 en
//       produccion, porque GitHub Pages solo publica lo commiteado.
//   E3  El canonical de la pagina apunta a una URL distinta de la del sitemap.
//   E4  URL duplicada en el sitemap.
//
// Avisos (no rompen el gate):
//   W1  .html publicable que no esta en el sitemap. Requiere que la pagina
//       declare `noindex`, o el aviso es real.
//
// Uso:  node scripts/seo/verify-sitemap.mjs
//       node scripts/seo/verify-sitemap.mjs --json
// Salida: exit code 1 si hay E1..E4.

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const SITE = 'https://cha0smagicklabs.com';
const JSONOUT = process.argv.includes('--json');

// Mismos directorios que el resto de la cadena SEO: no se publican.
const SKIP = /(^|[\\/])(node_modules|\.git|\.github|vendor|projects|auto-shorts)([\\/]|$)/;

// `/blog/` y `/blog/index.html` son la MISMA URL. Se normaliza a la ruta de
// archivo para poder comparar sitemap contra disco sin falsos positivos.
function urlToFile(urlPath) {
  let p = decodeURIComponent(urlPath.split('#')[0].split('?')[0]);
  if (p.endsWith('/')) p += 'index.html';
  return p.replace(/^\/+/, '');
}

// `/index.html` es la portada: se expresa como `/`.
function fileToUrl(rel) {
  const r = rel.replace(/\\/g, '/').replace(/^\.\//, '');
  return r === 'index.html' ? '/' : '/' + r;
}

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const abs = path.join(dir, e.name);
    if (SKIP.test(abs)) continue;
    if (e.isDirectory()) walk(abs, out);
    else if (e.name.toLowerCase().endsWith('.html')) out.push(abs);
  }
  return out;
}

const errors = [];
const warnings = [];

// ---------------------------------------------------------------- sitemap ---
const smPath = 'sitemap.xml';
if (!fs.existsSync(smPath)) {
  console.error(`FALTA ${smPath}: no se puede verificar nada.`);
  process.exit(1);
}
const sm = fs.readFileSync(smPath, 'utf8');
const locs = [...sm.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => m[1]);

// E4 duplicados
const seen = new Map();
for (const u of locs) seen.set(u, (seen.get(u) || 0) + 1);
for (const [u, n] of seen) if (n > 1) errors.push({ rule: 'E4', url: u, detail: `${n} veces en el sitemap` });

// E2 requiere el unico git ls-files del repo. Se pide una vez.
let tracked = new Set();
let gitOk = true;
try {
  const out = execFileSync('git', ['ls-files'], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  tracked = new Set(out.split(/\r?\n/).filter(Boolean).map((s) => s.replace(/\\/g, '/')));
} catch (e) {
  gitOk = false;
  warnings.push({ rule: 'W0', detail: 'git ls-files fallo: E2 no se puede comprobar' });
}

// E1 + E2 + E3
const checked = new Set();
for (const abs of locs) {
  if (!abs.startsWith(SITE)) {
    errors.push({ rule: 'E1', url: abs, detail: `host distinto de ${SITE}` });
    continue;
  }
  const rel = urlToFile(abs.slice(SITE.length));
  if (checked.has(rel)) continue;
  checked.add(rel);

  if (!fs.existsSync(rel)) {
    errors.push({ rule: 'E1', url: abs, file: rel, detail: 'no existe en disco' });
    continue;
  }
  if (gitOk && !tracked.has(rel)) {
    errors.push({ rule: 'E2', url: abs, file: rel, detail: 'existe pero NO esta trackeado por git (404 en produccion)' });
  }
  const html = fs.readFileSync(rel, 'utf8');
  const can = html.match(/<link[^>]+rel=["']canonical["'][^>]*href=["']([^"']+)["']/i);
  if (can && can[1] && can[1].replace(/\/$/, '/') !== abs.replace(/\/$/, '/')) {
    errors.push({ rule: 'E3', url: abs, file: rel, detail: `canonical declara ${can[1]}` });
  }
}

// ------------------------------------------------------------------ W1 ---
// Paginas indexables que NO estan en el sitemap, de forma deliberada.
//
// Una pagina indexable fuera del sitemap no es un defecto de SEO: el sitemap es
// una ayuda de descubrimiento, no un requisito de indexacion. Estas tres se
// excluyen porque su checkout es un PLACEHOLDER (`BLOCKED_EXTERNAL_ID`) y
// MASTER_EXECUTION_PLAN.md P0-03 exige no anunciarlas hasta tener el ID real de
// Hotmart. No se les pone `noindex`: el plan prohibe explicitamente "ocultar una
// oferta no disponible", asi que la decision es "no anunciar todavia", no
// "esconder". Cuando se consigan los IDs, se borran de esta lista y se anaden
// al sitemap; cuando se decida retirarlas, se marca `noindex` y se deja el aviso.
const W1_KNOWN = new Set([
  'landing-pages/apps-bundle.html',
  'landing-pages/complete-access.html',
  'landing-pages/flash-sale.html',
]);

const inSitemap = new Set(locs.filter((u) => u.startsWith(SITE)).map((u) => urlToFile(u.slice(SITE.length))));
for (const abs of walk(path.resolve('.'))) {
  const rel = abs.split(path.sep).join('/').slice(path.resolve('.').split(path.sep).join('/').length + 1);
  if (inSitemap.has(rel)) continue;
  if (gitOk && !tracked.has(rel)) continue; // no se publica
  const html = fs.readFileSync(abs, 'utf8');
  const noindex = /<meta[^>]+name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(html);
  if (W1_KNOWN.has(rel)) {
    warnings.push({ rule: 'W1-known', file: rel, detail: 'excluido del sitemap a proposito (checkout placeholder, P0-03)' });
    continue;
  }
  warnings.push({
    rule: noindex ? 'W1-ok' : 'W1',
    file: rel,
    detail: noindex ? 'fuera del sitemap pero declara noindex' : 'fuera del sitemap y sin noindex',
  });
}

// ---------------------------------------------------------------- salida ---
if (JSONOUT) {
  console.log(JSON.stringify({ locs: locs.length, errors, warnings }, null, 2));
} else {
  console.log(`URLs en sitemap        : ${locs.length}`);
  console.log(`archivos comprobados   : ${checked.size}`);
  console.log(`ERRORES  (E1-E4)       : ${errors.length}`);
  for (const e of errors) console.log(`  [${e.rule}] ${e.url || e.file}  ${e.detail}`);
  const real = warnings.filter((w) => w.rule !== 'W1-ok' && w.rule !== 'W1-known');
  const ok = warnings.filter((w) => w.rule === 'W1-ok');
  const known = warnings.filter((w) => w.rule === 'W1-known');
  console.log(`AVISOS reales (W1)     : ${real.length}`);
  for (const w of real) console.log(`  [${w.rule}] ${w.file}  ${w.detail}`);
  console.log(`huerfanas con noindex  : ${ok.length}  (correcto)`);
  for (const w of ok) console.log(`  [ok] ${w.file}`);
  console.log(`excluidas a proposito  : ${known.length}  (P0-03, checkout placeholder)`);
  for (const w of known) console.log(`  [known] ${w.file}`);
  if (gitOk === false) console.log('  (E2 no comprobado)');
}
process.exit(errors.length ? 1 : 0);