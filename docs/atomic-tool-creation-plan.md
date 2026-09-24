# Plan atómico para crear herramientas web gratuitas

**Proyecto:** Cha0smagick Labs  
**Ruta base:** `tools/`  
**Estado:** PLANIFICACIÓN — no implementado  
**Versión del plan:** 1.0  
**Fecha de elaboración:** 2026-09-24

> Este documento define **40 herramientas nuevas** para crear después de auditar y stabilizar las existentes. No es una afirmación de que ya estén publicadas. Cada herramienta se construye como una unidad pequeña, comprobable y reversible. No se deben modificar componentes de GitHub, workflows, bots, scripts de integración ni assets compartidos de terceros.

---

## 1. Objetivo y límites

### Objetivo

Construir una biblioteca de herramientas gratuitas, rápidas, privadas por defecto y útiles para resolver una intención concreta. La biblioteca debe funcionar como producto gratuito de entrada, con una salida opcional y transparente hacia las apps y libros del ecosistema.

### Límites no negociables

1. No se pisan ni sobrescriben las herramientas actuales salvo que exista una tarea de corrección separada.
2. No se modifican repositorios, enlaces, badges, workflows o automatizaciones que pertenezcan a GitHub.
3. Cada herramienta se declara como **simbólica, formativa, de entretenimiento o de reflective planning** cuando corresponda. No se promete que un resultado materialice deseos, prediga el futuro, cure enfermedades, sustituya consejo médico, legal o financiero, ni permita afirmar que una práctica se comunica con entidades.
4. Los datos de nacimiento, journaling, rituales y sesiones son locales al navegador salvo una decisión posterior explícita. No se envían a un servidor.
5. No se raspa contenido, imágenes, textos o datos de terceros. Las cartas, símbolos y textos propios se escriben desde cero o se usan con licencia/atribución comprobable.
6. No se publican ratings, testimonios, precios, usuarios o “verified purchaser” inventados.
7. La documentación de cada herramienta debe poder leerse sin ejecutar JavaScript: título, propósito, entrada, salida, limitaciones y advertencia visible.

---

## 2. Definición de “tool excellent”

Una herramienta solo se marca como terminada cuando cumple todos estos puntos:

- Resuelve una tarea concreta en menos de dos minutos.
- Tiene estado inicial, estado de cálculo, resultado, error y estado vacío cuando corresponda.
- Usa HTML semántico, teclado, foco visible, contraste suficiente, `label` para cada campo y mensajes asociados a errores.
- No depende de una librería de widgets para funcionar; la degradación sin red es parte del diseño.
- Conserva el estado no sensible en `localStorage` únicamente cuando la persistencia aporta valor.
- Tiene una explicación corta del método y un aviso de limitaciones cuando use aproximaciones, datos históricos o interpretación simbólica.
- Tiene título, descripción, canonical, Open Graph, Twitter Card, breadcrumbs y JSON-LD válido; `FAQPage` solo si las preguntas/respuestas están visibles.
- Tiene como máximo un CTA principal hacia una app/libro; no interrumpe la tarea con cuatro ventas simultáneas.
- Tiene prueba de lógica, prueba de interacción, prueba de accesibilidad básica y prueba de build.
- Está enlazada desde `tools/index.html`, `sitemap.xml` y un bloque actualizado de `llms.txt`.
- Pasa la checklist de la sección 8 antes de entrar en el índice.

---

## 3. Arquitectura prevista

La implementación futura debe añadir, sin reescribir el sistema compartido actual:

```text
tools/<slug>.html                 Página independiente de la herramienta
js/atomic-tools.js                Runtime compartido y estados de UI
js/atomic-tools.min.js            Bundle de producción, si el build lo exige
css/atomic-tools.css              Componentes visuales de las nuevas páginas
css/atomic-tools.min.css          Bundle de producción
data/atomic-tools.json            Registro central, textos, estados y versionado
scripts/atomic-tools.test.js      Pruebas de lógica y contratos
scripts/atomic-tools.e2e.spec.js  Pruebas de flujo crítico
```

Reglas de arquitectura:

- `js/shared.js`, `js/conversion.js`, `js/visitor-map.js` y sus bundles son **intactos** salvo que una tarea independiente demuestre una necesidad real.
- Cada página se registra en `data/atomic-tools.json` con `id`, `slug`, `category`, `title`, `description`, `priority`, `localStorageKey`, `related`, `appCta` y `bookCta`.
- Los cálculos de fecha, hora, zodiaco y efemérides se aíslan en funciones puras y se prueban por separado de la UI.
- Las operaciones locales usan una clave versionada, por ejemplo `cml:atomic:A01:v1`.
- Los textos de una herramienta se mantienen en el registro o en el módulo propio; no se duplican slogans en varias páginas.
- No se añaden recursos externos para fuentes, analítica, iconos o imágenes sin revisar licencia, rendimiento y privacidad.

---

## 4. Protocolo atómico común

Estos doce pasos se aplican **a las 40 herramientas**. Una tarjeta solo se marca `done` después de los doce.

