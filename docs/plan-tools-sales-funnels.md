# Plan atÃ³mico â€” Convertir herramientas gratuitas de `tools/` en funnels de venta de apps y libros

> **Estado:** completado (2026-10-12)
> **Objetivo de negocio:** cada visita a una herramienta gratuita debe terminar en una venta (app Android o libro PDF). Hoy las 61 herramientas son *dead ends*: cogen al usuario y no venden nada.
> **RestricciÃ³n del usuario:** NO delegar a tasks/skills/agentes. Todo se hace directamente.

---

## 1. DiagnÃ³stico (hecho â€” hechos verificados)

La infraestructura de venta **ya existe** en `js/conversion.js` (64 KB, 1793 lÃ­neas) pero **nunca llega al usuario**. 5 defectos:

| # | Defecto | Evidencia |
|---|---------|-----------|
| 1 | **`js/conversion.min.js` estÃ¡ desactualizado** | 40 163 bytes; NO contiene `toolAppMap` ni `injectToolUpgradeCTA`. Todas las pÃ¡ginas de herramienta cargan `../js/conversion.min.js`, nunca `conversion.js`. La lÃ³gica de venta no se distribuye. |
| 2 | **NingÃºn tool carga `apps-data.js`** | Scripts de `tools/tarot-journal.html`: `shared.min.js`, `conversion.min.js`, `analytics-bridge.js`, `atomic-tools.js`. Sin `apps-data` â†’ `getAppsData()` devuelve `null` en el 100% de las pÃ¡ginas de herramienta. |
| 3 | **Los libros nunca se promocionan** | Cero CTAs de libros en pÃ¡ginas de herramienta. El pedido del negocio ("apps **y** libros") no estÃ¡ cubierto. |
| 4 | **`toolAppMap` tiene datos falsos** | 10 entradas hardcodeadas con IDs de Play Store **inexistentes** (`com.chaosmagick.*`, `com.cha0smagick.norone`, â€¦) y precios inflados (`$4.99` cuando el real es `$3.99`). El fallback "app aleatoria" endosaba apps irrelevantes. |
| 5 | **Un solo CTA, sin secuencia** | Una sola secciÃ³n inyectada. No hay pre-resultado, ni post-resultado, ni libro, ni herramientas relacionadas. No es un funnel, es un banner. |

### Root cause principal
`package.json` tiene `prebuild` â†’ `build:js` (esbuild), pero `conversion.min.js` quedÃ³ viejo. **Un `npm run build:js` ya arreglarÃ­a el defecto #1** â€” pero sin los defectos #2â€“#5 arreglados el funnel seguirÃ­a siendo irrelevante o falso.

---

## 2. Decisiones de diseÃ±o (ya tomadas)

- **NO tocar los 62 archivos HTML de `tools/`.** Se extiende el motor `conversion.js`, que ya se carga en todas ellas.
- **Un solo archivo de datos nuevo**: `data/tool-funnels.json`, descargado en runtime â†’ el usuario edita funnels sin tocar JS.
- ResoluciÃ³n de URL: `new URL('../data/tool-funnels.json', window.location.href)` â†’ funciona a cualquier profundidad.
- **Nunca** app aleatoria. Si una herramienta no encaja semÃ¡nticamente: `"apps": []`.
- Todo el CSS nuevo dentro de `injectStyles()` (patrÃ³n existente, evita un segundo build de CSS).
- Eventos GA vÃ­a el helper `track()` existente: `tool_funnel_view`, `tool_funnel_click` con `product_type` (`app|book`) y `product_id`.
- Precios en el JSON limpios: `"$3.99"` (sin ` USD`, sin `(60% off)`).
- Todo el output en UTF-8 vÃ¡lido.

### Contrato de datos (`data/tool-funnels.json`)
```jsonc
{
  "version": 1,
  "generated": "YYYY-MM-DD",
  "products": {
    "apps":  [ { "id": "norse-rune-oracle", "name": "â€¦", "price": "$3.99", "url": "https://play.google.com/â€¦?utm_â€¦" } ],
    "books": [ { "id": "tarot-chaos-pdf", "name": "â€¦", "price": "$9.99", "page": "../books/tarot-chaos-pdf.html", "checkout": "https://pay.hotmart.com/â€¦", "language": "es" } ]
  },
  "angles": { "Tarot": { "es": { "head": "â€¦", "sub": "â€¦" }, "en": { "head": "â€¦", "sub": "â€¦" } } },
  "tools":  { "tarot-journal": { "category": "Tarot", "lang": "es", "apps": ["unofficial-rider-waite-tarot"], "book": "tarot-chaos-pdf", "related": ["tarot-card-reference", "tarot-spread-builder"] } }
}
```
Tokens permitidos en el copy de `angles`: `{{tool}}` y `{{book}}` (sustituciÃ³n en runtime).

### El funnel de 4 pasos que se inyecta en cada herramienta
1. **Pre-resultado** â€” pitch de la app, antes de que el usuarioopie el resultado.
2. **Post-resultado** â€” CTA de la app **correcta** con precio y URL reales (resultado del catÃ¡logo, no hardcodeado).
3. **Libro** â€” secciÃ³n nueva con la pÃ¡gina de venta `../books/<id>.html` + checkout de Hotmart.
4. **Herramientas relacionadas** â€” fila de cross-sell a 3 sister tools.

---

## 3. Tareas atÃ³micas

