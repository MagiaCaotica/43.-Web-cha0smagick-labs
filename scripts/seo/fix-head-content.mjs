#!/usr/bin/env node
/**
 * fix-head-content.mjs
 *
 * Segunda pasada del SEO. Corrige, sobre los HTML PUBLICOS del sitio:
 *
 *  1. <title> repetido      "X | X | Marca"  -> se deduplica.
 *  2. <title> > 60 chars    se recorta sin perder palabras ni terminar en
 *                           conjunciones ("...Swords &" no es un titulo).
 *  3. <title> duplicado     se desempata con el angulo real del articulo.
 *  4. <h1> = marca          "Cha0smagick Labs" como H1 no es una query.
 *  5. description > 160     se recorta con el mismo criterio.
 *  6. description faltante  se deriva del H1 + primer parrafo.
 *  7. description duplicada se desempata igual que el title.
 *
 * Idempotente. No toca canonical (lo arreglo fix-canonical.mjs).
 * NO toca projects/ ni ningun directorio de terceros: ahi solo se aplica
 * noindex via fix-canonical.mjs.
 *
 * Uso: node scripts/seo/fix-head-content.mjs [--dry] [--preview]
 */

import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(fileURLToPath(new URL('.', import.meta.url)), '..', '..');
const DRY = process.argv.includes('--dry');
const PREVIEW = process.argv.includes('--preview');
const BRAND = 'Cha0smagick Labs';
const TITLE_MAX = 60;
const DESC_MAX = 160;

/** Directorios que NO son contenido publicable. No se reescriben. */
const EXCLUDE_PREFIX = ['projects/', 'node_modules/', '.git/', 'tools/auto-shorts/'];

// Palabras que nunca pueden quedar al final de un titulo truncado.
const TRAILING_JUNK =
  /^(?:and|or|of|the|a|an|to|in|on|for|with|at|by|from|as|that|which|but|nor|so|yet|is|are|was|were|be|been|it|its|your|their|our|my|this|these|those|into|over|under|about|after|before|vs|versus|\+|&|—|-|:|,|;|\||\.)$/i;

const GENERIC_H2 =
  /^(related articles?|related resources?|frequently asked questions|faq|discussion( &| and) comments?|comments?|conclusion|conclusi[oó]n|summary|references?|bibliography|share this|conclusion and next steps|put this into practice|key takeaways|final thoughts|about the author|related reading|further reading|notes|disclaimer|sources?|table of contents|introduction)$/i;

function walk(dir, out = []) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (e.name === 'node_modules' || e.name === '.git') continue;
    const full = join(dir, e.name);
    if (e.isDirectory()) walk(full, out);
    else if (e.name.endsWith('.html')) out.push(full);
  }
  return out;
}

const decode = (s) =>
  s
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&apos;|&#x27;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&');

