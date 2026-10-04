#!/usr/bin/env node
// dedupe-sitemap.mjs
// Removes duplicate <url> blocks from sitemap.xml, keeping the entry with the
// newest <lastmod> for each <loc>. Idempotent: a second run reports 0 removed.
//
// Usage:
//   node scripts/seo/dedupe-sitemap.mjs --dry
//   node scripts/seo/dedupe-sitemap.mjs --preview 10

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const SITEMAP = path.join(ROOT, 'sitemap.xml');

const args = process.argv.slice(2);
const DRY = args.includes('--dry');
const pIdx = args.indexOf('--preview');
const PREVIEW = pIdx !== -1 ? Number(args[pIdx + 1] || 0) : 0;

if (!fs.existsSync(SITEMAP)) {
  console.error(`FATAL: sitemap not found at ${SITEMAP}`);
  process.exit(1);
}

const original = fs.readFileSync(SITEMAP, 'utf8');

// Match every <url>...</url> block, capturing the whitespace that precedes it
// so we can rebuild the file byte-for-byte outside the blocks we keep.
const URL_BLOCK = /[ \t]*<url>[\s\S]*?<\/url>/g;

const blocks = [];
let m;
while ((m = URL_BLOCK.exec(original)) !== null) {
  blocks.push({ text: m[0], index: m.index });
}

if (blocks.length === 0) {
  console.error('FATAL: no <url> blocks found. Refusing to touch the file.');
  process.exit(1);
}

const locOf = (t) => {
  const hit = t.match(/<loc>([^<]+)<\/loc>/);
  return hit ? hit[1].trim() : null;
};
const lastmodOf = (t) => {
  const hit = t.match(/<lastmod>([^<]+)<\/lastmod>/);
  return hit ? hit[1].trim() : '0000-00-00';
};

// Keep the block with the newest lastmod per loc; break ties keeping the first.
const byLoc = new Map();
const dropped = [];

for (const b of blocks) {
  const loc = locOf(b.text);
  if (!loc) {
    dropped.push({ ...b, reason: 'no <loc>' });
    continue;
  }
  const prev = byLoc.get(loc);
  if (!prev) {
    byLoc.set(loc, b);
    continue;
  }
  // Duplicate loc. Keep whichever has the newer lastmod.
  if (lastmodOf(b.text) > lastmodOf(prev.text)) {
    byLoc.set(loc, b);
    dropped.push({ ...prev, reason: `older lastmod than the copy kept (${lastmodOf(prev.text)})` });
  } else {
    dropped.push({ ...b, reason: `duplicate of the entry already present (${lastmodOf(prev.text)})` });
  }
}

// Rebuild: everything before the first block, then the kept blocks in original
// order, then everything after the last block. Ordering is preserved so the
// diff stays small and readable.
const firstStart = blocks[0].index;
const lastEnd = blocks[blocks.length - 1].index + blocks[blocks.length - 1].text.length;

const keptSet = new Set([...byLoc.values()].map((b) => b.index));
const keptInOrder = blocks.filter((b) => keptSet.has(b.index));

let out = original.slice(0, firstStart);
out += keptInOrder.map((b) => b.text).join('\n');
out += original.slice(lastEnd);

const dupes = blocks.length - keptInOrder.length;

console.log(`total <url> blocks : ${blocks.length}`);
console.log(`unique <loc>       : ${byLoc.size}`);
console.log(`removed            : ${dupes}`);

if (PREVIEW > 0) {
  console.log('\n--- would remove ---');
  for (const d of dropped.slice(0, PREVIEW)) {
    console.log(`  ${locOf(d.text) || '(no loc)'}  -- ${d.reason}`);
  }
  if (dropped.length > PREVIEW) {
    console.log(`  ... and ${dropped.length - PREVIEW} more`);
  }
}

if (dupes === 0) {
  console.log('\nOK: no duplicates. Nothing written.');
  process.exit(0);
}

if (DRY) {
  console.log(`\n[DRY] would rewrite ${SITEMAP}: ${blocks.length} -> ${keptInOrder.length} <url> blocks`);
  process.exit(0);
}

fs.writeFileSync(SITEMAP, out, 'utf8');
console.log(`\nWROTE ${SITEMAP}`);