# Plan atómico — Convertir herramientas gratuitas de `tools/` en funnels de venta de apps y libros

> **Estado:** en ejecución
> **Objetivo de negocio:** cada visita a una herramienta gratuita debe terminar en una venta (app Android o libro PDF). Hoy las 61 herramientas son *dead ends*: cogen al usuario y no venden nada.
> **Restricción del usuario:** NO delegar a tasks/skills/agentes. Todo se hace directamente.

---

## 1. Diagnóstico (hecho — hechos verificados)

La infraestructura de venta **ya existe** en `js/conversion.js` (64 KB, 1793 líneas) pero **nunca llega al usuario**. 5 defectos:

| # | Defecto | Evidencia |
|---|---------|-----------|
| 1 | **`js/conversion.min.js` está desactualizado** | 40 163 bytes; NO contiene `toolAppMap` ni `injectToolUpgradeCTA`. Todas las páginas de herramienta cargan `../js/conversion.min.js`, nunca `conversion.js`. La lógica de venta no se distribuye. |
| 2 | **Ningún tool carga `apps-data.js`** | Scripts de `tools/tarot-journal.html`: `shared.min.js`, `conversion.min.js`, `analytics-bridge.js`, `atomic-tools.js`. Sin `apps-data` → `getAppsData()` devuelve `null` en el 100% de las páginas de herramienta. |
| 3 | **Los libros nunca se promocionan** | Cero CTAs de libros en páginas de herramienta. El pedido del negocio ("apps **y** libros") no está cubierto. |
| 4 | **`toolAppMap` tiene datos falsos** | 10 entradas hardcodeadas con IDs de Play Store **inexistentes** (`com.chaosmagick.*`, `com.cha0smagick.norone`, …) y precios inflados (`$4.99` cuando el real es `$3.99`). El fallback "app aleatoria" endosaba apps irrelevantes. |
| 5 | **Un solo CTA, sin secuencia** | Una sola sección inyectada. No hay pre-resultado, ni post-resultado, ni libro, ni herramientas relacionadas. No es un funnel, es un banner. |

### Root cause principal
`package.json` tiene `prebuild` → `build:js` (esbuild), pero `conversion.min.js` quedó viejo. **Un `npm run build:js` ya arreglaría el defecto #1** — pero sin los defectos #2–#5 arreglados el funnel seguiría siendo irrelevante o falso.

---

## 2. Decisiones de diseño (ya tomadas)

- **NO tocar los 62 archivos HTML de `tools/`.** Se extiende el motor `conversion.js`, que ya se carga en todas ellas.
- **Un solo archivo de datos nuevo**: `data/tool-funnels.json`, descargado en runtime → el usuario edita funnels sin tocar JS.
- Resolución de URL: `new URL('../data/tool-funnels.json', window.location.href)` → funciona a cualquier profundidad.
- **Nunca** app aleatoria. Si una herramienta no encaja semánticamente: `"apps": []`.
- Todo el CSS nuevo dentro de `injectStyles()` (patrón existente, evita un segundo build de CSS).
- Eventos GA vía el helper `track()` existente: `tool_funnel_view`, `tool_funnel_click` con `product_type` (`app|book`) y `product_id`.
- Precios en el JSON limpios: `"$3.99"` (sin ` USD`, sin `(60% off)`).
- Todo el output en UTF-8 válido.

### Contrato de datos (`data/tool-funnels.json`)
```jsonc
{
  "version": 1,
  "generated": "YYYY-MM-DD",
  "products": {
    "apps":  [ { "id": "norse-rune-oracle", "name": "…", "price": "$3.99", "url": "https://play.google.com/…?utm_…" } ],
    "books": [ { "id": "tarot-chaos-pdf", "name": "…", "price": "$9.99", "page": "../books/tarot-chaos-pdf.html", "checkout": "https://pay.hotmart.com/…", "language": "es" } ]
  },
  "angles": { "Tarot": { "es": { "head": "…", "sub": "…" }, "en": { "head": "…", "sub": "…" } } },
  "tools":  { "tarot-journal": { "category": "Tarot", "lang": "es", "apps": ["unofficial-rider-waite-tarot"], "book": "tarot-chaos-pdf", "related": ["tarot-card-reference", "tarot-spread-builder"] } }
}
```
Tokens permitidos en el copy de `angles`: `{{tool}}` y `{{book}}` (sustitución en runtime).

### El funnel de 4 pasos que se inyecta en cada herramienta
1. **Pre-resultado** — pitch de la app, antes de que el usuarioopie el resultado.
2. **Post-resultado** — CTA de la app **correcta** con precio y URL reales (resultado del catálogo, no hardcodeado).
3. **Libro** — sección nueva con la página de venta `../books/<id>.html` + checkout de Hotmart.
4. **Herramientas relacionadas** — fila de cross-sell a 3 sister tools.

---

## 3. Tareas atómicas

