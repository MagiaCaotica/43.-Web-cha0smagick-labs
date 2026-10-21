#!/usr/bin/env node
/**
 * Verificador de enlaces: comprueba que TODA url que vaya en un email exista de
 * verdad (200/301/302 -> ok, redireccion a login o 404 -> no usar).
 * Salida: data/guerrilla/links-verified.json  (urls ok) + links-broken.txt
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
const DIR = path.join(ROOT, 'data', 'guerrilla')
const SITE = 'https://cha0smagicklabs.com'

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'

async function check(url) {
  try {
    const res = await fetch(url, {
      method: 'GET',
      redirect: 'follow',
      headers: { 'User-Agent': UA, Accept: 'text/html,application/xhtml+xml' },
      signal: AbortSignal.timeout(25000),
    })
    const body = res.status === 200 ? await res.text() : ''
    // Hotmart/Play/Google login walls: 200 pero sin contenido util
    const blocked = /signin|accounts\.google\.com\/ServiceLogin/i.test(res.url) && !/cha0smagicklabs|hotmart\.com\/es\/marketplace/.test(res.url)
    return {
      url,
      status: res.status,
      final: res.url,
      ok: res.status >= 200 && res.status < 400 && !blocked,
      blocked,
      bytes: body.length,
      title: (body.match(/<title[^>]*>([^<]{0,120})/i) || [, ''])[1].trim(),
    }
  } catch (e) {
    return { url, status: 0, ok: false, err: String(e.message || e).slice(0, 90) }
  }
}

const candidates = new Set()

// 1) catalogo de apps-data.js
const src = fs.readFileSync(path.join(ROOT, 'js', 'apps-data.js'), 'utf8')
for (const m of src.matchAll(/https?:\/\/(?:pay\.)?hotmart\.com\/[A-Z0-9]+P?/g)) candidates.add(m[0])
for (const m of src.matchAll(/https:\/\/play\.google\.com\/store\/apps\/details\?id=[A-Za-z0-9_.]+/g)) candidates.add(m[0])

// 2) bundle (solo ES)
candidates.add('https://hotmart.com/es/marketplace/productos/bundle-todos-los-libros-esp/V107097103W')

// 3) herramientas
const tools = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'atomic-tools.json'), 'utf8')).tools
for (const t of Object.values(tools)) candidates.add(`${SITE}/tools/${t.slug}.html`)
for (const extra of ['iching', 'viking-runes', 'sigil-generator', 'lunar-phase', 'spell-builder', 'astrology-sign-calculator', 'candle-color-calculator', 'digital-pendulum', 'tengwar-transcriber', 'activador-servidores']) {
  candidates.add(`${SITE}/tools/${extra}.html`)
}

// 4) landing pages y raiz
candidates.add(`${SITE}/`)
candidates.add(`${SITE}/landing-pages/books-bundle.html`)
candidates.add(`${SITE}/lead-magnet/guia-rapida-magia-caos-es.html`)
candidates.add(`${SITE}/lead-magnet/quickstart-guide-chaos-magick-en.html`)

// 5) lead magnets (Drive)
candidates.add('https://drive.google.com/file/d/1grjtsbR9plJoQPtkoVhnsAgytCiXuPQb/view?usp=sharing')
candidates.add('https://drive.google.com/file/d/1VH15ZHker5zfnWYoj-j1XZ9SWDzuLBlg/view?usp=sharing')

// 6) programas
candidates.add(`${SITE}/landing-pages/affiliate-terms.html`)
candidates.add(`${SITE}/landing-pages/apps-bundle.html`)

// 6b) coleccion completa de apps en Google Play (la que se ofrece "la suite")
const idx = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8')
const coll = (idx.match(/https:\/\/play\.google\.com\/store\/apps\/collection\/cluster\?[^"']+/) || [])[0]
if (coll) candidates.add(coll.split('&utm_')[0])

const list = [...candidates]
const results = []
for (const url of list) {
  const r = await check(url)
  results.push(r)
  console.log(`${r.ok ? 'OK  ' : 'FAIL'} ${r.status} ${url}${r.title ? '  | ' + r.title : ''}`)
  await sleep(150)
}

const ok = results.filter((r) => r.ok)
const bad = results.filter((r) => !r.ok)
fs.writeFileSync(path.join(DIR, 'links-verified.json'), JSON.stringify(ok.map((r) => r.url), null, 2))
fs.writeFileSync(path.join(DIR, 'links-broken.txt'), bad.map((r) => `${r.status || 'ERR'} ${r.url}${r.err ? ' :: ' + r.err : ''}${r.title ? ' :: ' + r.title : ''}`).join('\n'))
console.log(`\n=== ENLACES ===\nok: ${ok.length}  rotos: ${bad.length}  total: ${results.length}`)
