#!/usr/bin/env node
/**
 * reconcile-faq-schema.mjs
 *
 * PROBLEMA QUE RESUELVE
 * ---------------------
 * Google exige que el JSON-LD describa contenido VISIBLE en la pagina. Varias
 * paginas del blog tienen un bloque FAQPage cuyas preguntas (`mainEntity[].name`)
 * NO aparecen en el cuerpo visible. Eso es structured data sin respaldo: riesgo
 * de accion manual y, en el peor caso, perdida de los rich results de FAQ.
 *
 * Que hace
 * --------
 * Para cada HTML:
 *   1. Extrae los <script type="application/ld+json">.
 *   2. Localiza los bloques cuyo @type (o @graph[].@type) es FAQPage.
 *   3. Construye el "cuerpo visible": elimina TODOS los <script>, <style>,
 *      comentarios y etiquetas HTML, decodifica entidades y normaliza espacios.
 *   4. Descarta de `mainEntity` toda entrada cuya `name` no aparezca en el
 *      cuerpo visible (comparacion normalizada, sin distinguir mayusculas,
 *      quitando signos de puntuacion).
 *   5. Si sobrevive alguna entrada -> reescribe el bloque con solo las respaldadas.
 *      Si no sobrevive ninguna -> elimina el bloque FAQPage entero.
 *
 * El formato del bloque se preserva: si el original era multilinea, se
 * re-serializa con indentacion de 2 espacios; si era de una sola linea, se
 * re-serializa compacto. Asi el diff es minimo.
 *
 * Es idempotente: una segunda ejecucion sobre un repo ya corregido reporta
 * 0 cambios.
 *
 * USO
 *   node scripts/seo/reconcile-faq-schema.mjs          # dry-run (solo informe)
 *   node scripts/seo/reconcile-faq-schema.mjs --write  # aplica los cambios
 *   node scripts/seo/reconcile-faq-schema.mjs --json   # salida JSON
 */

import fs from 'node:fs'
import path from 'node:path'

const ROOT = path.resolve('.')
const ROOT_FWD = ROOT.replace(/\\/g, '/')
const WRITE = process.argv.includes('--write')
const AS_JSON = process.argv.includes('--json')

const SKIP_DIRS =
  /(^|[\\/])(node_modules|\.git|\.github|vendor|projects|auto-shorts|\.omo)([\\/]|$)/

const ENTITIES = {
  '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'",
  '&apos;': "'", '&mdash;': '\u2014', '&ndash;': '\u2013', '&middot;': '\u00b7',
  '&hellip;': '\u2026', '&rsquo;': '\u2019', '&lsquo;': '\u2018',
  '&ldquo;': '\u201c', '&rdquo;': '\u201d', '&nbsp;': ' ',
}

