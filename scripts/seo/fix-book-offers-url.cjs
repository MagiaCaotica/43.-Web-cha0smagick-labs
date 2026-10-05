#!/usr/bin/env node
/**
 * Corrige Product.offers.url / Book.offers.url en las paginas de libros.
 *
 * BUG
 * ---
 * Los 7 libros tienen en su JSON-LD la MISMA offers.url:
 *   https://pay.hotmart.com/D104270399P?checkoutMode=2
 * que es la del BUNDLE, no la de cada libro. Google leeria que los 7 libros
 * se compran en la pagina del bundle. El boton de compra visible SI apunta a
 * la URL correcta de cada libro, asi que el site "funcionaba" para el usuario
 * y mentia para el crawler.
 *
 * Este script solo toca las URLs dentro de los bloques JSON-LD. Los botones
 * visibles se dejan intactos.
 *
 * Uso: node scripts/seo/fix-book-offers-url.cjs [--dry]
 */
const fs = require('fs');
const path = require('path');

const DRY = process.argv.includes('--dry');

// URL del bundle: es la que esta contaminando todos los libros.
const BUNDLE = 'https://pay.hotmart.com/D104270399P?checkoutMode=2';

// CTA real de cada libro, leida de su propio boton de compra visible.
const REAL_CTA = {
  'codex-chaoticus-pdf.html': 'https://pay.hotmart.com/W106595764X?checkoutMode=2',
  'liber-lvpinux-pdf.html': 'https://pay.hotmart.com/O104271155J?checkoutMode=2',
  // manual-activacion-servidores-magicos ES el bundle: su URL ya es correcta.
  'manual-activacion-servidores-magicos-pdf.html': 'https://pay.hotmart.com/D104270399P?checkoutMode=2',
  // mind-the-gap-pdf.html esta modificado por el usuario: NO se toca.
  'ouija-cazadora-pdf.html': 'https://pay.hotmart.com/B104271332D?checkoutMode=2',
  'tarot-chaos-pdf.html': 'https://pay.hotmart.com/J106598345U?checkoutMode=2',
  'tratado-runas-cazadoras-caos-pdf.html': 'https://pay.hotmart.com/F104270966V?checkoutMode=2',
};

const SKIP = new Set(['mind-the-gap-pdf.html']);

const dir = path.join(__dirname, '..', '..', 'books');
const report = [];

for (const file of fs.readdirSync(dir)) {
  if (!file.endsWith('-pdf.html')) continue;
  const base = path.basename(file);
  if (SKIP.has(base)) {
    report.push([base, 'OMITIDO (modificado por el usuario)', 0]);
    continue;
  }
  const real = REAL_CTA[base];
  if (!real) {
    report.push([base, 'sin CTA conocido', 0]);
    continue;
  }

  const abs = path.join(dir, file);
  let html = fs.readFileSync(abs, 'utf8');
  let hits = 0;

  // Se sustituye SOLO dentro de los bloques JSON-LD.
  html = html.replace(
    /(<script[^>]*application\/ld\+json[^>]*>)([\s\S]*?)(<\/script>)/gi,
    (full, open, body, close) => {
      if (!body.includes(BUNDLE)) return full;
      const out = body.split(BUNDLE).join(real);
      if (out !== body) hits++;
      return open + out + close;
    }
  );

  if (hits > 0) {
    if (!DRY) fs.writeFileSync(abs, html, 'utf8');
    report.push([base, `corregidos ${hits} bloque(s) JSON-LD`, hits]);
  } else {
    report.push([base, 'ya correcto o sin offers.url con la URL del bundle', 0]);
  }
}

console.log(DRY ? '=== DRY-RUN (no se escribio nada) ===' : '=== APLICADO ===');
for (const [f, msg, n] of report) {
  console.log(`  ${f.padEnd(52)} ${msg}`);
}
console.log('');
console.log(`total bloques corregidos: ${report.reduce((a, r) => a + r[2], 0)}`);
console.log('');
console.log('Recordatorio: mind-the-gap-pdf.html quedo sin corregir a proposito');
console.log('porque tiene cambios del usuario sin commitear. Requiere su CTA');
console.log('V106730857R aplicado manualmente.');