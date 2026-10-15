# AUDITORÍA COMPLETA — cha0smagicklabs.com (SEO · GEO · ASO · FUNNEL)

**Fecha:** 2026-10-15 · **Auditor:** Tecnoprieste (auditoría directa, sin subagentes)
**Alcance:** 992 HTML auditados uno a uno (853 blog, 71 tools, 13 apps, 10 books, 11 /es/, 6 landing-pages, 2 lead-magnets, ~26 root), sitemap, robots, llms.txt, sw.js, manifest, JS (todos con `node --check`), conversion funnel, consent, deploy.
**Keywords:** datos REALES de Search Console (API, propiedad `sc-domain:cha0smagicklabs.com`) del 2026-10-14 en `docs/PLAN-VENTA-MERCADEO-GSC.md`. Hoy la API de GSC no es consultable desde esta máquina (DNS de `searchconsole.googleapis.com` bloqueado) — usar el doc de ayer como baseline y regenerar cuando el token viva.
**Cómo usar este fichero:** marcar `[x]` cada casilla al corregirla. No re-auditar lo que ya está en "VERIFICADO OK".

---

## 0. VERIFICADO OK — no tocar (estado bueno real)

- [x] **Titles y descriptions: 0 duplicados en 992 páginas.** Canonicals absolutos y correctos en el 100% (muestreo index/blog/books/apps OK).
- [x] **Sitemap:** 991 URLs, **0 URLs muertas** (todas resuelven a fichero local). lastmod frescos (2026-09/10).
- [x] **JSON-LD masivo y real:** FAQPage en 926 págs, Article/BlogPosting 517 (con datePublished en 852/853), BreadcrumbList 879, Person 872, HowTo 312, VideoObject 349 con URLs YouTube reales, SoftwareApplication+Offer en apps.
- [x] **Cross-linking:** media **56 links internos por artículo** de blog, 15 H2 por artículo. Esto es fortaleza seria para el objetivo #1.
- [x] **JS sano:** 0 errores de sintaxis en `js/*.js`, 0 `script src` rotos, módulo ES de zener-trainer con `type="module"` correcto. Solo **12 links internos rotos** en todo el sitio (lista en F-1).
- [x] **PWA:** manifest OK, iconos 192/512 existen, sw.js precache correcto (los `?v=` son válidos), estrategias cache/network correctas.
- [x] **Secretos:** `.env`, `.gsc-token.json`, tokens Play NO están trackeados en git. Correcto.
- [x] **Plan GSC Fase 1 ya ejecutado** (no duplicar trabajo): `/sigil-maker.html` creada y en sitemap; `tools/sigil-generator.html` retitleada con la keyword; guía goetia retitleada; glossary.html con 533 términos; `docs/ASO-play-titles.md` y `docs/MAILERLITE-setup.md` existen.

---

## 1. KEYWORDS — dónde está el sitio hoy (GSC 90d: 393 clics · 12.447 impresiones)

Base: `docs/PLAN-VENTA-MERCADEO-GSC.md` (2026-10-14). Tráfico acelerando (91% del histórico de 16 meses ocurrió en los últimos 90 días).

### 1.1 Striking distance (posiciones 6–15, basta un empujón)

| # | Query | Impr. 90d | Pos. | Clics | Acción |
|---|-------|-----------|------|-------|--------|
| K1 | `sigil maker` | 369 | 13,7 | 10 | `/tools/sigil-generator.html` ya retitleada → añadir H1 literal "Sigil Maker", 300-500 palabras de venta + FAQ 6 Q&A + links desde los 6 blogs de sigilo. **Medir en 30d.** |
| K2 | `best astrology apps` | 142 | 14,0 | 0 | `blog/astrology-apps-android-guide.html`: title con año, tabla comparativa 12 apps con precios reales y links a cada `/apps/*.html`. |
| K3 | `goetic magic` | 113 | 9,9 | 2 | Ya retitleada. Queda: FAQPage + links internos desde los artículos de Goetia hacia ella. |
| K4 | `sigil maker online` | 65 | 10,2 | 4 | Cubierta por `/sigil-maker.html`. Queda: links internos hacia ella (home + blog sigilo). |
| K5 | `best astrology apps 2026` | 46 | 8,7 | 0 | Misma página que K2. |
| K6 | `chaos magic sigil generator` | 44 | 6,8 | 5 | Casi top-3: pulir title/H1 de `apps/chaos-sigil-generator.html` + tool. |

