# PLAN DE SUPERVIVENCIA 72H — CHA0SMAGICK LABS
**Objetivo:** $5,000 USD en 72 horas | **Inicio:** AHORA | **Estado:** EJECUCIÓN INMEDIATA

---

## 📋 RESUMEN EJECUTIVO

| Activo | Precio | Comisión Afiliado | Estado |
|--------|--------|-------------------|--------|
| 11 Apps Android (Google Play) | $3.50–$12.50 c/u | N/A (directo) | ✅ Publicadas |
| 7 Libros PDF (Hotmart) | $3.99–$29.99 (bundle 50% off) | 50% | ✅ Publicados |
| Lead Magnet (Quickstart PDF) | Gratis | — | ✅ Existente |
| Telegram Community | @magiacaoticacoven | — | ✅ Existente |
| Email Capture | MailerLite | — | ✅ **Confirmado activo** |

**Gaps críticos a cerrar HOY:**
- ❌ Bundle Apps en Google Play ($29.99)
- ❌ Secuencia email 5 días automatizada
- ❌ Landing pages bridge con countdown
- ❌ Bot Telegram programado
- ❌ Programa afiliados Hotmart activado + creatives
- ❌ Upsells post-compra automatizados
- ❌ Dashboard KPIs tiempo real

---

## 🎯 METAS POR HITO

| Hito | Hora | Revenue Target | Suscriptores | Ventas Apps | Ventas Libros | Afiliados | Inner Circle |
|------|------|----------------|--------------|-------------|---------------|-----------|--------------|
| **H0** | 0 | $0 | 0 | 0 | 0 | 0 | 0 |
| **H24** | 24 | **$500** | 100 | 20 | 15 | 5 | 0 |
| **H48** | 48 | **$2,000** | 300 | 60 | 50 | 15 | 10 |
| **H72** | 72 | **$5,000** | 500 | 150 | 120 | 30 | 50 |

> **REGLA DE ORO:** Si a H24 revenue < $300 → ACTIVAR PLAN B (Flash Sale + $100 Meta Ads)

---

## ⚡ FASE 0: FUNDAMENTOS TÉCNICOS (HORAS 0-4) — **EJECUTAR YA**

### TASK-0.1: Verificar MailerLite + Configurar Formulario Lead Magnet
- [ ] **0.1.1** Entrar a MailerLite → Forms → Verificar formulario "Quickstart Guide" existe
- [ ] **0.1.2** Si NO existe: Create Form → "Quickstart Guide Download" → Fields: Email + Hidden "source=quickstart_pdf"
- [ ] **0.1.3** Copiar código embed (JavaScript) → Pegar en `cha0smagicklabs.com/lead-magnet` ANTES del botón descarga
- [ ] **0.1.4** Configurar Automation: Trigger "When subscriber completes form" → Group "Quickstart Downloaders"
- [ ] **0.1.5** Test: Incógnito → Descargar PDF → Verificar aparece en Subscribers con tag "quickstart"
- [ ] **0.1.6** Configurar Double Opt-in: Settings → Email confirmation → Customize → Redirigir a `/gracias-quickstart` (crear página simple)

**Tiempo:** 30 min | **Crítico:** SÍ | **Dependencia:** Ninguna

---

### TASK-0.2: Activar Hotmart Affiliate Program (50% Commission)
- [ ] **0.2.1** Hotmart → Products → Seleccionar cada producto → Tab "Affiliates" → Enable
- [ ] **0.2.2** Set Commission: **50%** para todos (bundle y individuales)
- [ ] **0.2.3** Cookie Duration: **30 días** (máximo permitido)
- [ ] **0.2.4** Approval Mode: **Automatic** (para velocidad)
- [ ] **0.2.5** Generar Affiliate Links: Copiar link único por producto → Guardar en `affiliate-links.txt`
- [ ] **0.2.6** Crear página `/afiliados` en web: Beneficios + Link registro + Creatives pack (ver TASK-2.3)

**Tiempo:** 20 min | **Crítico:** SÍ | **Dependencia:** Ninguna

---

### TASK-0.3: Crear Bundle Apps en Google Play Console
- [ ] **0.3.1** Play Console → App bundle (cualquiera) → Monetization → Products → In-app products
- [ ] **0.3.2** Create Product → Managed product → ID: `bundle_complete_apps`
- [ ] **0.3.3** Name: "Complete Apps Collection (11 Apps)" | Description: "All 11 occult apps: Sigil Generator, NOCTEM, Lucid Dream, Astral Lab, Dreamachine, PSI GYM, Eerie Roads, Rune Reader, Tarot Chaos, I Ching, Goetia Guide. Save 60% vs individual."
- [ ] **0.3.4** Price: **$29.99 USD** (COP ~120,000) | Activate
- [ ] **0.3.5** Repetir para cada app individual si no existen managed products (verificar)
- [ ] **0.3.6** Test purchase: License testers → Comprar bundle → Verificar entrega

**Tiempo:** 45 min | **Crítico:** SÍ | **Dependencia:** Play Console access

