#!/usr/bin/env node
/**
 * build-tool-funnels.mjs
 * ---------------------------------------------------------------------------
 * Genera `data/tool-funnels.json`: el catalogo de venta que convierte las 61
 * herramientas gratuitas de `tools/` en funnels de venta de apps y libros.
 *
 * Por que este script existe:
 *   - El bloque `products` se DERIVA de `js/apps-data.js` (fuente de verdad).
 *     Nunca se escribe a mano -> los precios y URLs de Play Store no se
 *     desincronizan.
 *   - El mapping `tools` SI es autoral (que app encaja semanticamente con cada
 *     herramienta es una decision de negocio/editorial, no derivable).
 *   - Valida en build-time: todo slug debe existir como HTML en `tools/`, y todo
 *     app id / book id referenciado debe existir en el catalogo. Falla ruidosa.
 *
 * Uso:  node scripts/build-tool-funnels.mjs
 */

import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TOOLS_DIR = path.join(ROOT, 'tools');
const APPS_DATA = path.join(ROOT, 'js', 'apps-data.js');
const OUT_FILE = path.join(ROOT, 'data', 'tool-funnels.json');

// ===========================================================================
// 1. Derivar catalogo de producto desde js/apps-data.js
// ===========================================================================

/** "$3.99 USD (60% off)" -> "$3.99" */
const cleanPrice = (raw) => {
  if (!raw) return '';
  const match = String(raw).match(/\$\s?([\d.,]+)/);
  return match ? `$${match[1]}` : String(raw).trim();
};

/**
 * apps-data.js declara `const appsData` / `const booksData` a nivel de script.
 * Un `const` top-level en un script clasico vive en el entorno lexico global:
 * lo ven OTROS scripts como identificador suelto, pero NO aparece como
 * propiedad de `window`. Por eso hay que capturarlo explicitamente desde el
 * interior del mismo script, no leyendo `window.appsData`.
 *
 * (Este mismo hecho es la causa raiz del defecto #2 del diagnostico:
 * `conversion.js:getAppsData()` lee `window.appsData` y por eso devuelve null.)
 */
function loadProductCatalog() {
  const source = fs.readFileSync(APPS_DATA, 'utf8');
  const probe = [
    '',
    ';globalThis.__cha0Catalog = {',
    '  apps:  (typeof appsData  !== "undefined" ? appsData  : []),',
    '  books: (typeof booksData !== "undefined" ? booksData : [])',
    '};'
  ].join('\n');

  const sandbox = { window: {}, self: {}, console, fetch: undefined };
  sandbox.globalThis = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(source + probe, sandbox, { filename: 'apps-data.js' });

  const catalog = sandbox.__cha0Catalog || { apps: [], books: [] };
  const apps = catalog.apps;
  const books = catalog.books;

  if (!apps.length) throw new Error('No se pudo leer appsData de js/apps-data.js');
  if (!books.length) throw new Error('No se pudo leer booksData de js/apps-data.js');

  return { apps, books };
}

// ===========================================================================
// 2. Angulos de venta por categoria (copy ES/EN)
//    Tokens disponibles: {{tool}} (nombre de la herramienta), {{book}} (titulo)
// ===========================================================================

