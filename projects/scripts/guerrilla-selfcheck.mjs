#!/usr/bin/env node
/**
 * Self-check de la campana. Comprueba lo que se puede romper en silencio:
 * idioma mezclado, enlaces no verificados, topes de envio, y el estado del
 * estilo del sitio. Sale con codigo 1 si algo falla.
 */
import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { POLICY, canSend, loadBudget, maxForToday } from './guerrilla-policy.mjs'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
const DIR = path.join(ROOT, 'data', 'guerrilla')
const fails = []
const ok = (name, cond, detail = '') => {
  console.log(`${cond ? 'PASA' : 'FALLA'}  ${name}${detail ? ' :: ' + detail : ''}`)
  if (!cond) fails.push(name)
}

// ---------- 1) links verificados ----------
const verified = new Set(JSON.parse(fs.readFileSync(path.join(DIR, 'links-verified.json'), 'utf8')))
ok('hay lista de links verificados', verified.size > 50, `${verified.size} urls`)

// ---------- 2) la cola no usa links sin verificar ----------
const queue = JSON.parse(fs.readFileSync(path.join(DIR, 'queue2.json'), 'utf8'))
const urlsInQueue = queue.flatMap((q) => (q.body.match(/https?:\/\/[^\s)"']+/g) || []))
  .map((u) => u.replace(/[.,)]+$/, ''))
  .filter((u) => u.includes('cha0smagicklabs.com') || u.includes('hotmart.com') || u.includes('play.google.com'))
const bad = [...new Set(urlsInQueue)].filter((u) => {
  const base = u.split('?')[0].replace(/\/$/, '')
  if (verified.has(base)) return false
  for (const v of verified) if (v.split('?')[0].replace(/\/$/, '') === base) return false
  return true
})
ok('todos los links de la cola estan verificados', bad.length === 0, bad.slice(0, 3).join(' | '))

// ---------- 3) idioma: cada email en el idioma de su lead ----------
const EN = ['the book bundle', 'Say the word', 'the rest that fits', 'paid monthly through Hotmart', 'promo code', 'your package', 'your repo', 'one-time-purchase']
const ES = ['el bundle de 9 libros', 'te paso el código', 'lo demás que encaja', 'pago mensual por Hotmart', 'código de promo', 'tu paquete', 'tu repo', 'pago único']
let mixed = 0
for (const q of queue) {
  const t = q.subject + '\n' + q.body
  const hits = q.lang === 'EN' ? ES.filter((m) => t.includes(m)) : EN.filter((m) => t.includes(m))
  if (hits.length) mixed++
}
ok('ningun email mezcla idiomas', mixed === 0, `${mixed} mezclados`)

// ---------- 4) subjects sin palabras de oferta ni mayusculas ----------
const spamSubj = queue.filter((q) => /gratis|free|descuento|discount|!!|€|\$|100%|click here|clic aqui/i.test(q.subject))
ok('asuntos sin lenguaje de oferta', spamSubj.length === 0, spamSubj.slice(0, 3).map((q) => q.subject).join(' | '))

// ---------- 5) unicidad de cuerpos ----------
const bodies = new Set(queue.map((q) => q.body))
ok('cuerpos casi unicos', bodies.size / queue.length > 0.9, `${bodies.size}/${queue.length}`)

// ---------- 6) topes de envio ----------
const b = loadBudget()
ok('tope diario: 50 maximo con rampa de calentamiento', POLICY.MAX_DAY === 50 && POLICY.RAMP_START === 20 && POLICY.RAMP_STEP === 10
  && maxForToday({ days: 1 }) === 20 && maxForToday({ days: 2 }) === 30 && maxForToday({ days: 4 }) === 50,
  `dia ${b.days} -> tope ${maxForToday(b)}`)
ok('1 correo por dominio y dia', POLICY.MAX_PER_DOMAIN === 1)
ok('pausa de 3 a 8 minutos entre correos', POLICY.MIN_GAP_SECONDS >= 180 && POLICY.MAX_GAP_SECONDS >= 480)
ok('watchdog de rebotes activo', POLICY.BOUNCE_THRESHOLD > 0 && POLICY.COMPLAINT_THRESHOLD > 0)
const fake = { date: b.date, sent: Array(50).fill('x@y.z'), domains: {}, days: b.days }
const chk = canSend('nuevo@dominio.com', fake)
ok('el tope diario bloquea al llegar a 50', !chk.ok, chk.reason || '')
const perDom = { date: b.date, sent: ['a@x.com', 'b@x.com'], domains: { 'x.com': 2 }, days: b.days }
const chk2 = canSend('c@x.com', perDom)
ok('el tope por dominio bloquea al tercero', !chk2.ok, chk2.reason || '')

// ---------- 7) estilo del sitio ----------
try {
  const out = execFileSync('node', [path.join('projects', 'scripts', 'style-census.mjs')], { cwd: ROOT, encoding: 'utf8' })
  const sinCss = Number((out.match(/^(\d+) paginas \| inline=\d+ \| \(sin css\)/m) || [])[1] || 0)
  const dup = (out.match(/^(\d+) paginas \| inline=\d+ \| \.\.\/css\/style\.min\.css \| \.\.\/css\/style\.min\.css/m) || [])[1]
  // la familia es-* es autocontenida (no enlaza style.min.css) pero usa la paleta del sitio
  // Paginas sin hoja: son autocontenidas por diseno (familias es-* y es/).
  // El requisito es que usen la paleta del sitio. Los lead-magnet son un
  // documento para IMPRIMIR (Georgia, fondo blanco, reglas @page): ahi el
  // estilo correcto es el de un documento, no el de la web.
  const PALETTE = ['--amber:#c0a060', '--bg:#030303', '--navy:#030303', '--card:#0a0a0a']
  const selfContained = []
  for (const rel of ['blog', 'es', 'lead-magnet']) {
    const dir = path.join(ROOT, rel)
    if (!fs.existsSync(dir)) continue
    for (const f of fs.readdirSync(dir)) {
      if (!f.endsWith('.html')) continue
      const h = fs.readFileSync(path.join(dir, f), 'utf8')
      if (/<link[^>]*href="[^"]*\.css/.test(h)) continue
      selfContained.push({ rel: rel + '/' + f, h })
    }
  }
  const printDocs = selfContained.filter(x => x.rel.startsWith('lead-magnet/'))
  const webFam = selfContained.filter(x => !x.rel.startsWith('lead-magnet/'))
  const offPalette = webFam.filter(x => !PALETTE.some(c => x.h.includes(c)) || x.h.includes('#ffb03a'))
  ok('las familias autocontenidas usan la paleta del sitio', offPalette.length === 0, `${offPalette.length} fuera de paleta de ${webFam.length}`)
  ok('los lead-magnet son documento de imprenta', printDocs.length === 2, `${printDocs.length} documentos`)
  ok('sin estilosheets duplicados', !dup || dup === '0', `${dup || 0} con duplicado`)
  ok('sin estilosheets duplicados', !dup || dup === '0', `${dup || 0} con duplicado`)
} catch (e) { ok('censo de estilo', false, e.message.slice(0, 80)) }

// ---------- 8) el tema es-* usa la paleta del sitio ----------
const esPage = path.join(ROOT, 'blog', 'es-como-hacer-un-sigilo-paso-a-paso.html')
if (fs.existsSync(esPage)) {
  const h = fs.readFileSync(esPage, 'utf8')
  ok('el tema es-* usa la paleta del sitio', h.includes('--amber:#c0a060') && !h.includes('#ffb03a'), '')
} else ok('existe la pagina es-* de control', false)

// ---------- 9) el plugin de puerto existe y cubre 90xx y 92xx ----------
const plugin = path.join(process.env.USERPROFILE || '', '.config', 'opencode', 'plugins', 'browseros-port-healer.ts')
if (fs.existsSync(plugin)) {
  const t = fs.readFileSync(plugin, 'utf8')
  ok('el plugin barre 9010-9019 y 9210-9219', t.includes('9010') && t.includes('9210'), '')
} else ok('existe el plugin browseros-port-healer', false)

// ---------- 10) workflow del bot con health check ----------
const wf = path.join(ROOT, '.github', 'workflows', 'bot-deploy.yml')
if (fs.existsSync(wf)) {
  const t = fs.readFileSync(wf, 'utf8')
  ok('bot-deploy verifica el token de Telegram', t.includes('getMe'), '')
  ok('bot-deploy tiene health check post-deploy', t.includes('Post-deploy health check'), '')
} else ok('existe bot-deploy.yml', false)

// ---------- 11) auditoria de entregabilidad (que no parezca spam) ----------
try {
  const { execFileSync } = await import('node:child_process')
  const out = execFileSync('node', [path.join('projects', 'scripts', 'audit-deliverability.mjs')], { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] })
  const m = out.match(/problemas totales: (\d+)/)
  const n = m ? Number(m[1]) : -1
  ok('auditoria de entregabilidad sin problemas', n === 0, n + ' problemas')
} catch (e) {
  const msg = String(e.stdout || e.message)
  const m = msg.match(/problemas totales: (\d+)/)
  ok('auditoria de entregabilidad sin problemas', m ? Number(m[1]) === 0 : false, m ? m[1] + ' problemas' : msg.slice(0, 60))
}

console.log(`\n=== ${fails.length === 0 ? 'TODO OK' : fails.length + ' FALLOS'} ===`)
if (fails.length) console.log(fails.join('\n'))
process.exitCode = fails.length ? 1 : 0
