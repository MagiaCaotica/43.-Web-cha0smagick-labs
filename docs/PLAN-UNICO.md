# PLAN ÚNICO — Cha0smagick Labs

> **Este es el único plan que se sigue.** Absorbe el backlog del antiguo
> `MASTER_EXECUTION_PLAN.md` y los planes de venta, SEO/funnel, legal, MailerLite,
> tráfico y Telegram. Los absorbidos se borraron (histórico en `git log`).
> Los planes ya completados están en [`plans-completados.md`](plans-completados.md).

**Cómo se usa:** cada tarea es atómica, tiene un único responsable y una
condición de aceptación verificable. Se marca `[x]` en este mismo fichero cuando
está hecha, y se anota la evidencia (fichero, commit, captura o URL).
Nada se da por hecho sin evidencia en producción: **un fichero local no prueba
que algo funcione en vivo.**

---

## 0. Puertas externas (bloquean casi todo lo demás)

Estas acciones dependen de una credencial o de una plataforma externa. **No se
pueden hacer desde el repo.** El detalle exacto de cada una (dónde, qué se pide,
qué se necesita de vuelta) está en [`OWNER-MANUAL-CHECKLIST.md`](OWNER-MANUAL-CHECKLIST.md).

| # | Puerta | Bloquea | Qué hace falta |
|---|---|---|---|
| G1 | **IDs de Hotmart** de Complete Access y Flash Sale | P0-03, P0-04, P0-05 | la lista `producto → URL de checkout`, verificada abriendo cada URL |
| G2 | **Transacción de prueba** + refund en Hotmart | P0-03, P0-05 | ID de transacción, marca de tiempo y confirmación del refund |
| G3 | **CSV financieros crudos** de Hotmart | P0-04, P0-05 | los CSV sin editar, para calcular el neto real |
| G4 | **GA4: comprobar que los eventos llegan** | P0-07, P1-07 | acceso a la propiedad; hoy hay 19 eventos instrumentados y ninguno ha llegado nunca |
| G5 | **Service account / app OAuth en GCP** para GSC | P1-01, P2-01 | el token de GSC muere cada 7 días sin esto |
| G6 | **MailerLite**: grupos,forms y automatizaciones | P0-08 | API key válida (**la de `.env` devuelve 401**), grupos `leads-es`/`leads-en`/`compradores` |
| G7 | **Hotmart → MailerLite/GA4 webhook** | P0-08 | el comprador no entra a la lista de email sin esto |
| G8 | **Meta Pixel ID y Google Ads ID** | P2-04 | rellenar los `PONER_..._AQUI` de `js/conversion.js` |
| G9 | **Play Console**: listings, precio real por país, disponibilidad | P0-09, P1-05 | verificación por app |
| G10 | **Código promo de Google Play** | campaña de email | para que la app gratis sea inmediata; hoy el email la pide por respuesta |
| G11 | **Añadir el bot de Telegram** a `@magiacaotica` y a los dos grupos | Telegram | 1 acción por destino; después el bot publica solo |
| G12 | **Consentimiento legal** (matriz de proveedores) | P0-06 | decidir y firmar los 9 puntos de la matriz legal |

---

## Fase A — Desbloqueo de oferta, confianza y medición (días 0–14)

Sin esto, las fases siguientes no se pueden medir ni cerrar.

### [x] P0-01 — Congelar la superficie canónica y el ledger de evidencia — DONE 2026-09-25 (`docs/canonical-asset-inventory.md` v1.2.0, HEAD `f219f9d`)

- **Responsable:** Revenue Ops / Web.
- **Depende de:** ninguna.
- **Entregable:** inventario versionado de URLs públicas, páginas, apps, offers, package IDs, precios, checkout, owners y estado.
- **Debe hacer:** elegir tracked/public o filesystem como superficie canónica; listar cada URL como live, draft, noindex, retired o pending; registrar fecha, commit, fuente y responsable.
- **No debe hacer:** cambiar precios, publicar URLs, borrar páginas o corregir el working tree preexistente como parte de esta tarea.
- **Aceptación:** cada activo tiene un `asset_id`, una URL canónica, un owner, un estado y una fecha de verificación; las discrepancias históricas 524/577 y el estado actual 529/582 quedan resueltos o explícitamente excluidos.
- **Evidencia:** archivo de inventario, export de URLs, commit y `git status` que pruebe que los cambios ajenos siguen intactos.

