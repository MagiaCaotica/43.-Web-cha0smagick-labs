// scripts/deepen-compare.mjs — amplía las 10 comparativas ES con contenido real del repo
// (H1+desc de /tools/*.html, H1+precio de /apps/*.html) + párrafos universales ya verificados.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const R = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

const TOOLS = {};
for (const f of fs.readdirSync(path.join(R, 'tools')).filter((x) => x.endsWith('.html'))) {
  const h = fs.readFileSync(path.join(R, 'tools', f), 'utf8');
  const h1 = h.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
  const md = h.match(/<meta\s+name="description"\s+content="([^"]*)"/i);
  TOOLS[f.replace('.html', '')] = {
    title: h1 ? h1[1].replace(/<[^>]+>/g, '').trim() : '',
    desc: md ? md[1].trim() : '',
  };
}

const APPS = {};
for (const f of fs.readdirSync(path.join(R, 'apps')).filter((x) => x.endsWith('.html'))) {
  const h = fs.readFileSync(path.join(R, 'apps', f), 'utf8');
  const h1 = h.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
  const pr = h.match(/\$\d+\.\d\d/);
  APPS[f.replace('.html', '')] = {
    title: h1 ? h1[1].replace(/<[^>]+>/g, '').trim() : '',
    price: pr ? pr[0] : '',
  };
}

const DEEPEN = [
  'La diferencia entre alguien que practica y alguien que progresa no es el número de rituales que hace, sino el registro que deja de cada uno. Escribir una sola frase al terminar de cada sesión ya cambia el resultado: después de cuatro semanas tienes un patrón visible que ningún libro te va a explicar. Anota qué querías, qué hiciste y qué cambió de verdad, sin adornar.',
  'La segunda diferencia es la revisión. Un registro que nunca se relee es un diario, no una herramienta de trabajo. Elige un día fijo cada semana, relee las anotaciones de los últimos siete días y busca dos cosas: qué técnica funcionó más de una vez y qué palabra se repite cuando algo no funcionó. Repite lo primero, corrige lo segundo.',
  'La tercera es el ciclo. Casi todos los principiantes acumulan técnicas nuevas y las abandonan antes de que den fruto. Elige tres herramientas y quédate con ellas durante un mes entero, solo tres. Cuando el trabajo se vuelve automático puedes añadir una cuarta; cuando no, lo que tienes todavía no está aprendido.',
];

const INTRO = 'Una comparación solo sirve si después de leerla sabes qué hacer el lunes. Por eso cerramos cada tabla con herramientas concretas para el método que mejor te encaje, todas gratuitas en el navegador. Prueba una durante una semana, anota el resultado y decide con datos propios, no con la opinion de un desconocido.';

