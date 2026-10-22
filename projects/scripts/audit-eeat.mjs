#!/usr/bin/env node
/**
 * AUDITORIA DE E-E-A-T, CONFIANZA Y CALIDAD DE CONTENIDO
 *
 * Google no indexa por tener paginas: indexa por tener paginas que valgan la
 * pena y de las que se pueda creer que estan escritas por alguien que sabe.
 * Eso son las cuatro cosas de E-E-A-T (Experiencia, Expertise, Autoridad,
 * Trust) mas lo que elQuality rater mira de verdad.
 *
 * Se mide, no se supone:
 *   A. AUTORIA Y CONFIANZA   - byline, author.url real, Person/Organization
 *                                completos, NAP, pagina de autor, politica
 *                                editorial, citas a fuentes
 *   B. CALIDAD DE CONTENIDO    - estructura,Profundidad, enlaces salientes,
 *                                fecha de revision visible
 *   C. AI SLOP / CONTENIDO A ESCALA - frases repetidas literalmente entre
 *                                articulos, muletillas, rayas, rellenos
 *   D. HUECOS DE CLUSTER       - temas con paginas de entrada pero sin
 *                                articulos de apoyo
 *
 *   node projects/scripts/audit-eeat.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { execSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
const SITE = 'https://cha0smagicklabs.com'

const tracked = execSync('git ls-files', { cwd: ROOT, maxBuffer: 64 * 1024 * 1024 }).toString().split('\n').filter(Boolean)
const htmlFiles = tracked.filter((f) => f.endsWith('.html'))
const blogs = htmlFiles.filter((f) => f.startsWith('blog/') && !f.includes('/es-'))

const read = (rel) => fs.readFileSync(path.join(ROOT, rel), 'utf8')
const visible = (h) => h
  .replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ')
  .replace(/<nav[\s\S]*?<\/nav>/gi, ' ').replace(/<header[\s\S]*?<\/header>/gi, ' ')
  .replace(/<footer[\s\S]*?<\/footer>/gi, ' ').replace(/<!--[\s\S]*?-->/g, ' ')
  .replace(/<[^>]+>/g, ' ').replace(/&[a-z]+;/gi, ' ').replace(/\s+/g, ' ').trim()
const ldBlocks = (h) => [...h.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)].map((m) => m[1]).join('\n')
const pct = (n, d) => d ? ((n / d) * 100).toFixed(1) + '%' : 'n/d'

// =====================================================================
// A. AUTORIA Y CONFIANZA
// =====================================================================
const AUTOR = 'Frater Alek0s'
const paginasConfianza = {
  'pages/about.html': 'Sobre nosotros',
  'privacy-policy.html': 'Politica de privacidad',
  'cookie-policy.html': 'Cookies',
  'terms.html': 'Terminos',
  'refund-policy.html': 'Reembolsos',
  'disclaimer.html': 'Aviso legal',
  'affiliate-disclosure.html': 'Afiliados',
  'contact.html': 'Contacto',
}
const hayConfianza = {}
for (const p of Object.keys(paginasConfianza)) hayConfianza[p] = fs.existsSync(path.join(ROOT, p))

// pagina de autor: ¿existe una que declare al autor?
const paginaAutor = htmlFiles.includes('pages/frater-alek0s.html') ? 'pages/frater-alek0s.html' : null

const A = { porArticulo: {}, problemas: [] }
const byline = [], authorUrlReal = [], personCompleta = [], orgCompleta = [], conFechaRevision = [], conCita = [], enlaceAutor = [], outboundDominios = new Map()
const orgSample = {}

for (const rel of blogs) {
  const h = read(rel)
  const txt = visible(h)
  const ld = ldBlocks(h)
  if (new RegExp(AUTOR.split(' ').join('\\s+'), 'i').test(txt)) byline.push(rel)
  const au = ld.match(/"author"\s*:\s*\{[^}]*"url"\s*:\s*"([^"]+)"/)
  if (au && au[1] !== SITE + '/' && au[1] !== SITE) authorUrlReal.push(rel)
  if (/"@type"\s*:\s*"Person"[\s\S]{0,400}"sameAs"/.test(ld)) personCompleta.push(rel)
  if (/"@type"\s*:\s*"Organization"[\s\S]{0,300}"@id"\s*:\s*"https:\/\/cha0smagicklabs\.com\/#organization"/.test(ld)) orgCompleta.push(rel)
  if (!orgSample.__v && /"@type"\s*:\s*"Organization"/.test(ld)) { orgSample.__v = true; orgSample.texto = (ld.match(/"publisher"\s*:\s*\{[\s\S]{0,600}?\}/) || [''])[0] }
  if (/Updated\s*<time/i.test(h) || /(last reviewed|\u00faltima revisi\u00f3n)/i.test(txt)) conFechaRevision.push(rel)
  if (/(sources|fuentes|referencias|bibliograf)/i.test(txt)) conCita.push(rel)
  if (new RegExp('href="[^"]*frater-alek0s\.html"', 'i').test(h)) enlaceAutor.push(rel)
  for (const m of h.matchAll(/href="(https?:\/\/[^"]+)"/g)) {
    try { const d = new URL(m[1]).hostname; if (!d.endsWith('cha0smagicklabs.com')) outboundDominios.set(d, (outboundDominios.get(d) || 0) + 1) } catch {}
  }
}

// NAP: direccion fisica y telefono visibles en el sitio
let conDireccion = 0, conTelefono = 0
for (const rel of htmlFiles) {
  const t = visible(read(rel))
  if (/Bogot[aá]|Colombia|Calle 40a/i.test(t)) conDireccion++
  if (/\+?\d[\d\s().-]{7,}\d/.test(t)) conTelefono++
}

console.log('=== A. AUTORIA Y CONFIANZA (E-E-A-T) ===')
console.log('articulos de blog analizados: ' + blogs.length)
console.log('  con byline visible (Frater Alek0s) : ' + pct(byline.length, blogs.length) + '  (' + byline.length + ')')
console.log('  con author.url que NO es la home   : ' + pct(authorUrlReal.length, blogs.length) + '  (' + authorUrlReal.length + ')')
console.log('  con Person schema completo (sameAs) : ' + pct(personCompleta.length, blogs.length) + '  (' + personCompleta.length + ')')
console.log('  con Organization schema completo    : ' + pct(orgCompleta.length, blogs.length) + '  (' + orgCompleta.length + ')')
console.log('  con fecha de revision visible       : ' + pct(conFechaRevision.length, blogs.length) + '  (' + conFechaRevision.length + ')')
console.log('  con bloque de fuentes/referencias    : ' + pct(conCita.length, blogs.length) + '  (' + conCita.length + ')')
console.log('  con enlace a la pagina de autor      : ' + pct(enlaceAutor.length, blogs.length) + '  (' + enlaceAutor.length + ')')
console.log('')
console.log('  pagina de autor en el repo          : ' + (paginaAutor || 'NO EXISTE'))
console.log('  paginas de confianza presentes      : ' + Object.entries(hayConfianza).filter(([, v]) => v).map(([k]) => k).join(', '))
const faltanConfianza = Object.entries(hayConfianza).filter(([, v]) => !v).map(([k, v]) => k + ' (' + paginasConfianza[k] + ')')
console.log('  paginas de confianza FALTANTES      : ' + (faltanConfianza.length ? faltanConfianza.join(', ') : 'ninguna'))
console.log('  paginas que citan direccion (Bogota): ' + conDireccion + '/' + htmlFiles.length)
console.log('  paginas que citan un telefono       : ' + conTelefono + '/' + htmlFiles.length)
console.log('  dominios externos enlazados (top)  : ' + [...outboundDominios.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8).map(([d, n]) => d + '(' + n + ')').join(', '))

// =====================================================================
// B. CALIDAD DE CONTENIDO
// =====================================================================
const B = { palabras: [], conH2: 0, conLista: 0, conTabla: 0, conFAQvisible: 0, outboundMedio: 0, outboundTotal: 0 }
let outboundTotal = 0
for (const rel of blogs) {
  const h = read(rel)
  const t = visible(h)
  B.palabras.push(t.split(' ').length)
  if (/<h2/i.test(h)) B.conH2++
  if (/<ul|<ol/i.test(h)) B.conLista++
  if (/<table/i.test(h)) B.conTabla++
  if (/faq|questions|preguntas/i.test(h)) B.conFAQvisible++
  const ext = [...h.matchAll(/href="(https?:\/\/[^"]+)"/g)].filter((m) => !m[1].includes('cha0smagicklabs.com')).length
  outboundTotal += ext
}
B.outboundMedio = outboundTotal / blogs.length
B.palabras.sort((a, b) => a - b)
console.log('\n=== B. CALIDAD DE CONTENIDO ===')
console.log('  palabras: mediana ' + B.palabras[Math.floor(B.palabras.length / 2)] + ' | p25 ' + B.palabras[Math.floor(B.palabras.length * 0.25)] + ' | <1000: ' + B.palabras.filter((n) => n < 1000).length)
console.log('  con H2: ' + pct(B.conH2, blogs.length) + ' | con listas: ' + pct(B.conLista, blogs.length) + ' | con tablas: ' + pct(B.conTabla, blogs.length))
console.log('  con FAQ visible: ' + pct(B.conFAQvisible, blogs.length))
console.log('  enlaces salientes externos por articulo: ' + B.outboundMedio.toFixed(1))

// =====================================================================
// C. AI SLOP / CONTENIDO A ESCALA
// =====================================================================
const MULETILLAS = [
  [/it(?:'s| is) (?:worth|important) (?:noting|to note) that/gi, "it's worth noting that"],
  [/(?:in conclusion|to sum up|in summary)/gi, 'filler transitions (in conclusion / to sum up)'],
  [/\b(?:leverage|utilize|streamline|delve into|navigate the complexities|robust solution|comprehensive guide to)\b/gi, 'stock vocabulary'],
  [/\bIn today'?s (?:fast-paced|ever-evolving|digital) (?:world|landscape|era)\b/gi, "cliche de apertura ('In today's fast-paced world')"],
  [/\b(?:whether you'?re|whether you are) a (?:beginner|seasoned|experienced)/gi, 'apertura generica (whether you are a beginner)'],
  [/\bwhen it comes to\b/gi, "'when it comes to'"],
  [/\bthe fact that\b/gi, "'the fact that'"],
  [/—/g, 'raya em (—)'],
  [/\bdelve\b/gi, "'delve'"],
]
const frases = new Map()
const aperturas = new Map()
const cuerpo = (h) => visible(h)
  .replace(/By\s+Frater\s+Alek0s.*?(?=\s{2,}[A-Z]|$)/g, ' ')
  .replace(/Read More.*$/g, ' ')
  .replace(/\b\d+ min read\b/g, ' ')

for (const rel of blogs) {
  const t = cuerpo(read(rel))
  const primera = t.split(/(?<=[.!?])\s+/).slice(0, 2).join(' ').slice(0, 110)
  aperturas.set(primera, (aperturas.get(primera) || []).concat(rel))
  for (const s of t.split(/(?<=[.!?])\s+/)) {
    const n = s.trim().slice(0, 90)
    if (n.length < 60) continue
    if (!frases.has(n)) frases.set(n, [])
    frases.get(n).push(rel)
  }
}
const repetidas = [...frases.entries()].filter(([, v]) => v.length > 1).sort((a, b) => b[1].length - a[1].length)
const aperturasRep = [...aperturas.entries()].filter(([, v]) => v.length > 1).sort((a, b) => b[1].length - a[1].length)
console.log('\n=== C. AI SLOP / CONTENIDO A ESCALA ===')
const slop = []
for (const [re, label] of MULETILLAS) {
  let n = 0, arts = 0
  for (const rel of blogs) {
    const t = visible(read(rel))
    const c = (t.match(re) || []).length
    n += c; if (c) arts++
  }
  if (n) slop.push(`${label}: ${n} ocurrencias en ${arts} articulos (${pct(arts, blogs.length)})`)
}
for (const s of slop) console.log('  ' + s)
console.log('  frases repetidas LITERALMENTE en >1 articulo: ' + repetidas.length)
for (const [f, v] of repetidas.slice(0, 5)) console.log(`     ${v.length}x  "${f.slice(0, 84)}"`)
console.log('  aperturas de articulo repetidas: ' + aperturasRep.length)
for (const [f, v] of aperturasRep.slice(0, 5)) console.log(`     ${v.length}x  "${f.slice(0, 84)}"`)

// =====================================================================
// D. HUECOS DE CLUSTER (paginas de entrada sin articulos de apoyo)
// =====================================================================
const D = { hubs: [], sinSoporte: [] }
for (const rel of htmlFiles) {
  const h = read(rel)
  const h2 = [...h.matchAll(/<h2[^>]*>([\s\S]{0,120}?)<\/h2>/gi)].map((m) => visible(m[1]))
  if (h2.length >= 3 && /hub|guia|guide|cl[uú]ster|colecci/i.test(rel)) {
    D.hubs.push({ rel, h2: h2.length })
  }
}
console.log('\n=== D. ESTRUCTURA DE CLUSTERS ===')
console.log('  paginas hub/pillar detectadas: ' + D.hubs.length)
for (const h of D.hubs.slice(0, 10)) console.log('     ' + h.rel + ' (' + h.h2 + ' H2)')

// =====================================================================
const out = {
  generated: new Date().toISOString(),
  A: {
    articulos: blogs.length,
    byline: byline.length, authorUrlReal: authorUrlReal.length,
    personCompleta: personCompleta.length, orgCompleta: orgCompleta.length,
    conFechaRevision: conFechaRevision.length, conCita: conCita.length,
    enlaceAutor: enlaceAutor.length, paginaAutor,
    paginasConfianzaFaltantes: faltanConfianza,
    conDireccion, conTelefono, paginas: htmlFiles.length,
    dominiosExternos: Object.fromEntries([...outboundDominios.entries()].sort((a, b) => b[1] - a[1])),
  },
  B: { palabrasMediana: B.palabras[Math.floor(B.palabras.length / 2)], conH2: B.conH2, conLista: B.conLista, conTabla: B.conTabla, outboundMedio: B.outboundMedio },
  C: { muletillas: slop, frasesRepetidas: repetidas.slice(0, 40).map(([f, v]) => ({ frase: f, n: v.length })), aperturasRepetidas: aperturasRep.slice(0, 30).map(([f, v]) => ({ apertura: f, n: v.length })) },
  D: D.hubs,
}
fs.mkdirSync(path.join(ROOT, 'data', 'guerrilla'), { recursive: true })
fs.writeFileSync(path.join(ROOT, 'data', 'guerrilla', 'eeat-audit.json'), JSON.stringify(out, null, 2))
console.log('\nescrito data/guerrilla/eeat-audit.json')
