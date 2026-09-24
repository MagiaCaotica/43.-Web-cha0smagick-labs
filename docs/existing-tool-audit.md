# Auditoría de herramientas existentes y matriz de mejora

**Estado:** diagnóstico inicial — no modifica componentes de GitHub  
**Alcance:** páginas HTML en `tools/`, excluyendo `tools/index.html` como página de colección  
**Fecha:** 2026-09-24

## Resumen ejecutivo

El sitio tiene una base técnica consistente para un proyecto estático de GitHub Pages. Las 21 páginas de herramientas comparten una identidad visual, navegación, scripts de conversión y una estrategia de embudo hacia las apps. La auditoría no autoriza cambiar bundles compartidos ni componentes de GitHub sin una prueba de regresión.

### Hallazgos globales

- **21 herramientas + 1 índice:** todas las páginas tienen `<title>`, `description`, canonical, un H1 y JSON-LD (`WebApplication` o `CollectionPage`).
- **12 descripciones** exceden el rango recomendado de 70–160 caracteres o son demasiado cortas; deben reescribirse para intención ybersearch concreta.
- **10 páginas contienen mojibake** o caracteres de reemplazo: `activador-servidores`, `astrology-sign-calculator`, `candle-color-calculator`, `digital-pendulum`, `iching`, `lunar-phase`, `sigil-generator`, `spell-builder`, `tengwar-transcriber` y `viking-runes`.
- **Claims de riesgo:** aparecen_terms como “100%”, “verified”, “accurate”, “exact” y “always”; se deben convertir en claims descriptivos y verificables, nunca en promesas de resultado.
- **Formularios:** solo `reality-check-tracker` usa un `<form>` completo; el resto depende de contenedores/inputs aislados. La mejora debe añadir labels,fieldset, estados de error y soporte de teclado sin romper el comportamiento actual.
- **FAQ:** 19/21 páginas tienen sección FAQ; `gnosis-timer` y `sigil-charging-timer` requieren una.
- **Esquema:** todas las páginas tienen JSON-LD, pero deben normalizarse a `WebApplication` con `offers`, `isAccessibleForFree`, `applicationCategory`, `operatingSystem` y `description`; los datos de `AggregateRating` solo se conservan si existe evidencia real.
- **Scripts:** todas las páginas tienen script inline y enlaces a `shared.min.js`/`conversion.min.js`. Se preservarán; las herramientas nuevas usarán un motor compartido separado.
- **Índice:** `tools/index.html` contiene cinco tarjetas `coming-soon`; deben convertirse en enlaces funcionales o quedar explícitamente marcadas como roadmap.
- **GitHub:** existe `.github/` y el `package.json` declara el repositorio `MagiaCaotica/43.-Web-cha0smagick-labs`. No se editarán workflows, bots, servicios de GitHub ni scripts compartidos durante la ampliación.

## Matriz de auditoría y remediación

Prioridad **P0** = antes de publicar o indexar; **P1** = siguiente lote; **P2** = optimización posterior.

