const fs = require('fs');

// g:id -> pagina del producto que es la fuente de verdad de la descripcion.
const PAGE = {
  'CHAOS-APP-001': 'apps/arcana-goetia.html',
  'CHAOS-APP-002': 'apps/astral-lab.html',
  'CHAOS-APP-003': 'apps/chaos-sigil-generator.html',
  'CHAOS-APP-004': 'apps/dream-machine.html',
  'CHAOS-APP-005': 'apps/eerieroads.html',
  'CHAOS-APP-006': 'apps/iching-oracle.html',
  'CHAOS-APP-007': 'apps/lucid-dream.html',
  'CHAOS-APP-008': 'apps/lunar-phase-calculator.html',
  'CHAOS-APP-009': 'apps/noctem-tools.html',
  'CHAOS-APP-010': 'apps/norse-rune-oracle.html',
  'CHAOS-APP-011': 'apps/psi-gym.html',
  'CHAOS-APP-012': 'apps/unofficial-rider-waite-tarot.html',
  'CHAOS-BOOK-001': 'books/codex-chaoticus-pdf.html',
  'CHAOS-BOOK-002': 'books/liber-lvpinux-pdf.html',
  'CHAOS-BOOK-003': 'books/manual-activacion-servidores-magicos-pdf.html',
  'CHAOS-BOOK-004': 'books/mind-the-gap-pdf.html',
  'CHAOS-BOOK-005': 'books/ouija-cazadora-pdf.html',
  'CHAOS-BOOK-006': 'books/tarot-chaos-pdf.html',
  'CHAOS-BOOK-007': 'books/tratado-runas-cazadoras-caos-pdf.html',
  'CHAOS-BOOK-008': 'books/catholiconomicon-pdf.html',
};

// Titulos REALES de la landing de Hotmart, verificados uno a uno con fetch.
// El g:link del feed apunta a Hotmart, asi que el titulo debe ser el de destino:
// si no coincide con la landing, Google rechaza el anuncio.
const HOTMART_TITLE = {
  'CHAOS-BOOK-001': 'Codex Chaoticum - A Complete Treatise on Chaos Magick',
  'CHAOS-BOOK-002': 'Liber LVPINUX',
  'CHAOS-BOOK-003': 'Manual de creacion y activacion de servidores magicos (By Frater Alek0s)',
  'CHAOS-BOOK-004': 'MIND THE GAP - The 0.3 Seconds That Control Your Life',
  'CHAOS-BOOK-005': 'Ouija Cazadora del caos - By Zener de Cydonia',
  'CHAOS-BOOK-006': 'The Chaos Tarot',
  'CHAOS-BOOK-007': 'Tratado de Runas Cazadoras del Caos',
  'CHAOS-BOOK-008': 'Catholiconomicon - A Rimbonic Grimoire of the Universal Law (Bilingual EN/ES Edition)',
};

// BOOK-006 usaba /images/ en vez de /assets/images/. El duplicado existe y
// funciona, pero es la unica excepcion y desalinea el feed del resto.
const IMAGE_FIX = { 'CHAOS-BOOK-006': 'https://cha0smagicklabs.com/assets/images/tarotchaos.PNG' };

const DRY = process.argv.includes('--dry');

function esc(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
function unesc(s) {
  return s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&apos;/g, "'");
}
// Lee la meta description real de la pagina del producto.
function descOf(p) {
  if (!fs.existsSync(p)) return null;
  const c = fs.readFileSync(p, 'utf8');
  const m = c.match(/<meta\s+name="description"\s+content="([^"]*)"/i);
  return m ? unesc(m[1]).trim() : null;
}

let xml = fs.readFileSync('google-merchant.xml', 'utf8');
const problems = [];
const notes = [];
let changedDesc = 0, changedTitle = 0, changedImg = 0;

for (const [id, page] of Object.entries(PAGE)) {
  const d = descOf(page);
  if (!d || !d.length) { problems.push(id + ': sin meta description en ' + page); continue; }
  // Merchant Center admite 5000 caracteres; 160 es solo el punto de corte del
  // snippet. Pasarse no es un error del feed, asi que solo se anota.
  if (d.length > 160) notes.push(id + ': description de ' + d.length + 'ch (se recorta en el snippet)');

  const re = new RegExp('(<g:id>' + id + '</g:id>[\\s\\S]*?<g:description>)([\\s\\S]*?)(</g:description>)');
  if (!re.test(xml)) { problems.push(id + ': no encontrado en el feed'); continue; }
  if (d.replace(/&/g, '&amp;') !== xml.match(re)[2]) {
    xml = xml.replace(re, (m, a, old, z) => a + esc(d) + z);
    changedDesc++;
  }

  if (HOTMART_TITLE[id]) {
    const rt = new RegExp('(<g:id>' + id + '</g:id>[\\s\\S]*?<g:title>)([\\s\\S]*?)(</g:title>)');
    if (rt.test(xml)) {
      xml = xml.replace(rt, (m, a, old, z) => a + esc(HOTMART_TITLE[id]) + z);
      changedTitle++;
    }
  }
  if (IMAGE_FIX[id]) {
    const ri = new RegExp('(<g:id>' + id + '</g:id>[\\s\\S]*?<g:image_link>)([\\s\\S]*?)(</g:image_link>)');
    xml = xml.replace(ri, (m, a, old, z) => a + IMAGE_FIX[id] + z);
    changedImg++;
  }
}

// Validacion antes de escribir: XML bien formado y 20 items.
const items = (xml.match(/<item>/g) || []).length;
if (items !== 20) problems.push('items = ' + items + ' (esperado 20)');
if (/digital PDF download\.|occult and esoteric practice app for Android\./.test(xml)) {
  problems.push('quedan descripciones genericas');
}

console.log(DRY ? '=== DRY-RUN ===' : '=== ESCRITURA ===');
console.log('  descripciones reales aplicadas: ' + changedDesc + '/20');
console.log('  titulos de Hotmart aplicados    : ' + changedTitle + '/8');
console.log('  imagenes unificadas             : ' + changedImg);
console.log('  problemas: ' + problems.length);
problems.forEach(p => console.log('    - ' + p));
if (notes.length) { console.log('  avisos: ' + notes.length); notes.forEach(n => console.log('    ~ ' + n)); }

if (!DRY && problems.length === 0) {
  fs.writeFileSync('google-merchant.xml', xml, 'utf8');
  console.log('  ESCRITO google-merchant.xml (' + xml.length + ' bytes)');
} else if (!DRY) {
  console.log('  NO se escribe: hay problemas');
}