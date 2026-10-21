#!/usr/bin/env node
/**
 * Copy ad-hoc de la campana (v3).
 *
 * Reglas del maestro:
 *  - la oferta es UNA APP GRATIS para el lead (codigo de promo de Google Play)
 *  - encima se ofrecen las apps y los libros que de verdad encajan con ESE lead
 *  - nada de posts, nada de "programas", nada de ofertas de afiliado
 *  - 0% AI slop: se habla de lo que hace el lead, con sus palabras y sus enlaces
 *  - solo links verificados (data/guerrilla/links-verified.json)
 *  - IDIOMA: cada lead recibe el email en su idioma. Las descripciones en
 *    ingles salen de la ficha del catalogo (que ya esta en ingles), no se
 *    traducen a medias.
 *
 * El catalogo sale de js/apps-data.js (fuente de verdad) y el grounding de
 * data/guerrilla/grounding.json (hechos reales leidos de su web).
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
const DIR = path.join(ROOT, 'data', 'guerrilla')
const SITE = 'https://cha0smagicklabs.com'

// Direccion postal real: CAN-SPAM la exige en email comercial.
// Se puede sobreescribir con la variable de entorno POSTAL_ADDRESS.
export const POSTAL_ADDRESS = process.env.POSTAL_ADDRESS || 'Calle 40a #20-35, Bogotá, Colombia'

// ---------- catalogo real ----------
const src = fs.readFileSync(path.join(ROOT, 'js', 'apps-data.js'), 'utf8')
const slice = (n) => {
  const i = src.indexOf(n)
  const a = src.indexOf('[', i)
  const b = src.indexOf('\n];', a)
  return eval(src.slice(a, b + 2))
}
export const APPS = slice('appsData')
export const BOOKS = slice('booksData')
const appById = (id) => APPS.find((a) => a.id === id)
const bookById = (id) => BOOKS.find((b) => b.id === id)
const appLink = (id) => (APPS.find((a) => a.id === id) || {}).playUrl || ''

// Coleccion completa de las 12 apps: landing propia (link corto y legible).
export const APPS_BUNDLE_PAGE = `${SITE}/landing-pages/apps-bundle.html`
// Bundle: SOLO libros y SOLO en espanol.
export const BUNDLE_ES = 'https://hotmart.com/es/marketplace/productos/bundle-todos-los-libros-esp/V107097103W'

// ---------- links verificados ----------
const VERIFIED = new Set(JSON.parse(fs.readFileSync(path.join(DIR, 'links-verified.json'), 'utf8')))
const isVerified = (url) => {
  if (!url) return false
  if (VERIFIED.has(url)) return true
  for (const v of VERIFIED) if (v.split('?')[0] === url.split('?')[0]) return true
  return false
}
export function utm(url, { source, content }) {
  try {
    const u = new URL(url)
    // fuera los utm que ya traia el sitio: solo los nuestros
    for (const k of [...u.searchParams.keys()]) {
      if (k.startsWith('utm_')) u.searchParams.delete(k)
    }
    u.searchParams.set('utm_source', source || 'guerrilla')
    u.searchParams.set('utm_medium', 'email')
    if (content) u.searchParams.set('utm_content', content.replace(/[^a-z0-9-]/gi, '').slice(0, 18))
    return u.toString()
  } catch { return url }
}

// ---------- tracks: que producto encaja con que ----------
// 'why' = razon real y factual de la app, en espanol. Para los leads en
// ingles se usa la descripcion de la ficha del catalogo, que ya esta en ingles.
export const TRACKS = [
  {
    key: 'tarot',
    re: /tarot|baraja|oracul|divination|adivin|lectura|reading|cartas|medium|psicic|psychic|claire|clairvoy/i,
    free: 'unofficial-rider-waite-tarot',
    apps: ['iching-oracle', 'chaos-sigil-generator'],
    books: ['tarot-chaos-pdf'],
    booksES: ['tarot-chaos-pdf', 'codex-chaoticus-pdf'],
    why: {
      'unofficial-rider-waite-tarot': 'la baraja Rider-Waite completa sin conexión, con 6 tiradas y enciclopedia',
      'iching-oracle': 'echar el I Ching con el algoritmo de tres monedas, 64 hexagramas',
      'chaos-sigil-generator': 'codificar tu intención en sigilos con alfabetos antiguos',
    },
  },
  {
    key: 'runas',
    re: /rune|runic|runas|futhark|ogham|norse|viking|elf/i,
    free: 'norse-rune-oracle',
    apps: ['iching-oracle', 'lunar-phase-calculator'],
    books: ['tratado-runas-cazadoras-caos-pdf'],
    booksES: ['tratado-runas-cazadoras-caos-pdf', 'codex-chaoticus-pdf'],
    why: {
      'norse-rune-oracle': '12+ tiradas de runas para el amor, la riqueza, la protección y la guía diaria',
      'iching-oracle': 'el I Ching con el algoritmo de tres monedas',
      'lunar-phase-calculator': 'seguir las fases lunares en tiempo real',
    },
  },
  {
    key: 'astrologia',
    re: /astro|zodiac|natal|horoscop|planeta|constelac|signo/i,
    free: 'astral-lab',
    apps: ['lunar-phase-calculator', 'unofficial-rider-waite-tarot'],
    books: [],
    booksES: [],
    why: {
      'astral-lab': 'carta natal, tránsitos en vivo y rejilla de aspectos, sin conexión, con VSOP87/ELP-2000',
      'lunar-phase-calculator': 'fases lunares en tiempo real',
    },
  },
  {
    key: 'suenos',
    re: /dream|sueñ|lucid|sleep|oniric/i,
    free: 'dream-machine',
    apps: ['lucid-dream', 'astral-lab'],
    books: [],
    booksES: [],
    why: {
      'dream-machine': 'protocolos de inducción, diario de sueños, chequeos de realidad y ondas binaurales',
      'lucid-dream': 'diario de sueños y proyección astral',
    },
  },
  {
    key: 'ufo',
    re: /ufo|alien|extraterrestre|spaceship|avistamiento|nave/i,
    free: 'noctem-tools',
    apps: ['eerieroads', 'lucid-dream'],
    books: ['codex-chaoticus-pdf'],
    booksES: ['codex-chaoticus-pdf'],
    why: {
      'noctem-tools': 'grabar EVP, leer sensores y llevar la sesión con cronómetro',
      'eerieroads': 'coordenadas GPS de intención sobre un mapa real',
    },
  },
  {
    key: 'ocultismo',
    re: /occult|esoteric|magic|magick|chaos|pagan|witch|ritual|sacred|temple|hermetic|sigil|goetia|grimoire|alchem|spiritual|metafis|gnost|invoc|hechic|demonolog|demons|satan|satanic|gothic|mystic|alchemy|kabbalah|cabal|druid|celtic|santeria|folklor|leyenda|legend|amulet|talisman|healing|voodoo|candomble/i,
    free: 'chaos-sigil-generator',
    apps: ['arcana-goetia', 'lunar-phase-calculator'],
    books: ['codex-chaoticus-pdf', 'complete-practical-treatise-magical-servitors-pdf', 'tarot-chaos-pdf'],
    booksES: ['codex-chaoticus-pdf', 'complete-practical-treatise-magical-servitors-pdf', 'catholiconomicon-pdf', 'tarot-chaos-pdf'],
    why: {
      'chaos-sigil-generator': 'codificar tu intención en sigilos con alfabetos antiguos y cuadrados planetarios',
      'arcana-goetia': 'los 72 espíritus de Salomón con sus sigilos y rituales guiados',
      'lunar-phase-calculator': 'seguir las fases lunares en tiempo real',
    },
  },
  {
    key: 'investigacion',
    re: /ghost|haunt|spirit|paranormal|investig|apparition|poltergeist|ectoplasm|session|sesion|entity|entidad|psicometr|autoctis|exorc|possess|fenomen|research|cienc/i,
    free: 'noctem-tools',
    apps: ['psi-gym', 'eerieroads'],
    books: ['codex-chaoticus-pdf', 'tarot-chaos-pdf'],
    booksES: ['codex-chaoticus-pdf', 'tarot-chaos-pdf'],
    why: {
      'noctem-tools': 'grabar EVP, leer sensores y llevar la sesión con cronómetro',
      'psi-gym': 'entrenarte en psicometría con cartas Zener y estadísticas de aciertos',
      'eerieroads': 'generar coordenadas GPS de intención sobre un mapa real',
    },
  },
]
const DEFAULT_TRACK = TRACKS.find((t) => t.key === 'investigacion')

/** Herramienta libre que encaja con cada track (para devs). */
export const TOOL_FOR_TRACK = {
  investigacion: 'paranormal-session-prep-checklist',
  ocultismo: 'sigil-intention-encoder',
  tarot: 'tarot-spread-builder',
  astrologia: 'full-birth-chart',
  runas: 'elder-futhark-reference',
  suenos: 'lucid-dream-training-planner',
  ufo: 'paranormal-session-prep-checklist',
}

