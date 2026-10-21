#!/usr/bin/env node
/**
 * AUDITORIA DE INDEXACION (todo en uno)
 *
 * Por que existe: Google solo leia 163 de las 1.002 URLs del sitemap. Este
 * script responde, con medidas y no con opinas, a las cinco preguntas que
 * explican ese numero:
 *
 *   1. ¿El sitemap es valido y coherente?          (XML, duplicados, lastmod)
 *   2. ¿Se contradice a si mismo?                  (noindex o 404 dentro del sitemap)
 *   3. ¿Google puede llegar a cada pagina?         (profundidad de rastreo, huerfanas)
 *   4. ¿El contenido es duplicado o fino?           (titulos, texto, palabras)
 *   5. ¿Las paginas dan lo que Google busca leer?  (JSON-LD, H1, description)
 *
 *   node projects/scripts/audit-indexation.mjs
 *
 * Escribe data/guerrilla/indexation-audit.json y sale con codigo 1 si
 * encuentra un problema de los que hay que arreglar hoy.
 */
import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { execSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
const SITE = 'https://cha0smagicklabs.com'
const OUT = path.join(ROOT, 'data', 'guerrilla', 'indexation-audit.json')

// ---------------------------------------------------------------- utilidades
const read = (rel) => fs.readFileSync(path.join(ROOT, rel), 'utf8')
const track = (rel) => {
  try { execSync(`git ls-files --error-unmatch "${rel}"`, { cwd: ROOT, stdio: 'ignore' }); return true } catch { return false }
}
const visible = (h) => h
  .replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ')
  .replace(/<nav[\s\S]*?<\/nav>/gi, ' ').replace(/<header[\s\S]*?<\/header>/gi, ' ')
  .replace(/<footer[\s\S]*?<\/footer>/gi, ' ').replace(/<!--[\s\S]*?-->/g, ' ')
  .replace(/<[^>]+>/g, ' ').replace(/&[a-z]+;/gi, ' ').replace(/\s+/g, ' ').trim()
const isNoindex = (h) => /<meta[^>]+name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(h)
const titleOf = (h) => (h.match(/<title[^>]*>([\s\S]{0,200}?)<\/title>/i) || [, ''])[1].replace(/\s+/g, ' ').trim()
const h1Of = (h) => (h.match(/<h1[^>]*>([\s\S]{0,200}?)<\/h1>/i) || [, ''])[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()

const tracked = execSync('git ls-files', { cwd: ROOT, maxBuffer: 64 * 1024 * 1024 })
  .toString().split('\n').filter(Boolean)
const htmlFiles = tracked.filter((f) => f.endsWith('.html'))

// ------------------------------------------------------------------ sitemap
const smRaw = read('sitemap.xml')
const smUrls = [...smRaw.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim())
const smSet = new Set(smUrls)
const lastmods = [...smRaw.matchAll(/<lastmod>([^<]*)<\/lastmod>/g)].map((m) => m[1].trim())
const W3C = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})?)?$/

const sitemap = {
  urls: smUrls.length,
  duplicadas: smUrls.length - smSet.size,
  lastmodInvalidos: lastmods.filter((l) => !W3C.test(l)).length,
  lastmodDistintos: new Set(lastmods).size,
  bienFormado: (smRaw.match(/<url>/g) || []).length === (smRaw.match(/<\/url>/g) || []).length
    && /<urlset[^>]*xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9"/.test(smRaw),
}