### [ ] P0-02 — Reconciliar catálogo de apps, páginas y Play

- **Responsable:** ASO / Android.
- **Depende de:** P0-01.
- **Entregable:** matriz `app slug → nombre → package ID → Play URL → precio → estado → listing URL → owner`.
- **Debe hacer:** mantener reconciliada la matriz local de 12 páginas de `apps/` con las 12 entradas de `offers.json`; resolver y verificar externamente `noctem-tools`, duplicados/variantes, precios, URLs y todos los package IDs; separar build, submission, testing, live y retired.
- **No debe hacer:** inventar una URL, cambiar el nombre comercial o publicar un paquete bajo un package ID distinto sin aprobación.
- **Aceptación:** cada página y oferta tiene un estado único; cada oferta live tiene una URL de Play verificable; el bot y las páginas no apuntan a productos diferentes.
- **Evidencia:** matriz, export de Play Console, comparación reproducible con `offers.json` y screenshots de cada CTA.

### [ ] P0-03 — Resolver rutas de venta y placeholders de Hotmart

- **Responsable:** Revenue / Web.
- **Depende de:** P0-01.
- **Entregable:** registro de oferta con URL de checkout real por producto y decisión explícita para cada página no vendible.
- **Debe hacer:** mantener las dos páginas sin href placeholder y con estado `BLOCKED_EXTERNAL_ID`; obtener y verificar los IDs reales de Complete Access y Flash Sale; verificar `V107097103W`; revisar `complete-access`, `flash-sale`, `books-bundle`, `apps-bundle` y CTAs de libros y apps.
- **No debe hacer:** inventar IDs, mandar a un checkout roto, tratar una colección de Play como checkout de un bundle ni ocultar una oferta no disponible.
- **Aceptación:** cada página live contiene una URL real, sandbox explícito o estado de retirada; cada oferta live tiene prueba de apertura y, cuando aplique, transacción de prueba.
- **Evidencia:** matriz local en `docs/revenue-catalog-reconciliation.md`, HTML renderizado, enlaces extraídos, transaction IDs, resultado de checkout y decisión de retiro/noindex.

### [ ] P0-04 — Reconstruir el baseline financiero y el Gap-to-5k

- **Responsable:** Finance / Revenue.
- **Depende de:** P0-01, P0-03.
- **Entregable:** cierre de los últimos 30 días con net collected por oferta, canal y campaña.
- **Debe hacer:** exportar Hotmart, Play, pagos y otras fuentes; conciliar cobros, refunds, fees, impuestos/withholding, commissions, moneda y fecha de cobro; calcular Gap-to-5k por fórmula, no por feel.
- **No debe hacer:** mezclar gross sales con net cash, omitir refunds ni usar una estimación como cierre.
- **Aceptación:** el informe reproduce el total de cada fuente y deja una diferencia explicada; `Gap-to-5k` se puede recalcular con los mismos datos.
- **Evidencia:** export original, hoja de conciliación, query reproducible, timestamp y decisión sobre fuentes faltantes.

### [ ] P0-05 — Diseñar oferta mínima, precio neto y escenarios

- **Responsable:** Product / Revenue / Finance.
- **Depende de:** P0-02, P0-03, P0-04.
- **Entregable:** tabla de oferta con `gross_price`, fees, refunds, `net_price`, margen de contribución, órdenes requeridas, owner y fecha de revisión.
- **Debe hacer:** comparar bundle, libros individuales, acceso, apps, flash y membresía; modelar escenarios conservative/base/qualified sin llamarlos forecast; decidir qué oferta puede cobrarse primero.
- **No debe hacer:** cambiar el precio real de Hotmart/Play sin registro, ofrecer descuento que destruya margen ni esconder uncertainty.
- **Aceptación:** cada oferta live tiene `net_price` reproducible; la suma de oportunidades puede cerrar US$5.000 o muestra exactamente el Gap-to-5k y su dependencia.
- **Evidencia:** pricing table, sensitivity analysis, approved price source y cálculo de órdenes.