/** Aperturas por track: giro por hash del email para que no se repitan. */
const OPENERS = {
  investigacion: [
    { ES: 'Me topé con {org} y me pareció que esto os puede servir.', EN: 'I came across {org} and thought this would be useful.' },
    { ES: 'Os escribo porque lo que hacéis se parece bastante a lo que hace la app.', EN: 'I am writing because what you do is close to what this app does.' },
    { ES: 'Vi lo que hacéis y me pareció que esto os puede servir.', EN: 'I saw what you do and thought this would be useful.' },
  ],
  ocultismo: [
    { ES: 'Me topé con {org} y me pareció que esto os puede servir.', EN: 'I came across {org} and thought this would be useful.' },
    { ES: 'Os escribo por lo de {trackWhy}.', EN: 'I am writing because of the {trackWhy} part.' },
    { ES: 'Vi lo que hacéis y me pareció que esto os puede servir.', EN: 'I saw what you do and thought this would be useful.' },
  ],
  tarot: [
    { ES: 'Me topé con {org} y me pareció que esto os puede servir.', EN: 'I came across {org} and thought this would be useful.' },
    { ES: 'Os escribo por las lecturas.', EN: 'I am writing because of the readings.' },
    { ES: 'Vi lo que hacéis y me pareció que esto os puede servir.', EN: 'I saw what you do and thought this would be useful.' },
  ],
  astrologia: [
    { ES: 'Me topé con {org} y me pareció que esto os puede servir.', EN: 'I came across {org} and thought this would be useful.' },
    { ES: 'Os escribo por los mapas y las cartas.', EN: 'I am writing because of the charts.' },
    { ES: 'Vi lo que hacéis y me pareció que esto os puede servir.', EN: 'I saw what you do and thought this would be useful.' },
  ],
  runas: [
    { ES: 'Me topé con {org} y me pareció que esto os puede servir.', EN: 'I came across {org} and thought this would be useful.' },
    { ES: 'Os escribo por las runas.', EN: 'I am writing because of the runes.' },
    { ES: 'Vi lo que hacéis y me pareció que esto os puede servir.', EN: 'I saw what you do and thought this would be useful.' },
  ],
  suenos: [
    { ES: 'Me topé con {org} y me pareció que esto os puede servir.', EN: 'I came across {org} and thought this would be useful.' },
    { ES: 'Os escribo por los sueños lúcidos.', EN: 'I am writing because of the lucid dreams.' },
    { ES: 'Vi lo que hacéis y me pareció que esto os puede servir.', EN: 'I saw what you do and thought this would be useful.' },
  ],
  ufo: [
    { ES: 'Me topé con {org} y me pareció que esto os puede servir.', EN: 'I came across {org} and thought this would be useful.' },
    { ES: 'Os escribo por las sesiones.', EN: 'I am writing because of the sessions.' },
    { ES: 'Vi lo que hacéis y me pareció que esto os puede servir.', EN: 'I saw what you do and thought this would be useful.' },
  ],
}
function hashOf(s) {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0
  return h
}

