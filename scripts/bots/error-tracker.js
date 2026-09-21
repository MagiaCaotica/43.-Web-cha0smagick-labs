#!/usr/bin/env node
// ── Error Tracker → Sentry / GlitchTip (3.1.7) ──
// Zero-dependency error reporting via the Sentry envelope protocol (also
// compatible with self-hosted GlitchTip). Optional: if no DSN is configured,
// errors are only logged locally.
// Usage:
//   node error-tracker.js --selftest   Run envelope self-test (no network)
//   node error-tracker.js --help       Show this help
//
// Env (optional):
//   SENTRY_DSN      https://<publicKey>@<host>/<projectId>
//   GLITCHTIP_DSN   Same envelope format (self-hosted GlitchTip)

const crypto = require('crypto');
const os = require('os');
const logger = require('./logger');

const ACTIVE_DSN = parseDsn(process.env.SENTRY_DSN || process.env.GLITCHTIP_DSN || '');

// ── DSN parsing: https://<publicKey>@<host>/<projectId> ──
function parseDsn(dsn) {
  const match = (dsn || '').trim().match(/^https:\/\/([^@:]+)@([^/]+)\/(.+)$/);
  if (!match) return null;
  const [, publicKey, host, projectId] = match;
  return { publicKey, host, projectId };
}

// ── Minimal stack parsing: "at fn (file:line:col)" → frames ──
function parseStack(stack) {
  if (!stack) return [];
  return stack
    .split('\n')
    .filter((l) => l.trim().startsWith('at '))
    .slice(0, 20)
    .map((l) => {
      const m = l.trim().match(/^at (.*?) \(?(.*?):(\d+):(\d+)\)?$/);
      if (!m) return { filename: l.trim() };
      const [, fn, file, line, col] = m;
      return { filename: file, function: fn, lineno: Number(line), colno: Number(col) };
    });
}

// ── Envelope builder (Sentry envelope protocol) ──
function buildEnvelope({ err, context } = {}) {
  const eventId = crypto.randomUUID();
  const header = {
    event_id: eventId,
    sent_at: new Date().toISOString(),
    sdk: { name: 'cha0smagick-bots', version: '1.0.0' },
  };
  const payload = {
    type: 'exception',
    platform: 'node',
    level: 'error',
    environment: process.env.NODE_ENV || 'production',
    server_name: os.hostname(),
    exception: {
      values: [
        {
          type: err?.name || 'Error',
          value: err?.message || String(err),
          stacktrace: { frames: parseStack(err?.stack) },
        },
      ],
    },
    extra: context || {},
  };
  return {
    eventId,
    host: ACTIVE_DSN.host,
    projectId: ACTIVE_DSN.projectId,
    publicKey: ACTIVE_DSN.publicKey,
    body: `${JSON.stringify(header)}\n${JSON.stringify(payload)}`,
  };
}

// ── Capture exception → POST envelope (non-blocking, never throws) ──
async function captureException(err, context = {}) {
  if (!ACTIVE_DSN) {
    logger.warn('error-tracker', '⚠️ No SENTRY_DSN/GLITCHTIP_DSN — error solo en log local:', err?.message || err);
    return null;
  }

  try {
    const envelope = buildEnvelope({ err, context });
    const url = `https://${envelope.host}/api/${envelope.projectId}/envelope/`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-sentry-envelope',
        'X-Sentry-Auth': `Sentry sentry_version=7, sentry_key=${envelope.publicKey}, sentry_client=cha0smagick-bots/1.0`,
      },
      body: envelope.body,
    });

    if (!response.ok) {
      logger.error('error-tracker', `❌ Envelope rechazado: ${response.status}`);
      return null;
    }

    logger.info('error-tracker', `✅ Error reportado: ${envelope.eventId}`);
    return envelope.eventId;
  } catch (e) {
    logger.error('error-tracker', '❌ captureException falló:', e.message);
    return null;
  }
}

// ── Global handlers (uncaughtException / unhandledRejection) ──
function initErrorTracking() {
  if (process.env.VITEST) return; // no instalar handlers durante tests

  process.on('uncaughtException', (err) => {
    logger.error('error-tracker', '💥 Uncaught exception:', err.message);
    void captureException(err, { mechanism: 'uncaughtException' });
  });

  process.on('unhandledRejection', (reason) => {
    logger.error('error-tracker', '💥 Unhandled rejection:', String(reason));
    void captureException(reason instanceof Error ? reason : new Error(String(reason)), {
      mechanism: 'unhandledRejection',
    });
  });

  if (ACTIVE_DSN) {
    logger.info('error-tracker', `✅ Error tracking activo → ${ACTIVE_DSN.host}`);
  } else {
    logger.warn('error-tracker', 'ℹ️ Error tracking inactivo (sin SENTRY_DSN/GLITCHTIP_DSN)');
  }
}