- [ ] K1→K6 aplicadas (una PR por página, marcar cada una).

### 1.2 Clusters por volumen de impresiones (dónde pelear el #1)

| Cluster | Señal |
|---|---|
| **Sigil** | ~2.851 impr/90d (`sigil generator` pos 20,8 · `sigil creator` pos 24,2 · `sigil online` pos 26,8 · `make sigil online` pos 50,8). Cluster nº1 del sitio. |
| **Astrology apps** | 188 impr, 0 clics — listicle en blanco. |
| **Goetia / 72 spirits** | 17 artículos + app → consolidar autoridad con hub. |
| **Lucid dreaming / astral** | 24+20 menciones en titles; serie con 9 imágenes sin alt (ver F-11). |
| **Wealth / abundance** | 18 artículos — competitive, no priorizar sobre sigil. |
| **Español** | 0 clics aún (32 posts ES + 10 comparativas muy recientes). Oportunidad intacta: bloqueada por el bug hreflang (F-3). |

- [ ] Crear **hub de cluster "Sigil"** (página pilar enlazando: sigil-maker, sigil-generator, los 6+ artículos de sigilo, app chaos-sigil-generator).
- [ ] Hub Goetia y hub Lucid/Astral (mismo patrón, solo links existentes).

### 1.3 Home casi no indexa

`/` tiene **89 impresiones y 40 clics** (todo de marca). Un fallo técnico-commercial: la página con más autoridad no compite por nada.

- [ ] F-8: reforzar home con keywords + links a las 6 striking-distance (detalle en F-8).

---

## 2. FUNNEL — "cada visita se lleva algo" (estado real)

**Lo que ya existe** (bien hecho, no reconstruir): `js/conversion.js` (cargado en 899 págs) inyecta: popup email (30 s o 50% scroll o exit-intent) en home/blog/tools · lead magnet MailerLite EN (`UOlyYH`) y ES (`I95d94`, cuenta 2539880) · upgrade CTA por tool vía `data/tool-funnels.json` · related apps · testimonios · share bar · cookie de afiliado 60 días · tracking purchase_click/begin_checkout/form_submit.

**Los agujeros (ordenados por dinero perdido):**

### F-1 · Las páginas de VENTA no miden ni capturan
- [ ] **`apps/index.html` + `books/index.html`**: en ESPAÑOL dentro del site EN ("12 apps ocultas para Android — Catálogo"), **fuera del sitemap**, **sin GA4**, **sin conversion.js**, apps/index **sin un solo link Play** y 700 palabras. Son la puerta de `/apps/` y `/books/`. → Regenerar en inglés (12 apps / 9 libros), añadir al sitemap, con GA4+conversion, CTAs Play/Hotmart y lead magnet.
- [ ] **Las 6 `landing-pages/`** (apps-bundle, books-bundle, complete-access, flash-sale, affiliate×2): sin GA4, sin conversion.js, **0 impresiones en GSC**. `books-bundle.html` tiene title EN ESPAÑOL ("Bundle 8 Libros - 50% OFF"). → Añadir GA4+conversion, traducir, enlazar desde nav/footer.
- [ ] **Los 2 `lead-magnet/`** (la guía gratis): sin GA4, sin conversion.js — la página que recibe al lead no mide ni upsellea. → Añadir ambos + CTA post-descarga (bundle/libro $3.99).
- [ ] **`404.html`**: tiene GA4 pero ni conversion ni links a la guía. → Inyectar bloque "llevate la guía gratis + apps top".

