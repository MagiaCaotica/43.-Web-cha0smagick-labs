import fs from "node:fs"
import path from "node:path"
import { execFileSync } from "node:child_process"
const ROOT = process.cwd()

// 1) P0-07: anadir la prueba en vivo a la evidencia
const PLAN = path.join(ROOT, "docs", "PLAN-UNICO.md")
let t = fs.readFileSync(PLAN, "utf8")
const anchor = "> `fix-ga4-init.mjs`, `fix-ga4-dup-consent.mjs`."
if (t.includes(anchor) && !t.includes("PROBADO EN PRODUCCION")) {
  t = t.replace(anchor, anchor + "\n" +
    "> **PROBADO EN PRODUCCION (2026-10-21):** en `tools/tarot-journal.html` se ven las peticiones\n" +
    "> `page_view` **y `tool_funnel_view`** a `google-analytics.com/g/collect` con `tid=G-V6LHCPN9TK`;\n" +
    "> en `blog/abraxas-annunaki.html`, `page_view` y `scroll`. Antes no salia ninguna.")
  fs.writeFileSync(PLAN, t, "utf8")
  console.log("P0-07: evidencia en vivo anadida")
}

// 2) el plan maestro del proyecto: documentar el hallazgo
const DOC = path.join(ROOT, "docs", "plan-guerrilla-2026-10.md")
let d = fs.readFileSync(DOC, "utf8")
if (!d.includes("GA4 no se inicializaba")) {
  d = d.trimEnd() + `

---

## 10. Hallazgo del 2026-10-21: GA4 no medía nada en 419 páginas

El checklist deMedición arrastraba una frase: *"19 eventos instrumentados y **ninguno ha
llegado nunca** a GA4"*. No era un problema de instrumentación: era de **inicialización**.

| Qué pasaba | Páginas |
|---|---|
| Cargaban la librería gtag pero **nunca llamaban a \`gtag('config', 'G-V6LHCPN9TK')\`** → GA4 no arrancaba, ni un \`page_view\` | 350 (el blog) |
| **No cargaban la librería gtag** en absoluto, aunque los eventos sí se instrumentaban en el código | 69 (40 tools atómicas, 25 artículos, 3 de la raíz, 1 de compare) |
| Con GA4 funcionando | 997 de 1011 desplegadas (antes 556) |

Lo grave no era el tráfico perdido: era que **no se podía medir nada**, y por eso
P0-07 (instrumentar el embudo) llevaba semanas atascado sin poder cerrarse. Ahora, en
producción, se ven \`page_view\`, \`tool_funnel_view\`, \`scroll\` y el resto de eventos
llegando a \`google-analytics.com/g/collect\` con el \`tid\` correcto.

**Corolario**: antes de añadir un evento, hay que comprobar que la página **inicializa**
GA4. Instrumentar en una página que no arranca GA4 es escribir en el vacío.

Instrumentos: \`projects/scripts/audit-ga4-coverage.mjs\` (inventario), \`fix-ga4-init.mjs\`
(restituye la inicialización), \`fix-ga4-dup-consent.mjs\` (quita el consent duplicado).
`
  fs.writeFileSync(DOC, d, "utf8")
  console.log("plan del proyecto actualizado")
}

// 3) commit + push
for (const f of ["projects/scripts/_livecheck.mjs", "projects/scripts/_wfstatus.mjs", "projects/scripts/_wfdiag.mjs"]) {
  if (fs.existsSync(path.join(ROOT, f))) fs.rmSync(path.join(ROOT, f), { force: true })
}
const msg = `docs: GA4 verificado en produccion y auditoria de entregabilidad

- P0-07 con prueba en vivo: la tool envia page_view y tool_funnel_view, el blog
  page_view y scroll, a google-analytics.com/g/collect con el tid correcto.
  Antes no salia nada de 419 paginas.
- El plan del proyecto recoge el hallazgo: instrumentar en una pagina que no
  inicializa GA4 es escribir en el vacio.
- Los 3 scripts de diagnostico del deploy se borran (pages.yml es manual a
  proposito: Pages esta en modo legacy y publica main tal cual).

Co-Authored-By: opencode <noreply@opencode.ai>`
const f = path.join(process.env.TEMP, "opencode", "m.txt")
fs.mkdirSync(path.dirname(f), { recursive: true })
fs.writeFileSync(f, msg, "utf8")
execFileSync("git", ["add", "-A"], { cwd: ROOT, stdio: "inherit" })
execFileSync("git", ["commit", "-F", f], { cwd: ROOT, stdio: "inherit" })
try { execFileSync("git", ["pull", "--rebase", "origin", "main"], { cwd: ROOT, stdio: "pipe" }) } catch {}
const push = execFileSync("git", ["push", "origin", "main"], { cwd: ROOT, encoding: "utf8", stdio: "pipe" })
console.log((push.stdout || "") + (push.stderr || ""))