/**
 * Nombre real de la organizacion a partir del buzon. Es lo unico que se sabe
 * de un lead sin web, y es una senal fuerte: "paranormalengland@mail.com" ->
 * "Paranormal England". Sin inventar nada.
 */
const TOPICS = [
  [/paranormal/, 'Paranormal'], [/ghost/, 'Ghost'], [/witch/, 'Witch'], [/occult/, 'Occult'],
  [/vampire/, 'Vampire'], [/tarot/, 'Tarot'], [/astrolog/, 'Astrology'], [/rune/, 'Runes'],
  [/magick/, 'Magick'], [/magic/, 'Magic'], [/kabbalah|cabal/, 'Kabbalah'], [/druid|celtic/, 'Celtic'],
  [/ufo|alien/, 'UFO'], [/medium|psychic|tarotista/, 'Psychic'], [/ritual|spell/, 'Ritual'],
  [/gothic/, 'Gothic'], [/mystic|alchemy|alchem/, 'Mystic'], [/demon|demonolog/, 'Demonology'],
  [/satan|satanic/, 'Satanic'], [/sigil/, 'Sigil'], [/chaos/, 'Chaos Magick'], [/leyenda|legend/, 'Legend'],
  [/suenos|dream/, 'Dreams'], [/clairvoy|claire/, 'Clairvoyance'], [/santeria|folklor/, 'Santería'],
]
const ROLES = [
  [/society/, 'Society'], [/societ/, 'Society'], [/hunters/, 'Hunters'], [/hunt\b/, 'Hunters'],
  [/group/, 'Group'], [/club/, 'Club'], [/team/, 'Team'], [/collective/, 'Collective'],
  [/blog/, 'Blog'], [/channel/, 'Channel'], [/podcast/, 'Podcast'], [/shop/, 'Shop'],
  [/store/, 'Store'], [/bookshop|librer|libris/, 'Bookshop'], [/magazine|revista|mag/, 'Magazine'],
  [/news/, 'News'], [/network/, 'Network'], [/research/, 'Research'], [/investigat/, 'Investigation'],
  [/experience/, 'Experience'], [/world/, 'World'], [/realm/, 'Realm'], [/cafe/, 'Cafe'],
  [/page/, 'Page'], [/of\b/, ''], [/media/, 'Media'], [/press/, 'Press'], [/art/, 'Art'],
]
export function orgName(lead) {
  const n = (lead.name || '').trim()
  const looksReal = n && n.length > 2 && !/^(admin|info|contact|contacto|support|hello|webmaster|mail|prensa|redaccion|staff|team)$/i.test(n)
    && !/^\d+$/.test(n) && /[a-zA-Z]{3}/.test(n)
  // Palabras que no son un nombre de organizacion: si solo sale una de estas,
  // mejor no saludar con ella ("Hola Info:" no es una persona).
  const BLOCKED = new Set(['admin', 'info', 'contact', 'contacto', 'support', 'hello', 'hola',
    'mail', 'webmaster', 'press', 'prensa', 'redaccion', 'staff', 'team', 'equipo', 'general',
    'office', 'business', 'sales', 'ventas', 'noreply', 'no-reply', 'postmaster', 'abuse',
    'nada', 'x', 'the', 'of', 'and', 'y', 'de', 'del', 'la', 'el', 'lo', 'un', 'una'])
  // Ruido que se descarta al partir un buzon pegado ("paranormalmingle").
  const NOISE = new Set(['the', 'of', 'and', 'de', 'del', 'la', 'el', 'lo', 'news', 'blog',
    'group', 'team', 'club', 'shop', 'store', 'world', 'online', 'official', 'real', 'true',
    'global', 'hq', 'media', 'page', 'official', 'inc', 'llc', 'net', 'org', 'com', 'io', 'co'])

  const fromMail = (raw) => {
    let topic = '', role = '', rest = raw
    for (const [re, t] of TOPICS) {
      const m = raw.match(re)
      if (m) { topic = t; rest = raw.slice(0, m.index) + ' ' + raw.slice(m.index + m[0].length); break }
    }
    for (const [re, r] of ROLES) {
      const m = rest.match(re)
      if (m) { role = r; rest = rest.slice(0, m.index) + ' ' + rest.slice(m.index + m[0].length); break }
    }
    //_sobras_ con significado: "paranormalmingle" -> "Mingle", "a2" se descarta
    const leftovers = rest.split(/[^a-z0-9]+/i).map((w) => w.trim())
      .filter((w) => w.length >= 4 && /[a-z]/i.test(w) && !NOISE.has(w.toLowerCase()))
    const name = [topic, ...leftovers, role].filter(Boolean).join(' ')
    if (!name) return ''
    if (BLOCKED.has(name.toLowerCase())) return ''
    return name.charAt(0).toUpperCase() + name.slice(1)
  }
  if (looksReal) {
    if (/\s/.test(n)) return { name: n, how: 'nombre' }
    const derived = fromMail(n.toLowerCase())
    if (derived) return { name: derived, how: 'nombre-partido' }
    return { name: n, how: 'nombre' }
  }
  const local = (lead.email.split('@')[0] || '').toLowerCase()
  const raw = local.split(/[._+-]/).filter(Boolean).join(' ')
  const full = fromMail(raw)
  return full.length > 2 ? { name: full, how: 'buzon' } : { name: '', how: 'ninguno' }
}