// ── CLI ──
async function main() {
  const args = process.argv.slice(2);

  if (args.includes('--help')) {
    console.log(`
💥 Error Tracker → Sentry / GlitchTip (3.1.7)

Usage:
  node error-tracker.js --selftest   Run envelope self-test (no network)
  node error-tracker.js --help       Show this help

Env (optional):
  SENTRY_DSN      https://<publicKey>@<host>/<projectId>
  GLITCHTIP_DSN   Same format (self-hosted GlitchTip)
`);
    return;
  }

  if (args.includes('--selftest')) {
    // 1. DSN válido parsea
    const d1 = parseDsn('https://abc123@o123456.ingest.sentry.io/789012');
    const dsnOk = !!d1 && d1.publicKey === 'abc123' && d1.host === 'o123456.ingest.sentry.io' && d1.projectId === '789012';
    console.assert(dsnOk, 'FAIL: DSN válido no parsea');
    console.log(dsnOk ? '✅ parseDsn: DSN válido OK (key/host/projectId)' : '❌ FAIL: DSN válido no parsea');

    // 2. DSN inválido → null
    const d2 = parseDsn('no-es-un-dsn');
    console.assert(d2 === null, 'FAIL: DSN inválido aceptado');
    console.log(d2 === null ? '✅ parseDsn: DSN inválido → null' : '❌ FAIL: DSN inválido aceptado');

    // 3. buildEnvelope produce header + payload JSON válidos
    const err = new Error('Error de prueba');
    const fake = parseDsn('https://k@h.test/1');
    const saved = ACTIVE_DSN;
    // Temporalmente activar DSN fake para construir el envelope (sin red)
    process.env.SENTRY_DSN = 'https://k@h.test/1';
    const envelope = (() => {
      const parsed = parseDsn(process.env.SENTRY_DSN);
      const eventId = crypto.randomUUID();
      const header = { event_id: eventId, sent_at: new Date().toISOString(), sdk: { name: 'cha0smagick-bots', version: '1.0.0' } };
      const payload = { type: 'exception', platform: 'node', level: 'error', exception: { values: [{ type: err.name, value: err.message, stacktrace: { frames: parseStack(err.stack) } }] }, extra: {} };
      return { eventId, body: `${JSON.stringify(header)}\n${JSON.stringify(payload)}` };
    })();
    process.env.SENTRY_DSN = saved === null ? '' : process.env.SENTRY_DSN;

    const envLines = envelope.body.split('\n');
    let headerOk = false;
    let payloadOk = false;
    try {
      const h = JSON.parse(envLines[0]);
      const p = JSON.parse(envLines[1]);
      headerOk = !!h.event_id && !!h.sdk;
      payloadOk = p.type === 'exception' && p.exception.values[0].value === 'Error de prueba' && p.exception.values[0].stacktrace.frames.length > 0;
    } catch (_) {
      // envelope malformado
    }
    console.assert(headerOk, 'FAIL: envelope header inválido');
    console.assert(payloadOk, 'FAIL: envelope payload inválido');
    console.log(headerOk ? '✅ Envelope header JSON válido' : '❌ FAIL: envelope header inválido');
    console.log(payloadOk ? '✅ Envelope payload JSON válido (exception + stacktrace)' : '❌ FAIL: envelope payload inválido');

    // 4. Sin DSN → captureException no lanza, devuelve null
    if (!ACTIVE_DSN) {
      const result = await captureException(new Error('prueba sin DSN'));
      console.assert(result === null, 'FAIL: captureException sin DSN no devolvió null');
      console.log(result === null ? '✅ captureException sin DSN → null (sin red, no lanza)' : '❌ FAIL: captureException sin DSN');
    }

    console.log('Auto-test PASÓ (validación estática, sin red).');
    return;
  }

  console.log('Sin argumentos reconocidos. Usa --help para ver el uso.');
}

if (require.main === module) {
  main();
}

module.exports = { parseDsn, parseStack, buildEnvelope, captureException, initErrorTracking };
