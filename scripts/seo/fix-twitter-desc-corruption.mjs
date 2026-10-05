#!/usr/bin/env node
/**
 * fix-twitter-desc-corruption.mjs
 * ------------------------------------------------------------------
 * Repara paginas cuyo <meta name="twitter:description"> tiene el valor de
 * `content` TERMINADO INCORRECTAMENTE: el valor contiene un "<" sin
 * escapar, arrastra el marcado siguiente (incluyendo <meta anidados)
 * hasta encontrar una comilla posterior.
 *
 * Contexto: un String.replace() previo uso "$1" dentro del texto de
 * reemplazo, y "$1" se expandio a la captura literal. Esto ocurrio en
 * blog/christmas-gift-guide-occult-apps-under-10.html (ya corregido) y en
 * blog/astrology-apps-android-guide.html.
 *
 * ⚠️ LECCION DURA (por que este script NO hace un replace ciego):
 * Un primer intento uso
 *     /<meta name="twitter:description"[\s\S]*?(?=<meta name="twitter:creator")/i
 * El dry-run marco 515 ficheros, porque ese patron tambien describe la
 * estructura NORMAL y bien formada del sitio (twitter:description ->
 * twitter:creator). Aplicarlo habria borrado ~300-3500 chars de head
 * legitimo por pagina (twitter:image, og:*, scripts). Detenido en
 * dry-run, nunca aplicado.
 *
 * Este script SOLO toca un fichero si primero demuestra corrupcion:
 * extrae el valor real del atributo content y comprueba que contiene "<".
 *
 * Estrategia de reparacion (no reconstruir texto a mano desde un valor
 * corrupto): tomar el <meta name="description"> de la misma pagina, que
 * si esta bien formado, recortarlo a 160 chars renderizados, y reconstruir
 * el tramo twitter:description -> twitter:creator con una sola etiqueta
 * limpia. Esto elimina de paso cualquier <meta anidado tragado.
 *
 * Idempotente: si no hay corrupcion, no hace nada.
 *
 * Uso:
 *   node scripts/seo/fix-twitter-desc-corruption.mjs         # dry-run
 *   node scripts/seo/fix-twitter-desc-corruption.mjs --write
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const WRITE = process.argv.includes('--write');
const DESC_MAX = 160;

const ENTITIES = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': "'",
  '&apos;': "'",
  '&mdash;': '\u2014',
  '&ndash;': '\u2013',
  '&middot;': '\u00b7',
  '&hellip;': '\u2026',
  '&rsquo;': '\u2019',
  '&lsquo;': '\u2018',
  '&ldquo;': '\u201c',
  '&rdquo;': '\u201d',
};
const dec = (s) =>
  s.replace(/&(?:amp|lt|gt|quot|apos|mdash|ndash|middot|hellip|rsquo|lsquo|ldquo|rdquo|#39);/g, (m) => ENTITIES[m] ?? m);
const esc = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

function clipWords(s, max) {
  const t = s.trim();
  if (t.length <= max) return t;
  const kept = [];
  let n = 0;
  for (const w of t.split(/\s+/)) {
    const add = kept.length === 0 ? w.length : w.length + 1;
    if (n + add > max) break;
    kept.push(w);
    n += add;
  }
  if (!kept.length) return t.slice(0, max).trimEnd();
  let out = kept.join(' ');
  // Preferir un corte en frontera de clausula (coma / punto y coma) si no
  // cuesta casi longitud: "…app review," es mucho mas legible que
  // "…app review, feature" (que es como quedo una repair anterior).
  const tail = out.slice(Math.floor(max * 0.6));
  const comma = Math.max(tail.lastIndexOf(', '), tail.lastIndexOf('; '));
  if (comma !== -1) out = out.slice(0, Math.floor(max * 0.6) + comma);
  return out.replace(/[\s,;:.\u2014\u2013-]+$/, '');
}

/**
 * Localiza el valor REAL de un atributo content dentro de la ventana de la
 * etiqueta. Devuelve {value, wellFormed, tagEnd} sin decodificar.
 * wellFormed === false cuando el valor contiene "<" (esta tragando markup).
 */
