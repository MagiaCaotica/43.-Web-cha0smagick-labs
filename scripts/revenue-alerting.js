/**
 * revenue-alerting.js — Alerta de ingresos (plan 2.6.3, R28)
 *
 * Funcionalidad:
 * - Compara el revenue del día vs REVENUE_DAILY_TARGET (env, requerido en modo live)
 * - Si revenue < threshold × target (default 50%) → alerta Telegram al admin
 *   (TELEGRAM_BOT_TOKEN + TELEGRAM_ADMIN_CHAT_ID, Bot API sendMessage)
 * - Fuente del revenue: --revenue N | --revenue-file ruta.json (campo revenue|total) | env REVENUE_TODAY
 * - Log JSONL en logs/revenue-alerting.jsonl (patrón scripts/bots/logger.js)
 * - Modo --dryrun (construye mensaje sin enviar) y --selftest (sin red)
 * - Equivalente Apps Script: deploy/apps-script/revenue-alerting.gs
 *
 * Uso:
 *   node scripts/revenue-alerting.js --revenue 12.50
 *   node scripts/revenue-alerting.js --revenue-file logs/play-sales-latest.json --dryrun
 *   node scripts/revenue-alerting.js --selftest
 *
 * Variables de entorno:
 *   REVENUE_DAILY_TARGET    — objetivo diario de ingresos USD (requerido)
 *   REVENUE_ALERT_THRESHOLD — fracción del objetivo que dispara la alerta (default 0.5)
 *   TELEGRAM_BOT_TOKEN      — token del bot (ya en .env, sección Telegram)
 *   TELEGRAM_ADMIN_CHAT_ID  — chat ID del admin que recibe la alerta
 *   REVENUE_TODAY           — alternativa a --revenue/--revenue-file
 */

'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const LOG_PATH = path.join(ROOT, 'logs', 'revenue-alerting.jsonl');

require('dotenv').config({ path: path.join(ROOT, '.env') });

function log(level, message, extra) {
  const line = JSON.stringify(
    Object.assign(
      { timestamp: new Date().toISOString(), level: level, context: 'revenue-alerting', message: message },
      extra || {}
    )
  );
  if (level === 'error') {
    console.error(line);
  } else {
    console.log(line);
  }
  try {
    fs.mkdirSync(path.dirname(LOG_PATH), { recursive: true });
    fs.appendFileSync(LOG_PATH, line + '\n', 'utf8');
  } catch (err) {
    console.error(JSON.stringify({ timestamp: new Date().toISOString(), level: 'error', context: 'revenue-alerting', message: 'log write failed: ' + err.message }));
  }
}

/** Línea de alerta = target × threshold; dispara solo si revenue < línea (borde exacto = silencio). */
function decideAlert(revenue, target, threshold) {
  const line = target * threshold;
  return {
    alert: revenue < line,
    line: Math.round(line * 100) / 100,
    pct: target > 0 ? Math.round((revenue / target) * 1000) / 1000 : 0,
  };
}

function buildMessage(revenue, decision, target) {
  const head = decision.alert ? '🚨 ALERTA DE INGRESOS' : '✅ Ingresos OK';
  return (
    head +
    '\nHoy: $' + revenue.toFixed(2) +
    ' | Objetivo: $' + target.toFixed(2) +
    ' (' + (decision.pct * 100).toFixed(1) + '%)' +
    '\nLínea de alerta: $' + decision.line.toFixed(2) + ' (50% del objetivo)' +
    '\n— Cha0smagick Labs'
  );
}

async function sendTelegram(text) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_ADMIN_CHAT_ID;
  if (!token || !chatId) throw new Error('Faltan TELEGRAM_BOT_TOKEN o TELEGRAM_ADMIN_CHAT_ID en .env');
  const res = await fetch('https://api.telegram.org/bot' + token + '/sendMessage', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text: text }),
  });
  if (!res.ok) throw new Error('Telegram HTTP ' + res.status);
  return res.status;
}

