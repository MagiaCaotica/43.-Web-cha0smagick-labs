#!/usr/bin/env node
/**
 * verify-play-catalog.mjs — the guard that stops dead Play Store references.
 *
 * WHY THIS EXISTS
 * On 2026-09-26 the owner supplied the twelve real package ids and the rule:
 * if there is no Play URL on record, the app does not exist, and there are
 * twelve. Cross-checking the repo against that list found **111 references to
 * 31 package ids that do not exist on Google Play**, every one HTTP 404.
 *
 * It came in two waves, and the second one is why this script checks what it
 * checks:
 *
 *   Wave 1 — 49 references in 22 files, inside play.google.com links. Product
 *   pages, eight blog articles, two tool pages, both email sequences, the
 *   social publisher and the Pinterest pin data. These are dead to a customer:
 *   the click succeeds, so there is no 404 on your own site, no error in
 *   analytics and nothing in the URL smoke test. The visitor leaves and lands
 *   on Google's not-found page, and the sale dies with no trace anywhere.
 *
 *   Wave 2 — 62 references in 8 files, with no play.google.com link at all.
 *   projects/scripts/play-orders.py and play-sales-report.py, which query the
 *   Play Developer API; scripts/ga4-play-purchases.js, which reconciles
 *   purchases into GA4; telegram-bot/bot.py; and the cloud function. These are
 *   worse than dead links, because a query for a package that does not exist
 *   returns **nothing at all** rather than an error. A sales report reading
 *   zero is indistinguishable from a sales report for a product that sold zero.
 *   That is precisely the file the P0-04 financial baseline depends on.
 *
 * It happened because nothing in the repo held the authoritative list.
 * data/play-catalog.json is that list and this script is what enforces it.
 *
 * WHAT IT CHECKS
 *   1. OWNER-BRAND SWEEP. Every id beginning com.cha0smagick,
 *      com.cha0smagicklabs or com.chaosmagick, anywhere in the repo, must be in
 *      the catalog or in the justified third-party allowlist. This is the check
 *      that catches wave 2, and it deliberately does not require a play link:
 *      a package id in a script is just as wrong as one in an href.
 *   2. LINK SWEEP. Every package id used in a play.google.com "details?id="
 *      link must be cataloged, including third-party apps cited in comparisons.
 *   3. CATALOG INTEGRITY. Every catalog entry must have its page in the repo,
 *      so the catalog cannot rot away from the site.
 *   4. With --online, each catalog id must still answer HTTP 200 on Play. That
 *      is how a delisting or a package rename gets noticed.
 *
 * The id pattern requires a lowercase segment after the brand, so prose that
 * merely ends a sentence in a period is not mistaken for an id, and a wildcard
 * placeholder such as com.cha0smagick.* in a template comment is not either.
 *
 * WHAT IT DOES NOT DO
 * It does not judge prose about competitors, and it does not verify anything
 * that only the Play Console can show — publication state, the Data safety
 * form, or real per-country pricing. Those are recorded in the catalog as
 * explicitly not verifiable from here, because an owner's word is an
 * attribution and not a measurement.
 *
 * USAGE
 *   node scripts/verify_play_catalog.mjs
 *   node scripts/verify_play_catalog.mjs --online
 *
 * EXIT CODES
 *   0  every id in the repo is a known real id, and the catalog matches the site
 *   1  an unknown or dead id is in use, or the catalog has drifted from the site
 */

import fs from 'node:fs/promises';
import { readdirSync } from 'node:fs';
import https from 'node:https';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CATALOG = path.join(ROOT, 'data', 'play-catalog.json');
const EXIT = { OK: 0, FAIL: 1 };

// Directories that are never published and cannot cost a sale. Research
// scrapes and browser-automation captures are where the first bad ids actually
// lived, and they are not pages. .playwright-mcp in particular stores saved
// page snapshots, so it picks up unrelated links from whatever page was
// captured.
const SKIP_DIRS = new Set([
  'node_modules', '.git', 'out', 'dist', '.firecrawl', '.cache', 'test-results',
  '.playwright-mcp', 'test-results', 'playwright-report',
]);
const SCAN_EXT = /\.(html|json|js|mjs|py|md|txt|yml|yaml)$/i;