---

### TASK-0.4: Deploy Meta Pixel + Google Ads Tag + GA4 Events
- [ ] **0.4.1** Meta Events Manager → Create Pixel → "Cha0smagick Labs" → Copy Pixel ID
- [ ] **0.4.2** Google Ads → Tools → Conversions → New → Website → "Purchase" → Copy Conversion ID + Label
- [ ] **0.4.3** GA4 → Admin → Data Streams → Web → Enhanced Measurement ON
- [ ] **0.4.4** En `cha0smagicklabs.com` (head): Pegar Meta Pixel + Google Ads + GA4 (gtag.js)
- [ ] **0.4.5** Eventos custom en botones CTA:
  ```javascript
  // Botón "Get Complete Bundle"
  gtag('event', 'begin_checkout', { currency: 'USD', value: 29.99, items: [{item_id: 'bundle_complete_apps'}]});
  fbq('track', 'InitiateCheckout', {content_ids: ['bundle_complete_apps'], value: 29.99, currency: 'USD'});
  ```
- [ ] **0.4.6** Test: Chrome → Tag Assistant / Facebook Pixel Helper → Verificar fires

**Tiempo:** 30 min | **Crítico:** SÍ | **Dependencia:** Acceso edición web

---

### TASK-0.5: Webhook Hotmart → MailerLite (Compra = Tag + Secuencia)
- [ ] **0.5.1** MailerLite → Integrations → Webhooks → Create → URL: `https://api.mailerlite.com/api/v2/subscribers/[ID]/groups` (usar Zapier/Make gratis si no hay dev)
- [ ] **0.5.2** Hotmart → Tools → Webhooks → New → URL: (Make/Zapier webhook) → Events: `PURCHASE_COMPLETE`, `PURCHASE_REFUNDED`
- [ ] **0.5.3** Make/Zapier Scenario:
  - Trigger: Hotmart Webhook
  - Filter: `product_id` matches (apps O libros)
  - Action 1: MailerLite → Add/Update Subscriber → Email from payload → Tag: `buyer_apps` OR `buyer_books` + Group: `Customers`
  - Action 2: Delay 1h → MailerLite → Add to Sequence: "Post-Purchase Upsell" (ver TASK-1.3)
- [ ] **0.5.4** Test: Compra real $1 (reembolsable) → Verificar tag en MailerLite

**Tiempo:** 45 min | **Crítico:** SÍ | **Dependencia:** Make/Zapier free account

---

### TASK-0.6: Crear 3 Landing Pages Bridge (Carrd.co Free)
- [ ] **0.6.1** Carrd.co → New Site → Template "One Page" × 3
- [ ] **0.6.2** Página 1: `apps-bundle.cha0smagicklabs.com` (o subpath)
  - Headline: "Las 11 Apps Ocultas Completas — $29.99 (Ahorra $45)"
  - Bullet: 4.7★ · 128+ reviews · 100% Offline · 7-Day Guarantee
  - Countdown Timer: 24h (script simple JS)
  - CTA: "GET BUNDLE NOW" → Link Play Store bundle + UTM
  - Trust: Screenshots apps + Testimonio real
- [ ] **0.6.3** Página 2: `books-bundle.cha0smagicklabs.com`
  - Headline: "7 Grimorios Digitales — 50% OFF Solo 24h"
  - Lista libros + Cover images
  - CTA: "GET BOOKS BUNDLE" → Hotmart bundle link + UTM
- [ ] **0.6.4** Página 3: `complete-access.cha0smagicklabs.com` (Upsell post-compra)
  - Headline: "¿Quieres TODO? Apps + Libros = $49.99 (Solo 12h)"
  - CTA: "UPGRADE NOW" → **Hotmart Product: complete-access ($49.99)**
- [ ] **0.6.5** Publish → Custom domain o subdominio → SSL auto

**Tiempo:** 60 min | **Crítico:** SÍ | **Dependencia:** Carrd account

---

## 📧 FASE 1: AUTOMATIZACIÓN EMAIL + UPSELLS (HORAS 4-12)

### TASK-1.1: Crear Secuencia Email "Quickstart → Buyer" (5 Emails)
**En MailerLite: Automation → New Workflow → "Quickstart to Buyer"**

| Email | Delay | Subject | CTA Único | Contenido Clave |
|-------|-------|---------|-----------|-----------------|
| **E1** | Inmediato | "Tu Quickstart está listo 📜" | Descargar PDF | PS: "La app **Sigil Generator** automatiza el Paso 3 del ritual → [Link App Store]" |
| **E2** | 6h | "El error #1 en sigilos (y cómo evitarlo)" | Ver NOCTEM $12.50 | Case study: "Cómo detecté 3 entidades en mi casa" + Screenshot app + Link |
| **E3** | 24h | "Cómo validé mi intuición con datos" | Ver PSI GYM $? | Screenshot 4.7★ + "Entrené 10 min/día × 30 días = resultados medibles" |
| **E4** | 36h | "El grimorio que desearía tener a los 20" | Ver Codex Chaoticum | "500+ páginas, 5 métodos sigilos, servidores, bibliografía APA" + Link bundle libros 50% off |
| **E5** | 48h | "⏰ 24h: Complete Collection -$40" | Ver Complete Bundle $29.99 | "11 Apps + 7 Libros = $49.99 total. Oferta expira en 24h." + Countdown |

