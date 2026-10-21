#!/usr/bin/env node
/**
 * Corrector de consistencia de estilo.
 *
 * 1) La familia blog/es-*.html lleva su propio tema (azul/cian, Helvetica).
 *    Se remapea a la paleta del sitio (negro + oro, Segoe UI) sin tocar su
 *    maquetacion, para que no se vea como otra web.
 * 2) Se quitan los <link> duplicados a la misma hoja (habia ~170 paginas con
 *    style.min.css dos veces).
 * 3) Se anade la hoja del sitio a las paginas que solo enlazaban wisdom.css.
 * 4) Se corrigen rutas absolutas (/css/...) que en GitHub Pages dan 404.
 *
 * Los generadores (scripts/gen-es-*.mjs) se parchean con el mismo remape, para
 * que lo que se regenere en el futuro salga igual.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
const DEPLOY_DIRS = ['', 'apps', 'books', 'blog', 'tools', 'pages', 'landing-pages', 'lead-magnet', 'es']

// ---------- 1) remape del tema es-* a la paleta del sitio ----------
const REMAP = [
  [/--bg:#0a0a12/gi, '--bg:#030303'],
  [/--card:#141424/gi, '--card:#0a0a0a'],
  [/--amber:#ffb03a/gi, '--amber:#c0a060'],
  [/--cyan:#35c4d9/gi, '--cyan:#c0a060'],
  [/--txt:#e8e8f4/gi, '--txt:#f0f0f0'],
  [/--mut:#9aa0c0/gi, '--mut:#a0a0a0'],
  [/--bd:#2a2a44/gi, '--bd:#1a1a1a'],
  [/linear-gradient\(135deg,#0f0f1e,#1a1a30\)/gi, 'linear-gradient(135deg,#0a0a0a,#121212)'],
  [/\.claimbar\{background:#1c1408/gi, '.claimbar{background:#0a0a0a'],
  [/font:16px\/1\.7 'Helvetica Neue',Arial,sans-serif/gi, "font:16px/1.7 'Segoe UI','Roboto','Helvetica Neue',Arial,sans-serif"],
  [/color:#14100a/gi, 'color:#030303'],
  [/a\{color:var\(--cyan\)\}/gi, 'a{color:var(--amber)}a:hover{color:#ffd700}'],
]
function remapTheme(s) {
  let out = s
  for (const [re, to] of REMAP) out = out.replace(re, to)
  return out
}

// ---------- inventario ----------
const files = []
for (const d of DEPLOY_DIRS) {
  const dir = path.join(ROOT, d)
  if (!fs.existsSync(dir)) continue
  for (const f of fs.readdirSync(dir)) if (f.endsWith('.html')) files.push(path.join(d, f))
}

const report = { temaRemapeado: [], cssDuplicado: [], cssAnadido: [], rutaAbsoluta: [] }

// ---------- 2) deduplicar <link> de estilosheet ----------
function dedupeStylesheets(html) {
  const seen = new Set()
  let changed = false
  const out = html.replace(/<link[^>]*rel=["']stylesheet["'][^>]*>\s*/gi, (tag) => {
    const href = (tag.match(/href=["']([^"']+)["']/i) || [, ''])[1]
    const key = href.split('?')[0]
    if (seen.has(key)) { changed = true; return '' }
    seen.add(key)
    return tag
  })
  return { out, changed }
}

// ---------- 3) anadir la hoja del sitio si falta ----------
function ensureSiteCss(html, rel) {
  if (/href="[^"]*css\/style(\.min)?\.css"/.test(html)) return { out: html, changed: false }
  // ruta relativa segun la profundidad de la pagina
  const depth = rel.replace(/\\/g, '/').split('/').length - 1
  const prefix = depth ? '../'.repeat(depth) : ''
  const link = `<link rel="stylesheet" href="${prefix}css/style.min.css">\n`
  // justo despues del <head>
  const m = html.match(/<head[^>]*>/i)
  if (!m) return { out: html, changed: false }
  const at = m.index + m[0].length
  return { out: html.slice(0, at) + '\n' + link + html.slice(at), changed: true }
}

// ---------- 4) rutas absolutas ----------
function fixAbsolute(html, rel) {
  const depth = rel.replace(/\\/g, '/').split('/').length - 1
  const prefix = depth ? '../'.repeat(depth) : ''
  const out = html.replace(/(href|src)=["']\/css\/([^"']+)["']/gi, (m, a, p) => `${a}="${prefix}css/${p}"`)
  return { out, changed: out !== html }
}

for (const rel of files) {
  const full = path.join(ROOT, rel)
  let html = fs.readFileSync(full, 'utf8')
  const before = html

  // tema es-*
  if (/--bg:#0a0a12|--amber:#ffb03a|--cyan:#35c4d9/.test(html)) {
    html = remapTheme(html)
    report.temaRemapeado.push(rel)
  }
  // rutas absolutas
  const abs = fixAbsolute(html, rel)
  if (abs.changed) { html = abs.out; report.rutaAbsoluta.push(rel) }
  // css duplicado
  const dd = dedupeStylesheets(html)
  if (dd.changed) { html = dd.out; report.cssDuplicado.push(rel) }
  // falta la hoja del sitio (solo si la pagina usa markup del sitio)
  if (!/href="[^"]*css\/style(\.min)?\.css"/.test(html) && /class="[^"]*\b(site-header|site-footer|container)\b/.test(html)) {
    const ens = ensureSiteCss(html, rel)
    if (ens.changed) { html = ens.out; report.cssAnadido.push(rel) }
  }

  if (html !== before) fs.writeFileSync(full, html, 'utf8')
}

// ---------- 5) los generadores ----------
const genDir = path.join(ROOT, 'scripts')
let gens = 0
if (fs.existsSync(genDir)) {
  for (const f of fs.readdirSync(genDir)) {
    if (!/^gen-es-.*\.mjs$/.test(f)) continue
    const p = path.join(genDir, f)
    const src = fs.readFileSync(p, 'utf8')
    if (!/--bg:#0a0a12|--amber:#ffb03a/.test(src)) continue
    fs.writeFileSync(p, remapTheme(src), 'utf8')
    gens++
  }
}

console.log('=== CORRECTOR DE ESTILO ===')
console.log('paginas revisadas      :', files.length)
console.log('tema es-* remapeado    :', report.temaRemapeado.length)
console.log('css duplicado eliminado:', report.cssDuplicado.length)
console.log('hoja del sitio anadida :', report.cssAnadido.length)
console.log('rutas absolutas fijadas:', report.rutaAbsoluta.length)
console.log('generadores parcheados :', gens)
if (report.cssAnadido.length) console.log('  + css ->', report.cssAnadido.join(', '))
if (report.rutaAbsoluta.length) console.log('  ruta ->', report.rutaAbsoluta.join(', '))