const ANGLES = {
  Astrología: {
    es: {
      head: '¿Quieres tu carta natal completa, no un resultado parcial?',
      sub: 'Astral Lab calcula posiciones, casas, aspectos y tránsitos con la misma precisión con la que estudiaste. La app guarda cada carta en tu dispositivo para comparar años.'
    },
    en: {
      head: 'Want your full natal chart, not a partial result?',
      sub: 'Astral Lab calculates positions, houses, aspects and transits with the precision you studied with, and keeps every chart on your device so you can compare across years.'
    }
  },
  Tarot: {
    es: {
      head: 'Lleva el tarot completo en el bolsillo',
      sub: 'Rider-Waite con las 78 cartas, significado inverso y combinaciones, funcionando sin conexión. Esta herramienta cubre lo esencial; la app cubre el sistema entero.'
    },
    en: {
      head: 'Carry the whole tarot deck in your pocket',
      sub: 'Rider-Waite with all 78 cards, reversals and combinations, fully offline. This tool covers the essentials; the app covers the whole system.'
    }
  },
  Oráculos: {
    es: {
      head: '¿Preguntas de sí o no? Lanza la runa',
      sub: 'Norse Rune Oracle es un oráculo completo con su propio sistema de lectura, no un simple muestrario de cartas. Para cuando la respuesta es binaria y necesitas una sola runa.'
    },
    en: {
      head: 'Yes-or-no question? Cast the rune',
      sub: 'Norse Rune Oracle is a complete oracle with its own reading system, not a card sampler. For when the answer is binary and you need a single rune.'
    }
  },
  Runas: {
    es: {
      head: 'El Elder Futhark completo, con lectura de runas',
      sub: 'Referencia completa de las 24 runas del Elder Futhark, con transliteración y las cuatro funciones de cadarunen la tirada. La app añade un motor de lectura, no solo una carta de referencia.'
    },
    en: {
      head: 'The full Elder Futhark, with rune readings',
      sub: 'All 24 runes, transliteration and layout readings. The app adds a reading engine, not just another reference card.'
    }
  },
  Símbolos: {
    es: {
      head: 'El Alfabeto Planetario, codificado y descifrado',
      sub: 'La cifra del alfabeto planetario funciona mejor cuando puedes verificar y volver a descifrar. Astral Lab registra cada correspondencia usada en tu bitácora.'
    },
    en: {
      head: 'The Planetary Alphabet, encoded and decoded',
      sub: 'The planetary alphabet cipher works best when you can verify and decode again. Astral Lab logs every correspondence you use in your own record.'
    }
  },
  Sigilos: {
    es: {
      head: 'De la intención al sigilo, y del sigilo al ritual',
      sub: 'Magick Chaos Sigil Generator automatiza la cifración, la carga y el registro de cada sigilo. Esta herramienta es el paso uno; la app cubre el ciclo completo.'
    },
    en: {
      head: 'From intention to sigil, and sigil to ritual',
      sub: 'Magick Chaos Sigil Generator automates encoding, charging and logging each sigil. This tool is step one; the app covers the full cycle.'
    }
  },
  Correspondencias: {
    es: {
      head: 'Correspondencias verificadas, no memorizadas a medias',
      sub: 'Cada elemento, color, número y planeta con su correspondencia planetaria y su día. La app los guarda con nota propia para que los reutilices en ritual.'
    },
    en: {
      head: 'Verified correspondences, not half-remembered ones',
      sub: 'Every element, colour, number and planet with its planetary correspondence and day. The app saves them with your own notes so you reuse them in ritual.'
    }
  },
  Lunar: {
    es: {
      head: 'Luna, fases y horas planetarias con datos reales',
      sub: 'Lunar Phase Calculator calcula fases, iluminación y horas planetarias con efemérides, no con aproximaciones. Funciona sin cobertura a la intemperie.'
    },
    en: {
      head: 'Moon, phases and planetary hours on real data',
      sub: 'Lunar Phase Calculator computes phases, illumination and planetary hours from ephemeris data, not approximations. Works with no signal at all.'
    }
  },
  Rituales: {
    es: {
      head: 'Rituales completos, no listas sueltas',
      sub: 'Arcana Goetia reúne los 72 espíritus con su sello, su ofrenda y su hora. Esta herramienta planifica el ritual; la app ejecuta la consulta completa.'
    },
    en: {
      head: 'Complete rituals, not loose checklists',
      sub: 'Arcana Goetia gathers all 72 spirits with their seal, offering and hour. This tool plans the ritual; the app runs the full query.'
    }
  },
  Sueños: {
    es: {
      head: 'Registro de sueños que survive a la mañana',
      sub: 'Dream Machine registra cada entrada en el momento en que te despiertas, con el temporizador de inducción lúcida y la técnica de chequeo de realidad al lado.'
    },
    en: {
      head: 'A dream log that survives the morning',
      sub: 'Dream Machine logs each entry the moment you wake, with the lucid induction timer and reality-check technique alongside.'
    }
  },
  Bienestar: {
    es: {
      head: 'Temporizadores que de verdad se detienen',
      sub: 'Gnosis Timer es un temporizador de práctica con intervalos configurables y registro de sesiones. Sin anuncios ni rastreo.'
    },
    en: {
      head: 'Timers that actually stop',
      sub: 'Gnosis Timer is a practice timer with configurable intervals and session logging. No ads, no tracking.'
    }
  },
  Seguimiento: {
    es: {
      head: 'Registra lo que hiciste, no lo que planeaste',
      sub: 'El seguimiento solo sirve si es continuo. estas herramientas de registro funcionan en el navegador; la app añade historial persistente y exportación.'
    },
    en: {
      head: 'Track what you did, not what you planned',
      sub: 'Tracking only works if it is continuous. These logging tools run in the browser; the app adds persistent history and export.'
    }
  },
  Seguridad: {
    es: {
      head: 'Magia responsable, con los límites escritos',
      sub: 'Las listas de seguridad y consentimiento funcionan mejor cuando las revisas antes de cada sesión. NOCTEM incluye un modo de trabajo seguro con registro.'
    },
    en: {
      head: 'Responsible magic, with the limits written down',
      sub: 'Safety and consent checklists work best when you review them before each session. NOCTEM includes a safe working mode with logging.'
    }
  },
  Organización: {
    es: {
      head: 'Un grimorio que se puede consultar de verdad',
      sub: 'Organiza servidores, sesiones y grimorio en un solo sitio, con búsqueda. La app añade diseño de servidores con seguimiento de cargas y expiraciones.'
    },
    en: {
      head: 'A grimoire you can actually consult',
      sub: 'Organise servitors, sessions and grimoire in one searchable place. The app adds servitor design with charge tracking and expiry.'
    }
  }
};

