/**
 * HEAD DEBT MEASUREMENT — cha0smagicklabs.com
 *
 * Dry-run only. Measures the <head> defects the SEO audit counted, per area and
 * overall, so a fix can be targeted at what is actually broken.
 *
 *   node scripts/seo/measure-head-debt.mjs            # summary
 *   node scripts/seo/measure-head-debt.mjs --json     # machine readable
 *   node scripts/seo/measure-head-debt.mjs --area blog
 */

import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

const ROOT = process.cwd()
// auto-shorts = gitignored vendored third-party trees (tools/auto-shorts/,
// projects/auto-shorts*/). They are not site pages: including them produced
// phantom debt (a blank.html demo file counted as a real page missing og:title).
const SKIP = new Set(['node_modules', '.git', '.github', 'projects', 'vendor', 'auto-shorts'])
const HOST = 'https://cha0smagicklabs.com'

const args = process.argv.slice(2)
const wantJson = args.includes('--json')
const areaArg = args.includes('--area') ? args[args.indexOf('--area') + 1] : null

const TITLE_MAX = 60
const DESC_MAX = 160

function walk(dir, acc = []) {
  let entries
  try {
    entries = readdirSync(dir)
  } catch {
    return acc
  }
  for (const e of entries) {
    if (SKIP.has(e)) continue
    const full = join(dir, e)
    let st
    try {
      st = statSync(full)
    } catch {
      continue
    }
    if (st.isDirectory()) walk(full, acc)
    else if (e.endsWith('.html')) acc.push(full)
  }
  return acc
}

function head(html) {
  const m = html.match(/<head[\s>][\s\S]*?<\/head>/i)
  return m ? m[0] : ''
}

function content(html) {
  return html
    .replace(/<head[\s\S]*?<\/head>/i, ' ')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
}

function attr(tag, name) {
  const m = tag.match(new RegExp(`${name}\\s*=\\s*["']([^"']*)["']`, 'i'))
  return m ? m[1] : ''
}

function titleOf(h) {
  const m = h.match(/<title[^>]*>([\s\S]*?)<\/title>/i)
  return m ? m[1].trim().replace(/\s+/g, ' ') : ''
}

function metaContent(h, key, kind = 'name') {
  const re = new RegExp(`<meta[^>]*\\b${kind}\\s*=\\s*["']${key}["'][^>]*>`, 'i')
  const tag = h.match(re)
  return tag ? attr(tag[0], 'content') : ''
}

const files = walk(ROOT).filter((f) => !areaArg || relative(ROOT, f).replace(/\\/g, '/').startsWith(areaArg))

