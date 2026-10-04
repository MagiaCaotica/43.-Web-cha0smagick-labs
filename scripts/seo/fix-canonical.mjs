#!/usr/bin/env node
/**
 * fix-canonical.mjs
 *
 * Corrige el bug de mayor impacto del sitio: 351 paginas declaraban un
 * canonical que apunta a OTRO articulo (`blog/sigil-magic-complete-theory-practice.html`).
 * Eso le dice a Google "indexa estas 350 paginas como si fueran una sola", lo que
 * consolida contenido distinto y deindexa casi todo el blog.
 *
 * Tambien:
 *   - replica el fix en el <link rel="alternate" hreflang> (replica el canonical)
 *   - marca 404.html como noindex,follow (no deberia tener canonical a la home)
 *   - anade noindex al contenido de andamiaje de projects/
 *
 * Idempotente: correrlo dos veces no cambia nada la segunda vez.
 *
 * Uso: node scripts/seo/fix-canonical.mjs [--dry]
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(fileURLToPath(new URL('.', import.meta.url)), '..', '..');
const BASE = 'https://cha0smagicklabs.com';
const DRY = process.argv.includes('--dry');

// Directorios que no son contenido publicable del sitio.
const NOINDEX_DIRS = ['projects'];

function walk(dir, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === '.git') continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (entry.name.endsWith('.html')) out.push(full);
  }
  return out;
}

/** URL canonica correcta para un archivo, según su ruta relativa al repo. */
function canonicalFor(relPath) {
  const p = relPath.split('\\').join('/');
  if (p === 'index.html') return BASE + '/';
  if (p.endsWith('/index.html')) return BASE + '/' + p.slice(0, -'index.html'.length);
  return BASE + '/' + p;
}

const files = walk(ROOT);
const report = {
  scanned: files.length,
  canonicalFixed: 0,
  hreflangFixed: 0,
  canonicalAdded: 0,
  notFoundNoindex: 0,
  scaffoldNoindex: 0,
  stillWrong: [],
};

for (const abs of files) {
  const rel = relative(ROOT, abs).split('\\').join('/');
  const html = readFileSync(abs, 'utf8');
  const original = html;
  let out = html;

  const isNotFound = rel === '404.html';
  const isScaffold = NOINDEX_DIRS.some((d) => rel.startsWith(d + '/'));

  // --- canonical -------------------------------------------------------
  const canonRe = /<link\s+rel="canonical"\s+href="([^"]*)"\s*\/?>/i;
  const canonMatch = out.match(canonRe);

  if (isNotFound) {
    // 404 nunca debe canonicalizar ni indexarse.
    if (canonMatch) {
      out = out.replace(canonRe, '');
      report.notFoundNoindex++;
    }
  } else {
    const want = canonicalFor(rel);

    if (canonMatch) {
      if (canonMatch[1] !== want) {
        out = out.replace(canonRe, `<link rel="canonical" href="${want}">`);
        report.canonicalFixed++;
      }
    } else {
      // Sin canonical: se lo ponemos (respeta el orden: tras el <title>).
      const titleEnd = out.match(/<\/title>/i);
      if (titleEnd) {
        const at = titleEnd.index + titleEnd[0].length;
        out = out.slice(0, at) + `\n<link rel="canonical" href="${want}">` + out.slice(at);
        report.canonicalAdded++;
      }
    }

    // El hreflang replica el canonical roto: hay que corregirlo tambien.
    const hrefRe = /(<link\s+rel="alternate"\s+href=")([^"]*)("\s+hreflang="[^"]*"\s*\/?>)/gi;
    out = out.replace(hrefRe, (full, pre, href, post) => {
      if (href !== want) {
        report.hreflangFixed++;
        return pre + want + post;
      }
      return full;
    });

    // Verificacion post-hoc: el canonical ya no puede ser otro archivo.
    const after = out.match(canonRe);
    if (after && after[1] !== want) report.stillWrong.push(`${rel} -> ${after[1]}`);
  }

  // --- noindex para andamiaje -----------------------------------------
  if (isScaffold && !/<meta\s+name="robots"\s+content="[^"]*noindex/i.test(out)) {
    const titleEnd = out.match(/<\/title>/i);
    if (titleEnd) {
      const at = titleEnd.index + titleEnd[0].length;
      out =
        out.slice(0, at) +
        '\n<meta name="robots" content="noindex, nofollow">' +
        out.slice(at);
      report.scaffoldNoindex++;
    }
  }

  // 404 tambien necesita noindex explicito.
  if (isNotFound && !/<meta\s+name="robots"\s+content="[^"]*noindex/i.test(out)) {
    const titleEnd = out.match(/<\/title>/i);
    if (titleEnd) {
      const at = titleEnd.index + titleEnd[0].length;
      out =
        out.slice(0, at) +
        '\n<meta name="robots" content="noindex, follow">' +
        out.slice(at);
      report.notFoundNoindex++;
    }
  }

  if (out !== original && !DRY) writeFileSync(abs, out, 'utf8');
}

console.log(JSON.stringify({ ...report, stillWrong: report.stillWrong.slice(0, 10), dry: DRY }, null, 2));