#!/usr/bin/env node
/**
 * Minador de leads para la campaña guerrilla de Cha0smagick Labs.
 * Fuentes (todas públicas, sin autenticación):
 *   - GitHub commit search  -> email del autor (tier de busqueda, 10/min)
 *   - GitHub repo search    -> proyectos del nicho (para integraciones/awesome-lists)
 *   - npm registry          -> maintainer.email (sin limite estricto)
 *   - PyPI                  -> author_email
 *   - base-clientes.csv     -> base calida existente (grupo + partners)
 * Salida: data/guerrilla/leads.json + leads.csv
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
const OUT = path.join(ROOT, 'data', 'guerrilla')
const UA = 'cha0smagick-campaign/1.0 (lead research; contact: magiacaoticapractica@gmail.com)'

const GITHUB_TOPICS = [
  'occult', 'esoteric', 'tarot', 'witchcraft', 'chaos-magick',
  'sigil', 'rune', 'iching', 'astrology', 'divination',
  'goetia', 'hermetic', 'lucid-dream', 'zodiac', 'talisman',
]
const NPM_TERMS = [
  'tarot', 'occult', 'esoteric', 'iching', 'i-ching', 'runes', 'runic',
  'sigil', 'astrology', 'divination', 'witchcraft', 'grimoire', 'talisman',
  'zodiac', 'lucid dream', 'chaos magic', 'pendulum', 'candle color',
]
const PYPI_NAMES = [
  'flatlib', 'tarot', 'py-tarot', 'tarot-deck', 'iching', 'py-iching',
  'runes', 'sigil', 'astrology', 'pyswisseph', 'geopy', 'chaos',
  'lucid-dream', 'spellbook', 'occult', 'esoteric', 'zodiac',
]

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const out = { generatedAt: new Date().toISOString(), leads: [], stats: {}, errors: [] }

async function getJSON(url, headers = {}, tries = 3) {
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': UA, Accept: 'application/json', ...headers }, signal: AbortSignal.timeout(30000) })
      if (res.status === 403 || res.status === 429) {
        const rem = res.headers.get('x-ratelimit-remaining')
        const reset = res.headers.get('x-ratelimit-reset')
        if (res.status === 429 || rem === '0') {
          const waitMs = reset ? Math.max(5000, (+reset * 1000) - Date.now() + 2000) : 65000
          out.errors.push(`rate-limited ${url} -> wait ${waitMs}ms`)
          await sleep(waitMs)
          continue
        }
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      return await res.json()
    } catch (e) {
      if (i === tries - 1) throw e
      await sleep(2500 * (i + 1))
    }
  }
  throw new Error('unreachable')
}

function push(lead) {
  if (!lead.email) return
  const key = lead.email.trim().toLowerCase()
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(key)) return
  const existing = out.leads.find((l) => l.email.toLowerCase() === key)
  if (existing) {
    if (!existing.sources.includes(lead.source)) existing.sources.push(lead.source)
    existing.intent = Math.max(existing.intent, lead.intent || 0)
    if (!existing.tags && lead.tags) existing.tags = lead.tags
    if (lead.tags) existing.tags = [...new Set([...(existing.tags || []), ...lead.tags])]
    if (!existing.name && lead.name) existing.name = lead.name
    if (!existing.url && lead.url) existing.url = lead.url
    return
  }
  out.leads.push({ ...lead, email: key, sources: [lead.source], intent: lead.intent || 0, tags: lead.tags || [] })
}

// ---------- 1. GitHub: commit search (email del autor, tier de busqueda) ----------
async function githubCommits() {
  let found = 0
  for (const topic of GITHUB_TOPICS) {
    try {
      const url = `https://api.github.com/search/commits?q=topic:${topic}&per_page=30&sort=committer-date`
      const data = await getJSON(url, { Accept: 'application/vnd.github+json' })
      for (const item of data.items || []) {
        const a = item.commit?.author || {}
        const email = item.author?.email || a.email
        if (!email || !email.includes('@')) continue
        if (email.endsWith('@users.noreply.github.com')) continue
        push({
          email,
          name: item.author?.login || a.name || '',
          source: 'github-commit',
          url: item.html_url,
          segment: 'github-dev',
          lang: 'EN',
          intent: 55,
          tags: [topic],
          note: (item.commit?.message || '').split('\n')[0].slice(0, 120),
        })
        found++
      }
      out.stats[`gh-commit:${topic}`] = (data.items || []).length
    } catch (e) {
      out.errors.push(`github-commit ${topic}: ${e.message}`)
    }
    await sleep(6500) // tier busqueda GitHub: 10/min
  }
  out.stats['github-commit-total'] = found
}

// ---------- 2. GitHub: repo search (proyectos, integraciones, awesome-lists) ----------
async function githubRepos() {
  const repos = []
  for (const topic of GITHUB_TOPICS) {
    try {
      const url = `https://api.github.com/search/repositories?q=topic:${topic}+stars:%3E15&per_page=20&sort=stars`
      const data = await getJSON(url, { Accept: 'application/vnd.github+json' })
      for (const r of data.items || []) {
        repos.push({
          full_name: r.full_name,
          html_url: r.html_url,
          description: (r.description || '').slice(0, 200),
          stars: r.stargazers_count,
          owner: r.owner?.login,
          owner_url: r.owner?.html_url,
          topics: r.topics || [topic],
        })
      }
      out.stats[`gh-repo:${topic}`] = (data.items || []).length
    } catch (e) {
      out.errors.push(`github-repo ${topic}: ${e.message}`)
    }
    await sleep(6500)
  }
  // awesome-lists del nicho
  try {
    const data = await getJSON('https://api.github.com/search/repositories?q=awesome+occult+OR+awesome+tarot+OR+awesome+esoteric&per_page=20&sort=stars', { Accept: 'application/vnd.github+json' })
    for (const r of data.items || []) {
      repos.push({
        full_name: r.full_name, html_url: r.html_url, description: (r.description || '').slice(0, 200),
        stars: r.stargazers_count, owner: r.owner?.login, owner_url: r.owner?.html_url,
        topics: ['awesome-list'], isAwesome: true,
      })
    }
    out.stats['gh-awesome'] = (data.items || []).length
  } catch (e) {
    out.errors.push(`github-awesome: ${e.message}`)
  }
  fs.writeFileSync(path.join(OUT, 'github-repos.json'), JSON.stringify(repos, null, 2))
  out.stats['github-repos-total'] = repos.length
  return repos
}

// ---------- 3. npm registry (maintainer.email) ----------
async function npmLeads() {
  let found = 0
  for (const term of NPM_TERMS) {
    try {
      const data = await getJSON(`https://registry.npmjs.org/-/v1/search?text=${encodeURIComponent(term)}&size=20`)
      for (const o of data.objects || []) {
        const pkg = o.package
        if (!pkg?.name) continue
        try {
          const doc = await getJSON(`https://registry.npmjs.org/${pkg.name.replace('/', '%2F')}`)
          const emails = new Set()
          for (const m of doc.maintainers || []) if (m?.email) emails.add(m.email)
          if (doc.author?.email) emails.add(doc.author.email)
          for (const e of emails) {
            push({
              email: e, name: '', source: 'npm', url: `https://www.npmjs.com/package/${pkg.name}`,
              segment: 'npm-dev', lang: 'EN', intent: 50, tags: [term],
              note: `${pkg.name} v${doc.version || '?'}`,
            })
            found++
          }
        } catch { /* paquete no encontrado */ }
        await sleep(120)
      }
      out.stats[`npm:${term}`] = (data.objects || []).length
    } catch (e) {
      out.errors.push(`npm ${term}: ${e.message}`)
    }
  }
  out.stats['npm-total'] = found
}

