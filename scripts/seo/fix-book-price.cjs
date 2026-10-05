const fs = require('fs');
const path = require('path');

// Precio real por libro, leido del detalle que ve el usuario (detail-price).
// Es la unica fuente de verdad: es lo que el visitante ve y lo que cobra Hotmart.
const BOOKS = {
  'codex-chaoticus-pdf.html': '4.99',
  'liber-lvpinux-pdf.html': '3.99',
  'manual-activacion-servidores-magicos-pdf.html': '3.99',
  'ouija-cazadora-pdf.html': '3.99',
  'tarot-chaos-pdf.html': '9.99',
  'tratado-runas-cazadoras-caos-pdf.html': '3.99',
  'mind-the-gap-pdf.html': '9.99',
  'catholiconomicon-pdf.html': '9.99',
  'catholiconomicon-es-pdf.html': '9.99',
};
// Archivos que el usuario tiene modificados: no se tocan.
const SKIP = new Set(['mind-the-gap-pdf.html']);
const DRY = process.argv.includes('--dry');

console.log(DRY ? '=== DRY-RUN ===' : '=== ESCRITURA ===');
for (const [f, price] of Object.entries(BOOKS)) {
  if (SKIP.has(f)) { console.log('  OMITIDO (archivo del usuario) ' + f); continue; }
  const p = path.join('books', f);
  let c = fs.readFileSync(p, 'utf8');

  // El precio visible debe coincidir con la tabla, o nos apoyariamos en una cifra inventada.
  const vis = (c.match(/class="detail-price"[^>]*>\s*\$([\d.]+)/) || [])[1];
  if (vis && vis !== price) {
    console.log('  ABORTA ' + f + ': detail-price $' + vis + ' != tabla $' + price);
    continue;
  }

  let fixed = 0;
  c = c.replace(/"price"\s*:\s*"[\d.]+"/g, () => { fixed++; return '"price":"' + price + '"'; });
  if (fixed) {
    if (!DRY) fs.writeFileSync(p, c, 'utf8');
    console.log('  ' + f.padEnd(46) + ' precios corregidos: ' + fixed + '  -> $' + price);
  } else {
    console.log('  ' + f.padEnd(46) + ' sin precios que corregir');
  }
}