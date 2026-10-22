#!/usr/bin/env python3
"""
Los otros dos articulos en espanol con intencion de venta:

  es-carta-natal-gratis-como-leerla.html
      -> "birth chart app" tiene 20 impresiones en posicion 38.9 y no hay
         ninguna guia en espanol de como leer la carta. La guia de lectura es
         lo que convierte una app en una venta.
  es-magia-del-caos-para-principiantes.html
      -> la version en ingles ("chaos magic for beginners") es la de mas
         impresiones del corpus. En espanol hay una introduccion (que-es-la-
         magia-del-caos) pero no el itinerario de 90 dias.

  python projects/scripts/articles/es-venta2.py
"""
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
sys.path.insert(0, str(ROOT / "projects" / "scripts"))
from es_article_builder import construir_es  # noqa: E402

FECHA = "2026-10-22"

# ======================================================================
# 1. CARTA NATAL GRATIS: COMO LEERLA
# ======================================================================
slug = "es-carta-natal-gratis-como-leerla"
titulo = "Carta natal gratis: como leer tu carta natal paso a paso"
h1 = "Carta natal gratis: como leer tu carta natal, paso a paso"
lede = ("Tu carta natal se lee en cinco pasos y no hace falta ser astronomo para entenderla. "
        "Esta guia te lleva desde los datos que necesitas hasta las preguntas que la carta responde.")
desc = ("Como leer tu carta natal gratis, paso a paso: los 5 pasos, que significa cada posicion, "
        "que preguntas responde y como verificarla por tu cuenta. Con herramientas gratis y "
        "la app de pago unico para cuando quieras mas.")
keywords = ("carta natal gratis, como leer mi carta natal, carta natal paso a paso, significado "
            "carta natal, que es una carta natal, astral lab, carta natal online, planetas en "
            "carta natal, casas del zodiaco")
en_href = "https://cha0smagicklabs.com/blog/birth-chart-app-accuracy-comparison.html"

toc = [
    ("lo-que-es", "Lo que es una carta natal, en una frase"),
    ("datos", "Los datos que necesitas (y donde fallan)"),
    ("los-cinco-pasos", "Los cinco pasos para leerla"),
    ("que-pregunta", "Que preguntas responde tu carta"),
    ("verificar", "Como verificas los numeros por tu cuenta"),
    ("siguiente", "Cuando ya sabes leerla: la siguiente herramienta"),
]

