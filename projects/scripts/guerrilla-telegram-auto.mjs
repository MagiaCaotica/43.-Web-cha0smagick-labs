#!/usr/bin/env node
/**
 * Motor de Telegram, automatico.
 *
 * DESTINO UNICO: el bot publica solo en el canal/grupo donde tiene acceso
 * (el canal oficial @cha0smagicklabs). Los otros canales y grupos de la
 * comunidad (biblioteca, COVEN) se enlazan desde los emails y desde el
 * sitio, pero no se postea alli porque el bot no es miembro y no hay clave.
 *
 * - post   : publica la tanda de posts con boton "Entrar al grupo"
 * - listen : servicio que responde automaticamente en el grupo
 * - status : que destinos estan listos
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
const SITE = 'https://cha0smagicklabs.com'
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

// Destino unico: donde el bot tiene acceso.
const CHANNEL = env.TELEGRAM_CHANNEL
const GROUP = env.TELEGRAM_GROUP_INVITE
const JOIN_BTN = { inline_keyboard: [[{ text: 'Entrar al grupo', url: GROUP }]] }

const STATE = path.join(ROOT, 'data', 'guerrilla', 'telegram-state.json')
const loadState = () => { try { return JSON.parse(fs.readFileSync(STATE, 'utf8')) } catch { return { posted: [], offset: 0, groupId: null } } }
const saveState = (s) => { fs.mkdirSync(path.dirname(STATE), { recursive: true }); fs.writeFileSync(STATE, JSON.stringify(s, null, 2)) }

async function api(method, payload = {}) {
  const res = await fetch('https://api.telegram.org/bot' + TOKEN + '/' + method, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
  })
  const j = await res.json()
  if (!j.ok) throw new Error(method + ': ' + j.description)
  return j.result
}

const U = (p, c) => SITE + '/' + p + '?utm_source=telegram&utm_medium=social&utm_campaign=g10&utm_content=' + c

const POSTS = [
  {
    key: 'comunidad-4',
    text: 'Aqui esta toda la comunidad, son dos canales y dos grupos:\n\n' +
      '- Canal oficial: https://t.me/cha0smagicklabs\n' +
      '- Grupo oficial: https://t.me/+krfQJgro4hBkNTE5\n' +
      '- Canal de la biblioteca: https://t.me/magiacaotica\n' +
      '- Grupo COVEN: https://t.me/magiacaoticacoven\n\n' +
      'En los cuatro se trabaja lo mismo: sigilos, runas, tarot, I Ching, carta natal y sesiones de paranormal. Y las 42 herramientas libres estan aqui: ' + SITE + '/tools/',
  },
  {
    key: 'sesion-checklist',
    text: 'Lo que mas se nos pregunta antes de una sesion: espacio preparado, sin fuego sin supervision, herramientas, consentimiento, limites y cierre. Todo eso en una checklist que se puede imprimir:\n\n' +
      SITE + '/tools/paranormal-session-prep-checklist.html' +
      '\n\nY el cronometro de sesion va dentro de la app de campo: ' + SITE + '/apps/noctem-tools.html',
  },
  {
    key: 'sigil-gratis',
    text: 'El generador de sigilos magicos, en el navegador y sin registro.\n\n' +
      'Escribes tu intencion, sale el sigilo con los alfabetos antiguos y los cuadrados planetarios, y te lo descargas. Sin cuenta, sin app, sin pagar.\n\n' +
      U('tools/sigil-intention-encoder.html', 'sigil-gratis') +
      '\n\nSi te sale uno que te mola, pasamelo y lo cuelgo.',
  },
  {
    key: 'app-gratis',
    text: 'Dejo una app de investigacion paranormal gratis para quien la quiera.\n\n' +
      'NOCTEM lleva la sesion: grabador EVP, lectura de sensores y cronometro de sesion, todo offline en el movil.\n\n' +
      'Escribidme por privado con "NOCTEM" y os paso el codigo de promo de Google Play.\n\n' +
      U('apps/noctem-tools.html', 'app-gratis'),
  },
  {
    key: 'psigym',
    text: 'Para los que currais sesiones y quereis saber si sois psicometros o vais de turismo:\n\n' +
      'PSI GYM es un entrenador de cartas Zener con estadisticas de aciertos. Te dice, con numeros, en que ratio aciertas. Se nota.\n\n' +
      U('apps/psi-gym.html', 'psigym'),
  },
  {
    key: 'iching',
    text: 'El I Ching con el algoritmo de tres monedas de verdad, los 64 hexagramas, y en el navegador sin instalar nada.\n\n' +
      U('tools/iching.html', 'iching') + '\n\nCuando me toque, lo echo aqui.',
  },
  {
    key: 'libros',
    text: 'Los 9 libros en PDF (magia del caos, servidores magicos, tarot aplicado, grimorios) en un solo bundle, con acceso inmediato al comprar.\n\n' +
      '9 libros, 368 paginas el mas largo. ' + U('landing-pages/books-bundle.html', 'libros'),
  },
  {
    key: 'suenos',
    text: 'Para los que cazan suenos lucidos:\n\n' +
      'El planificador te arma la practica (inducci��n, diario, chequeos de realidad) y te dice cuando parar. Nada de "haces esto y te pasa esto".\n\n' +
      U('tools/lucid-dream-training-planner.html', 'suenos'),
  },
  {
    key: 'tarot',
    text: 'El tarot Rider-Waite completo, offline, con 6 tiradas y enciclopedia. Sin cuenta, sin suscripcion, sin conexion.\n\n' +
      U('apps/unofficial-rider-waite-tarot.html', 'tarot'),
  },
  {
    key: 'carta-natal',
    text: 'Carta natal offline, con VSOP87/ELP-2000, transitos en vivo y rejilla de aspectos. Sin cuenta, sin tracking.\n\n' +
      U('tools/full-birth-chart.html', 'carta-natal') +
      '\n\nSi al ver tu ascendente no cuadra, dimelo: es el bug que mas reportan y se puede arreglar.',
  },
]

const KEYWORDS = [
  { re: /sigil|sigilo/i, text: 'El generador de sigilos, gratis y sin registro: ' + U('tools/sigil-intention-encoder.html', 'bot-sigil') },
  { re: /rune|runa|futhark|runas/i, text: 'Referencia de runas Elder Futhark: ' + U('tools/elder-futhark-reference.html', 'bot-runas') + '. Y el oraculo de runas en Android: ' + U('apps/norse-rune-oracle.html', 'bot-oraculo-runas') },
  { re: /i ?ching|hexagram/i, text: 'I Ching con el algoritmo de tres monedas, en el navegador: ' + U('tools/iching.html', 'bot-iching') },
  { re: /tarot|baraja/i, text: 'Tarot Rider-Waite completo offline: ' + U('apps/unofficial-rider-waite-tarot.html', 'bot-tarot') + '. Y para montar tiradas: ' + U('tools/tarot-spread-builder.html', 'bot-tarot') },
  { re: /carta natal|ascendente|ascendant|astrolog|zodiaco/i, text: 'Carta natal offline con VSOP87/ELP-2000: ' + U('tools/full-birth-chart.html', 'bot-carta') + '. Y el ascendente: ' + U('tools/rising-sign-calculator.html', 'bot-ascendente') },
  { re: /sueno|dream|lucid/i, text: 'Entrenador de suenos lucidos (inducci' + 'on, diario, chequeos de realidad): ' + U('tools/lucid-dream-training-planner.html', 'bot-suenos') },
  { re: /evp|ghost|fantasma|investigacion|paranormal|session|sesion/i, text: 'Para la sesion: NOCTEM lleva grabador EVP, sensores y cronometro: ' + U('apps/noctem-tools.html', 'bot-noctem') + '. Y la checklist previa: ' + U('tools/paranormal-session-prep-checklist.html', 'bot-checklist') },
  { re: /psicometr|zener|psi|esp\b/i, text: 'PSI GYM: entrenador de cartas Zener con estadisticas de aciertos: ' + U('apps/psi-gym.html', 'bot-psigym') },
  { re: /libro|book|grimorio/i, text: 'Los 9 libros en PDF, con acceso inmediato: ' + U('landing-pages/books-bundle.html', 'bot-libros') },
  { re: /herramienta|tool|app|aplicacion/i, text: 'Aqui estan las 42 herramientas libres: ' + SITE + '/tools/ . Sin cuenta, sin tracking, en el navegador.' },
]

async function cmdPost() {
  const st = loadState()
  const done = new Set(st.posted || [])
  let n = 0
  for (const p of POSTS) {
    if (done.has(p.key)) continue
    try {
      const r = await api('sendMessage', { chat_id: CHANNEL, text: p.text, reply_markup: JOIN_BTN, disable_web_page_preview: false })
      st.posted = [...(st.posted || []), p.key]
      saveState(st)
      console.log('OK  ' + p.key + ' -> ' + r.message_id)
      n++
    } catch (e) {
      console.log('--  ' + p.key + ': ' + String(e.message).slice(0, 90))
    }
    await sleep(5000)
  }
  console.log('publicados ' + n + ' en ' + CHANNEL)
}

async function cmdListen() {
  const st = loadState()
  let offset = st.offset || 0
  console.log('escuchando el grupo (Ctrl+C para salir)...')
  for (;;) {
    try {
      const ups = await api('getUpdates', { offset, limit: 50, timeout: 25 })
      for (const u of ups) {
        offset = u.update_id + 1
        const m = u.message || u.channel_post
        if (!m || !m.chat) continue
        if (st.groupId == null && m.chat.type === 'supergroup') {
          st.groupId = m.chat.id
          console.log('grupo detectado: ' + m.chat.id + ' (' + m.chat.title + ')')
          saveState(st)
        }
        const text = String(m.text || '')
        if (!text || text.startsWith('/')) continue
        const hit = KEYWORDS.find((k) => k.re.test(text))
        if (!hit) continue
        await api('sendMessage', { chat_id: m.chat.id, text: hit.text, reply_to_message_id: m.message_id })
        console.log('respondido en ' + m.chat.id)
        await sleep(1200)
      }
      st.offset = offset
      saveState(st)
    } catch (e) {
      console.log('error: ' + String(e.message).slice(0, 80))
      await sleep(5000)
    }
  }
}

async function cmdStatus() {
  const me = await api('getMe')
  console.log('bot          : ' + me.username + ' (id ' + me.id + ')')
  console.log('canal (post) : ' + CHANNEL)
  console.log('grupo (btn)  : ' + GROUP)
  try { const c = await api('getChat', { chat_id: CHANNEL }); console.log('  -> accesible, id ' + c.id) }
  catch (e) { console.log('  -> NO accesible: ' + String(e.message).slice(0, 70)) }
  const st = loadState()
  console.log('posts hechos : ' + (st.posted || []).length + '/' + POSTS.length)
  console.log('grupo bot id : ' + (st.groupId || '(el bot aun no esta dentro del grupo)'))
}

const cmd = process.argv[2] || 'status'
if (cmd === 'post') await cmdPost()
else if (cmd === 'listen') await cmdListen()
else await cmdStatus()
