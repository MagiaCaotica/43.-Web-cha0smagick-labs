// Inventory tools/: word count per page + whether it is in sitemap.xml
// Dry-run only. Usage: node scripts/seo/inventory-tools.mjs [--json]
import fs from 'node:fs'
import path from 'node:path'

const ROOT = path.resolve(process.argv[2] ?? '.')
const DIR = 'tools'
const SITEMAP = path.join(ROOT, 'sitemap.xml')

function words(html) {
  const body = html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<[^>]+>/g, ' ')
  return (body.match(/[A-Za-zÁÉÍÓÚÜÑáéíóúüñ0-9][A-Za-zÁÉÍÓÚÜÑáéíóúüñ0-9'’-]*/g) ?? []).length
}

const sm = fs.existsSync(SITEMAP) ? fs.readFileSync(SITEMAP, 'utf8') : ''
const inSitemap = (loc) => sm.includes(`<loc>${loc}</loc>`)

const rows = []
for (const f of fs.readdirSync(path.join(ROOT, DIR)).filter((x) => x.endsWith('.html'))) {
  const html = fs.readFileSync(path.join(ROOT, DIR, f), 'utf8')
  const w = words(html)
  const loc = `https://cha0smagicklabs.com/${DIR}/${f}`
  rows.push({
    file: f,
    words: w,
    inSitemap: f === 'index.html' ? null : inSitemap(loc),
    hasH1: /<h1[\s>]/i.test(html),
    hasSchema: /application\/ld\+json/i.test(html),
    hasFaq: /FAQPage/i.test(html),
    hasDesc: /<meta name="description"/i.test(html),
    hasViewport: /name="viewport"/i.test(html),
    hasCanon: /rel="canonical"/i.test(html),
    hasOg: /property="og:title"/i.test(html),
    hasCrumb: /BreadcrumbList/i.test(html),
    hasFaqVisible: /<h2[^>]*>\s*(FAQ|Frecuentes|Preguntas)/i.test(html),
  })
}

rows.sort((a, b) => a.words - b.words)

if (process.argv.includes('--json')) {
  console.log(JSON.stringify(rows, null, 2))
} else {
  console.log('file | words | sm | h1 schema faq desc vp canon og crumb faqVis')
  for (const r of rows) {
    const y = (v) => (v === null ? '-' : v ? 'Y' : '.')
    console.log(
      [
        r.file.padEnd(42),
        String(r.words).padStart(5),
        String(r.inSitemap).padStart(2),
        y(r.hasH1),
        y(r.hasSchema),
        y(r.hasFaq),
        y(r.hasDesc),
        y(r.hasViewport),
        y(r.hasCanon),
        y(r.hasOg),
        y(r.hasCrumb),
        y(r.hasFaqVisible),
      ].join(' | '),
    )
  }
  const w = rows.map((r) => r.words)
  const thin = rows.filter((r) => r.words < 600)
  console.log(`\nTOTAL ${rows.length} | min ${Math.min(...w)} | max ${Math.max(...w)} | median ${w.sort((a, b) => a - b)[Math.floor(w.length / 2)]}`)
  console.log(`THIN (<600 words): ${thin.length}`)
  console.log(`  of those IN sitemap: ${thin.filter((r) => r.inSitemap).length}`)
  console.log(`  of those NOT in sitemap: ${thin.filter((r) => !r.inSitemap).length}`)
}