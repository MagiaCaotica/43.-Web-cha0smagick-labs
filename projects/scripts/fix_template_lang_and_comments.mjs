/**
 * fix_template_lang_and_comments.mjs
 * ---------------------------------------------------------------------------
 * Repara los 4 defectos que la plantilla de yt-articles arrastra y que
 * reintroducen en cada artículo generado bugs ya corregidos en el sitio:
 *
 *  1. CSS del selector de idioma roto (`.lang-sidebar{...right:0...}` en
 *     conflicto con `css/style.min.css`, que define `left:0`).
 *  2. Botón sin icono: el contenido es `—xR—` (el emoji U+1F310 corrupto por
 *     un round-trip latin1). Se sustituye por el SVG inline del globo.
 *  3. `title` de banderas corruptos (ru/ja/zh-CN).
 *  4. Bloque de comentarios roto: `<div class="giscus-container">` SIN
 *     `class="giscus"`, que es lo que giscus busca -> el widget nunca monta
 *     dentro de su contenedor. Además cuelga del footer, después de
 *     `</main>`. Se mueve a `tail` (dentro de `</article>`) con el markup que
 *     usan los 634 posts ya arreglados.
 *
 * Bonus: la clave `tail` trae DOS cajas `internal-links` "Related Resources"
 * hardcodeadas que `gen_yt_articles.py` nunca emite (las genera desde
 * `catalog.json`), y una de ellas apunta a `../tools/rune-caster.html`, que no
 * existe. Se eliminan por ser código muerto con enlaces rotos.
 *
 * Uso:  node projects/scripts/fix_template_lang_and_comments.mjs [--dry]
 * ESM, idempotente, valida UTF-8 con TextDecoder fatal antes de escribir.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const DRY = process.argv.includes('--dry');
const BASE = path.join(ROOT, 'projects', 'data', 'yt-articles');
const TARGETS = ['_template.json', '_template_source.txt'];

/**
 * Patron del boton de bandera. El titulo se captura como `(?:[^"\\]|\\.)*?`
 * y no `[^"]*` porque en `_template.json` los caracteres corruptos estan
 * guardados como secuencias de escape JSON (`—\u0014—S—~`), y la barra
 * invertida de `\u0014` rompia la clase de caracteres. `\\.` consume tanto
 * `\"` como `\uXXXX` como un par.
 */
const FLAG_BTN_SRC = String.raw`(<button onclick=\\?"switchLang\('([a-zA-Z-]+)'\)\\?" title=\\?")((?:[^"\\]|\\.)*?)(\\?")`;
const FLAG_BTN_RE = new RegExp(FLAG_BTN_SRC, 'g');

/* ------------------------------------------------------------------ *
 * Piezas de reemplazo
 * ------------------------------------------------------------------ */

// 1. Selector de idioma: izquierda, no derecha. El `!important` es
//    obligatorio: el <link> a css/style.min.css va DESPUES del <style>
//    inline, asi que sin el gana el `align-items:center` de la hoja global.
const CSS_SUBS = [
  [
    '.lang-sidebar{position:fixed;top:50%;right:0;transform:translateY(-50%);z-index:9999;display:flex;flex-direction:column;align-items:flex-end;}',
    '.lang-sidebar{position:fixed;top:50%;left:0;right:auto;transform:translateY(-50%);z-index:9999;display:flex;flex-direction:column;align-items:flex-start !important;}',
  ],
  [
    'border-right:none;border-radius:8px 0 0 8px;',
    'border-left:none;border-radius:0 8px 8px 0;',
  ],
];

// 2. Globo: SVG inline, mismo dibujo que fix_lang_globe.mjs inyecto en el sitio.
const GLOBE =
  '<svg class="lang-globe" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" ' +
  'fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ' +
  'aria-hidden="true" focusable="false">' +
  '<circle cx="12" cy="12" r="9"/><line x1="3" y1="12" x2="21" y2="12"/>' +
  '<path d="M12 3c2.5 2.7 3.8 5.8 3.8 9s-1.3 6.3-3.8 9c-2.5-2.7-3.8-5.8-3.8-9S9.5 5.7 12 3z"/>' +
  '</svg>';