/** Nombre limpio para el saludo. */
function salutation(lead) {
  const o = orgName(lead)
  if (!o.name) return ''
  const words = o.name.split(/\s+/)
  return words.length <= 4 ? o.name : words.slice(0, 2).join(' ')
}

/** Para devs: el paquete o repo real que publicaron. */
function devThing(lead, lang) {
  const note = (lead.note || '').trim()
  const url = (lead.url || '').trim()
  const es = lang !== 'EN'
  if ((lead.segment === 'npm-dev' || lead.segment === 'pypi-dev') && note) {
    const pkg = note.split(' v')[0]
    return es ? `tu paquete \`${pkg}\`` : `your package \`${pkg}\``
  }
  if (lead.segment === 'github-dev' && url) {
    const m = url.match(/github\.com\/([^/]+)\/([^/]+)/)
    if (m) return es ? `tu repo ${m[1]}/${m[2]}` : `your repo ${m[1]}/${m[2]}`
  }
  return ''
}

const plain = (s) => (s || '').replace(/[^\w\s]/g, ' ').replace(/\s+/g, ' ').trim()

function siteLine(g) {
  if (!g || g.kind !== 'sitio') return ''
  const topic = plain(g.h1 || g.title || g.desc || '')
  if (!topic) return ''
  return topic.length > 90 ? topic.slice(0, 90).replace(/\s+\S*$/, '') + '...' : topic
}

function postLine(g) {
  if (!g || !g.posts?.length) return ''
  const p = g.posts.find((x) => plain(x.title).length > 18) || g.posts[0]
  return plain(p.title)
}

export function leadSignal(lead, grounding) {
  const g = grounding?.[lead.email.toLowerCase()] || {}
  const parts = [
    lead.name, lead.email, g.domain, g.title, g.h1, g.desc,
    (lead.tags || []).join(' '),
    (g.posts || []).map((p) => p.title).join(' '),
    (g.search || []).map((s) => s.title).join(' '),
  ]
  return parts.filter(Boolean).join(' ')
}

/**
 * Codigos promo de Google Play por app.
 *
 * Si rellenas aqui el codigo de una app, el email la ofrece como regalo
 * INSTANTANEO y con enlace de la tienda: el lead no escribe nada y no hace
 * falta que nadie mande el codigo a mano.
 *
 *   PROMO_CODES['noctem-tools'] = 'ABC123XYZ'
 *
 * Mientras este vacio, el email ofrece la app gratis a cambio de que
 * conteste, y anade ademas una herramienta libre (que si es inmediata).
 */
export const PROMO_CODES = {}

/**
 * Comunidad de Telegram: a donde lleva el email para que el lead entre en el
 * grupo. Son los assets que ya enlaza el sitio (1.937 suscriptores en el canal
 * y 686 miembros en el grupo COVEN), no el canal de 5.
 */
import { OPT_OUT_MAILTO, OPT_OUT_MAILTO_EN } from './guerrilla-policy.mjs'
import { FREE_MAIL } from './guerrilla-freemail.mjs'