### F-2 · Consent/analítica contradice al código (riesgo legal + datos muertos)
- `js/shared.js` (l.133-252): consent **default GRANTED**, banner "informativo" con Decline.
- `js/conversion.js` (l.137-148): `applyConsent()` **DENIED salvo cookie `cookie_consent=accepted`**. shared carga ANTES que conversion en todas las páginas → gana conversion: **opt-in real**.
- Resultado: **134 páginas sin banner** (12 apps + 10 books + 11 es/ + 6 landing + 2 lead-magnet + 88 blog + 3 root + 1 compare) donde el visitante **no puede aceptar** → GA4 permanentemente apagado exactamente en las páginas de venta.
- [ ] Elegir UN modelo (recomendado: opt-in como conversion.js) y unificar: banner en las 134 páginas (extender plantilla de shared a apps/books/landing/lead-magnet), comentarios corregidos, un solo dueño del consent.
- [ ] Los 88 blog sin shared.js: identificar (son las series generadas) y regenerar con plantilla actual.

### F-3 · BUG: hreflang de los 20 artículos ES apunta a URLs inexistentes (`.html.html`)
`blog/es-*.html` (20 de 32) declaran `hreflang="en"` y `x-default` hacia `…html.html` (p. ej. `blog/es-como-hacer-un-sigilo-paso-a-paso.html` → `free-sigil-generator-online-guide.html.html`). Google **descarta el set completo** cuando un alternate da 404 → el mercado ES (oportunidad nº1 según GSC) sigue bloqueado.
- [x] Corregir los 20 (quitar el `.html` duplicado o apuntar al gemelo EN real). **HECHO 2026-10-15:** 17 reparados con gemelo real, 6 sin gemelo EN limpiados (quedan es-self).
- [x] Unificar conjuntos: hoy hay 5 variantes (712 págs solo `en`, 77 `en+x-default`, 32 `en+es`, 45 SIN hreflang, 19 solo `es`). Estándar propuesto: cada página declara `en` + `x-default`; las que tienen gemelo ES añaden `es` (y el ES recíproco). **HECHO 2026-10-15:** x-default añadido a 252 págs; estándar en+x-default en todo el sitio (hallazgo: ~40 tools ya están traducidas a ES y ahora declaran `es`+`x-default`).
- [x] Los 45 sin hreflang (lista: apps/index, books/index, compare/astral-lab-vs-co-star, 6+ tools nuevas) → añadir. **HECHO 2026-10-15:** 43 páginas recibieron bloque completo.

### F-4 · Cero atribución de ventas (acciones FUERA del repo, bloquean todo el funnel medible)
- [ ] **Webhook Hotmart → MailerLite + GA4** (`webhooks/` solo tiene un .md de configs). Sin esto: comprador no entra en email, `purchase` nunca dispara.
- [ ] **Activar secuencia "Quickstart to Buyer"** (escrita en `email-sequences/quickstart-to-buyer.json`, 0 emails enviados) + `post-purchase-upsell.json`.
- [ ] **Publicar app OAuth en GCP** (o service account): si no, el token GSC muere cada 7 días y no hay GA4 API.
- [ ] **Meta Pixel + Google Ads**: `PONER_META_PIXEL_ID_AQUI` / `PONER_AW_ID_AQUI` en `js/conversion.js` (l.44-45) → retargeting y conversiones OFF.
- [ ] **ads.txt / app-ads.txt** con `pub-PONER_PUBLISHER_ID` y no hay ningún `adsbygoogle` en el sitio → o rellenar o eliminar (son ficheros rotos públicos).

### F-5 · Email capture en apps/books
El popup solo dispara en `popupPages: ['homepage','blog','tools']` (conversion.js l.50). En apps/books hay botones de compra pero **cero captura de email** para quien no compra hoy.
- [ ] Añadir 'apps' y 'books' al popup (o un bloque inline "antes de irte: guía gratis") en esas plantillas.