### [ ] P0-06 — Cerrar legal, consent y trust antes de capturar leads

- **Responsable:** Legal/Privacy + Web.
- **Depende de:** P0-01, P0-03.
- **Entregable:** páginas públicas de privacy, terms, cookies, refund, disclaimer y affiliate disclosure; matriz de vendors, data flows y consent.
- **Debe hacer:** revisar `privacy-policy.html`; cubrir GA4, píxeles, email, pago y Play; validar claims de garantía/refund; adaptar por país sólo con revisión; añadir privacy/data-safety por app cuando aplique.
- **No debe hacer:** copiar una plantilla genérica, publicar tracking no autorizado, afirmar revisión legal sin owner ni prometer una política que el checkout no cumple.
- **Aceptación:** páginas enlazadas desde footer y checkout; reject/accept/withdrawal probados; claims de refund, garantía y tracking coinciden con la política y con la plataforma.
- **Evidencia:** URLs live, matriz vendor/data-flow, revisión legal fechada, screenshots de consent y prueba de no-track antes de accept.

### [ ] P0-07 — Instrumentar el funnel y reconciliar purchase

- **Responsable:** Analytics / Web.
- **Depende de:** P0-01, P0-03, P0-06.
- **Entregable:** contrato de eventos con nombres, triggers, parámetros, owner, política de PII y pruebas.
- **Debe hacer:** cubrir `view_item`, `begin_checkout`, `add_payment_info`, `purchase`, `lead_submit`, `app_download` y `affiliate_click`; incluir `offer_id`, `transaction_id`, `value`, `currency`, `source`, `medium`, `campaign`, `landing_page`, `device` y `consent_state` donde corresponda.
- **No debe hacer:** inferir compra desde pageview, duplicar purchase, enviar PII en URL/event name ni medir un click como revenue.
- **Aceptación:** cada etapa produce un evento único en una prueba end-to-end; purchase se reconcilia con Hotmart/Play en una muestra; el consent reject no genera tracking no autorizado.
- **Evidencia:** event dictionary, payloads sanitizados, debug logs/screenshots y reconciliation report.

### [ ] P0-08 — Activar y verificar CRM, email y webhooks

- **Responsable:** Lifecycle / Automation.
- **Depende de:** P0-03, P0-06, P0-07.
- **Entregable:** mapa Lead → Subscriber → Customer → Recovered Customer con owner, tags, reglas, retries, dead-letter y suppression.
- **Debe hacer:** configurar welcome, nurture, browse/cart, post-purchase, cross-sell y winback; conectar Hotmart/Make/MailerLite sólo mediante endpoints reales; probar alta, compra, refund y unsubscribe.
- **No debe hacer:** activar desde un JSON de ejemplo, contar un dashboard como automatización ni duplicar clientes por reintentos.
- **Aceptación:** lead de prueba recorre cada flujo; compra crea customer/tag correctos; webhook responde, es idempotente, no duplica y suprime bajas.
- **Evidencia:** IDs de automatización, logs de entrega, transaction de prueba, payload sanitizado y reconciliación de estados.

### [ ] P0-09 — Verificar listings y disponibilidad de Google Play

- **Responsable:** ASO / Android.
- **Depende de:** P0-02, P0-06, P0-07.
- **Entregable:** inventario de publicación con estado por app: live, internal, closed, submitted, suspended o retired.
- **Debe hacer:** confirmar package ID, título, descripción, screenshots, icon, categoría, price, privacy URL, Data safety, content rating, release notes y URL real; separar artefacto de publicación.
- **No debe hacer:** subir un paquete con otro package ID, usar screenshots falsos o llamar live a un listing sólo porque existe un `.aab`.
- **Aceptación:** cada app live tiene listing verificable, CTA correcto, owner y fecha; las no publicadas no se usan en bots, ads o forecasts.
- **Evidencia:** export de Play Console, URL pública, screenshots del listing, reporte de instalación o smoke de CTA.

### [ ] P0-10 — Ejecutar release y smoke test de producción