const escape = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const escapeAttr = (s) => escape(s).replace(/"/g, '&quot;');
const stripTags = (s) => decode(s.replace(/<[^>]*>/g, ' ')).replace(/\s+/g, ' ').trim();
const words = (s) => s.split(/\s+/).filter(Boolean);

/**
 * Recorta a `max` en frontera de palabra y limpia la cola.
 * "Cups, Wands, Swords & Pentacles" con max=30 -> "Cups, Wands, Swords"
 * (nunca "... Swords &").
 */
function clamp(text, max) {
  if (text.length <= max) return text;
  let w = words(text.slice(0, max + 12));
  while (w.length && w.join(' ').length > max) w.pop();
  while (w.length > 1 && TRAILING_JUNK.test(w[w.length - 1])) w.pop();
  while (w.length > 1 && TRAILING_JUNK.test(w[w.length - 1])) w.pop();
  let out = w.join(' ').replace(/[\s,;:.–—\-]+$/, '').trim();
  // Si al podar nos quedamos muy cortos, reintentamos con un limite algo mayor.
  if (out.length < max * 0.55) {
    let w2 = words(text.slice(0, max + 20));
    while (w2.length && w2.join(' ').length > max + 6) w2.pop();
    while (w2.length > 1 && TRAILING_JUNK.test(w2[w2.length - 1])) w2.pop();
    const alt = w2.join(' ').replace(/[\s,;:.–—\-]+$/, '').trim();
    if (alt.length > out.length) out = alt;
  }
  return out;
}

/** Todos los <h2> con contenido propio, en orden. */
function realH2s(html) {
  return [...html.matchAll(/<h2[^>]*>([\s\S]{2,200}?)<\/h2>/gi)]
    .map((m) => stripTags(m[1]))
    .filter((t) => t.length >= 12 && t.length <= 90 && !GENERIC_H2.test(t) && !/^cha0smagick labs$/i.test(t));
}

function firstParagraph(html) {
  const body = html.slice(html.search(/<body[^>]*>/i));
  for (const m of body.matchAll(/<p[^>]*>([\s\S]{40,600}?)<\/p>/gi)) {
    const t = stripTags(m[1]);
    if (t.length >= 40 && !/cha0smagick labs/i.test(t)) return t;
  }
  return null;
}

/** Quita palabras de cierre que no pueden quedar al final de un titulo. */
function cleanTail(title) {
  let w = words(title);
  while (w.length > 1 && TRAILING_JUNK.test(w[w.length - 1])) w.pop();
  return w.join(' ').replace(/[\s,;:.–—\-]+$/, '').trim();
}

/**
 * Titulo final a partir de las partes del <title> original.
 *
 * IMPORTANTE: aqui NO se recorta por longitud. Google no penaliza un title
 * largo; lo trunca en pantalla (~60 chars) pero sigue indexando el texto
 * completo, y truncar en media palabra destruye keywords ("Best Occult Books
 * for Beginners in 2026: Building" es PEOR que el original de 71 chars).
 * Lo que si es un defecto real y se corrige:
 *   - la repeticion "X | X | Marca" que quema ~40 chars de presupuesto, y
 *   - la colision exacta entre paginas (canibalizacion).
 */
function rebuildTitle(rawTitle) {
  const parts = rawTitle.split('|').map((s) => s.trim()).filter(Boolean);
  // 1) dedupe exacto de partes consecutivas ("X | X | Marca")
  const dedup = parts.filter((p, i) => i === 0 || p.toLowerCase() !== parts[i - 1].toLowerCase());
  // 2) dedupe por prefijo: "Ancient Mythology and Speculation | Ancient Mythology and"
  //    la segunda parte es un prefijo de la primera y solo quema presupuesto.
  const noPrefix = dedup.filter((p, i) => {
    if (i === 0) return true;
    const head = dedup[0].toLowerCase();
    return !(head.startsWith(p.toLowerCase()) || p.toLowerCase().startsWith(head));
  });
  const noBrand = noPrefix.filter((p) => p.toLowerCase() !== BRAND.toLowerCase());
  const kept = noBrand.length ? noBrand : noPrefix.length ? noPrefix : dedup;
  if (!kept.length) return null;
  return cleanTail(kept.join(' | '));
}

const files = walk(ROOT);
const stats = {
  scanned: files.length,
  excluded: 0,
  titleDedupe: 0,
  titleResized: 0,
  titleDisambiguated: 0,
  h1Fixed: 0,
  descResized: 0,
  descAdded: 0,
  descDisambiguated: 0,
};

const pages = [];
for (const abs of files) {
  const rel = relative(ROOT, abs).split('\\').join('/');
  if (EXCLUDE_PREFIX.some((p) => rel.startsWith(p))) {
    stats.excluded++;
    continue;
  }
  const html = readFileSync(abs, 'utf8');
  const tm = html.match(/<title>([\s\S]*?)<\/title>/i);
  const rawTitle = tm ? stripTags(tm[1]) : null;

  let title = rawTitle;
  if (rawTitle) {
    const before = rawTitle;
    title = rebuildTitle(rawTitle);
    const b = words(before);
    if (b.length >= 2 && b[0].toLowerCase() === b[1].toLowerCase()) stats.titleDedupe++;
    if (title && title.length < before.length) stats.titleResized++;
  }

  const h1m = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  const h1Text = h1m ? stripTags(h1m[1]) : null;
  const dm = html.match(/<meta\s+name="description"\s+content="([^"]*)"\s*\/?>/i);
  const desc = dm ? stripTags(dm[1]) : null;

  // No se calcula aqui si el title cambio. El desempate de titles colisionados
  // muta p.title DESPUES de este push, asi que cualquier bandera puesta aqui
  // quedaria obsoleta. La comparacion se hace en el bucle de escritura, y en
  // crudo contra crudo, para no depender de como escape() normalice las
  // entidades.
  pages.push({
    abs, rel, html, title,
    h1Text, desc, h2s: realH2s(html), para: firstParagraph(html),
  });
}

