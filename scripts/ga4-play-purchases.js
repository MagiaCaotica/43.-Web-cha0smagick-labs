/**
 * ga4-play-purchases.js — Google Play Developer API → GA4 Measurement Protocol
 * 
 * Script diario (cron) que:
 * 1. Autentica con Google Play Developer API usando Service Account
 * 2. Obtiene compras/pedidos del día anterior (o rango configurable)
 * 3. Reenvía cada compra como evento 'purchase' a GA4 Measurement Protocol
 * 
 * Requisitos previos:
 * - Google Cloud Project con Android Publisher API habilitada
 * - Service Account con rol "Viewer" (o "Release Manager") en Play Console
 * - JSON de credenciales del Service Account
 * 
 * Uso:
 *   node scripts/ga4-play-purchases.js              # Ejecución normal (ayer)
 *   node scripts/ga4-play-purchases.js --date 2026-09-15  # Fecha específica
 *   node scripts/ga4-play-purchases.js --days 7     # Últimos N días
 *   node scripts/ga4-play-purchases.js --dryrun     # Modo simulación
 *   node scripts/ga4-play-purchases.js --selftest   # Validar configuración
 * 
 * Variables de entorno:
 *   GOOGLE_PLAY_SERVICE_ACCOUNT_JSON  — Ruta al archivo JSON O JSON string completo (requerido)
 *   GA4_MEASUREMENT_ID                — ID de medición GA4 (G-XXXXXXXXXX) (requerido)
 *   GA4_MP_API_SECRET                 — API Secret GA4 Measurement Protocol (requerido)
 *   GOOGLE_PLAY_PACKAGE_NAME          — Package name de la app (ej: com.cha0smagick.noctem) (requerido)
 *   PLAY_FETCH_DAYS                   — Días hacia atrás a consultar (default: 1 = ayer)
 *   PLAY_DRYRUN                       — 'true' para modo simulación
 * 
 * Programación sugerida (cron):
 *   0 3 * * * /usr/bin/node /path/to/scripts/ga4-play-purchases.js >> /var/log/ga4-play-sync.log 2>&1
 *   (Ejecuta a las 03:00 UTC diario para compras del día anterior)
 */

const fs = require('fs');
const path = require('path');
// googleapis se carga LAZY dentro de authenticatePlayAPI/fetchPlayPurchases
// (regla no-new-deps: selftest/dry-run/CI no lo requieren)

// Cargar .env desde la raíz del proyecto
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });

// Logger estructurado (patrón del repo)
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
  serviceAccountJson: process.env.GOOGLE_PLAY_SERVICE_ACCOUNT_JSON,
  ga4MeasurementId: process.env.GA4_MEASUREMENT_ID,
  ga4MpApiSecret: process.env.GA4_MP_API_SECRET,
  packageName: process.env.GOOGLE_PLAY_PACKAGE_NAME,
  fetchDays: Number(process.env.PLAY_FETCH_DAYS || 1),
  dryRun: process.env.PLAY_DRYRUN === 'true' || process.argv.includes('--dryrun'),
  logDir: path.join(__dirname, '..', '..', 'logs'),
  logFile: path.join(__dirname, '..', '..', 'logs', 'ga4-play-sync.jsonl'),
};

