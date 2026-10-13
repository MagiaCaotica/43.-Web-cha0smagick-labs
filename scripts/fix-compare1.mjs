// scripts/fix-compare1.mjs — corrige residuos de idioma en gen-es-compare1.mjs
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const R = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const f = path.join(R, 'scripts', 'gen-es-compare1.mjs');
let s = fs.readFileSync(f, 'utf8');
const before = s.length;

const FIX = [
  ['sueños o Interfaces de azogamiento', 'sueños o azogamiento'],
  ['el trabajo ritual sérieux,Many personas necesitan', 'el trabajo ritual serio: muchas personas necesitan'],
  ['el mazo envejece y se wears', 'el mazo envejece y se desgasta'],
  ['necesitas velocidad o portability', 'necesitas velocidad o portabilidad'],
  ['que la app no mide: la).\\nEs el momento de la intención.', 'que la app no mide: el momento de la intención.'],
  ['practicantes advanced', 'practicantes avanzados'],
  ['velocidad o understanding', 'velocidad o comprensión'],
  ['Included en el bundle de libros', 'Incluido en el bundle de libros'],
  ['Ambas part�n de los mismos datos', 'Ambas parten de los mismos datos'],
  ['part�n', 'parten'],
  ['�', ''],
];
let n = 0;
for (const [a, b] of FIX) {
  if (s.includes(a)) { s = s.split(a).join(b); n++; }
}
fs.writeFileSync(f, s);
console.log(`fix gen-es-compare1.mjs: ${n}/${FIX.length} reemplazos, ${before} -> ${s.length} chars`);