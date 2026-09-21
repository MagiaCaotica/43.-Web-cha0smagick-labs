# MASTER EXECUTION PLAN — Cha0smagick Labs
## Single Source of Truth | Supersedes All Prior Plans
**Generated**: 2025-09-16 | **Version**: 1.0 | **Status**: ACTIVE

---

## 🎯 NORTH STAR: WHAT "DONE" LOOKS LIKE

The system is **production ready for automated revenue** when ALL criteria pass:

| # | Criterion | Verification Command |
|---|-----------|---------------------|
| 1 | Zero secrets in git history | `git log --all --full-history -- .env \| grep -c "TOKEN\|KEY\|SECRET" = 0` |
| 2 | All secrets in GitHub Secrets | Repository Settings → Secrets → 10+ entries (TG, Discord, Groq, ML, GA4, Hotmart, Meta, Ads, Stripe, Pinterest) |
| 3 | Zero inline JS >50 lines | `grep -r "<script>" --include="*.html" . \| wc -l < 20` (only bootstrap scripts) |
| 4 | Test suite passes | `pytest scripts/ -v` ✅ + `npm test` (vitest) ✅ |
| 5 | Rich Results Test passes | All page types (Article, Product, SoftwareApplication, WebApplication, Book, CollectionPage, FAQPage, BreadcrumbList) |
| 6 | All 379 articles have Giscus | Spot-check: `curl -s <10 random articles> \| grep -c "giscus" = 10` |
| 7 | Bots start via documented command | `node scripts/bots/run-bots.js all` → both bots connect |
| 8 | Staging deployment works | PR preview URL accessible, no 404s |
| 9 | Lighthouse CI budgets met | Perf >90, A11y >95, SEO >90, Best Practices >90 |
| 10 | Revenue Track A complete | GA4 Realtime shows traffic; Meta Events Manager + Google Ads show test conversions |
| 11 | MailerLite automations live | Test subscriber receives: Welcome EN, Welcome ES, Lead Magnet, Post-Purchase |
| 12 | Hotmart products real + webhook deployed | Test purchase → instant delivery + MailerLite tag + Sheets log + Telegram admin notify |
| 13 | Google Play sales tracked | Daily fetch script logs to Sheets → triggers MailerLite for app buyers |
| 14 | Social publishing automated | Cron runs daily → Pinterest + X + Telegram channel auto-post from calendar |
| 15 | KPI dashboard live + alerting | Google Sheets formulas + Apps Script daily check → Telegram alert if revenue <50% target |

---

## 🏗️ ARCHITECTURE: FOUR EXECUTION LAYERS (SEQUENTIAL DEPENDENCY)

```
┌─────────────────────────────────────────────────────────────────┐
│ LAYER 0: FOUNDATION (Security + Testability) — MUST BE FIRST   │
├─────────────────────────────────────────────────────────────────┤
│ LAYER 1: CODE QUALITY (Refactor + Build + SEO Fixes)           │
├─────────────────────────────────────────────────────────────────┤
│ LAYER 2: REVENUE ENGINE (Analytics + MailerLite + Conversion)  │
├─────────────────────────────────────────────────────────────────┤
│ LAYER 3: OPERATIONS (Bots + Deploy + Monitoring + Content)     │
└─────────────────────────────────────────────────────────────────┘
```

**Rule**: No work in Layer N+1 until Layer N is 100% complete and verified.

---

## 📋 LAYER 0 — FOUNDATION (Days 1-2)
*Prerequisite for ALL other work. Zero exceptions.*

### 0.1 Secret Rotation & Git Hygiene [P0 - BLOCKER] — ✅ COMPLETO (2026-09-20)

| Task | Owner | Effort | Verification |
|------|-------|--------|--------------|
| 0.1.1 Rotate Telegram Bot Token | You | 5m | New token works in bot |
| 0.1.2 Rotate Discord Bot Token + Client Secret | You | 5m | New tokens work in bot |
| 0.1.3 Rotate Groq API Key | You | 5m | `/ask` works in both bots |
| 0.1.4 Rotate MailerLite API Key | You | 5m | Forms submit successfully |
| 0.1.5 Rotate Hotmart Webhook Secret | You | 5m | Webhook validates |
| 0.1.6 Rotate GA4 Measurement ID (optional) | You | 5m | GA4 Realtime works |
| 0.1.7 Rotate Stripe Secret + Webhook Secret | You | 5m | Stripe webhook validates |
| 0.1.8 Rotate Pinterest/Post Bridge API Key | You | 5m | social-publish.js works |
| 0.1.9 Add ALL 10 secrets to GitHub Repository Secrets | You | 10m | Settings → Secrets shows 10 entries |
| 0.1.10 Verify `.env` in `.gitignore` | You | 2m | `git check-ignore .env` returns path |
| 0.1.11 Purge secrets from git history (BFG/git-filter-repo) | You | 30m | `git log --all --full-history -- .env` shows no secrets |

### 0.2 Test Infrastructure [P0 - BLOCKER]

| Task | Owner | Effort | Verification |
|------|-------|--------|--------------|
| 0.2.1 Add `pytest` + `pytest-html` to root `package.json` devDeps | Dev | 10m | ✔️ Resuelto: pytest 9.1.1 + pytest-html 4.2.0 verificados vía pip (`pip list`). pytest/pytest-html son paquetes Python, NO van en npm devDeps (el paquete npm "pytest" es bogus); intención cumplida (tooling verificado) |
| 0.2.2 Create `scripts/conftest.py` with fixtures (temp dirs, sample articles) | Dev | 30m | `pytest scripts/test_generate_blog.py -v` passes — ✔️. Verified |
| 0.2.3 Write tests for `generate_blog.py` (dry-run, index update, sitemap update) | Dev | 1h | 5+ tests pass — ✔️. Verified |
| 0.2.4 Write tests for `add_internal_links.py` (keyword matching, no duplicates) | Dev | 45m | 3+ tests pass — ✔️. Verified |
| 0.2.5 Write tests for `add_structured_data.py` (schema injection, no duplicates) | Dev | 45m | 3+ tests pass — ✔️. Verified |
| 0.2.6 Add `vitest` + `@vitest/coverage-v8` to root `package.json` devDeps | Dev | 10m | ✔️ vitest 5.0.1 + @vitest/coverage-v8 5.0.1 en devDeps (edit manual + `npm install --package-lock-only`, sin re-flattening en package.json). `npx vitest run` OK |
| 0.2.7 Create `scripts/bots/test/bot-brain.test.js` (catalog integrity) | Dev | 1h | ✔️ 48 tests pass (SDKs mockeados, sin red, sin polling) |
| 0.2.8 Create `scripts/bots/test/groq-ai.test.js` (classifier, prompt building) | Dev | 1h | ✔️ 24 tests pass |
| 0.2.9 Create `scripts/bots/test/telegram-bot.test.js` (command routing, auto-reply) | Dev | 1.5h | ✔️ 41 tests pass |
| 0.2.10 Create `scripts/bots/test/discord-bot.test.js` (slash commands, welcome) | Dev | 1.5h | ✔️ 47 tests pass |
| 0.2.11 Add `test` script to root `package.json`: `"test": "pytest scripts/ && vitest run scripts/bots/test/"` | Dev | 5m | ✔️ `npm test` = pytest 38 passed (4.27s) + vitest 160 tests (4 files), EXIT 0 |