function selftest() {
  const d1 = decideAlert(12.5, 50, 0.5); // 25% del objetivo → alerta
  if (!d1.alert) {
    console.error('selftest FAIL: debería alertar con 12.5/50');
    return 1;
  }
  const d2 = decideAlert(40, 50, 0.5); // 80% → silencio
  if (d2.alert) {
    console.error('selftest FAIL: no debería alertar con 40/50');
    return 1;
  }
  const d3 = decideAlert(25, 50, 0.5); // exactamente en la línea → sin alerta
  if (d3.alert) {
    console.error('selftest FAIL: en la línea exacta no debe alertar');
    return 1;
  }
  const d4 = decideAlert(0, 50, 0.5); // cero ingresos → alerta
  if (!d4.alert) {
    console.error('selftest FAIL: cero ingresos debe alertar');
    return 1;
  }
  const msg = buildMessage(12.5, d1, 50);
  if (msg.indexOf('ALERTA') === -1 || msg.indexOf('$12.50') === -1 || msg.indexOf('$25.00') === -1) {
    console.error('selftest FAIL: mensaje — ' + msg);
    return 1;
  }
  console.log('selftest OK — umbral (dispara <50%, silencio ≥50%), borde exacto y mensaje verificados');
  return 0;
}

async function main() {
  const args = process.argv.slice(2);
  if (args.includes('--selftest')) {
    process.exit(selftest());
  }

  let revenue = null;
  const revIdx = args.indexOf('--revenue');
  const fileIdx = args.indexOf('--revenue-file');
  if (revIdx !== -1) {
    revenue = parseFloat(args[revIdx + 1]);
    if (Number.isNaN(revenue)) {
      log('error', '--revenue no es un número');
      process.exit(2);
    }
  } else if (fileIdx !== -1) {
    try {
      const data = JSON.parse(fs.readFileSync(path.resolve(args[fileIdx + 1]), 'utf8'));
      revenue = Number(data.revenue !== undefined ? data.revenue : data.total !== undefined ? data.total : 0);
    } catch (err) {
      log('error', 'no se pudo leer --revenue-file: ' + err.message);
      process.exit(2);
    }
  } else if (process.env.REVENUE_TODAY) {
    revenue = parseFloat(process.env.REVENUE_TODAY);
  }
  if (revenue === null || Number.isNaN(revenue)) {
    log('error', 'falta el revenue del día (--revenue N, --revenue-file ruta.json o env REVENUE_TODAY)');
    process.exit(2);
  }

  const target = parseFloat(process.env.REVENUE_DAILY_TARGET || '');
  if (Number.isNaN(target) || target <= 0) {
    log('error', 'REVENUE_DAILY_TARGET no configurado (env) — requerido en modo live');
    process.exit(2);
  }
  const rawThreshold = parseFloat(process.env.REVENUE_ALERT_THRESHOLD || '0.5');
  const threshold = Number.isNaN(rawThreshold) ? 0.5 : Math.min(Math.max(rawThreshold, 0.01), 1);

  const decision = decideAlert(revenue, target, threshold);
  log(decision.alert ? 'warn' : 'info', decision.alert ? 'revenue bajo la línea de alerta' : 'revenue en objetivo', {
    revenue: revenue,
    target: target,
    alert_line: decision.line,
    pct: decision.pct,
  });

  const message = buildMessage(revenue, decision, target);
  if (args.includes('--dryrun')) {
    console.log('dryrun: envío Telegram omitido');
    console.log(message);
    process.exit(0);
  }
  if (!decision.alert) {
    console.log('sin alerta: revenue ≥ línea');
    process.exit(0);
  }
  try {
    const status = await sendTelegram(message);
    console.log('alerta enviada: Telegram HTTP ' + status);
  } catch (err) {
    log('error', 'fallo enviando alerta: ' + err.message);
    process.exit(3);
  }
}

main().catch((err) => {
  console.error(err && err.message ? err.message : err);
  process.exit(1);
});
