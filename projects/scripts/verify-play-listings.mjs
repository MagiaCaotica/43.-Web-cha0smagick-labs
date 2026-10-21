#!/usr/bin/env node
/**
 * P0-02 / P0-09 — Verificacion VIVA de los 12 listings de Google Play con
 * BrowserOS. Extrae titulo, precio, nota, numero de reseñas e instalaciones de
 * la ficha publica, y deja el dato con fecha para que el catalogo no vuelva a
 * quedarse viejo.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
const src = fs.readFileSync(path.join(ROOT, 'js', 'apps-data.js'), 'utf8')
const slice = (n) => { const i = src.indexOf(n); const a = src.indexOf('[', i); const b = src.indexOf('\n];', a); return eval(src.slice(a, b + 2)) }
const APPS = slice('appsData')

const EXTRACT = `
const p = await browser.open(URL);
await sleep(4000);
const raw = await p.evaluate(() => { try {
  const t = (sel) => { const e = document.querySelector(sel); return e ? String(e.textContent||'').replace(/\\s+/g,' ').trim() : null; };
  const ld = Array.from(document.querySelectorAll('script[type="application/ld+json"]')).map(s => { try { return JSON.parse(s.textContent) } catch { return null } }).filter(Boolean);
  const prod = ld.flatMap(x => (Array.isArray(x) ? x : [x])).find(x => x && (x['@type'] === 'SoftwareApplication' || x.name)) || null;
  const price = prod && prod.offers ? (prod.offers.price ?? prod.offers.lowPrice ?? (Array.isArray(prod.offers) ? prod.offers[0]?.price : null)) : null;
  const cur = prod && prod.offers ? (prod.offers.priceCurrency || (Array.isArray(prod.offers) ? prod.offers[0]?.priceCurrency : null)) : null;
  const rate = prod && prod.aggregateRating ? { r: prod.aggregateRating.ratingValue, n: prod.aggregateRating.ratingCount } : null;
  const installs = t('[itemprop="installCount"], [aria-label*="Downloads"], .wVqUob') || t('div[aria-label*="download"], span[aria-label*="download"]');
  const notFound = /We're sorry|not found|404|Item not found/i.test(String((document.body&&document.body.textContent)||'').slice(0,600));
  const h1 = t('h1');
  return { h1, price, cur, rating: rate ? rate.r : null, ratingCount: rate ? rate.n : null, installs, notFound, url: location.href, ldCount: ld.length };
} catch (e) { return { err: String(e.message).slice(0,80) } } });
console.log('PLAY ' + JSON.stringify(raw));
`

const per = 4
const steps = []
for (let i = 0; i < APPS.length; i += per) {
  const chunk = APPS.slice(i, i + per)
  const code = chunk.map((a) => '{' + EXTRACT.replace(/URL/g, JSON.stringify(a.url)) + '}').join('\n')
  steps.push({ tool: 'run', args: { code }, max: 6000, continue_on_error: true })
}
const planPath = path.join(ROOT, 'data', 'guerrilla', 'plan-verify-play.json')
fs.writeFileSync(planPath, JSON.stringify({ steps }, null, 2))
console.log(`plan: ${steps.length} pasos para ${APPS.length} apps -> ${planPath}`)