cuerpo = """
<p>Una carta natal es un mapa del cielo tal y como estaba en el momento exacto
en que naciste. Eso es todo lo que es: un diagrama con la posicion de los
planetas en ese instante y en ese lugar. No es un destino, no es un examen y no
necesita que sepas astrologia para leerla bien.</p>
<p>Lo que sigue son los cinco pasos, en el orden en que se hacen. Cada uno
incluye lo que puedes comprobar tu mismo, para que no tengas que creerte a
nadie.</p>

<h2 id="lo-que-es">Lo que es una carta natal, en una frase</h2>
<p>Un mapa del cielo, visto desde la Tierra, en el instante de tu nacimiento.
Todo lo demas (personalidad, destino, Timing) son <em>lecturas</em> que se
hacen sobre ese mapa. La lectura es la parte interpretativa; el mapa es la
parte medible. Por eso conviene separar las dos: el mapa se puede verificar,
la lectura se discute.</p>
<p>Tres cosas del mapa que conviene tener claras antes de empezar:</p>
<ul>
<li><strong>Los signos</strong> son doce sectores fijos de 30&deg; que el
zodiaco define desde la antiguedad. Son posiciones, nourezgos: un signo no es
una personalidad.</li>
<li><strong>Los planetas</strong> son los actores. Cada uno tiene su
significado, y lo que importa no es "ser Escorpio" sino "tener a Pluton en
casa septima en Escorpio".</li>
<li><strong>Las casas</strong> son el escenario: doce sectores del cielo local
que se miden desde el horizonte. Las casas se mueven con el lugar y la hora, no
con el dia.</li>
</ul>
<p>Ese ultimo punto es el que mas se pasa por alto y el que mas cambia los
resultados: <strong>la hora de nacimiento define las casas</strong>. Sin la
hora correcta, las casas no se pueden calcular con exactitud, y una carta sin
casas es media carta.</p>

<h2 id="datos">Los datos que necesitas (y donde fallan)</h2>
<p>Para calcular tu carta hacen falta tres datos: <strong>fecha</strong>,
<strong>hora</strong> y <strong>lugar</strong>. En ese orden de dificultad:</p>
<ol>
<li><strong>Fecha.</strong> El dato que casi siempre se tiene bien. Cuidado
con los cambios de calendario: si naciste antes de 1582, el calculo depende
del calendario gregoriano frente al juliano, y el resultado se separa
minutos.</li>
<li><strong>Lugar.</strong> Ciudad y pais. Para el calculo de las casas hace
falta la latitud y longitud exactas. Los proyectores de mapa online dan
aproximaciones de un par de minutos de arco, que en casas altas puede ser
suficiente para no mover un signo.</li>
<li><strong>Hora.</strong> El dato que falla. La hora de partida hospitalaria
no es la hora de nacimiento: entre el parto y el registro puede haber una
hora de diferencia, y una hora desplaza las casas de forma apreciable. La
mayoria de las cartas "raras" que se ven por ahi son cartas con la hora
equivocada.</li>
</ol>
<p><strong>La prueba de fuego:</strong> si tu Ascendente no coincide con lo que
te dijo tu madre, no tu madre: casi seguro es la hora. Y si tienes la
certificacion de nacimiento, es el unico dato con valor probatorio. Lo que
importa es que sepas que existe esa diferencia, no que la adivines.</p>

<h2 id="los-cinco-pasos">Los cinco pasos para leerla</h2>

<h3>Paso 1: el motor</h3>
<p>Genera la carta. Si estas en el telefono, la forma mas rapida es
<a href="/apps/astral-lab.html">Astral Lab</a> ($6.99, pago unico, funciona
sin internet y sin cuenta) o el <a href="/astrology-app-reviews.html">comparativa de apps</a>
de este sitio. Si quieres el motor mas contrastado del mundo,
la pagina extendida de Astro.com es la referencia que usa la industria.</p>

<h3>Paso 2: el eje del yo</h3>
<p>Empieza por el <strong>Ascendente</strong> (el signo que asomaba por el
horizonte este en el momento de tu nacimiento) y el <strong>Medio Cielo</strong>
(el punto mas alto del meridiano, que marca el MC). Son el eje del yo y del
vocacion, y son la parte del mapa que mas depende de la hora exacta.</p>
<p>El error tipico es arrancar por el signo solar. El sol es una posicion
entre trece: importante, pero no la que define la lectura de fondo. El
Ascendente es el filtro por el que todo lo demas se expresa.</p>

<h3>Paso 3: los planetas en las casas</h3>
<p>Esta es la lectura en si: para cada planeta, en que casa cae y en que signo.
Los planetas individuales son el "que", y las casas son el "donde". Un Marte en
Casa septima y un Marte en Casa segunda son el mismo planeta con dos
significados muy distintos.</p>
<p>Empieza por el triaje, no por el detalle. Mira primero los planetas
"duros" (Sol, Luna, Mercurio, Venus, Marte) y despues los lentos (Jupiter,
Saturno, Urano, Neptuno, Pluton), que pesan mas en el fondo pero menos en el
dia a dia.</p>

<h3>Paso 4: los aspectos</h3>
<p>Los aspectos son las distancias entre planetas que importan. El Ascendente
en opposition al Sol, Venus en trígono con Saturno: asi se leen. Los aspectos
principales son conjuncion (0&deg;), opposition (180&deg;), trígono (120&deg;),
cuadratura (90&deg;) y sextil (60&deg;).</p>
<p>Los orbes usados de forma general son 8&deg; para conjunciones, 6&deg;
para oposiciones y cuadraturas, y 4&deg; para trígonos y sextiles. Un aspecto
dentro de su orbe es el propio y vale la pena; fuera, es ruido. Y un matiz que
suele olvidarse: un aspecto <em>aplicativo</em> (las dos planetas se acercan y
todavia no se juntaron) se activa con el tiempo. De ahi sale la lectura
del Timing, y de ahi tambien su valor: lo que va a pasar, no lo que ya paso.</p>

<h3>Paso 5: las fases y el Timing</h3>
<p>Las fases lunares en el momento del nacimiento marcan el tono emocional de
fondo, y las progresiones y revoluciones marcan los ciclos. El Sol vuelve a su
posicion natal alrededor de los 32 años (revolucion solar), y la Luna vuelve
cada 27 dias (revolucion lunar): son los dos relojes que se mueven a
diferente velocidad.</p>
<p>Los tránsitos son el clima de ahora: donde esta cada planeta respecto a tu
nata. Un tránsito de Saturno sobre tu Sol es el mismo Saturno que en tu carta
natal, aplicado a otro momento.</p>

<h2 id="que-pregunta">Que preguntas responde tu carta</h2>
<p>Una carta natal responde mejor a unas preguntas que a otras. Las que
responde bien son las de <strong>estructura</strong>:</p>
<ul>
<li>Como funciono por dentro (el Ascendente, el signo solar, la Luna y sus
aspectos).</li>
<li>Que me cuesta y que me sostiene (los nodos, y la casa sexta frente a la
casa doce).</li>
<li>Como me relaciono con los demas y que busco en una pareja (Venus,
Marte, la casa siete y sus planetas).</li>
<li>Que hago con el tiempo y la energia (la casa tenth, el MC y sus
planetas).</li>
<li>Que es lo que te da miedo (Pluton, la casa ocho y la doce).</li>
</ul>
<p>Las que NO responde bien, y conviene dejar de pedirle: el numero exacto de
unorsche personas, si una relacion funcionara, cuando pasara algo concreto. La
carta describe una estructura, no un guion. Quien te prometa lo contrario te
esta vendiendo una baraja, no un mapa.</p>

<h2 id="verificar">Como verificas los numeros por tu cuenta</h2>
<p>Los datos de una carta se pueden comprobar sin apps, con dos referencias
gratuitas:</p>
<ul>
<li><strong>Astro.com</strong> (la version extendida, gratuita) es la que usa
lamayoria de los profesionales para contrastar. Si tu posicion de Mercurio no
coincide con la de Astro.com en un minuto de arco, hay un problema en los
datos de entrada, no en el motor.</li>
<li><strong>Swiss Ephemeris</strong>, la pagina de prueba oficial, permite
comprobar posiciones calculadas con los mismos kernel que usa la mayoria del
software profesional.</li>
</ul>
<p>La manera de usar esto es al reves de lo que se suele usar: no para
confirmar una lectura, sino para encontrar el error. Si el motor que usas
coincide con la referencia, el mapa es fiable y lo que discutes es la
interpretacion. Si no coincide, todo lo demas es ruido.</p>

<h2 id="siguiente">Cuando ya sabes leerla: la siguiente herramienta</h2>
<p>Si ya lees tu carta y quieres mas de lo que da un mapa estatico, el paso
siguiente es el <strong>tiempo</strong>: progresiones, revoluciones y
tránsitos. Para eso hay dos caminos.</p>
<p><strong>El gratuito, que esta aqui:</strong>
<a href="/es/tools/lunar-phase.html">calculadora de fases lunares</a> para
seguir el ciclo, el
<a href="/es/tools/iching.html">oraculo del I Ching</a> para consulta con
monedas reales, y las <a href="/es/tools/rune-drawer.html">tiradas de runas</a>
para leer una situacion por simbolo.</p>
<p><strong>El de pago unico:</strong> <a href="/apps/astral-lab.html">Astral
Lab</a> calcula la carta con VSOP87 y ELP-2000 (las mismas series que estan
detras de la efemerides JPL de desarrollo), trae doce sistemas de casas,
progresiones secundarias, direcciones de arco solar, revoluciones
solar/lunar/planetarias y sinastria. Todo en el telefono, sin cuenta y sin
internet: <strong>$6.99 una vez</strong>, sin suscripcion.</p>
<p>Para el que quiere comparar antes de decidir, la
<a href="/es/astral-lab-vs-co-star.html">comparativa de Astral Lab frente a
Co-Star</a> esta en espanol y explica el caso de uso de cada una.</p>
"""

