# Reconciliación financiera REAL — Google Play

**Fecha de captura:** 2026-10-02
**Estado:** DATOS VERIFICADOS, NO PLACEHOLDERS.
**Objetivo que este documento reemplaza:** las estimaciones de `docs/analytics-growth-plan.md` (Play = 0 transacciones, 0 revenue) y las cifras derivadas del catálogo en `scripts/bots/data/offers.json`.

---

## 0. Procedencia de los datos (auditable y reproducible)

| Elemento | Valor |
|---|---|
| Bucket | `gs://pubsite_prod_7178773232285214747` |
| Service account | `projects/playstore.json` → `cha0smagick-labs@cha0smagick-labs.iam.gserviceaccount.com` |
| Proyecto GCP | `cha0smagick-labs` |
| Scopes usados | `devstorage.read_only` |
| Método | Firmado JWT RS256 nativo (Node `crypto`), sin dependencias de Python |
| Objetos `earnings/` | 9 zips: `earnings_202512_18013092-1.zip` … `earnings_202608_18013092-9.zip` |
| Objetos `sales/` | 11 zips: `salesreport_202512.zip` … `salesreport_202610.zip` |
| CSV interno earnings | `PlayApps_YYYYMM.csv`, 28 columnas |
| CSV interno sales | `salesreport_YYYYMM.csv`, 26 columnas |
| Actualizados más recientemente | `sales/salesreport_202610.zip` y `salesreport_202609.zip` → **2026-10-02** (hoy) |

### Corrección de bug en el repositorio

`projects/scripts/play-financial-fetch.py` construye el bucket como
`pubsite_prod_rev_7188773232285214747` (línea 8 + línea 23).

Ese bucket **devuelve HTTP 404 "The specified bucket does not exist."** — verificado en los 5 prefijos (`""`, `earnings/`, `sales/`, `orders/`, `stats/`).

`projects/scripts/play-sales-report.py` tiene el mismo problema estructural: `find_rev_bucket()` filtra buckets que empiezan por `pubsite_prod_rev_` y, al no encontrar ninguno, retorna `None` → el script aborta con `[ERROR]`.

**Todos los datos están en UN SOLO bucket no-rev: `pubsite_prod_7178773232285214747`.**
Ningún script del repositorio puede funcionar tal como está escrito. Hay que corregir la constante del bucket en ambos.

---

## 1. EARNINGS REPORT — neto real por mes

El informe de earnings separa cada movimiento económico en filas independientes que comparten el mismo `Description` (referencia de orden `GPA.xxxx-xxxx-xxxx-xxxx`).
**Neto de una orden = suma de `Amount (Merchant Currency)` de todas sus filas.**
Los tipos de transacción observados son: `Charge`, `Google fee`, `Charge refund`, `Google fee refund`, `Tax`, `Tax refund`. `Service Fee %` = 15 en todas las filas. `Merchant Currency` = USD en todas.

| Mes | Cargos | Reembolsos | Fee Google | Impuestos (IVA CO) | **NETO USD** | Unidades | AOV bruto |
|---|---:|---:|---:|---:|---:|---:|---:|
| 202512 | 4.07 | 0.00 | -1.22 | -0.23 | **2.62** | 1 | 4.07 |
| 202601 | 16.05 | 0.00 | -4.81 | -0.46 | **10.78** | 4 | 4.01 |
| 202602 | 7.98 | -3.99 | -1.20 | -0.23 | **2.56** | 2 | 3.99 |
| 202603 | 27.47 | 0.00 | -8.25 | -1.56 | **17.66** | 7 | 3.92 |
| 202604 | 83.26 | -17.71 | -19.67 | -4.34 | **41.54** | 15 | 5.55 |
| 202605 | 48.20 | 0.00 | -10.57 | -1.73 | **35.90** | 9 | 5.36 |
| 202606 | 169.58 | -7.94 | -24.27 | -2.62 | **134.75** | 35 | 4.85 |
| 202607 | 144.79 | -15.07 | -19.48 | -3.70 | **106.54** | 26 | 5.57 |
| 202608 | 141.29 | -11.10 | -19.56 | -1.78 | **108.85** | 24 | 5.89 |
| **TOTAL** | **642.69** | **-55.81** | **-120.68** | **-17.53** | **461.20** | **123** | **5.23** |

**Derivados:**
- Neto acumulado 9 meses: **$461,20**
- Promedio mensual: **$51,24**
- Mejor mes: 202606 → **$134,75**
- Último mes liquidado: 202608 → **$108,85**
- **Take-rate efectivo: 28,2 %** (15 % Google + reembolsos + retención IVA Colombia)
- **Neto por orden: $3,75**

---

## 2. SALES REPORT — órdenes reales

`Financial Status = Charged`. Este informe **solo trae la moneda local**, no tiene columna USD, por lo que se usa para volumen, no para importe.

