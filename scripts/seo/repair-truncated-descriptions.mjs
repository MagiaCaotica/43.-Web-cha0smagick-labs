#!/usr/bin/env node
// Reconstruye las descripciones que quedaron truncadas a un fragmento.
//
// Que pasa: 7 paginas tienen la meta description y la og:description cortadas a
// 8-17 caracteres, y el texto es un fragmento del titulo, no una descripcion:
//
//   "Complete beginner"   (3 paginas, 17 ch)
//   "A beginner"          (2 paginas, 10 ch)
//   "The Fool"            (2 paginas,  8 ch)
//
// El sintoma aparece como `descDupes` en verify-final.mjs: al ser el mismo
// fragmento en varias paginas, Google las muestra como descripciones
// identicas, y una descripcion de 8 caracteres no dice de que pagina se trata.
//
// De donde sale la nueva descripcion: del PRIMER PARRAFO REAL del cuerpo del
// articulo. No se escribe texto nuevo. Se recorta ese parrafo a 160 caracteres
// cortando en palabra, que es el mismo criterio que ya usa fix-head-content.mjs
// para las descripciones que faltan.
//
// Lo que se descarta antes de buscar el parrafo, porque ninguno de esos bloques
// es prosa del articulo:
//
//   script, style, nav, header, footer, aside
//   .meta (byline con autor y fecha), .cta-box, .cta-contextual
//   .related-articles, .linkgraph (bloques de cruzados), .comment, .share
//
// Guardas:
//  - Solo interviene si la description actual es < 60 caracteres. Una
//    descripcion corta de verdad puede ser legitima si la pagina es corta; aqui
//    el corte es tan extremo que no hay contenido que lose.
//  - Si la pagina no tiene un parrafo apto, NO se toca: se reporta para
//    revision manual en vez de inventar una descripcion.
//  - Se actualizan las dos metas juntas (description y og:description), que
//    estaban truncadas de forma identica.
//
// Uso:  node scripts/seo/repair-truncated-descriptions.mjs
//       node scripts/seo/repair-truncated-descriptions.mjs --write
//       node scripts/seo/repair-truncated-descriptions.mjs --json

import fs from 'node:fs';
import path from 'node:path';

const WRITE = process.argv.includes('--write');
const JSONOUT = process.argv.includes('--json');
const MIN_LEN = 60;   // por debajo de esto, la meta esta truncada
const MAX_LEN = 160;  // limite deGoogle, el mismo que usa measure-head-debt
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

const strip = (s) =>
  s.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/gi, ' ').replace(/\s+/g, ' ').trim();