faq = [
    ("¿Puedo ver mi carta natal gratis?",
     "Si. En este sitio hay generadores de carta y calculadoras que no piden ni un dato. La version "
     "completa en el telefono, con progresiones y revoluciones, es Astral Lab, que se compra una vez por "
     "$6.99 y funciona sin internet."),
    ("¿Que datos necesito para mi carta natal?",
     "Fecha, hora exacta y lugar de nacimiento. La fecha es la facil, el lugar tambien. La hora es el dato "
     "critico: una hora de diferencia desplaza las casas de forma apreciable. Si tienes la certificacion de "
     "nacimiento, ese es el unico dato con valor probatorio."),
    ("¿Cuanto cuesta una carta natal?",
     "Cuesta cero si usas una herramienta web, y $6.99 si quieres la app de pago unico con progresiones, "
     "revoluciones y sinastria. No hay suscripcion en ningun caso."),
    ("¿Que se puede saber con una carta natal?",
     "Estructura: como funcionas por dentro, que te sostiene y que te cuesta, como te relacionas, que haces "
     "con tu tiempo. No responde bien a preguntas de resultado concreto como el numero de parejas o si una "
     "relacion funcionara."),
    ("¿La hora de nacimiento importa de verdad?",
     "Si. Las casas se calculan desde el horizonte local, asi que un error de hora desplaza las casas enteras. "
     "Es la causa mas frecuente de cartas que no cuadran con la percepcion de quien las consulta."),
    ("¿Puedo verificar mi carta?",
     "Si. Astro.com en su version extendida y la pagina de prueba de Swiss Ephemeris son las dos referencias "
     "gratuitas. Si tu motor coincide con ellas, el mapa es fiable y lo que se discute es la lectura."),
]

rel = [
    ("/blog/es-mejores-apps-astrologia-android-2026.html", "Mejores apps de astrologia 2026"),
    ("/es/astral-lab-vs-co-star.html", "Astral Lab vs Co-Star"),
    ("/es/tools/lunar-phase.html", "Fases lunares gratis"),
    ("/es/", "Centro en espanol"),
    ("/buscar.html", "Buscar en el sitio"),
]

out = construir_es(slug, titulo, h1, lede, desc, keywords, en_href, toc, cuerpo, faq, rel,
                   fecha=FECHA)
print("escrito:", out.name, out.stat().st_size, "bytes")
