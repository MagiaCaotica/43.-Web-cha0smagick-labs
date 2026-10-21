import fs from "node:fs"
import path from "node:path"
const ROOT = process.cwd()

// La 2a aparicion del bloque de consent que inserte: se quita con regex para
// no depender de los finales de linea.
const RE = /[ \t]*gtag\('consent',\s*'default',\s*\{[^}]*\}\);\r?\n/g
const files = []
function walk(d, n = 0) {
  if (n > 3) return
  let e = []
  try { e = fs.readdirSync(d, { withFileTypes: true }) } catch { return }
  for (const x of e) {
    const full = path.join(d, x.name)
    const rel = path.relative(ROOT, full)
    if (/node_modules|\.git|out|auto-shorts|pinterest-pins/.test(rel)) continue
    if (rel.startsWith("projects" + String.fromCharCode(92))) continue
    if (x.isDirectory()) walk(full, n + 1)
    else if (x.name.endsWith('.html')) files.push(rel)
  }
}
walk(ROOT)

let n = 0
const touched = []
for (const rel of files) {
  const p = path.join(ROOT, rel)
  let t = fs.readFileSync(p, 'utf8')
  const hits = [...t.matchAll(RE)]
  if (hits.length < 2) continue
  // borrar la 2a (la mia) y siguientes
  let count = 0
  t = t.replace(RE, (m) => { count++; return count === 1 ? m : '' })
  fs.writeFileSync(p, t, 'utf8')
  touched.push(rel)
  n++
}
console.log('paginas con consent duplicado corregidas: ' + n)
for (const x of touched.slice(0, 10)) console.log('  ' + x)
