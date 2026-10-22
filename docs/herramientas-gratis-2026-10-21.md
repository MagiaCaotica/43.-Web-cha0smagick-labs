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

## 8. Las 18 embebidas (segunda ronda)

**Auditoría previa:** las 15 apps externas están **vivas** (los dos fallos
iniciales eran del `fetch` sin CORS, no del servidor). La 기사 embebida son
las que viven en un `iframe` externo: seis de HuggingFace Spaces, siete de
GitHub Pages, una de Streamlit y una de GitHub Pages con subcarpeta.

**Lo que les faltaba era todo:** ninguna tenía declaración de conflicto de
intereses, límites, «qué puedes esperar», autor, fecha de revisión ni camino
al producto. La capa de valor se les conectó igual que a las nativas, con
**una diferencia real**: el resultado de una embebida vive dentro del iframe,
así que «copiar resultado» no sirve de nada.

**Lo que se les ha puesto:**
- **Abrir en una pestaña nueva** y **copiar el enlace** (las dos acciones
  que sí tienen sentido con contenido de otro origen).
- **Aviso automático con el enlace directo** si el iframe no carga en 9
  segundos. Es una dependencia de terceros: hoy funcionan, pero si mañana un
  Space de HuggingFace se duerme, el usuario ve un aviso útil en vez de un
  marco en blanco.
- El bloque de confianza completo, con método, límites y expectativa propios.
- El **camino al producto según la familia**:
  - las occultas (I Ching, fases lunares, sigilos, servidores, tengwar, runas
    vikingas) → su app, con la ventaja concreta;
  - las que **no son occultas** (blackjack, INWO, werewolf, editor de
    imágenes, ruleta, compendios de RPG, panel de datos de Colombia) →
    **no tienen nada que vender**, y su puerta honesta es la comunidad. Poner
    un producto de pago detrás de un simulador de ruleta habría sido una
    tontería.

## 9. El texto ad hoc por herramienta (tercera ronda)

El texto de valor estaba **escrito por familia**: 12 frases para 58
herramientas, y cuatro compartían incluso la misma línea. Eso es exactamente
lo que el editorial policy llama relleno.

Ahora hay **70 herramientas con texto propio** (`projects/scripts/toolkit_content.py`):
70 valores distintos, 70 límites distintos, 70 expectativas distintas.

| Herramienta | Qué hacer con el resultado (ahora) |
|---|---|
| Carta natal | «Anota el Sol, la Luna y el Ascendente con el grado, y la fecha. Con tres cartas tuyas en 30 días verás cuáles de los tres se mueve.» |
| Entrenador Zener | «Practica series largas, no tiradas sueltas: el acierto por azar es de una entre cinco.» |
| Sorteo de runas | «Anota el resultado y lo que hiciste después. La runa no dice nada: lo que dice es lo que tú hiciste con ella.» |
| Kamea planetaria | «El valor de la kamea está en que el trazo se recuerda: un sigilo que no sabes repetir no sirve.» |
| Tarot sí/no | «Anota la carta, la pregunta y lo que decidiste después. En tres meses, el diario muestra más que las tiradas.» |
| Generador de sigilos | «Genera el sigilo y anota, con la fecha, qué acción mundana lo acompaña.» |
| Regla de seguridad | «Úsala antes de empezar y guárdala. Una lista de seguridad que se lee después del ritual ya no es una lista de seguridad.» |
| … | (70 en total) |

## 10. Estado final

| | Motor común | Propias | Embebidas |
|---|---|---|---|
| Herramientas | 40 | 18 | 18 |
| Sistema visual | 40/40 | 36/36 | 36/36 |
| E-E-A-T (7 señales) | 7/7 | 7/7 | 7/7 |
| Texto de valor propio | 40/40 | 36/36 | 36/36 |

**Las 76 herramientas** (las 3 copias en español comparten slug) están
conectadas, versionadas por hash de contenido y comprobadas en vivo con
navegador real: bloque de confianza con sus cuatro apartados, método,
transparencia, autor, política editorial, fecha de revisión, camino al
producto y acciones de resultado, sin desbordamiento horizontal.

## 11. Cuarta ronda: lo que faltaba para que el camino se convierta en venta

La ronda anterior dejo las herramientas con valor y confianza. Faltaba lo que
pasa despues: que el usuario llegue a la app y compre. Tres cosas:

### 11.1 Los snippets de las paginas que ya rankean y no clic

Search Console, 28 dias: **24 paginas con 30 o mas impresiones y menos del 5 %
de CTR**. Seis de ellas estan **en pagina 1** (posicion 5,6 a 8,9) y son las
que mas impressions acumulan:

| Pagina | Impr. | Clics | Pos. | Query principal |
|---|---|---|---|---|
| astrology-apps-android-guide | 629 | 3 | 14,6 | best astrology apps 2026 (107 a pos 6,2) |
| sigil-vs-servitor-differences | 93 | 1 | 6,4 | sigil vs servitor |
| planetary-magic-hours-guide | 21 | 0 | 5,6 | planetary magic hours |
| ai-machine-learning-paranormal-research | 18 | 0 | 7,6 | machine learning paranormal research |
| paranormal-investigation-step-by-step-guide | 17 | 0 | 7,4 | paranormal investigation guide |
| evp-vs-spirit-box-comparison-guide | 15 | 0 | 7,6 | evp vs spirit box |

Se estudio la SERP real de esas queries (con navegador) y el patron ganador
del nicho es claro: el ano en el titulo, **los nombres de los competidores en
la descripcion** y una respuesta directa, porque la AI Overview de Google ya
ocupa la posicion 1 y cita.Co-Star, The Pattern y CHANI.

**Lo que NO se hizo, y es lo importante:** el titulo ganador de la
competencia es «Best Astrology App 2026: **We Tested 7** (Co-Star, CHANI, ...)».
Our pagina no puede decir eso: no afirma haber probado las apps, dice que los
criterios se aplicaron a las fichas de Play comprobadas el 21 de octubre de
2026. Poner «We Tested» seria una mentira, y una mentira en el titulo es
justo lo que hace que un revisor de confianza deje de fiarse. El titulo nuevo
es «Best Astrology Apps for Android 2026: 6 Compared», y en la descripcion
van los seis nombres.

### 11.2 La barra de precio fija

El precio y el CTA estaban arriba del todo, pero en cuanto el lector bajaba
se perdian. Las herramientas ya tenian barra sticky; **las 12 fichas de app
no**. Ahora si, con el precio tomado de la ficha verificada de Play
(`data/play-catalog.json`), no escrito a mano. Tambien en la landing del
bundle de libros, que es la pagina del embudo de compra.

### 11.3 Una oferta que no existia, con un contador de 12 horas

`landing-pages/complete-access.html` tenia un contador de cuenta atras de
11:59:59 que **se reiniciaba con cada recarga**, un badge de «UPSELL
EXCLUSIVO - 12 HORAS» y un 71% OFF, para una oferta que la propia pagina
declara no disponible («falta configurar y verificar el producto externo de
Hotmart», «NO PUBLICAR»). Y estaba **en el sitemap, indexada**.

Eso es escasez fabricada, que la politica editorial del propio sitio enumera
como lo que se rechaza, y ademas es una promesa sin forma de cumplirse.
Ahora: sin contador, con una linea honesta que ofrece las 12 apps por separado
y el bundle de libros, en `noindex` y fuera del sitemap.

Revisado el resto: el contador del flash-sale cuenta hasta una fecha fija con
la hora del servidor (legitimo) y los temporizadores de las herramientas son
herramientas, no urgencia fabricada.

## 12. Quinta ronda: la analitica no estaba en el 87% del sitio

Auditando el embudo aparecio un defecto de fondo:

- `data/analytics-events.json` dice, literalmente, que **«js/analytics-bridge.js
  is the only allowlist enforcement point»**.
- El bridge estaba en **109 de 1.011 paginas**. En las otras 902,
  `conversion.js` enviaba los parametros **sin filtrar** a GA4
  (`gtag('event', ...)` con los parametros en crudo). La allowlist no existia
  en el 87% del sitio.
- Y con el bridge cargado, cada evento se encolaba **dos veces** en
  dataLayer: una por el bridge (sanitizada) y otra por gtag (sin sanear). Es
  decir, en esas 109 paginas las metricas de GA4 contaban los eventos por
  dos. Anadir el bridge al resto habria duplicado las metricas de todo el
  sitio.

**Arreglado:**
- `track()` delega en el bridge cuando esta y solo usa gtag si no lo hay: el
  bridge decide si el evento pasa la allowlist y si hay consentimiento.
- El bridge se carga **antes** de `conversion.min.js`, para que exista desde
  el primer momento.
- Las 902 paginas quedan con la allowlist real.

**Verificado en vivo:** con el consentimiento concedido, un evento llega
**una sola vez** al dataLayer, y el campo que no esta en la allowlist se
descarta:

```
veces: 1
conCampoProhibido: 0
evento: {"event":"tool_funnel_click","analytics_source":"cha0_bridge",
         "tool_id":"prueba","placement":"prueba","gtm.uniqueEventId":17}
```

## 13. El problema que hacia irresoluble todo lo demas: la cache

Tres cambios de esta sesion parecieron no aplicarse. La causa era la misma:
**el CSS se cargaba sin parametro de version**, asi que el navegador y el CDN
seguyan sirviendo la copia anterior. El fichero nuevo estaba en el servidor y
no se veia.

Ahora todos los assets locales (css y js) se referencian con el **hash de su
contenido**: cada cambio genera una URL nueva y el navegador la pide. Un
unico script escribe las versiones, para que dos scripts no se pisen.
