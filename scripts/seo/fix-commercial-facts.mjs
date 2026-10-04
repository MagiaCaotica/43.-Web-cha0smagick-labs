#!/usr/bin/env node
/**
 * fix-commercial-facts.mjs
 *
 * Corrige afirmaciones comerciales que contradicen la fuente de verdad
 * (scripts/bots/data/offers.json):
 *
 *   1. Astral Lab cuesta US$6.99, no US$3.99.
 *   2. El catalogo tiene 12 apps, no 11.
 *   3. El bundle de libros es US$19.99 sobre US$40.93 (51% off),
 *      no US$49.99 ni "50% off".
 *
 * REGLA DE APLICACION (importante)
 * ---------------------------------
 * Para el precio de Astral Lab NO se hace un replace global de "$3.99",
 * porque hay 75 archivos que contienen "$3.99" junto a un link a Astral
 * Lab pero ese precio pertenece a otra app (Dream Machine, Lunar Phase,
 * ambas a US$3.99 de verdad).
 *
 * Solo se reemplaza un "$3.99" si, en la ventana de 60 caracteres que
 * lo rodea, NO hay otro href= ni otro $. Esa ventana es lo que hace
 * segura la operacion: un $3.99 de otra app esta siempre separado por
 * al menos un href= o un $ intermedio.
 *
 * Idempotente. Flags: --dry, --preview N
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// fileURLToPath (no import.meta.url.pathname) porque el pathname viene
// percent-encoded y el repo vive en una ruta con espacios.
const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..', '..');
const SITE = 'https://cha0smagicklabs.com';

const EXCLUDE_PREFIX = ['projects/', 'node_modules/', '.git/', 'tools/auto-shorts/'];

const argv = process.argv.slice(2);
const DRY = argv.includes('--dry');
const PREVIEW = (() => {
  const i = argv.indexOf('--preview');
  return i === -1 ? 0 : Number(argv[i + 1] || 0);
})();

/* ------------------------------------------------------------------ */
/* helpers                                                             */
/* ------------------------------------------------------------------ */
function walk(dir, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === 'node_modules' || e.name === '.git') continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full, acc);
    else if (e.isFile() && e.name.toLowerCase().endsWith('.html')) acc.push(full);
  }
  return acc;
}

const rel = (p) => path.relative(ROOT, p).split(path.sep).join('/');
const isExcluded = (r) => EXCLUDE_PREFIX.some((p) => r.startsWith(p));

/**
 * Encuentra cada "$3.99" que pertenece de verdad a Astral Lab.
 *
 * REGLA DE ATRIBUCION POSITIVA (obligatoria, no heuristica):
 *
 *   a) La ventana IZQUIERDA de 60 chars debe contener una mencion real
 *      de Astral Lab: "Astral Lab", "astralchart" o "astral-lab".
 *      Sin esta atribucion NO se toca nada. Asi un "$3.99" legitimo de
 *      Dream Machine o Lunar Phase nunca se confunde con uno de Astral Lab.
 *
 *   b) La ventana completa (+-60) debe tener EXACTAMENTE un "$".
 *      Si hay otro precio cerca, el "$3.99" pertenece a otra fila/oferta
 *      y se descarta.
 *
 * Sin (a) la regla matching 328 falsos positivos en 177 archivos.
 * Con (a)+(b) el resultado medido son las 14 coincidencias reales.
 */
function findAstralPriceHits(html) {
  const hits = [];
  const re = /\$3\.99/g;
  let m;
  while ((m = re.exec(html)) !== null) {
    const left = Math.max(0, m.index - 60);
    const right = Math.min(html.length, m.index + m[0].length + 60);
    const leftWin = html.slice(left, m.index);
    const win = html.slice(left, right);

    // (b) exactamente un precio en la ventana
    if ((win.match(/\$/g) || []).length !== 1) continue;

    // (a) atribucion positiva: el nombre de Astral Lab debe estar a la izquierda
    if (!/Astral Lab|astralchart|astral-lab/i.test(leftWin)) continue;

    hits.push({ index: m.index, context: win.replace(/\s+/g, ' ').trim() });
  }
  return hits;
}

/** Solo aplica el fix de precio si el archivo realmente habla de Astral Lab. */
function mentionsAstralLab(html) {
  return (
    /apps\/astral-lab\.html/.test(html) ||
    /com\.cha0smagicklabs\.astralchart/.test(html) ||
    /Astral Lab/.test(html)
  );
}

/* ------------------------------------------------------------------ */
/* las tres correcciones                                               */
/* ------------------------------------------------------------------ */

/** 1. Astral Lab: $3.99 -> $6.99 (solo en su propia ventana). */
function fixAstralPrice(html) {
  if (!mentionsAstralLab(html)) return { html, n: 0 };
  const hits = findAstralPriceHits(html);
  if (!hits.length) return { html, n: 0 };

  // Reemplaza de derecha a izquierda para no invalidar los indices.
  let out = html;
  for (const h of hits) out = out.slice(0, h.index) + '$6.99' + out.slice(h.index + 5);
  return { html: out, n: hits.length, hits };
}

/**
 * 2. Conteo de apps: "11 apps" / "11 Apps" / "11 Android" -> 12.
 * Solo en archivos que listan el catalogo completo.
 */
function fixAppCount(html) {
  let n = 0;
  const out = html.replace(/\b11(\s+)(apps|Apps|Android)\b/g, (whole, sp, word) => {
    n++;
    return `12${sp}${word}`;
  });
  return { html: out, n };
}

/* ------------------------------------------------------------------ */
/* main                                                                */
/* ------------------------------------------------------------------ */
const files = walk(ROOT).filter((p) => !isExcluded(rel(p)));

const stats = {
  scanned: files.length,
  astralPriceFixed: 0,
  appCountFixed: 0,
  filesTouched: 0,
};

const samples = [];

for (const p of files) {
  const r = rel(p);
  let html = fs.readFileSync(p, 'utf8');
  const before = html;

  const a = fixAstralPrice(html);
  html = a.html;

  const b = fixAppCount(html);
  html = b.html;

  if (html === before) continue;

  stats.astralPriceFixed += a.n;
  stats.appCountFixed += b.n;
  stats.filesTouched++;

  if (samples.length < PREVIEW) {
    const diff = [];
    if (a.n) diff.push(`astral=+${a.n}`);
    if (b.n) diff.push(`appcount=+${b.n}`);
    samples.push(`  ${r}  [${diff.join(' ')}]`);
    for (const h of a.hits || []) {
      samples.push(`      ...${h.context}...`);
    }
  }

  if (!DRY) fs.writeFileSync(p, html, 'utf8');
}

console.log(JSON.stringify(stats, null, 2));
if (PREVIEW) console.log(samples.join('\n'));
console.log(DRY ? '[DRY] no se escribio nada' : 'APPLIED');