// Validar configuración crítica
function validateConfig() {
  const missing = [];
  
  if (!CONFIG.serviceAccountJson) {
    missing.push('GOOGLE_PLAY_SERVICE_ACCOUNT_JSON');
  }
  
  if (!CONFIG.ga4MeasurementId) {
    missing.push('GA4_MEASUREMENT_ID');
  }
  
  if (!CONFIG.ga4MpApiSecret) {
    missing.push('GA4_MP_API_SECRET');
  }
  
  if (!CONFIG.packageName) {
    missing.push('GOOGLE_PLAY_PACKAGE_NAME');
  }
  
  if (missing.length > 0) {
    const msg = `❌ FALTAN VARIABLES DE ENTORNO REQUERIDAS: ${missing.join(', ')}`;
    logger.error('config', msg);
    logger.error('config', '📋 Configura las siguientes variables en .env o en el entorno de ejecución:');
    logger.error('config', '   GOOGLE_PLAY_SERVICE_ACCOUNT_JSON — Ruta al archivo JSON del Service Account O el JSON completo como string');
    logger.error('config', '   GA4_MEASUREMENT_ID — ID de medición GA4 (formato G-XXXXXXXXXX)');
    logger.error('config', '   GA4_MP_API_SECRET — API Secret de GA4 Measurement Protocol');
    logger.error('config', '   GOOGLE_PLAY_PACKAGE_NAME — Package name de tu app en Play Console (ej: com.cha0smagick.noctem)');
    logger.error('config', '');
    logger.error('config', '🔧 Para crear el Service Account:');
    logger.error('config', '   1. Google Cloud Console → IAM → Service Accounts → Create Service Account');
    logger.error('config', '   2. Descarga la clave JSON');
    logger.error('config', '   3. Play Console → Usuarios y permisos → Invitar usuario → Email del Service Account → Rol: "Viewer"');
    logger.error('config', '   4. Habilita "Android Publisher API" en Google Cloud Console');
    
    if (!CONFIG.dryRun) {
      process.exit(1);
    } else {
      logger.warn('config', '⚠️ Modo dry-run activo — continuando sin credenciales reales');
    }
    return false;
  }
  
  return true;
}

// Cargar credenciales del Service Account (archivo o string JSON)
function loadServiceAccountCredentials() {
  const jsonSource = CONFIG.serviceAccountJson;
  
  if (!jsonSource) {
    throw new Error('GOOGLE_PLAY_SERVICE_ACCOUNT_JSON no configurado');
  }
  
  // Si es una ruta a archivo
  if (jsonSource.endsWith('.json') || jsonSource.includes('/') || jsonSource.includes('\\')) {
    const fullPath = path.isAbsolute(jsonSource) ? jsonSource : path.join(__dirname, '..', '..', jsonSource);
    
    if (!fs.existsSync(fullPath)) {
      throw new Error(`Archivo de credenciales no encontrado: ${fullPath}`);
    }
    
    const content = fs.readFileSync(fullPath, 'utf8');
    return JSON.parse(content);
  }
  
  // Si es JSON string directo
  try {
    return JSON.parse(jsonSource);
  } catch (err) {
    throw new Error(`GOOGLE_PLAY_SERVICE_ACCOUNT_JSON no es JSON válido ni ruta a archivo: ${err.message}`);
  }
}

// Autenticar con Google Play Developer API
async function authenticatePlayAPI() {
  if (CONFIG.dryRun) {
    logger.info('play-auth', '[DRY-RUN] Simulando autenticación con Google Play Developer API');
    return { auth: null, dryRun: true };
  }
  
  try {
    const credentials = loadServiceAccountCredentials();
    
    // Carga LAZY: googleapis solo en producción (selftest/CI no lo requieren)
    const { google } = require('googleapis');

    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/androidpublisher'],
    });
    
    const client = await auth.getClient();
    logger.info('play-auth', '✅ Autenticado con Google Play Developer API (Service Account)');
    
    return { auth: client, dryRun: false };
  } catch (err) {
    logger.error('play-auth', '❌ Error autenticando con Google Play:', err.message);
    throw err;
  }
}

