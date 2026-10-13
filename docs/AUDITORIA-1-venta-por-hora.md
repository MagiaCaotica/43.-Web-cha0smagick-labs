# AUDITORÍA COMPLETA — cha0smagick labs
## Objetivo: 1 venta por hora (24 ventas/día)

*Fecha: 2026-10-13 · Alcance: ventas, competidores, marketing, aplicación de paradigmas*

---

## 0. RESUMEN EJECUTIVO

El sitio tiene **infraestructura de funnel completa pero inmadura en ejecución**: 9 libros ($3.99–$9.99 via Hotmart), bundles ($24.99/$49.99), 61 herramientas gratuitas que nutren apps de pago, programa de afiliados (30–40%), lead magnets, 2 secuencias de email y calendario de contenido.

**Diagnóstico en una línea:** no es un problema de oferta ni de producto — es un problema de **tráfico, prueba social y priorización de oferta**.

**Los 3 datos que lo demuestran:**
1. `data/social-proof.json` → `testimonials: []` (cero prueba social en un nicho emocional/de confianza)
2. `data/social-performance.json` → `pinterest-pin.score: null` (canal activado pero sin medir ni optimizar)
3. La homepage ofrece $3.99 individual; el bundle $24.99 (que multiplica AOV ×5) compite en igualdad de condiciones con los libros sueltos.

**La matemática de 1 venta/hora:**
- AOV actual estimado (mezcla de $3.99–$9.99): ~$6 → 24 ventas/día = **$144/día**
- AOV con bundle forzado: ~$20 → 24 ventas/día = **$480/día**
- Conversión típica de tráfico frío en nichos esotéricos: 1–3%
- Tráfico necesario: **800–2,400 visitas/día** (hoy probablemente < 100)
- Con email + afiliados + contenido SEO funcionando: 40–60% de esas ventas pueden venir sin tráfico propio nuevo.

---

## 1. ANÁLISIS DE VENTAS (estado actual del funnel)

### 1.1 Inventario de productos

| Producto | Precio | Rol en el funnel |
|---|---|---|
| 9 libros PDF (ES/EN) | $3.99–$9.99 | Entrada (tripwire) |
| books-bundle | $24.99 | AOV multiplicador |
| apps-bundle | — | AOV multiplicador |
| complete-access | $49.99 | Oferta premium |
| flash-sale | — | Urgencia/escasez |
| Apps Google Play (PSI GYM, Astral Lab, Tarot, Rune Oracle…) | $3.99+ | Producto + fuente de tráfico |

### 1.2 Funnel existente (bien diseñado en papel)

```
Tráfico (Pinterest, blog, SEO compare/) 
  → Herramienta gratuita (61 tools: calculadoras, referencias)
  → App / Lead magnet (Guía rápida ES/EN)
  → Secuencia email quickstart-to-buyer
  → Libro $3.99-9.99 / Bundle $24.99
  → Upsell post-compra (complete-access $49.99)
  → Afiliados (30-40%) re-alimentan el tráfico
```

### 1.3 Brechas de ventas detectadas

| # | Brecha | Evidencia | Impacto |
|---|---|---|---|
| V1 | **Cero prueba social** | `social-proof.json` vacío | Nicho emocional: sin confianza, la conversión cae 50%+ |
| V2 | **Bundle invisible en homepage** | Página index muestra precios individuales primero | AOV潜力 $6 en vez de $20+ |
| V3 | **Sin urgencia por defecto** | flash-sale.html existe pero no es destino por defecto | Pierde paradigma de escasez |
| V4 | **Sin datos de conversión** | analytics solo tiene config de privacidad, no eventos agregados | No se puede optimizar lo que no se mide |
| V5 | **9 páginas de producto compitiendo entre sí** | Cada libro es un embudo independiente sin jerarquía | Diluye el tráfico en 9 embudos débiles |
| V6 | **Afiliados sin promoción activa** | dashboard existe, pero 0 testimonios, 0 señales de comunidad | El canal 30-40% está apagado |

### 1.4 Paradigmas de ventas a aplicar (mapeo directo)

