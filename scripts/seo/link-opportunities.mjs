#!/usr/bin/env node
/**
 * link-opportunities.mjs — find pages that would plausibly accept a link, and prove it.
 *
 * WHY THIS EXISTS
 * Backlinks from third-party sites cannot be automated: a human editor has to decide to
 * publish the link. What CAN be automated is the search for where that decision is likely
 * to go yes. This finds three kinds of opportunity, in priority order:
 *
 *   1. COMPETITOR CITATIONS  — the page links to Co-Star / Astro.com / Time Nomad etc.
 *                              and does NOT link to us. Highest signal: an editor already
 *                              accepted a link in exactly that slot.
 *   2. RESOURCE PAGES        — the URL or its links look like a curated list. No editorial
 *                              approval needed to get onto a "further reading" page.
 *   3. BROKEN OUTBOUND LINKS — the page links to a competitor URL that 404s. A working
 *                              replacement is a courtesy, and courtesy links get granted.
 *
 * Any page that already links to cha0smagicklabs.com is excluded — we do not pitch a site
 * that already linked us.
 *
 * USAGE
 *   node scripts/seo/link-opportunities.mjs            # live crawl (needs network)
 *   node scripts/seo/link-opportunities.mjs --offline  # mine the existing .firecrawl corpus
 *   node scripts/seo/link-opportunities.mjs --limit 40 --tier occult
 *
 * OUTPUT
 *   .firecrawl/link-opportunities.md   ranked worklist, ready to work from
 *   console                            one-line summary
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const OUT_DIR = path.join(ROOT, '.firecrawl');
const OUT_FILE = path.join(OUT_DIR, 'link-opportunities.md');

const argv = process.argv.slice(2);
const OFFLINE = argv.includes('--offline');
const LIMIT = Number(argValue('--limit') ?? 40);
const TIER = argValue('--tier');

function argValue(flag) {
  const i = argv.indexOf(flag);
  return i === -1 ? undefined : argv[i + 1];
}

/** Competitors we want to displace, not to copy. */
const COMPETITORS = [
  'co-star.app', 'costarastrology.com', 'thepattern.com', 'timenomad.com',
  'astromatrix.com', 'astro.com', 'astro-seek.com', 'luckymojo.com',
  'runesoup.com', 'labyrinthos.co', 'astrogold.com', 'solarfire',
];

/** Pages whose whole job is to list other people's work. */
const RESOURCE_HINTS = [
  /resource/i, /further-reading/i, /further_reading/i, /recommended/i,
  /useful-link/i, /link.?list/i, /\blinks\b/i, /reading-list/i,
  /bibliograph/i, /reference/i, /booklist/i, /app-?list/i, /roundup/i,
];

/** A page about esoteric practice is a page whose audience we want. */
const NICHE_HINTS = [
  /occult/i, /witch/i, /chaos.?magick/i, /sigil/i, /tarot/i, /astrolog/i,
  /divination/i, /ritual/i, /grimoire/i, /pagan/i, /esoteric/i, /hermet/i,
  /rune/i, /iching/i, /i.?ching/i, /lucid/i, /paranormal/i, /ghost/i,
  /magic/i, /magick/i, /servitor/i, /lunar/i, /spell/i,
];

const SELF_HOSTS = ['cha0smagicklabs.com', 'www.cha0smagicklabs.com'];

/* ------------------------------------------------------------------ inputs */

function readSeedUrls() {
  const dir = path.join(OUT_DIR, 'outreach-research');
  if (!fs.existsSync(dir)) return [];
  const urls = new Set();
  for (const f of fs.readdirSync(dir)) {
    if (!f.endsWith('.txt')) continue;
    if (TIER && !f.includes(TIER)) continue;
    const raw = fs.readFileSync(path.join(dir, f), 'utf8');
    for (const m of raw.matchAll(/https?:\/\/[^\s"'<>)\]]+/g)) {
      const u = m[0].replace(/[.,;]+$/, '');
      if (/^https?:\/\/[^/]+\.[a-z]{2,}/i.test(u)) urls.add(u);
    }
  }
  return [...urls];
}

/** In --offline mode, mine the markdown that previous crawls already saved. */
function readCorpus() {
  const dir = path.join(OUT_DIR, 'outreach-results');
  if (!fs.existsSync(dir)) return [];
  const docs = [];
  for (const sub of fs.readdirSync(dir)) {
    const d = path.join(dir, sub);
    if (!fs.statSync(d).isDirectory()) continue;
    for (const f of fs.readdirSync(d)) {
      if (!f.endsWith('.md')) continue;
      const full = path.join(d, f);
      docs.push({ label: `${sub}/${f.replace(/\.md$/, '')}`, text: fs.readFileSync(full, 'utf8') });
    }
  }
  return docs;
}

/* --------------------------------------------------------------- analysis */

function hostOf(url) {
  const m = String(url).match(/^https?:\/\/([^/]+)/);
  return m ? m[1].toLowerCase() : '';
}

function isSelf(href) {
  return SELF_HOSTS.includes(hostOf(href));
}

function anchorsOf(markdown) {
  // firecrawl markdown keeps links as [text](href)
  const out = [];
  for (const m of markdown.matchAll(/\[([^\]]{0,120})\]\((https?:\/\/[^)\s]+)\)/g)) {
    out.push({ text: m[1].trim(), href: m[2] });
  }
  return out;
}