### T1 â€” `scripts/build-tool-funnels.mjs` âœ… DONE
Genera `data/tool-funnels.json` de forma reproducible.
- EvalÃºa `js/apps-data.js` en un sandbox `node:vm` â†’ extrae `appsData` (12) y `booksData` (7).
- Normaliza precios: quita ` USD` y `(NN% off)`.
- Contiene el **mapping autoral de 61 herramientas** â†’ apps + libro.
- Contiene los **14 Ã¡ngulos de categorÃ­a** (ES/EN).
- **Valida en build-time**: todo slug de `tools.*` debe existir como `.html` en `tools/`; todo app id y book id referenciado debe existir en el catÃ¡logo. Falla ruidosamente si hay un orphan.
- Idioma: `es` para las 40 Gen1, `en` para las 21 Gen2.

### T2 â€” Correr el build y verificar
```powershell
node scripts/build-tool-funnels.mjs
```
Assert: JSON vÃ¡lido, 61 entradas, 0 slugs huÃ©rfanos, 0 ids de producto inexistentes.

### T3 â€” Parchear `js/conversion.js` âœ… BLOQUEANTE
AÃ±adir dentro del IIFE:
- `TOOL_FUNNELS_URL` + `loadToolFunnels()` â€” fetch + cachÃ© en `window.__cmToolFunnels`.
- `getToolSlugFromPath()` â€” extrae el slug de `/tools/<slug>.html`.
- `injectToolAppPitch(slug, entry, products)` â€” paso 1 (pre-resultado).
- `injectToolUpgradeCTA(...)` â€” **reescribir** para usar el producto del catÃ¡logo, con copy por Ã¡ngulo (paso 2).
- `injectBookCTA(book, entry, products)` â€” NUEVO, paso 3.
- `injectRelatedTools(slug, entry)` â€” NUEVO, paso 4.
- `wireFunnelTracking()` â€” GA `tool_funnel_view` / `tool_funnel_click`.
- CSS de `.cm-book-cta`, `.cm-funnel-related`, `.cm-tool-pitch` dentro de `injectStyles()`.
- **Reescribir `case 'tools':`** para usar el catÃ¡logo; conservar `injectLeadMagnet`.

### T4 â€” Arreglar 3 strings mojibake en `injectToolUpgradeCTA`
`Ã‚Â¿Te gustaâ€¦` â†’ `Â¿Te gustaâ€¦` Â· `ObtÃƒÂ©n` â†’ `ObtÃ©n` Â· `pago ÃƒÂºnico` â†’ `pago Ãºnico`.
(Verificado leyendo el archivo como bytes UTF-8: exactamente 3 secuencias corruptas. El em-dash sÃ­ estÃ¡ bien.)

### T5 â€” Rebuild de `conversion.min.js` âœ… BLOQUEANTE
```powershell
npm run build:js
```
Assert: el `.min.js` nuevo contiene `tool_funnels` y `injectBookCTA`.

### T6 â€” Smoke test headless (DOM)
Cargar con `node:vm` + DOM stub:
- 1 tool Gen1 ES (`tools/tarot-journal.html`)
- 1 tool Gen2 EN (`tools/sigil-generator.html`)

Assert en cada una: existe `#cm-cta-tool-upgrade` con `href` de Play Store real y precio correcto; existe `#cm-cta-book`; existen â‰¥2 links en `.cm-funnel-related`; los href de libro apuntan a un `books/*.html` que existe en disco.

### T7 â€” Verificar los 61 slugs
Cruzar `Object.keys(tools.*)` contra `readdirSync('tools/')`. Report: N resueltos / N huÃ©rfanos.

### T8 â€” Funnel en `tools/index.html`
Hoy solo recibe lead magnet. AÃ±adir: grid de apps + grid de libros desde el mismo JSON, para que el Ã­ndice de herramientas tambiÃ©n venda.

---

## 4. Criterios de aceptaciÃ³n

- [ ] `data/tool-funnels.json` existe, es JSON vÃ¡lido, cubre los 61 tools, 0 orphans.
- [ ] Las 12 apps del catÃ¡logo con precio y URL de Play Store **reales**.
- [ ] Los 7 libros con pÃ¡gina de venta **existente** + checkout Hotmart.
- [ ] `js/conversion.min.js` contiene la lÃ³gica nueva.
- [ ] Un tool Gen1 ES y uno Gen2 EN renderizan app CTA + book CTA + relacionadas.
- [ ] 0 strings mojibake en el output.
- [ ] Eventos GA `tool_funnel_view` y `tool_funnel_click` se disparan.
- [ ] `tools/index.html` vende.
- [ ] NingÃºn tool recibe una app aleatoria irrelevante.

---

## 5. Riesgos

| Riesgo | MitigaciÃ³n |
|--------|------------|
| `fetch` del JSON falla (file://, offline) | Todo wrapped en `try/catch`; si falla, el funnel degrada a *cero* CTA â€” nunca a una app falsa. |
| Un tool nuevo se aÃ±ade a `tools/` sin entrada en el JSON | T1 valida en build-time y **falla**. AdemÃ¡s `conversion.js` tiene un fallback: sin entrada â†’ solo libro por categorÃ­a, sin app. |
| Prices desincronizados de `apps-data.js` | T1 **deriva** el bloque `products` de `apps-data.js`; nunca se escriben a mano. |
| Doble inyecciÃ³n si `run()` se llama 2 veces | Todos los injectores guardados por `id` y con guard `if (document.getElementById(...)) return;`. |
