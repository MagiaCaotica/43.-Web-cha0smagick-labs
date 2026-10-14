// Publica los pins generados que aun NO se han publicado, con tope por ciclo.
// Se ejecuta en local (no en GitHub Actions) para no depender de los jobs de GitHub.
// shortcut: tope de 5/ciclo; sube PIN_BUFFER_LIMIT cuando la app tenga Standard
//         access aprobado y quieras recuperar el backlog mas rapido.
import fs from 'node:fs';
import path from 'node:path';
import https from 'node:https';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIR = path.join(ROOT, 'pins', 'output', 'daily');
const API = process.env.PINTEREST_API_BASE || 'https://api.pinterest.com/v5';
const LIMIT = Number(process.env.PIN_BUFFER_LIMIT || 5);
// El job programado no hereda el shell del usuario: cae a .env si falta la variable.
function envFromDotenv() {
  const f = path.join(ROOT, '.env');
  if (!fs.existsSync(f)) return {};
  return Object.fromEntries(
    fs.readFileSync(f, 'utf8')
      .split(/\r?\n/)
      .map((l) => l.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*)$/i))
      .filter(Boolean)
      .map((m) => [m[1], m[2].trim().replace(/^["']|["']$/g, '')]),
  );
}
const DOTENV = envFromDotenv();
const TOKEN = process.env.PINTEREST_TOKEN || DOTENV.PINTEREST_TOKEN || '';
const BOARD = process.env.PINTEREST_BOARD_ID || DOTENV.PINTEREST_BOARD_ID || '';
const log = (...a) => console.log('pin-buffer:', ...a);

function req(url, { method = 'GET', body, token = TOKEN } = {}) {
  return new Promise((resolve) => {
    const u = new URL(url);
    const data = body ? JSON.stringify(body) : null;
    const headers = { 'Pinterest-Agent-Version': '2024-04-01', Accept: 'application/json' };
    if (token) headers.Authorization = `Bearer ${token}`;
    if (data) {
      headers['Content-Type'] = 'application/json';
      headers['Content-Length'] = Buffer.byteLength(data);
    }
    const r = https.request(
      { hostname: u.hostname, path: u.pathname + u.search, method, headers },
      (res) => {
        let d = '';
        res.on('data', (c) => { d += c; });
        res.on('end', () => resolve({ status: res.statusCode, body: d }));
      }
    );
    r.on('error', (e) => resolve({ status: 'NET', body: e.message }));
    r.setTimeout(25000, () => { r.destroy(); resolve({ status: 'TIMEOUT', body: '' }); });
    if (data) r.write(data);
    r.end();
  });
}

async function resolveBoard() {
  if (BOARD) return BOARD;
  const res = await req(`${API}/boards?page_size=100`);
  if (res.status !== 200) { log(`no pude listar tableros (${res.status})`); return null; }
  const items = JSON.parse(res.body).items || [];
  if (!items.length) { log('la cuenta no tiene tableros'); return null; }
  const pref = items.find((b) => /cha0smagick|tools|magia|grimorio|occult|sigil/i.test(b.name || ''));
  const pick = pref || items[0];
  log(`tablero: ${pick.name} id=${pick.id}`);
  return pick.id;
}

const dryRun = process.argv.includes('--dry-run');
const pending = fs.readdirSync(DIR)
  .filter((f) => f.endsWith('.png') && !fs.existsSync(path.join(DIR, f.replace(/\.png$/, '.published'))))
  .sort();

log(`pendientes: ${pending.length} | tope por ciclo: ${LIMIT}`);

if (dryRun) { log('DRY-RUN: no se publica nada'); process.exit(0); }
if (!TOKEN) { log('PINTEREST_TOKEN ausente — nada que hacer'); process.exit(0); }
if (!pending.length) { log('nada pendiente'); process.exit(0); }

const board = await resolveBoard();
if (!board) process.exit(1);

let done = 0;
for (const png of pending.slice(0, LIMIT)) {
  const base = png.replace(/\.png$/, '');
  const meta = JSON.parse(fs.readFileSync(path.join(DIR, base + '.json'), 'utf8'));
  const data = fs.readFileSync(path.join(DIR, png)).toString('base64');
  const res = await req(`${API}/pins`, {
    method: 'POST',
    body: {
      board_id: board,
      title: `${meta.title} — herramienta gratuita de magia del caos`.slice(0, 100),
      description: `${meta.title} — ${meta.url}`.slice(0, 500),
      link: meta.url,
      media_source: { source_type: 'image_base64', content_type: 'image/png', data },
    },
  });
  if (res.status >= 200 && res.status < 300) {
    fs.writeFileSync(path.join(DIR, base + '.published'), new Date().toISOString());
    log(`publicado ${base} -> board ${board}`);
    done += 1;
  } else {
    log(`FALLO ${base}: ${res.status} ${res.body.slice(0, 220)}`);
    if (res.status === 401 || res.status === 403) break; // no insistir si el token/tier no da
  }
}
log(`publicados ${done} | quedan ${pending.length - done} en cola`);