| Mes | Órdenes | Desglose de monedas |
|---|---:|---|
| 202512 | 1 | MXN:1 |
| 202601 | 4 | USD:1 EUR:2 AUD:1 |
| 202602 | | USD:2 |
| 202603 | 7 | USD:3 MXN:2 COP:1 SGD:1 |
| 202604 | 15 | EUR:4 TWD:1 MXN:1 USD:4 COP:1 CAD:2 CLP:1 BRL:1 |
| 202605 | 9 | USD:4 CAD:2 KRW:1 EUR:1 CRC:1 |
| 202606 | 35 | EUR:10 AUD:3 USD:12 GBP:3 CHF:2 COP:1 MXN:1 PLN:1 INR:1 PEN:1 |
| 202607 | 25 | USD:21 PEN:1 AUD:1 JPY:1 GBP:1 |
| 202608 | 25 | USD:9 EUR:10 INR:1 RSD:1 NZD:1 THB:2 MXN:1 |
| 202609 | 34 | BRL:3 USD:17 MXN:3 GBP:4 EGP:1 AUD:2 RON:1 COP:1 EUR:2 |
| 202610 | 2 | MXN:1 EUR:1 |
| **TOTAL** | **159** | |

**Discrepancia explicada y no es un error:** 159 órdenes (sales) vs 123 unidades (earnings). La diferencia son 36 órdenes (34 en 202609 + 2 en 202610) que aún **no han sido liquidadas** — el informe de earnings va aproximadamente un mes retrasado.

- Estimación 202609: 34 × $3,75 = **~$127,50 netos** (estimación, no cifra reportada)
- 202610 son solo los 1-2 primeros días del mes.

---

## 3. Ventas por aplicación (periodo completo 202512–202608)

| Paquete | Título real en Play | Unidades | Bruto USD | Neto USD |
|---|---|---:|---:|---:|
| com.app.goetiansealsgeneratorapp | Magickal Seals Generator | 48 | 186.85 | **144.95** |
| com.cha0smagick.unofficialraiderwaite | Tarot Rider-Waite Complete | 15 | 138.71 | **108.45** |
| com.cha0smagick.sigilgeneratorfinal | Goetian Seals Generator | 21 | 72.08 | **56.50** |
| com.cha0smagicklabs.noctemapp | NOCTEM Tools: Ghost Hunting | 5 | 60.57 | **50.63** |
| com.japps.norse_oracle | Norse Rune Oracle | 9 | 32.00 | **22.86** |
| com.cha0smagicklabs.astralchart | Astral Lab: Natal Chart | 5 | 28.03 | **23.02** |
| com.cha0smagick.dreammachine | Dreamachine: Lucid Dreaming | 6 | 23.84 | **19.68** |
| com.cha0smagicklabs.zenercards | PSI GYM: Train Your Intuition | 7 | 20.82 | **17.16** |
| com.lunarapp.app | Moon Phases & Lunar Calendar | 3 | 12.01 | **9.98** |
| com.app.ichingoracle | I Ching Oracle | 4 | 11.97 | **9.11** |
| **TOTAL** | | **123** | **586.88** | **461.20** |

### Hallazgos que contradicen el catálogo

1. **AOV real ($5,23) es PEOR que el AOV estimado del catálogo ($6,66).** Las estimaciones previas eran optimistas.
2. **Dos apps con cero ventas en 9 meses:** `com.cha0smagicklabs.eerieroads` (Eerie Roads, $9,99) y `com.cha0smagicklabs.luciddreamer` (Lucid Dream, $9,99). Cero unidades.
3. **El precio alto no compra volumen:** NOCTEM a $14,99 → 5 unidades en 9 meses. El generador de sellos a $3,99 → 48 unidades.
4. **Los títulos en Play no coinciden con los del catálogo web:** "Magickal Seals Generator" y "Goetian Seals Generator" son nombres distintos a los títulos de `scripts/bots/data/offers.json`.
5. **Concentración:** 3 apps = 71 % del neto (144,95 + 108,45 + 56,50 = 309,90 de 461,20).

---

## 4. Estado de la conexión Hotmart

### 4.1 No existe integración programática

- Ningún archivo del repositorio llama a la API REST de Hotmart (`api.hotmart.com`, `payments/list`, endpoints de SmartAPI). **No hay forma de leer ingresos de Hotmart por código.**
- `scripts/webhook-receiver.js` (38 menciones de hotmart) depende de `HOTMART_WEBHOOK_SECRET`, que está **vacío** en `.env.example` y **ausente** en `.env`. El receptor nunca ha validado un solo evento firmado real.
- `.env` real contiene únicamente: `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHANNEL`, `TELEGRAM_GROUP_INVITE`, `DISCORD_CLIENT_ID`, `DISCORD_CLIENT_SECRET`, `DISCORD_BOT_TOKEN`, `GROQ_API_KEY`, `MAILERLITE_API_KEY`, `CARTO_API_KEY`.
  **Cero credenciales de Hotmart. Cero credenciales de GA4.** (Las de Play viven en `projects/playstore.json`, no en `.env`.)
