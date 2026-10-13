// scripts/add-compare-section.mjs — añade la sección de comparativas al hub ES y sus URLs al sitemap
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const R = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://cha0smagicklabs.com';

const CMP = [
  ['mejores-apps-magia-del-caos', 'Mejores apps de magia del caos', 'Las 12, con precios reales'],
  ['astral-lab-vs-co-star', 'Astral Lab vs Co-Star', 'La alternativa sin suscripcion'],
  ['noctem-vs-apps-individuales', 'Suite completa o apps sueltas', 'Que sale mejor a la larga'],
  ['generador-sigilos-app-vs-hacerlo-a-mano', 'App de sigilos o hacerlo a mano', 'Velocidad contra ritual'],
  ['tarot-rider-waite-app-vs-mazo-fisico', 'App de tarot o mazo fisico', 'Que se gana y que se pierde'],
  ['tarot-gratis-vs-pago', 'Tarot gratis o de pago', 'Que compras realmente'],
  ['iching-app-vs-monedas-fisicas', 'App de I Ching o monedas', 'Cual es mas fiel al original'],
  ['runas-app-vs-libro-de-runas', 'App de runas o libro', 'Practica diaria contra profundidad'],
  ['apps-suenos-lucidos-comparativa', 'Apps de suenos lucidos', 'Entrenamiento nocturno paso a paso'],
  ['libros-magia-del-caos-vs-cursos-online', 'Libros o cursos online', 'Que te da cada formato'],
];

// ---------- 1) es/index.html ----------
const hubPath = path.join(R, 'es', 'index.html');
let hub = fs.readFileSync(hubPath, 'utf8');
if (hub.includes('Comparativas y analisis')) {
  console.log('hub: seccion ya presente, sin cambios');
} else {
  const anchor = hub.search(/<h2[^>]*>\s*Herramientas gratis/);
  if (anchor === -1) {
    console.log('hub FAIL: no se encontro el marcador "Herramientas gratis"');
  } else {
    const cards = CMP.map(([slug, t, s]) => `<a class="card" href="/es/${slug}.html"><b>${t}</b><span>${s}</span></a>`).join('\n');
    const section =
      '<h2>Comparativas y analisis</h2>\n' +
      '<p>Decisiones practicas con datos reales: precios, pago unico y sin suscripciones. Diez comparativas para elegir sin improvisar.</p>\n' +
      '<div class="grid">\n' + cards + '\n</div>\n';
    hub = hub.slice(0, anchor) + section + hub.slice(anchor);
    fs.writeFileSync(hubPath, hub);
    console.log('hub: seccion "Comparativas y analisis" insertada con ' + CMP.length + ' tarjetas');
  }
}

// ---------- 2) sitemap.xml ----------
const smPath = path.join(R, 'sitemap.xml');
let sm = fs.readFileSync(smPath, 'utf8');
let added = 0;
for (const [slug] of CMP) {
  const loc = `${SITE}/es/${slug}.html`;
  if (sm.includes(loc)) continue;
  const entry = `  <url><loc>${loc}</loc><changefreq>weekly</changefreq><priority>0.7</priority></url>\n`;
  sm = sm.replace('</urlset>', entry + '</urlset>');
  added++;
}
fs.writeFileSync(smPath, sm);
const total = (sm.match(/<loc>/g) || []).length;
console.log(`sitemap: ${added} URLs anadidas | total ${total}`);