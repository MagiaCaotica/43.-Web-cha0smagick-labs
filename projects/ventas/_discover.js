// Discovery: manifest real de productos (index.html en projects/, fuera de blog/ventas) y artículos (dirs con 'blog').
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..'); // projects/
const htmlFiles = [];
(function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(p);
    else if (/\.html?$/i.test(entry.name)) htmlFiles.push(p);
  }
})(root);

const asPosix = (p) => p.split(path.sep).join('/');

function getTitle(file) {
  try {
    const html = fs.readFileSync(file, 'utf8');
    const m = /<title[^>]*>([\s\S]*?)<\/title>/i.exec(html);
    return m ? m[1].trim() : '';
  } catch { return ''; }
}

const products = [];
const blogFiles = [];
for (const f of htmlFiles) {
  const posix = asPosix(f);
  const inBlog = /\/blog\//i.test(posix);
  const inVentas = /\/ventas\//i.test(posix);
  if (inVentas) continue;
  if (inBlog) { blogFiles.push({ file: f, posix, title: getTitle(f) }); continue; }
  if (/index\.html$/i.test(posix)) {
    const dir = path.basename(path.dirname(f));
    products.push({ file: f, posix, dir, title: getTitle(f) });
  }
}

const manifest = {
  productos: products.map((p) => ({ dir: p.dir, title: p.title, path: p.posix })),
  articulosBlog: blogFiles.length,
  articulosMuestra: blogFiles.slice(0, 5).map((b) => ({ path: b.posix, title: b.title })),
};
fs.writeFileSync(path.join(__dirname, '_manifest.json'), JSON.stringify(manifest, null, 2));
console.log(`PRODUCTOS=${products.length}`);
for (const p of products) console.log(`  [${p.dir}] "${p.title}" -> ${p.posix}`);
console.log(`ARTICULOS_BLOG=${blogFiles.length}`);
for (const b of blogFiles.slice(0, 5)) console.log(`  ej. "${b.title}" -> ${b.posix}`);