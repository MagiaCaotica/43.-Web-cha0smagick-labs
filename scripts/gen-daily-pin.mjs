// Daily branded pin generator: tool-of-the-day -> 1080x1920 PNG.
// Deterministic rotation over all tools (dayNumber % N), so a scheduled job
// (social:daily) always yields the same pin for the same day. Idempotent.
// Run: node scripts/gen-daily-pin.mjs [--slug <tool-slug>] [--out <dir>]
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const argOf = (name) => { const i = args.indexOf('--' + name); return i >= 0 ? args[i + 1] : null; };
const forceSlug = argOf('slug');
const outDir = path.join(root, 'pins', 'output', 'daily');
fs.mkdirSync(outDir, { recursive: true });

// 1. Tool list = tool pages on disk (source of truth, 61 files)
const slugs = fs.readdirSync(path.join(root, 'tools'))
  .filter(f => f.endsWith('.html') && f !== 'index.html')
  .map(f => f.replace(/\.html$/, ''));
if (!slugs.length) { console.error('no tools found'); process.exit(1); }

const dayNumber = Math.floor(Date.now() / 86400000);
const slug = forceSlug || slugs[dayNumber % slugs.length];
const outFile = path.join(outDir, slug + '.png');

// Regenerate daily: overwrite is fine (job runs once/day). Skip only if the
// same slug was already generated in the last 20h (idempotent re-runs).
if (fs.existsSync(outFile)) {
  const age = Date.now() - fs.statSync(outFile).mtimeMs;
  if (age < 20 * 3600 * 1000 && !forceSlug) {
    console.log('daily pin already fresh: ' + slug);
    console.log(outFile);
    process.exit(0);
  }
}

// 2. Static server (tool pages need http for fetch of ../data/*.json)
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.css': 'text/css', '.png': 'image/png', '.svg': 'image/svg+xml' };
const server = http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p.endsWith('/')) p += 'index.html';
  fs.readFile(path.join(root, p), (e, d) => {
    if (e) { res.writeHead(404); res.end(); return; }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(p)] || 'application/octet-stream' });
    res.end(d);
  });
});
await new Promise(r => server.listen(0, r));
const base = `http://localhost:${server.address().port}`;

// 3. Compose the branded card in-page: navy bg + grid, tool screenshot
//    cover-fit, title, watermark URL, REF code. 1080x1920 (Pinterest 2:3.55).
const ref = (() => { let h = 5381; const s = slug + '|pin'; for (let i = 0; i < s.length; i++) h = ((h * 33) ^ s.charCodeAt(i)) >>> 0; return h.toString(36).slice(0, 6).toUpperCase(); })();
const pretty = slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
const siteUrl = 'https://cha0smagick.com/tools/' + slug + '.html?utm_source=pinterest&utm_medium=pin&utm_campaign=daily';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
await page.goto(`${base}/tools/${slug}.html`, { waitUntil: 'load' });
await page.waitForTimeout(1500); // let tool JS render its demo UI
const shot = await page.screenshot({ clip: { x: 0, y: 0, width: 1080, height: 1260 } });
const card = await page.evaluate(async ({ shotB64, pretty, slug, siteUrl, ref }) => {
  const c = document.createElement('canvas');
  c.width = 1080; c.height = 1920;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#0B1026'; ctx.fillRect(0, 0, 1080, 1920);
  ctx.strokeStyle = 'rgba(255,255,255,0.05)';
  for (let x = 0; x <= 1080; x += 60) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 1920); ctx.stroke(); }
  for (let y = 0; y <= 1920; y += 60) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(1080, y); ctx.stroke(); }
  const img = new Image();
  img.src = 'data:image/png;base64,' + shotB64;
  await new Promise(r => { img.onload = r; img.onerror = r; });
  // cover-fit the screenshot into a 980x1090 frame (ratio matches the
  // 1080x1200 clip so the cover-fit crops almost nothing)
  const fw = 980, fh = 1090, fx = 50, fy = 330;
  const s = Math.max(fw / img.width, fh / img.height);
  const sw = fw / s, sh = fh / s, sx = (img.width - sw) / 2, sy = 0; // top-anchored: crop slack at the bottom only
  ctx.save();
  ctx.beginPath(); ctx.roundRect ? ctx.roundRect(fx, fy, fw, fh, 24) : ctx.rect(fx, fy, fw, fh); ctx.clip();
  ctx.drawImage(img, sx, sy, sw, sh, fx, fy, fw, fh);
  ctx.restore();
  ctx.strokeStyle = 'rgba(255,176,58,0.5)'; ctx.lineWidth = 2; ctx.strokeRect(fx, fy, fw, fh);
  ctx.fillStyle = '#FFB03A'; ctx.fillRect(80, 150, 180, 8);
  ctx.fillStyle = '#35C4D9'; ctx.font = '600 30px Helvetica, Arial, sans-serif';
  ctx.fillText('CHA0SMAGICK LABS · HERRAMIENTA GRATIS', 80, 230);
  ctx.fillStyle = '#F5F7FF'; ctx.font = '800 64px Helvetica, Arial, sans-serif';
  const wrap = (text, x, y, maxW, lh, max) => {
    const words = String(text).split(' '); let line = '', lines = 0;
    for (const w of words) {
      const t = line ? line + ' ' + w : w;
      if (ctx.measureText(t).width > maxW && line) { ctx.fillText(line, x, y); y += lh; line = w; if (++lines >= max - 1) { line += '…'; break; } }
      else line = t;
    }
    if (line) ctx.fillText(line, x, y);
    return y + lh;
  };
  ctx.fillStyle = '#F5F7FF'; ctx.font = '800 58px Helvetica, Arial, sans-serif';
  wrap(pretty, 80, 300, 920, 64, 1);
  ctx.fillStyle = '#F5F7FF'; ctx.font = '400 34px Helvetica, Arial, sans-serif';
  ctx.fillText('Úsala gratis ahora — sin registro', 80, 1520);
  ctx.fillStyle = '#D9E0FF'; ctx.font = '500 30px Helvetica, Arial, sans-serif';
  ctx.fillText('cha0smagick.com/tools/' + slug, 80, 1630);
  ctx.fillStyle = '#FFB03A'; ctx.font = '700 28px Helvetica, Arial, sans-serif';
  ctx.fillText('REF ' + ref, 80, 1690);
  return c.toDataURL('image/png');
}, { shotB64: shot.toString('base64'), pretty, slug, siteUrl, ref });

fs.writeFileSync(outFile, Buffer.from(card.split(',')[1], 'base64'));
const metaFile = path.join(outDir, slug + '.json');
fs.writeFileSync(metaFile, JSON.stringify({ slug, url: siteUrl, title: pretty, ref, generated: new Date().toISOString() }, null, 2));

console.log('daily pin: ' + slug + ' (' + (dayNumber % slugs.length + 1) + '/' + slugs.length + ')');
console.log(outFile);
await browser.close();
server.close();
