#!/usr/bin/env node
// Anade FAQPage a paginas que muestran la FAQ como <h4> + <p>, no como
// <details>/<summary>.
//
// Por que otro script y no ampliar add-faq-schema.mjs: aquel solo lee pares
// <details>/<summary>. El blog usa las dos formas y solo estaba cubierta una.
// Se aplicaron las mismas reglas de add-faq-schema.mjs, que es el inverso de
// reconcile-faq-schema.mjs:
//
//  - Solo se extrae DESPUES de un heading que sea de verdad una FAQ. Antes del
//    primer heading de FAQ no se lee nada, para no coger <h4> de otra seccion.
//  - Una pregunta tiene que terminar en interrogacion y medir mas de 12
//    caracteres. Un <h4> que no pregunta es un subtitulo, no una FAQ.
//  - Se necesitan al menos 2 pares. Una sola pregunta no da rich result.
//  - Cada pregunta se vuelve a verificar contra el texto visible de la pagina.
//    Si no aparece ahi, el par se descarta en vez de emitirse.
//
// Nada se inventa: la pregunta sale del <h4> que el lector ya ve, y la respuesta
// del <p> que va justo debajo, sin reescribir.
//
// Uso:  node scripts/seo/add-faq-schema-h4.mjs
//       node scripts/seo/add-faq-schema-h4.mjs --write
//       node scripts/seo/add-faq-schema-h4.mjs --json

import fs from 'node:fs';
import path from 'node:path';

const SITE = 'https://cha0smagicklabs.com';
const WRITE = process.argv.includes('--write');
const JSONOUT = process.argv.includes('--json');
const ROOT = path.resolve('.').split(path.sep).join('/');
const SKIP = /(^|[\\/])(node_modules|\.git|\.github|vendor|projects|auto-shorts)([\\/]|$)/;

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const abs = path.join(dir, e.name);
    if (SKIP.test(abs)) continue;
    if (e.isDirectory()) walk(abs, out);
    else if (e.name.toLowerCase().endsWith('.html')) out.push(abs);
  }
  return out;
}