- [ ] **1.1.1** Crear cada email en MailerLite → Templates → Drag & Drop
- [ ] **1.1.2** Configurar Automation: Trigger "Group: Quickstart Downloaders" → Sequence con delays arriba
- [ ] **1.1.3** Añadir UTM a TODOS los links: `?utm_source=mailerlite&utm_medium=email&utm_campaign=quickstart_seq&utm_content=e1_cta`
- [ ] **1.1.4** Test completo: Unirse a grupo → Recibir 5 emails en timestamps correctos

**Tiempo:** 90 min | **Crítico:** SÍ | **Dependencia:** TASK-0.1 completado

---

### TASK-1.2: Crear Secuencia "Post-Purchase Upsell" (3 Emails)
**Trigger: Tag `buyer_apps` OR `buyer_books` (via Webhook TASK-0.5)**

| Email | Delay | Subject | Lógica Upsell |
|-------|-------|---------|---------------|
| **U1** | 1h | "¡Gracias! Tu [PRODUCTO] está listo 🎁" | Cross-sell: Si compró app → oferta libro relacionado 50% off / Si libro → oferta app relacionada 50% off |
| **U2** | 24h | "¿Sabes qué potencia tus resultados 3x?" | Bundle complementario: Apps bundle si compró libro / Libros bundle si compró app |
| **U3** | 48h | "Última oportunidad: Complete Access $49.99" | Oferta final: Todo (Apps + Libros) con countdown 12h |

- [ ] **1.2.1** Crear 2 versiones por email (apps-buyer / books-buyer) → Usar Liquid/conditional en MailerLite
- [ ] **1.2.2** Links con UTM: `utm_source=mailerlite&utm_medium=email&utm_campaign=post_purchase_upsell`
- [ ] **1.2.3** Test: Compra test → Verificar secuencia correcta disparada

**Tiempo:** 60 min | **Crítico:** SÍ | **Dependencia:** TASK-0.5 completado

---

### TASK-1.3: Configurar Telegram Bot "Oferta Diaria" (Oracle Cloud Free Tier)
- [ ] **1.3.1** Crear cuenta Oracle Cloud Free Tier → Launch Instance → Ubuntu 22.04 Micro (Always Free)
- [ ] **1.3.2** SSH → Install: `python3`, `pip`, `python-telegram-bot`, `apscheduler`, `requests`
- [ ] **1.3.3** Crear bot: `@BotFather` → `/newbot` → "Cha0smagick Daily" → Username `cha0smagick_daily_bot` → Copy Token
- [ ] **1.3.4** Código bot (`bot.py`):
  ```python
  import asyncio, os, random
  from telegram import Bot
  from apscheduler.schedulers.asyncio import AsyncIOScheduler
  
  TOKEN = os.getenv("TG_TOKEN")
  CHANNEL = "@magiacaoticacoven"
  bot = Bot(TOKEN)
  
  OFFERS = [
      {"text": "🔮 NOCTEM: Cazafantasmas pro — COP 50k\n👉 https://play.google.com/store/apps/details?id=com.cha0smagicklabs.noctemapp&utm_source=telegram&utm_medium=bot&utm_campaign=daily_noctem", "img": "noctem.jpg"},
      {"text": "🌙 Lucid Dream: Proyección Astral — COP 30.5k\n👉 https://play.google.com/store/apps/details?id=com.cha0smagicklabs.luciddreamer&utm_source=telegram&utm_medium=bot&utm_campaign=daily_lucid", "img": "lucid.jpg"},
      {"text": "📚 BUNDLE 7 Libros — 50% OFF\n👉 https://hotmart.com/es/marketplace/productos/bundle-todos-los-libros-esp/V107097103W?sck=HOTMART_SITE&utm_source=telegram&utm_medium=bot&utm_campaign=daily_books", "img": "bundle.jpg"},
      {"text": "🎯 PSI GYM: Entrena tu intuición — COP ?\n👉 https://play.google.com/store/apps/details?id=com.cha0smagicklabs.psigym&utm_source=telegram&utm_medium=bot&utm_campaign=daily_psi", "img": "psi.jpg"},
      {"text": "⭐ Testimonio: 'NOCTEM me salvó en una investigación real' — 4.7★\n👉 https://cha0smagicklabs.com/testimonios", "img": "testimonial.jpg"},
  ]
  
  async def send_offer():
      offer = random.choice(OFFERS)
      await bot.send_photo(chat_id=CHANNEL, photo=open(offer["img"], "rb"), caption=offer["text"])
  
  scheduler = AsyncIOScheduler()
  scheduler.add_job(send_offer, 'cron', hour='9,14,21', timezone='America/Bogota')  # 3x/día
  scheduler.start()
  asyncio.get_event_loop().run_forever()
  ```
