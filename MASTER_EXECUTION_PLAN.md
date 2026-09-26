# PLAN MAESTRO DE EJECUCIÓN — SOLO PENDIENTES

**Objetivo:** alcanzar y sostener **US$5.000 netos cobrados por mes**, no solamente tráfico, contenido o instalaciones.

**Estado del documento:** backlog pendiente, reauditado y atómico, con evidencia local parcial añadida el 2026-09-24. Ninguna tarea externa o gate incompleto se considera terminada. El archivo anterior se conserva únicamente como antecedente contradictorio; este documento reemplaza cualquier checklist, porcentaje o claim histórico como fuente de verdad.

**Fecha de auditoría:** 2026-09-24
**Alcance:** repositorio local `43.-Web-cha0smagick-labs` y las fuentes externas que el equipo debe verificar durante la ejecución. El repositorio no demuestra por sí solo que una campaña, checkout, listing, webhook, automatización, dashboard o flujo de consentimiento esté activo en producción.

**Restricción de esta pasada:** la ejecución local modificó catálogo, páginas de apps, landings, artículos, páginas legales de borrador, consent local, inventario, contrato de eventos, pruebas y evidencia documentada; este plan sigue siendo el único documento de control de producto. Se preservan el cambio preexistente de `docs/thin-articles-progress.md` mediante su regenerador y el archivo no rastreado `_verify_nde_tmp.py`; no se sobrescribe, no se borra y no se incluye en el diff de este plan. No se crean commits.

---

## 1. Reglas de control y fuente de verdad

### 1.1 Estados permitidos

- `PENDING`: existe una brecha, una dependencia o falta evidencia.
- `READY`: la tarea tiene entrada, responsable, dependencias y criterio de aceptación, pero todavía no se inicia.
- `IN_PROGRESS`: hay ejecución y evidencia parcial.
- `DONE`: sólo después de aprobar todos los gates de la tarea y del workstream.
- `BLOCKED`: existe una dependencia externa; se registra el responsable, la fecha y la evidencia que falta.

Una tarea no pasa a `DONE` porque exista un script, workflow, especificación, archivo `.aab`, documento, checkbox histórico o captura no fechada. El código y los archivos existentes son evidencia de existencia, no de producción.

### 1.2 Jerarquía de evidencia

1. **Evidencia primaria externa:** dashboard de Hotmart, Play Console, MailerLite, GA4, Search Console, proveedor de pago, logs de webhook, transacción de prueba y URL pública verificable.
2. **Evidencia reproducible local:** comando, versión, código de salida, artefacto generado, fecha, commit, superficie incluida y resultado del smoke test.
3. **Claim documental:** README, PROJECT-BIBLE, plan anterior, checklist o comentario. Sirve para descubrir una brecha; no sirve para cerrarla.

Cada artefacto que cierre una tarea debe incluir `owner`, `created_at`, `last_verified_at`, `source`, `scope`, `commit/deployment` cuando aplique y `known_limitations`.

### 1.3 Definición financiera de la meta

La meta se mide con efectivo cobrado y neto, no con ventas brutas ni con estimaciones de ventas:

```text
net_collected_revenue_usd
= suma de cobros efectivamente recibidos
  - refunds y chargebacks
  - fees de pago y plataforma
  - impuestos, withholding y otras deducciones aplicables
  - comisiones de afiliados o partners ya devengadas
```

El informe debe conservar, por oferta y por orden, `gross_price`, `net_price`, `currency`, `transaction_id`, `offer_id`, `channel`, `campaign`, `refund_status`, `commission` y `collection_date`. La cifra final se compara con un mes cerrado; no se reemplazan por Estimates o projections.

### 1.4 Puente de ingresos sin inventar números

Como el repositorio no contiene un estado externo confiable de ventas, el primer trabajo financiero es reconstruir la línea base real. Para cada oferta se calcula:

```text
Gap-to-5k = 5.000 - net_collected_revenue_usd_del_último_mes_cerrado
órdenes_requeridas = ceil(Gap-to-5k / net_contribution_por_orden)
net_contribution_por_orden = cobros - refunds - fees - impuestos - comisión
```

`net_contribution_por_orden` debe salir de transacciones reales o de un sandbox explícitamente identificado. No se fija un volumen de órdenes hasta conocer precio neto, refunds, fees y conversión observada.

La asignación de esfuerzo se dirige primero al efectivo más cercano y verificable:

1. **Libros, bundle y acceso digital:** validar checkout, oferta, margen y recuperación de carrito; es la vía más directa para cobrar sin depender de una instalación.
2. **Apps y compras in-app:** sólo después de reconciliar catálogo, publicación, package ID, precio y retención.
3. **Afiliados y partnerships:** sólo con acuerdo, disclosure, tracking, comisión y reverso documentados.
4. **Flash, Inner Circle o membresía:** sólo después de demostrar contenido, billing, cancelación, retención y margen.
5. **Pago pagado:** sólo después de tener margen de contribución, tracking, consent y una regla de stop de presupuesto.

El documento no presenta un porcentaje de mezcla como forecast. Si el equipo decide usar una mezcla, debe registrarla como hipótesis con precio, conversión, margen, fuente y fecha, y recalcularla con datos reales.

### 1.5 Guardrails de decisión

- No activar ads pagadas hasta tener checkout, eventos, consent y atribución verificados.
- No anunciar una app, URL o paquete hasta que la página, `offers.json`, Google Play y el bot usen el mismo producto.
- No contar como calidad editorial el superar 800 palabras.
- No publicar una ruta de venta con `[ID]`, `[URL]`, `[SECRET]` o datos de ejemplo.
- No usar el porcentaje histórico de avance ni el número histórico de tareas como estado actual.
- No contar una sesión, click, follower o instalación como ingreso.
- No escalar una oferta sin conocer su margen de contribución, refunds y capacidad de entrega.

---

## 2. Baseline auditado: evidencia y límites

### 2.1 Superficie del repositorio

- Rama observada: `main`, sincronizada con `origin/main`, HEAD observado `751985d` (2026-09-23T22:15:23-05:00). **Actualizado 2026-09-25:** el HEAD vigente es `f219f9d`; `751985d` queda como referencia del baseline histórico de este bloque.
- Working tree preexistente: `M docs/thin-articles-progress.md` y `?? _verify_nde_tmp.py`; se preservan.
- Inventario tracked observado: 1.402 archivos, incluyendo 538 HTML, 124 JS, 111 Python, 18 JSON y 25 MD. **Actualizado 2026-09-25:** 583 HTML rastreados, de los cuales 568 pertenecen a la superficie canónica y 15 caen dentro de rutas excluidas que igual se publican.
- Superficie filesystem observada: **622** HTML; el working set gobernado por el verificador tiene **569** páginas y la superficie canónica rastreada **568**. La diferencia es 53 artefactos excluidos, cifra que el ledger v1.2.0 verifica sin deriva. El ledger v1.2.0 documenta los tres snapshots (524/577, 529/582, 569/622) como un invariante.
- `sitemap.xml` contiene **532** URLs observadas (SHA-256 `574d3a1d…`); `llms.txt` existe, pero no se debe inferir que sea completo, actualizado o suficiente para GEO.
- No se encontraron `llms-full.txt`, `indexnow.json`, `humans.txt` ni `security.txt`. Su ausencia es una decisión por documentar, no una tarea automática de publicación.

### 2.2 SEO, contenido y performance

- El script local `scripts/verify_tech_debt.py` reportó 563 páginas con JSON-LD y cero errores de validación del script, sobre 569 escaneadas. Esto no prueba rich results, unicidad de metadata, indexabilidad ni rendimiento en buscadores.
- Conteos de metadata sobre la superficie gobernada: los **569** archivos gobernados emiten tag `rel="canonical"`, de los cuales **568** apuntan al origen de producción y **1** apunta al host equivocado (`blog/witchcraft-for-beginners-guide.html`, documentado en §6.1 del ledger y enrutado a P1-01). La verificación exacta queda sujeta a medición de buscadores y Rich Results. Persisten 180 `missing_alt`, 270 `empty_alt` y el baseline de heading skips del reporte previo, que requieren una revisión manual de accesibilidad y no se deben corregir con un reemplazo ciego.
- La auditoría local del 2026-09-24 corrigió 2 descripciones, 9 hreflang y 10 canonical en páginas concretas; no se cambiaron precios, claims ni URLs de venta.
- El reporte de imágenes contiene 4.183 imágenes; sólo 9 están en WebP, 412 tienen dimensiones declaradas y 68 tienen lazy loading. El trabajo de performance debe medirse por plantillas, no_hidden y evidencia de carga real, no por una métrica global sin contexto.
- `scripts/thin_articles_report.py` reporta ahora 0 artículos por debajo de 800 palabras, 0 entre 800 y 1.500 y 467 por encima de 1.500; el reporte fue regenerado el 2026-09-24. El umbral no prueba intención, E-E-A-T, enlaces, conversión ni utilidad.
- El repositorio contiene `robots.txt` y sitemap, pero no hay evidencia en el repo de una auditoría completa de canonical recíproco, hreflang, indexabilidad, Core Web Vitals, Lighthouse real, backlinks o revenue orgánico.

### 2.3 GEO / AI Search

- `llms.txt` existe, pero la decisión local en `docs/geo-surface-decision.md` documenta que no se publique `llms-full.txt` automáticamente hasta reconciliar entidades, precios y estados.
- El mapa de entidades, crawler output, registro de consultas, fecha de última revisión y log de citas/referrals de AI siguen pendientes; la propuesta local no es evidencia de descubrimiento.
- La GEO debe medirse como una hipótesis de descubrimiento y citas, no como ranking garantizado.

### 2.4 Catálogo, apps y ASO

- `apps/` contiene 12 páginas HTML; `scripts/bots/data/offers.json` fue reconciliado localmente a 12 apps. La matriz local quedó documentada en `docs/revenue-catalog-reconciliation.md`; la disponibilidad y publicación en Google Play siguen sin verificación externa.
- La auditoría local dejó alineados package ID, URL pública y precio de las 12 páginas; permanecen sin verificar la existencia y disponibilidad de cada listing en Google Play.
- `projects/app-submissions/` contiene artefactos AAB/APK agrupados en nueve apps. Los artefactos prueban que hubo builds o submissions; no prueban listing público, screenshots, Data safety, privacy URL, publicación, reviews, retención o ingresos.
- `noctem-tools` tiene package ID local explícito en la página pública, pero su listing externo sigue sin verificación.

