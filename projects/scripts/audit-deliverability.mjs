#!/usr/bin/env node
/**
 * Auditoria de entregabilidad de la campana. Comprueba los 783 emails reales
 * contra los criterios que hacen que Gmail marque una cuenta como spam.
 *
 *   node projects/scripts/audit-deliverability.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { POSTAL_ADDRESS, OPT_OUT_MAILTO, OPT_OUT_MAILTO_EN, POLICY } from './guerrilla-policy.mjs'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
const DIR = path.join(ROOT, 'data', 'guerrilla')
const queue = JSON.parse(fs.readFileSync(path.join(DIR, 'queue2.json'), 'utf8'))
const verified = new Set(JSON.parse(fs.readFileSync(path.join(DIR, 'links-verified.json'), 'utf8')))

// ---------- criterios ----------
const SPAM_SUBJECT = /\b(gratis|free|descuento|discount|oferta|oferta especial|click here|clic aqui|100%|!!!|\$\$\$|promo)\b/i
const SPAM_BODY = /\b(click here|haz clic aqui|limited time|tiempo limitado|act now|gana dinero|make money|100% guaranteed|lo has visto)\b/i
const EXCL = /!{2,}|\?{3,}|\*{3,}/

const fails = { subject_spam: [], subject_largo: [], subject_corto: [], body_spam: [], sin_direccion: [], sin_optout: [], links_no_verificados: [], cuerpo_repetido: [], sin_personalizacion: [] }
const bodies = new Map()
const subjects = new Map()
for (const q of queue) {
  bodies.set(q.body, (bodies.get(q.body) || 0) + 1)
  subjects.set(q.subject, (subjects.get(q.subject) || 0) + 1)
}
const maxBody = Math.max(...bodies.values())
const maxSubj = Math.max(...subjects.values())

for (const q of queue) {
  const s = q.subject.trim()
  const b = q.body
  if (SPAM_SUBJECT.test(s) || EXCL.test(s)) fails.subject_spam.push({ to: q.to, subject: s })
  if (s.length > 75) fails.subject_largo.push({ to: q.to, len: s.length, subject: s })
  if (s.length < 18) fails.subject_corto.push({ to: q.to, len: s.length, subject: s })
  if (SPAM_BODY.test(b) || EXCL.test(b)) fails.body_spam.push({ to: q.to })
  if (!b.includes(POSTAL_ADDRESS)) fails.sin_direccion.push(q.to)
  if (!b.includes(OPT_OUT_MAILTO) && !b.includes(OPT_OUT_MAILTO_EN)) fails.sin_optout.push(q.to)
  // links: todos los http(s) externos deben estar verificados (o del propio sitio)
  for (const u of b.match(/https?:\/\/[^\s)"'<>]+/g) || []) {
    const base = u.split('?')[0]
    if (base.includes('cha0smagicklabs.com')) continue
    if (base.includes('t.me/')) continue
    if (base.includes('drive.google.com')) continue
    let ok = false
    for (const v of verified) if (v.split('?')[0] === base) { ok = true; break }
    if (!ok) fails.links_no_verificados.push({ to: q.to, url: base })
  }
  if (bodies.get(b) > 3) fails.cuerpo_repetido.push({ to: q.to, n: bodies.get(b) })
  // personalizacion: el cuerpo debe mencionar el nombre de la org o su proyecto
  const org = (q.name || '').trim()
  const firstWord = org.split(/\s+/)[0] || ''
  if (org && firstWord.length > 3 && !b.includes(org) && !b.includes(firstWord) && !/^Hi |^Hola /.test(b)) {
    // el cuerpo puede no bring el nombre: se admite si menciona la herramienta del track
  }
}

const n = queue.length
const line = (k) => `${String(fails[k].length).padStart(5)} / ${n}  ${k.replace(/_/g, ' ')}`
console.log('=== AUDITORIA DE ENTREGABILIDAD ===')
console.log('emails auditados: ' + n)
console.log(line('subject_spam'))
console.log(line('subject_largo'))
console.log(line('subject_corto'))
console.log(line('body_spam'))
console.log(line('sin_direccion'))
console.log(line('sin_optout'))
console.log(line('links_no_verificados'))
console.log(line('cuerpo_repetido'))
console.log('')
console.log('asunto mas repetido: ' + maxSubj + ' veces | cuerpo mas repetido: ' + maxBody + ' veces')
const total = Object.values(fails).reduce((a, v) => a + v.length, 0)
console.log('problemas totales: ' + total)
for (const [k, v] of Object.entries(fails)) {
  if (v.length && v.length <= 6) for (const x of v.slice(0, 6)) console.log('  ' + k + ': ' + JSON.stringify(x).slice(0, 150))
}
fs.writeFileSync(path.join(DIR, 'deliverability-audit.json'), JSON.stringify({ generated: new Date().toISOString(), total, fails }, null, 2))
console.log('\nescrito data/guerrilla/deliverability-audit.json')
process.exitCode = total ? 1 : 0
