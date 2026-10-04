#!/usr/bin/env node
/**
 * fix-article-eeaat.mjs
 *
 * Cierra los huecos E-E-A-T / on-page de los articulos de blog que quedaron
 * atrasados respecto al template actual:
 *
 *   1. Inserta <h1> + byline visible en articulos que no tienen ninguno
 *      (el grupo legacy: 91 archivos que arrancaban directo en <h2>).
 *   2. Inserta la byline visible en articulos que tienen <h1> pero no la tienen.
 *   3. Inserta <meta name="author"> donde falte.
 *   4. Inserta "dateModified" en el JSON-LD donde falte (reusa datePublished:
 *      no hay evidencia de una modificacion posterior real).
 *   5. Inserta un bloque JSON-LD Article minimo en articulos sin schema.
 *
 * Es idempotente: correrlo dos veces no cambia nada.
 *
 * Uso:
 *   node scripts/seo/fix-article-eeaat.mjs --dry        # no escribe, imprime conteos
 *   node scripts/seo/fix-article-eeaat.mjs --preview 12  # aplica, muestra 12 diffs
 *   node scripts/seo/fix-article-eeaat.mjs              # aplica
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const SITE = 'https://cha0smagicklabs.com';
const AUTHOR = 'Cha0smagick Labs - Frater Alek0s';
const AUTHOR_SHORT = 'Frater Alek0s';

// NUNCA tocar esto: vendored de terceros, salidas de build, docs de tooling.
const EXCLUDE_PREFIX = [
  'projects/',
  'node_modules/',
  '.git/',
  'tools/auto-shorts/',
];

const args = process.argv.slice(2);
const DRY = args.includes('--dry');
const PREVIEW_N = (() => {
  const i = args.indexOf('--preview');
  return i !== -1 ? Number(args[i + 1]) || 0 : 0;
})();

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === '.git') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (entry.name.endsWith('.html')) out.push(full);
  }
  return out;
}

function rel(file) {
  return path.relative(ROOT, file).split(path.sep).join('/');
}

function isExcluded(relPath) {
  return EXCLUDE_PREFIX.some((p) => relPath.startsWith(p));
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function stripTags(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ');
}

function countWords(html) {
  const text = stripTags(html).replace(/&[a-z]+;/gi, ' ');
  return text.split(/\s+/).filter(Boolean).length;
}

/** "2026-09-26" -> "September 26, 2026" */
function longDate(iso) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || '');
  if (!m) return null;
  return `${MONTHS[Number(m[2]) - 1]} ${Number(m[3])}, ${m[1]}`;
}

/** Deriva el titulo legible de la pagina: <title> sin la marca final. */
function pageTitle(html) {
  const m = /<title>([\s\S]*?)<\/title>/i.exec(html);
  if (!m) return null;
  let t = m[1].trim();
  t = t.replace(/\s*\|\s*Cha0smagick Labs\s*$/i, '');
  // Dedupe del patron "X | X | Marca"
  const parts = t.split('|').map((s) => s.trim()).filter(Boolean);
  if (parts.length >= 2 && parts[0] === parts[1]) t = parts[0];
  t = t.replace(/\s+/g, ' ').trim();
  return t || null;
}

function metaContent(html, name) {
  const re = new RegExp(
    `<meta[^>]+(?:name|property)=["']${name}["'][^>]*content=["']([^"']*)["']`,
    'i',
  );
  const m = re.exec(html);
  return m ? m[1] : null;
}

function absoluteUrl(relPath) {
  if (relPath === 'index.html') return `${SITE}/`;
  if (relPath.endsWith('/index.html')) {
    return `${SITE}/${relPath.slice(0, -'index.html'.length)}`;
  }
  return `${SITE}/${relPath}`;
}

/** Fecha de publicacion: prefers el JSON-LD, luego <time datetime>. */
function findDatePublished(html) {
  const ld = /"datePublished"\s*:\s*"([^"]+)"/.exec(html);
  if (ld) return ld[1];
  const t = /<time[^>]+datetime=["']([^"']+)["']/i.exec(html);
  if (t) return t[1];
  return null;
}

function hasLdJson(html) {
  return /<script[^>]+application\/ld\+json/i.test(html);
}

/**
 * Inserta `snippet` justo antes de </head>. Si no hay </head>, antes de </body>,
 * y si tampoco, al final del archivo.
 */
function insertBeforeHeadEnd(html, snippet) {
  if (/<\/head>/i.test(html)) return html.replace(/<\/head>/i, `${snippet}\n</head>`);
  if (/<\/body>/i.test(html)) return html.replace(/<\/body>/i, `${snippet}\n</body>`);
  return html + '\n' + snippet;
}

/**
 * Inserta el bloque de byline. Se coloca despues del <h1> si existe; si no,
 * despues del <div class="blog-nav"> o del <article ...> de apertura.
 */
