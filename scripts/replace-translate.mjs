import { readFileSync, writeFileSync } from 'fs';
import { basename, resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = dirname(fileURLToPath(import.meta.url)) + '\\..\\';

const htmlFiles = [
  'index.html',
  '404.html',
  'pages/about.html',
  'pages/app-details.html',
  'tools/index.html',
  'blog/index.html',
  'blog/zener-cards-esp-training-guide.html',
  'blog/digital-sigil-magic-guide.html',
  'blog/norse-runes-beginners-guide.html',
  'blog/i-ching-digital-guide.html',
  'blog/lucid-dreaming-guide.html',
  'blog/goetic-magic-beginners-guide.html',
  'blog/lunar-phase-magic-guide.html',
  'blog/rider-waite-tarot-beginners-guide.html',
  'apps/psi-gym.html',
  'apps/arcana-goetia.html',
  'apps/norse-rune-oracle.html',
  'apps/lunar-phase-calculator.html',
  'apps/iching-oracle.html',
  'apps/chaos-sigil-generator.html',
  'apps/unofficial-rider-waite-tarot.html',
  'apps/dream-machine.html',
  'apps/manual-activacion-servidores-magicos-pdf.html',
  'apps/tratado-runas-cazadoras-caos-pdf.html',
  'apps/ouija-cazadora-pdf.html',
  'apps/liber-lvpinux-pdf.html',
];

const OLD = `<div id="google_translate_element" style="position:fixed;top:0.5rem;right:0.5rem;z-index:99999;background:#1a1a1a;border:1px solid #444;border-radius:6px;padding:4px 8px;box-shadow:0 2px 12px rgba(0,0,0,0.5);"></div>
<script>
function googleTranslateElementInit() {
  new google.translate.TranslateElement({pageLanguage: 'en', layout: google.translate.TranslateElement.InlineLayout.HORIZONTAL}, 'google_translate_element');
}
</script>
<script src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"></script>`;

const NEW = `<!-- Language Switcher - Fixed Left Sidebar -->
<div id="lang-sidebar" class="lang-sidebar">
  <button id="lang-toggle-btn" class="lang-toggle-btn" title="Select Language" onclick="toggleLangSidebar()">🌐</button>
  <div id="lang-flag-list" class="lang-flag-list" style="display:none;">
    <button onclick="switchLang('en')" title="English" class="lang-btn">🇬🇧 EN</button>
    <button onclick="switchLang('es')" title="Español" class="lang-btn">🇪🇸 ES</button>
    <button onclick="switchLang('fr')" title="Français" class="lang-btn">🇫🇷 FR</button>
    <button onclick="switchLang('de')" title="Deutsch" class="lang-btn">🇩🇪 DE</button>
    <button onclick="switchLang('it')" title="Italiano" class="lang-btn">🇮🇹 IT</button>
    <button onclick="switchLang('pt')" title="Português" class="lang-btn">🇵🇹 PT</button>
    <button onclick="switchLang('ru')" title="Русский" class="lang-btn">🇷🇺 RU</button>
    <button onclick="switchLang('ja')" title="日本語" class="lang-btn">🇯🇵 JP</button>
    <button onclick="switchLang('zh-CN')" title="中文" class="lang-btn">🇨🇳 ZH</button>
  </div>
</div>

<!-- Hidden Google Translate Element -->
<div id="google_translate_element" style="display:none;"></div>

<style>
.lang-sidebar { position:fixed; left:0; top:50%; transform:translateY(-50%); z-index:99999; display:flex; flex-direction:column; align-items:center; }
.lang-toggle-btn { background:#1a1a1a; border:1px solid #444; border-left:none; border-radius:0 8px 8px 0; color:#ccc; font-size:1.3rem; cursor:pointer; padding:10px 6px; line-height:1; transition:all .2s; width:38px; }
.lang-toggle-btn:hover { background:#333; color:#fff; }
.lang-flag-list { display:none; flex-direction:column; gap:2px; margin-top:4px; padding:6px 4px; background:#1a1a1a; border:1px solid #444; border-left:none; border-radius:0 8px 8px 0; }
.lang-btn { background:transparent; border:none; color:#aaa; cursor:pointer; font-size:0.82rem; padding:4px 7px; text-align:left; white-space:nowrap; border-radius:4px; transition:all .15s; font-family:inherit; }
.lang-btn:hover { background:#333; color:#ffd700; }
</style>

<script>
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

let count = 0;
for (const f of htmlFiles) {
  const filePath = root + f;
  try {
    let content = readFileSync(filePath, 'utf8');
    if (content.includes(OLD)) {
      content = content.replace(OLD, NEW);
      writeFileSync(filePath, content, 'utf8');
      count++;
      console.log('OK: ' + f);
    } else {
      console.log('SKIP (no match): ' + f);
    }
  } catch (e) {
    console.log('ERROR: ' + f + ' - ' + e.message);
  }
}
console.log('Done. ' + count + ' files updated.');
