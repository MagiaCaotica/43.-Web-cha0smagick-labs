'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

require('dotenv').config({ path: path.join(process.cwd(), '.env') });

const ROOT = process.cwd();
const NODE_BIN = process.env.NODE_BIN || 'node';
const PYTHON_BIN = process.env.PYTHON_BIN || 'python';
const LIVE_FLAGS = new Set(['--live', '--run-live']);
const SAVE_FLAGS = new Set(['--save']);
const SKIP_SMOKE_FLAGS = new Set(['--skip-smoke']);

function hasFlag(flag) {
  return process.argv.includes(flag);
}

function valueAfter(flag, fallback) {
  const index = process.argv.indexOf(flag);
  if (index === -1 || !process.argv[index + 1]) return fallback;
  return process.argv[index + 1];
}

function numberOption(name, fallback, min, max) {
  const raw = valueAfter(name, String(fallback));
  const value = Number.parseInt(raw, 10);
  if (!Number.isFinite(value)) return fallback;
  return Math.min(max, Math.max(min, value));
}

function boolDryRun() {
  if (hasFlag('--live') || hasFlag('--run-live')) return false;
  if ((process.env.ANALYTICS_DRYRUN || '').toLowerCase() === 'false') return false;
  return true;
}

function requiredLiveVariables() {
  return [
    'GA4_MEASUREMENT_ID',
    'GA4_MP_API_SECRET',
    'GOOGLE_PLAY_SERVICE_ACCOUNT_JSON',
    'GOOGLE_PLAY_PACKAGE_NAME',
  ];
}

function missingLiveVariables() {
  return requiredLiveVariables().filter((name) => !process.env[name]);
}

function redact(text) {
  return String(text || '')
    .replace(/AIza[0-9A-Za-z_-]{20,}/g, '[REDACTED_GOOGLE_KEY]')
    .replace(/(secret|token|authorization|api[_-]?key)\s*[:=]\s*\S+/gi, '$1=[REDACTED]')
    .replace(/[A-Za-z0-9+/]{80,}={0,2}/g, '[REDACTED_LONG_VALUE]')
    .slice(0, 400);
}

function runCommand(name, command, args) {
  const started = Date.now();
  const result = spawnSync(command, args, {
    cwd: ROOT,
    encoding: 'utf8',
    timeout: 180000,
    env: process.env,
    windowsHide: true,
  });
  const error = result.error ? redact(result.error.message) : '';
  const stdout = redact(result.stdout || '').trim();
  const stderr = redact(result.stderr || '').trim();
  const record = {
    name,
    command,
    args,
    exitCode: result.status === null ? null : result.status,
    signal: result.signal || null,
    durationMs: Date.now() - started,
    ok: !result.error && result.status === 0,
  };
  if (stdout) record.stdout = stdout;
  if (stderr) record.stderr = stderr;
  if (error) record.error = error;
  return record;
}

function main() {
  const dryRun = boolDryRun();
  const missing = missingLiveVariables();
  if (!dryRun && missing.length > 0) {
    const output = {
      mode: 'refused',
      reason: 'Live mode requires environment variables; no request was sent.',
      missingVariables: missing,
      dryRun,
    };
    console.log(JSON.stringify(output, null, 2));
    process.exitCode = 2;
    return;
  }

  const days = numberOption('--days', 28, 1, 365);
  const date = valueAfter('--date', '');
  const save = hasFlag('--save');
  const results = [];
  const common = [];

  results.push(runCommand('analytics-health', NODE_BIN, [
    path.join(ROOT, 'scripts', 'analytics-health.js'),
    ...(save ? ['--save'] : []),
  ]));

  if (!SKIP_SMOKE_FLAGS.has(process.argv[process.argv.length - 1]) && !hasFlag('--skip-smoke')) {
    const smoke = runCommand('public-live-smoke', NODE_BIN, [
      path.join(ROOT, 'scripts', 'analytics-live-smoke.js'),
      `--url=${process.env.PUBLIC_SITE_URL || 'https://cha0smagicklabs.com'}`,
  ]);
  if (dryRun && !smoke.ok) {
      smoke.warning = 'public-live-smoke unavailable in dry-run';
      smoke.skipped = true;
      smoke.ok = true;
    }
    results.push(smoke);
  }

  const playArgs = [
    path.join(ROOT, 'scripts', 'ga4-play-purchases.js'),
    `--days=${days}`,
    ...(date ? [`--date=${date}`] : []),
    ...(dryRun ? ['--dryrun'] : ['--save']),
  ];
  results.push(runCommand('google-play-to-ga4', NODE_BIN, playArgs));

  results.push(runCommand('play-sales-csv', PYTHON_BIN, [
    path.join(ROOT, 'scripts', 'play-sales-report.py'),
    ...(dryRun ? ['--dry-run'] : ['--save']),
  ]));

  results.push(runCommand('seo-revenue-attribution', NODE_BIN, [
    path.join(ROOT, 'scripts', 'seo-revenue-attribution.js'),
    '--mode=ga4',
    `--days=${days}`,
    ...(dryRun ? ['--dry-run'] : []),
  ]));

  // Single source of truth: the consent model is declared in
  // data/analytics-events.json and enforced by js/analytics-bridge.js.
  // Restating it here only created a third place to drift.
  let consentDefault = 'unknown';
  try {
    consentDefault = JSON.parse(
      fs.readFileSync(path.join(ROOT, 'data', 'analytics-events.json'), 'utf8')
    ).privacy.default;
  } catch (_) {
    // Contract unreadable; say so rather than assert a model we cannot verify.
  }

  const output = {
    mode: dryRun ? 'dry-run' : 'live',
    generatedAt: new Date().toISOString(),
    publicSite: process.env.PUBLIC_SITE_URL || 'https://cha0smagicklabs.com',
    sourceOfTruth: 'existing analytics CLI contracts; no duplicate data source',
    consentDefault,
    results,
    ok: results.every((item) => item.ok),
  };

  if (save) {
    const logDir = path.join(ROOT, 'logs');
    fs.mkdirSync(logDir, { recursive: true });
    const filename = `analytics-daily-${new Date().toISOString().slice(0, 10)}.json`;
    fs.writeFileSync(path.join(logDir, filename), `${JSON.stringify(output, null, 2)}\n`, 'utf8');
    output.savedTo = path.join('logs', filename);
  }

  console.log(JSON.stringify(output, null, 2));
  process.exitCode = output.ok ? 0 : 1;
}

main();
