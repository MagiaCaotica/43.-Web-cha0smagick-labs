/**
 * audit-jsonld.mjs — Detecta problemas comunes en Product/Offer y FAQPage
 * que explican los 7 merchant listings inválidos y 2 FAQ snippets inválidos de GSC.
 * Dry-run por defecto. --apply solo imprime el plan de corrección (no reescribe JSON-LD
 * automáticamente porque cada caso requiere decisión editorial).
 */
import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const EXCLUDE = ['node_modules', '.git', 'out', 'projects/pinterest-pins/output', 'projects/pinterest-pins/output-darkfantasy'];

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (EXCLUDE.every(e => !full.includes(e))) walk(full, files);
    } else if (entry.name.endsWith('.html')) {
      if (EXCLUDE.every(e => !full.includes(e))) files.push(full);
    }
  }
  return files;
}

function extractJsonLd(html) {
  const blocks = [];
  const re = /<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi;
  let m;
  while ((m = re.exec(html))) blocks.push(m[1]);
  return blocks;
}

function parseSafe(str) {
  try { return JSON.parse(str); } catch (e) { return { __parse_error: e.message }; }
}

function findByType(obj, type, out = []) {
  if (!obj || typeof obj !== 'object') return out;
  if (Array.isArray(obj)) { obj.forEach(o => findByType(o, type, out)); return out; }
  if (obj['@type'] === type || (Array.isArray(obj['@type']) && obj['@type'].includes(type))) out.push(obj);
  for (const k of Object.keys(obj)) {
    if (k === '@context' || k === '@type') continue;
    findByType(obj[k], type, out);
  }
  return out;
}

function validateOffer(offer, file) {
  const problems = [];
  if (!offer.price) problems.push('missing price');
  if (!offer.priceCurrency) problems.push('missing priceCurrency');
  if (!offer.availability) problems.push('missing availability');
  if (!offer.url) problems.push('missing url');
  return problems;
}

function validateProduct(product, file) {
  const problems = [];
  if (!product.name) problems.push('missing name');
  const offers = product.offers || [];
  const offerList = Array.isArray(offers) ? offers : [offers];
  if (offerList.length === 0) problems.push('missing offers');
  offerList.forEach(o => {
    if (typeof o !== 'object') return;
    if (o['@type'] === 'AggregateOffer') {
      if (!o.lowPrice && !o.price) problems.push('missing lowPrice');
      if (!o.highPrice && !o.price) problems.push('missing highPrice');
      if (!o.priceCurrency) problems.push('missing priceCurrency');
      return;
    }
    problems.push(...validateOffer(o, file));
  });
  return problems;
}

function validateFAQPage(faq, file) {
  const problems = [];
  const entities = faq.mainEntity || [];
  const list = Array.isArray(entities) ? entities : [entities];
  if (list.length === 0) problems.push('empty mainEntity');
  list.forEach(q => {
    if (!q || typeof q !== 'object') { problems.push('non-object question'); return; }
    if (!q.name) problems.push('question without name');
    const a = q.acceptedAnswer || {};
    if (!a || typeof a !== 'object') problems.push('question without acceptedAnswer');
    else if (!a.text) problems.push('acceptedAnswer without text');
  });
  return problems;
}