- **Responsable:** Web / DevOps.
- **Depende de:** P0-03, P0-06, P0-07, P0-08, P0-09.
- **Entregable:** release candidate desplegado y verificado en el dominio real.
- **Debe hacer:** ejecutar build y tests; revisar canonical, robots, sitemap, consent, navegación, CTA, checkout, email, deep links, 404, mobile y status del hosting; guardar commit y timestamp.
- **No debe hacer:** declarar deploy successful sólo porque existe un workflow o porque CI pasó en otro entorno.
- **Aceptación:** `npm run build` y `npm test` pasan; smoke externo de rutas críticas pasa; no hay 5xx/404 en CTAs; el reporte distingue fallos preexistentes de fallos del cambio.
- **Evidencia:** logs de CI, URL live, reporte de smoke, Lighthouse de superficie canónica y registro de rollback.

---

## Fase B — Conversión, adquisición y optimización (días 15–45)

Con el embudo instrumentado, aquí es donde se mueve la aguja.

### [ ] P1-01 — Ejecutar el remediation loop de SEO técnico

- **Responsable:** SEO / Web.
- **Depende de:** P0-01, P0-10.
- **Entregable:** registro de remediación para canonical, hreflang, robots, title, description, headings, indexability, sitemap, OG/Twitter, imágenes y Core Web Vitals.
- **Debe hacer:** validar reciprocidad, aislar duplicados intencionales, corregir sólo URLs canónicas, mantener la cobertura local de description/hreflang/canonical, remediar los 180 missing alt y 270 empty alt sólo con revisión de accesibilidad, corregir heading skips y medir plantillas representativas.
- **No debe hacer:** regenerar todo sin revisar impacto, canonicalizar a una URL incorrecta ni llamar “SEO completo” a JSON-LD válido.
- **Aceptación:** todas las URLs indexables tienen canonical y description coherentes; no quedan errores elegibles de rich-results; existe baseline y budget de CWV.
- **Evidencia:** export de GSC/Bing, rich-results test, Lighthouse CI, before/after y registro de excepciones.

### [ ] P1-02 — Construir la superficie GEO/AI verificable

- **Responsable:** GEO / SEO / Editorial.
- **Depende de:** P0-01, P1-01.
- **Entregable:** decisión documentada sobre `llms.txt`/`llms-full.txt`, mapa de entidades, fuentes autoritativas y páginas de respuesta citable.
- **Debe hacer:** mantener sincronizados marca, autores, libros, apps, precios, fechas, canonical URLs y política editorial; registrar crawler output, consultas de prueba y citas/referrals cuando sean observables.
- **No debe hacer:** prometer ranking o citations, publicar statements de precio desactualizados ni ocultar pages en robots/sitemap sin una decisión.
- **Aceptación:** un crawler puede identificar oferta, precio, autor y respuesta sin ambigüedad; cada entidad tiene `source_url`, owner y `last_reviewed`.
- **Evidencia:** archivos live, mapa de entidades, 20 consultas reproducibles, registro de citations/referrals y revisión manual.

### [ ] P1-03 — Convertir contenido existente en superficies de ingreso

- **Responsable:** Editorial / SEO.
- **Depende de:** P0-04, P0-05, P1-01, P1-02.
- **Entregable:** registry de clusters con intención, oferta, CTA, owner, baseline y target.
- **Debe hacer:** clasificar los artículos 800–1500; refrescar sólo los que tengan demanda, intent mismatch o potencial de venta; conectar cada money page con un libro, app u oferta reconciliada; revisar fuentes, author, date, updated y links.
- **No debe hacer:** publicar más volumen para superar contadores, enlazar a un producto incorrecto ni llamar calidad a un simple word count.
- **Aceptación:** cada cluster incluido tiene QA editorial, oferta/CTA válidos, owner y método para medir assisted conversion.
- **Evidencia:** content registry, export de queries, muestra revisada y before/after de engagement y revenue.

### [ ] P1-04 — Implementar CRO controlado en landing pages y checkout

- **Responsable:** Growth / Web.
- **Depende de:** P0-03, P0-05, P0-06, P0-07.
- **Entregable:** experiment log con variantes de hero, oferta, pricing, proof, CTA, bundle, upsell, FAQ y checkout.
- **Debe hacer:** separar tráfico de artículo, direct y paid; alinear mensaje y oferta; medir cada paso; incluir móvil, decline, duplicate click, recovery y trust.
- **No debe hacer:** usar scarcity, testimonios o claims no demostrados, declarar ganador por CTR ni lanzar sin baseline y stop rule.
- **Aceptación:** cada experimento tiene hypothesis, primary metric, guardrail, muestra o criterio de decisión; conversion, AOV, refunds y net revenue se reportan juntos.
- **Evidencia:** experiment log, funnel report, screenshots, transaction QA y recomendación go/no-go.

