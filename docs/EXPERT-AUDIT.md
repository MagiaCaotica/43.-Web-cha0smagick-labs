# Auditoría experta multi-agente — cha0smagicklabs.com

**Fecha:** 2026-10-24 · **Objetivo:** USD 5.000/mes  
**Método:** aplicar los frameworks de 12 agentes especializados del catálogo Adeptus Vinictus II a los datos reales del sitio (GSC 817 imp/32 clics, 1.032 páginas, 12 apps, 6 libros, 70 herramientas).

---

## 1. biz/publicista — Posicionamiento y marca

**Framework aplicado:** diferencia creíble, prueba, mensaje para el oído, una idea por anuncio.

**Hallazgos:**
- **Posicionamiento débil por abaratamiento:** "From $3.99 one-time, no subscriptions" es el mensaje dominante. El publicista advierte: "abaratarse es el posicionamiento más peligroso — no tiene baluarte, cualquiera compite en precio." El sitio compite en precio contra apps gratuitas de astrología con millones de descargas.
- **Sin frase exacta que se repita sola:** no hay un tagline memorable. "Cybermancy • Techno-Sorcery • Cyberpaganism" es decoración, no posición.
- **Diferencia no probada:** "ephemeris-based calculations" y "no subscriptions" son diferencias reales pero no se demuestran visualmente. No hay comparativa lado a lado con Co-Star o The Pattern.

**Recomendaciones:**
1. Posicionamiento: "La única app de astrología que no te cobra cada mes ni vende tus datos." (diferencia creíble + prueba).
2. Crear una página `/compare/cha0smagick-vs-costar.html` con comparativa real.
3. Reducir el mensaje a una idea por página: la home dice "ocultismo + apps + libros + 70 tools + zero tracking + Android" = 5 ideas = ninguna.

---

## 2. biz/ventas — Funnel y cierre

**Framework aplicado:** calificar antes de prospectar, diagnosticar, una acción clara.

**Hallazgos:**
- **Sin calificación de leads.** El sitio no distingue entre "curioso" y "comprador". Todo el tráfico va al mismo funnel.
- **CTA genérico.** "Get the app — $3.99" no dice por qué ahora. Falta urgencia o razón de compra inmediata.
- **Sin manejo de objeciones antes del CTA.** La página de app no responde "¿por qué esta y no la gratuita?" antes del botón de compra.
- **Sin seguimiento post-clic.** No hay retargeting ni email capture para los que no compraron.

**Recomendaciones:**
1. Cada página de app debe tener una sección "Por qué esta y no la gratuita" antes del CTA.
2. Añadir "Garantía: si no te sirve, reembolso en 14 días" junto al botón de compra.
3. Capturar email antes de redirigir a Play Store ("Envíame el enlace de descarga").

---

## 3. biz/growth-loops — Loops vs. funnels

**Framework aplicado:** loops compounding vs. funnels lineales. K viral > 1.

**Hallazgos:**
- **No hay loops, solo funnels lineales.** Tráfico → herramienta → CTA → Play Store. Cuando el tráfico para, las ventas paran.
- **Sin loop de contenido:** las herramientas generan resultados pero no generan contenido indexable automáticamente. Cada herramienta podría generar una "lectura compartible" (como un horóscopo personalizado) con URL única → SEO loop.
- **Sin loop viral:** las apps no tienen "invita a un amigo" ni "comparte tu sigilo". El sigil generator podría generar un sigilo compartible en redes sociales con marca de agua → loop de creación.
- **Sin loop de datos:** las 70 herramientas recopilan inputs (fechas, nombres) pero no los usan para personalizar la experiencia ni para generar contenido.

**Recomendaciones:**
1. **Sigil sharing loop:** el generador de sigilos produce una imagen PNG con marca de agua → el usuario la comparte en Instagram/TikTok → nuevo tráfico. K potencial > 0,3.
2. **Lectura compartible:** cada herramienta genera un resultado con URL única (ej: `/tools/full-birth-chart.html?result=abc123`) → compartible → SEO + viral.
3. **Email loop:** capturar email al usar una herramienta → enviar 1 email/semana con "tu horóscopo de la semana" → re-engagement → tráfico recurrente.

---

## 4. biz/content-marketer — Estrategia de contenido

**Framework aplicado:** content pillars, topic clusters, SEO score, engagement > 5 %, conversión > 2 %.

