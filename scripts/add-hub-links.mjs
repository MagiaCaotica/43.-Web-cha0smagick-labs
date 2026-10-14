// Inserta enlaces internos desde paginas existentes hacia las 7 paginas comerciales nuevas.
// Idempotente: marca <!-- hublinks --> .
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const MARK = '<!-- hublinks -->';

const LINKS = {
  'apps/arcana-goetia.html': {
    title: 'Goetic sigils: what they are and how to draw one',
    text: 'If you want the sigil step by step instead of just the grimoire, the goetic sigil guide walks through the whole process.',
    href: '/goetic-sigil.html',
  },
  'apps/iching-oracle.html': {
    title: 'I Ching app: free online readings or a paid app?',
    text: 'Compare the free online route with the paid app before you decide which one fits your practice.',
    href: '/i-ching-app.html',
  },
  'apps/astral-lab.html': {
    title: 'Ephemeris accuracy: why your birth chart is off',
    text: 'The ephemeris accuracy guide explains why rounding ruins a natal chart, and what VSOP87 changes.',
    href: '/ephemeris-accuracy.html',
  },
  'apps/unofficial-rider-waite-tarot.html': {
    title: 'Celtic Cross spread: all 10 positions explained',
    text: 'The most used ten card layout, position by position.',
    href: '/celtic-cross.html',
  },
  'tools/tarot-spread-builder.html': {
    title: 'Celtic Cross spread: all 10 positions explained',
    text: 'Once your spread is built, the Celtic Cross guide explains all ten positions and the five pairs that carry the reading.',
    href: '/celtic-cross.html',
  },
  'tools/iching.html': {
    title: 'I Ching app: free online readings or a paid app?',
    text: 'If you want the readings to keep working offline, the I Ching app comparison covers what you actually get for the price.',
    href: '/i-ching-app.html',
  },
  'blog/goetic-magic-beginners-guide.html': {
    title: 'Goetic sigils: what they are and how to draw one',
    text: 'The goetic sigil guide turns this into a step by step drawing process for the 72 spirits.',
    href: '/goetic-sigil.html',
  },
  'best-occult-apps-android.html': {
    title: 'Astrology app reviews: 12 Android apps, real ratings',
    text: 'The reviews page goes app by app with prices, offline support and who each one is actually for.',
    href: '/astrology-app-reviews.html',
  },
};

const EXTRA = {
  'apps/astral-lab.html': [
    {
      title: 'Birth chart app: accurate, offline, one time price',
      text: 'If you only need the chart itself, the birth chart app guide compares the free tools with the paid app.',
      href: '/birth-chart-app.html',
    },
  ],
};

function block(items) {
  const lis = items
    .map((l) => `      <li><a href="${l.href}">${l.title}</a> — ${l.text}</li>`)
    .join('\n');
  return `${MARK}\n    <aside class="hublinks">\n      <h2>Related reading</h2>\n      <ul>\n${lis}\n      </ul>\n    </aside>\n`;
}

let ok = 0;
let fail = 0;
for (const [file, base] of Object.entries(LINKS)) {
  const p = path.join(ROOT, file);
  try {
    let h = fs.readFileSync(p, 'utf8');
    if (h.includes(MARK)) {
      console.log('SKIP (ya enlazada) ' + file);
      continue;
    }
    const items = [base, ...(EXTRA[file] || [])];
    const anchor = h.indexOf('</main>') >= 0 ? '</main>' : '<footer';
    if (anchor < 0) throw new Error('sin ancla');
    h = h.slice(0, h.indexOf(anchor)) + block(items) + h.slice(h.indexOf(anchor));
    fs.writeFileSync(p, h);
    ok++;
    console.log('OK ' + file + ' -> ' + items.map((i) => i.href).join(', '));
  } catch (e) {
    fail++;
    console.log('FAIL ' + file + ' -> ' + e.message);
  }
}
console.log('hublinks OK: ' + ok + ' / FAIL: ' + fail);