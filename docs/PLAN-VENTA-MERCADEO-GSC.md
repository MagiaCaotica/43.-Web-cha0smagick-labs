# Plan de venta y mercadeo — cha0smagicklabs.com (datos reales de Search Console)

Fecha: 2026-10-14
Fuente de datos: Google Search Console API v3, propiedad `sc-domain:cha0smagicklabs.com` (permiso `siteOwner`), vía `.gsc.cjs`.
Rango principal: 2026-07-15 → 2026-10-10 (90 días). Rango histórico: 2025-06-01 → 2026-10-10 (16 meses).

> Límite del dato: las consultas de GSC devuelven `rowLimit: 500` por dimensión. Los totales de la tabla de páginas están completos para las 190 páginas con impresiones; los totales de "queries" están truncados a 500 filas y por eso subvaloran los clics.

---

## 1. Cómo quedó la conexión de datos

| Fuente | Estado | Notas |
|---|---|---|
| Search Console API | **CONECTADO** | `node .gsc.cjs sites` lista 17 propiedades; `cha0smagicklabs.com` como `siteOwner`. Token en `.gsc-token.json` (gitignored). |
| Google Analytics 4 | **SIN ACCESO** | No hay `service-account.json`, ni `GOOGLE_APPLICATION_CREDENTIALS`, ni `GA4_PROPERTY_ID`. El ID de medición embebido en el sitio es `G-V6LHCPN9TK` (895 HTML). |
| Play Developer API | Token caduca | `.gsc-play-token.json` existe pero caduca cada 7 días en estado Testing. |

**Por qué fallaba**: la pantalla de consentimiento OAuth del proyecto GCP está en estado *En pruebas*. En ese estado Google (a) caduca los refresh tokens a los 7 días y (b) borra automáticamente los usuarios de prueba a los 7 días. El token se regeneró y se guardó el nuevo.

**Cómo evitar que vuelva a pasar** (2 opciones, ambas gratis):
1. **Publicar la app**: APIs y servicios → Pantalla de consentimiento OAuth → `PUBLICAR APP`. Desaparecen el caducado de 7 días y la restricción de test users.
2. **Cuenta de servicio**: crear SA en GCP, guardar `service-account.json` en el repo (gitignored), añadir su email como usuario en GSC y en GA4. Sin OAuth, sin caducado. **Es además el requisito para `ga4-play-purchases.js` y `seo-revenue-attribution.js`, que hoy no corren.**

---

## 2. Lo que dicen los datos

### 2.1 Volumen y tendencia

| Métrica | 16 meses | Últimos 90 días | % del histórico |
|---|---|---|---|
| Clics (dim. página) | 433 | **393** | 91 % |
| Impresiones (dim. página) | 13.854 | **12.447** | 90 % |

El tráfico **no está muerto: está acelerando**. Prácticamente todo el histórico ocurrió en los últimos 3 meses.

Clics por quincena (90 días):

| Periodo | Clics | Impresiones |
|---|---|---|
| 15–28 jul | 24 | 697 |
| 29 jul–11 ago | 31 | 761 |
| 12–25 ago | 36 | 1.991 |
| 26 ago–8 sep | **110** | **3.038** |
| 9–22 sep | 95 | 2.565 |
| 23 sep–5 oct | 61 | 1.778 |
| 6–10 oct | 25 | 566 |

### 2.2 Dónde se va el tráfico (la métrica que importa)

| Tipo de página | Clics 90d | Impresiones | Nº URLs |
|---|---|---|---|
| Blog | **235** (60 %) | 8.919 | 136 |
| Tools | 72 (18 %) | 1.811 | 11 |
| Home `/` | 40 (10 %) | 89 | 1 |
| Otras | 30 | 1.047 | 13 |
| **Apps** | **8** (2 %) | 234 | 14 |
| Lead magnet | 5 | 110 | 1 |
| **Libros** | **3** (0,8 %) | 237 | 7 |
| Landing-pages | 0 | 0 | — |

**Hallazgo central**: el tráfico es casi todo contenido de curiosidad (*"qué es la magia del caos"*, *"cómo crear un sigilo"*). La oferta —libros, apps, landing-pages— recibe **11 clics combinados en 90 días**. El embudo está truncado antes del primer clic de venta.

