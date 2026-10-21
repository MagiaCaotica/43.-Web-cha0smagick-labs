import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from 'node:url'
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
const TODAY = '2026-10-21'

// ============ 1) el bot: 2 libros que no tenia + precio del bundle equivocado ============
const OFFERS = path.join(ROOT, 'scripts', 'bots', 'data', 'offers.json')
const off = JSON.parse(fs.readFileSync(OFFERS, 'utf8'))

// lo que el bot NO tenia: los 2 libros que el sitio si vende
const NEW_BOOKS = [
  {
    id: 'catholiconomicon',
    name: 'CATHOLICONOMICON',
    subtitle: 'Chaos Magick for Catholic Practitioners',
    price: '$9.99 USD',
    url: 'https://cha0smagicklabs.com/books/catholiconomicon-pdf.html',
    funnel: 'https://cha0smagicklabs.com/books/catholiconomicon-pdf.html',
    checkoutUrl: 'https://pay.hotmart.com/A107900946S?checkoutMode=2',
    hotmartProductId: 'A107900946S',
    priceSource: 'public book page (books/catholiconomicon-pdf.html)',
    checkoutStatus: 'checkout_url_observed_in_page_sale_unverified',
    tags: ['chaos-magick', 'catholic', 'practitioner', 'ritual'],
    shortDesc: 'Chaos magick para practicantes catolicos.',
    image: null,
  },
  {
    id: 'complete-practical-treatise-servitors',
    name: 'The Complete Practical Treatise on Magical Servitors',
    subtitle: 'Design, activation and maintenance',
    price: '$9.99 USD',
    url: 'https://cha0smagicklabs.com/books/complete-practical-treatise-magical-servitors-pdf.html',
    funnel: 'https://cha0smagicklabs.com/books/complete-practical-treatise-magical-servitors-pdf.html',
    checkoutUrl: 'https://pay.hotmart.com/U108075109V?checkoutMode=2',
    hotmartProductId: 'U108075109V',
    priceSource: 'public book page (books/complete-practical-treatise-magical-servitors-pdf.html)',
    checkoutStatus: 'checkout_url_observed_in_page_sale_unverified',
    tags: ['servitors', 'chaos-magick', 'practice', 'grindho'],
    shortDesc: 'The complete grimoire on magical servitors.',
    image: null,
  },
]
const before = off.books.length
for (const b of NEW_BOOKS) {
  if (!off.books.some((x) => x.id === b.id)) off.books.push(b)
}
console.log(`libros del bot: ${before} -> ${off.books.length}`)

// el bundle: el sitio lo tiene a $24.99 (9 libros, 59% off). El bot decia $19.99 (7 libros).
// eso es un bot que cita un precio que no existe.
const b = off.bundle
const oldBundle = { price: b.price, original: b.originalPrice, disc: b.discountLabel, desc: b.shortDesc }
b.price = '$24.99 USD'
b.originalPrice = '$60.91 USD'
b.discountLabel = '59% off'
b.shortDesc = '9 esoteric books at 59% off. Complete occult library bundle.'
b.originalPriceSource = 'sum of the 9 public book page prices as of ' + TODAY
b.priceSource = 'public books-bundle landing page (landing-pages/books-bundle.html), verified ' + TODAY
console.log(`bundle del bot: ${oldBundle.price} / ${oldBundle.disc} / "${oldBundle.desc}"  ->  ${b.price} / ${b.discountLabel} / "${b.shortDesc}"`)

// las 12 apps: hoy se han verificado vivas una a una en Play
for (const a of off.apps) a.listingStatus = 'live_verified_' + TODAY
off._meta.reconciledAt = TODAY
off._meta.source = 'scripts/bots/data/offers.json; apps reconciled ' + TODAY + ' (12/12 fichas de Play verificadas en vivo con BrowserOS); books reconciled ' + TODAY
off._meta.externalListingStatus = 'apps live_verified_' + TODAY + '; books checkout_url_observed_in_page_sale_unverified'
fs.writeFileSync(OFFERS, JSON.stringify(off, null, 2) + '\n', 'utf8')
console.log('offers.json del bot actualizado')

