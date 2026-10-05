#!/usr/bin/env node
/**
 * build-aso-doc.mjs — genera docs/aso-12-apps.md
 *
 * POR QUE UN GENERADOR Y NO UNA EDICION A MANO
 * El doc de ASO historico vivia en projects/docs/archive/ventas/aso-play-store-11-apps.md
 * y cubria 11 apps con el precio de Astral Lab en $3.99, cuando el precio real es $6.99.
 * Esa es exactamente la clase de deriva que ya cobro caro una vez: catalog.json decia $3.99
 * para Lucid Dream y el CTA de 108 articles lo publico durante meses (ver commit 8fbc21b7).
 * Aqui los precios se leen de offers.json —la unica fuente de verdad del catalogo— en
 * tiempo de build, asi que la ficha de Play nunca puede contradecir la pagina del producto.
 *
 * QUE HACE
 *   1. Lee el doc de archivo y extrae los 11 bloques de ficha ya redactados.
 *   2. Inserta la ficha de la app numero 12 (Lucid Dream: Astral Projection), que
 *      no existia porque cuando se escribio el doc todavia no era una app separada.
 *   3. Reescribe cada encabezado de seccion con el precio de offers.json.
 *   4. Renumera las secciones y regenera las notas de ejecucion.
 *
 * USO
 *   node scripts/aso/build-aso-doc.mjs            # dry-run (default): muestra el diff
 *   node scripts/aso/build-aso-doc.mjs --write    # aplica
 *   node scripts/aso/build-aso-doc.mjs --check    # verifica que el archivo esta al dia (exit 1 si no)
 *
 * IDEMPOTENTE: volver a ejecutarlo no cambia nada.
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve('.');
const SRC = 'projects/docs/archive/ventas/aso-play-store-11-apps.md';
const OUT = 'docs/aso-12-apps.md';
const OFFERS = 'scripts/bots/data/offers.json';

const WRITE = process.argv.includes('--write');
const CHECK = process.argv.includes('--check');

/** El id de offers.json no siempre coincide con el nombre del archivo de books/apps. */
const PAGE_BY_ID = {
  'lucid-dream': 'apps/lucid-dream.html',
  'astral-lab': 'apps/astral-lab.html',
};

/**
 * Ficha de la app numero 12.
 *
 * Estava ausente del doc de archivo porque cuando se redactaron las 11 fichas,
 * apps/lucid-dream.html todavia no figuraba como app separada en el catalogo.
 * b4 ya resolvio la duda que el propio docArchived planteaba ("¿es un alias de Dream
 * Machine?"): NO — es una app propia, con su propio packageId, su propia pagina y su
 * propio precio de $9.99, y aparece en offers.json y en js/apps-data.js.
 *
 * Por eso su precio es de los mas altos de la familia y no de $3.99: la ficha tiene que
 * justificar el ticket, igual que hace NOCTEM con el suyo.
 */