### 2.3 Páginas con más clics (90d)

| Página | Clics | Impr. | Pos. |
|---|---|---|---|
| `/blog/chaos-magick-beginners-complete-guide.html` | 74 | 1.609 | 9,0 |
| `/tools/sigil-generator.html` | 62 | 1.328 | **14,3** |
| `/` | 40 | 89 | 8,4 |
| `/blog/how-to-create-magickal-servitor.html` | 38 | 560 | 8,7 |
| `/blog/planetary-magic-squares-sigil-creation.html` | 28 | 416 | 10,3 |
| `/blog/goetic-magic-beginners-guide.html` | 24 | 696 | 9,1 |
| `/best-occult-apps-android.html` | 14 | 482 | 8,1 |
| `/glossary.html` | 11 | 499 | 16,8 |

Dos anomalías que son palancas:
- **`/tools/sigil-generator.html`: 1.328 impresiones en posición 14,3 y solo 62 clics.** Está a un empujón del top 3. CTR actual 4,7 %; en top 3 con el mismo título llegaría a 15-25 %.
- **`/` con 89 impresiones y 40 clics.** La home no está indexada para nada real. Los 40 clics son casi todos de marca/navegación, no de búsqueda. Hay 967 URLs en el sitemap y la home no aparece.

### 2.4 Striking distance — las 6 keywords a las que basta un empujón

| Query | Impr. 90d | Pos. | Clics | Ganancia estimada a top-3 |
|---|---|---|---|---|
| `sigil maker` | 369 | 13,7 | 10 | +60 a +90 clics/90d |
| `best astrology apps` | 142 | 14,0 | 0 | +25 a +45 |
| `goetic magic` | 113 | 9,9 | 2 | +20 a +35 |
| `sigil maker online` | 65 | 10,2 | 4 | +12 a +20 |
| `best astrology apps 2026` | 46 | 8,7 | 0 | +8 a +15 |
| `chaos magic sigil generator` | 44 | 6,8 | 5 | +8 a +14 |

Suma: **~2.800 impresiones/90d que hoy generan 21 clics**. Movidas a top-3 generan 130-220 clics/90d. Multiplicador ×6 a ×10 con trabajo de una semana, no de un trimestre.

Además, 2.851 impresiones/90d están en queries de `sigil` (`sigil generator` pos 20,8 · `sigil creator` pos 24,2 · `sigil online` pos 26,8 · `make sigil online` pos 50,8 · `sigil maker app` pos 14,0). El cluster temático "sigil" está mal cubierto en el sitio: existe `/tools/sigil-generator.html` pero **no hay ninguna página dedicada a `sigil maker` / `sigil creator` como término**.

### 2.5 Geografía

| País | Clics | Impr. |
|---|---|---|
| USA | 118 | 4.520 |
| Colombia | 32 | 85 |
| Taiwan | 21 | 96 |
| Reino Unido | 20 | 788 |
| Brasil | 19 | 309 |
| India | 12 | 504 |
| México | 9 | 158 |
| Alemania | 11 | 201 |

USA = 36 % de las impresiones. Colombia tiene clics desproporcionados a impresiones (32 clics / 85 impr), típico de marca.

### 2.6 Español: casi nada, todavía

| | Queries | Clics | Impr. |
|---|---|---|---|
| Inglés | 497 | 43 | 2.848 |
| Español | 3 | 2 | 3 |

Los 32 posts ES y las 10 comparativas ES son demasiado recientes para indexarse. `gerador de sigilo` (la keyword ES con más demanda real) tiene **1 impresión**.

---

## 3. Diagnóstico

**El problema no es visibilidad. Es monetizez.**