// 3. Titulos de bandera. El mapa se aplica sobre el boton de cada idioma, no
//    por coincidencia literal: `_template.json` y `_template_source.txt` tienen
//    corrupciones DISTINTAS del mismo campo (em-dash en el uno, U+FFFD en el
//    otro), asi que buscar el texto roto solo arreglaria uno de los dos.
const LANG_NAMES = {
  en: 'English',
  es: 'Espa\u00f1ol',
  fr: 'Fran\u00e7ais',
  de: 'Deutsch',
  it: 'Italiano',
  pt: 'Portugu\u00eas',
  ru: '\u0420\u0443\u0441\u0441\u043a\u0438\u0439',
  ja: '\u65e5\u672c\u8a9e',
  'zh-CN': '\u4e2d\u6587',
};

/* ------------------------------------------------------------------ *
 * 4. Bloque de comentarios: identico al de los 634 posts arreglados.
 *    Va en `tail` para caer dentro de </article>, no despues de </main>.
 * ------------------------------------------------------------------ */
const COMMENTS = [
  '<!-- Comments (giscus) -->',
  '<section id="comments" class="post-comments" aria-labelledby="comments-title">',
  '  <h2 id="comments-title" class="post-comments-title">Discussion &amp; Comments</h2>',
  '  <p class="post-comments-intro">Tried this practice? Tell us what happened below. Reader results are the most useful',
  '    feedback we get &mdash; they show other practitioners what to expect and tell us which guides to write next.</p>',
  '  <div class="giscus giscus-container" id="giscus-comments"></div>',
  '</section>',
  '<script src="https://giscus.app/client.js"',
  '        data-repo="MagiaCaotica/43.-Web-cha0smagick-labs"',
  '        data-repo-id="R_kgDOQ95-4g"',
  '        data-category="General"',
  '        data-category-id="DIC_kwDOQ95-4s4DCREq"',
  '        data-mapping="pathname"',
  '        data-strict="0"',
  '        data-reactions-enabled="1"',
  '        data-emit-metadata="0"',
  '        data-input-position="top"',
  '        data-theme="dark_dimmed"',
  '        data-lang="en"',
  '        data-loading="lazy"',
  '        crossorigin="anonymous"',
  '        async>',
  '</script>',
  '</article>',
  '</main>',
].join('\r\n');

/* ------------------------------------------------------------------ *
 * Utilidades
 * ------------------------------------------------------------------ */
const countOf = (hay, needle) => hay.split(needle).length - 1;

/**
 * Localiza las cajas `<section class="internal-links" ...>...</section>`.
 * Tolera las comillas escapadas del JSON crudo (`class=\"internal-links\"`),
 * que es como esta escrito `_template.json`.
 */
function countInternalLinksBoxes(text) {
  const open = /<section class=\\?"internal-links\\?"/g;
  const out = [];
  let m;
  while ((m = open.exec(text)) !== null) {
    const a = m.index;
    const b = text.indexOf('</section>', a);
    if (b === -1) break;
    out.push(text.slice(a, b + 10));
    open.lastIndex = b + 10;
  }
  return out;
}