- [ ] **1.3.5** Subir imágenes a servidor / Imgur → URLs en código
- [ ] **1.3.6** Systemd service para auto-restart:
  ```ini
  # /etc/systemd/system/cha0s-bot.service
  [Unit]
  Description=Cha0smagick Telegram Bot
  After=network.target
  
  [Service]
  Type=simple
  User=ubuntu
  WorkingDirectory=/home/ubuntu/cha0s-bot
  ExecStart=/usr/bin/python3 bot.py
  Restart=always
  Environment=TG_TOKEN=tu_token_aqui
  
  [Install]
  WantedBy=multi-user.target
  ```
- [ ] **1.3.7** `sudo systemctl enable --now cha0s-bot` → Verificar logs: `journalctl -u cha0s-bot -f`

**Tiempo:** 60 min | **Crítico:** MEDIO | **Dependencia:** Oracle Cloud account

---

## 📈 FASE 2: TRÁFICO ORGÁNICO ESCALADO (HORAS 12-36) — PARALELO DIARIO

### TASK-2.1: Blog SEO — 3 Artículos/Día × 3 Días (Ghost.org Free)
- [ ] **2.1.1** Setup: `blog.cha0smagicklabs.com` en Ghost.org (gratis 14 días trial, luego $9/mes o self-host)
- [ ] **2.1.2** Configurar IndexNow (Bing/Google) → Auto-ping en publish
- [ ] **2.1.3** **DÍA 1 (H12-24):** Escribir y publicar:
  - Art 1: "How to Create Sigils That Actually Work: 5 Proven Methods" (target: "sigil creation", "chaos magic sigils")
  - Art 2: "Lucid Dreaming Techniques for Beginners: The WILD Method Explained" (target: "lucid dreaming techniques", "astral projection")
  - Art 3: "ESP Training: Scientific Approaches to Developing Intuition" (target: "ESP training", "psychic development exercises")
- [ ] **2.1.4** **DÍA 2 (H24-48):**
  - Art 4: "Chaos Magic for Beginners: Complete Starter Guide" (target: "chaos magic for beginners", "chaos magick tutorial")
  - Art 5: "Rune Divination: Complete Guide to Elder Futhark Meanings" (target: "rune reading", "rune divination guide")
  - Art 6: "Astral Projection Dangers & Safety: What Nobody Tells You" (target: "astral projection dangers", "safe astral travel")
- [ ] **2.1.5** **DÍA 3 (H48-72):**
  - Art 7: "Tarot vs I Ching: Which Divination System Is Right for You?" (target: "tarot vs iching", "divination comparison")
  - Art 8: "Ghost Hunting Equipment: What Actually Works vs Marketing" (target: "ghost hunting tools", "paranormal investigation equipment")
  - Art 9: "Building Your Digital Grimoire: Apps vs Paper for Modern Magicians" (target: "digital grimoire", "occult apps")
- [ ] **2.1.6** CADA ARTÍCULO: Lead magnet CTA en intro + medio + final → Link `/lead-magnet` con UTM `utm_source=blog&utm_medium=organic&utm_campaign=seo_content`

**Tiempo:** 2h/día | **Crítico:** SÍ | **Dependencia:** Ghost setup

---

### TASK-2.2: YouTube Shorts — 1 Short/Día × 3 Días
- [ ] **2.2.1** Grabar pantalla app (30s): Demo feature clave + "Link en bio para descargar"
- [ ] **2.2.2** Editar CapCut: Subtítulos + Música baja + CTA final "Cha0smagick Labs - Link en bio"
- [ ] **2.2.3** Upload: Título SEO + Hashtags: `#chaosmagick #sigils #luciddreaming #astralprojection #occult`
- [ ] **2.2.4** Bio link: `cha0smagicklabs.com` (o Linktree con utm_source=youtube_shorts)
- [ ] **2.2.5** Shorts programados: Día 1 (NOCTEM), Día 2 (Lucid Dream), Día 3 (Sigil Generator)

**Tiempo:** 30 min/día | **Crítico:** MEDIO | **Dependencia:** CapCut + YouTube Studio

---

### TASK-2.3: Reddit — 10 Comments/Día de Valor (Manual, No Bot)
- [ ] **2.3.1** Subreddits objetivo: r/chaosmagick, r/occult, r/luciddreaming, r/astralprojection, r/paranormal, r/psychic, r/witchcraft, r/magick, r/energy_work, r/tulpas
- [ ] **2.3.2** Estrategia: Responder preguntas REALES con expertise → "Uso NOCTEM para registrar EVPs en investigaciones, la app filtra ruido automáticamente. Si buscas [tema], mi guía gratis cubre esto: [link lead magnet]"
- [ ] **2.3.3** Perfil Reddit: Bio con link `cha0smagicklabs.com` + "Frater Alek0s - Cha0smagick Labs"
- [ ] **2.3.4** Tracking: Hoja Google Sheets → Date | Subreddit | Post URL | Comment | Upvotes | Clicks (GA4)

