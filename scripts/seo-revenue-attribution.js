/**
 * seo-revenue-attribution.js — SEO → revenue attribution (task 2.6.2, R25)
 *
 * Hace visible la línea "Organic keyword X → $Y revenue" con DOS modos:
 *
 * 1. mode=ga4 (default): consulta GA4 Data API v1Beta (paquete `googleapis`,
 *    carga LAZY — regla no-new-deps: selftest/dry-run/CI no lo requieren) y
 *    agrega ingresos por sessionDefaultChannelGroup/sessionSource, más la
 *    dimensión de keyword best-effort (firstUserManualTerm/sessionManualTerm).
 *    Salida: tabla en consola + log JSON en logs/seo-revenue-attribution.json
 *    con filas {channel, source, keyword, revenue, transactions}.
 *
 *    ⚠️ LIMITACIÓN CONOCIDA: GA4 oculta la mayoría de keywords como
 *    "(not provided)" (búsqueda orgánica de Google no expone el término).
 *    Este script agrupa esos valores bajo la fila "(not provided)".
 *    El modo bigquery (export de GA4 a BigQuery) es el camino para
 *    atribución COMPLETA por keyword.
 *
 * 2. mode=bigquery: imprime un SQL listo para pegar en BigQuery Console
 *    (dataset de export GA4: events_*, event_name='purchase',
 *    traffic_source.medium/source, traffic_source.manual_term). El owner lo
 *    ejecuta en BigQuery y puede importar el resultado (CSV/Sheets).
 *
 * Credenciales: activación posterior del usuario — el modo ga4 en vivo
 * requiere GOOGLE_APPLICATION_CREDENTIALS + GA4_PROPERTY_ID (exit no-cero con
 * mensaje claro si faltan). --selftest funciona con datos de respuesta GA4
 * embebidos (sin red, exit 0).
 *
 * Uso:
 *   node scripts/seo-revenue-attribution.js               # modo ga4 (últimos 28 días)
 *   node scripts/seo-revenue-attribution.js --days 7      # Últimos N días
 *   node scripts/seo-revenue-attribution.js --mode bigquery  # Imprime SQL de BigQuery
 *   node scripts/seo-revenue-attribution.js --dry-run     # Sin POST al webhook
 *   node scripts/seo-revenue-attribution.js --selftest    # Verificación embebida (sin red)
 *
 * Variables de entorno:
 *   GOOGLE_APPLICATION_CREDENTIALS  — Ruta al JSON del Service Account (ADC de Google) (requerido en modo ga4 en vivo)
 *   GA4_PROPERTY_ID                 — ID de propiedad GA4 (número, ej: 123456789) (requerido en modo ga4 en vivo)
 *   SEO_REVENUE_MODE                — 'ga4' (default) o 'bigquery'
 *   SEO_REVENUE_DAYS                — Días hacia atrás a agregar (default: 28)
 *   SEO_REVENUE_WEBHOOK_URL         — Webhook opcional que recibe el resumen JSON
 *   SEO_REVENUE_WEBHOOK_SECRET      — Secreto HMAC opcional; cuando está seteado el POST
 *                                     lleva 'X-Webhook-Signature: sha256=<hex>' (HMAC-SHA256
 *                                     sobre el body, comparación timing-safe en el receptor —
 *                                     misma convención que scripts/webhook-receiver.js)
 *
 * Programación sugerida (cron, semanal — los datos de GA4 tardan ~1 día):
 *   0 7 * * 1 /usr/bin/node /path/to/scripts/seo-revenue-attribution.js >> /path/to/repo/logs/seo-revenue-cron.log 2>&1
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const assert = require('assert');
// googleapis se carga LAZY dentro de fetchGa4RevenueRows
// (regla no-new-deps: selftest/dry-run/CI no lo requieren)

// Cargar .env desde la raíz del proyecto (scripts/ → raíz = ..)
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

// Logger estructurado (patrón del repo: scripts/ga4-play-purchases.js)
function writeLog(level, context, args) {
  const message = args
    .map(a => (a && typeof a === 'object' ? JSON.stringify(a) : String(a)))
    .join(' ');
  const line = JSON.stringify({
    timestamp: new Date().toISOString(),
    level,
    context,
    message,
  });
  if (level === 'error') {
    console.error(line);
  } else {
    console.log(line);
  }
}

const logger = {
  info: (context, ...args) => writeLog('info', context, args),
  warn: (context, ...args) => writeLog('warn', context, args),
  error: (context, ...args) => writeLog('error', context, args),
};

// Configuración
const CONFIG = {
  mode: (process.env.SEO_REVENUE_MODE || 'ga4').toLowerCase(),
  ga4PropertyId: process.env.GA4_PROPERTY_ID,
  days: Number(process.env.SEO_REVENUE_DAYS || 28),
  webhookUrl: process.env.SEO_REVENUE_WEBHOOK_URL,
  webhookSecret: process.env.SEO_REVENUE_WEBHOOK_SECRET,
  dryRun: process.env.SEO_REVENUE_DRYRUN === 'true',
  logDir: path.join(__dirname, '..', 'logs'),
  logFile: path.join(__dirname, '..', 'logs', 'seo-revenue-attribution.json'),
};

// Conjuntos de dimensiones a intentar en orden (best-effort keyword):
// 1º firstUserManualTerm (keyword que trajo la visita), 2º sessionManualTerm,
// 3º sin keyword (solo canal + fuente). El primero que responda gana.
const DIMENSION_SETS = [
  ['sessionDefaultChannelGroup', 'sessionSource', 'firstUserManualTerm'],
  ['sessionDefaultChannelGroup', 'sessionSource', 'sessionManualTerm'],
  ['sessionDefaultChannelGroup', 'sessionSource'],
];

// GA4 agrupa keywords ausentes bajo placeholders; todos se normalizan a "(not provided)"
const NOT_PROVIDED = '(not provided)';
const KEYWORD_PLACEHOLDERS = new Set(['', '(not provided)', '(not set)', '(none)', '(direct)', 'reserved']);

function normalizeKeyword(value) {
  const v = String(value || '').trim().toLowerCase();
  return KEYWORD_PLACEHOLDERS.has(v) ? NOT_PROVIDED : String(value || '').trim();
}

function round2(n) {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

// Rango de fechas: últimos N días completos (fin = ayer; los datos de GA4 tardan ~1 día)
function computeDateRange(days) {
  const end = new Date();
  end.setUTCDate(end.getUTCDate() - 1);
  const start = new Date(end);
  start.setUTCDate(start.getUTCDate() - (Math.max(1, days) - 1));
  return {
    startDate: start.toISOString().split('T')[0],
    endDate: end.toISOString().split('T')[0],
  };
}

// Agregar filas crudas de runReport a {channel, source, keyword, revenue, transactions}
// (orden de metricValues: [totalRevenue, transactions] — mismo orden del requestBody)
function aggregateRows(rawRows, dimensions) {
  const dims = dimensions || [];
  const chIdx = dims.indexOf('sessionDefaultChannelGroup');
  const srcIdx = dims.indexOf('sessionSource');
  const kwIdx = dims.indexOf('firstUserManualTerm') !== -1
    ? dims.indexOf('firstUserManualTerm')
    : dims.indexOf('sessionManualTerm');
  const buckets = new Map();
  for (const row of rawRows || []) {
    const channel = chIdx >= 0 ? row.dimensionValues[chIdx].value : 'unknown';
    const source = srcIdx >= 0 ? row.dimensionValues[srcIdx].value : 'unknown';
    const keyword = normalizeKeyword(kwIdx >= 0 ? row.dimensionValues[kwIdx].value : '');
    const revenue = Number(row.metricValues[0]?.value || 0);
    const transactions = Number(row.metricValues[1]?.value || 0);
    const key = `${channel}\u0000${source}\u0000${keyword}`;
    const bucket = buckets.get(key) || { channel, source, keyword, revenue: 0, transactions: 0 };
    bucket.revenue = round2(bucket.revenue + revenue);
    bucket.transactions += transactions;
    buckets.set(key, bucket);
  }
  return [...buckets.values()].sort((a, b) => b.revenue - a.revenue);
}

// Resumen JSON (patrón build_payload de scripts/play-sales-report.py)
function buildPayload(rows, dryRun) {
  const range = computeDateRange(CONFIG.days);
  return {
    source: 'seo-revenue-attribution',
    timestamp: new Date().toISOString(),
    mode: 'ga4',
    date_range: { start: range.startDate, end: range.endDate },
    currency: 'USD', // las apps del repo se precian en USD
    total_revenue: round2(rows.reduce((s, r) => s + r.revenue, 0)),
    total_transactions: rows.reduce((s, r) => s + r.transactions, 0),
    rows: rows.map(r => ({
      channel: r.channel,
      source: r.source,
      keyword: r.keyword,
      revenue: r.revenue,
      transactions: r.transactions,
    })),
    dry_run: dryRun,
  };
}

// Firma HMAC-SHA256 en la convención del repo: 'sha256=<hex>'
function signPayload(body, secret) {
  return 'sha256=' + crypto.createHmac('sha256', secret).update(body).digest('hex');
}

// Comparación timing-safe (convención webhook-receiver.js: crypto.timingSafeEqual)
function verifySignature(body, secret, signature) {
  const expected = Buffer.from(signPayload(body, secret));
  const provided = Buffer.from(signature);
  if (provided.length !== expected.length) {
    return false;
  }
  return crypto.timingSafeEqual(provided, expected);
}

// POST del resumen JSON; añade X-Webhook-Signature cuando hay secreto
async function postWebhook(url, payload, secret) {
  const body = JSON.stringify(payload);
  const headers = {
    'Content-Type': 'application/json; charset=utf-8',
    'User-Agent': 'seo-revenue-attribution/1.0',
  };
  if (secret) {
    headers['X-Webhook-Signature'] = signPayload(body, secret);
  }
  const response = await fetch(url, { method: 'POST', headers, body });
  return response.status;
}

// Validar configuración crítica del modo ga4 en vivo
function validateConfig() {
  if (CONFIG.mode === 'bigquery') {
    return { ok: true, missing: [] }; // el modo bigquery no necesita credenciales
  }
  const missing = [];
  if (!CONFIG.ga4PropertyId) missing.push('GA4_PROPERTY_ID');
  if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) missing.push('GOOGLE_APPLICATION_CREDENTIALS');
  if (missing.length > 0) {
    logger.error('config', `❌ FALTAN VARIABLES DE ENTORNO REQUERIDAS: ${missing.join(', ')}`);
    logger.error('config', '📋 El modo ga4 en vivo requiere (activación posterior del usuario):');
    logger.error('config', '   GOOGLE_APPLICATION_CREDENTIALS — Ruta al JSON del Service Account (Google Cloud → IAM → Service Accounts)');
    logger.error('config', '   GA4_PROPERTY_ID — ID de propiedad GA4 (número, ej: 123456789; el SA necesita acceso de lectura a la propiedad)');
    logger.error('config', '   Configúralas en .env (ver .env.example) o usa --dry-run para probar sin credenciales.');
    return { ok: false, missing };
  }
  return { ok: true, missing: [] };
}

// Consultar GA4 Data API v1Beta (googleapis LAZY) — ingresos por canal/fuente/keyword
async function fetchGa4RevenueRows() {
  let google;
  try {
    ({ google } = require('googleapis')); // lazy
  } catch (err) {
    if (err.code === 'MODULE_NOT_FOUND' || err.message.includes('Cannot find module')) {
      logger.error('ga4', '📦 DEPENDENCIA FALTANTE: googleapis no está instalado.');
      logger.error('ga4', '   Ejecuta: npm install googleapis --save');
      logger.error('ga4', '   O añade "googleapis" a package.json dependencies');
    }
    throw err;
  }

  // ADC: GoogleAuth lee GOOGLE_APPLICATION_CREDENTIALS del entorno automáticamente
  const auth = new google.auth.GoogleAuth({
    scopes: ['https://www.googleapis.com/auth/analytics.readonly'],
  });
  const analyticsdata = google.analyticsdata({ version: 'v1beta', auth });
  const property = CONFIG.ga4PropertyId.startsWith('properties/')
    ? CONFIG.ga4PropertyId
    : `properties/${CONFIG.ga4PropertyId}`;
  const range = computeDateRange(CONFIG.days);

  let lastErr = null;
  for (const dimensions of DIMENSION_SETS) {
    try {
      logger.info('ga4', `🔍 Consultando GA4 Data API (${property}) ${range.startDate} → ${range.endDate} — dimensiones: ${dimensions.join(', ')}`);
      const response = await analyticsdata.properties.runReport({
        property,
        requestBody: {
          dateRanges: [{ startDate: range.startDate, endDate: range.endDate }],
          dimensions: dimensions.map(name => ({ name })),
          metrics: [{ name: 'totalRevenue' }, { name: 'transactions' }],
          orderBys: [{ metric: { metricName: 'totalRevenue' }, desc: true }],
          limit: '250', // top 250 tuplas por ingresos
        },
      });
      const rows = response.data.rows || [];
      const hasKeyword = dimensions.some(d => d.includes('ManualTerm'));
      logger.info('ga4', `📊 ${rows.length} filas recibidas (dimensión keyword: ${hasKeyword ? 'sí' : 'no disponible'})`);
      return { rows, dimensions };
    } catch (err) {
      lastErr = err;
      logger.warn('ga4', `⚠️ Dimensiones ${dimensions.join(', ')} fallaron: ${err.message}`);
    }
  }
  logger.error('ga4', '❌ Error consultando GA4 Data API:', lastErr?.message || 'sin respuesta');
  throw lastErr || new Error('GA4 Data API query failed');
}

// Escribir el resumen bajo logs/seo-revenue-attribution.json
// (NO llamarla writeLog: el helper del logger ya usa ese nombre)
function writeSummaryLog(payload) {
  try {
    fs.mkdirSync(CONFIG.logDir, { recursive: true });
    fs.writeFileSync(CONFIG.logFile, JSON.stringify(payload, null, 2) + '\n', 'utf8');
    return CONFIG.logFile;
  } catch (err) {
    logger.error('log', '❌ Error escribiendo el log de atribución:', err.message);
    return null;
  }
}

// SQL listo para BigQuery Console (export GA4: events_*, purchase, traffic_source.*)
function buildBigQuerySql(days) {
  const d = Math.max(1, Number(days || CONFIG.days || 28));
  return `-- ============================================================
-- SEO → revenue attribution (keyword level) — GA4 BigQuery export
-- Task 2.6.2 (R25): "Organic keyword X → $Y revenue"
--
-- Cómo ejecutarlo:
--   1. BigQuery Console → sustituye YOUR_GA4_PROJECT.analytics_XXXXXXXXX
--      por tu dataset de export GA4 (se llaman analytics_XXXXXXXXX).
--   2. Pega y ejecuta. El resultado se puede importar a Sheets/CSV.
--
-- Nota: la web de GA4 oculta la mayoría de keywords como "(not provided)";
-- el export de BigQuery es el camino para atribución COMPLETA por keyword.
-- Variante solo-orgánica: añade AND traffic_source.medium = 'organic' al WHERE.
-- ============================================================
SELECT
  traffic_source.source                                                    AS source,
  traffic_source.medium                                                    AS medium,
  COALESCE(NULLIF(TRIM(traffic_source.manual_term), ''), '(not provided)') AS keyword,
  COUNT(*)                                                                 AS purchases,
  ROUND(SUM(ecommerce.purchase_revenue_in_usd), 2)                         AS revenue_usd
FROM \`YOUR_GA4_PROJECT.analytics_XXXXXXXXX.events_*\`
WHERE _TABLE_SUFFIX BETWEEN FORMAT_DATE('%Y%m%d', DATE_SUB(CURRENT_DATE(), INTERVAL ${d} DAY))
                        AND FORMAT_DATE('%Y%m%d', CURRENT_DATE())
  AND event_name = 'purchase'
GROUP BY source, medium, keyword
ORDER BY revenue_usd DESC;
`;
}

// --- Datos embebidos para --selftest (sin llamadas de red) ---

// Respuesta GA4 runReport simulada (misma forma que response.data)
const SAMPLE_GA4_RESPONSE = {
  dimensionHeaders: [
    { name: 'sessionDefaultChannelGroup' },
    { name: 'sessionSource' },
    { name: 'firstUserManualTerm' },
  ],
  metricHeaders: [
    { name: 'totalRevenue', type: 'TYPE_CURRENCY' },
    { name: 'transactions', type: 'TYPE_INTEGER' },
  ],
  rowCount: 6,
  rows: [
    { dimensionValues: [{ value: 'Organic Search' }, { value: 'google' }, { value: 'tarot spells' }], metricValues: [{ value: '129.73' }, { value: '9' }] },
    { dimensionValues: [{ value: 'Organic Search' }, { value: 'google' }, { value: '(not provided)' }], metricValues: [{ value: '14.99' }, { value: '1' }] },
    { dimensionValues: [{ value: 'Organic Search' }, { value: 'google' }, { value: '(not provided)' }], metricValues: [{ value: '3.50' }, { value: '1' }] },
    { dimensionValues: [{ value: 'Organic Search' }, { value: 'bing' }, { value: '(not provided)' }], metricValues: [{ value: '23.98' }, { value: '2' }] },
    { dimensionValues: [{ value: 'Direct' }, { value: '(direct)' }, { value: '(not provided)' }], metricValues: [{ value: '44.97' }, { value: '3' }] },
    { dimensionValues: [{ value: 'Paid Search' }, { value: 'google' }, { value: 'chaos sigil generator' }], metricValues: [{ value: '7.98' }, { value: '2' }] },
  ],
};

function cents(n) {
  return Math.round(n * 100);
}

// Auto-test: verificar agregación + payload + HMAC + SQL sobre datos embebidos (sin red)
function runSelfTest() {
  logger.info('selftest', '🧪 Iniciando auto-test de seo-revenue-attribution (datos embebidos, sin red)...');

  try {
    // 1. Normalización de keyword (placeholders de GA4 → "(not provided)")
    assert.strictEqual(normalizeKeyword('(not provided)'), '(not provided)');
    assert.strictEqual(normalizeKeyword('(NOT SET)'), '(not provided)');
    assert.strictEqual(normalizeKeyword(''), '(not provided)');
    assert.strictEqual(normalizeKeyword('(none)'), '(not provided)');
    assert.strictEqual(normalizeKeyword('reserved'), '(not provided)');
    assert.strictEqual(normalizeKeyword('  tarot spells  '), 'tarot spells');
    assert.strictEqual(normalizeKeyword('chaos sigil generator'), 'chaos sigil generator');
    logger.info('selftest', '✅ PASS: normalización de keyword ((not provided)/(not set)/(none)/reserved)');

    // 2. Agregación de la respuesta GA4 embebida
    const dims = SAMPLE_GA4_RESPONSE.dimensionHeaders.map(h => h.name);
    const rows = aggregateRows(SAMPLE_GA4_RESPONSE.rows, dims);
    assert.strictEqual(rows.length, 5, `esperaba 5 tuplas agregadas, hay ${rows.length}`); // 2 filas (not provided) de google se fusionan

    const organic = rows.filter(r => r.channel === 'Organic Search');
    const direct = rows.filter(r => r.channel === 'Direct');
    assert.strictEqual(cents(organic.reduce((s, r) => s + r.revenue, 0)), 17220, `organic ${cents(organic.reduce((s, r) => s + r.revenue, 0)) / 100} != 172.20`);
    assert.strictEqual(cents(direct.reduce((s, r) => s + r.revenue, 0)), 4497, `direct != 44.97`);

    const notProvided = rows.filter(r => r.keyword === '(not provided)');
    assert.strictEqual(notProvided.length, 3, 'esperaba 3 filas "(not provided)" (google, bing, direct)');
    assert.strictEqual(cents(notProvided.reduce((s, r) => s + r.revenue, 0)), 8744, '(not provided) total != 87.44');

    const tarot = rows.find(r => r.keyword === 'tarot spells');
    assert.ok(tarot, 'fila "tarot spells" ausente');
    assert.strictEqual(cents(tarot.revenue), 12973);
    assert.strictEqual(tarot.transactions, 9);
    assert.strictEqual(rows[0].keyword, 'tarot spells', 'orden por ingresos desc: tarot spells debe ir primero');
    logger.info('selftest', '✅ PASS: agregación GA4 (organic 172.20 vs direct 44.97, "(not provided)" agrupado, orden desc)');

    // 3. Payload build (filas {channel, source, keyword, revenue, transactions})
    const payload = buildPayload(rows, true);
    assert.strictEqual(payload.source, 'seo-revenue-attribution');
    assert.strictEqual(payload.mode, 'ga4');
    assert.strictEqual(payload.currency, 'USD');
    assert.strictEqual(payload.dry_run, true);
    assert.strictEqual(cents(payload.total_revenue), 22515, `total_revenue != 225.15`);
    assert.strictEqual(payload.total_transactions, 18);
    assert.strictEqual(payload.rows.length, 5);
    for (const r of payload.rows) {
      assert.ok('channel' in r && 'source' in r && 'keyword' in r && 'revenue' in r, 'fila sin forma {channel, source, keyword, revenue}');
    }
    logger.info('selftest', '✅ PASS: payload build (total 225.15, 18 transacciones, forma de filas correcta)');

    // 4. HMAC round-trip (timing-safe compare, convención webhook-receiver.js)
    const body = JSON.stringify(payload);
    const testSecret = 'selftest_secret';
    const signature = signPayload(body, testSecret);
    assert.ok(signature.startsWith('sha256='));
    assert.strictEqual(verifySignature(body, testSecret, signature), true);
    assert.strictEqual(verifySignature(body, 'wrong_secret', signature), false);
    assert.strictEqual(verifySignature(body + ' ', testSecret, signature), false);
    logger.info('selftest', '✅ PASS: HMAC round-trip (sha256=<hex>, timing-safe compare)');

    // 5. SQL de BigQuery (esquema del export GA4)
    const sql = buildBigQuerySql(28);
    assert.ok(sql.includes('events_*'), 'SQL sin events_*');
    assert.ok(sql.includes("event_name = 'purchase'"), "SQL sin event_name = 'purchase'");
    assert.ok(sql.includes('traffic_source.manual_term'), 'SQL sin traffic_source.manual_term');
    assert.ok(sql.includes('traffic_source.medium'), 'SQL sin traffic_source.medium');
    assert.ok(sql.includes('traffic_source.source'), 'SQL sin traffic_source.source');
    assert.ok(sql.includes('INTERVAL 28 DAY'), 'SQL sin INTERVAL 28 DAY');
    assert.ok(buildBigQuerySql(7).includes('INTERVAL 7 DAY'), '--days no llega al SQL');
    logger.info('selftest', '✅ PASS: SQL de BigQuery (events_*, purchase, traffic_source.*, INTERVAL parametrizado)');

    logger.info('selftest', '✅ Auto-test de seo-revenue-attribution PASÓ (datos embebidos, sin red)');
    logger.info('selftest', '📋 Para el modo ga4 en vivo: configura GOOGLE_APPLICATION_CREDENTIALS + GA4_PROPERTY_ID');
    process.exit(0);
  } catch (err) {
    logger.error('selftest', '❌ Auto-test FALLÓ:', err.message);
    process.exit(1);
  }
}

// Parsear argumentos CLI
function parseArgs() {
  const args = process.argv.slice(2);
  const parsed = {
    mode: CONFIG.mode,
    days: CONFIG.days,
    dryRun: CONFIG.dryRun,
    selftest: false,
    help: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === '--mode' && i + 1 < args.length) {
      const m = String(args[++i]).toLowerCase();
      if (m !== 'ga4' && m !== 'bigquery') {
        logger.error('cli', `❌ Modo inválido: ${args[i]} (usa ga4|bigquery)`);
        process.exit(1);
      }
      parsed.mode = m;
    } else if (arg === '--days' && i + 1 < args.length) {
      parsed.days = Number(args[++i]);
      if (!Number.isFinite(parsed.days) || parsed.days < 1) {
        logger.error('cli', `❌ Días inválidos: ${args[i]}`);
        process.exit(1);
      }
    } else if (arg === '--dry-run' || arg === '--dryrun') {
      parsed.dryRun = true;
    } else if (arg === '--selftest') {
      parsed.selftest = true;
    } else if (arg === '--help' || arg === '-h') {
      parsed.help = true;
    }
  }

  return parsed;
}

// Ayuda
function printHelp() {
  console.log(`
Uso: node scripts/seo-revenue-attribution.js [opciones]

Modos:
  ga4 (default)      Consulta GA4 Data API v1Beta → ingresos por canal/fuente/keyword
  bigquery           Imprime SQL listo para BigQuery Console (export GA4, atribución completa por keyword)

Opciones:
  --mode ga4|bigquery  Selecciona el modo (default: ga4, o SEO_REVENUE_MODE)
  --days N             Días hacia atrás a agregar (default: 28)
  --dry-run            Construye el resumen pero omite el POST al webhook
  --selftest           Verificación con datos embebidos (sin red, sin credenciales)
  --help, -h           Muestra esta ayuda

Variables de entorno:
  GOOGLE_APPLICATION_CREDENTIALS  — Ruta al JSON del Service Account (requerido en modo ga4 en vivo)
  GA4_PROPERTY_ID                 — ID de propiedad GA4, número (requerido en modo ga4 en vivo)
  SEO_REVENUE_MODE                — 'ga4' (default) o 'bigquery'
  SEO_REVENUE_DAYS                — Días hacia atrás (default: 28)
  SEO_REVENUE_WEBHOOK_URL         — Webhook opcional que recibe el resumen JSON
  SEO_REVENUE_WEBHOOK_SECRET      — Secreto HMAC opcional (X-Webhook-Signature: sha256=<hex)

⚠️ LIMITACIÓN: GA4 oculta la mayoría de keywords como "(not provided)" — este script
   las agrupa bajo esa fila. Para atribución COMPLETA por keyword usa --mode bigquery
   y ejecuta el SQL en BigQuery Console (export GA4).
`);
}

// Punto de entrada principal
async function main() {
  const args = parseArgs();
  CONFIG.mode = args.mode;
  CONFIG.days = args.days;
  CONFIG.dryRun = args.dryRun;

  if (args.help) {
    printHelp();
    process.exit(0);
  }

  if (args.selftest) {
    runSelfTest();
    return;
  }

  // Modo bigquery: sin red, sin credenciales — imprime el SQL y termina
  if (CONFIG.mode === 'bigquery') {
    console.log(buildBigQuerySql(CONFIG.days));
    process.exit(0);
  }

  // Modo ga4: validar credenciales (exit no-cero con mensaje claro si faltan)
  const validation = validateConfig();
  if (!validation.ok) {
    if (!CONFIG.dryRun) {
      process.exit(1);
    }
    logger.warn('config', '⚠️ Modo dry-run activo — continuando sin credenciales (resumen vacío)');
  }

  // Consultar GA4 (en dry-run con credenciales la consulta es read-only; sin credenciales, resumen vacío)
  let rows = [];
  if (validation.ok) {
    const result = await fetchGa4RevenueRows();
    rows = aggregateRows(result.rows, result.dimensions);
  }

  const payload = buildPayload(rows, CONFIG.dryRun);

  // Tabla en consola
  console.table(rows.map(r => ({
    channel: r.channel,
    source: r.source,
    keyword: r.keyword,
    revenue: r.revenue,
    transactions: r.transactions,
  })));

  // Log JSON bajo logs/
  const logPath = writeSummaryLog(payload);
  if (logPath) {
    logger.info('log', `📝 Resumen escrito: ${logPath}`);
  }

  if (CONFIG.dryRun) {
    console.log('DRY-RUN: resumen construido; POST omitido.');
    return;
  }

  // POST opcional del resumen al webhook (HMAC firmado si hay secreto)
  if (CONFIG.webhookUrl) {
    const status = await postWebhook(CONFIG.webhookUrl, payload, CONFIG.webhookSecret);
    logger.info('webhook', `✅ POST a ${CONFIG.webhookUrl} (HTTP ${status})${CONFIG.webhookSecret ? ' [HMAC firmado]' : ''}`);
  } else {
    logger.info('webhook', 'ℹ️ SEO_REVENUE_WEBHOOK_URL no configurado — POST omitido');
  }

  logger.info('main', '🏁 Proceso completado');
}

if (require.main === module) {
  main().catch(err => {
    logger.error('main', '❌ Error fatal:', err.message);
    process.exit(1);
  });
}

module.exports = {
  aggregateRows,
  normalizeKeyword,
  buildPayload,
  buildBigQuerySql,
  signPayload,
  verifySignature,
  computeDateRange,
  validateConfig,
  fetchGa4RevenueRows,
  writeSummaryLog,
  runSelfTest,
  parseArgs,
  CONFIG,
  DIMENSION_SETS,
  NOT_PROVIDED,
  SAMPLE_GA4_RESPONSE,
};
