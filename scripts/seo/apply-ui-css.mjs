/**
 * apply-ui-css.mjs — Vincula css/ui.css en las 12 apps y reemplaza los
 * estilos inline de los bloques objection/guarantee por clases unificadas.
 * Dry-run por defecto. --apply escribe.
 */
import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const APPS_DIR = path.join(ROOT, 'apps');
const apply = process.argv.includes('--apply');

const UI_LINK = '<link rel="stylesheet" href="../css/ui.css">';

const OBJECTION_INLINE = `<div class="why-paid" style="max-width:700px;margin:0 auto 1.5rem auto;padding:1.2rem;background:rgba(201,168,76,0.08);border:1px solid rgba(201,168,76,0.25);border-radius:8px;text-align:center;">`;
const GUARANTEE_INLINE = `<div class="guarantee-bar" style="max-width:700px;margin:0 auto 1rem auto;text-align:center;color:#bbb;font-size:0.9em">`;

const files = fs.readdirSync(APPS_DIR).filter(f => f.endsWith('.html') && f !== 'index.html').sort();

let changed = 0;
let skipped = 0;

for (const f of files) {
  const full = path.join(APPS_DIR, f);
  const html = fs.readFileSync(full, 'utf8');
  let newHtml = html;
  let modified = false;

  // 1. Vincular ui.css si no está ya vinculado (antes de </head>)
  if (!newHtml.includes('css/ui.css')) {
    newHtml = newHtml.replace('</head>', `${UI_LINK}\n</head>`);
    modified = true;
  }

  // 2. Reemplazar bloque objection inline por clase
  if (newHtml.includes(OBJECTION_INLINE)) {
    newHtml = newHtml.replace(OBJECTION_INLINE, '<div class="cm-objection">');
    modified = true;
  }

  // 3. Reemplazar bloque guarantee inline por clase
  if (newHtml.includes(GUARANTEE_INLINE)) {
    newHtml = newHtml.replace(GUARANTEE_INLINE, '<div class="cm-guarantee">');
    modified = true;
  }

  if (modified) {
    if (apply) fs.writeFileSync(full, newHtml, 'utf8');
    changed++;
    console.log(`${apply ? 'APPLY' : 'DRY-RUN'}: ${f}`);
  } else {
    skipped++;
    console.log(`SKIP (sin cambios): ${f}`);
  }
}

console.log(`\nTotal: ${files.length} | Cambiados: ${changed} | Saltados: ${skipped} | Modo: ${apply ? 'APPLIED' : 'DRY-RUN'}`);
if (!apply) console.log('Pasa --apply para escribir los cambios.');
