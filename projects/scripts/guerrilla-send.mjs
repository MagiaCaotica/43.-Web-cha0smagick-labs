#!/usr/bin/env node
/**
 * Envia la cola de la campana por Gmail usando BrowserOS neo.
 * Genera un plan JSON con pasos `run` (uno cada N emails) que la pestana ejecuta.
 *
 * Uso: node guerrilla-send.mjs --from 0 --count 10 [--segment partner-youtube] [--per 1]
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
const DIR = path.join(ROOT, 'data', 'guerrilla')

const arg = (k, d) => {
  const i = process.argv.indexOf('--' + k)
  return i >= 0 ? process.argv[i + 1] : d
}
const from = Number(arg('from', 0))
const count = Number(arg('count', 10))
const per = Number(arg('per', 1))
const seg = arg('segment', '')

let queue = JSON.parse(fs.readFileSync(path.join(DIR, arg('queue', 'queue2.json')), 'utf8'))
if (seg) queue = queue.filter((q) => q.segment === seg)
const batch = queue.slice(from, from + count)

// La rutina de envio vive aqui (unica fuente). Se inyecta en cada paso del plan.
// Claves descubiertas contra Gmail en espanol:
//  - el campo de destinatario es role=combobox SIN ref: hay que enfocarlo por DOM
//  - p.evaluate() devuelve {page, value}: hay que leer .value
//  - el cuerpo es un div[contenteditable]: p.fill() no sticks, p.type() si
//  - p.type() con \n crea parrafos reales en el editor
//  - el boton Enviar hay que pulsarlo por coordenadas: los duplicados ocultos
//    (3 composes en el DOM) rompen el click
//  - Gmail abre un beforeunload al navegar con un draft: hay que aceptarlo
const ROUTINE = [
  'let p = null;',
`const ev = async (fn, arg) => { const r = await p.evaluate(fn, arg); return (r && typeof r === 'object' && 'value' in r) ? r.value : r; };`,
  'const FOCUS = (sel) => "(() => { const els = Array.from(document.querySelectorAll(" + JSON.stringify(sel) + ")); const el = els.find(e => e.offsetParent !== null) || els[0]; if (el) el.focus(); return !!el; })()";',
  'const guard = async (fn) => { for (let i = 0; i < 2; i++) { try { return await fn(); } catch (e) { const m = String(e.message || e); if (/dialog open/i.test(m)) { await p.dialogAccept().catch(() => p.dialogDismiss().catch(() => {})); await sleep(1200); continue; } throw e; } } };',
  'const results = [];',
  'for (const mail of MAILS) {',
  '  try {',
  '    // resolver la pestana de Gmail de esta sesion (los ids cambian al reiniciar)',
  '    const pages = await browser.pages.list();',
  '    const cands = pages.filter(x => (x.url || "").includes("mail.google.com/mail/u/1"));',
  '    if (!cands.length) { results.push({ to: mail.to, ok: false, err: "sin pestana de gmail" }); break; }',
  '    p = await browser.page(cands[cands.length - 1].pageId);',
  '    const isOpen = await guard(() => ev(() => !!document.querySelector(\'textarea[aria-label="Cuerpo del mensaje"], div[aria-label="Cuerpo del mensaje"]\')));',
  '    if (isOpen) { await p.press("Escape"); await sleep(900); }',
  '    await guard(() => ev(() => { const el = Array.from(document.querySelectorAll("div,span")).filter(e => (e.textContent||"").trim()==="Redactar").pop(); if (el) (el.closest(\'div[role="button"]\')||el).click(); }));',
  '    await sleep(2000);',
  '    await guard(() => ev(FOCUS(\'input[aria-label*="Destinatario"]\')));',
  '    await p.type(mail.to);',
  '    await sleep(400);',
  '    const typed = await ev(() => { const all = Array.from(document.querySelectorAll(\'input[aria-label*="Destinatario"]\')); const el = all.find(e => e.offsetParent !== null) || all[0]; return el ? el.value : ""; });',
  '    if (!typed) { results.push({ to: mail.to, ok: false, err: "destinatario no escrito" }); continue; }',
  '    await p.press("Enter");',
  '    await sleep(500);',
  '    const toEmpty = await ev(() => { const all = Array.from(document.querySelectorAll(\'input[aria-label*="Destinatario"]\')); const el = all.find(e => e.offsetParent !== null) || all[0]; return el ? !el.value : false; });',
  '    if (!toEmpty) { await p.press("Enter"); await sleep(600); }',
  '    await guard(() => ev(FOCUS(\'input[aria-label="Asunto"]\')));',
  '    await p.type(mail.subject);',
  '    await sleep(250);',
  '    await guard(() => ev(FOCUS(\'div[aria-label="Cuerpo del mensaje"]\')));',
  '    await p.type(mail.body);',
  '    await sleep(400);',
  '    const st = await ev((to) => {',
  '      const vdiv = Array.from(document.querySelectorAll(\'div[aria-label="Cuerpo del mensaje"]\')).find(e => e.offsetParent !== null);',
  '      const vsub = Array.from(document.querySelectorAll(\'input[aria-label="Asunto"]\')).find(e => e.offsetParent !== null);',
  '      const chips = Array.from(document.querySelectorAll("span[email]")).map(s => (s.getAttribute("email")||"").toLowerCase());',
  '      const btn = Array.from(document.querySelectorAll(\'[role="button"],button\')).filter(x => /^(Enviar|Send)/.test((x.getAttribute("data-tooltip")||x.getAttribute("aria-label")||"").trim())).find(x => x.offsetParent !== null);',
  '      const r = btn ? btn.getBoundingClientRect() : null;',
  '      return { bodyLen: (vdiv ? (vdiv.innerText||"") : "").trim().length, sub: vsub ? vsub.value : "", chip: chips.includes(String(to).toLowerCase()), rect: r ? { x: Math.round(r.x + r.width/2), y: Math.round(r.y + r.height/2) } : null };',
  '    }, mail.to);',
  '    if (!st.sub || !st.chip || st.bodyLen < 40) { results.push({ to: mail.to, ok: false, err: "fill", st }); await p.press("Escape"); await sleep(700); continue; }',
  '    if (st.rect) { await p.clickAt(st.rect.x, st.rect.y); } else { await p.press("Control+Enter"); }',
  '    await sleep(3000);',
  '    let closed = await ev(() => !Array.from(document.querySelectorAll(\'div[aria-label="Cuerpo del mensaje"]\')).some(e => e.offsetParent !== null));',
  '    let snack = "";',
  '    if (!closed) {',
  '      await sleep(2000);',
  '      closed = await ev(() => !Array.from(document.querySelectorAll(\'div[aria-label="Cuerpo del mensaje"]\')).some(e => e.offsetParent !== null));',
  '      snack = await ev(() => Array.from(document.querySelectorAll(\'[role="alert"], .vh, .aT7\')).map(e => (e.innerText||"").replace(/\\s+/g," ").trim()).filter(Boolean).slice(0,3).join(" | "));',
  '      if (!closed) { await p.press("Escape"); await sleep(900); }',
  '    }',
  '    results.push({ to: mail.to, ok: true, closed: !!closed, snack, bodyLen: st.bodyLen, sub: st.sub.slice(0,36) });',
  '  } catch (e) {',
  '    results.push({ to: mail.to, ok: false, err: String(e.message || e).slice(0,140) });',
  '    try { await p.press("Escape"); } catch {}',
  '  }',
  '}',
  'return results;',
].join('\n')

const steps = []
for (let i = 0; i < batch.length; i += per) {
  const chunk = batch.slice(i, i + per)
  const code = `const MAILS = ${JSON.stringify(chunk.map((q) => ({ to: q.to, subject: q.subject, body: q.body })))};\n${ROUTINE}`
  steps.push({
    tool: 'run',
    args: { code },
    max: 3000,
    continue_on_error: true,
  })
}

const planPath = path.join(DIR, 'plan-send.json')
fs.writeFileSync(planPath, JSON.stringify({ steps }, null, 2))
console.log(`plan generado: ${steps.length} pasos para ${batch.length} emails -> ${planPath}`)
console.log(`rango: ${batch[0] ? batch[0].to : '-'} .. ${batch[batch.length - 1] ? batch[batch.length - 1].to : '-'}`)