// Desempatar titles colisionados usando el angulo real (primer <h2> propio).
const byTitle = new Map();
for (const p of pages) {
  if (!p.title) continue;
  const k = p.title.toLowerCase();
  if (!byTitle.has(k)) byTitle.set(k, []);
  byTitle.get(k).push(p);
}
for (const [key, group] of byTitle) {
  if (group.length < 2) continue;
  const base = group.find((p) => !/-\d+\.html$/.test(p.rel)) || group[0];
  for (const p of group) {
    if (p === base) continue;
    const head = p.title.split('|')[0].trim();
    // Probar angulos hasta que alguno quepa entero.
    let chosen = null;
    for (const h of p.h2s.slice(0, 3)) {
      const merged = cleanTail(`${head}: ${h}`);
      // Sin recorte: el angulo completo es lo que desempata de verdad.
      if (merged.length > head.length + 6) {
        chosen = merged;
        break;
      }
    }
    if (!chosen && p.h2s.length) {
      chosen = cleanTail(`${head}: ${p.h2s[0]}`);
    }
    if (chosen && chosen.toLowerCase() !== key) {
      p.title = chosen;
      stats.titleDisambiguated++;
    }
  }
}

// Muestras automaticas para inspeccion (deben marcarse ANTES del bucle de aplicacion).
const SHOW = [
  /^apps\/astral-lab\.html$/,
  /^apps\/arcana-goetia\.html$/,
  /^books\/manual-activacion-servidores-magicos-pdf\.html$/,
  /^landing-pages\/books-bundle\.html$/,
  /^index\.html$/,
  /^tools\/reality-check-tracker\.html$/,
  /^blog\/gnosis-chaos-magick-complete-techniques\.html$/,
  /^blog\/tarot-suits-meaning-cups-wands-swords-pentacles\.html$/,
  /^blog\/best-occult-books-beginners-2026\.html$/,
  /^blog\/best-lucid-dreaming-apps-android-2026\.html$/,
  /^blog\/what-is-gnosis-how-to-achieve\.html$/,
  /^blog\/moon-sign-astrology-guide\.html$/,
  /^blog\/tarot-card-meanings-major-arcana-complete-guide\.html$/,
  /^blog\/astrology-aspects-guide-conjunction-opposition-trine-square\.html$/,
  /^blog\/best-ghost-hunting-apps-android-2026\.html$/,
  /^blog\/chaos-magic-fundamentals-what-is-chaos-magic-guide-(5|24)\.html$/,
  /^blog\/ancient-mythology-and-speculation-annunaki-guide(-2)?\.html$/,
];
for (const p of pages) {
  if (SHOW.some((re) => re.test(p.rel))) p.show = true;
  else if (p.h1Text && /^cha0smagick labs$/i.test(p.h1Text)) p.show = true;
}

