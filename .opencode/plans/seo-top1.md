# Plan — top-3 en el cluster de sigilos y medición de ingresos

**Creado:** 2026-11-07
**Objetivo medible:** que `/tools/sigil-generator.html` entre en el top-3 de
`sigil maker` y `sigil generator` (hoy posiciones 6,9 y 9,1) y que el cluster
duplique sus clics (hoy 86 en 28 días) antes del 2027-02-07. Medir ingresos
netos por semana, no estimarlos.

## Hechos verificados (2026-11-07)

Comando: `python scripts/seo/cluster-report.py`

```
Sitio entero: 16,125 impr / 424 clics / CTR 2.63% / pos 17.8
  anterior :  4,111 impr / 157 clics / CTR 3.82% / pos 11.7

/tools/sigil-generator.html                  1304 impr  79 clics  6.06%  pos 8.4  links 684
/sigil-maker.html                               0 impr   0 clics           pos 0.0  links  83
/blog/sigil-maker-ultimate-guide.html           9 impr   0 clics           pos 44.9 links  50
/blog/sigil-creator-online-free-vs-premium    63 impr   0 clics           pos 34.1 links  45
/blog/free-sigil-generator-vs-chaos-sigil...   22 impr   0 clics           pos 50.2 links  51
/blog/how-to-charge-sigil-correctly.html       67 impr   3 clics           pos 7.6  links  47

sigil maker 198 impr 8 clics pos 6.9 | sigil generator 132 impr 8 clics pos 9.1
chaos magic sigil generator 27 impr 4 clics pos 6.6 | sigil creator 52 impr 4 clics pos 12.6
```

GA4 (propiedad `Cha0smagick Labs`, 521860259), 2026-10-09 → 2026-11-06:
650 sesiones, 301 orgánicas, 15 eventos de checkout, 0 ingresos registrados.
El 31 % de las sesiones vienen de Singapur y China sin ninguna conversión.

Play público (2026-11-07): 12 fichas vivas; solo Sigil Maker tiene
valoraciones (5,0 con 23); PSI GYM $2,99 y Lucid Dream $8,99 ya corregidos
en el sitio.

## Supuestos y cómo se comprueban

| Supuesto | Comprobación |
|---|---|
| El cluster puede llegar a top-3: ya está en 6,9 y 9,1 con 684 enlaces internos | `python scripts/seo/cluster-report.py` semanal; si la posición no baja de 6 en 6 semanas, se replantea |
| `app_store_click` ahora sí llega a GA4 (antes daba 0 por empujar solo a dataLayer) | GA4: `eventName=app_store_click`, últimos 7 días > 0. Si sigue en 0, el problema no era el bridge |
| Los ingresos se pueden medir: Play exporta CSV y Hotmart da API/CSV | `scripts/seo/revenue-report.py` imprime ventas por semana; si no hay export, el paso 2 queda bloqueado |
| Los títulos nuevos mueven CTR en las 4 consultas de página 1 sin clics | GSC el 2026-11-10: comparar CTR 7d antes/después de esas URLs |

## Pasos

### 1. Seguimiento semanal del cluster
- Archivo: `scripts/seo/cluster-report.py` (ya creado).
- Verificación: `python scripts/seo/cluster-report.py` imprime la tabla de
  arriba con la ventana de la fecha de ejecución.

### 2. Medir ingresos netos por semana
- Archivos: `scripts/seo/revenue-report.py` (nuevo), leyendo los CSV de
  `projects/salesreport_*.csv` y los exports de Hotmart.
- Debe imprimir: pedidos, bruto, comisión, reembolsos y neto por semana, y
  cruzarlo con `purchase_click` de GA4.
- Verificación: `python scripts/seo/revenue-report.py --weeks 8` con salida
  real de al menos una semana con pedidos (hoy octubre solo tiene 2 filas:
  el export está incompleto y hay que rehacerlo).

### 3. Reforzar el cluster hacia top-3
- Archivos: `tools/sigil-generator.html`, los 3 artículos del cluster.
- Acciones: enlazar desde la herramienta a los 3 artículos (hoy el enlace va
  en un solo sentido) y añadir un bloque "sigue leyendo" con anclas exactas
  de las consultas (`sigil maker`, `sigil generator`).
- Verificación: `python scripts/seo/cluster-report.py` debe subir la columna
  `links` de los artículos y bajar `pos` de `sigil maker` por debajo de 5.

### 4. Confirmar que la conversión se mide
- Archivo: `js/analytics-bridge.js` (ya corregido: llama a `gtag('event')`).
- Verificación: en GA4, `app_store_click` > 0 en los últimos 7 días y
  `purchase_click` por página incluye `/apps/chaos-sigil-generator.html`.
  Comando: `powershell -File` del script de consulta GA4 ya usado en esta
  sesión (`ga_clicks.ps1`).

### 5. GEO: datos citables
- Archivos: `llms.txt`, `llms-full.txt`, una página nueva de datos
  (`/apps/` ya sirve) con precios, plataformas y recuento exacto de reseñas.
- Verificación: `curl -s https://cha0smagicklabs.com/llms.txt | grep -c '\$2\.99'`
  devuelve > 0 y el sitemap incluye la URL nueva.

### 6. Fuera del alcance de este plan
- Conseguir valoraciones en las otras 11 apps: depende de pedirlas dentro de
  la app (Play In-App Review), no de la web.
- Publicidad pagada: sin unit economics medidos, no se activa.
- `aggregateRating` para apps sin reseñas: prohibido por la política de
  Google y por verdad; no se hará.

## Registro
- 2026-11-07: corregidos precios (PSI $2,99, Lucid $8,99), eliminados 16
  bloques de rating inventado, sustituidas las reseñas falsas de la portada,
  arreglado el envío de eventos del bridge a GA4 y añadido bloque de compra
  en 9 páginas con tráfico y cero eventos clave. 21/21 comprobaciones en vivo.
