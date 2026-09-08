# CHECKLIST DE EJECUCIÓN 72H — CHA0SMAGICK LABS

> **Objetivo:** $5,000 USD en 72 horas  
> **Inicio:** AHORA  
> **Regla de oro:** Si a H24 revenue < $300 → ACTIVAR PLAN B (Flash Sale + $100 Meta Ads)

---

## 🎯 CRITICAL PATH — ORDEN ESTRICTO

> **NO SALTAR PASOS.** Cada paso habilita el siguiente. Si uno falla, el embudo se rompe.

---

### FASE 0: FUNDAMENTOS (HORAS 0-2) — EJECUTAR YA

#### 1. HOTMART SETUP — 25 min ⭐ CRÍTICO
- [ ] **1.1** Abrir https://app.hotmart.com → Products → My Products
- [ ] **1.2** Crear producto: **Complete Access** — Digital, $99 USD, One-time, 50% aff, Warranty 7d
  - Subir 7 PDFs + instrucciones Apps Bundle (ver HOTMART_SETUP_MANUAL.md)
- [ ] **1.3** Crear producto: **Inner Circle Monthly** — Subscription, $19/mes, 30% aff, Warranty 7d
- [ ] **1.4** Crear producto: **Inner Circle Founding** — Subscription, $9/mes, Stock 50, Hidden, 30% aff
- [ ] **1.5** Crear producto: **Flash Sale 99** — Digital, $99, Stock 20, DRAFT + Hidden, 50% aff
- [ ] **1.6** Activar **Affiliates 50%** en: 7 libros existentes + Complete Access + Flash Sale 99
- [ ] **1.7** Activar **Affiliates 30%** en: Inner Circle Monthly + Inner Circle Founding
- [ ] **1.7** Configurar **Cookie 30 días** + **Approval: Automatic** en TODOS
- [ ] **1.8** Webhook: Tools → Webhooks → New → URL Make.com + HMAC Secret
  - Events: PURCHASE_APPROVED, PURCHASE_REFUNDED, SUBSCRIPTION_CREATED, SUBSCRIPTION_CANCELLED
- [ ] **1.9** Test: Compra real $1 (reembolsable) → Verificar Order ID en Make.com + MailerLite tag

#### 2. DEPLOY 14 NUEVAS HERRAMIENTAS — 15 min
- [ ] **2.1** Verificar que existen en `tools/`:
  - `zener-esp-trainer.html`
  - `reality-check-tracker.html`
  - `gnosis-timer.html`
  - `sigil-charging-timer.html`
  - `planetary-kamea-sigil.html`
  - `goetic-spirit-selector.html`
  - `rune-drawer.html`
  - `tarot-yes-no.html`
  - `planetary-hours.html`
  - `moon-voc.html`
  - `iching-changing-lines.html`
  - `sigil-generator.html` (fixear si es iframe HuggingFace)
  - `sigil-charging-timer.html`
  - `planetary-kamea-sigil.html`
- [ ] **2.2** Deploy a hosting (GitHub Pages / Netlify / actual)
- [ ] **2.3** Verificar cada URL carga: `https://cha0smagicklabs.com/tools/zener-esp-trainer.html`
- [ ] **2.4** Actualizar `sitemap.xml` con 14 nuevas URLs
- [ ] **2.5** Ping IndexNow para cada URL nueva

#### 3. MAILERLITE SETUP — 20 min
- [ ] **3.1** Automation → Import `email-sequences/quickstart-to-buyer.json` → "Quickstart to Buyer"
- [ ] **3.2** Automation → Import `email-sequences/post-purchase-upsell.json` → "Post-Purchase Upsell"
- [ ] **3.3** Groups → Create: `Customers`, `App Users`, `Inner Circle`, `VIP Customers`
- [ ] **3.4** Forms → Verificar "Quickstart Guide Download" existe con field `source=quickstart_pdf`
- [ ] **3.5** Integrations → Webhooks → URL Make.com → Trigger: "When subscriber completes form"
- [ ] **3.6** Test: Incógnito → Descargar lead magnet → Verificar en Subscribers con tag "quickstart"

#### 4. MAKE.COM WEBHOOKS — 45 min
- [ ] **4.1** Scenario **"Hotmart_to_MailerLite"**:
  - Webhook (Hotmart) → Router (product_id) → MailerLite Add/Update + Add to Sequence → Sheets Log
- [ ] **4.2** Scenario **"Upsell_Router"**:
  - Webhook → Router 18 paths (product_id) → Sleep (1h/23h/47h) → MailerLite Transactional Email → Sheets Log
