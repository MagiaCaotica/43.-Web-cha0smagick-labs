/**
 * Pin File Generator
 * Generates individual HTML files for each Pinterest pin design.
 * Run: node pins/generate-pin-files.js
 * Then screenshots can be taken with Playwright.
 */
const fs = require('fs');
const path = require('path');

const pinData = JSON.parse(fs.readFileSync(path.join(__dirname, 'pin-data.json'), 'utf8'));
const template = fs.readFileSync(path.join(__dirname, 'pin-template.html'), 'utf8');

const outputDir = path.join(__dirname, 'output');
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

pinData.forEach((pin, index) => {
  let html = template
    .replaceAll('__BG_CLASS__', pin.bg)
    .replaceAll('__TEXT_CLASS__', pin.textClass)
    .replaceAll('__BORDER_CLASS__', pin.borderClass)
    .replaceAll('__BTN_CLASS__', pin.btnClass)
    .replaceAll('__ICON__', pin.icon)
    .replaceAll('__CATEGORY__', pin.category)
    .replaceAll('__TITLE__', pin.title)
    .replaceAll('__SUBTITLE__', pin.subtitle)
    .replaceAll('__CTA__', pin.cta);

  const filename = `${String(index + 1).padStart(2, '0')}-${pin.id}.html`;
  fs.writeFileSync(path.join(outputDir, filename), html);
  console.log(`✓ Generated: ${filename} — ${pin.title}`);
});

console.log(`\n✅ Done! ${pinData.length} pin files created in pins/output/`);
console.log('Next: Open each .html file in a browser and screenshot at 1000x1500px');
