# WEBHOOK CONFIGURATIONS — MAKE.COM / ZAPIER

> **Plataforma recomendada:** Make.com (antes Integromat) — Free tier: 1,000 ops/mes, suficientes para inicio
> **Alternativa:** Zapier Free — 100 tasks/mes (puede quedarse corto)

---

## WEBHOOK 1: HOTMART → MAILERLITE (Compra = Tag + Grupo + Secuencia)

### EN MAKE.COM: Crear Scenario "Hotmart_to_MailerLite"

#### 1. MÓDULO 1: WEBHOOK (Trigger)
- **Tipo:** Custom Webhook
- **Webhook URL:** Generada por Make → Copiar → Pegar en Hotmart → Tools → Webhooks → New
- **Método:** POST
- **Data Structure:** JSON
- **Campos esperados (Hotmart standard):**
```json
{
  "event": "PURCHASE_COMPLETE",
  "data": {
    "order": {
      "id": "HP_123456",
      "status": "APPROVED",
      "date": "2026-09-03T20:30:00Z",
      "total_price": { "value": 29.99, "currency": "USD" },
      "buyer": { "email": "user@example.com", "name": "Juan" },
      "items": [
        { "product_id": "bundle_complete_apps", "name": "Complete Apps Bundle", "price": { "value": 29.99 } }
      ]
    }
  }
}
```

#### 2. MÓDULO 2: ROUTER (Filtrar por Product_ID)
- **Ruta A:** `bundle_complete_apps` → Tag `buyer_apps_bundle` + Grupo `Customers` + Secuencia `Post-Purchase Upsell Apps`
- **Ruta B:** `codex-chaoticum`, `tarot-del-caos`, `servidores-magicos`, `libreria-lv`, `magia-caos-practica`, `bundle-todos-libros` → Tag `buyer_books` + Grupo `Customers` + Secuencia `Post-Purchase Upsell Books`
- **Ruta C:** Apps individuales (`sigil-generator`, `noctem`, `lucid-dream`, `astral-lab`, `dreamachine`, `psi-gym`, `eerie-roads`, `rune-reader`, `tarot-chaos`, `iching`, `goetia-guide`) → Tag `buyer_apps` + Grupo `Customers` + Secuencia `Post-Purchase Upsell Apps`
- **Ruta D (Default):** Cualquier otro → Tag `buyer_other` + Grupo `Customers`

#### 3. MÓDULO 3A-3D: MAILERLITE - Add/Update Subscriber (por ruta)
- **Action:** Add or Update Subscriber
- **Email:** `{{1.data.order.buyer.email}}`
- **Name:** `{{1.data.order.buyer.name}}`
- **Groups:** Seleccionar grupo `Customers` (ID desde MailerLite)
- **Fields (Custom):**
  - `last_purchase_date` = `{{1.data.order.date}}`
  - `last_purchase_product` = `{{1.data.order.items[0].product_id}}`
  - `last_purchase_value` = `{{1.data.order.total_price.value}}`
  - `purchase_count` = `{{increment}}` (usar variable almacenada)
- **Tags:** Según ruta (ver arriba)
- **Resubscribe:** Yes

#### 4. MÓDULO 4A-4D: MAILERLITE - Add to Sequence (por ruta)
- **Action:** Add Subscriber to Automation/Sequence
- **Subscriber Email:** `{{1.data.order.buyer.email}}`
- **Automation/Sequence ID:**
  - Ruta A/B/C (Apps): `seq_post_purchase_upsell_apps` (ID desde MailerLite)
  - Ruta B (Libros): `seq_post_purchase_upsell_books`
- **Trigger:** Immediate (o Delay 1h via Sleep module)

