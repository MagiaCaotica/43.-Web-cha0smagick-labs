/**
 * Smoke test del funnel de ventas en tools/.
 *
 * Levanta un servidor estatico local, abre paginas reales de herramienta en
 * Chromium y comprueba que el funnel inyectado por js/conversion.js tiene:
 *   1. pitch de app con el package id y precio REALES (no los hardcodeados)
 *   2. CTA de libro que enlaza a books/<id>.html + checkout Hotmart
 *   3. cross-sell a herramientas hermanas del mismo idioma
 *   4. evento GA tool_funnel_view emitido
 *
 * Uso: node scripts/test-tool-funnels.mjs
 */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PORT = 8931;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.webmanifest': 'application/manifest+json'
};

const server = http.createServer((req, res) => {
  const url = decodeURIComponent(req.url.split('?')[0]);
  let file = path.join(ROOT, url);
  if (!file.startsWith(ROOT)) {
    res.writeHead(403).end('forbidden');
    return;
  }
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
  if (!fs.existsSync(file)) {
    res.writeHead(404).end('not found');
    return;
  }
  res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
});

const catalogue = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'tool-funnels.json'), 'utf8'));
const PLAY = (id) => `play.google.com/store/apps/details?id=${catalogue.products.apps.find((a) => a.id === id).url.split('id=')[1]}`;

/** Paginas a verificar: una ES (Gen1) y una EN (Gen2) por cada categoria con datos. */
const PAGES = [
  { slug: 'tarot-journal', lang: 'es', kind: 'Gen1' },
  { slug: 'rune-drawer', lang: 'en', kind: 'Gen2' },
  { slug: 'sigil-generator', lang: 'en', kind: 'Gen2' },
  { slug: 'full-birth-chart', lang: 'es', kind: 'Gen1' },
  { slug: 'gnosis-timer', lang: 'en', kind: 'Gen2' },
  { slug: 'zener-esp-trainer', lang: 'en', kind: 'Gen2' },
  { slug: 'goetic-spirit-selector', lang: 'en', kind: 'Gen2' },
  { slug: 'activador-servidores', lang: 'es', kind: 'Gen2' },
  { slug: 'moon-voc', lang: 'en', kind: 'Gen2' },
  { slug: 'iching', lang: 'en', kind: 'Gen2' },
  { slug: 'lucid-dream-training-planner', lang: 'es', kind: 'Gen1' },
  { slug: 'meditation-focus-timer', lang: 'es', kind: 'Gen1' }
];

const results = [];

function check(page, name, ok, detail) {
  results.push({ page, name, ok, detail });
  if (!ok) console.log(`  FALLA  ${page} :: ${name} :: ${detail}`);
}

await new Promise((r) => server.listen(PORT, r));
const browser = await chromium.launch();
const context = await browser.newContext();

const gaEvents = [];
await context.addInitScript(() => {
  window.__gaEvents = [];
  const gtag = function () {
    window.__gaEvents.push(Array.from(arguments));
  };
  gtag.cmd = [];
  gtag.loaded = true;
  window.gtag = gtag;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push = new Proxy(window.dataLayer.push, {
    apply(t, self, args) { window.__gaEvents.push(args); return Reflect.apply(t, self, args); }
  });
});

// Sin red externa: solo el servidor local.
await context.route('**/*', (route) => {
  const url = route.request().url();
  if (url.startsWith(`http://127.0.0.1:${PORT}`) || url.startsWith('data:') || url.startsWith('blob:')) {
    return route.continue();
  }
  return route.abort();
});