### [ ] P1-05 — Completar ASO y experimentación por app

- **Responsable:** ASO / Android.
- **Depende de:** P0-02, P0-09, P1-04.
- **Entregable:** listing QA y backlog de experimentos por app.
- **Debe hacer:** revisar title, short/long description, icon, screenshots, category, price, privacy/Data safety, release notes, rating prompt y deep links; ejecutar una hipótesis por app, métrica primaria, guardrail y fecha.
- **No debe hacer:** cambiar 12 listings en bloque, atribuir instalaciones a una campaña sin tracking o llamar revenue a installs.
- **Aceptación:** cada listing tiene baseline, owner, versión de screenshots, CTA verificable y review date; cada experimento tiene stop rule.
- **Evidencia:** listing export, experiment log, installs, purchase/upgrade, retention, refunds y review notes.

### [ ] P1-06 — Diseñar captura y nurture de leads

- **Responsable:** Lifecycle / Content.
- **Depende de:** P0-06, P0-07, P0-08, P1-03.
- **Entregable:** lead magnet, landing, thank-you page y secuencias welcome/activation/segmentation.
- **Debe hacer:** elegir un magnet alineado con una oferta; definir signup → activation → purchase; medir cohorte, consent, unsubscribe y exit criteria.
- **No debe hacer:** blasts masivos, prometer un resultado que el producto no entrega ni capturar PII fuera de la base legal.
- **Aceptación:** cada email tiene trigger, goal, CTA, owner, exit criteria y suppression; la cohorte se puede consultar sin datos inventados.
- **Evidencia:** campaign IDs, landing QA, cohort report, delivery/open/click metrics y muestra de replies.

### [ ] P1-07 — Construir dashboard de acquisition, revenue y cohorts

- **Responsable:** Analytics / Growth.
- **Depende de:** P0-04, P0-07, P1-01, P1-02, P1-05.
- **Entregable:** dashboard con source of truth, data dictionary, timezone y reconciliación mensual.
- **Debe hacer:** combinar GSC/Bing, organic assisted revenue, AI referrals/citations cuando sea observable, Play installs/purchases, email cohorts, affiliates, AOV, refunds y CAC.
- **No debe hacer:** sumar GA4 y Hotmart sin reconciliar IDs, llamar conversión a una sesión ni usar datos de schema como eventos.
- **Aceptación:** el dashboard se refresca, permite explicar Gap-to-5k por canal/oferta y entrega un export mensual auditable.
- **Evidencia:** dashboard URL o query reproducible, data dictionary, sample reconciliation y monthly close.

### [ ] P1-08 — Pilotear partnerships y afiliados con tracking reversible

- **Responsable:** Partnerships / Revenue.
- **Depende de:** P0-03, P0-05, P0-07, P0-08.
- **Entregable:** registry de partners, newsletters, affiliates, offers, links, commissions y estados de payout.
- **Debe hacer:** definir commission, attribution window, threshold, disclosure, creative approval, refund reversal, tracking, link único y calendario de review.
- **No debe hacer:** pagar por clicks sin evidencia de compra, usar links archivados o entregar acceso sin acuerdo/disclosure.
- **Aceptación:** cada partner tiene Signed terms, link único, click event, conversion match, payout status y fecha de renovación.
- **Evidencia:** agreement/terms, link registry, attribution report, payout sample y prueba de reverso.

### [ ] P1-09 — Validar pricing, AOV y retención

- **Responsable:** Product / Revenue / Finance.
- **Depende de:** P0-04, P0-05, P1-04, P1-06, P1-08.
- **Entregable:** decision memo de pricing, bundle, cross-sell, upsell, reorder/renewal y refund threshold.
- **Debe hacer:** comparar bundle vs individual, medir elasticity cuando haya muestra suficiente, calcular contribution margin y recalcular Gap-to-5k.
- **No debe hacer:** cambiar precio global por una semana de tráfico, esconder fees o llamar retention a una métrica de visitas.
- **Aceptación:** margin, AOV, refund, repeat/retention y baseline/target están explícitos; el escenario tiene supuestos trazables.
- **Evidencia:** price experiment o cohort analysis, contribution model y decisión aprobada.