function patchRaw(raw, { asJson }) {
  const stats = { cssSidebar: 0, cssBox: 0, globe: 0, titles: 0, giscusRemoved: 0, deadBoxesRemoved: 0, commentsAdded: 0 };
  // `_template.json` es HTML embebido como string JSON: comillas, barras
  // invertidas y saltos de linea tienen que ir como secuencias de escape o el
  // archivo deja de ser JSON valido (JSON.parse rechaza CR/LF crudos dentro de
  // un string). `_template_source.txt` es HTML plano y no se escapa nada.
  const esc = (s) =>
    asJson ? s.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\r/g, '\\r').replace(/\n/g, '\\n') : s;
  let out = raw;

  // --- 1. CSS del selector -------------------------------------------------
  for (const [from, to] of CSS_SUBS) {
    const n = countOf(out, from);
    if (n > 0) {
      out = out.split(from).join(to);
      if (from.startsWith('.lang-sidebar')) stats.cssSidebar += n;
      else stats.cssBox += n;
    }
  }

  // --- 2. Globo en el boton ----------------------------------------------
  // Se localiza por los ATRIBUTOS del boton, no por su contenido: el contenido
  // corrupto varia entre archivos (—xR— en el JSON, U+FFFD en el .txt) y en
  // algunos casos es un elemento completo, no texto.
  const btnRe = /(<button[^>]*\blang-toggle-btn\b[^>]*>)([\s\S]{0,400}?)(<\/button>)/g;
  let bm;
  while ((bm = btnRe.exec(out)) !== null) {
    if (bm[2].includes('lang-globe')) continue; // ya arreglado (idempotencia)
    out = out.slice(0, bm.index) + bm[1] + esc(GLOBE) + bm[3] + out.slice(bm.index + bm[0].length);
    stats.globe += 1;
    break;
  }

  // --- 3. Titulos de banderas ---------------------------------------------
  out = out.replace(FLAG_BTN_RE, (full, head, code, old, tailQ) => {
    const name = LANG_NAMES[code];
    if (!name || old === name) return full; // ya correcto (idempotencia)
    stats.titles += 1;
    return head + name + tailQ;
  });

  // --- 4a. Quitar el bloque de comentarios roto del footer ---------------
  const gStart = out.indexOf('<!-- Giscus Comments -->');
  if (gStart !== -1) {
    const gEnd = out.indexOf('</script>', gStart);
    if (gEnd === -1) throw new Error('bloque giscus sin </script>: no se puede cortar con seguridad');
    out = out.slice(0, gStart) + out.slice(gEnd + '</script>'.length);
    stats.giscusRemoved += 1;
  }

  // --- 4b. Cajas Related Resources hardcodeadas y muertas en `tail` -------
  // Solo dentro de la region que acaba en </article></main>; las cajas
  // generadas por render_tail no existen todavia en el archivo de plantilla.
  const tailEnd = out.indexOf('</article>');
  if (tailEnd !== -1) {
    const boxes = countInternalLinksBoxes(out);
    for (const box of boxes) {
      // No tocar el `</article></main>` que ya iniciamos a sustituir abajo.
      out = out.replace(box, '');
      stats.deadBoxesRemoved += 1;
    }
  }

  // --- 4c. Nada que añadir aquí ------------------------------------------------
  // El bloque de comentarios NO se pone en la plantilla. La clave `tail` de
  // `_template.json` está muerta: `gen_yt_articles.py::render_tail` la ignora
  // y construye related-articles + cajas desde el record y `catalog.json`. La
  // unica fuente de verdad es `COMMENTS_SECTION` en `gen_yt_articles.py`, que
  // emite el markup justo antes de `</article>`.

  return { out, stats };
}

/* ------------------------------------------------------------------ *
 * Aserciones sobre el texto ya parcheado
 * ------------------------------------------------------------------ */
