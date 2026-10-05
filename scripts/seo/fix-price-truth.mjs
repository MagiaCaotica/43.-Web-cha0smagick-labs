#!/usr/bin/env node
/**
 * fix-price-truth.mjs — UN single origen de verdad para los precios.
 *
 * FUENTE DE VERDAD: scripts/bots/data/offers.json
 *   reconciledAt: 2026-10-03, priceSource: "public app page / public book page"
 *
 * Queja que resuelve:
 *   projects/data/yt-articles/catalog.json declaraba Lucid Dream a $3.99 mientras
 *   apps/lucid-dream.html y offers.json lo venden a $9.99. Como catalog.json es el
 *   origen que alimenta los CTA de ~180 articulos del blog y apps-data.min.js,
 *   el precio equivocado se propagaba a cada regeneracion.
 *
 * Uso:
 *   node scripts/seo/fix-price-truth.mjs            # dry-run (solo informe)
 *   node scripts/seo/fix-price-truth.mjs --write    # aplica
 *
 * IDEMPOTENTE: se puede ejecutar N veces sin efecto adicional.
 * NEVER toca: projects/docs/archive/, projects/plans/, projects/page-full.md,
 *             proyectos ya publicados (pinterest pin-data, tweets scripts).
 */

import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'

const ROOT = process.cwd()
const WRITE = process.argv.includes('--write')

const OFFERS = path.join(ROOT, 'scripts/bots/data/offers.json')

// ---------------------------------------------------------------- fuente de verdad
const offers = JSON.parse(fs.readFileSync(OFFERS, 'utf8'))

/** id -> { name, price, url } leyendo cualquier forma que tenga offers.json */
function indexCatalog() {
  const map = new Map()
  const push = (arr) => {
    for (const it of arr ?? []) {
      if (!it?.id) continue
      const price = it.price ?? it.price_pretty ?? it.priceFormatted
      if (!price) continue
      map.set(it.id, {
        name: it.name ?? it.title ?? it.id,
        price: String(price).trim(),
        url: it.url ?? '',
      })
    }
  }
  push(offers.apps)
  push(offers.books)
  if (!map.size) {
    throw new Error('offers.json no expone arrays apps/books legibles — revisa su forma')
  }
  return map
}
const CAT = indexCatalog()

const lucid = CAT.get('lucid-dream')
const astral = CAT.get('astral-lab')
if (!lucid) throw new Error('offers.json no contiene lucid-dream')
if (!astral) throw new Error('offers.json no contiene astral-lab')

const LUCID_PRICE = lucid.price               // p.ej. "$9.99"
const LUCID_AMOUNT = Number(LUCID_PRICE.replace(/[^0-9.]/g, ''))
const LUCID_PRETTY = `$${LUCID_AMOUNT.toFixed(2)}`
const ASTRAL_PRETTY = `$${Number(astral.price.replace(/[^0-9.]/g, '')).toFixed(2)}`

const OLD_LUCID = '$3.99'                     // el valor erroneo historico
const BAD_APP_COUNT = /\b11\b(?=[\s\S]{0,120}?\bapps?\b)/gi   // "11 apps", "11 Android Apps", "11" + label on the NEXT line
const GOOD_APP_COUNT = /\b12\b(?=[\s\S]{0,120}?\bapps?\b)/g

// ---------------------------------------------------------------- helpers de parcheo
let totalFiles = 0
let totalEdits = 0
const report = []

const rd = (rel) => {
  try {
    return fs.readFileSync(path.join(ROOT, rel), 'utf8')
  } catch {
    return null
  }
}

/** Itera todos los ficheros bajo un directorio, de forma sincrona. */
function* walk(rel) {
  const abs = path.join(ROOT, rel)
  let entries
  try {
    entries = fs.readdirSync(abs, { withFileTypes: true })
  } catch {
    return
  }
  for (const e of entries) {
    const child = path.posix.join(rel, e.name)
    if (e.isDirectory()) yield* walk(child)
    else if (e.isFile()) yield child
  }
}