const rows = []
for (const f of files) {
  const html = readFileSync(f, 'utf8')
  const h = head(html)
  const rel = relative(ROOT, f).replace(/\\/g, '/')
  const title = titleOf(h)
  const desc = metaContent(h, 'description')
  const canonicalTag = h.match(/<link[^>]*\brel\s*=\s*["']canonical["'][^>]*>/i)
  const canonical = canonicalTag ? attr(canonicalTag[0], 'href') : ''
  const words = content(html).trim().split(/\s+/).filter(Boolean).length

  rows.push({
    file: rel,
    title,
    titleLen: title.length,
    titleMissing: !title,
    titleLong: title.length > TITLE_MAX,
    descLen: desc.length,
    descMissing: !desc,
    descLong: desc.length > DESC_MAX,
    canonical,
    canonicalMissing: !canonical,
    canonicalNotSelf: !!canonical && !canonical.includes(HOST + '/' + rel.replace(/index\.html$/, '')),
    hasViewport: /<meta[^>]*\bname\s*=\s*["']viewport["']/i.test(h),
    hasOgTitle: metaContent(h, 'og:title', 'property') !== '',
    hasOgDesc: metaContent(h, 'og:description', 'property') !== '',
    hasLdJson: /<script[^>]*type\s*=\s*["']application\/ld\+json["']/i.test(h),
    // `BlogPosting` es el tipo correcto de schema.org para un articulo de blog y
    // es mas especifico que `Article`. Antes solo se aceptaba el literal
    // "Article", asi que toda pagina que declarara BlogPosting contaba como
    // deuda que no era deuda: por eso la cifra era 452 cuando solo 2 articles
    // estaban realmente sin schema.
    hasArticleSchema: /"@type"\s*:\s*"?(?:Article|BlogPosting)"?/i.test(h),
    // Solo hay deuda de FAQPage si la pagina MUESTRA una FAQ. Exigirla donde no
    // la hay es declarar schema sin respaldo, que es exactamente lo que
    // reconcile-faq-schema.mjs borra del sitio.
    hasFaqPage: /FAQPage/i.test(h),
    hasVisibleFaq: /<h[23][^>]*>[^<]*(?:FAQ|Frequently Asked|Preguntas Frecuentes|Common Questions)/i.test(html),
    hasBreadcrumbSchema: /BreadcrumbList/i.test(h),
    // Igual que FAQPage: la deuda solo existe si el breadcrumb es visible. El
    // commit 4c41d203 Convertsio 88 breadcrumbs que solo vivian en schema, y el
    // criterio quedo al reves: schema es lo que accompanies a un breadcrumb que
    // el usuario ya ve.
    hasVisibleBreadcrumb: /class\s*=\s*["'][^"']*breadcrumb/i.test(h),
    hasH1: /<h1[\s>]/i.test(html),
    h1Count: (html.match(/<h1[\s>]/gi) || []).length,
    hasLang: /<html[^>]*\blang\s*=/i.test(html),
    words,
  })
}

// Two polarity families are stored in `rows`, and mixing them up silently inverted the
// first two measurement runs. Read this before touching the counters below.
//
//   DEBT flags  (true = broken): titleMissing, descMissing, canonicalMissing,
//               canonicalNotSelf, titleLong, descLong   -> count with yes()
//   OK flags    (true = healthy): hasViewport, hasOgTitle, hasOgDesc, hasLdJson,
//               hasArticleSchema, hasFaqPage, hasBreadcrumbSchema, hasH1, hasLang
//                                                        -> count with no()
const yes = (k) => rows.filter((r) => r[k]).length
const no = (k) => rows.filter((r) => !r[k]).length

// Estas tres metricas necesitan un ambito, porque el tipo de schema que toca
// depende de que sea la pagina correcta.
//
//   Article       solo tiene sentido en un articulo de blog. Exigirlo en una
//                 tool, una landing o una pagina legal es inventar un tipo que
//                 no describe la pagina.
//   FAQPage       solo es deuda si la FAQ es VISIBLE. Si no hay FAQ en el
//                 cuerpo, no se marca, porque declararla seria schema spam: lo
//                 que reconcile-faq-schema.mjs elimina del sitio.
//   BreadcrumbList solo es deuda si el breadcrumb es VISIBLE. Al reves del
//                 criterio del commit 4c41d203, que hizo visibles 88
//                 breadcrumbs que solo existian en schema.
const isArticle = (r) => r.file.startsWith('blog/') && !r.file.endsWith('index.html')
const missingArticle = rows.filter((r) => isArticle(r) && !r.hasArticleSchema).length
const missingFaq = rows.filter((r) => r.hasVisibleFaq && !r.hasFaqPage).length
const missingBreadcrumb = rows.filter((r) => r.hasVisibleBreadcrumb && !r.hasBreadcrumbSchema).length

const report = {
  total: rows.length,
  title_missing: yes('titleMissing'),
  title_over_60: yes('titleLong'),
  desc_missing: yes('descMissing'),
  desc_over_160: yes('descLong'),
  canonical_missing: yes('canonicalMissing'),
  canonical_not_self: yes('canonicalNotSelf'),
  missing_viewport: no('hasViewport'),
  missing_og_title: no('hasOgTitle'),
  missing_og_desc: no('hasOgDesc'),
  missing_schema: no('hasLdJson'),
  missing_article_schema: missingArticle,
  missing_faqpage: missingFaq,
  missing_breadcrumb_schema: missingBreadcrumb,
  missing_h1: no('hasH1'),
  multi_h1: rows.filter((r) => r.h1Count > 1).length,
  missing_lang: no('hasLang'),
  thin_under_300w: rows.filter((r) => r.words < 300).length,
  thin_under_600w: rows.filter((r) => r.words < 600).length,
}

if (wantJson) {
  console.log(JSON.stringify({ report, rows }, null, 2))
} else {
  const pct = (n) => `${n} (${((n / rows.length) * 100).toFixed(1)}%)`
  console.log(`HEAD DEBT — ${rows.length} files${areaArg ? ` in ${areaArg}/` : ''}\n`)
  const order = [
    'title_over_60', 'title_missing', 'desc_over_160', 'desc_missing',
    'canonical_not_self', 'canonical_missing', 'missing_viewport',
    'missing_og_title', 'missing_og_desc', 'missing_schema', 'missing_article_schema',
    'missing_faqpage', 'missing_breadcrumb_schema', 'missing_h1', 'multi_h1',
    'missing_lang', 'thin_under_300w', 'thin_under_600w',
  ]
  for (const k of order) console.log(`  ${k.padEnd(26)} ${String(report[k]).padStart(5)}  ${pct(report[k])}`)

  const byArea = new Map()
  for (const r of rows) {
    const a = r.file.includes('/') ? r.file.split('/')[0] : '(root)'
    if (!byArea.has(a)) byArea.set(a, [])
    byArea.get(a).push(r)
  }
  console.log('\nBY AREA — files / title>60 / desc>160 / no-schema / thin<300w')
  for (const [a, rs] of [...byArea].sort((x, y) => y[1].length - x[1].length)) {
    console.log(
      `  ${a.padEnd(16)} ${String(rs.length).padStart(4)}` +
      `  ${String(rs.filter((r) => r.titleLong).length).padStart(6)}` +
      `  ${String(rs.filter((r) => r.descLong).length).padStart(7)}` +
      `  ${String(rs.filter((r) => !r.hasLdJson).length).padStart(8)}` +
      `  ${String(rs.filter((r) => r.words < 300).length).padStart(8)}`,
    )
  }
}
