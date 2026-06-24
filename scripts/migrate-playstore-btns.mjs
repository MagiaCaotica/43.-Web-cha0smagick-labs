import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

const playIconSvg = `<svg class="play-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.199l2.807 1.626a1 1 0 0 1 0 1.732l-2.807 1.626L15.206 12l2.492-2.492zM5.864 2.658L16.8 8.99l-2.302 2.302-8.634-8.634z"/></svg>`;

const playIconSvgCompact = `<svg class="play-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.199l2.807 1.626a1 1 0 0 1 0 1.732l-2.807 1.626L15.206 12l2.492-2.492zM5.864 2.658L16.8 8.99l-2.302 2.302-8.634-8.634z"/></svg>`;

// All app pages (8 mobile apps + 4 PDF apps)
const appPages = [
  'apps/iching-oracle.html', 'apps/norse-rune-oracle.html',
  'apps/chaos-sigil-generator.html', 'apps/arcana-goetia.html',
  'apps/psi-gym.html', 'apps/dream-machine.html',
  'apps/lunar-phase-calculator.html', 'apps/unofficial-rider-waite-tarot.html',
  'apps/liber-lvpinux-pdf.html', 'apps/tratado-runas-cazadoras-caos-pdf.html',
  'apps/ouija-cazadora-pdf.html', 'apps/manual-activacion-servidores-magicos-pdf.html'
];

// Also homepage and tool pages
const otherPages = [
  'index.html', 'tools/index.html',
  'tools/iching.html', 'tools/viking-runes.html',
  'tools/sigil-generator.html', 'tools/lunar-phase.html'
];

function replaceAll(text, search, replacement) {
  return text.split(search).join(replacement);
}

function processFile(filePath) {
  let content = readFileSync(filePath, 'utf8');
  let changed = false;

  // 1. Replace primary CTA buttons "Buy Now $X.XX" with Play Store button
  //    Matches: <a href="PLAY_URL" class="cta-button primary" target="_blank">Buy Now $X.XX</a>
  const buyBtnRegex = /<a\s+href="(https:\/\/play\.google\.com\/store\/apps\/details\?id=[^"]+)"\s+class="cta-button primary"\s+target="_blank">Buy Now \$[\d.]+<\/a>/g;
  const newContent1 = content.replace(buyBtnRegex, (match, url) => {
    changed = true;
    return `<a href="${url}" class="play-store-btn pulse" target="_blank">${playIconSvg} GET IT ON Google Play</a>`;
  });
  content = newContent1;

  // 2. Replace card "Buy Now $X.XX" spans with Play Store compact
  const cardBtnRegex = /<span class="cta-button primary google-play-btn" style="display:block;text-align:center;margin-top:1rem;">Buy Now \$[\d.]+<\/span>/g;
  const newContent2 = content.replace(cardBtnRegex, () => {
    changed = true;
    return `<span class="play-store-btn compact pulse" style="display:flex;margin-top:1rem;">${playIconSvgCompact} GET IT ON</span>`;
  });
  content = newContent2;

  // 3. Remove inline style="margin-left:10px;" on secondary CTAs
  content = replaceAll(content, ' style="margin-left:10px;"', '');
  if (content !== readFileSync(filePath, 'utf8')) changed = true;
  // (re-read to compare accurately)

  // Re-read for comparison of further changes
  const orig = readFileSync(filePath, 'utf8');
  if (content !== orig) changed = true;

  // 4. Fix "also-like-section" inline styles -> use CSS class
  //    Replace: <section id="also-like-section" style="max-width:1000px;margin:3rem auto;padding:0 2rem;">
  //    With:    <section class="also-like-section">
  content = replaceAll(content, 
    '<section id="also-like-section" style="max-width:1000px;margin:3rem auto;padding:0 2rem;">',
    '<section class="also-like-section">');
  
  // 5. Replace the inline styled h2 inside also-like-section
  //    <h2 style="color:#e0e0e0;font-family:'JetBrains Mono',monospace;text-transform:uppercase;letter-spacing:2px;font-size:1.3rem;margin-bottom:2rem;text-align:center;">You May Also Like</h2>
  const alsoLikeH2Regex = /<h2\s+style="color:#e0e0e0;font-family:'JetBrains Mono',monospace;text-transform:uppercase;letter-spacing:2px;font-size:1\.3rem;margin-bottom:2rem;text-align:center;">You May Also Like<\/h2>/g;
  content = content.replace(alsoLikeH2Regex, '<h2>You May Also Like</h2>');

  // 6. Fix header link inline style
  content = replaceAll(content,
    '<a href="../index.html" style="text-decoration:none;color:inherit;">',
    '<a href="../index.html" class="header-link">');

  if (content !== readFileSync(filePath, 'utf8')) changed = true;

  if (changed) {
    writeFileSync(filePath, content, 'utf8');
    console.log(`✓ Updated: ${filePath}`);
  } else {
    console.log(`  No changes: ${filePath}`);
  }
}

// Process all app pages
console.log('=== App Pages ===');
for (const page of appPages) {
  processFile(resolve(root, page));
}

console.log('\n=== Other Pages ===');
for (const page of otherPages) {
  processFile(resolve(root, page));
}

// Add header-link CSS to style.css 
const cssPath = resolve(root, 'css/style.css');
let css = readFileSync(cssPath, 'utf8');
if (!css.includes('.header-link')) {
  css = css.replace('a { color: var(--accent-gold); text-decoration:none; transition:color var(--transition-fast); }',
    'a { color: var(--accent-gold); text-decoration:none; transition:color var(--transition-fast); }\n.header-link { color:inherit; text-decoration:none; }');
  writeFileSync(cssPath, css, 'utf8');
  console.log('✓ Added .header-link to style.css');
}

console.log('\nDone.');
