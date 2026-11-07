/**
 * apply-ui-css-site.mjs — Vincula css/ui.css en las páginas de entrada del sitio
 * (home, índice de books, landing pages) para homogeneidad visual.
 * Dry-run por defecto. --apply escribe.
 */
import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const apply = process.argv.includes('--apply');

const files = [
  { rel: 'index.html', css: 'css/ui.css' },
  { rel: 'books/index.html', css: '../css/ui.css' },
  { rel: 'landing-pages/books-bundle.html', css: '../css/ui.css' },
  { rel: 'landing-pages/apps-bundle.html', css: '../css/ui.css' },
  { rel: 'landing-pages/complete-access.html', css: '../css/ui.css' },
  { rel: 'landing-pages/flash-sale.html', css: '../css/ui.css' },
];

let changed = 0;
let skipped = 0;

for (const file of files) {
  const full = path.join(ROOT, file.rel);
  if (!fs.existsSync(full)) {
    console.log(`SKIP (no existe): ${file.rel}`);
    skipped++;
    continue;
  }
  const html = fs.readFileSync(full, 'utf8');
  if (html.includes('css/ui.css')) {
    console.log(`SKIP (ya vinculado): ${file.rel}`);
    skipped++;
    continue;
  }
  const UI_LINK = `<link rel="stylesheet" href="${file.css}">`;
  const newHtml = html.replace('</head>', `${UI_LINK}\n</head>`);
  if (apply) fs.writeFileSync(full, newHtml, 'utf8');
  changed++;
  console.log(`${apply ? 'APPLY' : 'DRY-RUN'}: ${file.rel}`);
}

console.log(`\nTotal: ${files.length} | Cambiados: ${changed} | Saltados: ${skipped} | Modo: ${apply ? 'APPLIED' : 'DRY-RUN'}`);
if (!apply) console.log('Pasa --apply para escribir los cambios.');
