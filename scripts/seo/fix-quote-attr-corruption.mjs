#!/usr/bin/env node
// Repara etiquetas <meta>/<link> con el atributo partido:
//
//     <meta name="viewport"="width=device-width, initial-scale=1">
//     <meta property="og:description"="Panel de afiliados...">
//
// La firma es un `="` justo despues del cierre de comillas de un valor:
// `nombre="valor"="valor2"`. El parser HTML5 no puede recuperarlo: el segundo
// `=` aparece antes de un nombre de atributo, y el atributo `content` nunca
// existe. En la practica:
//
//   - `name="viewport"="..."` -> la pagina NO tiene viewport meta. Google y
//     cualquier movil la renderizan a 980px de ancho. Es el caso mas grave y
//     afecta a ~100 articulos del blog.
//   - `property="og:*"="..."` -> Open Graph no lee el campo. Los previews de
//     Telegram/Slack/WhatsApp salen sin titulo ni descripcion.
//
// Origen: la misma clase de bug que `278edafa` (un `$1` expandido dentro del
// valor de un atributo). Alli se/arreglaron dos metas a mano; aqui hay 106, asi
// que se arreglan por regla.
//
// Decisiones de diseno:
//  - Solo toca `<meta>` y `<link>`. Un `="` dentro de `<a href=...>` o de un
//    `<script>` puede ser legitimo.
//  - Si la etiqueta YA tiene un `content=` correcto mas adelante, no se toca:
//    anadir un segundo `content` seria peor que no hacer nada.
//  - Idempotente: tras correrlo, el escaneo da 0.
//
// Uso:  node scripts/seo/fix-quote-attr-corruption.mjs
//       node scripts/seo/fix-quote-attr-corruption.mjs --write
//       node scripts/seo/fix-quote-attr-corruption.mjs --json

import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve('.').split(path.sep).join('/');
const SITE = 'https://cha0smagicklabs.com';
const WRITE = process.argv.includes('--write');
const JSONOUT = process.argv.includes('--json');

// Mismos directorios que el resto de la cadena SEO: no se publican.
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

// Una etiqueta completa `<meta ...>` / `<link ...>` que contenga el `="` partido.
const TAG = /<(meta|link)\b[^>]*>/gi;
// Dentro de la etiqueta: `nombre="valor"="valor2"`. El grupo 3 exige que el
// segundo valor NO contenga `>`, para no comerse el resto de la etiqueta.
const BROKEN = /(\s)([a-zA-Z][a-zA-Z0-9:_-]*)="([^"<>]*)"="([^"<>]*)"/;

function fixTag(tag) {
  const m = tag.match(BROKEN);
  if (!m) return null;
  // Si ya hay un `content=` legitimo en la misma etiqueta, no se interviene.
  const already = /\scontent\s*=\s*["'][^"']*["']/i.test(tag.replace(m[0], ''));
  if (already) return null;
  const [, sp, attr, first, second] = m;
  // Se conserva el valor original de `name`/`property` y el segundo valor pasa
  // a `content`, que es donde el parser lo buscaba.
  return {
    out: tag.replace(m[0], `${sp}${attr}="${first}" content="${second}"`),
    attr,
    first,
    second,
  };
}

const files = walk(ROOT);
const hits = [];
let written = 0;

for (const abs of files) {
  const rel = abs.split(path.sep).join('/').slice(ROOT.length + 1);
  const html = fs.readFileSync(abs, 'utf8');
  if (!html.includes('"="')) continue;

  const fixed = [];
  const out = html.replace(TAG, (tag) => {
    const f = fixTag(tag);
    if (!f) return tag;
    fixed.push({ attr: f.attr, from: f.first, to: f.second });
    return f.out;
  });

  if (!fixed.length) continue;
  hits.push({ rel, count: fixed.length, fixes: fixed });
  if (WRITE) {
    fs.writeFileSync(abs, out, 'utf8');
    written++;
  }
}

const total = hits.reduce((n, h) => n + h.count, 0);
const byAttr = {};
for (const h of hits) for (const f of h.fixes) byAttr[f.attr] = (byAttr[f.attr] || 0) + 1;

if (JSONOUT) {
  console.log(JSON.stringify({ scanned: files.length, pages: hits.length, occurrences: total, written, byAttr, hits }, null, 2));
} else {
  console.log(`paginas revisadas     : ${files.length}`);
  console.log(`paginas con el bug    : ${hits.length}`);
  console.log(`etiquetas a reparar   : ${total}`);
  console.log(`escritas              : ${written}`);
  console.log(`por atributo          : ${Object.entries(byAttr).map(([k, v]) => `${k} x${v}`).join(', ') || '(ninguno)'}`);
  for (const h of hits.slice(0, 25)) console.log(`  ${h.rel}  x${h.count}`);
  if (hits.length > 25) console.log(`  ... y ${hits.length - 25} mas`);
  if (!WRITE && hits.length) console.log('\n(dry-run: usa --write para aplicar)');
}

// `SITE` se mantiene referenciado para que el patron de nombre de dominio siga
// documentado en el archivo si el gate lo necesita mas adelante.
void SITE;