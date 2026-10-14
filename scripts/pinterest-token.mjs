// scripts/pinterest-token.mjs — obtener y verificar un token de Pinterest con scope de escritura.
// Uso:
//   node scripts/pinterest-token.mjs url       -> imprime la URL de autorización con los scopes de escritura
//   node scripts/pinterest-token.mjs exchange  -> pide el code pegado y lo canjea por un access token
//   node scripts/pinterest-token.mjs check     -> muestra scopes y usuario de un token (env PINTEREST_TOKEN)
//   node scripts/pinterest-token.mjs boards    -> lista tus tableros y sus ids (para PINTEREST_BOARD_ID)
//
// Scopes de escritura: pins:write (crear pins), boards:read (leer el tablero destino),
// user_account:read (identificar la cuenta). boards:write solo si quieres crear tableros nuevos.
const API = 'https://api.pinterest.com/v5';
const AUTH = 'https://www.pinterest.com/oauth/';
// boards:write tambien se pide: la API de Pinterest lo exige al crear un pin sobre un tablero.
const SCOPES = process.env.PINTEREST_SCOPES || 'pins:write,boards:write,boards:read,user_account:read';
const REDIRECT = process.env.PINTEREST_REDIRECT_URI || 'https://developers.pinterest.com/myapps/';
const CLIENT_ID = process.env.PINTEREST_CLIENT_ID || '';
const CLIENT_SECRET = process.env.PINTEREST_CLIENT_SECRET || '';

function need(name, value) {
  if (value) return value;
  console.error(`FALTA ${name}. Definel como variable de entorno antes de seguir.`);
  process.exit(1);
}

async function tokenInfo(token) {
  const r = await fetch(`${API}/oauth/token`, { headers: { Authorization: `Bearer ${token}` } });
  return { status: r.status, body: await r.json().catch(() => ({})) };
}

const cmd = process.argv[2] || 'url';

if (cmd === 'url') {
  const url = `${AUTH}?client_id=${encodeURIComponent(need('PINTEREST_CLIENT_ID', CLIENT_ID))}` +
    `&response_type=code&redirect_uri=${encodeURIComponent(REDIRECT)}` +
    `&scope=${encodeURIComponent(SCOPES)}&state=cha0smagicklabs`;
  console.log('Abre esta URL en tu navegador, acepta los permisos y copia el valor de "code" de la URL de redireccion:\n');
  console.log(url);
  console.log(`\nscopes pedidos: ${SCOPES}`);
  console.log('\nSi Pinterest devuelve scope solo de lectura, tu app no esta aprobada para escritura:');
  console.log('  la app debe pasar la revision de developers.pinterest.com/docs/getting-started/connect-app/');
  console.log('  (se revisa cada dia habil; da acceso Trial). Los tokens de prueba "product limited" duran 24h y son de solo lectura.');
  console.log('  Sandbox: cambia la API a https://api-sandbox.pinterest.com y agrega tu cuenta como sandbox user.');
  process.exit(0);
}

if (cmd === 'exchange') {
  const code = process.argv[3] || process.env.PINTEREST_CODE || '';
  if (!code) {
    console.error('Falta el code. Uso: node scripts/pinterest-token.mjs exchange "<code>"');
    process.exit(1);
  }
  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: REDIRECT,
    client_id: need('PINTEREST_CLIENT_ID', CLIENT_ID),
  });
  if (CLIENT_SECRET) body.set('client_secret', CLIENT_SECRET);
  // doc v5: el endpoint /oauth/token exige Authorization: Basic base64(client_id:client_secret)
  const basic = Buffer.from(`${need('PINTEREST_CLIENT_ID', CLIENT_ID)}:${CLIENT_SECRET || ''}`).toString('base64');
  const headers = { 'Content-Type': 'application/x-www-form-urlencoded', Authorization: `Basic ${basic}` };
  const r = await fetch(`${API}/oauth/token`, { method: 'POST', headers, body });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) {
    console.error(`Canje fallo (HTTP ${r.status}): ${JSON.stringify(j)}`);
    process.exit(1);
  }
  console.log('access_token:', j.access_token);
  console.log('scope:', j.scope || '(no informado en la respuesta)');
  if (j.refresh_token) console.log('refresh_token:', j.refresh_token);
  console.log('\nGuarda el access_token como secret PINTEREST_TOKEN en GitHub Actions (Settings > Secrets and variables > Actions).');
  console.log('Verificalo antes con: node scripts/pinterest-token.mjs check <token>');
  process.exit(0);
}

if (cmd === 'check') {
  const token = process.argv[3] || process.env.PINTEREST_TOKEN || need('PINTEREST_TOKEN (arg o env)', '');
  const info = await tokenInfo(token);
  if (info.status !== 200) {
    console.error(`Token invalido o expirado (HTTP ${info.status}): ${JSON.stringify(info.body)}`);
    process.exit(1);
  }
  const scopes = info.body.scope || (info.body.permissions || []).join(',');
  console.log('scopes del token:', scopes || '(ninguno informado)');
  console.log('puede publicar pins:', /\bpins:write\b/.test(scopes) ? 'SI' : 'NO — falta pins:write');
  const acc = await fetch(`${API}/user/account`, { headers: { Authorization: `Bearer ${token}` } });
  const a = await acc.json().catch(() => ({}));
  if (acc.ok) console.log('cuenta:', a.username || a.business_username || JSON.stringify(a).slice(0, 120));
  else console.log('cuenta: no se pudo leer (HTTP ' + acc.status + ')');
  process.exit(0);
}

if (cmd === 'boards') {
  const token = process.argv[3] || process.env.PINTEREST_TOKEN || need('PINTEREST_TOKEN (arg o env)', '');
  const base = process.env.PINTEREST_API_BASE || API;
  const r = await fetch(`${base}/boards?page_size=100`, {
    headers: { Authorization: `Bearer ${token}`, 'Pinterest-Agent-Version': '2024-04-01' },
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) {
    console.error(`No se pudieron listar los tableros (HTTP ${r.status}): ${JSON.stringify(j).slice(0, 200)}`);
    process.exit(1);
  }
  const items = j.items || [];
  if (!items.length) {
    console.log('Tu cuenta no tiene tableros. Crea uno en pinterest.com y vuelve a ejecutar este comando.');
    process.exit(0);
  }
  console.log('Elige el tablero destino y guarda su id como secret PINTEREST_BOARD_ID:\n');
  for (const b of items) console.log(`  ${b.name}${b.privacy ? ' (' + b.privacy + ')' : ''}\n    id: ${b.id}`);
  process.exit(0);
}

console.error('Comandos: url | exchange <code> | check <token> | boards <token>');
process.exit(1);