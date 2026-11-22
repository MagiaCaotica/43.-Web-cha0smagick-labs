# PLAN ÚNICO — Cha0smagick Labs (v3, 19-nov-2026)

> **Este es el único plan.** Absorbe y sustituye a: `.opencode/plans/seo-top1.md`,
> `.opencode/plans/contenido-p1-03.md`, `.opencode/plans/cro-ventas-apps-bundles.md`,
> `docs/plan-guerrilla-2026-10.md`, `docs/audit-5000-usd-gap-2026-10-01.md`,
> `docs/plans-completados.md`, `docs/ASO-play-titles.md`, `docs/aso-audit-checklist.md`
> y la versión anterior de este mismo fichero. Los absorbidos se borraron; su
> histórico queda en `git log`.
>
> **Cómo se usa:** cada tarea es atómica, tiene un responsable y una condición de
> aceptación que se puede comprobar. Se marca `[x]` aquí mismo con la evidencia
> (commit, URL, salida de comando). Un fichero local no prueba que algo funcione
> en producción.

**Fecha de corte de datos:** 2026-11-19. Todo lo que sigue está medido, no estimado,
salvo lo que lleva la etiqueta *(estimación)*.

---

## 0. Resumen para dirección

La empresa tiene producto y empieza a tener distribución. No tiene conversión.

| | |
|---|---|
| Catálogo | 12 apps Android, 7 libros PDF (EN/ES), 71 herramientas web |
| Superficie | 1.051 URLs en sitemap, 1.157 HTML, 882 artículos |
| Tráfico | 607 sesiones/28d · 420 clics orgánicos · 15.050 impresiones en octubre |
| Audiencia | Telegram 1.998 + 717 · correo 7 (2 activos) · YouTube sin verificar |
| Ingresos verificados 2026 | 9 ventas Hotmart · ≈70 USD · ticket medio 8,30 USD |
| Embudo | 1,98 % sesión→clic de compra · 0,16 % sesión→venta |
| Decisión | Subir el 1,98 % a 4 % en 90 días y multiplicar el tráfico útil, no el número de páginas |

---

## 1. Estado verificado (19-nov-2026)

### 1.1 Lo que ya está resuelto

| Cambio | Evidencia |
|---|---|
| Checkout de Hotmart identificado y abierto (EN `N108147778I`, ES `V107097103W`, Codex `W106595764X`, Servidores `U108075109V`) | apertura real en navegador; API de ventas devuelve pedidos |
| GA4 consultable (propiedad 521860259) y eventos llegando | 993 `page_view`, 12 `purchase_click`, 10 `app_store_click` en 28d |
| API de Hotmart operativa | `python scripts/cro-weekly.py` imprime 9 ventas |
| MailerLite operativo | 7 suscriptores (2 activos) vía API |
| Promesa imposible del bundle de apps eliminada | `landing-pages/apps-bundle.html`, `apps/index.html` |
| Ofertas muertas cerradas | `flash-sale.html` → redirect; `complete-access.html` con las dos compras reales |
| Prueba social fabricada eliminada | «David S.» y «4,7★/128+» fuera; queda la reseña real con enlace |
| Contadores unificados | 7 libros, 23 reseñas, 12 apps, 100+ instalaciones |
| PII y cookies fuera del sitio público | `projects/clientes/`, `projects/cookies*.json` → 404 |
| **Ancla de producto cambiada a Arcana Goetia** (72 espíritus), verificada en código: 72 entidades con comando de invocación, altar, hora planetaria y registro | `docs/posicionamiento-goetia-2026-11.md` |
| Claims de offline corregidos en Moon, Lucid Dream y Eerie Roads (usan red/ubicación) | fichas de las tres apps |

### 1.2 Lo que sigue roto

