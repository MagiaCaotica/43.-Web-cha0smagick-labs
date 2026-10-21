#!/usr/bin/env node
/**
 * Motor de boca a boca en Telegram: publica en el canal y en el grupo los
 * posts que mueven installs y generan conversation.
 *
 * Usa la API oficial del bot (Telegram Bot API) con el token de .env.
 * Cada post lleva su enlace con UTM para poder medirlo en GA4.
 *
 * Uso: node guerrilla-telegram.mjs [--dry]
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
const env = Object.fromEntries(
  fs.readFileSync(path.join(ROOT, '.env'), 'utf8').split(/\r?\n/)
    .filter((l) => l.includes('=') && !l.trim().startsWith('#'))
    .map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] }))

const TOKEN = env.TELEGRAM_BOT_TOKEN
const CHANNEL = env.TELEGRAM_CHANNEL
const DRY = process.argv.includes('--dry')
const only = (() => { const i = process.argv.indexOf('--keys'); return i >= 0 ? process.argv[i + 1].split(',') : null })()
const GAP = Number((() => { const i = process.argv.indexOf('--gap'); return i >= 0 ? process.argv[i + 1] : 8 })())
if (!TOKEN) { console.error('FALTA TELEGRAM_BOT_TOKEN en .env'); process.exit(1) }

const SITE = 'https://cha0smagicklabs.com'
const U = (path, content) => `${SITE}/${path}?utm_source=telegram&utm_medium=social&utm_campaign=g10&utm_content=${content}`

// Posts pensados para que los compartan: cada uno da algo util o una oferta
// concreta, no un anuncio de catalogo.
const POSTS = [
  {
    key: 'sigil-gratis',
    text: `El generador de sigilos magicos, ahora en el navegador y sin registro.\n\nEscribes tu intencion, te sale el sigilo con los alfabetos antiguos y los cuadrados planetarios, y te lo descargas. Sin cuenta, sin app, sin pagar.\n\n${U('tools/sigil-intention-encoder.html', 'sigil-gratis')}\n\nSi te sale uno que te mola, pasamelo y lo cuelgo.`,
  },
  {
    key: 'app-gratis',
    text: `Os dejo una app de investigacion paranormal gratis para quien la quiera.\n\nNOCTEM lleva la sesion: grabador EVP, lectura de sensores y cronometro de sesion, todo offline en el movil.\n\nEscribidme por privado con "NOCTEM" y os paso el codigo de promo de Google Play.\n\n${U('landing-pages/apps-bundle.html', 'app-gratis')}`,
  },
  {
    key: 'psigym',
    text: `Para los que currais sesiones y quereis saber si sois psicometros o vais de turismo:\n\nPSI GYM es un entrenador de cartas Zener con estadisticas de aciertos. Te dice, con numeros, en que ratio aciertas. Se nota.\n\n${U('apps/psi-gym.html', 'psigym')}`,
  },
  {
    key: 'i-ching',
    text: `El I Ching con el algoritmo de tres monedas de verdad, los 64 hexagramas, y en el navegador sin instalar nada.\n\n${U('tools/iching.html', 'iching')}\n\nCuando me toque, lo echo aqui.`,
  },
  {
    key: 'libros',
    text: `Los 9 libros en PDF (magia del caos, servidores magicos, tarot aplicado, grimorios) en un solo bundle, con acceso inmediato al comprar.\n\n9 libros, 368 paginas el mas largo. ${U('landing-pages/books-bundle.html', 'libros')}`,
  },
  {
    key: 'sueños',
    text: `Para los que cazan suenos lucidos:\n\nEl planificador te arma la practica (induccion, diario, chequeos de realidad) y te dice cuando parar. Nada de "haces esto y te pasa esto".\n\n${U('tools/lucid-dream-training-planner.html', 'suenos')}`,
  },
]

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function post(chat, text) {
  const res = await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chat, text, disable_web_page_preview: false }),
  })
  const j = await res.json()
  return { ok: j.ok, id: j.result?.message_id, desc: j.description || j.result?.text?.slice(0, 60) }
}

if (DRY) {
  console.log('DRY — destinos:', CHANNEL, '\n')
  for (const p of POSTS) console.log(`--- ${p.key} ---\n${p.text}\n`)
  process.exit(0)
}

const results = []
for (const p of POSTS.filter((x) => !only || only.includes(x.key))) {
  const r = await post(CHANNEL, p.text)
  results.push({ key: p.key, chat: CHANNEL, ...r })
  console.log(`${r.ok ? 'OK  ' : 'FAIL'} ${p.key} -> ${CHANNEL} ${r.id || r.desc}`)
  await sleep(GAP * 1000) // no bombardear al bot
}
fs.writeFileSync(path.join(ROOT, 'data', 'guerrilla', 'telegram-posts.json'), JSON.stringify(results, null, 2))
console.log(`\npublicados: ${results.filter((r) => r.ok).length}/${results.length}`)
