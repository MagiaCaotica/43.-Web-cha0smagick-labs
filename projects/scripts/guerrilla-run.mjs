#!/usr/bin/env node
/**
 * Runner de la campana, con politica de entrega suave para no que Gmail
 * catalogue la cuenta como spam.
 *
 * - UN correo por invocacion del cliente, con pausa aleatoria entre medias
 *   (nunca rafaga).
 * - Tope diario con rampa y tope por dominio (ver guerrilla-policy.mjs).
 * - Contador persistente: reiniciar no reinicia el tope.
 * - La verdad de campo es la carpeta de Enviados, no la salida del run.
 * - Watchdog: si aparecen quejas de spam en la bandeja, se para.
 */
import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { loadBudget, saveBudget, canSend, recordSent, gapMs, maxForToday, POLICY } from './guerrilla-policy.mjs'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
const DIR = path.join(ROOT, 'data', 'guerrilla')
const arg = (k, d) => {
  const i = process.argv.indexOf('--' + k)
  return i >= 0 ? process.argv[i + 1] : d
}
const SEGMENTS = arg('segments', 'partner-youtube,partner-media,colectivas-paranormal,github-dev,pypi-dev,npm-dev').split(',')
const MAX = Number(arg('max', 0))          // tope extra de esta sesion
const CHECK_EVERY = Number(arg('check-every', 10))

/**
 * El texto guardado puede traer el array plano o un JSON escapado dentro de
 * un string ({"page":3,"value":[...]}). Se走行 de las dos formas.
 */