| Problema | Evidencia |
|---|---|
| 84 % de las páginas con impresiones no reciben un clic | 568 de 680 páginas, GSC 28d |
| La página con más tráfico orgánico no produce ni un clic de compra | guía de iniciación: 46 sesiones, 0 `purchase_click` |
| 191 consultas tienen más de una URL compitiendo | GSC, dimensión query+page |
| La herramienta gratuita dibuja sellos goéticos, no sigilos caóticos | `tools/sigil-generator.html` + iframe externo |
| El correo no existe como canal | 7 suscriptores con 607 sesiones/mes |
| La app estrella tiene 23 reseñas; las otras 11, ninguna | fichas de Play |
| El historial de git conserva los datos de clientes retirados | `git log -- projects/clientes` |

---

## 2. Mega-auditoría

Cada dominio termina con un veredicto. La evidencia manda; las hipótesis van marcadas.

### 2.1 Producto y catálogo

- 12 apps de pago único, 2,99–14,99 $. **Solo Sigil Maker tiene valoraciones** (5,0 · 23 · 100+ instalaciones). El resto: 0–50 instalaciones y ninguna opinión.
- 7 libros, 3,99–9,99 $, bundle a 29,99 $ (suma 58,93 $). El bundle es la única compra conjunta posible: Play prohíbe empaquetar apps.
- La app estrella y la herramienta gratuita **no hacen lo mismo**, y el sitio no lo dice hasta la mitad de la página.

**Veredicto:** el catálogo no necesita más producto. Necesita que el producto existente se vea y se entienda. Toda app nueva antes de arreglar el embudo es capital inmovilizado.

### 2.2 Web y SEO técnico

- 680 páginas reciben alguna impresión; **568 (84 %) tienen cero clics** y 631 (93 %) menos de dos.
- El 56 % de los clics se concentra en 10 URLs.
- CTR global 2,18 % con posición media 19,9. En octubre, 15.050 impresiones y 407 clics (2,7 %).
- 191 consultas con más de una URL del sitio compitiendo. Ejemplo: «sigil maker» reparte impresiones entre la herramienta (6 clics) y tres artículos con 0.
- Deuda estructural: 758 páginas con etiquetas desbalanceadas. Los navegadores lo toleran; los parsers y algunos rastreadores, no siempre.

**Veredicto:** el problema no es publicar menos, es publicar sin intención. 84 % de páginas sin un clic es un almacén, no un activo.

### 2.3 CRO y embudo

Datos de 28 días (GA4 + Hotmart):

| Paso | Personas | Tasa sobre el paso anterior |
|---|---|---|
| Sesiones | 607 | — |
| Vio un producto | 129 | 21,3 % |
| Abrió ficha | 82 | 63,6 % |
| Clic de salida | 26 | 31,7 % |
| Clic de compra | 12 | 46,2 % |
| Venta | 1 | 8,3 % |

Por página, los clics de compra se reparten así: home 5 (de 69 sesiones, **7,2 %**), `best-occult-apps` 2 (de 16, 12,5 %), `books/` 2, y **1 o 0** en cada ficha y en cada artículo.

Es decir: **la home convierte 3,6 veces mejor que el resto del sitio**, y las páginas de blog que traen el tráfico orgánico no convierten nada. El embudo no está roto en el checkout; está roto en el salto de «leer» a «ver el producto».

Tres fugas verificadas y ya corregidas esta semana (testimonio inventado, 4,7/128 falso, política de reembolso doble) y una cuarta pendiente: el CTA del artículo principal aparece tras el 40 % del texto.

**Veredicto:** el 1,98 % es un problema de ubicación y de oferta, no de precio. Con la misma audiencia, mover el CTA a la primera pantalla es la intervención más barata del año.

### 2.4 Contenido

- 882 artículos; 568 páginas sin un clic. La cola larga produce impresiones, no dinero.
- El contenido que sí funciona es el que responde a una intención concreta: «sigil maker», «goetic magic», «ghost hunting apps».
- El contenido genérico («what is chaos magick» repetido en 30 variantes) infla el índice y diluye la autoridad.

**Veredicto:** no escribir más hasta consolidar. Regla nueva: una URL nueva solo si responde a una consulta con demanda demostrada y enlaza a un producto.

### 2.5 ASO (Google Play)