### [ ] P1-10 — Construir trust y social proof verificable

- **Responsable:** Product / Editorial.
- **Depende de:** P0-06, P1-03, P1-04.
- **Entregable:** proof registry con authorship, editorial policy, authorized testimonials, case studies, screenshots, samples y customer FAQ.
- **Debe hacer:** pedir permiso, fechar, atribuir y distinguir experiencia propia de testimonio; alinear claims con privacy, refund y terms.
- **No debe hacer:** fabricar reviews, citas, awards, resultados o scarcity.
- **Aceptación:** cada proof tiene source, date, approval, scope y review date; ningún claim queda sin evidencia.
- **Evidencia:** proof registry, autorizaciones, links live y revisión editorial fechada.

---

## Fase C — Escala, diversificación y eficiencia (días 46–90)

Solo con unit economics cerradas.

### [ ] P2-01 — Escalar clusters SEO de alta intención

- **Responsable:** SEO / Editorial.
- **Depende de:** P1-03, P1-07.
- **Entregable:** backlog de 3–5 clusters priorizados por revenue potential, no por número de palabras.
- **Debe hacer:** seleccionar queries transaccionales, actualizar páginas existentes, link internally, añadir proof y medir assisted revenue.
- **No debe hacer:** crear páginas sin demanda, duplicar keywords en paths o comprar backlinks.
- **Aceptación:** cada cluster tiene target de ranking, CTR, assisted revenue, owner y review date.
- **Evidencia:** GSC before/after, content registry, backlink report y revenue attribution.

### [ ] P2-02 — Ejecutar digital PR y link earning ético

- **Responsable:** Partnerships / Editorial.
- **Depende de:** P1-08, P2-01.
- **Entregable:** prospect list, outreach assets, quality criteria y backlink log.
- **Debe hacer:** priorizar recursos y audiencia relevantes; evaluar follow/nofollow, relevancia, editor y fecha; medir referral y assisted revenue.
- **No debe hacer:** PBNs, link exchanges masivas, anchor text manipulative o guest posts sin disclosure.
- **Aceptación:** cada backlink tiene URL, editor, follow/nofollow, relevance, fecha, approval y resultado.
- **Evidencia:** prospect tracker, outreach log, link audit y referral report.

### [ ] P2-03 — Evaluar expansión o salida de apps del portfolio

- **Responsable:** Product / ASO.
- **Depende de:** P0-02, P0-09, P1-05, P1-09.
- **Entregable:** business case por app para invertir, mantener, mejorar o retirar.
- **Debe hacer:** comparar effort, CAC, installs, retention, ARPDAU, uninstalls, reviews, soporte y maintenance cost; definir kill criteria.
- **No debe hacer:** lanzar una app para llenar catálogo o inflar el número de apps.
- **Aceptación:** cada app tiene decisión, owner, budget, review date y métrica que justifica la siguiente acción.
- **Evidencia:** Play metrics, cohort report, cost ledger y memo de decisión.

### [ ] P2-04 — Habilitar paid acquisition sólo con unit economics

- **Responsable:** Growth / Finance.
- **Depende de:** P0-05, P0-06, P0-07, P1-04, P1-05, P1-07, P1-09.
- **Entregable:** test plan de Meta/Google con budget cap, creative matrix, landing variants, consent y kill rule.
- **Debe hacer:** probar una oferta y un canal a la vez; validar IDs, conversion values, spend reconciliation, frequency cap, contribution margin y payback.
- **No debe hacer:** aumentar budget sin margen, sin consent, sin tracking o sin medir refunds.
- **Aceptación:** p95 tracking match, CPA/CAC ceiling, payback rule, budget cap y stop condition están documentados; escala sólo con cohortes verdes.
- **Evidencia:** campaign IDs, spend/click/conversion report, net revenue attribution y decision log.

### [ ] P2-05 — Probar membresía, Inner Circle o acceso recurrente

