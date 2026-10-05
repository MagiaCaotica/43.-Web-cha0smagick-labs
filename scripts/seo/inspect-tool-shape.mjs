#!/usr/bin/env node
// Inspect the DOM shape of tools/*.html so the P2.1 expansion matches the
// site's existing markup exactly. Read-only, prints a report, writes nothing.
import fs from 'node:fs';
import path from 'node:path';

const TOOLS = path.resolve('tools');

const wordCount = (html) =>
  html
    .replace(/<script[\s\S]*?<\/script>/g, ' ')
    .replace(/<style[\s\S]*?<\/style>/g, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z]+;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .filter(Boolean).length;

const targets = process.argv.slice(2);
const list = targets.length
  ? targets
  : fs.readdirSync(TOOLS).filter((f) => f.endsWith('.html')).sort();

for (const f of list) {
  const full = path.join(TOOLS, f);
  if (!fs.existsSync(full)) { console.log(`MISSING ${f}`); continue; }
  const h = fs.readFileSync(full, 'utf8');

  const containers = [...h.matchAll(/<(section|nav|main|article|aside|div)\b[^>]*class="([^"]+)"/g)]
    .map((m) => `${m[1]}.${m[2].split(/\s+/)[0]}`);
  const ld = [...h.matchAll(/"@type"\s*:\s*"([^"]+)"/g)].map((m) => m[1]);
  const faqItems = (h.match(/<details>/g) || []).length;
  const h2s = [...h.matchAll(/<h2[^>]*>([\s\S]{0, 70}?)<\/h2>/g)].map((m) => m[1].replace(/<[^>]+>/g, '').trim());

  console.log(`== ${f}`);
  console.log(`   words=${wordCount(h)}  ld=${JSON.stringify(ld)}  details=${faqItems}  toolId=${(h.match(/data-atomic-tool="([^"]+)"/) || [])[1] || '-'}`);
  console.log(`   h2=${JSON.stringify(h2s)}`);
  console.log(`   containers=${containers.join(' > ')}`);
}
