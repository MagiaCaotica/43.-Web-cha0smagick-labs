# SEO Technical Remediation Report

**Version:** 0.1.0-local  
**Evidence date:** 2026-09-24  
**Owner:** SEO / Web  
**Status:** `IN_PROGRESS` — metadata local remediada; accesibilidad y datos de buscadores pendientes

## Scope

Auditoría reproducible sobre la misma superficie gobernada usada por `scripts/verify_tech_debt.py`: 529 archivos HTML, excluyendo `.git`, `node_modules`, `projects`, `auto-shorts` y `.github`. La cifra no es una medición de indexación ni de Rich Results.

## Metadata before/after

| Signal | Antes de la pasada local | Después de la pasada local | Método |
|---|---:|---:|---|
| Missing description | 2 | 0 | Escaneo de `<meta name="description">` en 529 HTML gobernados |
| Missing hreflang | 9 | 0 | Escaneo de `<link ... hreflang>` en 529 HTML gobernados |
| Missing canonical | 10 | 0 | Escaneo de `<link ... rel="canonical">` en 529 HTML gobernados |

Archivos corregidos con metadata específica:

- `checklist-ventas.html`
- `lead-magnet/guia-rapida-magia-caos-es.html`
- `landing-pages/affiliate-dashboard.html`
- `landing-pages/affiliate-terms.html`
- `landing-pages/apps-bundle.html`
- `landing-pages/books-bundle.html`
- `landing-pages/complete-access.html`
- `landing-pages/flash-sale.html`
- `lead-magnet/quickstart-guide-chaos-magick-en.html`
- `pages/app-details.html`

No se cambiaron precios, claims, botones, URLs de checkout ni estados externos. Las páginas bloqueadas siguen bloqueadas.

## Outstanding accessibility findings

El escaneo local heredado reporta:

- `missing_alt`: 180
- `empty_alt`: 270
- heading skips: baseline previo de 190, pendiente de recomputar con un parser válido

Estos números no se corrigen mediante sustitución global porque una imagen decorativa puede requerir `alt=""` y una imagen informativa necesita una descripción real. Cada excepción requiere inspección de la imagen, contexto visible, responsive behavior y revisión de teclado/screen reader. El auditor existente no pudo cargar `https://cha0smagicklabs.com/css/style.min.css` y mostró errores de contexto `window/document`; su total de 0 violaciones no se interpreta como aprobación de producción.

## Remaining external evidence

- Search Console y Bing Webmaster exports;
- Rich Results y Lighthouse field data;
- Core Web Vitals de campo;
- revisión de canonical/hreflang recíproco en el dominio publicado;
- before/after de tráfico, assisted revenue y revenue orgánico.

## Acceptance state

Este artefacto no cierra P1-01. La evidencia local satisface la remediación mecánica de metadata, pero no sustituye la medición de buscadores, la accesibilidad manual ni la prueba en navegador real.
