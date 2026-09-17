// Genera projects/ventas/interlinking-blog-apps.md por descubrimiento real de <title>.
const fs = require('fs');
const path = require('path');
const root = 'D:/Paginas web/Cha0smagick Labs/43.-Web-cha0smagick-labs';
const outDir = path.join(root, 'projects', 'ventas');
const outFile = path.join(outDir, 'interlinking-blog-apps.md');

const STOP = new Set(['de','la','el','los','las','un','una','unos','unas','y','o','u','a','al','del','con','sin','para','por','en','que','como','guia','gu','the','of','and','for','to','in','on','at','is','are','your','you','how','what','why','when','from','2026','2025']);

const humanize = (slug) =>
  slug
    .replace(/\.html?$/i, '')
    .replace(/\bpdf$/i, '(PDF)')
    .split(/[-_]+/)
    .filter((w) => w && !/^pdf$/i.test(w))
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

const tokens = (s) =>
  (s || '')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, ' ')
    .split(/[\s-]+/)
    .filter((w) => w.length > 2 && !STOP.has(w));

function getTitle(f) {
  try {
    const m = /<title[^>]*>([\s\S]*?)<\/title>/i.exec(fs.readFileSync(f, 'utf8'));
    return m ? m[1].trim().replace(/<[^>]+>/g, '').trim() : '';
  } catch { return ''; }
}

// Productos: apps + books
const products = [];
for (const dir of ['apps', 'books']) {
  for (const f of fs.readdirSync(path.join(root, dir)).filter((f) => /\.html?$/i.test(f))) {
    const file = path.join(root, dir, f);
    const title = getTitle(file);
    products.push({
      kind: dir === 'apps' ? 'App' : 'Libro',
      slug: f.replace(/\.html?$/i, ''),
      path: `/${dir}/${f}`,
      title,
      anchor: title.split(/[|–—-]/)[0].trim() || humanize(f),
      kws: new Set([...tokens(f.replace(/\.html?$/i, '')), ...tokens(title)]),
    });
  }
}

// Artículos del blog
const blogDir = path.join(root, 'blog');
const articles = fs
  .readdirSync(blogDir)
  .filter((f) => /\.html?$/i.test(f))
  .map((f) => {
    const file = path.join(blogDir, f);
    const title = getTitle(file);
    return {
      slug: f.replace(/\.html?$/i, ''),
      path: `/blog/${f}`,
      title,
      kws: new Set([...tokens(f.replace(/\.html?$/i, '')), ...tokens(title)]),
    };
  });

// Scoring: overlap de keywords >2 chars
const rows = [];
for (const a of articles) {
  const hits = [];
  for (const p of products) {
    let score = 0;
    for (const kw of p.kws) if (a.kws.has(kw)) score++;
    if (score >= 1) hits.push({ p, score });
  }
  hits.sort((x, y) => y.score - x.score);
  if (hits.length === 0) continue;
  for (const { p, score } of hits.slice(0, 3)) {
    const level = score >= 2 ? 'High' : a.kws.has([...p.kws][0]) ? 'Medium' : 'Low';
    rows.push({ article: a, product: p, score, level });
  }
}

rows.sort((x, y) => x.article.path.localeCompare(y.article.path) || y.score - x.score);

const md = [
  '# Mapa de Interlinking Blog → Productos',
  '',
  '> Generado automáticamente por descubrimiento de `<title>` reales en disco.',
  `> Fuentes: ${products.length} productos (${products.filter((p) => p.kind==='App').length} apps + ${products.filter((p) => p.kind==='Libro').length} libros), ${articles.length} artículos de blog.`,
  '',
  '## Metodología',
  '',
  '- Se extraen keywords (>2 chars, sin stopwords) del slug y `<title>` de cada producto y de cada artículo.',
  '- Score = nº de keywords de producto presentes en el artículo.',
  '- **High** = score ≥ 2 · **Medium** = score 1 con keyword de producto en el título · **Low** = score 1 sin keyword en título.',
  '- Ancla sugerida = título comercial del producto (lo usa el `<title>`, parte antes de `|`/`—`).',
  '- Implementación: enlazar el ancla una vez por artículo a la ruta del producto; prioridad High primero.',
  '',
  '## Tabla de Interlinking',
  '',
  '| Artículo ruta | Artículo título | Producto ruta | Nivel | Ancla sugerida |',
  '|---|---|---|---|---|',
  ...rows.map(
    (r) =>
      `| [${r.article.path}](${r.article.path}) | ${r.article.title.replace(/\|/g, '/')} | [${r.product.path}](${r.product.path}) | ${r.level} | ${r.product.anchor.replace(/\|/g, '/')} |`
  ),
  '',
  `Total de enlaces sugeridos: ${rows.length}`,
  '',
].join('\n');

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(outFile, md, 'utf8');
console.log(`products=${products.length} articles=${articles.length} rows=${rows.length}`);
console.log(`levels: High=${rows.filter((r) => r.level==='High').length} Med=${rows.filter((r) => r.level==='Medium').length} Low=${rows.filter((r) => r.level==='Low').length}`);
console.log('escribió: ' + path.relative(root, outFile));