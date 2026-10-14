// Publica pins de Pinterest usando la sesion ya iniciada del navegador BrowserOS (Chromium en CDP :9222).
// La API v5 esta bloqueada mientras la app este en Trial access, pero la web si funciona: por eso
// se maneja el pin builder real en lugar de POST /v5/pins.
// Uso: node scripts/pin-browser.mjs [--dry-run] [--only=s00]
import fs from 'fs';
import path from 'path';
import http from 'http';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { chromium } from 'playwright';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIR = path.join(ROOT, 'pins', 'output', 'daily');
const CDP = process.env.BROWSEROS_CDP || 'http://127.0.0.1:9222';
const BUILDER = 'https://co.pinterest.com/pin-builder/';
const LIMIT = Number(process.env.PIN_BROWSER_LIMIT || 3);
const dryRun = process.argv.includes('--dry-run');
const only = (process.argv.find((a) => a.startsWith('--only=')) || '').split('=')[1] || '';

const log = (...a) => console.log('pin-browser:', ...a);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function cdpAlive() {
  return new Promise((resolve) => {
    const req = http.get(`${CDP}/json/version`, { timeout: 2500 }, (res) => {
      res.resume();
      resolve(res.statusCode === 200);
    });
    req.on('timeout', () => {
      req.destroy();
      resolve(false);
    });
    req.on('error', () => resolve(false));
  });
}

// El job programado no puede depender de que el navegador este abierto: lo abrimos nosotros.
async function ensureBrowser() {
  if (await cdpAlive()) return true;
  const exe =
    process.env.BROWSEROS_EXE || path.join(process.env.LOCALAPPDATA || '', 'BrowserOS', 'Application', 'chrome.exe');
  if (!fs.existsSync(exe)) {
    log('No encuentro BrowserOS en', exe, '(define BROWSEROS_EXE)');
    return false;
  }
  log('BrowserOS no esta corriendo. Abriendo con CDP...');
  spawn(
    exe,
    [`--remote-debugging-port=${new URL(CDP).port || 9222}`, '--no-first-run', '--no-default-browser-check'],
    { detached: true, stdio: 'ignore' }
  ).unref();
  for (let i = 0; i < 30; i++) {
    await sleep(2000);
    if (await cdpAlive()) {
      log('BrowserOS listo.');
      return true;
    }
  }
  log('BrowserOS no respondio en 60 s.');
  return false;
}

const pending = fs
  .readdirSync(DIR)
  .filter((f) => f.endsWith('.png'))
  .filter((f) => !fs.existsSync(path.join(DIR, f.replace(/\.png$/, '.published'))))
  .filter((f) => !only || f.startsWith(only))
  .sort();

log(`pendientes: ${pending.length} | tope por ciclo: ${LIMIT}`);
if (dryRun) {
  pending.slice(0, LIMIT).forEach((f) => log('  -', f));
  process.exit(0);
}
if (!pending.length) process.exit(0);

let browser;
if (await ensureBrowser()) {
  try {
    browser = await chromium.connectOverCDP(CDP);
  } catch (err) {
    log('No se pudo conectar al navegador en', CDP, '->', err.message.split('\n')[0]);
    process.exit(1);
  }
}

const context = browser.contexts()[0];
const page = context.pages()[0] || (await context.newPage());

for (const file of pending.slice(0, LIMIT)) {
  const base = file.replace(/\.png$/, '');
  let meta;
  try {
    meta = JSON.parse(fs.readFileSync(path.join(DIR, base + '.json'), 'utf8'));
  } catch {
    log('FALLO', base, '-> sin .json valido');
    continue;
  }

  try {
    // Pinterest no monta la SPA si la pestana no esta enfocada.
    const cdp = await context.newCDPSession(page);
    await cdp.send('Emulation.setFocusEmulationEnabled', { enabled: true });
    await cdp.send('Page.bringToFront');

    await page.goto(BUILDER, { waitUntil: 'domcontentloaded' });
    await sleep(4500);

    const onboarding = page.locator('button:has-text("Entendido")');
    if (await onboarding.count()) await onboarding.first().click({ timeout: 2500 }).catch(() => {});

    await page.locator('input[type=file]').first().setInputFiles(path.join(DIR, file));
    await sleep(9000);

    await page.fill('textarea[id^="pin-draft-title-"]', String(meta.title || base).slice(0, 100));
    await page.fill('textarea[id^="pin-draft-link-"]', meta.url || '');
    await sleep(1500);

    // El boton de publicar vive en el borrador con este test-id.
    await page.locator('[data-test-id="board-dropdown-save-button"]').first().click();

    const done = page.locator(
      '[role=dialog]:has-text("Has creado un Pin"), [role=dialog]:has-text("created a Pin")'
    );
    await done.first().waitFor({ state: 'visible', timeout: 30000 });

    fs.writeFileSync(path.join(DIR, base + '.published'), new Date().toISOString());
    log('publicado', base, '->', meta.url);

    await page.keyboard.press('Escape').catch(() => {});
    for (let i = 0; i < 4; i++) await page.mouse.click(20, 20).catch(() => {});
    await sleep(1200);
  } catch (err) {
    log('FALLO', base, '->', String(err.message).split('\n')[0].slice(0, 160));
  }
}

log('fin del ciclo');
process.exit(0);