1. **Congelar intención:** escribir el trabajo del usuario, la consulta de búsqueda y una promesa prudente en una frase.
2. **Cerrar alcance:** registrar entradas, salidas, estado local, límites y qué queda fuera de la primera versión.
3. **Elegir algoritmo:** seleccionar una fuente de datos o una función pura; documentar supuestos, zona horaria, fecha gregoriana, redondeo y casos límite.
4. **Construir la lógica:** implementar el cálculo sin DOM, con errores tipados o mensajes de error comprensibles.
5. **Construir la pantalla:** formulario, botones, estados, resultados, explicación,FAQ y CTA en HTML semántico.
6. **Capa de seguridad:** escapar texto generado por el usuario, no usar `eval`, no registrar secretos, no enviar datos personales y limitar el tamaño de lo importado.
7. **Capa de accesibilidad:** probar teclado, foco, `aria-live`, lectura de etiquetas, contraste, zoom y errores sin depender del color.
8. **SEO/GEO:** añadir metadata única, canonical, breadcrumbs, `WebApplication` o `ItemList` según corresponda, respuesta breve, metodología visible, FAQ real y `isAccessibleForFree: true`.
9. **Pruebas de lógica:** cubrir ejemplos conocidos, fechas límite, zona horaria, entrada vacía, valores grandes, texto Unicode, localStorage corrupto y datos de otro país.
10. **Pruebas de flujo:** comprobar carga, entrada, acción, resultado, reset, recarga, móvil, teclado y ausencia de errores de consola.
11. **Integración:** registrar en `tools/index.html`, `data/atomic-tools.json`, `sitemap.xml`, `llms.txt` y README; añadir enlace a blog/app/libro solo cuando el destino exista.
12. **Liberación:** ejecutar lint/typecheck si existe, pruebas, build de JS/CSS y una revisión manual final; conservar evidencia del resultado y anotarla en la ficha.

---

## 5. Backlog priorizado

### Tier 1 — intención de búsqueda y conversión inmediata

| ID | Slug | Resultado principal | Prioridad |
|---|---|---|---|
| A01 | `full-birth-chart` | Carta natal completa y posiciones planetarias | P0 |
| A02 | `rising-sign-calculator` | Ascendente aproximado | P0 |
| A03 | `moon-sign-calculator` | signo lunar | P0 |
| A04 | `zodiac-cusp-calculator` | fechas de inicio y fin de signos | P0 |
| A05 | `planetary-retrograde-calendar` | calendario de retrogradaciones | P0 |
| A06 | `planetary-day-calculator` | día planetario y hora lucky/symbolic | P0 |
| A07 | `tarot-card-reference` | referencia buscable de 78 cartas | P0 |
| A08 | `tarot-spread-builder` | reusable spread con posiciones | P0 |
| A09 | `tarot-journal` | journal local de tiradas | P1 |
| A10 | `lenormand-card-draw` | tirada original de cartas Lenormand | P1 |
| A11 | `sibilla-yes-no-oracle` | oracle sí/no no oficial | P1 |
| A12 | `pendulum-question-builder` | pregunta neutral y registro de respuestas | P1 |

### Tier 2 — correspondencia y práctica

| ID | Slug | Resultado principal | Prioridad |
|---|---|---|---|
| A13 | `elder-futhark-reference` | guía de runas Elder Futhark | P0 |
| A14 | `runic-name-translator` | transliteración de nombre a runas | P1 |
| A15 | `ogham-oracle` | consulta visual Ogham | P1 |
| A16 | `planetary-alphabet-cipher` | código alfabético planetario | P1 |
| A17 | `sigil-intention-encoder` | codificación A-I-K-B-E-K-A-R | P1 |
| A18 | `magical-correspondence-finder` | buscador de correspondencias | P0 |
| A19 | `moon-phase-calendar` | calendario anual lunar | P0 |
| A20 | `moon-intention-planner` | planificación lunar local | P1 |
| A21 | `planetary-hours-planner` | horarios planetarios por fecha/lugar | P0 |
| A22 | `ritual-timing-scorecard` | puntuación transparente de factores | P2 |
| A23 | `candle-intention-planner` | intención, color, tiempo y seguridad | P1 |
| A24 | `spell-ingredient-planner` | lista de ingredientes y sustitutos | P1 |
| A25 | `banishing-ritual-builder` | ritual simbólico imprimible | P2 |
| A26 | `elemental-balance-checker` | reflexión de equilibrio elemental | P2 |

### Tier 3 — seguimiento, organización y bienestar no clínico

| ID | Slug | Resultado principal | Prioridad |
|---|---|---|---|
| A27 | `lucid-dream-training-planner` | plan de práctica de sueños lúcidos | P1 |
| A28 | `reality-check-technique-coach` | guía de chequeos de realidad | P1 |
| A29 | `dream-symbol-dictionary` | diccionario reflexivo personal | P2 |
| A30 | `astral-projection-session-timer` | temporizador de práctica | P2 |
| A31 | `meditation-focus-timer` | temporizador de atención | P1 |
| A32 | `intention-achievement-tracker` | seguimiento de intentions y acciones | P1 |
| A33 | `ritual-safety-checklist` | checklist de seguridad ritual | P0 |
| A34 | `consent-boundary-planner` | límites y consentimiento de una práctica | P0 |
| A35 | `digital-grimoire-organizer` | grimoire local con búsqueda y exportación | P1 |
| A36 | `paranormal-session-prep-checklist` | preparación y protocolo de registro | P2 |
| A37 | `sigil-charging-planner` | práctica y registro de carga de sigil | P1 |
| A38 | `servitor-design-journal` | diseño, límites y revocación de un registro | P2 |
| A39 | `results-tracking-dashboard` | métricas personales sin promesa de resultado | P1 |
| A40 | `sabbat-season-planner` | calendario de estaciones/sabats | P2 |

---

## 6. Fichas atómicas por herramienta

Cada ficha hereda los 12 pasos de la sección 4. Los pasos indicados abajo son los pasos específicos que diferencian la herramienta y no pueden omitirse.

### A01 — Full Birth Chart