- [ ] **4.3** Scenario **"Daily_Play_Import"**:
  - Schedule 6:00 AM → HTTP Get CSV (Google Drive) → Parse → MailerLite Add/Update → Sheets Log
- [ ] **4.4** Test cada scenario con datos reales (compra test $1)

#### 5. TELEGRAM BOT DEPLOY — 30 min
- [ ] **5.1** Oracle Cloud Free Tier → Ubuntu 22.04 Micro (Always Free)
- [ ] **5.2** SSH → `sudo apt update && sudo apt install python3 python3-pip python3-venv`
- [ ] **5.3** `python3 -m venv venv && source venv/bin/activate && pip install python-telegram-bot apscheduler aiohttp`
- [ ] **5.4** `@BotFather` → `/newbot` → "Cha0smagick Daily" → Username `cha0smagick_daily_bot` → Copy Token
- [ ] **5.5** Subir `telegram-bot/bot.py` → `/home/ubuntu/cha0s-bot/`
- [ ] **5.6** Subir `telegram-bot/cha0s-bot.service` → `/etc/systemd/system/` (editar TG_TOKEN + ADMIN_USER_ID)
- [ ] **5.7** `sudo systemctl daemon-reload && sudo systemctl enable --now cha0s-bot`
- [ ] **5.8** Test: `/kpi`, `/flash`, `/testpost`, `/status` en bot

#### 6. LANDING PAGES DEPLOY — 15 min
- [ ] **6.1** Carrd.co / Netlify / hosting → Deploy 4 páginas:
  - `apps-bundle.cha0smagicklabs.com` (CTA → Play Store bundle)
  - `books-bundle.cha0smagicklabs.com` (CTA → Hotmart bundle libros)
  - `complete-access.cha0smagicklabs.com` (CTA → Hotmart complete-access)
  - `flash.cha0smagicklabs.com` (CTA → Hotmart flash-sale-99)
- [ ] **6.2** Actualizar CTAs con **URLs REALES** de Hotmart/Play Store
- [ ] **6.3** Verificar Meta Pixel + GA4 events en botones CTA

#### 7. KPI DASHBOARD — 20 min
- [ ] **7.1** Google Sheets → Nueva: `Cha0smagick_72H_KPIs`
- [ ] **7.2** 6 pestañas: `DASHBOARD`, `RAW_MAILERLITE`, `RAW_HOTMART`, `RAW_PLAY_CONSOLE`, `RAW_GA4`, `LOG`
- [ ] **7.3** Copiar fórmulas de `kpi-dashboard/kpi-dashboard-template.md` a `DASHBOARD`
- [ ] **7.4** Extensiones → Apps Script → Properties: `MAILERLITE_API_KEY`, `MAILERLITE_GROUP_ID`
- [ ] **7.5** Triggers: `importMailerLite` (4h), `exportKPISnapshot` (4h), `checkAlerts` (4h)
- [ ] **7.6** Test: `/kpi` en Telegram bot → Verificar snapshot JSON

#### 8. PLAY CONSOLE — 10 min
- [ ] **8.1** Play Console → App cualquiera → Monetization → Products → In-app products
- [ ] **8.2** Create Product → Managed product → ID: `bundle_complete_apps` → $29.99 USD
- [ ] **8.3** Verificar 11 apps individuales tienen managed products activos
- [ ] **8.4** Test: License testers → Comprar bundle → Verificar entrega

#### 9. CONTENIDO DÍA 1 — 2 horas
- [ ] **9.1** Artículo 1: "How to Create Sigils That Actually Work: 5 Proven Methods"
  - Keywords: "sigil creation", "chaos magic sigils", "austin osman spare sigils"
  - Lead magnet CTA ×3 (intro, medio, final) → UTM `utm_source=blog&utm_medium=organic&utm_campaign=seo_content`
- [ ] **9.2** Artículo 2: "Lucid Dreaming Techniques for Beginners: The WILD Method Explained"
  - Keywords: "lucid dreaming techniques", "wild method lucid dreaming", "astral projection techniques"
- [ ] **9.3** Artículo 3: "ESP Training: Scientific Approaches to Developing Intuition"
  - Keywords: "esp training", "psychic development exercises", "remote viewing training"
- [ ] **9.4** Cada artículo: Ping IndexNow tras publicar
  - `curl -X POST "https://api.indexnow.org/indexnow" -H "Content-Type: application/json" -d '{"host":"cha0smagicklabs.com","key":"TU_KEY","urlList":["URL_ARTICULO"]}'`

