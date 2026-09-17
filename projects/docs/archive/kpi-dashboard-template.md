# KPI DASHBOARD TEMPLATE — GOOGLE SHEETS (SOLO HOTMART + GOOGLE PLAY)

> **Instrucciones:**
> 1. Crear nueva Google Sheet: `Cha0smagick_72H_KPIs`
> 2. Crear 5 pestañas: `DASHBOARD`, `RAW_MAILERLITE`, `RAW_HOTMART`, `RAW_PLAY_CONSOLE`, `RAW_GA4`, `LOG`
> 3. **NO HAY PESTAÑA STRIPE** — Pagos solo vía Hotmart (libros, bundles, suscripciones) + Google Play (apps, bundles)
> 4. Copiar fórmulas abajo en celdas correspondientes
> 5. Configurar Apps Script para auto-import (ver sección AUTOMATIZACIÓN)
> 6. Compartir: View only → Link en Telegram bot `/kpi`

---

## PESTAÑA 1: DASHBOARD (Vista principal)

### ENCABEZADOS (Fila 1)
| A | B | C | D | E | F | G | H | I | J | K | L | M | N |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| **Métrica** | **H0** | **H4** | **H8** | **H12** | **H16** | **H20** | **H24** | **H28** | **H32** | **H36** | **H40** | **H44** | **H48** |

### DATOS (Filas 2-20)
| Row | Métrica | Fórmula / Fuente |
|-----|---------|------------------|
| 2 | **Revenue Total (USD)** | `=SUMIFS(RAW_HOTMART!E:E, RAW_HOTMART!A:A, ">="&$B$1) + SUMIFS(RAW_PLAY_CONSOLE!E:E, RAW_PLAY_CONSOLE!A:A, ">="&$B$1)` |
| 3 | **Revenue Apps - Google Play (USD)** | `=SUMIFS(RAW_PLAY_CONSOLE!E:E, RAW_PLAY_CONSOLE!A:A, ">="&$B$1)` |
| 4 | **Revenue Libros/Bundles/Subs - Hotmart (USD)** | `=SUMIFS(RAW_HOTMART!E:E, RAW_HOTMART!A:A, ">="&$B$1)` |
| 5 | **Revenue Flash Sale (USD)** | `=SUMIFS(RAW_HOTMART!E:E, RAW_HOTMART!C:C, "flash-sale-99", RAW_HOTMART!A:A, ">="&$B$1)` |
| 6 | **Target Revenue** | `500` (H24), `2000` (H48), `5000` (H72) — *actualizar manual por columna* |
| 7 | **% Target** | `=IF(B6>0, B2/B6, 0)` → Formato % |
| 8 | **Suscriptores Totales** | `=COUNTA(UNIQUE(FILTER(RAW_MAILERLITE!B:B, RAW_MAILERLITE!A:A>=$B$1)))` |
| 9 | **Nuevos Suscriptores (período)** | `=COUNTIFS(RAW_MAILERLITE!A:A, ">="&$B$1, RAW_MAILERLITE!A:A, "<"&$C$1)` |
| 10 | **Open Rate (Quickstart Seq)** | `=AVERAGEIFS(RAW_MAILERLITE!E:E, RAW_MAILERLITE!D:D, "Quickstart*")` → Formato % |
| 11 | **Click Rate (Quickstart Seq)** | `=AVERAGEIFS(RAW_MAILERLITE!F:F, RAW_MAILERLITE!D:D, "Quickstart*")` → Formato % |
| 12 | **Ventas Apps - Play Console (unidades)** | `=COUNTIFS(RAW_PLAY_CONSOLE!A:A, ">="&$B$1, RAW_PLAY_CONSOLE!A:A, "<"&$C$1)` |
| 13 | **Ventas Libros/Bundles/Subs - Hotmart (unidades)** | `=COUNTIFS(RAW_HOTMART!A:A, ">="&$B$1, RAW_HOTMART!A:A, "<"&$C$1)` |
| 14 | **Bundle Apps Vendidos (Play)** | `=COUNTIFS(RAW_PLAY_CONSOLE!C:C, "bundle_complete_apps", RAW_PLAY_CONSOLE!A:A, ">="&$B$1)` |
| 15 | **Bundle Libros Vendidos (Hotmart)** | `=COUNTIFS(RAW_HOTMART!C:C, "bundle-todos-los-libros", RAW_HOTMART!A:A, ">="&$B$1)` |
| 16 | **Complete Access Vendidos (Hotmart)** | `=COUNTIFS(RAW_HOTMART!C:C, "complete-access", RAW_HOTMART!A:A, ">="&$B$1)` |
| 17 | **Inner Circle Members (Hotmart Subs)** | `=COUNTIFS(RAW_HOTMART!C:C, "inner-circle-monthly", RAW_HOTMART!A:A, ">="&$B$1) + COUNTIFS(RAW_HOTMART!C:C, "inner-circle-founding", RAW_HOTMART!A:A, ">="&$B$1)` |
| 18 | **Flash Sale Units (Hotmart)** | `=COUNTIFS(RAW_HOTMART!C:C, "flash-sale-99", RAW_HOTMART!A:A, ">="&$B$1)` |
| 19 | **Afiliados Activos (ventas>0)** | `=COUNTUNIQUE(FILTER(RAW_HOTMART!F:F, RAW_HOTMART!E:E>0, RAW_HOTMART!A:A>=$B$1))` |
| 20 | **Comisiones Afiliados (USD)** | `=SUMIFS(RAW_HOTMART!G:G, RAW_HOTMART!A:A, ">="&$B$1)` |
| 21 | **CAC Estimado (USD)** | `=IF(B12+B13>0, (B20*0.5)/ (B12+B13), 0)` *(assuming 50% commission = marketing cost)* |

