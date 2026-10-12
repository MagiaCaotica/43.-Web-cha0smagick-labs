// Viral growth layer smoke: share bar on tools, social proof on products.
// Run: node scripts/test-viral.mjs  (starts its own static server)
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.css': 'text/css', '.png': 'image/png', '.svg': 'image/svg+xml' };

const server = http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p.endsWith('/')) p += 'index.html';
  const file = path.join(root, p);
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404); res.end('nope'); return; }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream' });
    res.end(data);
  });
});

const results = [];
const check = (name, ok) => { results.push([ok, name]); console.log((ok ? 'OK  ' : 'FAIL') + ' ' + name); };

await new Promise(r => server.listen(0, r));
const base = `http://localhost:${server.address().port}`;

const browser = await chromium.launch();
const ctx = await browser.newContext({ permissions: ['clipboard-read', 'clipboard-write'] });
await ctx.addInitScript(() => { try { localStorage.setItem('cha0_analytics_consent', 'granted'); } catch (e) {} });

// 1. Tool page: share bar present with 4 actions, track fires
const page = await ctx.newPage();
const errors = [];
page.on('pageerror', e => errors.push(String(e)));
await page.goto(`${base}/tools/sigil-generator.html`, { waitUntil: 'load' });
await page.waitForTimeout(1200);
check('share bar injectada en tool page', await page.locator('.cm-share-bar').count() === 1);
check('4 acciones de share', await page.locator('.cm-share-bar [data-share]').count() === 4);
check('wa href con utm', (await page.locator('[data-share="wa"]').getAttribute('href')).includes('utm_source%3Dtool'));
const evts = await page.evaluate(() => new Promise(res => {
  const seen = []; const orig = window.gtag;
  window.gtag = function (t, name) { if (t === 'event') seen.push(name); if (orig) orig.apply(this, arguments); };
  document.querySelector('[data-share="copy"]').click();
  setTimeout(() => res(seen), 300);
}));
check('evento share_artifact emitido', evts.includes('share_artifact'));
check('sin pageerror en tool page', errors.length === 0);

// 2. PNG download from canvas card
const dl = page.waitForEvent('download', { timeout: 8000 }).catch(() => null);
await page.click('[data-share="png"]');
const download = await dl;
check('PNG card genera descarga', !!download && /\.png$/.test(download.suggestedFilename()));

// 3. Book page: social proof strip + ViewContent pixel queued
// (fbq stub seeded pre-load: initMetaPixel only boots with a real pixel ID)
const page2 = await ctx.newPage();
await page2.addInitScript(() => { window.fbq = function () { (window.fbq.queue = window.fbq.queue || []).push([].slice.call(arguments)); }; });
const errs2 = [];
page2.on('pageerror', e => errs2.push(String(e)));
await page2.goto(`${base}/books/index.html`, { waitUntil: 'load' });
await page2.waitForTimeout(1200);
check('strip cm-proof en books', await page2.locator('.cm-proof').count() === 1);
check('4 badges de confianza', await page2.locator('.cm-proof-badges li').count() === 4);
const hasVC = await page2.evaluate(() => (window.fbq && Array.isArray(window.fbq.queue))
  ? window.fbq.queue.some(c => Array.isArray(c) && c[0] === 'track' && c[1] === 'ViewContent')
  : window.__cmViewContent !== undefined);
check('ViewContent disparado en books', hasVC);
check('sin pageerror en books', errs2.length === 0);

await browser.close();
server.close();
const fails = results.filter(r => !r[0]).length;
console.log(`\n${results.length - fails}/${results.length} checks viral OK`);
process.exit(fails ? 1 : 0);