### 2.5 Checkout, oferta y monetization

- `landing-pages/books-bundle.html` contiene una URL Hotmart con `V107097103W`; no se asume que el producto esté activo hasta verificarlo.
- `landing-pages/complete-access.html` ya no contiene un href placeholder: su CTA está bloqueado visiblemente y el ID externo sigue sin existir. Estado: `BLOCKED_EXTERNAL_ID`.
- `landing-pages/flash-sale.html` ya no contiene hrefs placeholder: sus dos CTA Hotmart están bloqueados visiblemente y el ID externo sigue sin existir. Estado: `BLOCKED_EXTERNAL_ID`.
- `landing-pages/apps-bundle.html` apunta a una colección de Google Play, no a un checkout Hotmart; no se debe llamar “bundle monetizable” sin definir el producto y la experiencia de compra.
- El repositorio no contiene evidencia de un producto Active, transacción de prueba, refund, prize o payout reconciled para las ofertas bloqueadas.
- No se deben cambiar precios ni crear IDs hasta tener una fuente de verdad y un owner comercial.


### 2.6 Email, CRM, webhooks, analytics y ads

- Sólo se detectó un `<form>` real en `tools/reality-check-tracker.html`. Las referencias a MailerLite en páginas, libros, checklist y documentación no prueban nueve automatizaciones activas.
- `projects/mailerlite-forms.md` y `webhooks/webhook-configs.md` son especificaciones. Los placeholders como `[MAKE_WEBHOOK_URL_HOTMART]`, `[TU_WEBHOOK_SECRET]`, `[MAKE_WEBHOOK_URL_STRIPE]` y `[GENERADO_POR_STRIPE]` siguen siendo blockers de producción hasta sustituirse y probarse.
- Hay un ID GA4 visible (`G-V6LHCPN9TK`) y referencias de Meta Pixel, pero no hay evidencia exportada de Consent Mode, debug view, eventos de compra, deduplicación o reconciliación con Hotmart/Play.
- La presencia de workflows de CI, Lighthouse, Pages, security, social y bots no prueba que se hayan ejecutado, que los secrets existan, que los budgets pasen o que producción esté actualizada.

### 2.7 Legal y confianza

- Existe `privacy-policy.html`.
- La pasada local añadió borradores de trabajo `terms.html`, `cookie-policy.html`, `refund-policy.html`, `disclaimer.html` y `affiliate-disclosure.html`; están enlazados desde el footer local y marcados explícitamente como pendientes de revisión legal.
- La revisión formal del owner legal, Data protection, consent accept/reject/withdrawal y claims de garantía/refund continúa sin verificarse.
- `index.html` contiene claims de garantía/refund y comportamiento de consent que deben revisarse antes de capturar leads o cobrar.
- La auditoría legal formal, Data protection y Policy de cada app no están probadas por el repositorio.

### 2.8 Documentación y operación

- `README.md` y `PROJECT-BIBLE.md` contienen cifras, topología y estados de deploy potencialmente legacy. No son evidencia de revenue, publicación ni arquitectura vigente.
- No hay evidencia suficiente de uptime, alertas, rollback, rotación de secrets, retención de logs, backups, soporte o respuesta a incidentes.
- Los conteos de `docs/thin-articles-progress.md` son un reporte de umbral y no un sistema de calidad editorial o conversión.

### 2.9 Implementación local ejecutada y límites

- `scripts/bots/data/offers.json` quedó reconciliado localmente con 12 páginas de apps, 12 package IDs/precios públicos, 7 libros y el bundle observado.
- `docs/revenue-catalog-reconciliation.md` registra la matriz, límites, comandos de verificación y bloqueos externos.
- Bots, Groq y expectativas de tests ya no contienen conteos legacy, precios stale ni `/bundle.html`; ahora usan el catálogo local y el bundle observado.
- Las 12 páginas de apps tienen default GA4 denied antes de `gtag('config', ...)`; esto es un guard técnico, no prueba legal completa.
- `books-bundle.html` registra US$19.99 en el evento de checkout, no US$49.99.
- `complete-access.html` y `flash-sale.html` ya no exponen hrefs placeholder; sus CTA Hotmart están bloqueados y no registran checkout.
- Se actualizó `docs/canonical-asset-inventory.md` a **v1.2.0** (2026-09-25): el snapshot vigente es 622 filesystem = 569 gobernados + 53 excluidos, superficie canónica rastreada 568, sitemap 532, y conserva los históricos 577/524 y 582/529; registra oferta/URL/owner/estado y mantiene la limitación de publicación externa. La v1.1.0 declaraba 582/529 y sitemap 492 contra el baseline obsoleto `751985d`.
- Se crearon cinco páginas legales de borrador, `docs/legal-vendor-matrix.md`, footer común, default denied en la portada y sitemap regenerado; falta owner legal y prueba de consent en producción.
- Se creó `docs/event-contract.md` y se añadieron pruebas de comportamiento para `scripts/ga4-mp.js` y `scripts/webhook-receiver.js`; falta reconciliación con transacciones reales y consent reject en GA4.
- `npm test` (38 pytest + 229 Vitest en 11 archivos) y `npm run build` pasan localmente; el auditor de accesibilidad no puede cargar la stylesheet remota y reporta errores de contexto, por lo que no constituye evidencia de producción.
- La cola generated thin quedó en 467/467 `done` tras el trabajo editorial; el word count sigue sin ser evidencia de intención, E-E-A-T, oferta, CTA o conversión.
- Estos cambios no cierran P0-02 ni P0-03 completos: siguen pendientes los exports y pruebas de Hotmart, Google Play, consentimiento, ventas y ledger financiero.

#### 2.9.1 Instrumentación de analytics y funnels de herramientas (2026-09-24, HEAD `88754bc`)

- `data/tool-funnels.json` (v con 61 entradas bajo `tools`) mapea cada herramienta atómica a un producto, ángulo y CTA; las 61 coinciden con las 61 entidades `WebApplication` del JSON-LD.
- `data/analytics-events.json` declara 19 eventos con secciones `privacy`, `enforcement` y `value_buckets`; el bridge aplica allowlist y consentimiento, no envío libre.
- `js/analytics-bridge.js` deriva los eventos declarados en el DOM y los entrega a la ruta de ingreso; `scripts/analytics/test/analytics-bridge.test.mjs` (385 líneas) cubre ese contrato.
- `js/conversion.js` (84.815 B) y `js/shared.js` (17.181 B) quedaron con sus `.min.js` regenerados y verificados más recientes que el origen.
- Se añadieron `scripts/analytics-daily.js`, `scripts/analytics-health.js` y `scripts/analytics-live-smoke.js`; el smoke exige credenciales y no se ha ejecutado contra GA4 real.
- Documentación nueva: `docs/analytics-credential-runbook.md`, `docs/analytics-growth-plan.md` y `docs/plan-tools-sales-funnels.md`.
- Límite: instrumentar eventos y exponer CTAs no prueba que un evento llegue a GA4 ni que un CTA convierta. El *lado cliente* del consent reject se midió después con navegador real (ver §2.9.2), pero sigue faltando la confirmación en GA4 y la reconciliación de `purchase` con Hotmart/Play.

#### 2.9.2 Comportamiento de consentimiento medido en navegador real (2026-09-25)

`scripts/analytics/consent-browser-test.mjs` (Puppeteer + Chrome 151) abre el dominio desplegado y observa cookies, la cola `dataLayer`, los `gtag('consent','update')` y la red. **Resultado: PASS, exit 0, 30 checks.** El control negativo (URL inexistente) devuelve **exit 2 INCONCLUSIVE** por `HTTP 404`, lo que demuestra que el test no puede dar verde por accidente.

| Escenario | Cookie | `isConsentGranted()` | `track('tool_start')` | `gtag('consent','update')` |
|---|---|---|---|---|
| Primera visita, sin cookie | ausente | `true` | aceptado | `granted` |
| Decline (+ recarga) | `declined` | `false` | rechazado | `denied` (4 campos) |
| Accept (+ recarga) | `accepted` | `true` | aceptado | `granted` (4 campos) |

**Hallazgo de producto, no del test:** en la primera visita la cookie no existe, así que el consentimiento resuelve a **concedido** y hay peticiones reales a googletagmanager/doubleclick **antes** de que el banner aparezca y antes de cualquier decisión del usuario. Un "Decline" solo surte efecto en la **siguiente** vista de página. Esto coincide con lo que el propio código declara (`// 5. GA4 BOOTSTRAP + CONSENT (default GRANTED)`, `// 8. COOKIE CONSENT BANNER (informative — collection is already active)`), así que se registra como comportamiento medido. **Si esto es legalmente admisible es el gate legal de P0-06, no un resultado de este test.**

Tres defectos reales se corrigieron durante la construcción, y quedan documentados para que no se reintroduzcan: (1) la sonda `instrument()` se definía pero nunca se inyectaba — el primer run dio `dataLayerCallCount = 0` y salió INCONCLUSO mientras las peticiones reales ya estaban en el cable; (2) `gtagAssigned` subreportaba, porque gtag.js instala `gtag` por *declaración de función* global y eso no dispara un setter de accessor; (3) **falso verde real**: la primera versión que pasó daba PASS también sobre `404.html`, porque ese archivo del repo contiene banner *y* snippet de gtag y el test no miraba el status HTTP. Se añadió `recordStatus()` y el control negativo pasó a exit 2.

**Lo que este test NO prueba:** que GA4 haya ingerido o procesado los hits (exige credenciales; y ingerir ≠ procesar); que el `denied` evite el envío en el servidor de Google (solo se probó el lado cliente); la rama de *withdrawal*, que no tiene banner; Lighthouse y Core Web Vitals, que no se cubren **en este test** (sí se midieron por separado, ver §2.9.3). El test despacha 5 eventos `tool_start` sintéticos para leer la compuerta de `track()`, y lo declara en su salida y en el JSON de evidencia.

