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
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: #050505; color: #e0e0e0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; }
        header { text-align: center; padding: 2rem 1rem 1rem; border-bottom: 1px solid #1a1a2e; }
        header h1 { color: #ffd700; font-size: 2rem; letter-spacing: 0.05em; }
        nav { background: #0a0a0a; padding: 0.8rem 1rem; text-align: center; border-bottom: 1px solid #1a1a2e; }
        nav a { color: #c0a060; text-decoration: none; margin: 0 0.8rem; font-size: 0.95rem; }
        nav a:hover { color: #ffd700; text-decoration: underline; }
        .breadcrumb { max-width: 1100px; margin: 1rem auto; padding: 0 1rem; font-size: 0.85rem; color: #888; }
        .breadcrumb a { color: #c0a060; text-decoration: none; }
        .breadcrumb a:hover { text-decoration: underline; }
        .container { max-width: 1000px; margin: 0 auto; padding: 2rem 1rem; }
        .hero { text-align: center; margin-bottom: 2rem; }
        .hero h2 { color: #c0a060; font-size: 1.4rem; margin-bottom: 1rem; }
        .hero p { color: #aaa; max-width: 700px; margin: 0 auto; font-size: 1.05rem; }
        .benefits { background: #0a0a14; border: 1px solid #1a1a2e; border-radius: 8px; padding: 1.5rem; margin-bottom: 2rem; }
        .benefits h3 { color: #ffd700; margin-bottom: 0.8rem; font-size: 1.1rem; }
        .benefits ul { list-style: none; padding: 0; }
        .benefits li { padding: 0.4rem 0; color: #bbb; }
        .benefits li::before { content: "▸ "; color: #c0a060; }
        .tool-frame { background: #0d0d1a; border: 1px solid #1a1a2e; border-radius: 8px; overflow: hidden; margin-bottom: 2rem; }
        .tool-frame iframe { width: 100%; height: 500px; border: none; display: block; }
        .tool-frame .label { padding: 0.6rem 1rem; color: #888; font-size: 0.85rem; border-top: 1px solid #1a1a2e; text-align: center; }
        .cta-box { background: linear-gradient(135deg, #0d0d1a 0%, #1a1a2e 100%); border: 1px solid #c0a060; border-radius: 12px; padding: 2rem; text-align: center; margin-bottom: 2rem; }
        .cta-box h3 { color: #ffd700; font-size: 1.4rem; margin-bottom: 0.8rem; }
        .cta-box p { color: #aaa; max-width: 600px; margin: 0 auto 1.2rem; font-size: 0.95rem; }
        .cta-box .features-text { color: #999; font-size: 0.9rem; margin-bottom: 1.5rem; max-width: 600px; margin-left: auto; margin-right: auto; }
        .cta-box .price { color: #ffd700; font-size: 1.6rem; font-weight: 700; margin-bottom: 1rem; }
        .cta-box a { display: inline-block; padding: 0.9rem 2.5rem; background: #c0a060; color: #050505; text-decoration: none; border-radius: 6px; font-weight: 700; font-size: 1.1rem; transition: background 0.3s; }
        .cta-box a:hover { background: #ffd700; }
        .back-link { text-align: center; margin-bottom: 2rem; }
        .back-link a { color: #888; text-decoration: none; font-size: 0.9rem; }
        .back-link a:hover { color: #c0a060; }
        footer { text-align: center; padding: 2rem 1rem; color: #555; font-size: 0.85rem; border-top: 1px solid #1a1a2e; margin-top: 2rem; }
        footer a { color: #888; text-decoration: none; }
        footer a:hover { color: #c0a060; }
        @media (max-width: 600px) {
            header h1 { font-size: 1.5rem; }
            .tool-frame iframe { height: 380px; }
            .cta-box { padding: 1.5rem; }
        }
        ${sfx}
    </style>
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
            <a href="${tool.appPage}">Get ${tool.appName} →</a>
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
