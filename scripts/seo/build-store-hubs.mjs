#!/usr/bin/env node
// Generates the two missing store category hubs: apps/index.html and books/index.html.
//
// WHY A GENERATOR AND NOT TWO HAND-WRITTEN PAGES
// The repo already has one precedent for hand-editing generated content going
// wrong: projects/data/yt-articles/catalog.json carried a stale Lucid Dream
// price that a downstream script fanned out into 108 blog CTAs, and
// projects/data/linkgraph/cta.py's docstring rationalised publishing a price
// the app itself never charged. Prices here come from offers.json at build time
// so that class of bug is impossible.
//
// HOST TRUTH: GitHub Pages serves /apps/ and /books/ from index.html. Without
// them both directories return 404 while /blog/ and /tools/ resolve, so the two
// stores had no category landing page at all -- and the 20 GEO queries include
// several store-level questions ("what does Cha0smagick Labs sell", "app
// catalog package ID", "books bundle Hotmart") that need a hub to answer.
//
// IDEMPOTENT: output is derived entirely from offers.json, so re-running
// overwrites with identical bytes.
//
// Usage: node scripts/seo/build-store-hubs.mjs [--write] [--check]
//   (default is dry-run; --check verifies the files on disk are up to date)

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const SITE = 'https://cha0smagicklabs.com';
const WRITE = process.argv.includes('--write');
const CHECK = process.argv.includes('--check');

const OFFERS = JSON.parse(readFileSync(join(ROOT, 'scripts/bots/data/offers.json'), 'utf8'));

// ---------------------------------------------------------------------------
// helpers
// ---------------------------------------------------------------------------

const esc = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

// Clips to a word boundary at or below `max`, never leaving dangling
// punctuation. Appends an ellipsis only when text was actually lost.
function clipWords(s, max) {
  if (s.length <= max) return s;
  let cut = s.slice(0, max);
  const sp = cut.lastIndexOf(' ');
  if (sp > max * 0.6) cut = cut.slice(0, sp);
  cut = cut.replace(/[\s,;:.!?-]+$/, '');
  return cut + '…';
}

// Local path for an entity. Book filenames do NOT follow the offer id, so the
// path is extracted from the offer's own URL rather than guessed from the id
// (see docs: magical-servitors-manual -> manual-activacion-servidores-magicos-pdf.html).
function localPath(url) {
  const m = String(url || '').match(/\/(books|apps)\/([a-z0-9-]+\.html)/i);
  return m ? `${m[1]}/${m[2]}` : null;
}

function breadcrumbLd(trail) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((t, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: t.name,
      item: t.href,
    })),
  };
}