#### 2.9.3 Lighthouse y Core Web Vitals medidos en el dominio desplegado (2026-09-25)

`lighthouse` **no estaba instalado**; se instaló `lighthouse@13.5.0` como devDependency. El script es `scripts/analytics/lighthouse-audit.mjs`: conduce Chrome real vía Puppeteer, corre Lighthouse en modo lab y consulta PageSpeed Insights (endpoint público, sin API key) para los datos de campo. Escribe `out/lighthouse-evidence.json`.

**Resultado medido contra `https://cha0smagicklabs.com`:**

| Preset | Veredicto | LCP | CLS | TBT | performance | accessibility | best-practices | seo |
|---|---|---|---|---|---|---|---|---|
| Mobile | `FAIL` (exit 1) | 2210 ms ✅ | 0.000 ✅ | **216 ms ❌** | 93 | 91 | 96 | 100 |
| Desktop | `FAIL` (exit 1) | **2769 ms ❌** | **0.961 ❌** | 166 ms ✅ | **45** | 91 | 96 | 100 |

Umbrales (p75 de web.dev): LCP ≤ 2500 ms, CLS ≤ 0.1, TBT ≤ 200 ms, INP ≤ 200 ms.

**Defecto reproducible, no artefacto de laboratorio:** el CLS de escritorio se repitió en 4 corridas independientes — 0.961, 1.115, 0.932, 0.920 — mientras el móvil mide **exactamente 0.000** en todas las corridas. `performance` de escritorio se mueve entre 36 y 45. Es un defecto de layout shift **solo de escritorio**, real y medible. `accessibility` (91), `best-practices` (96) y `seo` (100) son estables en todas las corridas.

**Control negativo validado:** `--url .../no-existe-control-negativo-9f3a.html` → **INCONCLUSIVE, exit 2**, bloqueado en `L2.origin-serves-url` porque el origen respondió `HTTP 404`. Un status que no es éxito no puede producir un perfil de rendimiento confiable, así que el exit 0/1 es inalcanzable sobre una página no servida.

**Causa raíz NO confirmada por medición.** La sonda de atribución (`layout-shift-elements`, `unsized-images`) no devolvió elementos, así que el defecto queda **localizado pero no explicado**. La pista más plausible ya vive en el baseline de deuda técnica: 4183 imágenes con solo 412 `sized` y 68 `lazy`, es decir la gran mayoría sin dimensiones explícitas. Eso es una **hipótesis**, no una causa confirmada. El trabajo de causa raíz pertenece a **P1-01**, cuya dependencia P0-10 sigue abierta, así que aquí se registra y no se arregla.

**Límites que este audit NO cubre:** no se obtuvieron datos de **campo**, y la causa **no es transitoria**. PageSpeed Insights sin API key respondió `HTTP 429` tres veces seguidas (con 20 s de espera entre intentos) y el cuerpo del error lo explica sin ambigüedad: `limit 'Queries per day'` y `"quota_limit_value": "0"` para el proyecto consumidor anónimo. Una cuota diaria de **cero** es un bloqueo duro: reintentar no puede funcionar nunca, y sin tráfico suficiente tampoco habría datos CrUX. El script marca `cwvComplete:false` e imprime un aviso de que la corrida no puede cerrar un gate de CWV pase lo que pase. **Conseguir CWV de campo exige un proyecto de Google Cloud con API key y la API de PageSpeed Insights habilitada — es una acción de owner, no un reintento.** Además **INP es immeasurable en laboratorio**, TBT es un proxy con semántica distinta y no es INP, laboratorio ≠ campo. Y el audit no dice absolutamente nada sobre ingresos, conversión ni revenue: una caída de performance es un coste, no una medición de negocio.

**Varianza de laboratorio — leer los números como una medición, no como una constante:** en móvil el LCP y el TBT se movieron entre corridas (LCP 2210 → 2507 ms, TBT 216 → 236 ms, performance 93 → 92) mientras el CLS se mantuvo en 0.000 exacto. Los umbrales de 2500 ms y 200 ms se cruzan de forma intermitente, así que el TBT de móvil está **justo sobre el umbral** y oscila: es una observación borderline, no un fallo estable. El CLS de escritorio sí es estable y grande (0.92–1.12 en 4 corridas), y eso sí es un defecto confirmado.

Un defecto de clasificación se corrigió en el propio script durante esta verificación: el 429 se trataba como reintentable con la premisa de que era un rate limit transitorio, y eso era **falso**. El script ahora distingue la agotamiento de cuota diaria — terminal, sin reintento, nombrando la corrección real — de un 429 genuinamente transitorio, y la corrida completa bajó de minutos a 14 s porque ya no duerme contra un bloqueo que no puede romper.

Tres defectos reales se corrigieron para conseguir que corriera, y quedan documentados para que no se reintroduzcan: (1) `lighthouse is not a function`, porque Lighthouse 13 es ESM puro y `createRequire()` devuelve la build CJS que no es invocable — se resolvió con `await import('lighthouse')`; (2) `port: 0` rompía el arranque, porque eso le indica a Lighthouse que se **conecte** a un navegador en el puerto 0; (3) `chrome-launcher` no achieves a lanzar el navegador en este entorno, incluso con `chromePath` y `chromeFlags`. La firma de Lighthouse 13 es `lighthouse(url, flags, config, page)`, con la **cuarta** argumento siendo una `Page` real de Puppeteer: por eso el script lanza el Chrome él mismo y le pasa la página.

**Nota de drift documental — RESUELTA el 2026-09-25:** `docs/canonical-asset-inventory.md` v1.1.0 §8 declaraba verificación contra HEAD `751985d`, atrasado respecto al árbol real, y su snapshot (582 filesystem = 529 gobernados + 53 excluidos, sitemap 492) nunca se había re-verificado. **P0-01 lo cerró**: el ledger está en v1.2.0, verificado contra HEAD `f219f9d` con 19 afirmaciones comprobadas de forma independiente, y su §2.1 resuelve los tres snapshots históricos. El defecto que esa re-verificación destapó —un canonical que apunta al host `www.` equivocado— está en §6.1 del ledger y enrutado a P1-01.

---

## 3. Brechas atómicas de ingreso

| ID | Brecha verificable | Riesgo si no se cierra | Gate de salida |
|---|---|---|---|
| B-001 | No hay superficie canónica única para URLs, productos, precios y estados | Se miden o anuncian activos equivocados | Inventario versionado y sin duplicados |
| B-002 | Catálogo local de 12 páginas y 12 ofertas ya fue reconciliado, pero el estado de Play sigue sin verificar | Bots, web y campañas pueden vender otra app | Matriz local más export verificable de Play Console |
| B-003 | Complete Access y Flash Sale ya tienen CTA local bloqueado, pero falta el ID externo | Checkouts no accionables | URL real probada o página retirada/noindex con decisión |
| B-004 | No existe ledger de net price, fees, refunds, impuestos y comisiones | No se puede saber Gap-to-5k | Cierre financiero mensual reproducible |
| B-005 | Los 19 eventos están declarados en el DOM y en un bridge con allowlist, pero ninguno se ha observado llegar a GA4 | No hay atribución ni diagnóstico real | Consent reject confirmado del lado de GA4 (el lado cliente ya está medido en §2.9.2), logs de debug de GA4 y reconciliación de `purchase` con plataformas |
| B-006 | Legal, consent y claims no están cerrados | Riesgo de rechazo, complaint y pérdida de confianza |Páginas públicas y test accept/reject |
| B-007 | Webhooks y CRM son specs, no producción | Abandono, cross-sell y recovery no funcionan | Flujo real con logs e idempotencia |
| B-008 | Listing/availability de Play no está demostrado | No hay oferta ASO confiable | URL y estado de cada listing |
| B-009 | Las 61 herramientas tienen CTA de venta instrumentado, pero sin conversión observada | Crecimiento orgánico no verificable | Auditoría before/after y revenue assisted |
| B-010 | GEO no tiene superficie, crawler ni registro de citas | No se mide descubrimiento por AI | Set reproducible de consultas y fuente |
| B-011 | Contenido no tiene QA de intención, E-E-A-T, offer y CTA | Más páginas pueden producir cero ventas | Registry editorial y sample revisado |
| B-012 | No hay experiments de pricing, AOV o retención | El precio no está optimizado | Decisión con margen y baseline |
| B-013 | No existe dashboard de revenue, attribution y cohort | No se puede asignar presupuesto con criterio | Dashboard y monthly close |
| B-014 | No existe runbook de deploy, rollback, alertas y soporte | Revenue puede caer sin detección | Drill y owners |
| B-015 | README, PROJECT-BIBLE y plan no reconcilian el estado | Decisiones stale y trabajo duplicado | Índice documental con source of truth |

---

## 4. Backlog atómico pendiente

Cada bloque es una unidad de trabajo. No se deben marcar dos tareas como `DONE` con una sola captura genérica.

### P0 — Desbloqueo de oferta, confianza y medición (días 0–14)

#### [x] P0-01 — Congelar la superficie canónica y el ledger de evidencia — **DONE 2026-09-25** (`docs/canonical-asset-inventory.md` v1.2.0, HEAD `f219f9d`)