1. **Pricing psychology / decoy effect** → Reordenar: mostrar bundle $24.99 como opción destacada, libro individual $9.99 como "decoy" que hace el bundle irresistible, y el $3.99 como tripwire de entrada.
2. **Price anchoring** → complete-access $49.99 con precio tachado "$175" (ya existe en la página: $175 de valor anclado). Replicar en homepage.
3. **Escasez/urgencia** → flash-sale con contador real (deadline honesto de 48h, reabierto mensualmente). Jamás fake countdown (destruye confianza).
4. **Social proof** → Rellenar `social-proof.json` ANTES que cualquier otra cosa: pedir cita textual a cada comprador via email de entrega de Hotmart. 3 testimonios reales = obligatorio mínimo.
5. **Risk reversal** → garantía explícita de devolución 7 días en cada página de libro (Hotmart ya la ofrece: anunciarla reduce fricción de compra).
6. **One-time offer (OTO)** → post-purchase-upsell.json ya existe; verificar que Hotmart lo dispara en el orden de compra (checkout bump: "añade complete-access por $24.99 más, solo ahora").
7. **LTV / ascensión de valor** → escalera clara: $0 (tools) → $3.99 (tripwire) → $24.99 (bundle) → $49.99 (complete-access). Nadie debe poder comprar sin ver el siguiente peldaño.

---

## 2. ANÁLISIS DE COMPETIDORES

### 2.1 Libros de chaos magick (competencia directa en producto)

| Competidor | Producto | Precio aprox | Su ventaja | Tu contra-jugada |
|---|---|---|---|---|
| Peter J. Carroll — *Liber Null* | Clásico fundacional | ~$15 (Amazon) | Autoridad histórica | Precio de entrada más bajo + español nativo |
| Phil Hine — *Condensed Chaos* | Clásico | ~$14 | Nombre reconocido | Enfoque práctico/herramental vs. teoría |
| Jaq D. Hawkins — *Chaonomicon* | Enciclopédico | ~$20 | Densidad | Tu bundle: 9 libros por $24.99 = valor imbatible |
| Alan Chapman / Ray Sherwin | Clásicos | ~$10–18 | Tradición | Modernidad: apps + libros integrados (ellos no tienen apps) |

**Conclusión competitiva 1:** el mercado de libros está saturado de clásicos en inglés. Tu diferencial real es **(a) español nativo** y **(b) ecosistema app+libro** que ningún clásico tiene.

### 2.2 Apps esotéricas (competencia en canal app)

| Competidor | Modelo | Lección para ti |
|---|---|---|
| Co-Star | Freemium + suscripción, marketing social viral | El contenido de "tu carta" es el gancho de captura #1 del mercado |
| Astrotalk | Marketplace de astrólogos,billions | La **consulta 1-a-1** es el producto de mayor margen del nicho |
| Nebula | Quiz de entrada + suscripción | El quiz (diagnóstico personalizado) convierte mejor que la landing directa |
| Apps de sueños/tarot (research: dream-interpretation-apps, lucid-dreaming-apps) | Suscripción + rewarded ads | Monetización híbrida supera a pago único |

**Conclusión competitiva 2:** los jugadores grandes validaron que **el gancho personalizado** (carta natal, quiz, diagnóstico) es el primer peldaño. Tus 61 tools gratuitas ya son eso — solo falta usarlas como puerta de entrada publicitada, no como sección escondida.

### 2.3 Posicionamiento recomendado

> *"El único ecosistema de caos donde la teoría (9 libros), la práctica (apps) y las herramientas (61 calculadoras gratuitas) trabajan juntas — en español."*

Ni Carroll ni Co-Star pueden reclamar eso.

---

## 3. ANÁLISIS DE MARKETING

### 3.1 Canales actuales (inventario)

| Canal | Estado | Veredicto |
|---|---|---|
| Pinterest (pins/) | Activo, sin medir (score null) | Canal correcto para el nicho; falta dato y volumen |
| Blog (blog/) | Existe, pocos posts | SEO a largo plazo; mantener pero no prioridad #1 |
| SEO compare/ (astral-lab-vs-co-star) | 1 página | Estrategia correcta; escalar a 20+ páginas comparativas |
| Email (2 secuencias) | quickstart-to-buyer + post-purchase | Bien diseñado; falta alimentarlo con tráfico |
| Afiliados (30-40%) | Dashboard + términos listos | Apagado: cero reclutamiento activo |
| Content calendar | Planificado | Bien; ejecutar contra keywords, no contra fechas |

### 3.2 Paradigmas de marketing a aplicar

