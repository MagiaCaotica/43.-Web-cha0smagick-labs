#!/usr/bin/env node
/**
 * fix_comments_width.mjs
 * ---------------------------------------------------------------------------
 * Elimina el ancho fijo que el propio repo se puso en la seccion de comentarios
 * y que provoca que el bloque NO llegue a los bordes de la columna del post:
 *
 *   <div class="giscus giscus-container" id="giscus-comments"
 *        style="max-width:800px;margin:0 auto;padding:0 1rem;"></div>
 *
 * Ese `style` inline lo genero `fix_giscus_mount.mjs` (commit c9895e6). Al
 * combinarlo con `padding: 0 1rem`, el iframe que monta giscus queda 32px mas
 * corto que la caja que lo contiene: el usuario ve una caja pequena centrada en
 * vez de un area de comentarios justificada al ancho de la columna.
 *
 * Que hace este script:
 *   1. Quita el atributo `style` inline del div del widget.
 *   2. Garantiza que el div conserve `class="giscus giscus-container"` e
 *      `id="giscus-comments"`. La clase `giscus` es la que hace que giscus monte
 *      el iframe DENTRO de este div y no cree un div huerfano al final de body.
 *   3. Verifica que la seccion `<section id="comments" class="post-comments">`
 *      siga existiendo y que el widget no conserve el `style` inline.
 *
 * El ancho completo lo pone ahora el CSS (`css/style.css`, seccion
 * "POST COMMENTS (giscus)"), no el HTML: asi el bloque es responsive y se adapta
 * al ancho de la columna en movil sin tener que regenerar 600+ archivos.
 *
 * USO
 *   node projects/scripts/fix_comments_width.mjs          # aplica
 *   node projects/scripts/fix_comments_width.mjs --dry    # solo informa
 *
 * ES IDEMPOTENTE: una segunda pasada sobre archivos ya corregidos produce 0
 * cambios. Valida UTF-8 con TextDecoder fatal y se niega a escribir un archivo
 * que no sea UTF-8 valido. Aborta antes de escribir si se viola un invariante.
 */

import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const DRY = process.argv.includes('--dry');

/** Decodifica a UTF-8 estricto; lanza si los bytes no son UTF-8 valido. */
const utf8 = new TextDecoder('utf-8', { fatal: true });

/**
 * Buena parte de los posts de este repo empiezan con BOM (EF BB BF). El
 * `TextDecoder` se lo come al decodificar, asi que hay que detectarlo en los
 * bytes crudos y reponerlo al escribir: si no, cada reescritura borra el BOM y
 * ensucia el diff de 600+ archivos con un cambio que no pretendimos.
 */
const hasBom = (buf) =>
  buf.length >= 3 && buf[0] === 0xef && buf[1] === 0xbb && buf[2] === 0xbf;
const BOM = '\uFEFF';

const SKIP_DIRS = new Set(['node_modules', '.git', '.omo', 'dist', 'build', '.github']);

/** Recorre `blog/` sin seguir enlaces y sin entrar en directorios ruidosos. */
function walkHtml(dir, acc = []) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (e.isSymbolicLink()) continue;
    const full = join(dir, e.name);
    if (e.isDirectory()) {
      if (SKIP_DIRS.has(e.name) || e.name.startsWith('.')) continue;
      walkHtml(full, acc);
    } else if (e.isFile() && e.name.toLowerCase().endsWith('.html')) {
      acc.push(full);
    }
  }
  return acc;
}

/** Quita cualquier atributo style inline de una lista de atributos. */
const stripStyle = (attrs) => attrs.replace(/\sstyle="[^"]*"/g, '');

/**
 * Asegura `class="giscus giscus-container"` sin perder las clases que ya
 * hubiera. `giscus` es obligatoria: es el selector que usa giscus para montar
 * el iframe dentro del div.
 */
function ensureGiscusClass(attrs) {
  const m = attrs.match(/\sclass="([^"]*)"/);
  if (!m) return ` class="giscus giscus-container"${attrs}`;
  const set = new Set(m[1].split(/\s+/).filter(Boolean));
  set.add('giscus');
  set.add('giscus-container');
  return attrs.replace(m[0], ` class="${[...set].join(' ')}"`);
}