- **Owner:** Revenue Ops / Web.
- **Dependencias:** ninguna.
- **Entregable:** inventario versionado de URLs públicas, páginas, apps, offers, package IDs, precios, checkout, owners y estado.
- **Debe hacer:** elegir tracked/public o filesystem como superficie canónica; listar cada URL como live, draft, noindex, retired o pending; registrar fecha, commit, fuente y responsable.
- **No debe hacer:** cambiar precios, publicar URLs, borrar páginas o corregir el working tree preexistente como parte de esta tarea.
- **Aceptación:** cada activo tiene un `asset_id`, una URL canónica, un owner, un estado y una fecha de verificación; las discrepancias históricas 524/577 y el estado actual 529/582 quedan resueltos o explícitamente excluidos.
- **Evidencia:** archivo de inventario, export de URLs, commit y `git status` que pruebe que los cambios ajenos siguen intactos.
- **Cómo se Satisfizo la aceptación:**
  - *Superficie canónica elegida:* se adoptó el conjunto **HTML rastreado y gobernado = 568 archivos** como superficie pública canónica, por ser lo que GitHub Pages publica desde `main`. El working set gobernado (569) y el filesystem (622) quedan registrados como conjuntos distintos y nombrados, no fusionados.
  - *Estado por activo:* los 12 offers de apps están `external_listing_unverified`, los 7 libros y 6 landing pages `local_candidate` (estado comercial no verificado), el bundle `external_url_observed_sale_unverified`, las cinco páginas legales `legal_owner_pending`, y `checklist-ventas.html` con estado propio `local_candidate_untracked_gitignored`. No se afirma `live` para ningún activo sin evidencia externa.
  - *Discrepancias 524/577 y 529/582:* resueltas en §2.1 del ledger. Los tres pares (524/577, 529/582, 569/622) cumplen el mismo invariante `filesystem = gobernado + 53`; no hay contradicción, solo crecimiento de +40 archivos, atribuible íntegramente a `tools/*.html` pasando de 22 a 62.
  - *Fuente, fecha y commit:* cada tabla del ledger lleva columna de fuente y fecha `2026-09-25`, y el frontmatter fija `HEAD f219f9d` con el SHA-256 del sitemap como ancla reproducible.
- **Defecto encontrado y deliberadamente NO corregido** (por estar fuera del alcance de P0-01, que prohíbe cambiar páginas): `blog/witchcraft-for-beginners-guide.html` emite canonical a `https://www.cha0smagicklabs.com/blog/witchcraft-for-beginners-guide` — host equivocado (`www.` frente al `CNAME` real `cha0smagicklabs.com`) y path sin extensión. Documentado en §6.1 del ledger y enrutado a P1-01.
- **Deuda de clasificación descubierta:** 15 de los 53 archivos del set excluido están **rastreados en `main`**, luego GitHub Pages los publica. "Excluido" significa "fuera del alcance gobernado", **no** "no publicado". Se registra explícitamente para que nadie lea el set excluido como una garantía de no publicación.
- **Pendiente que no es local (requiere owner):** decisión sobre los 15 archivos rastreados fuera de alcance, y sobre si `checklist-ventas.html` se rastrea o se retira del working set.

#### [ ] P0-02 — Reconciliar catálogo de apps, páginas y Play

- **Owner:** ASO / Android.
- **Dependencias:** P0-01.
- **Entregable:** matriz `app slug → nombre → package ID → Play URL → precio → estado → listing URL → owner`.
- **Debe hacer:** mantener reconciliada la matriz local de 12 páginas de `apps/` con las 12 entradas de `offers.json`; resolver y verificar externamente `noctem-tools`, duplicados/variantes, precios, URLs y todos los package IDs; separar build, submission, testing, live y retired.
- **No debe hacer:** inventar una URL, cambiar el nombre comercial o publicar un paquete bajo un package ID distinto sin aprobación.
- **Aceptación:** cada página y oferta tiene un estado único; cada oferta live tiene una URL de Play verificable; el bot y las páginas no apuntan a productos diferentes.
- **Evidencia:** matriz, export de Play Console, comparación reproducible con `offers.json` y screenshots de cada CTA.

#### [ ] P0-03 — Resolver rutas de venta y placeholders de Hotmart

- **Owner:** Revenue / Web.
- **Dependencias:** P0-01.
- **Entregable:** registro de oferta con URL de checkout real por producto y decisión explícita para cada página no vendible.
- **Debe hacer:** mantener las dos páginas sin href placeholder y con estado `BLOCKED_EXTERNAL_ID`; obtener y verificar los IDs reales de Complete Access y Flash Sale; verificar `V107097103W`; revisar `complete-access`, `flash-sale`, `books-bundle`, `apps-bundle` y CTAs de libros y apps.
- **No debe hacer:** inventar IDs, mandar a un checkout roto, tratar una colección de Play como checkout de un bundle ni ocultar una oferta no disponible.
- **Aceptación:** cada página live contiene una URL real, sandbox explícito o estado de retirada; cada oferta live tiene prueba de apertura y, cuando aplique, transacción de prueba.
- **Evidencia:** matriz local en `docs/revenue-catalog-reconciliation.md`, HTML renderizado, enlaces extraídos, transaction IDs, resultado de checkout y decisión de retiro/noindex.

#### [ ] P0-04 — Reconstruir el baseline financiero y el Gap-to-5k

- **Owner:** Finance / Revenue.
- **Dependencias:** P0-01, P0-03.
- **Entregable:** cierre de los últimos 30 días con net collected por oferta, canal y campaña.
- **Debe hacer:** exportar Hotmart, Play, pagos y otras fuentes; conciliar cobros, refunds, fees, impuestos/withholding, commissions, moneda y fecha de cobro; calcular Gap-to-5k por fórmula, no por feel.
- **No debe hacer:** mezclar gross sales con net cash, omitir refunds ni usar una estimación como cierre.
- **Aceptación:** el informe reproduce el total de cada fuente y deja una diferencia explicada; `Gap-to-5k` se puede recalcular con los mismos datos.
- **Evidencia:** export original, hoja de conciliación, query reproducible, timestamp y decisión sobre fuentes faltantes.

#### [ ] P0-05 — Diseñar oferta mínima, precio neto y escenarios

- **Owner:** Product / Revenue / Finance.
- **Dependencias:** P0-02, P0-03, P0-04.
- **Entregable:** tabla de oferta con `gross_price`, fees, refunds, `net_price`, margen de contribución, órdenes requeridas, owner y fecha de revisión.
- **Debe hacer:** comparar bundle, libros individuales, acceso, apps, flash y membresía; modelar escenarios conservative/base/qualified sin llamarlos forecast; decidir qué oferta puede cobrarse primero.
- **No debe hacer:** cambiar el precio real de Hotmart/Play sin registro, ofrecer descuento que destruya margen ni esconder uncertainty.
- **Aceptación:** cada oferta live tiene `net_price` reproducible; la suma de oportunidades puede cerrar US$5.000 o muestra exactamente el Gap-to-5k y su dependencia.
- **Evidencia:** pricing table, sensitivity analysis, approved price source y cálculo de órdenes.

#### [ ] P0-06 — Cerrar legal, consent y trust antes de capturar leads

- **Owner:** Legal/Privacy + Web.
- **Dependencias:** P0-01, P0-03.
- **Entregable:** páginas públicas de privacy, terms, cookies, refund, disclaimer y affiliate disclosure; matriz de vendors, data flows y consent.
- **Debe hacer:** revisar `privacy-policy.html`; cubrir GA4, píxeles, email, pago y Play; validar claims de garantía/refund; adaptar por país sólo con revisión; añadir privacy/data-safety por app cuando aplique.
- **No debe hacer:** copiar una plantilla genérica, publicar tracking no autorizado, afirmar revisión legal sin owner ni prometer una política que el checkout no cumple.
- **Aceptación:** páginas enlazadas desde footer y checkout; reject/accept/withdrawal probados; claims de refund, garantía y tracking coinciden con la política y con la plataforma.
- **Evidencia:** URLs live, matriz vendor/data-flow, revisión legal fechada, screenshots de consent y prueba de no-track antes de accept.

#### [ ] P0-07 — Instrumentar el funnel y reconciliar purchase

- **Owner:** Analytics / Web.
- **Dependencias:** P0-01, P0-03, P0-06.
- **Entregable:** contrato de eventos con nombres, triggers, parámetros, owner, política de PII y pruebas.
- **Debe hacer:** cubrir `view_item`, `begin_checkout`, `add_payment_info`, `purchase`, `lead_submit`, `app_download` y `affiliate_click`; incluir `offer_id`, `transaction_id`, `value`, `currency`, `source`, `medium`, `campaign`, `landing_page`, `device` y `consent_state` donde corresponda.
- **No debe hacer:** inferir compra desde pageview, duplicar purchase, enviar PII en URL/event name ni medir un click como revenue.
- **Aceptación:** cada etapa produce un evento único en una prueba end-to-end; purchase se reconcilia con Hotmart/Play en una muestra; el consent reject no genera tracking no autorizado.
- **Evidencia:** event dictionary, payloads sanitizados, debug logs/screenshots y reconciliation report.

#### [ ] P0-08 — Activar y verificar CRM, email y webhooks

- **Owner:** Lifecycle / Automation.
- **Dependencias:** P0-03, P0-06, P0-07.
- **Entregable:** mapa Lead → Subscriber → Customer → Recovered Customer con owner, tags, reglas, retries, dead-letter y suppression.
- **Debe hacer:** configurar welcome, nurture, browse/cart, post-purchase, cross-sell y winback; conectar Hotmart/Make/MailerLite sólo mediante endpoints reales; probar alta, compra, refund y unsubscribe.
- **No debe hacer:** activar desde un JSON de ejemplo, contar un dashboard como automatización ni duplicar clientes por reintentos.
- **Aceptación:** lead de prueba recorre cada flujo; compra crea customer/tag correctos; webhook responde, es idempotente, no duplica y suprime bajas.
- **Evidencia:** IDs de automatización, logs de entrega, transaction de prueba, payload sanitizado y reconciliación de estados.

#### [ ] P0-09 — Verificar listings y disponibilidad de Google Play

- **Owner:** ASO / Android.
- **Dependencias:** P0-02, P0-06, P0-07.
- **Entregable:** inventario de publicación con estado por app: live, internal, closed, submitted, suspended o retired.
- **Debe hacer:** confirmar package ID, título, descripción, screenshots, icon, categoría, price, privacy URL, Data safety, content rating, release notes y URL real; separar artefacto de publicación.
- **No debe hacer:** subir un paquete con otro package ID, usar screenshots falsos o llamar live a un listing sólo porque existe un `.aab`.
- **Aceptación:** cada app live tiene listing verificable, CTA correcto, owner y fecha; las no publicadas no se usan en bots, ads o forecasts.
- **Evidencia:** export de Play Console, URL pública, screenshots del listing, reporte de instalación o smoke de CTA.

#### [ ] P0-10 — Ejecutar release y smoke test de producción

