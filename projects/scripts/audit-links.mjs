#!/usr/bin/env node
/**
 * Enlaces internos rotos y contenido mixto (http:// en paginas https://).
 * Los dos elementos de la auditoria tecnica SEO que no cubre audit-indexation.
 *
 *   node projects/scripts/audit-links.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { execSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
const SITE = 'https://cha0smagicklabs.com'

const tracked = execSync('git ls-files', { cwd: ROOT, maxBuffer: 64 * 1024 * 1024 }).toString().split('\n').filter(Boolean)
const htmlFiles = tracked.filter((f) => f.endsWith('.html'))
const exists = new Set(tracked)

const rotos = new Map()      // url destino -> Set(origenes)
const mixto = new Map()      // recurso http -> Set(origenes)
const externos = new Set()

for (const rel of htmlFiles) {
  const h = fs.readFileSync(path.join(ROOT, rel), 'utf8')
  const body = h.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ')
  for (const m of body.matchAll(/(?:href|src)=["']([^"']+)["']/gi)) {
    const u = m[1]
    if (/^(mailto:|tel:|javascript:|data:|#)/i.test(u)) continue
    // contenido mixto: recursos http:// en una pagina que se sirve por https
    if (/^http:\/\//i.test(u)) {
      if (!mixto.has(u)) mixto.set(u, new Set())
      mixto.get(u).add(rel)
      externos.add(u)
      continue
    }
    if (/^https?:\/\//i.test(u)) { externos.add(u); continue }
    if (u.startsWith('/')) {
      const target = u.split('#')[0].split('?')[0].replace(/^\//, '')
      if (!target) continue
      const cand = exists.has(target) ? target
        : (exists.has(path.posix.join(target, 'index.html')) ? path.posix.join(target, 'index.html') : null)
      if (!cand) {
        if (!rotos.has(target)) rotos.set(target, new Set())
        rotos.get(target).add(rel)
      }
    }
  }
}

console.log('=== ENLACES INTERNOS ROTOS Y CONTENIDO MIXTO ===')
console.log('paginas revisadas: ' + htmlFiles.length)
console.log('destinos internos rotos: ' + rotos.size)
console.log('recursos http:// en paginas https: ' + mixto.size)
console.log('')
if (rotos.size) {
  console.log('-- ROTOS (destino <- quien lo enlaza) --')
  for (const [t, srcs] of [...rotos].sort((a, b) => b[1].size - a[1].size).slice(0, 20)) {
    console.log(`   ${t}   <- ${[...srcs].slice(0, 3).join(', ')}${srcs.size > 3 ? ' (+' + (srcs.size - 3) + ')' : ''}`)
  }
  if (rotos.size > 20) console.log('   ... +' + (rotos.size - 20) + ' mas')
}
if (mixto.size) {
  console.log('-- CONTENIDO MIXTO --')
  for (const [u, srcs] of [...mixto].slice(0, 12)) console.log(`   ${u}   <- ${[...srcs].slice(0, 2).join(', ')}`)
  if (mixto.size > 12) console.log('   ... +' + (mixto.size - 12) + ' mas')
}
if (!rotos.size && !mixto.size) console.log('OK: ni enlaces internos rotos ni contenido mixto.')

fs.mkdirSync(path.join(ROOT, 'data', 'guerrilla'), { recursive: true })
fs.writeFileSync(path.join(ROOT, 'data', 'guerrilla', 'links-audit.json'), JSON.stringify({
  generated: new Date().toISOString(),
  rotos: [...rotos].map(([t, s]) => ({ destino: t, origenes: [...s] })),
  mixto: [...mixto].map(([u, s]) => ({ recurso: u, origenes: [...s] })),
}, null, 2))
console.log('\nescrito data/guerrilla/links-audit.json')