#### 10. SOCIAL DÍA 1 — 45 min
- [ ] **10.1** YouTube Short: NOCTEM demo (30s) → "Link en bio" → `cha0smagicklabs.com`
  - Hashtags: `#chaosmagick #sigils #luciddreaming #astralprojection #occult`
- [ ] **10.2** Reddit: 10 comentarios de valor en:
  - r/chaosmagick, r/occult, r/luciddreaming, r/astralprojection, r/paranormal
  - r/psychic, r/witchcraft, r/magick, r/energy_work, r/tulpas
  - Perfil: Bio con link `cha0smagicklabs.com` + "Frater Alek0s"
- [ ] **10.3** Pinterest: 5 pins (Canva + Tailwind):
  - Sigil methods infographic → Link lead magnet
  - WILD technique steps → Link lead magnet
  - Zener cards protocol → Link lead magnet
  - Rune meanings chart → Link lead magnet
  - Tarot vs I Ching table → Link lead magnet

---

## 📊 H24 CHECKPOINT — HORA 24 ⭐ DECISIÓN CRÍTICA

| Métrica | Target H24 | Acción si NO cumple |
|---------|------------|---------------------|
| **Revenue** | > $300 | → ACTIVAR PLAN B (Flash Sale + Meta Ads $100/día) |
| **Suscriptores** | > 100 | Revisar lead magnet + email capture |
| **Ventas Apps** | > 10 | Revisar Play Console bundle + CTAs |
| **Ventas Libros** | > 8 | Revisar Hotmart bundle + CTAs |
| **Open Rate** | > 40% | Revisar subject lines + deliverability |

> **Si Revenue < $300 a H24 → EJECUTAR PLAN B INMEDIATO** (ver abajo)

---

## 🚨 PLAN B — FLASH SALE $99 (SOLO SI H24 < $300)

> **Tiempo activación:** 60 min máx | **Duración:** 72h desde activación

- [ ] **B.1** Hotmart: Activar producto `flash-sale-99` (DRAFT → ACTIVE, Hidden → Visible)
- [ ] **B.2** Deploy `flash.cha0smagicklabs.com` (Carrd) con countdown 72h + slots 20
- [ ] **B.3** Email Blast: MailerLite → Campaign → Lista completa → Subject: "🚨 FLASH SALE 72h: Todo por $99"
- [ ] **B.4** Telegram: Broadcast + Pin en @magiacaoticacoven + `/flash` command
- [ ] **B.5** Meta Ads Manager:
  - Campaign: `Cha0smagick_FlashSale_PlanB` → Objective: Sales → Pixel: Purchase
  - Budget: $100/día × 3 días (Lifetime $300)
  - Ad Set: Lookalike 1% (Purchasers 180d) + Interests: "Occult", "Chaos Magic", "Lucid Dreaming", "Tarot", "Paranormal"
  - Creatives: Video demo apps + "Flash Sale $99" + CTA "Shop Now"
- [ ] **B.6** Monitoreo cada 2h: CPL, CPA, ROAS, Frequency, Slots restantes

---

## 📈 MONITOREO CONTINUO (CADA 4H)

| Hora | Acción | Dónde |
|------|--------|-------|
| H4, H8, H12, H16, H20 | Revisar Dashboard KPIs | Google Sheets + Telegram `/kpi` |
| H4, H8, H12, H16, H20 | Actualizar LOG en Sheets | Pestaña `LOG` |
| H4, H8, H12, H16, H20 | Verificar alertas email | Revisar inbox "ALERTA HXX" |
| H24 | **CHECKPOINT CRÍTICO** | Decidir Plan B vs Continuar |
| H28, H32, H36, H40, H44 | Monitoreo + Contenido Día 2 | Artículos 4-6 + Social |
| H48 | **CHECKPOINT** | Revenue > $2,000? |
| H52, H56, H60, H64, H68 | Monitoreo + Contenido Día 3 | Artículos 7-9 + Social |
| H72 | **CIERRE** | Verificar $5,000 + Documentar |

---

## 📝 LOG DE EJECUCIÓN (ACTUALIZAR CADA 4H)