**Tiempo:** 45 min/día | **Crítico:** MEDIO | **Dependencia:** Cuenta Reddit con karma >50

---

### TASK-2.4: Pinterest — 5 Pins/Día × 3 Días (Canva + Tailwind Free)
- [ ] **2.4.1** Canva → Templates "Pinterest Pin" → Brand kit: Navy #0B1026, Amber #FFB03A, Cyan #35C4D9
- [ ] **2.4.2** Crear 15 pins (5/día):
  - 5 Sigil templates (img + "Free sigil guide →")
  - 3 Dream journal pages (img + "Lucid dreaming guide →")
  - 3 Natal chart examples (img + "Free astrology guide →")
  - 2 Tarot spreads (img + "Tarot meanings PDF →")
  - 2 "Chaos magic starter kit" (img + bundle link)
- [ ] **2.4.3** Tailwind Schedule: 5 pins/día espaciados 3h → Board "Chaos Magick & Occult" + Group boards relevantes
- [ ] **2.4.4** Cada pin: Link → `cha0smagicklabs.com/lead-magnet?utm_source=pinterest&utm_medium=organic&utm_campaign=pin_[tema]`

**Tiempo:** 30 min/día | **Crítico:** BAJO | **Dependencia:** Canva + Tailwind accounts

---

### TASK-2.5: Google Play ASO — Optimización Una Vez (H12)
- [ ] **2.5.1** Play Console → Cada app → Store Listing → Main store listing
- [ ] **2.5.2** Title: Añadir keyword principal (ej: "NOCTEM: Ghost Hunting Tools & EVP Recorder")
- [ ] **2.5.3** Short Description (80 chars): "Herramientas cazafantasmas pro: EVP, EMF, Spirit Box. 100% offline."
- [ ] **2.5.4** Full Description: Estructura:
  - Hook (1 línea)
  - Features bullet (keywords: ghost hunting, EVP recorder, EMF detector, spirit box, paranormal investigation)
  - Social proof: "4.7★ 128+ reviews"
  - Guarantee: "7-day refund"
  - CTA: "Download now"
- [ ] **2.5.5** Keywords backend (Store listing → Custom store listings): sigil generator, lucid dream, astral projection, ESP training, ghost hunting, tarot, I Ching, runes, goetia, chaos magic
- [ ] **2.5.6** Screenshots: Añadir texto overlay en cada: "EVP Recording", "EMF Live Graph", "Spirit Box Session"
- [ ] **2.5.7** Video promo: 30s demo → Upload Feature Graphic

**Tiempo:** 60 min | **Crítico:** SÍ | **Dependencia:** Play Console access

---

## 🤝 FASE 3: AFILIADOS + RECURRENCIA (HORAS 24-72)

### TASK-3.1: Reclutamiento Afiliados Masivo (Automatizado + Manual)
- [ ] **3.1.1** Crear **Affiliate Kit** (carpeta Drive/Notion pública):
  - Swipe copy emails (3 versiones)
  - Swipe copy social (Twitter/IG/Telegram)
  - Banners: 1200x628, 1080x1080, 1080x1920 (Canva templates)
  - Tracking links por producto (UTM: `utm_source=affiliate&utm_medium=partner&utm_campaign=[affiliate_id]`)
  - FAQ: Comisión 50%, cookie 30d, pago Net-30, mínimo $50
- [ ] **3.1.2** Hotmart Affiliate Marketplace: Ya visible al activar TASK-0.2
- [ ] **3.1.3** Outreach manual 50 creators (Apollo.io free 50 credits/mes):
  - Buscar: "chaos magic", "occult", "lucid dreaming", "astral projection", "witchcraft", "tarot"
  - Filtro: 5k-100k followers, engagement >3%
  - Template DM:
    > "Hola [Nombre], sigo tu contenido sobre [tema específico]. Soy Frater Alek0s de Cha0smagick Labs: 11 apps + 7 libros occult tech, 4.7★, 128+ reviews. Programa afiliados 50% commission, cookie 30d, creatives listos. ¿Te interesa probar gratis todo el catálogo? Te doy acceso completo."
- [ ] **3.1.4** Seguimiento: Hoja Sheets → Creator | Contacto | Enviado | Respondido | Registrado | Ventas | Commission

**Tiempo:** 2h inicial + 30 min/día seguimiento | **Crítico:** ALTO | **Dependencia:** Affiliate Kit listo

---

### TASK-3.2: Lanzar "Cha0smagick Inner Circle" — Membresía $19/mes en HOTMART (Recurrencia Real)
- [ ] **3.2.1** Hotmart → Products → New → **Subscription** → "Cha0smagick Inner Circle" → **$19/mes** → Commission 30%
- [ ] **3.2.2** Hotmart → Products → New → **Subscription** → "Inner Circle Founding" → **$9/mes** (locked forever) → Stock: 50 → Commission 30%
- [ ] **3.2.3** Entregables membresía (configurar en área miembros Hotmart + Telegram):
  - Acceso PWA apps (web wrapper - ver TASK-3.4)
  - 1 libro nuevo/mes (PDF exclusivo subido a Hotmart)
  - 1 ritual guiado video/mes (YouTube unlisted + link en Hotmart)
  - Canal Telegram VIP (crear grupo privado `@magiacaoticacoven_vip` + bot invite via Hotmart webhook)
  - 20% descuento futuros lanzamientos