**Trabajo del usuario:** entender una lectura inicial de carta natal a partir de fecha, hora y lugar.  
**Entrada:** fecha, hora, ciudad/coordenadas, zona horaria y opción de mostrar casas.  
**Salida:** Sol, Luna, Ascendente, planetas, casas cuando el motor lo permita,.method y limitaciones.

1. Elegir y documentar un motor de efemérides browser-safe; no calcularEfemérides a mano.
2. Normalizar fecha, hora, zona y coordenadas antes de convertir a tiempo universal.
3. Implementar el cálculo puro y aislar el dibujo SVG/canvas de la capa de datos.
4. Crear tabla de posiciones, leyenda de casas y explicación de asíncronía/precisión.
5. Probar fechas conocidas, cambio de día, hora de verano y ubicaciones cerca de polos.
6. Incluir advertencia: resultado orientativo, no predicción ni evaluación científica.

**Done when:** una fecha conocida produce una salida estable, el timezone se muestra en el resultado y el usuario puede borrar sus datos con un botón.

### A02 — Rising Sign Calculator

**Trabajo del usuario:** calcular el Ascendente sin abandonar una explicación legible.  
**Entrada:** fecha, hora exacta, ciudad/coordenadas y zona horaria.  
**Salida:** signo del Ascendente, cálculo, grados aproximados y advertencia de sensibilidad horaria.

1. Reutilizar el motor de A01 mediante una función compartida, no copiar la implementación.
2. Exigir ciudad/coordenadas y mostrar la zona horaria activa.
3. Mostrar una advertencia destacada cuando la hora sea incierta o esté cerca de un cambio ascendente.
4. Añadir ejemplos de prueba para hora de nacimiento desconocida.
5. Enlazar a A01 y a la guía de signos sin duplicar la tabla zodiacal.
6. Verificar que “rising sign” sea la promesa principal en title, H1 y schema.

### A03 — Moon Sign Calculator

**Trabajo del usuario:** explorar el signo lunar con una explicación de método.  
**Entrada:** fecha, hora y zona horaria.  
**Salida:** signo lunar aproximado, transición si la fecha queda cerca de un cambio de signo y fecha de cálculo.

1. Implementar el cálculo con la misma base temporal de A01/A02.
2. Mostrar el instante exacto usado y la zona horaria, no solo el signo.
3. Detectar y explicar cambios de signo dentro del día.
4. Añadir prueba para fecha bisiesta, medianoche y cambio de zona.
5. Incluir un bloque “Moon sign ≠ diagnóstico psicológico”.
6. Conectar con A01, A19 y A20.

### A04 — Zodiac Cusp Calculator

**Trabajo del usuario:** saber si una fecha cae en un signo o en una zona cuspídea.  
**Entrada:** fecha de nacimiento o fecha consultada.  
**Salida:** signo, intervalo de fechas, porcentaje aproximado de distancia al cusp cuando aplique y advertencia de tablas variables.

1. Definir una tabla de límites con fuente, versión y zona horaria; no copiar una tabla sin atribución.
2. Implementar comparación de intervalos sin off-by-one.
3. Mostrar “no cusp” de forma clara cuando la fecha esté lejos del límite.
4. Probar 29/30/31 días, años bisiestos y ambos hemisferios.
5. Explicar que las fechas de cusp pueden variar según sistema astronómico.
6. Añadir FAQ visible sobre fecha de nacimiento y medianoche.

### A05 — Planetary Retrograde Calendar

**Trabajo del usuario:** consultar un calendario mensual de retrogradaciones con zona explícita.  
**Entrada:** mes, año y zona horaria.  
**Salida:** lista de planetas, fechas de inicio/fin, estado y fuente de efemérides.

1. Elegir efemérides versionadas y una estrategia de actualización documentada.
2. Generar el mes bajo demanda, con fallback de datos locales si no hay red.
3. Mostrar zona horaria, fecha de referencia y enlace a la fuente.
4. Añadir filtros por planeta y por mes.
5. Probar meses incompletos, cambios de zona y fechas de cambio.
6. Evitar afirmar que todo el planeta experimenta el mismo efecto psicológico.

### A06 — Planetary Day Calculator

**Trabajo del usuario:** convertir una fecha y hora local en el día planetario tradicional.  
**Entrada:** fecha, hora y zona horaria.  
**Salida:** día planetario, intervalo, método y uso simbólico opcional.

1. Definir el orden planetario y el inicio del día según la tradición elegida.
2. Exponer el cálculo en texto para que sea auditable.
3. Usar `Intl.DateTimeFormat` con zona explícita y fallback.
4. Probar 00:00, 23:59, cambio de día y año bisiesto.
5. Separar “tabla mágica” de cualquier afirmación de resultado.
6. Enlazar con A21, A22 y contenido de cálculo.

### A07 — Tarot Card Reference

**Trabajo del usuario:** consultar el significado de una carta sin_clickes infinitos.  
**Entrada:** búsqueda, arcana y palo.  
**Salida:** índice de 78 cartas, filtros, significado original y relacionados.

1. Escribir un dataset propio y revisable de 78 cartas, con derechos de arte separados.
2. Crear búsqueda tolerante a acentos, alias y nombres en español/inglés.
3. Implementar filtros combinables y estado vacío.
4. Añadir navegación por teclado y una URL de estado segura.
5. Publicar solo texto original o atribución/license; no incrustar arte ajeno.
6. Validar que cada carta tenga `ItemList` y datos Schema coherentes.

### A08 — Tarot Spread Builder

**Trabajo del usuario:** elegir una tirada, posiciones y carta de enfoque.  
**Entrada:** tipo de tirada, intención breve y cantidad de posiciones.  
**Salida:** plantilla de posiciones, selección aleatoria reproducible y printable layout.

