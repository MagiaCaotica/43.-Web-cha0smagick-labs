// IndexNow ping: notifies Bing/Yandex/Seznam of changed URLs.
// Usage: node scripts/ping-indexnow.mjs [url1 url2 ...]   (default: sitemap.xml)
// Key file must exist at site root: <key>.txt (IndexNow verifies it).
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const key = fs.readFileSync(path.join(root, 'indexnow-key.txt'), 'utf8').trim();
const host = new URL(process.env.SITE_URL || 'https://cha0smagick.com').host;

let urls = process.argv.slice(2);
if (!urls.length) {
  const sitemap = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');
  urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
}
if (!urls.length) { console.log('indexnow: sin URLs (sitemap vacío y sin args)'); process.exit(0); }

const res = await fetch('https://api.indexnow.org/IndexNow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host, key, keyLocation: `https://${host}/${key}.txt`, urlList: urls })
});
console.log(`indexnow: ${res.status} — ${urls.length} URLs enviadas (${host})`);
if (res.status >= 400) { console.log(await res.text()); process.exit(1); }