- [ ] **3.2.4** Email Launch (H48): Enviar a TODOS compradores + suscriptores engaged (opens >3)
  - Subject: "🔥 Founding Members: $9/mes para SIEMPRE (Solo 50 plazas)"
  - Body: Beneficios + Countdown 48h + **Link Hotmart: inner-circle-founding**
- [ ] **3.2.5** Telegram Announcement: Pin message en @magiacaoticacoven + Bot broadcast

**Tiempo:** 90 min | **Crítico:** ALTO | **Dependencia:** Hotmart account (NO Stripe)

---

### TASK-3.3: Upsells Post-Compra Específicos (Automatizados via Webhook)
**Mapping producto → Upsell (configurar en Make/Zapier):**

| Compra | Upsell Inmediato (1h) | Upsell 24h | Upsell 48h |
|--------|----------------------|------------|------------|
| NOCTEM ($12.50) | Lucid Dream + Dreamachine Bundle $15 | Apps Bundle $29.99 | Complete Access $49.99 |
| Lucid Dream ($8.50) | Dreamachine $4.50 | Books Bundle 50% off | Complete Access $49.99 |
| Astral Lab ($6.50) | Tarot/I Ching Books Bundle $12 | Apps Bundle $29.99 | Complete Access $49.99 |
| Codex Chaoticum ($15-30) | Sigil Generator App $6 | Apps Bundle $29.99 | Complete Access $49.99 |
| Books Bundle | PSI GYM App $? | Apps Bundle $29.99 | Complete Access $49.99 |

- [ ] **3.3.1** En Make/Zapier: Crear 11 rutas (una por app) + 7 rutas (libros) = 18 paths
- [ ] **3.3.2** Cada ruta: Filter `product_id` → MailerLite Add Tag `upsell_[producto]` → Delay 1h → Send Email Template específico
- [ ] **3.3.3** Templates email upsell: 18 versiones (o dinámico con Liquid)
- [ ] **3.3.4** Test: Compras test cada producto → Verificar emails correctos

**Tiempo:** 120 min | **Crítico:** ALTO | **Dependencia:** TASK-0.5 + Make/Zapier

---

### TASK-3.4: PWA Web Wrapper para Apps (Inner Circle Value Add)
- [ ] **3.4.1** Crear `apps.cha0smagicklabs.com` (subdominio)
- [ ] **3.4.2** PWA Manifest + Service Worker (Workbox) → Cache apps para offline
- [ ] **3.4.3** WebView wrapper: Cada app Android → Versión web simplificada (HTML/JS) con mismas funciones core
  - Prioridad: Sigil Generator, PSI GYM, Rune Reader, Tarot/I Ching (las que NO requieren sensores HW)
- [ ] **3.4.4** Auth: Netlify Identity / Supabase Auth → Solo usuarios con tag `inner_circle` en MailerLite (sync via webhook)
- [ ] **3.4.5** Deploy: Netlify/Vercel Free Tier

**Tiempo:** 3h | **Crítico:** MEDIO | **Dependencia:** Dev time (puede posponerse a post-H72 si apurado)

---

## 📊 FASE 4: DASHBOARD KPIs + MONITOREO (HORA 4 - LUEGO CADA 4H)

### TASK-4.1: Google Sheets Dashboard Auto-Actualizable
- [ ] **4.1.1** Crear Sheet: `Cha0smagick_72H_KPIs`
- [ ] **4.1.2** Pestaña "RAW DATA" → Importar:
  - MailerLite: `=IMPORTJSON("https://api.mailerlite.com/api/v2/groups/[GROUP_ID]/subscribers?api_key=KEY")` (usar Apps Script)
  - Hotmart: Export CSV diario → Import manual o API
  - Play Console: Statistics → Export CSV → Import manual
  - GA4: Admin → DebugView → Events → Export
- [ ] **4.1.3** Pestaña "DASHBOARD" → Fórmulas:
  ```excel
  Revenue_Total = SUMIFS(Revenue_Raw, Date, ">="&START_DATE)
  Subscribers = COUNTUNIQUE(Filter(MailerLite_Raw, Date>START_DATE))
  Open_Rate = AVERAGEIFS(Opens/Sent, Campaign, "Quickstart*")
  Conversion_Rate = Sales_Total / Unique_Clicks
  ```
- [ ] **4.1.4** Conditional Formatting: Revenue H24 < 300 → RED (ALERTA PLAN B)
- [ ] **4.1.5** Compartir: View only → Link en Telegram bot para check rápido

**Tiempo:** 45 min | **Crítico:** SÍ | **Dependencia:** Google Account

