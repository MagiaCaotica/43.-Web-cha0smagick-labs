// Pinterest pin-hourly: a Trial-access app must NOT turn the hourly job red.
// Run: node scripts/test-pin-hourly.mjs
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pinDir = path.join(root, 'pins', 'output', 'daily');
const results = [];
const check = (name, ok, detail) => {
  results.push([ok, name]);
  console.log((ok ? 'OK  ' : 'FAIL') + ' ' + name + (ok ? '' : ' -> ' + detail));
};

// Fake Pinterest API: /v5/boards -> board list, /v5/pins -> canned answer.
let pinStatus = 403;
let pinBody = '{"code":29,"message":"Apps with Trial access may not create Pins in production"}';
const server = http.createServer((req, res) => {
  if (req.url.endsWith('/pins')) {
    res.writeHead(pinStatus, { 'Content-Type': 'application/json' });
    res.end(pinBody);
  } else {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ items: [{ id: '999', name: 'Test board', privacy: 'public' }] }));
  }
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}`;

// A pending pin so the script actually reaches the API call.
fs.mkdirSync(pinDir, { recursive: true });
const slug = 's00-000-ci-test-pin';
const metaFile = path.join(pinDir, slug + '.json');
const pngFile = path.join(pinDir, slug + '.png');
fs.writeFileSync(metaFile, JSON.stringify({ slug, title: 'CI test pin', url: 'https://example.com/' }));
fs.writeFileSync(pngFile, Buffer.from('89504e470d0a1a0a', 'hex'));

const run = (env) => new Promise((resolve) => {
  const child = spawn(process.execPath, [path.join(root, 'scripts', 'pin-hourly.mjs')], {
    cwd: root,
    env: {
      ...process.env,
      PINTEREST_TOKEN: 'dummy-token',
      PINTEREST_BOARD_ID: '999',
      PINTEREST_API_BASE: base,
      PIN_SLOT: '0',
      ...env,
    },
  });
  let out = '';
  child.stdout.on('data', (d) => { out += d; });
  child.stderr.on('data', (d) => { out += d; });
  child.on('close', (code) => resolve({ code, out }));
});

try {
  // 1. Trial access on POST /pins -> warning, exit 0 (the job stays green).
  pinStatus = 403;
  pinBody = '{"code":29,"message":"Apps with Trial access may not create Pins in production https://api.pinterest.com - use API Sandbox https://api-sandbox.pinterest.com instead."}';
  const trial = await run({});
  check('403 Trial access no falla el job (exit 0)', trial.code === 0, `exit=${trial.code} out=${trial.out}`);
  check('403 Trial access deja anotacion de warning', /::warning::/.test(trial.out) && /Trial access/.test(trial.out), trial.out);
  check('403 Trial access no escribe marcador .published', !fs.existsSync(path.join(pinDir, slug + '.published')), 'marcador creado');

  // 2. Trial access also on GET /boards (auto-discover board) -> warning, exit 0.
  const trialBoards = await run({ PINTEREST_BOARD_ID: '' });
  check('403 Trial access al listar tableros no falla el job (exit 0)', trialBoards.code === 0, `exit=${trialBoards.code} out=${trialBoards.out}`);
  check('403 Trial access al listar tableros deja warning', /::warning::/.test(trialBoards.out), trialBoards.out);

  // 3. A real API error must still fail loudly.
  pinStatus = 500;
  pinBody = '{"code":1,"message":"internal error"}';
  const real = await run({});
  check('error real de la API sigue fallando (exit 1)', real.code === 1, `exit=${real.code} out=${real.out}`);
  check('error real de la API reporta el status', /Pinterest API 500/.test(real.out), real.out);

  // 4. A non-trial 403 must NOT be swallowed as a warning.
  pinStatus = 403;
  pinBody = '{"code":7,"message":"You do not have permission to create Pins"}';
  const denied = await run({});
  check('403 sin Trial access sigue fallando (exit 1)', denied.code === 1, `exit=${denied.code} out=${denied.out}`);

  // 5. Base without /v5 is normalized.
  const norm = await run({ PINTEREST_API_BASE: base });
  check('PINTEREST_API_BASE sin /v5 se normaliza', /api=http:\/\/127\.0\.0\.1:\d+\/v5/.test(norm.out), norm.out);
} finally {
  server.close();
  for (const f of [metaFile, pngFile, path.join(pinDir, slug + '.published')]) {
    try { fs.unlinkSync(f); } catch { /* noop */ }
  }
}

const fails = results.filter((r) => !r[0]).length;
console.log(`\n${results.length - fails}/${results.length} comprobaciones OK`);
process.exit(fails ? 1 : 0);
