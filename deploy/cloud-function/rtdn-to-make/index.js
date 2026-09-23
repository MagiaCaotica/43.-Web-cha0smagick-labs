// ─────────────────────────────────────────────────────────────────────────────
// 2.4.7 (R7) — Play Console RTDN → Cloud Function → Make.com webhook
//
// Recibe Real-Time Developer Notifications (RTDN) de Google Play vía Pub/Sub
// push, normaliza el payload y lo reenvía firmado (HMAC timing-safe) al
// webhook de Make.com → Sheets / Telegram.
//
// Cobertura RTDN: suscripciones (purchased, renewed, canceled, expired,
// revoked...) y compras anuladas (voided purchases). Las ventas one-time de
// apps ($3.99–$14.99) NO llegan por RTDN → usar el fetch diario 2.4.8
// (scripts/play-sales-report.py).
//
// Modo Cloud Function:
//   exports.rtdnHandler — Pub/Sub push (HTTP: req.body.message.data base64)
//   o background trigger (req.data base64).
// Modo local:
//   node index.js            → selftest con payloads embebidos (sin red)
//   node index.js --selftest → igual
//
// Env vars (Cloud Function env vars; local: .env desde la raíz):
//   RTDN_MAKE_WEBHOOK_URL     → webhook Make.com (requerido en live)
//   RTDN_MAKE_WEBHOOK_SECRET  → secreto HMAC (header X-Webhook-Signature: sha256=<hex>)
//   PLAY_PACKAGE_NAMES        → allowlist opcional, nombres de paquete separados por coma
// ─────────────────────────────────────────────────────────────────────────────

try {
  require('dotenv').config({ path: require('path').resolve(__dirname, '../../../.env') });
} catch (e) {
  /* dotenv opcional en Cloud Functions */
}

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// ── Mapa de notificationType (RTDN subscriptions) ──
const NOTIFICATION_TYPES = {
  1: 'SUBSCRIPTION_RECOVERED',
  2: 'SUBSCRIPTION_RENEWED',
  3: 'SUBSCRIPTION_CANCELED',
  4: 'SUBSCRIPTION_PURCHASED',
  5: 'SUBSCRIPTION_ON_HOLD',
  6: 'SUBSCRIPTION_IN_GRACE_PERIOD',
  7: 'SUBSCRIPTION_RESTARTED',
  8: 'SUBSCRIPTION_PRICE_CHANGE_CONFIRMED',
  9: 'SUBSCRIPTION_DEFERRED',
  10: 'SUBSCRIPTION_PAUSE_SCHEDULE_CHANGED',
  11: 'SUBSCRIPTION_REVOKED',
  12: 'SUBSCRIPTION_EXPIRED',
  20: 'VOIDED_PURCHASE',
};

function hmacSignature(body) {
  const secret = process.env.RTDN_MAKE_WEBHOOK_SECRET || '';
  if (!secret) return null;
  return 'sha256=' + crypto.createHmac('sha256', secret).update(body).digest('hex');
}

function logJson(entry) {
  // Cloud Functions captura stdout como log estructurado; local: JSONL en logs/
  const line = JSON.stringify(entry);
  console.log(line);
  try {
    if (require.main === module || process.env.RTDN_LOCAL_LOG === '1') {
      const dir = path.resolve(__dirname, '../../../logs');
      fs.mkdirSync(dir, { recursive: true });
      fs.appendFileSync(path.join(dir, 'play-rtdn.jsonl'), line + '\n');
    }
  } catch (e) {
    /* logging best-effort */
  }
}