// ===========================================================================
// 3. Mapping autoral: herramienta -> apps + libro
//    slug: [appIds], bookId
//    "apps": [] es valido y preferible a una app irrelevante.
// ===========================================================================

const MAP_ES = {
  // --- Astrologia ---
  'full-birth-chart': { apps: ['astral-lab'], book: 'codex-chaoticus-pdf' },
  'rising-sign-calculator': { apps: ['astral-lab'], book: 'codex-chaoticus-pdf' },
  'moon-sign-calculator': { apps: ['astral-lab', 'lunar-phase-calculator'], book: 'codex-chaoticus-pdf' },
  'zodiac-cusp-calculator': { apps: ['astral-lab'], book: 'codex-chaoticus-pdf' },
  'planetary-retrograde-calendar': { apps: ['astral-lab', 'lunar-phase-calculator'], book: 'codex-chaoticus-pdf' },
  'planetary-day-calculator': { apps: ['astral-lab', 'lunar-phase-calculator'], book: 'codex-chaoticus-pdf' },
  // --- Tarot ---
  'tarot-card-reference': { apps: ['unofficial-rider-waite-tarot'], book: 'tarot-chaos-pdf' },
  'tarot-spread-builder': { apps: ['unofficial-rider-waite-tarot'], book: 'tarot-chaos-pdf' },
  'tarot-journal': { apps: ['unofficial-rider-waite-tarot'], book: 'tarot-chaos-pdf' },
  'lenormand-card-draw': { apps: ['unofficial-rider-waite-tarot'], book: 'tarot-chaos-pdf' },
  // --- Oraculos ---
  'sibilla-yes-no-oracle': { apps: ['norse-rune-oracle'], book: 'ouija-cazadora-pdf' },
  'pendulum-question-builder': { apps: ['psi-gym'], book: 'mind-the-gap-pdf' },
  // --- Runas ---
  'elder-futhark-reference': { apps: ['norse-rune-oracle'], book: 'tratado-runas-cazadoras-caos-pdf' },
  'runic-name-translator': { apps: ['norse-rune-oracle'], book: 'tratado-runas-cazadoras-caos-pdf' },
  'ogham-oracle': { apps: ['norse-rune-oracle'], book: 'tratado-runas-cazadoras-caos-pdf' },
  // --- Simbolos ---
  'planetary-alphabet-cipher': { apps: ['chaos-sigil-generator'], book: 'codex-chaoticus-pdf' },
  // --- Sigilos ---
  'sigil-intention-encoder': { apps: ['chaos-sigil-generator'], book: 'codex-chaoticus-pdf' },
  // --- Correspondencias ---
  'magical-correspondence-finder': { apps: ['arcana-goetia'], book: 'codex-chaoticus-pdf' },
  'elemental-balance-checker': { apps: ['arcana-goetia'], book: 'codex-chaoticus-pdf' },
  // --- Lunar ---
  'moon-phase-calendar': { apps: ['lunar-phase-calculator'], book: null },
  'moon-intention-planner': { apps: ['lunar-phase-calculator'], book: 'codex-chaoticus-pdf' },
  'planetary-hours-planner': { apps: ['lunar-phase-calculator'], book: 'codex-chaoticus-pdf' },
  'ritual-timing-scorecard': { apps: ['lunar-phase-calculator', 'astral-lab'], book: 'codex-chaoticus-pdf' },
  'sabbat-season-planner': { apps: ['lunar-phase-calculator'], book: 'codex-chaoticus-pdf' },
  // --- Rituales ---
  'candle-intention-planner': { apps: ['arcana-goetia'], book: 'codex-chaoticus-pdf' },
  'spell-ingredient-planner': { apps: ['arcana-goetia'], book: 'codex-chaoticus-pdf' },
  'banishing-ritual-builder': { apps: ['arcana-goetia'], book: 'codex-chaoticus-pdf' },
  // --- Suenos ---
  'lucid-dream-training-planner': { apps: ['dream-machine', 'lucid-dream'], book: 'mind-the-gap-pdf' },
  'reality-check-technique-coach': { apps: ['lucid-dream', 'dream-machine'], book: 'mind-the-gap-pdf' },
  'dream-symbol-dictionary': { apps: ['dream-machine'], book: 'mind-the-gap-pdf' },
  'astral-projection-session-timer': { apps: ['lucid-dream'], book: 'mind-the-gap-pdf' },
  // --- Bienestar ---
  'meditation-focus-timer': { apps: ['psi-gym'], book: 'mind-the-gap-pdf' },
  // --- Seguimiento ---
  'intention-achievement-tracker': { apps: [], book: 'mind-the-gap-pdf' },
  'results-tracking-dashboard': { apps: [], book: 'mind-the-gap-pdf' },
  // --- Seguridad ---
  'ritual-safety-checklist': { apps: ['noctem-tools'], book: 'codex-chaoticus-pdf' },
  'consent-boundary-planner': { apps: ['noctem-tools'], book: 'codex-chaoticus-pdf' },
  // --- Organizacion ---
  'digital-grimoire-organizer': { apps: ['arcana-goetia'], book: 'codex-chaoticus-pdf' },
  'paranormal-session-prep-checklist': { apps: ['noctem-tools'], book: 'codex-chaoticus-pdf' },
  // --- Sigilos (2) ---
  'sigil-charging-planner': { apps: ['chaos-sigil-generator'], book: 'codex-chaoticus-pdf' },
  // --- Organizacion (2) ---
  'servitor-design-journal': { apps: ['arcana-goetia'], book: 'manual-activacion-servidores-magicos-pdf' },
  // --- Organizacion (3) ---
  // Esta pagina es la unica de la generacion "en" que nace en espanol: ver <html lang="es">.
  'activador-servidores': { apps: ['arcana-goetia'], book: 'manual-activacion-servidores-magicos-pdf' }
};

