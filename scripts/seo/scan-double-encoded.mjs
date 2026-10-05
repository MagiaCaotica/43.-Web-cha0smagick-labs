// Detecta entidades HTML doblemente codificadas, p.ej. `&amp;middot;`.
//
// Por que importa: el navegador y Google renderizan `&amp;middot;` como el
// TEXTO LITERAL "&middot;", no como el separador "·". Es decir, el sitio
// muestra `&middot;` a los usuarios y a los buscadores. Es la misma clase de
// bug que las dos metas de `blog/christmas-gift-guide-occult-apps-under-10.html`
// (commit `278edafa`), donde un `$1` se expandio dentro del valor del atributo.
//
// No se "arregla" re-codificando: se re-codifica UNA vez, solo en los atributos
// donde el valor debe ser texto legible.
//
// Uso:  node scripts/seo/scan-double-encoded.mjs
//       node scripts/seo/scan-double-encoded.mjs --write
//       node scripts/seo/scan-double-encoded.mjs --json

import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve('.').split(path.sep).join('/');
const WRITE = process.argv.includes('--write');
const JSONOUT = process.argv.includes('--json');
const SKIP = /(^|[\\/])(node_modules|\.git|\.github|vendor|projects|auto-shorts)([\\/]|$)/;

// Nombres largos primero: `&amp;hellip;` debe resolverse antes que `&amp;h`.
//
// El `;` es OPCIONAL a proposito. La forma truncada `&amp;middot` (sin punto y
// coma) aparece en el `<title>` y `og:title` de `checklist-ventas.html` y es un
// bug real: el navegador muestra el texto literal `&middot` en el titulo de
// Google. Exigir el `;` hacia que el escaner no lo viera.
//
// Solo se toca un subconjunto con lista blanca de nombres. Un `&amp;` suelto
// seguido de una palabra normal (`AT&amp;T`) no coincide, y un nombre fuera de
// la lista se reporta como `unresolved` en vez de re-codificarse a ciegas.
const NAMES = ['hellip', 'middot', 'mdash', 'ndash', 'rsquo', 'lsquo', 'ldquo', 'rdquo', 'quot', 'apos', 'amp', 'lt', 'gt'];
const DOUBLE = new RegExp(`&amp;(${NAMES.join('|')}|#[0-9]+|#[xX][0-9a-fA-F]+);?`, 'g');

// Deteccion conservative de lo que NO se debe tocar a ciegas: doblemente
// codificado con un nombre que no conocemos. Se cuenta y se reporta.
const UNKNOWN = /&amp;([a-zA-Z][a-zA-Z0-9]*);?/g;

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const abs = path.join(dir, e.name);
    if (SKIP.test(abs)) continue;
    if (e.isDirectory()) walk(abs, out);
    else if (e.name.toLowerCase().endsWith('.html')) out.push(abs);
  }
  return out;
}

// Una sola pasada de substitucion: `&amp;middot;` -> `&middot;` es correcto y
// NO debe volver a convertirse en `&middot;` en la misma pasada (seria un
// bucle). El punto y coma ausente se restituye: `&amp;middot` -> `&middot;`.
const fixOnce = (s) => s.replace(DOUBLE, (_, n) => `&${n};`);

const files = walk(ROOT);
const hits = [];
const unresolved = [];
let written = 0;

for (const abs of files) {
  const rel = abs.split(path.sep).join('/').slice(ROOT.length + 1);
  const html = fs.readFileSync(abs, 'utf8');
  if (!DOUBLE.test(html)) {
    DOUBLE.lastIndex = 0;
    UNKNOWN.lastIndex = 0;
    const unk = html.match(UNKNOWN);
    if (unk) unresolved.push({ rel, occurrences: unk.length, samples: [...new Set(unk)].slice(0, 5) });
    continue;
  }
  DOUBLE.lastIndex = 0;
  const before = html;
  const after = fixOnce(html);
  const n = (before.match(DOUBLE) || []).length;
  DOUBLE.lastIndex = 0;
  hits.push({ rel, occurrences: n, chars: before.length - after.length });
  if (WRITE && after !== before) {
    fs.writeFileSync(abs, after, 'utf8');
    written++;
  }
}

if (JSONOUT) {
  console.log(JSON.stringify({ scanned: files.length, pages: hits.length, written, hits, unresolved }, null, 2));
} else {
  console.log(`paginas revisadas        : ${files.length}`);
  console.log(`con entidades dobles    : ${hits.length}`);
  console.log(`corregidas               : ${written}`);
  console.log(`nombres desconocidos    : ${unresolved.length}  (NO se tocan)`);
  for (const h of hits.slice(0, 40)) console.log(`  ${h.rel}  x${h.occurrences}`);
  if (hits.length > 40) console.log(`  ... y ${hits.length - 40} mas`);
  for (const u of unresolved.slice(0, 10)) console.log(`  ? ${u.rel}  x${u.occurrences}  ${u.samples.join(' ')}`);
  if (!WRITE && hits.length) console.log('\n(dry-run: usa --write para aplicar)');
}