// ---------- 4. PyPI (author_email) ----------
async function pypiLeads() {
  let found = 0
  for (const name of PYPI_NAMES) {
    try {
      const doc = await getJSON(`https://pypi.org/pypi/${name}/json`)
      const info = doc.info || {}
      const emails = new Set()
      if (info.author_email) for (const e of String(info.author_email).split(',')) if (e.includes('@')) emails.add(e.trim())
      for (const a of info.authors || []) if (a?.email) emails.add(a.email)
      for (const e of emails) {
        push({
          email: e, name: info.author || '', source: 'pypi', url: `https://pypi.org/project/${name}/`,
          segment: 'pypi-dev', lang: 'EN', intent: 50, tags: ['python'],
          note: `${name} v${info.version || '?'}`,
        })
        found++
      }
      out.stats[`pypi:${name}`] = 1
    } catch { out.stats[`pypi:${name}`] = 0 }
    await sleep(150)
  }
  out.stats['pypi-total'] = found
}

// ---------- 5. Base calida existente ----------
function baseCalida() {
  const p = path.join(ROOT, 'projects', 'clientes', 'base-clientes.csv')
  if (!fs.existsSync(p)) return
  const lines = fs.readFileSync(p, 'utf8').split(/\r?\n/).filter(Boolean)
  const head = lines.shift().split(',')
  for (const line of lines) {
    const cells = line.split(',')
    const rec = Object.fromEntries(head.map((h, i) => [h, cells[i] || '']))
    const tipo = (rec.tipo || '').toLowerCase()
    let segment = 'grupo-calido', intent = 80
    if (tipo.includes('youtuber') || tipo.includes('canal')) { segment = 'partner-youtube'; intent = 90 }
    else if (tipo.includes('admin') || tipo.includes('media')) { segment = 'partner-media'; intent = 85 }
    else if (tipo.includes('intl')) { segment = 'grupo-calido'; intent = 75 }
    push({
      email: rec.email, name: rec.nombre || '', source: `base:${rec.fuente || 'csv'}`,
      url: '', segment, lang: rec.idioma === 'EN' ? 'EN' : 'ES', intent,
      tags: ['base-calida', tipo], note: '',
    })
  }
}