function parseSnapshot(file) {
  const full = path.join(DIR, file)
  if (!fs.existsSync(full)) return []
  const raw = fs.readFileSync(full, 'utf8')
  const tries = []
  const i = raw.indexOf('[')
  const j = raw.lastIndexOf(']')
  if (i >= 0 && j > i) tries.push(raw.slice(i, j + 1))
  // caso "value":[...] con escapes
  const m = raw.match(/"value":\s*(\[[\s\S]*?\])\s*\}/)
  if (m) tries.push(m[1].replace(/\\"/g, '"').replace(/\\\\/g, '\\'))
  for (const t of tries) {
    try {
      const v = JSON.parse(t)
      if (Array.isArray(v)) return v
    } catch {}
  }
  return []
}

const run = (cmd, args) => {
  try {
    return execFileSync(cmd, args, { cwd: ROOT, encoding: 'utf8', maxBuffer: 128 * 1024 * 1024, stdio: ['ignore', 'pipe', 'pipe'] })
  } catch (e) { return (e.stdout || '') + '\n' + (e.stderr || '') }
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

// ----------快照 de Enviados ----------
function sentSnapshot() {
  const plan = path.join(DIR, 'plan-sent-snapshot.json')
  fs.writeFileSync(plan, JSON.stringify({ steps: [{
    tool: 'run',
    args: { code: `
const pages = await browser.pages.list();
const c = pages.filter(x => (x.url || '').includes('mail.google.com/mail/u/1'));
if (!c.length) return JSON.stringify([]);
const p = await browser.page(c[c.length - 1].pageId);
await p.goto('https://mail.google.com/mail/u/1/#sent');
await sleep(3500);
const r = await p.evaluate(() => Array.from(document.querySelectorAll('tr')).map(tr => { const s = tr.querySelector('span[email]'); return s ? (s.getAttribute('email')||'').toLowerCase() : ''; }).filter(Boolean));
return r;
` },
    max: 20000,
    save: path.join(DIR, 'sent-snapshot.txt'),
  }] }, null, 2))
  run('node', [path.join('projects', 'scripts', 'browseros-mcp.mjs'), 'plan', plan])
  return parseSnapshot('sent-snapshot.txt')
}

// ---------- watchdog de quejas ----------
function complaintWatch() {
  const plan = path.join(DIR, 'plan-complaints.json')
  fs.writeFileSync(plan, JSON.stringify({ steps: [{
    tool: 'run',
    args: { code: `
const pages = await browser.pages.list();
const c = pages.filter(x => (x.url || '').includes('mail.google.com/mail/u/1'));
if (!c.length) return JSON.stringify([]);
const p = await browser.page(c[c.length - 1].pageId);
await p.goto('https://mail.google.com/mail/u/1/#inbox');
await sleep(3500);
const r = await p.evaluate(() => Array.from(document.querySelectorAll('tr')).map(tr => { const s = tr.querySelector('span[email]'); return s ? ((s.getAttribute('email')||'').toLowerCase() + ' :: ' + (tr.innerText||'').replace(/\\s+/g,' ').slice(0,220)) : ''; }).filter(Boolean));
return r;
` },
    max: 30000,
    save: path.join(DIR, 'inbox-snapshot.txt'),
  }] }, null, 2))
  run('node', [path.join('projects', 'scripts', 'browseros-mcp.mjs'), 'plan', plan])
  return parseSnapshot('inbox-snapshot.txt')
}

const queue = JSON.parse(fs.readFileSync(path.join(DIR, 'queue2.json'), 'utf8'))
const sentLog = path.join(DIR, 'sent-log.jsonl')
let budget = loadBudget()
console.log(`dia ${budget.days} | tope ${maxForToday(budget)} | ya enviados hoy ${budget.sent.length}`)

let total = 0
let maxed = false
let sinceCheck = 0
let lastSent = new Set(sentSnapshot())

for (const seg of SEGMENTS) {
  if (maxed) break
  const segQ = queue.filter((q) => q.segment === seg)
  for (const q of segQ) {
    if (maxed) break
    if (MAX && total >= MAX) { console.log(`\n=== tope de sesion alcanzado (${MAX}) ===`); break }
    const chk = canSend(q.to, budget)
    if (!chk.ok) {
      if (/tope diario/.test(chk.reason || '')) {
        console.log(`\n=== TOPE DIARIO ALCANZADO (${maxForToday(budget)}). Se para aqui; mañana sigue. ===`)
        console.log('   motivo: ' + chk.reason)
        maxed = true
        break
      }
      continue
    }
    if (lastSent.has(q.to.toLowerCase())) { recordSent(q.to, budget); continue }

    // 1) enviar uno
    fs.writeFileSync(path.join(DIR, 'queue-run.json'), JSON.stringify([q], null, 2))
    run('node', [path.join('projects', 'scripts', 'guerrilla-send.mjs'), '--queue', 'queue-run.json', '--count', '1', '--per', '1'])
    run('node', [path.join('projects', 'scripts', 'browseros-mcp.mjs'), 'plan', path.join('data', 'guerrilla', 'plan-send.json')])

    // 2) comprobar de verdad en Enviados
    const sent = new Set(sentSnapshot())
    lastSent = sent
    const ok = sent.has(q.to.toLowerCase())
    if (ok) {
      budget = recordSent(q.to, budget)
      total++
      sinceCheck++
      fs.appendFileSync(sentLog, JSON.stringify({ ts: new Date().toISOString(), seg, sent: [q.to] }) + '\n')
      console.log(`[${budget.sent.length}/${maxForToday(budget)}] enviado ${q.to}  (${q.segment})`)
    } else {
      console.log(`FALLO ${q.to} — no aparece en Enviados; parando (no insistir a ciegas)`)
      break
    }

    // 3) pausa humana
    const g = gapMs()
    console.log(`   pausa ${Math.round(g / 1000)}s`)
    await sleep(g)

    // 4) watchdog de quejas
    if (sinceCheck >= CHECK_EVERY) {
      sinceCheck = 0
      const inbox = complaintWatch()
      const spam = inbox.filter((t) => /spam|basura|estafa|scam|unsubscribe|dar de baja/i.test(t))
      if (spam.length >= POLICY.COMPLAINT_THRESHOLD) {
        console.log(`\n!!! ${spam.length} queja(s) de spam detectada(s). PARANDO la campana.`)
        for (const s of spam.slice(0, 3)) console.log('   ', s.slice(0, 160))
        break
      }
      console.log(`   watchdog: ${spam.length} queja(s) de spam`)
    }
  }
}
console.log(`\n=== TOTAL ENVIADOS ESTA SESION: ${total} | HOY: ${budget.sent.length}/${maxForToday(budget)} ===`)
if (maxed) console.log('Mañana: node projects/scripts/guerrilla-run.mjs --check-every 10')