1. Crear formatos 1/3/5/7 cartas con posiciones visibles y nombres editables.
2. Separar generador aleatorio de renderizado.
3. Ofrecer seed opcional para repetir una tirada sin claiming mystical causality.
4. Exportar imagen/texto limpio sin datos de terceros.
5. Probar teclado, móvil,orientation y reset.
6. Enlazar A07, A09 y el CTA de la app.

### A09 — Tarot Journal

**Trabajo del usuario:** guardar la interpretación y el contexto de una tirada.  
**Entrada:** fecha, pregunta, cartas, notas, mood y tags.  
**Salida:** registro local, búsqueda, edición, exportación y borrado.

1. Diseñar un esquema versionado y validar JSON importado.
2. Usar `localStorage` con una única clave namespaced y fallback si está deshabilitado.
3. Implementar búsqueda, tags, pagination y eliminación con confirmación.
4. Ofrecer export/import JSON y un aviso claro de que el archivo contiene datos personales.
5. No usar testimonial, nube, analytics de contenido ni telemetría de texto.
6. Probar migración de esquema, datos corruptos y storage deshabilitado.

### A10 — Lenormand Card Draw

**Trabajo del usuario:** hacer una tirada rápida de cartas Lenormand con significados editables.  
**Entrada:** pregunta, número de cartas y orden.  
**Salida:** cartas,Significados y una interpretación simbólica opcional.

1. Escribir un dataset propio de 36 cartas, con aviso de que no es el deck oficial.
2. Crear shuffle con `crypto.getRandomValues` cuando esté disponible.
3. Mostrar la baraja, el orden y la fecha sin fingir certeza.
4. Añadir interpretación separada de la extracción para que el usuario pueda editarla.
5. Probar baraja vacía, resultado repetido y viewport estrecho.
6. Añadir disclaimer cultural y de derechos de imagen.

### A11 — Sibilla Yes/No Oracle

**Trabajo del usuario:** obtener una respuesta simbólica rápida a una pregunta cerrada.  
**Entrada:** pregunta, nivel de detalle y baraja local.  
**Salida:** carta, significado, respuesta orientativa y registro opcional.

1. Crear prompts originales que no copien la editorial de un baraja comercial.
2. Limitar la pregunta a una sola frase y ofrecer una versión neutra.
3. Separar `yes`, `no`, `not-now` y `clarify`; no hide la incertidumbre.
4. Añadir semilla, repetición y texto de “no es prueba de verdad” fuera de la tarjeta.
5. Probar acentos, emojis, preguntas vacías y texto largo.
6. Conectar A12, A07 y A39.

### A12 — Pendulum Question Builder

**Trabajo del usuario:** preparar una consulta de péndulo neutral y registrar su práctica.  
**Entrada:** pregunta, opciones sí/no, intention y notas.  
**Salida:** pregunta revisable, plan neutral, registro de resultados y exportación.

1. Mostrar una regla de seguridad: no usar sobre medicación, personas sin consentimiento o para sustituir decisiones importantes.
2. Separar la pregunta escrita de la interpretación del movimiento.
3. Guardar solo si el usuario pulsa “guardar”; no crear una falsa sesión automática.
4. Añadir contador local, marcas de tiempo y una opción de no registrar.
5. Declarar que es una práctica de reflexión, no un instrumento científico.
6. Enlazar A11 y A31.

### A13 — Elder Futhark Reference

**Trabajo del usuario:** consultar runas, transliteraciones y significados de forma neutral.  
**Entrada:** búsqueda, forma de runa y categoría.  
**Salida:** ficha de runa, transliteración, keywords y relaciones.

1. Construir un dataset revisado con fuentes citadas y variantes separadas.
2. Mostrar varias grafías sin presentarlas como un único estándar universal.
3. Añadir búsqueda por sonido, símbolo y significado.
4. Generar una ruta de aprendizaje, no una “adivinación” automática.
5. Probar runas Unicode y nombres con caracteres composed/decomposed.
6. Añadir contenido sobre respectfully de los sistemas actuales.

### A14 — Runic Name Translator

**Trabajo del usuario:** convertir un nombre a runas de forma explicable.  
**Entrada:** nombre, sistema, fuente de caracteres y opción de invertir o no.  
**Salida:** transliteración, runas dibujadas y secuencia de pasos.

1. Definir un algoritmo de transliteración por grapheme/sonido, no por byte UTF-16.
2. Mostrar el mapping por carácter y la fuente de cada decisión.
3. Resolver espacios, acentos, ñ, hyphens y caracteres no soportados.
4. Generar SVG/canvas sin permitir inyección de HTML.
5. Probar nombres cortos/largos, Unicode yRTL.
6. Declarar que es una representación lingüística/simbólica, no predicción.

### A15 — Ogham Oracle

**Trabajo del usuario:** explorar una consultaOgham con símbolos y contexto.  
**Entrada:** pregunta, grupo, orientación y posición.  
**Salida:** símbolo, significado, lectura orientativa y registro opcional.

1. Crear dataset propio de grupos y audio visual/Unicode validado.
2. Mostrar la orientación elegida y permitir invertirla de forma explícita.
3. Mantener interpretación separada de la extracción aleatoria.
4. Añadir método, límites culturales y ausencia de garantía.
5. Probar navegadores sin fuente Ogham instalada.
6. Conectar A13, A14 y A17.

### A16 — Planetary Alphabet Cipher

**Trabajo del usuario:** convertir texto en un código alfabético-planetario reproducible.  
**Entrada:** texto, sistema y mayúsculas.  
**Salida:** tabla letra/número/planeta, código y exportación.