/** Aplica un parche sobre todos los ficheros de un arbol. */
function patchTree(rel, find, replace, opts = {}) {
  const re = typeof find === 'string' ? null : find
  let files = 0
  let edits = 0
  for (const f of walk(rel)) {
    let before
    try {
      before = fs.readFileSync(path.join(ROOT, f), 'utf8')
    } catch {
      continue
    }
    const after = re
      ? before.replace(re, replace)
      : before.split(find).join(replace)
    if (after === before) continue
    const n = re ? (before.match(re) ?? []).length : before.split(find).length - 1
    edits += n
    files++
    if (WRITE) fs.writeFileSync(path.join(ROOT, f), after, 'utf8')
  }
  totalFiles += files
  totalEdits += edits
  report.push({ rel, status: files ? 'PATCHED' : 'NO-OP', n: edits, label: `${opts.label ?? ''} (${files} ficheros)` })
  return edits
}

/**
 * @param {string} rel
 * @param {string|string[]|RegExp} find  string = reemplazo literal; RegExp = global
 * @param {string} replace
 * @param {{label?:string, allowSkip?:boolean, count?:number}} opts
 */
/** Cuenta ocurrencias reales de un patron (convierte a global). */
function countAll(text, re) {
  const g = new RegExp(re.source, re.flags.includes('g') ? re.flags : re.flags + 'g')
  return (text.match(g) ?? []).length
}

function patch(rel, find, replace, opts = {}) {
  const before = rd(rel)
  if (before === null) {
    if (!opts.allowSkip) report.push({ rel, status: 'MISSING', n: 0, label: opts.label })
    return 0
  }
  const after =
    typeof find === 'string'
      ? before.split(find).join(replace)
      : before.replace(find, replace)
  if (after === before) {
    if (opts.count != null && opts.count > 0)
      report.push({ rel, status: 'NO-OP(expected ' + opts.count + ')', n: 0, label: opts.label })
    return 0
  }
  const n = typeof find === 'string' ? before.split(find).length - 1 : countAll(before, find)
  totalEdits += n
  totalFiles++
  report.push({ rel, status: 'PATCHED', n, label: opts.label })
  if (WRITE) fs.writeFileSync(path.join(ROOT, rel), after, 'utf8')
  return n
}

/** Reemplaza dentro del objeto JSON parseado de un catalogo y lo reserializa. */
function patchJson(rel, mutate, label) {
  const abs = path.join(ROOT, rel)
  let raw
  try {
    raw = fs.readFileSync(abs, 'utf8')
  } catch {
    report.push({ rel, status: 'MISSING', n: 0, label })
    return
  }
  const json = JSON.parse(raw)
  const before = JSON.stringify(json)
  mutate(json)
  const after = JSON.stringify(json)
  if (before === after) {
    report.push({ rel, status: 'NO-OP', n: 0, label })
    return
  }
  totalFiles++
  report.push({ rel, status: 'PATCHED', n: 1, label })
  if (WRITE) fs.writeFileSync(abs, JSON.stringify(json, null, 2) + '\n', 'utf8')
}

console.log('== fuente de verdad ==')
console.log(`   offers.json          reconciledAt=${offers.reconciledAt ?? offers._meta?.reconciledAt ?? '?'}`)
console.log(`   lucid-dream          ${OLD_LUCID} -> ${LUCID_PRETTY}   (${lucid.url.slice(0, 60)}…)`)
console.log(`   astral-lab           -> ${ASTRAL_PRETTY}`)
console.log(`   catalogo             ${CAT.size} entidades`)
console.log(`   modo                 ${WRITE ? 'ESCRITURA' : 'dry-run'}\n`)

// ================================================================ 1. LA FUENTE
// catalog.json es el origen que genera los CTA. Si no se arregla aqui, todo
// lo demas se revierte en la proxima regeneracion.
patchJson(
  'projects/data/yt-articles/catalog.json',
  (j) => {
    for (const group of ['apps', 'books', 'tools']) {
      for (const it of j[group] ?? []) {
        if (it?.id === 'lucid-dream') {
          it.price = `${LUCID_PRETTY} USD`
          it.amount = LUCID_AMOUNT
          it.price_pretty = LUCID_PRETTY
        }
      }
    }
  },
  'FUENTE: catalog.json lucid-dream'
)

// el docstring de cta.py documentaba la decision equivocada como si fuera intencional
patch(
  'projects/data/linkgraph/cta.py',
  /The lucid-dream page shows US\$9\.99 while the catalogue says US\$3\.99; the catalogue is the source of truth, so the CTA says US\$3\.99 and the page discrepancy stays a separate \[?known issue\]?\.?/g,
  `Prices are reconciled from the public app page (and cross-checked against\nscripts/bots/data/offers.json), so the CTA price matches what the visitor\nwill actually be charged.`,
  { label: 'cta.py docstring obsoleto', count: 0 }
)