- Sigil Maker: nombre comercial distinto al del sitio («Sigil Maker: Chaos Magick» vs «Magick Chaos Sigil Generator»). Rompe el reconocimiento y la atribución.
- 11 fichas sin reseñas: Play ordena por instalaciones y valoraciones; sin ninguna, no aparecen.
- Precios entre 2,99 y 14,99 $: coherentes con el sitio; NOCTEM es la más cara y la de mayor margen por unidad.

Detalle por app en docs/aso-12-apps.md.

**Veredicto:** el ASO no es cosmético: con 23 reseñas en una app y 0 en once, la tienda no puede recomendar el catálogo. Pedir reseña tras la compra es la acción de mayor retorno por hora.

### 2.6 Libros y Hotmart

- 9 ventas en 2026, 4 monedas. Ticket medio 8,30 USD. La única venta del bundle fue a 24,99 $ (precio anterior; hoy 29,99 $).
- La landing ES existe y funciona; la EN va directa al checkout sin portada, índice ni autor.
- El comprador ve «US$29.99» en la web y la moneda local en el checkout: sin aviso, parece un error.
- El bundle se ofrece como **única** puerta. No hay escalera: nadie compra 29,99 $ como primera compra de un autor que no conoce.

**Veredicto:** el bundle no es una oferta de entrada. Es una oferta de segunda compra. Primero el Codex de 4,99 $.

### 2.7 Datos y medición

- GA4 registra el embudo, pero **no registra `purchase`**: el checkout vive en Hotmart. Las ventas se leen de la API, que es la fuente de verdad.
- No hay ingresos de Play en ningún informe: la consola no los expone por API y la Reporting API solo da estabilidad (crashes, ANR), no instalaciones. Verificado contra el discovery de `playdeveloperreporting v1beta1`.
- El informe semanal existe y se ejecuta: `python scripts/cro-weekly.py`.

**Veredicto:** se puede decidir con lo que hay. Falta cerrar el círculo venta↔campaña, y eso depende del webhook de Hotmart.

### 2.8 Seguridad, legal y confianza

- **El repositorio es público** (`private: false`) y la raíz del repo se sirve tal cual. Eso convierte cualquier fichero trackeado en una URL pública.
- Expuesto y retirado hoy (verificado 404 tras el deploy): `projects/clientes/*` (CSV/XLSX con datos de clientes), `projects/cookies*.json` (sesiones de Google, MailerLite, Pinterest, Stripe, X, Reddit, LinkedIn), **11 archivos con un JWT de MailerLite embebido**, exports de Play con ciudad/estado/CP del comprador, `reviews.csv`, `stats.csv` y métricas internas.
- Los blobs **siguen en el historial**: cualquiera puede clonarlos. La única respuesta completa es revocar los tokens y rotar las sesiones, además de purgar el historial (`git filter-repo`) o pasar el repo a privado.
- Cabeceras del dominio (comprobadas 19-nov): `strict-transport-security`, `content-security-policy`, `x-frame-options`, `referrer-policy` y `x-content-type-options` **ausentes**. GitHub Pages no permite cabeceras propias: el `_headers` del repo solo lo respeta Cloudflare. Ver `docs/action-cloudflare-headers.md`.
- 349 páginas embeben YouTube sin `youtube-nocookie`, y las fuentes de Google se cargan antes del consentimiento.
- Se publica superficie interna que no debería estar en el dominio: `package.json`, `ecosystem.config.js`, código de bots, `deploy/` y `docs/`.
- El sitio promete «7 días de garantía» y hasta esta semana también «48 horas» en una página.
- Consentimiento por defecto denegado y banner funcional; sin CSP ni HSTS comprobados (ver informe de seguridad adjunto en la conversación).

**Veredicto:** la confianza es el activo más frágil del nicho. Una reseña falsa o un CSV de clientes expuesto valen más que cualquier campaña, en negativo.

---

## 3. El objetivo, en una línea

> **Pasar de 12 clics de compra por 607 sesiones a 60 clics por 1.500 sesiones en 90 días**
> — de 1,98 % a 4 % de conversión y 2,5× de tráfico útil, con el mismo catálogo.

Traducido a dinero, con el ticket medio actual: de ~8 $/mes en libros a 40–60 $/mes, más apps.

