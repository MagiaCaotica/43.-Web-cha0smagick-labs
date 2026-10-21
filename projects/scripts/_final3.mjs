import fs from "node:fs"
import path from "node:path"
import { execFileSync } from "node:child_process"
const ROOT = process.cwd()

// 1) log claro cuando el dia ya se supero
const r = "projects/scripts/guerrilla-run.mjs"
let t = fs.readFileSync(r, "utf8")
const oldLog = "console.log(`\\n=== TOTAL ENVIADOS ESTA SESION: ${total} | HOY: ${budget.sent.length}/${maxForToday(budget)} ===`)"
const newLog = "const cap = maxForToday(budget)\n" +
  "console.log(`\\n=== TOTAL ENVIADOS ESTA SESION: ${total} | HOY: ${budget.sent.length} enviados (tope del dia segun la rampa: ${cap}${budget.sent.length > cap ? ', ya superado' : ''}) ===`)"
if (t.includes(oldLog)) {
  t = t.replace(oldLog, newLog)
  fs.writeFileSync(r, t, "utf8")
  console.log("ok: log del tope corregido")
}

// 2) documentar la automatizacion en el plan
const PLAN = path.join(ROOT, "docs", "PLAN-UNICO.md")
let p = fs.readFileSync(PLAN, "utf8")
if (!p.includes("Cha0smagick Campana")) {
  const anchor = "## Reglas de ejecución"
  const bloque = `## Automatización ya montada

| Qué | Cómo | Dónde |
|---|---|---|
| Campaña diaria | Tarea programada de Windows **"Cha0smagick Campana"**, 09:00 cada día, límites de la tarea | \`%USERPROFILE%\\bin\\cha0smagick-campaign.cmd\` |
| Política de envío | 50/día con rampa (20 → 30 → 40 → 50), pausa 3-8 min, 1 por dominio, ventana 09:00-20:00, watchdog de quejas y rebotes | \`projects/scripts/guerrilla-policy.mjs\` |
| Preflight | Si BrowserOS no responde, el runner lo arranca; si no puede, sale sin hacer nada | \`guerrilla-run.mjs\` |
| Auditoría de entregabilidad | Comprueba los 783 emails contra los criterios de spam (asunto, cuerpo, dirección, opt-out, links, duplicados) | \`projects/scripts/audit-deliverability.mjs\` |

La tarea corre a las 09:00 y va hasta ~14:00 (50 correos a 3-8 min cada uno), muy
dentro de la ventana. El presupuesto diario rota solo por fecha, así que mañana
empieza con el tope de la rampa sin intervention.

---

`
  p = p.replace(anchor, bloque + anchor)
  fs.writeFileSync(PLAN, p, "utf8")
  console.log("plan: automatizacion documentada")
}

// 3) commit + push
const msg = `feat(campana): automatizacion diaria + politica de entrega endurecida

- Tarea programada de Windows "Cha0smagick Campana" (09:00 cada dia) que
  lanza el runner: la campana se sola a partir de manana.
- Preflight en el runner: si BrowserOS no responde lo arranca; si no puede,
  sale sin enviar nada.
- Politica de entrega: rampa de calentamiento (20/30/40/50), pausa de 3-8
  minutos, 1 correo por dominio y dia, ventana 09:00-20:00, watchdog de
  quejas (1) y de rebotes (3).
- Opt-out como enlace real (mailto), en el idioma del lead, en vez de texto.
- Asunto recortado a <=70 caracteres (Gmail los corta) y con el nombre de la
  organizacion del lead.
- La apertura cita el dominio o el buzon: 0 cuerpos identicos en 783.
- Auditoria de entregabilidad: 0 problemas (asunto, cuerpo, direccion postal,
  opt-out, links verificados, duplicados).
- Herramientas: audit-deliverability.mjs, guerrilla-freemail.mjs.

Co-Authored-By: opencode <noreply@opencode.ai>`
const f = path.join(process.env.TEMP, "opencode", "m.txt")
fs.mkdirSync(path.dirname(f), { recursive: true })
fs.writeFileSync(f, msg, "utf8")
execFileSync("git", ["add", "-A"], { cwd: ROOT, stdio: "inherit" })
execFileSync("git", ["commit", "-F", f], { cwd: ROOT, stdio: "inherit" })
try { execFileSync("git", ["pull", "--rebase", "origin", "main"], { cwd: ROOT, stdio: "pipe" }) } catch {}
const push = execFileSync("git", ["push", "origin", "main"], { cwd: ROOT, encoding: "utf8", stdio: "pipe" })
console.log((push.stdout || "") + (push.stderr || ""))
