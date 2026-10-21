#!/usr/bin/env node
/**
 * Marca como hecho en docs/PLAN-UNICO.md, con su evidencia.
 * Es el paso intermedio del flujo: completar -> marcar -> commit+push.
 *
 *   node plan-mark.mjs --task P0-02 --ev "12/12 fichas verificadas en vivo; 0 discrepancias"
 *   node plan-mark.mjs --residual "F-8" --ev "home enlaza goetic-magic-beginners-guide"
 *   node plan-mark.mjs --task P0-07 --ev "..." --no-commit
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { execFileSync } from 'node:child_process'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
const PLAN = path.join(ROOT, 'docs', 'PLAN-UNICO.md')
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i >= 0 ? process.argv[i + 1] : d }
const ev = arg('ev', '')
const task = arg('task', '')
const residual = arg('residual', '')
const commit = !process.argv.includes('--no-commit')

if (!task && !residual) { console.error('falta --task o --residual'); process.exit(1) }
if (!ev) { console.error('falta --ev (la evidencia es obligatoria)'); process.exit(1) }

let txt = fs.readFileSync(PLAN, 'utf8')
const lines = txt.split('\n')
let changed = 0
let label = ''

if (task) {
  const i = lines.findIndex((l) => l.startsWith('### [ ] ' + task + ' '))
  if (i < 0) { console.error('no existe la tarea ' + task); process.exit(1) }
  lines[i] = lines[i].replace('### [ ] ', '### [x] ')
  label = task
  changed++
  // la evidencia va como primera nota bajo la tarea
  const ins = i + 1
  lines.splice(ins, 0, '', '> **HECHO ' + new Date().toISOString().slice(0, 10) + ' — ' + ev + '**')
} else {
  const i = lines.findIndex((l) => l.startsWith('| ') && l.includes(residual))
  if (i < 0) { console.error('no existe el residual ' + residual); process.exit(1) }
  label = residual
  lines[i] = lines[i].replace(/\| \*\*P\d-\d+\*\* \|$/, '| **PENDIENTE** | ').replace(/\| \*\*(hecho|done)\*\* \|/i, '| **HECHO** |')
  // marcar la celda de "Va en" con el estado
  const cells = lines[i].split('|')
  if (cells.length >= 4) {
    cells[3] = ' **HECHO (' + new Date().toISOString().slice(0, 10) + ')** — ' + ev
    lines[i] = cells.join('|')
  }
  changed++
}

txt = lines.join('\n')
fs.writeFileSync(PLAN, txt, 'utf8')
console.log('marcado: ' + label)

if (commit && changed) {
  const msg = 'docs(plan): marca ' + label + ' como hecho\n\nEvidencia: ' + ev + '\n\nCo-Authored-By: opencode <noreply@opencode.ai>'
  const f = path.join(process.env.TEMP || 'C:\\Windows\\Temp', 'opencode', 'planmsg.txt')
  fs.mkdirSync(path.dirname(f), { recursive: true })
  fs.writeFileSync(f, msg, 'utf8')
  try {
    execFileSync('git', ['add', '-A'], { cwd: ROOT, encoding: 'utf8' })
    execFileSync('git', ['commit', '-F', f], { cwd: ROOT, encoding: 'utf8', stdio: 'inherit' })
    execFileSync('git', ['pull', '--rebase', 'origin', 'main'], { cwd: ROOT, encoding: 'utf8', stdio: 'pipe' })
    const push = execFileSync('git', ['push', 'origin', 'main'], { cwd: ROOT, encoding: 'utf8', stdio: 'pipe' })
    console.log((push.stdout || '') + (push.stderr || ''))
  } catch (e) {
    console.log('git: ' + String((e.stdout || '') + (e.stderr || e.message)).slice(0, 400))
  }
}
