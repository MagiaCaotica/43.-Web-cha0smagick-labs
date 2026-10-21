#!/usr/bin/env node
/**
 * Emisor de la campana por Gmail con BrowserOS neo.
 *
 * Cada email se envia en TRES pasos de `run`, porque un cuerpo de ~1.800
 * caracteres tecleado a ~56 car/s se pasa del tope de 30 s del run y el
 * correo se queda a medias:
 *   A: abrir compose, destinatario y asunto
 *   B: primera mitad del cuerpo
 *   C: segunda mitad, enviar y verificar
 *
 * Uso: node guerrilla-send.mjs --queue queue-run.json --count N
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
const DIR = path.join(ROOT, 'data', 'guerrilla')
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i >= 0 ? process.argv[i + 1] : d }

const queueFile = arg('queue', 'queue2.json')
const count = Number(arg('count', 0))
const from = Number(arg('from', 0))
const seg = arg('segment', '')

let queue = JSON.parse(fs.readFileSync(path.join(DIR, queueFile), 'utf8'))
if (seg) queue = queue.filter((q) => q.segment === seg)
const batch = queue.slice(from, from + (count || queue.length))

const PAGE_RESOLVER = `const p = await (async () => {
  const pages = await browser.pages.list();
  const cands = pages.filter(x => (x.url || '').includes('mail.google.com/mail/u/1'));
  if (!cands.length) return null;
  return browser.page(cands[cands.length - 1].pageId);
})();
if (!p) { return JSON.stringify({ ok: false, err: 'sin pestana de gmail' }); }`

const COMMON = `const ev = async (fn, a) => { const r = await p.evaluate(fn, a); return (r && typeof r === 'object' && 'value' in r) ? r.value : r; };
const FOCUS = (sel) => "(() => { const els = Array.from(document.querySelectorAll(" + JSON.stringify(sel) + ")); const el = els.find(e => e.offsetParent !== null) || els[0]; if (el) el.focus(); return !!el; })()";
const guard = async (fn) => { for (let i = 0; i < 2; i++) { try { return await fn(); } catch (e) { const m = String(e.message || e); if (/dialog open/i.test(m)) { await p.dialogAccept().catch(() => p.dialogDismiss().catch(() => {})); await sleep(1200); continue; } throw e; } } };`

const STEP_A = PAGE_RESOLVER + `
await guard(() => ev(() => { const el = Array.from(document.querySelectorAll('div,span')).filter(e => (e.textContent||'').trim()==='Redactar').pop(); if (el) (el.closest('div[role="button"]')||el).click(); }));
await sleep(2000);
await guard(() => ev(FOCUS('input[aria-label*="Destinatario"]')));
await p.type(MAIL.to);
await sleep(250);
await p.press('Enter');
await sleep(600);
const toEmpty = await ev(() => { const all = Array.from(document.querySelectorAll('input[aria-label*="Destinatario"]')); const el = all.find(e => e.offsetParent !== null) || all[0]; return el ? !el.value : false; });
if (!toEmpty) { await p.press('Enter'); await sleep(500); }
await guard(() => ev(FOCUS('input[aria-label="Asunto"]')));
await p.type(MAIL.subject);
await sleep(150);
return JSON.stringify({ step: 'A', to: MAIL.to, toEmpty });`

const STEP_B = PAGE_RESOLVER + `
await guard(() => ev(FOCUS('div[aria-label="Cuerpo del mensaje"]')));
if (PART) { await p.type(PART); }
await sleep(250);
return JSON.stringify({ step: 'B', to: MAIL.to });`

const STEP_C = PAGE_RESOLVER + `
await guard(() => ev(FOCUS('div[aria-label="Cuerpo del mensaje"]')));
if (PART) { await p.type(PART); }
await sleep(300);
const st = await ev((to) => {
  const vdiv = Array.from(document.querySelectorAll('div[aria-label="Cuerpo del mensaje"]')).find(e => e.offsetParent !== null);
  const vsub = Array.from(document.querySelectorAll('input[aria-label="Asunto"]')).find(e => e.offsetParent !== null);
  const chips = Array.from(document.querySelectorAll('span[email]')).map(s => (s.getAttribute('email')||'').toLowerCase());
  const btn = Array.from(document.querySelectorAll('[role="button"],button')).filter(x => /^(Enviar|Send)/.test((x.getAttribute('data-tooltip')||x.getAttribute('aria-label')||'').trim())).find(x => x.offsetParent !== null);
  const r = btn ? btn.getBoundingClientRect() : null;
  return { bodyLen: (vdiv ? (vdiv.innerText||'') : '').trim().length, sub: vsub ? vsub.value : '', chip: chips.includes(String(to).toLowerCase()), rect: r ? { x: Math.round(r.x + r.width/2), y: Math.round(r.y + r.height/2) } : null };
}, MAIL.to);
if (!st.sub || !st.chip || st.bodyLen < 40) { await p.press('Escape'); await sleep(600); return JSON.stringify({ step: 'C', to: MAIL.to, ok: false, err: 'fill', st }); }
if (st.rect) { await p.clickAt(st.rect.x, st.rect.y); } else { await p.press('Control+Enter'); }
await sleep(2200);
let closed = await ev(() => !Array.from(document.querySelectorAll('div[aria-label="Cuerpo del mensaje"]')).some(e => e.offsetParent !== null));
if (!closed) { await sleep(2000); closed = await ev(() => !Array.from(document.querySelectorAll('div[aria-label="Cuerpo del mensaje"]')).some(e => e.offsetParent !== null)); }
const snack = await ev(() => Array.from(document.querySelectorAll('[role="alert"], .vh, .aT7')).map(e => (e.innerText||'').replace(/\\s+/g,' ').trim()).filter(Boolean).slice(0,2).join(' | '));
if (!closed) { await p.press('Escape'); await sleep(700); }
return JSON.stringify({ step: 'C', to: MAIL.to, ok: true, closed, snack, bodyLen: st.bodyLen });`

function splitBody(body) {
  const ls = body.split('\n')
  if (ls.length < 4) return { a: body, b: '' }
  const mid = Math.floor(ls.length / 2)
  return { a: ls.slice(0, mid).join('\n'), b: ls.slice(mid).join('\n') }
}

const steps = []
for (const q of batch) {
  const parts = splitBody(q.body)
  const M = JSON.stringify({ to: q.to, subject: q.subject })
  steps.push({ tool: 'run', max: 1200, continue_on_error: true, args: { code: 'const MAIL = ' + M + ';\n' + COMMON + STEP_A } })
  steps.push({ tool: 'run', max: 1200, continue_on_error: true, args: { code: 'const MAIL = ' + M + ';\nconst PART = ' + JSON.stringify(parts.a) + ';\n' + COMMON + STEP_B } })
  steps.push({ tool: 'run', max: 1200, continue_on_error: true, args: { code: 'const MAIL = ' + M + ';\nconst PART = ' + JSON.stringify(parts.b) + ';\n' + COMMON + STEP_C } })
}

const planPath = path.join(DIR, 'plan-send.json')
fs.writeFileSync(planPath, JSON.stringify({ steps }, null, 2))
console.log(`plan: ${steps.length} pasos para ${batch.length} emails -> ${planPath}`)
if (batch[0]) console.log(`rango: ${batch[0].to} .. ${batch[batch.length - 1].to}`)
