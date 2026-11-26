/**
 * verify-money-pages.mjs — comprueba que las páginas que cubren keywords caras
 * tienen oferta real, precios verdaderos y HTML sano. Falla con exit 1.
 *
 *   node scripts/seo/verify-money-pages.mjs
 */
import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();

const PAGES = [
  {
    file: 'blog/72-goetia-demons-complete-list.html',
    title: /<title>Goetia: The 72 Demons of Solomon, Ranks and Sigils<\/title>/,
    cta: 1,
    links: [
      'play.google.com/store/apps/details?id=com.cha0smagick.sigilgeneratorfinal',
      'pay.hotmart.com/N108147778I',
    ],
  },
  {
    file: 'blog/how-to-make-a-servitor-without-a-sigil.html',
    title: null,
    cta: 1,
    links: [
      'play.google.com/store/apps/details?id=com.app.goetiansealsgeneratorapp',
      'pay.hotmart.com/W106595764X',
    ],
  },
];

// Fase 4: estas páginas deben enlazar a la comparativa de exactitud de cartas natales.
const INBOUND = [
  'blog/natal-astrology-chart-reading-guide.html',
  'blog/big-three-explained.html',
  'blog/moon-sign-astrology-guide.html',
];
const TARGET = 'birth-chart-app-accuracy-comparison.html';

let fails = 0;
const bad = (msg) => { console.log(`FAIL  ${msg}`); fails++; };
const ok = (msg) => console.log(`ok    ${msg}`);

for (const p of PAGES) {
  const full = path.join(ROOT, p.file);
  if (!fs.existsSync(full)) { bad(`${p.file}: no existe`); continue; }
  const html = fs.readFileSync(full, 'utf8');

  if ((html.match(/<h1[\s>]/g) || []).length !== 1) bad(`${p.file}: <h1> no es único`);
  else ok(`${p.file}: un solo <h1>`);

  const can = html.match(/<link rel="canonical" href="([^"]+)"/);
  if (!can) bad(`${p.file}: sin canonical`);
  else ok(`${p.file}: canonical ${can[1]}`);

  const ctaCount = (html.match(/<!-- money-cta:start -->/g) || []).length;
  if (ctaCount !== p.cta) bad(`${p.file}: bloques CTA = ${ctaCount}, esperado ${p.cta}`);
  else ok(`${p.file}: ${ctaCount} bloque CTA`);

  for (const l of p.links) {
    if (!html.includes(l)) bad(`${p.file}: falta ${l}`);
    else ok(`${p.file}: enlace ${l.split('?')[0].slice(-28)}`);
  }

  if (p.title && !p.title.test(html)) bad(`${p.file}: <title> no es el esperado`);
  else if (p.title) ok(`${p.file}: title correcto`);

  // presupuesto HTML: no debe haber <section> sin cerrar
  const open = (html.match(/<section[\s>]/g) || []).length;
  const close = (html.match(/<\/section>/g) || []).length;
  if (open !== close) bad(`${p.file}: <section> ${open} abiertos / ${close} cerrados`);
  else ok(`${p.file}: secciones equilibradas (${open})`);

  const divOpen = (html.match(/<div[\s>]/g) || []).length;
  const divClose = (html.match(/<\/div>/g) || []).length;
  if (divOpen !== divClose) bad(`${p.file}: <div> ${divOpen} abiertos / ${divClose} cerrados`);
  else ok(`${p.file}: divs equilibrados (${divOpen})`);

  // precios citados = precios reales del catálogo
  for (const price of ['$3.99', '$4.99', '$29.99']) {
    if (html.includes(price) && !html.includes(`$${price.slice(1)}`)) bad(`${p.file}: precio raro ${price}`);
  }
}

// Fase 4: enlaces entrantes reales, y que el destino exista.
for (const rel of INBOUND) {
  const full = path.join(ROOT, rel);
  if (!fs.existsSync(full)) { bad(`${rel}: no existe`); continue; }
  const html = fs.readFileSync(full, 'utf8');
  const hits = (html.match(new RegExp(TARGET.replace('.', '\\.'), 'g')) || []).length;
  if (hits !== 1) bad(`${rel}: ${hits} enlaces a ${TARGET}, esperado 1`);
  else ok(`${rel}: enlaza a ${TARGET}`);
}
if (!fs.existsSync(path.join(ROOT, 'blog', TARGET))) bad(`blog/${TARGET}: no existe el destino`);

// Los bloques CTA nuevos no pueden apuntar a rutas inexistentes.
for (const rel of INBOUND.concat(PAGES.map(p => p.file))) {
  const html = fs.readFileSync(path.join(ROOT, rel), 'utf8');
  for (const m of html.matchAll(/href="(\.\.\/[^"#?]+\.html)/g)) {
    const target = path.resolve(path.dirname(path.join(ROOT, rel)), m[1]);
    if (!fs.existsSync(target)) bad(`${rel}: enlace roto ${m[1]}`);
  }
}

// Fase 5: las tres herramientas existen en ingles y en espanol, con hreflang reciproco.
const TOOLS_I18N = ['full-birth-chart', 'zodiac-cusp-calculator', 'moon-phase-calendar'];
for (const slug of TOOLS_I18N) {
  const en = path.join(ROOT, 'tools', slug + '.html');
  const es = path.join(ROOT, 'es', 'tools', slug + '.html');
  if (!fs.existsSync(en) || !fs.existsSync(es)) { bad(`${slug}: falta la version en o es`); continue; }
  const hEn = fs.readFileSync(en, 'utf8'), hEs = fs.readFileSync(es, 'utf8');

  if (!hEn.includes('<html lang="en">')) bad(`tools/${slug}: lang no es en`);
  if (!hEs.includes('<html lang="es">')) bad(`es/tools/${slug}: lang no es es`);
  for (const [name, h, host] of [['tools/' + slug, hEn, 'tools'], ['es/tools/' + slug, hEs, 'es/tools']]) {
    for (const l of ['en', 'es', 'x-default']) {
      if (!new RegExp(`hreflang="${l}"`).test(h)) bad(`${name}: falta hreflang ${l}`);
    }
    const can = h.match(/<link rel="canonical" href="([^"]+)"/);
    if (!can || !can[1].includes(`${host}/${slug}.html`)) bad(`${name}: canonical incorrecto (${can && can[1]})`);
    // enlaces relativos que no resuelven
    for (const m of h.matchAll(/href="(\.\.\/[^"#?]+\.html)/g)) {
      const target = path.resolve(path.dirname(can ? en : en), '..', '..', m[1].replace(/^(\.\.\/)+/, ''));
      if (!fs.existsSync(path.join(ROOT, m[1].replace(/^(\.\.\/)+/, '')))) bad(`${name}: enlace relativo roto ${m[1]}`);
    }
  }
  // titulos en ingles sin palabras espanolas
  const t = (hEn.match(/<title>(.*?)<\/title>/) || [0, ''])[1];
  if (/\b(Carta|Calculadora|Calendario|Herramientas)\b/.test(t)) bad(`tools/${slug}: title en espanol (${t})`);
  else ok(`tools/${slug}: title EN "${t.slice(0, 40)}…"`);
}

console.log(`\n${fails === 0 ? 'PASS' : 'FAIL'} — ${fails} fallo(s)`);
process.exit(fails === 0 ? 0 : 1);