// ============ 2) play-catalog.json con los datos vivos de hoy ============
const LIVE = {
  'psi-gym': { es: 'PSI GYM: Zener e Intuicion', buy: 2.99, list: 3.99, inst: '10+', r: null, rc: null },
  'arcana-goetia': { es: 'Arcana Goetia: 72 Espiritus', buy: 3.99, list: 3.99, inst: '50+', r: null, rc: null },
  'norse-rune-oracle': { es: 'Oraculo Runico Nordico Futhark', buy: 3.99, list: 3.99, inst: '10+', r: null, rc: null },
  'lunar-phase-calculator': { es: 'Fase Lunar: Calendario', buy: 3.99, list: 3.99, inst: '10+', r: null, rc: null },
  'iching-oracle': { es: 'I Ching: Guia de Hexagramas', buy: 3.99, list: 3.99, inst: '10+', r: null, rc: null },
  'chaos-sigil-generator': { es: 'Generador de Sigilos Caos', buy: 3.99, list: 3.99, inst: '50+', r: 5, rc: 23 },
  'unofficial-rider-waite-tarot': { es: 'Tarot: Lector Rider-Waite', buy: null, list: 9.99, inst: '10+', r: null, rc: null },
  'dream-machine': { es: 'Dreamachine: Lucidez con IA', buy: 3.99, list: 3.99, inst: '10+', r: null, rc: null },
  'astral-lab': { es: 'Astral Lab: Carta Natal', buy: 6.99, list: 6.99, inst: '5+', r: null, rc: null },
  'eerieroads': { es: 'Eerie Roads: Rutas Malditas', buy: null, list: 9.99, inst: '1+', r: null, rc: null },
  'lucid-dream': { es: 'Lucidez: Proyeccion Astral', buy: 8.99, list: 9.99, inst: '0+', r: null, rc: null },
  'noctem-tools': { es: 'NOCTEM: Kit Cazafantasmas', buy: null, list: 14.99, inst: '10+', r: null, rc: null },
}
const PC = path.join(ROOT, 'data', 'play-catalog.json')
const pc = JSON.parse(fs.readFileSync(PC, 'utf8'))
pc.verified_at = TODAY
pc.verified_by = 'BrowserOS neo (sesion de Google del owner, ficha publica de Play, hl=es&gl=US)'
const changes = []
for (const a of pc.apps) {
  const slug = a.page.replace('apps/', '').replace('.html', '')
  const L = LIVE[slug]
  if (!L) continue
  a.play.store_title_es = L.es
  a.play.price_usd = String(L.list)
  a.play.installs_tier = L.inst
  a.play.rating = L.r
  a.play.rating_count = L.rc
  a.play.listing_state = 'live'
  a.play.play_url = 'https://play.google.com/store/apps/details?id=' + a.package
  if (L.buy !== null && L.buy !== L.list) {
    a.play.promo_price_usd = String(L.buy)
    a.play.promo_note = 'Promocion activa en Play el ' + TODAY + ': el boton muestra ' + L.buy + ' USD. El precio de lista es ' + L.list + ' USD.'
    changes.push(a.package + ': promo ' + L.buy + ' vs lista ' + L.list)
  } else if (a.play.promo_price_usd) { delete a.play.promo_price_usd; delete a.play.promo_note }
  a.play.$comment = 'Verificado el ' + TODAY + ' via BrowserOS neo sobre la ficha publica de Play Store (hl=es&gl=US): titulo del h1, boton de compra, aggregateRating y tier de instalaciones. price_usd es el precio de LISTA; promo_price_usd, si existe, es una promocion activa en ese momento.'
}
fs.writeFileSync(PC, JSON.stringify(pc, null, 2) + '\n', 'utf8')
console.log('\n=== play-catalog.json actualizado (' + TODAY + ') ===')
console.log('promociones activas detectadas: ' + (changes.length ? changes.join(' | ') : 'ninguna'))