- **Owner:** Web / DevOps.
- **Dependencias:** P0-03, P0-06, P0-07, P0-08, P0-09.
- **Entregable:** release candidate desplegado y verificado en el dominio real.
- **Debe hacer:** ejecutar build y tests; revisar canonical, robots, sitemap, consent, navegación, CTA, checkout, email, deep links, 404, mobile y status del hosting; guardar commit y timestamp.
- **No debe hacer:** declarar deploy successful sólo porque existe un workflow o porque CI pasó en otro entorno.
- **Aceptación:** `npm run build` y `npm test` pasan; smoke externo de rutas críticas pasa; no hay 5xx/404 en CTAs; el reporte distingue fallos preexistentes de fallos del cambio.
- **Evidencia:** logs de CI, URL live, reporte de smoke, Lighthouse de superficie canónica y registro de rollback.

---

### P1 — Conversión, adquisición y optimización (días 15–45)

#### [ ] P1-01 — Ejecutar el remediation loop de SEO técnico

- **Owner:** SEO / Web.
- **Dependencias:** P0-01, P0-10.
- **Entregable:** registro de remediación para canonical, hreflang, robots, title, description, headings, indexability, sitemap, OG/Twitter, imágenes y Core Web Vitals.
- **Debe hacer:** validar reciprocidad, aislar duplicados intencionales, corregir sólo URLs canónicas, mantener la cobertura local de description/hreflang/canonical, remediar los 180 missing alt y 270 empty alt sólo con revisión de accesibilidad, corregir heading skips y medir plantillas representativas.
- **No debe hacer:** regenerar todo sin revisar impacto, canonicalizar a una URL incorrecta ni llamar “SEO completo” a JSON-LD válido.
- **Aceptación:** todas las URLs indexables tienen canonical y description coherentes; no quedan errores elegibles de rich-results; existe baseline y budget de CWV.
- **Evidencia:** export de GSC/Bing, rich-results test, Lighthouse CI, before/after y registro de excepciones.

#### [ ] P1-02 — Construir la superficie GEO/AI verificable

- **Owner:** GEO / SEO / Editorial.
- **Dependencias:** P0-01, P1-01.
- **Entregable:** decisión documentada sobre `llms.txt`/`llms-full.txt`, mapa de entidades, fuentes autoritativas y páginas de respuesta citable.
- **Debe hacer:** mantener sincronizados marca, autores, libros, apps, precios, fechas, canonical URLs y política editorial; registrar crawler output, consultas de prueba y citas/referrals cuando sean observables.
- **No debe hacer:** prometer ranking o citations, publicar statements de precio desactualizados ni ocultar pages en robots/sitemap sin una decisión.
- **Aceptación:** un crawler puede identificar oferta, precio, autor y respuesta sin ambigüedad; cada entidad tiene `source_url`, owner y `last_reviewed`.
- **Evidencia:** archivos live, mapa de entidades, 20 consultas reproducibles, registro de citations/referrals y revisión manual.

#### [ ] P1-03 — Convertir contenido existente en superficies de ingreso

- **Owner:** Editorial / SEO.
- **Dependencias:** P0-04, P0-05, P1-01, P1-02.
- **Entregable:** registry de clusters con intención, oferta, CTA, owner, baseline y target.
- **Debe hacer:** clasificar los artículos 800–1500; refrescar sólo los que tengan demanda, intent mismatch o potencial de venta; conectar cada money page con un libro, app u oferta reconciliada; revisar fuentes, author, date, updated y links.
- **No debe hacer:** publicar más volumen para superar contadores, enlazar a un producto incorrecto ni llamar calidad a un simple word count.
- **Aceptación:** cada cluster incluido tiene QA editorial, oferta/CTA válidos, owner y método para medir assisted conversion.
- **Evidencia:** content registry, export de queries, muestra revisada y before/after de engagement y revenue.

#### [ ] P1-04 — Implementar CRO controlado en landing pages y checkout

- **Owner:** Growth / Web.
- **Dependencias:** P0-03, P0-05, P0-06, P0-07.
- **Entregable:** experiment log con variantes de hero, oferta, pricing, proof, CTA, bundle, upsell, FAQ y checkout.
- **Debe hacer:** separar tráfico de artículo, direct y paid; alinear mensaje y oferta; medir cada paso; incluir móvil, decline, duplicate click, recovery y trust.
- **No debe hacer:** usar scarcity, testimonios o claims no demostrados, declarar ganador por CTR ni lanzar sin baseline y stop rule.
- **Aceptación:** cada experimento tiene hypothesis, primary metric, guardrail, muestra o criterio de decisión; conversion, AOV, refunds y net revenue se reportan juntos.
- **Evidencia:** experiment log, funnel report, screenshots, transaction QA y recomendación go/no-go.

#### [ ] P1-05 — Completar ASO y experimentación por app

- **Owner:** ASO / Android.
- **Dependencias:** P0-02, P0-09, P1-04.
- **Entregable:** listing QA y backlog de experimentos por app.
- **Debe hacer:** revisar title, short/long description, icon, screenshots, category, price, privacy/Data safety, release notes, rating prompt y deep links; ejecutar una hipótesis por app, métrica primaria, guardrail y fecha.
- **No debe hacer:** cambiar 12 listings en bloque, atribuir instalaciones a una campaña sin tracking o llamar revenue a installs.
- **Aceptación:** cada listing tiene baseline, owner, versión de screenshots, CTA verificable y review date; cada experimento tiene stop rule.
- **Evidencia:** listing export, experiment log, installs, purchase/upgrade, retention, refunds y review notes.

#### [ ] P1-06 — Diseñar captura y nurture de leads

- **Owner:** Lifecycle / Content.
- **Dependencias:** P0-06, P0-07, P0-08, P1-03.
- **Entregable:** lead magnet, landing, thank-you page y secuencias welcome/activation/segmentation.
- **Debe hacer:** elegir un magnet alineado con una oferta; definir signup → activation → purchase; medir cohorte, consent, unsubscribe y exit criteria.
- **No debe hacer:** blasts masivos, prometer un resultado que el producto no entrega ni capturar PII fuera de la base legal.
- **Aceptación:** cada email tiene trigger, goal, CTA, owner, exit criteria y suppression; la cohorte se puede consultar sin datos inventados.
- **Evidencia:** campaign IDs, landing QA, cohort report, delivery/open/click metrics y muestra de replies.

#### [ ] P1-07 — Construir dashboard de acquisition, revenue y cohorts

- **Owner:** Analytics / Growth.
- **Dependencias:** P0-04, P0-07, P1-01, P1-02, P1-05.
- **Entregable:** dashboard con source of truth, data dictionary, timezone y reconciliación mensual.
- **Debe hacer:** combinar GSC/Bing, organic assisted revenue, AI referrals/citations cuando sea observable, Play installs/purchases, email cohorts, affiliates, AOV, refunds y CAC.
- **No debe hacer:** sumar GA4 y Hotmart sin reconciliar IDs, llamar conversión a una sesión ni usar datos de schema como eventos.
- **Aceptación:** el dashboard se refresca, permite explicar Gap-to-5k por canal/oferta y entrega un export mensual auditable.
- **Evidencia:** dashboard URL o query reproducible, data dictionary, sample reconciliation y monthly close.

#### [ ] P1-08 — Pilotear partnerships y afiliados con tracking reversible

- **Owner:** Partnerships / Revenue.
- **Dependencias:** P0-03, P0-05, P0-07, P0-08.
- **Entregable:** registry de partners, newsletters, affiliates, offers, links, commissions y estados de payout.
- **Debe hacer:** definir commission, attribution window, threshold, disclosure, creative approval, refund reversal, tracking, link único y calendario de review.
- **No debe hacer:** pagar por clicks sin evidencia de compra, usar links archivados o entregar acceso sin acuerdo/disclosure.
- **Aceptación:** cada partner tiene Signed terms, link único, click event, conversion match, payout status y fecha de renovación.
- **Evidencia:** agreement/terms, link registry, attribution report, payout sample y prueba de reverso.

#### [ ] P1-09 — Validar pricing, AOV y retención

- **Owner:** Product / Revenue / Finance.
- **Dependencias:** P0-04, P0-05, P1-04, P1-06, P1-08.
- **Entregable:** decision memo de pricing, bundle, cross-sell, upsell, reorder/renewal y refund threshold.
- **Debe hacer:** comparar bundle vs individual, medir elasticity cuando haya muestra suficiente, calcular contribution margin y recalcular Gap-to-5k.
- **No debe hacer:** cambiar precio global por una semana de tráfico, esconder fees o llamar retention a una métrica de visitas.
- **Aceptación:** margin, AOV, refund, repeat/retention y baseline/target están explícitos; el escenario tiene supuestos trazables.
- **Evidencia:** price experiment o cohort analysis, contribution model y decisión aprobada.

#### [ ] P1-10 — Construir trust y social proof verificable

- **Owner:** Product / Editorial.
- **Dependencias:** P0-06, P1-03, P1-04.
- **Entregable:** proof registry con authorship, editorial policy, authorized testimonials, case studies, screenshots, samples y customer FAQ.
- **Debe hacer:** pedir permiso, fechar, atribuir y distinguir experiencia propia de testimonio; alinear claims con privacy, refund y terms.
- **No debe hacer:** fabricar reviews, citas, awards, resultados o scarcity.
- **Aceptación:** cada proof tiene source, date, approval, scope y review date; ningún claim queda sin evidencia.
- **Evidencia:** proof registry, autorizaciones, links live y revisión editorial fechada.

---

### P2 — Escala, diversificación y eficiencia (días 46–90)

#### [ ] P2-01 — Escalar clusters SEO de alta intención

- **Owner:** SEO / Editorial.
- **Dependencias:** P1-03, P1-07.
- **Entregable:** backlog de 3–5 clusters priorizados por revenue potential, no por número de palabras.
- **Debe hacer:** seleccionar queries transaccionales, actualizar páginas existentes, link internally, añadir proof y medir assisted revenue.
- **No debe hacer:** crear páginas sin demanda, duplicar keywords en paths o comprar backlinks.
- **Aceptación:** cada cluster tiene target de ranking, CTR, assisted revenue, owner y review date.
- **Evidencia:** GSC before/after, content registry, backlink report y revenue attribution.

#### [ ] P2-02 — Ejecutar digital PR y link earning ético