---

## 4. Plan de 90 días

Responsables: **DIR** dirección, **CRO** copy y embudo, **SEO** buscadores, **ASO** Play,
**CONT** contenido, **DAT** datos, **SEC** seguridad, **LEG** legal.
Aceptación = cómo se comprueba, no cómo se siente.

### Fase 0 — Cerrar brechas (días 0-7)

| # | Tarea | Resp. | Aceptación |
|---|---|---|---|
| 0.1 | **Revocar el JWT de MailerLite y rotar sesiones** (Google, MailerLite, Pinterest, Stripe, X, Reddit, LinkedIn) + decidir purga del historial o repo privado | SEC/DIR | tokens viejos devuelven 401; sesiones cerradas; decisión escrita |
| 0.2 | ~~301 de `/index.html` a `/`~~ **HECHO 2026-11-19**: Pages no permite 301; la URL se reescribe con `history.replaceState` antes de configurar GA4 | SEO | una sola home en GA4 |
| 0.3 | ~~CTA de producto en la primera pantalla de la guía de iniciación~~ **HECHO 2026-11-19**: banda con botón a Play y enlace a la herramienta, bajo el segundo párrafo | CRO | `purchase_click` desde esa URL > 0 en 14 días |
| 0.4 | ~~Sustituir el iframe goético por un generador de sigilos caóticos~~ **HECHO 2026-11-19**: generador SVG determinista en `tools/sigil-generator.html`, sin dependencias, con descarga | CRO/DIR | la herramienta dibuja lo que promete el H1 |
| 0.5 | ~~Claims~~ **HECHO 2026-11-19**: 12 tarjetas «All 12 apps — $29.99» sustituidas por el enlace al desarrollador; reembolso unificado en `best-occult-apps-android.html` | LEG | `grep` de claims = 0 |
| 0.6 | **Registro abierto**: `docs/decision-gdpr-2026-11.md` con hechos, riesgo y decisiones. La notificación a la AEPD la decide dirección | LEG | decisión firmada |
| 0.7 | ~~Purgar el historial de git~~ **HECHO 2026-11-19**: `git filter-repo` sobre `.env`, `projects/clientes/`, cookies, tokens de MailerLite, ventas, reviews y métricas; force-push. Los SHA antiguos pueden seguir accesibles hasta que GitHub recoja basura: pedir purga a soporte si se quiere garantía | SEC | `git log --all -- .env` vacío |

### Fase 1 — Monetizar el tráfico que ya existe (días 8-30)

| # | Tarea | Resp. | Aceptación |
|---|---|---|---|
| 1.1 | Escalera de precios: Codex 4,99 $ como oferta de entrada en las páginas de sigilos; bundle como segundo paso | CRO | ≥3 ventas de Codex/mes |
| 1.2 | ~~Landing EN del bundle~~ **HECHO 2026-11-19**: `landing-pages/books-bundle-en.html` con las 7 portadas, precios, FAQ y aviso de moneda; la home EN ya no manda al checkout. Muestra de 4 páginas pendiente (requiere el PDF) | CONT | la home EN deja de mandar al checkout |
| 1.3 | ~~Nota de moneda local~~ **HECHO 2026-11-19** en home, landing EN, landing ES y escalera de la herramienta | CRO | 0 páginas con precio sin aviso |
| 1.4 | Módulo de oferta en las 3 páginas con más clics (guía, goetia, ghost hunting) | CRO | `purchase_click` por sesión ≥ 2 % en cada una |
| 1.5 | **Preparado**: `pages/leave-a-review.html` con las 12 apps y sus enlaces. Falta enviarlo a compradores (lista de Hotmart) | ASO | de 23 a 35 reseñas |
| 1.6 | Unificar el nombre comercial entre web y Play | ASO | mismo nombre en ficha, home y CTA |
| 1.6b | **Diferido con motivo**: cambiar el H1 de `apps/chaos-sigil-generator.html` (pos 8,5 y 70 clics/28d) sin datos de prueba puede costar la página. Se hará cuando haya un test con muestra suficiente | SEO/ASO | decisión escrita |

