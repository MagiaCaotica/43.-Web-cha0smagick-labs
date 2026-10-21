#!/usr/bin/env node
/**
 * Politica de envio para que Gmail NO catalogue la cuenta como spam.
 *
 * LIMITES REALES de una cuenta personal de Gmail (consumer, no Workspace):
 *   - 500 mensajes/dia es el tope que muestra Google. Superarlo bloquea 24 h;
 *     insistir con el bloque alarga el castigo a semanas.
 *   - Google corta el envio en torno al 0,3% de quejas. Con 50 correos, 1 queja
 *     ya es el 2% -> por eso el watchdog para con la primera.
 *   - Una rafaga (20 correos en 4 minutos) desde una cuenta que suele mandar
 *     2 al dia es la senal clasica de spam, aunque cada correo sea perfecto.
 *   - Los rebotes a direcciones muertas tambien penalizan.
 *
 * POLITICAS que aplica este modulo:
 *   1. Tope diario con RAMPA de calentamiento (20, 30, 40, 50...).
 *   2. Pausa aleatoria de 3 a 8 minutos entre correos.
 *   3. Maximo 1 correo por dominio y dia.
 *   4. Watchdog de quejas: 1 queja -> parar.
 *   5. Watchdog de rebotes: 3 rebotes -> parar.
 *   6. Horario de envio 09:00-20:00 hora local, dias laborables.
 *   7. Contador persistente en disco: reiniciar el runner no reinicia el tope.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
const DIR = path.join(ROOT, 'data', 'guerrilla')
const BUDGET_FILE = path.join(DIR, 'daily-budget.json')

// Direccion postal que se incluye en el pie de CAN-SPAM.
export const POSTAL_ADDRESS = process.env.POSTAL_ADDRESS || 'Calle 40a #20-35, Bogotá, Colombia'

export const POLICY = {
  // Tope diario que fija el maestro: 50 correos al dia, ni uno mas.
  // Ademas se aplica RAMPA DE CALENTAMIENTO: una cuenta que ayer mandaba 2
  // correos y hoy manda 50 es el patron clasico de spam, aunque cada correo
  // sea perfecto. Dia 1 = 20, +10 por dia hasta 50.
  RAMP_START: 20,
  RAMP_STEP: 10,
  MAX_DAY: 50,
  // 1 correo por dominio y dia: dos al mismo dominio ya huele a lista.
  MAX_PER_DOMAIN: 1,
  // Pausa entre correos. 90-210 s seguia siendo rafaga para una cuenta
  // personal: se sube a 3-8 minutos con jitter.
  MIN_GAP_SECONDS: 180,
  MAX_GAP_SECONDS: 480,
  COMPLAINT_THRESHOLD: 1, // 1 queja de spam -> parar y revisar
  BOUNCE_THRESHOLD: 3,   // 3 rebotes -> parar (senal de lista a direcciones muertas)
  // Horario de envio en hora local (la audiencia es LATAM + ES).
  HOUR_FROM: 9,
  HOUR_TO: 20,
}

/** El opt-out como enlace real: un clic y fuera, sin tener que responder. */
const OPT_BASE = 'mailto:magiacaoticapractica@gmail.com?subject='
export const OPT_OUT_MAILTO =
  OPT_BASE + 'BAJA&body=Por%20favor%20darme%20de%20baja%20de%20los%20correos%20de%20Cha0smagick%20Labs'
export const OPT_OUT_MAILTO_EN =
  OPT_BASE + 'UNSUBSCRIBE&body=Please%20unsubscribe%20me%20from%20Cha0smagick%20Labs%20emails'

const today = () => new Date().toISOString().slice(0, 10)

export function loadBudget() {
  try {
    const b = JSON.parse(fs.readFileSync(BUDGET_FILE, 'utf8'))
    if (b.date !== today()) return { date: today(), sent: [], domains: {}, days: (b.days || 0) + 1 }
    return { date: b.date, sent: b.sent || [], domains: b.domains || {}, days: b.days || 1 }
  } catch {
    return { date: today(), sent: [], domains: {}, days: 1 }
  }
}

export function saveBudget(b) {
  fs.mkdirSync(DIR, { recursive: true })
  fs.writeFileSync(BUDGET_FILE, JSON.stringify(b, null, 2))
}

/** Tope del dia con rampa de calentamiento. */
export function maxForToday(b) {
  const ramp = POLICY.RAMP_START + (b.days - 1) * POLICY.RAMP_STEP
  return Math.min(POLICY.MAX_DAY, ramp)
}

export function canSend(email, budget = loadBudget()) {
  const key = email.toLowerCase()
  if (budget.sent.includes(key)) return { ok: false, reason: 'ya enviado hoy' }
  const limit = maxForToday(budget)
  if (budget.sent.length >= limit) return { ok: false, reason: `tope diario (${limit})` }
  const domain = (email.split('@')[1] || '').toLowerCase()
  const dcount = budget.domains[domain] || 0
  if (dcount >= POLICY.MAX_PER_DOMAIN) return { ok: false, reason: `tope de dominio (${domain})` }
  return { ok: true, limit, remaining: limit - budget.sent.length }
}

export function recordSent(email, budget = loadBudget()) {
  const key = email.toLowerCase()
  if (!budget.sent.includes(key)) budget.sent.push(key)
  const domain = (email.split('@')[1] || '').toLowerCase()
  budget.domains[domain] = (budget.domains[domain] || 0) + 1
  saveBudget(budget)
  return budget
}

/** Espera humana entre correos. */
export function gapMs() {
  const s = POLICY.MIN_GAP_SECONDS + Math.random() * (POLICY.MAX_GAP_SECONDS - POLICY.MIN_GAP_SECONDS)
  return Math.round(s * 1000)
}

/** Horario de enviar: dias laborables, 09:00-20:00 hora local. */
export function sendingWindow() {
  const d = new Date()
  const day = d.getDay()
  const hour = d.getHours()
  if (day === 0 || day === 6) return { ok: false, why: 'fin de semana' }
  if (hour < POLICY.HOUR_FROM || hour >= POLICY.HOUR_TO) return { ok: false, why: `fuera de horario (${hour}h)` }
  return { ok: true }
}

/**
 * Watchdog de quejas: mira los correos recibidos de los destinatarios de la
 * campana y cuenta los que dicen "spam"/"basura". Si hay quejas, se para.
 */
const SPAM_WORDS = /\b(spam|basura|mail basura|unsubscribe|dar de baja|scam|estafa|bloquear el remitente)\b/i
export function detectComplaints(inboxTexts = []) {
  const hits = inboxTexts.filter((t) => SPAM_WORDS.test(t))
  return { complaints: hits.length, samples: hits.slice(0, 3) }
}

/**
 * Rebotes: una cuenta que manda a direcciones muertas acumula rebotes y eso
 * tambien es senal de spam. Se cuentan los "delivery status notification".
 */
const BOUNCE_WORDS = /delivery status notification|mail delivery failed|undeliverable|no se pudo entregar|destinatario no v[aá]lido|mailer-daemon/i
export function detectBounces(inboxTexts = []) {
  const hits = inboxTexts.filter((t) => BOUNCE_WORDS.test(t))
  return { bounces: hits.length, samples: hits.slice(0, 3) }
}
