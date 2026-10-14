// Adds commercial-intent FAQ + CTA to the two pages with the most impressions left on the table.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const R = path.join(__dirname, '..');
const SITE = 'https://cha0smagicklabs.com';
const PLAY = 'https://play.google.com/store/apps/developer?id=Cha0smagick+Labs';
const BUNDLE = 'https://pay.hotmart.com/D93257466P';

const GOETIC_Q = [
  ['Do I need an app to work with the 72 spirits?',
   'No. Everything in this guide works with a notebook. An app is only useful when you want the reference list, the sigil planner and a charge timer in one place instead of on paper.'],
  ['What is the cheapest way to start with Goetic magic?',
   'The free tools on this site cover the mechanics: the goetic spirit selector for the names, the sigil generator for the figure and the charging timer for the wait. If you want them as offline Android apps, they are one-time purchases between $3.99 and $6.99.'],
  ['Should I buy the app or the book?',
   'The app if you are already doing the work and want it portable. The book if you want the full 72 entries with context and history rather than just the operational list.']
];

const GLOSSARY_Q = [
  ['What does sigil mean in magic?',
   'A sigil is a single closed symbol built from the letters of a statement. You reduce the sentence to the letters that carry the meaning, draw them as simple shapes, join the shapes and then charge the figure before acting on it.'],
  ['What is the difference between a sigil and a talisman?',
   'A sigil is made from your own words and your own letters. A talisman is usually an object or a symbol received from a tradition, not built from your statement. The sigil is personal; the talisman is inherited.'],
  ['How long should you charge a sigil?',
   'There is no fixed number of days. Charge it until you stop thinking about the request, then forget the words. If you are still checking it every hour, it is not charged yet.'],
  ['Do I need to buy anything to start?',
   'No. The 61 free tools on this site include the sigil generator, the intention encoder, the charging timer and the gnosis timer. Everything runs in your browser and nothing is uploaded.']
];

function patch(file, mark, qa, visibleHtml, addSpeakable) {
  const p = path.join(R, file);
  let h = fs.readFileSync(p, 'utf8');
  if (h.includes(mark)) { console.log('SKIP ' + file + ' (ya parcheado)'); return true; }

  // 1) anade las Q&A al schema FAQPage/QAPage existente
  const scripts = [...h.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  const target = scripts.find(m => /"FAQPage"|"QAPage"/.test(m[1]));
  if (!target) throw new Error('sin FAQPage/QAPage');
  const json = JSON.parse(target[1]);
  for (const [q, a] of qa) {
    if (!json.mainEntity.some(x => x.name === q)) {
      json.mainEntity.push({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } });
    }
  }
  const rebuilt = scripts.map(m => m[1] === target[1] ? JSON.stringify(json, null, 2) : m[1])
    .map(s => '    <script type="application/ld+json">\n' + s + '\n    </script>')
    .join('\n');
  h = h.replace(/[ \t]*<script type="application\/ld\+json">[\s\S]*?<\/script>/g, '').trimEnd();
  const fi = h.indexOf('<footer');
  if (fi === -1) throw new Error('sin <footer>');
  h = h.slice(0, fi) + rebuilt + '\n\n' + visibleHtml + '\n' + h.slice(fi);

  // 2) bloque visible con las mismas preguntas
  const qi = h.indexOf('<footer');
  const qhtml = '    <!-- ' + mark + ' -->\n<h2 id="gsc-faq">Questions people ask after reading this</h2>\n' +
    qa.map(([q, a]) => '    <div class="faq"><h3>' + q + '</h3><p>' + a + '</p></div>').join('\n') + '\n';
  const mi = h.indexOf('<footer');
  h = h.slice(0, mi) + qhtml + h.slice(mi);
  void qi;

  if (addSpeakable && !/SpeakableSpecification/.test(h)) {
    const sp = '    <script type="application/ld+json">\n' + JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      speakable: {
        '@type': 'SpeakableSpecification',
        cssSelector: ['#gsc-faq', 'h1']
      }
    }, null, 2) + '\n    </script>\n';
    const i2 = h.indexOf('<footer');
    h = h.slice(0, i2) + sp + h.slice(i2);
  }
  fs.writeFileSync(p, h);
  console.log('OK  ' + file + ' (+' + qa.length + ' Q&A)');
  return true;
}

let ok = 0, fail = 0;
try {
  patch('blog/goetic-magic-beginners-guide.html', 'gsc-goetic-faq', GOETIC_Q,
    '    <div class="app-section">\n' +
    '      <h2>Put the 72 to work offline</h2>\n' +
    '      <p>The <a href="/tools/goetic-spirit-selector.html">goetic spirit selector</a>, the <a href="/tools/sigil-generator.html">sigil generator</a> and the <a href="/tools/sigil-charging-timer.html">charging timer</a> are free in your browser. If you want them as offline Android apps, they are one-time purchases. If you want the full 72 entries written out with context, the <a href="/books/best-chaos-magick-books-essential-reading.html">book bundle</a> is $19.99.</p>\n' +
    '      <p><a class="play-store-btn" href="' + PLAY + '" rel="noopener">See the 12 apps on Google Play</a> &middot; <a href="' + BUNDLE + '" rel="noopener">Get the 8-book bundle</a></p>\n' +
    '    </div>\n', false);
  ok++;
} catch (e) { console.log('FAIL goetic: ' + e.message); fail++; }

try {
  patch('glossary.html', 'gsc-glossary-faq', GLOSSARY_Q,
    '    <div class="app-section">\n' +
    '      <h2>Put these terms to work</h2>\n' +
    '      <p>Every term defined here has a matching free tool: build the figure with the <a href="/tools/sigil-generator.html">sigil generator</a>, encode the intention with the <a href="/tools/sigil-intention-encoder.html">intention encoder</a> and measure the wait with the <a href="/tools/sigil-charging-timer.html">charging timer</a>. Nothing is uploaded and there is no account.</p>\n' +
    '      <p><a class="play-store-btn" href="' + PLAY + '" rel="noopener">See the 12 apps on Google Play</a> &middot; <a href="' + BUNDLE + '" rel="noopener">Get the 8-book bundle</a></p>\n' +
    '    </div>\n', true);
  ok++;
} catch (e) { console.log('FAIL glossary: ' + e.message); fail++; }

console.log(`\nFAQ+CTA OK: ${ok} / FAIL: ${fail}`);