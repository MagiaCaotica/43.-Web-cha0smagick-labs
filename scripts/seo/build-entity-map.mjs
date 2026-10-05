#!/usr/bin/env node
// Builds the GEO entity map required by docs/geo-surface-decision.md.
//
// Emits:
//   data/entity-map.json           machine-readable, versioned
//   docs/entity-map.md             human-reviewable table
//
// Design rules (from the decision doc):
//  - scripts/bots/data/offers.json + docs/canonical-asset-inventory.md are the
//    local catalog/state sources. Nothing here invents an entity.
//  - Every row carries entity_id, entity_type, name, canonical_url, source_url,
//    owner, state, last_reviewed, known_limitations.
//  - `state` is one of published | draft | unverified_external | retired.
//  - External qualifiers (external_listing_unverified,
//    external_url_observed_sale_unverified, checkout_url_observed_in_page_sale_unverified,
//    legal_owner_pending, rejected_offer_page_still_live) live in `external_state`
//    so the state enum stays closed.
//  - An entity's state is NEVER upgraded because an .aab / URL / HTML page exists.
//
// Usage: node scripts/seo/build-entity-map.mjs [--check]
//   --check  verify coherence with sitemap.xml / canonicals; non-zero exit on drift.

import fs from 'node:fs';
import path from 'node:path';

const SITE = 'https://cha0smagicklabs.com';
const OFFERS = 'scripts/bots/data/offers.json';
const CHECK = process.argv.includes('--check');

const offers = JSON.parse(fs.readFileSync(OFFERS, 'utf8'));
const REVIEWED = offers._meta.reconciledAt;
const ROOT = path.resolve('.').replace(/\\/g, '/');

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function canonicalOf(rel) {
  const abs = path.join(ROOT, rel);
  if (!fs.existsSync(abs)) return null;
  const html = fs.readFileSync(abs, 'utf8');
  const m = /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i.exec(html);
  if (m) return m[1];
  return `${SITE}/${rel.replace(/\\/g, '/')}`;
}

function indexUrlFor(rel) {
  return rel.replace(/\\/g, '/').replace(/(^|\/)index\.html$/, '$1');
}

