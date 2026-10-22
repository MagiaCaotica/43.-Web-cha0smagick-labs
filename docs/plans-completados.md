# Planes completados

> Índice de los planes que ya se ejecutaron. Sus `.md` se borraron: el
> histórico queda en `git log`. Lo que **no** está aquí sigue vivo en
> [`PLAN-UNICO.md`](PLAN-UNICO.md), que es el único plan que se sigue.
>
> Fecha del corte: 2026-10-22.

## A. Completados y verificados

| Plan | Qué era | Evidencia de cierre |
|---|---|---|
| `docs/plan-tools-sales-funnels.md` | Convertir las 71 herramientas en embudos de venta (app + libro + relacionadas) | `node scripts/test-tool-funnels.mjs` → **331/331 OK**. `data/tool-funnels.json` con `products`, `angles`, `atomic`, `tools`. Eventos `tool_funnel_view` y `tool_funnel_click` en `js/conversion.js`. |
| `docs/atomic-tool-creation-plan.md` | Crear las herramientas atómicas con su motor, CSS y datos | 71 páginas en `tools/`, `js/atomic-tools.js`, `css/atomic-tools.css`, `data/atomic-tools.json` (40 herramientas atómicas con método, límites y warnings). |
| `docs/seo-audit-2026-10-03.md` | Auditoría SEO de 972 páginas y corrección de los defectos | 47 scripts idempotentes en `scripts/seo/`. Los dos pendientes que le quedaban están resueltos: las tools pasan de 300 palabras (347/1293/470 medidas) y tienen breadcrumb + `FAQPage`. |
| `docs/seo-remediation-report.md` | Informe de las correcciones SEO aplicadas | Informe de ejecución, sin tareas abiertas. |
| `docs/revenue-catalog-reconciliation.md` | Cerrar la brecha local de catálogo, URLs de bots, precios de tracking y CTAs | Conclusión del propio doc: *"la brecha local de catálogo, URLs de bots, precios de tracking y CTAs no configurables queda cerrada"*. |
| `docs/play-reconciliation-real-2026-10-02.md` | Reconciliar los ingresos reales de Google Play | **RESUELTO para Google Play** (bucket único `pubsite_prod_...`, 382 ventas del bundle `V107097103W`). Lo que faltaba (Hotmart) es la puerta G1/G3 del plan único. |
| `docs/analytics-growth-plan.md` | Instrumentación de analytics y fórmula de ingresos | `js/analytics-bridge.js` independiente y consent-aware, 19 eventos instrumentados. Falta solo la credencial (puerta G4). |
| `docs/geo-surface-decision.md` | Decidir la superficie GEO/AI | Decisión registrada y ejecutada. |
| `docs/plan-viral-growth-moves.md` | 5 movimientos de crecimiento viral (artefactos compartibles, retargeting, order bump, prueba social, email) | El propio doc: *"Estado code-side: COMPLETADO y testeado"*. `js/conversion.js` genera la tarjeta PNG 1080×1080 con marca de agua; `npm run build:js` y `test-tool-funnels` en verde. |
| `docs/existing-tool-audit.md` | Auditar las herramientas existentes | Auditoría hecha, sin tareas abiertas. |
| `docs/PINTEREST-BROWSEROS.md` | Guía operativa para publicar pines | *"Guía operativa verificada. Todo lo de aquí se probó en producción: 7 pines publicados"*. 8 scripts de pin en `scripts/`, 137 pines subidos. |
| `docs/bot-deployment.md` | Runbook de despliegue de los bots | Runbook vigente y workflow endurecido: `bot-deploy.yml` ahora verifica el token de Telegram (`getMe`), hace health check post-deploy y resume. Antes salía verde sin desplegar. |
| `docs/content-registry.md` | Registro de contenido | Artefacto generado, sin tareas abiertas. |
| `docs/herramientas-gratis-2026-10-21.md` | Auditar y elevar las herramientas gratuitas: valor, E-E-A-T y diseño | 58 herramientas nativas (40 del motor común y 15 propias con sus copias en español) con capa de valor común: copiar, descargar texto e imagen, imprimir, lecturas guardadas que se recuperan, camino al producto con la ventaja concreta y transparencia de que es nuestro; bloque de E-E-A-T por herramienta (qué es y qué no es, método, expectativa, uso responsable, autor, política editorial, fecha de revisión); diseño reescrito con sistema propio, foco visible, 48 px de control y reduced-motion respetado. Auditoría final: visual 9/9, práctico 8/8, E-E-A-T 7/7, valor propio 58/58. |
| `docs/eeat-contenido-2026-10-21.md` | Auditar y elevar E-E-A-T, confianza y calidad de contenido (tarea P1-12) | Pagina de autor, politica editorial y de contacto nuevas; `Person` y `Organization` con entidad completa referenciada por `@id` desde los 1.000 articulos; bloque Trust en el pie de 979 paginas; 1.373 frases de plantilla sustituidas por el primer parrafo real de cada articulo (ahora 0); 3 articulos nuevos y 2 tablas de referencia decididos con las impresiones y la posicion de Search Console; `audit-eeat.mjs` y `audit-hreflang.py` sin hallazgos; 3.393 JSON-LD validos; npm test en verde. |
| (sin doc propio) | Corregir los pares hreflang EN<->ES | 64 declaraciones apuntaban a URLs sin extension `.html` (inexistentes) y 5 pares no eran reciprocos: Google descartaba el hreflang y las 32 paginas en espanol perdian la senal de la inglesa. Corregidas 64 declaraciones, alineado `es/index.html` con su canonical, `x-default` anadido a las 36 paginas EN, 4 pares ES<->EN con la vuelta y la home declarando su version ES. `python projects/scripts/audit-hreflang.py` -> 1.453 declaraciones, 0 rotas, 0 incoherentes, 0 sin vuelta, 0 en paginas noindex, 0 autorreferencias. Ademas se quitaron 16 declaraciones hreflang de paginas noindex y 97 'es' autorreferentes de tools sin version en espanol. |
| `docs/indexacion-2026-10-21.md` | Auditar y desbloquear la indexacion de las 994 URLs del sitemap (tarea P1-11) | 5 bugs corregidos y verificados en produccion: el sitemap ya no anuncia paginas `noindex` ni 404, no repite URLs, el canonical coincide con la URL del sitemap (`/blog/` y `/es/`), `lastmod` es la fecha real del ultimo commit (988 de 994) e IndexNow se ejecuta con el host correcto. `node projects/scripts/audit-indexation.mjs` sale con 0 contradicciones y 0 huerfanas; 994/994 URLs alcanzables en <=3 clics con 41,8 enlaces internos de media; 0 enlaces rotos y 0 contenido mixto. |
| (sin doc propio) | Sincronizar el bot, el CTA del sitio y los artefactos sociales con el catalogo real | El bot (Telegram, Discord y Groq) vendia el bundle viejo: 7 libros, $19.99, 52% y dos precios de libro equivocados ($4.99 en vez de $3.99). El catalogo ya estaba reconciliado desde P0-02; el prompt y los textos no. Corregidos el prompt, `bot-brain.js`, `telegram-bot.js`, `discord-bot.js`, `js/conversion.js`, `build-entity-map.mjs`, el doc ASO, un tweet, un pin y 2 articulos publicados. Tambien **CI estaba rojo desde `29ed498a`**: los tests del bot assertaban 7 libros. Ahora `npm test` da 38 pytest + 230 vitest en verde. |
| (sin doc propio) | Estacionalidad programada y embudos en español (tarea P1-15) | Calendario estacional como sistema, no como ocurrencia: `blog/calendario-estacional-magia-caos.html` se genera desde `data/seasonal-calendar.json` con `projects/scripts/gen-seasonal-hub.py`, así que la próxima temporada queda agendada. Publicados 4 artículos de temporada con antelación real (Black Friday 27 nov y Navidad 25 dic): 2 en inglés y 2 en español. Halloween (9 días) y Día de Muertos (11 días) llegaban tarde: solo se refrescan. 3 embudos en español escritos para LATAM, no traducidos: mejores apps de astrología Android, cómo leer una carta natal gratis y magia del caos para principiantes. `tools/dashboard-colombia.html` queda `noindex, follow`, fuera de `tools/index.html`, fuera del sitemap y sin CTA de venta: sigue vivo como experimento sin diluir el catálogo. Verificado en vivo: 8 páginas con canonical correcto, hreflang recíproco, 1 h1, 5–8 h2, 0 imágenes rotas, 0 desbordamiento horizontal, JSON-LD válido y 0 enlaces internos rotos. |
| (sin doc propio) | Un bundle por idioma, con el precio leído en el checkout | Las ~570 páginas inglesas vendían el producto español (`V107097103W`, «BUNDLE Todos Los Libros ESP»): un lector inglés acababa en una ficha de venta en español. Ahora 521 páginas EN apuntan a `N108147778I` («BUNDLE: All PDFs in ENGLISH», US$29.99) y 65 páginas ES siguen con `V107097103W` (US$24.99, 59% sobre los US$60.91 sueltos). Cambiados 496 enlaces que iban a la landing española, 168 bloques de precio (el pie de 152 páginas anunciaba «$24.99 USD — 9 books at 59% off») y las frases sueltas de `books/` y los 16 artículos con precio a mano. El bundle inglés no publica cuántos PDFs incluye, así que su copy no afirma cantidad. Los artículos de temporada prometían «baja a $24.99 hasta el 27 de noviembre»: fecha de cierre inventada, retirada; `check-seasonal-claims.py` la bloquea si vuelve. |