function assertFixed(text, label) {
  const problems = [];
  // Solo la regla del sidebar: `align-items:center` es legitimo en
  // `.header-link` y `.lang-btn`, asi que el chequeo tiene que ser local.
  const sb = /\.lang-sidebar\{[^}]*\}/.exec(text);
  if (!sb) problems.push('no se encuentra la regla .lang-sidebar');
  else {
    if (/right:0/.test(sb[0])) problems.push('la regla .lang-sidebar conserva right:0');
    if (/align-items:center/.test(sb[0])) problems.push('la regla .lang-sidebar conserva align-items:center');
    if (!/left:0;right:auto/.test(sb[0])) problems.push('falta left:0;right:auto en .lang-sidebar');
    if (!/align-items:flex-start !important/.test(sb[0])) problems.push('falta align-items:flex-start !important');
  }
  for (const sel of ['lang-toggle-btn', 'lang-flag-list']) {
    const re = new RegExp('\\.' + sel + '\\{[^}]*\\}');
    const rule = re.exec(text);
    if (!rule) {
      problems.push(`no se encuentra la regla .${sel}`);
      continue;
    }
    if (/border-right:none/.test(rule[0])) problems.push(`queda border-right:none en .${sel}`);
    if (!/border-left:none/.test(rule[0])) problems.push(`falta border-left:none en .${sel}`);
    if (!/border-radius:0 8px 8px 0/.test(rule[0])) problems.push(`falta el radio pegado a la izquierda en .${sel}`);
  }
  if (!text.includes('class="lang-globe"')) problems.push('falta el SVG del globo');
  if (/lang-toggle-btn[^>]*>—xR—</.test(text)) problems.push('el boton sigue con el emoji corrupto');
  if (/lang-toggle-btn[^>]*>\uFFFD/.test(text)) problems.push('el boton sigue con U+FFFD');
  // Titulos de bandera: deben coincidir exactamente con el mapa, sin mojibake,
  // y tiene que haber los 9 (si el patron deja de capturar uno, el recuento
  // lo delata en vez de dejar pasar un titulo roto).
  // Grupos de FLAG_BTN_RE: 1=cabecera, 2=idioma, 3=titulo, 4=comilla cierre.
  const found = new Set();
  let fm;
  FLAG_BTN_RE.lastIndex = 0;
  while ((fm = FLAG_BTN_RE.exec(text)) !== null) {
    const code = fm[2];
    found.add(code);
    const want = LANG_NAMES[code];
    if (want === undefined) {
      problems.push(`boton de bandera con idioma desconocido: ${code}`);
    } else if (fm[3] !== want) {
      problems.push(`title corrupto en ${code}: ${JSON.stringify(fm[3])} != ${JSON.stringify(want)}`);
    }
  }
  for (const code of Object.keys(LANG_NAMES)) {
    if (!found.has(code)) problems.push(`falta el boton de bandera ${code} (patron desalineado)`);
  }
  if (text.includes('<!-- Giscus Comments -->')) problems.push('queda el bloque giscus roto del footer');
  // El widget con la clase correcta lo emite gen_yt_articles.py (COMMENTS_SECTION),
  // no la plantilla: su clave `tail` esta muerta.
  if (/giscus[^"]*\\?"[^>]*max-width:800px/.test(text)) problems.push('el widget conserva max-width:800px');
  if (text.includes('rune-caster.html')) problems.push('queda el enlace muerto rune-caster.html');
  if (countInternalLinksBoxes(text).length > 0) problems.push('quedan cajas internal-links hardcodeadas');
  if (problems.length) throw new Error(`[${label}] ${problems.join(' | ')}`);
}

/* ------------------------------------------------------------------ *
 * Main
 * ------------------------------------------------------------------ */
let changed = 0;
for (const name of TARGETS) {
  const file = path.join(BASE, name);
  if (!fs.existsSync(file)) {
    console.log(`  (skip) ${name} no existe`);
    continue;
  }
  const buf = fs.readFileSync(file);
  const hasBom = buf[0] === 0xef && buf[1] === 0xbb && buf[2] === 0xbf;
  const raw = new TextDecoder('utf-8', { fatal: true }).decode(buf);

  const asJson = name.endsWith('.json');
  const { out, stats } = patchRaw(raw, { asJson });
  if (asJson) {
    try {
      JSON.parse(out);
    } catch (e) {
      throw new Error(`[${name}] el parche dejo el JSON invalido: ${e.message}`);
    }
  }
  // Las aserciones buscan markup legible; en el JSON las comillas van
  // escapadas, asi que se normaliza una copia solo para inspeccion.
  assertFixed(asJson ? out.replace(/\\"/g, '"') : out, name);

  if (out === raw) {
    console.log(`  = ${name} ya estaba correcto (${raw.length} bytes)`);
    continue;
  }
  if (DRY) {
    console.log(`  ~ ${name} ${raw.length} -> ${out.length} bytes ${JSON.stringify(stats)}`);
    changed += 1;
    continue;
  }
  fs.writeFileSync(file, (hasBom ? '\uFEFF' : '') + out, 'utf8');
  console.log(`  + ${name} ${raw.length} -> ${out.length} bytes ${JSON.stringify(stats)}`);
  changed += 1;
}

console.log(DRY ? `\n[dry] ${changed} archivo(s) con cambios pendientes` : `\nOK ${changed} archivo(s) reescritos`);
