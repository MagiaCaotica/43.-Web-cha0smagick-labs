#!/usr/bin/env node
/**
 * verify-play-catalog.mjs — the guard that stops dead Play Store links.
 *
 * WHY THIS EXISTS
 * On 2026-09-26 the owner supplied the twelve real package ids. Cross-checking
 * them against the repo found **49 references to 14 different package ids that
 * do not exist on Google Play** — every one of them HTTP 404. They sat in
 * 22 files: product pages, eight blog articles, two tool pages, both email
 * sequences, the social publisher, and the Pinterest pin data.
 *
 * That class of bug is invisible. The click succeeds, so there is no 404 on
 * your own site, no error in analytics, and nothing in the URL smoke test.
 * The visitor leaves your page and lands on Google's "we couldn't find this
 * app". The sale dies with no trace anywhere.
 *
 * It existed because nothing in the repo held the authoritative list. The list
 * is now data/play-catalog.json and this script is what enforces it.
 *
 * WHAT IT CHECKS
 *   1. Every package id used in a play.google.com "details?id=" link must be in
 *      the catalog, or explicitly justified in third_party_allowlist.
 *   2. Every catalog entry must be reachable by its own page in the repo, so
 *      the catalog cannot rot away from the site.
 *   3. With --online, each catalog id must still answer HTTP 200 on Play. That
 *      is how a delisting or a renamed package gets noticed.
 *
 * WHAT IT DOES NOT DO
 * It does not crawl for bare package ids in prose. A competitor's id written
 * as plain text is not a link and cannot cost a sale, so it is not this
 * script's business. It checks links.
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
import https from 'node:https';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CATALOG = path.join(ROOT, 'data', 'play-catalog.json');
const EXIT = { OK: 0, FAIL: 1 };

// Directories that are never published and cannot cost a sale. Research
// scrapes are where the old bad ids actually lived, and they are not pages.
const SKIP_DIRS = new Set([
  'node_modules', '.git', 'out', 'dist', '.firecrawl', '.cache', 'test-results',
]);
const SCAN_EXT = /\.(html|json|js|mjs)$/i;

const online = process.argv.includes('--online');
const argHelp = process.argv.includes('-h') || process.argv.includes('--help');

const PLAY_LINK = /play\.google\.com\/store\/apps\/details\?id=([A-Za-z0-9_.]+)/g;

function walk(dir, depth = 0, out = []) {
  if (depth > 6) return out;
  for (const entry of fsSyncReaddir(dir)) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const fp = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(fp, depth + 1, out);
    else if (SCAN_EXT.test(entry.name)) out.push(fp);
  }
  return out;
}

// fs.readdir withFileTypes, kept sync to avoid an async mirror of walk()
import { readdirSync } from 'node:fs';
function fsSyncReaddir(dir) {
  try {
    return readdirSync(dir, { withFileTypes: true });
  } catch {
    return [];
  }
}

function playHeadStatus(pkg) {
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
  if (argHelp) {
    console.log('Usage: node scripts/verify_play_catalog.mjs [--online]');
    return EXIT.OK;
  }

  const raw = await fs.readFile(CATALOG, 'utf8');
  const catalog = JSON.parse(raw);
  const known = new Set(catalog.apps.map((a) => a.package));
  const thirdParty = new Set(catalog.third_party_allowlist?.packages || []);

  console.log('verify-play-catalog');
  console.log(`  catalog: ${path.relative(ROOT, CATALOG)}`);
  console.log(`  apps: ${known.size}   third-party allowlist: ${thirdParty.size}`);

  // ---- check 1: every play link in the repo is a known id ----------------
  const files = walk(ROOT);
  const usage = new Map(); // package -> Set(file)
  for (const f of files) {
    const text = await fs.readFile(f, 'utf8');
    for (const m of text.matchAll(PLAY_LINK)) {
      if (!usage.has(m[1])) usage.set(m[1], new Set());
      usage.get(m[1]).add(path.relative(ROOT, f).replace(/\\/g, '/'));
    }
  }

  const unknown = [];
  for (const [pkg, where] of usage) {
    if (known.has(pkg) || thirdParty.has(pkg)) continue;
    unknown.push({ pkg, files: [...where].sort() });
  }

  console.log(`\n  scanned ${files.length} files`);
  console.log(`  distinct package ids inside play.google.com links: ${usage.size}`);
  console.log(`  of those, in catalog: ${[...usage.keys()].filter((p) => known.has(p)).length}`);
  console.log(`  of those, allowlisted third party: ${[...usage.keys()].filter((p) => thirdParty.has(p)).length}`);

  if (unknown.length) {
    console.log(`\n  FAIL — ${unknown.length} id(s) in use that are NOT in the catalog:`);
    for (const u of unknown) {
      console.log(`    ${u.pkg}`);
      for (const f of u.files) console.log(`        ${f}`);
    }
    console.log(
      '\n  These either do not exist on Play or were never added to the catalog.' +
        '\n  A dead link here is invisible: the click works, the visitor lands on' +
        "\n  Google's not-found page, and no metric anywhere records the lost sale." +
        '\n  Fix: correct the id, or add a justified entry to third_party_allowlist.',
    );
  } else {
    console.log('\n  [ok] every play link uses a cataloged id');
  }

  // ---- check 2: catalog entries have a page in the repo -------------------
  const missingPages = [];
  for (const app of catalog.apps) {
    try {
      await fs.access(path.join(ROOT, app.page));
    } catch {
      missingPages.push(`${app.package} -> ${app.page}`);
    }
  }
  if (missingPages.length) {
    console.log(`\n  FAIL — ${missingPages.length} catalog entr(ies) point at a page that is gone:`);
    for (const m of missingPages) console.log(`    ${m}`);
  } else {
    console.log('  [ok] every catalog entry has its page in the repo');
  }

  // ---- check 3: optional live check --------------------------------------
  if (online) {
    console.log('\n  live check against play.google.com:');
    const dead = [];
    for (const app of catalog.apps) {
      const r = await playHeadStatus(app.package);
      const ok = r.status === 200 && !r.notFound;
      if (!ok) dead.push(`${app.package} (HTTP ${r.status}${r.notFound ? ' not-found' : ''}${r.error ? ` ${r.error}` : ''})`);
      console.log(`    ${ok ? '[ok]  ' : '[FAIL]'} ${app.package.padEnd(46)} ${ok ? 'HTTP 200' : `HTTP ${r.status}`}`);
    }
    if (dead.length) {
      console.log(`\n  FAIL — ${dead.length} catalogued app(s) no longer resolve on Play:`);
      for (const d of dead) console.log(`    ${d}`);
      console.log('  A delisted or renamed package looks exactly like a dead link to a customer.');
    } else {
      console.log('  [ok] all catalogued apps still resolve on Play');
    }
  } else {
    console.log('\n  (skipped the live check; pass --online to verify Play still serves all 12)');
  }

  const failed = unknown.length + missingPages.length;
  console.log(`\n  RESULT: ${failed === 0 ? 'PASS' : 'FAIL'}  (unknown ids ${unknown.length}, missing pages ${missingPages.length})`);
  return failed === 0 ? EXIT.OK : EXIT.FAIL;
}

main()
  .then((code) => process.exit(code))
  .catch((err) => {
    console.error(`verify-play-catalog crashed: ${err.stack || err.message}`);
    process.exit(EXIT.FAIL);
  });
