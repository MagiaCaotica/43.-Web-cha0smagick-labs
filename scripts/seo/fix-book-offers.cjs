const fs = require('fs');
const path = require('path');
const CTA = {
  'codex-chaoticus-pdf.html': ['W106595764X', '4.99'],
  'liber-lvpinux-pdf.html': ['O104271155J', '3.99'],
  'manual-activacion-servidores-magicos-pdf.html': ['D104270399P', '3.99'],
  'mind-the-gap-pdf.html': ['V106730857R', '9.99'],
  'ouija-cazadora-pdf.html': ['B104271332D', '3.99'],
  'tarot-chaos-pdf.html': ['J106598345U', '9.99'],
  'tratado-runas-cazadoras-caos-pdf.html': ['F104270966V', '3.99'],
  'catholiconomicon-pdf.html': ['A107900946S', '9.99'],
  'catholiconomicon-es-pdf.html': ['A107900946S', '9.99'],
};
const DRY = process.argv.includes('--dry');
// Archivos que el usuario tiene modificados: no se tocan ni se commitean.
const SKIP = new Set(['mind-the-gap-pdf.html']);
console.log(DRY ? '=== DRY-RUN ===' : '=== ESCRITURA ===');
for (const [f, [cta, price]] of Object.entries(CTA)) {
  const p = path.join('books', f);
  if (!fs.existsSync(p)) { console.log('  FALTA ' + p); continue; }
  if (SKIP.has(f)) { console.log('  OMITIDO (archivo del usuario) ' + f); continue; }
  let c = fs.readFileSync(p, 'utf8');
  const before = c;
  let nUrl = 0, nPrice = 0;
  // Solo dentro de bloques ld+json
  c = c.replace(/(<script type="application\/ld\+json">)([\s\S]*?)(<\/script>)/g, (m, a, body, z) => {
    let b2 = body;
    b2 = b2.replace(/"url":"https:\/\/pay\.hotmart\.com\/[A-Z0-9]+\?checkoutMode=2"/g,
      () => { nUrl++; return '"url":"https://pay.hotmart.com/' + cta + '?checkoutMode=2"'; });
    b2 = b2.replace(/"price":"[\d.]+"/g, () => { nPrice++; return '"price":"' + price + '"'; });
    return a + b2 + z;
  });
  // El precio visible en la pagina, si aparece en el schema como HTML suelto
  if (c !== before) {
    if (!DRY) fs.writeFileSync(p, c, 'utf8');
    console.log('  ' + f + '  urls:' + nUrl + '  precios:' + nPrice);
  } else {
    console.log('  ' + f + '  sin cambios');
  }
}