// Obtener compras/pedidos de Google Play
async function fetchPlayPurchases(authClient, targetDate) {
  if (CONFIG.dryRun) {
    logger.info('play-fetch', `[DRY-RUN] Simulando consulta de compras para ${targetDate.toISOString().split('T')[0]}`);
    // Devolver datos de prueba
    return [
      {
        orderId: 'GPA_TEST_' + Date.now(),
        purchaseTime: targetDate.toISOString(),
        productId: 'noctem_premium',
        purchaseToken: 'test_token_123',
        price: { amountMicros: 14990000, currencyCode: 'USD' }, // $14.99
        buyerEmail: 'playuser@example.com',
      },
    ];
  }
  
  try {
    const { google } = require('googleapis'); // lazy
    const androidpublisher = google.androidpublisher({ version: 'v3', auth: authClient });
    
    // Calcular rango de tiempo (inicio y fin del día objetivo en milisegundos)
    const startTime = new Date(targetDate);
    startTime.setHours(0, 0, 0, 0);
    const endTime = new Date(targetDate);
    endTime.setHours(23, 59, 59, 999);
    
    const startMs = startTime.getTime();
    const endMs = endTime.getTime();
    
    logger.info('play-fetch', `🔍 Consultando compras ${startTime.toISOString()} → ${endTime.toISOString()}`);
    
    // Listar pedidos (orders) - requiere scope androidpublisher
    // Nota: orders.list requiere facturación habilitada y permisos adecuados
    const response = await androidpublisher.orders.list({
      packageName: CONFIG.packageName,
      startTime: startMs.toString(),
      endTime: endMs.toString(),
    });
    
    const orders = response.data.orders || [];
    logger.info('play-fetch', `📦 ${orders.length} pedidos encontrados para ${targetDate.toISOString().split('T')[0]}`);
    
    // Transformar a formato unificado
    return orders.map(order => ({
      orderId: order.orderId,
      purchaseTime: new Date(Number(order.purchaseTimeMillis)).toISOString(),
      productId: order.lineItems?.[0]?.productId || 'unknown',
      purchaseToken: order.lineItems?.[0]?.purchaseToken || '',
      price: order.lineItems?.[0]?.price || { amountMicros: 0, currencyCode: 'USD' },
      buyerEmail: order.buyerEmail || 'unknown@play.google.com',
    }));
  } catch (err) {
    logger.error('play-fetch', '❌ Error consultando Google Play:', err.message);
    
    // Error común: googleapis no instalado
    if (err.message.includes('Cannot find module') || err.code === 'MODULE_NOT_FOUND') {
      logger.error('play-fetch', '📦 DEPENDENCIA FALTANTE: googleapis no está instalado.');
      logger.error('play-fetch', '   Ejecuta: npm install googleapis --save');
      logger.error('play-fetch', '   O añade "googleapis" a package.json dependencies');
    }
    
    throw err;
  }
}

// Convertir compra de Play a formato GA4 purchase
function playPurchaseToGA4(playPurchase) {
  const priceValue = playPurchase.price?.amountMicros 
    ? playPurchase.price.amountMicros / 1_000_000 
    : 0;
  
  return {
    orderId: playPurchase.orderId,
    orderDate: playPurchase.purchaseTime,
    totalValue: priceValue,
    currency: playPurchase.price?.currencyCode || 'USD',
    buyerEmail: playPurchase.buyerEmail,
    buyerName: 'Google Play User',
    productId: playPurchase.productId,
    productName: playPurchase.productId, // Se podría mapear a nombre legible
    itemPrice: priceValue,
    affiliateId: 'google_play',
  };
}

// Enviar a GA4 MP (reutiliza ga4-mp.js)
async function sendToGA4(purchaseData) {
  const { sendPurchaseEvent } = require('./ga4-mp.js');
  return sendPurchaseEvent(purchaseData, {
    ga4MeasurementId: CONFIG.ga4MeasurementId,
    ga4MpApiSecret: CONFIG.ga4MpApiSecret,
    dryRun: CONFIG.dryRun,
  });
}

// Registrar sincronización en JSONL
function logSyncToJSONL(date, results) {
  try {
    fs.mkdirSync(CONFIG.logDir, { recursive: true });
    
    const logEntry = {
      timestamp: new Date().toISOString(),
      sync_date: date.toISOString().split('T')[0],
      total_fetched: results.totalFetched,
      total_sent: results.totalSent,
      total_failed: results.totalFailed,
      dry_run: CONFIG.dryRun,
      purchases: results.details,
    };
    
    fs.appendFileSync(CONFIG.logFile, JSON.stringify(logEntry) + '\n');
    logger.info('jsonl', `📝 Log de sincronización escrito: ${CONFIG.logFile}`);
  } catch (err) {
    logger.error('jsonl', '❌ Error escribiendo log de sincronización:', err.message);
  }
}