### F-6 · Spanish funnel
- [ ] Popup/CTAs de conversion.js respetan `es-page` pero las 10 comparativas `/es/` no reciben popup (solo las 32 en /blog/). Añadir es-page a popupPages.
- [ ] Las 62 tools top (71−9 sin demanda) **solo en inglés** — traducir las 10 con demanda ES (lista en plan GSC fase 3).

---

## 3. SEO ON-PAGE — defectos concretos (por página)

- [ ] **F-7 · Titles <30ch en ~20 artículos** de series con títulos genéricos idénticos entre sí ("Chaos Magic Fundamentals", "Entity Lore and Invocation", "History of the Occult"… 28-39 artículos por serie). Canibalización segura. → Diferenciar cada title con su subtema ("Chaos Magic Fundamentals: Gnosis, Sigils & Paradigm Shift").
- [ ] **F-8 · Home (index.html):** desc caducada ("61 free tools" → son **71**; "8 books" → hay **9** ficheros de libro). Añadir links texto visibles a: sigil-maker, sigil-generator, astrology guide, goetic guide, best-occult-apps, glossary (las 6 striking-distance) + H1 con "chaos magick apps" etc.
- [ ] **F-9 · Descriptions <70ch en 43 páginas** (series con teaser truncado tipo "…what it f"). Rellenar a 140-155ch con keyword.
- [ ] **F-10 · `mind-the-gap-pdf.html` desc 232ch** → recortar a 160.
- [ ] **F-11 · 450 imágenes sin alt en 50 artículos** (series astral-projection/psi/best-*: 9 imgs sin alt cada una). → Regenerar con alt descriptivo (el generador es scripts propios).
- [ ] **F-12 · twitter:card:** 55 págs sin card y 40 con `summary` → normalizar todo a `summary_large_image`.
- [ ] **F-13 · OG incompleto en 5 págs:** buscar.html, search.html, es/index.html (+2 junk). Las 3 reales → completar og:title/desc/image.
- [ ] **F-14 · 11 págs <300 palabras** reales: 3 tools (digital-grimoire-organizer 299, elemental-balance-checker 299, magical-correspondence-finder 296, ogham-oracle 298) + affiliate-dashboard 276 + app-details 103 (dinámica, OK). → 200-300 palabras únicas en las 4 tools + dashboard.
- [ ] **F-15 · FAQPage en 926 págs:** muestrear 20: si la FAQ es boilerplate idéntico entre artículos de una serie, diversificar (riesgo de spam schema penalizable).
- [ ] **F-16 · `checklist-ventas.html`** (root, ES, "Venta Automatizada", indexable, en sitemap, sin GA4): decidir — si es interna → `noindex` + fuera de sitemap; si es contenido → terminar y medir.

### Links rotos (12 en total — único arreglo puntual)
- [ ] F-17: 5 phantom `/es/es-*.html` (los artículos viven en `/blog/es-*`), `/blog/es-libro-codex-chaoticus.html`, `/books/best-chaos-magick-books-essential-reading.html`, `/blog/tarot-chaos-pdf.html`, `/blog/chaos-tarot-spreads.html`, `/blog/tarot-shadow-work.html`, `/tools/free-sigil-generator.html` → corregir href o crear redirect.

---

## 4. GEO (LLMs/IA) — el activo más barato de mejorar

- [ ] **F-18 · `llms.txt` obsoleto:** lista **10 tools de 71**. Regenerar completo (tools, apps 12, books 9, hubs, guías).
- [ ] **F-19 · `llms-full.txt` obsoleto:** lista **820 de 853 artículos** (faltan exactamente los 32 ES). Regenerar + los 71 tools.
- [ ] **F-20 · Sitemap de llms:** añadir `llms.txt` como referencia en robots.txt (comentario ya existe; dejarlo explícito no hace falta — solo regenerar).
- [ ] **F-21 · `robots.txt`:** `Disallow: /submissions/` apunta a un dir que no existe en root (está en `projects/`, no deployado) → limpiar la línea. Añadir `Disallow: /tools/auto-shorts/` (ver F-22).