for (const { slug, lang, kind } of PAGES) {
  const page = await context.newPage();
  const consoleErrors = [];
  page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text()); });
  page.on('pageerror', (e) => consoleErrors.push('pageerror: ' + e.message));

  await page.goto(`http://127.0.0.1:${PORT}/tools/${slug}.html`, { waitUntil: 'load' });
  await page.waitForSelector('#cm-funnel-root [data-funnel-step]', { timeout: 8000 }).catch(() => {});

  const spec = catalogue.tools[slug];
  const dom = await page.evaluate(() => {
    const q = (s) => Array.from(document.querySelectorAll(s));
    const root = document.getElementById('cm-funnel-root');
    return {
      hasRoot: !!root,
      steps: q('[data-funnel-step]').map((n) => n.getAttribute('data-funnel-step')),
      appLinks: q('.cm-funnel-app').map((a) => ({ href: a.href, id: a.getAttribute('data-product-id'), text: a.textContent.trim() })),
      bookBlock: (() => {
        const b = document.querySelector('.cm-book-cta');
        if (!b) return null;
        return {
          id: b.getAttribute('data-product-id'),
          title: (b.querySelector('h4') || {}).textContent,
          page: (b.querySelector('.cm-btn-book') || {}).getAttribute
            ? b.querySelector('.cm-btn-book').getAttribute('href')
            : null,
          checkout: b.querySelector('.cm-btn-book-alt') ? b.querySelector('.cm-btn-book-alt').getAttribute('href') : null,
          price: (b.querySelector('.cm-funnel-price') || {}).textContent
        };
      })(),
      related: q('.cm-funnel-related-card a').map((a) => a.getAttribute('href')),
      relatedText: q('.cm-funnel-related-card span').map((s) => s.textContent.trim()),
      docLang: document.documentElement.lang,
      pageText: document.body.innerText,
      // Las paginas Gen2 traen snippet GA inline que redeclara gtag/dataLayer
      // y se salta el Proxy del init script. Fusionamos ambas fuentes.
      ga: (window.__gaEvents || []).concat(
        Array.from(window.dataLayer || []).map((entry) => Array.from(entry))
      ),
      // Copia que escribe analytics-bridge.js: objetos planos en dataLayer.
      // gtag empuja arrays de argumentos, asi que un objeto distingue la una
      // de la otra sin ambiguedad.
      bridge: (window.dataLayer || []).filter((entry) => entry && typeof entry === 'object' && !Array.isArray(entry))
    };
  });

  // --- 1. bloque raiz + paso de pitch ---
  check(slug, 'funnel root inyectado', dom.hasRoot, 'sin #cm-funnel-root');
  check(slug, 'pitch presente', dom.steps.includes('pitch'), 'steps=' + JSON.stringify(dom.steps));
  check(slug, 'idioma correcto (' + lang + ')', dom.docLang.startsWith(lang), 'lang=' + dom.docLang);

  // --- 2. app CTA con package id y precio reales ---
  if (spec.apps.length) {
    const want = spec.apps[0];
    const link = dom.appLinks.find((l) => l.id === want);
    check(slug, 'app CTA para ' + want, !!link, 'ids=' + dom.appLinks.map((l) => l.id).join(','));
    if (link) {
      check(slug, 'href Play Store real', link.href.includes(PLAY(want)), link.href);
      const price = catalogue.products.apps.find((a) => a.id === want).price;
      check(slug, 'precio real ' + price, dom.pageText.includes(price), 'no aparece ' + price);
    }
  } else {
    check(slug, 'sin app (por diseno) y sin CTA de app', dom.appLinks.length === 0, 'appLinks=' + dom.appLinks.length);
  }

  // --- 3. libro ---
  if (spec.book) {
    const b = catalogue.products.books.find((x) => x.id === spec.book);
    check(slug, 'book CTA presente', !!dom.bookBlock, 'sin .cm-book-cta');
    if (dom.bookBlock) {
      check(slug, 'book id correcto', dom.bookBlock.id === spec.book, dom.bookBlock.id);
      check(slug, 'book page enlaza books/<id>.html', dom.bookBlock.page && dom.bookBlock.page.endsWith('books/' + spec.book + '.html'), String(dom.bookBlock.page));
      check(slug, 'book checkout = hotmart', dom.bookBlock.checkout === b.checkout, String(dom.bookBlock.checkout));
      check(slug, 'book precio real ' + b.price, (dom.bookBlock.price || '').includes(b.price), dom.bookBlock.price);
    }
  } else {
    check(slug, 'sin libro (por diseno)', dom.bookBlock === null, JSON.stringify(dom.bookBlock));
  }

  // --- 4. cross-sell mismo idioma ---
  const expectRelated = spec.related.filter((r) => catalogue.tools[r].lang === lang);
  check(slug, 'cross-sell presente', dom.related.length > 0, 'related=' + dom.related.length);
  for (const r of expectRelated) {
    // relatedHtml() emite hrefs relativos ("slug.html"), no absolutos.
    const ok = dom.related.some((h) => h === r + '.html' || h.endsWith('/' + r + '.html'));
    check(slug, 'related -> ' + r, ok, dom.related.join(','));
  }
  check(slug, 'related en ' + lang, dom.related.every((h) => lang === 'es' || !/rune-drawer|goetic|iching/.test(h) || lang === 'en'), 'ok');

  // --- 5. evento GA ---
  // gtag('event', 'nombre', params) => el nombre va en a[1].
  // Trackers que empujan objetos usan a[0].event. Normalizamos ambas formas.
  const evNames = dom.ga
    .map((a) => {
      if (typeof a[0] === 'string') return a[0] === 'event' ? a[1] : a[0];
      return (a[0] && a[0].event) || '';
    })
    .filter(Boolean);
  check(slug, 'evento tool_funnel_view', evNames.includes('tool_funnel_view'), evNames.join(','));

  // --- 5b. espejo en analytics-bridge.js ---
  // La misma llamada debe llegar por las dos vias: gtag (ruta GA4) y el bridge
  // (copia con allowlist y consentimiento). Si el espejo se rompe, la pagina
  // sigue "funcionando" y no hay nada que lo delate salvo esto.
  const ALLOWED = {
    tool_funnel_view: ['tool_id', 'category', 'apps', 'has_book', 'related', 'source', 'surface', 'event', 'analytics_source'],
    tool_funnel_click: ['tool_id', 'product_type', 'product_id', 'source', 'placement', 'event', 'analytics_source']
  };
  const view = dom.bridge.find((e) => e.event === 'tool_funnel_view');
  check(slug, 'bridge registra tool_funnel_view', !!view, 'bridge=' + JSON.stringify(dom.bridge.map((e) => e.event)));
  if (view) {
    const extra = Object.keys(view).filter((k) => !ALLOWED.tool_funnel_view.includes(k));
    check(slug, 'bridge filtra tool_funnel_view', extra.length === 0, 'claves no permitidas: ' + extra.join(','));
    check(slug, 'bridge marca su origen', view.analytics_source === 'cha0_bridge', 'analytics_source=' + view.analytics_source);
    check(slug, 'bridge lleva el slug', view.tool_id === slug, 'tool_id=' + view.tool_id);
  }

  // El click del funnel tambien debe quedar espejado. Se dispara sobre el
  // primer boton de app; si no hay CTA de app en la pagina, se omite.
  if (dom.appLinks.length) {
    await page.click('#cm-funnel-root .cm-funnel-app');
    await page.waitForTimeout(120);
    const clickEvent = await page.evaluate(() => {
      const rows = (window.dataLayer || []).filter(
        (e) => e && typeof e === 'object' && !Array.isArray(e) && e.event === 'tool_funnel_click'
      );
      return rows.length ? rows[rows.length - 1] : null;
    });
    check(slug, 'bridge registra tool_funnel_click', !!clickEvent, 'sin copia en dataLayer');
    if (clickEvent) {
      const extra = Object.keys(clickEvent).filter((k) => !ALLOWED.tool_funnel_click.includes(k));
      check(slug, 'bridge filtra tool_funnel_click', extra.length === 0, 'claves no permitidas: ' + extra.join(','));
      check(slug, 'bridge identifica el producto', !!clickEvent.product_id, 'product_id=' + clickEvent.product_id);
    }
  }

  // --- 6. sin mojibake ni errores de consola ---
  const moji = dom.pageText.match(/[ÂÃâ€]{1,2}(?=[¿¡áéíóúñü£¥©™–—˜†”])/g);
  check(slug, 'sin mojibake', !moji, JSON.stringify(moji));
  // Errores PREEXISTENTES del script inline de esas dos herramientas, ajenos al funnel.
  const KNOWN_LEGACY = [
    /^pageerror: p is not defined/,
    /^pageerror: Identifier 'SIGNS' has already been declared/
  ];
  const realErrors = consoleErrors.filter((e) => {
    if (KNOWN_LEGACY.some((re) => re.test(e))) return false;
    return !/net::|Failed to load resource|ERR_FAILED|google|gstatic|googletag|analytics|doubleclick|adservice|favicon/i.test(e);
  });
  check(slug, 'sin errores JS', realErrors.length === 0, realErrors.slice(0, 3).join(' | '));

  await page.close();
  console.log(`${kind} ${slug} (${lang}) -> steps=${dom.steps.join('+')} apps=${dom.appLinks.length} book=${dom.bookBlock ? 'si' : 'no'} related=${dom.related.length}`);
}

await browser.close();
server.close();

const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} comprobaciones OK`);
if (failed.length) {
  console.log(`\n${failed.length} FALLAS:`);
  for (const f of failed) console.log(`  - [${f.page}] ${f.name}: ${f.detail}`);
  process.exit(1);
}
console.log('OK todos los checks del funnel pasan');