// Aplicar.
const usedDesc = new Map();
for (const p of pages) {
  let out = p.html;
  const before = out;

  if (p.title) {
    const t = escape(p.title);
    // OJO: el segundo argumento de replace() es una cadena interpreted con
    // sintaxis de grupos ($1, $2, $&, $$...). Si `t` contiene un precio como
    // "$10", se lee como el grupo 1 seguido de "0" y el texto se rompe. Por eso
    // todos los reemplazos de este archivo pasan una FUNCION, donde no hay nada
    // que interpretar y el texto entra literal.
    out = out.replace(/<title>[\s\S]*?<\/title>/i, () => `<title>${t}</title>`);
    // og:title y twitter:title se sincronizan con el title SOLO si hoy son una
    // copia de este. Si el autor los escribio mas largos a proposito, se dejan.
    //
    // Por que: 330 paginas de este sitio tienen un og:title deliberadamente mas
    // descriptivo que el title. Ejemplo real: el title es "Arcana Goetia: Ritual &
    // Sigils" (34 ch) y el og:title es "Arcana Goetia: Ritual & Sigils | Goetic
    // Grimoire & 72 Spirits Sigil Generator App for Android" (101 ch). Open Graph
    // tiene su propio margen y ese texto extra es el que se ve al compartir.
    //
    // Que pasaba antes: las dos lineas de abajo escribian `t` sin comparar nada,
    // asi que en cada corrida pisaban los tres campos en las 974 paginas aunque
    // no se hubiera recortado ni un titulo. El reporte decia titleResized: 0 y
    // en cambio el git diff teaching 335 archivos modificados: el dano era
    // invisible en el reporte y solo aparecia mirando el diff.
    //
    // La comparacion es en CRUDO contra CRUDO (lo que hay ahora en la etiqueta
    // frente a lo que hay ahora en el title), sin pasar por escape() ni por
    // stripTags(), porque esas dos funciones normalizan las entidades y
    // cualquier diferencia de normalizacion haria que la comparacion fallara.
    const rawTitleNow = (p.html.match(/<title>([\s\S]*?)<\/title>/i) || [, ''])[1];
    const ogInSync = (re) => {
      const m = p.html.match(re);
      return m && m[1] === rawTitleNow;
    };
    if (ogInSync(/(<meta\s+property="og:title"\s+content=")([^"]*)(")/i)) {
      out = out.replace(/(<meta\s+property="og:title"\s+content=")[^"]*(")/i, (_m, pre, post) => pre + t + post);
    }
    if (ogInSync(/(<meta\s+name="twitter:title"\s+content=")([^"]*)(")/i)) {
      out = out.replace(/(<meta\s+name="twitter:title"\s+content=")[^"]*(")/i, (_m, pre, post) => pre + t + post);
    }
  }

  if (p.h1Text && /^cha0smagick labs$/i.test(p.h1Text)) {
    const topic = (p.title || '').split('|')[0].trim();
    if (topic.length > 3) {
      out = out.replace(/<h1([^>]*)>[\s\S]*?<\/h1>/i, (_m, attrs) => `<h1${attrs}>${escape(topic)}</h1>`);
      p.h1Text = topic;
      stats.h1Fixed++;
    }
  }

  let desc = p.desc;
  if (desc && desc.length > DESC_MAX) {
    desc = clamp(desc, DESC_MAX);
    stats.descResized++;
  }
  if (!desc) {
    const base = (p.h1Text || p.title || '').split('|')[0].trim();
    const from = p.para ? clamp(p.para, DESC_MAX - base.length - 3) : '';
    desc = from ? clamp(`${base}: ${from}`, DESC_MAX) : base;
    stats.descAdded++;
  }
  const dk = (desc || '').toLowerCase();
  if (dk) {
    const n = usedDesc.get(dk) || 0;
    usedDesc.set(dk, n + 1);
    if (n > 0 && p.h2s.length) {
      const base = (p.h1Text || p.title || desc).split('|')[0].trim();
      const alt = `${base}: ${p.h2s[0]}`;
      desc = alt.length <= DESC_MAX ? alt : clamp(alt, DESC_MAX);
      stats.descDisambiguated++;
    }
  }
  if (desc) {
    const d = escapeAttr(desc);
    if (/<meta\s+name="description"/i.test(out)) {
      out = out.replace(/(<meta\s+name="description"\s+content=")[^"]*("\s*\/?>)/i, (_m, pre, post) => pre + d + post);
    } else {
      const te = out.match(/<\/title>/i);
      if (te) {
        const at = te.index + te[0].length;
        out = out.slice(0, at) + `\n<meta name="description" content="${d}">` + out.slice(at);
      }
    }
  }

  if (out !== before && !DRY) writeFileSync(p.abs, out, 'utf8');

  if ((PREVIEW || DRY) && p.show && out !== before) {
    const g = (s, re) => (s.match(re) || [, ''])[1];
    console.log('\n--- ' + p.rel);
    const oT = g(before, /<title>([\s\S]*?)<\/title>/i);
    const nT = g(out, /<title>([\s\S]*?)<\/title>/i);
    const oD = g(before, /<meta\s+name="description"\s+content="([^"]*)"/i);
    const nD = g(out, /<meta\s+name="description"\s+content="([^"]*)"/i);
    if (oT !== nT) console.log(`  T ${oT.length}->${nT.length}\n   - ${oT}\n   + ${nT}`);
    if (oD !== nD) console.log(`  D ${oD.length}->${nD.length}\n   - ${oD}\n   + ${nD}`);
  }
}

console.log(JSON.stringify({ ...stats, dry: DRY, preview: PREVIEW }, null, 2));