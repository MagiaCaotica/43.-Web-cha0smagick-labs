// scripts/deepen-es.mjs — profundiza los posts ES superficiales reutilizando contenido
// limpio ya existente en el repo (H1 del post + H1/meta description de /tools/*.html).
// Sin prosa larga freehand: 3 parrafos universales + datos extraidos + bloque de venta.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const R = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

// ---------- indice de herramientas (contenido real del repo) ----------
const TOOLS = {};
for (const f of fs.readdirSync(path.join(R, 'tools')).filter((x) => x.endsWith('.html'))) {
  const h = fs.readFileSync(path.join(R, 'tools', f), 'utf8');
  const h1 = h.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
  const md = h.match(/<meta\s+name="description"\s+content="([^"]*)"/i);
  TOOLS[f.replace('.html', '')] = {
    title: h1 ? h1[1].replace(/<[^>]+>/g, '').trim() : f,
    desc: md ? md[1].trim() : '',
  };
}

// ---------- 3 parrafos universales (unica prosa propia, corta) ----------
const DEEPEN = [
  'La diferencia entre practicar y progresar no es el numero de rituales que haces, sino el registro que dejas de cada uno. Escribir una sola frase al terminar de cada sesion ya cambia el resultado: despues de cuatro semanas tienes un patron visible que ningun libro te va a explicar. Anota que querias, que hiciste y que cambio de verdad, sin adornar.',
  'La segunda diferencia es la revision. Un registro que nunca se relee es un diario, no una herramienta de trabajo. Elige un dia fijo cada semana, relee las anotaciones de los ultimos siete dias y busca dos cosas: que tecnica funciono mas de una vez y que palabra se repite cuando algo no funciono. Repite lo primero, corrige lo segundo.',
  'La tercera es el ciclo. Casi todos los principiantes acumulan tecnicas nuevas y las abandonan antes de que den fruto. Elige tres herramientas y trabaja con ellas durante un mes entero, solo tres. Cuando el trabajo se vuelve automatico puedes anadir una cuarta; cuando no, lo que tienes todavia no esta aprendido. La constancia pesa mas que la variedad.',
];

// ---------- por post: herramientas + libro (sin prosa) ----------
const MAP = {
  'es-24-runas-futhark-referencia': {
    tools: ['rune-drawer', 'viking-runes', 'runic-name-translator', 'elder-futhark-reference', 'digital-pendulum', 'results-tracking-dashboard'],
    book: '/books/tratado-runas-cazadoras-caos-pdf.html',
  },
  'es-proyeccion-astral-principiantes': {
    tools: ['astral-projection-session-timer', 'meditation-focus-timer', 'reality-check-technique-coach', 'lucid-dream-training-planner', 'results-tracking-dashboard', 'dream-symbol-dictionary'],
    book: '/books/mind-the-gap-pdf.html',
  },
  'es-pendulo-principiantes': {
    tools: ['digital-pendulum', 'pendulum-question-builder', 'reality-check-technique-coach', 'tarot-yes-no', 'sibilla-yes-no-oracle', 'results-tracking-dashboard'],
    book: '/books/codex-chaoticus-pdf.html',
  },
  'es-goetia-invocar': {
    tools: ['goetic-spirit-selector', 'ritual-safety-checklist', 'spell-builder', 'spell-ingredient-planner', 'candle-intention-planner', 'results-tracking-dashboard'],
    book: '/books/catholiconomicon-pdf.html',
  },
  'es-iching-principiantes': {
    tools: ['iching', 'iching-changing-lines', 'digital-pendulum', 'tarot-yes-no', 'results-tracking-dashboard', 'meditation-focus-timer'],
    book: '/books/codex-chaoticus-pdf.html',
  },
  'es-iching-vs-tarot': {
    tools: ['iching', 'iching-changing-lines', 'tarot-card-reference', 'tarot-spread-builder', 'digital-pendulum', 'results-tracking-dashboard'],
    book: '/books/catholiconomicon-pdf.html',
  },
  'es-libros-magia-del-caos': {
    tools: ['results-tracking-dashboard', 'digital-grimoire-organizer', 'spell-builder', 'servitor-design-journal', 'intention-achievement-tracker', 'ritual-safety-checklist'],
    book: '/landing-pages/books-bundle.html',
  },
  'es-libro-tratado-runas': {
    tools: ['rune-drawer', 'viking-runes', 'runic-name-translator', 'elder-futhark-reference', 'results-tracking-dashboard', 'digital-grimoire-organizer'],
    book: '/books/tratado-runas-cazadoras-caos-pdf.html',
  },
  'es-limpiar-y-cargar-runas': {
    tools: ['rune-drawer', 'viking-runes', 'candle-color-calculator', 'candle-intention-planner', 'sigil-charging-planner', 'sigil-charging-timer'],
    book: '/books/tratado-runas-cazadoras-caos-pdf.html',
  },
  'es-ouija-seguridad': {
    tools: ['paranormal-session-prep-checklist', 'sibilla-yes-no-oracle', 'tarot-yes-no', 'digital-pendulum', 'meditation-focus-timer', 'results-tracking-dashboard'],
    book: '/books/ouija-cazadora-pdf.html',
  },
  'es-ritual-destierro-espacio': {
    tools: ['banishing-ritual-builder', 'candle-color-calculator', 'candle-intention-planner', 'ritual-safety-checklist', 'spell-ingredient-planner', 'magical-correspondence-finder'],
    book: '/books/manual-activacion-servidores-magicos-pdf.html',
  },
  'es-runas-para-magia-del-caos': {
    tools: ['rune-drawer', 'viking-runes', 'runic-name-translator', 'elder-futhark-reference', 'sigil-intention-encoder', 'results-tracking-dashboard'],
    book: '/books/tratado-runas-cazadoras-caos-pdf.html',
  },
};

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const strip = (s) => s.replace(/<[^>]+>/g, '').trim();