const MAP = {
  'mejores-apps-magia-del-caos': {
    tools: ['sigil-generator', 'gnosis-timer', 'rune-drawer', 'tarot-card-reference', 'iching', 'dream-symbol-dictionary', 'zener-esp-trainer', 'results-tracking-dashboard'],
    apps: ['chaos-sigil-generator', 'psi-gym', 'norse-rune-oracle', 'unofficial-rider-waite-tarot'],
  },
  'tarot-rider-waite-app-vs-mazo-fisico': {
    tools: ['tarot-card-reference', 'tarot-spread-builder', 'tarot-yes-no', 'lenormand-card-draw', 'results-tracking-dashboard', 'meditation-focus-timer'],
    apps: ['unofficial-rider-waite-tarot', 'lucid-dream'],
  },
  'astral-lab-vs-co-star': {
    tools: ['astrology-sign-calculator', 'moon-sign-calculator', 'rising-sign-calculator', 'full-birth-chart', 'planetary-retrograde-calendar', 'zodiac-cusp-calculator'],
    apps: ['astral-lab', 'noctem-tools'],
  },
  'generador-sigilos-app-vs-hacerlo-a-mano': {
    tools: ['sigil-generator', 'sigil-intention-encoder', 'planetary-kamea-sigil', 'sigil-charging-planner', 'sigil-charging-timer', 'spell-builder'],
    apps: ['chaos-sigil-generator', 'psi-gym'],
  },
  'runas-app-vs-libro-de-runas': {
    tools: ['rune-drawer', 'viking-runes', 'runic-name-translator', 'elder-futhark-reference', 'results-tracking-dashboard', 'digital-grimoire-organizer'],
    apps: ['norse-rune-oracle'],
  },
  'iching-app-vs-monedas-fisicas': {
    tools: ['iching', 'iching-changing-lines', 'digital-pendulum', 'tarot-yes-no', 'results-tracking-dashboard', 'meditation-focus-timer'],
    apps: ['iching-oracle'],
  },
  'apps-suenos-lucidos-comparativa': {
    tools: ['lucid-dream-training-planner', 'reality-check-technique-coach', 'reality-check-tracker', 'astral-projection-session-timer', 'dream-symbol-dictionary', 'meditation-focus-timer'],
    apps: ['lucid-dream', 'dream-machine'],
  },
  'tarot-gratis-vs-pago': {
    tools: ['tarot-card-reference', 'tarot-spread-builder', 'tarot-yes-no', 'lenormand-card-draw', 'sibilla-yes-no-oracle', 'results-tracking-dashboard'],
    apps: ['unofficial-rider-waite-tarot', 'arcana-goetia'],
  },
  'libros-magia-del-caos-vs-cursos-online': {
    tools: ['digital-grimoire-organizer', 'results-tracking-dashboard', 'spell-builder', 'servitor-design-journal', 'intention-achievement-tracker', 'ritual-safety-checklist'],
    apps: ['psi-gym', 'noctem-tools'],
  },
  'noctem-vs-apps-individuales': {
    tools: ['sigil-generator', 'gnosis-timer', 'rune-drawer', 'iching', 'tarot-card-reference', 'results-tracking-dashboard'],
    apps: ['noctem-tools', 'chaos-sigil-generator', 'psi-gym'],
  },
};

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function block(cfg) {
  const p = [];
  p.push('<h2 id="herramientas-completas">Cómo usar esta comparación</h2>');
  DEEPEN.forEach((t) => p.push(`<p>${t}</p>`));
  p.push(`<p>${INTRO}</p>`);
  p.push('<h2>Herramientas y apps para este trabajo</h2>');
  p.push('<ul>');
  cfg.tools.forEach((t) => {
    const tool = TOOLS[t];
    if (tool && tool.title) p.push(`<li><a href="/tools/${t}.html">${esc(tool.title)}</a> — ${esc(tool.desc)}</li>`);
  });
  cfg.apps.forEach((a) => {
    const app = APPS[a];
    if (app && app.title) p.push(`<li><a href="/apps/${a}.html">${esc(app.title)}</a> — pago unico de ${esc(app.price)}, sin suscripciones, disponible en Google Play.</li>`);
  });
  p.push('</ul>');
  p.push('<p><a class="btn ghost" href="https://play.google.com/store/apps/developer?id=Cha0smagick+Labs" rel="noopener">Ver las 12 apps en Google Play</a></p>');
  return '\n' + p.join('\n') + '\n';
}

let ok = 0;
const fail = [];
for (const [slug, cfg] of Object.entries(MAP)) {
  const f = path.join(R, 'es', slug + '.html');
  if (!fs.existsSync(f)) { fail.push(slug + ' (no existe)'); continue; }
  let h = fs.readFileSync(f, 'utf8');
  if (h.includes('id="herramientas-completas"')) { fail.push(slug + ' (ya ampliada)'); continue; }
  const marker = h.search(/<h2[^>]*>\s*Sigue explorando/);
  if (marker === -1) { fail.push(slug + ' (sin marcador)'); continue; }
  h = h.slice(0, marker) + block(cfg) + h.slice(marker);
  fs.writeFileSync(f, h);
  ok++;
}
console.log('comparativas ampliadas OK: ' + ok + ' / FAIL: ' + fail.length);
fail.forEach((x) => console.log('  FAIL ' + x));