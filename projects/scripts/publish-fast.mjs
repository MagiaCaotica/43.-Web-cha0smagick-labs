import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawnSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pinsPath = path.join(__dirname, '..', '..', 'gifs_animados_pinterest', 'pins.json');
const cli = path.join(__dirname, 'browseros-mcp.mjs');
const gifDir = path.join(__dirname, '..', '..', 'gifs_animados_pinterest');

const pins = JSON.parse(fs.readFileSync(pinsPath, 'utf8'));
const pending = pins.filter(p => p.status === 'pending');
const limit = Number(process.argv[2] || pending.length);

console.log(`Found ${pending.length} pending pins, publishing up to ${limit}`);

for (let i = 0; i < Math.min(limit, pending.length); i++) {
  const pin = pending[i];
  console.log(`\n=== ${i+1}/${limit} ${pin.file} ===`);
  
  // Optimized single run - everything in one 30s call
  const code = `
const p = browser.page(14);
const D = ${JSON.stringify({
    file: path.join(gifDir, pin.file),
    title: pin.title,
    description: pin.description,
    link: pin.link,
  })};
// Navigate and upload in parallel-ish
await p.goto('https://co.pinterest.com/pin-creation-tool/');
await p.waitForSelector('#storyboard-upload-input', { timeout: 12000 });
await p.waitForTime(1000);
const ev = await p.cdp('Runtime.evaluate', JSON.stringify({ expression: "document.querySelector('#storyboard-upload-input')", returnByValue: false }));
await p.cdp('DOM.setFileInputFiles', JSON.stringify({ files: [D.file], objectId: ev.result.objectId }));
await p.waitForTime(4000);
// Fill while waiting for upload to complete
const s = await p.snapshot({ mode: 'interactive', depth: 6 });
const find = (role, name) => s.refs.find(r => r.role === role && r.name.includes(name))?.ref;
const titleRef = find('textbox', 'Título');
const descRef = find('combobox', 'Describe tu Pin');
const linkRef = find('textbox', 'Enlace');
if (!titleRef || !descRef || !linkRef) return { ok: false, step: 'refs', refs: s.refs.filter(r => ['textbox','combobox'].includes(r.role)).map(r => r.role + ':' + r.name) };
await p.fill(titleRef, D.title);
await p.fill(descRef, D.description);
await p.fill(linkRef, D.link);
// Board
const boardRef = find('button', 'Tablero');
if (boardRef) {
  const b = s.refs.find(r => r.ref === boardRef);
  if (!b.name.includes('Dark Fantasy Art')) {
    await p.click(boardRef);
    await p.waitForTime(600);
    const s2 = await p.snapshot({ mode: 'interactive', depth: 6 });
    const opt = s2.refs.find(r => r.role === 'button' && r.name.trim() === 'Dark Fantasy Art');
    if (opt) await p.click(opt.ref);
  }
}
// Publish
await p.press('Tab');
await p.waitForTime(1000);
const s3 = await p.snapshot({ mode: 'interactive', depth: 4 });
const pub = s3.refs.find(r => r.role === 'button' && r.name.trim() === 'Publicar');
if (!pub) return { ok: false, step: 'no-publish', buttons: s3.refs.filter(r => r.role === 'button').map(r => r.name) };
await p.click(pub.ref);
const toast = await p.waitForText('Pin creado', { timeout: 10000 });
return { ok: toast.matched, toast: toast.matched };
`;
  
  const tmp = path.join(process.env.TEMP || '.', 'opencode', `pin-${Date.now()}.json`);
  fs.writeFileSync(tmp, JSON.stringify({ code, timeout: 28000 }));
  const r = spawnSync('node', [cli, 'callfile', 'run', tmp], { encoding: 'utf8', timeout: 35000 });
  fs.unlinkSync(tmp);
  
  const out = (r.stdout || '') + (r.stderr || '');
  const m = out.match(/return:\s*([\s\S]*)$/);
  let res = null;
  try { res = m ? JSON.parse(m[1]) : null } catch { res = null }
  
  if (res?.ok) {
    pin.status = 'published'
    fs.writeFileSync(pinsPath, JSON.stringify(pins, null, 2) + '\n')
    console.log(`✅ ${pin.title}`)
  } else {
    console.log('❌ FAIL')
    console.log(out.slice(-1200))
    break
  }
  
  await new Promise(r => setTimeout(r, 2000))
}

const left = pins.filter(p => p.status !== 'published')
console.log(`\nDONE. ${pins.length - left.length}/${pins.length} publicados.`)