/**
 * fix-zero-click-titles.mjs — Retitula las páginas que impresionan sin clics
 * (GSC: 8 queries, 842 imp/0 clics). Keyword exacta al inicio, máx 60 chars.
 * Dry-run por defecto. --apply escribe.
 */
import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const apply = process.argv.includes('--apply');

const changes = [
  {
    file: 'best-occult-apps-android.html',
    old: '12 Best Astrology Apps for Android (2026) — Free & Paid, Ranked',
    neo: 'Best Astrology Apps for Android — 12 Ranked, No Subscription',
    queries: ['best astrology apps', 'best astrology app', 'occult app', 'best astrology apps 2026'],
  },
  {
    file: 'blog/astrology-apps-android-guide.html',
    old: 'Best Astrology Apps for Android 2026: 6 Compared',
    neo: 'Astrology Apps for Android 2026 — 6 Compared, Offline',
    queries: ['astrology apps', 'astrology app'],
  },
  {
    file: 'birth-chart-app.html',
    old: 'Birth Chart App: Accurate, Offline, One-Time $6.99',
    neo: 'Birth Chart App: Accurate, Offline, $6.99 One-Time',
    queries: ['birth chart app'],
  },
  {
    file: 'sigil-maker.html',
    old: 'Sigil Maker Free Online — Create & Download Sigils (No Signup)',
    neo: 'Online Sigil Maker Free — Create Sigils No Signup',
    queries: ['online sigil maker'],
  },
];

let changed = 0;

for (const c of changes) {
  const full = path.join(ROOT, c.file);
  const html = fs.readFileSync(full, 'utf8');
  if (!html.includes(c.old)) {
    console.log(`SKIP (título no encontrado): ${c.file}`);
    continue;
  }
  const newHtml = html.replace(c.old, c.neo);
  if (apply) fs.writeFileSync(full, newHtml, 'utf8');
  changed++;
  console.log(`${apply ? 'APPLY' : 'DRY-RUN'}: ${c.file}`);
  console.log(`  antes: "${c.old}" (${c.old.length})`);
  console.log(`  después: "${c.neo}" (${c.neo.length})`);
  console.log(`  queries: ${c.queries.join(', ')}\n`);
}

console.log(`Cambiados: ${changed}/${changes.length} | Modo: ${apply ? 'APPLIED' : 'DRY-RUN'}`);
if (!apply) console.log('Pasa --apply para escribir los cambios.');
