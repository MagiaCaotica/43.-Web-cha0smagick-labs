# Mega-auditoría para alcanzar USD 5.000/mes — cha0smagicklabs.com

**Fecha:** 2026-10-24 · **Objetivo:** USD 5.000/mes mínimo, sostenible.  
**Fuentes:** GSC (817 impresiones, 32 clics), `offers.json` (12 apps + 6 libros activos), `tool-funnels.json`, `PLAN-UNICO.md`, auditorías de indexación/hreflang, métricas de móvil, inventario de páginas (1.032 HTML).

---

## 1. Veredicto ejecutivo

**El sitio está técnicamente sano pero comercialmente invisible.** Indexación perfecta (1.008 URLs, 0 huérfanas, 0 contradicciones), hreflang limpio, móvil corregido. Pero el tráfico orgánico es de **817 impresiones/mes y 32 clics**. Con esa base, los ingresos actuales son indistinguibles de cero. El cuello de botella no es el código: es **tráfico + conversión + oferta**.

Para llegar a USD 5.000/mes hace falta un plan de 3 palancas simultáneas: (a) 10–50× tráfico, (b) conversión del tráfico existente, (c) subida de ticket medio (bundle). Ninguna sola palanca alcanza.

---

## 2. Matemática de ingresos (realista)

| Producto | Precio | Neto estimado (post-comisión) | Unidades/mes para USD 5.000 |
|---|---|---|---|
| App Android | USD 3,99 | ~USD 2,79 (Google Play 30 %) | 1.792 |
| Libro individual | USD 3,99–9,99 | ~USD 3,20–8,00 (Hotmart ~20 %) | 625–1.562 |
| Bundle de libros | USD 29,99 | ~USD 24,00 | 208 |
| Mix realista | — | — | ~50 bundles + 800 apps + 100 libros |

**Conclusión:** USD 5.000/mes exige **~100 k visitas/mes cualificadas** con una conversión del 1–2 %, o menos tráfico con mejor conversión. Hoy el sitio recibe ~32 clics/mes. **Factor 3.000× de crecimiento de tráfico necesario.**

---

## 3. Auditoría de tráfico (GSC, 200 queries)

**Totales del período:** 817 impresiones · 32 clics · CTR 3,92 % · posición media alta.

**Top oportunidades (impresiones altas, clics bajos = problema de snippet):**

| Query | Imp. | Clics | Pos. | Diagnóstico |
|---|---|---|---|---|
| best astrology apps 2026 | 107 | 0 | 6,2 | **Página 1, 0 clics.** Título/meta no convence. |
| sigil maker | 96 | 4 | 10,2 | Posición 10 → página 2. Necesita empuje. |
| sigil generator | 53 | 5 | 16,3 | Posición 16 → invisible. |
| goetic magic | 47 | 1 | 8,7 | Posición 9 → casi página 1. |
| chaos magic for beginners | 19 | 1 | 9,1 | Posición 9 → casi página 1. |
| chaos magick for beginners | 11 | 2 | 8,3 | CTR 18 % (bueno, snippet funciona). |

**Patrón claro:** las queries de "sigil" y "chaos magic" tienen CTR razonable (5–18 %). Las de "astrology apps" tienen 0 % CTR aunque estén en página 1 → **el snippet no promete lo que el usuario busca** (probablemente busca una lista/comparativa, no una landing de app).

**Acción inmediata:** reescribir título y meta description de `best-occult-apps-android.html` y `astrology-app-reviews.html` para que incluyan "2026", "free", "Android" y un número ("12 apps"). Testear con GSC en 2 semanas.

---

## 4. Auditoría del funnel (tools → apps → libros)

**Lo que funciona:**
- `data/tool-funnels.json` mapea 70 herramientas → apps + libros + relacionadas.
- Eventos `tool_funnel_view` y `tool_funnel_click` instrumentados en `js/conversion.js`.
- Cada herramienta tiene CTA a app y libro.

**Lo que no funciona:**
- **Sin datos de conversión reales.** No hay mediciones de `tool_funnel_click → install → purchase`. El checkpoint dice "needs 2–3 weeks of data" pero no hay evidencia de que se esté midiendo el paso final (instalación Play → compra).
- **12 apps a USD 3,99 sin diferenciación clara.** 6 de las 12 son "generadores de sigilos" o similares → canibalización. El usuario no sabe cuál comprar.
- **Sin bundle de apps** (rechazado por diseño: "Google Play collections are not a checkout"). Esto limita el ticket medio de apps.
- **Libros: 6 activos, 3 descatalogados.** El bundle a USD 29,99 es el ticket alto. Pero no hay upsell sistemático de "compra el bundle" en las páginas de libros individuales más allá del enlace existente.
- **Sin email capture funcional.** `email-sequences/` existe pero no hay evidencia de una lista activa con el límite de 50 emails/día mencionado.