// ------------------------------------------- contradicciones dentro del sitemap
const contradicciones = { noindex: [], inexistentes: [], canonicalDistinta: [] }
const fileByUrl = new Map()
for (const rel of htmlFiles) {
  const u = SITE + '/' + rel
  fileByUrl.set(u, rel)
  if (rel.endsWith('/index.html')) fileByUrl.set(SITE + '/' + rel.slice(0, -'index.html'.length), rel)
}
for (const u of smUrls) {
  const rel = u.replace(SITE + '/', '')
  const p = path.join(ROOT, rel)
  const target = fs.existsSync(p) && fs.statSync(p).isFile()
    ? rel
    : (fs.existsSync(path.join(p, 'index.html')) ? path.posix.join(rel, 'index.html') : null)
  if (!target || !track(target)) { contradicciones.inexistentes.push(u); continue }
  const h = read(target)
  if (isNoindex(h)) contradicciones.noindex.push(u)
  const canon = (h.match(/<link[^>]+rel=["']canonical["'][^>]*href=["']([^"']+)/i) || [, ''])[1]
  if (canon && canon.replace(/\/$/, '') !== u.replace(/\/$/, '')) contradicciones.canonicalDistinta.push({ url: u, canonical: canon })
}

// ------------------------------------------- grafo de rastreo (profundidad)
const publicUrl = (f) => {
  if (f === 'index.html') return SITE + '/'
  if (f.endsWith('/index.html')) return SITE + '/' + f.slice(0, -'index.html'.length)
  return SITE + '/' + f
}
const inlinks = new Map(), outlinks = new Map()
const bump = (m, k, v) => { if (!m.has(k)) m.set(k, new Set()); m.get(k).add(v) }
for (const rel of htmlFiles) {
  const h = read(rel)
  const from = publicUrl(rel)
  const body = h.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ')
  for (const m of body.matchAll(/href=["']([^"'#?]+)/gi)) {
    const href = m[1]
    if (/^(mailto:|tel:|javascript:|#)/i.test(href)) continue
    let target = null
    if (href.startsWith(SITE + '/')) target = href.replace(/[?#].*$/, '')
    else if (href.startsWith('/')) target = SITE + href.replace(/[?#].*$/, '')
    else if (!/^https?:\/\//i.test(href)) {
      // base = el directorio del FICHERO: dirname('tools/') da '.', no 'tools'.
      const base = path.posix.dirname(rel)
      target = SITE + '/' + path.posix.normalize(path.posix.join(base === '.' ? '' : base, href)).replace(/[?#].*$/, '')
    }
    if (!target) continue
    target = target.replace(/\/index\.html$/, '/')
    if (!fileByUrl.has(target)) continue
    bump(inlinks, target, from)
    bump(outlinks, from, target)
  }
}
const HOME = SITE + '/'
const depth = new Map([[HOME, 0]])
const q = [HOME]
while (q.length) {
  const cur = q.shift()
  for (const t of outlinks.get(cur) || []) if (!depth.has(t)) { depth.set(t, depth.get(cur) + 1); q.push(t) }
}
const huerfanas = smUrls.filter((u) => !depth.has(u))
const dist = {}
for (const u of smUrls) { const d = depth.has(u) ? depth.get(u) : -1; dist[d] = (dist[d] || 0) + 1 }
const inlinksMedios = smUrls.reduce((a, u) => a + (inlinks.get(u)?.size || 0), 0) / (smUrls.length || 1)

// ------------------------------------------- contenido: duplicados y grosor
const byTitle = new Map(), byText = new Map()
let thin = 0, palabras = []
for (const rel of htmlFiles) {
  const h = read(rel)
  const t = visible(h)
  const n = t.split(' ').length
  palabras.push(n)
  if (n < 400) thin++
  const title = titleOf(h)
  if (title) { if (!byTitle.has(title)) byTitle.set(title, []); byTitle.get(title).push(rel) }
  const sig = crypto.createHash('sha1').update(t.slice(0, 4000)).digest('hex')
  if (!byText.has(sig)) byText.set(sig, []); byText.get(sig).push(rel)
}
const titulosDup = [...byTitle.entries()].filter(([, v]) => v.length > 1)
const textoDup = [...byText.values()].filter((v) => v.length > 1)
palabras.sort((a, b) => a - b)

// ------------------------------------------- senales a nivel de articulo
const blogs = htmlFiles.filter((f) => f.startsWith('blog/'))
let conLd = 0, conArticle = 0, conDateMod = 0, conAuthor = 0, conFaq = 0, conDesc = 0
for (const rel of blogs) {
  const h = read(rel)
  const ld = [...h.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)].map((m) => m[1]).join(' ')
  if (ld) conLd++
  if (/Article|BlogPosting/i.test(ld)) conArticle++
  if (/"dateModified"/i.test(ld)) conDateMod++
  if (/"author"/i.test(ld)) conAuthor++
  if (/FAQPage/i.test(ld)) conFaq++
  const d = (h.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)/i) || [, ''])[1]
  if (d.length > 50 && d.length <= 165) conDesc++
}

// -------------------------------------------------------------------- salida
const pct = (n, d) => d ? ((n / d) * 100).toFixed(1) + '%' : 'n/d'
console.log('=== AUDITORIA DE INDEXACION ===')
console.log('paginas html desplegadas: ' + htmlFiles.length + ' | URLs del sitemap: ' + smUrls.length)
console.log('')
console.log('1. SITEMAP')
console.log('   bien formado: ' + sitemap.bienFormado + ' | duplicadas: ' + sitemap.duplicadas +
  ' | lastmod invalidos: ' + sitemap.lastmodInvalidos + ' | lastmod distintos: ' + sitemap.lastmodDistintos)
console.log('2. CONTRADICCIONES')
console.log('   noindex dentro del sitemap : ' + contradicciones.noindex.length)
console.log('   inexistentes / no publicadas: ' + contradicciones.inexistentes.length)
console.log('   canonical que no cuadra     : ' + contradicciones.canonicalDistinta.length)
console.log('3. RASTREO')
console.log('   alcanzables desde la home: ' + (smUrls.length - huerfanas.length) + ' | huerfanas: ' + huerfanas.length)
console.log('   profundidad: ' + JSON.stringify(dist) + ' | inlinks medios: ' + inlinksMedios.toFixed(1))
console.log('4. CONTENIDO')
console.log('   titulos repetidos: ' + titulosDup.length + ' grupos | texto identico: ' + textoDup.length + ' grupos')
console.log('   palabras: mediana ' + palabras[Math.floor(palabras.length / 2)] + ' | <400 palabras: ' + thin)
console.log('5. SENALES POR ARTICULO (' + blogs.length + ')')
console.log('   JSON-LD ' + pct(conLd, blogs.length) + ' | Article ' + pct(conArticle, blogs.length) +
  ' | dateModified ' + pct(conDateMod, blogs.length) + ' | author ' + pct(conAuthor, blogs.length) +
  ' | FAQPage ' + pct(conFaq, blogs.length) + ' | description ' + pct(conDesc, blogs.length))

const problemas = contradicciones.noindex.length + contradicciones.inexistentes.length +
  contradicciones.canonicalDistinta.length + huerfanas.length
console.log('')
console.log(problemas === 0
  ? 'OK: sin contradicciones ni huerfanas.'
  : 'HAY ' + problemas + ' CONTRADICCIONES QUE ARREGLAR (ver arriba).')
if (contradicciones.noindex.length) console.log('   noindex: ' + contradicciones.noindex.map((u) => u.replace(SITE, '')).join(', '))
if (contradicciones.inexistentes.length) console.log('   inexistentes: ' + contradicciones.inexistentes.map((u) => u.replace(SITE, '')).join(', '))
if (huerfanas.length) console.log('   huerfanas: ' + huerfanas.map((u) => u.replace(SITE, '')).join(', '))

fs.mkdirSync(path.dirname(OUT), { recursive: true })
fs.writeFileSync(OUT, JSON.stringify({
  generated: new Date().toISOString(), sitemap, contradicciones,
  rastreo: { profundidad: dist, huerfanas, inlinksMedios },
  contenido: { titulosDup, textoDup, thin, palabrasMediana: palabras[Math.floor(palabras.length / 2)] },
  senales: { articulos: blogs.length, conLd, conArticle, conDateMod, conAuthor, conFaq, conDesc },
}, null, 2))
console.log('\nescrito data/guerrilla/indexation-audit.json')
process.exit(problemas === 0 ? 0 : 1)
