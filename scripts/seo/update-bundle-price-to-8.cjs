#!/usr/bin/env node
/**
 * Actualiza precios y conteo del bundle tras anadir el Catholiconomicon.
 *
 * HECHOS (verificados leyendo cada pagina de libro, no supuestos):
 *   7 libros individuales: 4.99 + 3.99 + 3.99 + 9.99 + 3.99 + 9.99 + 3.99 = 40.93
 *   + Catholiconomicon                                        =  9.99
 *   total nuevo                                              = 50.92
 *   bundle nuevo                                             = 24.99
 *   descuento: (50.92 - 24.99) / 50.92 = 50.9%  ->  51% off
 *
 * HALLAZGO: las 637 paginas de blog declaraban un total de US$41.93 y "52% off".
 * Ese 41.93 nunca cuadro con la suma real (40.93); los blogs eran coherentes
 * consigo mismos pero partian de un total inflado en un dolar. Aqui se
 * corrige al total real de 50.92 y el descuento queda en 51%.
 *
 * El bundle ahora contiene los 8 libros, asi que NO se protege ninguna frase
 * para conservar un "7": todas las menciones del bundle pasan a 8.
 *
 * Uso:  node update-bundle-price-to-8.cjs [--dry]
 */
const fs = require('fs');
const p = require('path');
const DRY = process.argv.includes('--dry');

// Ficheros que el usuario tiene modificados y este script no debe tocar.
const FOREIGN = new Set([
  'books/mind-the-gap-pdf.html',
  'landing-pages/apps-bundle.html',
  'tools/tengwar-transcriber.html',
]);
const SKIP = /(^|[\\/])(node_modules|\.git|vendor|projects|docs)([\\/]|$)/;

// Orden importa: las frases largas primero, para que no se pisen con las cortas.
const REPLACEMENTS = [
  // --- frases de bundle en ingles ---
  ['7 esoteric books at 52% off', '8 books at 51% off'],
  ['all seven books', 'all eight books'],
  ['seven books', 'eight books'],
  // --- precios ---
  ['$19.99', '$24.99'],
  ['US$19.99', 'US$24.99'],
  ['$40.93', '$50.92'],
  ['US$41.93', 'US$50.92'],
  ['US$40.93', 'US$50.92'],
  ['41.93', '50.92'],
  // --- porcentaje suelto que solo aparece junto al bundle ---
  ['52% off', '51% off'],
  ['52% de descuento', '51% de descuento'],
  // --- conteo del bundle ---
  ['7 libros ·', '8 libros ·'],
  ['los 7 libros', 'los 8 libros'],
  ['bundle de los 7', 'bundle de los 8'],
  // --- conteo del catalogo (frases que sobrevivieron al dry-run) ---
  ['7 esoteric books', '8 books'],
  ['7 Esoteric Books', '8 Books'],
  ['7 Books', '8 Books'],
  ['7 books', '8 books'],
  ['7 Libros', '8 Libros'],
  ['7 libros', '8 libros'],
];

// Frases que se reportan para revision manual en vez de tocarse a ciegas.
const REVIEW_PATTERNS = [
  /7\s+(?:esoteric\s+)?books/gi,
  /7\s+libros/gi,
  /siete\s+libros/gi,
];

const stats = { scanned: 0, changed: 0, replacements: 0 };
const changedFiles = [];
const skippedForeign = [];
const review = [];

function w(d, acc) {
  let ents;
  try { ents = fs.readdirSync(d, { withFileTypes: true }); } catch (x) { return; }
  for (const e of ents) {
    const a = p.join(d, e.name);
    if (SKIP.test(a)) continue;
    if (e.isDirectory()) { w(a, acc); continue; }
    if (e.name.endsWith('.html')) acc.push(a);
  }
}

const files = [];
w('.', files);

for (const abs of files) {
  const rel = abs.replace(/\\/g, '/');
  stats.scanned++;
  if (FOREIGN.has(rel)) { skippedForeign.push(rel); continue; }
  let c;
  try { c = fs.readFileSync(abs, 'utf8'); } catch (x) { continue; }
  if (!c) continue;

  let out = c;
  let n = 0;
  for (const [from, to] of REPLACEMENTS) {
    const k = out.split(from).length - 1;
    if (k > 0) { out = out.split(from).join(to); n += k; }
  }
  if (out === c) continue;

  // Revision de frases de conteo que PODRIAN quedar sin tocar.
  for (const pat of REVIEW_PATTERNS) {
    pat.lastIndex = 0;
    const m = out.match(pat);
    if (m && m.length) {
      // Se ignoran las que ya son 8 (no pueden matchear "7").
      review.push({ file: rel, found: [...new Set(m)].slice(0, 6) });
    }
  }

  stats.changed++;
  stats.replacements += n;
  changedFiles.push({ file: rel, n });
  if (!DRY) fs.writeFileSync(abs, out, 'utf8');
}

console.log(`=== ${DRY ? 'DRY-RUN (no se escribio nada)' : 'APLICADO'} ===`);
console.log(`  ficheros analizados : ${stats.scanned}`);
console.log(`  ficheros modificados: ${stats.changed}`);
console.log(`  reemplazos totales  : ${stats.replacements}`);
console.log(`  omitidos (tus)      : ${skippedForeign.length} -> ${skippedForeign.join(', ')}`);

// Resumen por archivo, agrupado, sin volcar 637 lineas.
console.log('\n=== ficheros por cantidad de reemplazos ===');
const sorted = changedFiles.sort((a, b) => b.n - a.n);
sorted.slice(0, 15).forEach(x => console.log(`  ${String(x.n).padStart(3)}x  ${x.file}`));
if (sorted.length > 15) console.log(`  ... y ${sorted.length - 15} ficheros mas`);

console.log('\n=== RESIDUOS QUE REQUIEREN REVISION MANUAL ===');
if (!review.length) {
  console.log('  ninguno: no queda ninguna frase con "7 libros/seven books/7 books"');
} else {
  const porPatron = new Map();
  for (const r of review) for (const f of r.found) {
    porPatron.set(f, (porPatron.get(f) || 0) + 1);
  }
  console.log('  frases con "7" que sobrevivieron:');
  [...porPatron.entries()].sort((a, b) => b[1] - a[1]).forEach(([f, n]) =>
    console.log(`    ${String(n).padStart(4)}x  "${f}"`));
  console.log('\n  primeros 5 ficheros donde aparecen:');
  review.slice(0, 5).forEach(r => {
    console.log(`    ${r.file}  ->  ${r.found.join(', ')}`);
  });
}
console.log('\n=== control: precios viejos que deben quedar en 0 ===');
let v19 = 0, v41 = 0, v40 = 0, v52 = 0;
for (const abs of files) {
  let c;
  try { c = fs.readFileSync(abs, 'utf8'); } catch (x) { continue; }
  if (!c) continue;
  v19 += (c.split('$19.99').length - 1);
  v41 += (c.split('41.93').length - 1);
  v40 += (c.split('$40.93').length - 1);
  v52 += (c.split('52% off').length - 1);
}
console.log(`  $19.99  : ${v19}`);
console.log(`  41.93   : ${v41}`);
console.log(`  $40.93  : ${v40}`);
console.log(`  52% off : ${v52}`);