#### 5. MÓDULO 5: GOOGLE SHEETS - Log Purchase (Todas las rutas convergen)
- **Action:** Add Row
- **Spreadsheet:** `Cha0smagick_72H_KPIs`
- **Sheet:** `RAW_HOTMART`
- **Values:**
  - A: `{{1.data.order.date}}`
  - B: `{{1.data.order.id}}`
  - C: `{{1.data.order.items[0].product_id}}`
  - D: `{{1.data.order.items[0].name}}`
  - E: `{{1.data.order.total_price.value}}`
  - F: `{{1.data.order.affiliate_id || 'direct'}}`
  - G: `{{1.data.order.total_price.value * 0.5}}` (comisión 50%)
  - H: `{{1.data.order.buyer.email}}`
  - I-K: UTM desde metadata si existe

#### 6. MÓDULO 6: TELEGRAM - Notify Admin (Opcional)
- **Action:** Send Message
- **Chat ID:** Tu user ID o grupo admin
- **Text:**
  ```
  💰 NEW PURCHASE
  👤 {{1.data.order.buyer.email}}
  📦 {{1.data.order.items[0].name}}
  💵 ${{1.data.order.total_price.value}} USD
  🔗 Affiliate: {{1.data.order.affiliate_id || 'direct'}}
  ⏰ {{formatDate(1.data.order.date; 'HH:mm:ss')}}
  ```

---

## WEBHOOK 2: UPSELL ROUTER (18 Paths - Post-Purchase Specific)

> **Estrategia:** Un solo scenario con Router de 18 ramas (11 apps + 7 libros) basado en `product_id` del webhook Hotmart/Play Console

### EN MAKE.COM: Crear Scenario "Upsell_Router"

#### 1. MÓDULO 1: WEBHOOK (Mismo que Webhook 1 o separado para Play Console)
- **Play Console Webhook:** Requiere Cloud Pub/Sub → Cloud Function → Make Webhook (más complejo)
- **Alternativa:** Usar mismo webhook Hotmart + Stripe para todo (Play Console sales → manual log o script diario)

#### 2. MÓDULO 2: ROUTER - 18 RAMAS (Filter por Product_ID)

**RAMAS APPS (buyer_apps):**
| Product_ID | Upsell Inmediato (1h) | Upsell 24h | Upsell 48h |
|------------|----------------------|------------|------------|
| `noctem` | Lucid Dream + Dreamachine Bundle ($15) | Apps Bundle $29.99 | Complete Access $49.99 |
| `lucid-dream` | Dreamachine ($4) | Books Bundle 50% | Complete Access $49.99 |
| `astral-lab` | Tarot/I Ching Books Bundle ($12) | Apps Bundle $29.99 | Complete Access $49.99 |
| `sigil-generator` | Codex Chaoticum ($15) | Apps Bundle $29.99 | Complete Access $49.99 |
| `psi-gym` | Librería LV ($15) | Apps Bundle $29.99 | Complete Access $49.99 |
| `dreamachine` | Tarot del Caos ($12) | Apps Bundle $29.99 | Complete Access $49.99 |
| `eerie-roads` | Servidores Mágicos ($12) | Apps Bundle $29.99 | Complete Access $49.99 |
| `rune-reader` | Codex Chaoticum ($15) | Apps Bundle $29.99 | Complete Access $49.99 |
| `tarot-chaos` | Tarot del Caos Libro ($12) | Apps Bundle $29.99 | Complete Access $49.99 |
| `iching` | Codex Chaoticum ($15) | Apps Bundle $29.99 | Complete Access $49.99 |
| `goetia-guide` | Servidores Mágicos ($12) | Apps Bundle $29.99 | Complete Access $49.99 |

