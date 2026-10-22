# Herramientas gratuitas: auditoría, valor y diseño — 2026-10-21

**Encargo:** «audita todas las herramientas gratuitas que no sean embed y
mejoralas visualmente todas, de tal manera que todo entra por los ojos, que
queden profesionales hermosas e intuitivas» y después «que cada herramienta
gratuita ofrezca el máximo valor posible para el cliente, de tal manera que
quede tan satisfecho que lo lleve a comprar algo».

---

## 1. El inventario (y una sorpresa)

De las **77** páginas de herramienta:

| Grupo | Nº | Qué son |
|---|---|---|
| **Motor común** | 40 | `data-atomic-tool="A01…A40"` + `data/atomic-tools.json` + `js/atomic-tools.js` + `css/atomic-tools.css`. Un solo motor las dibuja todas |
| **Propias** | 15 (+3 en español) | JS inline propio: gnosis-timer, rune-drawer, zener-esp-trainer, astrology-sign-calculator, candle-color-calculator, digital-pendulum, goetic-spirit-selector, iching-changing-lines, moon-voc, planetary-hours, planetary-kamea-sigil, reality-check-tracker, sigil-charging-timer, spell-builder, tarot-yes-no |
| **Embebidas** | 18 | `<iframe>`. Quedan fuera por instrucción |

**La sorpresa:** `tools/sigil-generator.html` —la más visitada— es una
**embebida**, no una nativa. No se toca.

**Y la buena noticia estructural:** como 40 de las 58 comparten motor, una
sola mejora las sube todas. No se han hecho 58 rediseños: se ha construido
**una capa común** (`js/toolkit.js` + `css/toolkit.css` + `data/toolkit.json`)
que se conecta a las 58.

## 2. La auditoría: qué faltaba de verdad

`projects/scripts/audit-tools.py` y `projects/scripts/audit-tools-eeat.py`
miden cuatro planos. Lo que salió:

**El hallazgo de fondo: el resultado no se podía llevar.** El motor común
tenía «Guardar resumen local» (que guardaba en el navegador **sin ninguna
forma de recuperarlo**) e «Imprimir». Ni copiar, ni descargar, ni un camino a
nada. Una herramienta gratuita cuyo resultado no te puedes llevar es un
juguete: el usuario se va y no vuelve.

| Señal | Antes | Después |
|---|---|---|
| Conflictos de intereses declarados | **0 / 58** | **58 / 58** |
| Qué es y qué NO es (límites) | 3 / 58 | **58 / 58** |
| Uso responsable | 0 / 58 estáticos | **58 / 58** |
| Qué puedes esperar | genérico | **58 / 58 con texto propio** |
| Quién la hizo + política editorial + fecha | no | **58 / 58** |
| Acciones de resultado | 0 | **58 / 58** (copiar, descargar texto, descargar imagen, imprimir) |
| Lecturas guardadas | se perdían | **se ven, se abren y se borran** |
| Camino a la versión de pago | ninguno | **58 / 58**, con la ventaja concreta y real |
| FAQ | 15 / 18 | **18 / 18** |
| Foco visible / reduced motion | parcial | **58 / 58** |
| Altura mínima de control | parcial | **48 px** en todos |

## 3. El valor: qué entrega ahora cada herramienta

Tres piezas, todas honestas:

**a) El resultado se lleva.** Copiar, descargar el texto, descargar la imagen
cuando hay lienzo e imprimir, en **una sola fila** de acciones (se integra
en la del motor, no duplica botones).

**b) Lo guardado se recupera.** «Tus lecturas guardadas»: lo que guardaste
aparece con fecha, se abre otra vez y se borra. Antes se guardaba y se
perdía.

**c) Un camino real al producto.** Un bloque con:
- **Qué hacer con el resultado**, específico por familia: «anótalo, revísalo
  a 30 días y compáralo: eso es lo que convierte una lectura en un registro».
- **La ventaja concreta** de la app, sin inventar: *«Si lo que te sirve de
  esta página es la carta, la app la calcula igual y la guarda contigo. No es
  mejor: es la misma, y además funciona sin conexión.»*
- **Transparencia:** *«la versión de pago que aparece más abajo es nuestra.»*

**d) El bloque de confianza** (E-E-A-T) en las 58: qué es y qué no es, cómo
se usa, qué puedes esperar, uso responsable, quién la hizo (enlace al autor),
la política editorial, la fecha de revisión y que todo se calcula en tu
navegador.

## 4. El diseño

**`css/atomic-tools.css` reescrito** (motor común): jerarquía en tres
nivios —heroe, panel, resultado— con el resultado como protagonista (filete
de oro, datos en grande y a contrasting), escala tipográfica fluida con
`clamp()`, degradado dorado en los botones con sombra, anillos de foco
visibles, 48 px de altura mínima y `prefers-reduced-motion` respetado.

**`css/toolkit.css` nuevo**: los componentes de valor y la elevación de las
15 propias, que hasta ahora se veían como formularios dentro de una página.
Ahora las 58 parecen una familia: mismos colores, mismos bordes, mismas
sombras, mismos botones.

**`js/toolkit.js`**: la capa de valor, el bloque de confianza, el FAQ
cuando falta, la barra de acción fija en móvil y la mejor detección del área
de resultado (ya no confunde un encabezado con un resultado).

## 5. Tres fallos que salieron por el camino

1. **El CDN servía el CSS y el JSON cacheados.** El fichero nuevo estaba en el
   servidor y el navegador seguía aplicando el viejo. Se resolvió versionando
   los assets con el **hash de su contenido** (`bump-toolkit-version.py`):
   cualquier cambio genera una URL nueva y no hay que acordarse de subir la
   versión a mano. Con una versión fija, dos commits seguidos rompían otra vez.
2. **Las 3 copias en español recibían las rutas a un nivel de menos**
   (`../css/` en vez de `../../css/`). El JS resuelve ahora la ruta de datos
   según la profundidad de la página.
3. **Un pase de acentos renombró la clave `"version"` del catálogo** a
   `"versión"`. Restaurado, y el generador sigue con comprobación de
   sintaxis.

## 6. Verificación

- **58/58** herramientas con la capa de valor, el bloque de confianza y el
  diseño nuevo, comprobado **en vivo con navegador real**: resultado
  visible, 5 tiles, fila de acciones única, bloque de confianza con sus
  cuatro apartados, FAQ inyectado con 3 preguntas propias, y sin
  desbordamiento horizontal.
- `npm test`: **38 pytest + 230 vitest en verde**; verificador de Play: PASS.
- Auditoría final: **visual 9/9, práctico 8/8, E-E-A-T 7/7** y valor con
  límites, expectativa y valor propios en **58/58**.

## 7. Lo que queda

- **Las 18 embebidas** no se han tocado, por instrucción. La más visitada
  (`sigil-generator`) está entre ellas, así que el conjunto se ve desigual:
  58 herramientas con la nueva identidad y 18 con la anterior.
- **No se ha medido el efecto**: falta saber si copiar/descargar y el camino
  a la app suben el uso y la conversión. La forma de medirlo es el evento
  `tool_funnel_click` que ya existe en `js/conversion.js`: si el bloque de
  «siguiente paso» no registra clics, no sirve de nada.
- **El texto de valor está escrito por familia, no por herramienta**: 12
  familias cubren las 58. Las que más lo necesitan son las de tarot, sigilos
  y suenos, donde el resultado es más rico y merece instrucciones propias.
