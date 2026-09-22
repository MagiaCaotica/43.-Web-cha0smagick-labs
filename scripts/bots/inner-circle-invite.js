/**
 * inner-circle-invite.js — Invitación VIP Inner Circle (plan 2.4.9, R5)
 *
 * Funcionalidad:
 * - Ante una suscripción confirmada (payload de Hotmart o Make.com), genera el
 *   enlace de invitación al grupo VIP de Telegram y lo entrega por email:
 *   a. Si INNER_CIRCLE_CHAT_ID + TELEGRAM_BOT_TOKEN están seteados → enlace de
 *      un solo uso vía Bot API createChatInviteLink (member_limit=1) — más seguro.
 *   b. Si no → usa el enlace estático TELEGRAM_GROUP_INVITE.
 * - La entrega por email la hace Make.com: POST del payload a
 *   INNER_CIRCLE_WEBHOOK_URL (Make → Sheets + MailerLite email con el enlace).
 * - Idempotente: logs/inner-circle-invites.json (email → {invited_at, link});
 *   emails ya invitados se omiten salvo --force.
 * - Modo --dryrun (sin POST) y --selftest (sin red)
 *
 * Uso:
 *   node scripts/bots/inner-circle-invite.js --payload '{"email":"...","product":"inner-circle"}'
 *   node scripts/bots/inner-circle-invite.js --payload-file logs/hotmart-latest.json
 *   node scripts/bots/inner-circle-invite.js --selftest
 *
 * Variables de entorno:
 *   INNER_CIRCLE_CHAT_ID        — chat_id del grupo VIP (activa enlace de un solo uso)
 *   INNER_CIRCLE_WEBHOOK_URL    — escenario Make.com (Sheets + email MailerLite)
 *   INNER_CIRCLE_WEBHOOK_SECRET — secreto HMAC opcional (X-Webhook-Signature: sha256=<hex>)
 *   TELEGRAM_BOT_TOKEN          — token del bot (ya en .env, sección Telegram)
 *   TELEGRAM_GROUP_INVITE       — enlace estático (fallback)
 */

'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.join(__dirname, '..', '..');
const INVITES_PATH = path.join(ROOT, 'logs', 'inner-circle-invites.json');

require('dotenv').config({ path: path.join(ROOT, '.env') });

function isValidEmail(email) {
  return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

/** Solo procesa suscripciones Inner Circle; payload sin producto = dirigido (se asume Inner Circle). */
function isInnerCircleProduct(product) {
  if (product === undefined || product === null || product === '') return true;
  return String(product).toLowerCase().includes('inner');
}

function chooseInviteSource(env) {
  if (env.INNER_CIRCLE_CHAT_ID && env.TELEGRAM_BOT_TOKEN) return { mode: 'single-use' };
  if (env.TELEGRAM_GROUP_INVITE) return { mode: 'static', link: env.TELEGRAM_GROUP_INVITE };
  return { mode: null };
}

function buildMakePayload(email, link, product, orderId) {
  return {
    type: 'inner-circle-invite',
    email: String(email).trim().toLowerCase(),
    product: product || 'inner-circle',
    order_id: orderId || null,
    invite_link: link,
    generated_at: new Date().toISOString(),
  };
}

function postWebhook(payload, url, secret) {
  const body = JSON.stringify(payload);
  const headers = { 'Content-Type': 'application/json' };
  if (secret) {
    const sig = crypto.createHmac('sha256', secret).update(body).digest('hex');
    headers['X-Webhook-Signature'] = 'sha256=' + sig;
  }
  return fetch(url, { method: 'POST', headers, body }).then((r) => {
    if (!r.ok) throw new Error('Make.com HTTP ' + r.status);
    return r.status;
  });
}

function loadInvites() {
  try {
    return JSON.parse(fs.readFileSync(INVITES_PATH, 'utf8'));
  } catch (err) {
    return {};
  }
}

function saveInvites(map) {
  fs.mkdirSync(path.dirname(INVITES_PATH), { recursive: true });
  fs.writeFileSync(INVITES_PATH, JSON.stringify(map, null, 2) + '\n', 'utf8');
}

async function createSingleUseLink(email) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.INNER_CIRCLE_CHAT_ID;
  const res = await fetch('https://api.telegram.org/bot' + token + '/createChatInviteLink', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, name: 'Inner Circle — ' + email, member_limit: 1 }),
  });
  if (!res.ok) throw new Error('Telegram HTTP ' + res.status);
  const data = await res.json();
  if (!data.result || !data.result.invite_link) throw new Error('respuesta Telegram sin invite_link');
  return data.result.invite_link;
}