function page({ file, title, description, trail, ldExtra, body }) {
  const canonical = `${SITE}/${file.replace(/index\.html$/, '')}`;
  const visibleCrumbs = trail
    .map((t, i) =>
      i === trail.length - 1
        ? `<li aria-current="page">${esc(t.name)}</li>`
        : `<li><a href="${t.href}">${esc(t.name)}</a></li>`
    )
    .join('');

  const ld = [breadcrumbLd(trail), ...ldExtra];

  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${canonical}">
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${canonical}">
<meta name="twitter:card" content="summary_large_image">
${ld
  .map(
    (b) =>
      `<script type="application/ld+json">\n${JSON.stringify(b, null, 2)}\n</script>`
  )
  .join('\n')}
<style>
:root{--navy:#0B1026;--bg:#131A3A;--amber:#FFB03A;--cyan:#35C4D9;--text:#F5F7FF;--muted:#8A93B8;--ok:#4ADE80}
*{box-sizing:border-box}
body{margin:0;background:var(--navy);color:var(--text);font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;line-height:1.6}
.wrap{max-width:1080px;margin:0 auto;padding:0 24px}
nav.breadcrumb{background:var(--bg);padding:14px 0;font-size:14px}
nav.breadcrumb ol{list-style:none;display:flex;flex-wrap:wrap;gap:8px;margin:0;padding:0}
nav.breadcrumb li+li::before{content:'/';color:var(--muted);margin-right:8px}
nav.breadcrumb a{color:var(--cyan);text-decoration:none}
nav.breadcrumb a:hover{text-decoration:underline}
header.hero{padding:56px 0 32px;border-bottom:1px solid rgba(255,255,255,.08)}
.kicker{color:var(--cyan);text-transform:uppercase;letter-spacing:6px;font-size:13px;margin:0 0 12px}
h1{font-size:44px;line-height:1.15;margin:0 0 16px;font-weight:800}
.bar{width:220px;height:6px;background:var(--amber);margin:0 0 24px}
.lede{font-size:19px;color:var(--muted);max-width:62ch;margin:0 0 8px}
section{padding:40px 0}
h2{font-size:28px;margin:0 0 20px;font-weight:800}
.grid{display:grid;gap:16px;grid-template-columns:repeat(auto-fill,minmax(280px,1fr))}
.card{background:var(--bg);border:1px solid rgba(255,255,255,.08);border-radius:12px;padding:20px;display:flex;flex-direction:column}
.card h3{font-size:19px;margin:0 0 8px}
.card p{margin:0 0 16px;color:var(--muted);font-size:15px;flex:1}
.card .meta{display:flex;justify-content:space-between;align-items:center;gap:12px;font-size:15px}
.price{color:var(--amber);font-weight:700;font-size:20px}
.card a.cta{color:var(--cyan);text-decoration:none;font-weight:600}
.card a.cta:hover{text-decoration:underline}
.tag{display:inline-block;font-size:12px;color:var(--muted);border:1px solid rgba(255,255,255,.14);border-radius:999px;padding:2px 9px;margin:0 5px 5px 0}
.note{background:rgba(255,176,58,.08);border-left:4px solid var(--amber);padding:16px 18px;border-radius:0 8px 8px 0;font-size:15px;color:var(--text)}
.note strong{color:var(--amber)}
.faq-item{border-bottom:1px solid rgba(255,255,255,.08)}
.faq-item h3{font-size:18px;margin:0}
.faq-item p{margin:8px 0 20px;color:var(--muted)}
footer{border-top:1px solid rgba(255,255,255,.08);padding:32px 0;color:var(--muted);font-size:14px}
footer a{color:var(--cyan)}
</style>
</head>
<body>
<nav class="breadcrumb" aria-label="Migas de pan">
  <div class="wrap"><ol>${visibleCrumbs}</ol></div>
</nav>
${body}
<footer>
  <div class="wrap">
    <p>Precios y disponibilidad verificados en las paginas oficiales de cada producto.
    Catalogo de referencia: <a href="/llms.txt">llms.txt</a>.</p>
  </div>
</footer>
</body>
</html>
`;
}

// ---------------------------------------------------------------------------
// APPS HUB
// ---------------------------------------------------------------------------

function appsPage() {
  const apps = OFFERS.apps;
  const prices = apps.map((a) => a.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const perTier = {};
  for (const a of apps) (perTier[a.price] ||= []).push(a.name);

  const cards = apps
    .map((a) => {
      const p = localPath(a.funnel) || localPath(a.url);
      return `      <article class="card">
        <h3>${esc(a.name)}</h3>
        <p>${esc(a.shortDesc || '')}</p>
        <p>${(a.tags || []).map((t) => `<span class="tag">${esc(t)}</span>`).join('')}</p>
        <div class="meta">
          <span class="price">${esc(a.price)}</span>
          ${p ? `<a class="cta" href="/${p}">Ver la app →</a>` : ''}
        </div>
      </article>`;
    })
    .join('\n');

  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Cha0smagick Labs — catálogo de apps para Android',
    numberOfItems: apps.length,
    itemListElement: apps.map((a, i) => {
      const p = localPath(a.funnel) || localPath(a.url);
      return {
        '@type': 'ListItem',
        position: i + 1,
        item: {
          '@type': 'SoftwareApplication',
          name: a.name,
          applicationCategory: a.category || 'UtilitiesApplication',
          operatingSystem: 'Android',
          offers: {
            '@type': 'Offer',
            price: String(a.price).replace(/[^0-9.]/g, ''),
            priceCurrency: 'USD',
          },
          ...(p ? { url: `${SITE}/${p}` } : {}),
        },
      };
    }),
  };

  const q1 = '¿Cuantas apps hay y cuanto cuestan?';
  const a1 = `El catalogo tiene ${apps.length} apps para Android, con precios entre ${min} y ${max}. Cada app se paga una sola vez: no hay suscripciones ni consumo de tiempo.`;

  const q2 = '¿Como se compran?';
  const a2 =
    'Cada app se compra y descarga desde su propia ficha en Google Play, la unica via de pago real de este catalogo. No existe un bundle de apps: una coleccion de Google Play no es un checkout, asi que no hay ningun paquete conjunto que comprar.';

  const q3 = '¿Funcionan sin conexion?';
  const a3 =
    'Las apps de este catalogo estan disenadas para funcionar sin conexion y sin rastreo. Puedes revisar la ficha de cada app para ver que datos declara y que permisos pide.';

  const q4 = '¿Hay suscripciones?';
  const a4 =
    'No. Ninguna app de este catalogo usa suscripcion, publicidad ni compras dentro de la app. El importe que se ve en cada ficha es el pago unico de la aplicacion.';

  const faq = [
    { q: q1, a: a1 },
    { q: q2, a: a2 },
    { q: q3, a: a3 },
    { q: q4, a: a4 },
  ];

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  const body = `<header class="hero">
  <div class="wrap">
    <p class="kicker">Apps para Android</p>
    <h1>${apps.length} apps ocultas, pago unico, sin suscripciones</h1>
    <div class="bar"></div>
    <p class="lede">Este es el catalogo completo de las aplicaciones de Cha0smagick Labs para
    Android: ${apps.length} apps con precios entre ${min} y ${max}, todas de pago unico y
    sin rastreo. Cada una se compra desde su ficha en Google Play.</p>
  </div>
</header>

<main class="wrap">
<section aria-labelledby="catalogo">
  <h2 id="catalogo">Catalogo completo</h2>
  <div class="grid">
${cards}
  </div>
</section>

<section aria-labelledby="precios">
  <h2 id="precios">Como se distribuyen los precios</h2>
  <p>La mayor parte del catalogo se concentra en un mismo tramo de precio:</p>
  <ul>
${Object.entries(perTier)
  .sort((a, b) => a[0].localeCompare(b[0]))
  .map(
    ([p, names]) =>
      `    <li><strong>${esc(p)}</strong> — ${names.length === 1 ? esc(names[0]) : `${names.length} apps`}</li>`
  )
  .join('\n')}
  </ul>
  <div class="note">
    <p><strong>No existe un bundle de apps.</strong> Una coleccion de Google Play no es un
    checkout, asi que no hay ningun paquete conjunto, descuento ni "acceso completo" que se
    pueda comprar aqui. Cada app se paga por separado en su propia ficha.</p>
  </div>
</section>

<section aria-labelledby="faq">
  <h2 id="faq">Preguntas frecuentes</h2>
${faq
  .map(
    (f) => `  <div class="faq-item">
    <h3>${esc(f.q)}</h3>
    <p>${esc(f.a)}</p>
  </div>`
  )
  .join('\n')}
</section>
</main>`;

  return page({
    file: 'apps/index.html',
    title: `${apps.length} apps ocultas para Android — Catalogo`,
    description: clipWords(
      `Catalogo completo de las ${apps.length} apps de Cha0smagick Labs para Android, de ${min} a ${max}. Pago unico, sin suscripciones, sin rastreo.`,
      160
    ),
    trail: [
      { name: 'Inicio', href: '/' },
      { name: 'Apps Android', href: '/apps/' },
    ],
    ldExtra: [itemList, faqLd],
    body,
  });
}

// ---------------------------------------------------------------------------
// BOOKS HUB
// ---------------------------------------------------------------------------

function booksPage() {
  const books = OFFERS.books;
  const bundle = OFFERS.bundle;
  const prices = books.map((b) => b.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);

  const cards = books
    .map((b) => {
      const p = localPath(b.funnel) || localPath(b.url);
      return `      <article class="card">
        <h3>${esc(b.name)}</h3>
        <p>${esc(b.subtitle || b.shortDesc || '')}</p>
        <p>${(b.tags || []).map((t) => `<span class="tag">${esc(t)}</span>`).join('')}</p>
        <div class="meta">
          <span class="price">${esc(b.price)}</span>
          ${p ? `<a class="cta" href="/${p}">Ver el libro →</a>` : ''}
        </div>
      </article>`;
    })
    .join('\n');

  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Cha0smagick Labs — libros PDF',
    numberOfItems: books.length,
    itemListElement: books.map((b, i) => {
      const p = localPath(b.funnel) || localPath(b.url);
      return {
        '@type': 'ListItem',
        position: i + 1,
        item: {
          '@type': 'Book',
          name: b.name,
          bookFormat: 'https://schema.org/EBook',
          ...(b.subtitle ? { alternativeHeadline: b.subtitle } : {}),
          offers: {
            '@type': 'Offer',
            price: String(b.price).replace(/[^0-9.]/g, ''),
            priceCurrency: 'USD',
          },
          ...(p ? { url: `${SITE}/${p}` } : {}),
        },
      };
    }),
  };

  const q1 = '¿Cuantos libros hay y cuanto cuestan?';
  const a1 = `Son ${books.length} libros en PDF, con precios entre ${min} y ${max}. Cada uno se compra por separado en su propia pagina.`;

  const q2 = '¿Existe un bundle de libros?';
  const a2 = `Si. El bundle de los ${books.length} libros cuesta ${bundle.price} en lugar de ${bundle.originalPrice} (${bundle.discountLabel}). Es el unico paquete conjunto que se puede comprar, y es solo de libros, no incluye apps.`;

  const q3 = '¿Los libros son apps?';
  const a3 =
    'No. Los libros son PDFs y las apps son aplicaciones para Android. Son productos separados, con precios separados, y cada uno se compra por su propia via.';

  const q4 = '¿Que formato tienen?';
  const a4 =
    'Todos los libros se distribuyen en PDF, pensados para leer en pantalla y en dispositivos electronicos.';

  const faq = [
    { q: q1, a: a1 },
    { q: q2, a: a2 },
    { q: q3, a: a3 },
    { q: q4, a: a4 },
  ];

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  const body = `<header class="hero">
  <div class="wrap">
    <p class="kicker">Libros PDF</p>
    <h1>${books.length} libros de caos, magia y ocultismo en PDF</h1>
    <div class="bar"></div>
    <p class="lede">Biblioteca completa de Cha0smagick Labs: ${books.length} libros en PDF con
    precios entre ${min} y ${max}, mas un bundle de los ${books.length} por ${bundle.price}
    (${bundle.discountLabel} sobre ${bundle.originalPrice}).</p>
  </div>
</header>

<main class="wrap">
<section aria-labelledby="catalogo">
  <h2 id="catalogo">Los ${books.length} libros</h2>
  <div class="grid">
${cards}
  </div>
</section>

<section aria-labelledby="bundle">
  <h2 id="bundle">Bundle de los ${books.length} libros</h2>
  <article class="card">
    <h3>${esc(bundle.name)}</h3>
    <p>Los ${books.length} libros en un solo paquete. Suma de precios individuales:
    ${esc(bundle.originalPrice)}. Precio del bundle: ${esc(bundle.price)}
    (${esc(bundle.discountLabel)}).</p>
    <p><a class="cta" href="${bundle.funnel || '/landing-pages/books-bundle.html'}">Ver el bundle →</a></p>
  </article>
</section>

<section aria-labelledby="formatos">
  <h2 id="formatos">Formatos, acceso y como se compra</h2>
  <p>Los ${books.length} libros se distribuyen como PDF y se compran de forma individual
  desde la pagina de cada titulo. No hay susccriptions ni acceso temporal: lo que compras
  es el archivo, y es tuyo desde el momento de la compra.</p>
  <p>El bundle es la unica compra conjunta disponible y esta formado
  <strong>exclusivamente por libros</strong>. No incluye ninguna app, porque las apps se
  venden una por una en Google Play y no existe ningun checkout que agrupe las dos cosas.
  Si ya tienes algunas apps, el bundle te resulta igual de util: cubre la parte de teoria
  y practice escrita, que es distinta de la parte de herramientas.</p>
  <p>Todos los titulos estan escritos en espanol y siguen la linea del sitio: caos
  magick, gematria clasica, ocultismo documentado y trabalho ritual con estructura
  explicita, sin prometer resultados que no se puedan sostener.</p>
  <div class="note">
    <p><strong>Sobre los precios de esta pagina.</strong> Cada importe corresponde al precio
    de la ficha oficial del producto. Los stock, la disponibilidad regional y el precio
    final los confirma la propia plataforma de checkout en el momento de la compra, y son
    la unica fuente valida para lo que vas a pagar.</p>
  </div>
</section>

<section aria-labelledby="faq">
  <h2 id="faq">Preguntas frecuentes</h2>
${faq
  .map(
    (f) => `  <div class="faq-item">
    <h3>${esc(f.q)}</h3>
    <p>${esc(f.a)}</p>
  </div>`
  )
  .join('\n')}
</section>
</main>`;

  return page({
    file: 'books/index.html',
    title: `${books.length} libros de ocultismo en PDF — Catalogo`,
    description: clipWords(
      `Los ${books.length} libros PDF de Cha0smagick Labs, de ${min} a ${max}, y el bundle de los ${books.length} por ${bundle.price}. Sin suscripciones.`,
      160
    ),
    trail: [
      { name: 'Inicio', href: '/' },
      { name: 'Libros PDF', href: '/books/' },
    ],
    ldExtra: [itemList, faqLd],
    body,
  });
}

// ---------------------------------------------------------------------------
// run
// ---------------------------------------------------------------------------

const targets = [
  { file: join(ROOT, 'apps/index.html'), render: appsPage },
  { file: join(ROOT, 'books/index.html'), render: booksPage },
];

let stale = 0;
for (const t of targets) {
  const want = t.render();
  const exists = existsSync(t.file);
  const have = exists ? readFileSync(t.file, 'utf8') : '';
  const same = have === want;
  const words = (s) =>
    s
      .replace(/<(script|style)[\s\S]*?<\/\1>/gi, ' ')
      .replace(/<!--[\s\S]*?-->/g, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&[a-z]+;|&#\d+;/gi, ' ')
      .split(/\s+/)
      .filter(Boolean).length;

  if (same) {
    console.log(`OK    ${t.file.replace(ROOT + '\\', '')} — identical (${words(want)} words)`);
    continue;
  }
  stale++;
  if (CHECK) {
    console.log(`STALE ${t.file.replace(ROOT + '\\', '')} — on disk differs from offers.json`);
    continue;
  }
  if (WRITE) {
    mkdirSync(dirname(t.file), { recursive: true });
    writeFileSync(t.file, want, 'utf8');
    console.log(
      `WRITE ${t.file.replace(ROOT + '\\', '')} — ${words(want)} words, ${want.length} bytes`
    );
  } else {
    console.log(
      `WOULD WRITE ${t.file.replace(ROOT + '\\', '')} — ${words(want)} words, ${want.length} bytes`
    );
  }
}

if (stale && CHECK) process.exit(1);
if (!WRITE && !CHECK) console.log('\n(dry run — pass --write to apply)');