- **Owner:** Partnerships / Editorial.
- **Dependencias:** P1-08, P2-01.
- **Entregable:** prospect list, outreach assets, quality criteria y backlink log.
- **Debe hacer:** priorizar recursos y audiencia relevantes; evaluar follow/nofollow, relevancia, editor y fecha; medir referral y assisted revenue.
- **No debe hacer:** PBNs, link exchanges masivas, anchor text manipulative o guest posts sin disclosure.
- **Aceptación:** cada backlink tiene URL, editor, follow/nofollow, relevance, fecha, approval y resultado.
- **Evidencia:** prospect tracker, outreach log, link audit y referral report.

#### [ ] P2-03 — Evaluar expansión o salida de apps del portfolio

- **Owner:** Product / ASO.
- **Dependencias:** P0-02, P0-09, P1-05, P1-09.
- **Entregable:** business case por app para invertir, mantener, mejorar o retirar.
- **Debe hacer:** comparar effort, CAC, installs, retention, ARPDAU, uninstalls, reviews, soporte y maintenance cost; definir kill criteria.
- **No debe hacer:** lanzar una app para llenar catálogo o inflar el número de apps.
- **Aceptación:** cada app tiene decisión, owner, budget, review date y métrica que justifica la siguiente acción.
- **Evidencia:** Play metrics, cohort report, cost ledger y memo de decisión.

#### [ ] P2-04 — Habilitar paid acquisition sólo con unit economics

- **Owner:** Growth / Finance.
- **Dependencias:** P0-05, P0-06, P0-07, P1-04, P1-05, P1-07, P1-09.
- **Entregable:** test plan de Meta/Google con budget cap, creative matrix, landing variants, consent y kill rule.
- **Debe hacer:** probar una oferta y un canal a la vez; validar IDs, conversion values, spend reconciliation, frequency cap, contribution margin y payback.
- **No debe hacer:** aumentar budget sin margen, sin consent, sin tracking o sin medir refunds.
- **Aceptación:** p95 tracking match, CPA/CAC ceiling, payback rule, budget cap y stop condition están documentados; escala sólo con cohortes verdes.
- **Evidencia:** campaign IDs, spend/click/conversion report, net revenue attribution y decision log.

#### [ ] P2-05 — Probar membresía, Inner Circle o acceso recurrente

- **Owner:** Product / Lifecycle / Finance.
- **Dependencias:** P0-05, P1-06, P1-09.
- **Entregable:** propuesta de oferta recurrente con precio, beneficios, billing, cancelación, refund, contenido y retention plan.
- **Debe hacer:** validar con cohort actual; definir activation, trial → paid, churn, expansion, payback y delivery calendar.
- **No debe hacer:** llamar suscripción a un pago único, prometer contenido inexistente o lanzar sin soporte de cancelación.
- **Aceptación:** margen, billing, cancellation, refund, content calendar y target de retención están documentados.
- **Evidencia:** offer page, checkout test, cohort report y feedback de clientes.

#### [ ] P2-06 — Probar expansión multi-idioma o de segmentos

- **Owner:** Growth / Product.
- **Dependencias:** P1-01, P1-03, P1-07.
- **Entregable:** test de un mercado prioritario con landing, legal, support, pricing y analytics localizados.
- **Debe hacer:** elegir idioma/segmento por demanda; mantener canonical/hreflang correcto; medir conversión, CAC, refund y carga de soporte.
- **No debe hacer:** traducción automática sin revisión, duplicar páginas sin señal o prometer soporte no disponible.
- **Aceptación:** el test tiene mercado, owner, presupuesto, ventana de medición, legal QA y decisión de escalar/parar.
- **Evidencia:** market decision, localized QA, funnel report y learning memo.

#### [ ] P2-07 — Automatizar operaciones, alertas y cumplimiento

- **Owner:** DevOps / Automation.
- **Dependencias:** P0-07, P0-08, P0-10.
- **Entregable:** runbooks de deploy, rollback, webhook failure, payment mismatch, consent breach, listing takedown y content revert.
- **Debe hacer:** definir owner/on-call, threshold, severidad, retry/backoff, dead-letter, log retention, backup, rollback y drill; separar secrets por environment.
- **No debe hacer:** exponer secrets en HTML, workflows, docs o logs ni depender de una sola persona.
- **Aceptación:** cada alerta tiene threshold, severidad, destinatario, runbook y prueba; un tabletop exercise cierra con acciones.
- **Evidencia:** runbooks, alert test, access review, backup/restore test y postmortem del drill.

#### [ ] P2-08 — Convertir learnings en decisiones de portfolio

- **Owner:** Founder / Revenue / Finance.
- **Dependencias:** P1-07, P1-09, P2-03, P2-04.
- **Entregable:** dashboard ejecutivo mensual con Gap-to-5k, contribution margin, retention, cash collection y decisión de inversión.
- **Debe hacer:** separar revenue, margen, collection, retention y forecast; asignar budget al canal con mejor payback; registrar stop/scale decisions.
- **No debe hacer:** usar sesiones, followers, installs o artículos como sustitutos de cash collected.
- **Aceptación:** el dashboard responde qué canal aporta US$5.000, qué margen deja, qué riesgo tiene y qué tarea se cancela.
- **Evidencia:** monthly close, forecast versionado y decision log con owner/fecha.

---

## 5. Blueprint atómico por canal

### Blueprint SEO

1. **Superficie:** elegir el conjunto canónico de URLs y excluir drafts, redirects, duplicates y retired pages.
2. **Indexabilidad:** verificar status HTTP, canonical, robots, sitemap, noindex y reciprocidad hreflang.
3. **Entidad:** clusters por intención, author/editorial policy, breadcrumbs, fuentes, `updated` y links internos.
4. **Conversión:** cada money page tiene oferta reconciliada, CTA trackeado, fallback y owner.
5. **Performance:** corregir imágenes, dimensiones, lazy loading, scripts de terceros y budgets de Core Web Vitals.
6. **Medición:** GSC/Bing, index coverage, CTR, posición, backlinks y organic assisted revenue.
7. **Cadencia:** refresh queue priorizada por demanda, intent mismatch, stale claims y revenue potential, no por word count.

### Blueprint GEO / AI Search

1. **Fuente machine-readable:** mantener `llms.txt` sólo si tiene purpose; decidir `llms-full.txt`, feed de cambios y política de freshness.
2. **Entidad consistente:** sincronizar marca, autores, productos, precios, fechas, canonical URLs y JSON-LD.
3. **Respuesta citable:** definiciones, FAQs, comparativas, tablas y fuentes primarias; no assertions de precio sin fuente.
4. **Prueba:** crawler logs, set de consultas, fecha, proveedor de AI y citas/referrals cuando sean observables.
5. **Governance:** cada actualización de oferta o precio actualiza la superficie completa o marca el estado stale.
6. **Límite:** citations o rankings de AI no son promesa ni KPI de vanidad; se reportan como observación.

### Blueprint ASO

1. **Catálogo:** mantener la matriz local de 12 páginas frente a 12 ofertas y validar todos los package IDs contra Play Console.
2. **Listing:** icono, title, descriptions, screenshots, categoría, price, privacy/Data safety, rating y release notes.
3. **Distribución:** deep links, web, email, bots y ads deben usar el mismo package ID.
4. **Experimentos:** una hipótesis, una app, una métrica primaria, una guardrail y una fecha.
5. **Revenue:** Play purchase, upgrades, ARPDAU, retention, refunds y uninstalls; installs no son ingresos.
6. **Cadencia:** cada app tiene owner, review date, baseline y decisión invest/hold/retire.

### Conversión / checkout

1. **Offer architecture:** producto principal, bundle, anchor, order bump, cross-sell, flash y membership con `net_price`.
2. **Message match:** artículo, ad, email y deep link llevan a la misma promesa y oferta.
3. **Trust:** proof real, refund, terms, privacy, payment y support antes del CTA final.
4. **Checkout:** mobile, decline, duplicate click, idempotencia, recovery y transactional reconciliation.
5. **CRO:** hypothesis, baseline, primary metric, guardrail, sample/criterio y decisión; no gana el CTR solo.

### Contenido / editorial

1. **Quality gate:** intent, factual support, author, date, updated, originality, readability, links y CTA.
2. **Money map:** cada cluster se conecta a una oferta, una siguiente acción y un owner.
3. **Refresh queue:** los artículos 800–1500 se clasifican por demanda, intent, links y potencial de venta.
4. **No volume-first:** más páginas sólo después de que el sistema existente genere assisted conversions.
5. **Governance:** `docs/thin-articles-progress.md` es un reporte de umbral, no evidencia de calidad.

### Email / CRM

1. **Consent:** opt-in, purposes, unsubscribe, suppression, preference center y withdrawal.
2. **Automation:** welcome, activation, browse/cart, post-purchase, cross-sell y winback; cada uno con trigger y exit criteria.
3. **Integration:** Hotmart/Make/MailerLite/Play con IDs reales, retries, idempotencia y logs.
4. **Revenue:** recovered revenue, incremental revenue, unsubscribe, spam complaint y margen.
5. **Governance:** una spec o un dashboard no es una automatización activa.

### Analytics / attribution

1. **Event contract:** nombre, trigger, required params, owner, política de PII y test.
2. **Source of truth:** GA4/Tag Manager y exports de Hotmart/Play; reconciliación mensual.
3. **Dashboard:** funnel, revenue, AOV, refund, CAC, organic, email, affiliate, app y cohort.
4. **Consent:** tracking y ads respetan reject/accept; no PII en URLs ni event names.
5. **Cadencia:** anomalía diaria, funnel semanal, cierre financiero mensual y revisión de catálogo.

### Legal / trust

1. **Pages:** privacy, terms, cookies, refund, disclaimer, affiliate disclosure y privacy por app.
2. **Consent:** default, reject, accept, withdrawal y vendor/data-flow inventory.
3. **Claims:** garantía, refund, “gratis”, resultados, awards y testimonials necesitan source.
4. **Data:** retención, deletion, processors, transfers y requests.
5. **Review:** owner legal identificado y fecha; el repositorio no sustituye asesoría jurídica.

### Operations / reliability

