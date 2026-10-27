import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pinsPath = path.join(__dirname, '..', '..', 'gifs_animados_pinterest', 'pins.json');
const pins = JSON.parse(fs.readFileSync(pinsPath, 'utf8'));
const pending = pins.filter(p => p.status === 'pending');

console.log(`Publishing ${pending.length} remaining pins...`);

// Build a single run script that does multiple pins
const gifDir = path.join(__dirname, '..', '..', 'gifs_animados_pinterest').replace(/\\/g, '\\\\');

const pinCode = pending.map((p, i) => `
// PIN ${i+1}: ${p.file}
await p.click('e12'); // Crear nuevo
await p.waitForTime(2000);
const s${i} = await p.snapshot({ mode: 'interactive', depth: 6 });
const fileRef${i} = s${i}.refs.find(r => r.role === 'button' && r.name === 'Carga de archivos')?.ref;
if (!fileRef${i}) return { ok: false, step: 'no-file-ref-${i}' };
await p.upload(fileRef${i}, ['${path.join(gifDir, p.file).replace(/\\/g, '\\\\')}']);
await p.waitForTime(6000);
const s${i}b = await p.snapshot({ mode: 'interactive', depth: 6 });
const titleRef${i} = s${i}b.refs.find(r => r.role === 'textbox' && r.name === 'Título')?.ref;
const descRef${i} = s${i}b.refs.find(r => (r.role === 'combobox' || r.role === 'textbox') && r.name.includes('Describe'))?.ref;
const linkRef${i} = s${i}b.refs.find(r => r.role === 'textbox' && r.name === 'Enlace')?.ref;
if (!titleRef${i} || !descRef${i} || !linkRef${i}) return { ok: false, step: 'no-refs-${i}' };
await p.fill(titleRef${i}, ${JSON.stringify(p.title)});
await p.fill(descRef${i}, ${JSON.stringify(p.description)});
await p.fill(linkRef${i}, ${JSON.stringify(p.link)});
const pubRef${i} = s${i}b.refs.find(r => r.role === 'button' && r.name === 'Publicar')?.ref;
if (!pubRef${i}) return { ok: false, step: 'no-publish-ref-${i}' };
await p.click(pubRef${i});
await p.waitForTime(4000);
`).join('');

const fullCode = `
const p = browser.page(3);
const results = [];
${pinCode}
return results;
`;

const tmp = path.join(process.env.TEMP || '.', 'opencode', 'batch-pins.json');
fs.writeFileSync(tmp, JSON.stringify({ code: fullCode, timeout: 28000 }));

const { spawnSync } = await import('child_process');
const cli = path.join(__dirname, 'browseros-mcp.mjs');
const r = spawnSync('node', [cli, 'callfile', 'run', tmp], { encoding: 'utf8', timeout: 35000 });
console.log(r.stdout);
console.error(r.stderr);