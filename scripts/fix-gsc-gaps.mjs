// Cierra los huecos comerciales que GSC mostro en striking distance.
// Solo title/desc/h1/H2 + bloques nuevos. Idempotente: cada parche lleva su marca.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const R = path.join(__dirname, '..');
const SITE = 'https://cha0smagicklabs.com';
const PLAY = 'https://play.google.com/store/apps/developer?id=Cha0smagick+Labs';
const BUNDLE = 'https://pay.hotmart.com/D93257466P';

let ok = 0, fail = 0;
const rep = (h, a, b) => { const n = h.split(a).length - 1; if (n !== 1) throw new Error('ocurrencias=' + n + ' :: ' + a.slice(0, 60)); return h.replace(a, b); };
const sub = (h, re, b) => { const m = h.match(re); if (!m) throw new Error('no match ' + re); return h.replace(re, b); };

// ---- 1) best-occult-apps-android.html -> ataca "best astrology apps" (142+46 impr, pos 8,7-14)
try {
  const f = 'best-occult-apps-android.html';
  let h = fs.readFileSync(path.join(R, f), 'utf8');
  h = sub(h, /<title>[\s\S]*?<\/title>/, '<title>Best Astrology Apps 2026: 12 Android Apps Ranked</title>');
  h = sub(h, /<meta name="description" content="[^"]*"/,
    '<meta name="description" content="The 12 best astrology apps for Android in 2026, ranked by price and features. One-time purchases from $3.99, no subscriptions.">');
  h = sub(h, /<h1[^>]*>Best Occult Apps for Android[^<]*<\/h1>/, '<h1>Best Astrology &amp; Occult Apps for Android (2026)');
  // bloque SEO de valor + ItemList schema
  const MARK = '<!-- gsc-astro-apps -->';
  if (!h.includes(MARK)) {
    const block = `
    ${MARK}
    <h2>Which astrology app should you download?</h2>
    <p>Most app stores bury the good tools under subscriptions. Every app listed here is a one-time purchase: you pay once between $3.99 and $14.99 and you keep it, with no subscription, no account and no ads sold back to you. If you only install one, start with the one that matches the system you are already working with.</p>
    <p>For natal charts and transits use <a href="apps/astral-lab.html">Astral Lab</a>. For card divination use <a href="apps/unofficial-rider-waite-tarot.html">Rider-Waite Tarot</a>. For runes use <a href="apps/norse-rune-oracle.html">Norse Rune Oracle</a>. If you want several systems in one place, <a href="apps/noctem-tools.html">NOCTEM</a> bundles the whole toolkit at $14.99 instead of buying four apps separately.</p>
    <div class="app-section">
      <p><a class="play-store-btn" href="${PLAY}" rel="noopener">See all 12 apps on Google Play</a></p>
      <p><a href="landing-pages/books-bundle.html">Or get the 8-book bundle for $19.99</a></p>
    </div>
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": "Best astrology and occult apps for Android 2026",
      "itemListOrder": "https://schema.org/ItemListOrderDescending",
      "numberOfItems": 12,
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Psi Gym: Zener &amp; PSI Trainer", "url": "${SITE}/apps/psi-gym.html" },
        { "@type": "ListItem", "position": 2, "name": "Chaos Sigil Generator", "url": "${SITE}/apps/chaos-sigil-generator.html" },
        { "@type": "ListItem", "position": 3, "name": "Norse Rune Oracle", "url": "${SITE}/apps/norse-rune-oracle.html" },
        { "@type": "ListItem", "position": 4, "name": "Dream Machine", "url": "${SITE}/apps/dream-machine.html" },
        { "@type": "ListItem", "position": 5, "name": "Arcana Goetia", "url": "${SITE}/apps/arcana-goetia.html" },
        { "@type": "ListItem", "position": 6, "name": "I Ching Oracle", "url": "${SITE}/apps/iching-oracle.html" },
        { "@type": "ListItem", "position": 7, "name": "Lunar Phase Calculator", "url": "${SITE}/apps/lunar-phase-calculator.html" },
        { "@type": "ListItem", "position": 8, "name": "Astral Lab", "url": "${SITE}/apps/astral-lab.html" },
        { "@type": "ListItem", "position": 9, "name": "Rider-Waite Tarot", "url": "${SITE}/apps/unofficial-rider-waite-tarot.html" },
        { "@type": "ListItem", "position": 10, "name": "Eerie Roads", "url": "${SITE}/apps/eerieroads.html" },
        { "@type": "ListItem", "position": 11, "name": "Lucid Dream", "url": "${SITE}/apps/lucid-dream.html" },
        { "@type": "ListItem", "position": 12, "name": "NOCTEM Tools", "url": "${SITE}/apps/noctem-tools.html" }
      ]
    }
    </script>
`;
    const anchor = '<footer';
    const i = h.indexOf(anchor);
    if (i === -1) throw new Error('no footer');
    h = h.slice(0, i) + block + h.slice(i);
  }
  fs.writeFileSync(path.join(R, f), h);
  console.log('OK  ' + f); ok++;
} catch (e) { console.log('FAIL best-occult-apps: ' + e.message); fail++; }

// ---- 2) tools/sigil-generator.html -> deja de competir con /sigil-maker.html
try {
  const f = 'tools/sigil-generator.html';
  let h = fs.readFileSync(path.join(R, f), 'utf8');
  h = sub(h, /<title>[\s\S]*?<\/title>/, '<title>Free Sigil Generator — Make a Sigil Online, No Signup</title>');
  h = sub(h, /<meta name="description" content="[^"]*"/,
    '<meta name="description" content="Free sigil generator. Turn a statement into one closed sigil symbol in your browser, charge it, then forget the words. No signup.">');
  const MARK = '<!-- gsc-sigilmaker-link -->';
  if (!h.includes(MARK)) {
    const block = `
    ${MARK}
    <p><a href="/sigil-maker.html"><strong>Looking for a sigil maker instead?</strong></a> Start from the commercial landing page: <a href="/sigil-maker.html">sigil-maker.html</a> explains the method step by step and shows the offline app for $3.99.</p>
`;
    const i = h.indexOf('<footer');
    if (i === -1) throw new Error('no footer');
    h = h.slice(0, i) + block + h.slice(i);
  }
  fs.writeFileSync(path.join(R, f), h);
  console.log('OK  ' + f); ok++;
} catch (e) { console.log('FAIL tools/sigil-generator: ' + e.message); fail++; }

// ---- 3) index.html -> title/desc comercial + desc <=155
try {
  const f = 'index.html';
  let h = fs.readFileSync(path.join(R, f), 'utf8');
  h = sub(h, /<title>[\s\S]*?<\/title>/, '<title>Chaos Magick Apps, Books &amp; Free Sigil Tools</title>');
  h = sub(h, /<meta name="description" content="[^"]*"/,
    '<meta name="description" content="12 occult apps for Android, 8 chaos magick books and 61 free sigil, rune and tarot tools. One-time purchases, no subscriptions.">');
  fs.writeFileSync(path.join(R, f), h);
  console.log('OK  ' + f); ok++;
} catch (e) { console.log('FAIL index: ' + e.message); fail++; }

console.log(`\ngaps OK: ${ok} / FAIL: ${fail}`);