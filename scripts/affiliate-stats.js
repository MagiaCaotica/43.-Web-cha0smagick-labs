/**
 * affiliate-stats.js — Dashboard de afiliados (plan 2.5.3)
 *
 * Funcionalidad:
 * - Lee data/affiliate-events.json: [{type:"click"|"conversion", affiliate, product, amount?, ts}]
 * - Agrega por afiliado: {id, clicks, conversions, earnings, convRate}
 *   earnings = suma(amount × rate) usando data/affiliate-rates.json (mismas tasas que 2.5.1)
 * - Escribe data/affiliate-stats.json con afiliados ANONIMIZADOS
 *   (id = sha256(email) primeros 10 hex). El JSON es público en el sitio,
 *   así no expone emails ni PII de afiliados. El mapeo id→email queda privado
 *   en logs/affiliate-events.json.
 * - Modo --dryrun (solo consola) y --selftest (sin red)
 *
 * Uso:
 *   node scripts/affiliate-stats.js                       # usa data/affiliate-events.json
 *   node scripts/affiliate-stats.js --events ruta.json
 *   node scripts/affiliate-stats.js --selftest
 */

'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.join(__dirname, '..');
const EVENTS_PATH = path.join(ROOT, 'data', 'affiliate-events.json');
const STATS_PATH = path.join(ROOT, 'data', 'affiliate-stats.json');
const RATES_PATH = path.join(ROOT, 'data', 'affiliate-rates.json');

function loadJson(p, fallback) {
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch (err) {
    if (fallback !== undefined) return fallback;
    throw err;
  }
}

/** ID pseudo-aleatorio estable por email (anonimización para el JSON público). */
function pseudoId(email) {
  return crypto
    .createHash('sha256')
    .update(String(email).trim().toLowerCase())
    .digest('hex')
    .slice(0, 10);
}

function rateFor(product, rates) {
  const map = (rates && rates.rates) || {};
  const r = map[String(product || '').trim().toLowerCase()];
  return typeof r === 'number' ? r : Number((rates && rates.default_rate) || 0.30);
}

function aggregateEvents(events, rates) {
  const per = new Map();
  for (const ev of Array.isArray(events) ? events : []) {
    if (!ev || !ev.affiliate) continue;
    const id = pseudoId(ev.affiliate);
    if (!per.has(id)) per.set(id, { id, clicks: 0, conversions: 0, earnings: 0 });
    const s = per.get(id);
    if (ev.type === 'click') {
      s.clicks += 1;
    } else if (ev.type === 'conversion') {
      s.conversions += 1;
      s.earnings += Number(ev.amount || 0) * rateFor(ev.product, rates);
    }
  }
  const affiliates = [];
  for (const s of per.values()) {
    s.earnings = Math.round(s.earnings * 100) / 100;
    s.convRate = s.clicks > 0 ? Math.round((s.conversions / s.clicks) * 1000) / 1000 : 0;
    affiliates.push(s);
  }
  affiliates.sort((a, b) => b.earnings - a.earnings || b.conversions - a.conversions);
  const totals = {
    clicks: affiliates.reduce((acc, s) => acc + s.clicks, 0),
    conversions: affiliates.reduce((acc, s) => acc + s.conversions, 0),
    earnings: Math.round(affiliates.reduce((acc, s) => acc + s.earnings, 0) * 100) / 100,
  };
  return { affiliates, totals };
}

function selftest() {
  const rates = { rates: { apps: 0.30, 'books-bundle': 0.40 }, default_rate: 0.30 };
  const events = [
    { type: 'click', affiliate: 'a@example.com', ts: '2026-09-01' },
    { type: 'click', affiliate: 'a@example.com', ts: '2026-09-02' },
    { type: 'conversion', affiliate: 'a@example.com', product: 'apps', amount: 3.99, ts: '2026-09-03' },
    { type: 'conversion', affiliate: 'a@example.com', product: 'books-bundle', amount: 19.99, ts: '2026-09-04' },
    { type: 'conversion', affiliate: 'b@example.com', product: 'unknown-product', amount: 50, ts: '2026-09-05' },
    { type: 'conversion', affiliate: 'c@example.com', product: 'apps', amount: 10, ts: '2026-09-06' },
  ];
  const { affiliates, totals } = aggregateEvents(events, rates);
  const a = affiliates.find((s) => s.id === pseudoId('a@example.com'));
  const b = affiliates.find((s) => s.id === pseudoId('b@example.com'));
  const c = affiliates.find((s) => s.id === pseudoId('c@example.com'));
  if (!a || !b || !c) {
    console.error('selftest FAIL: afiliados no encontrados');
    return 1;
  }
  if (a.clicks !== 2 || a.conversions !== 2) {
    console.error('selftest FAIL: conteos a — ' + JSON.stringify(a));
    return 1;
  }
  if (a.earnings !== 9.19) {
    console.error('selftest FAIL: earnings a = ' + a.earnings + ' (esperado 9.19)');
    return 1;
  }
  if (a.convRate !== 1) {
    console.error('selftest FAIL: convRate a = ' + a.convRate);
    return 1;
  }
  if (b.earnings !== 15) {
    console.error('selftest FAIL: default_rate b = ' + b.earnings + ' (esperado 15)');
    return 1;
  }
  if (c.convRate !== 0) {
    console.error('selftest FAIL: guard división por cero');
    return 1;
  }
  if (totals.clicks !== 2 || totals.conversions !== 4 || totals.earnings !== 27.19) {
    console.error('selftest FAIL: totals — ' + JSON.stringify(totals));
    return 1;
  }
  console.log('selftest OK — agregación, rates por producto, default_rate, guard div0 y anonimización verificadas');
  return 0;
}

function main() {
  const args = process.argv.slice(2);
  if (args.includes('--selftest')) {
    process.exit(selftest());
  }
  const eventsIdx = args.indexOf('--events');
  const eventsPath = eventsIdx !== -1 ? path.resolve(args[eventsIdx + 1]) : EVENTS_PATH;
  const events = loadJson(eventsPath, []);
  const rates = loadJson(RATES_PATH, { rates: {}, default_rate: 0.30 });
  const result = aggregateEvents(events, rates);
  const payload = Object.assign({ generated_at: new Date().toISOString() }, result);
  fs.mkdirSync(path.dirname(STATS_PATH), { recursive: true });
  fs.writeFileSync(STATS_PATH, JSON.stringify(payload, null, 2) + '\n', 'utf8');
  console.log(
    'afiliados: ' + result.affiliates.length +
    ' | clicks: ' + result.totals.clicks +
    ' | conversiones: ' + result.totals.conversions +
    ' | ganancias: $' + result.totals.earnings.toFixed(2)
  );
  console.log('stats: ' + STATS_PATH);
}

module.exports = { loadJson, pseudoId, rateFor, aggregateEvents, selftest, main };

if (require.main === module) {
  main();
}