// Función principal de sincronización
async function syncPlayPurchases(targetDate = null) {
  const date = targetDate || new Date(Date.now() - 24 * 60 * 60 * 1000); // Ayer por defecto
  
  logger.info('sync', `🔄 Iniciando sincronización Google Play → GA4 para ${date.toISOString().split('T')[0]}`);
  logger.info('sync', `📦 Package: ${CONFIG.packageName} | Modo: ${CONFIG.dryRun ? 'DRY-RUN' : 'PRODUCCIÓN'}`);
  
  // Autenticar
  const { auth, dryRun } = await authenticatePlayAPI();
  
  // Obtener compras
  const purchases = await fetchPlayPurchases(auth, date);
  
  if (purchases.length === 0) {
    logger.info('sync', 'ℹ️ No hay compras para sincronizar en esta fecha');
    logSyncToJSONL(date, { totalFetched: 0, totalSent: 0, totalFailed: 0, details: [] });
    return { totalFetched: 0, totalSent: 0, totalFailed: 0 };
  }
  
  // Procesar cada compra
  const results = {
    totalFetched: purchases.length,
    totalSent: 0,
    totalFailed: 0,
    details: [],
  };
  
  for (const playPurchase of purchases) {
    const ga4Purchase = playPurchaseToGA4(playPurchase);
    
    logger.info('sync', `📤 Enviando a GA4: ${ga4Purchase.orderId} — $${ga4Purchase.totalValue} — ${ga4Purchase.productId}`);
    
    const ga4Result = await sendToGA4(ga4Purchase);
    
    const detail = {
      orderId: ga4Purchase.orderId,
      productId: ga4Purchase.productId,
      value: ga4Purchase.totalValue,
      currency: ga4Purchase.currency,
      ga4Success: ga4Result.success,
      ga4Error: ga4Result.error || null,
    };
    
    results.details.push(detail);
    
    if (ga4Result.success) {
      results.totalSent++;
    } else {
      results.totalFailed++;
      logger.warn('sync', `⚠️ Falló envío a GA4: ${ga4Result.error}`);
    }
    
    // Pequeña pausa para no saturar API
    await new Promise(r => setTimeout(r, 100));
  }
  
  logger.info('sync', `✅ Sincronización completada: ${results.totalSent}/${results.totalFetched} enviadas, ${results.totalFailed} fallidas`);
  
  logSyncToJSONL(date, results);
  
  return results;
}

// Auto-test: validar configuración sin hacer llamadas reales
function runSelfTest() {
  logger.info('selftest', '🧪 Iniciando auto-test de ga4-play-purchases...');
  
  // Verificar variables de entorno
  const missing = [];
  if (!CONFIG.serviceAccountJson) missing.push('GOOGLE_PLAY_SERVICE_ACCOUNT_JSON');
  if (!CONFIG.ga4MeasurementId) missing.push('GA4_MEASUREMENT_ID');
  if (!CONFIG.ga4MpApiSecret) missing.push('GA4_MP_API_SECRET');
  if (!CONFIG.packageName) missing.push('GOOGLE_PLAY_PACKAGE_NAME');
  
  if (missing.length > 0) {
    logger.warn('selftest', `⚠️ Variables faltantes (esperado en dry-run): ${missing.join(', ')}`);
  } else {
    logger.info('selftest', '✅ Todas las variables de entorno configuradas');
  }
  
  // Verificar que el JSON de credenciales es parseable (si es string)
  if (CONFIG.serviceAccountJson && !CONFIG.serviceAccountJson.endsWith('.json')) {
    try {
      JSON.parse(CONFIG.serviceAccountJson);
      logger.info('selftest', '✅ GOOGLE_PLAY_SERVICE_ACCOUNT_JSON es JSON válido');
    } catch (err) {
      logger.error('selftest', '❌ GOOGLE_PLAY_SERVICE_ACCOUNT_JSON no es JSON válido:', err.message);
      process.exit(1);
    }
  }
  
  // Verificar que googleapis está disponible (solo import, no instanciar)
  try {
    require('googleapis');
    logger.info('selftest', '✅ Módulo googleapis disponible');
  } catch (err) {
    logger.warn('selftest', '⚠️ googleapis NO instalado (se requiere para producción): npm install googleapis');
  }
  
  // Verificar ga4-mp.js
  try {
    require('./ga4-mp.js');
    logger.info('selftest', '✅ Módulo ga4-mp.js cargado correctamente');
  } catch (err) {
    logger.error('selftest', '❌ Error cargando ga4-mp.js:', err.message);
    process.exit(1);
  }
  
  logger.info('selftest', '✅ Auto-test de configuración PASÓ (validación estática)');
  logger.info('selftest', '📋 Para prueba completa, configura credenciales reales y ejecuta sin --dryrun');
  process.exit(0);
}