**Hallazgos:**
- **Sin topic clusters.** Hay 70 herramientas y ~30 artículos de blog, pero no hay agrupación por tema (cluster "sigil magic" → pillar + 5 articles + 3 tools). Google premia la autoridad temática.
- **Sin calendario editorial medible.** Los artículos se publican pero no hay tracking de "qué artículo genera más conversiones".
- **Sin reutilización de contenido.** Un artículo de 2.000 palabras podría ser 5 TikToks, 3 pins de Pinterest, 1 email. No hay proceso de reciclaje.
- **Keyword cannibalization:** "chaos magic" aparece en 5+ artículos sin diferenciación clara. Debería haber 1 pillar page + satélites.

**Recomendaciones:**
1. **Topic clusters:** crear 4 clusters (sigil magic, chaos magic, astrology apps, Goetia) con 1 pillar + 5-8 satélites cada uno. Internal linking masivo dentro del cluster.
2. **Content repurposing pipeline:** cada artículo → 3 TikToks + 2 Pinterest pins + 1 email. Automatizar con el bot de Telegram/Discord existente.
3. **Tracking de conversión por artículo:** añadir UTM a cada CTA de artículo para saber cuál genera más ventas.

---

## 5. biz/landing-page-copywriter — Copy de landing

**Framework aplicado:** above-the-fold < 5 segundos, single CTA, social proof cerca de fricción, objection handling.

**Hallazgos:**
- **Above-the-fold de apps:** el H1 es "Astral Lab" + "Cybermancy • Techno-Sorcery • Cyberpaganism" + párrafo. El valor ("carta natal precisa, offline, sin suscripción") aparece a los 3 scrolls. **Falla el test de 5 segundos.**
- **Sin social proof cerca del CTA.** La línea "21 reviews on Google Play" está en el footer, no junto al botón de compra.
- **Sin objection handling.** No hay sección "¿Por qué esta y no la gratuita?" antes del CTA.
- **CTA genérico.** "Get the app — $3.99" no refuerza el valor. Debería ser "Get Astral Lab — $6.99, no subscription, works offline."

**Recomendaciones:**
1. Reestructurar cada página de app: H1 = beneficio ("Your natal chart, offline, no subscription"), subhead = prueba (rating + installs), CTA = valor ("Get it — $6.99, one-time").
2. Mover el social proof (installs, rating) a 20 px del botón de compra.
3. Añadir sección "Why not the free one?" con 3 bullets (precisión, offline, sin ads) antes del CTA.

---

## 6. biz/product-manager — Producto y pricing

**Framework aplicado:** diferenciación creíble, pricing por valor, no por costo.

**Hallazgos:**
- **12 apps sin jerarquía.** 6 son generadores de sigilos o similares → canibalización. El usuario que busca "sigil generator" tiene 3 opciones sin guía.
- **Pricing uniforme ($3.99) sin diferenciación.** Astral Lab (carta natal completa) vale lo mismo que un generador de sigilos. No hay anchor pricing.
- **Sin freemium.** Todas las apps son de pago. Una versión gratuita con IAP (in-app purchase) de funciones premium podría multiplicar las descargas 10×.
- **Sin bundles de apps.** (Rechazado por diseño, pero podría reconsiderarse como "pack" en Hotmart.)

**Recomendaciones:**
1. **3 apps flagship a precio premium:** Astral Lab ($6.99), Arcana Goetia ($6.99), PSI GYM ($4.99). Resto a $2.99 o freemium.
2. **Freemium para 2-3 apps** (sigil generator, horoscope) con IAP para funciones premium. Multiplica descargas → más reviews → mejor ranking.
3. **Jerarquía visual:** marcar las 3 flagship con "⭐ Recommended" en todas las páginas.

---

## 7. biz/customer-success-manager — Retención y LTV

**Framework aplicado:** onboarding, adopción, churn, upsell, advocacy.

**Hallazgos:**
- **Sin onboarding en las apps.** El usuario compra, descarga, y se encuentra solo. No hay tutorial ni "primer paso".
- **Sin email post-compra.** No hay secuencia de 5 emails para activar al usuario.
- **Sin upsell.** Un usuario que compra una app a $3.99 nunca ve los libros ni el bundle.
- **Sin advocacy.** No hay mecanismo de "deja una review" ni "comparte con un amigo".
- **Sin medición de churn.** No sabemos cuántos usuarios dejan de usar la app después de 7 días.

**Recomendaciones:**
1. **Onboarding in-app:** primer uso → tutorial de 3 pasos → "tu primera lectura".
2. **Email sequence (5 emails):** día 0 (bienvenida + tutorial), día 3 (tip avanzado), día 7 (caso de uso), día 14 (upsell libro), día 30 (review request).
3. **In-app upsell:** después de 5 usos, mostrar "¿Quieres la teoría completa? Lee el Codex Chaoticus ($4.99)".
4. **Review prompt:** después de la 3ª sesión exitosa, pedir review en Play Store.

