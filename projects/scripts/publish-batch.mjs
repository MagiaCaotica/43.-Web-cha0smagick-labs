import { readFileSync, writeFileSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import path from 'node:path'

const root = path.resolve(process.cwd())
const pinsPath = path.join(root, 'gifs_animados_pinterest', 'pins.json')
const cli = path.join(root, 'projects', 'scripts', 'browseros-mcp.mjs')
const tmp = path.join(process.env.TEMP || '.', 'opencode', 'pin-run.json')
const gifDir = path.join(root, 'gifs_animados_pinterest')

const pins = JSON.parse(readFileSync(pinsPath, 'utf8'))
const pending = pins.filter(p => p.status === 'pending')
const limit = Number(process.argv[2] || pending.length)
let done = 0

for (const pin of pending) {
  if (done >= limit) break
  done++
  console.log(`\n=== ${done}/${limit} ${pin.file} ===`)
  
  const code = `
const p = browser.page(8);
const D = ${JSON.stringify({
    file: path.join(gifDir, pin.file),
    title: pin.title,
    description: pin.description,
    link: pin.link,
  })};
await p.goto('https://co.pinterest.com/pin-creation-tool/');
await p.waitForSelector('#storyboard-upload-input', { timeout: 15000 });
await p.waitForTime(1500);
const ev = await p.cdp('Runtime.evaluate', JSON.stringify({ expression: "document.querySelector('#storyboard-upload-input')", returnByValue: false }));
await p.cdp('DOM.setFileInputFiles', JSON.stringify({ files: [D.file], objectId: ev.result.objectId }));
await p.waitForTime(6000);
const ready = await p.waitForSelector('#storyboard-selector-title:not([disabled])', { timeout: 18000 });
if (!ready.matched) return { ok: false, step: 'title-not-ready' };
const s = await p.snapshot({ mode: 'interactive', depth: 8 });
const find = (role, name) => s.refs.find(r => r.role === role && r.name.includes(name))?.ref;
const titleRef = find('textbox', 'Título');
const descRef = find('combobox', 'Describe tu Pin');
const linkRef = find('textbox', 'Enlace');
if (!titleRef || !descRef || !linkRef) return { ok: false, step: 'refs', refs: s.refs.filter(r => ['textbox','combobox'].includes(r.role)).map(r => r.role + ':' + r.name) };
await p.fill(titleRef, D.title);
await p.fill(descRef, D.description);
await p.fill(linkRef, D.link);
const boardRef = find('button', 'Tablero');
if (boardRef) {
  const b = s.refs.find(r => r.ref === boardRef);
  if (!b.name.includes('Dark Fantasy Art')) {
    await p.click(boardRef);
    await p.waitForTime(800);
    const s2 = await p.snapshot({ mode: 'interactive', depth: 8 });
    const opt = s2.refs.find(r => r.role === 'button' && r.name.trim() === 'Dark Fantasy Art');
    if (opt) await p.click(opt.ref);
  }
}
await p.press('Tab');
await p.waitForTime(1800);
const s3 = await p.snapshot({ mode: 'interactive', depth: 6 });
const pub = s3.refs.find(r => r.role === 'button' && r.name.trim() === 'Publicar');
if (!pub) return { ok: false, step: 'no-publish', buttons: s3.refs.filter(r => r.role === 'button').map(r => r.name) };
await p.click(pub.ref);
const toast = await p.waitForText('Pin creado', { timeout: 15000 });
const href = await p.evaluate(() => { const a = [...document.querySelectorAll('a')].find(a => a.textContent.includes('Acceder al Pin')); return a?.href || null; });
return { ok: toast.matched || !!href, toast: toast.matched, href };
`
  
  writeFileSync(tmp, JSON.stringify({ code }))
  const r = spawnSync('node', [cli, 'callfile', 'run', tmp], { encoding: 'utf8', timeout: 90000 })
  const out = (r.stdout || '') + (r.stderr || '')
  const m = out.match(/return:\s*([\s\S]*)$/)
  let res = null
  try { res = m ? JSON.parse(m[1]) : null } catch { res = null }
  
  if (res?.ok) {
    pin.status = 'published'
    writeFileSync(pinsPath, JSON.stringify(pins, null, 2) + '\n')
    console.log(`✅ ${pin.title}`)
    if (res.href) console.log(res.href)
  } else {
    console.log('❌ FAIL')
    console.log(out.slice(-1500))
    break
  }
  
  await new Promise(r => setTimeout(r, 3000))
}

const left = pins.filter(p => p.status !== 'published')
console.log(`\nDONE. ${pins.length - left.length}/${pins.length} publicados.`)