function block(cfg, h1) {
  const first = TOOLS[cfg.tools[0]];
  const o = [];
  o.push('<h2 id="profundizacion">Profundiza tu practica</h2>');
  DEEPEN.forEach((p) => o.push('<p>' + esc(p) + '</p>'));
  o.push('<p>En <em>' + esc(h1) + '</em> estas herramientas son el complemento practico: todas funcionan gratis en el navegador, sin registro y sin instalar nada.</p>');
  o.push('<h2>Herramientas para este trabajo</h2><ul>');
  cfg.tools.forEach((t) => {
    const tool = TOOLS[t];
    if (!tool) return;
    o.push('<li><a href="/tools/' + t + '.html">' + esc(tool.title) + '</a> — ' + esc(tool.desc) + '</li>');
  });
  o.push('</ul>');
  o.push('<h2>Empieza ahora con ' + esc(first.title) + '</h2>');
  o.push('<p>' + esc(first.desc) + ' <a href="/tools/' + cfg.tools[0] + '.html">Abrir la herramienta gratis</a>.</p>');

  o.push('<div class="cta" style="margin:28px 0;padding:22px;border:1px solid #2a2a44;border-radius:12px;background:#141424">');
  o.push('<h2 style="margin-top:0">Lleva esta practica al siguiente nivel</h2>');
  o.push('<p>Los 12 grimorios en PDF cubren desde la construccion de sigilos hasta la invocacion goetica, el trabajo con runas y la gestion de resultados. Un solo pago, sin suscripciones.</p>');
  o.push('<p><a class="btn" href="https://pay.hotmart.com/D93257466P" rel="noopener">Ver los 12 libros — $19.99</a></p>');
  o.push('<p>Si prefieres trabajar con la pantalla, las 12 apps de Google Play cubren sigilos, tarot, runas, I Ching, suenos lucidos y cartas astrales. Pago unico por app.</p>');
  o.push('<p><a class="btn ghost" href="https://play.google.com/store/apps/developer?id=Cha0smagick+Labs" rel="noopener">Ver las 12 apps en Google Play</a></p>');
  o.push('<p><a href="' + cfg.book + '" rel="noopener">Libro relacionado con este tema</a></p>');
  o.push('<p><a href="/landing-pages/complete-access.html" rel="noopener">Inner Circle: acceso mensual con todo el ecosistema</a></p>');
  o.push('</div>');
  return '\n' + o.join('\n') + '\n';
}

let ok = 0;
const fail = [];
for (const [slug, cfg] of Object.entries(MAP)) {
  const f = path.join(R, 'blog', slug + '.html');
  if (!fs.existsSync(f)) { fail.push(slug + ' (no existe)'); continue; }
  let h = fs.readFileSync(f, 'utf8');
  if (h.includes('id="profundizacion"')) { fail.push(slug + ' (ya profundizado)'); continue; }
  const mh = h.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
  const h1 = mh ? strip(mh[1]) : slug;
  const marker = h.search(/<h2[^>]*>\s*Sigue explorando/);
  if (marker === -1) { fail.push(slug + ' (sin marcador)'); continue; }
  h = h.slice(0, marker) + block(cfg, h1) + h.slice(marker);
  fs.writeFileSync(f, h);
  ok++;
}
console.log('profundizados OK: ' + ok + ' / FAIL: ' + fail.length);
fail.forEach((x) => console.log('  FAIL ' + x));