1. Definir el mapping A1Z26 y la correspondencia planetaria separada.
2. Mostrar cada sustitución para que el usuario pueda reproducirla.
3. Resolver espacios, números, puntuación y caracteres fuera de rango.
4. Generar una imagen/texto descargable sin cargar fuentes externas.
5. Probar Unicode, emoji, cadenas vacías y texto de 10.000 caracteres.
6. Declarar que es una herramienta de encoding, no de predicción.

### A17 — Sigil Intention Encoder

**Trabajo del usuario:** convertir una intención en un sigil trazable según un método declarado.  
**Entrada:** intención, método y configuración de stream.  
**Salida:** letras normalizadas, trazado, pasos y SVG exportable.

1. Implementar A-I-K-B-E-K-A-R como algoritmo determinista y documentado.
2. Mostrar cada reducción y no ocultar decisiones de normalización.
3. Crear SVG accesible, escalable y sin texto incrustado en imágenes de terceros.
4. Añadir modo de práctica: drawing manual opcional.
5. Probar vacíos, espacios, caracteres especiales, Canvas y tamaño responsive.
6. Enlazar `sigil-generator.html` sin sobrescribir su lógica existente.

### A18 — Magical Correspondence Finder

**Trabajo del usuario:** encontrar correspondencias filtrables para una intención.  
**Entrada:** intención, elemento, planeta, número, carta, runa o símbolo.  
**Salida:** tabla de coincidencias y explicación de fuentes.

1. Modelar cada dimensión como datos, no como condicionales incrustados en la vista.
2. Mostrar qué filtros son compatibles y cuáles requieren una fuente adicional.
3. Incluir enlaces a las fuentesPrimarias o a “mapa tradicional” claramente marcado.
4. Añadir búsqueda por término y combinación AND/OR.
5. Probar filtros vacíos, acentos y combinaciones sin resultados.
6. Convertir las cinco tarjetas coming-soon de `tools/index.html` en enlaces reales a este tool, sin cards rotas.

### A19 — Moon Phase Calendar

**Trabajo del usuario:** consultar fases lunares de un año en su zona.  
**Entrada:** año, mes, zona y hemisferio/fecha de referencia.  
**Salida:** calendario mensual, fases principales, timestamps y fuente.

1. Usar un algoritmo versionado o un dataset astronómico local con fecha de generación.
2. Generar los eventos en UTC y convertirlos a la zona solicitada.
3. Mostrar fase, iluminación aproximada, hora local y disclaimers.
4. Añicionar impresión/ICS sin enviar datos.
5. Probar años bisiestos, DST, hemisferio y meses sin eventos.
6. Diferenciar esta vista anual de `moon-voc.html` y enlazarlas.

### A20 — Moon Intention Planner

**Trabajo del usuario:** elegir una intención para una fecha lunar y guardarla localmente.  
**Entrada:** fecha, intención, fase, duración y recordatorio.  
**Salida:** plan, checklist, notas y exportación.

1. Mostrar la fase y el cálculo como referencia, no como predicción.
2. Limitar la entrada a texto y aplicar escape en toda previsualización.
3. Guardar planes bajo una clave propia y permitir borrar/exportar.
4. Añadir recordatorio opcional local sin notificaciones invasivas.
5. Probar texto vacío, emojis, cambio de fase y storage deshabilitado.
6. Enlazar A19, A31 y A32.

### A21 — Planetary Hours Planner

**Trabajo del usuario:** consultar una tabla horaria planetaria para fecha y ubicación.  
**Entrada:** fecha, ciudad/coordenadas, hemisferio y zona.  
**Salida:** tabla de horas, día, planeta, amanecer/atardecer y advertencias.

1. Reutilizar motor de ephemeris yseparar cálculo solar de la tabla tradicional.
2. Mostrar qué horas son calculadas y cuáles symbolically interpreted.
3. Probar latitudes extremas, polos y días polares con mensajes claros.
4. Añadir copy/share sin datos de nacimiento.
5. No duplicar la calculadora existente: enlazar `planetary-hours.html` como variante relacionada.
6. Documentar que “planetary hour” no es hora civil ni recomendación médica.

### A22 — Ritual Timing Scorecard

**Trabajo del usuario:** comparar opciones de momento con criterios visibles.  
**Entrada:** fecha, criterio, pesos y notas.  
**Salida:** scorecard con pesos, resultado, explicación y exportación.

1. Definir pesos editables y mostrar la fórmula de cada puntuación.
2. No ocultar criterios disputed; etiquetarlos como “tradición/símbolo”.
3. Crear presetsTCG pero permitir edición completa.
4. Probar division por cero, pesos negativos y overflow.
5. Mostrar que la puntuación no predice el resultado.
6. Enlazar A21, A19 y A24.

### A23 — Candle Intention Planner

**Trabajo del usuario:** convertir una intención en un plan de vela claro y seguro.  
**Entrada:** intención, color, duración, espacio y contacto alternativo.  
**Salida:** plan, lista de preparación, recordatorio de seguridad y notas.

1. Integrar la tabla de colores de `candle-color-calculator.html` mediante enlace, no mediante copia divergente.
2. Añadir advertencias de fuego, materiales, mascotas o niños, ventilación y no dormir con llama.
3. Ofrecer versión sin fuego como alternativa explícita.
4. Limitar el texto, escapar notas y no usar prompts de modelos externos.
5. Probar líneas largas, fechas pasadas y storage corrupto.
6. Añadir CTA de libros solo después del resultado.

### A24 — Spell Ingredient Planner

**Trabajo del usuario:** construir una lista de ingredientes con alternativas y motivo.  
**Entrada:** intención, elementos disponibles, presupuesto y restricciones.  
**Salida:** lista, sustituciones, preparación y registro.