const MAP_EN = {
  'astrology-sign-calculator': { apps: ['astral-lab'], book: 'codex-chaoticus-pdf' },
  'candle-color-calculator': { apps: ['arcana-goetia'], book: 'codex-chaoticus-pdf' },
  'digital-pendulum': { apps: ['psi-gym'], book: 'mind-the-gap-pdf' },
  'gnosis-timer': { apps: ['psi-gym'], book: 'mind-the-gap-pdf' },
  'goetic-spirit-selector': { apps: ['arcana-goetia'], book: 'codex-chaoticus-pdf' },
  'iching': { apps: ['iching-oracle'], book: 'codex-chaoticus-pdf' },
  'iching-changing-lines': { apps: ['iching-oracle'], book: 'codex-chaoticus-pdf' },
  'lunar-phase': { apps: ['lunar-phase-calculator'], book: null },
  'moon-voc': { apps: ['lunar-phase-calculator', 'astral-lab'], book: 'codex-chaoticus-pdf' },
  'planetary-hours': { apps: ['lunar-phase-calculator'], book: 'codex-chaoticus-pdf' },
  'planetary-kamea-sigil': { apps: ['chaos-sigil-generator'], book: 'codex-chaoticus-pdf' },
  'reality-check-tracker': { apps: ['lucid-dream', 'dream-machine'], book: 'mind-the-gap-pdf' },
  'rune-drawer': { apps: ['norse-rune-oracle'], book: 'tratado-runas-cazadoras-caos-pdf' },
  'sigil-charging-timer': { apps: ['chaos-sigil-generator'], book: 'codex-chaoticus-pdf' },
  'sigil-generator': { apps: ['chaos-sigil-generator'], book: 'codex-chaoticus-pdf' },
  'spell-builder': { apps: ['arcana-goetia'], book: 'codex-chaoticus-pdf' },
  'tarot-yes-no': { apps: ['unofficial-rider-waite-tarot', 'norse-rune-oracle'], book: 'tarot-chaos-pdf' },
  'tengwar-transcriber': { apps: [], book: 'codex-chaoticus-pdf' },
  'viking-runes': { apps: ['norse-rune-oracle'], book: 'tratado-runas-cazadoras-caos-pdf' },
  'zener-esp-trainer': { apps: ['psi-gym'], book: 'mind-the-gap-pdf' }
};

