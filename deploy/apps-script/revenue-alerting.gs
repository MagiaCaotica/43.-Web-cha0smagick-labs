/**
 * revenue-alerting.gs — Google Apps Script (plan 2.6.3, R28)
 *
 * Trigger diario: lee el revenue del día, compara vs REVENUE_DAILY_TARGET
 * (Script Properties); si < 50% del objetivo → alerta por Telegram al admin.
 *
 * Instalación (owner):
 *   1. Google Sheets → Extensiones → Apps Script → pegar este archivo como Code.gs.
 *   2. ⚙ Configuración del proyecto → Propiedades del script:
 *        REVENUE_DAILY_TARGET   = 50        (objetivo diario USD)
 *        TELEGRAM_BOT_TOKEN     = <token>   (el mismo del .env del repo)
 *        TELEGRAM_ADMIN_CHAT_ID = <chat id numérico del admin>
 *   3. Activadores (reloj) → Añadir activador → checkRevenueDaily →
 *      Basado en tiempo → Temporizador diario → 09:00–10:00 (hora Bogotá).
 *   4. Ejecutar checkRevenueDryRun una vez (autoriza permisos y valida el flujo).
 *
 * Fuente del revenue (en orden):
 *   a. Rango nombrado REVENUE_TODAY en la hoja
 *   b. Última fila de la hoja "Daily" (o la primera hoja), columna cuyo header
 *      sea revenue|total|ingresos
 *   c. 0 si no se encuentra nada — dispara alerta, que es el comportamiento
 *      correcto: sin datos visibles = sin ingresos confirmados.
 */

var ALERT_THRESHOLD = 0.5;

function getRevenueToday_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var named = ss.getRangeByName('REVENUE_TODAY');
  if (named) {
    var v = named.getValue();
    if (typeof v === 'number' && v >= 0) return v;
  }
  var sheet = ss.getSheetByName('Daily') || ss.getSheets()[0];
  var lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    for (var c = 0; c < headers.length; c++) {
      var h = String(headers[c]).trim().toLowerCase();
      if (h === 'revenue' || h === 'total' || h === 'ingresos') {
        var cell = sheet.getRange(lastRow, c + 1).getValue();
        if (typeof cell === 'number') return cell;
      }
    }
  }
  return 0;
}

function decideAlert_(revenue, target, threshold) {
  var line = target * threshold;
  return {
    alert: revenue < line,
    line: line,
    pct: target > 0 ? revenue / target : 0
  };
}

function sendTelegramAlert_(text) {
  var props = PropertiesService.getScriptProperties();
  var token = props.getProperty('TELEGRAM_BOT_TOKEN');
  var chatId = props.getProperty('TELEGRAM_ADMIN_CHAT_ID');
  if (!token || !chatId) {
    Logger.log('Faltan TELEGRAM_BOT_TOKEN o TELEGRAM_ADMIN_CHAT_ID en Script Properties — alerta no enviada');
    return false;
  }
  var res = UrlFetchApp.fetch('https://api.telegram.org/bot' + token + '/sendMessage', {
    method: 'post',
    payload: { chat_id: chatId, text: text },
    muteHttpExceptions: true
  });
  Logger.log('Telegram HTTP ' + res.getResponseCode());
  return res.getResponseCode() === 200;
}

function checkRevenueDaily() {
  var props = PropertiesService.getScriptProperties();
  var target = parseFloat(props.getProperty('REVENUE_DAILY_TARGET') || '');
  if (!target || target <= 0) {
    Logger.log('REVENUE_DAILY_TARGET no configurado en Script Properties — alerta omitida');
    return;
  }
  var revenue = getRevenueToday_();
  var decision = decideAlert_(revenue, target, ALERT_THRESHOLD);
  var head = decision.alert ? '🚨 ALERTA DE INGRESOS' : '✅ Ingresos OK';
  var msg = head +
    '\nHoy: $' + revenue.toFixed(2) +
    ' | Objetivo: $' + target.toFixed(2) +
    ' (' + (decision.pct * 100).toFixed(1) + '%)' +
    '\nLínea de alerta: $' + decision.line.toFixed(2) + ' (50% del objetivo)' +
    '\n— Cha0smagick Labs';
  if (decision.alert) {
    sendTelegramAlert_(msg);
  }
  Logger.log(msg);
}

function checkRevenueDryRun() {
  // Validación de permisos y flujo sin enviar alerta real.
  var props = PropertiesService.getScriptProperties();
  var target = parseFloat(props.getProperty('REVENUE_DAILY_TARGET') || '50');
  var revenue = getRevenueToday_();
  var decision = decideAlert_(revenue, target, ALERT_THRESHOLD);
  Logger.log('[DRY-RUN] revenue=$' + revenue.toFixed(2) +
    ' | objetivo=$' + target.toFixed(2) +
    ' | línea=$' + decision.line.toFixed(2) +
    ' | alerta=' + decision.alert);
}
