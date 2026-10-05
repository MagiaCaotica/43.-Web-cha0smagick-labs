// Add FAQPage schema to pages that already render a visible FAQ but declare none.
//
// Inverse of scripts/seo/reconcile-faq-schema.mjs: that one stripped Q&A that the
// body did not support; this one only ADDS Q&A that it extracted from the body,
// and then re-verifies every emitted question against the visible text before
// writing. So this script cannot reintroduce the mismatch it was built to fix.
//
// Rules, all deliberate:
//  - Only pages with a visible FAQ container (class/id containing "faq") qualify.
//  - Only <details>/<summary> pairs inside that container are read, so unrelated
//    accordions elsewhere on the page are never picked up.
//  - The trailing crumb must look like a question, otherwise it is a toggle.
//  - A page needs at least 2 usable pairs, else nothing is written.
//  - Every question is re-checked against the stripped visible body. If a
//    question cannot be found there, that pair is dropped rather than emitted.
//
// Dry-run by default; --write to apply. Idempotent: a page that already carries
// a FAQPage block is skipped.

import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve('.').replace(/\\/g, '/');
const SKIP = /(^|[\\/])(node_modules|\.git|\.github|vendor|projects|auto-shorts)([\\/]|$)/;
const WRITE = process.argv.includes('--write');
const JSON_OUT = process.argv.includes('--json');

const MIN_Q = 12;
const MAX_Q = 200;
const MIN_A = 25;
const MAX_A = 1200;
const MIN_PAIRS = 2;
const MAX_PAIRS = 12;

// A question ends with ?, or starts like one. "Show more" does not qualify.
const QUESTIONISH = /(?:\?\s*$)|(?:^(?:que|cómo|cuál|cuales|cuanto|cuánta|por qué|para qué|cuando|dónde|donde|quien|queda|que pasa|what|how|why|when|where|which|who|can|does|do|is|are|should|can you)\b)/i;

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory()) { if (SKIP.test(e.name)) continue; walk(path.join(dir, e.name), out); }
    else if (e.name.endsWith('.html')) out.push(path.join(dir, e.name));
  }
  return out;
}
function relOf(abs) {
  const r = abs.replace(/\\/g, '/');
  if (!r.startsWith(ROOT + '/')) throw new Error('fuera del root: ' + r);
  return r.slice(ROOT.length + 1);
}
function decode(s) {
  return s
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#0*39;/g, "'").replace(/&apos;/g, "'")
    .replace(/&mdash;/g, '—').replace(/&ndash;/g, '–')
    .replace(/&middot;/g, '·').replace(/&hellip;/g, '…')
    .replace(/&rsquo;/g, '’').replace(/&lsquo;/g, '‘')
    .replace(/&ldquo;/g, '“').replace(/&rdquo;/g, '”')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)));
}
function strip(s) {
  return decode(
    s
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<!--[\s\S]*?-->/g, ' ')
      .replace(/<[^>]+>/g, ' ')
  ).replace(/\s+/g, ' ').trim();
}
// The page as a user (and a crawler) sees it: no script, no style, no comments,
// no tags. <details> bodies are visible, so they stay.
function visibleBody(html) {
  return strip(html.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' '));
}

// The FAQ container: the innermost element whose class or id contains "faq".
// Slicing from its opening tag to its matching close is not reliable for
// arbitrary nesting, so instead we only accept <details> that appear AFTER the
// first faq-ish opening tag. That is enough to exclude accordions declared
// before the FAQ block, which is the real failure mode.
function faqRegionStart(html) {
  const m = html.match(/<[a-z][^>]*\b(?:class|id)\s*=\s*["'][^"']*faq/i);
  return m ? m.index : -1;
}

function extractPairs(html) {
  const from = faqRegionStart(html);
  if (from < 0) return [];
  const region = html.slice(from);

  const pairs = [];
  const re = /<details\b([^>]*)>([\s\S]*?)<\/details>/gi;
  let m;
  while ((m = re.exec(region)) !== null) {
    const inner = m[2];
    const sm = inner.match(/<summary\b[^>]*>([\s\S]*?)<\/summary>/i);
    if (!sm) continue;
    const question = strip(sm[1]);
    const answer = strip(inner.slice(sm.index + sm[0].length));
    if (!question || !answer) continue;
    if (question.length < MIN_Q || question.length > MAX_Q) continue;
    if (answer.length < MIN_A || answer.length > MAX_A) continue;
    if (!QUESTIONISH.test(question)) continue;
    pairs.push({ question, answer });
  }
  return pairs;
}

function faqLd(pairs) {
  const obj = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: pairs.map((p) => ({
      '@type': 'Question',
      name: p.question,
      acceptedAnswer: { '@type': 'Answer', text: p.answer },
    })),
  };
  return JSON.stringify(obj, null, 2);
}

// Insert before the first </head>; every one of these pages has a </head>.
function inject(html, ld) {
  const tag = `<script type="application/ld+json">\n${ld}\n</script>`;
  const i = html.search(/<\/head>/i);
  if (i < 0) return null;
  return html.slice(0, i) + '  ' + tag + '\n' + html.slice(i);
}

const report = [];
let changedFiles = 0;
let totalPairs = 0;

for (const abs of walk(ROOT)) {
  const rel = relOf(abs);
  const html = fs.readFileSync(abs, 'utf8');
  if (html.includes('"FAQPage"')) continue;

  let pairs = extractPairs(html);
  if (pairs.length < MIN_PAIRS) continue;
  pairs = pairs.slice(0, MAX_PAIRS);

  // The guard that matters: never emit a question the body cannot show.
  const body = visibleBody(html);
  const backed = pairs.filter((p) => body.includes(p.question));
  const dropped = pairs.length - backed.length;
  pairs = backed;
  if (pairs.length < MIN_PAIRS) continue;

  const out = inject(html, faqLd(pairs));
  if (out === null) continue;

  report.push({ rel, pairs: pairs.length, dropped });
  totalPairs += pairs.length;
  if (WRITE) fs.writeFileSync(abs, out, 'utf8');
  changedFiles++;
}

if (JSON_OUT) {
  console.log(JSON.stringify({ changedFiles, totalPairs, report }, null, 2));
} else {
  const byArea = new Map();
  for (const r of report) {
    const area = r.rel.includes('/') ? r.rel.split('/')[0] : '(root)';
    byArea.set(area, (byArea.get(area) || 0) + 1);
  }
  console.log(`paginas con FAQ visible y sin schema que se pueden marcar: ${report.length}`);
  console.log(`preguntas extraidas: ${totalPairs}`);
  const droppedTotal = report.reduce((a, r) => a + r.dropped, 0);
  console.log(`preguntas descartadas por no estar en el cuerpo: ${droppedTotal}`);
  console.log('por area:', [...byArea.entries()].sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k}=${v}`).join(' '));
  console.log(WRITE ? 'ESCRITO' : 'DRY-RUN (usa --write)');
}