## B. Planes retirados sin terminar (no se ejecutan)

Estaban en `projects/docs/archive/`. Se listan aquí para que se sepa que existen y
**no se ejecutan**; el material sigue en el repo como referencia.

| Plan | Qué era | Por qué no se ejecuta |
|---|---|---|
| `projects/docs/archive/ventas/checklist-cro-faq.md` | Checklist CRO de la home (FAQ, precio visible, prueba social) | Sus partes ejecutables ya están en la auditoría SEO/funnel y en el plan único (P1-04, P1-10). |
| `projects/docs/archive/kpi-dashboard-template.md` | Dashboard de KPI en Google Sheets | Depende de credenciales y CSVs del owner (puertas G3, G4). Se reescribe como parte de P1-07. |
| `projects/docs/archive/affiliate-kit/canva-banner-links.md` | Kit de afiliación: 8 plantillas de Canva + guía PDF | Reencaminado a P1-08 (material listo, no cuenta de Canva). |
| `projects/docs/archive/affiliate-kit/swipe-social.md` | Copies para redes del programa de afiliados | Reencaminado a P1-08. |
| `projects/docs/archive/affiliate-kit/swipe-emails.md` | Copies de email del programa de afiliados | Reencaminado a P1-08. |
| `projects/docs/archive/play-store-sales-research.md` | 4 preguntas de investigación de Play Console | Las respuestas están ya en `docs/OWNER-MANUAL-CHECKLIST.md` §1. |
| `projects/docs/archive/snapshots/*.md` (12 ficheros) | Snapshots de accesibilidad del navegador de una sesión anterior | Scratch puro: no son plan ni referencia. Se movieron a `projects/docs/archive/snapshots/`. |

