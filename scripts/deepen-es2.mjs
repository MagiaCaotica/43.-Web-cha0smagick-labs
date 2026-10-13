// scripts/deepen-es2.mjs — bloque de apps (precios reales del repo) + mas herramientas
// por post. Sin prosa propia: todo sale de H1/precios reales de /apps/*.html y /tools/*.html.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const R = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const strip = (s) => s.replace(/<[^>]+>/g, '').trim();

// ---- indice de apps (nombre + precio reales) ----
const APPS = {};
for (const f of fs.readdirSync(path.join(R, 'apps')).filter((x) => x.endsWith('.html'))) {
  const h = fs.readFileSync(path.join(R, 'apps', f), 'utf8');
  const h1 = h.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
  const price = h.match(/\$(\d+\.\d\d)/);
  APPS[f.replace('.html', '')] = {
    title: h1 ? strip(h1[1]) : f,
    price: price ? price[1] : '',
  };
}
// ---- indice de herramientas ----
const TOOLS = {};
for (const f of fs.readdirSync(path.join(R, 'tools')).filter((x) => x.endsWith('.html'))) {
  const h = fs.readFileSync(path.join(R, 'tools', f), 'utf8');
  const h1 = h.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
  const md = h.match(/<meta\s+name="description"\s+content="([^"]*)"/i);
  TOOLS[f.replace('.html', '')] = { title: h1 ? strip(h1[1]) : f, desc: md ? md[1].trim() : '' };
}

const MAP = {
  'es-24-runas-futhark-referencia': {
    tools: ['rune-drawer', 'viking-runes', 'runic-name-translator', 'elder-futhark-reference', 'planetary-kamea-sigil', 'sigil-intention-encoder'],
    apps: ['norse-rune-oracle', 'iching-oracle', 'lunar-phase-calculator', 'chaos-sigil-generator'],
  },
  'es-proyeccion-astral-principiantes': {
    tools: ['astral-projection-session-timer', 'meditation-focus-timer', 'reality-check-technique-coach', 'lucid-dream-training-planner', 'gnosis-timer', 'results-tracking-dashboard'],
    apps: ['astral-lab', 'psi-gym', 'lucid-dream', 'dream-machine'],
  },
  'es-pendulo-principiantes': {
    tools: ['digital-pendulum', 'pendulum-question-builder', 'reality-check-technique-coach', 'tarot-yes-no', 'sibilla-yes-no-oracle', 'results-tracking-dashboard'],
    apps: ['psi-gym', 'chaos-sigil-generator', 'arcana-goetia', 'lucid-dream'],
  },
  'es-goetia-invocar': {
    tools: ['goetic-spirit-selector', 'ritual-safety-checklist', 'spell-builder', 'spell-ingredient-planner', 'candle-intention-planner', 'digital-grimoire-organizer'],
    apps: ['arcana-goetia', 'noctem-tools', 'chaos-sigil-generator', 'psi-gym'],
  },
  'es-iching-principiantes': {
    tools: ['iching', 'iching-changing-lines', 'digital-pendulum', 'tarot-yes-no', 'meditation-focus-timer', 'results-tracking-dashboard'],
    apps: ['iching-oracle', 'lunar-phase-calculator', 'norse-rune-oracle', 'psi-gym'],
  },
  'es-iching-vs-tarot': {
    tools: ['iching', 'iching-changing-lines', 'tarot-card-reference', 'tarot-spread-builder', 'digital-pendulum', 'results-tracking-dashboard'],
    apps: ['iching-oracle', 'unofficial-rider-waite-tarot', 'psi-gym', 'chaos-sigil-generator'],
  },
  'es-libros-magia-del-caos': {
    tools: ['results-tracking-dashboard', 'digital-grimoire-organizer', 'spell-builder', 'servitor-design-journal', 'intention-achievement-tracker', 'ritual-safety-checklist'],
    apps: ['noctem-tools', 'chaos-sigil-generator', 'psi-gym', 'lucid-dream'],
  },
  'es-libro-tratado-runas': {
    tools: ['rune-drawer', 'viking-runes', 'runic-name-translator', 'elder-futhark-reference', 'digital-grimoire-organizer', 'results-tracking-dashboard'],
    apps: ['norse-rune-oracle', 'noctem-tools', 'chaos-sigil-generator', 'psi-gym'],
  },
  'es-limpiar-y-cargar-runas': {
    tools: ['rune-drawer', 'viking-runes', 'candle-color-calculator', 'candle-intention-planner', 'sigil-charging-planner', 'sigil-charging-timer'],
    apps: ['norse-rune-oracle', 'chaos-sigil-generator', 'lunar-phase-calculator', 'noctem-tools'],
  },
  'es-ouija-seguridad': {
    tools: ['paranormal-session-prep-checklist', 'sibilla-yes-no-oracle', 'tarot-yes-no', 'digital-pendulum', 'meditation-focus-timer', 'results-tracking-dashboard'],
    apps: ['psi-gym', 'noctem-tools', 'lucid-dream', 'chaos-sigil-generator'],
  },
  'es-ritual-destierro-espacio': {
    tools: ['banishing-ritual-builder', 'candle-color-calculator', 'candle-intention-planner', 'ritual-safety-checklist', 'spell-ingredient-planner', 'magical-correspondence-finder'],
    apps: ['chaos-sigil-generator', 'noctem-tools', 'lunar-phase-calculator', 'psi-gym'],
  },
  'es-runas-para-magia-del-caos': {
    tools: ['rune-drawer', 'viking-runes', 'runic-name-translator', 'elder-futhark-reference', 'sigil-intention-encoder', 'planetary-kamea-sigil'],
    apps: ['norse-rune-oracle', 'chaos-sigil-generator', 'noctem-tools', 'unofficial-rider-waite-tarot'],
  },
  'es-servitor-primer-servidor': {
    tools: ['servitor-design-journal', 'spell-builder', 'sigil-charging-planner', 'sigil-charging-timer', 'candle-intention-planner', 'spell-ingredient-planner'],
    apps: ['noctem-tools', 'chaos-sigil-generator', 'psi-gym', 'lunar-phase-calculator'],
  },
  'es-como-tener-un-sueno-lucido-esta-noche': {
    tools: ['lucid-dream-training-planner', 'meditation-focus-timer', 'astral-projection-session-timer', 'reality-check-technique-coach', 'reality-check-tracker', 'dream-symbol-dictionary'],
    apps: ['lucid-dream', 'dream-machine', 'psi-gym', 'astral-lab'],
  },
  'es-diario-de-suenos-guia': {
    tools: ['dream-symbol-dictionary', 'reality-check-tracker', 'lucid-dream-training-planner', 'results-tracking-dashboard', 'intention-achievement-tracker', 'digital-grimoire-organizer'],
    apps: ['dream-machine', 'lucid-dream', 'psi-gym', 'noctem-tools'],
  },
};

