/**
 * webhook-receiver.js — Hotmart Webhook Receiver (Self-hosted Node.js)
 * 
 * Funcionalidad:
 * - Valida firma HMAC-SHA256 de Hotmart (header X-Hotmart-Signature)
 * - En eventos PURCHASE_COMPLETE con status APPROVED:
 *   1. Etiqueta al comprador en MailerLite como 'customer'
 *   2. Registra log estructurado JSONL compatible con importación a Sheets
 * - Modo dry-run y auto-test (--selftest)
 * - Logs en español
 * 
 * Uso:
 *   node scripts/webhook-receiver.js           # Inicia servidor HTTP en puerto 3001
 *   node scripts/webhook-receiver.js --dryrun  # Modo simulación (no llama APIs externas)
 *   node scripts/webhook-receiver.js --selftest # Genera payload firmado y valida
 * 
 * Variables de entorno requeridas:
 *   HOTMART_WEBHOOK_SECRET  — Secreto HMAC configurado en Hotmart
 *   MAILERLITE_API_KEY      — API Key de MailerLite (para tagging)
 *   GA4_MEASUREMENT_ID      — ID de medición GA4 (G-XXXXXXXXXX)
 *   GA4_MP_API_SECRET       — API Secret de GA4 Measurement Protocol
 *   WEBHOOK_PORT            — Puerto del servidor (default: 3001)
 *   WEBHOOK_DRYRUN          — 'true' para modo simulación (opcional)
 */

const http = require('http');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { URLSearchParams } = require('url');

// Cargar .env desde la raíz del proyecto
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });

// Logger estructurado (patrón del repo: scripts/bots/logger.js)
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

// Configuración desde variables de entorno
const CONFIG = {
  hotmartSecret: process.env.HOTMART_WEBHOOK_SECRET,
  mailerliteApiKey: process.env.MAILERLITE_API_KEY,
  ga4MeasurementId: process.env.GA4_MEASUREMENT_ID,
  ga4MpApiSecret: process.env.GA4_MP_API_SECRET,
  port: Number(process.env.WEBHOOK_PORT || 3002), // 3002: evita conflicto con /health de Discord (3001)
  dryRun: process.env.WEBHOOK_DRYRUN === 'true' || process.argv.includes('--dryrun'),
  logDir: path.join(__dirname, '..', '..', 'logs'),
  logFile: path.join(__dirname, '..', '..', 'logs', 'hotmart-purchases.jsonl'),
  // Flash Sale 20-slot limit enforcement (plan 2.4.10)
  flashSaleProductId: process.env.FLASH_SALE_PRODUCT_ID || 'flash_sale',
  flashSaleMaxSlots: Number(process.env.FLASH_SALE_MAX_SLOTS || 20),
  slotFile: path.join(__dirname, '..', '..', 'logs', 'flash-sale-slots.json'),
};

// Validar configuración crítica
function validateConfig() {
  const missing = [];
  if (!CONFIG.hotmartSecret) missing.push('HOTMART_WEBHOOK_SECRET');
  if (!CONFIG.mailerliteApiKey) missing.push('MAILERLITE_API_KEY');
  if (!CONFIG.ga4MeasurementId) missing.push('GA4_MEASUREMENT_ID');
  if (!CONFIG.ga4MpApiSecret) missing.push('GA4_MP_API_SECRET');
  
  if (missing.length > 0) {
    logger.warn('config', `⚠️ Variables de entorno faltantes (modo ${CONFIG.dryRun ? 'dry-run' : 'producción'}): ${missing.join(', ')}`);
    if (!CONFIG.dryRun) {
      logger.error('config', '❌ En modo producción se requieren todas las variables. Usa --dryrun para probar sin credenciales.');
      process.exit(1);
    }
  }
  return missing.length === 0;
}

// Asegurar directorio de logs
function ensureLogDir() {
  try {
    fs.mkdirSync(CONFIG.logDir, { recursive: true });
  } catch (err) {
    logger.error('filesystem', '❌ No se pudo crear directorio de logs:', err.message);
  }
}

