import fs from "node:fs"
import path from "node:path"
const ROOT = process.cwd()
const CONFIG = `    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('consent', 'default', {
        'analytics_storage': 'denied',
        'ad_storage': 'denied',
        'ad_user_data': 'denied',
        'ad_personalization': 'denied'
      });
      gtag('js', new Date());
      gtag('config', 'G-V6LHCPN9TK');
    </script>
`
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
  if (/gtag\(\s*['"]config['"]/.test(t)) continue
  // buscar el tag de la libreria en cualquier contexto (no solo al inicio de linea)
  const m = t.match(/<script async src="https:\/\/www\.googletagmanager\.com\/gtag\/js\?id=[^"]+"><\/script>/)
  if (!m) continue
  const at = m.index + m[0].length
  t = t.slice(0, at) + '\n' + CONFIG + t.slice(at)
  fs.writeFileSync(p, t, 'utf8')
  touched.push(rel)
  n++
}
console.log('paginas corregidas en la segunda pasada: ' + n)
for (const t of touched) console.log('  ' + t)
