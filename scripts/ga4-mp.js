/**
 * ga4-mp.js — GA4 Measurement Protocol Client
 * 
 * Envía eventos de compra (purchase) a Google Analytics 4
 * vía Measurement Protocol API (server-to-server).
 * 
 * Documentación: https://developers.google.com/analytics/devguides/collection/protocol/ga4
 * 
 * Uso:
 *   const { sendPurchaseEvent } = require('./ga4-mp.js');
 *   await sendPurchaseEvent(purchaseData, config);
 * 
 *   node scripts/ga4-mp.js --selftest  # Auto-test con payload de prueba
 *   node scripts/ga4-mp.js --dryrun    # Modo simulación
 * 
 * Variables de entorno:
 *   GA4_MEASUREMENT_ID   — ID de medición GA4 (formato: G-XXXXXXXXXX)
 *   GA4_MP_API_SECRET    — API Secret de Measurement Protocol
 *   GA4_CLIENT_ID        — Client ID opcional (se genera uno si no se provee)
 *   GA4_DRYRUN           — 'true' para modo simulación
 */

const crypto = require('crypto');
const path = require('path');

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
  measurementId: process.env.GA4_MEASUREMENT_ID,
  apiSecret: process.env.GA4_MP_API_SECRET,
  clientId: process.env.GA4_CLIENT_ID || generateClientId(),
  dryRun: process.env.GA4_DRYRUN === 'true' || process.argv.includes('--dryrun'),
  apiUrl: 'https://www.google-analytics.com/mp/collect',
};

// Generar client_id aleatorio (formato GA4: xxxxxxxx.xxxxxxxx)
function generateClientId() {
  const random1 = Math.floor(Math.random() * 2147483647);
  const random2 = Math.floor(Math.random() * 2147483647);
  return `${random1}.${random2}`;
}

// Validar configuración
function validateConfig() {
  const missing = [];
  if (!CONFIG.measurementId) missing.push('GA4_MEASUREMENT_ID');
  if (!CONFIG.apiSecret) missing.push('GA4_MP_API_SECRET');
  
  if (missing.length > 0) {
    logger.warn('config', `⚠️ Variables GA4 faltantes (modo ${CONFIG.dryRun ? 'dry-run' : 'producción'}): ${missing.join(', ')}`);
    if (!CONFIG.dryRun) {
      logger.error('config', '❌ En modo producción se requieren GA4_MEASUREMENT_ID y GA4_MP_API_SECRET');
      return false;
    }
  }
  return missing.length === 0;
}

// Construir payload de evento purchase para GA4 MP
function buildPurchaseEvent(purchaseData, clientId) {
  const items = [];
  
  if (purchaseData.productId && purchaseData.productName) {
    items.push({
      item_id: purchaseData.productId,
      item_name: purchaseData.productName,
      affiliation: 'Cha0smagick Labs',
      currency: purchaseData.currency || 'USD',
      price: purchaseData.itemPrice || purchaseData.totalValue,
      quantity: 1,
      item_brand: 'Cha0smagick',
      item_category: purchaseData.productId?.includes('bundle') ? 'bundle' : 
                     purchaseData.productId?.includes('book') ? 'book' : 'app',
    });
  }
  
  return {
    client_id: clientId,
    events: [{
      name: 'purchase',
      params: {
        transaction_id: purchaseData.orderId,
        value: purchaseData.totalValue,
        currency: purchaseData.currency || 'USD',
        affiliation: 'Cha0smagick Labs',
        items: items,
        // Parámetros personalizados para análisis
        product_id: purchaseData.productId,
        product_name: purchaseData.productName,
        buyer_email_hash: purchaseData.buyerEmail ? 
          crypto.createHash('sha256').update(purchaseData.buyerEmail.toLowerCase().trim()).digest('hex').substring(0, 16) 
          : null,
        affiliate_id: purchaseData.affiliateId || 'direct',
      },
    }],
  };
}

// Enviar evento a GA4 Measurement Protocol
async function sendToGA4(payload) {
  const url = `${CONFIG.apiUrl}?measurement_id=${CONFIG.measurementId}&api_secret=${CONFIG.apiSecret}`;
  
  if (CONFIG.dryRun) {
    logger.info('ga4-mp', `[DRY-RUN] POST a GA4 MP: ${url}`);
    logger.info('ga4-mp', `[DRY-RUN] Payload:`, JSON.stringify(payload, null, 2));
    return { success: true, dryRun: true, clientId: CONFIG.clientId };
  }
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    
    // GA4 MP devuelve 204 No Content en éxito, 400 en error
    if (response.status === 204) {
      logger.info('ga4-mp', `✅ Evento enviado a GA4 MP (client_id: ${CONFIG.clientId})`);
      return { success: true, clientId: CONFIG.clientId };
    } else {
      const errorText = await response.text();
      logger.error('ga4-mp', `❌ Error GA4 MP (${response.status}):`, errorText);
      return { success: false, error: `HTTP ${response.status}: ${errorText}`, clientId: CONFIG.clientId };
    }
  } catch (err) {
    logger.error('ga4-mp', '❌ Excepción enviando a GA4 MP:', err.message);
    return { success: false, error: err.message, clientId: CONFIG.clientId };
  }
}

