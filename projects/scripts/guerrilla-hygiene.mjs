#!/usr/bin/env node
/**
 * Higiene de lista antes de enviar (checklist de domain/email-deliverability-engineer):
 *   - descarta dominios desechables (repo disposable-email-domains/disposable-email-domains)
 *   - descarta cuentas de rol (admin@, info@, noreply@, contact@...) que nunca responden
 *   - descarta buzones invalidos y dominios sin MX (no entregado = queja de spam)
 *   - marca la lista limpia + la lista de supresion
 * Uso: node guerrilla-hygiene.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import dns from 'node:dns/promises'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
const DIR = path.join(ROOT, 'data', 'guerrilla')

const ROLE = /^(admin|info|contact|support|sales|help|webmaster|postmaster|hostmaster|abuse|noreply|no-reply|donotreply|mailer-daemon|bounce|abuses|compliance|legal|privacy|dmca|press|media|jobs|careers|recruit|marketing|newsletter|news|enquiries|example|test|root|contacto|contactos|informacion|ventas|ayuda|soporte|prensa|redaccion|direccion|representacion|representaciones|hola|equipo)$/i
// En un pitch a un medio, la cuenta de rol (contacto@, prensa@) ES el contacto
// editorial correcto: no se descarta. En venta a una comunidad o a devs, la
// cuenta de rol no responde, asi que si se descarta.
const KEEP_ROLE = new Set(['partner-media', 'partner-youtube'])
const DISPOSABLE_URL = 'https://raw.githubusercontent.com/disposable-email-domains/disposable-email-domains/master/disposable_email_blocklist.conf'

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function loadDisposable() {
  try {
    const res = await fetch(DISPOSABLE_URL, { headers: { 'User-Agent': 'cha0smagick-campaign' }, signal: AbortSignal.timeout(30000) })
    const text = await res.text()
    const set = new Set(text.split(/\r?\n/).map((l) => l.trim().toLowerCase()).filter((l) => l && !l.startsWith('#')))
    console.log(`dominios desechables cargados: ${set.size}`)
    return set
  } catch (e) {
    console.log(`AVISO: no se pudo cargar la lista de desechables (${e.message}). Se sigue sin ese filtro.`)
    return new Set()
  }
}

const memCache = new Map()

// Un fallo transitorio (EAI_AGAIN, ETIMEOUT, SERVFAIL) NO es "sin MX".
// Si se cachea un false por un fallo puntual se tiran leads validos en bloque:
// por eso solo se cachea un resultado definitivo y se reintenta lo transitorio.
const DEFINITIVE_NO_MX = new Set(['ENOTFOUND', 'ENODATA', 'ENODOMAIN'])
async function hasMx(domain) {
  if (memCache.has(domain)) return memCache.get(domain)
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const mx = await dns.resolveMx(domain)
      memCache.set(domain, true)
      return true
    } catch (e) {
      const code = e.code || e.message
      if (DEFINITIVE_NO_MX.has(code)) {
        memCache.set(domain, false)
        return false
      }
      await sleep(500 * (attempt + 1)) // transitorio: reintentar
    }
  }
  return null // sin verificar: NO descartar el lead
}

const main = async () => {
  const data = JSON.parse(fs.readFileSync(path.join(DIR, 'leads.json'), 'utf8'))
  const leads = data.leads
  const disposable = await loadDisposable()

  const clean = []
  const rejected = []
  const mxCache = new Map()

  for (const l of leads) {
    const [user, domain] = l.email.split('@')
    const d = (domain || '').toLowerCase()
    const reason = []
    if (!d || !d.includes('.')) reason.push('dominio invalido')
    if (ROLE.test(user) && !KEEP_ROLE.has(l.segment)) reason.push('cuenta de rol')
    if (disposable.has(d)) reason.push('dominio desechable')
    if (d.endsWith('.invalid') || d.endsWith('.local') || d.endsWith('.test')) reason.push('dominio no valido')
    if (reason.length) {
      rejected.push({ email: l.email, reason: reason.join(' + ') })
      continue
    }
    if (!mxCache.has(d)) {
      mxCache.set(d, await hasMx(d))
      await sleep(120) // no saturar el resolver
    }
    if (mxCache.get(d) === false) {
      rejected.push({ email: l.email, reason: 'sin MX' })
      continue
    }
    clean.push(l)
  }

  fs.writeFileSync(path.join(DIR, 'leads-clean.json'), JSON.stringify({ generatedAt: new Date().toISOString(), leads: clean }, null, 2))
  fs.writeFileSync(path.join(DIR, 'suppression.csv'),
    ['email,reason', ...rejected.map((r) => `"${r.email}","${r.reason}"`)].join('\n'))

  const bySeg = {}
  for (const l of clean) bySeg[l.segment] = (bySeg[l.segment] || 0) + 1
  console.log(`\n=== HIGIENE ===`)
  console.log(`originales : ${leads.length}`)
  console.log(`limpios    : ${clean.length}`)
  console.log(`descartados: ${rejected.length}`)
  const byReason = {}
  for (const r of rejected) byReason[r.reason] = (byReason[r.reason] || 0) + 1
  console.log('motivos    :', JSON.stringify(byReason))
  console.log('por segmento (limpios):', JSON.stringify(bySeg))
  const byLang = {}
  for (const l of clean) byLang[l.lang] = (byLang[l.lang] || 0) + 1
  console.log('por idioma (limpios):', JSON.stringify(byLang))
}
main()