function main() {
  const apply = process.argv.includes('--apply');
  const files = walk(ROOT);
  const report = [];

  for (const file of files) {
    const html = fs.readFileSync(file, 'utf8');
    const blocks = extractJsonLd(html);
    if (blocks.length === 0) continue;

    let fileProblems = 0;

    for (const raw of blocks) {
      const j = parseSafe(raw);
      if (j.__parse_error) {
        report.push({ file, type: 'PARSE_ERROR', detail: j.__parse_error });
        fileProblems++;
        continue;
      }

      const products = findByType(j, 'Product');
      products.forEach(p => {
        const probs = validateProduct(p, file);
        if (probs.length) {
          report.push({ file, type: 'Product', name: p.name, problems: probs });
          fileProblems += probs.length;
        }
      });

      const offers = findByType(j, 'Offer');
      offers.forEach(o => {
        if (!o.itemOffered && !o.url) {
          // Standalone Offer not linked to a product
          const probs = validateOffer(o, file);
          if (probs.length) {
            report.push({ file, type: 'Offer', name: o.name || '(standalone)', problems: probs });
            fileProblems += probs.length;
          }
        }
      });

      const aggOffers = findByType(j, 'AggregateOffer');
      aggOffers.forEach(ao => {
        /* Un AggregateOffer no tiene `price`: su contrato es lowPrice/highPrice.
           Validarlo con validateOffer lo marcaba siempre como roto. */
        const probs = [];
        if (!ao.lowPrice && !ao.price) probs.push('missing lowPrice');
        if (!ao.highPrice && !ao.price) probs.push('missing highPrice');
        if (!ao.priceCurrency) probs.push('missing priceCurrency');
        if (probs.length) {
          report.push({ file, type: 'AggregateOffer', name: ao.name, problems: probs });
          fileProblems += probs.length;
        }
      });

      const faqs = findByType(j, 'FAQPage');
      faqs.forEach(f => {
        const probs = validateFAQPage(f, file);
        if (probs.length) {
          report.push({ file, type: 'FAQPage', problems: probs });
          fileProblems += probs.length;
        }
      });

      const softwareApps = findByType(j, 'SoftwareApplication');
      softwareApps.forEach(sa => {
        const probs = validateProduct(sa, file);
        if (probs.length) {
          report.push({ file, type: 'SoftwareApplication', name: sa.name, problems: probs });
          fileProblems += probs.length;
        }
      });

      const books = findByType(j, 'Book');
      books.forEach(b => {
        const probs = validateProduct(b, file);
        if (probs.length) {
          report.push({ file, type: 'Book', name: b.name, problems: probs });
          fileProblems += probs.length;
        }
      });
    }

    if (fileProblems > 0) {
      report.push({ file, type: 'FILE_SUMMARY', problems: fileProblems });
    }
  }

  // Agrupar por tipo
  const byType = {};
  report.forEach(r => {
    if (r.type === 'FILE_SUMMARY') return;
    byType[r.type] = byType[r.type] || [];
    byType[r.type].push(r);
  });

  console.log(`Archivos escaneados: ${files.length}`);
  console.log(`Archivos con problemas: ${report.filter(r => r.type === 'FILE_SUMMARY').length}`);
  console.log(`---`);
  console.log(`Product con problemas: ${byType.Product ? byType.Product.length : 0}`);
  console.log(`SoftwareApplication con problemas: ${byType.SoftwareApplication ? byType.SoftwareApplication.length : 0}`);
  console.log(`Book con problemas: ${byType.Book ? byType.Book.length : 0}`);
  console.log(`Offer (standalone) con problemas: ${byType.Offer ? byType.Offer.length : 0}`);
  console.log(`AggregateOffer con problemas: ${byType.AggregateOffer ? byType.AggregateOffer.length : 0}`);
  console.log(`FAQPage con problemas: ${byType.FAQPage ? byType.FAQPage.length : 0}`);
  console.log(`Parse errors: ${report.filter(r => r.type === 'PARSE_ERROR').length}`);
  console.log(`---`);

  if (byType.Product) {
    console.log('PRODUCT:');
    byType.Product.forEach(r => console.log(`  ${path.relative(ROOT, r.file)} | ${r.name} | ${r.problems.join(', ')}`));
  }
  if (byType.SoftwareApplication) {
    console.log('SOFTWAREAPPLICATION:');
    byType.SoftwareApplication.forEach(r => console.log(`  ${path.relative(ROOT, r.file)} | ${r.name} | ${r.problems.join(', ')}`));
  }
  if (byType.Book) {
    console.log('BOOK:');
    byType.Book.forEach(r => console.log(`  ${path.relative(ROOT, r.file)} | ${r.name} | ${r.problems.join(', ')}`));
  }
  if (byType.AggregateOffer) {
    console.log('AGGREGATEOFFER:');
    byType.AggregateOffer.forEach(r => console.log(`  ${path.relative(ROOT, r.file)} | ${r.name} | ${r.problems.join(', ')}`));
  }
  if (byType.FAQPage) {
    console.log('FAQPAGE:');
    byType.FAQPage.forEach(r => console.log(`  ${path.relative(ROOT, r.file)} | ${r.problems.join(', ')}`));
  }
  if (report.filter(r => r.type === 'PARSE_ERROR').length) {
    console.log('PARSE ERRORS:');
    report.filter(r => r.type === 'PARSE_ERROR').forEach(r => console.log(`  ${path.relative(ROOT, r.file)} | ${r.detail}`));
  }

  console.log(`\nModo: ${apply ? 'PLAN (no se reescribe JSON-LD automáticamente)' : 'DRY-RUN'}`);
}

main();
