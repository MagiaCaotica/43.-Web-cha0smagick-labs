/**
 * Diagnostico puntual: por que una pagina Gen2 (EN) no recibe el funnel
 * mientras una Gen1 (ES) si. Lanza UN solo Chromium, imprime consola,
 * pageerrors, y el estado interno del catalogo de funnel.
 */
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PORT = 8932;
const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.webp': 'image/webp', '.ico': 'image/x-icon', '.woff2': 'font/woff2',
  '.webmanifest': 'application/manifest+json'
};

const server = createServer(async (req, res) => {
  try {
    const rel = decodeURIComponent(req.url.split('?')[0]).replace(/^\/+/, '');
    const file = path.join(ROOT, rel);
    if (!file.startsWith(ROOT)) { res.writeHead(403).end(); return; }
    const info = await stat(file).catch(() => null);
    if (!info || !info.isFile()) { res.writeHead(404).end('no'); return; }
    res.writeHead(200, { 'content-type': MIME[path.extname(file)] || 'application/octet-stream' });
    res.end(await readFile(file));
  } catch (e) { res.writeHead(500).end(String(e)); }
});
await new Promise((r) => server.listen(PORT, '127.0.0.1', r));

const browser = await chromium.launch();
const context = await browser.newContext();

for (const target of process.argv.slice(2)) {
  const page = await context.newPage();
  const logs = [];
  page.on('console', (m) => logs.push(`[${m.type()}] ${m.text()}`));
  page.on('pageerror', (e) => logs.push(`[pageerror] ${e.message}`));
  page.on('requestfailed', (r) => logs.push(`[404?] ${r.url()} :: ${r.failure()?.errorText}`));
  page.on('response', (r) => { if (r.status() >= 400) logs.push(`[http ${r.status()}] ${r.url()}`); });

  await page.goto(`http://127.0.0.1:${PORT}/tools/${target}.html`, { waitUntil: 'load' });
  await page.waitForTimeout(1500);

  const probe = await page.evaluate(() => ({
    lang: document.documentElement.lang,
    funnelRoot: !!document.getElementById('cm-funnel-root'),
    steps: [...document.querySelectorAll('[data-funnel-step]')].map((n) => n.dataset.funnelStep),
    hasAtomicMount: !!document.getElementById('atomic-app'),
    scripts: [...document.scripts].map((s) => s.getAttribute('src')).filter(Boolean),
    mainChildren: document.querySelector('main') ? document.querySelector('main').children.length : -1,
    // conversion.js expone helpers? no. Usamos un sondeo de red indirecto:
    perfEntries: performance.getEntriesByType('resource')
      .map((e) => e.name.replace('http://127.0.0.1:' + 8932, ''))
      .filter((n) => /funnel|tool-funnels|conversion|atomic/.test(n))
  }));

  console.log('\n================ ' + target + ' ================');
  console.log(JSON.stringify(probe, null, 2));
  console.log('--- consola ---');
  console.log(logs.length ? logs.join('\n') : '(sin mensajes)');
  await page.close();
}

await browser.close();
server.close();