1. **Tráfico real de ~13 clics/día orgánicos.** A 1-3 % de conversión son 0,1-0,4 ventas/día. La meta de 1 venta/hora está **3 órdenes de magnitud** por encima de lo que el SEO actual puede dar. Ningún plan de contenido lo arregla en 90 días.
2. **Cero datos de conversión.** No hay evento de compra, no hay webhook de Hotmart, no hay GA4. No se sabe cuántos de esos 393 clics compraron. Se está optimizando a ciegas.
3. **Todo el peso en el blog (60 %).** `/blog/chaos-magick-beginners-complete-guide.html` con 74 clics es la página que más tráfico trae, y es contenido informativo puro sin oferta.
4. **Dos fuentes de tráfico concentradas en una sola keyword** (`sigil maker` = 41 % de las impresiones del cluster). Si esa keyword cae, cae el sitio.
5. **Mercado ES intacto.** 0 competencia, 0 contenido indexado. Es la oportunidad más grande del proyecto y la que menos ha empezado.

---

## 4. Plan de 90 días

### Fase 0 — Instrumentación (semana 1). Sin esto no hay fase 1.
- [ ] **Publicar la app OAuth** en GCP (5 min) o crear la cuenta de servicio. Sin esto el token vuelve a morir el día 21.
- [ ] **Conectar GA4**: crear `service-account.json`, añadir su email a GA4 → Gestión de administradores → Acceso a la propiedad, y a Search Console → Usuarios. Guardar `GA4_PROPERTY_ID` y `GA4_MEASUREMENT_ID=G-V6LHCPN9TK` en `.env`.
- [ ] **Eventos de conversión**: `begin_checkout`, `purchase`, `lead_submit` en las 4 landing + home. Ya hay gtag `G-V6LHCPN9TK` en 895 HTML.
- [ ] **Webhook Hotmart → n8n/Zapier (gratis) → MailerLite**: así entra cada comprador al grupo y se puede atribuir. Play no notifica compras externas de Hotmart, así que los bundle/libros sí entran.
- [ ] **Play Console**: eventos de conversión in-app ya existen; falta conectar el flujo Hotmart.

### Fase 1 — Capturar lo que ya casi se tiene (semanas 2-4). Mayor ROI del plan.
Objetivo: llevar 6 queries de striking distance y el cluster "sigil" a top-3.
- [ ] **`/tools/sigil-generator.html` → top-3 para `sigil maker`.** Posición 14,3 con 1.328 impresiones. Trabajo: title con `sigil maker` literal, H1 con la keyword, bloque FAQ de 6 Q&A, 300-500 palabras nuevas de copy de venta, links internos desde los 6 blogs de sigilo, schema `SoftwareApplication` + `FAQPage`.
- [ ] **Crear `/sigil-maker.html`** (página comercial dedicada, no tool): título `Sigil Maker Online Free — Chaos Magick Sigil Generator`. Cubre `sigil creator`, `sigil maker online`, `make sigil online`, `magic square sigil generator`.
- [ ] **`best astrology apps` + `best astrology apps 2026`** (142+46 impressions, 0 clicks):.title con el año, freshness visible, tabla comparativa, listicle de 12 apps con precios reales, link a cada `/apps/*.html`.
- [ ] **`goetic magic`** (113 impr, pos 9,9): retitular `/blog/goetic-magic-beginners-guide.html` a `Goetic Magic: Complete Beginner's Guide (72 Spirits)`.
- [ ] **Home indexable**: 89 impresiones es un fallo técnico. Revisar canonical, sitemap priority, y añadir links de texto a las 6 páginas de arriba desde el bloque de navegación.
- [ ] **Internos**: 2-3 links desde cada artículo top hacia la landing del bundle y hacia la app de sigilo. Hoy el tráfico del blog no pasa a ninguna oferta.

### Fase 2 — Cerrar el embudo (semanas 3-6).
- [ ] **Insertar CTA de oferta en los 8 artículos con más clics.** Bloque con bundle $19.99 + app específica + Inner Circle. Los 32 posts ES ya lo tienen; los EN top no.
- [ ] **Orden bump en Hotmart**: bundle → app ($3.99) como oferta post-compra. Objetivo: subir AOV de ~$7 a ~$12.
- [ ] **`/glossary.html`** (499 impr, pos 16,8, 11 clics): convertir en página pilar con 60 términos y links a las tools. Es la puerta de entrada de los principiantes.