// ── Core: decodifica envelope Pub/Sub + normaliza payload RTDN ──
function processRtdn(envelope) {
  const dataB64 = (envelope && envelope.message && envelope.message.data) || (envelope && envelope.data) || null;
  if (!dataB64) return { ok: false, reason: 'sin data en el envelope Pub/Sub' };

  let payload;
  try {
    payload = JSON.parse(Buffer.from(dataB64, 'base64').toString('utf8'));
  } catch (e) {
    return { ok: false, reason: 'payload RTDN no es JSON válido: ' + e.message };
  }

  // Allowlist opcional de paquetes
  const allow = (process.env.PLAY_PACKAGE_NAMES || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  if (allow.length && payload.packageName && !allow.includes(payload.packageName)) {
    return { ok: false, reason: `paquete ${payload.packageName} fuera del allowlist` };
  }

  let kind = 'unknown';
  let notificationName = null;
  let purchaseToken = null;
  let orderId = null;

  if (payload.voidedPurchaseNotification) {
    kind = 'voided';
    notificationName = 'VOIDED_PURCHASE';
    purchaseToken = payload.voidedPurchaseNotification.purchaseToken || null;
    orderId = payload.voidedPurchaseNotification.orderId || null;
  } else if (payload.subscriptionNotification) {
    kind = 'subscription';
    const t = payload.subscriptionNotification.notificationType;
    notificationName = NOTIFICATION_TYPES[t] || `TYPE_${t}`;
    purchaseToken = payload.subscriptionNotification.purchaseToken || null;
  } else if (payload.testNotification) {
    kind = 'test';
    notificationName = 'TEST_NOTIFICATION';
  } else {
    return { ok: false, reason: 'payload RTDN sin subscriptionNotification/voidedPurchaseNotification/testNotification' };
  }

  const makePayload = {
    type: 'play-rtdn',
    kind,
    packageName: payload.packageName || null,
    notificationType: notificationName,
    purchaseToken,
    orderId,
    eventTime: payload.eventTimeMillis ? new Date(Number(payload.eventTimeMillis)).toISOString() : null,
    occurred_at: new Date().toISOString(),
  };

  return { ok: true, payload, makePayload };
}

// ── Reenvío firmado a Make.com ──
async function postWebhook(makePayload) {
  const url = process.env.RTDN_MAKE_WEBHOOK_URL || '';
  if (!url) throw new Error('RTDN_MAKE_WEBHOOK_URL no configurado');
  const body = JSON.stringify(makePayload);
  const headers = { 'Content-Type': 'application/json' };
  const sig = hmacSignature(body);
  if (sig) headers['X-Webhook-Signature'] = sig;
  const res = await fetch(url, { method: 'POST', headers, body });
  if (!res.ok) throw new Error(`webhook respondió ${res.status}`);
  return res;
}

// ── Cloud Function entry (Pub/Sub push HTTP o background trigger) ──
exports.rtdnHandler = async (req, res) => {
  const isHttp = !!(res && typeof res.status === 'function');
  const envelope = isHttp ? (req.body || {}) : req || {};
  const result = processRtdn(envelope);

  if (!result.ok) {
    logJson({ level: 'error', context: 'rtdn-to-make', message: result.reason });
    if (isHttp) res.status(200).send('ignored'); // 200 para no reintentar mensajes inválidos
    return;
  }

  logJson({ level: 'info', context: 'rtdn-to-make', message: 'RTDN recibido', rtdn: result.makePayload });

  try {
    await postWebhook(result.makePayload);
    logJson({ level: 'info', context: 'rtdn-to-make', message: 'reenviado a Make.com' });
    if (isHttp) res.status(200).send('OK');
  } catch (err) {
    logJson({ level: 'error', context: 'rtdn-to-make', message: 'error reenviando: ' + err.message });
    if (isHttp) res.status(500).send('ERROR'); // 500 → Pub/Sub reintenta
  }
};

// ── Selftest (local, sin red) ──
function selftest() {
  let failures = 0;
  const check = (name, cond) => {
    console.log((cond ? '✓' : '✗') + ' ' + name);
    if (!cond) failures++;
  };

  // 1. Envelope base64 round-trip
  const sample = {
    version: '1.0',
    packageName: 'com.cha0smagick.tarot',
    eventTimeMillis: Date.now(),
    subscriptionNotification: { subscriptionId: 'inner_circle_monthly', notificationType: 4, purchaseToken: 'tok123' },
  };
  const r1 = processRtdn({ message: { data: Buffer.from(JSON.stringify(sample)).toString('base64') } });
  check('envelope base64 → payload', r1.ok && r1.payload.packageName === 'com.cha0smagick.tarot');
  check('subscription purchased → kind/nombre', r1.ok && r1.makePayload.kind === 'subscription' && r1.makePayload.notificationType === 'SUBSCRIPTION_PURCHASED');
  check('purchaseToken propagado', r1.ok && r1.makePayload.purchaseToken === 'tok123');
  check('eventTime ISO', r1.ok && typeof r1.makePayload.eventTime === 'string' && !Number.isNaN(Date.parse(r1.makePayload.eventTime)));

  // 2. Voided purchase
  const sampleVoid = {
    version: '1.0',
    packageName: 'com.cha0smagick.tarot',
    eventTimeMillis: Date.now(),
    voidedPurchaseNotification: { purchaseToken: 'tok123', orderId: 'GPA.3300-1234' },
  };
  const r2 = processRtdn({ message: { data: Buffer.from(JSON.stringify(sampleVoid)).toString('base64') } });
  check('voided → kind/VOIDED_PURCHASE', r2.ok && r2.makePayload.kind === 'voided' && r2.makePayload.notificationType === 'VOIDED_PURCHASE');
  check('orderId propagado', r2.ok && r2.makePayload.orderId === 'GPA.3300-1234');

  // 3. Test notification
  const r3 = processRtdn({ message: { data: Buffer.from(JSON.stringify({ version: '1.0', testNotification: { version: '1.0' } })).toString('base64') } });
  check('testNotification → kind=test', r3.ok && r3.makePayload.kind === 'test');

  // 4. HMAC timing-safe round-trip
  const body = JSON.stringify(r1.makePayload);
  process.env.RTDN_MAKE_WEBHOOK_SECRET = 'test-secret';
  const sig = hmacSignature(body);
  check('HMAC 64 hex + prefijo sha256=', typeof sig === 'string' && sig.startsWith('sha256=') && sig.slice(7).length === 64);
  const sig2 = hmacSignature(body);
  check('HMAC determinista', sig === sig2);
  const sig3 = hmacSignature(body + 'x');
  check('HMAC distinto ante mutación', sig3 !== sig);
  delete process.env.RTDN_MAKE_WEBHOOK_SECRET;

  // 5. Allowlist
  process.env.PLAY_PACKAGE_NAMES = 'com.cha0smagick.tarot';
  const r4 = processRtdn({ message: { data: Buffer.from(JSON.stringify({ version: '1.0', packageName: 'com.otro.app', testNotification: { version: '1.0' } })).toString('base64') } });
  check('allowlist rechaza paquete externo', !r4.ok && /allowlist/.test(r4.reason));
  delete process.env.PLAY_PACKAGE_NAMES;

  // 6. Envelope sin data
  const r5 = processRtdn({});
  check('envelope sin data → error claro', !r5.ok && /sin data/.test(r5.reason));

  console.log(failures === 0 ? '\nselftest OK (' + (13) + ' asserts)' : '\nselftest FALLO: ' + failures);
  process.exit(failures === 0 ? 0 : 1);
}

if (require.main === module) selftest();