// Validar firma HMAC-SHA256 de Hotmart
function validateHotmartSignature(payload, signatureHeader) {
  if (!CONFIG.hotmartSecret) {
    logger.warn('hmac', '⚠️ HOTMART_WEBHOOK_SECRET no configurado — omitiendo validación HMAC');
    return CONFIG.dryRun; // En dry-run permitir sin secreto
  }
  
  if (!signatureHeader) {
    logger.warn('hmac', '⚠️ Header X-Hotmart-Signature ausente');
    return false;
  }
  
  // Hotmart envía la firma como: sha256=<hex>
  const expectedSignature = 'sha256=' + crypto
    .createHmac('sha256', CONFIG.hotmartSecret)
    .update(payload)
    .digest('hex');
  
  // Comparación en tiempo constante
  const provided = Buffer.from(signatureHeader);
  const expected = Buffer.from(expectedSignature);
  
  if (provided.length !== expected.length) {
    logger.warn('hmac', '❌ Longitud de firma inválida');
    return false;
  }
  
  const isValid = crypto.timingSafeEqual(provided, expected);
  
  if (!isValid) {
    logger.warn('hmac', '❌ Firma HMAC inválida — posible manipulación o secreto incorrecto');
  }
  
  return isValid;
}

// Extraer datos relevantes del payload de Hotmart
function extractPurchaseData(payload) {
  try {
    const data = JSON.parse(payload);
    
    // Verificar que es un evento de compra completada aprobada
    if (data.event !== 'PURCHASE_COMPLETE') {
      return { valid: false, reason: `Evento no es PURCHASE_COMPLETE: ${data.event}` };
    }
    
    const order = data.data?.order;
    if (!order) {
      return { valid: false, reason: 'Payload sin data.order' };
    }
    
    if (order.status !== 'APPROVED') {
      return { valid: false, reason: `Estado de orden no es APPROVED: ${order.status}` };
    }
    
    const buyer = order.buyer;
    const items = order.items || [];
    const firstItem = items[0] || {};
    
    return {
      valid: true,
      orderId: order.id,
      orderDate: order.date,
      totalValue: order.total_price?.value,
      currency: order.total_price?.currency || 'USD',
      buyerEmail: buyer?.email,
      buyerName: buyer?.name,
      productId: firstItem.product_id,
      productName: firstItem.name,
      itemPrice: firstItem.price?.value,
      affiliateId: order.affiliate_id || 'direct',
      rawPayload: data,
    };
  } catch (err) {
    return { valid: false, reason: `Error parseando JSON: ${err.message}` };
  }
}

// Etiquetar comprador en MailerLite como 'customer'
async function tagBuyerInMailerLite(email, name, productId) {
  if (CONFIG.dryRun) {
    logger.info('mailerlite', `[DRY-RUN] Etiquetar en MailerLite: ${email} — tag: customer, product: ${productId}`);
    return { success: true, dryRun: true };
  }
  
  if (!CONFIG.mailerliteApiKey) {
    logger.error('mailerlite', '❌ MAILERLITE_API_KEY no configurado');
    return { success: false, error: 'MAILERLITE_API_KEY no configurado' };
  }
  
  try {
    // MailerLite API v2: Add or Update Subscriber
    // POST https://connect.mailerlite.com/api/subscribers
    const subscriberData = {
      email,
      name: name || '',
      fields: {
        last_purchase_date: new Date().toISOString().split('T')[0],
        last_purchase_product: productId || '',
      },
      groups: ['customers'], // Nombre del grupo en MailerLite
      tags: ['customer', `buyer_${productId || 'unknown'}`],
      resubscribe: true,
    };
    
    const response = await fetch('https://connect.mailerlite.com/api/subscribers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${CONFIG.mailerliteApiKey}`,
        'Accept': 'application/json',
      },
      body: JSON.stringify(subscriberData),
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      logger.error('mailerlite', `❌ Error MailerLite (${response.status}):`, result);
      return { success: false, error: result };
    }
    
    logger.info('mailerlite', `✅ Comprador etiquetado en MailerLite: ${email} (subscriber_id: ${result.data?.id})`);
    return { success: true, subscriberId: result.data?.id };
  } catch (err) {
    logger.error('mailerlite', '❌ Excepción llamando a MailerLite:', err.message);
    return { success: false, error: err.message };
  }
}