- **Responsable:** Product / Lifecycle / Finance.
- **Depende de:** P0-05, P1-06, P1-09.
- **Entregable:** propuesta de oferta recurrente con precio, beneficios, billing, cancelación, refund, contenido y retention plan.
- **Debe hacer:** validar con cohort actual; definir activation, trial → paid, churn, expansion, payback y delivery calendar.
- **No debe hacer:** llamar suscripción a un pago único, prometer contenido inexistente o lanzar sin soporte de cancelación.
- **Aceptación:** margen, billing, cancellation, refund, content calendar y target de retención están documentados.
- **Evidencia:** offer page, checkout test, cohort report y feedback de clientes.

### [ ] P2-06 — Probar expansión multi-idioma o de segmentos

- **Responsable:** Growth / Product.
- **Depende de:** P1-01, P1-03, P1-07.
- **Entregable:** test de un mercado prioritario con landing, legal, support, pricing y analytics localizados.
- **Debe hacer:** elegir idioma/segmento por demanda; mantener canonical/hreflang correcto; medir conversión, CAC, refund y carga de soporte.
- **No debe hacer:** traducción automática sin revisión, duplicar páginas sin señal o prometer soporte no disponible.
- **Aceptación:** el test tiene mercado, owner, presupuesto, ventana de medición, legal QA y decisión de escalar/parar.
- **Evidencia:** market decision, localized QA, funnel report y learning memo.

### [ ] P2-07 — Automatizar operaciones, alertas y cumplimiento

- **Responsable:** DevOps / Automation.
- **Depende de:** P0-07, P0-08, P0-10.
- **Entregable:** runbooks de deploy, rollback, webhook failure, payment mismatch, consent breach, listing takedown y content revert.
- **Debe hacer:** definir owner/on-call, threshold, severidad, retry/backoff, dead-letter, log retention, backup, rollback y drill; separar secrets por environment.
- **No debe hacer:** exponer secrets en HTML, workflows, docs o logs ni depender de una sola persona.
- **Aceptación:** cada alerta tiene threshold, severidad, destinatario, runbook y prueba; un tabletop exercise cierra con acciones.
- **Evidencia:** runbooks, alert test, access review, backup/restore test y postmortem del drill.

### [ ] P2-08 — Convertir learnings en decisiones de portfolio

- **Responsable:** Founder / Revenue / Finance.
- **Depende de:** P1-07, P1-09, P2-03, P2-04.
- **Entregable:** dashboard ejecutivo mensual con Gap-to-5k, contribution margin, retention, cash collection y decisión de inversión.
- **Debe hacer:** separar revenue, margen, collection, retention y forecast; asignar budget al canal con mejor payback; registrar stop/scale decisions.
- **No debe hacer:** usar sesiones, followers, installs o artículos como sustitutos de cash collected.
- **Aceptación:** el dashboard responde qué canal aporta US$5.000, qué margen deja, qué riesgo tiene y qué tarea se cancela.
- **Evidencia:** monthly close, forecast versionado y decision log con owner/fecha.

---

## Residuales absorbidos (venían de planes ya consolidados)

Cada punto estaba pendiente en un plan que se ha absorbido aquí. La columna
"Va en" dice en qué tarea del plan entra, para que no se pierda nada.

