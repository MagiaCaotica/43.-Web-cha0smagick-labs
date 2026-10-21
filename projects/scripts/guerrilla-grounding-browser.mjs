#!/usr/bin/env node
/**
 * Grounding via BrowserOS: visita la web de cada lead con el navegador real
 * (el fetch directo esta bloqueado en esta red) y extrae hechos reales.
 * Genera un plan con pasos `run`; cada paso devuelve un array JSON que el
 * cliente acumula en data/guerrilla/grounding-collected.jsonl
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
const per = Number(arg('per', 4))
const outFile = arg('out', 'grounding-collected.jsonl')

const clean = JSON.parse(fs.readFileSync(path.join(DIR, 'leads-clean.json'), 'utf8')).leads
const prev = JSON.parse(fs.readFileSync(path.join(DIR, 'grounding.json'), 'utf8'))

const FREE = new Set(['gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com', 'live.com', 'msn.com', 'protonmail.com', 'proton.me', 'aol.com', 'gmx.com', 'gmx.de', 'gmx.es', 'mail.com', 'y7mail.com', 'yandex.com', 'zoho.com', 'icloud.com', 'me.com', 'mac.com', 'frontier.com', 'fastmail.com', 'hushmail.com', 'inbox.com', 'free.fr', 'orange.fr', 'wanadoo.fr', 'sfr.fr', 'web.de', 't-online.de', 'freenet.de', 'seznam.cz', 'libero.it', 'virgilio.it', 'terra.com.br', 'uol.com.br', 'bol.com.br', 'qq.com', '163.com', '126.com', 'foxmail.com', 'wp.pl', 'o2.pl', 'onet.pl', 'interia.pl', 'wp.com', 'mail.ru', 'bk.ru', 'inbox.ru', 'rambler.ru', 'list.ru', 'nate.com', 'hanmail.net', 'naver.com', 'daum.net', 'op.pl', 'onet.eu', 'mail.pl', 'nada.cz', 'gmail.es', 'terra.es', 'hotmail.es', 'outlook.es', 'yahoo.es', 'gmx.net', 'gmx.at', 'gmx.ch', 'gmx.de', 't-online.de', 'freenet.de', 't-online.de', 'gmx.ch', 'bluewin.ch', 'orange.es', 'movistar.es', 's.plus', 'telenet.be', 'ziggo.nl', 'kpnmail.nl', 'nieuwland.nl', 'home.nl', 'planet.nl', 'chello.nl', 'quicknet.nl', 'casema.nl', 'hetnet.nl', 'xs4all.nl', 'telia.net', 'hushmail.com', 'runbox.com', 'zoho.eu', 'zohomail.eu', 'vmail.me', 'tutanota.com', 'posteo.de', 'mailbox.org', 'seznam.cz', 'aol.de', 'mail.bg', 'abv.bg', 'yandex.by', 'yandex.kz', 'i.ua', 'meta.ua', 'ukr.net', 'rambler.ru', 'inbox.lv', 'sve.lv', 'gmail.co.uk', 'btinternet.com', 'virginmedia.com', 'sky.com', 'talktalk.net', 'blueyonder.co.uk', 'tiscali.co.uk', 'wanadoo.co.uk', 'demon.co.uk', 'plus.net', 'nttcom.net', 'biglobe.ne.jp', 'ocn.ne.jp', 'softbank.ne.jp', 'nttdata.net', 'yandex.com.tr', 'turk.net', 'ttmail.net'])

// 1) los que tienen web propia -> se visita su web
const siteLeads = clean.filter((l) => {
  const d = (l.email.split('@')[1] || '').toLowerCase()
  return !FREE.has(d) && d.includes('.')
})
// 2) los que tienen nombre de canal/medio (nombre no vacio y no de grupo) -> se busca en YouTube
const segFilter = arg('segment', '')
const namedLeads = clean.filter((l) => l.name && l.name.trim().length > 3 && /[A-Za-z]{3}/.test(l.name) && !siteLeads.includes(l))
  .filter((l) => (segFilter ? l.segment === segFilter : true))

const mode = arg('mode', 'site')
const targets = mode === 'youtube' ? namedLeads : siteLeads

console.log(`modo: ${mode} | objetivos: ${targets.length}`)
const steps = []
for (let i = 0; i < targets.length; i += per) {
  const chunk = targets.slice(i, i + per)
  const jobs = chunk.map((l) => {
    const d = (l.email.split('@')[1] || '').toLowerCase()
    const url = mode === 'youtube'
      ? 'https://www.youtube.com/results?search_query=' + encodeURIComponent(l.name + ' paranormal')
      : 'https://' + d
    return { email: l.email, name: l.name || '', domain: d, url }
  })
  const code = `
const jobs = ${JSON.stringify(jobs)};
const out = [];
for (const j of jobs) {
  try {
    const p = await browser.open(j.url);
    await p.waitForSelector('title', { timeout: 12000 }).catch(() => {});
    await sleep(1200);
    const info = await p.evaluate(() => {
      const strip = (s) => (s || '').replace(/<[^>]+>/g, ' ').replace(/&[a-z#0-9]+;/gi, ' ').replace(/\\s+/g, ' ').trim();
      const title = document.title || '';
      const desc = (document.querySelector('meta[name="description"]') || {}).content || '';
      const h1 = strip((document.querySelector('h1') || {}).innerText || '');
      const posts = [];
      document.querySelectorAll('h2 a, h3 a, article h2 a, .post-title a, .entry-title a').forEach(a => {
        const t = strip(a.innerText);
        if (t.length > 16 && posts.length < 5) posts.push({ title: t.slice(0, 110), url: a.href });
      });
      const yt = Array.from(document.querySelectorAll('ytd-video-renderer, ytd-channel-renderer')).slice(0, 6).map(v => {
        const t = strip((v.querySelector('#video-title, #text.ytd-channel-name') || {}).innerText || '');
        const ch = strip((v.querySelector('#channel-name, .ytd-channel-name') || {}).innerText || '');
        return (t || ch) ? { title: t, channel: ch } : null;
      }).filter(Boolean);
      return { title: title.slice(0, 200), desc: desc.slice(0, 400), h1: h1.slice(0, 200), posts, yt, final: location.href };
    });
    out.push({ ...j, ok: true, ...info });
    await p.close();
  } catch (e) {
    out.push({ ...j, ok: false, err: String(e.message || e).slice(0, 120) });
  }
}
return JSON.stringify(out);
`
  steps.push({ tool: 'run', args: { code }, max: 6000, collect: path.join(DIR, outFile), continue_on_error: true })
}

const planPath = path.join(DIR, `plan-ground-${mode}.json`)
fs.writeFileSync(planPath, JSON.stringify({ steps }, null, 2))
console.log(`plan: ${steps.length} pasos -> ${planPath}`)