- Anomalía a revisar: `MAILERLITE_API_KEY` tiene 988 caracteres. Una API key normal mide 40–80. Probablemente se pegó un JSON en la variable equivocada.

### 4.2 Checkouts que SÍ existen en el sitio (remediado: sí hay URLs reales)

| Checkout | Ocurrencias | Dónde |
|---|---:|---|
| `https://pay.hotmart.com/D104270399P?checkoutMode=2` | 51 | apps (artículos del blog de apps) |
| `https://pay.hotmart.com/W106595764X?...book_codex...` | 1 por artículo | libro Codex Chaoticum |
| `https://pay.hotmart.com/J106598345U?...book_tarot...` | 1 por artículo | libro de Tarot |
| `https://hotmart.com/es/marketplace/productos/bundle-todos-los-libros-esp/V107097103W` | código `V107097103W` en 382 archivos | bundle de libros |
| `https://pay.hotmart.com/D93257466P` | mencionado | `checklist-ventas.html` L125, descrito como "el checkout del bundle" |

**Nota de precisión:** el `1234567890XXXXXXX` que aparece en `checklist-ventas.html` L199 **no** es un checkout placeholder — es el ejemplo de formato del **ID del pixel** de Hotmart ("Copiar el ID real del pixel"). No es una credencial faltante.

**Discrepancia a resolver por el owner:** el código del bundle aparece como `V107097103W` (marketplace) en 382 archivos, pero `checklist-ventas.html` apunta a `pay.hotmart.com/D93257466P` como su checkout. Son dos identificadores distintos para lo que el checklist describe como el mismo producto.

---

## 5. Consecuencias para el objetivo de $5.000/mes

| Métrica | Valor verificado |
|---|---|
| Neto Play liquidationado (9 meses) | $461,20 |
| Neto Play mensual promedio | $51,24 |
| Neto Play último mes cerrado (202608) | $108,85 |
| Estimación 202609 (no liquidada) | ~$127,50 |
| Ingresos Hotmart | **DESCONOCIDOS — sin credencial y sin integración** |
| **Ingreso mensual conocido** | **~$110–130** |
| **Gap a $5.000** | **~39–46×**, no 4× |

La aritmética anterior ("751 ventas/mes a AOV $6,66") estaba basada en los precios declarados en el catálogo. El dato real es **AOV $5,23 bruto / $3,75 neto** con **25–34 ventas/mes**. El cambio de escala requerido es de ~30–40×, no de 7–30×.

### La conclusión operativa no cambia, pero el número es peor

Subir el AOV sigue siendo la palanca de mayor apalancamiento, pero la base que hay que multiplicar es mucho más pequeña de lo asumido. Con $3,75 netos por orden:
- $5.000/mes → **1.334 órdenes/mes** → ~44 órdenes/día netas
- Con un bundle de $29,99 (neto ~$21 tras comisión Hotmart) → ~238 ventas/mes → ~8/día
- Con un bundle de $49,99 (neto ~$35) → ~143 ventas/mes → ~5/día

Seguir buscando "nº1 en buscadores" no cierra este gap a la escala observada: el blog acumula 132.029 vistas históricas totales frente a los miles de sesiones cualificadas mensuales que harían falta. El posicionamiento es necesario a mediano plazo; hoy no es el cuello de botella.

---

## 6. Estado de la auditoría (qué sigue bloqueado)

**Resuelto con esta captura:**
- P0-04 (exports financieros de Play) → **RESUELTO para Google Play**. Falta Hotmart.
- Baseline de ingresos reales → **DISPONIBLE y verificable**.

**Sigue bloqueado, requiere acción del owner:**
- Ingresos Hotmart: hace falta un export de `app.hotmart.com → Mi cuenta → Transacciones`, o un token de API de Hotmart (`X-HOTMART-API-TOKEN`) en `.env`, o el secreto del webhook en `HOTMART_WEBHOOK_SECRET`.
- GA4: `GA4_PROPERTY_ID`, `GA4_CLIENT_ID`, `GA4_MP_API_SECRET` siguen vacíos. 19 eventos instrumentados, ninguno ha llegado a GA4.
- `net_price` unificado Play + Hotmart: no se puede definir hasta tener el lado Hotmart.

**Correcciones de código pendientes (concretas y verificables):**
1. `projects/scripts/play-financial-fetch.py` L8 y L23: cambiar el bucket a `pubsite_prod_7178773232285214747`.
2. `projects/scripts/play-sales-report.py` L41-53: eliminar la dependencia de `pubsite_prod_rev_` y usar el bucket fijo.
3. `projects/scripts/play-orders.py` L32-33: `com.cha0smagick.unofficialraiderwaite` está duplicado en `PACKAGES`.