// ===========================================================================
// 4. Construccion + validacion
// ===========================================================================

function main() {
  const { apps, books } = loadProductCatalog();

  const appIndex = new Map(apps.map((a) => [a.id, a]));
  const bookIndex = new Map(books.map((b) => [b.id, b]));

  // Catalogo de producto normalizado (fuente de verdad -> artefacto)
  const productApps = apps
    .filter((a) => a.status === 'available')
    .map((a) => ({ id: a.id, name: a.name, price: cleanPrice(a.price), url: a.url }));

  const productBooks = books.map((b) => {
    const page = `../books/${b.id}.html`;
    if (!fs.existsSync(path.join(ROOT, 'books', `${b.id}.html`))) {
      throw new Error(`Libro "${b.id}" no tiene pagina de venta en books/${b.id}.html`);
    }
    if (!/^https?:\/\//.test(b.hotmartLink || '')) {
      throw new Error(`Libro "${b.id}" no tiene un hotmartLink http(s) valido`);
    }
    return {
      id: b.id,
      name: b.name,
      price: cleanPrice(b.price),
      page,
      checkout: b.hotmartLink,
      language: (b.language || 'en').toLowerCase().startsWith('es') ? 'es' : 'en'
    };
  });

  // Slugs reales en disco
  const onDisk = new Set(
    fs
      .readdirSync(TOOLS_DIR)
      .filter((f) => f.endsWith('.html') && f !== 'index.html')
      .map((f) => f.replace(/\.html$/, ''))
  );

  const tools = {};
  const errors = [];

  const addTools = (mapping, lang) => {
    for (const [slug, spec] of Object.entries(mapping)) {
      if (tools[slug]) errors.push(`slug duplicado: ${slug}`);
      if (!onDisk.has(slug)) {
        errors.push(`slug sin HTML en tools/: ${slug}.html`);
        continue;
      }
      // categoria -> desde el catalogo atomico si existe
      const category = resolveCategory(slug);
      if (!category || !ANGLES[category]) {
        errors.push(`categoria sin angulo definido para ${slug} ("${category}")`);
        continue;
      }
      const appIds = spec.apps.filter((id) => {
        if (!appIndex.has(id)) {
          errors.push(`app id inexistente en apps-data.js: "${id}" (usada por ${slug})`);
          return false;
        }
        return true;
      });
      if (spec.book && !bookIndex.has(spec.book)) {
        errors.push(`book id inexistente en apps-data.js: "${spec.book}" (usada por ${slug})`);
      }
      if (appIds.length === 0 && !spec.book) {
        errors.push(`${slug} no tiene ni app ni libro -> dead end`);
      }
      tools[slug] = { category, lang, apps: appIds, book: spec.book || null, related: [] };
    }
  };

  addTools(MAP_ES, 'es');
  addTools(MAP_EN, 'en');

  // Enriquecer `related` con hermanas de la misma categoria Y el mismo idioma
  // (determinista). Cruzar ES/EN genera enlaces a paginas en otro idioma: solo
  // se recurre a sisters de otro idioma si no hay al menos 3 del mismo.
  const byCategory = new Map();
  for (const [slug, entry] of Object.entries(tools)) {
    const key = entry.category + '|' + entry.lang;
    if (!byCategory.has(key)) byCategory.set(key, []);
    byCategory.get(key).push(slug);
  }
  for (const [slug, entry] of Object.entries(tools)) {
    const sameLang = (byCategory.get(entry.category + '|' + entry.lang) || [])
      .filter((s) => s !== slug);
    const otherLang = Object.entries(tools)
      .filter(([s, e]) => s !== slug && e.category === entry.category)
      .map(([s]) => s);
    entry.related = [...sameLang, ...otherLang].slice(0, 3);
  }

  // Nombres legibles por slug. Gen1 usa el nombre real del catalogo atomico;
  // Gen2 se humaniza desde el slug. `conversion.js` lo lee en
  // `toolDisplayName(slug, catalogue)`.
  const atomic = {};
  for (const [slug, entry] of Object.entries(tools)) {
    atomic[slug] = { name: atomicName(slug), category: entry.category, lang: entry.lang };
  }

  // Detectar tools en disco sin entrada en el catalogo
  const orphans = [...onDisk].filter((slug) => !tools[slug]);

  if (errors.length) {
    console.error('\nFALLO de validacion:\n' + errors.map((e) => '  - ' + e).join('\n') + '\n');
    process.exit(1);
  }

  const payload = {
    version: 1,
    generated: new Date().toISOString().slice(0, 10),
    products: { apps: productApps, books: productBooks },
    angles: ANGLES,
    atomic,
    tools
  };

  fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
  fs.writeFileSync(OUT_FILE, JSON.stringify(payload, null, 2) + '\n', 'utf8');

  const withApp = Object.values(tools).filter((t) => t.apps.length).length;
  const withBook = Object.values(tools).filter((t) => t.book).length;
  console.log(`OK  data/tool-funnels.json generado`);
  console.log(`    tools:        ${Object.keys(tools).length}`);
  console.log(`    con app:      ${withApp}`);
  console.log(`    con libro:    ${withBook}`);
  console.log(`    apps:         ${productApps.length}`);
  console.log(`    libros:       ${productBooks.length}`);
  if (orphans.length) {
    console.log(`\n  AVISO: ${orphans.length} HTML en tools/ sin entrada en el catalogo:`);
    console.log('    ' + orphans.join('\n    '));
  }
}

