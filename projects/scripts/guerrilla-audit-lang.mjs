#!/usr/bin/env node
/**
 * Auditoria de idioma del copy: ninguna mezcla ES/EN dentro de un email.
 * Un email a un lead en ingles con frases en spanish lo confunde y lo enfada:
 * se marca como spam y no vuelve.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
const DIR = path.join(ROOT, 'data', 'guerrilla')

const queue = JSON.parse(fs.readFileSync(path.join(DIR, 'queue2.json'), 'utf8'))

// marcadores tipicos de cada idioma
const EN_MARKERS = [
  'the book bundle', 'Say the word', 'the rest that fits', 'if you want the lot',
  'paid monthly through Hotmart', 'no reply needed', 'promo code', 'one-time-purchase',
  'Best,', 'Hi ', 'this would be useful', 'your package', 'your repo', 'free to use',
  '90-day cookie', 'and no minimum payout', 'share cards', 'your subscribers',
]
const ES_MARKERS = [
  'el bundle de 9 libros', 'te paso el código', 'lo demás que encaja', 'si te lo quieres llevar todo',
  'pago mensual por Hotmart', 'no hace falta que me respondas', 'código de promo', 'pago único',
  'Un saludo,', 'Hola ', 'esto os puede servir', 'tu paquete', 'tu repo', 'sin API key',
  'cookie de 90 días', 'sin mínimo de cobro', 'tarjeta 1080', 'tus suscriptores',
]

const problems = []
for (const q of queue) {
  const body = q.body
  const subj = q.subject
  const text = subj + '\n' + body
  if (q.lang === 'EN') {
    const hits = ES_MARKERS.filter((m) => text.includes(m))
    if (hits.length) problems.push({ to: q.to, lang: 'EN', expected: 'inglés', found: hits, subject: subj })
  } else {
    const hits = EN_MARKERS.filter((m) => text.includes(m))
    if (hits.length) problems.push({ to: q.to, lang: 'ES', expected: 'español', found: hits, subject: subj })
  }
}

const byLang = {}
for (const q of queue) byLang[q.lang] = (byLang[q.lang] || 0) + 1
console.log('=== AUDITORIA DE IDIOMA ===')
console.log('emails:', queue.length, '| por idioma:', JSON.stringify(byLang))
console.log('problemas:', problems.length)
for (const p of problems.slice(0, 12)) {
  console.log(` - ${p.to} (${p.lang}) sujeto="${p.subject}" -> markers de ${p.expected}: ${p.found.join(' | ')}`)
}

// ademas: los subjects con el nombre de la organizacion deben ser distintos
const subs = new Map()
for (const q of queue) subs.set(q.subject, (subs.get(q.subject) || 0) + 1)
const dupes = [...subs.entries()].filter(([, n]) => n > 3).sort((a, b) => b[1] - a[1])
console.log('asuntos repetidos (>3):', dupes.length, dupes.slice(0, 5).map(([s, n]) => `${n}x "${s}"`).join(' ; '))

// cuentas de rol como saludo
const roleSal = queue.filter((q) =>
  /^Hola (Admin|Info|Contact|Contacto|Support|Mail|Webmaster|Hello|Equipo|Staff),?$/m.test(q.body) ||
  /^Hi (Admin|Info|Contact|Support|Mail|Webmaster|Hello|Team),?$/m.test(q.body))
console.log('salutaciones con cuenta de rol:', roleSal.length, roleSal.slice(0, 5).map((q) => q.to).join(', '))

process.exitCode = problems.length ? 1 : 0
