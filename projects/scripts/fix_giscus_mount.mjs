#!/usr/bin/env node
/**
 * fix_giscus_mount.mjs
 * ---------------------------------------------------------------------------
 * Convierte el bloque de comentarios de cada post de `blog/` en una seccion
 * real, visible y montada dentro del articulo.
 *
 * CONTEXTO / BUG QUE ARREGLA
 * -------------------------
 * El sitio integra giscus (comentarios vía GitHub Discussions), pero el
 * contenedor NO tenia la clase `giscus` que giscus exige:
 *
 *     <div class="giscus-container"><div id="giscus-comments"></div></div>
 *
 * giscus `client.js` busca `document.querySelector('.giscus')`. Al no
 * encontrarlo, crea su propio div huerfano y lo anade al final de `<body>`,
 * fuera de cualquier contenedor, sin titulo, debajo del cookie banner y del
 * footer. Por eso los comentarios "no existen" para el lector: tecnicamente
 * cargan, pero quedan al final absoluto del documento, sin ancla, sin
 * encabezado y fuera del flujo de lectura.
 *
 * QUE HACE
 * --------
 *  1. Extrae el `<script src="https://giscus.app/client.js" ...>` existente y
 *     CONSERVA sus atributos `data-*` intactos (ya validados en produccion:
 *     `data-repo-id="R_kgDOQ95-4g"` es aceptado y el iframe se crea).
 *  2. Elimina TODO el markup de comentarios heredado: el comentario
 *     `<!-- Giscus Comments -->`, los `<div class="giscus-container">` con su
 *     `<div id="giscus-comments">`, y cualquier otro `id="giscus-comments"`
 *     suelto. Dos fases: primero borra, luego inserta, para no borrar lo
 *     recien insertado.
 *  3. Inserta una seccion canonica justo antes de `</article>` (fallback
 *     `</main>`, luego `</body>`):
 *
 *         <section id="comments" class="post-comments">
 *           <h2 class="post-comments-title">Discussion &amp; Comments</h2>
 *           <p class="post-comments-intro">...</p>
 *           <div class="giscus giscus-container" id="giscus-comments"></div>
 *         </section>
 *         <script ...giscus...></script>
 *
 *     El div ahora SI tiene `class="giscus"`, asi que giscus monta dentro de el
 *     en lugar de crear un huerfano.
 *
 * USO
 * ---
 *   node projects/scripts/fix_giscus_mount.mjs          # aplica
 *   node projects/scripts/fix_giscus_mount.mjs --dry    # solo informa
 *
 * ES IDEMPOTENTE: una segunda pasada sobre un archivo ya corregido no cambia
 * nada (detecta `id="comments"` + `class="giscus"` y lo deja intacto).
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const BLOG = path.join(ROOT, 'blog');
const DRY = process.argv.includes('--dry');

const SKIP_DIRS = new Set(['node_modules', '.git', '.omo', 'dist', 'build', '.github', '.playwright-mcp']);

/* ------------------------------------------------------------------ */
/* Patrones                                                            */
/* ------------------------------------------------------------------ */

// El <script> de giscus. No gagged: se captura el texto integro para
// conservarlo byte a byte (sus data-* son la configuracion validada).
const RE_GISCUS_SCRIPT = /<script[^>]*\bsrc\s*=\s*["']?https:\/\/giscus\.app\/client\.js[^>]*>[\s\S]*?<\/script>/i;

// Contenedor heredado: <div class="giscus-container" ...><div id="giscus-comments"></div></div>
const RE_LEGACY_WRAPPER =
  /<div[^>]*\bclass\s*=\s*["'][^"']*\bgiscus-container\b[^"']*["'][^>]*>\s*(?:<div[^>]*\bid\s*=\s*["']giscus-comments["'][^>]*>\s*<\/div>)?\s*<\/div>/gi;

