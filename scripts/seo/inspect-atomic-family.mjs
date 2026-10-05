#!/usr/bin/env node
// Map the atomic tool family: which files carry data-atomic-tool, which IDs,
// and where the generator + registry live. Read-only.
import fs from 'node:fs';
import path from 'node:path';

const EXCLUDE = /node_modules|[\\/]\.git[\\/]|projects[\\/]docs[\\/]archive|projects[\\/]plans|page-full|[\\/]\.omo[\\/]/;
const root = process.cwd();

const walk = (dir, out = []) => {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    const rel = path.relative(root, p);
    if (EXCLUDE.test(rel)) continue;
    if (e.isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
};

const files = walk(root);

// 1. atomic stub census
const atomic = [];
for (const f of files) {
  if (!f.endsWith('.html')) continue;
  const h = fs.readFileSync(f, 'utf8');
  const id = (h.match(/data-atomic-tool="([^"]+)"/) || [])[1];
  if (!id) continue;
  const words = h.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<style[\s\S]*?<\/style>/g, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&[a-z]+;/g, ' ')
    .replace(/\s+/g, ' ').trim().split(' ').filter(Boolean).length;
  const hasFaqLd = /FAQPage/.test(h);
  atomic.push({ id, file: path.relative(root, f).replace(/\\/g, '/'), words, hasFaqLd });
}
atomic.sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }));

console.log(`ATOMIC STUBS: ${atomic.length}`);
const ids = atomic.map((a) => a.id);
const dupes = ids.filter((v, i) => ids.indexOf(v) !== i);
console.log(`duplicate ids: ${dupes.length ? [...new Set(dupes)].join(', ') : 'none'}`);
console.log(`missing FAQPage ld+json: ${atomic.filter((a) => !a.hasFaqLd).length}/${atomic.length}`);
console.log(`word range: ${Math.min(...atomic.map(a=>a.words))}-${Math.max(...atomic.map(a=>a.words))}`);
console.log('\nid\twords\tfile');
for (const a of atomic) console.log(`${a.id}\t${a.words}\t${a.file}`);

// 2. where is the atomic registry / generator?
console.log('\n--- CANDIDATE SOURCES ---');
const re = /atomic-tool|atomic_tools|A15|atomic-tools\.js/;
const hits = files.filter((f) => /\.(js|mjs|py|json|ts)$/.test(f) && re.test(fs.readFileSync(f, 'utf8')));
for (const f of hits) console.log(path.relative(root, f).replace(/\\/g, '/'));

console.log('\n--- GENERATOR CANDIDATES ---');
for (const f of files) {
  if (!/generate.*tool|tool.*generate|build-tool/i.test(path.basename(f))) continue;
  console.log(path.relative(root, f).replace(/\\/g, '/'), fs.statSync(f).size, 'bytes');
}