| Pendiente | Va en |
|---|---|
| F-8 · reforzar la home con keywords y links a las 6 de striking distance | **P1-01** |
| F-10 · `books/mind-the-gap-pdf.html` description de 232 ch → 160 | **P1-01** |
| F-16 · `checklist-ventas.html`: decidir si es interna, noindex o se retira (está en `.gitignore`) | **P0-03** |
| F-24 · aplicar los 12 títulos ASO de `docs/ASO-play-titles.md` en Play Console | **P0-09** |
| F-28 · CNAME y canonicals consistentes (sin `www`, https) | **P1-01** |
| F-4 · secuencia "Quickstart to Buyer" activada (0 emails enviados hoy) | **P0-08** |
| F-5 · Meta Pixel + Google Ads IDs reales | **P2-04** |
| GSC · conectar GA4 y token de GSC que no muere a los 7 días | **P1-01** |
| Homepage: bundle $24.99 arriba, garantía Hotmart visible, OTO de complete-access | **P1-04** |
| Pedir testimonios reales a compradores previos → `data/social-proof.json` (mínimo 3) | **P1-10** |
| `flash-sale.html` conectado como destino de los emails de oferta, mensual | **P1-04** |
| Eventos de conversión de compra (`purchase`, `checkout_click`) activos y reconciliados | **P0-07** |
| 5 landing pages de herramientas top con SEO long-tail en español | **P1-03** |
| 5 pins/día en Pinterest hacia su herramienta + primer score en `data/social-performance.json` | **P1-03** |
| 3 páginas "vs" nuevas en `compare/` | **P1-03** |
| Lista de 20 creadores ES del nicho y contacto de 5 con propuesta + material listo | **P1-08** |
| Posts en foros/reddits con la herramienta gratis (solo donde las reglas lo permitan) | **P1-08** |
| Duplicar la producción del canal con mejor score | **P1-03** |
| Piloto de paid acquisition a $5/día solo si la orgánica pasa del 2% | **P2-04** |
| Dashboard de KPI (6 pestañas: DASHBOARD, RAW_MAILERLITE, RAW_HOTMART, RAW_PLAY_CONSOLE, RAW_GA4, LOG) | **P1-07** |
| Trigger de alerta del dashboard + `/kpi` y `/flash` en el bot de Telegram | **P2-07** |
| 145 artículos que faltan (59 del cluster `servitors` = 40% del hueco) → subbloque de P1-03 | **P1-03** |
| Aftermarket kit: 8 plantillas de Canva, guía PDF de 1 página, `swipe-emails` y `swipe-social` con disclosure y UTM por plataforma | **P1-08** |
| Especificación de artículos para YouTube (spec: `projects/plans/YT_ARTICLES_ATOMIC_PLAN.md`; aún sin ejecutar) | **P1-03** |
| Matriz legal de proveedores: 9 puntos de consentimiento y产权 (owner firma) | **P0-06** |
| MailerLite: 6 grupos/forms/automaciones del checklist (owner) | **P0-08** |
| Traffic autopilot: 4 jobs registrados en el scheduler (código ya listo) | **P2-07** |
| Decidir el canal Telegram canónico — RESUELTO: hay 2 canales y 2 grupos, todos en los emails | **P1-08** |
| T3 · oferta "Inner Circle" sin ID externo: fuera del canal hasta tener ID | **P0-03** |

---

## Ya en marcha (no rehacer)

| Qué | Estado | Dónde |
|---|---|---|
| Campaña de email ad-hoc | 50/día, 783 en cola, tope diario persistente, watchdog de quejas | `projects/scripts/guerrilla-*.mjs` |
| Posts de Telegram | 10 publicados en el canal oficial, con botón al grupo | `guerrilla-telegram-auto.mjs` |
| Respuestas automáticas en el grupo | servicio listo, espera a que el bot entre (G11) | `guerrilla-telegram-auto.mjs listen` |
| Auditoría de estilo del sitio | 994 páginas revisadas, 42 remapeadas a la paleta, 167 duplicados de CSS quitados | `projects/scripts/style-*.mjs` |
| Email→Telegram | los 2 canales y los 2 grupos en los 783 emails | `guerrilla-copy2.mjs` |
| Build de tools y funnels | 71 tools, motor atómico, 331/331 comprobaciones | `scripts/test-tool-funnels.mjs` |

---

## Reglas de ejecución

1. **Una tarea a la vez.** Depende de la anterior si dice que depende.
2. **La evidencia es en producción**, no local: URL, commit o captura.
3. **Si una tarea necesita una puerta externa**, se pide y se para: no se
   marca hecha por estar "preparada".
4. **Nada de URLs inventadas.** Si un checkout no está verificado, la página
   queda en estado bloqueado, como ya se hizo con Complete Access y Flash Sale.
5. **El self-check manda:** `node projects/scripts/guerrilla-selfcheck.mjs` (16 checks).
   Y `node scripts/test-tool-funnels.mjs` (331 checks).
6. **Si una tarea resulta estar ya hecha**, se marca `[x]` con la evidencia y
   no se vuelve a trabajar. La lista de lo cerrado está en `plans-completados.md`.
