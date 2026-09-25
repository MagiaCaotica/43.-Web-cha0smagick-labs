/**
 * fix-mojibake.mjs — repara secuencias UTF-8 leidas como Latin-1.
 *
 * Mojibake = texto UTF-8 que alguien decodifico como Latin-1 y vuelto a
 * guardar. El sintoma son caracteres de supplementation y signos rippedos:
 *   U+00C3 "Ã" + U+00A9 "©"  ->  "é"   (UTF-8 de 2 bytes leido como Latin-1)
 *   U+00E2 "â" + U+20AC "€"  ->  "—"   (UTF-8 de 3 bytes leido como Latin-1)
 *
 * Por eso el detector NO puede usar una clase de caracteres generica: el
 * prefijo es U+00C2/C3 (2 bytes) o U+00E0/E1/E2/EA/EB (3 bytes), y el resto
 * cae fuera de Latin-1 (U+2000+, U+20AC, U+2122...). Se mantiene entonces una
 * lista explicita de pares (malo, bueno): doble fuente de verdad, cero falsos
 * positivos sobre texto espanol legitimo como "años" o "corazón".
 *
 * Idempotente: si no encuentra nada que arreglar, sale con codigo 0.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = path.join(ROOT, 'js', 'conversion.js');

// [mojibake, texto correcto]
const FIXES = [
  // --- 2 bytes: prefijo U+00C3 ---
  ['Â¿Te gusta esta herramienta?', '¿Te gusta esta herramienta?'],
  ['ObtÃ©n la app premium de', 'Obtén la app premium de'],
  ['pago Ãºnico', 'pago único'],
  ['ColecciÃ³n', 'Colección'],
  ['prÃ¡ctica', 'práctica'],
  // --- 3 bytes: prefijo U+00E2 ---
  ['âœ¨', '✨'],
  ['â†”', '→'],
  ['â˜…', '★'],
  ['â€”', '—']
];

const raw = fs.readFileSync(TARGET);
let text = raw.toString('utf8');
let fixed = 0;

for (const [bad, good] of FIXES) {
  const parts = text.split(bad);
  if (parts.length > 1) {
    fixed += parts.length - 1;
    text = parts.join(good);
  }
}

if (fixed > 0) {
  fs.writeFileSync(TARGET, text, 'utf8');
  console.log(`OK  ${fixed} secuencia(s) corregida(s) en js/conversion.js`);
}

// Verificacion: ninguno de los paresKnown debe seguir presente.
const remaining = FIXES
  .map(([bad]) => [bad, text.split(bad).length - 1])
  .filter(([, count]) => count > 0);

if (remaining.length) {
  console.error(`FALLO  quedan ${remaining.length} secuencia(s):`);
  for (const [bad, count] of remaining) {
    console.error(`  ${count}x  ${bad}`);
  }
  process.exit(1);
}

console.log('OK  0 secuencias conocidas presentes (archivo limpio)');
