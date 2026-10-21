import fs from "node:fs"
import path from "node:path"
const ROOT = process.cwd()
const SKIP = /node_modules|\.git\\|out\\|\.omo|\.codegraph|\.playwright-mcp|\.firecrawl|projects\\auto-shorts|projects\\docs/i

const groups = new Map()
function walk(d, n = 0) {
  if (n > 3) return
  let e = []
  try { e = fs.readdirSync(d, { withFileTypes: true }) } catch { return }
  for (const x of e) {
    const full = path.join(d, x.name)
    const rel = path.relative(ROOT, full)
    if (SKIP.test(rel)) continue
    if (x.isDirectory()) walk(full, n + 1)
    else if (x.name.endsWith('.html')) {
      const t = fs.readFileSync(full, 'utf8')
      const hasGtag = /googletagmanager\.com\/gtag\/js\?id=/.test(t)
      const hasConfig = /gtag\(\s*['"]config['"]/.test(t)
      const hasConsent = /consent/.test(t)
      const hasBridge = /analytics-bridge/.test(t)
      const key = hasGtag && hasConfig ? 'GA4 completo' : hasGtag ? 'gtag sin config' : 'SIN GA4'
      const g = groups.get(key) || { n: 0, files: [], sinConsent: 0, sinBridge: 0 }
      g.n++
      if (g.files.length < 6) g.files.push(rel)
      if (!hasConsent) g.sinConsent++
      if (!hasBridge) g.sinBridge++
      groups.set(key, g)
    }
  }
}
walk(ROOT)
console.log('=== INVENTARIO DE MEDICION POR PAGINA ===')
for (const [k, g] of [...groups.entries()].sort((a, b) => b[1].n - a[1].n)) {
  console.log(`\n${k}: ${g.n} paginas | sin consent: ${g.sinConsent} | sin analytics-bridge: ${g.sinBridge}`)
  console.log('   ej: ' + g.files.join(', '))
}

// donde estan los fallos, agrupados por carpeta
const bad = []
function walk2(d, n = 0) {
  if (n > 3) return
  let e = []
  try { e = fs.readdirSync(d, { withFileTypes: true }) } catch { return }
  for (const x of e) {
    const full = path.join(d, x.name)
    const rel = path.relative(ROOT, full)
    if (SKIP.test(rel)) continue
    if (x.isDirectory()) walk2(full, n + 1)
    else if (x.name.endsWith('.html')) {
      const t = fs.readFileSync(full, 'utf8')
      if (!/googletagmanager\.com\/gtag\/js\?id=/.test(t)) bad.push(rel)
    }
  }
}
walk2(ROOT)
const byDir = {}
for (const b of bad) { const d = b.includes('\\') ? b.split('\\')[0] : '(raiz)'; (byDir[d] = byDir[d] || []).push(b) }
console.log('\n=== PAGINAS SIN GA4, POR CARPETA ===')
for (const [d, list] of Object.entries(byDir).sort((a, b) => b[1].length - a[1].length)) {
  console.log(`  ${d}: ${list.length}`)
  console.log('     ' + list.slice(0, 5).join(', '))
}
console.log('\ntotal sin GA4: ' + bad.length)
fs.writeFileSync(path.join(ROOT, 'data', 'ga4-missing.json'), JSON.stringify(bad, null, 2))