| Página | Dominio / función | Calidad UX | SEO/GEO | ASO / conversión | Riesgo | Prioridad y acción |
|---|---|---|---|---|---|---|
| `astrology-sign-calculator.html` | Calculadora de signos | Inputs identificados, layout denso, mojibake | Título existe; description larga; schema básico | CTA premium ya visible; claims de precisión | P0 | P0: corregir encoding, description, claims, formulario y FAQ de zona horaria. |
| `activador-servidores.html` | Activador/servidor | Controles plentiful, sin form semántico | Description larga; encoding roto | CTA existente; `Offer`/`AggregateRating` sin evidencia visible | P0 | P0: corregir encoding, retirar rating no verificable, aclarar que es ritual simbólico. |
| `candle-color-calculator.html` | Color de vela | Calculadora simple, sin `<form>` | Description larga; FAQ presente | CTA existente; claims de exactitud | P1 | P1: convertir a form, acortar description, explicar criterios y límites. |
| `digital-pendulum.html` | Péndulo digital | Control principal y resultados; mojibake | Metadatos completos; description larga | CTA existente; claims de exactitud | P0 | P0: reparar encoding, separarandom/registro, cambiar claims por “lectura simbólica orientativa”. |
| `gnosis-timer.html` | Timer de gnosis | Timer con controles, sin FAQ | Metadatos completos; sin FAQ | CTA existente; claims de certeza | P1 | P1: añadir FAQ, estados de inicio/pausa, control de reduced motion y copy no predictivo. |
| `goetic-spirit-selector.html` | Selector de espíritus goéticos | Filtros y resultados; funciona como consulta | Description larga; claims de exactitud | CTA existente; contenido de apoyo | P1 | P1: explicitar criterio de filtrado, separar dato histórico de interpretación y corregir claims. |
| `iching-changing-lines.html` | Simulador I Ching | Tiradas y cambios; sin form | Buen título/description | CTA existente; claims de autenticidad | P1 | P1: documentar algoritmo y método, mantenerlo como simulación, añadir FAQ breve. |
| `iching.html` | Oráculo I Ching | Hexagramas yACTIONS; mojibake | `Offer`/`AggregateRating` requiere evidencia | CTA existente; claims de exactitud | P0 | P0: corregir encoding, retirar rating no verificable y describir la herramienta como tirada simbólica. |
| `lunar-phase.html` | Fase lunar | Visualización y tabla; mojibake | Description corta; schema completo | CTA existente; claims de exactitud | P0 | P0: reparar encoding, documentar算法/timezone y ampliar description. |
| `moon-voc.html` | VOC lunar | Fecha, hora y selects; claims amplios | Description larga | CTA existente; monetización de referencia | P1 | P1: documentar zona horaria,|source method y usar “referencia astronómica orientativa”. |
| `planetary-hours.html` | Horas planetarias | Fecha, hora y selects; falta de contexto | Description larga | CTA existente; claims de exactitud | P1 | P1: explicar latitud/longitud, fuente de efemérides y limitations. |
| `planetary-kamea-sigil.html` | Sigil Kamea planetario | Controles extensos, sin form | Description demasiado larga | CTA existente; claims de precisión | P1 | P1: reducir description, separar tradition de creative generation, labels y FAQ. |
| `reality-check-tracker.html` | Entrenamiento de reality checks | Único `<form>` completo; tracking local | Description larga | CTA existente; `Real` no es claim problematico aquí | P1 | P1: conservar localStorage, añadir export/clear consent y estados vacíos. |
| `rune-drawer.html` | Elder Futhark | Tiradas y resultados; sin form | Metadatos sólidos | CTA existente; claims de exactitud | P1 | P1: declarar aleatoriedad local y与传统 meanings, añadir FAQ de interpretación. |
| `sigil-charging-timer.html` | Timer de carga | Inputs, selects y timer; sin FAQ | Description larga | CTA existente; claims de certeza | P1 | P1: añadir FAQ, separar ritual de resultado, corregir claims y persistencia opcional. |
| `sigil-generator.html` | Generador de sigilos | Resultado local; mojibake | `Offer`/`AggregateRating` no demostrados | CTA existente; claims “verified” | P0 | P0: reparar encoding, retirar rating/claims y documentar algoritmo criptográfico sin建房含义. |
| `spell-builder.html` | Constructor de hechizos | Controles y correspondencias; mojibake | Description demasiado larga | CTA existente; claims de exactitud | P0 | P0: reparar encoding, separar creative writing de instrucción ritual, acortar description. |
| `tarot-yes-no.html` | Tirada sí/no tarot | Entrada y resultados; no form | Metadatos sólidos | CTA existente; claims de certeza | P1 | P1: convertir a form, documentar barajado y replace “predicción” por “lectura simbólica”. |
| `tengwar-transcriber.html` | Transcripción Tengwar | Herramienta de texto; mojibake | Description demasiado corta | CTA existente; claims de exactitud | P0 | P0: reparar encoding, ampliar description, documentar limitations del alfabeto y claims. |
| `viking-runes.html` | Runas vikingas | Reference/drawer; mojibake | Metadatos sólidos; `Offer`/rating sin evidencia | CTA existente; claims de exactitud | P0 | P0: reparar encoding, retirar rating no verificable, separar runas históricas de interpretations. |
| `zener-esp-trainer.html` | Entrenamiento ESP | Secuencia, controles y scoring; sin form | Description demasiado larga | CTA existente; claims de exactitud | P1 | P1: documentar scoring, separar practice from prediction, añadir FAQ and reset. |

## Criterios de calidad para la ampliación

Cada página nueva o remediada debe cumplir:

1. **SEO técnico:** un H1, title de 50–60 caracteres, description de 120–155 caracteres, canonical absoluto, OG/Twitter, manifest y JSON-LD válido.
2. **GEO:** respuesta clara en los primeros 100–150 palabras, pasos numerados, FAQ original, datos/metodología declarados y límites de interpretación.
3. **UX:** navegación por teclado, labels visibles, `aria-live` para resultados, botones con estado disabled, responsive layout y no dependence on color alone.
4. **Privacidad:** cálculos y registros locales por defecto; ningún dato de nacimiento, nombre, sueño o journal se envía a un servidor sin acción explícita.
5. **Seguridad:** escaping de entrada/salida, sin HTML arbitrario, no collected analytics inside calculator state, y copy de no predicción/no consejo médico, legal o financiero.
6. **Monetización:** CTA posterior al resultado, no antes de entregar la función gratuita; mostrar apps/libros como próximos pasos, sin miedo, culpa ni presión.
7. **QA:** prueba de interacción en Chromium, validación de teclado, responsive check, sin errores de consola y enlaces internos verificados.

## Orden de remediación

- **P0:** corregir mojibake, claims no verificables, `AggregateRating` sin evidencia y descripciones defectuosas.
- **P1:** normalizar formularios/labels, FAQ, copy de resultados, timezone/algoritmo y estados vacíos.
- **P2:** mejorar rendimiento de scripts inline, SEO interno, ASO de página y medición de funnel.
- **Antes de publicar cada herramienta:** ejecutar Lighthouse/axe o equivalente, prueba Playwright del flujo principal y revisión de enlaces.

## Componentes protegidos

No modificar durante esta fase sin una migración separada:

- `.github/`, workflows, bots y servicios GitHub.
- `js/shared.js`, `js/shared.min.js`, `js/conversion.js`, `js/conversion.min.js` y sus pipelines.
- `sw.js`, `manifest.json` y cualquier integración de Analítica/Ads/P Meta existente.
- `_verify_nde_tmp.py` (archivo no rastreado preexistente).

La ampliación de herramientas debe vivir en componentes independientes (`tools/`, datos y motor de herramientas atómicas) y pasar las mismas pruebas de regresión antes de integrarse al índice.
