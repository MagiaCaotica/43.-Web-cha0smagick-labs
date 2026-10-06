const fs = require('fs');
const DRY = process.argv.includes('--dry');
const log = [];
const problems = [];

// ---------- 1-2. Pie de la home: anadir el Catholiconomicon (faltaba) + guides + About
{
  const f = 'index.html';
  let c = fs.readFileSync(f, 'utf8');
  const before = c;

  // El pie lista 7 libros. El Catholiconomicon no estaba.
  const lastBook = '<a href="/books/mind-the-gap-pdf.html">Mind the Gap PDF</a>';
  if (c.includes(lastBook)) {
    const idx = c.indexOf(lastBook);
    const close = c.indexOf('</a>', idx) + 4;
    // el mismo formato de enlace, con el separador que ya usa la lista
    const sep = c.slice(idx, close).endsWith('</li>') ? '' : '';
    c = c.slice(0, close) + sep +
      '\n<li><a href="/books/catholiconomicon-pdf.html">Catholiconomicon PDF</a>' +
      '\n<li><a href="/books/catholiconomicon-es-pdf.html">Catholiconomicon PDF (ES)</a>' +
      c.slice(close);
    log.push('pie home: anadidos los 2 enlaces del Catholiconomicon (faltaban)');
  } else problems.push('home: no se encontro el ancla del ultimo libro del pie');

  // Guides gratuitas + About, junto a los enlaces legales del pie.
  // El pie usa CRLF y lleva la & sin escapar, de ahi el ancla literal.
  const guideAnchor = '<li><a href="privacy-policy.html">Privacy & Legal</a></li>';
  if (c.includes(guideAnchor)) {
    c = c.replace(guideAnchor, guideAnchor +
      '\r\n                            <li><a href="pages/about.html">About Cha0smagick Labs</a></li>' +
      '\r\n                            <li><a href="lead-magnet/quickstart-guide-chaos-magick-en.html">Free Quickstart Guide to Chaos Magick</a></li>' +
      '\r\n                            <li><a href="lead-magnet/guia-rapida-magia-caos-es.html">Guia Rapida de Magia del Caos (ES)</a></li>');
    log.push('pie home: anadidos About + las 2 guias gratuitas');
  } else problems.push('home: no se encontro el ancla de enlaces legales del pie');

  if (c !== before && !DRY) fs.writeFileSync(f, c, 'utf8');
}

// ---------- 3. Catalogo de apps -> bundle de apps
{
  const f = 'apps/index.html';
  let c = fs.readFileSync(f, 'utf8');
  const a = 'Catalogo de referencia: <a href="/llms.txt">llms.txt</a>.';
  if (c.includes(a)) {
    c = c.replace(a, a + '\n    <p><a href="/landing-pages/apps-bundle.html"><strong>Compra las 12 apps en un solo paquete &rarr;</strong></a></p>');
    if (!DRY) fs.writeFileSync(f, c, 'utf8');
    log.push('apps/index.html: enlazado el bundle de apps');
  } else problems.push('apps/index.html: no se encontro el ancla del pie');
}

// ---------- 4. Catalogo de libros -> Complete Access
{
  const f = 'books/index.html';
  let c = fs.readFileSync(f, 'utf8');
  const a = 'Catalogo de referencia: <a href="/llms.txt">llms.txt</a>.';
  if (c.includes(a)) {
    c = c.replace(a, a + '\n    <p><a href="/landing-pages/complete-access.html"><strong>Apps y libros juntos &rarr;</strong></a></p>');
    if (!DRY) fs.writeFileSync(f, c, 'utf8');
    log.push('books/index.html: enlazado Complete Access');
  } else problems.push('books/index.html: no se encontro el ancla del pie');
}

// ---------- 5. affiliate-dashboard dice noindex pero estaba en el sitemap
{
  const f = 'sitemap.xml';
  let c = fs.readFileSync(f, 'utf8');
  const re = /<url>\s*<loc>[^<]*landing-pages\/affiliate-dashboard\.html<\/loc>[\s\S]*?<\/url>\s*/;
  if (re.test(c)) {
    const n = (c.match(/affiliate-dashboard/g) || []).length;
    c = c.replace(re, '');
    if (!DRY) fs.writeFileSync(f, c, 'utf8');
    log.push('sitemap: fuera affiliate-dashboard (la pagina declara noindex; el sitemap se contradesia)');
  } else log.push('sitemap: affiliate-dashboard ya no estaba');
}

// ---------- 6. flash-sale: oferta temporal caducada, no debe indexarse
{
  const f = 'landing-pages/flash-sale.html';
  let c = fs.readFileSync(f, 'utf8');
  if (!/<meta\s+name="robots"/i.test(c)) {
    const t = c.match(/<meta\s+charset="[^"]*">/i);
    if (t) {
      c = c.replace(t[0], t[0] + '\n<meta name="robots" content="noindex, follow">');
      if (!DRY) fs.writeFileSync(f, c, 'utf8');
      log.push('flash-sale.html: anadido noindex (oferta de 72h caducada)');
    } else problems.push('flash-sale.html: no se encontro el charset para insertar robots');
  } else log.push('flash-sale.html: ya tenia robots');
}

// ---------- 7. Anadir al sitemap las 2 paginas de venta que si deben indexarse
{
  const f = 'sitemap.xml';
  let c = fs.readFileSync(f, 'utf8');
  const add = [];
  for (const p of ['landing-pages/apps-bundle.html', 'landing-pages/complete-access.html']) {
    if (!c.includes('cha0smagicklabs.com/' + p)) add.push(p);
  }
  if (add.length) {
    const block = add.map(p => '<url>\n    <loc>https://cha0smagicklabs.com/' + p + '</loc>\n    <lastmod>2026-10-05</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>\n').join('');
    const close = c.lastIndexOf('</urlset>');
    c = c.slice(0, close) + block + c.slice(close);
    if (!DRY) fs.writeFileSync(f, c, 'utf8');
    log.push('sitemap: anadidas ' + add.join(', '));
  } else log.push('sitemap: los 2 funnels ya estaban');
}

console.log(DRY ? '=== DRY-RUN ===' : '=== APLICADO ===');
log.forEach(l => console.log('  + ' + l));
console.log('problemas: ' + problems.length);
problems.forEach(p => console.log('  ! ' + p));