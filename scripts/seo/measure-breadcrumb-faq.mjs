#!/usr/bin/env node
// Measure visible breadcrumbs vs BreadcrumbList schema, and visible FAQ content
// vs FAQPage schema. Read-only. Run: node scripts/seo/measure-breadcrumb-faq.mjs [--json]
import fs from 'node:fs';
import path from 'node:path';

const SKIP = /(^|[\\/])(node_modules|\.git|\.github|vendor|projects|auto-shorts|\.omo)([\\/]|$)/;
const ROOT_FWD = path.resolve('.').replace(/\\/g, '/');

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory()) {
      if (SKIP.test(e.name)) continue;
      walk(path.join(dir, e.name), out);
    } else if (e.isFile() && e.name.endsWith('.html')) {
      out.push(path.join(dir, e.name));
    }
  }
  return out;
}

const rows = [];
for (const abs of walk(path.resolve('.'))) {
  const rel = abs.replace(/\\/g, '/');
  if (!rel.startsWith(ROOT_FWD + '/')) throw new Error('bad rel: ' + rel);
  const r = rel.slice(ROOT_FWD.length + 1);
  const html = fs.readFileSync(abs, 'utf8');

  // BreadcrumbList schema
  const hasBcSchema = /"@type"\s*:\s*"BreadcrumbList"/.test(html);

  // Visible breadcrumb: a nav/div with class containing "breadcrumb" that has <a> inside
  let hasBcVisible = false;
  const bcRe = /<(nav|div|ol|ul)[^>]*class="[^"]*breadcrumb[^"]*"[^>]*>([\s\S]{0,4000}?)<\/\1>/gi;
  let m;
  while ((m = bcRe.exec(html))) {
    if (/<a\s[^>]*href=/i.test(m[2])) { hasBcVisible = true; break; }
  }
  // Also catch self-closing / unclosed variants like <nav class="breadcrumbs"> ... </nav> handled above,
  // plus aria-label based breadcrumbs
  if (!hasBcVisible && /aria-label="[^"]*breadcrumb/i.test(html) && /<a\s[^>]*href=/i.test(html)) {
    // only count if the aria-label is on a nav/ol/ul
    if (/<(nav|ol|ul)[^>]*aria-label="[^"]*(bread|miga)/i.test(html)) hasBcVisible = true;
  }

  const hasFaqSchema = /"@type"\s*:\s*"FAQPage"/.test(html);

  // Visible FAQ: <details>/<summary> pairs, or a section whose class/id mentions faq
  const details = (html.match(/<details\b/gi) || []).length;
  let faqBlock = false;
  const faqRe = /<(section|div)\b[^>]*(class|id)="[^"]*\bfaq\b[^"]*"[^>]*>/gi;
  while ((m = faqRe.exec(html))) { faqBlock = true; break; }
  const hasFaqVisible = details > 0 || faqBlock;

  rows.push({ r, hasBcSchema, hasBcVisible, hasFaqSchema, hasFaqVisible, details });
}

const n = rows.length;
const sum = (k) => rows.filter((r) => r[k]).length;
const area = (r) => (r.includes('/') ? r.split('/')[0] : '(root)');

const report = {
  total: n,
  breadcrumb: {
    schemaPresent: sum('hasBcSchema'),
    visiblePresent: sum('hasBcVisible'),
    schemaOnly_noVisible: rows.filter((r) => r.hasBcSchema && !r.hasBcVisible).length,
    visible_noSchema: rows.filter((r) => r.hasBcVisible && !r.hasBcSchema).length,
    neither: rows.filter((r) => !r.hasBcSchema && !r.hasBcVisible).length,
  },
  faq: {
    schemaPresent: sum('hasFaqSchema'),
    visiblePresent: sum('hasFaqVisible'),
    visible_noSchema: rows.filter((r) => r.hasFaqVisible && !r.hasFaqSchema).length,
    schema_noVisible: rows.filter((r) => r.hasFaqSchema && !r.hasFaqVisible).length,
    neither: rows.filter((r) => !r.hasFaqSchema && !r.hasFaqVisible).length,
  },
  byArea: {},
};

for (const r of rows) {
  const a = area(r.r);
  report.byArea[a] ??= { files: 0, bcSchemaOnly: 0, bcNeither: 0, faqVisibleNoSchema: 0, faqNeither: 0 };
  const b = report.byArea[a];
  b.files++;
  if (r.hasBcSchema && !r.hasBcVisible) b.bcSchemaOnly++;
  if (!r.hasBcSchema && !r.hasBcVisible) b.bcNeither++;
  if (r.hasFaqVisible && !r.hasFaqSchema) b.faqVisibleNoSchema++;
  if (!r.hasFaqSchema && !r.hasFaqVisible) b.faqNeither++;
}

if (process.argv.includes('--json')) {
  console.log(JSON.stringify(report, null, 2));
} else {
  console.log('files:', n);
  console.log('BREADCRUMB', JSON.stringify(report.breadcrumb));
  console.log('FAQ      ', JSON.stringify(report.faq));
  console.log('BY AREA:');
  for (const [a, b] of Object.entries(report.byArea).sort((x, y) => y[1].files - x[1].files)) {
    console.log(' ', a.padEnd(16), JSON.stringify(b));
  }
  console.log('\nSAMPLE faqVisibleNoSchema:', rows.filter((r) => r.hasFaqVisible && !r.hasFaqSchema).slice(0, 8).map((r) => r.r).join(' | '));
  console.log('SAMPLE bcSchemaOnly:', rows.filter((r) => r.hasBcSchema && !r.hasBcVisible).slice(0, 8).map((r) => r.r).join(' | '));
}