### FORMATOS CONDICIONALES (Aplicar a fila 2-7, columnas B-N)
| Regla | Fórmula | Formato |
|-------|---------|---------|
| 🔴 ALERTA PLAN B | `=AND(COLUMN()>=COLUMN($H$1), $B$2 < $B$6*0.6)` | Fondo rojo #F87171, texto blanco, negrita |
| 🟡 ADVERTENCIA | `=AND(COLUMN()>=COLUMN($H$1), $B$2 < $B$6*0.8)` | Fondo ámbar #FFB03A, texto navy |
| 🟢 ON TRACK | `=AND(COLUMN()>=COLUMN($H$1), $B$2 >= $B$6*0.8)` | Fondo verde #4ADE80, texto navy |

### GRÁFICOS (Insertar → Chart)
1. **Revenue vs Target** (Combo chart): Barras Revenue + Línea Target
2. **Funnel**: Suscriptores → Opens → Clicks → Ventas
3. **Daily Revenue** (Line): H0-H72
4. **Sources Pie**: **Google Play Apps** vs **Hotmart Libros/Bundles/Subs** vs **Affiliates**

---

## PESTAÑA 2: RAW_MAILERLITE (Importar via Apps Script)

**Columnas:** A=Timestamp, B=Email, C=Group, D=Campaign, E=Opened (TRUE/FALSE), F=Clicked (TRUE/FALSE), G=UTM_Source, H=UTM_Medium, I=UTM_Campaign, J=UTM_Content

**Apps Script (Extensiones → Apps Script):**
```javascript
function importMailerLite() {
  const ss = SpreadsheetApp.getActive();
  const sheet = ss.getSheetByName('RAW_MAILERLITE');
  const apiKey = PropertiesService.getScriptProperties().getProperty('MAILERLITE_API_KEY');
  const groupId = PropertiesService.getScriptProperties().getProperty('MAILERLITE_GROUP_ID');
  
  if (!apiKey || !groupId) {
    Logger.log('Missing API key or Group ID in Script Properties');
    return;
  }
  
  const url = `https://api.mailerlite.com/api/v2/groups/${groupId}/subscribers`;
  const options = {
    method: 'get',
    headers: { 'X-MailerLite-ApiKey': apiKey },
    muteHttpExceptions: true
  };
  
  const response = UrlFetchApp.fetch(url, options);
  const data = JSON.parse(response.getContentText());
  
  if (data.subscribers) {
    const rows = data.subscribers.map(sub => [
      new Date(sub.date_subscribe),      // A Timestamp
      sub.email,                          // B Email
      sub.groups?.map(g => g.name).join(', '), // C Groups
      '',                                 // D Campaign (llenar via webhook)
      false,                              // E Opened
      false,                              // F Clicked
      '', '', '', ''                      // G-J UTM
    ]);
    
    if (rows.length > 0) {
      sheet.getRange(2, 1, rows.length, 10).setValues(rows);
      // Remove duplicates by email
      const range = sheet.getRange(2, 1, sheet.getLastRow()-1, 10);
      range.removeDuplicates([2]); // Column B = Email
    }
  }
}

