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

## Hallazgo que cambia el orden de prioridades (2026-11-07)

La página de la herramienta de sigilos **se hundió el 2026-10-28** y no se ha
recuperado. Comando: `python -c` sobre GSC, dimensión `date` y filtro `page`.

```
2026-10-16   63 impr   pos  7.3
2026-10-17   96 impr   pos  7.1
2026-10-22  128 impr   pos  6.8
2026-10-27   79 impr   pos  7.9
2026-10-28   18 impr   pos 19.4
2026-10-29    8 impr   pos 30.4
2026-11-04    5 impr   pos 19.6
```

No es solo esa página: el sitio entero pasó de 1.045 impresiones/día
(2026-10-26) a ~500 (2026-11-04). Las tres cosas que ocurrieron en las 72
horas previas:

1. 2026-10-24: enlazado interno masivo y 3 pillar pages.
2. 2026-10-27: +42 páginas deep-dive y +43 galerías dark-fantasy; sitemap
   regenerado con 986 URLs.
3. 2026-10-27: commit `c17858d6` (auditoría SEO/GEO/ASO).

Contexto externo: la spam update de septiembre corrió del 24-sep al 8-oct y
no hay actualización de octubre confirmada en el Search Status Dashboard.
La subida empezó el 16-oct (después de esa update) y el descenso el 28-oct,
así que la hipótesis principal es una reevaluación del sitio tras ampliar la
superficie indexable en ~85 páginas, no un cambio de algoritmo confirmado.

**Consecuencia:** no se persigue el top-3 hasta estabilizar. Perseguirlo
sobre una caída abierta confunde causa y efecto.

## Supuestos y cómo se comprueban

| Supuesto | Comprobación |
|---|---|
| El cluster puede llegar a top-3: ya está en 6,9 y 9,1 con 684 enlaces internos | `python scripts/seo/cluster-report.py` semanal; si la posición no baja de 6 en 6 semanas, se replantea |
| `app_store_click` ahora sí llega a GA4 (antes daba 0 por empujar solo a dataLayer) | GA4: `eventName=app_store_click`, últimos 7 días > 0. Si sigue en 0, el problema no era el bridge |
| Los ingresos se pueden medir: Play exporta CSV y Hotmart da API/CSV | `scripts/seo/revenue-report.py` imprime ventas por semana; si no hay export, el paso 2 queda bloqueado |
| Los títulos nuevos mueven CTR en las 4 consultas de página 1 sin clics | GSC el 2026-11-10: comparar CTR 7d antes/después de esas URLs |

## Pasos

### 0. Estabilizar antes de empujar (prioridad sobre todo lo demás)
- Archivos: las 42 páginas deep-dive y las 43 galerías `dark-fantasy/*`
  añadidas el 2026-10-27; `scripts/generate_sitemap.py`.
- Acción: auditar cuáles aportan contenido único (≥300 palabras propias y
  una intención de búsqueda distinta). Las que no, `noindex` y fuera del
  sitemap. No se añade ninguna página nueva hasta que la tendencia diaria
  deje de caer.
- Verificación: `python scripts/seo/cluster-report.py 7` dos semanas
  seguidas; las impresiones diarias del sitio dejan de bajar y la posición
  del cluster vuelve por debajo de 15. Comando diario:
  `python -c "..."` con la consulta `date` de GSC (ver hallazgo arriba).

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
