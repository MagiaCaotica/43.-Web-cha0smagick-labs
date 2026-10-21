import fs from "node:fs"
import path from "node:path"
import { execFileSync } from "node:child_process"
const ROOT = process.cwd()
const PLAN = path.join(ROOT, "docs", "PLAN-UNICO.md")
let lines = fs.readFileSync(PLAN, "utf8").split("\n")

const i = lines.findIndex((l) => l.startsWith("### [ ] P0-07 "))
if (i < 0) throw new Error("no encuentro P0-07")

// marcar P0-07 como hecho (la instrumentacion) y anadir la parte que
// depende de los exports financieros como tarea aparte
lines[i] = lines[i].replace("### [ ] P0-07 ", "### [x] P0-07 ")
const ins = [
  "",
  "> **HECHO 2026-10-21 — la instrumentacion era el problema, no los eventos.** Los 19 eventos",
  "> estaban en el codigo pero **419 paginas desplegadas no inicializaban GA4**: 350 paginas del",
  "> blog cargaban la libreria gtag y nunca llamaban a `gtag('config', 'G-V6LHCPN9TK')`, y otras 69",
  "> (las 40 tools atomicas, 25 articulos, 3 de la raiz, 1 de compare/) ni siquiera cargaban la",
  "> libreria. Se restauro el bloque que ya funciona en index.html: ahora **997 de 1011 paginas",
  "> desplegadas tienen GA4 operativo** (antes 556). Instrumentos: `audit-ga4-coverage.mjs`,",
  "> `fix-ga4-init.mjs`, `fix-ga4-dup-consent.mjs`.",
  "",
  "### [ ] P0-07b — Reconciliar purchase contra los exports de Hotmart y Play",
  "",
  "- **Responsable:** Analytics / Revenue.",
  "- **Depende de:** P0-07, G3 (CSV de Hotmart), G4 (acceso a GA4).",
  "- **Entregable:** tabla por pedido con `transaction_id`, importe, moneda y evento GA4 asociado.",
  "- **Debe hacer:** cruzar los eventos `purchase`/`conversion_import` que ya emite `js/conversion.js`",
  "  con los CSV crudos de Hotmart y Play Console; dejar la discrepancia medida, no supuesta.",
  "- **No debe hacer:** dar por buena una cifra de ingresos que no viene de un export.",
  "- **Aceptacion:** el total reconciliado cuadra con el export dentro del margen de impuestos y",
  "  comisiones; las diferencias quedan escritas con su causa.",
  "- **Evidencia:** la tabla de reconciliacion y el export usado, con fecha.",
]
lines.splice(i + 1, 0, ...ins)

fs.writeFileSync(PLAN, lines.join("\n"), "utf8")
console.log("P0-07 marcado (instrumentacion) y P0-07b anadido (reconciliacion, depende de G3/G4)")

// commit + push
const msg = `docs(plan): P0-07 (instrumentacion) hecha, P0-07b (reconciliacion) anadida

La instrumentacion era el problema: 419 paginas desplegadas no inicializaban
GA4, asi que los 19 eventos del contrato nunca salieron. Ya esta corregido y
desplegado (997/1011 paginas con GA4 operativo).

Queda separado lo que depende de los exports de Hotmart y Play (G3/G4).

Co-Authored-By: opencode <noreply@opencode.ai>`
const f = path.join(process.env.TEMP, "opencode", "msg.txt")
fs.mkdirSync(path.dirname(f), { recursive: true })
fs.writeFileSync(f, msg, "utf8")
execFileSync("git", ["add", "-A"], { cwd: ROOT, stdio: "inherit" })
execFileSync("git", ["commit", "-F", f], { cwd: ROOT, stdio: "inherit" })
try { execFileSync("git", ["pull", "--rebase", "origin", "main"], { cwd: ROOT, stdio: "pipe" }) } catch {}
const push = execFileSync("git", ["push", "origin", "main"], { cwd: ROOT, encoding: "utf8", stdio: "pipe" })
console.log((push.stdout || "") + (push.stderr || ""))