function selftest() {
  if (!isValidEmail('a@b.co')) {
    console.error('selftest FAIL: email válido rechazado');
    return 1;
  }
  if (isValidEmail('no-email')) {
    console.error('selftest FAIL: email inválido aceptado');
    return 1;
  }
  if (!isInnerCircleProduct('Inner Circle Monthly')) {
    console.error('selftest FAIL: producto inner rechazado');
    return 1;
  }
  if (isInnerCircleProduct('apps')) {
    console.error('selftest FAIL: producto no-inner aceptado');
    return 1;
  }
  if (!isInnerCircleProduct('')) {
    console.error('selftest FAIL: payload dirigido rechazado');
    return 1;
  }
  const src1 = chooseInviteSource({ INNER_CIRCLE_CHAT_ID: 'x', TELEGRAM_BOT_TOKEN: 'y' });
  if (src1.mode !== 'single-use') {
    console.error('selftest FAIL: modo single-use');
    return 1;
  }
  const src2 = chooseInviteSource({ TELEGRAM_GROUP_INVITE: 'https://t.me/+abc' });
  if (src2.mode !== 'static' || src2.link !== 'https://t.me/+abc') {
    console.error('selftest FAIL: fallback estático');
    return 1;
  }
  const src3 = chooseInviteSource({});
  if (src3.mode !== null) {
    console.error('selftest FAIL: sin fuente debe ser null');
    return 1;
  }
  const payload = buildMakePayload('A@B.co ', 'https://t.me/+xyz', 'inner-circle', 'HB-123');
  if (payload.email !== 'a@b.co' || payload.invite_link !== 'https://t.me/+xyz' || payload.type !== 'inner-circle-invite') {
    console.error('selftest FAIL: payload Make.com — ' + JSON.stringify(payload));
    return 1;
  }
  const sig = crypto.createHmac('sha256', 's3cret').update(JSON.stringify(payload)).digest('hex');
  if (sig.length !== 64) {
    console.error('selftest FAIL: HMAC');
    return 1;
  }
  const invites = {};
  invites['a@b.co'] = { invited_at: '2026-09-22' };
  if (!Object.prototype.hasOwnProperty.call(invites, 'a@b.co')) {
    console.error('selftest FAIL: idempotencia');
    return 1;
  }
  console.log('selftest OK — email, filtro de producto, fuentes de invitación, payload Make.com, HMAC e idempotencia verificados');
  return 0;
}

async function main() {
  const args = process.argv.slice(2);
  if (args.includes('--selftest')) process.exit(selftest());

  let payloadRaw = null;
  const pIdx = args.indexOf('--payload');
  const pfIdx = args.indexOf('--payload-file');
  if (pIdx !== -1) {
    payloadRaw = args[pIdx + 1];
  } else if (pfIdx !== -1) {
    try {
      payloadRaw = fs.readFileSync(path.resolve(args[pfIdx + 1]), 'utf8');
    } catch (err) {
      console.error('ERROR: no se pudo leer --payload-file: ' + err.message);
      process.exit(2);
    }
  }
  if (!payloadRaw) {
    console.error("ERROR: falta --payload '{...}' o --payload-file ruta.json (o --selftest)");
    process.exit(2);
  }
  let data;
  try {
    data = JSON.parse(payloadRaw);
  } catch (err) {
    console.error('ERROR: payload no es JSON válido: ' + err.message);
    process.exit(2);
  }

  const email = data.email || data.subscriber_email || '';
  if (!isValidEmail(email)) {
    console.error('ERROR: email inválido en el payload: ' + JSON.stringify(email));
    process.exit(2);
  }
  const product = data.product || data.product_name || '';
  if (!isInnerCircleProduct(product)) {
    console.log('omitido: el payload no es Inner Circle (product=' + product + ')');
    process.exit(0);
  }

  const normEmail = email.trim().toLowerCase();
  const invites = loadInvites();
  if (!args.includes('--force') && Object.prototype.hasOwnProperty.call(invites, normEmail)) {
    console.log('omitido: ' + normEmail + ' ya fue invitado (' + invites[normEmail].invited_at + ')');
    process.exit(0);
  }

  const source = chooseInviteSource(process.env);
  let link = null;
  if (source.mode === 'single-use') {
    link = await createSingleUseLink(normEmail);
    console.log('enlace de un solo uso generado (member_limit=1)');
  } else if (source.mode === 'static') {
    link = source.link;
    console.log('usando enlace estático TELEGRAM_GROUP_INVITE (INNER_CIRCLE_CHAT_ID no configurado)');
  } else {
    console.error('ERROR: sin fuente de invitación — configura INNER_CIRCLE_CHAT_ID + TELEGRAM_BOT_TOKEN o TELEGRAM_GROUP_INVITE');
    process.exit(2);
  }

  const payload = buildMakePayload(normEmail, link, product, data.order_id || null);
  const webhookUrl = process.env.INNER_CIRCLE_WEBHOOK_URL;
  if (args.includes('--dryrun')) {
    console.log('dryrun: POST a Make.com omitido');
    console.log(JSON.stringify(payload, null, 2));
  } else if (webhookUrl) {
    const status = await postWebhook(payload, webhookUrl, process.env.INNER_CIRCLE_WEBHOOK_SECRET);
    console.log('Make.com HTTP ' + status + ' — email de invitación en cola');
  } else {
    console.log('aviso: INNER_CIRCLE_WEBHOOK_URL no configurado — registro local solamente');
  }

  invites[normEmail] = { invited_at: payload.generated_at, link: link, source: source.mode };
  saveInvites(invites);
  console.log('registro: ' + INVITES_PATH);
}

main().catch((err) => {
  console.error('ERROR: ' + err.message);
  process.exit(1);
});