const LUCID_DREAM = {
  name: 'Lucid Dream: Astral Projection & Lucid Dreaming',
  page: 'apps/lucid-dream.html',
  es: {
    title: 'Lucid Dream: Astral Projection & Sueño Lucido',
    short:
      'Motor de ondas binaurales para inducir el sueno lucido. Diario ilimitado. Compra unica.',
    long: [
      'Dormir bien no es el objetivo. Entrar despierto es.',
      '- Motor de ondas binaurales con especificamente delta (sueno profundo) y theta (sueno lucido)',
      '- Diario de suenos ilimitado con busqueda y etiquetas',
      '- Estadisticas: horas de sueno, frecuencia de suenos lucidos, patrones recurrentes',
      '- Temporizador de astral projection con ciclo de 90 minutos para pratique del viaje astral',
      '- Tecnicas guias: realidad continua, lembas del sueno, salida del cuerpo, anclaje del movil',
      '- 100% offline: sin cuentas, sin publicidad, sin rastreo',
      '- Compra unica: acceso de por vida, sin suscripciones',
      'Para practicantes que ya intentaron leer sus suenos y quieren methodologies para producirlos.',
    ].join('\n> '),
    keywords:
      'sueno lucido, astral projection, ondas binaurales, diario de suenos, tecnicas de sueno lucido, realidad continua, theta, delta, prediccion de suenos, suenos lucidos app, astral projection app',
  },
  en: {
    title: 'Lucid Dream: Astral Projection & Lucid Dreaming',
    short:
      'Binaural beat engine for lucid dream induction. Unlimited dream journal. One-time buy.',
    long:
      'Sleeping well is not the goal. Waking up inside the dream is. Delta-targeted binaural beat engine for deep sleep and theta for lucid induction, an unlimited searchable dream journal, sleep and lucid-dream statistics, a 90-minute astral projection timer for out-of-body practice, guided techniques (reality continuity, sleep lemdas, body exit, phone anchoring), 100% offline with no accounts, ads or tracking, and one-time purchase with lifetime access. For practitioners who have already learned to read their dreams and now want methods to produce them.',
    keywords:
      'lucid dreaming, astral projection, binaural beats, dream journal, lucid dream techniques, reality continuity, theta waves, delta waves, dream prediction, astral projection app, lucid dream app',
  },
};

function readOffers() {
  const raw = fs.readFileSync(path.join(ROOT, OFFERS), 'utf8');
  return JSON.parse(raw);
}

