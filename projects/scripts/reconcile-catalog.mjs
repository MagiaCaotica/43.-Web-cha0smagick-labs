#!/usr/bin/env node
/**
 * P0-02 — Matriz de reconciliacion del catalogo.
 * Fuentes: js/apps-data.js (sitio) | scripts/bots/data/offers.json (bot) |
 * data/play-catalog.json (verificacion Play) | apps/*.html (paginas).
 * Salida: data/catalog-reconciliation.json + docs/reconciliacion-catalogo.md
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
const read = (p) => JSON.parse(fs.readFileSync(path.join(ROOT, p), 'utf8'))
const text = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8')

const src = text('js/apps-data.js')
const slice = (n) => { const i = src.indexOf(n); const a = src.indexOf('[', i); const b = src.indexOf('\n];', a); return eval(src.slice(a, b + 2)) }
const APPS = slice('appsData')
const BOOKS = slice('booksData')
const bot = read('scripts/bots/data/offers.json')
const play = read('data/play-catalog.json')

const playByPkg = new Map(play.apps.map((a) => [a.package, a]))
const botApps = new Map(bot.apps.map((a) => [a.id, a]))
const botBooks = new Map(bot.books.map((b) => [b.id, b]))
// el bot usa ids propios sin el sufijo -pdf: se indexa por la pagina de venta
const botBookByPage = new Map(bot.books.map((b) => [b.url.replace(/^https?:\/\/cha0smagicklabs\.com/, ''), b]))

const rows = []
const problems = []
const priceOf = (s) => (String(s || '').match(/([\d.]+)/) || [, ''])[1]

for (const a of APPS) {
  const file = 'apps/' + a.id + '.html'
  const hasPage = fs.existsSync(path.join(ROOT, file))
  const pkg = (a.url || '').match(/id=([\w.]+)/)?.[1] || ''
  const pc = pkg ? playByPkg.get(pkg) : null
  const ba = botApps.get(a.id)
  const sitePrice = priceOf(a.price)
  const playPrice = pc?.play?.price_usd ? Number(pc.play.price_usd) : null
  const botPrice = priceOf(ba?.price)
  const promo = pc?.play?.promo_price_usd ? Number(pc.play.promo_price_usd) : null

  let state = 'verificada'
  if (!hasPage) { problems.push(`${a.id}: falta la pagina ${file}`); state = 'huerfana' }
  if (!pc) problems.push(`${a.id}: sin verificacion en data/play-catalog.json`)
  if (!ba) problems.push(`${a.id}: el bot no la conoce`)
  if (pc && playPrice !== null && sitePrice && Math.abs(playPrice - Number(sitePrice)) > 0.001) {
    problems.push(`${a.id}: precio del sitio ${sitePrice} != precio de lista en Play ${playPrice}`)
  }
  if (ba && botPrice && sitePrice && Math.abs(Number(botPrice) - Number(sitePrice)) > 0.001) {
    problems.push(`${a.id}: el bot dice ${botPrice} y el sitio ${sitePrice}`)
  }
  if (pc && pc.play?.listing_state !== 'live') problems.push(`${a.id}: la ficha de Play no consta como live`)

  rows.push({
    slug: a.id, name: a.name, package: pkg, page: hasPage ? file : 'FALTA',
    site_price: sitePrice, play_list_price: playPrice, play_promo_price: promo,
    bot_price: botPrice, bot_knows: !!ba, play_state: pc?.play?.listing_state || 'sin-dato',
    play_title_es: pc?.play?.store_title_es || null, play_title: pc?.play?.store_title || null,
    installs: pc?.play?.installs_tier || null, rating: pc?.play?.rating ?? null,
    rating_count: pc?.play?.rating_count ?? null,
    play_url: pkg ? 'https://play.google.com/store/apps/details?id=' + pkg : null,
  })
}

// libros: el sitio tiene 9, el bot deberia tenerlos 9
const bookRows = []
for (const bk of BOOKS) {
  const page = 'books/' + bk.id + '.html'
  const hasPage = fs.existsSync(path.join(ROOT, page))
  const bb = botBookByPage.get('/' + page)
  const sitePrice = priceOf(bk.price)
  const botPrice = priceOf(bb?.price)
  if (!bb) problems.push(`libro ${bk.id}: el bot no lo conoce`)
  if (bb && botPrice && sitePrice && Math.abs(Number(botPrice) - Number(sitePrice)) > 0.001) {
    problems.push(`libro ${bk.id}: el bot dice ${botPrice} y el sitio ${sitePrice}`)
  }
  if (!hasPage) problems.push(`libro ${bk.id}: falta la pagina ${page}`)
  bookRows.push({
    slug: bk.id, name: bk.name, language: bk.language, page: hasPage ? page : 'FALTA',
    site_price: sitePrice, bot_price: botPrice, bot_id: bb?.id || null, bot_knows: !!bb,
    checkout: bb?.checkoutUrl || null, hotmart_id: bb?.hotmartProductId || null,
  })
}

const out = { generated: new Date().toISOString(), apps: rows, books: bookRows, bundle: bot.bundle, problems }
fs.writeFileSync(path.join(ROOT, 'data', 'catalog-reconciliation.json'), JSON.stringify(out, null, 2))

// ---------- doc ----------
const D = []
D.push('# Reconciliación de catálogo (P0-02 / P0-09)', '')
D.push('> Generado por `node projects/scripts/reconcile-catalog.mjs`.')
D.push('> Las 12 fichas de Play se verificaron **en vivo** el ' + play.verified_at + ' con BrowserOS')
D.push('> (sesión de Google del owner, `hl=es&gl=US`), leyendo el h1, el botón de compra,')
D.push('> el `aggregateRating` y el tier de instalaciones de cada ficha pública.', '')
D.push('## Apps', '')
D.push('| slug | package | sitio | Play (lista) | promo | bot | installs | nota |')
D.push('|---|---|---|---|---|---|---|---|')
for (const r of rows) {
  D.push(`| ${r.slug} | \`${r.package}\` | $${r.site_price} | ${r.play_list_price !== null ? '$' + r.play_list_price : 'n/d'} | ${r.play_promo_price !== null ? '**$' + r.play_promo_price + '**' : '—'} | ${r.bot_knows ? '$' + r.bot_price : 'NO'} | ${r.installs || 'n/d'} | ${r.rating ? r.rating + '★ (' + r.rating_count + ')' : 'sin nota'} |`)
}
D.push('')
D.push('### Títulos que muestra Play (hl=es) frente al nombre del sitio', '')
D.push('| slug | Play (es) | sitio |')
D.push('|---|---|---|')
for (const r of rows) D.push(`| ${r.slug} | ${r.play_title_es || '—'} | ${r.name} |`)
D.push('')
D.push('## Libros', '')
D.push('| slug | idioma | sitio | bot | checkout |')
D.push('|---|---|---|---|---|')
for (const r of bookRows) D.push(`| ${r.slug} | ${r.language} | $${r.site_price} | ${r.bot_knows ? '$' + r.bot_price : '**NO**'} | ${r.hotmart_id || '—'} |`)
D.push('')
D.push('## Bundle', '')
D.push(`- bot: **${bot.bundle.price}** (${bot.bundle.discountLabel}), ${bot.bundle.shortDesc}`)
D.push(`- sitio: $24.99 (59% off), 9 libros`)
D.push('')
D.push('## Discrepancias', '')
if (!problems.length) D.push('Ninguna: las 4 fuentes cuadran.')
for (const p of problems) D.push('- ' + p)
D.push('')
fs.writeFileSync(path.join(ROOT, 'docs', 'reconciliacion-catalogo.md'), D.join('\n'), 'utf8')

console.log('=== P0-02 RECONCILIACION ===')
console.log('apps: ' + rows.length + ' | libros: ' + bookRows.length + ' | discrepancias: ' + problems.length)
for (const p of problems) console.log('  - ' + p)
console.log('escrito data/catalog-reconciliation.json y docs/reconciliacion-catalogo.md')