// Enviar evento de compra a GA4 Measurement Protocol
async function sendGA4PurchaseEvent(purchaseData) {
  // Importar dinámicamente para evitar dependencia circular
  const { sendPurchaseEvent } = require('./ga4-mp.js');
  return sendPurchaseEvent(purchaseData, CONFIG);
}

// Registrar compra en JSONL (compatible con Sheets import)
function logPurchaseToJSONL(purchaseData, mailerliteResult, ga4Result) {
  ensureLogDir();
  
  const logEntry = {
    timestamp: new Date().toISOString(),
    order_id: purchaseData.orderId,
    order_date: purchaseData.orderDate,
    product_id: purchaseData.productId,
    product_name: purchaseData.productName,
    total_value: purchaseData.totalValue,
    currency: purchaseData.currency,
    buyer_email: purchaseData.buyerEmail,
    buyer_name: purchaseData.buyerName,
    affiliate_id: purchaseData.affiliateId,
    mailerlite_tagged: mailerliteResult?.success || false,
    mailerlite_subscriber_id: mailerliteResult?.subscriberId || null,
    ga4_sent: ga4Result?.success || false,
    ga4_client_id: ga4Result?.clientId || null,
    dry_run: CONFIG.dryRun,
  };
  
  try {
    fs.appendFileSync(CONFIG.logFile, JSON.stringify(logEntry) + '\n');
    logger.info('jsonl', `📝 Log JSONL escrito: ${CONFIG.logFile} (order: ${purchaseData.orderId})`);
  } catch (err) {
    logger.error('jsonl', '❌ Error escribiendo log JSONL:', err.message);
  }
}

// === Flash Sale 20-slot limit enforcement (plan 2.4.10) ===

// Determinar si la compra corresponde al producto Flash Sale
function isFlashSalePurchase(purchaseData) {
  return purchaseData.valid && purchaseData.productId === CONFIG.flashSaleProductId;
}

// Leer estado del contador de slots (persistente, idempotente)
function readSlots() {
  try {
    const raw = fs.readFileSync(CONFIG.slotFile, 'utf8');
    const state = JSON.parse(raw);
    if (typeof state.count !== 'number' || !Array.isArray(state.orders)) {
      return { count: 0, orders: [], updatedAt: null };
    }
    return { count: state.count, orders: state.orders, updatedAt: state.updatedAt || null };
  } catch (err) {
    // Archivo ausente o corrupto → estado limpio (primera venta o reset)
    return { count: 0, orders: [], updatedAt: null };
  }
}

// Registrar una venta en el contador de slots
function recordSlot(purchaseData) {
  const state = readSlots();
  if (state.orders.includes(purchaseData.orderId)) {
    // Reintento de Hotmart para una orden ya contada — idempotente
    return { allowed: true, count: state.count, max: CONFIG.flashSaleMaxSlots, alreadyCounted: true };
  }
  state.count += 1;
  state.orders.push(purchaseData.orderId);
  state.updatedAt = new Date().toISOString();
  try {
    fs.mkdirSync(CONFIG.logDir, { recursive: true });
    fs.writeFileSync(CONFIG.slotFile, JSON.stringify(state, null, 2) + '\n');
    logger.info('flash-sale', `🎫 Slot registrado: ${state.count}/${CONFIG.flashSaleMaxSlots} (order: ${purchaseData.orderId})`);
  } catch (err) {
    logger.error('flash-sale', '❌ Error escribiendo contador de slots:', err.message);
  }
  return { allowed: true, count: state.count, max: CONFIG.flashSaleMaxSlots, alreadyCounted: false };
}

// Enforce: verificar si quedan slots antes de procesar la compra del Flash Sale
function enforceFlashSaleSlots(purchaseData) {
  const state = readSlots();
  const allowed = state.count < CONFIG.flashSaleMaxSlots;
  if (!allowed) {
    logger.warn('flash-sale', `🚫 Flash Sale AGOTADO: ${state.count}/${CONFIG.flashSaleMaxSlots} slots vendidos — compra ${purchaseData.orderId} no recibirá bonus`);
  }
  return { allowed, count: state.count, max: CONFIG.flashSaleMaxSlots, soldOut: !allowed };
}