// Parsear argumentos CLI
function parseArgs() {
  const args = process.argv.slice(2);
  const parsed = {
    date: null,
    days: CONFIG.fetchDays,
    help: false,
  };
  
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    if (arg === '--date' && i + 1 < args.length) {
      parsed.date = new Date(args[++i]);
      if (isNaN(parsed.date.getTime())) {
        logger.error('cli', `❌ Fecha inválida: ${args[i]}`);
        process.exit(1);
      }
    } else if (arg === '--days' && i + 1 < args.length) {
      parsed.days = Number(args[++i]);
    } else if (arg === '--selftest') {
      parsed.selftest = true;
    } else if (arg === '--help' || arg === '-h') {
      parsed.help = true;
    }
  }
  
  return parsed;
}

// Punto de entrada principal
async function main() {
  const args = parseArgs();
  
  if (args.help) {
    console.log(`
Uso: node scripts/ga4-play-purchases.js [opciones]

Opciones:
  --date YYYY-MM-DD   Fecha específica a sincronizar (default: ayer)
  --days N            Número de días hacia atrás (default: 1)
  --selftest          Validar configuración sin llamadas reales
  --dryrun            Modo simulación (no llama APIs reales)
  --help, -h          Muestra esta ayuda

Variables de entorno REQUERIDAS:
  GOOGLE_PLAY_SERVICE_ACCOUNT_JSON  — Ruta a archivo JSON O JSON string del Service Account
  GA4_MEASUREMENT_ID                — ID de medición GA4 (G-XXXXXXXXXX)
  GA4_MP_API_SECRET                 — API Secret de GA4 Measurement Protocol
  GOOGLE_PLAY_PACKAGE_NAME          — Package name de la app (ej: com.cha0smagick.noctem)

Variables opcionales:
  PLAY_FETCH_DAYS     — Días hacia atrás (default: 1)
  PLAY_DRYRUN         — 'true' para modo simulación

Configuración del Service Account:
  1. Google Cloud Console → Crear Service Account
  2. Descargar clave JSON
  3. Play Console → Usuarios y permisos → Invitar → Email del SA → Rol: Viewer
  4. Habilitar "Android Publisher API" en Google Cloud Console

Programación cron (diario 03:00 UTC para compras de ayer):
  0 3 * * * node /path/to/scripts/ga4-play-purchases.js >> /var/log/ga4-play-sync.log 2>&1
`);
    process.exit(0);
  }
  
  if (args.selftest) {
    runSelfTest();
    return;
  }
  
  // Validar configuración
  if (!validateConfig()) {
    if (!CONFIG.dryRun) {
      process.exit(1);
    }
  }
  
  // Determinar fechas a procesar
  const dates = [];
  if (args.date) {
    dates.push(args.date);
  } else {
    for (let i = 1; i <= args.days; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      dates.push(d);
    }
  }
  
  // Procesar cada fecha
  for (const date of dates) {
    try {
      await syncPlayPurchases(date);
    } catch (err) {
      logger.error('main', `❌ Error sincronizando ${date.toISOString().split('T')[0]}:`, err.message);
      if (!CONFIG.dryRun) {
        process.exit(1);
      }
    }
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
  syncPlayPurchases,
  fetchPlayPurchases,
  playPurchaseToGA4,
  authenticatePlayAPI,
  loadServiceAccountCredentials,
  runSelfTest,
  validateConfig,
  CONFIG,
};