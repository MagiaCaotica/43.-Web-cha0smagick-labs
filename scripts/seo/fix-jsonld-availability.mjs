/**
 * fix-jsonld-availability.mjs — Añade "availability": "https://schema.org/InStock"
 * a los Offer de Product/Book/SoftwareApplication que le faltan.
 * Dry-run por defecto. --apply escribe los cambios.
 */
import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const apply = process.argv.includes('--apply');

const files = [
  'apps/index.html',
  'books/index.html',
  'index.html',
];

let totalChanges = 0;

for (const rel of files) {
  const full = path.join(ROOT, rel);
  const html = fs.readFileSync(full, 'utf8');

  // Patrón: Offer con price y priceCurrency pero sin availability
  // Reemplaza: "offers": { "@type": "Offer", "price": "3.99", "priceCurrency": "USD" }
  // Por:       "offers": { "@type": "Offer", "price": "3.99", "priceCurrency": "USD", "availability": "https://schema.org/InStock" }
  const before = html;
  const after = html.replace(
    /("offers"\s*:\s*\{\s*"@type"\s*:\s*"Offer"[^}]*?"priceCurrency"\s*:\s*"USD"[^}]*?)\}/g,
    (match, inner) => {
      if (inner.includes('"availability"')) return match; // ya lo tiene
      totalChanges++;
      return inner + ', "availability": "https://schema.org/InStock"}';
    }
  );

  if (after !== before) {
    if (apply) fs.writeFileSync(full, after, 'utf8');
    console.log(`${apply ? 'APPLY' : 'DRY-RUN'}: ${rel} — availability añadido a offers`);
  } else {
    console.log(`SKIP (sin cambios): ${rel}`);
  }
}

console.log(`\nTotal ofertas corregidas: ${totalChanges} | Modo: ${apply ? 'APPLIED' : 'DRY-RUN'}`);
if (!apply) console.log('Pasa --apply para escribir los cambios.');