export const COMMUNITY = {
  // La comunidad son DOS canales y DOS grupos. El mas grande de cada familia
  // es el de la biblioteca; el mas vacio es el oficial de la marca. Se
  // empujan los cuatro, no solo uno.
  oficial: {
    channel: 'https://t.me/cha0smagicklabs',
    group: 'https://t.me/+krfQJgro4hBkNTE5',
    channelName: 'Cha0smagick Labs',
    groupName: 'Cha0smagick Labs Enviroment',
  },
  biblioteca: {
    channel: 'https://t.me/magiacaotica',
    group: 'https://t.me/magiacaoticacoven',
    channelName: 'Magia Caótica: Magia del Caos Práctica (Biblioteca)',
    groupName: 'COVEN',
  },
}

export function trackFor(text) {
  for (const t of TRACKS) if (t.re.test(text)) return t
  return DEFAULT_TRACK
}

function bookAllowed(bookId, lang) {
  const b = bookById(bookId)
  if (!b) return null
  if (lang === 'EN' && !/English/i.test(b.language || '')) return null
  return b
}

/**
 * Descripcion del producto EN el idioma del lead.
 * ES -> el texto propio (traducido, con acentos).
 * EN -> la descripcion de la ficha del catalogo, que ya esta en ingles.
 */
function descFor(item, lang, whyText) {
  if (lang === 'EN') return (item.description || whyText || '').replace(/\s+/g, ' ').trim()
  return whyText || (item.description || '').replace(/\s+/g, ' ').trim()
}

// ---------- plantillas ----------
const T = {
  partnerES: (ctx) => `${ctx.opener}

Somos Cha0smagick Labs: 42 herramientas de ocultismo gratis y 12 apps Android de pago único.

Lo que te propongo, sin condiciones:

1) Una copia de ${ctx.app ? ctx.app.name : 'NOCTEM'} (${ctx.app ? ctx.app.price : '$14.99'}) para sortear entre tus suscriptores.
2) Las 42 herramientas con tarjeta 1080×1080 lista para publicar y marca de agua: ${ctx.toolUrl}
3) Si vendes, el programa de afiliados paga ${ctx.rate} por app y ${ctx.booksRate} por el bundle de libros, con cookie de 90 días y pago mensual.

${ctx.interestLabel ? `Vi que te interesa el área de ${ctx.interestLabel}: ${ctx.toolUrl}` : ''}

${ctx.cta}

Un saludo,
Aleksandr / Frater Alek0s
Cha0smagick Labs`,

  partnerEN: (ctx) => `${ctx.opener}

I run Cha0smagick Labs: 42 free occult tools plus 12 one-time-purchase Android apps.

What I would like to offer, no strings attached:

1) A free copy of ${ctx.app ? ctx.app.name : 'NOCTEM'} (${ctx.app ? ctx.app.price : '$14.99'}) for a giveaway among your subscribers.
2) The 42 free tools with ready-made 1080×1080 share cards: ${ctx.toolUrl}
3) If you ever promote us, the affiliate program pays ${ctx.rate} per app sale and ${ctx.booksRate} on the book bundle, 90-day cookie, paid monthly.

${ctx.interestLabel ? `Since you cover ${ctx.interestLabel}, this is the one people click: ${ctx.toolUrl}` : ''}

${ctx.cta}

Best,
Aleksandr / Frater Alek0s
Cha0smagick Labs`,

  grupoES: (ctx) => `${ctx.opener}

La guía rápida de Magia del Caos en PDF (sigilos, gnosis, práctica y seguridad) la tienes aquí y es sin registro:
${ctx.guideUrl}

Y las 42 herramientas libres funcionan en el navegador, sin cuenta y sin tracking. La que más se usa:
${ctx.toolUrl}

Si quieres llevar el tema más lejos, ${ctx.productLabel} está a ${ctx.productPrice} (PDF, acceso inmediato): ${ctx.productUrl}
Y en Android: ${ctx.app ? `${ctx.app.name} a ${ctx.app.price}` : '12 apps de pago único'}${ctx.appUrl ? ` — ${ctx.appUrl}` : ''}

${ctx.cta}

Un saludo,
Aleksandr / Frater Alek0s
Cha0smagick Labs`,

  grupoEN: (ctx) => `${ctx.opener}

The Chaos Magick quickstart guide as a PDF (sigils, gnosis, practice and safety) is here, no signup:
${ctx.guideUrl}

And the 42 free tools run in the browser, no account, no tracking. The most used one:
${ctx.toolUrl}

If you want to take it further, ${ctx.productLabel} is ${ctx.productPrice} (PDF, instant access): ${ctx.productUrl}
And on Android: ${ctx.app ? `${ctx.app.name} for ${ctx.app.price}` : '12 one-time-purchase apps'}${ctx.appUrl ? ` — ${ctx.appUrl}` : ''}

${ctx.cta}

Best,
Aleksandr / Frater Alek0s
Cha0smagick Labs`,

  devES: (ctx) => `${ctx.opener}

42 herramientas de ocultismo gratis en el navegador y 12 apps Android de pago único. Sin cuentas, sin tracking.

${ctx.reason ? `${ctx.reason}\n\n` : ''}Gratis, sin API key y sin registro: ${ctx.toolUrl}

Si le sirve a tus usuarios, enlázalo, intégralo o déjalo junto a tu proyecto. Y si prefieres ganar con ello, el programa de afiliados paga ${ctx.rate} por app, con cookie de 90 días y sin mínimo de cobro.

${ctx.cta}

Un saludo,
Aleksandr / Frater Alek0s
Cha0smagick Labs`,

  devEN: (ctx) => `${ctx.opener}

42 free browser-based occult tools and 12 one-time-purchase Android apps. No accounts, no tracking.

${ctx.reason ? `${ctx.reason}\n\n` : ''}Free to use, no API key, no signup: ${ctx.toolUrl}

If it fits your users, link it, embed it, or bundle it with your own app. If you would rather earn on it, the affiliate program pays ${ctx.rate} per app sale with a 90-day cookie and no minimum payout target.

${ctx.cta}

Best,
Aleksandr / Frater Alek0s
Cha0smagick Labs`,
}