// A book offer's `id` does NOT always match its page filename
// (id `magical-servitors-manual` -> `books/manual-activacion-servidores-magicos-pdf.html`),
// so derive the local page from the offer URL rather than guessing `${id}-pdf.html`.
function localPathFromUrl(...candidates) {
  for (const c of candidates) {
    if (typeof c !== 'string') continue;
    const m = /\/(books|apps|tools)\/([^?#]+?)(?:\.html)?(?:[?#]|$)/.exec(c);
    if (m) return `${m[1]}/${m[2]}.html`;
  }
  return null;
}

const entities = [];
const add = (e) => { entities.push(e); return e; };

/* ---------------------------------------------------------------- brand */
add({
  entity_id: 'brand.cha0smagick-labs',
  entity_type: 'brand',
  name: 'Cha0smagick Labs',
  canonical_url: `${SITE}/`,
  source_url: `${SITE}/`,
  owner: 'Cha0smagick Labs',
  state: 'published',
  external_state: null,
  last_reviewed: REVIEWED,
  known_limitations:
    'Brand-level catalogue is reconciled locally; external distribution (Play, Hotmart, social) is not independently verified from this repository.',
});

/* ----------------------------------------------------------------- apps */
for (const a of offers.apps) {
  const rel = localPathFromUrl(a.funnel, a.url) || `apps/${a.id}.html`;
  const canon = canonicalOf(rel);
  add({
    entity_id: `app.${a.id}`,
    entity_type: 'app',
    name: a.name,
    canonical_url: a.funnel || canon || `${SITE}/${rel}`,
    source_url: a.url,
    owner: 'Cha0smagick Labs',
    state: 'unverified_external',
    external_state: a.listingStatus || 'external_listing_unverified',
    last_reviewed: REVIEWED,
    price: a.price,
    package_id: a.packageId,
    local_page: rel,
    canonical_page_exists: Boolean(canon),
    known_limitations:
      'Google Play listing observed but not verified (no live store check from this repository). Price is the public app-page price, not a store-verified price. Availability varies by region.',
  });
}

/* ---------------------------------------------------------------- books */
for (const b of offers.books) {
  const rel = localPathFromUrl(b.funnel, b.url, b.priceSource) || `books/${b.id}-pdf.html`;
  const canon = canonicalOf(rel);
  add({
    entity_id: `book.${b.id}`,
    entity_type: 'book',
    name: b.name,
    canonical_url: canon || b.funnel || b.url,
    source_url: b.checkoutUrl || b.url,
    owner: 'Cha0smagick Labs',
    state: 'unverified_external',
    external_state: b.checkoutStatus || 'checkout_url_observed_in_page_sale_unverified',
    last_reviewed: REVIEWED,
    price: b.price,
    hotmart_product_id: b.hotmartProductId,
    local_page: rel,
    canonical_page_exists: Boolean(canon),
    known_limitations:
      'Checkout URL read from the public book page; the sale itself is unverified. Each book page also cross-sells a bundle ID that is NOT this book\'s own checkout.',
  });
}

/* --------------------------------------------------------------- bundle */
add({
  entity_id: 'book.bundle-esoteric-books',
  entity_type: 'book',
  name: offers.bundle.name,
  canonical_url: offers.bundle.funnel,
  source_url: offers.bundle.url,
  owner: 'Cha0smagick Labs',
  state: 'unverified_external',
  external_state: offers.bundle.checkoutStatus || 'external_url_observed_sale_unverified',
  last_reviewed: REVIEWED,
  price: offers.bundle.price,
  original_price: offers.bundle.originalPrice,
  discount_label: offers.bundle.discountLabel,
  hotmart_product_id: offers.bundle.hotmartProductId,
  known_limitations:
    `Bundle of the 7 books. Original price ${offers.bundle.originalPrice} is the arithmetic sum of the 7 public book prices, not an independent MSRP. Sale unverified. There is NO equivalent apps bundle (see rejected offers).`,
});

/* ---------------------------------------------------------------- tools */
const toolFiles = fs
  .readdirSync('tools')
  .filter((f) => f.endsWith('.html') && f !== 'index.html')
  .sort();

for (const f of toolFiles) {
  const rel = `tools/${f}`;
  const canon = canonicalOf(rel);
  const abs = path.join(ROOT, rel);
  const html = fs.existsSync(abs) ? fs.readFileSync(abs, 'utf8') : '';
  const h1 = /<h1[^>]*>([\s\S]*?)<\/h1>/i.exec(html);
  const title = /<title>([^<]*)<\/title>/i.exec(html);
  const name = h1 ? h1[1].replace(/<[^>]+>/g, '').trim() : f.replace(/\.html$/, '');
  const atomic = /data-atomic-tool=["']([A-Z0-9]+)["']/i.exec(html);
  add({
    entity_id: `tool.${f.replace(/\.html$/, '')}`,
    entity_type: 'tool',
    name,
    canonical_url: canon || `${SITE}/${rel}`,
    source_url: `${SITE}/${rel}`,
    owner: 'Cha0smagick Labs',
    state: 'published',
    external_state: null,
    last_reviewed: REVIEWED,
    local_page: rel,
    canonical_page_exists: Boolean(canon),
    registry_id: atomic ? atomic[1] : null,
    title: title ? title[1].trim() : null,
    known_limitations:
      atomic
        ? 'Free client-side tool. UI is rendered at runtime by js/atomic-tools.js from data/atomic-tools.json; page body is a thin shell, so most visible words are not in the static HTML.'
        : 'Free client-side tool. Generated by scripts/build-tool-funnels.mjs; do not hand-edit (regeneration overwrites).',
  });
}

/* ------------------------------------------------- pages: legal & offers */
const RETIRED = ['landing-pages/apps-bundle.html', 'landing-pages/complete-access.html', 'landing-pages/flash-sale.html'];

const legalPages = ['about', 'disclaimer', 'privacy-policy', 'refund-policy', 'terms', 'cookie-policy']
  .map((n) => `${n}.html`)
  .filter((rel) => fs.existsSync(path.join(ROOT, rel)));

for (const rel of legalPages) {
  const canon = canonicalOf(rel);
  add({
    entity_id: `page.${rel.replace(/\.html$/, '')}`,
    entity_type: 'page',
    name: rel.replace(/\.html$/, '').replace(/-/g, ' '),
    canonical_url: canon || `${SITE}/${rel}`,
    source_url: `${SITE}/${rel}`,
    owner: 'legal_owner_pending',
    state: 'draft',
    external_state: 'legal_owner_pending',
    last_reviewed: REVIEWED,
    local_page: rel,
    canonical_page_exists: Boolean(canon),
    known_limitations:
      'Legal page drafted locally. No named legal owner, no lawyer review, no jurisdiction/effective-date metadata confirmed. Must not be represented as final legal advice.',
  });
}

for (const rel of RETIRED) {
  const canon = canonicalOf(rel);
  const rejectedKey = rel.includes('apps-bundle')
    ? 'apps_bundle'
    : rel.includes('complete-access')
      ? 'complete_access'
      : 'flash_sale_99';
  add({
    entity_id: `page.${rel.replace(/\.html$/, '')}`,
    entity_type: 'page',
    name: rel.replace(/\.html$/, '').replace(/-/g, ' '),
    canonical_url: canon || `${SITE}/${rel}`,
    source_url: `${SITE}/${rel}`,
    owner: 'Cha0smagick Labs',
    state: 'retired',
    external_state: `rejected_offer_page_still_live (${rejectedKey})`,
    last_reviewed: REVIEWED,
    local_page: rel,
    canonical_page_exists: Boolean(canon),
    known_limitations:
      `REJECTED OFFER, PAGE STILL LIVE AND INDEXABLE. ${offers._meta.rejectedOffers[rejectedKey]} The HTML page was never deleted, so it can still advertise an unpurchasable product. Owner decision required: delete or reframe.`,
  });
}

/* ---------------------------------------------------------------- output */
const doc = {
  version: '1.0.0',
  generated_by: 'scripts/seo/build-entity-map.mjs',
  decision_ref: 'docs/geo-surface-decision.md',
  catalog_source: OFFERS,
  catalog_reconciled_at: REVIEWED,
  price_source: offers._meta.priceSource,
  external_listing_status: offers._meta.externalListingStatus,
  site: SITE,
  states_allowed: ['published', 'draft', 'unverified_external', 'retired'],
  note:
    'Local evidence only. Presence of an entity here proves a reconciled local record, NOT external publication, availability, sales or ranking.',
  counts: {},
  entities,
};

doc.counts = entities.reduce((acc, e) => {
  acc[e.entity_type] = (acc[e.entity_type] || 0) + 1;
  return acc;
}, {});
doc.counts.total = entities.length;

const REQUIRED = ['entity_id', 'entity_type', 'name', 'canonical_url', 'source_url', 'owner', 'state', 'last_reviewed', 'known_limitations'];
const badState = entities.filter((e) => !doc.states_allowed.includes(e.state));
const missing = entities.filter((e) => REQUIRED.some((k) => e[k] === undefined || e[k] === null || e[k] === ''));

if (!CHECK) {
  fs.mkdirSync('data', { recursive: true });
  fs.writeFileSync('data/entity-map.json', `${JSON.stringify(doc, null, 2)}\n`, 'utf8');

  const byType = {};
  for (const e of entities) (byType[e.entity_type] ||= []).push(e);
  const rows = Object.entries(byType)
    .map(([t, list]) => {
      const lines = list.map(
        (e) =>
          `| \`${e.entity_id}\` | ${esc(e.name)} | ${esc(e.state)} | ${e.external_state ? `\`${esc(e.external_state)}\`` : '—'} | ${esc(e.canonical_url)} |`,
      );
      return [`### \`${t}\` (${list.length})`, '', '| entity_id | name | state | external_state | canonical_url |', '|---|---|---|---|---|', ...lines, ''].join('\n');
    })
    .join('\n');

  const md = [
    '# Entity map',
    '',
    `**Version:** ${doc.version} · **Generated:** ${doc.generated_by} · **Decision:** [geo-surface-decision.md](geo-surface-decision.md)`,
    `**Catalog source:** \`${OFFERS}\` (reconciled ${REVIEWED}) · **Totals:** ${doc.counts.total} entities`,
    '',
    '> Local evidence only. A row here proves a reconciled local record — not external publication, availability, sales, or ranking.',
    '',
    '## Counts',
    '',
    '| type | n |',
    '|---|---|',
    ...Object.entries(doc.counts).filter(([k]) => k !== 'total').map(([k, v]) => `| ${k} | ${v} |`),
    '',
    '## Open external states (must stay open)',
    '',
    ...Object.entries(
      entities.reduce((a, e) => (e.external_state ? ((a[e.external_state] = (a[e.external_state] || 0) + 1), a) : a), {}),
    ).map(([k, v]) => `- \`${k}\` — ${v} entity/entities`),
    '',
    '## Entities',
    '',
    rows,
  ].join('\n');
  fs.writeFileSync('docs/entity-map.md', md, 'utf8');
}

/* --------------------------------------------------- coherence checking */
const sitemap = fs.readFileSync('sitemap.xml', 'utf8');
const locs = new Set([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim()));
const notInSitemap = entities.filter((e) => e.entity_type !== 'tool' && e.state !== 'retired' && !locs.has(e.canonical_url));
const noLocalPage = entities.filter((e) => e.local_page && !e.canonical_page_exists);

console.log(`entity-map ${CHECK ? 'CHECK' : 'written'}: ${doc.counts.total} entities`);
console.log(Object.entries(doc.counts).filter(([k]) => k !== 'total').map(([k, v]) => `  ${k}: ${v}`).join('\n'));
console.log(`required-field gaps: ${missing.length}${missing.length ? ` -> ${missing.map((e) => e.entity_id).join(', ')}` : ''}`);
console.log(`invalid states: ${badState.length}${badState.length ? ` -> ${badState.map((e) => `${e.entity_id}=${e.state}`).join(', ')}` : ''}`);
console.log(`published/draft entities missing from sitemap: ${notInSitemap.length}${notInSitemap.length ? ` -> ${notInSitemap.map((e) => e.entity_id).join(', ')}` : ''}`);
console.log(`entities whose local page has NO canonical tag: ${noLocalPage.length}${noLocalPage.length ? ` -> ${noLocalPage.map((e) => e.local_page).join(', ')}` : ''}`);
console.log(`retired-but-live pages: ${entities.filter((e) => e.state === 'retired').length}`);

if (CHECK && (missing.length || badState.length)) process.exit(1);
