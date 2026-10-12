/* Genera las imagenes que el filtro de contenido de NVIDIA rechazo.
   Los 38 rechazosKw venusieron con finishReason CONTENT_FILTERED porque los
   arquetipos visuales incluian demonios, calaveras y criaturas. Aqui se usan
   solo elementos neutros: niebla, luna, cristal, geometria, velas, agua.
   Misma API, mismo flujo (curl.exe, cuerpo en fichero, ImageMagick). */
'use strict';
const fs = require('fs');
const { execFileSync } = require('child_process');

const KEY = process.env.NVIDIA_API_KEY;
if (!KEY) { console.error('Falta NVIDIA_API_KEY'); process.exit(1); }

const SITE = 'https://ai.api.nvidia.com/v1/genai/black-forest-labs/flux.2-klein-4b';
const MAGICK = 'C:\\Program Files\\ImageMagick-7.1.2-Q16-HDRI\\magick.exe';
const OUT = 'assets/images/blog';
const slugs = JSON.parse(fs.readFileSync('scripts/seo/_images-needed.json', 'utf8'));

// Solo los que siguen sin fichero.
const pending = slugs.filter(s => !fs.existsSync(`${OUT}/${s}.png`));
console.log('pendientes: ' + pending.length);

// Arquetipos neutros: sin figuras humanas, sin seres sobrenaturales, sin tempted.
const NEUTRAL = [
  ['moon', 'A large full moon low over a still dark horizon, mist drifting across a flat plain, faint silver light on the mist'],
  ['fog', 'Dense fog rolling over a dark still lake at night, a single faint warm light glowing far away through the mist'],
  ['crystal', 'A cluster of dark polished crystals on black velvet, one facet catching a warm amber highlight, deep shadow'],
  ['geometry', 'Overlapping thin gold geometric line patterns on a deep indigo field, a few faint circles, mostly darkness'],
  ['candle', 'A single beeswax candle burning low on a dark wooden table, wax pooled, deep indigo background, warm amber flame'],
  ['water', 'Still dark water at night with concentric ripples spreading, faint amber light reflecting off the surface'],
  ['eclipse', 'A solar eclipse in a dark sky, a thin bright ring of light, deep indigo clouds below'],
  ['herbs', 'Dried herbs and bundled stems hanging in deep shadow against a dark indigo wall, low warm light'],
  ['mountain', 'A dark mountain ridge silhouetted against a starless indigo sky, faint snow highlight, heavy atmosphere'],
  ['sea', 'A dark coastline at night, long slow waves, a single distant light on the horizon'],
  ['map', 'An old folded paper map on a dark table, faint contour lines, a brass key and a small glass beside it'],
  ['egg', 'A single pale egg on a dark stone surface, single warm sidelight, long shadow, deep indigo background'],
  ['cipher', 'Rows of faint unfamiliar symbols carved into dark stone, low raking light, most of the surface in shadow'],
  ['forest', 'A dark dense forest at night seen from below, faint light between trunks, heavy shadow'],
];

const STYLE = 'Dark editorial painting, deep indigo and charcoal palette, warm amber and gold accents, ' +
  'candlelit atmosphere, dramatic side lighting, painterly, highly detailed, quiet and contemplative. ' +
  'Absolutely no text, no letters, no words, no numbers, no captions, no signature, no watermark, no typography.';

function sceneFor(slug) {
  // el titulo solo modula el tono; nunca se dibuja
  const t = fs.existsSync(`blog/${slug}.html`)
    ? (fs.readFileSync(`blog/${slug}.html`, 'utf8').match(/<title>([^<]*)<\/title>/) || [, ''])[1]
        .replace(/\s*[|—–-]\s*Cha0smagick.*$/, '').trim().toLowerCase()
    : slug.replace(/-/g, ' ');
  // la palabra clave mas larga que coincide
  let best = null, bestLen = 0;
  for (const [k, v] of NEUTRAL) {
    if (t.includes(k) && k.length > bestLen) { best = v; bestLen = k.length; }
  }
  return `${best || NEUTRAL[0][1]}. The mood is ${t.slice(0, 90)}. ${STYLE}`;
}

function curlJson(prompt, seed) {
  const bf = `scripts/seo/_nb.json`;
  fs.writeFileSync(bf, JSON.stringify({ prompt, width: 1024, height: 1024, seed, steps: 4 }));
  const args = ['-sS', '--max-time', '240', '-X', 'POST', SITE,
    '-H', `Authorization: Bearer ${KEY}`,
    '-H', 'Content-Type: application/json',
    '-H', 'Accept: application/json',
    '--data-binary', `@${bf}`];
  for (let i = 1; i <= 3; i++) {
    try {
      const out = execFileSync('curl.exe', args, { maxBuffer: 1024 * 1024 * 200, encoding: 'utf8' });
      const j = JSON.parse(out);
      const b64 = j?.artifacts?.[0]?.base64;
      if (b64) return Buffer.from(b64, 'base64');
      const why = j?.artifacts?.[0]?.finishReason || 'sin artifacts';
      if (i === 3) return { err: why };
    } catch (e) {
      if (i === 3) return { err: String(e.message).slice(0, 120) };
    }
  }
}

const sleep = ms => new Promise(r => setTimeout(r, ms));
const failed = [];
let made = 0;

(async () => {
  for (const slug of pending) {
    const png = `${OUT}/${slug}.png`;
    if (fs.existsSync(png)) continue;
    const prompt = sceneFor(slug);
    const seed = [...slug].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);
    const r = await curlJson(prompt, seed);
    if (!Buffer.isBuffer(r)) { failed.push([slug, r.err]); console.log(`[FALLO] ${slug}  ${r.err}`); await sleep(2000); continue; }
    if (r[0] !== 0xff || r[1] !== 0xd8) { failed.push([slug, 'no es JPEG']); continue; }
    const tmp = `scripts/seo/_nb.jpg`;
    fs.writeFileSync(tmp, r);
    execFileSync(MAGICK, [tmp, '-strip', png]);
    execFileSync(MAGICK, [tmp, '-strip', '-quality', '82', `${OUT}/${slug}.webp`]);
    fs.unlinkSync(tmp);
    made++;
    console.log(`[${made}/${pending.length}] ${slug}  ${(r.length / 1024).toFixed(0)} KB`);
    await sleep(2000);
  }
  if (fs.existsSync('scripts/seo/_nb.json')) fs.unlinkSync('scripts/seo/_nb.json');
  console.log(`\ngeneradas: ${made}   fallidas: ${failed.length}`);
  if (failed.length) {
    failed.forEach(([s, e]) => console.log(`  ${s}  ${e}`));
    fs.writeFileSync('scripts/seo/_image-failures.json', JSON.stringify(failed, null, 1));
  }
})();