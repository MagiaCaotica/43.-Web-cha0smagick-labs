// Branded pin generator (dual mode):
//  - single (default): tool-of-the-day -> 1080x1920 PNG. Deterministic rotation
//    (dayNumber % N), idempotent re-runs. Used for manual runs.
//  - --batch N: generates N DISTINCT pins (slots s00..sNN) from a rotating
//    pool of tools + blog posts, for the hourly Pinterest publishing job.
//    Cleans pins older than 48h.
// Run: node scripts/gen-daily-pin.mjs [--slug <tool-slug>] [--batch 11]
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const argOf = (name) => { const i = args.indexOf('--' + name); return i >= 0 ? args[i + 1] : null; };
const forceSlug = argOf('slug');
const batchMode = args.includes('--batch');
const outDir = path.join(root, 'pins', 'output', 'daily');
fs.mkdirSync(outDir, { recursive: true });

// 1. Source pool. Tools = tool pages on disk (source of truth). Posts = blog
//    HTML files (title + og:image extracted). Deterministic rotation.
const slugs = fs.readdirSync(path.join(root, 'tools'))
  .filter(f => f.endsWith('.html') && f !== 'index.html')
  .map(f => f.replace(/\.html$/, ''));
if (!slugs.length) { console.error('no tools found'); process.exit(1); }

const dayNumber = Math.floor(Date.now() / 86400000);

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

const refOf = (s) => { let h = 5381; const x = s + '|pin'; for (let i = 0; i < x.length; i++) h = ((h * 33) ^ x.charCodeAt(i)) >>> 0; return h.toString(36).slice(0, 6).toUpperCase(); };

// In-page canvas composer (navy bg + grid + cover-fit image + texts).
const makeCard = async ({ imgB64, title, urlText, ref, kicker, cta, frame }) => {
  const c = document.createElement('canvas');
  c.width = 1080; c.height = 1920;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#0B1026'; ctx.fillRect(0, 0, 1080, 1920);
  ctx.strokeStyle = 'rgba(255,255,255,0.05)';
  for (let x = 0; x <= 1080; x += 60) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 1920); ctx.stroke(); }
  for (let y = 0; y <= 1920; y += 60) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(1080, y); ctx.stroke(); }
  const img = new Image();
  img.src = 'data:image/png;base64,' + imgB64;
  await new Promise(r => { img.onload = r; img.onerror = r; });
  const { fx, fy, fw, fh } = frame;
  const s = Math.max(fw / img.width, fh / img.height);
  const sw = fw / s, sh = fh / s, sx = (img.width - sw) / 2, sy = Math.max(0, (img.height - sh) / 3);
  ctx.save();
  ctx.beginPath(); ctx.roundRect ? ctx.roundRect(fx, fy, fw, fh, 24) : ctx.rect(fx, fy, fw, fh); ctx.clip();
  ctx.drawImage(img, sx, sy, sw, sh, fx, fy, fw, fh);
  ctx.restore();
  ctx.strokeStyle = 'rgba(255,176,58,0.5)'; ctx.lineWidth = 2; ctx.strokeRect(fx, fy, fw, fh);
  ctx.fillStyle = '#FFB03A'; ctx.fillRect(80, 150, 180, 8);
  ctx.fillStyle = '#35C4D9'; ctx.font = '600 30px Helvetica, Arial, sans-serif';
  ctx.fillText(kicker, 80, 230);
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
  wrap(title, 80, 310, 920, 64, 2);
  ctx.fillStyle = '#F5F7FF'; ctx.font = '400 34px Helvetica, Arial, sans-serif';
  ctx.fillText(cta, 80, Math.max(fy + fh + 90, 1450));
  ctx.fillStyle = '#D9E0FF'; ctx.font = '500 30px Helvetica, Arial, sans-serif';
  ctx.fillText(urlText, 80, 1630);
  ctx.fillStyle = '#FFB03A'; ctx.font = '700 28px Helvetica, Arial, sans-serif';
  ctx.fillText('REF ' + ref, 80, 1690);
  return c.toDataURL('image/png');
};

const writePin = (key, pngB64, meta) => {
  fs.writeFileSync(path.join(outDir, key + '.png'), Buffer.from(pngB64.split(',')[1], 'base64'));
  fs.writeFileSync(path.join(outDir, key + '.json'), JSON.stringify(meta, null, 2));
};