// Trigger: Cada 4 horas
function createTrigger() {
  ScriptApp.newTrigger('importMailerLite')
    .timeBased()
    .everyHours(4)
    .create();
}
```

---

## PESTAÑA 3: RAW_HOTMART (Import manual CSV diario → Apps Script opcional)

**Columnas:** A=Date, B=Order_ID, C=Product_ID, D=Product_Name, E=Amount_USD, F=Affiliate_ID, G=Commission_USD, H=Customer_Email, I=UTM_Source, J=UTM_Medium, K=UTM_Campaign, L=UTM_Content

**Product_IDs a trackear:**
- `codex-chaoticum`, `tarot-del-caos`, `servidores-magicos`, `libreria-lv`, `magia-caos-practica`
- `bundle-todos-los-libros`, `complete-access`, `inner-circle-monthly`, `inner-circle-founding`, `flash-sale-99`

**Import manual:** Hotmart → Sales → Export CSV → File → Import → Append to sheet

**Apps Script (opcional - Hotmart API requiere approval):**
```javascript
function importHotmart() {
  // Hotmart API requiere OAuth2 + approval. Usar import manual CSV diario.
  // O usar webhook → Google Sheets directo (ver webhook config en webhooks/webhook-configs.md).
}
```

---

## PESTAÑA 4: RAW_PLAY_CONSOLE (Import manual CSV semanal)

**Columnas:** A=Date, B=Order_ID, C=Product_ID, D=Product_Name, E=Amount_USD, F=Country, G=Device, H=UTM_Source, I=UTM_Medium, J=UTM_Campaign, K=UTM_Content

**Product_IDs a trackear:**
- `bundle_complete_apps`, `sigil-generator`, `noctem`, `lucid-dream`, `astral-lab`, `dreamachine`, `psi-gym`, `eerie-roads`, `rune-reader`, `tarot-chaos`, `iching`, `goetia-guide`

**Import:** Play Console → Statistics → Financial → Export CSV → Import

---

## PESTAÑA 5: RAW_GA4 (Eventos clave via GA4 Data API)

**Columnas:** A=Date, B=Event_Name, C=Event_Count, D=Total_Users, E=Revenue_USD, F=UTM_Source, G=UTM_Medium, H=UTM_Campaign, I=UTM_Content

**Eventos a trackear:** `begin_checkout`, `purchase`, `generate_lead`, `scroll_90`, `video_complete`

**Apps Script (GA4 Data API - requiere service account):**
```javascript
function importGA4() {
  // Requiere Google Cloud Project + GA4 Data API enabled + Service Account JSON
  // Usar connector nativo: Extensiones → Google Analytics → Connect
  // O export manual: GA4 → Reports → Export → Import
}
```

---

## PESTAÑA 6: LOG (Registro manual cada 4h)

**Columnas:** A=Timestamp, B=Hour, C=Action_Taken, D=Revenue_Now, E=Subs_Now, F=Sales_Apps, G=Sales_Books, H=Notes, I=Next_Action

**Ejemplo filas:**
| Timestamp | Hour | Action_Taken | Revenue_Now | Subs_Now | Sales_Apps | Sales_Books | Notes | Next_Action |
|-----------|------|--------------|-------------|----------|------------|-------------|-------|-------------|
| 2026-09-03 20:00 | H0 | Plan created, starting TASK-0.1 | $0 | 0 | 0 | 0 | MailerLite form deploy | TASK-0.2 Hotmart affiliates |
| 2026-09-03 20:30 | H0.5 | TASK-0.1 done, TASK-0.2 done | $0 | 0 | 0 | 0 | Form live, affiliates 50% | TASK-0.3 Play Bundle |
| ... | ... | ... | ... | ... | ... | ... | ... | ... |

---

## AUTOMATIZACIÓN TELEGRAM BOT (/kpi + /flash commands)

En `bot.py` ya incluidos:
- `/kpi` → Lee `kpi_snapshot.json` generado por Apps Script
- `/flash` → Guía activación Plan B

**Apps Script para generar JSON (ejecutar cada 4h):**
```javascript
function exportKPISnapshot() {
  const ss = SpreadsheetApp.getActive();
  const dash = ss.getSheetByName('DASHBOARD');
  const hour = Math.floor((new Date() - new Date(dash.getRange('B1').getValue())) / 3600000);
  
  const snapshot = {
    hour: hour,
    revenue: dash.getRange('B2').getValue(),
    target: dash.getRange('B6').getValue(),
    pct_target: dash.getRange('B7').getValue(),
    subscribers: dash.getRange('B8').getValue(),
    new_subs: dash.getRange('B9').getValue(),
    open_rate: dash.getRange('B10').getValue(),
    click_rate: dash.getRange('B11').getValue(),
    sales_apps: dash.getRange('B12').getValue(),
    sales_books: dash.getRange('B13').getValue(),
    bundle_apps: dash.getRange('B14').getValue(),
    bundle_books: dash.getRange('B15').getValue(),
    complete_access: dash.getRange('B16').getValue(),
    inner_circle: dash.getRange('B17').getValue(),
    flash_sale: dash.getRange('B18').getValue(),
    active_affiliates: dash.getRange('B19').getValue()
  };
  
  const file = DriveApp.getFileById('KPI_SNAPSHOT_FILE_ID');
  file.setContent(JSON.stringify(snapshot, null, 2));
}
```

---

## ALERTAS AUTOMÁTICAS (Apps Script — cada 4h)

```javascript
function checkAlerts() {
  const ss = SpreadsheetApp.getActive();
  const dash = ss.getSheetByName('DASHBOARD');
  const hour = Math.floor((new Date() - new Date(dash.getRange('B1').getValue())) / 3600000);
  const revenue = dash.getRange('B2').getValue();
  
  let target = 0;
  if (hour <= 24) target = 500;
  else if (hour <= 48) target = 2000;
  else target = 5000;
  
  if (revenue < target * 0.6 && hour >= 12) {
    MailApp.sendEmail({
      to: Session.getActiveUser().getEmail(),
      subject: `🚨 ALERTA H${hour}: Revenue $${revenue.toFixed(2)} vs Target $${target} (${(revenue/target*100).toFixed(0)}%)`,
      htmlBody: `
        <h2>⚠️ ACTIVAR PLAN B</h2>
        <p>Revenue actual: <strong>$${revenue.toFixed(2)}</strong></p>
        <p>Target H${hour}: <strong>$${target}</strong></p>
        <p>Porcentaje: <strong>${(revenue/target*100).toFixed(0)}%</strong> (umbral 60%)</p>
        <hr>
        <h3>Acciones inmediatas (SOLO HOTMART + GOOGLE PLAY):</h3>
        <ol>
          <li>Lanzar Flash Sale $99 en Hotmart (producto: flash-sale-99, stock 20)</li>
          <li>Activar Meta Ads $100/día → Lookalike 1% Purchasers</li>
          <li>Email blast a lista completa: "FLASH SALE 72h" (CTA: Link Hotmart)</li>
          <li>Telegram broadcast + Pin + /flash command</li>
        </ol>
        <p><a href="${ss.getUrl()}">Abrir Dashboard</a></p>
      `
    });
  }
}
```

---

## CONFIGURACIÓN INICIAL (Checklist)

- [ ] Crear Google Sheet con 6 pestañas: `DASHBOARD`, `RAW_MAILERLITE`, `RAW_HOTMART`, `RAW_PLAY_CONSOLE`, `RAW_GA4`, `LOG`
- [ ] Pegar fórmulas en DASHBOARD (filas 2-21)
- [ ] Configurar Apps Script Properties: `MAILERLITE_API_KEY`, `MAILERLITE_GROUP_ID` (NO Stripe)
- [ ] Crear triggers: `importMailerLite` (4h), `exportKPISnapshot` (4h), `checkAlerts` (4h)
- [ ] Importar CSVs iniciales Hotmart/Play Console a `RAW_HOTMART`/`RAW_PLAY_CONSOLE`
- [ ] Test `/kpi` y `/flash` en Telegram bot
- [ ] Compartir Sheet (View only) → Link en bot description
- [ ] Documentar en LOG primera fila H0