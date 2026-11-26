# Plan atómico: mover la web al dinero (goetia, astral, astrología)

Fecha: 26 nov 2026 · Base: `docs/analisis-keywords-2026-11-26.md` · Auditoría: `tmp_audit` → abajo, línea base.

## Objetivo

Que las páginas que ya cubren las keywords caras (goetia $11,15 CPC · astral $2,81 · astrología $1,65) tengan una salida comercial. Hoy no la tienen.

## Línea base (auditada, no supuesta)

288 keywords de dinero (vol ≥ 500 o CPC ≥ $2) se reparten en 53 páginas. De esas, **9 no tienen bloque de conversión**:

| Página | Valor pub./mes | Vol/mes | CTA | Inlinks |
|---|---|---|---|---|
| `blog/birth-chart-app-accuracy-comparison.html` | $21.472 | 1.286.300 | sí (solo Play, sin pack) | **9** |
| `blog/72-goetia-demons-complete-list.html` | $17.516 | 69.500 | **no** | 184 |
| `blog/how-to-make-a-servitor-without-a-sigil.html` | $317 | 10.500 | **no** | **4** |
| `tools/full-birth-chart.html` | $258 | 10.500 | no | 89 |
| `horoscope-app.html` | $30 | 1.000 | no | 6 |
| `birth-chart-app.html` | $24 | 500 | no | 6 |
| `tools/astrology-sign-calculator.html` | $15 | 500 | no | 49 |
| `tools/moon-phase-calendar.html` | $13 | 500 | no | 30 |
| `tools/zodiac-cusp-calculator.html` | $5 | 5.000 | no | 6 |

Dos bugs estructurales encontrados en la auditoría:

- **`tools/full-birth-chart.html`, `tools/zodiac-cusp-calculator.html` y `tools/moon-phase-calendar.html` tienen `<html lang="es">` con título en español y canonical propio en una URL inglesa.** Sirven keywords inglesas con página española. No rankean para `birth chart calculator` porque no dicen `birth chart` en ninguna parte del `<head>`.
- **La página de goetia tiene 184 enlaces internos entrantes y cero salida comercial.** Es el activo de autoridad más grande del sitio, apuntando a la keyword más cara.

## Fases atómicas

| # | Problema | Solución | Archivo | Verificación |
|---|---|---|---|---|
| 1 | `goetia` (50K/mes, $11,15 CPC) llega a una página sin oferta | Bloque CTA contextual: Arcana Goetia $3,99 (primario) + pack $29,99 (secundario), con prueba de objeciones (offline, pago único, sin cuenta) | `blog/72-goetia-demons-complete-list.html` | grep: `play.google.com/store/apps/details?id=com.cha0smagick.sigilgeneratorfinal` + `pay.hotmart.com/N108147778I` presentes una vez; un `<h2>` nuevo; sin duplicar `id` |
| 2 | `goetia` no está al principio del `<title>`; el head no nombra el término cabeza | `<title>` → `Goetia: The 72 Demons of Solomon, Ranks and Sigils` (≤ 62 car.) y `description` con `goetia` + `72 demons` | ídem | grep del `<title>` nuevo; longitud ≤ 62 |
| 3 | `how to make a sigil` (10.500/mes) cae en una página sin ninguna salida | Bloque CTA: Chaos Sigil Generator $3,99 (primario) + Codex Chaoticus $4,99 (secundario) | `blog/how-to-make-a-servitor-without-a-sigil.html` | grep: `id=com.app.goetiansealsgeneratorapp` + `pay.hotmart.com/W106595764X` |
| 4 | `birth-chart-app-accuracy-comparison` cubre 1,28M búsquedas y solo recibe 9 enlaces internos | Enlace contextual desde 3 páginas del cluster astrología con más autoridad | `blog/natal-astrology-chart-reading-guide.html`, `blog/big-three-explained.html`, `blog/moon-sign-astrology-guide.html` | grep: `birth-chart-app-accuracy-comparison.html` aparece 1 vez en cada una |
| 5 | Tres herramientas en español sirven keywords inglesas | **Decisión pendiente del dueño**: (a) traducir a inglés y mover la versión ES a `es/tools/`, o (b) dejarlas como ES y re-apuntar el contenido inglés a páginas nuevas. No se toca sin decisión: cambiar `lang` sin traducir el cuerpo sería mentirle a Google | — | — |
| 6 | Verificación final | Script que comprueba en los archivos tocados: 1 solo `<h1>`, canonical correcto, precios reales ($3,99 / $4,99 / $6,99 / $29,99), CTA presente y enlace vivo | `scripts/seo/verify-money-pages.mjs` | exit code 0 y salida con 0 fallos |