1. **Deploy:** commit → CI → staging → smoke → production → rollback documentado.
2. **Secrets:** GitHub, hosting, MailerLite, Hotmart, Play y analytics separados por environment; nunca en HTML.
3. **Monitoring:** uptime, broken CTA, 404/5xx, webhook failures, payment mismatch y consent errors.
4. **Runbooks:** owner, severidad, threshold, respuesta, comunicación y postmortem.
5. **Change control:** toda edición de precio, oferta, legal, tracking o catálogo queda registrada.

### Partnerships / affiliate

1. **Registry:** partner, audience, offer, commission, attribution window, link, creative, disclosure y payout.
2. **Validation:** link real, coupon real, evento real y reverso documentado.
3. **Economics:** EPC, conversion, refund, commission y payback; no pagar sólo por clicks.
4. **Compliance:** disclosure, contrato, privacy, tax y acceso mínimo a datos.
5. **Escalation:** cada partner tiene renewal date y replacement plan.

---

## 6. Quick wins ejecutables, en este orden

Estos son pending work items, no tareas ya completadas:

1. **P0-01:** **cerrado.** La superficie canónica quedó declarada en `docs/canonical-asset-inventory.md` v1.2.0 y verificada contra HEAD `f219f9d` el 2026-09-25: se adoptó el conjunto **HTML rastreado y gobernado (568 archivos)** como superficie pública canónica, con el working set de 569 y el filesystem de 622 registrados por separado. La discrepancia histórica 524/577 y el estado 529/582 quedan resueltos en §2.1 del ledger como tres snapshots de un invariante (delta 53 constante), no como una contradicción. Lo que queda no es local: la decisión de owner sobre los 15 archivos rastreados que el set excluido considera fuera de alcance pero que GitHub Pages sí publica, y la reparación del canonical de `blog/witchcraft-for-beginners-guide.html`.
2. **P0-02:** la reconciliación local de 12 páginas ↔ 12 ofertas ya fue documentada; falta Play Console para cerrar el estado externo.
3. **P0-03:** los placeholders de Hotmart ya se retiraron de los CTA públicos y las páginas quedaron bloqueadas; faltan IDs Hotmart reales y smoke de checkout para cerrarlo.
4. **P0-04:** reconstruir el cierre de 30 días y calcular Gap-to-5k con cobros, refunds, fees y comisiones.
5. **P0-05:** crear la tabla de `net_price` y seleccionar la oferta que puede cobrar más cerca del objetivo.
6. **P0-06:** publicar/enlazar legal y consent antes de capturar leads o activar tracking publicitario.
7. **P0-07:** lo local ya existe — `data/analytics-events.json` declara 19 eventos con `privacy`, `enforcement` y `value_buckets`; `js/analytics-bridge.js` los une al DOM con allowlist y consentimiento; y `scripts/analytics/test/analytics-bridge.test.mjs` fija el contrato con 385 líneas de pruebas. Lo que falta es **ejecutar** el smoke contra GA4 real con credenciales (`scripts/analytics-live-smoke.js`), observar un consent reject real, capturar los debug logs de GA4 y reconciliar un `purchase` con la transacción. Hasta que eso pase, ningún evento está probado como entregado.
8. **P0-08:** ejecutar un flujo de compra y uno de recuperación; guardar IDs, logs y timestamps.
9. **P0-09/P0-10:** verificar listing y hacer release smoke test antes de cualquier campaña.
10. **P1-03/P1-04:** seleccionar los primeros clusters y un solo experimento de hero/CTA sobre una oferta verificada.
11. **P1-07:** producir el primer dashboard semanal de revenue/funnel con reconciliación manual Hotmart/GA4/Play.
12. **P1-08:** limitar partnerships a un piloto con disclosure, link único y payout reversible.

---

## 7. Evidencia mínima por workstream

- **Fuente de verdad:** URLs, apps, offers, precios, checkout, owners y estados con fecha.
- **Catálogo:** export Play ↔ `offers.json` ↔ páginas web con package IDs y estado de listing.
- **Finanzas:** export de cobros, refunds, fees, impuestos, comisiones, net price y Gap-to-5k.
- **Legal:** páginas públicas, consent accept/reject/withdrawal, vendor/data-flow matrix y claims review.
- **Analytics:** event dictionary, payloads sanitizados, debug logs, attribution y reconciliation report.
- **CRM:** automation IDs, audiences/tags, webhook logs, retries, dead-letter y test de idempotencia.
- **SEO:** GSC/Bing, index coverage, canonical/hreflang, rich-results, Lighthouse, CWV y before/after.
- **GEO:** archivos live, entity map, crawler output, 20 consultas, citations/referrals y `last_reviewed`.
- **Contenido:** registry con intent, offer, CTA, quality score, owner y revenue attribution.
- **ASO:** listing export, screenshots, experiments, installs, purchase/upgrade, retention, refunds y reviews.
- **Operaciones:** CI, deploy, smoke, rollback, uptime, alert test, backup/restore y postmortem.
- **Partnerships:** agreements, disclosure, link registry, attribution, payout ledger y renewal date.

No se acepta un artefacto sin `owner`, `created_at`, `last_verified_at`, `source`, `scope`, `commit/deployment` cuando aplique y `known_limitations`.

---

## 8. Acceptance gates globales

Una tarea sólo pasa a `DONE` si:

- sus dependencias están cerradas con evidencia;
- el entregable existe donde se espera y tiene owner;
- el comando o smoke test pasa con código de salida registrado;
- el impacto en revenue, funnel, SEO/GEO/ASO o riesgo queda anotado;
- no introduce placeholders, PII, secrets ni errores de runtime/tipo;
- la superficie canónica y el commit están identificados;
- existe una fecha para volver a medir;
- el working tree conserva los cambios ajenos preexistentes.

Reglas de rechazo:

- una tarea externa no pasa por tener una spec; requiere URL/ID real y evidencia de ejecución;
- una tarea de contenido no pasa por superar 800 palabras;
- una tarea SEO no pasa por tener JSON-LD válido;
- una tarea ASO no pasa por tener AAB/APK;
- una automatización no pasa por tener JSON, dashboard URL o documento;
- una campaña no pasa por tener impressions, clicks o installs sin purchase/net attribution.

---

## 9. Stop conditions y escalamiento

Detener una campaña, bot, ad, publicación o checkout si:

- el checkout no tiene URL real o falla el smoke test;
- el package ID no coincide con la app esperada;
- no se puede distinguir click de purchase;
- el consent reject no funciona;
- el precio neto, refund o comisión no está reconciliado;
- el legal owner no aprueba claim o página;
- el tracking duplica, falla o expone PII;
- el deploy tiene 5xx, CTA roto o pérdida de datos;
- una app/listing cambia de estado sin actualizar el catálogo.

Escalar a `Revenue + Web + Legal/Privacy` cualquier leakage de secret, checkout roto, paquete incorrecto, complaint de consentimiento o discrepancia de pago. Escalar a `ASO + Product + Finance` cualquier rechazo de listing, mezcla de package, caída de retention o margin negativo. El objetivo de escalar es preservar confianza, margen y capacidad de medir.

---

## 10. Definición final de “US$5.000/mes”

La meta se considera cumplida sólo cuando, durante un mes cerrado:

1. el brute revenue, net collected y contribution margin están reconciliados con Hotmart, Play, pagos y otras fuentes;
2. refunds, chargebacks, fees, impuestos/withholding y commissions están descontados;
3. el dashboard muestra source, offer, campaign, cohort y timestamp;
4. no depende de un placeholder, una app no publicada, una automatización no probada o un documento sin evidencia;
5. al menos un playbook de adquisición, entrega, recuperación y medición puede repetirse sin reconstruir el sistema;
6. existe un plan de contingencia si el canal principal cae y un owner responsable de ejecutarlo.

**Orden de ejecución:** catálogo y checkout → baseline financiero y oferta neta → legal/consent → tracking → CRM/webhooks/listing → release smoke → CRO/SEO/GEO/ASO/partnerships → paid scale sólo con unit economics.

## 11. Estado de ejecución local y blockers (2026-09-24)

Esta tabla registra la evidencia local sin convertir artefactos en producción. `IN_PROGRESS` significa que existe trabajo local reproducible pero falta una parte del gate. `BLOCKED` significa que la siguiente evidencia depende de un sistema o owner externo. No se marca ningún bloque como `DONE`.

