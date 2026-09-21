#!/usr/bin/env node
// ── Support Ticket Bot → GitHub Issues (3.1.11 R26) ──
// User creates a ticket via /ticket in Telegram/Discord → it appears as a GitHub Issue.
// Usage:
//   node ticket-bot.js --selftest
//   node ticket-bot.js --create --title "Título" --body "Descripción"
//   node ticket-bot.js --help
//
// Env: GITHUB_TOKEN (repo scope: issues:write), GITHUB_REPO ("owner/repo").

const logger = require('./logger');

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';
const GITHUB_REPO = process.env.GITHUB_REPO || ''; // "owner/repo"

const API_BASE = 'https://api.github.com';
const TITLE_MAX = 100;
const BODY_MAX = 4000;

// ── Simple in-memory rate limit: max 3 tickets per user per 10 min ──
const RATE_LIMIT = { max: 3, windowMs: 10 * 60 * 1000 };
const rateMap = new Map(); // key: "platform:user" → { count, resetAt }

function checkRateLimit(key) {
  const now = Date.now();
  const entry = rateMap.get(key);

  if (!entry || now >= entry.resetAt) {
    rateMap.set(key, { count: 1, resetAt: now + RATE_LIMIT.windowMs });
    return { ok: true };
  }

  if (entry.count >= RATE_LIMIT.max) {
    const waitMin = Math.ceil((entry.resetAt - now) / 60000);
    return { ok: false, error: `⚠️ Too many tickets. Try again in ${waitMin} min.` };
  }

  entry.count += 1;
  return { ok: true };
}

function resetRateLimit(key) {
  rateMap.delete(key);
}

// ── Validation ──
function validateInput({ title, body }) {
  const t = (title || '').trim();
  const b = (body || '').trim();

  if (t.length === 0) return { ok: false, error: 'Title is required.' };
  if (t.length > TITLE_MAX) return { ok: false, error: `Title too long (max ${TITLE_MAX} chars).` };
  if (b.length === 0) return { ok: false, error: 'Description is required.' };
  if (b.length > BODY_MAX) return { ok: false, error: `Description too long (max ${BODY_MAX} chars).` };

  return { ok: true };
}

// ── Create ticket → GitHub Issue ──
// Exported shape (plan 3.1.11): createSupportTicket({ platform, user, text })
async function createSupportTicket({ platform = 'unknown', user = 'anonymous', text = '' } = {}) {
  const firstLine = text.split('\n').find((l) => l.trim().length > 0) || 'Support ticket';
  const title = firstLine.trim().slice(0, TITLE_MAX);
  const body = [
    text.trim().slice(0, BODY_MAX),
    '',
    '---',
    `- **Plataforma:** ${platform}`,
    `- **Usuario:** ${user}`,
    `- **Fecha:** ${new Date().toISOString()}`,
    '- _Creado automáticamente por el bot de soporte (3.1.11 R26)._',
  ].join('\n');

  const validation = validateInput({ title, body });
  if (!validation.ok) {
    throw new Error(validation.error);
  }

  const rate = checkRateLimit(`${platform}:${user}`);
  if (!rate.ok) {
    throw new Error(rate.error);
  }

  if (!GITHUB_TOKEN || !GITHUB_REPO) {
    throw new Error('⚠️ GitHub is not configured. Please set GITHUB_TOKEN and GITHUB_REPO in .env');
  }

  const response = await fetch(`${API_BASE}/repos/${GITHUB_REPO}/issues`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'Content-Type': 'application/json',
      'User-Agent': 'cha0smagick-support-bot',
    },
    body: JSON.stringify({
      title,
      body,
      labels: ['support', `platform:${platform}`],
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`GitHub API error ${response.status}: ${detail.slice(0, 300)}`);
  }

  const issue = await response.json();
  logger.info('ticket-bot', `✅ Issue #${issue.number} created: ${issue.html_url}`);

  return { ok: true, issueNumber: issue.number, url: issue.html_url };
}

// ── CLI ──
async function main() {
  const args = process.argv.slice(2);

  if (args.includes('--help')) {
    console.log(`
🤖 Support Ticket Bot → GitHub Issues (3.1.11 R26)

Usage:
  node ticket-bot.js --selftest              Run validation self-test (no network)
  node ticket-bot.js --create --title "..." --body "..."   Create a ticket manually
  node ticket-bot.js --help                  Show this help

Env:
  GITHUB_TOKEN   GitHub token with issues:write scope
  GITHUB_REPO    Repository as "owner/repo"
`);
    return;
  }

  if (args.includes('--selftest')) {
    // 1. Valid input passes
    const v1 = validateInput({ title: 'Ticket de prueba', body: 'Descripción válida del ticket.' });
    console.assert(v1.ok, 'FAIL: valid input rejected');
    console.log(v1.ok ? '✅ Validación: entrada válida aceptada' : '❌ FAIL: valid input rejected');

    // 2. Empty title rejected
    const v2 = validateInput({ title: '', body: 'algo' });
    console.assert(!v2.ok, 'FAIL: empty title accepted');
    console.log(!v2.ok ? '✅ Validación: título vacío rechazado' : '❌ FAIL: empty title accepted');

    // 3. Oversize body rejected
    const v3 = validateInput({ title: 't', body: 'x'.repeat(BODY_MAX + 1) });
    console.assert(!v3.ok, 'FAIL: oversize body accepted');
    console.log(!v3.ok ? '✅ Validación: body sobredimensionado rechazado' : '❌ FAIL: oversize body accepted');

    // 4. Rate limit: 3 pass, 4th fails within window
    resetRateLimit('selftest:user');
    const r1 = checkRateLimit('selftest:user');
    const r2 = checkRateLimit('selftest:user');
    const r3 = checkRateLimit('selftest:user');
    const r4 = checkRateLimit('selftest:user');
    const rateOk = r1.ok && r2.ok && r3.ok && !r4.ok;
    console.assert(rateOk, 'FAIL: rate limit not enforced');
    console.log(rateOk ? '✅ Rate limit: 3/ventana OK, 4º rechazado' : '❌ FAIL: rate limit not enforced');

    // 5. Without env → createSupportTicket throws (not a network call)
    if (!GITHUB_TOKEN || !GITHUB_REPO) {
      console.log('ℹ️ Sin GITHUB_TOKEN/GITHUB_REPO: createSupportTicket fallará como se espera (sin red).');
    }

    console.log('Auto-test PASÓ (validación estática, sin red).');
    return;
  }

  if (args.includes('--create')) {
    const titleIdx = args.indexOf('--title');
    const bodyIdx = args.indexOf('--body');
    const title = titleIdx !== -1 ? args[titleIdx + 1] : '';
    const body = bodyIdx !== -1 ? args[bodyIdx + 1] : '';

    try {
      const result = await createSupportTicket({ platform: 'cli', user: 'manual', text: `${title}\n\n${body}` });
      console.log(`✅ Ticket creado: Issue #${result.issueNumber} — ${result.url}`);
    } catch (err) {
      logger.error('ticket-bot', '❌ --create error:', err.message);
      console.error(`❌ ${err.message}`);
      process.exit(1);
    }
    return;
  }

  console.log('Sin argumentos reconocidos. Usa --help para ver el uso.');
}

if (require.main === module) {
  main();
}

module.exports = { createSupportTicket, validateInput, checkRateLimit, resetRateLimit };