## C. Planes absorbidos en el plan único (borrados, su contenido vive en `PLAN-UNICO.md`)

| Plan absorbido | Dónde está ahora su contenido |
|---|---|
| `MASTER_EXECUTION_PLAN.md` | Las 28 tareas atómicas (P0-01…P2-08) con responsable, dependencias, entregable, aceptación y evidencia → §Fase A/B/C de `PLAN-UNICO.md`. |
| `AUDITORIA-SEO-FUNNEL-2026-10-15.md` (raíz) | Sus 9 pendientes (F-8, F-10, F-16, F-24, F-28, webhook Hotmart, secuencia Quickstart, OAuth de GCP, Meta/Ads) → tabla de residuales de `PLAN-UNICO.md`. |
| `docs/PLAN-VENTA-MERCADEO-GSC.md` | Sus 23 pendientes (Fase 0 instrumentación → Fase 5 medir) → residuales + P0-07/P0-08/P1-01. |
| `docs/PLAN-UNICO.md` | Sus 15 pendientes (4 semanas: convertir, tráfico, afiliados, escalar) → residuales + P1-04/P1-08/P1-10/P2-04. |
| `docs/legal-vendor-matrix.md` | Sus 9 puntos de consentimiento → puerta G12 (P0-06). |
| `docs/MAILERLITE-setup.md` | Sus 7 pasos de panel → puerta G6 (P0-08). |
| `docs/plan-traffic-autopilot.md` | Sus 6 pasos (código ya listo, faltan los jobs del scheduler) → P2-07. |
| `docs/telegram-marketing-strategy.md` | Sus decisiones pendientes (canal canónico, ofertas sin ID) → G11, P0-03 y P1-08. |

## D. Planes que siguen vivos (no se tocan)

| Plan | Por qué sigue |
|---|---|
| [`PLAN-UNICO.md`](PLAN-UNICO.md) | **El plan.** 28 tareas + 29 residuales + 12 puertas externas. |
| `docs/OWNER-MANUAL-CHECKLIST.md` | El detalle exacto de las puertas externas (dónde, qué, qué hay que devolver). |
| `docs/plan-guerrilla-2026-10.md` | La campaña de email: estado, reglas de envío, números reales. |
| `docs/ecosistema-telegram-2026-10.md` | Los 4 assets de Telegram, los directorios y el estado de los listados. |
| `docs/aso-12-apps.md`, `docs/ASO-play-titles.md` | El copy ASO que hay que aplicar en Play Console (puerta G9, P0-09). |
| `docs/canonical-asset-inventory.md`, `docs/entity-map.md`, `docs/event-contract.md` | Ledgers de evidencia: son la base de P0-01 y se citan desde el plan. |
| `docs/thin-articles-progress.md` | Informe autogenerado por `scripts/thin_articles_report.py`; se regenera solo. |
| `docs/audit-5000-usd-gap-2026-10-01.md` | El desglose de los 145 artículos que faltan (cluster `servitors` = 59): es la entrada de P1-03. |
| `projects/plans/YT_ARTICLES_ATOMIC_PLAN.md` | La especificación de los artículos para YouTube: sin ejecutar, es P1-03. |

---

## E. Estado de la campaña al cierre de este corte

| Métrica | Valor |
|---|---|
| Emails enviados hoy | **50/50** (tope diario cumplido; el runner se paró solo) |
| Acumulado con copy ad-hoc | 45 hoy + 36 con la plantilla vieja = 81 |
| Pendientes en cola | ~700 |
| Quejas de spam detectadas | 0 |
| Posts de Telegram | 10 en el canal oficial (IDs 121-130) |
| Páginas de estilo auditadas | 994 (42 remapeadas a la paleta, 167 CSS duplicados quitados) |
| Links verificados | 81/81 |

**Mañana:** `node projects/scripts/guerrilla-run.mjs --check-every 10`. El presupuesto
diario rota solo por fecha (`data/guerrilla/daily-budget.json`), y el runner salta
lo ya enviado comprobando la carpeta de Enviados, no una lista local.