1. Crear dataset de correspondencias con licencia/fuente y separadores de tradition.
2. Resolver ingredientes no disponibles con sustituciones del usuario, no con compras.
3. Mostrar allergen/toxicity warnings cuando sean conocidas; no inventar seguridad.
4. Evitar instrucciones de ingesta, uso médico oelixivios.
5. Probar búsquedas sin coincidencia, restrictiones y exportación.
6. Enlazar A18, A23 y A33.

### A25 — Banishing Ritual Builder

**Trabajo del usuario:** preparar un ritual simbólico imprimible y reversible.  
**Entrada:** intención, contexto, duración,Recordatorio de consent y simbolos.  
**Salida:** secuencia, lista, texto imprimible y bitácora.

1. Crear plantillas symbolically neutral con placeholders editables.
2. Incluir consentimiento, no-coerción, protección de privacidad y cierre.
3. Evitar instrucciones de daño real, ocultismo predictivo o manipulación de otras personas.
4. Generar printable HTML/PDF client-side sin backend.
5. Probar títulos largos, imprimibles,RTL y export.
6. Convertir la card coming-soon a enlace real y añadir FAQ de seguridad.

### A26 — Elemental Balance Checker

**Trabajo del usuario:** hacer una reflexión guiada sobre cuatro elementos.  
**Entrada:** ratings opcionales, notas y fecha.  
**Salida:** gráfico, preguntas de reflexión y entrada de journal local.

1. Diseñar preguntas no diagnósticas y permitir omitir cada rating.
2. Mostrar que “balance” es una metáfora, no una medición psicológica.
3. Usar CSS/SVG accesible con texto alternativo, sin depender de color.
4. Guardar datos locales y exportarlos si el usuario lo pide.
5. Probar ratings incompletos, cero, negative values y foco.
6. Convertir la card coming-soon y enlazar A18.

### A27 — Lucid Dream Training Planner

**Trabajo del usuario:** diseñar una práctica de sueños lúcidos con realism.  
**Entrada:** horas de sueño,Recordatorio, técnica y objetivo.  
**Salida:** plan de 7/14/21 días, checklist y registro de escenas reales.

1. Crear calendario configurable sin asumir que todas las personas soñan igual.
2. Incluir botones para pause, reset y “noche sin recuerdo”.
3. Añorar safety note sobre privación de sueño y no conducir ni operar máquinas si se siente somnoliento.
4. No prometervernight lucidity ni diagnosticar parasomnia.
5. Probar planes largos, cambio de horario y fallos de audio.
6. Enlazar A28, A31 y contenido de escritura.

### A28 — Reality Check Technique Coach

**Trabajo del usuario:** practicar chequeos de realidad de forma privada y estructurada.  
**Entrada:** técnica, duración, escenas registradas y resultado.
**Salida:** guía, temporizador, checklist ybitácora.

1. Dividir la guía en pasos breves con “continuar/saltar”.
2. Probar teclado, pantalla reader, pausa y reset.
3. Mantener la herramienta como reflexión, no como evaluación de salud mental.
4. Añadir advertencia de no usarla durante conducción o actividad insegura.
5. Enlazar A27, A30 y `reality-check-tracker.html` sin duplicar datos.
6. Probar timers largos, background y visibilidad de página.

### A29 — Dream Symbol Dictionary

**Trabajo del usuario:** anotar palabras e imágenes de un sueño y crear preguntas de reflexión.  
**Entrada:** símbolo, notas, sentimiento y contexto.  
**Salida:** diccionario personal local, prompted questions y exportación.

1. No dictar significados universales; separar “registro” de “interpretación opcional”.
2. Crear índices de búsqueda y tags; usar escape en cada render.
3. Permitir borrar/exportar todo el diario.
4. Probar caracteres Unicode, palabras vacías y storage corrupto.
5. Incluir aviso de privacidad para sueños sensibles.
6. Enlazar A09, A27 y A35.

### A30 — Astral Projection Session Timer

**Trabajo del usuario:** seguir una sesión de práctica con fases claras.  
**Entrada:** duración, fases, sonido de aviso y objetivo.  
**Salida:** timer, checklist, registro y export.

1. Implementar el reloj con `requestAnimationFrame` o elapsed time, no con decrementos que se detengan en background.
2. Añadir opción sin sonido, notificaciones opcionales y pausa.
3. Mostrar descansos y advertencia de no práctica mientras se conduce.
4. Probar cambio de pestaña, reloj de sistema y cancelación.
5. No afirmar astral travel verificable ni localizar entidades.
6. Enlazar A28 y A31.

### A31 — Meditation Focus Timer

**Trabajo del usuario:** practicar atención con intervalos y sin cargar datos.  
**Entrada:** minutos, break, tipo de sesión, sonido.  
**Salida:** timer, resumen local y opcional streak.

1. Separar countdown de audio; audio opcional y generado con Web Audio/API browser.
2. Respetar `prefers-reduced-motion`, foco y no/startled.
3. Guardar solo aggregate settings por defecto, nunca cada respiración.
4. Probar 0, negativos, máximo, cancelar y reabrir.
5. Enlazar A20, A27, A32 y tracking dashboard.

### A32 — Intention Achievement Tracker

**Trabajo del usuario:** registrar acciones, hitos y evidencias, no promesas.  
**Entrada:** intention, deadline, actions, status y notes.  
**Salida:** tablero, progreso, historial y export JSON.

