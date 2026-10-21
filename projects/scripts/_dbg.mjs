import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
const src = fs.readFileSync(path.join(ROOT, 'js', 'apps-data.js'), 'utf8')
const slice = (n) => { const i = src.indexOf(n); const a = src.indexOf('[', i); const b = src.indexOf('\n];', a); return eval(src.slice(a, b + 2)) }
const APPS = slice('appsData')
console.log('--- playUrl crudos ---')
for (const a of APPS.slice(0, 3)) console.log(a.id, '=>', JSON.stringify(a.playUrl))
console.log('--- slug/url keys disponibles en la primera entrada ---')
console.log(Object.keys(APPS[0]).join(', '))
console.log('--- el bot: que apps conoce ---')
const bot = fs.readFileSync(path.join(ROOT, 'scripts', 'bots', 'bot-brain.js'), 'utf8')
const ids = [...bot.matchAll(/id:\s*'([a-z0-9-]+)'/g)].map((m) => m[1])
console.log('ids en bot-brain.js:', ids.join(', '))
console.log('--- busco las 4 que faltan en todo el bot ---')
for (const id of ['psi-gym', 'iching-oracle', 'eerieroads', 'noctem-tools']) {
  const hits = []
  for (const f of fs.readdirSync(path.join(ROOT, 'scripts', 'bots'))) {
    if (!/\.(js|mjs)$/.test(f)) continue
    const t = fs.readFileSync(path.join(ROOT, 'scripts', 'bots', f), 'utf8')
    if (t.includes(id)) hits.push(f)
  }
  console.log(`  ${id}: ${hits.join(', ') || 'NO ESTA EN NINGUN FICHERO DEL BOT'}`)
}
console.log('--- donde vive el catalogo del bot ---')
for (const f of fs.readdirSync(path.join(ROOT, 'scripts', 'bots'))) console.log('  ' + f)
