// Analisis CRO de paginas clave: index, best-occult-apps-android, lead-magnet EN
// Uso: node _cropages.js (desde projects/ventas) — imprime solo lo esencial.
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..', '..');

function analyze(rel) {
  const c = fs.readFileSync(path.join(root, rel), 'utf8');
  const out = [];
  const mT = c.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  out.push('TITLE: ' + (mT ? mT[1].trim() : ''));
  const mD = c.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)/i);
  out.push('META-DESC: ' + (mD ? mD[1].trim().slice(0, 160) : ''));
  [...c.matchAll(/<h([1-3])[^>]*>([\s\S]*?)<\/h\1>/gi)].slice(0, 30)
    .forEach(m => out.push('H' + m[1] + ': ' + m[2].replace(/<[^>]+>/g, '').trim().slice(0, 100)));
  const ctas = [...c.matchAll(/<a[^>]*class=["'][^"']*?(?:btn|button|cta)[^"']*["'][^>]*>([\s\S]*?)<\/a>/gi)];
  out.push('BTN-COUNT: ' + ctas.length);
  ctas.slice(0, 15).forEach(m => out.push('  BTN: ' + m[1].replace(/<[^>]+>/g, '').trim().slice(0, 70) +
    ' | href=' + ((m[0].match(/href=["']([^"']*)/) || [])[1] || '')));
  const faq = [...c.matchAll(/<(details|h3|h4)[^>]*>([\s\S]*?)<\/(details|h3|h4)>/gi)];
  const faqHits = faq.filter(m => /faq|question|pregunta|what is|how|cu[aá]ndo|por qu[eé]|can i/i.test(m[2]));
  out.push('FAQ-LIKE-ITEMS: ' + faqHits.length);
  out.push('FORMS: ' + [...c.matchAll(/<form/gi)].length + ' | INPUTS: ' + [...c.matchAll(/<input/gi)].length +
    ' | MAILTO: ' + [...c.matchAll(/mailto:/gi)].length);
  out.push('STARS: ' + [...c.matchAll(/fa-star|⭐|★/g)].length +
    ' | REVIEW/TESTIMONIAL: ' + [...c.matchAll(/review|testimonial|reseñ|opinion/i)].length +
    ' | PRICE/BUY/RETURN: ' + [...c.matchAll(/\$|€|price|precio|compra|buy now|get now|download|gratis|refund|garantía|guarantee|satisfaction/i)].length);
  out.push('SOCIAL-ICONS: ' + [...c.matchAll(/fa-(twitter|facebook|instagram|youtube|telegram|discord|reddit|tiktok)/g)].length);
  out.push('IMG-WITHOUT-ALT: ' + [...c.matchAll(/<img(?![^>]*alt=)[^>]*>/gi)].length + ' de ' + [...c.matchAll(/<img/gi)].length);
  out.push('LINKS-TOTAL: ' + [...c.matchAll(/<a[^>]*href=/gi)].length);
  return out.join('\n');
}

for (const rel of ['index.html', 'best-occult-apps-android.html', 'lead-magnet/quickstart-guide-chaos-magick-en.html']) {
  console.log('===== ' + rel + ' =====');
  try { console.log(analyze(rel)); } catch (e) { console.log('ERROR', e.message); }
}