/** Localiza el div del widget por su id y reconstruye solo sus atributos. */
function fixWidgetDiv(html, file) {
  const re = /<div\b([^>]*\bid="giscus-comments"[^>]*)>/g;
  let count = 0;
  const out = html.replace(re, (_full, attrs) => {
    count++;
    const cleaned = ensureGiscusClass(stripStyle(attrs)).replace(/\s+/g, ' ').trimEnd();
    return `<div${cleaned}>`;
  });
  if (count > 1) {
    throw new Error(`${file}: se esperaba 1 div #giscus-comments, hay ${count}`);
  }
  return { html: out, count };
}

/** Invariantes que se comprueban antes de permitir la escritura. */
function assertIntact(before, after, file) {
  const secRe = /<section\b[^>]*\bid="comments"[^>]*>/g;
  const n = (before.match(secRe) || []).length;
  if (n !== 1) throw new Error(`${file}: se esperaba 1 <section id="comments">, hay ${n}`);

  const widget = after.match(/<div\b[^>]*\bid="giscus-comments"[^>]*>/);
  if (!widget) throw new Error(`${file}: el div #giscus-comments desaparecio`);
  if (/\sstyle=/.test(widget[0])) {
    throw new Error(`${file}: el div #giscus-comments conserva un style inline`);
  }
  if (!/\bclass="[^"]*\bgiscus\b[^"]*"/.test(widget[0])) {
    throw new Error(`${file}: el widget quedo sin la clase "giscus"`);
  }
  // La seccion de comentarios debe seguir cerrando antes del footer: si el
  // bloque se moviera debajo, el lector nunca lo veria (que fue el defecto
  // original que corrigio c9895e6).
  const startIdx = after.search(/<section\b[^>]*\bid="comments"/);
  const secEnd = after.indexOf('</section>', startIdx);
  const footIdx = after.indexOf('id="site-footer"');
  if (secEnd === -1) throw new Error(`${file}: la seccion de comentarios no cierra`);
  if (footIdx !== -1 && secEnd > footIdx) {
    throw new Error(`${file}: la seccion de comentarios quedo despues del footer`);
  }
}

const blogDir = join(ROOT, 'blog');
if (!existsSync(blogDir)) {
  console.error('No existe blog/ en ' + ROOT);
  process.exit(1);
}

let scanned = 0, changed = 0, widgets = 0, noSection = 0, skipped = 0;
const failures = [];
const withoutSection = [];

for (const file of walkHtml(blogDir)) {
  scanned++;
  const raw = readFileSync(file);
  const bom = hasBom(raw);
  let before;
  try {
    before = utf8.decode(raw);
  } catch {
    skipped++;
    continue; // no es UTF-8 valido: no lo tocamos
  }

  if (!/<section\b[^>]*\bid="comments"/.test(before)) {
    noSection++;
    withoutSection.push(relative(ROOT, file).replace(/\\/g, '/'));
  }

  let after;
  try {
    const r = fixWidgetDiv(before, file);
    after = r.html;
    widgets += r.count;
  } catch (e) {
    failures.push(e.message);
    continue;
  }

  if (after === before) continue;

  try {
    assertIntact(before, after, relative(ROOT, file).replace(/\\/g, '/'));
  } catch (e) {
    failures.push(e.message);
    continue;
  }

  changed++;
  if (!DRY) writeFileSync(file, (bom ? BOM : '') + after, 'utf8');
}

console.log(`blog/**/*.html escaneados   : ${scanned}`);
console.log(`div #giscus-comments vistos : ${widgets}`);
console.log(`archivos a reescribir       : ${changed}${DRY ? '   (DRY: no se escribio nada)' : ''}`);
console.log(`sin <section id="comments"> : ${noSection} -> ${withoutSection.join(', ') || '-'}`);
console.log(`saltados por UTF-8 invalido : ${skipped}`);

if (failures.length) {
  console.error('\nABORTADO: invariantes violadas');
  for (const f of failures) console.error('  - ' + f);
  process.exit(1);
}
