// Repara gen-es-deep1.mjs (truncado por el agente) conservando los 7 posts completos.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const P = path.join(path.dirname(fileURLToPath(import.meta.url)), 'gen-es-deep1.mjs');
const lines = fs.readFileSync(P, 'utf8').split('\n');

const i8 = lines.findIndex((l) => /slug:\s*'es-servitor-primer-servidor'/.test(l));
if (i8 < 0) { console.log('FAIL: no se encontro el post 8'); process.exit(1); }

const kept = lines.slice(0, i8);
while (kept.length && !kept[kept.length - 1].trim()) kept.pop();

const tail = `
]; // fin POSTS

export { page, B };

let ok = 0, bad = 0;
for (const p of POSTS) {
  try {
    const out = path.join(R, 'blog', p.slug + '.html');
    fs.writeFileSync(out, page(p));
    ok++;
  } catch (e) {
    bad++;
    console.log('FAIL ' + p.slug + ' -> ' + e.message);
  }
}
console.log('OK ' + ok + ' / FAIL ' + bad);
`;

fs.writeFileSync(P, kept.join('\n') + tail);
console.log('deep1 reparado: ' + kept.length + ' lineas conservadas, 7 posts, write loop agregado');