function readContentAt(html, tagIndex) {
  const tagEnd = html.indexOf('>', tagIndex);
  if (tagEnd === -1) return null;
  const tag = html.slice(tagIndex, tagEnd + 1);
  const m = tag.match(/content\s*=\s*"([^"]*)"/i) || tag.match(/content\s*=\s*'([^']*)'/i);
  if (!m) return null;
  return { value: m[1], wellFormed: !m[1].includes('<'), tagEnd };
}

function repair(html, rel) {
  const start = html.search(/<meta\s+name=["']twitter:description["']/i);
  if (start === -1) return { rel, changed: false, why: 'sin twitter:description' };

  const probe = readContentAt(html, start);
  if (!probe) return { rel, changed: false, why: 'twitter:description sin content legible' };
  if (probe.wellFormed) return { rel, changed: false, why: 'sano' };

  // Texto de origen: el <meta name="description"> de la misma pagina.
  const dIdx = html.search(/<meta\s+name=["']description["']/i);
  let text = null;
  if (dIdx !== -1) {
    const d = readContentAt(html, dIdx);
    if (d && d.wellFormed) text = dec(d.value);
  }
  if (!text) {
    // Fallback: prefijo legible del valor corrupto, hasta el primer "<".
    text = dec(probe.value.split('<')[0]).trim();
  }
  if (!text) return { rel, changed: false, why: 'sin texto de origen recuperable' };

  text = clipWords(text.replace(/\s+/g, ' '), DESC_MAX);

  // Reconstruir el tramo hasta (sin incluir) twitter:creator.
  const creator = html.search(/<meta\s+name=["']twitter:creator["']/i);
  const spanEnd = creator !== -1 && creator > start ? creator : probe.tagEnd + 1;
  const removed = html.slice(start, spanEnd);

  const clean = `<meta name="twitter:description" content="${esc(text)}">\n  `;
  const out = html.slice(0, start) + clean + html.slice(spanEnd);

  const newStart = out.search(/<meta\s+name=["']twitter:description["']/i);
  const after = readContentAt(out, newStart);
  const headEnd = out.indexOf('</head>');
  const nestedLeft = /content\s*=\s*"[^"]*</.test(headEnd === -1 ? out : out.slice(0, headEnd));

  return {
    rel,
    changed: true,
    removedLen: removed.length,
    text,
    renderedLen: text.length,
    wellFormed: Boolean(after && after.wellFormed) && !nestedLeft,
    html: out,
  };
}

// ---- walk: solo HTML del sitio -------------------------------------------
const SKIP = new Set(['node_modules', '.git', '.github', 'projects', 'vendor', 'auto-shorts']);
const files = [];
(function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP.has(e.name)) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith('.html')) files.push(p);
  }
})(ROOT);

const fixed = [];
const audited = files.length;
for (const abs of files) {
  const r = repair(fs.readFileSync(abs, 'utf8'), path.relative(ROOT, abs));
  if (r.changed) {
    fixed.push(r);
    if (WRITE) fs.writeFileSync(abs, r.html, 'utf8');
  }
}

console.log(`${WRITE ? 'WRITE' : 'DRY-RUN'}  ${audited} HTML auditados · ${fixed.length} corruptos\n`);
for (const r of fixed) {
  console.log(`  FIX  ${r.rel}`);
  console.log(`       tramo eliminado: ${r.removedLen} chars`);
  console.log(`       texto nuevo: ${r.renderedLen} chars renderizados (<= ${DESC_MAX})`);
  console.log(`       bien formado: ${r.wellFormed ? 'si' : 'NO'}`);
  console.log(`       texto: ${r.text}`);
  console.log('');
}
const bad = fixed.filter((r) => !r.wellFormed).length;
console.log(`${fixed.length} reparados · ${bad} siguen mal formados`);
if (!WRITE && fixed.length) console.log('(dry-run: nada escrito)');