**M1 — Funnel de atención: "Tool-first marketing" (paradigma Nebula/Co-Star)**
Cada herramienta gratuita (las 61) debe tener su propia landing indexable: "calculadora de ascendente gratis", "signo lunar gratis". Son 61 páginas de SEO long-tail que capturan intención y empujan hacia app/libro. Coste: casi cero (static site ya generado).

**M2 — Content SEO comparativo (paradigma "vs" pages)**
Escalar `astral-lab-vs-co-star.html` a una serie: tarot-chaos-vs-libros-clásicos, astral-lab-vs-nebula, generador-sigilos-vs-manual. Quien busca comparaciones está a un paso de comprar.

**M3 — Pinterest como motor principal (paradigma visual niche)**
El nicho esotérico es el mejor nicho de Pinterest (alto CTR, contenido evergreen). Requisitos:
- 5–10 pins/día (el calendario de contenido ya lo soporta)
- Cada pin → herramienta gratuita (NO directo a checkout: Pinterest penaliza venta directa)
- Medir score semanal en `social-performance.json` (hoy null → primer dato esta semana)

**M4 — Email: paradigma de secuencia de valor (80/20)**
La secuencia quickstart-to-buyer debe seguir: 3 emails de valor puro → 1 email de oferta (tripwire $3.99) → 2 valor → 1 bundle $24.99 con deadline. Ratio 80 valor / 20 venta evita bajas y sostiene entregabilidad.

**M5 — Afiliados: paradigma de reclutamiento activo**
30–40% de comisión es generoso (Hotmart estándar es 30–50% en info-productos). Acción: listar los 20 canales/YouTubers de magia en español de 10k–100k subs y contactar 5/semana con offer directa: "40% de por vida, cookie de Hotmart, material listo en el dashboard". 10 afiliados activos con 2 ventas/semana cada uno = 20 ventas/semana solo de este canal.

**M6 — Paid: solo después de validar orgánico**
Con AOV $6 y sin LTV medido, el tráfico pagado pierde dinero. Orden correcto: probar $5/día en Pinterest Ads solo cuando el funnel orgánico convierta ≥2% y complete-access esté en el upsell.

### 3.3 Prueba social (el multiplicador transversal)

El nicho compra por identidad y pertenencia, no por specs. Acciones en orden:
1. Email automático a compradores Hotmart pidiendo testimonio (plantilla en el dashboard de afiliados)
2. Rellenar `social-proof.json` → se muestra solo con citas REALES (el propio archivo ya lo exige legalmente)
3. Capturas de reviews de Google Play de tus apps (son tuyas y verificables)
4. Contador honesto de lectores/descargas cuando supere 100

---

## 4. PLAN DE EJECUCIÓN — 30 días hacia 1 venta/hora

### Semana 1 — Convertir mejor (sin tráfico nuevo)
- [ ] Homepage: bundle $24.99 destacado arriba, ancla $175 de complete-access, garantía Hotmart visible
- [ ] Pedir testimonios a todos los compradores previos → llenar `social-proof.json` (mínimo 3 reales)
- [ ] flash-sale.html conectado como destino de los emails de oferta (urgencia 48h real, mensual)
- [ ] Verificar OTO en Hotmart checkout (bump de complete-access)
- [ ] Activar eventos de conversión en analytics (checkout_click, purchase) para poder medir desde el día 1

### Semana 2 — Tráfico orgánico barato
- [ ] 5 landing pages de herramientas top (de las 61) con SEO long-tail ES
- [ ] 5 pins/día en Pinterest → cada pin a su herramienta
- [ ] 3 páginas "vs" nuevas en compare/
- [ ] Primer score registrado en social-performance.json

### Semana 3 — Canal afiliados
- [ ] Lista de 20 creadores ES (YouTube/TikTok/Instagram) del nicho
- [ ] Contactar 5 con propuesta de 40% + material listo
- [ ] Post en foros/reddits del nicho (r/chaosmagick etc.) con la herramienta gratuita (sin spam de venta)

### Semana 4 — Escalar lo que funcione
- [ ] Duplicar la producción del canal con mejor score
- [ ] Primera campaña de prueba $5/día si conversión orgánica ≥ 2%
- [ ] Revisar dashboard KPI: ventas/día, AOV, fuente