function bodyProse(html) {
  // Region del articulo: <article> si existe, si no <main>, si no el cuerpo.
  let body =
    (html.match(/<article\b[\s\S]*?<\/article>/i) || [])[0] ||
    (html.match(/<main\b[\s\S]*?<\/main>/i) || [])[0] ||
    (html.match(/<body\b[\s\S]*?<\/body>/i) || [])[0] ||
    html;

  // Se quitan los bloques que no son prosa del articulo.
  body = body
    .replace(/<script\b[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[\s\S]*?<\/style>/gi, ' ')
    .replace(/<nav\b[\s\S]*?<\/nav>/gi, ' ')
    .replace(/<header\b[\s\S]*?<\/header>/gi, ' ')
    .replace(/<footer\b[\s\S]*?<\/footer>/gi, ' ')
    .replace(/<aside\b[\s\S]*?<\/aside>/gi, ' ')
    .replace(/<div\b[^>]*class=["'][^"']*\b(meta|cta-box|cta-contextual|related-articles|linkgraph|comment|share|sidebar|newsletter)\b[^"']*["'][\s\S]*?<\/div>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ');

  // Primer parrafo con|Longitud suficiente para ser una descripcion.
  for (const m of body.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)) {
    const t = strip(m[1]);
    if (t.length >= 80) return t;
  }
  return '';
}

// Recorta a MAX_LEN cortando en palabra, sin dejar puntuacion colgando.
function clip(s, max = MAX_LEN) {
  if (s.length <= max) return s;
  const cut = s.slice(0, max);
  const sp = cut.lastIndexOf(' ');
  const base = sp > max * 0.6 ? cut.slice(0, sp) : cut;
  return base.replace(/[\s,;:.!?\-\u2013\u2014]+$/, '');
}

// Escapa el caracter delimitador REAL del atributo. Si el atributo va entre
// comillas dobles, escapa comillas dobles; si va entre simples, escapa simples.
// Escapar siempre las dobles rompia el caso de comillas simples, y no escapar
// el delimitador dejaria texto roto dentro del atributo.
const attr = (s, quote = '"') =>
  quote === "'"
    ? s.replace(/'/g, '&#39;')
    : s.replace(/"/g, '&quot;');

const files = walk(ROOT);
const report = [];
const manual = [];
let written = 0;

for (const abs of files) {
  const rel = abs.split(path.sep).join('/').slice(ROOT.length + 1);
  const html = fs.readFileSync(abs, 'utf8');

  // OJO con el delimitador. El content va entre comillas dobles, pero su VALOR
  // puede contener apostrofos ("Here's what studies show"). Con un patron
  // `(["'])([\s\S]*?)\1` el cierre queda ligado al caracter de apertura. Sin
  // backreference, algo como `["']([\s\S]*?)["']` corta en el apostrofo
  // interior, se considera que ahi termina el atributo y el resto del texto
  // original queda colgando fuera de la etiqueta. Ya se hizo ese dano una vez.
  const dm = html.match(/<meta\b[^>]*\bname\s*=\s*["']description["'][^>]*\bcontent\s*=\s*(["'])([\s\S]*?)\1[^>]*>/i);
  const om = html.match(/<meta\b[^>]*\bproperty\s*=\s*["']og:description["'][^>]*\bcontent\s*=\s*(["'])([\s\S]*?)\1[^>]*>/i);
  if (!dm) continue;

  // Grupo 1 es el caracter delimitador, grupo 2 es el contenido.
  const current = strip(dm[2]);
  if (current.length >= MIN_LEN) continue;

  const prose = bodyProse(html);
  if (!prose) {
    manual.push({ rel, current, why: 'sin parrafo apto en el cuerpo' });
    continue;
  }

  const next = clip(prose);
  // Solo se escribe si gana de largo: si el recorte quedara igual de corto que
  // lo que ya habia, el cambio no aportaria nada.
  if (next.length < MIN_LEN) {
    manual.push({ rel, current, why: `el parrafo recortado queda en ${next.length} ch` });
    continue;
  }

  report.push({ rel, from: current, to: next, ogUpdated: !!om });
  if (WRITE) {
    // Se reescribe el atributo content respetando SU delimitador. El patron usa
    // \2 para que el cierre sea el mismo caracter que la apertura; si el valor
    // nuevo trajera comillas se escapan a entidad.
    const setContent = (tag) =>
      tag.replace(
        /(\bcontent\s*=\s*)(["'])([\s\S]*?)\2/i,
        (_m, pre, q) => `${pre}${q}${attr(next, q)}${q}`
      );
    let out = html.replace(dm[0], setContent(dm[0]));
    if (om) out = out.replace(om[0], setContent(om[0]));
    fs.writeFileSync(abs, out, 'utf8');
    written++;
  }
}

if (JSONOUT) {
  console.log(JSON.stringify({ written, report, manual }, null, 2));
} else {
  console.log(`paginas revisadas          : ${files.length}`);
  console.log(`descripciones truncadas    : ${report.length}`);
  console.log(`og:description actualizadas: ${report.filter((r) => r.ogUpdated).length}`);
  console.log(`escritas                  : ${WRITE ? written : 0}`);
  console.log(`para revision manual      : ${manual.length}`);
  for (const m of manual) console.log(`  ${m.rel}  "${m.current}"  ${m.why}`);
  for (const r of report) {
    console.log(`\n  ${r.rel}`);
    console.log(`    antes (${r.from.length} ch): "${r.from}"`);
    console.log(`    ahora (${r.to.length} ch): "${r.to}"`);
  }
  if (!WRITE && report.length) console.log('\n(dry-run: usa --write para aplicar)');
}