/**
 * fix-titles.mjs — Corrección conservadora de <title>.
 * Solo toca títulos realmente rotos: vacíos, <30 chars, >75 chars,
 * o genéricos ("Cha0smagick Labs"). Usa el <h1> real como base, sin inventar keywords.
 * Uso: node scripts/seo/fix-titles.mjs          # dry-run
 *      node scripts/seo/fix-titles.mjs --apply  # escribe
 */
import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const EXCLUDE = ['node_modules', '.git', 'out', 'projects/pinterest-pins/output', 'projects/pinterest-pins/output-darkfantasy'];

function clean(str) {
  return str
    .replace(/<[^>]+>/g, ' ')        // quita etiquetas HTML residuales (span, br, etc.)
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function extract(html, tag) {
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i');
  const m = html.match(re);
  return m ? clean(m[1]) : null;
}

function shouldProcess(file) {
  return EXCLUDE.every(e => !file.includes(e));
}

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (shouldProcess(full)) walk(full, files);
    } else if (entry.name.endsWith('.html')) {
      if (shouldProcess(full)) files.push(full);
    }
  }
  return files;
}

function isGeneric(title) {
  const t = title.toLowerCase();
  return t === 'cha0smagick labs' || t === 'home' || t === 'index' || t === 'untitled';
}

function main() {
  const apply = process.argv.includes('--apply');
  const files = walk(ROOT);
  let changes = 0;
  let scanned = 0;
  const skippedOk = [];

  for (const file of files) {
    const html = fs.readFileSync(file, 'utf8');
    scanned++;
    const title = extract(html, 'title');
    const h1 = extract(html, 'h1');
    const tLen = title ? title.length : 0;

    const bad = !title || tLen < 30 || isGeneric(title);
    if (!bad || !h1 || h1.length < 30) continue;

    const candidate = h1;
    if (candidate.length < 30) continue;

    changes++;
    console.log(`${apply ? 'APPLY' : 'DRY-RUN'}: ${path.relative(ROOT, file)}`);
    console.log(`  title (${tLen}): "${title}"`);
    console.log(`  h1: "${h1}"`);
    console.log(`  -> "${candidate}"\n`);

    if (apply) {
      const newHtml = html.replace(/(<title[^>]*>)[\s\S]*?(<\/title>)/i, `$1${candidate}$2`);
      fs.writeFileSync(file, newHtml, 'utf8');
    }
  }

  console.log(`Scanned: ${scanned} | Needs fix: ${changes} | Mode: ${apply ? 'APPLIED' : 'DRY-RUN (no changes written)'}`);
  if (!apply) console.log('Pasa --apply para escribir los cambios.');
}

main();