// Procesar webhook entrante
async function processWebhook(req, res) {
  let body = '';
  
  req.on('data', chunk => {
    body += chunk.toString();
  });
  
  req.on('end', async () => {
    const signature = req.headers['x-hotmart-signature'] || req.headers['x-hotmart-signature-256'];
    
    logger.info('webhook', `📥 Webhook recibido — IP: ${req.socket.remoteAddress}, Event: ${JSON.parse(body).event || 'unknown'}`);
    
    // Validar firma HMAC
    if (!validateHotmartSignature(body, signature)) {
      logger.warn('webhook', '❌ Firma HMAC inválida — rechazando webhook');
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Firma HMAC inválida' }));
      return;
    }
    
    // Extraer datos de compra
    const purchaseData = extractPurchaseData(body);
    
    if (!purchaseData.valid) {
      logger.info('webhook', `ℹ️ Webhook válido pero no es compra aprobada: ${purchaseData.reason}`);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'ignored', reason: purchaseData.reason }));
      return;
    }
    
    logger.info('webhook', `✅ Compra aprobada detectada: ${purchaseData.orderId} — ${purchaseData.buyerEmail} — ${purchaseData.productId}`);
    
    // Flash Sale 20-slot limit enforcement (plan 2.4.10)
    let slotInfo = null;
    if (isFlashSalePurchase(purchaseData)) {
      const enforcement = enforceFlashSaleSlots(purchaseData);
      if (!enforcement.allowed) {
        // Slots agotados: responder 200 (evitar reintentos) SIN entregar bonus ni tagging
        logPurchaseToJSONL(purchaseData, { success: false }, { success: false });
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          status: 'sold_out',
          order_id: purchaseData.orderId,
          slots_sold: enforcement.count,
          slots_max: enforcement.max,
          message: 'Flash Sale agotado — unidades límite alcanzadas',
        }));
        return;
      }
      slotInfo = recordSlot(purchaseData);
    }
    
    // Ejecutar acciones en paralelo
    const [mailerliteResult, ga4Result] = await Promise.allSettled([
      tagBuyerInMailerLite(purchaseData.buyerEmail, purchaseData.buyerName, purchaseData.productId),
      sendGA4PurchaseEvent(purchaseData),
    ]);
    
    const mlResult = mailerliteResult.status === 'fulfilled' ? mailerliteResult.value : { success: false, error: mailerliteResult.reason?.message };
    const ga4ResultValue = ga4Result.status === 'fulfilled' ? ga4Result.value : { success: false, error: ga4Result.reason?.message };
    
    // Registrar en JSONL
    logPurchaseToJSONL(purchaseData, mlResult, ga4ResultValue);
    
    // Responder a Hotmart (200 OK para evitar reintentos)
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'processed',
      order_id: purchaseData.orderId,
      mailerlite: mlResult.success ? 'tagged' : 'failed',
      ga4: ga4ResultValue.success ? 'sent' : 'failed',
      flash_sale_slots: slotInfo ? `${slotInfo.count}/${slotInfo.max}` : undefined,
    }));
  });
}