// Files that legitimately mention ids that are not in the catalog. Each one
// needs a reason, because an exclusion list is where a wrong id goes to hide.
const EXCLUSIONS = {
  'data/play-catalog.json': 'the catalog itself declares the ids',
  'scripts/verify_play_catalog.mjs': 'this file contains the id patterns',
  'docs/plan-tools-sales-funnels.md':
    'historical analysis that cites the bad ids as the documented defect; ' +
    'removing them would destroy the record that the problem was known',
  'app-ads.txt':
    'template comment showing the ads.txt wildcard format, not a real id; ' +
    'the publisher id in that file is a separate owner action',
};

const PLAY_LINK = /play\.google\.com\/store\/apps\/details\?id=([A-Za-z0-9_.]+)/g;
// Brand prefixes the owner controls, then at least one more segment. The
// segment class deliberately excludes the dot, which is what stops a
// sentence-ending period from being swallowed ("...for com.cha0smagicklabs.
// luciddreamer." must not become a different id) while still letting the
// segment itself carry uppercase, because Android package names are
// case-sensitive and may contain it — com.martinberbesson.DreamlyApp is a real
// example. A first version used [a-z0-9_] here and the negative control proved
// the hole: com.cha0smagick.NOTAREALAPP walked straight through.
const OWNER_BRAND = /\bcom\.(?:cha0smagick|cha0smagicklabs|chaosmagick)(?:\.[A-Za-z0-9_]+)+/g;

const online = process.argv.includes('--online');
const wantsHelp = process.argv.includes('-h') || process.argv.includes('--help');

function walk(dir, depth = 0, out = []) {
  if (depth > 6) return out;
  let entries = [];
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const entry of entries) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const fp = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(fp, depth + 1, out);
    else if (SCAN_EXT.test(entry.name)) out.push(fp);
  }
  return out;
}

const rel = (fp) => path.relative(ROOT, fp).replace(/\\/g, '/');

function playStatus(pkg) {
  const url = `https://play.google.com/store/apps/details?id=${encodeURIComponent(pkg)}&hl=en&gl=US`;
  return new Promise((resolve) => {
    const req = https.get(
      url,
      {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0 Safari/537.36',
          'Accept-Language': 'en-US,en;q=0.9',
        },
      },
      (res) => {
        const chunks = [];
        res.on('data', (c) => chunks.push(c));
        res.on('end', () => {
          const body = Buffer.concat(chunks).toString('utf8');
          const notFound = /requested URL was not found|couldn't find that page|We're sorry/i.test(body);
          resolve({ status: res.statusCode || 0, notFound });
        });
      },
    );
    req.on('error', (e) => resolve({ status: 0, notFound: false, error: e.message }));
    req.setTimeout(25_000, () => {
      req.destroy();
      resolve({ status: 0, notFound: false, error: 'timeout' });
    });
  });
}

