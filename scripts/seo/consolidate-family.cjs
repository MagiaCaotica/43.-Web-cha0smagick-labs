#!/usr/bin/env node
/**
 * Consolidate a numbered family of duplicate pages into one survivor.
 *
 *   node scripts/seo/consolidate-family.cjs <family-prefix> [--write]
 *
 * With no --write it only reports what it would do.
 *
 * What it does for `blog/<prefix>-2.html`, `-3.html`, ... :
 *   1. Rewrites every internal href to the survivor `blog/<prefix>.html`.
 *   2. Sets <meta name="robots" content="noindex, follow"> on the duplicates.
 *   3. Points their <link rel="canonical"> and <link rel="alternate"> at the survivor.
 *   4. Drops the duplicates from sitemap.xml.
 *   5. Removes the duplicate cards from blog/index.html (keeps one).
 * Files are never deleted: they keep answering 200 for external links.
 */
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const SKIP = /(node_modules|\\projects\\|[\\/]projects[\\/]|tools[\\/]auto-shorts|\.git)/;

function siteHtml(dir, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (SKIP.test(p)) continue;
    if (e.isDirectory()) siteHtml(p, acc);
    else if (e.name.endsWith('.html')) acc.push(p);
  }
  return acc;
}

const prefix = process.argv[2];
const write = process.argv.includes('--write');
if (!prefix) {
  console.error('falta el prefijo de la familia');
  process.exit(1);
}

const blogDir = path.join(ROOT, 'blog');
const survivor = path.join(blogDir, `${prefix}.html`);
const dupes = fs
  .readdirSync(blogDir)
  .filter((n) => new RegExp(`^${prefix}-\\d+\\.html$`).test(n))
  .map((n) => path.join(blogDir, n));

if (!fs.existsSync(survivor)) {
  console.error(`no existe la superviviente blog/${prefix}.html`);
  process.exit(1);
}

const survivorUrl = `https://cha0smagicklabs.com/blog/${prefix}.html`;
const hrefRe = new RegExp(`${prefix}-\\d+\\.html`, 'g');
console.log(`familia: ${prefix}`);
console.log(`superviviente: blog/${prefix}.html`);
console.log(`copias: ${dupes.length}`);

// 1. Rewrite internal links everywhere.
let filesTouched = 0;
let linksRewritten = 0;
for (const file of siteHtml(ROOT)) {
  const src = fs.readFileSync(file, 'utf8');
  if (!hrefRe.test(src)) continue;
  hrefRe.lastIndex = 0;
  const out = src.replace(hrefRe, `${prefix}.html`);
  linksRewritten += (src.match(hrefRe) || []).length;
  filesTouched++;
  if (write) fs.writeFileSync(file, out, 'utf8');
}
console.log(`enlaces reescritos: ${linksRewritten} en ${filesTouched} archivos`);

// 2 + 3. robots, canonical and alternate on the duplicates.
let stamped = 0;
for (const file of dupes) {
  let src = fs.readFileSync(file, 'utf8');
  const before = src;
  src = src.replace(
    /<meta name="robots" content="[^"]*">/i,
    '<meta name="robots" content="noindex, follow">'
  );
  if (!/<meta name="robots"/i.test(src)) {
    src = src.replace(/<head>/i, '<head>\n<meta name="robots" content="noindex, follow">');
  }
  src = src.replace(
    new RegExp(`<link rel="canonical" href="[^"]*${prefix}-\\d+\\.html">`),
    `<link rel="canonical" href="${survivorUrl}">`
  );
  src = src.replace(
    new RegExp(`<link rel="alternate" href="[^"]*${prefix}-\\d+\\.html" hreflang="en">`),
    `<link rel="alternate" href="${survivorUrl}" hreflang="en">`
  );
  if (src !== before) stamped++;
  if (write) fs.writeFileSync(file, src, 'utf8');
}
console.log(`copias marcadas con noindex/canonical: ${stamped}`);

// 4. Sitemap.
const sitemapPath = path.join(ROOT, 'sitemap.xml');
let removed = 0;
if (fs.existsSync(sitemapPath)) {
  const src = fs.readFileSync(sitemapPath, 'utf8');
  const out = src.replace(/[ \t]*<url>\s*<loc>[^<]*?([a-z0-9-]+-\d+\.html)<\/loc>[\s\S]*?<\/url>\s*/g, (block, name) => {
    if (!name.startsWith(prefix)) return block;
    removed++;
    return '';
  });
  if (write && removed) fs.writeFileSync(sitemapPath, out, 'utf8');
}
console.log(`entradas quitadas del sitemap: ${removed}`);

// 5. blog/index.html cards.
// Los enlaces ya se reescribieron al pasar por el paso 1, asi que aqui se
// deduplica por el href de la superviviente: se deja la primera tarjeta y se
// quitan las copias, que ahora apuntan todas al mismo articulo.
const indexPath = path.join(blogDir, 'index.html');
let cardsRemoved = 0;
if (fs.existsSync(indexPath)) {
  const src = fs.readFileSync(indexPath, 'utf8');
  let seen = 0;
  const out = src.replace(
    /<div class="post-card"[\s\S]*?<a class="read-more"[^>]*>[\s\S]*?<\/a>\s*<\/div>\s*/g,
    (card) => {
      if (!card.includes(`href="${prefix}.html"`)) return card;
      seen++;
      if (seen === 1) return card;
      cardsRemoved++;
      return '';
    }
  );
  if (write && cardsRemoved) fs.writeFileSync(indexPath, out, 'utf8');
}
console.log(`tarjetas duplicadas retiradas de blog/index.html: ${cardsRemoved}`);
console.log(write ? 'ESCRITO' : 'simulacion, usa --write para aplicar');
