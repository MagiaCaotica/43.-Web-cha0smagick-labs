#!/usr/bin/env node
/**
 * preflight_content.mjs — valida content/<n>.json ANTES de renderizar.
 *
 * Por qué existe: slop.py mide el HTML renderizado (visible words, chrome
 * incluido). Descubrir un fallo ahí cuesta un render + un qa.py completo.
 * Este script lee el JSON y aplica los mismos gates de forma preventiva.
 *
 * Uso:  node projects/scripts/preflight_content.mjs 162 165 167
 *        node projects/scripts/preflight_content.mjs --all-pending
 *
 * Exit 1 si hay cualquier hallazgo.
 *
 * Los BANNED_PHRASES / _CONNECTOR_START_RE / _FORBIDDEN_H2_RE se EXTRAEN de
 * slop.py con regex, no se transcriben a mano: si upstream cambia la lista,
 * este script sigue siendo correcto sin tocarlo.
 */
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const YT = join(ROOT, 'projects', 'data', 'yt-articles');
const BLOG = join(ROOT, 'blog');

/* ------------------------------------------------------------------ */
/* 1. Extraer los gates de slop.py                                     */
/* ------------------------------------------------------------------ */
const slopSrc = readFileSync(join(YT, 'slop.py'), 'utf8');

function extractPyList(name) {
  // Matches: NAME = [ ... ] possibly spanning lines, simple string literals.
  const re = new RegExp(`${name}\\s*=\\s*\\(([^)]*)\\)|${name}\\s*=\\s*\\[([^\\]]*)\\]`, 's');
  const m = slopSrc.match(re);
  if (!m) throw new Error(`no se pudo extraer ${name} de slop.py`);
  const body = m[1] || m[2] || '';
  const out = [];
  const itemRe = /"((?:[^"\\]|\\.)*)"|'((?:[^'\\]|\\.)*)'/g;
  let it;
  while ((it = itemRe.exec(body)) !== null) {
    const raw = it[1] !== undefined ? it[1] : it[2];
    out.push(raw.replace(/\\(.)/g, '$1').toLowerCase());
  }
  return out;
}

/**
 * Los regex de slop.py se escriben con concatenacion implicita de strings en
 * varias lineas, y con flags (`re.IGNORECASE`) despues del patron. Se lee el
 * bloque de parentesis balanceado a partir de `re.compile(`, se concatenan
 * todos los literales que NO sean flags, y se recompila en JS.
 */
function extractPyRegex(name) {
  const start = slopSrc.search(new RegExp(`${name}\\s*=\\s*re\\.compile\\(`));
  if (start === -1) throw new Error(`no se pudo localizar ${name} = re.compile(...) en slop.py`);
  let i = slopSrc.indexOf('(', start);
  let depth = 0, end = -1;
  for (let j = i; j < slopSrc.length; j++) {
    const ch = slopSrc[j];
    if (ch === '(') depth++;
    else if (ch === ')') { depth--; if (depth === 0) { end = j; break; } }
  }
  if (end === -1) throw new Error(`parentesis sin cerrar en ${name}`);
  const block = slopSrc.slice(i + 1, end);

  const pieces = [];
  const litRe = /r?("((?:[^"\\]|\\.)*)"|'((?:[^'\\]|\\.)*)')/g;
  let m;
  while ((m = litRe.exec(block)) !== null) {
    const raw = m[2] !== undefined ? m[2] : m[3];
    if (/^re\.[A-Z]+$/.test(raw)) break;      // We've hit the flags argument
    pieces.push(raw.replace(/\\(.)/g, '$1'));
  }
  if (!pieces.length) throw new Error(`${name}: no se encontro ningun literal de patron`);
  return new RegExp(pieces.join(''), 'i');
}

const BANNED = extractPyList('BANNED_PHRASES');
const CONNECTOR_START = extractPyRegex('_CONNECTOR_START_RE');
const FORBIDDEN_H2 = extractPyRegex('_FORBIDDEN_H2_RE');

const MIN_ANSWER_WORDS = Number(slopSrc.match(/MIN_ANSWER_WORDS\s*=\s*(\d+)/)?.[1] ?? 30);
const NGRAM_N = Number(slopSrc.match(/NGRAM_N\s*=\s*(\d+)/)?.[1] ?? 8);
const NGRAM_MAX = Number(slopSrc.match(/NGRAM_MAX_ARTICLES\s*=\s*(\d+)/)?.[1] ?? 2);