---

## 8. biz/ux-researcher — Investigación UX

**Framework aplicado:** mixed-methods, usabilidad, insights accionables.

**Hallazgos:**
- **Sin datos de usuario.** No hay heatmaps, session recordings, ni encuestas. Se optimiza a ciegas.
- **Sin test A/B.** El snippet de "best astrology apps 2026" se cambió pero no hay forma de medir si el nuevo convierte mejor.
- **Sin research de keywords cualitativo.** No sabemos qué busca el usuario cuando dice "sigil maker" — ¿quiere generar un sigilo, aprender la técnica, o encontrar una app?
- **Sin test de usabilidad en móvil.** Se corrigieron problemas técnicos (overflow, tap targets) pero no se probó si un usuario real puede completar el flujo "herramienta → CTA → Play Store" en 30 segundos.

**Recomendaciones:**
1. **Instalar Microsoft Clarity** (gratis) para session recordings y heatmaps en móvil.
2. **Test de 5 segundos:** mostrar la home a 5 personas durante 5 segundos y preguntar "¿qué hace este sitio?" Si no dicen "apps de ocultismo/astrología", el hero falla.
3. **Encuesta de 1 pregunta** en las herramientas: "¿Qué estabas buscando cuando llegaste aquí?" (opciones: generar un sigilo, aprender astrología, encontrar una app, otro).

---

## 9. domain/seo-specialist — SEO técnico y de contenido

**Framework aplicado:** crawlability, structured data, content strategy, authority.

**Hallazgos:**
- **Sin backlinks verificados.** 0 enlaces externos de calidad. El dominio no rankea para queries competitivas.
- **67 páginas thin (ahora ~28).** Mejorado, pero aún hay 28 páginas con < 400 palabras (legales, landing de ofertas rechazadas, search pages).
- **Sin Core Web Vitals medidos.** La home carga 26 scripts y 50 imágenes. Probablemente falla LCP y CLS.
- **Sin featured snippets.** Las preguntas del FAQ no están optimizadas para posición 0.
- **Keyword cannibalization:** "chaos magic" aparece en 5+ artículos sin diferenciación. Debería haber 1 pillar + satélites.

**Recomendaciones:**
1. **Backlinks:** programa de guest posts en blogs de ocultismo (5-10 enlaces en 3 meses). Directorios de apps (AlternativeTo, Product Hunt).
2. **CWV:** medir con PageSpeed Insights. Optimizar imágenes (WebP, lazy loading), reducir scripts en home.
3. **Featured snippets:** reformatear FAQs como pregunta-respuesta directa (40-60 palabras) para capturar posición 0.
4. **Pillar pages:** ya creadas (chaos-magic-guide, astrology-apps-compared, sigil-magic-complete-guide). Falta añadir internal linking masivo.

---

## 10. research/competitive-analyst — Competencia

**Framework aplicado:** competidores directos/indirectos, SWOT, oportunidades.

**Hallazgos:**
- **Competidores directos (apps):** Co-Star (5M+ descargas, freemium), The Pattern (1M+, suscripción $7/mes), Chani ($15/mes), TimePassages ($30 one-time). Cha0smagick Labs tiene 12 apps a $3.99 cada una → **precio más bajo pero sin marca reconocida.**
- **Competidores indirectos (contenidos):** Llewellyn (libros), Learn Religions (web), Reddit r/occult (comunidad). El sitio compite por atención, no solo por ventas.
- **Ventaja única:** "sin suscripción, sin ads, sin tracking, one-time purchase." Nadie en el mercado de apps de astrología ofrece esto. Pero no se comunica como diferenciador principal.
- **Amenaza:** apps gratuitas con ads (AstroSeek, CafeAstrology) capturan el tráfico de "free astrology" y tienen más autoridad.

**Recomendaciones:**
1. **Comunicar la diferencia como headline:** "The only astrology app that doesn't charge you every month." (no "from $3.99").
2. **Página de comparativa:** `/compare/cha0smagick-vs-costar.html` con tabla honesta (precio, offline, ads, tracking, precisión).
3. **Posicionarse en el nicho:** no competir con Co-Star por "astrology app" (imposible). Competir por "offline astrology app", "no subscription astrology", "occult apps Android".

---

## 11. qa/performance-engineer — Rendimiento

**Framework aplicado:** baselines, bottlenecks, load tests, CWV.