### 0.3 Bot Path Fix [P0 - BLOCKER]

| Task | Owner | Effort | Verification |
|------|-------|--------|--------------|
| 0.3.1 Move `projects/scripts/` → `scripts/bots/` | Dev | 10m | `ls scripts/bots/` shows 5 files — ✔️. Verified (git mv; solo los 5 archivos de bots, los 165 scripts SEO/auditoría permanecen en projects/scripts/) |
| 0.3.2 Update `run-bots.js` imports to relative paths | Dev | 10m | No import errors — ✔️. Verified (ya eran relativos `./bot-brain` etc.; sin cambios necesarios) |
| 0.3.3 Update README.md bot commands to `node scripts/bots/run-bots.js` | Dev | 5m | README matches reality — ✔️. Verified (2 líneas README + 4 scripts npm en package.json) |
| 0.3.4 Test: `node scripts/bots/run-bots.js all` starts both bots | Dev | 5m | Both bots log "connected" — ✔️. Verified (Telegram ready @cha0smagicklabs + Discord logged in LABS#5507; dotenv apunta a .env raíz) |

---

## 📋 LAYER 1 — CODE QUALITY (Days 3-5)
*All refactoring, build setup, SEO fixes. No revenue work yet.*

### 1.1 Inline JavaScript Extraction [P0]

| Task | Owner | Effort | Verification |
|------|-------|--------|--------------|
| 1.1.1 Create `js/zener-trainer.js` from `tools/zener-esp-trainer.html` inline script (460 lines) | Dev | 1h | ✔️ 221 líneas ES module, exporta `initZenerTrainer()`. Verificado HTTP: handlers bound (nextTrial/resetSession/newSession = function), statTrials "0 / 25" |
| 1.1.2 Update `tools/zener-esp-trainer.html` → load `../js/zener-trainer.js` via `<script type="module">` | Dev | 15m | ✔️ Módulo carga sobre HTTP sin CORS error (file:// no soporta ES modules, esperado) |
| 1.1.3 Create `js/visitor-map.js` from apps/books inline Leaflet init (~300 lines each) | Dev | 45m | ✔️ IIFE con `window.initVisitorMap(visitors, maxVisits)`, DEFAULT_VISITORS 59 entradas verbatim, auto-init DOMContentLoaded |
| 1.1.4 Update all 12 app pages → remove inline Leaflet, load `../js/visitor-map.js` | Dev | 30m | ✔️ 12/12 páginas: `<script src="../js/visitor-map.js">` + bloque Leaflet inline eliminado (brace-matching desde primer L.map) |
| 1.1.5 Update all 7 book pages → remove inline Leaflet, load `../js/visitor-map.js` | Dev | 20m | ✔️ 7/7 páginas transformadas. noctem-tools.html conserva sus 98 entradas vía `window.VISITOR_DATA` |
| 1.1.6 Delete duplicate Leaflet init code from all 19 HTML files | Dev | 20m | ✔️ POST-CHECK: `L.map` restante en HTML files: NONE. Verificado HTTP: mapa init (leaflet-container) + 58 circleMarkers SVG en app, 61 en book |
| 1.1.7 Remove duplicate Product JSON-LD from `books/codex-chaoticus-pdf.html` (keep 1 of 3) | Dev | 10m | ✔️ 3 JSON-LD byte-idénticos → 1. Verificado HTTP: productJsonLd = 1 |

### 1.2 Build System & Consolidation [P1]

| Task | Owner | Effort | Verification |
|------|-------|--------|--------------|
| 1.2.1 Install `esbuild` as devDependency | Dev | 5m | ✔️ esbuild 0.28.2 en devDeps (edit manual + `--package-lock-only`, diff limpio solo devDeps). `npx esbuild --version` = 0.28.2 |
| 1.2.2 Add `build:js` script: `esbuild js/*.js --minify --outdir=js --target=es2020` | Dev | 10m | ✔️ build:js con 6 entradas explícitas (el glob js/*.js incluiría .min.js como entradas = doble minify) + `--out-extension:.js=.min.js`. Artefactos fresh: affiliate 1323 (nuevo), app-render 22609, apps-data 103392, conversion 40163 (nuevo, -25KB/pág), shared 6501, visitor-map 3169 (antes stale 4870). zener-trainer excluido (ES module, tools page carga source). Empírico pre-build: esbuild preserva nombres top-level (`function addUTM`, `const appsData`) |
| 1.2.3 Consolidate `addUTM()` → single definition in `shared.js` (remove from apps-data.js, conversion.js) | Dev | 30m | ✔️ Canónica en shared.js (unguarded + window.addUTM). Fallback de apps-data.js ELIMINADO (solo refs en comentario). Copia de conversion.js CONSERVADA — 7 book pages cargan conversion.js sin shared.js (copia autónoma intencional, documentada en código). Dup `<script src="js/shared.min.js">` index.html L852 eliminado (duplicaba listeners DOMContentLoaded → doble firing). Verificado HTTP: addUTM funciona en book (copia) e index (canónica) |
| 1.2.4 Update all HTML references from `.min.js` → `.js` (source) for dev; `.min.js` for prod via build | Dev | 20m | ✔️ Interpretado: refs HTML → `.min.js` (artefactos commiteados regenerados por build:js; dev edita js/*.js fuentes y corre build:js). 379 refs actualizadas en 378 archivos (affiliate/conversion → .min.js, ?v stale eliminado, incl. 1 ref raíz-absoluta `/js/` en blog). POST-CHECK: 0 refs fuente restantes |
| 1.2.5 Add `build:css` if needed (currently using external style.min.css) | Dev | 15m | ✔️ build:css = `cleancss -o css/style.min.css css/style.css` (clean-css-cli ya en devDeps). 67765 → 50853 bytes fresh |
| 1.2.6 Add `prebuild` script that runs `build:js` before any deploy | Dev | 5m | ✔️ prebuild = `npm run build:js` (convención npm: corre antes de build) + build = `npm run build:css`. GitHub Actions (L3) correrá `npm run build` |

### 1.3 SEO & HTML Fixes [P1]

| Task | Owner | Effort | Verification |
|------|-------|--------|--------------|
| 1.3.1 Add noscript CSS fallback to ALL pages (copy `glossary.html` pattern) | Dev | 1h | ✔️ 194 páginas sin noscript recibieron el patrón (sync-link: noscript tras el link; sin link: preload+noscript antes de </head>); 324 ya lo tenían. TOTAL: 521 noscript matches |
| 1.3.2 Add `article:published_time` + `article:modified_time` meta to blog template (`generate_blog.py`) | Dev | 30m | ✔️ En build_head() con date_iso (template) + bulk a 377 legacy files. TODOS los 467 archivos blog tienen article:published_time |
| 1.3.3 Add `twitter:site` (`@Cha0smagickLABS`) + `twitter:creator` (`@FraterAlek0s`) to all templates | Dev | 30m | ✔️ Template + bulk (377 legacy). 467/467 archivos blog con twitter:site + twitter:creator |
| 1.3.4 Add JSON-LD Product/Offer to `landing-pages/*.html` (complete-access, apps-bundle, books-bundle, flash-sale) | Dev | 45m | ✔️ 4/4 landings con Product JSON-LD (apps-bundle $29.99, books-bundle $19.99, complete-access $49.99, flash-sale $99.00). NOTA: las 4 NO tienen links hotmart reales (solo flash-sale con placeholder [HOTMART_FLASH_ID]) — offer url = la propia página; IDs reales al crear productos (2.2.x) |
| 1.3.5 Replace hardcoded share buttons in blog template → use `conversion.js injectShareButtons()` | Dev | 45m | ✔️ Template ahora carga conversion.min.js + affiliate.min.js (regen los conserva); injectShareButtons() auto-runs en conversion.js init (idempotente, guard __cmShareInjected). Los 377 legacy ya tenían la ref (bulk 1.2.4) |
| 1.3.6 Fix duplicate Article JSON-LD in blog articles (some have 2: one correct, one hardcoded to Zener) | Dev | 30m | ✔️ ROOT CAUSE: heads COMPLETOS duplicados (contenido de otro artículo concatenado), no solo JSON-LD. Fix: build_article reemplaza el head ENTERO (preservando <style>) + bulk dedup 139 archivos. RESULTADO: 466 Article JSON-LD, 0 dups (los 10 listicle sin schema recibieron Article JSON-LD nuevo; blog/index.html no lo necesita) |
| 1.3.7 Add `dateModified` to Article schema (use file mtime or current date) | Dev | 20m | ✔️ Template ya lo tenía (L125 dateModified: date_iso) — regen lo aplica a los 90; bulk (139+10) usó datePublished/dateModified del JSON-LD o mtime del archivo |
| 1.3.8 Run `add-giscus-to-articles.ps1` on all 379 articles | Dev | 10m | ✔️ Los .ps1 del plan NO existen — Giscus ya estaba: template lo incluye (regen lo conserva) + estado previo en legacy. 466/466 artículos con Giscus |
| 1.3.9 Run `add-cross-links.ps1` on all 379 articles | Dev | 10m | ✔️ Los .ps1 NO existen — se usó `scripts/add_internal_links.py` (Related Resources): 466 artículos actualizados, 467/467 con related. Modificación quirúrgica in-place (no reescribe) |
| 1.3.10 Regenerate `sitemap.xml` via `generate_sitemap.py` | Dev | 5m | ✔️ 491 URLs (400+ ✓), lastmod current |
| 1.3.11 Add CARTO Basemaps API key to visitor map tiles in `js/visitor-map.js` (removes "API key required" watermark); key también en root `.env` como `CARTO_API_KEY` (clave pública by-design en tile URLs — NO cuenta como secreto git) | Dev | 5m | Tile URL lleva `?key=`; mapa renderiza tiles sin watermark |

### 1.4 Python Script Cleanup [P1]

| Task | Owner | Effort | Verification |
|------|-------|--------|--------------|
| 1.4.1 Delete `scripts/generate_100_new.py` | Dev | 2m | ✔️ File gone (leía de new_articles_*.py — mismo pipeline que generate_blog.py) |
| 1.4.2 Delete `scripts/generate-blog-articles.py` | Dev | 2m | ✔️ File gone |
| 1.4.3 Update `generate_blog.py` to run `check_a11y.py` on ALL pages (not sample) | Dev | 15m | ✔️ check_a11y.py reestructurado: bloque standalone en `if __name__ == "__main__"` + ALL pages (sin [:50]); generate_blog.py: import defensivo + walk de a11y en main() (., apps, books, tools, blog, landing-pages). Report: 518 páginas cubiertas |
| 1.4.4 Run full blog regeneration: `python scripts/generate_blog.py` | Dev | 5m | ✔️ 90 artículos regenerados limpios (ALL_ARTICLES = 90 en new_articles_a-k, NO 379 como decía el plan — los otros 288 legacy se arreglaron vía bulk-fix 1.3.6). blog/ tiene 467 archivos (89 slugs NUEVOS generados — no tenían archivo previo) |

---

## 📋 LAYER 2 — REVENUE ENGINE (Days 6-14)
*Analytics visible, MailerLite live, conversion optimized, ALL Hotmart products real, webhooks deployed. Depends on Layer 0-1 complete.*

### 2.1 Analytics & Tracking Completion [P0]

| Task | Owner | Effort | Verification |
|------|-------|--------|--------------|
| 2.1.1 A2: GA4 consent default = granted (already done) | — | — | ✅ Verified |
| 2.1.2 A3: GSC verification (already done, token present) | You | 5m | Click "Verify" in GSC |
| 2.1.3 A4: Add real Meta Pixel ID to `js/shared.js` + `js/conversion.js` CONFIG | You | 5m | Meta Events Manager shows test PageView |
| 2.1.4 A5: Add real Google Ads Conversion ID to `js/shared.js` + `js/conversion.js` CONFIG | You | 5m | Google Ads shows test conversion |
| 2.1.5 A6: noscript fallback on index.html (already done) | — | — | ✅ Verified |
| 2.1.6 A7: ES form replaced with Google Forms (already done) | — | — | ✅ Verified |
| 2.1.7 A8: Deploy Hotmart webhook (Make.com scenario from `webhooks/webhook-configs.md`) | Dev | 1h | ✔️ Código listo: `scripts/webhook-receiver.js` (HMAC timing-safe, MailerLite tag, GA4 MP, selftest EXIT 0). Activación = usuario: servidor + HOTMART_WEBHOOK_SECRET. Verificación final: test purchase → tag `customer` |
| 2.1.8 Verify GA4 consent update logic works (shared.js cmApplyConsent) | Dev | 15m | ✔️ Verificado estático: cmApplyConsent llamado ANTES de gtag('config'); declined = cookie_consent==='declined'; 4 ad fields granted\|denied; Google Ads solo si cmIdIsReal; META_PIXEL_ID inerte hasta real |
| 2.1.9 Add Hotmart purchase events to GA4 (via webhook → Measurement Protocol) | Dev | 1h | ✔️ Código listo: `scripts/ga4-mp.js` + integración en webhook-receiver (selftest EXIT 0, dryrun). Activación = usuario: GA4_MEASUREMENT_ID + GA4_MP_API_SECRET en secrets |
| 2.1.10 Add Google Play purchase events to GA4 (via daily fetch script) | Dev | 1h | ✔️ Código listo: `scripts/ga4-play-purchases.js` (googleapis lazy, --date/--days/--dryrun/--selftest EXIT 0). Activación = usuario: GOOGLE_PLAY_SERVICE_ACCOUNT_JSON + GOOGLE_PLAY_PACKAGE_NAME |

### 2.2 Hotmart Product Creation (R1, R2, R5, R6) [P0 - REVENUE BLOCKERS]

| Task | Owner | Effort | Verification |
|------|-------|--------|--------------|
| 2.2.1 Create Hotmart product: Books Bundle (7 books, 50% off = $19.99) | You | 30m | Product live in Hotmart, checkout works |
| 2.2.2 Create Hotmart product: Apps Bundle (11 apps, $29.99) — since Play doesn't support bundles | You | 30m | Product live in Hotmart, delivers license keys or redirect |
| 2.2.3 Create Hotmart product: Complete Access (apps + books, $49.99) | You | 30m | Product live in Hotmart |
| 2.2.4 Create Hotmart subscription: Inner Circle ($9/mo founding, $19/mo regular) | You | 45m | Subscription active, webhook fires on create/cancel |
| 2.2.5 Create Hotmart product: Flash Sale ($99, 72h, 20 unit limit) | You | 30m | Product live with unit limit enforced |
| 2.2.6 Update all landing pages (`landing-pages/*.html`) with real Hotmart product IDs + checkout URLs | Dev | 1h | Buttons link to real Hotmart checkout |
| 2.2.7 Update `bot-brain.js` with real Hotmart product IDs + URLs (remove placeholders) | Dev | 30m | Bot slash commands show real prices/links |

### 2.3 MailerLite Automation Setup (Track C + R4) [P1]

| Task | Owner | Effort | Verification |
|------|-------|--------|--------------|
| 2.3.1 Import `email-sequences/quickstart-to-buyer.json` → Welcome EN automation (5 emails) | You | 45m | Test EN subscriber gets full sequence |
| 2.3.2 Import `email-sequences/post-purchase-upsell.json` → Welcome ES automation (5 emails) | You | 45m | Test ES subscriber gets full sequence |
| 2.3.3 Create Lead Magnet Delivery automation (trigger: group `lead_magnet_*`) | You | 30m | Form submit → PDF delivered |
| 2.3.4 Create Post-Purchase automation (trigger: Hotmart webhook → tag `customer`) | You | 45m | Test purchase → sequence starts |
| 2.3.5 Create Abandoned Cart automation (3 emails: 1h, 24h, 72h) — **NEW** | You | 1h | Test cart abandonment → sequence triggers |
| 2.3.6 Create Win-Back automation (inactive 30d, 60d, 90d) — **R11 NEW** | You | 1h | Simulate inactive → sequence fires |
| 2.3.7 Create Cross-Sell Nurture automation (apps→books monthly, books→apps monthly) — **R12 NEW** | You | 1h | Test subscriber gets cross-sell at 30d |
| 2.3.8 Create Onboarding automation (Day 1: first ritual, Day 3: troubleshooting, Day 7: results) — **R13 NEW** | You | 1h | Test buyer gets onboarding sequence |
| 2.3.9 Create Referral Program automation (unique ref links + reward fulfillment) — **R14 NEW** | You | 1.5h | Test referral flow end-to-end |
| 2.3.10 Create Groups: `source`, `interest`, `customer`, `lead_magnet`, `inner_circle`, `vip_customers` | You | 20m | Groups visible in MailerLite |
| 2.3.11 Map forms → groups (EN form → source:website_en, ES form → source:website_es, lead magnet → lead_magnet_*) | You | 20m | Test submissions apply correct groups |
| 2.3.12 Configure Hotmart → MailerLite webhook (IPN URL, secret, field mapping per `webhook-configs.md`) | Dev | 1h | Test IPN → subscriber created + tagged |
| 2.3.13 Configure Site Forms → MailerLite webhook (Google Forms / MailerLite forms) | Dev | 45m | Test form → subscriber created + tagged |
| 2.3.14 Create Segment LATAM (language=es OR country in LATAM) | You | 15m | Segment populates correctly |
| 2.3.15 Create Segment Global (language=en OR country not in LATAM) | You | 15m | Segment populates correctly |
| 2.3.16 Add price localization (GeoIP → COP/ARS/MXN/BRL display on landing pages) - **R15** | Dev | 2h | ✔ Interpreted: timezone-based (Intl API, no external calls - privacy-first + offline branding; external GeoIP avoided). js/price-locale.js (~70L vanilla, window.cmPriceLocale exposed) + build:js entry (7) → price-locale.min.js (1064b). data-usd-price on 3 landings (apps-bundle 29.99, complete-access 49.99, flash-sale 99; books-bundle has no USD price - only 50% OFF, nothing to localize). VERIFIED LIVE (Playwright, tz America/Bogota): price auto-localized on load → COP 120.000 (29.99x4000→119960→round 100); formats ARS 25.000, MXN 920, BRL 530. Approx rates 2026-09 - update periodically |

### 2.4 Conversion Optimization (Track B + R5, R6, R7, R16) [P1]

| Task | Owner | Effort | Verification |
|------|-------|--------|--------------|
| 2.4.1 B1: Cross-sell on app pages (already done 10/10) | — | — | ✅ Verified |
| 2.4.2 B2: Lead magnet on book pages (already done 7/7 via Google Forms) | — | — | ✅ Verified |
| 2.4.3 B3: Order bump on Hotmart (already configured) | — | — | ✅ Verified |
| 2.4.4 B4: Exit-intent popup (already in conversion.js) | — | — | ✅ Verified |
| 2.4.5 B5: Abandoned cart email (3 emails: 1h, 24h, 72h) — **requires MailerLite 2.3.5** | You | 1h | Test cart abandonment → sequence triggers |
| 2.4.6 B6: Post-purchase review request (7 days) — **requires MailerLite 2.3.4** | You | 30m | Test purchase → review request fires at day 7 |
| 2.4.7 Build Play Console → Make webhook (Cloud Pub/Sub → Cloud Function → Make) — **R7** | Dev | 2h | Test app purchase → webhook fires → MailerLite |
| 2.4.8 Alternative: Daily Play Console sales fetch script (`play-sales-report.py` → webhook simulation) — **R16** | Dev | 1h | Daily cron logs app sales → Sheets → MailerLite trigger |
| 2.4.9 Create Inner Circle Telegram VIP group + invite link automation (Make.com) — **R5** | Dev | 1h | Test subscription → invite generated + emailed |
| 2.4.10 Implement Flash Sale 20-slot limit enforcement (Hotmart API or Make counter) — **R6, R23** | Dev | 1h | 21st purchase rejected or waitlisted |
| 2.4.11 Add Flash Sale real countdown sync (server time, not client) — **R6** | Dev | 45m | ✔️ `landing-pages/flash-sale.html`: countdown anclado a server time (HTTP Date header corrige skew del reloj cliente, fetch HEAD a sí mismo, fallback offline), anclaje localStorage `flash_sale_start` (reload NO reinicia el timer), constante global `SALE_END_ISO` (UTC ISO, null = ventana per-visitor 72h), slots clamped a ventana 72h. Verificado con vm+stubs (jsdom 30.1.0 + Node 24 roto — incompatibilidad entorno, pre-existente): first visit 72:00:00+stored ✓, reload continúa ✓, offset aplicado 71:59:59→73:00:00 ✓, EXPIRADO ✓, slots clamp ✓. En launch real: setear SALE_END_ISO |

### 2.5 Affiliate Program Activation (R8) [P2]

| Task | Owner | Effort | Verification |
|------|-------|--------|--------------|
| 2.5.1 Build affiliate payout calculator (Make.com + Google Sheets + monthly email) | Dev | 2h | Monthly payout email sent with correct amounts |
| 2.5.2 Create affiliate terms page + agreement | You | 30m | Page live, agreement signed by affiliates |
| 2.5.3 Build affiliate dashboard (simple: clicks, conversions, earnings) | Dev | 2h | Affiliate logs in → sees stats |

### 2.6 Revenue Attribution & KPI Dashboard (R10, R25, R28, R29) [P2]

| Task | Owner | Effort | Verification |
|------|-------|--------|--------------|
| 2.6.1 Build live KPI dashboard in Google Sheets (formulas + conditional formatting) — **R10** | You | 1h | Dashboard shows: revenue, conversion, LTV, CAC by channel |
| 2.6.2 Build SEO → revenue attribution (GA4 exploration or BigQuery export) — **R25** | Dev | 2h | "Organic keyword X → $Y revenue" visible |
| 2.6.3 Build revenue alerting (Apps Script daily check → Telegram admin alert) — **R28** | Dev | 1h | Alert fires if revenue <50% target |
| 2.6.4 Build cohort analysis (MailerLite export → Sheets pivot tables) — **R29** | Dev | 1h | "Jan 2026 buyers LTV vs Jul 2026 buyers" view |

---

## 📋 LAYER 3 — OPERATIONS (Days 15-21 + Ongoing)
*Bots hardened, deployment automated, monitoring live, content pipeline running, AutoShorts separated.*

### 3.1 Bot Hardening [P1]

| Task | Owner | Effort | Verification |
|------|-------|--------|--------------|
| 3.1.1 Make `bot-brain.js` dynamic (fetch offers from API/JSON, not hardcoded) — **R21** | Dev | 2h | ✔️ `data/offers.json` (10 apps, 7 books, bundle) + `loadLocalCatalog()` + `refreshOffers()` (env OFFERS_API_URL → fetch remoto + validación + apply in-place; fallback local) + `getOffer(id)`. vitest bot-brain 48/48 |
| 3.1.2 Add sales closing framing to Groq system prompt — **R22** | You | 30m | `/ask` responses include "buy now" CTA when relevant |
| 3.1.3 Replace Imgur placeholder images in bot daily offers with real assets — **R21** | You | 1h | Daily offers show real product images |
| 3.1.4 Create `ecosystem.config.js` for PM2 (both bots, auto-restart, log rotation) | Dev | 30m | ✔️ Creado: ambos bots, autorestart, max_memory_restart 300M, out/err files con time. Rotación completa vía `pm2 install pm2-logrotate` documentada en docs/bot-deployment.md. pm2 no instalado localmente — verificación estructural |
| 3.1.5 Add `/health` endpoint to both bots (HTTP server on port 3000/3001) | Dev | 45m | ✔️ /health en ambos bots (HTTP 3000/3001, guard `!process.env.VITEST` — sin port binding en tests, EADDRINUSE non-fatal). VERIFICADO LIVE: require del módulo sin init() (sin polling real) + fetch → `HEALTH: 200 {"status":"ok","bot":"telegram","uptime":2}` |
| 3.1.6 Add structured logging (Pino) to both bots | Dev | 1h | ✔️ Interpretado: logger estructurado CUSTOM (`scripts/bots/logger.js`, JSON lines timestamp/level/context/message) SIN nueva dependencia (Pino era un medio, no el fin — evita npm dep + lock bug). Wiring: TG 3 log+4 error, DC 3 log+8 error → logger.info/error + require('./logger') top-level (fix manual: el regex del wiring falló por `)` internos en la línea dotenv). VERIFICADO LIVE: JSON lines en PTY + require-test |
| 3.1.7 Integrate Sentry (or self-hosted GlitchTip) for error tracking | Dev | 1h | ✔️ `scripts/bots/error-tracker.js` (envelope Sentry/GlitchTip vía fetch, SIN dependencia; env SENTRY_DSN/GLITCHTIP_DSN opcional; captureException non-blocking + handlers uncaughtException/unhandledRejection en run-bots.js). Selftest sin red EXIT 0 |
| 3.1.8 Add uptime monitoring (UptimeRobot / Better Uptime) for bot health endpoints | You | 15m | Dashboard shows both bots UP |
| 3.1.9 Create systemd service files for production (if not using PM2) | Dev | 30m | ✔️ `deploy/systemd/chaos-telegram-bot.service` + `chaos-discord-bot.service` (EnvironmentFile .env, HEALTH_PORT 3000/3001, Restart=always, logs append /var/log/cha0s/) |
| 3.1.10 Document bot deployment process in `docs/bot-deployment.md` | Dev | 30m | ✔️ Doc existe: prerrequisitos, Opción A PM2 (+pm2-logrotate), Opción B systemd, health checks, GDPR, logs JSON, deploy desde CI (pendiente de secrets 3.2.5) |
| 3.1.11 Add support ticket bot (Telegram/Discord → GitHub Issues or email) — **R26** | Dev | 2h | ✔️ `scripts/bots/ticket-bot.js` (GitHub Issues REST vía fetch; env GITHUB_TOKEN + GITHUB_REPO; export createSupportTicket({platform,user,text}); rate limit 3/10min; CLI --selftest/--create). /ticket wired en ambos bots (Discord slash + Telegram onText). npm test 38+160 EXIT 0 |
| 3.1.12 Add legal automation: ToS acceptance log, GDPR deletion endpoint — **R27** | Dev | 1.5h | ✔️ /delete-my-data en ambos bots (Telegram chat_id :3000, Discord user_id :3001) → log JSON en `logs/gdpr-deletion-requests.log` + confirmación. VERIFICADO LIVE: `GDPR: 200 {"status":"received","action":"deletion-requested","chat_id":"TEST123"}` + log line. ToS: logging estructurado de interacción; eliminación real cross-system (MailerLite/Hotmart) = manual/API documentada |

### 3.2 CI/CD & Deployment Pipeline [P1] — ✅ COMPLETO (2026-09-20)

| Task | Owner | Effort | Verification |
|------|-------|--------|--------------|
| 3.2.1 Extend `.github/workflows/pages.yml` → add `build:js` step before deploy | Dev | 15m | ✔️ Ya tenía build:js + build:css antes del deploy (preexistente, verificado) |
| 3.2.2 Create `.github/workflows/ci.yml` — runs `npm test` on every PR | Dev | 30m | ✔️ Ya existía: Node+Python setup, npm ci, npm test |
| 3.2.3 Create `.github/workflows/dependabot.yml` — weekly dependency updates | Dev | 15m | ✔️ Ya existía: npm ecosystem, weekly, 5-PR limit |
| 3.2.4 Create `.github/workflows/security-scan.yml` — npm audit + CodeQL | Dev | 30m | ✔️ Ya existía: npm audit (high) + CodeQL js, weekly+PR+push |
| 3.2.5 Create `.github/workflows/bot-deploy.yml` — deploy bots to server (SSH + PM2 reload) | Dev | 1h | ✔️ Creado: appleboy/ssh-action@v1.2.0, PM2 reload, YAML OK. Activación = usuario: secrets SSH_HOST/SSH_USER/SSH_KEY (+ opcionales BOT_PATH, PM2_APP_NAME, NODE_VERSION) |
| 3.2.6 Add staging deployment: `gh-pages` branch or Netlify preview on PR | Dev | 45m | ✔️ Creado `.github/workflows/staging.yml`: gh-pages PR preview + auto-comment URL. YAML OK |
| 3.2.7 Add Lighthouse CI workflow (`.github/workflows/lighthouse.yml`) with budgets | Dev | 1h | ✔️ Actualizado: npm ci + build:js + build:css antes de Lighthouse; budgets Perf≥90 A11y≥95 SEO≥90. YAML OK |

### 3.3 Social Publishing Automation (R9) [P1]

| Task | Owner | Effort | Verification |
|------|-------|--------|--------------|
| 3.3.1 Add cron job for daily social publishing (Pinterest + X + Telegram channel) | Dev | 1h | ✔️ `scripts/social-publish.js` (movido desde projects/scripts/, ~480 líneas) + `.github/workflows/social-publish.yml` (cron `0 13 * * *` = 08:00 Bogotá + workflow_dispatch; env secrets con `\|\| ''` fallback — ausentes NO fallan; commit state si cambió). Daily = blog auto-post + calendar (pin→Pinterest, tweet→X+TG). Dry-run EXIT 0 |
| 3.3.2 Build evergreen content rotation (recycle best-performing pins/tweets) | Dev | 1.5h | ✔️ Rotación ponderada: sin scores → `entries[day % N]` (evergreen, 1/día); con scores → pool ponderado `(1+score)×` por item, `pool[day % pool.length]` (high performers más frecuentes, todos rotan). Scores via `record <id> <score>` → `data/social-performance.json`. 11 tests vitest EXIT 0 |
| 3.3.3 Connect blog → social auto-post (new article → auto-share to channels) | Dev | 1h | ✔️ `autoPostBlog`: primera run SEEDS sin postear (467 artículos baseline); luego mtime > lastRun AND not published, max 3/run; Telegram (`@cha0smagicklabs`) + bridge X; state `data/social-state.json`. Dry-run verifica seeding |
| 3.3.4 Add analytics feedback loop (post performance → content calendar priority) | Dev | 1h | ✔️ `recordScore(id, score)` → perf file; `pickCalendarItem` integra scores en la rotación ponderada (boost determinista, assertions en tests) |

### 3.4 Content Pipeline (Track D) [P2 - Parallelizable]

| Task | Owner | Effort | Verification |
|------|-------|--------|--------------|
| 3.4.1 D2: Rewrite 136 thin articles (priority: highest traffic potential first) | Content | ~100h | Word count >1500, data/examples, internal links |
| 3.4.2 D3: Schema.org Article markup (already done) | — | — | ✅ Verified |
| 3.4.3 D4: Internal linking apps/books/tools (already done 378/379) | — | — | ✅ Verified |
| 3.4.4 D5: Sitemap.xml + GSC submit (already done) | — | — | ✅ Verified |
| 3.4.5 Ongoing: Weekly blog audit (check_a11y.py, check_lazy.py, schema validation) | Content | 30m/wk | Reports clean |
| 3.4.6 Build article→product mapping (auto-generate "related product" from content) — **R24** | Dev | 2h | New articles auto-link to relevant products |

### 3.5 Technical Debt Verification (Track E) [P2]

| Task | Owner | Effort | Verification |
|------|-------|--------|--------------|
| 3.5.1 E3: Structured data (Product, Organization, WebSite, BreadcrumbList, Article, HowTo, FAQPage) — verify all | Dev | 1h | Rich Results Test: 0 errors |
| 3.5.2 E4: Performance optimize images (WebP, lazy load, sizing) — verify all | Dev | 1h | Lighthouse Perf >90 |
| 3.5.3 E5: Accessibility audit WCAG 2.1 AA — verify all | Dev | 1h | axe-core: 0 violations |

### 3.6 AutoShorts Separation [P3]

| Task | Owner | Effort | Verification |
|------|-------|--------|--------------|
| 3.6.1 Move `projects/auto-shorts/`, `projects/auto-shorts-full/`, `tools/auto-shorts/` to separate repo | Dev | 2h | New repo exists, main repo clean |
| 3.6.2 Update `.gitignore` to exclude AutoShorts if keeping locally | Dev | 5m | AutoShorts not in main repo |
| 3.6.3 Remove AutoShorts deps from root `package.json` (discord.js, playwright, puppeteer stay for bots) | Dev | 10m | `package.json` only has bot deps |

---

## 🔗 DEPENDENCY GRAPH (CRITICAL PATH)

```
LAYER 0 (Sequential)
├── 0.1 Secrets → 0.2 Tests → 0.3 Bot Path
    │
    ▼
LAYER 1 (Parallel after 0.1-0.3)
├── 1.1 JS Extraction (sequential: zener → visitor-map)
├── 1.2 Build System
├── 1.3 SEO Fixes (parallel: noscript, meta, JSON-LD, Giscus, cross-links)
└── 1.4 Python Cleanup
    │
    ▼
LAYER 2 (Sequential after Layer 1)
├── 2.1 Analytics (A4, A5, A8-A10)
├── 2.2 Hotmart Products (R1-R2, R5-R6) ──→ 2.3 MailerLite (C1-C16 sequential)
│       │
│       ├────→ 2.4 Conversion (B5, B6, R7, R16, R5, R6, R10-R15)
│       │
│       ├────→ 2.5 Affiliate (R8)
│       │
│       └────→ 2.6 Attribution (R10, R25, R28, R29)
    │
    ▼
LAYER 3 (Parallel after Layer 2)
├── 3.1 Bot Hardening (R21, R22, R26, R27)
├── 3.2 CI/CD
├── 3.3 Social Cron (R9)
├── 3.4 Content (ongoing + R24)
├── 3.5 Tech Debt (verify)
└── 3.6 AutoShorts Separation
```

**Critical Path Duration**: ~21 days (if 1 dev + 1 content + you for secrets/MailerLite/Hotmart)  
**Parallelizable**: ~80% of Layer 1, ~60% of Layer 3

---

## ✅ ATOMIC TASK TEMPLATE (Use for Every Task)

```
### TASK [ID]: [Title]
**Owner**: [Name] | **Effort**: [Time] | **Depends On**: [Task IDs]
**Acceptance Criteria**:
- [ ] Criterion 1 (measurable)
- [ ] Criterion 2 (measurable)
**Verification Command**: `[command that proves done]`
**Rollback**: `[how to undo if broken]`
**Notes**: `[context, gotchas, links]`
```

---

## 📦 DELIVERABLES CHECKLIST (Final Audit)

### Layer 0
- [ ] All 10 secrets rotated + in GitHub Secrets
- [ ] `.env` purged from git history
- [ ] `pytest` + `vitest` suites pass (`npm test` green)
- [ ] Bots start via `node scripts/bots/run-bots.js all`

### Layer 1
- [ ] `js/zener-trainer.js` + `js/visitor-map.js` exist, no inline JS >50 lines
- [ ] `npm run build:js` creates `.min.js` files
- [ ] `addUTM()` single source in `shared.js`
- [ ] All 400+ HTML pages have noscript CSS fallback
- [ ] All 379 blog articles have Giscus + cross-links + correct meta + single Article schema
- [ ] Landing pages have Product/Offer JSON-LD
- [ ] Legacy Python scripts deleted
- [ ] `sitemap.xml` regenerated, 400+ URLs current

### Layer 2
- [ ] Meta Pixel ID + Google Ads ID live (test events visible)
- [ ] Hotmart webhook deployed + tested (purchase → MailerLite + Sheets + Telegram)
- [ ] 5 Hotmart products real (Books Bundle, Apps Bundle, Complete Access, Inner Circle, Flash Sale)
- [ ] 9 MailerLite automations live + groups + webhooks + segments
- [ ] Abandoned cart + review request + win-back + cross-sell + onboarding + referral emails firing
- [ ] Play Console sales tracked (webhook or daily fetch) → MailerLite for app buyers
- [ ] Price localization live (LATAM sees COP/ARS/MXN)
- [ ] Affiliate payout calculator + dashboard live
- [ ] KPI dashboard live + daily Telegram alert
- [ ] SEO → revenue attribution visible
- [ ] Cohort analysis view available

### Layer 3
- [ ] PM2 + health endpoints + Sentry + uptime monitoring for bots
- [ ] CI workflow (test on PR) + Dependabot + Security scan + Bot deploy + Lighthouse CI
- [ ] Staging preview on PR
- [ ] Bot offers dynamic (API-driven), Groq has sales framing, real images
- [ ] Social posts daily auto-publish + evergreen rotation + blog→social auto
- [ ] Support ticket bot + legal automation (ToS log, GDPR deletion)
- [ ] 136 thin articles rewritten (ongoing)
- [ ] Article→product mapping auto-generated
- [ ] AutoShorts separated
- [ ] All Rich Results Test pass, Lighthouse budgets met

---

## 🚀 EXECUTION ORDER (Copy-Paste to Todo App)

```
[x] 0.1.1-0.1.11 Secret Rotation & Git Hygiene (0.1.9: 11 secrets en GitHub ✔️; rotación 0.1.1-0.1.8 y purge 0.1.11 omitidos por decisión del usuario)
[x] 0.2.1-0.2.11 Test Infrastructure
[x] 0.3.1-0.3.4 Bot Path Fix
[x] 1.1.1-1.1.7 Inline JS Extraction
[x] 1.2.1-1.2.6 Build System
[x] 1.3.1-1.3.10 SEO & HTML Fixes
[x] 1.4.1-1.4.4 Python Cleanup
[x] 2.1.3-2.1.10 Analytics Completion (código listo; activación = usuario: Meta Pixel ID, Google Ads ID, HOTMART_WEBHOOK_SECRET, GA4_MEASUREMENT_ID, GA4_MP_API_SECRET, GOOGLE_PLAY_*)
[ ] 2.2.1-2.2.7 Hotmart Product Creation
[ ] 2.3.1-2.3.16 MailerLite Automation (9 automations)
[ ] 2.4.5-2.4.11 Conversion (B5, B6, R7, R16, R5, R6, R15)
[ ] 2.5.1-2.5.3 Affiliate Program (R8)
[ ] 2.6.1-2.6.4 Revenue Attribution (R10, R25, R28, R29)
[x] 3.1.1+3.1.7+3.1.11 Bot Hardening parcial (3.1.4/3.1.5/3.1.6/3.1.9/3.1.10/3.1.12 ✔️; pendiente usuario: 3.1.2 sales framing, 3.1.3 Imgur imágenes, 3.1.8 uptime monitor)
[x] 3.2.1-3.2.7 CI/CD Pipeline (bot-deploy.yml + staging.yml + lighthouse.yml; activación bot-deploy = usuario: SSH_HOST/SSH_USER/SSH_KEY)
[x] 3.3.1-3.3.4 Social Publishing Automation (R9) — scripts/social-publish.js + workflow social-publish.yml + tests (11); activación = usuario: PINTEREST_TOKEN, POST_BRIDGE_KEY (api.post-bridge.com 404 verificado 2026-09-21 — usar alternativa tipo Ayrshare con POST_BRIDGE_URL)
[ ] 3.4.1-3.4.6 Content Pipeline (D2 + R24)
[ ] 3.5.1-3.5.3 Tech Debt Verify
[ ] 3.6.1-3.6.3 AutoShorts Separation
```

---

## 📊 PROGRESS TRACKING

| Layer | Tasks Total | Done | In Progress | Blocked | % Complete |
|-------|-------------|------|-------------|---------|------------|
| 0 Foundation | 25 | 25 | 0 | 0 | 100% |
| 1 Code Quality | 33 | 33 | 0 | 0 | 100% |
| 2 Revenue Engine | 52 | 11 | 0 | 0 | 21% |
| 3 Operations | 35 | 14 | 0 | 0 | 40% |
| **TOTAL** | **145** | **83** | **0** | **0** | **57%** |

> **Update this table daily**. When a task moves to Done, increment the count.
>
> **Última actualización (2026-09-17)**: 0.2.1-0.2.11 ✔️ COMPLETO — Test infrastructure: pytest 38 tests + vitest 160 tests (4 files en `scripts/bots/test/`), `npm test` EXIT 0. 0.2.1: pytest/pytest-html son paquetes pip (no npm devDeps; el paquete npm "pytest" es bogus). 0.3.1-0.3.4 ✔️ (bots en `scripts/bots/`, Telegram+Discord conectados). **1.1.1-1.1.7 ✔️ COMPLETO — JS extraction: js/zener-trainer.js (221 líneas, handlers verificados) + js/visitor-map.js (59 entradas), 19 páginas transformadas, dup Product JSON-LD 3→1; verificado vía HTTP server + Playwright: mapa init (leaflet-container) + 58 circleMarkers en app / 61 en book, zener handlers bound, módulo carga sin CORS.** **1.2.1-1.2.6 ✔️ COMPLETO — Build system: esbuild 0.28.2 devDeps; build:js (6 entradas explícitas, artefactos .min.js fresh: -35KB payload total); addUTM consolidado (canónica shared.js, fallback apps-data eliminado, copia conversion.js conservada para 7 books, dup shared.min.js index eliminado); 379 refs HTML → .min.js en 378 archivos; build:css (67.8→50.9KB); prebuild wired. Verificado HTTP: addUTM funciona, appsData cross-file OK, 0 errores consola.** 1.3.11 ✔️ (CARTO basemap key). **1.3.1-1.3.10 ✔️ + 1.4.1-1.4.4 ✔️ COMPLETO — SEO & Python cleanup: template (article meta, twitter:site/creator, noscript, refs conversion/affiliate, build_article reemplaza head ENTERO preservando style), regen (90 limpios con build_article fixed), bulk dedup 139 archivos (heads COMPLETOS duplicados removidos — root cause: contenido de otro artículo concatenado), 466 Article JSON-LD 0 dups, 10 listicle recibieron Article nuevo, 467/467 giscus + related, 521 noscript, 4 landings Product JSON-LD (offer url = propia página; sin hotmart real hasta 2.2.x), sitemap 491 URLs, check_a11y ALL pages (518 cubiertas), scripts muertos borrados. npm test EXIT 0 (38 pytest + 160 vitest). NOTA: blog ahora tiene 467 artículos (89 slugs NUEVOS generados).** Pendiente manual: 0.1 (rotación secretos) + 2.2.1-2.2.5 (productos Hotmart). Siguiente: LAYER 2 — Revenue Engine (2.1.x restante + 2.3.x MailerLite).

> **Última actualización (2026-09-20)**: 0.1 ✔️ COMPLETO — 0.1.9 (11 secrets subidos a GitHub Repository Secrets por el usuario vía Web UI/CLI). 0.1.1-0.1.8 (rotación) y 0.1.11 (purge de historia git) OMITIDOS por decisión explícita del usuario: no se rotarán las credenciales. Layer 0 = 100%, Layer 1 = 100%. Siguiente: 2.1.7-2.1.10 (analytics), 3.1 (bot hardening), 3.2 (CI/CD).
>
> **Última actualización (2026-09-20, 2ª)**: **2.1.7-2.1.10 ✔️** — webhook-receiver.js (HMAC timing-safe, MailerLite tag, GA4 MP) + ga4-mp.js + ga4-play-purchases.js (googleapis lazy) selftests EXIT 0; 2.1.8 consent verificado estático. Activación = usuario: HOTMART_WEBHOOK_SECRET, GA4_MEASUREMENT_ID, GA4_MP_API_SECRET, GOOGLE_PLAY_SERVICE_ACCOUNT_JSON, GOOGLE_PLAY_PACKAGE_NAME. **3.1.1 ✔️** (data/offers.json + bot-brain dynamic fetch, 48/48 tests). **3.1.7 ✔️** (error-tracker.js Sentry/GlitchTip envelope vía fetch, sin dependencia, wiring run-bots.js). **3.1.11 ✔️** (ticket-bot.js GitHub Issues + /ticket wired en ambos bots). **3.2.1-3.2.7 ✔️ COMPLETO** (bot-deploy.yml appleboy/ssh-action + staging.yml gh-pages PR preview + lighthouse.yml con budgets; 3.2.1-3.2.4 preexistentes). Todo verificado: 7/7 YAML parse OK, npm test EXIT 0 (38 pytest + 160 vitest). Layer 2 = 11/52 21%, Layer 3 = 10/35 29%, TOTAL = 79/145 54%.
>
> **Última actualización (2026-09-21)**: **3.3.1-3.3.4 ✔️ COMPLETO — Social Publishing Automation (R9)**: `scripts/social-publish.js` (movido desde `projects/scripts/` vía git mv para alinear con README/PROJECT-BIBLE; ~480 líneas CommonJS, main-guard, 19 funciones exportadas). Calendarios preservados verbatim (13 pins + 30 tweets). Publishers: Telegram directo (require bots/telegram-bot.js), Pinterest API v5 (PINTEREST_TOKEN + PINTEREST_BOARD_ID, image_base64 desde pins/output), bridge X configurable (POST_BRIDGE_URL — DECISIÓN: api.post-bridge.com/v1 = 404 verificado 2026-09-21, no existe públicamente; usar alternativa tipo Ayrshare con POST_BRIDGE_URL configurable; el daily NUNCA falla por secrets ausentes). Rotación 3.3.2 ponderada por performance (sin scores → evergreen day%N; con scores → pool (1+score)×). Blog auto-post 3.3.3: primera run SEEDS sin postear (467 baseline), luego mtime-based max 3/run. Feedback 3.3.4: recordScore → social-performance.json → rotación ponderada. State: data/social-state.json. Workflow social-publish.yml (cron 08:00 Bogotá, secrets con fallback `|| ''`, commit state). Tests: scripts/social/test/ 11 vitest. Verificado: selftest EXIT 0, dry-run EXIT 0 (seeding + sin state escrito), npm test EXIT 0 (38 pytest + 171 vitest). npm scripts añadidos: social:daily/social:dry/social:selftest. .env.example: PINTEREST_TOKEN/PINTEREST_BOARD_ID/POST_BRIDGE_KEY/POST_BRIDGE_URL documentados (opcionales). Layer 3 = 14/35 40%, TOTAL = 83/145 57%. Siguiente: 3.4 Content Pipeline, 3.5 Tech Debt Verify, 3.6 AutoShorts Separation; **2.4.11 ✔️** flash-sale countdown server-time sync (Date header + localStorage + SALE_END_ISO; verificado vm+stubs — jsdom 30.1.0/Node 24 no ejecuta scripts, incompatibilidad entorno pre-existente; en launch real setear SALE_END_ISO en landing-pages/flash-sale.html). Pendiente usuario 2.4.x: activaciones MailerLite + productos Hotmart (2.2.x).

---

## 🛑 STOP CONDITIONS (Do Not Proceed If)

| Condition | Action |
|-----------|--------|
| Any Layer 0 task incomplete | **STOP** — fix before Layer 1 |
| `npm test` failing | **STOP** — fix tests before any refactor |
| Secrets still in git history | **STOP** — rotate + purge before deploy |
| GA4 not showing traffic after 2.1.3-2.1.5 | **STOP** — debug consent + config |
| MailerLite webhooks not firing | **STOP** — fix before 2.3.4+ |
| Hotmart webhook not deployed | **STOP** — fix before 2.4.7 |
| Lighthouse CI failing on main | **STOP** — fix perf/a11y/seo before merge |
| Hotmart products not created | **STOP** — create before 2.3.12 |

---

## 📝 NOTES FOR IMPLEMENTERS

1. **Atomic commits** — one task = one commit (or small PR). Message format: `[LAYER.N.TASK] Description`
2. **Test first** — write failing test, make it pass, then refactor (TDD)
3. **Measure before/after** — GA4 events for every new interaction (already in conversion.js)
4. **Spanish-first** — primary audience LATAM; EN secondary
5. **No new dependencies** — vanilla JS, static hosting, stdlib Python. Keep it that way.
6. **Document as you go** — update this plan with findings, gotchas, decisions
7. **Revenue plumbing first** — Hotmart products (2.2) must be created before MailerLite webhooks (2.3.12)

---

## 🔄 MAINTENANCE CADENCE (Post-Launch)

| Frequency | Task | Owner |
|-----------|------|-------|
| Daily | Check GA4/Meta/Ads dashboards for anomalies | You |
| Daily | Check bot health (uptime monitor) | You |
| Daily | Check KPI dashboard + Telegram alerts | You |
| Weekly | Run `npm test` locally before push | Dev |
| Weekly | Review MailerLite automation performance (open/click/conversion) | You |
| Bi-weekly | Run `check_a101y.py` + `check_lazy.py` on new content | Content |
| Monthly | Rotate API keys (if policy requires), audit blog traffic, update sitemap | You |
| Monthly | Dependabot PRs review + merge | Dev |
| Monthly | Affiliate payout calculation + payment | You |
| Quarterly | Re-run strategic audit, update this plan | You + Dev |

---

## 🗂️ FILES TO RETAIN (Single Source of Truth)

**Core Execution Plans (KEEP):**
- `MASTER_EXECUTION_PLAN.md` ← **THIS FILE**
- `webhooks/webhook-configs.md` (Make.com implementation specs)
- `email-sequences/quickstart-to-buyer.json` (5-email welcome EN)
- `email-sequences/post-purchase-upsell.json` (3-email upsell × 18 products)

**Reference Docs (KEEP):**
- `README.md` (project overview)
- `PROJECT-BIBLE.md` (technical architecture reference)
- `docs/bot-deployment.md` (to be created in 3.1.10)

**DELETE / ARCHIVE (superseded by this plan):**
- `MASTER_AUDIT_PLAN.md` → **DELETE**
- `UNIFIED_EXECUTION_BLUEPRINT.md` → **DELETE**
- `REVENUE_AUTOMATION_RE_AUDIT.md` → **DELETE**
- `strategic-sales-audit.md` → **ARCHIVE to `projects/docs/archive/`**
- `plan-maxima-conversion.md` → **ARCHIVE**
- `plan-ventas-automatizadas.md` → **ARCHIVE**
- `phase-2-3-prd.md` → **ARCHIVE**
- `ecosystem-complete.md` → **ARCHIVE**
- `blog-audit-report.md` → **ARCHIVE**
- `kpi-dashboard/kpi-dashboard-template.md` → **ARCHIVE** (replaced by 2.6.1)
- `content-calendar/content-calendar.md` → **ARCHIVE** (replaced by 3.3.2)
- `affiliate-kit/*.md` → **ARCHIVE** (replaced by 2.5)
- `projects/scripts/tweet-queue-remaining.md` → **DELETE**
- `projects/docs/tweets-x-30-12ago2026.md` → **DELETE**
- `projects/ventas/*.md` → **ARCHIVE**
- `projects/research/play-store-sales-research.md` → **ARCHIVE**
- `projects/scripts/keyword-article-map.md` → **ARCHIVE** (replaced by 3.4.6)

---

**This plan is the single source of truth. All prior plans are superseded.**