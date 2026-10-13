// scripts/fix-lang.mjs — repara contaminación de idioma en scripts/gen-es-deepA.mjs
// y escanea restos (CJK/cirílico/árabe) en scripts y HTML ES generados.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

const REPL = [
  ['practicantes_query', 'practicantes'],
  ['los primeros interrupted la señal al despertar', 'los primeros no capturan la señal al despertar'],
  ['Un registro de_entry con solo tres campos—jsii: dónde estaba, qué veía',
    'Un registro de entrada con solo tres campos: dónde estaba, qué veía'],
  ['no te frustres:。夜 despertar dentro de un sueño lúcido',
    'no te frustres: despertar dentro de un sueño lúcido'],
  ['Laweed de duración viene sola después', 'El aumento de duración viene solo después'],
  ['La «» de "no recuerdo" también es un dato, yWrite consistently improves',
    'La anotación de "no recuerdo" también es un dato, y registrar de forma constante mejora tu recuerdo durante la práctica.'],
  ['chen un sueño lúcido por semana', 'alcanzan un sueño lúcido por semana'],
];

const src = path.join(ROOT, 'scripts', 'gen-es-deepA.mjs');
let code = fs.readFileSync(src, 'utf8');
let applied = 0;
for (const [bad, good] of REPL) {
  if (code.includes(bad)) { code = code.split(bad).join(good); applied++; }
  else console.log(`  (no encontrado) ${JSON.stringify(bad.slice(0, 40))}`);
}
fs.writeFileSync(src, code);
console.log(`gen-es-deepA.mjs: ${applied}/${REPL.length} reemplazos aplicados`);

// Escaneo: CJK, cirílico, árabe, y comillas angulares vacías
const BAD = /[぀-ヿ㐀-䶿一-鿿가-힯Ѐ-ӿ؀-ۿ«»]/;
const scan = [];
const files = [
  ...fs.readdirSync(path.join(ROOT, 'scripts')).filter(f => f.startsWith('gen-es-')).map(f => path.join(ROOT, 'scripts', f)),
  ...fs.readdirSync(path.join(ROOT, 'blog')).filter(f => f.startsWith('es-') && f.endsWith('.html')).map(f => path.join(ROOT, 'blog', f)),
];
for (const f of files) {
  const lines = fs.readFileSync(f, 'utf8').split('\n');
  lines.forEach((l, i) => {
    const chars = [...l].filter(c => BAD.test(c));
    if (chars.length) scan.push(`${path.basename(f)}:${i + 1} [${[...new Set(chars)].join('')}] ${l.trim().slice(0, 120)}`);
  });
}
console.log(`\n=== Residuos: ${scan.length} ===`);
console.log(scan.slice(0, 25).join('\n') || '(ninguno)');