// ================================================================ 2. JS LIVE
// apps-data.min.js SI lo cargan index.html, glossary.html y pages/app-details.html.
// Anclamos en el id para no tocar dream-machine (que si es $3.99).
patch(
  'js/apps-data.min.js',
  'id:"lucid-dream",name:"Lucid Dream: Astral Projection",price:"' + OLD_LUCID + ' USD"',
  'id:"lucid-dream",name:"Lucid Dream: Astral Projection",price:"' + LUCID_PRETTY + ' USD"',
  { label: 'apps-data.min.js campo price', count: 1 }
)
patch(
  'js/apps-data.min.js',
  '<strong>Lucid Dream</strong> is available for a single payment of <strong>' + OLD_LUCID + ' USD</strong>',
  '<strong>Lucid Dream</strong> is available for a single payment of <strong>' + LUCID_PRETTY + ' USD</strong>',
  { label: 'apps-data.min.js body copy', count: 1 }
)

// mismo par en el fuente sin minificar, por si se vuelve a compilar
// apps-data.js: el body copy usa el MISMO literal "<strong>$3.99 USD</strong>"
// en 5 apps distintas (Norse Rune, Lunar Phase, I Ching, Chaos Sigil, Dream
// Machine) — todas legitimamente a $3.99. Un replace global CORRUPIRIA esas 5.
// Por eso el body copy NO se toca aqui: ya fue corregido a mano, y el campo
// `price` se ancla en el id (unico, verificado) para que no dependa del spacing.
patch(
  'js/apps-data.js',
  /(id:\s*"lucid-dream",[\s\S]{0,300}?price:\s*)"\$3\.99 USD"/,
  '$1"' + LUCID_PRETTY + ' USD"',
  { label: 'apps-data.js campo price (anclado en id)' }
)

// ================================================================ 3. CTA EN MASIVA
// Un solo literal repetido en ~180 articulos. Reemplazo determinista.
patchTree(
  'blog',
  '<a class="cta-secondary" href="../apps/lucid-dream.html">Lucid Dream: Astral Projection, $3.99</a>',
  '<a class="cta-secondary" href="../apps/lucid-dream.html">Lucid Dream: Astral Projection, ' + LUCID_PRETTY + '</a>',
  { label: 'CTA blog literal', }
)
patchTree('blog', /(<a class="cta-secondary" href="\.\.\/apps\/lucid-dream\.html">Lucid Dream: Astral Projection, )\$3\.99/g,
  '$1' + LUCID_PRETTY, { label: 'CTA blog regex' })