// Cualquier div suelto con id="giscus-comments" (no envuelto), por si el
// heredado venia desacoplado del script.
const RE_LOOSE_COMMENT_DIV = /<div[^>]*\bid\s*=\s*["']giscus-comments["'][^>]*>\s*<\/div>/gi;

// El target real `<div class="giscus"></div>`, que 11 posts ya traian suelto
// dentro del articulo (sin seccion, sin encabezado). El lookahead impide que
// el regex se coma un `giscus-container`.
const RE_BARE_TARGET_DIV = /<div[^>]*\bclass\s*=\s*["'][^"']*\bgiscus\b(?![-\w])[^"']*["'][^>]*>\s*<\/div>/gi;

// Marcador de comentario HTML heredado.
const RE_LEGACY_MARKER = /<!--\s*Giscus\s+Comments?\s*-->/gi;

// ¿Ya esta normalizado?
const RE_CANONICAL = /<section[^>]*\bid\s*=\s*["']comments["']/i;

// Anclas de insercion, en orden de preferencia. La idea es dejar la seccion de
// comentarios al FINAL del contenido y POR ENCIMA del footer del sitio, que es
// donde un lector espera encontrarla. Muchos posts no usan <article> ni
// <main>, asi que el footer es la unica referencia fiable de "aqui termina el
// contenido".
const ANCHORS = [
  /<\/article>/i,
  /<\/main>/i,
  /<footer[^>]*\bid\s*=\s*["']site-footer["']/i,
  /<footer[^>]*\bclass\s*=\s*["'][^"']*\bsite-footer\b/i,
];

const MAX_WIDTH = '800px';

function buildSection() {
  return [
    '',
    '<!-- Comments (giscus) -->',
    '<section id="comments" class="post-comments" aria-labelledby="comments-title">',
    '  <h2 id="comments-title" class="post-comments-title">Discussion &amp; Comments</h2>',
    '  <p class="post-comments-intro">Tried this practice? Tell us what happened below. Reader results are the most useful',
    '    feedback we get &mdash; they show other practitioners what to expect and tell us which guides to write next.</p>',
    `  <div class="giscus giscus-container" id="giscus-comments" style="max-width:${MAX_WIDTH};margin:0 auto;padding:0 1rem;"></div>`,
    '</section>',
  ].join('\n');
}

/* ------------------------------------------------------------------ */
/* Recorrido                                                           */
/* ------------------------------------------------------------------ */

function htmlFiles(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.') || SKIP_DIRS.has(entry.name)) continue;
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...htmlFiles(p));
    else if (entry.name.endsWith('.html')) out.push(p);
  }
  return out;
}

/** Falla fuerte si el texto no es UTF-8 valido: nunca escribir en ese caso. */
function assertUtf8(text, file) {
  try {
    new TextDecoder('utf-8', { fatal: true }).decode(new TextEncoder().encode(text));
  } catch {
    throw new Error(`ABORT: ${file} no es UTF-8 valido. No se escribe.`);
  }
}

function transform(text) {
  const m = text.match(RE_GISCUS_SCRIPT);
  if (!m) return { status: 'no-script', out: text };
  if (RE_CANONICAL.test(text)) return { status: 'already-ok', out: text };

  const script = m[0];

  // --- Fase 1: borrar todo el markup de comentarios heredado ---------
  let out = text.replace(RE_GISCUS_SCRIPT, '');
  out = out.replace(RE_LEGACY_WRAPPER, '');
  out = out.replace(RE_LOOSE_COMMENT_DIV, '');
  out = out.replace(RE_BARE_TARGET_DIV, '');
  out = out.replace(RE_LEGACY_MARKER, '');

  // Restos de lineas en blanco que dejo el borrado.
  out = out.replace(/[ \t]+$/gm, '');

  // --- Fase 2: insertar la seccion canonica antes del cierre ---------
  let anchorIdx = -1;
  for (const re of ANCHORS) {
    const am = out.match(re);
    if (am && am.index !== undefined) {
      anchorIdx = am.index;
      break;
    }
  }
  const block = buildSection() + '\n' + script;

  if (anchorIdx >= 0) {
    out = out.slice(0, anchorIdx) + block.replace(/^\n/, '') + '\n' + out.slice(anchorIdx);
  } else {
    const bodyClose = out.search(/<\/body>/i);
    if (bodyClose < 0) return { status: 'no-anchor', out };
    out = out.slice(0, bodyClose) + block + '\n' + out.slice(bodyClose);
  }

  return { status: 'fixed', out };
}

/* ------------------------------------------------------------------ */
/* Aserciones de resultado                                             */
/* ------------------------------------------------------------------ */

function verify(out, file) {
  const errs = [];
  const scripts = (out.match(/giscus\.app\/client\.js/g) || []).length;
  const targets = (out.match(/class="[^"]*\bgiscus\b(?!-)/g) || []).length;
  const ids = (out.match(/id="giscus-comments"/g) || []).length;
  const sections = (out.match(/id="comments"/g) || []).length;

  if (scripts !== 1) errs.push(`scripts giscus=${scripts} (esperado 1)`);
  if (targets !== 1) errs.push(`targets .giscus=${targets} (esperado 1)`);
  if (ids !== 1) errs.push(`id giscus-comments=${ids} (esperado 1)`);
  if (sections !== 1) errs.push(`section #comments=${sections} (esperado 1)`);
  if (errs.length) throw new Error(`ABORT en ${path.basename(file)}: ${errs.join('; ')}`);
}

/* ------------------------------------------------------------------ */
/* Main                                                                */
/* ------------------------------------------------------------------ */

const files = htmlFiles(BLOG);
const tally = { fixed: 0, 'already-ok': 0, 'no-script': 0, 'no-anchor': 0 };
const changed = [];
const skippedInvalid = [];

for (const file of files) {
  const text = fs.readFileSync(file, 'utf8');
  let res;
  try {
    res = transform(text);
  } catch (err) {
    skippedInvalid.push(`${path.basename(file)}: ${err.message}`);
    continue;
  }
  tally[res.status]++;
  if (res.status !== 'fixed') continue;
  if (res.out === text) continue;

  assertUtf8(res.out, file);
  try {
    verify(res.out, file);
  } catch (err) {
    skippedInvalid.push(err.message);
    continue;
  }

  changed.push(file);
  if (!DRY) fs.writeFileSync(file, res.out, 'utf8');
}

console.log(`\nmode            : ${DRY ? 'DRY-RUN (nada escrito)' : 'APLICADO'}`);
console.log(`blog/*.html     : ${files.length}`);
console.log(`giscus script   : ${tally.fixed + tally['already-ok']}`);
console.log(`sin script      : ${tally['no-script']}  (index/indices, no son posts)`);
console.log(`sin ancla       : ${tally['no-anchor']}`);
console.log(`ya normalizados : ${tally['already-ok']}`);
console.log(`CORREGIDOS      : ${tally.fixed}`);
console.log(`abortados       : ${skippedInvalid.length}`);
if (skippedInvalid.length) skippedInvalid.forEach((e) => console.log('   ! ' + e));
console.log('');
