# Plan de telemetría y crecimiento

**Estado:** implementación preparada; conexión privada pendiente de credenciales
**Versión:** 1.0
**Fecha:** 2026-09-24

## 1. Objetivo

Construir un sistema honesto para medir tráfico, uso de herramientas, clics a apps y libros, compras, retención y contenido. El sistema no debe convertir escenarios dry-run en datos reales ni prometer un número de ventas.

## 2. Evidencia disponible hoy

Los artefactos locales revisados son escenarios o ejecuciones dry-run:

- Cohorts: dos cohortes pequeñas, cinco suscriptores, tres compradores y 100 dólares simulados; `dry_run=true`.
- Play sales: cero transacciones y cero ingresos; `dry_run=true`.
- SEO revenue attribution: cero transacciones y cero ingresos; `dry_run=true`.
- No hay credenciales operativas en el entorno local para GA4 Data API, Google Play Developer API, Hotmart o MailerLite.
- El bundle público contiene un ID de GA4 (`G-V6LHCPN9TK`) y el código de consentimiento, pero un ID público no demuestra tráfico, compras ni retención.

## 3. Fuentes de verdad

| Fuente | Uso | Método | Estado seguro |
|---|---|---|---|
| GA4 browser | page views, eventos y embudos públicos | `gtag`/Measurement Protocol existente | Requiere consentimiento y validación de red |
| GA4 Data API | reports y retención | `ga4-mp.js`, `seo-revenue-attribution.js` | Requiere property ID y credenciales |
| Google Play | instalaciones, compras y revenue | `ga4-play-purchases.js`, `play-sales-report.py` | Requiere service account y package name |
| Hotmart | checkout y webhook | `webhook-receiver.js` | Requiere secreto del webhook |
| MailerLite | cohortes y suscripciones | CSV/API | Requiere API key o export controlado |
| Adsense | ingresos de contenido |exportación/panel/API cuando exista | No hay API configurada en el repositorio |

No se crea una segunda vía de datos: los scripts anteriores son los adaptadores canónicos.

## 4. Eventos canónicos

`data/analytics-events.json` define el contrato v1.0:

- `tool_start`
- `tool_complete`
- `cta_click`
- `app_store_click`
- `book_click`
- `outbound_click`
- `email_signup`
- `content_share`
- `experiment_exposure`
- `conversion_import`

Reglas:

1. Consentimiento inicial: deny.
2. No enviar email, nombre, teléfono, token, URL con query, payload crudo ni secretos.
3. Usar IDs internos no personales para herramientas, apps, libros y experimentos.
4. Duraciones y valores se almacenan en buckets, no como datos financial exactos en eventos de marketing.
5. La importación de compras identifica fuente y fecha, pero separa datos agregados de PII.

## 5. KPIs y fórmulas

- Visitantes cualificados: sesiones con consentimiento y excluir bots conocidos.
- Uso de herramienta: `tool_complete / tool_start`.
- CTA rate: `cta_click / tool_start` o `tool_complete`.
- Store click rate: `app_store_click / tool_complete`.
- Instalación: instalaciones atribuidas / store clicks, si Play devuelve datos.
- Compra: compras / instalaciones o sesiones cualificadas, según ventana definida.
- Revenue/day: ingresos verificados / días.
- Retención: usuarios activos en D1, D7 y D30 / cohorte inicial.
- CAC: coste de adquisición atribuido / compradores nuevos verificados.
- LTV: margen acumulado por usuario en una ventana definida.

Para estimar qué tráfico haría falta para 10 ventas diarias se usa la fórmula:

`sesiones cualificadas necesarias = 10 / tasa de compra por sesión`

Escenarios matemáticos, no datos actuales:

| Tasa de compra | Sesiones cualificadas por día |
|---:|---:|
| 0,5 % | 20.000 |
| 1 % | 10.000 |
| 2 % | 5.000 |
| 5 % | 2.000 |
| 10 % | 1.000 |

La cifra real debe salir de una cohorte con atribución verificable; no se puede elegir la tasa más favorable sin evidencia.

## 6. Atribución

- Añadir UTMs a contenido viral: `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`.
- Mantener una clave estable de experimento y variante.
- Persistir first-touch y last-touch en un almacén agregado, no en cookies con PII.
- Reportar ventanas de 1, 7 y 28 días.
- Separar contenido orgánico, compartido, referido y pagado.
- No atribuir una venta a una herramienta solo por un clic; exigir evento, tiempo y fuente.

## 7. Pipeline operativo

1. `analytics:health`: comprueba IDs públicos, presencia de credenciales, dry-run y artefactos.
2. `analytics:smoke`: carga la web pública con Playwright y observa `dataLayer` y hosts, sin enviar PII.
3. `analytics:daily --dry-run`: valida comandos y rutas sin llamadas externas.
4. `analytics:daily --live`: exige credenciales y llama únicamente a los adaptadores existentes.
5. Se guardan reportes agregados en `logs/`, que está ignorado por Git.
6. Revisión semanal: datos, anomalías, consentimientos, duplicados y calidad de atribución.

## 8. Fases

### Fase A — Seguridad y observación

- Configurar `.env` localmente.
- Confirmar que el bundle público envía `page_view` después del consentimiento.
- Ejecutar smoke test y guardar evidencia en `logs/`.

### Fase B — datos de negocio

- Conectar Play Developer API y Hotmart.
- Importar cohortes de MailerLite.
- Verificar Reconciliación entre compras, apps y eventos.
- Establecer una fuente de verdad para ingresos y reembolsos.

### Fase C — crecimiento

- Crear landings por intención y herramienta.
- Hacer experimentos con una variable por vez.
- Medir contenido, viralidad, CTA y conversión por segmento.
- No escalar una variante hasta tener retención y conversión repetibles.

## 9. Criterios para hablar de 10 ventas diarias

Solo se puede declarar una-meta de 10 ventas/día si, durante una ventana acordada, se observan:

- compras verificadas de Play o Hotmart;
- correspondencia con tráfico y CTA;
- Restar cancelaciones, reembolsos y duplicados;
- retención de la cohorte;
- attribution reproducible;
- margen después de comisión y promoción;
- límites de CAC definidos.

Sin estos datos, el objetivo se trata como hipótesis de planificación.

## 10. Privacidad y seguridad

- No guardar secretos en Git, planes, HTML público o logs.
- Rotar cualquier credencial expuesta y revocar la anterior.
- Respetar consentimiento, 최소화 de datos y solicitud de eliminación.
- No usar atributos de salud, religión, orientación sexual ni inferencias sensibles.
- Los nombres de herramientas son descriptivos, no predicciones.

## 11. Done

- `.env.example` sin secretos.
- `analytics-bridge.js` independiente y consent-aware.
- health check y smoke test públicos.
- comandos dry-run y live claramente separados.
- credenciales reales instaladas solo por el operador.
- primer reporte live con fuente, fecha, transacción y estado de reconciliación.
