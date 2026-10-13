// scripts/fix-lang2.mjs — limpieza profunda de contaminación de idioma
// 1) reemplazos dirigidos  2) homoglifos cirílicos->latinos  3) borra CJK restantes
// 4) regenera los posts ES profundos  5) re-escanea
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const S = (f) => path.join(ROOT, 'scripts', f);

// Reemplazos dirigidos (orden: más largos primero)
const MAP = [
  ['看上去', 'método'],
  ['日记', 'diario'],
  ['no te frustres:。夜 despertar', 'no te frustres: despertar'],
  ['no te frustres:。', 'no te frustres:'],
  ['。', '. '],
  ['Laweed de duración viene sola después', 'El aumento de duración viene solo después'],
  ['yWrite consistently improves', 'y registrar de forma constante mejora tu recuerdo durante la práctica'],
  ['«»', ''],
  ['La  de "no recuerdo"', 'La anotación de "no recuerdo"'],
];

// Homoglifos cirílicos -> latinos
const CYR = {
  'а': 'a', 'А': 'A', 'е': 'e', 'Е': 'E', 'о': 'o', 'О': 'O',
  'р': 'p', 'Р': 'P', 'с': 'c', 'С': 'C', 'у': 'y', 'У': 'Y',
  'х': 'x', 'Х': 'X', 'і': 'i', 'І': 'I', 'ј': 'j', 'ѕ': 's', 'һ': 'h',
};
// Bloques a borrar si quedan
const DROP = /[぀-ヿ㐀-䶿一-鿿가-힯؀-ۿ‘-‟]/g;

const FILES = ['gen-es-deep1.mjs', 'gen-es-deepA.mjs', 'gen-es-deep2.mjs', 'gen-es-batch3.mjs', 'gen-es-batch2.mjs', 'gen-es-batch1.mjs'];

for (const f of FILES) {
  const p = S(f);
  if (!fs.existsSync(p)) continue;
  const before = fs.readFileSync(p, 'utf8');
  let t = before;
  for (const [bad, good] of MAP) t = t.split(bad).join(good);
  t = t.replace(/[Ѐ-ӿ]/g, (c) => CYR[c] ?? '');
  t = t.replace(DROP, '');
  if (t !== before) {
    fs.writeFileSync(p, t);
    const removed = before.length - t.length;
    console.log(`fix ${f} (${removed} chars netos)`);
  }
}

// Regenerar posts ES profundos
for (const f of ['gen-es-deep1.mjs', 'gen-es-deepA.mjs', 'gen-es-deep2.mjs']) {
  try {
    const out = execFileSync(process.execPath, [S(f)], { cwd: ROOT, encoding: 'utf8' });
    console.log(`run ${f}: ${out.trim().split('\n').pop()}`);
  } catch (e) {
    console.log(`run ${f}: ERROR ${(e.stdout || '') + (e.stderr || '')}`.slice(0, 300));
  }
}

// Re-escaneo de HTML ES
const BAD = /[Ѐ-ӿ぀-ヿ㐀-䶿一-鿿가-힯؀-ۿ«»。‘’]/;
const hits = [];
const dir = path.join(ROOT, 'blog');
for (const f of fs.readdirSync(dir).filter(f => f.startsWith('es-') && f.endsWith('.html'))) {
  const lines = fs.readFileSync(path.join(dir, f), 'utf8').split('\n');
  lines.forEach((l, i) => {
    const chars = [...new Set([...l].filter(c => BAD.test(c)))];
    if (chars.length) hits.push(`${f}:${i + 1} [${chars.join('')}] ${l.trim().slice(0, 100)}`);
  });
}
console.log(`\n=== Residuos HTML: ${hits.length} ===`);
console.log(hits.slice(0, 20).join('\n') || '(ninguno)');