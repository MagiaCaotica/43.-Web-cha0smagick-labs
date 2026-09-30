/**
 * fix_blog_lang_sidebar.mjs
 * ------------------------------------------------------------------
 * Corrige el BOTON DE IDIOMAS desalineado en los posts del BLOG INTERNO.
 *
 * BUG: 179 posts de `blog/` traen un `<style>` inline con reglas del language
 * switcher disenadas para un sidebar pegado a la DERECHA
 * (`.lang-sidebar{right:0}`). Como `css/style.min.css` define
 * `.lang-sidebar{left:0}`, el elemento acaba con `left:0` Y `right:0`
 * a la vez -> `position:fixed` lo ESTIRA a todo el ancho del viewport, y con
 * `align-items:center` el boton de 38px queda CENTRADO en la pagina en vez
 * de pegado al borde izquierdo.
 *
 * FIX: alinear el `<style>` inline con el diseno del sitio (sidebar a la
 * izquierda, `align-items:flex-start`, radios y bordes espejados).
 *
 * Idempotente. Solo toca `blog/`. No modifica `css/style.css` ni ningun otro
 * directorio.
 *
 * Uso:  node projects/scripts/fix_blog_lang_sidebar.mjs [--dry]
 */

import fs from 'node:fs';
import path from 'node:path';

const DRY = process.argv.includes('--dry');
const BLOG_DIR = 'blog';

// --- variante 1 (171 posts) -------------------------------------------------
const V1_SIDEBAR_OLD =
  '.lang-sidebar{position:fixed;top:50%;right:0;transform:translateY(-50%);z-index:9999;display:flex;flex-direction:column;align-items:flex-end;}';
// `!important` is REQUIRED on align-items: `../css/style.min.css` is linked AFTER
// this inline <style>, so its `align-items:center` would otherwise win the tie and
// re-center the 38px button inside the (wider) flag list, leaving a ~12px gap.
const V1_SIDEBAR_NEW =
  '.lang-sidebar{position:fixed;top:50%;left:0;right:auto;transform:translateY(-50%);z-index:9999;display:flex;flex-direction:column;align-items:flex-start !important;}';

// `.lang-toggle-btn` y `.lang-flag-list` comparten este fragmento
const V1_PANEL_OLD = 'border-right:none;border-radius:8px 0 0 8px';
const V1_PANEL_NEW = 'border-left:none;border-radius:0 8px 8px 0';

// --- variante 2 (9 posts) ---------------------------------------------------
const V2_SIDEBAR_OLD =
  '.lang-sidebar{position:fixed;right:0;top:50%;transform:translateY(-50%);z-index:999;}';
const V2_SIDEBAR_NEW =
  '.lang-sidebar{position:fixed;left:0;right:auto;top:50%;transform:translateY(-50%);z-index:999;align-items:flex-start !important;}';

const V2_RADIUS_OLD = 'border-radius:6px 0 0 6px';
const V2_RADIUS_NEW = 'border-radius:0 6px 6px 0';

// --- helpers ----------------------------------------------------------------
function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name.startsWith('.')) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (e.name.endsWith('.html')) out.push(p);
  }
  return out;
}

const decoder = new TextDecoder('utf-8', { fatal: true });

function fixSource(src) {
  const notes = [];

  let out = src;
  if (out.includes(V1_SIDEBAR_OLD)) {
    out = out.split(V1_SIDEBAR_OLD).join(V1_SIDEBAR_NEW);
    notes.push('v1:sidebar');
  }
  if (out.includes(V1_PANEL_OLD)) {
    const n = out.split(V1_PANEL_OLD).length - 1;
    out = out.split(V1_PANEL_OLD).join(V1_PANEL_NEW);
    notes.push(`v1:panels x${n}`);
  }
  if (out.includes(V2_SIDEBAR_OLD)) {
    out = out.split(V2_SIDEBAR_OLD).join(V2_SIDEBAR_NEW);
    notes.push('v2:sidebar');
  }
  if (out.includes(V2_RADIUS_OLD)) {
    const n = out.split(V2_RADIUS_OLD).length - 1;
    out = out.split(V2_RADIUS_OLD).join(V2_RADIUS_NEW);
    notes.push(`v2:radius x${n}`);
  }

  // sanity: no debe quedar ningun lang-sidebar con right:0
  if (/\.lang-sidebar\s*\{[^}]*\bright\s*:\s*0(?!px)/.test(out)) {
    throw new Error('quedo un .lang-sidebar con right:0');
  }
  return { out, notes };
}

// --- main -------------------------------------------------------------------
if (!fs.existsSync(BLOG_DIR)) {
  console.error(`No existe el directorio ${BLOG_DIR}/ - ejecuta desde la raiz del repo.`);
  process.exit(1);
}

const files = walk(BLOG_DIR);
let changed = 0, unchanged = 0, skippedBadEncoding = 0;
const v1files = [], v2files = [];
const details = [];

for (const f of files) {
  const raw = fs.readFileSync(f);
  let src;
  try {
    src = decoder.decode(raw);
  } catch {
    skippedBadEncoding++;
    console.log(`  [SKIP encoding] ${f}`);
    continue;
  }

  let res;
  try {
    res = fixSource(src);
  } catch (err) {
    console.error(`  [ERROR] ${f}: ${err.message}`);
    process.exitCode = 1;
    continue;
  }

  if (res.out === src) { unchanged++; continue; }

  changed++;
  if (res.notes.some((n) => n.startsWith('v1'))) v1files.push(f);
  if (res.notes.some((n) => n.startsWith('v2'))) v2files.push(f);
  details.push(`${f}  ->  ${res.notes.join(', ')}`);

  if (!DRY) fs.writeFileSync(f, res.out, 'utf8');
}

console.log(`\n${DRY ? '[DRY RUN] ' : ''}posts escaneados : ${files.length}`);
console.log(`corregidos          : ${changed}`);
console.log(`sin cambios         : ${unchanged}`);
console.log(`saltados (encoding) : ${skippedBadEncoding}`);
console.log(`  variante 1 (171)  : ${v1files.length}`);
console.log(`  variante 2 (9)    : ${v2files.length}`);

if (details.length && process.env.VERBOSE) {
  console.log('\n--- detalle ---');
  details.forEach((d) => console.log('  ' + d));
}
