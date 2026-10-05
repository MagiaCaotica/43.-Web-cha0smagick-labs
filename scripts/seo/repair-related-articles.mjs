#!/usr/bin/env node
// Reconstruye la seccion `related-articles` cuando un script la deja corrupta.
//
// Sintoma (1 pagina de 330): los cuatro enlaces quedaron como
//     <a href="../blog/A.html">s &rarr;</a>
// con el href reducido a una sola letra y el texto a un fragmento. Un
// `String.replace` con un patron de captura se comio el slug. No queda nada que
// preservar: ni el destino ni el titulo.
//
// Que NO se hace aqui: no se inventan articulos relacionados. La senal que se
// usa son los `linkgraph:refs` de la MISMA pagina, que ya son un curado
// topico verificado por el script de cruzados y que se comprueba de nuevo contra
// el disco. Si la pagina no tiene refs propios, la seccion se quita entera en
// vez de llenarse de relleno.
//
// El criterio de seleccion es determinista: se puntua cada ref por palabras
// significativas compartidas con el title de la pagina y se toman las 4
// mejores, en el orden en que ya estaban. Mismo criterio, mismo resultado.
//
// Uso:  node scripts/seo/repair-related-articles.mjs
//       node scripts/seo/repair-related-articles.mjs --write

import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve('.').split(path.sep).join('/');
const WRITE = process.argv.includes('--write');
const SKIP = /(^|[\\/])(node_modules|\.git|\.github|vendor|projects|auto-shorts)([\\/]|$)/;
const WANT = 4;

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const abs = path.join(dir, e.name);
    if (SKIP.test(abs)) continue;
    if (e.isDirectory()) walk(abs, out);
    else if (e.name.toLowerCase().endsWith('.html')) out.push(abs);
  }
  return out;
}

const exists = (rel) => fs.existsSync(rel) || fs.existsSync(rel + 'index.html');

// Palabras vacias: no describen el tema del articulo.
const STOP = new Set(('the a an and or of for to in on with your you this that it is are be do does how what why '
  + 'when where can will get more best free online guide complete manual truth actually really new').split(' '));
const words = (s) =>
  String(s).toLowerCase().replace(/&[a-z#0-9]+;/g, ' ').replace(/[^a-z0-9]+/g, ' ').split(' ')
    .filter((w) => w.length > 2 && !STOP.has(w));

const SECTION = /<section class="related-articles">[\s\S]*?<\/section>/;
const REFS = /<!-- linkgraph:refs:start -->[\s\S]*?<!-- linkgraph:refs:end -->/;

const files = walk(ROOT);
const report = [];
let written = 0;

for (const abs of files) {
  const rel = abs.split(path.sep).join('/').slice(ROOT.length + 1);
  const html = fs.readFileSync(abs, 'utf8');
  const sec = html.match(SECTION);
  if (!sec) continue;

  // Solo intervenimos si la seccion esta realmente rota: algún href no resuelve.
  const broken = [...sec[0].matchAll(/href=["']([^"']+)["']/g)].filter((m) => {
    if (/^(https?:|mailto:|#)/i.test(m[1])) return false;
    return !exists(path.posix.normalize(path.posix.join(path.posix.dirname(rel), m[1])));
  });
  if (!broken.length) continue;

  const title = (html.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [, ''])[1];
  const tw = new Set(words(title));

  // Pool de candidatos: los refs de la propia pagina, que ya son topicos.
  const pool = [];
  const refs = html.match(REFS);
  if (refs) {
    for (const m of refs[0].matchAll(/<a href="([^"]+)">([\s\S]*?)<\/a>/g)) {
      // `href` se conserva TAL CUAL: es relativo a la pagina. Guardar la ruta
      // ya resuelta reintroduce el prefijo duplicado (blog/blog/...) en el href.
      const href = m[1];
      const target = path.posix.normalize(path.posix.join(path.posix.dirname(rel), href));
      if (!exists(target)) continue;
      const text = m[2].replace(/\s+/g, ' ').replace(/&amp;/g, '&').trim();
      if (!text) continue;
      let score = 0;
      for (const w of new Set(words(text))) if (tw.has(w)) score++;
      pool.push({ href, target, text, score, ord: pool.length });
    }
  }

  let rebuilt;
  if (pool.length < WANT) {
    // Sin senal propia: se quita la seccion rota. No hay nada que perder.
    rebuilt = { html: '', how: 'removed', pool: pool.length };
  } else {
    const top = pool
      .map((p) => ({ ...p }))
      .sort((a, b) => b.score - a.score || a.ord - b.ord)
      .slice(0, WANT)
      .sort((a, b) => a.ord - b.ord);
    const items = top
      .map((p) => `<p><a href="${p.href}">${p.text} &#8594;</a></p>`)
      .join('');
    rebuilt = {
      html: `<section class="related-articles"><h2>Related Articles</h2><div class="related-links">${items}</div></section>`,
      how: 'rebuilt from linkgraph:refs',
      pool: pool.length,
      picked: top.map((p) => p.text),
    };
  }

  const out = html.replace(SECTION, rebuilt.html);
  report.push({ rel, brokenHrefs: broken.length, ...rebuilt });
  if (WRITE && out !== html) {
    fs.writeFileSync(abs, out, 'utf8');
    written++;
  }
}

console.log(`paginas revisadas                 : ${files.length}`);
console.log(`secciones related-articles rotas  : ${report.length}`);
console.log(`escritas                          : ${WRITE ? written : 0}`);
for (const r of report) {
  console.log(`\n  ${r.rel}  (${r.brokenHrefs} hrefs rotos, pool ${r.pool})  -> ${r.how}`);
  if (r.picked) r.picked.forEach((p) => console.log(`      + ${p}`));
}
if (!WRITE && report.length) console.log('\n(dry-run: usa --write para aplicar)');