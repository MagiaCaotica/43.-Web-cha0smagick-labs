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

async function callTool(tool, args) {
  const tmp = path.join(process.env.TEMP || '.', 'opencode', `call-${Date.now()}.json`);
  fs.writeFileSync(tmp, JSON.stringify({ ...args, page: 13 }));
  const r = spawnSync('node', [cli, 'callfile', tool, tmp], { encoding: 'utf8', timeout: 60000 });
  fs.unlinkSync(tmp);
  const out = (r.stdout || '') + (r.stderr || '');
  return out;
}

for (let i = 0; i < Math.min(limit, pending.length); i++) {
  const pin = pending[i];
  console.log(`\n=== ${i+1}/${limit} ${pin.file} ===`);
  
  try {
    // 1. Navigate to pin creation tool
    console.log('Navigating...');
    await callTool('navigate', { action: 'url', url: 'https://co.pinterest.com/pin-creation-tool/' });
    await new Promise(r => setTimeout(r, 3000));
    
    // 2. Upload file
    console.log('Uploading...');
    const fileTmp = path.join(process.env.TEMP || '.', 'opencode', `upload-${Date.now()}.json`);
    const uploadCode = `
const p = browser.page(13);
const FILE = '${path.join(gifDir, pin.file).replace(/\\/g, '\\\\')}';
await p.waitForSelector('#storyboard-upload-input', { timeout: 15000 });
await p.waitForTime(2000);
const ev = await p.cdp('Runtime.evaluate', JSON.stringify({ expression: "document.querySelector('#storyboard-upload-input')", returnByValue: false }));
await p.cdp('DOM.setFileInputFiles', JSON.stringify({ files: [FILE], objectId: ev.result.objectId }));
await p.waitForTime(6000);
return await p.evaluate(() => document.querySelector('#storyboard-selector-title')?.disabled);
`;
    fs.writeFileSync(fileTmp, JSON.stringify({ code: uploadCode }));
    const uploadOut = spawnSync('node', [cli, 'callfile', 'run', fileTmp], { encoding: 'utf8', timeout: 90000 });
    fs.unlinkSync(fileTmp);
    const uploadMatch = (uploadOut.stdout || '').match(/return:\s*([\s\S]*)$/);
    const uploadRes = uploadMatch ? JSON.parse(uploadMatch[1]) : null;
    if (uploadRes?.value === true) {
      console.log('Upload failed - title still disabled');
      continue;
    }
    console.log('Upload OK');
    
    // 3. Fill fields using evaluate
    console.log('Filling fields...');
    const fillTmp = path.join(process.env.TEMP || '.', 'opencode', `fill-${Date.now()}.json`);
    const fillCode = `
const p = browser.page(13);
return await p.evaluate(() => {
  const title = document.querySelector('#storyboard-selector-title');
  const desc = document.querySelector('[aria-label="Describe tu Pin"]') || document.querySelector('[data-test-id="storyboard-description-field-container"] [contenteditable]');
  const link = document.querySelector('#WebsiteField');
  const nativeSetter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
  if (title) { nativeSetter.call(title, ${JSON.stringify(pin.title)}); title.dispatchEvent(new Event('input', {bubbles:true})); }
  if (desc) { desc.textContent = ${JSON.stringify(pin.description)}; desc.dispatchEvent(new Event('input', {bubbles:true})); }
  if (link) { nativeSetter.call(link, ${JSON.stringify(pin.link)}); link.dispatchEvent(new Event('input', {bubbles:true})); }
  return { title: title?.value, desc: desc?.textContent?.slice(0,50), link: link?.value };
});
`;
    fs.writeFileSync(fillTmp, JSON.stringify({ code: fillCode }));
    const fillOut = spawnSync('node', [cli, 'callfile', 'run', fillTmp], { encoding: 'utf8', timeout: 60000 });
    fs.unlinkSync(fillTmp);
    console.log('Fill OK');
    
    // 4. Select board
    console.log('Selecting board...');
    const boardTmp = path.join(process.env.TEMP || '.', 'opencode', `board-${Date.now()}.json`);
    const boardCode = `
const p = browser.page(13);
const s = await p.snapshot({ mode: 'interactive', depth: 8 });
const boardRef = s.refs.find(r => r.role === 'button' && r.name.includes('Tablero'))?.ref;
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
return { ok: true };
`;
    fs.writeFileSync(boardTmp, JSON.stringify({ code: boardCode }));
    const boardOut = spawnSync('node', [cli, 'callfile', 'run', boardTmp], { encoding: 'utf8', timeout: 60000 });
    fs.unlinkSync(boardTmp);
    console.log('Board OK');
    
    // 5. Publish
    console.log('Publishing...');
    const pubTmp = path.join(process.env.TEMP || '.', 'opencode', `pub-${Date.now()}.json`);
    const pubCode = `
const p = browser.page(13);
await p.press('Tab');
await p.waitForTime(1800);
const s3 = await p.snapshot({ mode: 'interactive', depth: 6 });
const pub = s3.refs.find(r => r.role === 'button' && r.name.trim() === 'Publicar');
if (!pub) return { ok: false, error: 'no publish' };
await p.click(pub.ref);
const toast = await p.waitForText('Pin creado', { timeout: 15000 });
const href = await p.evaluate(() => { const a = [...document.querySelectorAll('a')].find(a => a.textContent.includes('Acceder al Pin')); return a?.href || null; });
return { ok: toast.matched || !!href, toast: toast.matched, href };
`;
    fs.writeFileSync(pubTmp, JSON.stringify({ code: pubCode }));
    const pubOut = spawnSync('node', [cli, 'callfile', 'run', pubTmp], { encoding: 'utf8', timeout: 90000 });
    fs.unlinkSync(pubTmp);
    const pubMatch = (pubOut.stdout || '').match(/return:\s*([\s\S]*)$/);
    const pubRes = pubMatch ? JSON.parse(pubMatch[1]) : null;
    
    if (pubRes?.ok) {
      pin.status = 'published'
      fs.writeFileSync(pinsPath, JSON.stringify(pins, null, 2) + '\n')
      console.log(`✅ ${pin.title}`)
    } else {
      console.log('❌ Publish failed')
      console.log((pubOut.stdout || '').slice(-1000))
      break
    }
    
  } catch (e) {
    console.log('Error:', e.message)
    break
  }
  
  await new Promise(r => setTimeout(r, 3000))
}

const left = pins.filter(p => p.status !== 'published')
console.log(`\nDONE. ${pins.length - left.length}/${pins.length} publicados.`)