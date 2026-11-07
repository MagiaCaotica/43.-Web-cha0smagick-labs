/**
 * fix-app-ctas.mjs — Inserta, ANTES del CTA de compra de cada app (/apps/*.html):
 *   1. Bloque "¿Por qué no la gratuita?" (objection handling).
 *   2. Barra de garantía 7 días + offline + no suscripción.
 * Dry-run por defecto. Pasa --apply para escribir.
 */
import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const APPS_DIR = path.join(ROOT, 'apps');

const OBJECTION = `<div class="why-paid" style="max-width:700px;margin:0 auto 1.5rem auto;padding:1.2rem;background:rgba(201,168,76,0.08);border:1px solid rgba(201,168,76,0.25);border-radius:8px;text-align:center;">
  <strong style="color:#c9a84c">Why not the free one?</strong><br>
  <span style="color:#ccc;font-size:0.95em">Free astrology, sigil and rune apps sell your data, require an internet connection and push subscriptions. This app runs 100% offline — your charts, sigils and readings never leave your device. One-time payment, no ads, no tracking.</span>
</div>`;

const GUARANTEE = `<div class="guarantee-bar" style="max-width:700px;margin:0 auto 1rem auto;text-align:center;color:#bbb;font-size:0.9em">
  🛡️ <strong style="color:#c9a84c">7-Day Money-Back Guarantee</strong> · <strong>Works offline</strong> · <strong>No subscription</strong>
</div>`;

const CTA_RE = /<div class="cta-centered-wrapper">[\s\S]*?<\/div>/;

function main() {
  const apply = process.argv.includes('--apply');
  const files = fs.readdirSync(APPS_DIR).filter(f => f.endsWith('.html')).sort();
  let changed = 0;
  let skipped = 0;

  for (const f of files) {
    const full = path.join(APPS_DIR, f);
    const html = fs.readFileSync(full, 'utf8');

    // Ya tiene el bloque de objeción/garantía insertado
    if (html.includes('why-paid') || html.includes('guarantee-bar')) {
      skipped++;
      continue;
    }

    const m = html.match(CTA_RE);
    if (!m) {
      console.log(`SKIP (no CTA pattern): ${f}`);
      skipped++;
      continue;
    }

    const insert = OBJECTION + GUARANTEE + '\n        ';
    const newHtml = html.replace(CTA_RE, insert + m[0]);

    if (apply) {
      fs.writeFileSync(full, newHtml, 'utf8');
    }
    changed++;
    console.log(`${apply ? 'APPLY' : 'DRY-RUN'}: ${f}  → objection + guarantee before CTA`);
  }

  console.log(`\nScanned: ${files.length} | Will change: ${changed} | Skipped: ${skipped} | Mode: ${apply ? 'APPLIED' : 'DRY-RUN'}`);
  if (!apply) console.log('Pasa --apply para escribir los cambios.');
}

main();
