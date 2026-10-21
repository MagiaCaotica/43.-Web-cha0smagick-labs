#!/usr/bin/env node
/**
 * P0-02 / P0-09 — segunda pasada: precio real en USD (gl=US) + titulo de la
 * ficha + nota, con la sesion de Google del owner para que Play muestre la
 * zona de precios correcta.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
const src = fs.readFileSync(path.join(ROOT, 'js', 'apps-data.js'), 'utf8')
const slice = (n) => { const i = src.indexOf(n); const a = src.indexOf('[', i); const b = src.indexOf('\n];', a); return eval(src.slice(a, b + 2)) }
const APPS = slice('appsData')

const EXTRACT = `
{
const p = await browser.open(URL);
await sleep(4500);
const raw = await p.evaluate(() => { try {
  const body = String((document.body && document.body.textContent) || '').replace(/\\s+/g, ' ');
  const h1 = (document.querySelector('h1')||{}).innerText || null;
  const buy = Array.from(document.querySelectorAll('button, a, [role=button]')).map(b => String(b.innerText||'').replace(/\\s+/g,' ').trim()).find(t => /^Comprar por|^Buy for/i.test(t)) || null;
  const ld = Array.from(document.querySelectorAll('script[type="application/ld+json"]')).map(s => { try { return JSON.parse(s.textContent) } catch { return null } }).filter(Boolean);
  const prod = ld.flatMap(x => (Array.isArray(x) ? x : [x])).find(x => x && x['@type'] === 'SoftwareApplication') || null;
  const price = prod && prod.offers ? (prod.offers.price ?? prod.offers.lowPrice ?? null) : null;
  const cur = prod && prod.offers ? (prod.offers.priceCurrency || null) : null;
  const rate = prod && prod.aggregateRating ? prod.aggregateRating : null;
  const inst = (body.match(/(\\d[\\d.,]*)\\+?\\s*(Descargas|Downloads)/i) || [])[1] || null;
  const installs = (body.match(/([\\d.,]+\\s?\\+?)\\s*Descargas/i) || [])[1] || inst || null;
  const notFound = /Item not found|We're sorry/i.test(body.slice(0, 400));
  return { h1, buy, price, cur, rating: rate ? rate.ratingValue : null, ratingCount: rate ? rate.ratingCount : null, installs, notFound };
} catch (e) { return { err: String(e.message).slice(0, 80) } } });
console.log('PLAYUS ' + JSON.stringify(raw));
}
`
const per = 3
const steps = []
for (let i = 0; i < APPS.length; i += per) {
  const chunk = APPS.slice(i, i + per)
  const code = chunk.map((a) => {
    const url = a.url.replace(/&?utm_[^&]*/g, '') + '&hl=es&gl=US'
    return EXTRACT.replace(/URL/g, JSON.stringify(url))
  }).join('\n')
  steps.push({ tool: 'run', args: { code }, max: 6000, continue_on_error: true })
}
const planPath = path.join(ROOT, 'data', 'guerrilla', 'plan-verify-play-us.json')
fs.writeFileSync(planPath, JSON.stringify({ steps }, null, 2))
console.log(`plan: ${steps.length} pasos -> ${planPath}`)
