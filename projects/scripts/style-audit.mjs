#!/usr/bin/env node
/**
 * Auditoria de consistencia de estilo del sitio.
 *
 * Comprueba, pagina a pagina de las que se despliegan:
 *  1. que enlacen la hoja de estilos del sitio (css/style.min.css)
 *  2. que no traigan hojas de estilo ajenas
 *  3. que no usen colores fuera de la paleta del sitio
 *  4. que tengan la cabecera y el pie estandar
 *  5. que no traigan estilos inline que dupliquen el CSS
 *
 * Salida: data/guerrilla/style-audit.json + resumen por consola.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
const DEPLOY_DIRS = ['', 'apps', 'books', 'blog', 'tools', 'pages', 'landing-pages', 'lead-magnet', 'es']

// ---------- paleta ----------
const cssFiles = ['css/style.css', 'css/style.min.css']
  .filter((f) => fs.existsSync(path.join(ROOT, f)))
  .map((f) => fs.readFileSync(path.join(ROOT, f), 'utf8'))
  .join('\n')
const palette = new Set((cssFiles.match(/#[0-9a-fA-F]{3,8}\b/g) || []).map((c) => c.toLowerCase()))

// Colores de marca de terceros que si son legitimos (Play, Telegram, WhatsApp...)
const ALLOWED_EXTRA = new Set([
  '#0f9d58', '#0b1026', '#ffb03a', '#f59e0b', '#4a9eff', '#25d366', '#0088cc',
  '#e5e7eb', '#f3f4f6', '#111827', '#1f2937', '#374151', '#6b7280', '#9ca3af',
  '#d1d5db', '#e5e7eb', '#ffffff', '#fff', '#000', '#000000', '#030303',
])

const norm = (c) => c.toLowerCase()

// ---------- inventario ----------
const files = []
for (const d of DEPLOY_DIRS) {
  const dir = path.join(ROOT, d)
  if (!fs.existsSync(dir)) continue
  for (const f of fs.readdirSync(dir)) {
    if (f.endsWith('.html')) files.push(path.join(d, f))
  }
}

const issues = []
const stats = { total: files.length, sinCss: [], cssAjeno: [], colorRaro: [], sinHeader: [], sinFooter: [], estilosInline: [] }

for (const rel of files) {
  const html = fs.readFileSync(path.join(ROOT, rel), 'utf8')
  const problems = []

  // 1) hoja de estilos del sitio
  const hasSiteCss = /href="[^"]*css\/style(\.min)?\.css"/.test(html)
  if (!hasSiteCss) {
    stats.sinCss.push(rel)
    problems.push('sin css/style.min.css')
  }

  // 2) hojas ajenas
  const stylesheets = [...html.matchAll(/<link[^>]+rel=["']stylesheet["'][^>]*href=["']([^"']+)["']/gi)].map((m) => m[1])
  for (const s of stylesheets) {
    if (!/style(\.min)?\.css/.test(s)) {
      stats.cssAjeno.push({ file: rel, css: s })
      problems.push('css ajeno: ' + s)
    }
  }

  // 3) colores fuera de paleta (en estilos inline y en style blocks)
  const colorRe = /#[0-9a-fA-F]{3,8}\b/g
  const own = new Set()
  let m
  while ((m = colorRe.exec(html))) own.add(m[0].toLowerCase())
  const odd = [...own].filter((c) => !palette.has(norm(c)) && !ALLOWED_EXTRA.has(norm(c)))
  if (odd.length) {
    stats.colorRaro.push({ file: rel, colors: odd.slice(0, 8) })
    problems.push('colores fuera de paleta: ' + odd.slice(0, 6).join(', '))
  }

  // 4) cabecera y pie estandar
  if (!/site-header/.test(html)) { stats.sinHeader.push(rel); problems.push('sin cabecera del sitio') }
  if (!/site-footer/.test(html)) { stats.sinFooter.push(rel); problems.push('sin pie del sitio') }

  // 5) estilos inline (<style> dentro de la pagina)
  const inlineBlocks = (html.match(/<style[^>]*>[\s\S]*?<\/style>/gi) || [])
  const bigInline = inlineBlocks.filter((b) => b.length > 1200)
  if (bigInline.length) {
    stats.estilosInline.push({ file: rel, blocks: bigInline.length, bytes: bigInline.reduce((a, b) => a + b.length, 0) })
    problems.push(`${bigInline.length} bloque(s) <style> grande(s) (${bigInline.reduce((a, b) => a + b.length, 0)} bytes)`)
  }

  if (problems.length) issues.push({ file: rel, problems })
}

fs.mkdirSync(path.join(ROOT, 'data', 'guerrilla'), { recursive: true })
fs.writeFileSync(path.join(ROOT, 'data', 'guerrilla', 'style-audit.json'), JSON.stringify({ stats, issues }, null, 2))

console.log('=== AUDITORIA DE ESTILO ===')
console.log('paginas auditadas:', stats.total)
console.log('sin css/style.min.css :', stats.sinCss.length)
console.log('css ajeno              :', stats.cssAjeno.length)
console.log('colores fuera de paleta:', stats.colorRaro.length)
console.log('sin cabecera           :', stats.sinHeader.length)
console.log('sin pie                :', stats.sinFooter.length)
console.log('estilos inline grandes :', stats.estilosInline.length)
if (stats.sinCss.length) console.log('  sin css ->', stats.sinCss.slice(0, 12).join(', '))
if (stats.cssAjeno.length) console.log('  css ajeno ->', stats.cssAjeno.slice(0, 8).map((x) => x.file + ' (' + x.css + ')').join(' | '))
if (stats.colorRaro.length) {
  console.log('  colores raros:')
  for (const c of stats.colorRaro.slice(0, 20)) console.log('   ', c.file, '->', c.colors.join(', '))
}
if (stats.sinHeader.length) console.log('  sin cabecera ->', stats.sinHeader.slice(0, 10).join(', '))
if (stats.sinFooter.length) console.log('  sin pie ->', stats.sinFooter.slice(0, 10).join(', '))
if (stats.estilosInline.length) {
  console.log('  estilos inline:')
  for (const c of stats.estilosInline.slice(0, 12)) console.log('   ', c.file, '->', c.blocks, 'bloques', c.bytes, 'bytes')
}