---

### TASK-4.2: Alertas Automáticas (Cada 4h)
- [ ] **4.2.1** Apps Script en Sheet → Trigger cada 4h:
  ```javascript
  function checkKPIs() {
    const sheet = SpreadsheetApp.getActive().getSheetByName('DASHBOARD');
    const revenue = sheet.getRange('B2').getValue(); // Celda revenue acumulado
    const hour = new Date().getHours();
    const target = hour <= 24 ? 500 : (hour <= 48 ? 2000 : 5000);
    if (revenue < target * 0.6) { // 60% de target
      MailApp.sendEmail({
        to: 'tu-email@cha0smagicklabs.com',
        subject: `⚠️ ALERTA H${hour}: Revenue $${revenue} vs Target $${target}`,
        body: `Activar Plan B. Flash Sale + Meta Ads $100.`
      });
    }
  }
  ```
- [ ] **4.2.2** Telegram Bot: Añadir comando `/kpi` → Responde snapshot actual

**Tiempo:** 30 min | **Crítico:** MEDIO | **Dependencia:** TASK-4.1

---

## 🚨 PLAN B: ACTIVACIÓN SI H24 REVENUE < $300

### TASK-B.1: Flash Sale "TODO POR $99" (72h Countdown) — SOLO HOTMART + GOOGLE PLAY
- [ ] **B.1.1** Hotmart → Products → New → **Digital Product** → "Flash Sale: Complete Chaos Magick Library" → **$99** → **Stock: 20** → Commission 50%
- [ ] **B.1.2** Landing Page Carrd: `flash.cha0smagicklabs.com` → Countdown 72h + "Solo 20 plazas" + **CTA: Link Hotmart flash-sale-99**
- [ ] **B.1.3** Email Blast: Lista completa MailerLite → Subject: "🚨 FLASH SALE: Todo por $99 (72h only)" → **CTA: Link Hotmart**
- [ ] **B.1.4** Telegram: Broadcast + Pin 72h → **Link Hotmart flash-sale-99**
- [ ] **B.1.5** Meta Ads: $100/día × 3 días → Campaign: "Conversions" → Pixel: Purchase → Audience: Lookalike 1% (Purchasers) + Interests → Creative: Video demo → **Landing: flash.cha0smagicklabs.com (CTA Hotmart)**

**Tiempo activación:** 60 min | **Trigger:** H24 Revenue < $300 | **PAGOS: SOLO HOTMART + GOOGLE PLAY**

---

## 📦 ENTREGABLES TÉCNICOS LISTOS PARA USAR

### Archivos a crear (copiar/pegar → configurar credenciales):

```
cha0smagick-72h/
├── email-sequences/
│   ├── quickstart-to-buyer.json          # Importar MailerLite
│   └── post-purchase-upsell.json         # Importar MailerLite
├── telegram-bot/
│   ├── bot.py                            # Listo para Oracle Cloud
│   ├── cha0s-bot.service                 # Systemd
│   └── images/                           # Subir a Imgur/servidor
├── landing-pages/
│   ├── apps-bundle.html                  # Carrd/Notion copy-paste
│   ├── books-bundle.html
│   └── complete-access.html
├── affiliate-kit/
│   ├── swipe-emails.md                   # 3 versiones
│   ├── swipe-social.md                   # Twitter/IG/Telegram
│   ├── banners-canva-links.txt           # Links templates Canva
│   └── tracking-links.csv                # Producto | UTM Link
├── content-calendar/
│   ├── blog-topics.csv                   # 9 artículos + keywords
│   ├── reddit-targets.csv                # 50 subreddits + search queries
│   └── pinterest-pins.csv                # 15 pins + descriptions
├── kpi-dashboard/
│   └── Cha0smagick_72H_KPIs.gsheet       # Link template (hacer copia)
├── webhooks/
│   ├── hotmart-to-mailerlite.json        # Make/Zapier blueprint
│   └── upsell-router.json                # Make/Zapier 18 paths
└── plan-b/
    ├── flash-sale-landing.html
    └── meta-ads-setup.md                 # Step-by-step
```

---

## ✅ CHECKLIST MAESTRO — MARCAR CADA TASK AL COMPLETAR

### HORAS 0-4 (FASE 0)
- [ ] TASK-0.1 MailerLite Form + Automation
- [ ] TASK-0.2 Hotmart Affiliates 50%
- [ ] TASK-0.3 Google Play Bundle $29.99
- [ ] TASK-0.4 Pixels + GA4 Events
- [ ] TASK-0.5 Webhook Hotmart → MailerLite
- [ ] TASK-0.6 3 Landing Pages Bridge

### HORAS 4-12 (FASE 1)
- [ ] TASK-1.1 Secuencia Quickstart 5 emails
- [ ] TASK-1.2 Secuencia Post-Purchase 3 emails (2 versiones)
- [ ] TASK-1.3 Telegram Bot en Oracle Cloud