| Hora | Tasks Completadas | Revenue | Suscriptores | Ventas Apps | Ventas Libros | Notas / Ajustes |
|------|-------------------|---------|--------------|-------------|---------------|-----------------|
| H0 | Plan creado, iniciando | $0 | 0 | 0 | 0 | Inicio |
| H4 | | | | | | |
| H8 | | | | | | |
| H12 | | | | | | |
| H16 | | | | | | |
| H20 | | | | | | |
| **H24** | | | | | | **CHECKPOINT CRÍTICO** |
| H28 | | | | | | |
| H32 | | | | | | |
| H36 | | | | | | |
| H40 | | | | | | |
| H44 | | | | | | |
| **H48** | | | | | | **CHECKPOINT** |
| H52 | | | | | | |
| H56 | | | | | | |
| H60 | | | | | | |
| H64 | | | | | | |
| H68 | | | | | | |
| **H72** | | | | | | **CIERRE FINAL** |

---

## 🔗 ENLACES RÁPIDOS (COMPLETAR AL CREAR)

| Recurso | URL/Link | Estado |
|---------|----------|--------|
| MailerLite Admin | https://app.mailerlite.com | ☐ |
| Hotmart Products | https://app.hotmart.com/products | ☐ |
| Hotmart Affiliates | https://app.hotmart.com/affiliates | ☐ |
| Hotmart Webhooks | https://app.hotmart.com/tools/webhooks | ☐ |
| Play Console | https://play.google.com/console | ☐ |
| Make.com | https://make.com | ☐ |
| Oracle Cloud | https://cloud.oracle.com | ☐ |
| Carrd Sites | https://carrd.co | ☐ |
| Google Sheets KPI | [Crear] | ☐ |
| Google Apps Script | https://script.google.com | ☐ |
| IndexNow API | https://www.indexnow.org | ☐ |
| Meta Ads Manager | https://business.facebook.com/adsmanager | ☐ |
| Telegram BotFather | https://t.me/BotFather | ☐ |
| Carrd Flash Sale | [Crear] | ☐ |

---

## ⚡ COMANDOS RÁPIDOS TELEGRAM BOT

| Comando | Qué hace |
|---------|----------|
| `/kpi` | Snapshot actual de revenue, subs, ventas, IC, afiliados |
| `/flash` | Guía activación Plan B (Flash Sale + Meta Ads) |
| `/testpost [offer_id]` | Test manual de oferta en canal |
| `/status` | Estado bot + próximas publicaciones |
| `/offers` | Lista todas las ofertas configuradas |

---

## 📂 ARCHIVOS CLAVE (TENER A MANO)

| Archivo | Qué contiene |
|---------|--------------|
| `PLAN_72H_SURVIVAL.md` | Plan maestro completo con todos los tasks |
| `HOTMART_SETUP_MANUAL.md` | Pasos exactos 25 min para Hotmart |
| `CHECKLIST_EJECUCION_72H.md` | **ESTE ARCHIVO** |
| `email-sequences/quickstart-to-buyer.json` | Importar MailerLite |
| `email-sequences/post-purchase-upsell.json` | Importar MailerLite |
| `telegram-bot/bot.py` | Bot completo |
| `telegram-bot/cha0s-bot.service` | Systemd service |
| `landing-pages/*.html` | 4 páginas (Carrd/Netlify) |
| `kpi-dashboard/kpi-dashboard-template.md` | Fórmulas Sheets + Apps Script |
| `webhooks/webhook-configs.md` | 3 scenarios Make.com |
| `affiliate-kit/tracking-links.csv` | 22 productos + UTMs |
| `content-calendar/content-calendar.md` | 9 artículos + Reddit + Pinterest + Shorts |

---

## ⚠️ REGLAS DE ORO (NO ROMPER)

1. **PAGOS:** Solo `hotmart.com` + `play.google.com` — **NINGÚN OTRO**
2. **UTM OBLIGATORIO** en TODO link: `utm_source=X&utm_medium=Y&utm_campaign=Z&utm_content=W`
3. **NO STRIPE** — Eliminado de TODO el sistema
4. **CHECKPOINT H24:** Si revenue < $300 → Plan B **INMEDIATO**
5. **LOG CADA 4H** en Sheets → Revenue, Subs, Ventas, Próxima acción
6. **DEPLOY FEO > PERFECTO NO DEPLOYADO** — Velocidad > Perfección

---

## 🎯 PRÓXIMA ACCIÓN INMEDIATA

> **ABRE `HOTMART_SETUP_MANUAL.md` Y EJECUTA PASOS 1-9 (25 MIN CRONOMETRADOS).**

Todo lo demás depende de esto. Cuando termines, reporta: **"HOTMART DONE — Order ID test: XXXXXX"**

---

**EL RELOJ CORRE. EJECUTA.** ⚡

---

*Documento vivo: Marcar checkboxes, actualizar timestamps, documentar revenue en tiempo real.*
*Si un task falla > 30 min → Documentar en LOG → Escalar alternativa → Continuar.*