function block(cfg) {
  const o = [];
  o.push('<h2 id="herramientas-completas">Herramientas y apps para este trabajo</h2>');
  o.push('<h3>Mas herramientas gratis en el navegador</h3><ul>');
  cfg.tools.forEach((t) => {
    const x = TOOLS[t];
    if (!x) return;
    o.push('<li><a href="/tools/' + t + '.html">' + esc(x.title) + '</a> — ' + esc(x.desc) + '</li>');
  });
  o.push('</ul>');
  o.push('<h3>Las apps para llevar la practica fuera de casa</h3><ul>');
  cfg.apps.forEach((a) => {
    const x = APPS[a];
    if (!x) return;
    o.push('<li><a href="/apps/' + a + '.html">' + esc(x.title) + '</a> — pago unico' + (x.price ? ' de $' + x.price : '') + ', sin suscripciones, disponible en Google Play.</li>');
  });
  o.push('</ul>');
  o.push('<p>Todas las apps del ecosistema usan pago unico: no hay suscripciones que se renueven ni cuentas que Crear. Se descargan de Google Play y funcionan sin conexion.</p>');
  o.push('<p><a class="btn ghost" href="https://play.google.com/store/apps/developer?id=Cha0smagick+Labs" rel="noopener">Ver las 12 apps en Google Play</a></p>');
  return '\n' + o.join('\n') + '\n';
}

let ok = 0;
const fail = [];
for (const [slug, cfg] of Object.entries(MAP)) {
  const f = path.join(R, 'blog', slug + '.html');
  if (!fs.existsSync(f)) { fail.push(slug + ' (no existe)'); continue; }
  let h = fs.readFileSync(f, 'utf8');
  if (h.includes('id="herramientas-completas"')) { fail.push(slug + ' (ya tiene bloque)'); continue; }
  const marker = h.search(/<h2[^>]*>\s*Sigue explorando/);
  if (marker === -1) { fail.push(slug + ' (sin marcador)'); continue; }
  h = h.slice(0, marker) + block(cfg) + h.slice(marker);
  // sanea cirilicos que quedaron en paginas escritas por agentes
  h = h.replace(/map\u0430/g, 'mapa');
  fs.writeFileSync(f, h);
  ok++;
}
console.log('bloque apps/tools OK: ' + ok + ' / FAIL: ' + fail.length);
fail.forEach((x) => console.log('  FAIL ' + x));