// Auto-test: generar payload firmado y validar
function runSelfTest() {
  logger.info('selftest', '🧪 Iniciando auto-test de webhook-receiver...');
  
  if (!CONFIG.hotmartSecret) {
    // El auto-test valida el round-trip HMAC, no credenciales reales: usa secreto de prueba (CI-safe)
    logger.warn('selftest', '⚠️ HOTMART_WEBHOOK_SECRET no configurado — usando secreto de prueba para el auto-test');
    CONFIG.hotmartSecret = 'selftest_secret';
  }
  
  // Payload de prueba simulando Hotmart PURCHASE_COMPLETE
  const testPayload = {
    event: 'PURCHASE_COMPLETE',
    data: {
      order: {
        id: 'HP_TEST_123456',
        status: 'APPROVED',
        date: new Date().toISOString(),
        total_price: { value: 29.99, currency: 'USD' },
        buyer: { email: 'test@example.com', name: 'Usuario Test' },
        items: [
          { product_id: 'bundle_complete_apps', name: 'Complete Apps Bundle', price: { value: 29.99 } }
        ],
        affiliate_id: 'aff_test123',
      },
    },
  };
  
  const payloadString = JSON.stringify(testPayload);
  
  // Generar firma HMAC
  const signature = 'sha256=' + crypto
    .createHmac('sha256', CONFIG.hotmartSecret)
    .update(payloadString)
    .digest('hex');
  
  logger.info('selftest', `🔐 Payload de prueba generado (order: ${testPayload.data.order.id})`);
  logger.info('selftest', `🔐 Firma HMAC generada: ${signature.substring(0, 32)}...`);
  
  // Validar la firma generada
  const isValid = validateHotmartSignature(payloadString, signature);
  
  if (isValid) {
    logger.info('selftest', '✅ Auto-test PASÓ: Firma HMAC válida');
    logger.info('selftest', '📋 Para probar en Hotmart, usa este payload y header:');
    logger.info('selftest', `   Header: X-Hotmart-Signature: ${signature}`);
    logger.info('selftest', `   Body: ${payloadString}`);
    process.exit(0);
  } else {
    logger.error('selftest', '❌ Auto-test FALLÓ: Firma HMAC inválida');
    process.exit(1);
  }
}

// Iniciar servidor HTTP
function startServer() {
  const server = http.createServer(async (req, res) => {
    // Solo aceptar POST en /webhook/hotmart
    if (req.method !== 'POST' || req.url !== '/webhook/hotmart') {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Not found — use POST /webhook/hotmart' }));
      return;
    }
    
    await processWebhook(req, res);
  });
  
  server.listen(CONFIG.port, () => {
    logger.info('server', `🚀 Webhook receiver escuchando en puerto ${CONFIG.port}`);
    logger.info('server', `📡 Endpoint: http://localhost:${CONFIG.port}/webhook/hotmart`);
    logger.info('server', `🔧 Modo: ${CONFIG.dryRun ? 'DRY-RUN (simulación)' : 'PRODUCCIÓN'}`);
    logger.info('server', `📝 Logs JSONL: ${CONFIG.logFile}`);
  });
  
  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      logger.error('server', `❌ Puerto ${CONFIG.port} en uso. Cambia WEBHOOK_PORT o libera el puerto.`);
    } else {
      logger.error('server', '❌ Error del servidor:', err.message);
    }
    process.exit(1);
  });
  
  // Manejo graceful shutdown
  process.on('SIGINT', () => {
    logger.info('server', '🛑 Cerrando servidor...');
    server.close(() => {
      logger.info('server', '✅ Servidor cerrado');
      process.exit(0);
    });
  });
}

// Punto de entrada principal
function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--selftest')) {
    runSelfTest();
    return;
  }
  
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
Uso: node scripts/webhook-receiver.js [opciones]

Opciones:
  --selftest    Genera payload firmado de prueba y valida HMAC
  --dryrun      Modo simulación (no llama APIs externas)
  --help, -h    Muestra esta ayuda

Variables de entorno:
  HOTMART_WEBHOOK_SECRET   Secreto HMAC de Hotmart (requerido)
  MAILERLITE_API_KEY       API Key de MailerLite (requerido)
  GA4_MEASUREMENT_ID       ID de medición GA4 G-XXXXXXXXXX (requerido)
  GA4_MP_API_SECRET        API Secret GA4 Measurement Protocol (requerido)
  WEBHOOK_PORT             Puerto del servidor (default: 3001)
  WEBHOOK_DRYRUN           'true' para modo simulación
`);
    process.exit(0);
  }
  
  validateConfig();
  startServer();
}

// Ejecutar si es el módulo principal
if (require.main === module) {
  main();
}

module.exports = {
  validateHotmartSignature,
  extractPurchaseData,
  tagBuyerInMailerLite,
  logPurchaseToJSONL,
  processWebhook,
  runSelfTest,
  CONFIG,
  isFlashSalePurchase,
  readSlots,
  recordSlot,
  enforceFlashSaleSlots,
};