| Tarea | Estado | Evidencia local actual | Evidencia externa que falta |
|---|---|---|---|
| P0-01 | `DONE` | `docs/canonical-asset-inventory.md` **v1.2.0**, re-verificado 2026-09-25 contra HEAD `f219f9d` con árbol limpio: superficie canónica **568** HTML rastreados, working set gobernado **569**, filesystem **622**, delta de exclusión **53** verificado con cero deriva en ambas direcciones; `python scripts/verify_tech_debt.py` confirma 569 de forma independiente; sitemap 532 con SHA-256 `574d3a1d…`; 0 archivos sin tag canonical y **1 canonical con origen equivocado** detectado y documentado | Decisión de owner sobre los **15 archivos rastreados dentro del set excluido que GitHub Pages sí publica**; decisión sobre `checklist-ventas.html`, página gobernada que `.gitignore:33` impide publicar; reparación del canonical de `blog/witchcraft-for-beginners-guide.html` (§6.1 del ledger: host `www.` equivocado y path sin `.html`) |
| P0-02 | `BLOCKED` | Matriz local de 12 apps y `offers.json` | Export de Play Console, listing URLs, screenshots y estados por app |
| P0-03 | `BLOCKED` | CTAs sin placeholders; páginas bloqueadas sin inventar IDs | IDs Hotmart reales, apertura de checkout y transacción de prueba |
| P0-04 | `BLOCKED` | Ningún número financiero inventado; fórmula documentada | Exports Hotmart/Play/pagos, refunds, fees, impuestos y commissions |
| P0-05 | `BLOCKED` | Estructura de `net_price` pendiente de datos | Cierre financiero y decisión de oferta aprobada |
| P0-06 | `IN_PROGRESS` | Cinco borradores legales, matriz vendor, footer, consent denied local y sitemap | Owner legal, revisión fechada y pruebas accept/reject/withdrawal en producción |
| P0-07 | `IN_PROGRESS` | `docs/event-contract.md` + 8 pruebas de comportamiento de GA4/webhook; **HEAD `88754bc`**: `data/analytics-events.json` con 19 eventos (`privacy`, `enforcement`, `value_buckets`), `js/analytics-bridge.js` (344 líneas) con allowlist y consentimiento, `scripts/analytics/test/analytics-bridge.test.mjs` (385 líneas) y los scripts `analytics-daily.js` / `analytics-health.js` / `analytics-live-smoke.js` | Consent reject real, debug logs GA4 y reconciliación de purchase con plataformas — el smoke con credenciales nunca se ejecutó contra GA4 real, así que ningún evento está probado como entregado |
| P0-08 | `BLOCKED` | Especificaciones y seams de webhook/CRM | IDs/endpoints MailerLite/Make, logs, idempotencia y flujo de unsubscribe en vivo |
| P0-09 | `BLOCKED` | 12 package IDs y URLs Play locales | Export de Play Console, listing público y Data safety por app |
| P0-10 | `IN_PROGRESS` | `npm test` y `npm run build` pasan (38 pytest + 229 Vitest en 11 archivos); thin report 467/467; tech debt 0 errores sobre 569 páginas. **Smoke del dominio real ejecutado 2026-09-25** (HTTPS `GET` de solo lectura contra `https://cha0smagicklabs.com`): las **568 URLs canónicas responden 567 `200` directo + 1 vía `301` desde `www`, con 0 `404` y 0 inalcanzables**; `robots.txt` declara el sitemap; el sitemap servido tiene 532 entradas idénticas al local; el reparto 15/38 del set excluido queda confirmado en producción (15 rastreados → `200`, 38 no rastreados → `404`); `checklist-ventas.html` → `404`, confirmando que gitignore impide su despliegue. **Consentimiento verificado con navegador real 2026-09-25** vía `scripts/analytics/consent-browser-test.mjs` (Puppeteer, Chrome 151) contra el dominio desplegado: **PASS, exit 0, 30 checks, 0 fallos, 0 inconclusos**; control negativo (URL inexistente) devuelve **INCONCLUSIVE, exit 2** por `HTTP 404`, lo que prueba que el test es capaz de fallar. Medido: primera visita sin cookie → `isConsentGranted()=true` y el primer `gtag('consent','update')` es `granted`; Decline → cookie `declined` + update `denied` en los 4 campos + `isConsentGranted()=false` + `track('tool_start')` rechazado, estable tras recarga; Accept → espejo con `track()` aceptado. ID de GA4 capturado: `G-V6LHCPN9TK`. **Lighthouse ejecutado 2026-09-25** vía `scripts/analytics/lighthouse-audit.mjs` (`lighthouse@13.5.0` instalado como devDependency) con Chrome real vía Puppeteer: **móvil FAIL exit 1** (LCP 2210 ms OK, CLS 0.000 OK, **TBT 216 ms** por encima del umbral; performance 93) y **desktop FAIL exit 1** (**LCP 2769 ms** y **CLS 0.961**; performance 45), con `accessibility` 91, `best-practices` 96 y `seo` 100 estables en todas las corridas. El CLS de escritorio se reprodujo en 4 corridas (0.961 / 1.115 / 0.932 / 0.920) mientras el móvil mide 0.000 exacto. Control negativo → **INCONCLUSIVE exit 2** por `HTTP 404` | La rama de **withdrawal** del consentimiento (sin banner) no está cubierta por el test; confirmación en **GA4 DebugView** de que el `denied` evita el envío (o de que no lo evita) — el test solo prueba el lado cliente, nunca la ingesta; **datos de campo de CWV**: PageSpeed Insights sin API key devolvió `HTTP 429` con `limit 'Queries per day'` y `"quota_limit_value": "0"` — **cuota diaria cero, bloqueo duro, no transitorio**; reintentar no puede funcionar y sin tráfico suficiente tampoco habría CrUX, así que `cwvComplete:false` y **INP sigue sin medirse** (es immeasurable en laboratorio). Obtener CWV de campo **exige un proyecto de Google Cloud con API key y la API de PageSpeed Insights habilitada**: acción de owner, no reintento; **TBT de móvil** entre 216 y 236 ms según la corrida, justo sobre el umbral de 200 ms (borderline, no estable); **causa raíz del CLS de escritorio sin confirmar** — la atribución por elemento no devolvió datos y el trabajo corresponde a P1-01; los 5 directorios sin landing page (`/apps/`, `/books/`, `/landing-pages/`, `/lead-magnet/`, `/pages/` → `404`); decisión de owner sobre los 15 artefactos de demo/campaña publicados en el dominio de ingresos; CTA/checkout externos |
| P1-01 | `IN_PROGRESS` | `docs/seo-remediation-report.md` documenta la remediación de 2 descriptions, 9 hreflang y 10 canonical; `verify_tech_debt.py` queda en 0 errores | Revisión manual de 180 missing alt/270 empty alt, heading skips, GSC/Bing, Rich Results, Lighthouse field y before/after |
| P1-02 | `IN_PROGRESS` | `docs/geo-surface-decision.md` v1.0.0; decisión de no publicar `llms-full.txt` automáticamente, campos de entidad y 20 queries propuestas | Aprobación de owner, mapa live completo, crawler output, 20 respuestas y citas/referrals |
| P1-03 | `IN_PROGRESS` | `docs/content-registry.md` cubre los 151 archivos modificados; la cola thin está cerrada y clasificada por reglas | Enriquecer intent/oferta/CTA por fila, query evidence, owner de cada cluster y assisted revenue |
| P1-04 | `BLOCKED` | No hay experimento CRO activo | Checkout real, net price, baseline, experiment log y QA de conversión |
| P1-05 | `BLOCKED` | No hay listing claims inferidas desde artefactos | Play Console, experiments, installs, purchase/upgrade, retention y reviews |
| P1-06 | `BLOCKED` | No se inventan automatizaciones ni PII | Campaign IDs, consent, cohortes, delivery/unsubscribe y reports |
| P1-07 | `BLOCKED` | Event contract y data dictionary local | Dashboard live, exports Hotmart/Play/GA4, cohortes y monthly close |
| P1-08 | `BLOCKED` | No se generan acuerdos ni payouts ficticios | Signed terms, link registry, attribution, payout sample y reverso |
| P1-09 | `BLOCKED` | No hay precio neto ni elasticity inventada | Pricing experiment/cohort, refunds, AOV, retention y Finance approval |
| P1-10 | `BLOCKED` | No se agregan testimonios, awards ni social proof falsos | Authorized proof registry, fechas, atribución, links live y policy approval |
| P2-01 | `PENDING` | No se escala por word count | GSC, demanda, clusters priorizados y assisted revenue |
| P2-02 | `PENDING` | No backlinks campaigns fabricated | Prospect list, outreach, editorial approval, backlink log y referral report |
| P2-03 | `PENDING` | Catálogo no se usa para inflar portfolio | Play metrics, cohort report, cost ledger y business case por app |
| P2-04 | `PENDING` | No paid scale launched | Unit economics, ad IDs, spend reconciliation, budget cap y stop rule |
| P2-05 | `PENDING` | No se confunde one-time con subscription | Billing, benefits, cancellation, refund, cohort y retention |
| P2-06 | `PENDING` | No se añade traducción automática sin QA | Market decision, localized legal/support/pricing y funnel report |
| P2-07 | `PENDING` | No hay Runbooks/alertas implementados | Runbooks, thresholds, alert test, backup/restore y tabletop drill |
| P2-08 | `PENDING` | No se crea dashboard ejecutivo ficticio | Monthly close, contribution margin, forecast versionado y decision log |
| B-011 / 3.4.1 | `IN_PROGRESS` | `docs/thin-articles-progress.md` y `docs/content-registry.md` cubren la cola local | Enriquecer intent/offer/CTA por cluster, sample QA y revenue attribution |

**Comandos de verificación local ejecutados el 2026-09-24:**

- `python scripts/thin_articles_report.py` → 0 pending, 0 expand, 467 done; exit 0.
- `python scripts/verify_tech_debt.py` → **569 páginas escaneadas, 563 con JSON-LD, 0 validation errors**; imágenes total=4183 (lazy=68, sized=412, webp=9, raster=452); entidades JSON-LD: Article=467, BreadcrumbList=479, FAQPage=421, HowTo=314, **WebApplication=61**, SoftwareApplication=12, Product=36, QAPage=6, Book=7, WebPage=6, CollectionPage=2, Organization=2, WebSite=1, DefinedTermSet=1; exit 0.
- `npm test` → **38 pytest passed + 229 Vitest passed en 11 archivos**; exit 0.
- `npm run build` → exit 0.
- `node scripts/accessibility-audit.js` → 0 violaciones, pero con advertencia de CSS remota y errores de contexto `window/document`; no se usa como evidencia de producción.
- `git diff --check` → exit 0.

**Correcciones de baseline aplicadas el 2026-09-24 al comparar contra HEAD `88754bc`:** el conteo de páginas del auditor es **569**, no 529 (529 era el conteo del ledger `canonical-asset-inventory.md`, verificado contra HEAD `751985d`); y la suite es de **229 Vitest en 11 archivos**, no 196. Ambas cifras anteriores en este documento estaban desactualizadas y se sustituyeron por las observadas.

**Segunda corrección de baseline, 2026-09-25 (P0-01 cerrado):** el ledger pasó a v1.2.0 y sus cifras se sustituyeron por las medidas —622 filesystem, 569 gobernados, **568** de superficie canónica rastreada, sitemap **532**—, verificadas contra HEAD `f219f9d` con 19 comprobaciones independientes. La frase anterior de que el ledger "sigue necesitando re-verificación" queda **superada**. Se añadió además el matiz que faltaba: el set de 53 exclusiones es un límite de alcance gobernado, no una garantía de no publicación, porque 15 de esos archivos están rastreados y GitHub Pages sí los sirve.

**Estado de este documento:** `PENDING`/`IN_PROGRESS`/`BLOCKED` según la tabla anterior; ningún bloque P0, P1 o P2 se considera `DONE` hasta que exista la evidencia externa y de gate indicada.
