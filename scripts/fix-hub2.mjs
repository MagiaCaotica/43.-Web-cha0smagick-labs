// Fix de contaminacion de idioma en las configs de deepen-hub.mjs (lote 2).
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const F = path.join(ROOT, 'scripts', 'deepen-hub.mjs');

const MAP = [
  ['que主导 las tiendas', 'que dominan las tiendas'],
  ['como te不认识 el mundo', 'como te presentas al mundo'],
  ['orbitas circulares promediadas:lanes, rapidas, con error', 'orbitas circulares promediadas, rapidas, con error'],
  ['y algunasannerreach 470 al ano', 'y algunas llegan a 470 al ano']
];

let s = fs.readFileSync(F, 'utf8');
let ok = 0;
for (const [from, to] of MAP) {
  if (s.includes(from)) { s = s.split(from).join(to); ok++; }
  else console.log('NO ENCONTRADO:', from);
}
fs.writeFileSync(F, s);
console.log('fix aplicados: ' + ok + '/' + MAP.length);