**Acción:** instrumentar el funnel completo (tool → click → Play Store install → purchase) con UTM parameters. Sin esto, se optimiza a ciegas.

---

## 5. Auditoría de oferta y pricing

**Apps (USD 3,99 cada una):**
- Precio bajo → margen bajo. USD 2,79 neto. Necesitas 1.792 ventas/mes.
- **Problema:** 12 apps sin jerarquía. El usuario que busca "sigil generator" tiene 3 opciones (Arcana Goetia, Chaos Sigil Generator, y la herramienta web gratis). No hay "mejor opción" clara.
- **Recomendación:** destacar 3 apps "flagship" (Astral Lab, Arcana Goetia, PSI GYM) con precio premium (USD 4,99–6,99) y bajar las utilitarias a USD 2,99 o freemium con IAP.

**Libros (USD 3,99–9,99):**
- 6 libros activos suman USD 48,94. Bundle a USD 29,99 = 39 % descuento.
- **Problema:** no hay precio ancla. El bundle "ahorra 39 %" no genera urgencia sin comparación visible.
- **Recomendación:** mostrar siempre "USD 48,94 por separado → USD 29,99 en bundle" con barra de progreso o contador de libros incluidos.

**Rechazados (no re-añadir sin ID real):** complete_access, inner_circle, flash_sale_99, apps_bundle. Correcto — no inventar productos.

---

## 6. Auditoría SEO (técnica + contenido)

**Lo que está bien:**
- 1.008 URLs en sitemap, 0 duplicados, 0 huérfanas, 0 noindex en sitemap.
- hreflang limpio y recíproco.
- JSON-LD 100 %, Article 99,9 %, FAQPage 97,6 %.
- 7 artículos nuevos (estacionalidad, ES ad hoc).

**Lo que falta:**
- **Backlinks: 0 verificados.** Sin autoridad externa, el dominio no rankea para queries competitivas ("best astrology apps" tiene 24 impresiones en posición 11,2).
- **Contenido thin:** 67 páginas con < 400 palabras. Muchas son landings de herramientas con poco texto.
- **E-E-A-T débil:** la página del autor (`frater-alek0s.html`) existe pero no tiene credenciales verificables, ni perfiles sociales vinculados, ni menciones externas.
- **Core Web Vitals:** no medidos en producción. El sitio carga 26 scripts en la home (2,854 palabras, 50 imágenes).
- **Sitemap excluye archivos no trackeados** → riesgo de que nuevas páginas no se indexen hasta `git add`.

**Acción:** programa de backlinks (guest posts en blogs de ocultismo/astrología, directorios de apps, Reddit/Quora con enlaces), enriquecer las 67 páginas thin, y medir CWV con PageSpeed Insights.

---

## 7. Auditoría de UX/conversión (móvil)

**Ya corregido (sprint anterior):** header 384→261 px, overflow eliminado, breadcrumb oculto en móvil, tap targets ≥ 44 px, cookie buttons ampliados.

**Aún pendiente:**
- **Home: 2.854 palabras, 13,6 pantallas.** El H1 real ("CHAOS MAGICK APPS...") queda a 755 px de la parte superior en móvil. Demasiado scroll antes del mensaje principal.
- **Nav con 14 items en móvil** que envuelven en ~5 líneas. Funcional pero feo.
- **Sin prueba social visible.** No hay reviews, ratings, ni testimonios en las páginas de apps (solo "21 reviews on Google Play" en la home).
- **Sin garantía visible.** La política de reembolso existe pero no se menciona en el above-the-fold.
- **Cookie banner cubre contenido** en móvil (fixed bottom, z-index 999999).

**Acción:** simplificar la home a hero (logo pequeño + H1 + 1 CTA + 3 apps destacadas), mover nav a menú hamburguesa en móvil, añadir rating/reviews en páginas de apps.

---

## 8. Auditoría de growth/marketing

**Canales actuales:**
- SEO orgánico (817 imp/mes — insignificante).
- Telegram bot (no verificado si está activo en grupos).
- Redes sociales (no medido).
- Email (50/día límite, sin lista verificada).

**Lo que falta:**
- **Sin canal de adquisición pagado.** Para $5k/mes, el SEO solo no basta en 90 días. Necesita ads (Google Ads para "sigil generator", Meta para apps).
- **Sin programa de afiliados/referral.** Las apps no tienen mecanismo de "invita a un amigo".
- **Sin contenido viral/short-form.** TikTok/Reels de "genera tu sigilo" con CTA a la app.
- **Sin partnerships.** Blogs de ocultismo, canales de YouTube de astrología.
- **Email:** el límite de 50/día es muy bajo para crecer. Necesita warm-up y automatización.

