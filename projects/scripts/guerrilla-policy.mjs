#!/usr/bin/env node
/**
 * Politica de envio para que Gmail NO catalogue la cuenta como spam.
 *
 * Limites reales de una cuenta personal de Gmail (consumer, no Workspace):
 *   - 500 mensajes/dia es el tope que muestra Google. Superarlo bloquea 24h;
 *     insistir con el bloque alarga el castigo a semanas.
 *   - Google pide "< 0,3% de quejas" para no cortar el envio. Con 120 correos,
 *     1 queja ya es 0,83% -> por eso el watchdog corta antes.
 *   - Un patron de rafaga (muchos correos seguidos, mismo minuto) es la senal
 *     clasica de spam aunque el contenido sea bueno.
 *
 * Politicas que aplica este modulo:
 *   1. Tope diario conservador y con rampa (dia 1 bajo, luego sube).
 *   2. Pausa aleatoria entre correos: nunca dos seguidos rapido.
 *   3. Tope por dominio: no parecer una lista de correo.
 *   4. Watchdog de quejas: si llegan quejas de spam, se para.
 *   5. Contador persistente en disco: reiniciar el runner no reinicia el topo.
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
  MAX_DAY_1: 50,
  MAX_DAY_N: 50,
  MAX_PER_DOMAIN: 2,      // 2 al mismo dominio por dia (no parecer lista)
  MIN_GAP_SECONDS: 90,
  MAX_GAP_SECONDS: 210,
  COMPLAINT_THRESHOLD: 1, // 1 queja de spam -> parar y revisar
}

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

export function maxForToday(b) {
  return b.days <= 1 ? POLICY.MAX_DAY_1 : POLICY.MAX_DAY_N
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

/** Horario de enviar: dias laborables, 9:00-20:00 hora local. */
export function sendingWindow() {
  const d = new Date()
  const day = d.getDay()
  const hour = d.getHours()
  if (day === 0 || day === 6) return { ok: false, why: 'fin de semana' }
  if (hour < 9 || hour >= 20) return { ok: false, why: `fuera de horario (${hour}h)` }
  return { ok: true }
}

/**
 * Watchdog de quejas: mira los correos recibidos de los destinatarios de la
 * campana y cuenta los que dicen "spam"/"basura". Si hay quejas, se para.
 */
const SPAM_WORDS = /\b(spam|basura|mail basura|unsubscribe|dar de baja|scam|estafa)\b/i
export function detectComplaints(inboxTexts = []) {
  const hits = inboxTexts.filter((t) => SPAM_WORDS.test(t))
  return { complaints: hits.length, samples: hits.slice(0, 3) }
}