**RAMAS LIBROS (buyer_books):**
| Product_ID | Upsell Inmediato (1h) | Upsell 24h | Upsell 48h |
|------------|----------------------|------------|------------|
| `codex-chaoticum` | Sigil Generator App ($6) | Apps Bundle $29.99 | Complete Access $49.99 |
| `tarot-del-caos` | Tarot Chaos App ($?) | Apps Bundle $29.99 | Complete Access $49.99 |
| `servidores-magicos` | NOCTEM App ($12.50) | Apps Bundle $29.99 | Complete Access $49.99 |
| `libreria-lv` | PSI GYM App ($?) | Apps Bundle $29.99 | Complete Access $49.99 |
| `magia-caos-practica` | Apps Bundle $29.99 | Apps Bundle $29.99 | Complete Access $49.99 |
| `bundle-todos-libros` | Apps Bundle $29.99 | Apps Bundle $29.99 | Complete Access $49.99 |

#### 3. POR CADA RAMA: 3 MÓDULOS SECUENCIALES (Delay + Email + Log)

**MÓDULO A: SLEEP (Delay 1 hora)**
- **Duration:** 3600 seconds

**MÓDULO B: MAILERLITE - Send Transactional Email (Template específico)**
- **Action:** Send Email (Transactional) — *Requiere MailerLite API v2 transactional endpoint*
- **Template ID:** Según mapping (ver `post-purchase-upsell.json`)
- **To:** `{{1.data.order.buyer.email}}`
- **Variables (Merge tags):**
  - `{{product_name}}` = `{{1.data.order.items[0].name}}`
  - `{{upsell_recommendation}}` = Texto dinámico según mapping
  - `{{upsell_url}}` = Link afiliado/tracking según mapping
  - `{{countdown_hours}}` = 48 (U1), 24 (U2), 12 (U3)

**MÓDULO C: SLEEP (Delay 23h para U2 / 47h para U3)**
- **U2 Delay:** 82800 seconds (23h desde compra)
- **U3 Delay:** 172800 seconds (47h desde compra) — *O usar nuevo trigger webhook "24h_post_purchase" programado*

**MÓDULO D: GOOGLE SHEETS - Log Upsell Sent**
- **Sheet:** `RAW_HOTMART` o nueva `UPSELL_LOG`
- **Columns:** Timestamp, Order_ID, Product_ID, Upsell_Stage (U1/U2/U3), Upsell_Product, Email_Sent (Y/N), Opened (pending), Clicked (pending)

---

## WEBHOOK 3: STRIPE → MAILERLITE + TELEGRAM (Inner Circle + Complete Access)

### EN MAKE.COM: Scenario "Stripe_to_All"

#### 1. MÓDULO 1: STRIPE WEBHOOK (Trigger)
- **Events:** `payment_intent.succeeded`, `checkout.session.completed`
- **Stripe Dashboard → Developers → Webhooks → Add endpoint → Make Webhook URL**

#### 2. MÓDULO 2: ROUTER por `metadata.product_id`
- **Ruta A:** `complete_access` → Tag `buyer_complete_access` + Grupo `VIP Customers` + Secuencia `Welcome Complete Access`
- **Ruta B:** `inner_circle` → Tag `inner_circle_member` + Grupo `Inner Circle` + **Telegram Invite Link Generation**

#### 3. RUTA B (Inner Circle) - MÓDULOS ADICIONALES:
- **Telegram Bot API:** `createChatInviteLink` → Chat ID: `@magiacaoticacoven_vip` (grupo privado) → Member limit: 1 → Expire: Never
- **MailerLite:** Add to Group `Inner Circle` + Tag `inner_circle_founding` (si price = 9) / `inner_circle_regular` (price = 19)
- **Google Sheets:** Log en `RAW_STRIPE` + `INNER_CIRCLE_MEMBERS` (Email, Join_Date, Tier, Invite_Link)
- **Telegram Notify Admin:** "🎉 Nuevo Inner Circle Member: {{email}} - Tier: {{tier}}"

---

## CONFIGURACIÓN EN HOTMART

1. **Hotmart → Tools → Webhooks → New Webhook**
   - URL: `[MAKE_WEBHOOK_URL_HOTMART]`
   - Events: ✅ `PURCHASE_COMPLETE` ✅ `PURCHASE_REFUNDED` ✅ `PURCHASE_CANCELLED`
   - Version: `2.0` (latest)
   - Secret: Generar en Make → `Webhook Secret` → Pegar en Hotmart para verificación HMAC

