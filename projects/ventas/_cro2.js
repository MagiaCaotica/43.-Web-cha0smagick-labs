// Analisis CRO paginas clave (v2, sin matchAll)
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..', '..');
function all(re, s) { if (!re.global) re = new RegExp(re.source, re.flags.replace('g', '') + 'g'); const o = []; let m; while ((m = re.exec(s)) !== null) o.push(m); return o; }
function txt(h) { return h.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').trim().slice(0, 100); }
function analyze(rel) {
  const c = fs.readFileSync(path.join(root, rel), 'utf8');
  const o = [];
  let m = c.match(/<title[^>]*>([\s\S]*?)<\/title>/i); o.push('TITLE: ' + (m ? m[1].trim() : ''));
  m = c.match(/name=["']description["'][^>]*content=["']([^"']*)/i); o.push('META-DESC: ' + (m ? m[1].slice(0, 160) : ''));
  all(/<h([1-3])[^>]*>([\s\S]*?)<\/h\1>/gi, c).slice(0, 40).forEach(x => o.push('H' + x[1] + ': ' + txt(x[2])));
  const cta = all(/<a[^>]*class=["'][^"']*?(?:btn|button|cta)[^"']*["'][^>]*>([\s\S]*?)<\/a>/gi, c);
  o.push('BTN-COUNT: ' + cta.length);
  cta.slice(0, 20).forEach(x => { const h = (x[0].match(/href=["']([^"']*)/) || [])[1] || ''; o.push('  BTN: ' + txt(x[1]) + ' | ' + h.slice(0, 60)); });
  const faq = all(/<(details|h3|h4)[^>]*>([\s\S]*?)<\/(details|h3|h4)>/gi, c).filter(x => /faq|question|pregunta|what|how|cu[aá]ndo|por qu[eé]|can i|is it/i.test(x[2]));
  o.push('FAQ-LIKE: ' + faq.length);
  o.push('FORMS:' + all(/<form/gi, c).length + ' INPUTS:' + all(/<input/gi, c).length + ' MAILTO:' + all(/mailto:/gi, c).length);
  o.push('STARS:' + all(/fa-star|⭐|★/g, c).length + ' REVIEWTXT:' + all(/review|testimonial|reseñ|opinion|valoración|dice|users say/i, c).length);
  o.push('BUYSIG:' + all(/\$|€|price|precio|compra|buy now|get now|download|gratis|free|refund|garant|guarantee|satisfaction/i, c).length);
  o.push('SOCIAL:' + all(/fa-(twitter|facebook|instagram|youtube|telegram|discord|reddit|tiktok)/g, c).length);
  const imgs = all(/<img/gi, c), noAlt = all(/<img(?![^>]*alt=)[^>]*>/gi, c);
  o.push('IMG:' + imgs.length + ' NOALT:' + noAlt.length);
  o.push('LINKS:' + all(/<a[^>]*href=/gi, c).length);
  return o.join('\n');
}
['index.html', 'best-occult-apps-android.html', 'lead-magnet/quickstart-guide-chaos-magick-en.html'].forEach(rel => {
  console.log('===== ' + rel + ' =====');
  try { console.log(analyze(rel)); } catch (e) { console.log('ERROR', e.message); }
});