if (batchMode) {
  const count = Math.max(1, parseInt(argOf('batch') || '11', 10));
  const postFiles = fs.readdirSync(path.join(root, 'blog')).filter(f => f.endsWith('.html') && f !== 'index.html');
  const posts = [];
  for (const f of postFiles) {
    try {
      const html = fs.readFileSync(path.join(root, 'blog', f), 'utf8');
      const t = (html.match(/<title>([^<]+)<\/title>/) || [])[1] || '';
      const og = (html.match(/property="og:image" content="([^"]+)"/) || [])[1] || '';
      if (t && og) posts.push({ type: 'post', slug: f.replace(/\.html$/, ''), title: t.replace(/\s*[|–-]\s*Cha0smagick Labs\s*$/i, '').trim(), og: og.replace(/^https?:\/\/cha0smagicklabs\.com/, '') });
    } catch { /* skip unreadable file */ }
  }
  const pool = [
    ...slugs.map(s => ({ type: 'tool', slug: s, title: s.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) })),
    ...posts,
  ];
  const start = (dayNumber * count) % pool.length;
  const chosen = []; const used = new Set();
  for (let k = 0; chosen.length < count && k < pool.length; k++) {
    const it = pool[(start + k * 3) % pool.length];
    if (!used.has(it.slug)) { used.add(it.slug); chosen.push(it); }
  }
  // cleanup pins older than 48h (png/json/markers)
  for (const f of fs.readdirSync(outDir)) {
    const fp = path.join(outDir, f);
    try { if (Date.now() - fs.statSync(fp).mtimeMs > 48 * 3600 * 1000) fs.unlinkSync(fp); } catch { /* ignore */ }
  }
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  let ok = 0;
  for (let i = 0; i < chosen.length; i++) {
    const it = chosen[i];
    const key = 's' + String(i).padStart(2, '0') + '-' + it.slug.slice(0, 70);
    const ref = refOf(key);
    try {
      if (it.type === 'tool') {
        await page.goto(`${base}/tools/${it.slug}.html`, { waitUntil: 'load' });
        await page.waitForTimeout(1200);
        const shot = await page.screenshot({ clip: { x: 0, y: 0, width: 1080, height: 1260 } });
        const card = await page.evaluate(makeCard, {
          imgB64: shot.toString('base64'), title: it.title,
          urlText: 'cha0smagicklabs.com/tools/' + it.slug, ref,
          kicker: 'CHA0SMAGICK LABS · HERRAMIENTA GRATIS', cta: 'Úsala gratis ahora — sin registro',
          frame: { fx: 50, fy: 430, fw: 980, fh: 990 },
        });
        writePin(key, card, { slug: key, slot: i, type: 'tool', url: `https://cha0smagicklabs.com/tools/${it.slug}.html?utm_source=pinterest&utm_medium=pin&utm_campaign=daily`, title: it.title, ref, generated: new Date().toISOString() });
      } else {
        const ogFile = path.join(root, it.og.replace(/^\//, ''));
        const ogB64 = fs.existsSync(ogFile) ? fs.readFileSync(ogFile).toString('base64') : null;
        if (!ogB64) continue;
        const card = await page.evaluate(makeCard, {
          imgB64: ogB64, title: it.title,
          urlText: 'cha0smagicklabs.com/blog/' + it.slug, ref,
          kicker: 'CHA0SMAGICK LABS · GUÍA EN ESPAÑOL', cta: 'Lee la guía completa — gratis',
          frame: { fx: 50, fy: 520, fw: 980, fh: 640 },
        });
        writePin(key, card, { slug: key, slot: i, type: 'post', url: `https://cha0smagicklabs.com/blog/${it.slug}.html?utm_source=pinterest&utm_medium=pin&utm_campaign=daily`, title: it.title, ref, generated: new Date().toISOString() });
      }
      ok++;
      console.log('batch pin ok: ' + key);
    } catch (e) {
      console.warn('batch pin FAILED: ' + key + ' — ' + (e && e.message ? e.message : e));
    }
  }
  await browser.close();
  server.close();
  console.log(`batch done: ${ok}/${chosen.length} pins -> ${outDir}`);
  process.exit(ok > 0 ? 0 : 1);
}

// ---- single mode (manual): tool of the day, idempotent ----
const slug = forceSlug || slugs[dayNumber % slugs.length];
const outFile = path.join(outDir, slug + '.png');
if (fs.existsSync(outFile)) {
  const age = Date.now() - fs.statSync(outFile).mtimeMs;
  if (age < 20 * 3600 * 1000 && !forceSlug) {
    console.log('daily pin already fresh: ' + slug);
    console.log(outFile);
    process.exit(0);
  }
}

const ref = refOf(slug + '|pin');
const pretty = slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
const siteUrl = 'https://cha0smagicklabs.com/tools/' + slug + '.html?utm_source=pinterest&utm_medium=pin&utm_campaign=daily';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
await page.goto(`${base}/tools/${slug}.html`, { waitUntil: 'load' });
await page.waitForTimeout(1500); // let tool JS render its demo UI
const shot = await page.screenshot({ clip: { x: 0, y: 0, width: 1080, height: 1260 } });
const card = await page.evaluate(makeCard, {
  imgB64: shot.toString('base64'), title: pretty,
  urlText: 'cha0smagicklabs.com/tools/' + slug, ref,
  kicker: 'CHA0SMAGICK LABS · HERRAMIENTA GRATIS', cta: 'Úsala gratis ahora — sin registro',
  frame: { fx: 50, fy: 430, fw: 980, fh: 990 },
});

fs.writeFileSync(outFile, Buffer.from(card.split(',')[1], 'base64'));
fs.writeFileSync(path.join(outDir, slug + '.json'), JSON.stringify({ slug, url: siteUrl, title: pretty, ref, generated: new Date().toISOString() }, null, 2));

console.log('daily pin: ' + slug + ' (' + (dayNumber % slugs.length + 1) + '/' + slugs.length + ')');
console.log(outFile);
await browser.close();
server.close();