function insertByline(html, bylineHtml) {
  const h1 = /<h1[^>]*>[\s\S]*?<\/h1>/i.exec(html);
  if (h1) {
    const at = h1.index + h1[0].length;
    return html.slice(0, at) + '\n' + bylineHtml + html.slice(at);
  }
  const nav = /<div class="blog-nav">[\s\S]*?<\/div>/i.exec(html);
  if (nav) {
    const at = nav.index + nav[0].length;
    return html.slice(0, at) + `\n<h1>${escapeHtml(pageTitle(html) || 'Article')}</h1>\n` + bylineHtml + html.slice(at);
  }
  const art = /<article[^>]*>/i.exec(html);
  if (art) {
    const at = art.index + art[0].length;
    return (
      html.slice(0, at) +
      `\n<h1>${escapeHtml(pageTitle(html) || 'Article')}</h1>\n` +
      bylineHtml +
      html.slice(at)
    );
  }
  return null;
}

function buildByline(iso, minutes) {
  const long = longDate(iso);
  if (!long) return null;
  return (
    `<div class="meta">By ${AUTHOR_SHORT} | ` +
    `<time datetime="${iso}">${long}</time>` +
    `${minutes ? ` | ${minutes} min read` : ''}</div>`
  );
}

function buildArticleSchema({ url, headline, datePublished, dateModified, description, image }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    url,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    datePublished,
    dateModified: dateModified || datePublished,
    author: { '@type': 'Person', name: AUTHOR_SHORT, url: `${SITE}/pages/about.html` },
    publisher: {
      '@type': 'Organization',
      name: 'Cha0smagick Labs',
      url: SITE,
      logo: { '@type': 'ImageObject', url: `${SITE}/assets/images/logo.png` },
    },
  };
  if (description) schema.description = description;
  if (image) schema.image = image;
  return `<script type="application/ld+json">\n${JSON.stringify(schema, null, 2)}\n</script>`;
}

// ---------------------------------------------------------------- run

const files = walk(ROOT)
  .map(rel)
  .filter((r) => r.startsWith('blog/') && !isExcluded(r));

const stats = {
  scanned: files.length,
  h1Added: 0,
  bylineAdded: 0,
  authorMetaAdded: 0,
  dateModifiedAdded: 0,
  schemaAdded: 0,
  skippedNoTitle: 0,
  skippedNoDate: 0,
  skippedNoAnchor: 0,
  unchanged: 0,
};

const samples = [];

for (const r of files) {
  const abs = path.join(ROOT, r);
  const before = fs.readFileSync(abs, 'utf8');
  let after = before;
  const changes = [];

  const title = pageTitle(before);
  const datePublished = findDatePublished(before);

  // 1) H1 + byline
  const hasH1 = /<h1[\s>]/i.test(before);
  const hasByline = /By Frater Alek0s/i.test(before);

  if (!hasH1 || !hasByline) {
    if (!title) {
      stats.skippedNoTitle += 1;
    } else if (!datePublished) {
      stats.skippedNoDate += 1;
    } else {
      const bodyMatch = /<article[^>]*>([\s\S]*?)<\/article>/i.exec(before);
      const minutes = bodyMatch ? Math.max(1, Math.round(countWords(bodyMatch[1]) / 220)) : 0;
      const byline = buildByline(datePublished, minutes);
      const patched = insertByline(after, byline);
      if (patched) {
        after = patched;
        if (!hasH1) {
          stats.h1Added += 1;
          changes.push('h1');
        }
        stats.bylineAdded += 1;
        changes.push('byline');
      } else {
        stats.skippedNoAnchor += 1;
      }
    }
  }

  // 2) meta author
  if (!/<meta[^>]+name=["']author["']/i.test(after)) {
    after = insertBeforeHeadEnd(after, `<meta name="author" content="${escapeHtml(AUTHOR)}">`);
    stats.authorMetaAdded += 1;
    changes.push('meta-author');
  }

  // 3) dateModified en el JSON-LD existente
  if (/"datePublished"/.test(after) && !/"dateModified"/.test(after)) {
    const dm = after.replace(
      /("datePublished"\s*:\s*"([^"]+)")/,
      (m, whole, iso) => `${whole},\n    "dateModified": "${iso}"`,
    );
    if (dm !== after) {
      after = dm;
      stats.dateModifiedAdded += 1;
      changes.push('dateModified');
    }
  }

  // 4) schema minimo si no hay ninguno
  if (!hasLdJson(after)) {
    if (title && datePublished) {
      const url = absoluteUrl(r);
      const snippet = buildArticleSchema({
        url,
        headline: title,
        datePublished,
        description: metaContent(after, 'description') || metaContent(after, 'og:description'),
        image: metaContent(after, 'og:image'),
      });
      after = insertBeforeHeadEnd(after, snippet);
      stats.schemaAdded += 1;
      changes.push('schema');
    } else {
      stats.skippedNoAnchor += 1;
    }
  }

  if (after === before) {
    stats.unchanged += 1;
    continue;
  }

  if (PREVIEW_N > 0 && samples.length < PREVIEW_N) {
    samples.push({ r, changes: changes.join(',') });
  }

  if (!DRY) fs.writeFileSync(abs, after, 'utf8');
}

console.log(JSON.stringify(stats, null, 2));
if (PREVIEW_N > 0) {
  console.log('\n-- muestras --');
  for (const s of samples) console.log(`  ${s.r}  [${s.changes}]`);
}
if (DRY) console.log('\n(dry run: no se escribio nada)');