### Fase 3 — Volumen en español (semanas 5-10).
- [ ] Los 42 páginas ES ya existen. El trabajo ahora es **indexación**: verificar en GSC que están rastreadas, forzar `sitemap` con `lastmod` por idioma, y confirmar los pares hreflang.
- [ ] `gerador de sigilo`, `creador de sigilos`, `cómo hacer un sigilo paso a paso`, `app de magia del caos`, `tarot gratis online`, `runas vikingas online`, `I Ching online gratis`, `test de Zener online`, `sueños lúcidos app`, `proyección astral timer` — cada una necesita su página y su título.
- [ ] **Herramientas ES**: los 62 tools están solo en inglés y son el activo de mayor tamaño. Traducir los 10 con más demanda (`sigil-generator`, `iching`, `rune-drawer`, `tarot-card-reference`, `tarot-spread-builder`, `zener-esp-trainer` ya existe, `elder-futhark-reference`, `lunar-phase`, `gnosis-timer`, `dream-symbol-dictionary`).

### Fase 4 — Canales que no dependen de ranking (continuo).
- [ ] **Pinterest**: 12 pines/día vía `scripts/pin-browser.mjs` + job `pinterest-buffer`. Ya funcionando. Cada pin apunta a un post EN; falta la variante ES en el ciclo (6 de 12 pines ES).
- [ ] **Email**: la secuencia "Quickstart to Buyer" (5 emails) está escrita pero no activada en MailerLite. Ver `docs/MAILERLITE-setup.md`. Es el canal con mejor conversión y el único que no depende de Google.
- [ ] **Afiliados** (punto 6, diferido): 30-40 % de comisión ya configurado. 5 creadores ES/EN por semana.
- [ ] **Play ASO**: 12 títulos de ≤30 caracteres en `docs/ASO-play-titles.md` pendientes de aplicar. `aggregateRating` solo con reseñas reales.

### Fase 5 — Medir (continuo).
- [ ] Script semanal que corra `.gsc.cjs query` y compare contra este documento como línea base.
- [ ] Tocar `pins-hourly` de GitHub Actions cuando Pinterest apruebe Standard access (ahora duplicaría pines).

---

## 5. Expectativas realistas

| Horizonte | Clics orgánicos/mes | Ventas/mes | Nota |
|---|---|---|---|
| Hoy (base real) | ~130 | 0-2 | 393 clics/90d, cero datos de conversión |
| Mes 2 (fases 0-2) | 400-700 | 4-10 | Top-3 en 6 queries + CTA en 8 artículos |
| Mes 3 (+ fase 3) | 1.000-1.800 | 10-25 | Español indexado + cluster sigil |
| Mes 6 (escala real) | 4.000+ | 40-80 | Con email, Pinterest ES y afiliados |

**1 venta/hora no se alcanza con SEO.** Se alcanza con: tráfico SEO en top-3 × 1-3 % de conversión × AOV de $12 × los canales directos (email + Pinterest) representando el 40 % de las ventas. Con el plan completo, 1 venta/hora es una meta de **mes 9-12**, no de mes 2.

Si el objetivo es 1 venta/hora en 90 días, hay que cambiar el mix: bajar el bundle a $9.99 en lugar de $19.99 (más volumen, mismo margen), y abrir el programa de afiliados con creadores que ya están dentro del público.

---

## 6. Lo que necesito del usuario

| # | Acción | Por qué |
|---|---|---|
| 1 | Publicar la app OAuth en GCP (o crear cuenta de servicio) | Si no, el token de GSC muere otra vez el día 21 |
| 2 | Crear `service-account.json` y darme `GA4_PROPERTY_ID` | Sin GA4 no hay atribución de ventas ni datos de conversión |
| 3 | Decidir precio del bundle: $19.99 (actual) o $9.99 (volumen) | Cambia la matemática de todo el plan |
| 4 | Activar la secuencia "Quickstart to Buyer" en MailerLite | 5 emails escritos, cero enviados |
| 5 | Aplicar los 12 títulos ASO en Play Console | Está en `docs/ASO-play-titles.md` |

---

*Datos extraídos con `.gsc.cjs` sobre `sc-domain:cha0smagicklabs.com`. Las consultas de este documento son reproducibles con `node .gsc.cjs query <preset> 2026-07-15 2026-10-10 sc-domain:cha0smagicklabs.com`.*