const CTAS = {
  partnerES: [
    'Te lo dejo preparado para esta semana si te sirve. Dime y te paso los enlaces con tu referencia ya puesta.',
    'Si te interesa, contéstame y te mando los enlaces con tu referencia puesta.',
    'Dime si lo quieres y te lo mando con tu referencia ya escrita.',
  ],
  partnerEN: [
    'If it helps, I can send the links with your referral already attached. Want them?',
    'Say the word and I will send the links with your referral already in them.',
    'Happy to send the links with your referral attached if you want them.',
  ],
  grupoES: [
    'Si no te sirve, no pasa nada. Y si prefieres no recibir estos emails, responde BAJA.',
    'Sin compromiso: si no te interesa, responde BAJA y te saco de la lista.',
    'Y si prefieres no recibir estos emails, responde BAJA y lo quitamos.',
  ],
  grupoEN: [
    'No pressure — if it is not for you, just reply UNSUBSCRIBE and I will stop writing to you.',
    'If it is not useful, reply UNSUBSCRIBE and I will take you off the list.',
    'Reply UNSUBSCRIBE any time and I will stop writing to you.',
  ],
  devES: [
    'El enlace de arriba ya funciona: no hace falta que me respondas para usarlo.',
    'No hace falta que contestes para usar el enlace; el link ya va con mis datos.',
    'El link funciona tal cual. Si quieres, contéstame y te digo cómo integrarlo.',
  ],
  devEN: [
    'Either way the link above works for you today — no reply needed.',
    'No reply needed, the link above is already set up.',
    'The link works as-is. Reply if you want help wiring it in.',
  ],
}

/**
 * Construye el email ad-hoc de un lead.
 */