### HORAS 12-36 (FASE 2 - DIARIO)
- [ ] DÍA 1: TASK-2.1 (3 posts) + TASK-2.2 (1 Short) + TASK-2.3 (10 comments) + TASK-2.4 (5 pins) + TASK-2.5 (ASO)
- [ ] DÍA 2: TASK-2.1 (3 posts) + TASK-2.2 (1 Short) + TASK-2.3 (10 comments) + TASK-2.4 (5 pins)
- [ ] DÍA 3: TASK-2.1 (3 posts) + TASK-2.2 (1 Short) + TASK-2.3 (10 comments) + TASK-2.4 (5 pins)

### HORAS 24-72 (FASE 3)
- [ ] TASK-3.1 Affiliate Kit + Outreach 50 creators
- [ ] TASK-3.2 Inner Circle $9/mes Founding Launch en HOTMART (H48)
- [ ] TASK-3.3 Upsells 18 paths automatizados (Hotmart + Play Console)
- [ ] TASK-3.4 PWA Web Wrapper (opcional post-H72)

### MONITOREO CONTINUO
- [ ] TASK-4.1 KPI Dashboard Sheets
- [ ] TASK-4.2 Alertas 4h + Telegram /kpi + /flash
- [ ] **CADA 4H:** Revisar Dashboard → Ajustar → Documentar en Sheet "LOG"

### PLAN B (SOLO SI H24 < $300)
- [ ] TASK-B.1 Flash Sale $99 en HOTMART + Meta Ads $100/día

---

## 🔗 ENLACES RÁPIDOS (COMPLETAR AL CREAR)

| Recurso | URL/Link | Estado |
|---------|----------|--------|
| MailerLite Admin | https://app.mailerlite.com | ✅ |
| Hotmart Affiliates | https://hotmart.com/affiliates | ⏳ |
| Hotmart Products (nuevos) | https://hotmart.com/products | ⏳ |
| Play Console | https://play.google.com/console | ⏳ |
| Carrd Sites | https://carrd.co | ⏳ |
| Oracle Cloud | https://cloud.oracle.com | ⏳ |
| Make/Zapier | https://make.com / https://zapier.com | ⏳ |
| Ghost Blog | https://ghost.org | ⏳ |
| KPI Dashboard | [Google Sheets Link] | ⏳ |
| Affiliate Kit | [Notion/Drive Link] | ⏳ |

---

## ⏰ CRONOGRAMA VISUAL

```
H0  ██████████████████████████████████████████████  H4  ██████████████████████████████████████████████  H12
    │ FASE 0: Fundamentos (6 tasks paralelos)     │    │ FASE 1: Email + Bot (3 tasks)              │
    ▼                                               ▼    ▼
H24 ██████████████████████████████████████████████  H36  ██████████████████████████████████████████████  H48
    │ CHECKPOINT: Revenue > $300?                 │    │ FASE 2: Contenido Día 2 (diario)           │
    │ SÍ → Continuar  NO → PLAN B                 │    │ FASE 3: Afiliados + Inner Circle (inicio)  │
    ▼                                               ▼    ▼
H60 ██████████████████████████████████████████████  H72  ██████████████████████████████████████████████
    │ FASE 2: Contenido Día 3                     │    │ CIERRE: Verificar $5,000                   │
    │ FASE 3: Escalar afiliados + Inner Circle    │    │ Documentar aprendizajes                    │
    ▼                                               ▼
```

---

## 🎯 PRÓXIMA ACCIÓN INMEDIATA

**AHORA MISMO:** Ejecutar **TASK-0.1** (MailerLite Form) → **TASK-0.2** (Hotmart Affiliates) → **TASK-0.3** (Play Bundle)

> **NO ESPERAR PERFECCIÓN.** Deploy feo pero funcional > perfecto no deployado.
> Cada hora sin bundle apps = ventas perdidas.
> Cada hora sin email sequence = leads fríos.

---

## 📝 LOG DE EJECUCIÓN (ACTUALIZAR CADA 4H)

| Hora | Tasks Completadas | Revenue | Suscriptores | Ventas | Notas / Ajustes |
|------|-------------------|---------|--------------|--------|-----------------|
| H0   | — | $0 | 0 | 0 | Inicio plan |
| H4   | | | | | |
| H8   | | | | | |
| H12  | | | | | |
| H16  | | | | | |
| H20  | | | | | |
| H24  | | | | | **CHECKPOINT CRÍTICO** |
| H28  | | | | | |
| H32  | | | | | |
| H36  | | | | | |
| H40  | | | | | |
| H44  | | | | | |
| H48  | | | | | **CHECKPOINT** |
| H52  | | | | | |
| H56  | | | | | |
| H60  | | | | | |
| H64  | | | | | |
| H68  | | | | | |
| H72  | | | | | **CIERRE** |

---

**FIN DEL PLAN — EJECUCIÓN INMEDIATA REQUERIDA**

*Documento vivo: Actualizar checkboxes, timestamps, y métricas en tiempo real.*
*Si una task falla > 30 min → Documentar en LOG → Escalar a alternativa → Continuar.*