const FAQ_HEAD = /<h([23])\b[^>]*>([\s\S]*?)<\/h\1>/gi;
const isFaqHeading = (s) => /\b(FAQ|Frequently Asked|Frequently asked|Preguntas Frecuentes|Common Questions)\b/i.test(s);
const strip = (s) => s.replace(/<[^>]+>/g, ' ').replace(/&[a-z#0-9]+;/gi, ' ').replace(/\s+/g, ' ').trim();

// Bloque de FAQ: desde el heading de FAQ hasta el siguiente <h2> o el cierre
// de la seccion. Cortar en el siguiente h2 evita arrastrar articulos ajenos.
const FAQ_BLOCK = /<h([23])\b[^>]*>([\s\S]*?)<\/h\1>([\s\S]*?)(?=<h2\b|<\/section>)/gi;

// Bloque de FAQ: desde el heading de FAQ hasta el siguiente <h2> o el cierre
// de la seccion. Cortar en el siguiente h2 evita arrastrar articulos ajenos.
//
// OJO: no se puede resolver esto con una sola regex global. Un <h3> de FAQ suele
// vivir dentro de la seccion que abre un <h2> anterior, y una regex global que
// captura `(<h2>...) hasta el proximo h2` se COME el h3 de la FAQ como parte de
// su propio bloque. matchAll sigue despues del texto consumido y el h3 nunca se
// vuelve a mirar. Por eso se localizean los headings por indice y el bloque se
// recorta despues.
const HEAD = /<h([23])\b[^>]*>([\s\S]*?)<\/h\1>/gi;

function extract(html) {
  const out = [];
  const visible = strip(html);

  const headings = [...html.matchAll(HEAD)].map((m) => ({
    end: m.index + m[0].length,
    text: strip(m[2]),
  }));

  for (const h of headings) {
    if (!isFaqHeading(h.text)) continue;
    // El bloque va del fin de este heading al proximo <h2> o </section>.
    const rest = html.slice(h.end);
    const stop = rest.search(/<h2\b|<\/section>/i);
    const block = stop === -1 ? rest : rest.slice(0, stop);
    // Cada <h3> o <h4> abre una pregunta; su respuesta es lo que hay hasta el
    // siguiente encabezado o hasta el final del bloque.
    //
    // Se aceptan ambos niveles porque el sitio usa los dos: hay paginas con las
    // preguntas en <h4> y paginas con las preguntas en <h3> directamente
    // debajo del heading. Aceptar solo <h4> dejaba 87 paginas sin marcar.
    //
    // El discriminador de "esto es una pregunta" NO es el nivel del tag: es que
    // termine en interrogacion. Un <h3> que es un titulo de seccion ("Como
    // elegir un spirit") no termina en '?' y por tanto no se emite.
    const parts = [...block.matchAll(/<h([34])\b[^>]*>([\s\S]*?)<\/h\1>([\s\S]*?)(?=<h[34]\b|$)/gi)];
    for (const p of parts) {
      const q = strip(p[2]);
      if (q.length <= 12 || !/\?\s*$/.test(q)) continue;
      // La respuesta es el primer parrafo con texto real del tramo. Ojo al
      // indice: el regex usa backreference para el nivel del tag, asi que los
      // grupos son p[1]=nivel, p[2]=pregunta, p[3]=tramo de respuesta.
      const paras = [...p[3].matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)]
        .map((x) => strip(x[1]))
        .filter((t) => t.length >= 40);
      if (!paras.length) continue;
      if (!visible.includes(q)) continue; // no esta en el texto visible
      out.push({ q, a: paras[0] });
    }
  }

  // Deduplicar por pregunta normalizada. Hay paginas con DOS headings de FAQ
  // (por ejemplo <h2 id="faq">FAQ</h2> y despues <h2>Frequently Asked
  // Questions</h2>), y ambos bloques contienen las mismas preguntas. Sin esta
  // deduplicacion se emitian 3 de cada 6 duplicadas, que es exactamente el
  // schema spam que reconcile-faq-schema.mjs borra del sitio.
  //
  // Se conserva la PRIMERA aparicion: es la que esta mas cerca del inicio de la
  // pagina, que es donde el lector la ve primero.
  const seen = new Set();
  const uniq = [];
  for (const p of out) {
    const key = p.q.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
    if (seen.has(key)) continue;
    seen.add(key);
    uniq.push(p);
  }
  return uniq;
}

const files = walk(ROOT);
const report = [];
let dropped = 0;
let written = 0;

for (const abs of files) {
  const rel = abs.split(path.sep).join('/').slice(ROOT.length + 1);
  const html = fs.readFileSync(abs, 'utf8');
  if (/FAQPage/i.test(html)) continue;
  if (!/FAQ|Frequently [Aa]sked|Preguntas Frecuentes|Common Questions/i.test(html)) continue;

  const pairs = extract(html);
  if (pairs.length < 2) {
    if (pairs.length) dropped += pairs.length;
    continue;
  }

  const url = `${SITE}/${rel}`;
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${url}#faq`,
    mainEntity: pairs.map((p) => ({
      '@type': 'Question',
      name: p.q,
      acceptedAnswer: { '@type': 'Answer', text: p.a },
    })),
  };
  const block = `<script type="application/ld+json">\n${JSON.stringify(ld, null, 2)}\n</script>`;

  let out;
  if (/<\/head>/i.test(html)) out = html.replace(/([ \t]*)<\/head>/i, (mm, ind) => `${ind}${block}\n${ind}</head>`);
  else if (/<body[^>]*>/i.test(html)) out = html.replace(/(<body[^>]*>)/i, `$1\n${block}`);
  else continue;

  report.push({ rel, pairs: pairs.length });
  if (WRITE) { fs.writeFileSync(abs, out, 'utf8'); written++; }
}

if (JSONOUT) {
  console.log(JSON.stringify({ written, report }, null, 2));
} else {
  console.log(`paginas revisadas                 : ${files.length}`);
  console.log(`paginas con FAQ <h4> y sin schema  : ${report.length}`);
  console.log(`preguntas a emitir                 : ${report.reduce((n, r) => n + r.pairs, 0)}`);
  console.log(`preguntas descartadas por verificacion: ${dropped}`);
  console.log(`escritas                           : ${WRITE ? written : 0}`);
  for (const r of report) console.log(`  ${r.rel}  x${r.pairs}`);
  if (!WRITE && report.length) console.log('\n(dry-run: usa --write para aplicar)');
}