export function buildEmailAdHoc(lead, opts = {}) {
  const lang = lead.lang === 'EN' ? 'EN' : 'ES'
  const grounding = opts.grounding || {}
  const g = grounding[lead.email.toLowerCase()] || {}
  const signal = leadSignal(lead, grounding)
  const track = trackFor(signal)
  const source = opts.source || 'guerrilla'
  // codigo corto: los enlaces van dentro de un correo escrito, tienen que leerse bien
  const SHORT = { investigacion: 'inv', ocultismo: 'ocu', tarot: 'tar', astrologia: 'ast', runas: 'run', suenos: 'suen', ufo: 'ufo' }
  const content = SHORT[track.key] || 'gen'

  const freeApp = appById(track.free)
  if (!freeApp) throw new Error('track sin app gratis: ' + track.key)

  const appList = track.apps
    .map((id) => appById(id))
    .filter((a) => a && isVerified(a.playUrl))
    .slice(0, 2)
  const bookIds = lang === 'EN' ? (track.books || []) : (track.booksES || track.books || [])
  const bookList = bookIds.map((id) => bookAllowed(id, lang)).filter((b) => b && isVerified(b.hotmartLink)).slice(0, 1)

  const isDev = ['github-dev', 'npm-dev', 'pypi-dev'].includes(lead.segment)
  const isPartner = lead.segment === 'partner-youtube' || lead.segment === 'partner-media'
  const isGrupo = lead.segment === 'grupo-calido' || lead.segment === 'colectivas-paranormal'

  const sal = salutation(lead)
  const openers = OPENERS[track.key] || OPENERS.investigacion
  const openerObj = openers[hashOf(lead.email) % openers.length]
  const freeWhy = descFor(freeApp, lang, track.why?.[freeApp.id])

  const lines = []
  lines.push(lang === 'EN' ? `Hi ${sal || 'there'},` : (sal ? `Hola ${sal}:` : 'Hola:'))

  // apertura: algo real de su web (o de su nombre si no hay web)
  const site = siteLine(g)
  const post = postLine(g)
  const thing = devThing(lead, lang)
  if (isDev && thing) {
    lines.push(lang === 'EN' ? `Saw ${thing} and thought of this.` : `Vi ${thing} y me acordé de esto.`)
  } else if (post) {
    lines.push(lang === 'EN'
      ? `I came across your piece "${post}" and thought of this.`
      : `Leí lo de "${post}" y me acordé de esto.`)
  } else if (site) {
    lines.push(lang === 'EN'
      ? `I came across ${g.domain} — ${site} — and thought this was worth sending.`
      : `Estuve en ${g.domain} — ${site} — y me pareció que esto te encaja.`)
  } else {
    // Toda apertura lleva un identificador unico del lead: su nombre, su
    // dominio o su buzon. 23 correos identicos es justo el patron que hace
    // que una cuenta la marquen como lista.
    const dom = (lead.email.split('@')[1] || '').toLowerCase()
    const local = (lead.email.split('@')[0] || '').toLowerCase()
    // en webmail el buzon es lo que distingue a la org: el nombre deducido se repite
    const ident = FREE_MAIL.has(dom) ? (local.length > 2 ? local : (sal || dom)) : (sal || dom)
    const web = FREE_MAIL.has(dom) ? '' : ' (' + dom + ')'
    lines.push(lang === 'EN'
      ? `I came across ${ident}${web} and thought this was worth sending.`
      : `Me topé con ${ident}${web} y me pareció que esto te encaja.`)
  }

  // LA OFERTA: una app gratis
  const promo = PROMO_CODES[freeApp.id]
  lines.push('')
  if (promo) {
    // con codigo: el regalo es inmediato y no depende de que conteste nadie
    lines.push(lang === 'EN'
      ? `${freeApp.name} (${freeApp.price}) is yours: ${freeWhy}. Use the code ${promo} in Google Play: ${utm(appLink(freeApp.id), { source, content })}`
      : `${freeApp.name} (${freeApp.price}) es tuyo: ${freeWhy}. Usa el código ${promo} en Google Play: ${utm(appLink(freeApp.id), { source, content })}`)
  } else {
    lines.push(lang === 'EN'
      ? `I'm giving away ${freeApp.name} (${freeApp.price}) — ${freeWhy}. Say the word and I'll send you the Google Play promo code.`
      : `Te dejo ${freeApp.name} (${freeApp.price}) gratis: ${freeWhy}. Si la quieres, contéstame a este correo y te paso el código de promo de Google Play.`)
  }

  // apps y libros que encajan (para compra)
  const offer = []
  for (const a of appList) {
    offer.push(`${a.name} (${a.price}) — ${descFor(a, lang, track.why?.[a.id])}: ${utm(a.playUrl, { source, content })}`)
  }
  for (const b of bookList) {
    offer.push(`${b.name} (${b.price}) — PDF: ${utm(b.hotmartLink, { source, content })}`)
  }
  if (offer.length) {
    lines.push('')
    lines.push(lang === 'EN' ? 'The rest that fits what you do:' : 'Lo demás que encaja con lo tuyo:')
    for (const o of offer) lines.push('- ' + o)
  }

  // escalera de compra
  const ladder = []
  ladder.push(lang === 'EN'
    ? `the 12 apps: ${utm(APPS_BUNDLE_PAGE, { source, content })}`
    : `las 12 apps: ${utm(APPS_BUNDLE_PAGE, { source, content })}`)
  if (lang === 'ES' && BUNDLE_ES) ladder.push(`los 9 libros en PDF a $24.99: ${utm(BUNDLE_ES, { source, content })}`)
  if (ladder.length) {
    lines.push('')
    lines.push((lang === 'EN' ? 'And if you want the lot: ' : 'Y si te lo quieres llevar todo: ') + ladder.join(lang === 'EN' ? ' · ' : ' · '))
  }

  // promocion: si recomienda, gana
  lines.push('')
  lines.push(lang === 'EN'
    ? `And if you recommend one of these, you keep 30% per app and 40% on the books bundle (90-day cookie, paid monthly): ${utm(SITE + '/landing-pages/affiliate-terms.html', { source, content })}`
    : `Y si recomiendas alguna, te queda el 30% por app y el 40% por el bundle (cookie de 90 días, pago mensual): ${utm(SITE + '/landing-pages/affiliate-terms.html', { source, content })}`)

  // devs: una herramienta libre para meter en su proyecto
  if (isDev) {
    const tool = TOOL_FOR_TRACK[track.key] || 'sigil-intention-encoder'
    lines.push('')
    lines.push(lang === 'EN'
      ? `If it helps your users, this one is free with no signup: ${utm(SITE + '/tools/' + tool + '.html', { source, content })}`
      : `Si te sirve para tus usuarios, esta herramienta es libre y sin registro: ${utm(SITE + '/tools/' + tool + '.html', { source, content })}`)
  }

  // producto principal para el grupo: bundle en ES, libro en EN
  let productUrl = '', productLabel = '', productPrice = ''
  if (isGrupo) {
    if (lang === 'ES' && BUNDLE_ES) {
      productUrl = utm(BUNDLE_ES, { source, content })
      productLabel = 'el bundle de 9 libros de ocultismo'
      productPrice = '$24.99'
    } else if (bookList[0]) {
      productUrl = utm(bookList[0].hotmartLink, { source, content })
      productLabel = bookList[0].name
      productPrice = bookList[0].price
    }
  }

  // regalo inmediato que no depende de que conteste nadie
  if (!promo) {
    const tool = TOOL_FOR_TRACK[track.key] || 'sigil-intention-encoder'
    lines.push('')
    lines.push(lang === 'EN'
      ? `And this one needs no signup at all: ${utm(SITE + '/tools/' + tool + '.html', { source, content })}`
      : `Y esto no necesita registro ni cuenta: ${utm(SITE + '/tools/' + tool + '.html', { source, content })}`)
  }

  // embudo a la comunidad: los DOS canales y los DOS grupos
  lines.push('')
  lines.push(lang === 'EN'
    ? `On Telegram there are two channels and two groups where this is worked on:`
    : `En Telegram hay dos canales y dos grupos donde se trabaja esto:`)
  for (const k of ['oficial', 'biblioteca']) {
    const tg = COMMUNITY[k]
    lines.push(lang === 'EN'
      ? `- ${tg.channelName}: ${tg.channel}  |  group: ${tg.group}`
      : `- ${tg.channelName}: ${tg.channel}  |  grupo: ${tg.group}`)
  }

  const cta = pick(CTAS[isPartner ? `partner${lang}` : isGrupo ? `grupo${lang}` : `dev${lang}`], lead.email)

  lines.push('')
  lines.push(lang === 'EN' ? 'Aleksandr / Frater Alek0s' : 'Aleksandr / Frater Alek0s')
  lines.push('Cha0smagick Labs — ' + SITE)

  // pie legal (CAN-SPAM): identidad + opt-out
  const foot = ['', '---', `Cha0smagick Labs · ${SITE} · magiacaoticapractica@gmail.com`]
  if (POSTAL_ADDRESS) foot.push(POSTAL_ADDRESS)
  // el opt-out es un enlace real: un clic y fuera, sin tener que responder
  const optOut = lang === 'EN'
    ? `<a href="${OPT_OUT_MAILTO_EN}">Unsubscribe</a>`
    : `<a href="${OPT_OUT_MAILTO}">BAJA / unsubscribe</a>`
  foot.push(lang === 'EN'
    ? `You get this because you publish or work on occult and paranormal stuff. ${optOut} and I will stop writing to you.`
    : `Recibes este correo porque publicas o trabajas en lo de ocultismo y paranormal. ${optOut} y dejo de escribirte.`)

  return {
    to: lead.email,
    subject: subjectFor(lead, track, freeApp, lang),
    body: lines.join('\n') + '\n' + foot.join('\n'),
    lang,
    segment: lead.segment,
    track: track.key,
    freeApp: freeApp.id,
    apps: appList.map((a) => a.id),
    books: bookList.map((b) => b.id),
    productUrl, productLabel, productPrice,
  }
}