// ================================================================ 4. GENERADORES
patch(
  'projects/scripts/generate-app-pages.mjs',
  /(\{[\s\S]{0,600}?id:\s*"lucid-dream"[\s\S]{0,600}?price:\s*)"\$3\.99 USD"/,
  '$1"' + LUCID_PRETTY + ' USD"',
  { label: 'generador app pages' }
)
patch('data/tool-funnels.json', /("id"\s*:\s*"lucid-dream"[\s\S]{0,400}?"price"\s*:\s*)"\$3\.99"/g,
  '$1"' + LUCID_PRETTY + '"', { label: 'tool-funnels.json' })

// ================================================================ 5. PAGINAS SUELTAS
// reality-check-tracker.html arrastraba un TERCER valor ($7.99).
patch('tools/reality-check-tracker.html', 'Lucid Dream $7.99', 'Lucid Dream ' + LUCID_PRETTY, { label: 'reality-check $7.99' })
patch('tools/reality-check-tracker.html', '<strong>Lucid Dream</strong> app ($7.99)', '<strong>Lucid Dream</strong> app (' + LUCID_PRETTY + ')', { label: 'reality-check $7.99 (par)' })

patch('lead-magnet/quickstart-guide-chaos-magick-en.html', /(\|\s*Lucid Dream[^|\n]{0,60}\|[^|\n]{0,40}\|\s*)\$3\.99/g,
  '$1' + LUCID_PRETTY, { label: 'lead-magnet tabla' })

// Astral Lab: solo 2 hits reales (el resto de "Astral Lab ... $3.99" era el CTA
// de Lucid Dream, que contiene la palabra "Astral Projection").
patch('blog/astrology-apps-android-guide.html', /The \$3\.99 purchase is verified via Google Play Billing Library/,
  'The ' + ASTRAL_PRETTY + ' purchase is verified via Google Play Billing Library', { label: 'astral-lab guia' })
patch('blog/one-time-vs-subscription-calculator-occult.html', /(<td>Astral Lab<\/td>\s*<td>)\$3\.99/,
  '$1' + ASTRAL_PRETTY, { label: 'astral-lab calculadora' })

// ================================================================ 6. CONTEO 11 -> 12
const COUNT_FILES = [
  ['index.html', 'home'],
  ['best-occult-apps-android.html', 'best apps'],
  ['js/conversion.js', 'CTA inyectado'],
  ['PROJECT-BIBLE.md', 'biblia'],
]
for (const [rel, label] of COUNT_FILES) {
  const before = rd(rel)
  if (before === null) {
    report.push({ rel, status: 'MISSING', n: 0, label })
    continue
  }
  const n = (before.match(BAD_APP_COUNT) ?? []).length
  if (!n) {
    report.push({ rel, status: 'NO-OP', n: 0, label: label + ' (conteo)' })
    continue
  }
  patch(rel, BAD_APP_COUNT, (m) => m.replace('11', '12'), { label: label + ' (11->12)' })
}

// PROJECT-BIBLE tiene variantes que el regex anterior no cubre (el "11" va
// DETRAS de la palabra, p.ej. "| Landing pages de apps | 11 |")
patch('PROJECT-BIBLE.md', /apps\/ # 11 landing pages de apps Android/, 'apps/ # 12 landing pages de apps Android',
  { label: 'biblia estructura' })
patch('PROJECT-BIBLE.md', /Aplicaciones Android \(11\)/, 'Aplicaciones Android (12)', { label: 'biblia appsData' })
patch('PROJECT-BIBLE.md', /\|\s*Landing pages de apps\s*\|\s*11\s*\|/, '| Landing pages de apps | 12 |',
  { label: 'biblia landings' })
patch('PROJECT-BIBLE.md', /\|\s*\*\*Apps Android publicadas\*\*\s*\|\s*11\s*\|/, '| **Apps Android publicadas** | 12 |',
  { label: 'biblia resumen' })

// El "11" legitimo que NO debe tocarse en PROJECT-BIBLE (verificado):
//   L212 telegram-bot.js (11 comandos) · L323 blog index (11 categorías)
//   L397 generate-tool-pages.mjs (11 páginas) · L406 telegram-bot (11 comandos)
//   L376 "| 11 |" columna de numeracion · L492 "## 11. ESTRUCTURA HTML..."
// Ninguno esta a menos de 120 chars de la palabra "app", asi que el regex
// generico no los alcanza.igualmente se listan aqui como guardia de regresion.

// ================================================================ informe
console.log('== cambios ==')
for (const r of report) {
  const badge = r.status === 'PATCHED' ? 'FIX ' : r.status === 'MISSING' ? 'FAIL' : 'ok  '
  console.log(`  [${badge}] ${String(r.n).padStart(3)}  ${r.rel}  — ${r.label ?? ''}`)
}
console.log(`\n   ${totalFiles} ficheros · ${totalEdits} reemplazos`)
if (!WRITE) console.log('   dry-run: nada escrito. Reejecuta con --write para aplicar.')

// ===================================================================
// P2b — formas de CTA alternas de Lucid Dream (a~2026-10-04)
// -------------------------------------------------------------------
// El primer pase solo reconocia la forma canonica
//   <a class="cta-secondary" href="../apps/lucid-dream.html">
//     Lucid Dream: Astral Projection, $3.99</a>
// y por eso dejo 19 precios vivos en 11 ficheros. Un segundo escaneo con
// ventana de 260 chars encontro 72 formas distintas de CTA alrededor de
// un enlace a lucid-dream; solo 5 tenian precio erroneo.
//
// Estas 3 regex + 1 frase de FAQ son la forma canonica restante.
// ANCLA: siempre al enlace de lucid-dream, nunca global, porque
// `$3.99` es el precio legitimo de 7 de las 12 apps y `$3.99</span>`
// es un literal compartido. Un replace global corromperia el catalogo.
// -------------------------------------------------------------------
const CTA_SPAN =
  /(\/apps\/lucid-dream\.html"[^>]*>(?:<strong>)?Lucid Dream(?:: Astral Projection)?(?:<\/strong>)?<\/a> <span style="color: var\(--text-muted\); font-size: \.9rem;">)\$3\.99/g
const CTA_PLAIN =
  /(\/apps\/lucid-dream\.html"[^>]*>(?:<strong>)?Lucid Dream(?:: Astral Projection)?(?:<\/strong>)?<\/a> )\$3\.99/g
const CTA_ROW =
  /(\/apps\/lucid-dream\.html">Lucid Dream<\/a><\/strong><\/td><td>Induction techniques and reality-check system for conscious dreaming<\/td><td>)\$3\.99/g
// dream-machine-vs-lucid-dream-app.html decia "$3.99 each" para DOS apps
// cuando Lucid cuesta $9.99. Es la unica afirmacion que mentia sobre el
// precio en prosa (no en un CTA), asi que no la cubre ninguna regex.
const FAQ_BOTH_OLD =
  '<p>Yes. $3.99 each, paid once. No subscription, no ads, no account, no hidden fees.</p>'
const FAQ_BOTH_NEW =
  '<p>Yes. Dream Machine is $3.99 and Lucid Dream is $9.99 — each is a single payment, once. No subscription, no ads, no account, no hidden fees.</p>'

const CTA_RE = [
  ['span-envuelto en el CTA', CTA_SPAN],
  ['precio suelto tras el CTA', CTA_PLAIN],
  ['fila de tabla en lead-magnet', CTA_ROW],
]

const SKIP_DIR = /node_modules|\.git[/\\]|projects[/\\]docs[/\\]archive|projects[/\\]plans|page-full|\.omo[/\\]/
function walkHtml(dir, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name)
    if (SKIP_DIR.test(p)) continue
    if (e.isDirectory()) walkHtml(p, acc)
    else if (e.name.endsWith('.html')) acc.push(p)
  }
  return acc
}

let ctaFiles = 0
let ctaEdits = 0
let faqEdits = 0
const ctaDetail = []

for (const f of walkHtml(ROOT)) {
  const before = fs.readFileSync(f, 'utf8')
  if (!/lucid-dream/i.test(before)) continue
  let after = before
  const hit = []
  for (const [label, re] of CTA_RE) {
    const n = countAll(before, re)
    if (!n) continue
    ctaEdits += n
    hit.push(`${label} x${n}`)
    after = after.replace(re, '$1$9.99')
  }
  if (after.includes(FAQ_BOTH_OLD)) {
    after = after.split(FAQ_BOTH_OLD).join(FAQ_BOTH_NEW)
    faqEdits++
    hit.push('FAQ "both apps" x1')
  }
  if (after === before) continue
  ctaFiles++
  ctaDetail.push([path.relative(ROOT, f).replace(/\\/g, '/'), hit.join(' · ')])
  if (WRITE) fs.writeFileSync(f, after, 'utf8')
}

console.log('\n== P2b formas de CTA alternas ==')
for (const [rel, hit] of ctaDetail) console.log(`  [FIX ] ${rel}  — ${hit}`)
console.log(
  `   ${ctaFiles} ficheros · ${ctaEdits} precios de CTA · ${faqEdits} frases de FAQ`,
)

// Guarda de regresion: tras aplicar, ninguna forma debe volver a existir.
let leftover = 0
for (const f of walkHtml(ROOT)) {
  const s = fs.readFileSync(f, 'utf8')
  if (!/lucid-dream/i.test(s)) continue
  leftover += countAll(s, CTA_SPAN) + countAll(s, CTA_PLAIN) + countAll(s, CTA_ROW)
  if (s.includes(FAQ_BOTH_OLD)) leftover++
}
console.log(
  leftover === 0
    ? '   verify: 0 formas erroneas restantes.'
    : `   FAIL verify: ${leftover} formas erroneas siguen presentes.`,
)

// Formas NO tocadas a proposito (falsos positivos medidos):
//   - `Also: <a href="../apps/psi-gym.html">...</a> $3.99` → PSI GYM, correcto.
//   - `books (7) - $3.99 to $9.99` (README) → rango de libros, correcto.
//   - Cualquier enlace a lucid-dream SIN precio (crossrefs, breadcrumbs
//     JSON-LD, sitemap, meta, botones de Play).