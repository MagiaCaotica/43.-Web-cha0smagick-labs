import { writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

const tools = [
  {
    id: 'iching',
    title: 'Free I Ching Oracle Online — Cast the Book of Changes',
    description: 'Cast the ancient I Ching with the authentic three-coin method. All 64 hexagrams with full interpretations. Free online oracle tool.',
    keywords: 'free i ching online, i ching oracle, book of changes, three coin method, i ching hexagrams, online divination, free oracle tool',
    h1: 'I Ching Oracle',
    hfSpace: 'https://cha0smagick-oraculo-de-iching.hf.space',
    appPage: '../apps/iching-oracle.html',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.app.ichingoracle',
    appName: 'I Ching Oracle App',
    appPrice: '$3.99',
    heroDesc: 'Cast the ancient Book of Changes with the authentic three-coin method. All 64 hexagrams with full interpretations.',
    benefits: [
      'Authentic three-coin casting method',
      'All 64 hexagrams with full interpretations',
      'Changing lines for dynamic readings',
      'Judgment and image text for each hexagram',
      'Real-time random entropy generation'
    ],
    features: 'This free web tool gives you a taste of the full I Ching Oracle Android app. The premium version adds offline access, reading history, journaling, multiple casting methods, and customizable interpretations.'
  },
  {
    id: 'viking-runes',
    title: 'Free Viking Runes Oracle Online — Elder Futhark Divination',
    description: 'Cast Viking runes for love, wealth, protection, and daily guidance. Free online Elder Futhark rune oracle with full meanings.',
    keywords: 'free viking runes online, elder futhark runes, rune casting, norse runes free, online rune oracle, viking divination, rune meanings',
    h1: 'Viking Runes Oracle',
    hfSpace: 'https://cha0smagick-viking-runes-oracle.hf.space',
    appPage: '../apps/norse-rune-oracle.html',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.japps.norse_oracle',
    appName: 'Norse Rune Oracle App',
    appPrice: '$3.99',
    heroDesc: 'Unlock the wisdom of the Elder Futhark. Cast runes for love, wealth, protection, and daily guidance.',
    benefits: [
      'All 24 Elder Futhark runes with meanings',
      'Single rune and three-rune spreads',
      'Rune of the Day for daily guidance',
      'Upright and reversed positions',
      'Rich mythological context for each rune'
    ],
    features: 'This free web tool is a preview of our Norse Rune Oracle Android app. The full app includes offline access, advanced spreads like the Norse Cross, rune journaling, and customizable casting rituals.'
  },
  {
    id: 'sigil-generator',
    title: 'Free Goetic Sigil Generator Online — 72 Spirits of Solomon',
    description: 'Generate precise sigils for the 72 spirits of Solomon using cryptographic entropy. Free online goetic sigil generator tool.',
    keywords: 'free sigil generator, goetic sigil, 72 spirits of Solomon, ceremonial magic sigil, sigil maker free, occult tool, chaos magic',
    h1: 'Goetic Sigil Generator',
    hfSpace: 'https://cha0smagick-generador-de-sellos-goeticos.hf.space',
    appPage: '../apps/chaos-sigil-generator.html',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.app.goetiansealsgeneratorapp',
    appName: 'Chaos Sigil Generator App',
    appPrice: '$3.99',
    heroDesc: 'Generate precise sigils for the 72 spirits of Solomon. Cryptographic entropy engine with ancient alphabets.',
    benefits: [
      'All 72 Goetic spirits with authentic seals',
      'Cryptographic entropy for true randomness',
      'Ancient alphabet rendering (Hebrew, Greek)',
      'Export high-resolution sigil images',
      'Custom intent encoding for chaos magic'
    ],
    features: 'Try the web version for quick sigil generation. The Chaos Sigil Generator Android app adds offline operation, sigil library, intent journaling, ritual timer, and multiple sigil encoding methods.'
  },
  {
    id: 'lunar-phase',
    title: 'Free Lunar Phase Calculator Online — Moon Phases for Magic',
    description: 'Track moon phases for magic, wellness, and biodynamic gardening. Free online lunar phase calculator with real-time data.',
    keywords: 'free lunar phase calculator, moon phases, moon phase calendar, lunar calendar, moon magic, free moon tracker, esoteric calendar',
    h1: 'Lunar Phase Calculator',
    hfSpace: 'https://cha0smagick-calculo-fases-lunares.hf.space',
    appPage: '../apps/lunar-phase-calculator.html',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.lunarapp.app',
    appName: 'Lunar Phase Calculator App',
    appPrice: '$3.99',
    heroDesc: 'Track moon phases for magic, wellness, and biodynamic gardening. Real-time lunar data and guided rituals.',
    benefits: [
      'Real-time moon phase display',
      'Illumination percentage and age',
      'Rise/set times for your location',
      'Upcoming phase predictions',
      'Magical correspondences for each phase'
    ],
    features: 'This free calculator gives you current lunar data. The Lunar Phase Calculator Android app adds push notifications for phase changes, ritual reminders, a full year calendar, gardening guide, and moon journal.'
  }
];

const sfx = `/* Language Sidebar Styles */
.lang-sidebar { position:fixed; left:0; top:50%; transform:translateY(-50%); z-index:99999; display:flex; flex-direction:column; align-items:center; }
.lang-toggle-btn { background:#1a1a1a; border:1px solid #444; border-left:none; border-radius:0 8px 8px 0; color:#ccc; font-size:1.3rem; cursor:pointer; padding:10px 6px; line-height:1; transition:all .2s; width:38px; }
.lang-toggle-btn:hover { background:#333; color:#fff; }
.lang-flag-list { display:none; flex-direction:column; gap:2px; margin-top:4px; padding:6px 4px; background:#1a1a1a; border:1px solid #444; border-left:none; border-radius:0 8px 8px 0; }
.lang-btn { background:transparent; border:none; color:#aaa; cursor:pointer; font-size:0.82rem; padding:4px 7px; text-align:left; white-space:nowrap; border-radius:4px; transition:all .15s; font-family:inherit; display:flex; align-items:center; gap:5px; width:100%; }
.lang-btn:hover { background:#333; color:#ffd700; }
.flag-icon { width:18px; height:auto; border-radius:2px; display:inline-block; vertical-align:middle; }`;

const langSidebar = `<!-- Language Switcher - Fixed Left Sidebar -->
<div id="lang-sidebar" class="lang-sidebar">
  <button id="lang-toggle-btn" class="lang-toggle-btn" title="Select Language" onclick="toggleLangSidebar()">🌐</button>
  <div id="lang-flag-list" class="lang-flag-list" style="display:none;">
    <button onclick="switchLang('en')" title="English" class="lang-btn"><img src="/assets/images/flags/gb.svg" alt="" class="flag-icon"> EN</button>
    <button onclick="switchLang('es')" title="Español" class="lang-btn"><img src="/assets/images/flags/es.svg" alt="" class="flag-icon"> ES</button>
    <button onclick="switchLang('fr')" title="Français" class="lang-btn"><img src="/assets/images/flags/fr.svg" alt="" class="flag-icon"> FR</button>
    <button onclick="switchLang('de')" title="Deutsch" class="lang-btn"><img src="/assets/images/flags/de.svg" alt="" class="flag-icon"> DE</button>
    <button onclick="switchLang('it')" title="Italiano" class="lang-btn"><img src="/assets/images/flags/it.svg" alt="" class="flag-icon"> IT</button>
    <button onclick="switchLang('pt')" title="Português" class="lang-btn"><img src="/assets/images/flags/pt.svg" alt="" class="flag-icon"> PT</button>
    <button onclick="switchLang('ru')" title="Русский" class="lang-btn"><img src="/assets/images/flags/ru.svg" alt="" class="flag-icon"> RU</button>
    <button onclick="switchLang('ja')" title="日本語" class="lang-btn"><img src="/assets/images/flags/jp.svg" alt="" class="flag-icon"> JP</button>
    <button onclick="switchLang('zh-CN')" title="中文" class="lang-btn"><img src="/assets/images/flags/cn.svg" alt="" class="flag-icon"> ZH</button>
  </div>
</div>
<!-- Hidden Google Translate Element -->
<div id="google_translate_element" style="display:none;"></div>`;

const langScript = `<script>
function toggleLangSidebar() {
  var el = document.getElementById('lang-flag-list');
  if (!el) return;
  el.style.display = (el.style.display === 'none' || el.style.display === '') ? 'flex' : 'none';
}
function googleTranslateElementInit() {
  new google.translate.TranslateElement({ pageLanguage: 'en', includedLanguages: 'en,es,fr,de,it,pt,ru,ja,zh-CN', autoDisplay: false }, 'google_translate_element');
}
function switchLang(lang) {
  var tries = 0;
  var iv = setInterval(function() {
    var sel = document.querySelector('.goog-te-combo');
    if (sel) { sel.value = lang; sel.dispatchEvent(new Event('change')); clearInterval(iv); var fl = document.getElementById('lang-flag-list'); if (fl) fl.style.display = 'none'; }
    if (++tries > 30) clearInterval(iv);
  }, 150);
}
</script>
<script src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"></script>`;

const gaScript = `<script async src="https://www.googletagmanager.com/gtag/js?id=G-V6LHCPN9TK"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-V6LHCPN9TK');</script>`;

const pwaScript = `<script>
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('../sw.js').catch(function(err) {
            console.log('SW registration failed:', err);
        });
    });
}
</script>`;

function generateToolPage(tool) {
  const benefitsHtml = tool.benefits.map(b => `<li>${b}</li>`).join('\n      ');
  const canonicalUrl = `https://cha0smagicklabs.com/tools/${tool.id}.html`;
  const ogImage = 'https://cha0smagicklabs.com/assets/images/Banner.webp';

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${tool.title}</title>
    <meta name="description" content="${tool.description}">
    <meta name="keywords" content="${tool.keywords}">
    <link rel="canonical" href="${canonicalUrl}">
    <link rel="icon" href="../assets/images/favicon.ico" type="image/x-icon">
    <link rel="manifest" href="../manifest.json">
    <meta name="theme-color" content="#050505">
    <meta property="og:title" content="${tool.title}">
    <meta property="og:description" content="${tool.description}">
    <meta property="og:url" content="${canonicalUrl}">
    <meta property="og:type" content="website">
    <meta property="og:image" content="${ogImage}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="robots" content="index, follow">
    ${gaScript}
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "${tool.h1}",
        "description": "${tool.description}",
        "url": "${canonicalUrl}",
        "offers": {
            "@type": "Offer",
            "price": "${tool.appPrice.replace('$','')}",
            "priceCurrency": "USD",
            "availability": "https://schema.org/InStock"
        },
        "applicationCategory": "Multimedia",
        "operatingSystem": "Android"
    }
    </script>
    <link rel="stylesheet" href="../css/style.css">
</head>
<body>
    <header>
        <h1>${tool.h1}</h1>
    </header>

    <nav>
        <a href="../index.html">Home</a>
        <a href="index.html">All Free Tools</a>
        <a href="../index.html#products">Premium Apps</a>
        <a href="../blog/index.html">Blog</a>
    </nav>

    <div class="breadcrumb">
        <a href="../index.html">Home</a> › <a href="index.html">Free Tools</a> › ${tool.h1}
    </div>

    <div class="container">
        <section class="hero">
            <h2>Free Online ${tool.h1}</h2>
            <p>${tool.heroDesc}</p>
        </section>

        <section class="benefits">
            <h3>What You Get</h3>
            <ul>
                ${benefitsHtml}
            </ul>
        </section>

        <section class="tool-frame">
            <iframe src="${tool.hfSpace}" frameborder="0" title="Free ${tool.h1} Online Tool" loading="lazy" allow="clipboard-read; clipboard-write"></iframe>
            <div class="label">Free Online Tool — Try it now</div>
        </section>

        <section class="cta-box">
            <h3>Take It Offline with the Premium Android App</h3>
            <p>${tool.features}</p>
            <div class="price">${tool.appPrice}</div>
            <a href="${tool.playStoreUrl}" class="play-store-btn pulse" target="_blank"><svg class="play-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.199l2.807 1.626a1 1 0 0 1 0 1.732l-2.807 1.626L15.206 12l2.492-2.492zM5.864 2.658L16.8 8.99l-2.302 2.302-8.634-8.634z"/></svg> GET IT ON Google Play</a>
            <p style="margin-top:1rem;font-size:0.85rem;color:#888;">100% offline · No ads · No tracking · One-time payment</p>
        </section>

        <div class="back-link">
            <a href="index.html">← Back to All Free Tools</a>
        </div>
    </div>

    <footer>
        <p>&copy; 2026 Cha0smagick Labs — <a href="../index.html">Corporate Cybermancy Solutions</a></p>
    </footer>

    ${pwaScript}
    ${langSidebar}
    <style>${sfx}</style>
    ${langScript}
</body>
</html>`;
}

// Generate all 4 pages
for (const tool of tools) {
  const html = generateToolPage(tool);
  const filePath = resolve(root, 'tools', `${tool.id}.html`);
  writeFileSync(filePath, html, 'utf8');
  console.log(`✓ Created tools/${tool.id}.html`);
}

console.log('Done — 4 tool funnel pages generated.');