async function main() {
  if (wantsHelp) {
    console.log('Usage: node scripts/verify_play_catalog.mjs [--online]');
    return EXIT.OK;
  }

  const catalog = JSON.parse(await fs.readFile(CATALOG, 'utf8'));
  const known = new Set(catalog.apps.map((a) => a.package));
  const thirdParty = new Set(catalog.third_party_allowlist?.packages || []);

  console.log('verify-play-catalog');
  console.log(`  catalog : ${rel(CATALOG)}  (${catalog.apps.length} apps, verified ${catalog.verified_at})`);
  console.log(`  third-party allowlist: ${thirdParty.size}`);

  const files = walk(ROOT);
  const brandHits = new Map();
  const linkHits = new Map();

  for (const f of files) {
    const r = rel(f);
    if (EXCLUSIONS[r]) continue;
    const text = await fs.readFile(f, 'utf8');
    for (const m of text.matchAll(OWNER_BRAND)) {
      if (!brandHits.has(m[0])) brandHits.set(m[0], new Set());
      brandHits.get(m[0]).add(r);
    }
    for (const m of text.matchAll(PLAY_LINK)) {
      if (!linkHits.has(m[1])) linkHits.set(m[1], new Set());
      linkHits.get(m[1]).add(r);
    }
  }

  console.log(
    `\n  scanned ${files.length} files (${Object.keys(EXCLUSIONS).length} excluded by name, each with a stated reason)`,
  );

  // ---- check 1: owner-brand sweep (this is the one that catches wave 2) ---
  const badBrand = [...brandHits.entries()]
    .filter(([id]) => !known.has(id) && !thirdParty.has(id))
    .map(([id, where]) => ({ id, files: [...where].sort() }))
    .sort((a, b) => a.id.localeCompare(b.id));

  console.log(`\n  [1] owner-brand sweep`);
  console.log(`      distinct owner-brand ids in the repo: ${brandHits.size}`);
  console.log(`      cataloged: ${[...brandHits.keys()].filter((i) => known.has(i)).length}`);
  if (badBrand.length) {
    console.log(`      FAIL — ${badBrand.length} id(s) that are not one of the ${known.size}:`);
    for (const b of badBrand) {
      console.log(`        ${b.id}`);
      for (const f of b.files) console.log(`            ${f}`);
    }
    console.log(
      '\n      A wrong id in a script is not a dead link, it is a query that' +
        '\n      returns nothing. A sales report reading zero looks exactly like a' +
        '\n      sales report for a product that sold zero.',
    );
  } else {
    console.log(`      [ok] every owner-brand id is one of the ${known.size}`);
  }

  // ---- check 2: link sweep ----------------------------------------------
  const badLinks = [...linkHits.entries()]
    .filter(([id]) => !known.has(id) && !thirdParty.has(id))
    .map(([id, where]) => ({ id, files: [...where].sort() }))
    .sort((a, b) => a.id.localeCompare(b.id));

  console.log(`\n  [2] play.google.com link sweep`);
  console.log(`      distinct ids inside play links: ${linkHits.size}`);
  if (badLinks.length) {
    console.log(`      FAIL — ${badLinks.length} uncatalogued id(s) in live links:`);
    for (const b of badLinks) {
      console.log(`        ${b.id}`);
      for (const f of b.files) console.log(`            ${f}`);
    }
  } else {
    console.log('      [ok] every play link uses a cataloged id');
  }

  // ---- check 3: catalog integrity ---------------------------------------
  const missingPages = [];
  for (const app of catalog.apps) {
    try {
      await fs.access(path.join(ROOT, app.page));
    } catch {
      missingPages.push(`${app.package} -> ${app.page}`);
    }
  }
  console.log(`\n  [3] catalog integrity`);
  if (missingPages.length) {
    console.log(`      FAIL — ${missingPages.length} entr(ies) point at a page that is gone:`);
    for (const m of missingPages) console.log(`        ${m}`);
  } else {
    console.log('      [ok] every catalog entry has its page in the repo');
  }

  // ---- check 4: optional live check --------------------------------------
  console.log(`\n  [4] live check`);
  if (online) {
    const dead = [];
    for (const app of catalog.apps) {
      const r = await playStatus(app.package);
      const ok = r.status === 200 && !r.notFound;
      if (!ok) {
        dead.push(`${app.package} (HTTP ${r.status}${r.notFound ? ' not-found' : ''}${r.error ? ` ${r.error}` : ''})`);
      }
      console.log(`      ${ok ? '[ok]  ' : '[FAIL]'} ${app.package.padEnd(46)} HTTP ${r.status}`);
    }
    if (dead.length) {
      console.log(`      FAIL — ${dead.length} catalogued app(s) no longer resolve:`);
      for (const d of dead) console.log(`        ${d}`);
    } else {
      console.log('      [ok] all catalogued apps still resolve on Play');
    }
  } else {
    console.log('      (skipped; pass --online to check Play still serves all 12)');
  }

  const failed = badBrand.length + badLinks.length + missingPages.length;
  console.log(
    `\n  RESULT: ${failed === 0 ? 'PASS' : 'FAIL'}  ` +
      `(unknown brand ids ${badBrand.length}, unknown link ids ${badLinks.length}, missing pages ${missingPages.length})`,
  );
  return failed === 0 ? EXIT.OK : EXIT.FAIL;
}

main()
  .then((code) => process.exit(code))
  .catch((err) => {
    console.error(`verify-play-catalog crashed: ${err.stack || err.message}`);
    process.exit(EXIT.FAIL);
  });