---

## 5. ASO (Play Store) — on-site y store

- [x] Verificado: 12 apps con `details?id=com.cha0smagicklabs.*` correctos en `apps/*.html` (psi-gym: 7 refs Play), schema SoftwareApplication+image+descripción en cada una.
- [ ] **F-22 · Deploy contamina producción:** GitHub Actions (`pages.yml`) sube **TODO el root** → **37.163 ficheros** de `tools/auto-shorts/` (con node_modules) y `undefined/.config/...` quedan públicos. → En pages.yml, subir un artefacto limpio (exclude `tools/auto-shorts`, `undefined`, `docs`, `logs`, `scripts`, `deploy`, `.gsc*`, `telegram-bot`, `webhooks`, `email-sequences`, `content-calendar`, `kpi-dashboard`, `pins`) o mover auto-shorts fuera del root. BONUS: deploy más rápido.
- [ ] **F-23 · Dos developer IDs de Play distintos:** manifest.json usa `dev?id=5224914033326414083`, conversion.js `dev?id=7060930672313565766`. Verificar en Play Console cuál es el real y unificar (uno de los dos apunta a una cuenta vacía).
- [ ] **F-24 · Aplicar los 12 títulos ASO de `docs/ASO-play-titles.md`** en Play Console (acción externa, doc ya existe). `aggregateRating` solo con reseñas reales (correcto hoy).
- [ ] **F-25 · app-ads.txt** requiere package IDs reales si se activa AdMob (hoy placeholder).

---

## 6. RENDIMIENTO / INFRA (menor, anotado)

- [ ] **F-26 · `glossary.html` = 224 KB** single page (533 términos). Para #1 en "occult glossary" conviene, pero valorar paginar por letras o lazy-render si LCP sufre.
- [ ] **F-27 · CSP** permite `unsafe-inline`/`unsafe-eval` (necesario hoy por inline snippets); no bloquear, anotar como deuda.
- [ ] **F-28 · `CNAME`/canonicals** consistentes (sin www, https) — verificado OK en muestras.
- [ ] **F-29 · Carpeta `undefined/`** (log de opencode dentro del deploy) → borrar del repo.

---

## 7. ORDEN DE EJECUCIÓN RECOMENDADO (máximo impacto/mínimo esfuerzo primero)

1. **F-3** hreflang `.html.html` (20 ficheros, mecánico, desbloquea ES) → 2. **F-1** catálogos apps/books + landing/lead-magnet con GA4+conversion → 3. **F-2** unificar consent + banner en 134 págs → 4. **F-18/F-19** regenerar llms.txt + llms-full.txt → 5. **F-8** home keywords+links → 6. **K1..K6** striking distance → 7. **F-4** webhooks/MailerLite/GCP (externo) → 8. **F-7/F-9/F-11** series blog → 9. **F-22** deploy limpio → 10. resto.

## 8. QUEDÓ FUERA Y POR QUÉ

- **GSC en vivo hoy**: DNS de la API bloqueado en esta máquina (www.google.com responde, searchconsole no). Los números vienen del doc del 2026-10-14. Re-ejecutar `node .gsc.cjs query top-queries 2026-07-15 <hoy> sc-domain:cha0smagicklabs.com` cuando el token esté vivo.
- **Errores de consola en navegador real**: petición explícita de no usar browser/pty; se sustituyó por chequeo estático completo (sintaxis JS, srcs, DOM deps de plantillas). Si tras F-1/F-2 quieres paseo de consola en vivo, se hace aparte.
- **Play Store listings reales** (títulos/desc store): requieren acceso Play Console; existe `docs/ASO-play-titles.md` como fuente.
- **Contenido ES pendiente de indexar**: decisión de Google, no del repo; lo accionable (hreflang, lastmod, links) está en F-3/F-6.
