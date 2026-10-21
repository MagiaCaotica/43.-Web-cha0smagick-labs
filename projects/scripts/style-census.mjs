import fs from "node:fs"
import path from "node:path"

const ROOT = process.cwd()
const DEPLOY_DIRS = ['', 'apps', 'books', 'blog', 'tools', 'pages', 'landing-pages', 'lead-magnet', 'es']
const files = []
for (const d of DEPLOY_DIRS) {
  const dir = path.join(ROOT, d)
  if (!fs.existsSync(dir)) continue
  for (const f of fs.readdirSync(dir)) if (f.endsWith('.html')) files.push(path.join(d, f))
}

const groups = new Map()
for (const rel of files) {
  const h = fs.readFileSync(path.join(ROOT, rel), 'utf8')
  const css = [...h.matchAll(/<link[^>]*href="([^"]+\.css[^"]*)"[^>]*>/gi)].map((m) => m[1])
  const inline = (h.match(/<style[^>]*>[\s\S]*?<\/style>/gi) || []).length
  const key = css.length ? css.join(' | ') : '(sin css)'
  const bucket = groups.get(key) || { n: 0, inline: 0, sample: [] }
  bucket.n++
  bucket.inline += inline
  if (bucket.sample.length < 3) bucket.sample.push(rel)
  groups.set(key, bucket)
}
console.log('=== COMO CARGAN EL CSS LAS PAGINAS ===')
for (const [k, v] of [...groups.entries()].sort((a, b) => b[1].n - a[1].n)) {
  console.log(`\n${v.n} paginas | inline=${v.inline} | ${k}`)
  console.log(`   ej: ${v.sample.join(', ')}`)
}
console.log(`\ntotal paginas: ${files.length}, grupos: ${groups.size}`)