2. **Verificación HMAC en Make (Módulo 1 → Advanced):**
   - Header: `X-Hotmart-Signature`
   - Algorithm: `HMAC-SHA256`
   - Secret: `[TU_WEBHOOK_SECRET]`

---

## CONFIGURACIÓN EN STRIPE

1. **Stripe Dashboard → Developers → Webhooks → Add endpoint**
   - URL: `[MAKE_WEBHOOK_URL_STRIPE]`
   - Events: `payment_intent.succeeded`, `checkout.session.completed`, `customer.subscription.created`, `customer.subscription.deleted`
   - Secret: `whsec_[GENERADO_POR_STRIPE]` → Guardar en Make para verificación

2. **Payment Links Metadata (CRÍTICO):**
   - Complete Access: `product_id=complete_access`, `utm_source=stripe`, `utm_medium=payment_link`, `utm_campaign=complete_access_upsell`
   - Inner Circle $9: `product_id=inner_circle`, `tier=founding`, `price_usd=9`
   - Inner Circle $19: `product_id=inner_circle`, `tier=regular`, `price_usd=19`

---

## TESTING CHECKLIST (Ejecutar ANTES de ir live)

| Test | Cómo verificar | Resultado esperado |
|------|----------------|-------------------|
| Hotmart → Make | Comprar test $1 (reembolsable) | Webhook received en Make → Log en Sheets → Tag en MailerLite |
| MailerLite Tag | Revisar suscriptor en MailerLite | Tags: `buyer_apps` + `buyer_noctem` + Grupo `Customers` |
| Secuencia Upsell | Esperar 1h + 24h + 48h | 3 emails recibidos con contenido correcto por producto |
| Stripe → Make | Comprar Complete Access test | Tag `buyer_complete_access` + Grupo `VIP Customers` |
| Inner Circle | Comprar Inner Circle $9 | Invite link Telegram generado + enviado por email |
| Sheets Log | Revisar RAW_HOTMART / RAW_STRIPE | Filas nuevas con todos los campos poblados |
| Telegram Admin | Verificar notificaciones | Mensajes llegan al chat/grupo admin |

---

## MANEJO DE ERRORES (Make Error Handling)

- **Error Handler en cada módulo:** `Continue` + `Send email to admin` con error details
- **Reprocesar fallidos:** Make → Scenarios → Executions → Filter "Error" → Re-run
- **Dead Letter Queue:** Google Sheet `WEBHOOK_ERRORS` con: Timestamp, Webhook_Type, Payload, Error_Message, Resolved (Y/N)

---

## LÍMITES FREE TIER (Make.com)

| Recurso | Free Tier | Estimado 72h | Acción si excede |
|---------|-----------|--------------|------------------|
| Operations | 1,000/mes | ~200-300 | Upgrade a Core ($9/mes) |
| Data Transfer | 10 MB/mes | ~2 MB | OK |
| Scenarios | 2 activas | 3 necesarias | Consolidar en 1 scenario con Router |
| Webhooks | Ilimitados | 3 | OK |

**Optimización:** Unir Webhook 1 + 2 en un solo scenario con Router principal → Ahorra 1 scenario slot.

---

## ALTERNATIVA ZAPIER (Si prefieres)

**Zaps necesarios:**
1. `Hotmart Purchase → MailerLite Add Subscriber + Tag + Sequence`
2. `Hotmart Purchase → Google Sheets Log`
3. `Stripe Payment → MailerLite + Telegram Invite + Sheets`
4. `Schedule (Daily) → Check KPIs → Email Alert` (para Plan B trigger)

**Límite:** 100 tasks/mes → ~3-4 tasks/venta → ~25 ventas/mes gratis. **Insuficiente para escala. Usar Make.**