/** Categoria de un slug: desde data/atomic-tools.json si es Gen1, si no inferida. */
let atomicCache = null;
function loadAtomicCache() {
  if (!atomicCache) {
    const file = path.join(ROOT, 'data', 'atomic-tools.json');
    atomicCache = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : { tools: {} };
  }
  return atomicCache;
}

function resolveCategory(slug) {
  const entry = Object.values(loadAtomicCache().tools || {}).find((t) => t.slug === slug);
  if (entry) return entry.category;

  // Gen2: un angulo explicito por slug (no todos los Gen2 caen en una categoria del catalogo atomico)
  return GEN2_CATEGORY[slug] || null;
}

/** Nombre legible: el real del catalogo atomico, o el slug humanizado. */
function atomicName(slug) {
  const entry = Object.values(loadAtomicCache().tools || {}).find((t) => t.slug === slug);
  if (entry && entry.name) return entry.name;
  const words = slug.replace(/-/g, ' ').replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase();
  return words.replace(/\b[a-z]/g, (c) => c.toUpperCase());
}

const GEN2_CATEGORY = {
  'astrology-sign-calculator': 'Astrología',
  'candle-color-calculator': 'Rituales',
  'digital-pendulum': 'Oráculos',
  'gnosis-timer': 'Bienestar',
  'goetic-spirit-selector': 'Rituales',
  'iching': 'Oráculos',
  'iching-changing-lines': 'Oráculos',
  'lunar-phase': 'Lunar',
  'moon-voc': 'Lunar',
  'planetary-hours': 'Lunar',
  'planetary-kamea-sigil': 'Sigilos',
  'reality-check-tracker': 'Sueños',
  'rune-drawer': 'Runas',
  'sigil-charging-timer': 'Sigilos',
  'sigil-generator': 'Sigilos',
  'spell-builder': 'Rituales',
  'tarot-yes-no': 'Tarot',
  'tengwar-transcriber': 'Símbolos',
  'viking-runes': 'Runas',
  'zener-esp-trainer': 'Bienestar',
  'activador-servidores': 'Organización'
};

main();