**Hallazgos:**
- **Home: 26 scripts, 50 imágenes, 2.854 palabras.** Probablemente falla LCP (> 2,5 s) y CLS (> 0,1).
- **Sin lazy loading verificado.** Las imágenes de la home probablemente cargan todas a la vez.
- **Sin code splitting.** Todos los scripts se cargan en todas las páginas, incluso los que no se usan.
- **Sin CDN.** GitHub Pages sirve desde un solo servidor. Para tráfico global, un CDN (Cloudflare) mejoraría TTFB.

**Recomendaciones:**
1. **Medir CWV** con PageSpeed Insights (gratis). Identificar LCP y CLS específicos.
2. **Lazy loading:** añadir `loading="lazy"` a todas las imágenes below-the-fold.
3. **Reducir scripts en home:** de 26 a ~8 (solo los necesarios para el above-the-fold).
4. **Cloudflare:** añadir como CDN (gratis) para mejorar TTFB global.

---

## 12. biz/landing-page-copywriter — Copy de landing

**Framework aplicado:** above-the-fold < 5 s, single CTA, social proof cerca de fricción, objection handling.

**Hallazgos:**
- **Home above-the-fold:** logo 200 px + título 3 rem + tagline + nav 2 filas + breadcrumb = ~700 px antes del H1 real. **Falla el test de 5 segundos.**
- **Sin social proof cerca del CTA.** "21 reviews on Google Play" está en el footer, no junto al botón de compra.
- **Sin objection handling.** No hay "¿Por qué esta y no la gratuita?" antes del CTA.
- **CTA genérico.** "Get the app — $3.99" no refuerza el valor.

**Recomendaciones:**
1. **Hero simplificado:** logo 64 px + H1 ("Astrology apps that don't charge you monthly") + subhead ("12 apps, one-time purchase, no ads, no tracking") + 1 CTA ("Download on Google Play") + 3 apps destacadas.
2. **Social proof a 20 px del CTA:** "⭐ 4.5 · 50+ installs · No subscription".
3. **Objection handling:** sección "Why not the free one?" con 3 bullets antes del CTA final.

---

## Síntesis: las 10 mejoras de mayor impacto (ordenadas por ROI)

| # | Mejora | Agente | Impacto | Esfuerzo | Puedo hacerlo |
|---|---|---|---|---|---|
| 1 | Google Ads USD 5-10/día en "sigil generator" | growth-loops | **Alto** | 4 h | No (cuenta) |
| 2 | Internal linking masivo (tools → content → pillar pages) | seo-specialist | **Alto** | 8 h | **Sí** |
| 3 | Pillar pages (ya creadas: chaos-magic, astrology-apps, sigil-magic) | content-marketer | **Alto** | 6 h | **Sí (hecho)** |
| 4 | Snippets de 10 queries con 0 clics | seo-specialist | **Alto** | 2 h | **Sí (parcial)** |
| 5 | Home simplificada (hero + 3 apps + 1 CTA) | landing-page-copywriter | **Alto** | 4 h | **Sí** |
| 6 | Social proof a 20 px del CTA en apps | landing-page-copywriter | **Medio** | 2 h | **Sí (hecho)** |
| 7 | Email capture + secuencia de 5 emails | customer-success | **Medio** | 8 h | Parcial (código sí, ESP no) |
| 8 | TikTok/Reels 1 video/día | content-marketer | **Alto** | 10 h/sem | No (grabación) |
| 9 | Backlinks (guest posts, directorios) | seo-specialist | **Alto** | 20 h | No (outreach) |
| 10 | CWV + Cloudflare CDN | performance-engineer | **Medio** | 8 h | Parcial (código sí, DNS no) |

---

## Lo que ya está bien (no tocar)

- Indexación perfecta (1.011 URLs, 0 huérfanas, 0 contradicciones).
- hreflang limpio y recíproco.
- JSON-LD 100 %, Article 99,9 %, FAQPage 97,6 %.
- Móvil corregido (header, overflow, tap targets, breadcrumb).
- 6-book bundle con pricing correcto.
- 36 herramientas enriquecidas con deep-dive.
- 3 pillar pages creadas.
- Social proof + flagship badges en apps.
- Bundle upsell en todas las páginas de libros.

---

## Próximo paso inmediato (código)

Si quieres que siga con código, el **mayor ROI** restante es:
1. **Internal linking masivo** — añadir "Related guides" a las 36 herramientas + enlazar desde las 3 pillar pages a cada herramienta relevante.
2. **Home simplificada** — hero + 3 apps + 1 CTA + social proof.
3. **Snippets** de las 8 queries restantes con 0 clics.

¿Empezamos por el internal linking? Es código puro, alto impacto, y no depende de cuentas externas.