// ---------- main ----------
// Fases seleccionables: base pypi npm github-repos github-commits merge
// Cada fase guarda su resultado en disco: si el proceso muere, no se pierde lo hecho.
const PHASES = (process.argv[2] || 'base,pypi,npm,github-repos,github-commits,merge').split(',')
const CACHE = path.join(OUT, 'cache')
fs.mkdirSync(OUT, { recursive: true })
fs.mkdirSync(CACHE, { recursive: true })

function loadCache(name, fallback) {
  const f = path.join(CACHE, `${name}.json`)
  if (!fs.existsSync(f)) return fallback
  try { return JSON.parse(fs.readFileSync(f, 'utf8')) } catch { return fallback }
}
function saveCache(name, data) {
  fs.writeFileSync(path.join(CACHE, `${name}.json`), JSON.stringify(data, null, 2))
}

console.log(`fases: ${PHASES.join(' | ')}`)
if (PHASES.includes('base')) {
  console.log('-> base calida')
  baseCalida()
  saveCache('base', out.leads)
  console.log(`   ${out.leads.length} leads`)
}
if (PHASES.includes('pypi')) {
  console.log('-> pypi')
  await pypiLeads()
  saveCache('pypi', out.leads)
  console.log(`   ${out.leads.length} leads`)
}
if (PHASES.includes('npm')) {
  console.log('-> npm')
  await npmLeads()
  saveCache('npm', out.leads)
  console.log(`   ${out.leads.length} leads`)
}
if (PHASES.includes('github-repos')) {
  console.log('-> github repos')
  await githubRepos()
  saveCache('github-repos', out.leads)
  console.log(`   ${out.leads.length} leads`)
}
if (PHASES.includes('github-commits')) {
  console.log('-> github commits (tardara ~2.5 min por el rate limit)')
  await githubCommits()
  saveCache('github-commits', out.leads)
  console.log(`   ${out.leads.length} leads`)
}
if (PHASES.includes('merge')) {
  // fusiona las fases en cache (cada una es un snapshot del array de leads)
  const merged = new Map()
  for (const f of fs.readdirSync(CACHE)) {
    if (!f.endsWith('.json')) continue
    for (const l of loadCache(f.replace(/\.json$/, ''), [])) {
      const key = l.email.toLowerCase()
      if (!merged.has(key)) merged.set(key, { ...l, sources: [...(l.sources || [])] })
      else {
        const e = merged.get(key)
        e.sources = [...new Set([...(e.sources || []), ...(l.sources || [])])]
        e.intent = Math.max(e.intent || 0, l.intent || 0)
        e.tags = [...new Set([...(e.tags || []), ...(l.tags || [])])]
        if (!e.name && l.name) e.name = l.name
        if (!e.url && l.url) e.url = l.url
        if (!e.note && l.note) e.note = l.note
      }
    }
  }
  out.leads = [...merged.values()].sort((a, b) => b.intent - a.intent)
}

// Solo la fase 'merge' publica leads.json/leads.csv: una ejecucion parcial
// (p.ej. solo github-repos) no debe pisar el listado completo.
if (PHASES.includes('merge')) {
  out.leads.sort((a, b) => b.intent - a.intent)
  fs.writeFileSync(path.join(OUT, 'leads.json'), JSON.stringify(out, null, 2))

  const csv = ['email,name,segment,lang,intent,sources,tags,url,note']
  for (const l of out.leads) {
    const q = (s) => `"${String(s ?? '').replace(/"/g, '""')}"`
    csv.push([q(l.email), q(l.name), q(l.segment), q(l.lang), l.intent, q(l.sources.join('|')), q(l.tags.join('|')), q(l.url), q(l.note)].join(','))
  }
  fs.writeFileSync(path.join(OUT, 'leads.csv'), csv.join('\n'))
}

console.log('\n=== RESUMEN ===')
console.log('total leads:', out.leads.length)
const bySeg = {}
for (const l of out.leads) bySeg[l.segment] = (bySeg[l.segment] || 0) + 1
console.log('por segmento:', JSON.stringify(bySeg))
const byLang = {}
for (const l of out.leads) byLang[l.lang] = (byLang[l.lang] || 0) + 1
console.log('por idioma:', JSON.stringify(byLang))
if (out.errors.length) console.log('errores:', out.errors.slice(0, 12))