## Fases que NO se hacen en este plan (y por qué)

- **Escribir 5 páginas nuevas de astral.** Ya hay 27; el problema es profundidad y enlazado, no cantidad. Primero medir con Search Console.
- **Reescribir las 212 páginas de caos/sigilos.** No hay retorno: 2,2% del valor publicitario.
- **Mass-editar las 122 páginas de goetia.** Una página hub con 184 inlinks ya concentra la autoridad; añadir CTAs a las 122 diluye y rompe el estilo.

## Resultado de la ejecución (26 nov 2026)

| Fase | Estado |
|---|---|
| 1+2 · goetia: CTA + title + description | **hecho** |
| 3 · sigilos: CTA en `how-to-make-a-servitor-without-a-sigil` | **hecho** |
| 4 · enlaces entrantes a `birth-chart-app-accuracy-comparison` | **hecho** — una entrada `<li>` al final del `crossrefs-list` en `natal-astrology-chart-reading-guide`, `big-three-explained` y `moon-sign-astrology-guide` |
| 5 · tres herramientas ES con URL inglesa | **hecho** — ver detalle abajo |
| 6 · verificación | **hecho** — `node scripts/seo/verify-money-pages.mjs` → PASS, 0 fallos (blog + i18n + enlaces) |

### Fase 5 ejecutada: i18n de las tres herramientas

El supuesto del plan ("traducir copy y etiquetas del JS") era falso: el motor `js/atomic-tools.js` sirve 40 herramientas y tenía **145 cadenas en español dentro del código**, no solo en el JSON. Traducir tres páginas sin tocar el motor habría dejado un widget bilingüe.

Lo que se hizo, en capas:

1. **Motor con idioma** (`js/atomic-tools.js`): lee `<html lang>`, añade `T(es,en)` y traduce meses, signos, elementos, modos, regentes, nombres de fase, formato de fecha, los tres `KINDS` usados por estas páginas (`birth-chart`, `cusp`, `calendar`) y el chrome (botones, avisos, FAQ, errores). **Las ramas en español quedan intactas**: con `lang="es"` la salida es byte a byte la de antes.
2. **`DATA_URL` a ruta absoluta** (`/data/atomic-tools.json`): desde `/es/tools/` la ruta relativa `../data/` daba 404. Bug real que las copias en español destaparon.
3. **Overlay `en` en el JSON** para A01, A04 y A19: nombre, categoría, descripción, método, etiquetas de campo, resultado y aviso de seguridad.
4. **Tres páginas en inglés**: `tools/full-birth-chart.html`, `tools/zodiac-cusp-calculator.html`, `tools/moon-phase-calendar.html`. Título, meta, keywords, Open Graph, JSON-LD (WebApplication + FAQPage + breadcrumbs), hero, noscript, FAQ, deep-dive y CTA.
5. **Tres copias en español** en `es/tools/`, con canonical propio, rutas `../../` corregidas y hreflang recíproco (`en`, `es`, `x-default`) en las seis URLs.
6. **Sitemap**: 3 URLs nuevas + `lastmod` 2026-11-26 en las 3 inglesas.

Verificación real, en navegador (Playwright, servidor local propio), no solo grep:

| URL | Resultado |
|---|---|
| `/tools/full-birth-chart.html` | «Sun in … Moon in …» — EN |
| `/es/tools/full-birth-chart.html` | «Sol en …» — ES |
| `/tools/zodiac-cusp-calculator.html` | «Your Sun is in …» — EN |
| `/es/tools/zodiac-cusp-calculator.html` | «Tu Sol está en …» — ES |
| `/tools/moon-phase-calendar.html` | «Lunar calendar for March» — EN |
| `/es/tools/moon-phase-calendar.html` | «Calendario lunar de marzo» — ES |

Y regresión sobre 4 herramientas que siguen usando el motor en español (`astral-projection-session-timer`, `banishing-ritual-builder`, `dream-symbol-dictionary`, `consent-boundary-planner`): formulario renderizado, título español intacto, cero errores de página.

IndexNow: 200, 6 URLs enviadas.

## Riesgos

- Los volúmenes del CSV están duplicados por alias (7 keywords de 50K son la misma consulta). El orden de prioridad es correcto; la magnitud está inflada.
- No hay datos de Search Console: no sé en qué puesto está ninguna de estas páginas. Los cambios mejoran conversión y claridad de tema; no garantizan subir posiciones.
- El bloque CTA usa clases ya definidas en cada página (`cta-box`, `cta-button primary`). No se añade CSS nuevo.
