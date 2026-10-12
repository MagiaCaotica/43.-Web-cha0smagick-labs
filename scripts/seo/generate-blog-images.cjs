/* Genera las imagenes que faltan para los articulos de blog con NVIDIA FLUX.
 *
 * RESTRICCIONES DESCUBIERTAS AL PROBAR LA API (probadas, no supuestas):
 *  - El fetch de Node 24.13 NO resuelve DNS en esta maquina (ENOTFOUND), asi que
 *    se usa curl.exe.
 *  - PowerShell destruye el JSON inline de curl, asi que el body va en un
 *    fichero temporal y se pasa con --data-binary "@fichero".
 *  - La API RECHAZA los campos "model" y "output_format" (extra_forbidden). El
 *    body solo admite prompt/width/height/seed/steps.
 *  - La respuesta es {"artifacts":[{"base64":"..."}]} y SIEMPRE en JPEG, aunque
 *    el destino se llame .png. Por eso se transcodifica con ImageMagick a PNG y
 *    a WebP de verdad: los <picture> de los articulos esperan ambos formatos, y
 *    renombrar un JPEG a .png haria que GitHub Pages sirviese la imagen con un
 *    Content-Type que no corresponde al contenido real.
 *
 * USO
 *   $env:NVIDIA_API_KEY = "..."          # solo en la sesion, nunca en un fichero
 *   node scripts/seo/generate-blog-images.cjs --limit 2
 *   node scripts/seo/generate-blog-images.cjs
 *
 * Es idempotente: si el PNG ya existe, no vuelve a pedir nada.
 */

'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');
const { execFileSync } = require('child_process');

const KEY = process.env.NVIDIA_API_KEY;
const ENDPOINT = 'https://ai.api.nvidia.com/v1/genai/black-forest-labs/flux.2-klein-4b';
const OUT = 'assets/images/blog';
const MAGICK = 'C:\\Program Files\\ImageMagick-7.1.2-Q16-HDRI\\magick.exe';

if (!KEY) {
  console.error('Falta NVIDIA_API_KEY en el entorno.');
  console.error('En PowerShell:  $env:NVIDIA_API_KEY = "tu-clave"');
  console.error('No la pongas en este fichero ni la commitees.');
  process.exit(1);
}

const args = process.argv.slice(2);
const limit = args.includes('--limit') ? parseInt(args[args.indexOf('--limit') + 1], 10) : Infinity;

const needed = JSON.parse(fs.readFileSync('scripts/seo/_images-needed.json', 'utf8'));
const prompts = JSON.parse(fs.readFileSync('scripts/seo/_image-prompts.json', 'utf8'));

// Los articulos con <img src="../assets/images/blog/..."> visible roto van
// primero: esos son los que el visitante ve como icono de imagen rota.
function hasVisibleImg(slug) {
  const f = `blog/${slug}.html`;
  if (!fs.existsSync(f)) return false;
  return /<img src="\.\.\/assets\/images\/blog\//.test(fs.readFileSync(f, 'utf8'));
}
const ordered = needed.slice().sort((a, b) => (hasVisibleImg(b) ? 1 : 0) - (hasVisibleImg(a) ? 1 : 0));

// Firma JPEG FF D8 FF, firma PNG 89 50 4E 47.
const isJpeg = b => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff;
const isPng = b => b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47;

function seedOf(slug) {
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) >>> 0;
  return h % 2147483647;
}

async function main() {
  const todo = ordered.filter(s => !fs.existsSync(`${OUT}/${s}.png`));
  console.log(`a generar: ${todo.length}`);
  let made = 0;
  const skipped = ordered.length - todo.length;
  const failed = [];

  for (const slug of todo) {
    if (made >= limit) break;
    const prompt = prompts[slug];
    if (!prompt) { failed.push([slug, 'sin prompt']); continue; }

    const bodyFile = path.join(os.tmpdir(), `flux-${slug}.json`);
    const jpgFile = path.join(os.tmpdir(), `flux-${slug}.jpg`);
    fs.writeFileSync(bodyFile, JSON.stringify({
      prompt, width: 1024, height: 1024, seed: seedOf(slug), steps: 4,
    }));

    let buf = null;
    for (let intento = 1; intento <= 3 && !buf; intento++) {
      try {
        const out = execFileSync('curl.exe', [
          '-sS', '--max-time', '240', '-X', 'POST', ENDPOINT,
          '-H', `Authorization: Bearer ${KEY}`,
          '-H', 'Content-Type: application/json',
          '-H', 'Accept: application/json',
          '--data-binary', `@${bodyFile}`,
        ], { maxBuffer: 64 * 1024 * 1024, encoding: 'utf8' });
        const j = JSON.parse(out);
        const b64 = j.artifacts && j.artifacts[0] && j.artifacts[0].base64;
        if (!b64) { failed.push([slug, 'respuesta sin artifacts: ' + out.slice(0, 160)]); break; }
        buf = Buffer.from(b64, 'base64');
      } catch (e) {
        if (intento === 3) failed.push([slug, String(e.message).slice(0, 160)]);
        else execFileSync('ping', ['-n', '4', '127.0.0.1'], { stdio: 'ignore' });
      }
    }
    try { fs.unlinkSync(bodyFile); } catch (x) {}
    if (!buf) continue;

    if (!isJpeg(buf)) { failed.push([slug, 'la respuesta no es JPEG']); continue; }
    fs.writeFileSync(jpgFile, buf);

    // Transcodificacion real: .png y .webp con bytes correctos.
    try {
      execFileSync(MAGICK, [jpgFile, '-strip', `${OUT}/${slug}.png`], { stdio: 'ignore' });
      execFileSync(MAGICK, [jpgFile, '-strip', '-quality', '82', `${OUT}/${slug}.webp`], { stdio: 'ignore' });
    } catch (e) {
      failed.push([slug, 'transcode: ' + String(e.message).slice(0, 120)]);
      try { fs.unlinkSync(jpgFile); } catch (x) {}
      continue;
    }
    try { fs.unlinkSync(jpgFile); } catch (x) {}

    const png = fs.readFileSync(`${OUT}/${slug}.png`);
    if (!isPng(png)) { failed.push([slug, 'el png no tiene firma PNG']); continue; }

    made++;
    console.log(`[${made}] ${slug}  png ${(png.length / 1024).toFixed(0)} KB`);
    execFileSync('ping', ['-n', '2', '127.0.0.1'], { stdio: 'ignore' });
  }

  console.log(`\ngeneradas: ${made}   ya existentes: ${skipped}   fallidas: ${failed.length}`);
  if (failed.length) {
    failed.forEach(([s, e]) => console.log(`  ${s}  ${e}`));
    fs.writeFileSync('scripts/seo/_image-failures.json', JSON.stringify(failed, null, 1));
  }
}

main();