### T1 — `scripts/build-tool-funnels.mjs` ✅ EN CURSO
Genera `data/tool-funnels.json` de forma reproducible.
- Evalúa `js/apps-data.js` en un sandbox `node:vm` → extrae `appsData` (12) y `booksData` (7).
- Normaliza precios: quita ` USD` y `(NN% off)`.
- Contiene el **mapping autoral de 61 herramientas** → apps + libro.
- Contiene los **14 ángulos de categoría** (ES/EN).
- **Valida en build-time**: todo slug de `tools.*` debe existir como `.html` en `tools/`; todo app id y book id referenciado debe existir en el catálogo. Falla ruidosamente si hay un orphan.
- Idioma: `es` para las 40 Gen1, `en` para las 21 Gen2.

### T2 — Correr el build y verificar
```powershell
node scripts/build-tool-funnels.mjs
```
Assert: JSON válido, 61 entradas, 0 slugs huérfanos, 0 ids de producto inexistentes.

### T3 — Parchear `js/conversion.js` ✅ BLOQUEANTE
Añadir dentro del IIFE:
- `TOOL_FUNNELS_URL` + `loadToolFunnels()` — fetch + caché en `window.__cmToolFunnels`.
- `getToolSlugFromPath()` — extrae el slug de `/tools/<slug>.html`.
- `injectToolAppPitch(slug, entry, products)` — paso 1 (pre-resultado).
- `injectToolUpgradeCTA(...)` — **reescribir** para usar el producto del catálogo, con copy por ángulo (paso 2).
- `injectBookCTA(book, entry, products)` — NUEVO, paso 3.
- `injectRelatedTools(slug, entry)` — NUEVO, paso 4.
- `wireFunnelTracking()` — GA `tool_funnel_view` / `tool_funnel_click`.
- CSS de `.cm-book-cta`, `.cm-funnel-related`, `.cm-tool-pitch` dentro de `injectStyles()`.
- **Reescribir `case 'tools':`** para usar el catálogo; conservar `injectLeadMagnet`.

### T4 — Arreglar 3 strings mojibake en `injectToolUpgradeCTA`
`Â¿Te gusta…` → `¿Te gusta…` · `ObtÃ©n` → `Obtén` · `pago Ãºnico` → `pago único`.
(Verificado leyendo el archivo como bytes UTF-8: exactamente 3 secuencias corruptas. El em-dash sí está bien.)

### T5 — Rebuild de `conversion.min.js` ✅ BLOQUEANTE
```powershell
npm run build:js
```
Assert: el `.min.js` nuevo contiene `tool_funnels` y `injectBookCTA`.

### T6 — Smoke test headless (DOM)
Cargar con `node:vm` + DOM stub:
- 1 tool Gen1 ES (`tools/tarot-journal.html`)
- 1 tool Gen2 EN (`tools/sigil-generator.html`)

Assert en cada una: existe `#cm-cta-tool-upgrade` con `href` de Play Store real y precio correcto; existe `#cm-cta-book`; existen ≥2 links en `.cm-funnel-related`; los href de libro apuntan a un `books/*.html` que existe en disco.

### T7 — Verificar los 61 slugs
Cruzar `Object.keys(tools.*)` contra `readdirSync('tools/')`. Report: N resueltos / N huérfanos.

### T8 — Funnel en `tools/index.html`
Hoy solo recibe lead magnet. Añadir: grid de apps + grid de libros desde el mismo JSON, para que el índice de herramientas también venda.

---

## 4. Criterios de aceptación

- [ ] `data/tool-funnels.json` existe, es JSON válido, cubre los 61 tools, 0 orphans.
- [ ] Las 12 apps del catálogo con precio y URL de Play Store **reales**.
- [ ] Los 7 libros con página de venta **existente** + checkout Hotmart.
- [ ] `js/conversion.min.js` contiene la lógica nueva.
- [ ] Un tool Gen1 ES y uno Gen2 EN renderizan app CTA + book CTA + relacionadas.
- [ ] 0 strings mojibake en el output.
- [ ] Eventos GA `tool_funnel_view` y `tool_funnel_click` se disparan.
- [ ] `tools/index.html` vende.
- [ ] Ningún tool recibe una app aleatoria irrelevante.

---

## 5. Riesgos

| Riesgo | Mitigación |
|--------|------------|
| `fetch` del JSON falla (file://, offline) | Todo wrapped en `try/catch`; si falla, el funnel degrada a *cero* CTA — nunca a una app falsa. |
| Un tool nuevo se añade a `tools/` sin entrada en el JSON | T1 valida en build-time y **falla**. Además `conversion.js` tiene un fallback: sin entrada → solo libro por categoría, sin app. |
| Prices desincronizados de `apps-data.js` | T1 **deriva** el bloque `products` de `apps-data.js`; nunca se escriben a mano. |
| Doble inyección si `run()` se llama 2 veces | Todos los injectores guardados por `id` y con guard `if (document.getElementById(...)) return;`. |