### Fase 2 — Construir la audiencia propia (días 31-60)

| # | Tarea | Resp. | Aceptación |
|---|---|---|---|
| 2.1 | ~~Secuencia de bienvenida~~ **REESCRITA 2026-11-19**: `email-sequences/quickstart-to-buyer.json`, 3 correos honestos (fuera el «4,5★/221 reseñas», el precio en COP y el experimento inventado). Falta activarla en MailerLite | CONT/DAT | 100 suscriptores y ≥2 ventas atribuidas |
| 2.2 | **Preparado**: `email-sequences/telegram-offer-2026-11.md` con el mensaje y UTM separados. Falta publicarlo | CRO | clics medidos; ≥1 venta atribuida |
| 2.3 | Publicación diaria de resultado compartible (la tarjeta 1080×1080 ya existe) | CONT | 30 piezas/mes |
| 2.4 | Webhook Hotmart → GA4 (purchase real) | DAT | `purchase` visible en GA4 con producto y valor |
| 2.5 | **Medido y listo**: `scripts/seo/zero-click-pages.py` → 343 de 1.052 URLs sin clic ni impresión en 90 días. No se aplica noindex hasta la fase 2 | SEO | sitemap ≤ 700 URLs útiles |

### Fase 3 — Escalar lo que funcione (días 61-90)

| # | Tarea | Resp. | Aceptación |
|---|---|---|---|
| 3.1 | ~~Reescribir títulos y metas~~ **PARCIAL 2026-11-19**: 4 páginas con truncamiento o intención desalineada (goetia, iniciación, ghost hunting, astrología). El resto espera 14 días de datos | SEO | CTR global ≥ 3 % |
| 3.2 | Freemium en 1 app (la segunda mejor valorada) para entrar en el ranking de Play | ASO/DIR | instalaciones ×10 en 60 días |
| 3.3 | Export mensual de finanzas de Play y anexo al informe | DAT | ingresos de apps auditados |
| 3.4 | Solo si el embudo supera el 4 %: probar paid con presupuesto de 100 $ | DIR | CAC < 30 % del ticket |

---

## 5. Backlog absorbido (de los planes eliminados)

Estos puntos vienen de los planes anteriores y siguen vigentes, con su estado corregido:

| Origen | Punto | Estado hoy |
|---|---|---|
| guerrilla 4.1 | listmonk autoalojado para volumen de correo | **Pendiente**; MailerLite ya funciona con 7 suscriptores. Decidir cuando la lista pase de 500 |
| guerrilla 4.2 | astronomy-engine para el ascendente en herramientas web | **Pendiente**; afecta a `tools/full-birth-chart.html` y a Astral Lab (fuera del repo) |
| guerrilla 4.3 | Bundle EN | **Hecho** (`N108147778I`); falta landing propia |
| guerrilla 4.4 | Freemium en 1-2 apps | **Pendiente**; pasa a Fase 3 |
| guerrilla 4.6 | Lista de correo propia | **Desbloqueado**: API operativa, 7 suscriptores, sin secuencia |
| guerrilla 4.7 | Ritmo en Telegram + tarjeta compartible | **Pendiente**; la tarjeta ya está implementada |
| audit-5000 §5.1 | Checkout verificado | **Hecho** (abrir + ventas reales) |
| audit-5000 §5.2 | Reconciliación financiera | **Parcial**: Hotmart sí (API), Play no |
| audit-5000 §5.3 | Eventos GA4 probados | **Hecho**: ≈970 page_view y 12 purchase_click en 28d |
| seo-top1 | Estabilizar el sitio antes de perseguir top-3 | **Vigente**: 84 % de páginas sin clic |
| seo-top1 | Cluster de sigilos a top-3 | **Vigente**: hoy pos 10-12, CTR 2 % |
| contenido-p1-03 | 145 artículos pendientes del cluster servitors | **Congelado**: no se escribe hasta consolidar |
| contenido-p1-03 | 12 herramientas de segunda capa | **Congelado** por la misma razón |
| ASO-play-titles | Títulos ≤30 caracteres y consistencia | **Vigente**: pasa a tarea 1.6 |