function dec (s) {
  return String(s).replace(/&(?:amp|lt|gt|quot|#39|apos|mdash|ndash|middot|hellip|rsquo|lsquo|ldquo|rdquo|nbsp);/g, (m) => ENTITIES[m] ?? m)
}

/**
 * Texto visible: fuera scripts, estilos, comentarios y etiquetas.
 * Los <details>/<summary> SI se conservan: su contenido es visible.
 */
function visibleText (html) {
  return dec(
    html
      .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
      .replace(/<!--[\s\S]*?-->/g, ' ')
      .replace(/<[^>]+>/g, ' ')
  )
    .replace(/\s+/g, ' ')
    .trim()
}

/** Normaliza para comparar: minusculas, sin puntuacion, espacios colapsados. */
function norm (s) {
  return dec(String(s))
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function walk (dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (SKIP_DIRS.test(path.join(dir, entry.name))) continue
      walk(path.join(dir, entry.name), out)
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      out.push(path.join(dir, entry.name))
    }
  }
  return out
}

/** Localiza los bloques ld+json. Devuelve {start, end, raw, obj}. */
function findLdBlocks (html) {
  const re = /<script\b[^>]*type\s*=\s*(["'])application\/ld\+json\1[^>]*>([\s\S]*?)<\/script>/gi
  const blocks = []
  let m
  while ((m = re.exec(html)) !== null) {
    const raw = m[2]
    let obj = null
    try { obj = JSON.parse(raw) } catch { obj = null }
    blocks.push({ start: m.index, end: m.index + m[0].length, raw, obj, multiline: /\n/.test(raw) })
  }
  return blocks
}

/** Devuelve true si el objeto (o algun nodo de su @graph) es FAQPage. */
function isFaqPage (obj) {
  if (!obj || typeof obj !== 'object') return false
  const t = obj['@type']
  if (t === 'FAQPage' || (Array.isArray(t) && t.includes('FAQPage'))) return true
  if (Array.isArray(obj['@graph'])) {
    return obj['@graph'].some((n) => {
      const nt = n && n['@type']
      return nt === 'FAQPage' || (Array.isArray(nt) && nt.includes('FAQPage'))
    })
  }
  return false
}

/** Devuelve el nodo FAQPage real (desenvuelto de @graph si hace falta). */
function faqNode (obj) {
  if (Array.isArray(obj['@graph'])) {
    const hit = obj['@graph'].find((n) => {
      const t = n && n['@type']
      return t === 'FAQPage' || (Array.isArray(t) && t.includes('FAQPage'))
    })
    return hit ?? null
  }
  return obj
}

const report = []
let changedFiles = 0
let droppedEntries = 0
let removedBlocks = 0

const files = walk(ROOT_FWD)

for (const abs of files) {
  if (!abs.replace(/\\/g, '/').startsWith(ROOT_FWD + '/')) {
    throw new Error(`rel derivation broken for ${abs}`)
  }
  const rel = abs.replace(/\\/g, '/').slice(ROOT_FWD.length + 1)

  let html = fs.readFileSync(abs, 'utf8')
  if (!isFaqPage(html) && !/FAQPage/.test(html)) continue

  const bodyNorm = norm(visibleText(html))
  const blocks = findLdBlocks(html)
  let out = html
  let fileDropped = 0
  let fileRemoved = 0
  const fileReport = []

  // Se reconstruye de derecha a izquierda para que los indices sigan siendo validos.
  const edits = []
  for (const b of blocks) {
    if (!isFaqPage(b.obj)) continue
    const node = faqNode(b.obj)
    if (!node || !Array.isArray(node.mainEntity)) continue

    const keep = []
    const drop = []
    for (const entry of node.mainEntity) {
      const q = entry && typeof entry.name === 'string' ? entry.name : ''
      if (!q) { drop.push(entry); continue }
      const n = norm(q)
      // La pregunta debe aparecer como secuencia de palabras en el cuerpo.
      const backed = n.length > 0 && bodyNorm.includes(n)
      if (backed) keep.push(entry)
      else drop.push(entry)
    }

    if (drop.length === 0) continue

    fileReport.push({
      file: rel,
      blockStart: b.start,
      schemaQuestions: node.mainEntity.length,
      kept: keep.length,
      dropped: drop.map((e) => e.name),
    })
    fileDropped += drop.length

    if (keep.length === 0) {
      fileRemoved += 1
      removedBlocks += 1
      edits.push({ start: b.start, end: b.end, text: '' })
      continue
    }

    const next = { ...b.obj }
    if (Array.isArray(next['@graph'])) {
      next['@graph'] = next['@graph'].map((n) => (n === node ? { ...n, mainEntity: keep } : n))
    } else {
      next.mainEntity = keep
    }
    const serialized = b.multiline
      ? JSON.stringify(next, null, 2)
      : JSON.stringify(next)
    const openTag = b.raw !== null
      ? out.slice(b.start, b.start + b.raw.length + (out[b.start + b.raw.length - 1] === '>' ? 1 : 0))
      : ''
    // Reconstruye el script respetando el tag de apertura original.
    const tagMatch = /<script\b[^>]*>/i.exec(html.slice(b.start, b.end))
    const open = tagMatch ? tagMatch[0] : '<script type="application/ld+json">'
    void openTag
    edits.push({ start: b.start, end: b.end, text: open + serialized + '</script>' })
  }

  if (edits.length > 0) {
    edits.sort((a, b) => b.start - a.start)
    for (const e of edits) out = out.slice(0, e.start) + e.text + out.slice(e.end)
    report.push({ file: rel, dropped: fileDropped, blocksRemoved: fileRemoved, details: fileReport })
    droppedEntries += fileDropped
    changedFiles += 1
    if (WRITE) fs.writeFileSync(abs, out, 'utf8')
  }
}

if (AS_JSON) {
  console.log(JSON.stringify({
    write: WRITE,
    filesScanned: files.length,
    filesChanged: changedFiles,
    entriesDropped: droppedEntries,
    blocksRemoved: removedBlocks,
    report,
  }, null, 2))
} else {
  console.log(`files scanned      : ${files.length}`)
  console.log(`mode               : ${WRITE ? 'WRITE' : 'dry-run'}`)
  console.log(`files with change  : ${changedFiles}`)
  console.log(`questions dropped  : ${droppedEntries}`)
  console.log(`FAQPage blocks removed: ${removedBlocks}`)
  for (const r of report) {
    console.log(`\n${r.file}  (dropped ${r.dropped}, blocks removed ${r.blocksRemoved})`)
    for (const d of r.details) {
      console.log(`   schema Qs ${d.schemaQuestions} -> kept ${d.kept}`)
      for (const q of d.dropped) console.log(`   - ${q}`)
    }
  }
}