function esc(s) {
  return String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * offers.json guarda el precio con sufijo de divisa ("$3.99 USD") porque ese texto es el que
 * se muestra al cliente. La ficha de Play no usa divisa — Play la pone al lado del boton de
 * comprar y repetirla en el titulo suena a texto generado. Ademas, sin normalizar, un
 * "$3.99" -> "$3.99 USD" se contaria como cambio de precio aunque no haya ninguno.
 */
function priceOnly(raw) {
  return String(raw).replace(/\s*USD\s*$/i, '').trim();
}

/** Extrae los bloques "## N. Name ($price)" del doc de archivo, en orden. */
function extractEntries(src) {
  const lines = src.split(/\r?\n/);
  const heads = [];
  lines.forEach((l, i) => {
    const m = /^##\s+(\d+)\.\s+(.+?)\s*$/.exec(l);
    if (m) heads.push({ index: Number(m[1]), title: m[2], start: i });
  });
  const notesIdx = lines.findIndex((l) => /^##\s+Notas de ejecucion/.test(l));
  const out = [];
  heads.forEach((h, k) => {
    const end = k + 1 < heads.length ? heads[k + 1].start : notesIdx;
    out.push({ ...h, body: lines.slice(h.start, end).join('\n').trimEnd() });
  });
  return out;
}

function nameFor(offer) {
  const slug = offer.id;
  return slug;
}

/**
 * Reescribe el encabezado de seccion: renumera SIEMPRE y repricea solo si el precio cambio.
 *
 * Renumerar y repricear estan separados a proposito. Cuando ambas cosas iban juntas en la
 * rama "el precio cambio", las secciones cuyo precio ya era correcto se devolvian sin tocar y
 * conservaban su numero viejo: al insertar la app 12 antes de NOCTEM, el resultado fueron dos
 * "## 10." y ningun "## 12.". El numero de seccion no depende del precio.
 */
function rewriteHeading(block, offersById, order) {
  const m = /^##\s+\d+\.\s+(.+?)\s*\(([^)]*)\)\s*$/m.exec(block);
  if (!m) return { block, changed: false, from: null, to: null };
  const [, label, oldPrice] = m;
  // "Astral Lab: Natal Chart & Astrology" -> "astral-lab"
  const key = label
    .split(':')[0]
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  const offer = offersById.get(key);
  const to = offer ? priceOnly(offer.price) : oldPrice;
  const changed = to !== oldPrice;
  // El reemplazo es una FUNCION, no un string, a proposito: en un string de reemplazo
  // "$14.99" empieza por "$1", que String.replace lee como "captura grupo 1" y expande al
  // nombre de la app. Es el mismo bug de $1 que ya corrompio dos metas en produccion y que
  // este mismo archivo sufrio en su primera version ("Suite (NOCTEM ... Suite4.99)").
  const next = block.replace(
    /^##\s+\d+\.\s+(.+?)\s*\(([^)]*)\)\s*$/m,
    () => `## ${order}. ${label} (${to})`
  );
  return { block: next, changed, from: changed ? oldPrice : null, to: changed ? to : null };
}

function renderLucid(order, price) {
  return [
    `## ${order}. ${LUCID_DREAM.name} (${price})`,
    '',
    '**ES**',
    `- **Título:** ${LUCID_DREAM.es.title}`,
    `- **Desc. corta:** ${LUCID_DREAM.es.short}`,
    '- **Descripción larga:**',
    `  > ${LUCID_DREAM.es.long}`,
    `- **Keywords ES:** ${LUCID_DREAM.es.keywords}`,
    '',
    '**EN**',
    `- **Title:** ${LUCID_DREAM.en.title}`,
    `- **Short desc:** ${LUCID_DREAM.en.short}`,
    `- **Full description:** ${LUCID_DREAM.en.long}`,
    `- **Keywords EN:** ${LUCID_DREAM.en.keywords}`,
  ].join('\n');
}

const NOTES = (offers) => `## Notas de ejecución ASO

Generado por \`scripts/aso/build-aso-doc.mjs\` desde \`scripts/bots/data/offers.json\`
(\`reconciledAt: ${offers._meta.reconciledAt}\`). Los precios de cada encabezado salen del
catálogo, no de este documento: si cambia un precio en la tienda, se regenera esta ficha.

1. **Estado del catálogo:** ${offers.apps.length} apps y ${offers.books.length} libros.
   Este documento cubre las ${offers.apps.length} apps. El doc de archivo
   \`projects/docs/archive/ventas/aso-play-store-11-apps.md\` queda como registro historico
   de las 11 primeras fichas y ya no es la fuente: su precio de Astral Lab ($3.99) estaba
   equivocado y su pregunta sobre \`apps/lucid-dream.html\` ya tiene respuesta.
2. **Lanzamiento escalonado:** los títulos "NEW!" no deben aparecer en la ficha de Play
   (Play no admite "NEW" permanente); usar "NEW" solo en la web.
3. **NOCTEM = ancla de ticket alto:** en Play, añadir un FAQ interno en la descripción
   respondiendo el precio ("¿Por qué NOCTEM cuesta más? Porque es un kit profesional completo").
   **Lucid Dream es el segundo ancla de ticket alto** ($9.99) y necesita el mismo
   argumento: no es un reloj con ondas, es motor + diario + estadísticas + temporizador.
4. **Keywords universales de marca:** incluir siempre \`Cha0smagick\` como keyword de marca
   para reforzar el ecosistema (blog → apps → books).
5. **Cross-sell en descripciones:** mención orgánica del bundle de libros
   (${priceOnly(offers.bundle.price)}, ${offers.books.length} libros) solo donde fluya naturalmente
   (p. ej. en Chaos Sigil y Arcana Goetia: "complementa tu práctica con los 7 libros del bundle").
6. **Localización:** crear ficha EN como primaria y ES como secundaria; el resto de idiomas
   (DE/FR/PT/IT) solo para Rider Waite Tarot (que es 7 idiomas).
7. **Assets:** ícono consistente en toda la familia (mismo fondo oscuro + símbolo); feature
   graphic 1024×500 con el beneficio principal como titular; screenshots ordenados:
   splash → feature principal → prueba de offline → precio único.
8. **Precio visible en ficha:** Play no permite mostrar precio en descripción; el beneficio
   "sin suscripciones, pago único" SÍ está permitido y es el diferenciador.
9. **A/B testing de título:** probar variante con keyword de alto volumen en posición inicial
   (p. ej. "Tarot Rider Waite" en lugar de "Unofficial Rider Waite Tarot") y medir CTR por 30 días.

### Lo que este documento NO puede afirmar

- \`listingStatus\` de las ${offers.apps.length} apps es \`external_listing_unverified\`: el catálogo
  local no prueba que la ficha exista en Play, ni su texto, ni su precio real.
  Antes de publicar cualquiera de estas fichas hay que abrir Play Console y verificar.
- Ninguna cifra de descargas, instalaciones o ingresos aparece aquí porque no hay fuente
  verificada para ellas en este repositorio.
`;

function main() {
  const offers = readOffers();
  const offersById = new Map(offers.apps.map((a) => [a.id, a]));

  const src = fs.readFileSync(path.join(ROOT, SRC), 'utf8');
  const entries = extractEntries(src);
  if (entries.length !== 11) {
    console.error(`ABORT: esperaba 11 fichas en ${SRC}, encontré ${entries.length}`);
    process.exit(1);
  }

  // 1) reprice + 2) insert Lucid Dream as #10, renumber the rest
  const blocks = [];
  let order = 0;
  const changes = [];
  for (const e of entries) {
    if (e.index === 10) {
      // insert the 12th app before NOCTEM
      order += 1;
      const price = priceOnly(offersById.get('lucid-dream').price);
      blocks.push(renderLucid(order, price));
      changes.push({ what: 'nueva ficha', label: LUCID_DREAM.name, to: price });
    }
    order += 1;
    const r = rewriteHeading(e.body, offersById, order);
    if (r.changed) changes.push({ what: 'precio', label: e.title, from: r.from, to: r.to });
    blocks.push(r.block);
  }

  const header = `# ASO Play Store — Fichas para las ${offers.apps.length} Apps (ES + EN)

> Documento vigente. Generado por \`scripts/aso/build-aso-doc.mjs\`; los precios vienen de
> \`scripts/bots/data/offers.json\`, que es la única fuente de verdad del catálogo.
> No editar a mano: regenerar.

Cada ficha trae título, descripción corta, descripción larga y keywords en español e
inglés, listas para pegar en Play Console. Las notas de ejecución al final cubren las
decisiones que aplican a toda la familia.

Estado de las fichas en Play: **no verificado**. El catálogo marca las
${offers.apps.length} apps como \`external_listing_unverified\`; este documento dice lo que
*debería* decirse en la ficha, no lo que Play muestra hoy.
`;

  const out = [header, '', '---', '', ...blocks.flatMap((b) => [b, '', '---', '']), NOTES(offers)].join('\n').replace(/\n{4,}/g, '\n\n\n');

  const dest = path.join(ROOT, OUT);
  const current = fs.existsSync(dest) ? fs.readFileSync(dest, 'utf8') : null;

  console.log(`entradas archivo : ${entries.length}`);
  console.log(`apps en catalogo : ${offers.apps.length}`);
  console.log(`precios ajustados: ${changes.filter((c) => c.what === 'precio').length}`);
  for (const c of changes) {
    console.log(`  - ${c.label}: ${c.from ?? '—'} -> ${c.to}`);
  }
  console.log(`salida           : ${OUT} (${out.length} bytes)`);

  if (CHECK) {
    if (current === out) {
      console.log('CHECK OK: el documento esta al dia');
    } else {
      console.error('CHECK FAIL: el documento esta desactualizado (ejecuta con --write)');
      process.exit(1);
    }
    return;
  }
  if (WRITE) {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.writeFileSync(dest, out, 'utf8');
    console.log('escrito');
  } else {
    console.log('dry-run: no se escribio nada (usa --write)');
  }
}

main();