1. Modelar intention, action, milestone y evidence como datos separados.
2. Calcular progreso por acciones completadas, no por “manifestation”.
3. Permitir delete/archive y no usar fechas del servidor.
4. Crear vista móvil y accesibilidad de tablas.
5. Probar fechas, estados contradictorios y migrations.
6. Enlazar A20, A31 y A39.

### A33 — Ritual Safety Checklist

**Trabajo del usuario:** comprobar límites, consentimiento y precautions antes de una práctica.  
**Entrada:** tipo de práctica, espacio, personas presentes, consent y fecha.  
**Salida:** checklist con pendientes, advertencias y printable summary.

1. Separar safety rules fijas de preferencias personales.
2. Incluir no coerción, no daño, no Quite etiquetas/secretos, y when to stop.
3. Añadir emergency link/texto de ayuda solo con enlaces estables y revisados.
4. No diagnosticar ni Replacement de atención profesional.
5. Probar check/uncheck, reset, print y local export.
6. Convertir la card de roadmap si aparece y enlazar A34, A36.

### A34 — Consent Boundary Planner

**Trabajo del usuario:** definir qué se puede observar, grabar, compartir o revocar.  
**Entrada:** práctica, participantes, scope, canales, retención y revocación.  
**Salida:** documento local imprimible y checklist de revocación.

1. Crear campos de consentimiento affirmative; no usar checkbox premarcado.
2. Explicar qué datos se guardan y permitir borrado completo.
3. Añadir escenario de no consentimiento y “stop immediately”.
4. Probar horarios, personas no identificables y exportación.
5. Mantenerla como herramienta de reflexión, no legal advice.
6. Enlazar A33, A36 y A35.

### A35 — Digital Grimoire Organizer

**Trabajo del usuario:** organizar notas, símbolos y referencias con búsqueda.  
**Entrada:** título, tags, body, favorite, source y attachments opcionales.  
**Salida:** índice filtrable, detalle y export/import.

1. Crear schema versionado y sanitización estricta de Markdown/HTML.
2. Renderizar texto como texto por defecto; no aceptar HTML arbitrario.
3. Añadir búsqueda full-text local, tags, favoritos y límites de tamaño.
4. Implementar import/export seguro y migración de datos.
5. Probar archivos corruptos, nombres duplicados, Unicode y localStorage lleno.
6. Enlazar A18, A29 y contenido de referits.

### A36 — Paranormal Session Prep Checklist

**Trabajo del usuario:** preparar una sesión de investigación paranormal con protocolo honesto.  
**Entrada:** lugar, equipos, consentimiento, hora, hipótesis y campos de observación.  
**Salida:** checklist, timestamp log, export y post-session review.

1. Incluir “no fabricate evidence”, control de frío, hora del dispositivo y condiciones ambientales.
2. Separar hechos, interpretación, anomalía no confirmada y sesgo del observador.
3. Añadir audio/video only after consent y warning de storage.
4. No usar generators que produzcan señales falsas ni presentarlas como detector profesional.
5. Probar checklists parciales, fallos de media y zonas horarias.
6. Enlazar A33, A34 y privacy.

### A37 — Sigil Charging Planner

**Trabajo del usuario:** preparar una práctica de carga/revisión de un sigil.  
**Entrada:** sigil imported/created, intention, date, duration, method y notes.  
**Salida:** plan, timer, steps y bitácora.

1. Reutilizar A17 para crear/importar sin pisar `sigil-charging-timer.html`.
2. Mostrar que la práctica es simbólica y no garantiza protección/resultado.
3. Añadir alternative no-espiritual y pause.
4. Guardar SVG solo si el usuario lo solicita; no ejecutarlo como HTML.
5. Probar SVG malicioso, archivos grandes y storage deshabilitado.
6. Enlazar A23, A32 y book CTA.

### A38 — Servitor Design Journal

**Trabajo del usuario:** documentar el diseño, propósito, límites y revocación de un registro simbólico.  
**Entrada:** nombre, propósito, límites, symbols, revisión y fecha.  
**Salida:** ficha local, printable y revocación checklist.

1. Usar lenguaje de “registro simbólico/compulsión” y no afirmar entidad autónoma.
2. Añadir campos de no-coerción, no influence on others y revocación.
3. Permitir delete/export y ocultar datos por defecto.
4. Probar edición concurrente en dos pestañas y storage corrupto.
5. Enlazar `activador-servidores.html`, A33 y A35.
6. No crear CTA de “servidor ghosts”.

### A39 — Results Tracking Dashboard

**Trabajo del usuario:** observar acciones, práctica y cambios de estado sinOznačiti causalidad.  
**Entrada:** fecha, métrica, notas, tags y objetivo.  
**Salida:** dashboard local, filtros, gráficos y export.

1. Separar métricas auto-contadas de notas subjetivas.
2. Calcular gráficos en cliente sin librerías pesadas.
3. Aplicar agregación mínima, sin nombres de terceros.
4. Añazar delete/export y advertencia de storage.
5. Probar datasets vacíos, fechas inválidas y 1.000 entradas.
6. Reemplazar la card coming-soon de `tools/index.html` por esta herramienta real.

### A40 — Sabbat Season Planner

**Trabajo del usuario:** preparar un calendario estacional/ Wheel of the Year.  
**Entrada:** hemisferio, año, tradición y tipo de planificación.  
**Salida:** fechas, temas, journaling prompts, printable y calendar link.

1. Definir fechas por hemisferio y no usar fechas universales sin explicarlo.
2. Mostrar fuente de cálculo o tabla usada y permitir customize.
3. Añadir prompts de seasonally grounded, no predictivos.
4. Probar leap years, hemisphere y user locale.
5. Probar printable, ICS y reset.
6. Conectar con A20, A32 y el journal de libros.