/* ------------------------------------------------------------------ */
/* 2. Utilidades de texto                                              */
/* ------------------------------------------------------------------ */
const words = (s) => String(s).normalize('NFKC')
  .replace(/<[^>]+>/g, ' ')
  .split(/[^A-Za-z0-9'’\-]+/)
  .filter(Boolean);

const sentences = (s) => String(s)
  .split(/(?<=[.!?])\s+(?=[A-Z(“"'*])|\n+/)
  .map((x) => x.trim())
  .filter(Boolean);

function ngrams(text, n) {
  const w = words(text).map((x) => x.toLowerCase());
  const out = new Set();
  for (let i = 0; i + n <= w.length; i++) out.add(w.slice(i, i + n).join(' '));
  return out;
}

/** Todo el texto visible de un content record (lo que gen_yt_articles.py emite). */
function visibleText(rec) {
  const parts = [rec.lede || ''];
  for (const s of rec.sections || []) {
    parts.push(s.h2 || '');
    for (const p of s.p || []) parts.push(p);
    for (const item of s.ol || []) parts.push(item);
    for (const item of s.ul || []) parts.push(item);
    if (s.html) parts.push(s.html.replace(/<[^>]+>/g, ' '));
  }
  for (const [q, a] of rec.faq || []) { parts.push(q); parts.push(a); }
  return parts.join(' ');
}

/* ------------------------------------------------------------------ */
/* 3. Corpus ya existente (para 8-gramas cruzados)                     */
/* ------------------------------------------------------------------ */
const blogSlugs = new Set(
  existsSync(BLOG)
    ? readdirSync(BLOG).filter((f) => f.endsWith('.html')).map((f) => f.slice(0, -5))
    : []
);

const existingNgramCounts = new Map();
/** 8-grama -> n, solo para los articulos del lote que ya se han comprobado. */
const priorInBatch = new Map();
function loadCorpus() {
  existingNgramCounts.clear();
  const dir = join(YT, 'content');
  if (!existsSync(dir)) return;
  for (const f of readdirSync(dir)) {
    if (!/^\d+\.json$/.test(f)) continue;
    if (BATCH_SET.has(Number(f.slice(0, -5)))) continue; // el lote que estamos comprobando
    let rec;
    try { rec = JSON.parse(readFileSync(join(dir, f), 'utf8')); }
    catch { continue; }
    for (const g of ngrams(visibleText(rec), NGRAM_N)) {
      existingNgramCounts.set(g, (existingNgramCounts.get(g) || 0) + 1);
    }
  }
}

/* ------------------------------------------------------------------ */
/* 4. Checks por artículo                                              */
/* ------------------------------------------------------------------ */
const problems = [];
const warnings = [];
function fail(n, code, detail) { problems.push({ n, code, detail }); }
function warn(n, code, detail) { warnings.push({ n, code, detail }); }

function checkArticle(n) {
  const file = join(YT, 'content', `${n}.json`);
  if (!existsSync(file)) { fail(n, 'MISSING', `no existe content/${n}.json`); return; }

  let rec;
  try { rec = JSON.parse(readFileSync(file, 'utf8')); }
  catch (e) { fail(n, 'JSON', e.message); return; }

  // --- forma ---
  for (const k of ['n', 'slug', 'h1', 'seo_title', 'description', 'keywords',
                   'published', 'published_human', 'lede', 'sections', 'faq', 'related']) {
    if (rec[k] === undefined || rec[k] === null) fail(n, 'SHAPE', `falta la clave ${k}`);
  }
  if (rec.n !== n) fail(n, 'SHAPE', `rec.n=${rec.n} pero el fichero es ${n}.json`);
  if (!Array.isArray(rec.faq) || rec.faq.length !== 5) {
    fail(n, 'FAQ-COUNT', `faq tiene ${(rec.faq || []).length} entradas; se exigen 5`);
  }
  if (!Array.isArray(rec.sections) || rec.sections.length < 6) {
    fail(n, 'SECTIONS', `sections=${(rec.sections || []).length}; mínimo razonable 6`);
  }
  for (const k of ['slug', 'seo_title', 'description', 'published_human']) {
    if (typeof rec[k] === 'string' && rec[k].length < 8) {
      fail(n, 'SHORT', `${k} tiene solo ${rec[k].length} caracteres`);
    }
  }
  // El lede no tiene minimo en slop.py; solo se avisa si es anormalmente corto.
  if (typeof rec.lede === 'string' && rec.lede.length < 250) {
    warn(n, 'LEDE-SHORT', `lede de ${rec.lede.length} caracteres; lo habitual en este corpus es 300-400`);
  }

  // --- frases prohibidas, sobre el texto visible ---
  const text = visibleText(rec);
  const lower = text.toLowerCase();
  for (const p of BANNED) {
    if (!p) continue;
    let from = 0, at;
    while ((at = lower.indexOf(p, from)) !== -1) {
      fail(n, 'BANNED', `"${p}" -> ...${lower.slice(Math.max(0, at - 45), at + p.length + 45)}...`);
      from = at + p.length;
      if (problems.length > 400) return;
    }
  }

  // --- conectores al inicio de frase ---
  for (const s of sentences(text)) {
    if (CONNECTOR_START.test(s)) fail(n, 'CONNECTOR', `"${s.slice(0, 90)}"`);
  }

  // --- H2 prohibidas / duplicadas dentro del artículo ---
  const h2s = (rec.sections || []).map((s) => s.h2 || '');
  for (const h of h2s) {
    if (FORBIDDEN_H2.test(h)) fail(n, 'H2-FORBIDDEN', h);
  }
  const seen = new Map();
  for (const h of h2s) {
    const k = h.trim().toLowerCase();
    seen.set(k, (seen.get(k) || 0) + 1);
  }
  for (const [h, c] of seen) if (c > 1) fail(n, 'H2-DUP', `"${h}" aparece ${c} veces`);

  // --- párrafos stub: <10 palabras Y <5 palabras (gate real de slop.py) ---
  const stub = (t) => { const c = words(t).length; return c < 10 && c < 5; };
  for (const [i, s] of (rec.sections || []).entries()) {
    for (const p of s.p || []) if (stub(p)) fail(n, 'STUB-P', `sections[${i}] "${s.h2}" -> "${String(p).slice(0, 60)}"`);
    for (const item of s.ol || []) if (stub(item)) fail(n, 'STUB-OL', `sections[${i}] "${s.h2}"`);
    for (const item of s.ul || []) if (stub(item)) fail(n, 'STUB-UL', `sections[${i}] "${s.h2}"`);
  }

  // --- respuestas de FAQ >= MIN_ANSWER_WORDS; títulos de related >= 5 palabras ---
  for (const [i, [q, a]] of (rec.faq || []).entries()) {
    if (words(a || '').length < MIN_ANSWER_WORDS) {
      fail(n, 'FAQ-SHORT', `faq[${i}] respuesta de ${words(a || '').length} palabras (min ${MIN_ANSWER_WORDS})`);
    }
    if (words(q || '').length < 4) fail(n, 'FAQ-Q-SHORT', `faq[${i}] "${q}"`);
  }
  for (const [i, [slug, title]] of (rec.related || []).entries()) {
    if (!blogSlugs.has(slug)) fail(n, 'REL-SLUG', `related[${i}] "${slug}" no existe en blog/`);
    if (words(title || '').length < 5) {
      fail(n, 'REL-TITLE', `related[${i}] titulo de ${words(title || '').length} palabras (min 5, se emite como <p> suelto) -> "${title}"`);
    }
  }
  if ((rec.related || []).length !== 5) {
    fail(n, 'REL-COUNT', `related tiene ${(rec.related || []).length}; el pipeline espera 5`);
  }

  // --- 8-gramas: dentro del propio articulo y contra el corpus ---
  // qa.py/slop.py solo recibe los ids que se le pasan en la linea de comandos,
  // asi que su `reused_ngrams` es un control DENTRO DEL LOTE. Por eso la
  // colision con otro articulo del lote es ERROR, y la colision con un
  // articulo de un lote anterior solo se reporta como AVISO.
  const mine = new Map();
  for (const g of ngrams(text, NGRAM_N)) mine.set(g, (mine.get(g) || 0) + 1);
  for (const [g, c] of mine) {
    if (c > 1) { fail(n, 'NGRAM-SELF', `repetido ${c}x dentro del articulo: "${g}"`); continue; }
    const prior = existingNgramCounts.get(g) || 0;
    if (prior + c <= NGRAM_MAX) continue;
    const where = priorInBatch.get(g);
    const code = where !== undefined ? 'NGRAM-BATCH' : 'NGRAM-CROSS-LOT';
    const msg = `"${g}"`;
    if (where !== undefined) fail(n, code, `choca con n=${where} del mismo lote: ${msg}`);
    else warn(n, code, `choca con ${prior} articulo(s) de lotes anteriores (qa.py no lo comprueba): ${msg}`);
  }

  return { words: words(text).length, h2: h2s.length, ngrams: ngrams(text, NGRAM_N) };
}

/* ------------------------------------------------------------------ */
/* 5. Main                                                             */
/* ------------------------------------------------------------------ */
const argv = process.argv.slice(2);
let BATCH = [];
let BATCH_SET = new Set();

if (argv.includes('--all-pending')) {
  const dir = join(YT, 'content');
  const specs = JSON.parse(readFileSync(join(YT, 'specs.json'), 'utf8'));
  const arr = Array.isArray(specs) ? specs : (specs.specs || specs.articles || Object.values(specs));
  BATCH = arr.map((s) => s.n).filter((n) => !existsSync(join(dir, `${n}.json`)));
} else {
  BATCH = argv.filter((a) => /^\d+$/.test(a)).map(Number);
}

if (BATCH.length === 0) {
  console.error('uso: node projects/scripts/preflight_content.mjs <ids...> | --all-pending');
  process.exit(2);
}
BATCH = [...new Set(BATCH)].sort((a, b) => a - b);
BATCH_SET = new Set(BATCH);

loadCorpus();

console.log(`gates leidos de slop.py: ${BANNED.length} banned phrases, NGRAM_N=${NGRAM_N}, NGRAM_MAX_ARTICLES=${NGRAM_MAX}, MIN_ANSWER_WORDS=${MIN_ANSWER_WORDS}`);
console.log(`corpus: ${blogSlugs.size} slugs en blog/, ${existingNgramCounts.size} ${NGRAM_N}-gramas ya indexados\n`);

const stats = [];
for (const n of BATCH) {
  const before = problems.length;
  const st = checkArticle(n);
  if (st && st.ngrams) for (const g of st.ngrams) priorInBatch.set(g, n);
  const found = problems.length - before;
  const warned = warnings.filter((w) => w.n === n).length;
  stats.push({ n, st, found, warned });
}

for (const s of stats) {
  const tag = s.found === 0 ? 'OK  ' : 'FAIL';
  const wtag = s.warned ? `  [${s.warned} avisos]` : '';
  console.log(`${tag} n=${s.n}${s.st ? `  palabras=${s.st.words}  h2=${s.st.h2}  ${NGRAM_N}gramas=${s.st.ngrams.size}` : ''}${s.found ? `  (${s.found} problemas)` : ''}${wtag}`);
}

const byCode = new Map();
for (const p of problems) {
  if (!byCode.has(p.code)) byCode.set(p.code, []);
  byCode.get(p.code).push(p);
}
if (byCode.size) {
  console.log('');
  for (const [code, list] of byCode) {
    console.log(`--- ${code} (${list.length})`);
    for (const p of list.slice(0, 40)) console.log(`    n=${p.n}: ${p.detail}`);
    if (list.length > 40) console.log(`    ... y ${list.length - 40} mas`);
  }
}

if (warnings.length) {
  console.log('');
  const wByN = new Map();
  for (const w of warnings) wByN.set(w.n, (wByN.get(w.n) || 0) + 1);
  console.log(`AVISOS (qa.py NO los comprueba: solo mira el lote que se le pasa): ${warnings.length}`);
  for (const [n, c] of wByN) console.log(`    n=${n}: ${c} aviso(s)`);
}

console.log('');
console.log(problems.length ? `PREFLIGHT FAIL: ${problems.length} problemas` : `PREFLIGHT PASS: ${BATCH.length} articulo(s)`);
process.exit(problems.length ? 1 : 0);
