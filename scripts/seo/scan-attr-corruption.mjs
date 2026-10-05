import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const SKIP = new Set(['node_modules', '.git', '.github', 'projects', 'vendor', 'auto-shorts']);

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory()) {
      if (SKIP.has(e.name)) continue;
      walk(path.join(dir, e.name), out);
    } else if (e.name.endsWith('.html')) {
      out.push(path.join(dir, e.name));
    }
  }
  return out;
}

// Corruption class: a `<meta` opening sequence appearing INSIDE an attribute value,
// i.e. after the first `content="` of another tag. Signature: two `name="description"`
// occurrences inside a single tag, or `<meta` embedded after `content="`.
const PATTERNS = [
  { name: 'meta-in-content', re: /content="[^"]*<meta\s/g },
  { name: 'double-description', re: /name="description"[^>]*<meta[^>]*name="description"/g },
  { name: 'tag-in-attr', re: /="[^"]*<(meta|link|script|title)\s/g },
  { name: 'unclosed-content', re: /content="[^"]*$/gm },
  // Atributo partido: `<meta name="viewport"="...">` y
  // `<meta property="og:description"="...">`. El `=` aparece antes del nombre del
  // siguiente atributo, asi que nunca se genera `content` y la etiqueta se pierde
  // entera. Sin viewport, Google renderiza la pagina a 980px en movil.
  // Reparado por `fix-quote-attr-corruption.mjs`; aqui solo se reporta.
  { name: 'quote-attr-split', re: /<(?:meta|link)\b[^>]*\s[a-zA-Z][a-zA-Z0-9:_-]*="[^"<>]*"="[^"<>]*"/g },
];

const files = walk(ROOT);
const hits = [];
for (const f of files) {
  const raw = fs.readFileSync(f, 'utf8');
  for (const { name, re } of PATTERNS) {
    const m = raw.match(re);
    if (!m) continue;
    // Only report when the match is NOT the legitimate first tag occurrence.
    hits.push({ file: path.relative(ROOT, f), pattern: name, count: m.length, sample: m[0].slice(0, 140) });
  }
}

console.log(`scanned ${files.length} html files`);
if (!hits.length) {
  console.log('OK: no nested-tag / corrupted-attribute corruption found');
} else {
  for (const h of hits) console.log(`${h.file}  [${h.pattern}] x${h.count}  ${h.sample.replace(/\n/g, ' ')}`);
  console.log(`\n${hits.length} suspicious occurrences across ${new Set(hits.map((h) => h.file)).size} files`);
}