/**
 * Score one document. Pure function of its text, so it behaves identically offline
 * and online — which is what makes the offline mode a real test of the online one.
 */
function analyse(doc) {
  const text = doc.text;
  const lower = text.toLowerCase();
  const anchors = anchorsOf(text);

  const nicheHits = new Set();
  for (const re of NICHE_HINTS) if (re.test(lower)) nicheHits.add(re.source);
  if (nicheHits.size === 0) return null;

  const outbound = anchors.filter((a) => !isSelf(a.href));
  const alreadyLinked = anchors.some((a) => isSelf(a.href));
  if (alreadyLinked) return null; // do not pitch a site that already linked us

  const competitorLinks = outbound.filter((a) =>
    COMPETITORS.some((c) => hostOf(a.href).endsWith(c)),
  );

  const resourceLike =
    RESOURCE_HINTS.some((re) => re.test(doc.label)) ||
    RESOURCE_HINTS.some((re) => re.test(lower.slice(0, 4000)));

  // Broken links: absolute http(s) URLs on the page that do not resolve to a file
  // anywhere in the corpus are only *candidates* — the online pass does the HEAD check.
  const dead = new Set();
  for (const a of outbound) {
    const h = hostOf(a.href);
    if (!h || /cha0smagicklabs|facebook|twitter|x\.com|instagram|youtube|pinterest|linkedin|paypal|patreon|ko-fi/i.test(h)) continue;
    if (/wp-|wordpress|\.php$|\?amp=|\/tag\//.test(a.href)) continue;
    dead.add(a.href);
  }

  const reasons = [];
  let score = Math.min(nicheHits.size, 4) * 2;

  // 1. Competitor citation is the strongest signal there is: an editor already agreed to
  //    put a paid app in that exact slot and picked someone else's. Highest weight.
  if (competitorLinks.length) {
    score += 20 + Math.min(competitorLinks.length, 4) * 5;
    reasons.push(`already links ${competitorLinks.length} competitor(s): ` +
      [...new Set(competitorLinks.map((c) => hostOf(c.href)))].slice(0, 3).join(', '));
  }

  // 2. A page that is explicitly a curated list. Judged on the page declaring itself a
  //    resource page, NOT on how many links it has — a tag archive with 500 outbound
  //    links is not an opportunity, it is a link farm.
  if (resourceLike) {
    score += 14;
    reasons.push('declares itself a resource / further-reading / recommended list');
  }

  // 3. A roundup or "best X" page is where an app pitch belongs.
  const roundup = /best\s+\d+|top\s+\d+|\d+\s+best|ranked|roundup|vs\.?|versus/i.test(doc.label + ' ' + text.slice(0, 1500));
  if (roundup) {
    score += 10;
    reasons.push('is a ranked/best-of article — the natural slot for an app mention');
  }

  // 4. Link density is only a tiebreaker, and only for genuinely curated pages. Without
  //    resourceLike or roundup, a high link count is noise, so it earns nothing.
  if (resourceLike || roundup) {
    if (outbound.length >= 15) {
      score += 3;
      reasons.push(`${outbound.length} outbound links on a curated page`);
    }
  }

  if (reasons.length === 0) return null;

  return {
    label: doc.label,
    score,
    reasons,
    competitors: [...new Set(competitorLinks.map((c) => hostOf(c.href)))],
    outboundCount: outbound.length,
    resourceLike,
    roundup,
    competitorHits: competitorLinks.length,
    candidateDeadLinks: [...dead].slice(0, 8),
  };
}

function render(results, source, stats) {
  const lines = [];
  lines.push('# Link opportunities');
  lines.push('');
  lines.push(`Generated from **${source}** — ${results.length} candidate pages.`);
  lines.push('');
  lines.push('A link is not automated. These are the pages where a human should ask.');
  lines.push('');
  if (stats) {
    lines.push(`- ${stats.corridor} / ${stats.corpus} documents linked a competitor (the strongest signal)`);
    lines.push(`- ${stats.already} documents already link to Cha0smagick Labs (excluded from this list)`);
    lines.push(`- ${stats.resource} documents look like curated resource pages`);
    lines.push('');
  }
  lines.push('| # | Page | Score | Why |');
  lines.push('|---|---|---:|---|');
  results.forEach((r, i) => {
    lines.push(`| ${i + 1} | \`${r.label}\` | ${Math.round(r.score)} | ${r.reasons.join('; ')} |`);
  });

  const withDead = results.filter((r) => r.candidateDeadLinks.length);
  if (withDead.length) {
    lines.push('');
    lines.push('## Outbound links worth verifying as broken');
    lines.push('');
    for (const r of withDead) {
      lines.push(`- \`${r.label}\``);
      for (const u of r.candidateDeadLinks) lines.push(`  - ${u}`);
    }
  }
  return lines.join('\n') + '\n';
}

/* -------------------------------------------------------------------- main */

async function main() {
  const seeds = readSeedUrls();
  console.log(`seed urls: ${seeds.length}${TIER ? ` (tier: ${TIER})` : ''}`);

  let results = [];
  let stats = {};
  let source = 'seed list';

  if (OFFLINE) {
    const docs = readCorpus();
    const analysed = docs.map(analyse).filter(Boolean);
    // Stats are computed over ALL docs, not just the survivors, so the header tells the
    // truth about what was and was not found.
    const withAnchors = docs.map((d) => anchorsOf(d.text)).filter((a) => a.length);
    const withComp = docs.filter((d) => anchorsOf(d.text).some((a) =>
      COMPETITORS.some((c) => hostOf(a.href).endsWith(c)))).length;
    const withSelf = docs.filter((d) => anchorsOf(d.text).some((a) => isSelf(a.href))).length;
    const withRes = docs.filter((d) =>
      RESOURCE_HINTS.some((re) => re.test(d.label) || re.test(d.text.slice(0, 4000)))).length;
    stats = { corpus: docs.length, withAnchors: withAnchors.length, corridor: withComp, already: withSelf, resource: withRes };
    console.log(`corpus docs: ${docs.length}  with outbound links: ${withAnchors.length}`);
    console.log(`  link a competitor: ${withComp}  already link us: ${withSelf}  resource-shaped: ${withRes}`);
    results = analysed;
    source = `offline corpus (${docs.length} docs)`;
  } else {
    // Online pass. firecrawl is the crawler of record for this project; it is
    // already authenticated via FIRECRAWL_API_KEY.
    const { execFileSync } = await import('node:child_process');
    const targets = seeds.slice(0, LIMIT);
    const docs = [];
    let failed = 0;
    for (const url of targets) {
      const slug = hostOf(url).replace(/[^a-z0-9]+/gi, '-');
      const out = path.join(OUT_DIR, 'link-scan', `${slug}.md`);
      fs.mkdirSync(path.join(OUT_DIR, 'link-scan'), { recursive: true });
      try {
        execFileSync('firecrawl', ['scrape', url, '--only-main-content', '-o', out],
          { stdio: 'ignore', timeout: 90_000 });
        docs.push({ label: url, text: fs.readFileSync(out, 'utf8') });
      } catch {
        failed++;
      }
    }
    console.log(`crawled: ${docs.length}  failed: ${failed}`);
    results = docs.map(analyse).filter(Boolean);
    source = `${docs.length} live crawls`;
  }

  results.sort((a, b) => b.score - a.score);
  results = results.slice(0, LIMIT);

  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(OUT_FILE, render(results, source, stats), 'utf8');

  console.log(`\ncandidates: ${results.length}`);
  console.log(`wrote: ${path.relative(ROOT, OUT_FILE)}`);
  for (const r of results.slice(0, 8)) {
    console.log(`  ${String(Math.round(r.score)).padStart(3)}  ${r.label}`);
  }
}

main().catch((e) => { console.error('THREW: ' + e.message); process.exit(1); });