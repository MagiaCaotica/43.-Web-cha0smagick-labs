#!/usr/bin/env node
/**
 * scripts/seo/fix-sitemap.mjs
 *
 * Adds the public pages that exist on disk but were missing from sitemap.xml.
 *
 * Deliberately NOT added:
 *   /404.html                                          -> error page
 *   tools/auto-shorts/packages/**                      -> vendored third-party code
 *   landing-pages/complete-access.html                 -> BLOCKED_EXTERNAL_ID (no checkout)
 *   landing-pages/flash-sale.html                      -> BLOCKED_EXTERNAL_ID (no checkout)
 *   landing-pages/apps-bundle.html                     -> rejected offer, points at a Play collection
 *
 * Sending traffic to a page with no checkout is worse than not being indexed:
 * it burns the visit and costs the domain's trust score.
 *
 * Idempotent. Flags: --dry, --preview N
 */

import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..', '..');
const SITE = 'https://cha0smagicklabs.com';
const SITEMAP = path.join(ROOT, 'sitemap.xml');

const DRY = process.argv.includes('--dry');
const PREVIEW = (() => {
  const i = process.argv.indexOf('--preview');
  return i === -1 ? 0 : parseInt(process.argv[i + 1] || '0', 10);
})();

/** URL path as it should appear in the sitemap (index.html collapses to its folder). */
function sitemapPath(rel) {
  const p = rel.split(path.sep).join('/');
  if (p === 'index.html') return '/';
  if (p.endsWith('/index.html')) return '/' + p.slice(0, -'index.html'.length);
  return '/' + p;
}

function lastmodFor(rel) {
  const abs = path.join(ROOT, rel);
  let d;
  try {
    d = fs.statSync(abs).mtime;
  } catch {
    d = new Date();
  }
  return d.toISOString().slice(0, 10);
}

/**
 * The pages to add, with the editorial priority each one deserves.
 * changefreq/priority follow what the sitemap already uses for that section.
 */
const ADD = [
  // --- money page: real checkout, weekly, high priority ---
  { rel: 'landing-pages/books-bundle.html', changefreq: 'weekly', priority: '0.9' },

  // --- lead capture / conversion ---
  { rel: 'checklist-ventas.html', changefreq: 'weekly', priority: '0.8' },
  { rel: 'lead-magnet/guia-rapida-magia-caos-es.html', changefreq: 'monthly', priority: '0.7' },
  { rel: 'lead-magnet/quickstart-guide-chaos-magick-en.html', changefreq: 'monthly', priority: '0.7' },

  // --- free tools: real utility, decent traffic potential ---
  ...[
    'activador-servidores',
    'astrology-sign-calculator',
    'candle-color-calculator',
    'digital-pendulum',
    'gnosis-timer',
    'goetic-spirit-selector',
    'iching',
    'iching-changing-lines',
    'lunar-phase',
    'moon-voc',
    'planetary-hours',
    'planetary-kamea-sigil',
    'reality-check-tracker',
    'rune-drawer',
    'sigil-charging-timer',
    'sigil-generator',
    'spell-builder',
    'tarot-yes-no',
    'tengwar-transcriber',
    'viking-runes',
    'zener-esp-trainer',
  ].map((slug) => ({
    rel: `tools/${slug}.html`,
    changefreq: 'monthly',
    priority: '0.6',
  })),

  // --- about / detail pages ---
  { rel: 'pages/about.html', changefreq: 'monthly', priority: '0.5' },
  { rel: 'pages/app-details.html', changefreq: 'monthly', priority: '0.4' },

  // --- affiliate programme pages ---
  { rel: 'landing-pages/affiliate-dashboard.html', changefreq: 'monthly', priority: '0.3' },
  { rel: 'landing-pages/affiliate-terms.html', changefreq: 'monthly', priority: '0.3' },

  // --- legal / trust pages ---
  ...['affiliate-disclosure', 'cookie-policy', 'disclaimer', 'refund-policy'].map((slug) => ({
    rel: `${slug}.html`,
    changefreq: 'monthly',
    priority: '0.3',
  })),
];

function urlBlock({ rel, changefreq, priority }) {
  return [
    '  <url>',
    `    <loc>${SITE}${sitemapPath(rel)}</loc>`,
    `    <lastmod>${lastmodFor(rel)}</lastmod>`,
    `    <changefreq>${changefreq}</changefreq>`,
    `    <priority>${priority}</priority>`,
    '  </url>',
  ].join('\n');
}

function main() {
  if (!fs.existsSync(SITEMAP)) {
    console.error('sitemap.xml not found at', SITEMAP);
    process.exit(1);
  }
  let sm = fs.readFileSync(SITEMAP, 'utf8');

  const existing = new Set(
    [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim()),
  );
  const before = existing.size;

  const missingOnDisk = ADD.filter((a) => !fs.existsSync(path.join(ROOT, a.rel)));
  const todo = ADD.filter((a) => !existing.has(SITE + sitemapPath(a.rel)));

  if (missingOnDisk.length) {
    console.log('SKIPPED (file does not exist):');
    for (const m of missingOnDisk) console.log('  -', m.rel);
  }

  if (!todo.length) {
    console.log(
      `sitemap.xml already complete: ${before} urls, 0 to add (idempotent, nothing written)`,
    );
    return;
  }

  const blocks = todo.map(urlBlock);
  if (PREVIEW > 0) {
    console.log(`--- preview of first ${Math.min(PREVIEW, blocks.length)} blocks ---`);
    for (const b of blocks.slice(0, PREVIEW)) console.log(b);
  }

  if (DRY) {
    console.log(
      `\n[DRY] would add ${todo.length} urls -> ${before + todo.length} total. Nothing written.`,
    );
    return;
  }

  // Insert before the closing tag, keeping whatever indentation style the file already has.
  const closeIdx = sm.lastIndexOf('</urlset>');
  if (closeIdx === -1) {
    console.error('no </urlset> closing tag found');
    process.exit(1);
  }
  sm = sm.slice(0, closeIdx) + blocks.join('\n') + '\n' + sm.slice(closeIdx);
  fs.writeFileSync(SITEMAP, sm, 'utf8');

  const after = (sm.match(/<loc>/g) || []).length;
  console.log(`added: ${todo.length}`);
  console.log(`urls: ${before} -> ${after}`);
  for (const a of todo) console.log('  +', sitemapPath(a.rel));
}

main();