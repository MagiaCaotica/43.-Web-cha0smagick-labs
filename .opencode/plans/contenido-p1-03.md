# Plan de contenido — P1-03 (clusters que faltan y segunda capa de herramientas)

**Creado:** 2026-11-07
**Estado:** propuesto, pendiente de aprobación del dueño.
**Objetivo:** cubrir las consultas donde el sitio ya tiene impresiones pero no página
que las responda, sin repetir el error del 27-oct (publicar 85 páginas delgadas
de golpe). Medible en GSC por cluster, no por número de artículos.

## Hechos medidos (2026-11-07)

- 1.034 URLs indexables; 865 artículos; mediana 2.444 palabras.
- 0 páginas de herramienta por debajo de 480 palabras. **Las 48 no eran
  delgadas**: eran las que no enlazaban a su app. Ya corregido (70/70).
- `docs/audit-5000-usd-gap-2026-10-01.md`: faltan 145 artículos, 59 del cluster
  `servitors`; 13.926 de 132.029 impresiones históricas (10,5 %).
- La caída del 28-oct sigue abierta: 1.045 → ~500 impresiones/día.

## Decisiones

1. **No se reescriben las 48 herramientas.** Ya tienen contenido, FAQ, schema y
   rampa de compra. Reescribirlas sería churn sin evidencia. Se mejora una
   segunda capa solo en las 12 con más sesiones orgánicas (GA4 28d):
   `sigil-generator`, `zendigital-pendulum`, `gnosis-timer`, `iching`,
   `lunar-phase`, `rune-drawer`, `zener-esp-trainer`, `moon-voc`,
   `goetic-spirit-selector`, `planetary-hours`, `spell-builder`,
   `astrology-sign-calculator`.
2. **Los 145 artículos se producen por cluster, no por volumen.** Orden:
   `servitors` (59) → `goetia` (31) → `sigil` (22) → `astrología` (18) →
   `lunar` (15). Cada artículo responde una consulta con impresiones reales.
3. **Ninguna página nueva sin**: intención única, ≥1.200 palabras, 5+ enlaces
   internos a herramientas/apps, FAQ con schema, autor verificado y fecha.
4. **Ritmo máximo 10 por semana** hasta que la serie diaria de GSC deje de caer.
   Si vuelve a caer, se para y se audita antes de seguir.

## Fases y verificación

### Fase 1 — 12 herramientas, segunda capa (2 semanas)
- Archivos: las 12 páginas de `tools/` listadas arriba.
- Añadir por herramienta: un ejemplo resuelto, cómo interpretar el resultado,
  dos errores comunes y un enlace al libro/app que la complementa.
- Verificación: `python scripts/seo/cluster-report.py` (se amplía con las 12)
  y GA4: eventos `tool_complete` y `purchase_click` por página.

### Fase 2 — cluster servitors (59 artículos, 6 semanas)
- Archivos: `blog/servitor-*`, `blog/*servitor*`; enlaces desde
  `/tools/servitor-design-journal.html` y `/books/complete-practical-treatise-magical-servitors-pdf.html`.
- Verificación: GSC query→page para `servitor`, `servitor creation`,
  `magical servitor`; objetivo: posición media < 20 y CTR > 2 % en el cluster.

### Fase 3 — goetia y sigil (53 artículos, 6 semanas)
- Verificación: `python scripts/seo/cluster-report.py` para sigil; GSC para
  `goetia`, `72 spirits`, `goetic sigil`.

### Fase 4 — astrología y lunar (33 artículos, 4 semanas)
- Verificación: GSC para `birth chart`, `rising sign`, `moon phases`.

## Aceptación
- `python projects/scripts/audit-indexation.mjs` sigue en 0 contradicciones.
- `node scripts/seo/audit-jsonld.mjs` sigue en 0 problemas.
- `qa/ai-writing-auditor` pasado en cada lote antes de publicar.
- Ningún artículo nuevo con <1.200 palabras ni sin FAQ.
- La serie diaria de impresiones no cae más de un 10 % tras un lote.

## Riesgos
- Si la caída es una reevaluación de calidad, publicar 145 artículos la empeora.
  Por eso el ritmo y el freno están en el plan.
- Los 145 títulos son una estimación del gap, no una cuota. Si un cluster no
  tiene impresiones, no se escribe.

## Registro
- 2026-11-07: lote 1 de la Fase 2 publicado. Tres articulos nuevos con intencion
  distinta y sin duplicar los 25 existentes: servitor-sigil-binding.html
  (1.663 palabras), servitor-witchcraft.html (1.434) y
  servitor-names-and-feeding.html (1.505). Cada uno con Article + FAQPage +
  BreadcrumbList, 4 preguntas, referencias reales y enlaces a los articulos
  existentes. Pasado por qa/ai-writing-auditor y corregidas sus 10
  observaciones. Enlazados desde la herramienta de diseno de servidores.
  Verificado: JSON-LD 0 problemas, indexacion 0 contradicciones, 1.037 URLs.

- 2026-11-07 (lote 2): seis articulos mas, publicados y auditados:
  servitor-magick-for-money (1.258), servitor-for-protection (1.238),
  how-to-make-a-servitor-without-a-sigil (1.149),
  servitor-task-design-and-stop-conditions (1.150),
  servitor-journal-what-to-record (1.031) y
  servitors-and-ai-language-models (1.107).
  qa/ai-writing-auditor señalo dos defectos objetivos (TOC desincronizado y
  FAQ extra fuera de su seccion) y seis plantillas retoricas; corregidos.
  Cuatro quedan por debajo del minimo de 1.200 del plan y se registran como
  deuda: ampliar o aceptar el umbral. Total del cluster: 9 de 59.