---

## 6. Puertas externas (actualizadas)

| # | Puerta | Estado | Qué falta |
|---|---|---|---|
| G1 | IDs de checkout de Hotmart | **Cerrada** (4 IDs verificados) | — |
| G2 | Transacción de prueba + refund | **Parcial** | hacer una compra real de 3,99 $ y su refund |
| G3 | CSV financieros de Play | **Abierta** | export mensual desde Play Console |
| G4 | GA4 | **Cerrada** (API operativa) | — |
| G5 | Service account GSC | **Cerrada** | — |
| G6 | MailerLite | **Cerrada** (API responde) | — |
| G7 | Webhook Hotmart → GA4/MailerLite | **Abierta** | URL del receptor + secreto |
| G8 | Meta Pixel / Google Ads | **Abierta** | IDs reales (hoy `PONER_...`) |
| G9 | Play Console | **Parcial** | precios por país y disponibilidad |
| G10 | Código promo de Play | **Abierta** | crear el código |
| G11 | Bot en Telegram | **Abierta** | añadirlo a canal y grupos |
| G12 | Consentimiento legal | **Abierta** | matriz de proveedores firmada |
| G13 | Acceso GSC | **Cerrada 2026-10-21** | — |

---

## 7. Histórico cerrado (absorbe `plans-completados.md`)

- Inventario canónico de URLs (`docs/canonical-asset-inventory.md`, v1.2.0).
- Reconciliación catálogo apps/páginas/Play (`docs/reconciliacion-catalogo.md`).
- Instrumentación del embudo y allowlist de analítica (`docs/event-contract.md`).
- Auditoría de indexación, E-E-A-T y herramientas gratuitas (P1-11 a P1-15).
- Corrección de la oferta: apps-bundle sin promesa imposible, flash-sale retirada, complete-access con compras reales.
- Corrección de prueba social: reseña real, contadores unificados, claims de reembolso unificados.
- Retirada de datos de clientes y cookies del árbol público.
- Referencias vivas: docs/canonical-asset-inventory.md, docs/event-contract.md, docs/reconciliacion-catalogo.md, docs/aso-12-apps.md, docs/OWNER-MANUAL-CHECKLIST.md, docs/ecosistema-telegram-2026-10.md.
- Informe público 2026 en PDF (`projects/informe-2026/`).

---

## 8. Medición

Un comando: `python scripts/cro-weekly.py [días]` → GSC + GA4 + ventas Hotmart.
Revisión semanal. Un cambio sin métrica asociada no se considera hecho.

| Métrica | Hoy | 30 días | 90 días |
|---|---|---|---|
| Sesiones/mes | 607 | 900 | 1.500 |
| Clic de compra / sesión | 1,98 % | 3 % | 4 % |
| Venta / sesión | 0,16 % | 0,35 % | 0,5 % |
| Reseñas de la app estrella | 23 | 30 | 40 |
| Suscriptores de correo | 7 | 100 | 300 |
| Ventas Hotmart/mes | 1 | 3 | 6 |

## 9. Reglas de ejecución

1. Nada se declara hecho sin evidencia en producción (URL, commit o salida de comando).
2. Un cambio que no se puede medir no se hace, salvo que sea un defecto de confianza o legal.
3. No se publican testimonios sin enlace verificable, ni urgencias con fecha falsa.
4. No se prometen bundles de apps: Play no los permite.
5. Cada URL nueva responde a una consulta con demanda y enlaza a un producto.
6. Antes de escalar tráfico, el embudo debe superar el 3 %.

## 10. Registro de cambios

| Fecha | Cambio |
|---|---|
| 2026-10-01 | v1: plan único tras absorber el backlog de ventas, SEO, legal y Telegram |
| 2026-11-07 | v2: se añaden los planes de contenido y de top-3 del cluster de sigilos |
| 2026-11-19 | v3: mega-auditoría con datos frescos (GSC/GA4/Hotmart/Play), cierre de 6 puertas, corrección de estados obsoletos, plan 90 días orientado a conversión |
