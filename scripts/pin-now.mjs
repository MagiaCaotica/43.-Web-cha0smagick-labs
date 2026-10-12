// Publish the freshest daily tool pin to Pinterest right now (manual backstop).
// Usage: node --env-file=.env scripts/pin-now.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import pkg from './social-publish.js';

const dir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'pins', 'output', 'daily');
const metas = fs.readdirSync(dir)
  .filter((f) => f.endsWith('.json'))
  .map((f) => JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')))
  .sort((a, b) => new Date(b.generated) - new Date(a.generated));

if (!metas.length) {
  console.error('no daily pin meta found — run gen-daily-pin first');
  process.exit(1);
}

const m = metas[0];
const item = {
  title: `${m.title} — herramienta gratuita de magia del caos`,
  file: `daily/${m.slug}.png`,
  link: m.url,
  board: 'Occult Apps',
};
console.log(`publishing ${m.slug} ...`);
const r = await pkg.publishPinterestPin(item, process.env.PINTEREST_BOARD_ID);
console.log(JSON.stringify(r, null, 2));
process.exit(r && r.sent ? 0 : 1);