---

## 7. Orden de construcción

### Fase 0 — Cimientos y contratos

Antes de crear A01:

- confirmar el inventory de herramientas existentes;
- congelar `data/atomic-tools.json` v0;
- crear el shell visual accesible;
- crear contratos de prueba;
- crear una página piloto y otra de referencia;
- resolver si el build actual puede publicar `atomic-tools.min.js` sin alterar los bundles de GitHub.

### Fase 1 — Tier 1, uno por uno

Orden recomendado:

1. A07 Tarot Card Reference
2. A13 Elder Futhark Reference
3. A04 Zodiac Cusp Calculator
4. A19 Moon Phase Calendar
5. A21 Planetary Hours Planner
6. A01 Full Birth Chart
7. A02 Rising Sign Calculator
8. A03 Moon Sign Calculator
9. A08 Tarot Spread Builder
10. A18 Magical Correspondence Finder
11. A24 Spell Ingredient Planner
12. A33 Ritual Safety Checklist

Razón: se comienza con consultas de referencia y seguridad, se valida el shell y luego se incorporan cálculos astronómicos más sensibles.

### Fase 2 — Tier 2

Construir A06, A05, A10, A11, A12, A14, A15, A16, A17, A20, A22, A23, A25, A26. No integrar una página a `tools/index.html` hasta que sus pruebas dede interfaz y de schema pasen.

### Fase 3 — Tier 3

Construir A09, A27, A28, A29, A30, A31, A32, A34, A35, A36, A37, A38, A39, A40. Estas herramientas pueden usar un dashboard común, pero cada una conserva su slug y su intent de búsqueda.

### Fase 4 — Lanzamiento por lotes

- **Lote A:** A07, A13, A19, A21, A33.
- **Lote B:** A01–A04, A18, A24.
- **Lote C:** tarot/oracles/sigils.
- **Lote D:** dreams, tracking, safety y grimoire.
- Cada lote requiere una revisión de enlaces rotos, Lighthouse/axe, build, sitemap y `llms.txt`.

---

## 8. Checklist de calidad por página

### Producto y contenido

- [ ] La herramienta tiene un H1 único y una intención de búsqueda clara.
- [ ] El resultado se entiende sin conocer el contexto de la marca.
- [ ] La explicación del algoritmo está visible y es honesta sobre aproximaciones.
- [ ] No hay claims de certeza, predicción, curación o garantía.
 - [ ] El texto original no contiene material copiado ni atribución falsa.

### Interacción

- [ ] `Enter`, `Space`, tabulador y botones funcionan sin ratón.
- [ ] `aria-live` anuncia resultado y error sin inundar al lector.
- [ ] Hay botón reset, no destructive accidental y confirmación para borrar/exportar.
- [ ] La herramienta no envía texto a la red por accidente.
- [ ] El layout no desborda a 320px ni a 200% de zoom.

### SEO/GEO

- [ ] `title` único y específico.
- [ ] `description` describe la tarea, no sólo “free tool”.
- [ ] canonical absoluto o relativo coherente con GitHub Pages.
- [ ] OG/TwitterASSETS existen o se omiten sin referencias rotas.
- [ ] `WebApplication` incluye `name`, `url`, `applicationCategory`, `operatingSystem`, `isAccessibleForFree` y `description`.
- [ ] `FAQPage` refleja preguntas visibles.
- [ ] La respuesta principal aparece cerca del inicio de la página para GEO.
- [ ] Hay autor/editor o criterio editorial, fecha de revisión y limitaciones.

### ASO y conversión

- [ ] La keyword principal aparece en title, H1, una subtítulo y CTA contextual.
- [ ] La app/libro enlazada existe y su URL se verificó.
- [ ] El CTA explica el valor adicional, no amenaza al usuario.
- [ ] Los eventos miden `tool_start`, `tool_complete`, `share`, `app_click` y `book_click` sin mandar texto sensible.

### QA técnico

- [ ] Tests de lógica pasan.
- [ ] Smoke test Playwright pasa en Chromium y viewport móvil.
- [ ] axe no encuentra errores críticos nuevos.
- [ ] Consola sin errores y sin requests fallidos.
- [ ] `npm test` y `npm run build` pasan; si falla algo preexistente, queda documentado.

---

## 9. Medición y crecimiento ethicalo

El objetivo no es manipular métricas ni prometer millones de usuarios. Se mide:

- impresiones y CTR por intención de búsqueda;
- páginas de herramienta que llegan a resultado;
- uso repetido sin exigir datos personales;
- compartidos que no contienen información sensible;
- clics a app/libro después de completar una tarea;
-Core Web Vitals, errores JS y accesibilidad;
- calidad de las respuestas y reportes de usuarios.

Reglas de crecimiento:

1. Crear páginas de referencia que respondan preguntas reales, no páginas de keywords repetidas.
2. Publicar primero herramientas que resuelven algo útil por sí solas.
3. Añadir ejemplos, glossary y links a fuentes de datos cuando el tema lo requiera.
4. Usar una CTA opcional después del resultado, no un modal antes de la tarea.
5. No comprar enlaces, no publicar reviews ficticias y no medir éxito solo por impressions.
6. Pedir feedback sobre claridad, no sobre “qué método produjo resultados”.

---

## 10. Criterio final de la fase

Esta fase termina cuando existe este único `.md` y el equipo puede elegir una herramienta por su ID y ejecutar sus pasos sin improvisar arquitectura ni contenido. La implementación de las páginas empieza en una fase posterior, empezando por A07 y A13 como pilotos.

**Estado de este documento:** completo como plan; **implementación pendiente**.
