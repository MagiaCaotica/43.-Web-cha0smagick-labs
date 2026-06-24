import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

const files = [
  { path: '404.html', css: 'css/style.css' },
  { path: 'blog/index.html', css: '../css/style.css' },
  { path: 'blog/zener-cards-esp-training-guide.html', css: '../css/style.css' },
  { path: 'blog/digital-sigil-magic-guide.html', css: '../css/style.css' },
  { path: 'blog/norse-runes-beginners-guide.html', css: '../css/style.css' },
  { path: 'blog/i-ching-digital-guide.html', css: '../css/style.css' },
  { path: 'blog/lucid-dreaming-guide.html', css: '../css/style.css' },
  { path: 'blog/goetic-magic-beginners-guide.html', css: '../css/style.css' },
  { path: 'blog/lunar-phase-magic-guide.html', css: '../css/style.css' },
  { path: 'blog/rider-waite-tarot-beginners-guide.html', css: '../css/style.css' },
  { path: 'tools/index.html', css: '../css/style.css' },
  { path: 'tools/iching.html', css: '../css/style.css' },
  { path: 'tools/viking-runes.html', css: '../css/style.css' },
  { path: 'tools/sigil-generator.html', css: '../css/style.css' },
  { path: 'tools/lunar-phase.html', css: '../css/style.css' },
];

let updatedCount = 0;

for (const { path, css } of files) {
  const fp = resolve(root, path);
  let content = readFileSync(fp, 'utf8');
  let changed = false;

  // 1. Remove <style>...</style> that is immediately before </head>
  //    Must be the LAST <style> block before </head> (the main page CSS)
  const headEndIdx = content.lastIndexOf('</head>');
  if (headEndIdx === -1) { console.log(`SKIP ${path}: no </head>`); continue; }

  const beforeHead = content.substring(0, headEndIdx);
  const afterHead = content.substring(headEndIdx);

  // Find the last <style>...</style> before </head>
  const styleRegex = /<style>[\s\S]*?<\/style>\s*$/;
  const styleMatch = beforeHead.match(styleRegex);
  if (styleMatch) {
    const styleBlock = styleMatch[0];
    // Only remove if it's NOT the sidebar CSS
    if (!styleBlock.includes('lang-sidebar')) {
      // Remove it
      const newBeforeHead = beforeHead.replace(styleRegex, '');
      content = newBeforeHead + afterHead;
      changed = true;
      console.log(`  ${path}: removed head <style> (${styleBlock.length} chars)`);
    } else {
      console.log(`  ${path}: head <style> is sidebar CSS, kept`);
    }
  }

  // 2. Ensure style.css is linked
  const cssLink = `<link rel="stylesheet" href="${css}">`;
  if (!content.includes(cssLink)) {
    // Check if any style.css link exists with wrong path
    const anyCssLink = content.match(/<link[^>]*style\.css[^>]*>/);
    if (anyCssLink) {
      // Replace with correct path
      content = content.replace(anyCssLink[0], cssLink);
      changed = true;
      console.log(`  ${path}: corrected style.css link`);
    } else {
      // Add before </head>
      content = content.replace('</head>', `    ${cssLink}\n</head>`);
      changed = true;
      console.log(`  ${path}: added style.css link`);
    }
  }

  if (changed) {
    writeFileSync(fp, content, 'utf8');
    updatedCount++;
    console.log(`✓ ${path}`);
  } else {
    console.log(`  ${path}: no changes needed`);
  }
}

console.log(`\nDone — ${updatedCount} files updated.`);