### Meta incremental realista
- Día 7: 2–4 ventas/día (no 24 — la honestidad aquí evita decisiones basadas en esperanza)
- Día 30: 8–12 ventas/día con afiliados activos
- Día 60: 24 ventas/día (1/hora) cuando: afiliados (10+) + Pinterest medido y optimizado + bundle como oferta por defecto + email alimentándose

**El atajo para llegar antes:** cada venta que entra por el tripwire $3.99 debe ver la OTO de $24.99 (Hotmart order bump). Si 25% acepta, el AOV sube a ~$12 y el objetivo se alcanza con la mitad de tráfico.

---

## 5. MÉTRICAS A VIGILAR (dashboard)

| Métrica | Hoy | Meta semana 2 | Meta día 60 |
|---|---|---|---|
| Ventas/día | sin dato | 2 | 24 |
| AOV | ~$6 | $12 (con bump) | $15+ |
| Tasa conversión sitio | sin dato | ≥1.5% | ≥2.5% |
| Email list | sin dato | +100/sem | +500/sem |
| Afiliados activos | 0 | 2 | 10 |
| Pinterest score | null | primer dato | optimizado |
| Testimonios | 0 | 3 | 10 |

---

*Auditoría generada sobre el estado real del repo: 9 landing de libros, 4 landing pages comerciales, 61 tools mapeadas en data/tool-funnels.json (v1, 2026-09-25), 2 secuencias de email, programa de afiliados 30–40% (data/affiliate-rates.json), investigación previa en .firecrawl/ (competitors + 14 deep-dives de monetización).*

---

## APÉNDICE (revisión 2): LAS 12 APPS SON LA PUNTA DE LANZA

Corrección del propietario: el análisis original subestimó las apps. El catálogo completo (data/play-catalog.json + README):

| App | Precio | App | Precio |
|---|---|---|---|
| Psi Gym (Zener ESP) | $3.99 | Arcana Goetia | $3.99 |
| Rider-Waite Tarot | $9.99 | NOCTEM (suite paranormal) | $14.99 |
| Norse Rune Oracle | $3.99 | Eerie Roads | $9.99 |
| Dream Machine | $3.99 | I Ching Oracle | $3.99 |
| Chaos Sigil Generator | $3.99 | Lunar Phase Calculator | $3.99 |
| Astral Lab | $6.99 | Lucid Dream | $9.99 |

Pago único, sin suscripciones, canal de cobro: Google Play (cuenta developer activa).

### Restricción crítica verificada por el propietario

**Google Play NO permite vender bundles de apps** ni cobrar códigos de app fuera de la tienda (viola las Play Policies). Opciones evaluadas:

1. **App suite única** (única vía de cobrar un "bundle" DENTRO de Play): una sola app que contenga las 12 herramientas a precio único. Patrón ya existente: NOCTEM $14.99 es una suite. Trabajo de desarrollo futuro — la vía real para "bundle cobrado desde Play".
2. **Play Pass**: inclusión de apps pagadas en la suscripción de Google, pero es curaduría/invitación de Google — no controlable.
3. **Bundle vía Hotmart (LEGAL, ya existe)**: Inner Circle $9/mes incluye "Acceso PWA Apps (web wrapper)". Cobrar fuera de Play un acceso web NO toca el billing de Play → permitido.
4. **Promo codes**: regalarlos es legal; venderlos vía Hotmart = venta off-store de derechos de Play → descartado.

### Consecuencia aplicada en el sitio

- `landing-pages/flash-sale.html`: CTA principal = Ecosistema Completo $99 (Hotmart, pendiente de ID — acción del propietario); canales VIVOS secundarios = apps individuales en Play ($3.99–$14.99 c/u) y 8 Libros Bundle $19.99 Hotmart (D93257466P, disponible ya). Eliminado el falso "12 Apps Bundle $29.99 (GOOGLE PLAY)" (era un link de colección, no un checkout).
- `landing-pages/apps-bundle.html`: reconvertida a catálogo honesto "Las 12 Apps" (sin precio $29.99, sin JSON-LD Product InStock falso, FAQ corregida, analytics `select_item` en vez de `begin_checkout`).

### Puntos diferidos (decisión del propietario)

- Punto 1 (testimonios) y Punto 6 (afiliados): postergados.
- Emails: se gestionan desde **MailerLite**, no desde la web → guía de pasos del propietario en `docs/MAILERLITE-setup.md`.
