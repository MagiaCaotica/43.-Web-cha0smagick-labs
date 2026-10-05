#!/usr/bin/env node
/**
 * reconcile-llms-tools.mjs — corrige el inventario de herramientas en llms.txt
 *
 * POR QUE
 * llms.txt es la superficie que leen los crawlers de IA, y decia
 *   "## Atomic Tools (40 herramientas gratuitas)"
 * cuando tools/ tiene 61 paginas (sin contar index.html). Faltaban 21, y eran
 * precisamente las mas pequenas: el mismo patron que casi lleva a "11 apps" en
 * README mientras habia 12. Un indice que subcuenta es peor que no publicar el
 * indice, porque el crawler resuelve por el.
 *
 * La lista NO se reescribe a mano: se deriva de data/atomic-tools.json (las 40
 * atómicas, con su id y nombre) mas las paginas reales de tools/ que no están en
 * ese registro. Si mañana se añade una herramienta, el script la recoge.
 *
 * USO
 *   node scripts/seo/reconcile-llms-tools.mjs          # dry-run: que cambiaria
 *   node scripts/seo/reconcile-llms-tools.mjs --write  # aplica
 *   node scripts/seo/reconcile-llms-tools.mjs --check  # verifica (exit 1 si desfasado)
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve('.');
const LLMS = 'llms.txt';
const REGISTRY = 'data/atomic-tools.json';
const TOOLS_DIR = 'tools';

const WRITE = process.argv.includes('--write');
const CHECK = process.argv.includes('--check');

/** Categorias ya presentes en llms.txt, para clasificar las paginas que faltan. */
const CATEGORY_RULES = [
  {
    heading: '### Astrologia y ciclos',
    test: /birth-chart|rising-sign|moon-sign|zodiac-cusp|retrograde|planetary-day|astrology-sign|moon-voc|full-birth/,
  },
  {
    heading: '### Tarot, oraculos y simbolos',
    test: /tarot|lenormand|sibilla|pendulum|elder-futhark|runic|ogham|alphabet-cipher|goetic-spirit|divination/,
  },
  {
    heading: '### Planificacion, seguridad y seguimiento',
    test: /spell|sigil|ritual|candle|banishing|elemental|lucid-dream|reality-check|dream-symbol|astral-projection|meditation|intention|safety|consent|grimoire|paranormal|servitor|activador-servidores|results|sabbat|moon-phase|lunar-phase|planetary-hours|iching|rune|kamea|zener|gnosis|tengwar/,
  },
];

/** Deriva un nombre legible desde el slug. */
function humanize(slug) {
  return slug
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function main() {
  const registry = JSON.parse(fs.readFileSync(path.join(ROOT, REGISTRY), 'utf8'));
  const atomicIds = Object.keys(registry.tools);

  const onDisk = fs
    .readdirSync(path.join(ROOT, TOOLS_DIR))
    .filter((f) => f.endsWith('.html') && f !== 'index.html')
    .map((f) => f.replace(/\.html$/, ''))
    .sort();

  const atomicSlugs = new Set(Object.values(registry.tools).map((t) => t.slug));

  const llmsPath = path.join(ROOT, LLMS);
  const src = fs.readFileSync(llmsPath, 'utf8');

  // Aislar la seccion "## Atomic Tools" para no confundir una herramienta ya listada
  // con una que falta. Sin esto el script no es idempotente: en la segunda pasada vuelve
  // a inyectar las 21 lineas porque "missing" se calcula contra el registro atomico, no
  // contra lo que llms.txt ya dice.
  const sectionStart = src.search(/^##\s+Atomic Tools\b/m);
  const sectionEnd = sectionStart === -1 ? -1 : src.slice(sectionStart).search(/^##\s+(?!Atomic Tools)/m);
  const section =
    sectionStart === -1
      ? ''
      : src.slice(sectionStart, sectionEnd === -1 ? src.length : sectionStart + sectionEnd);
  const alreadyListed = (slug) => section.includes(slug);

  const atomicSlugsAll = Object.values(registry.tools).map((t) => t.slug);
  const atomicListed = atomicSlugsAll.filter(alreadyListed);
  const missing = onDisk.filter((s) => !atomicSlugs.has(s) && !alreadyListed(s));

  const countRe = /^(##\s+Atomic Tools\s*)\((\d+)\s+herramientas?\s+gratuitas\)/m;
  const cm = countRe.exec(src);
  if (!cm) {
    console.error('ABORT: no encontre el encabezado "## Atomic Tools (N herramientas gratuitas)"');
    process.exit(1);
  }
  const declared = Number(cm[2]);

  console.log(`registro atomico : ${atomicIds.length} ids`);
  console.log(`tools/ en disco  : ${onDisk.length} paginas (sin index.html)`);
  console.log(`declarado en llms: ${declared}`);
  console.log(`faltantes        : ${missing.length}`);
  if (missing.length) missing.forEach((s) => console.log('  + ' + s));

  // Agrupar los faltantes bajo las categorias existentes
  const grouped = CATEGORY_RULES.map((r) => ({
    heading: r.heading,
    items: missing.filter((s) => r.test.test(s)),
  }));
  const claimed = new Set(grouped.flatMap((g) => g.items));
  const unclassified = missing.filter((s) => !claimed.has(s));
  if (unclassified.length) {
    console.log(`sin categoria (${unclassified.length}): ${unclassified.join(', ')}`);
    grouped.push({
      heading: '### Otras herramientas',
      items: unclassified,
    });
  }

  // El total se cuenta sobre lo que la seccion contiene (listadas + a inyectar), no sobre
  // el registro atomico: si no, al reejecutar tras un --write volveria a poner 40.
  const listedNow = onDisk.filter(alreadyListed);
  const total = listedNow.length + missing.length;
  let next = src.replace(countRe, (_m, head) => `${head}(${total} herramientas gratuitas)`);

  console.log(`ya listadas      : ${atomicListed.length}/${atomicSlugsAll.length} atomicas, ${listedNow.length} en total`);

  // Anadir los faltantes al final de la seccion Atomic Tools, justo antes de "## Technical Notes"
  if (missing.length) {
    const block = grouped
      .filter((g) => g.items.length)
      .map(
        (g) =>
          `${g.heading}\n` +
          g.items.map((s) => `- ${humanize(s)} — /tools/${s}.html`).join('\n')
      )
      .join('\n\n');
    next = next.replace(/\n## Technical Notes/, `\n${block}\n\n## Technical Notes`);
  }

  const report = (label, s) => {
    const add = s.length - src.length;
    console.log(`${label}: ${s.length} bytes (${add >= 0 ? '+' : ''}${add})`);
  };
  report('salida', next);

  if (CHECK) {
    if (next === src) console.log('CHECK OK: llms.txt esta al dia');
    else {
      console.error('CHECK FAIL: llms.txt esta desfasado (ejecuta con --write)');
      process.exit(1);
    }
    return;
  }
  if (WRITE) {
    fs.writeFileSync(llmsPath, next, 'utf8');
    console.log('escrito ' + LLMS);
  } else {
    console.log('dry-run: no se escribio nada (usa --write)');
  }
}

main();