function pick(arr, seed) { return arr[hashOf(seed) % arr.length] }

function subjectFor(lead, track, freeApp, lang) {
  // Asunto con el nombre de la organizacion: es la senal de personalizacion mas
  // fuerte que hay, y baja el score de spam. Sin palabras de oferta, sin
  // mayusculas, sin puntuacion~, sin signos de exclamacion.
  // el asunto se recorta a ~70 caracteres en Gmail: el nombre va recortado
  const salFull = salutation(lead)
  const sal = salFull.length > 30 ? salFull.split(/\s+/).slice(0, 2).join(' ').slice(0, 30) : salFull
  const short = freeApp.name.replace(/:.*$/, '').trim()
  // Sin nombre de organizacion no se inventa: el asunto nombra el producto.
  if (!sal) {
    if (lang === 'EN') {
      const t = {
        investigacion: 'the paranormal investigation app to try',
        ocultismo: 'the sigil generator to try',
        tarot: 'the full Rider-Waite tarot to try',
        astrologia: 'the offline natal chart app to try',
        runas: 'the Norse rune oracle to try',
        suenos: 'the lucid dreaming app to try',
        ufo: 'the EVP recorder to try',
      }
      return `${short} — ${t[track.key] || short}`
    }
    const t = {
      investigacion: 'la app de investigación paranormal para probarla',
      ocultismo: 'el generador de sigilos para probarlo',
      tarot: 'el tarot Rider-Waite completo para probarlo',
      astrologia: 'la carta natal offline para probarla',
      runas: 'el oráculo de runas para probarlo',
      suenos: 'la app de sueños lúcidos para probarla',
      ufo: 'el grabador EVP para probarlo',
    }
    return `${short} — ${t[track.key] || short}`
  }
  if (lang === 'EN') {
    const byTrack = {
      investigacion: 'a paranormal investigation app',
      ocultismo: 'a sigil generator',
      tarot: 'a full Rider-Waite tarot',
      astrologia: 'an offline natal chart app',
      runas: 'a Norse rune oracle',
      suenos: 'a lucid dreaming app',
      ufo: 'an EVP recorder',
    }
    return `${sal} — ${byTrack[track.key] || short}`
  }
  const byTrack = {
    investigacion: 'app de investigación paranormal',
    ocultismo: 'generador de sigilos',
    tarot: 'tarot Rider-Waite completo',
    astrologia: 'carta natal offline',
    runas: 'oráculo de runas',
    suenos: 'app de sueños lúcidos',
    ufo: 'grabador EVP',
  }
  return `${sal} — ${byTrack[track.key] || short}`
}
