#!/usr/bin/env node
/**
 * Construye la cola ad-hoc: combina leads limpios + grounding real (visitado con
 * BrowserOS) y genera un email por lead. Marca cuales tienen grounding real
 * (los que llevan su web/nombre) y cuales no.
 * Uso: node guerrilla-queue2.mjs [segment] [limite]
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildEmailAdHoc } from './guerrilla-copy2.mjs'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
const DIR = path.join(ROOT, 'data', 'guerrilla')

const segArg = process.argv[2] || 'all'
const limit = Number(process.argv[3] || 0)

// ---------- grounding: jsonl del navegador + grounding.json previo ----------
const grounding = {}
try { Object.assign(grounding, JSON.parse(fs.readFileSync(path.join(DIR, 'grounding.json'), 'utf8'))) } catch {}
const jl = path.join(DIR, 'grounding-collected.jsonl')
if (fs.existsSync(jl)) {
  for (const line of fs.readFileSync(jl, 'utf8').split(/\r?\n/)) {
    if (!line.trim()) continue
    let parsed = null
    try { parsed = JSON.parse(line) } catch { continue }
    for (const r of parsed.data || []) {
      if (!r?.ok) continue
      const v = r.value || {}
      const dead = /Error de privacidad|No se puede acceder|est\xe1 a la venta|Un momento|Robot Challenge|chrome-error|sgcaptcha|forsale/i.test(
        (v.title || '') + ' ' + (v.final || '') + ' ' + (v.h1 || ''))
      if (dead) continue
      const key = r.email.toLowerCase()
      grounding[key] = {
        name: r.name || '',
        segment: r.segment || '',
        domain: r.domain || '',
        kind: 'sitio',
        site: v.final,
        title: v.title || '',
        desc: v.desc || '',
        h1: v.h1 || '',
        posts: v.posts || [],
        yt: v.yt || [],
      }
    }
  }
}
fs.writeFileSync(path.join(DIR, 'grounding-merged.json'), JSON.stringify(grounding, null, 2))

// ---------- ya enviados / suprimidos ----------
const already = new Set()
for (const f of ['already-sent.txt']) {
  const p = path.join(DIR, f)
  if (fs.existsSync(p)) for (const l of fs.readFileSync(p, 'utf8').split(/\r?\n/)) {
    const m = l.match(/[\w.+-]+@[\w.-]+\.\w+/)
    if (m) already.add(m[0].toLowerCase())
  }
}
const sup = path.join(DIR, 'suppression.csv')
if (fs.existsSync(sup)) {
  for (const l of fs.readFileSync(sup, 'utf8').split(/\r?\n/).slice(1)) {
    const m = l.match(/"?([\w.+-]+@[\w.-]+\.\w+)"?/)
    if (m) already.add(m[1].toLowerCase())
  }
}

const clean = JSON.parse(fs.readFileSync(path.join(DIR, 'leads-clean.json'), 'utf8')).leads
const ORDER = { 'partner-youtube': 0, 'partner-media': 1, 'colectivas-paranormal': 2, 'github-dev': 3, 'pypi-dev': 4, 'npm-dev': 5 }

const picked = clean
  .filter((l) => (segArg === 'all' ? true : l.segment === segArg))
  .filter((l) => !already.has(l.email.toLowerCase()))
  .sort((a, b) => (ORDER[a.segment] ?? 9) - (ORDER[b.segment] ?? 9) || b.intent - a.intent)
  .slice(0, limit || undefined)

// La cola COMPLETA va siempre a queue2.json; el subconjunto filtrado a otro
// fichero, para no dejar la cola truncada por una inspeccion.
const full = clean
  .filter((l) => !already.has(l.email.toLowerCase()))
  .sort((a, b) => (ORDER[a.segment] ?? 9) - (ORDER[b.segment] ?? 9) || b.intent - a.intent)

const queue = []
const errors = []
for (const lead of picked) {
  try {
    const e = buildEmailAdHoc(lead, { grounding, source: 'guerrilla' })
    const g = grounding[lead.email.toLowerCase()]
    queue.push({
      to: e.to, subject: e.subject, body: e.body,
      name: lead.name || '', segment: lead.segment === 'grupo-calido' ? 'colectivas-paranormal' : lead.segment, lang: e.lang,
      track: e.track, freeApp: e.freeApp, apps: e.apps, books: e.books,
      grounded: !!(g && (g.kind === 'sitio' || g.guessName || (g.search && g.search.length))),
      groundKind: g?.kind || 'ninguno',
    })
  } catch (err) {
    errors.push(`${lead.email}: ${err.message}`)
  }
}


// cola completa (sin segment ni limite) -> queue2.json
const fullQueue = []
for (const lead of full) {
  try {
    const e = buildEmailAdHoc(lead, { grounding, source: 'guerrilla' })
    const g = grounding[lead.email.toLowerCase()]
    fullQueue.push({
      to: e.to, subject: e.subject, body: e.body,
      name: lead.name || '', segment: lead.segment === 'grupo-calido' ? 'colectivas-paranormal' : lead.segment, lang: e.lang,
      track: e.track, freeApp: e.freeApp, apps: e.apps, books: e.books,
      grounded: !!(g && (g.kind === 'sitio' || g.guessName || (g.search && g.search.length))),
      groundKind: g?.kind || 'ninguno',
    })
  } catch (err) { errors.push(`${lead.email}: ${err.message}`) }
}

fs.writeFileSync(path.join(DIR, 'queue2.json'), JSON.stringify(fullQueue, null, 2))
fs.writeFileSync(path.join(DIR, 'queue-pick.json'), JSON.stringify(queue, null, 2))

const stat = (fn) => queue.filter(fn).length
console.log(`cola: ${queue.length} (errores: ${errors.length})`)
console.log('por segmento :', JSON.stringify(queue.reduce((a, q) => (a[q.segment] = (a[q.segment] || 0) + 1, a), {})))
console.log('por idioma   :', JSON.stringify(queue.reduce((a, q) => (a[q.lang] = (a[q.lang] || 0) + 1, a), {})))
console.log('por track    :', JSON.stringify(queue.reduce((a, q) => (a[q.track] = (a[q.track] || 0) + 1, a), {})))
console.log(`con grounding real: ${stat((q) => q.grounded)} | sin grounding: ${stat((q) => !q.grounded)}`)
console.log(`asuntos unicos: ${new Set(queue.map((q) => q.subject)).size}/${queue.length}`)
console.log(`cuerpos unicos: ${new Set(queue.map((q) => q.body)).size}/${queue.length}`)
if (errors.length) console.log('errores:', errors.slice(0, 5))
if (process.env.SHOW) {
  const n = Number(process.env.SHOW)
  for (const q of queue.slice(0, n)) {
    console.log('\n=============================================')
    console.log('PARA  :', q.to, '|', q.segment, '|', q.track, '|', q.groundKind)
    console.log('ASUNTO:', q.subject)
    console.log(q.body)
  }
}