**Acción prioritaria:** TikTok/Reels (1 video/día mostrando la app generando sigilos) + Google Ads con USD 5-10/día en "sigil generator" y "chaos magic".

---

## 9. Plan priorizado para alcanzar USD 5.000/mes

### Fase 1 (semanas 1-2): Desbloquear conversión (impacto alto, esfuerzo bajo)

| # | Acción | Impacto | Esfuerzo |
|---|---|---|---|
| 1 | Reescribir título/meta de `best-occult-apps-android.html` y `astrology-app-reviews.html` (incluir "2026", "free", "Android", número) | Alto | 1 h |
| 2 | Destacar 3 apps flagship (Astral Lab, Arcana Goetia, PSI GYM) con precio premium y bajar utilitarias a freemium | Alto | 4 h |
| 3 | Añadir rating/reviews visible en páginas de apps (scraping de Play Store o manual) | Medio | 4 h |
| 4 | Instrumentar funnel completo con UTM (tool → click → Play install → purchase) | Alto | 8 h |
| 5 | Simplificar home: hero + 3 apps destacadas + 1 CTA | Alto | 4 h |

### Fase 2 (semanas 3-6): Tráfico (impacto alto, esfuerzo medio)

| # | Acción | Impacto | Esfuerzo |
|---|---|---|---|
| 6 | Programa de backlinks: guest posts en 5 blogs de ocultismo/astrología | Alto | 20 h |
| 7 | TikTok/Reels: 1 video/día de "genera tu sigilo" con CTA | Alto | 10 h/semana |
| 8 | Google Ads: USD 5-10/día en "sigil generator", "chaos magic", "astrology app" | Alto | 4 h setup |
| 9 | Enriquecer las 67 páginas thin (< 400 palabras) con contenido sustancial | Medio | 20 h |
| 10 | Activar Telegram bot en grupos (G11) y enviar 50 emails/día (G10) | Medio | 8 h |

### Fase 3 (semanas 7-12): Escala y retención (impacto medio, esfuerzo medio)

| # | Acción | Impacto | Esfuerzo |
|---|---|---|---|
| 11 | Programa de afiliados/referral para apps | Medio | 16 h |
| 12 | Email automation: secuencia de 5 emails post-descarga de herramienta | Medio | 8 h |
| 13 | Medir Core Web Vitals y optimizar (lazy loading, code splitting) | Medio | 8 h |
| 14 | Añadir garantía/reembolso visible en above-the-fold de apps | Bajo | 2 h |
| 15 | Contenido long-form: "Complete guide to chaos magic" (pillar page) | Alto | 12 h |

---

## 10. Métricas de seguimiento (KPIs para $5k/mes)

| KPI | Actual | Objetivo 90 días |
|---|---|---|
| Impresiones orgánicas/mes | 817 | 50.000+ |
| Clics orgánicos/mes | 32 | 2.000+ |
| CTR medio | 3,9 % | 6 % |
| Instalaciones Play/mes | ~0 | 500+ |
| Ventas apps/mes | ~0 | 200+ |
| Ventas bundle libros/mes | ~0 | 20+ |
| Ingresos/mes | ~0 | USD 1.000+ (mes 3) → USD 5.000 (mes 6) |

---

## 11. Lo que NO hacer

- No inventar productos (rejectedOffers ya lo documenta).
- No subir precios de apps sin diferenciación (el usuario percibe "otra app de $3,99").
- No traducir artículos del inglés al español (ya decidido: ad hoc para LATAM).
- No añadir más herramientas sin funnel (70 ya existen, falta tráfico).
- No cambiar el bundle de 6 libros (ya corregido).

---

## 12. Resumen: las 3 palancas

1. **Tráfico:** SEO (backlinks + contenido thin) + ads (USD 5-10/día) + social (TikTok/Reels).
2. **Conversión:** snippet optimizado (CTR 0 % → 5 %) + home simplificada + prueba social.
3. **Ticket:** destacar 3 apps premium + bundle de libros como oferta principal.

**Con las 3 palancas activas, USD 1.000-2.000/mes es realista en 90 días. USD 5.000/mes requiere 6 meses de ejecución consistente + un canal viral o paid que escale.**

---

*Auditoría generada por el Adeptus Vinictus II aplicando los métodos de `biz/publicista`, `biz/ventas`, `biz/growth-loops`, `biz/product-manager`, `biz/customer-success-manager`, `research/competitive-analyst`, `qa/ui-ux-tester`, `domain/seo-specialist` y `data/data-analyst`. Fuentes: GSC (817 imp/32 clics), `offers.json` (12 apps + 6 libros), `tool-funnels.json`, `PLAN-UNICO.md`, auditorías de indexación/hreflang, métricas de móvil, inventario de 1.032 páginas HTML.*