// Función principal: enviar evento de compra
async function sendPurchaseEvent(purchaseData, externalConfig = {}) {
  // Permitir override de config (para testing)
  const measurementId = externalConfig.ga4MeasurementId || CONFIG.measurementId;
  const apiSecret = externalConfig.ga4MpApiSecret || CONFIG.apiSecret;
  const clientId = externalConfig.ga4ClientId || CONFIG.clientId;
  const dryRun = externalConfig.dryRun !== undefined ? externalConfig.dryRun : CONFIG.dryRun;
  
  if (!measurementId || !apiSecret) {
    const missing = [];
    if (!measurementId) missing.push('GA4_MEASUREMENT_ID');
    if (!apiSecret) missing.push('GA4_MP_API_SECRET');
    
    logger.warn('ga4-mp', `⚠️ Config GA4 incompleta (${missing.join(', ')}) — modo ${dryRun ? 'dry-run' : 'producción'}`);
    if (!dryRun) {
      return { success: false, error: `Faltan variables: ${missing.join(', ')}`, clientId };
    }
  }
  
  // Validar datos de compra mínimos
  if (!purchaseData.orderId || !purchaseData.totalValue) {
    logger.error('ga4-mp', '❌ Datos de compra incompletos: se requiere orderId y totalValue');
    return { success: false, error: 'Datos de compra incompletos', clientId };
  }
  
  // Construir payload
  const payload = buildPurchaseEvent(purchaseData, clientId);
  
  // Override config para el envío si se pasó externalConfig
  const originalMeasurementId = CONFIG.measurementId;
  const originalApiSecret = CONFIG.apiSecret;
  const originalClientId = CONFIG.clientId;
  const originalDryRun = CONFIG.dryRun;
  
  if (externalConfig.ga4MeasurementId) CONFIG.measurementId = externalConfig.ga4MeasurementId;
  if (externalConfig.ga4MpApiSecret) CONFIG.apiSecret = externalConfig.ga4MpApiSecret;
  if (externalConfig.ga4ClientId) CONFIG.clientId = externalConfig.ga4ClientId;
  if (externalConfig.dryRun !== undefined) CONFIG.dryRun = externalConfig.dryRun;
  
  try {
    const result = await sendToGA4(payload);
    return result;
  } finally {
    // Restaurar config original
    CONFIG.measurementId = originalMeasurementId;
    CONFIG.apiSecret = originalApiSecret;
    CONFIG.clientId = originalClientId;
    CONFIG.dryRun = originalDryRun;
  }
}

// Auto-test: enviar evento de prueba
function runSelfTest() {
  logger.info('selftest', '🧪 Iniciando auto-test de ga4-mp...');
  
  if (!CONFIG.measurementId || !CONFIG.apiSecret) {
    logger.warn('selftest', '⚠️ Credenciales GA4 no configuradas — ejecutando en modo dry-run');
    CONFIG.dryRun = true;
  }
  
  const testPurchaseData = {
    orderId: 'HP_TEST_' + Date.now(),
    orderDate: new Date().toISOString(),
    totalValue: 29.99,
    currency: 'USD',
    buyerEmail: 'test@example.com',
    buyerName: 'Usuario Test',
    productId: 'bundle_complete_apps',
    productName: 'Complete Apps Bundle',
    itemPrice: 29.99,
    affiliateId: 'aff_test123',
  };
  
  logger.info('selftest', `📦 Datos de prueba: order=${testPurchaseData.orderId}, value=$${testPurchaseData.totalValue}`);
  
  sendPurchaseEvent(testPurchaseData)
    .then(result => {
      if (result.success) {
        logger.info('selftest', '✅ Auto-test PASÓ: Evento de compra enviado correctamente');
        logger.info('selftest', `📋 Client ID usado: ${result.clientId}`);
        process.exit(0);
      } else {
        logger.error('selftest', '❌ Auto-test FALLÓ:', result.error);
        process.exit(1);
      }
    })
    .catch(err => {
      logger.error('selftest', '❌ Auto-test EXCEPCIÓN:', err.message);
      process.exit(1);
    });
}

// Punto de entrada CLI
function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--selftest')) {
    validateConfig();
    runSelfTest();
    return;
  }
  
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
Uso: node scripts/ga4-mp.js [opciones]

Opciones:
  --selftest    Envía evento de compra de prueba a GA4 MP
  --dryrun      Modo simulación (no envía a GA4 real)
  --help, -h    Muestra esta ayuda

Variables de entorno:
  GA4_MEASUREMENT_ID    ID de medición GA4 (G-XXXXXXXXXX) — requerido
  GA4_MP_API_SECRET     API Secret de Measurement Protocol — requerido
  GA4_CLIENT_ID         Client ID opcional (se genera uno aleatorio)
  GA4_DRYRUN            'true' para modo simulación

Ejemplo payload purchase:
{
  "client_id": "123456789.987654321",
  "events": [{
    "name": "purchase",
    "params": {
      "transaction_id": "HP_123456",
      "value": 29.99,
      "currency": "USD",
      "items": [{ "item_id": "bundle_complete_apps", "item_name": "Complete Apps Bundle", "price": 29.99, "quantity": 1 }]
    }
  }]
}
`);
    process.exit(0);
  }
  
  // Si se ejecuta directamente sin flags, mostrar ayuda
  if (require.main === module && args.length === 0) {
    console.log('ℹ️  Módulo GA4 Measurement Protocol — usa --selftest para probar o require() en tu código');
    console.log('   Ver --help para más opciones');
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  sendPurchaseEvent,
  buildPurchaseEvent,
  sendToGA4,
  runSelfTest,
  generateClientId,
  validateConfig,
  CONFIG,
};