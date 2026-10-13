// scripts/fix-compare2.mjs — corrige residuos en gen-es-compare2.mjs y reporta restos
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const R = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const f = path.join(R, 'scripts', 'gen-es-compare2.mjs');
let s = fs.readFileSync(f, 'utf8');
const before = s.length;

const FIX = [
  ['Chequeo de realidad y 눈 skills', 'Chequeo de realidad y entrenamiento'],
  ['−Al结束的 curso', '−Al terminar el curso'],
  ['Comprar por separado da灵活性 y freedom', 'Comprar por separado da libertad'],
  ['app para.hexagramas que quieres consultar al momento', 'app para consultar hexagramas al momento'],
  ['no sefy opciones excluyentes', 'no son opciones excluyentes'],
  ['la app para.hexagramas', 'la app para consultar hexagramas'],
];
let n = 0;
for (const [a, b] of FIX) {
  if (s.includes(a)) { s = s.split(a).join(b); n++; }
}
fs.writeFileSync(f, s);
console.log(`fix compare2: ${n}/${FIX.length}, ${before} -> ${s.length} chars`);

// reporte de restos sospechosos: punto dentro de palabra o palabras no españolas
const leftovers = [];
s.split('\n').forEach((l, i) => {
  const d = l.match(/[a-záéíóúñ]{2,}\.[a-záéíóúñ]{2,}/g);
  const bad = l.match(/[\u0400-\u04FF\u3000-\u303F\u4E00-\u9FFF\uAC00-\uD7AF\u0600-\u06FF\uFFFD]/g);
  const en = l.match(/\b(freedom|skills|understanding|advanced|content|working|serial|starts|shows|needs|keeps|gives|holds|sefy|fyte)\b/gi);
  if (d || bad || en) leftovers.push(`L${i + 1} ${[...(d || []), ...(bad || []), ...(en || [])].join(' | ')} :: ${l.trim().slice(0, 160)}`);
});
console.log('restos: ' + leftovers.length);
leftovers.forEach((x) => console.log('  ' + x));