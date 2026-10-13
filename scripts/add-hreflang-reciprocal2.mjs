// add-hreflang-reciprocal2.mjs — inserción tras canonical para los 18 EN que no matchearon
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const BASE = 'https://cha0smagicklabs.com';
const MAP = [
  ['free-sigil-generator-online-guide.html', 'es-como-hacer-un-sigilo-paso-a-paso.html'],
  ['how-to-charge-sigil-correctly.html', 'es-como-cargar-un-sigilo.html'],
  ['money-sigil-guide.html', 'es-sigilo-de-dinero-paso-a-paso.html'],
  ['is-it-dangerous-to-make-a-money-sigil.html', 'es-es-peligroso-un-sigilo-de-dinero.html'],
  ['chaos-magic-fundamentals-what-is-chaos-magic-guide.html', 'es-que-es-la-magia-del-caos.html'],
  ['gnosis-chaos-magick-complete-techniques.html', 'es-gnosis-magia-del-caos.html'],
  ['chaos-magick-belief-as-tool-paradigm-shifting.html', 'es-creencia-como-herramienta.html'],
  ['build-your-first-chaos-magic-servitor.html', 'es-servitor-primer-servidor.html'],
  ['how-to-lucid-dream-tonight.html', 'es-como-tener-un-sueno-lucido-esta-noche.html'],
  ['dream-journaling-lucid-dreaming-complete-guide.html', 'es-diario-de-suenos-guia.html'],
  ['astral-projection-for-beginners.html', 'es-proyeccion-astral-principiantes.html'],
  ['all-24-elder-futhark-runes-complete-reference.html', 'es-24-runas-futhark-referencia.html'],
  ['free-online-rune-reading-guide.html', 'es-tirada-de-runas-online-gratis.html'],
  ['rune-spreads-for-beginners.html', 'es-tiradas-de-runas-principiantes.html'],
  ['celtic-cross-tarot-spread-meaning-positions.html', 'es-cruz-celta-10-posiciones.html'],
  ['rider-waite-tarot-beginners-guide.html', 'es-tarot-rider-waite-principiantes.html'],
  ['death-card-tarot-meaning.html', 'es-carta-muerte-tarot.html'],
  ['moon-phases-meaning-8-phases-explained.html', 'es-fases-de-la-luna-significado.html'],
  ['new-moon-ritual-manifestation.html', 'es-ritual-luna-nueva.html'],
  ['moon-phase-calculator-for-spells.html', 'es-luna-para-hechizos.html'],
  ['free-i-ching-online-guide.html', 'es-iching-online-gratis.html'],
  ['how-to-cast-iching-digitally.html', 'es-iching-metodo-monedas.html'],
  ['i-ching-digital-guide.html', 'es-iching-principiantes.html'],
  ['iching-vs-tarot.html', 'es-iching-vs-tarot.html'],
  ['how-to-cleanse-and-charge-runes.html', 'es-limpiar-y-cargar-runas.html'],
  ['pendulum-divination-beginners.html', 'es-pendulo-principiantes.html'],
  ['how-to-banish-cleanse-space.html', 'es-ritual-destierro-espacio.html'],
  ['runas-para-chaos-magick.html', 'es-runas-para-magia-del-caos.html'],
  ['best-chaos-magick-books-essential-reading.html', 'es-libros-magia-del-caos.html'],
  ['chaos-hunter-runes-treatise-review.html', 'es-libro-tratado-runas.html'],
  ['ouija-board-safety-protection-rituals.html', 'es-ouija-seguridad.html'],
  ['goetia-beginners-ritual.html', 'es-goetia-invocar.html'],
];

let ok = 0, skip = 0, fail = [];
for (const [enFile, esFile] of MAP) {
  const p = path.join(ROOT, 'blog', enFile);
  if (!fs.existsSync(p)) { fail.push(enFile + ' (no existe)'); continue; }
  let h = fs.readFileSync(p, 'utf8');
  if (h.includes(`hreflang="es" href="${BASE}/blog/${esFile.replace('.html', '')}"`)) { skip++; continue; }
  const block = `<link rel="alternate" hreflang="es" href="${BASE}/blog/${esFile.replace('.html', '')}">`;
  const can = h.match(/<link rel="canonical" href="[^"]*"\s*\/?>/);
  if (!can) { fail.push(enFile + ' (sin canonical)'); continue; }
  h = h.replace(can[0], can[0] + '\n' + block);
  fs.writeFileSync(p, h);
  ok++;
}
console.log(`pass2: ${ok} añadidos, ${skip} ya presentes, fallos: ${fail.length ? fail.join('; ') : 'ninguno'}`);
