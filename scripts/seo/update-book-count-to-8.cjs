#!/usr/bin/env node
/**
 * Actualiza el conteo de libros de 7 a 8 tras anadir Catholiconomicon.
 *
 * REGLA CRITICA
 * -------------
 * El Catholiconomicon es un libro SUELTO de $9.99. NO entra en el bundle.
 * El bundle sigue siendo "los 7 libros" por $19.99.asi que las frases que
 * hablan del BUNDLE deben seguir diciendo 7, y solo el catalogo pasa a 8.
 *
 * Por eso el script protege las frases del bundle con un marcador antes de
 * hacer el reemplazo global, y las restaura despues.
 *
 * Uso: node scripts/seo/update-book-count-to-8.cjs [--dry]
 */
const fs = require('fs');

const DRY = process.argv.includes('--dry');

const FILES = [
  'books/index.html',
  'index.html',
  'landing-pages/complete-access.html',
  'landing-pages/flash-sale.html',
  'lead-magnet/guia-rapida-magia-caos-es.html',
  'lead-magnet/quickstart-guide-chaos-magick-en.html',
];

// Frases del BUNDLE: conservan el 7. Se sustituyen por un marcador seguro.
const BUNDLE_PHRASES = [
  /bundle de los 7/gi,
  /Bundle de los 7/gi,
  /de los 7 por \$19\.99/gi,
  /Los 7 libros en un solo paquete/gi,
  /los 7 libros se distribuyen como PDF y se compran de forma individual/gi,
  /bundle de los 7 libros/gi,
  /los 7 libros por \$19\.99/gi,
];

// Reemplazos de conteo de catalogo: 7 -> 8.
const REPLACEMENTS = [
  [/numberOfItems"?\s*:\s*7\b/g, 'numberOfItems": 8'],
  [/\b7 libros en PDF\b/gi, '8 libros en PDF'],
  [/\b7 libros de ocultismo/gi, '8 libros de ocultismo'],
  [/\b7 libros de caos/gi, '8 libros de caos'],
  [/\bLos 7 libros<\/h2>/gi, 'Los 8 libros</h2>'],
  [/\bSon 7 libros\b/gi, 'Son 8 libros'],
  [/\b7 libros PDF\b/gi, '8 libros PDF'],
  [/\b7 libros\b/gi, '8 libros'],
  [/\b7 books\b/gi, '8 books'],
  [/\b7 Esoteric Books\b/gi, '8 Esoteric Books'],
  [/\b7 esoteric books\b/gi, '8 esoteric books'],
  [/\b7 Libros\b/gi, '8 Libros'],
];

const MARK = '\u0000PROT';
let markN = 0;
const stash = [];

function protect(html) {
  let out = html;
  for (const re of BUNDLE_PHRASES) {
    out = out.replace(re, (m) => {
      const key = `${MARK}${markN++}${MARK}`;
      stash.push([key, m]);
      return key;
    });
  }
  return out;
}

function restore(html) {
  let out = html;
  for (const [key, val] of stash) out = out.split(key).join(val);
  return out;
}

stash.length = 0;
markN = 0;
const report = [];

for (const f of FILES) {
  if (!fs.existsSync(f)) { report.push([f, 'NO EXISTE', 0]); continue; }
  const orig = fs.readFileSync(f, 'utf8');

  let work = protect(orig);
  let n = 0;
  for (const [re, to] of REPLACEMENTS) {
    work = work.replace(re, (m) => { n++; return m.replace(re, to); });
  }
  const out = restore(work);

  if (out !== orig) {
    if (!DRY) fs.writeFileSync(f, out, 'utf8');
    report.push([f, `${n} reemplazos`, n]);
  } else {
    report.push([f, 'sin cambios', 0]);
  }
}

console.log(DRY ? '=== DRY-RUN (no se escribio nada) ===' : '=== APLICADO ===');
for (const [f, msg, n] of report) console.log(`  ${f.padEnd(48)} ${msg}`);
console.log('');
console.log('bundle preservado con "7": comprueba que sigue diciendo "$19.99"');
console.log('y no se cambio ningun precio.');