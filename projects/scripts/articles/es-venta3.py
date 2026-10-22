#!/usr/bin/env python3
"""
El tercer articulo en espanol con intencion de venta:

  es-magia-del-caos-para-principiantes.html
      -> la version en ingles ("chaos magic for beginners") es la de mas
         impresiones del corpus: 899. En espanol hay una introduccion
         ("que-es-la-magia-del-caos") y articulos sueltos por tecnica, pero
         falta el itinerario: por donde se empieza, en que orden, y que se
         hace en la primera sesion.

Es un embudo de venta al bundle de libros y a las apps, con honestidad: el
articulo dice que la practica empieza en el capitulo 2, no en el 1.

  python projects/scripts/articles/es-venta3.py
"""
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
sys.path.insert(0, str(ROOT / "projects" / "scripts"))
from es_article_builder import construir_es  # noqa: E402

FECHA = "2026-10-22"

slug = "es-magia-del-caos-para-principiantes"
titulo = "Magia del caos para principiantes: la guia completa en 90 dias"
h1 = "Magia del caos para principiantes: la guia completa"
lede = ("Nueve pasos, tres meses y una sola idea: la creencia es una herramienta, no una obligacion. "
        "Esta es la guia de inicio de la magia del caos en espanol, con lo que se hace "
        "en la primera sesion.")
desc = ("Guia de magia del caos para principiantes en espanol: que es, los 4 metodos basicos, "
        "el itinerario de 90 dias, la primera sesion paso a paso y los errores que todos cometen.")
keywords = ("magia del caos para principiantes, como empezar en magia del caos, sigilos paso a paso, "
            "gnosis magia del caos,paradigma magia del caos, servidores magicos principiantes, "
            "magia del caos en español, guia magia del caos")
en_href = "https://cha0smagicklabs.com/blog/chaos-magick-beginners-complete-guide.html"

toc = [
    ("que-es", "Que es (y que no es) la magia del caos"),
    ("los-cuatro", "Los cuatro metodos, en una frase cada uno"),
    ("primer-dia", "Tu primera sesion, paso a paso"),
    ("error", "El error numero uno (y como no cometerlo)"),
    ("noventa-dias", "El itinerario de 90 dias"),
    ("cuando-bloqueado", "Cuando te bloqueas"),
]

cuerpo = """
<p>Si estas aqui, ya has leido bastante sobre el tema y sabes que hay una
corriente de ocultismo que no te pide creer en nada. Esta guia es el
itinerario: no la teoria (eso ya lo tienes en
<a href="/blog/es-que-es-la-magia-del-caos.html">la introduccion</a>), sino el
plan de 90 dias con las sesiones concretas dentro.</p>
<p>La magia del caos es un sistema. Como cualquier sistema, se aprende en un
orden, y saltarse el orden es la razon principal por la que la gente lo
abandona a la tercera semana.</p>

<h2 id="que-es">Que es (y que no es) la magia del caos</h2>
<p>La definicion mas corta que funciona: <strong>la magia del caos es la
aplicacion de la creencia como herramienta</strong>. Tomas una belief (que
puede ser la que sea) y la ejecutas como si fuera real; el resultado cambia tu
comportamiento; el comportamiento produce el resultado. Ese ultimo paso es
el unico que se mide.</p>
<p>Lo que <strong>no</strong> es:</p>
<ul>
<li><strong>No es satanismo.</strong> No tiene dogma, deidad ni iglesia. El
marco lo elige cada uno: hay practicantes que usan marcos oscuros, otros
angeles, otros pura psicologia.</li>
<li><strong>No es "hazlo a tu manera".</strong> La libertad de marco no
significa libertad de metodo: el sigilo tiene estructura, la gnosis tiene
protocolo, y saltartelos es la via rapida a la frustracion.</li>
<li><strong>No es magia sin registros.</strong> Un sistema que no se puede
auditar no es un sistema. La bitacora no es opcional.</li>
</ul>
<p>Y lo que es, en lo que se traduce en la practica:</p>
<ul>
<li>Un <strong>sigilo</strong>: una declaracion de intencion condensada en un
símbolo, cargado con gnosis.</li>
<li>Una <strong>gnosis</strong>: un estado de concentracion alterada que se
alcanza por medios concretos.</li>
<li>Un <strong>Paradigma</strong>: el marco mental que hace que el simbolo
signifique algo para ti.</li>
<li>Un <strong>servidor</strong>: un trabajo con continuidad, cargado en una
sesion y mantenido despues.</li>
</ul>

<h2 id="los-cuatro">Los cuatro metodos, en una frase cada uno</h2>
<ol>
<li><strong>Sigilo.</strong> Condensas una intencion en un simbolo y lo cargas
con gnosis. Es el metodo mas accesible y el que produce resultados mas rapidos.
El <a href="/blog/es-como-hacer-un-sigilo-paso-a-paso.html">como hacer un
sigilo paso a paso</a> esta en espanol.</li>
<li><strong>Gnosis.</strong> El estado alterado que carga el sigilo. Se
trabaja con metodos concretos, no con "visualizacion positiva": metodo de
respiracion, de los cuatro elementos, o descarga por anclaje emocional. El
<a href="/blog/es-gnosis-magia-del-caos.html">articulo de gnosis</a> cubre los
tres.</li>
<li><strong>Paradigma.</strong> El marco que le da sentido al simbolo. Es lo
mas sutil de los tres y lo que mas se salta: sin paradigma, el sigilo es un
dibujo.</li>
<li><strong>Servidor.</strong> Un trabajo con continuidad, mas largo de
construir y mucho mas útil despues. El
<a href="/blog/es-servitor-primer-servidor.html">manual del primer
servidor</a> es la ruta.</li>
</ol>
<p>El orden de aprendizaje real no es sigilo-gnosis-paradigma-servidor. Es:
<strong>gnosis primero, sigilo despues, paradigma en medio, servidor al
final</strong>. La gnosis es lo que convierte el resto en algo mas que
tecnicismo.</p>

<h2 id="primer-dia">Tu primera sesion, paso a paso</h2>
<p>Una sesion de 30 a 45 minutos. No mas: en una sesion de dos horas no hay
control de calidad. Esta es una sesion completa de principiante, la primera
que conviene hacer:</p>
<ol>
<li><strong>Preparacion (5 min).</strong> Mesa despejada, cuaderno abierto,
reloj a la vista. Escribe la fecha y la hora de inicio. Apaga las
notificaciones.</li>
<li><strong>Respiracion base (5 min).</strong> Ciclo de cuatro: inspira 4
cuentas, reten 4, exhala 4, reten 4. Diez ciclos. El objetivo no es
"relajarse" en general: es bajar el tono de la conversacion interior para
poder sostener la concentracion cuando empiece el trabajo.</li>
<li><strong>Anclaje emocional (5 min).</strong> Recupera una emocion fuerte
y reciente (una interrupcion de un enfado, un susto, una alegria). Es el
"material" con el que vas a cargar. Escribirlo en el cuaderno con la hora
exacta.</li>
<li><strong>Estado de carga (10 min).</strong> Con el ancla emocional delante,
sube la intensidad. El metodo clasico: el de los cuatro elementos (fuego,
agua, aire, tierra) o la descarga sobre el anclaje. La gnosis no se improvisa:
usa un metodo que ya sepas hacer.</li>
<li><strong>Construccion del sigilo (10 min).</strong> En el estado de carga,
dibuja el sigilo de una intencion simple y concreta. Una sola intencion: no
"todo lo que quiero", sino "que X ocurra en Y plazo". Los sigilos con
intenciones multiples no funcionan bien.</li>
<li><strong>Carga (5 min).</strong> Con la carga todavia encima, pasa el
simbolo por el fuego del encendedor o del incienso, tres veces, en sentido
horario. Sin(prisa, sin repetir el proceso mental.</li>
<li><strong>Cierre y registro (5 min).</strong> Apaga, recoge, escribe en el
cuaderno: que intentaba, que sentiste durante la carga, a que hora terminaste,
y una frase de resultado esperado con fecha. Esta ultima frase es lo que
convertira el trabajo en algo verificable en tres meses.</li>
</ol>
<p>Eso es todo. Una sesion, con cuatro elementos: intencion, gnosis, sigilo,
registro. Repite el mismo formato durante cuatro semanas y ya tienes una
practica, no una coleccion de intents.</p>

<h2 id="error">El error numero uno (y como no cometerlo)</h2>
<p>El error mas comun, y el unico que hunde a la gente en la segunda semana:
<strong>leer en vez de practicar</strong>. Leer mas articulos, mas libros,
mas sobre sigilos, sin hacer una sola sesion. Se siente como progreso porque
la pantalla esta llena de cosas nuevas, y es exactamente lo contrario.</p>
<p>El segundo error, casi tan comun: <strong>intenciones demasiado grandes</strong>.
"Que me llegue el amor" no se puede verificar ni activar. "Que me escriba
alguien que me interese antes del 30 de noviembre" si: tiene una accion
concreta, un plazo y un criterio de exito. El tamaño de la intencion no es
cuestion de fe, es cuestion de verificabilidad.</p>
<p>Y el tercero, el mas sutil: <strong>cambiar de metodo cada semana</strong>.
Cada metodo de gnosis tiene su protocolo y necesita unas pocas sesiones para
que aprendas a controlarlo. Cambiar de metodo antes de haberlo dominado es
como cambiar de estilo de natacion cada vez que te cansa el brazo.</p>
<p>Una forma de evitar los tres: <strong>la bitacora</strong>. Un cuaderno
(o una nota en el telefono) con fecha, intencion, metodo, resultado. Tres
meses de bitacora y tienes algo que ninguna cantidad de lectura te da: un
registro de lo que a ti te funciona.</p>

<h2 id="noventa-dias">El itinerario de 90 dias</h2>
<p>Este es el plan. Tres meses, con una sesion por semana como minimo.</p>
<h3>Mes 1: gnosis y primer sigilo</h3>
<p>Semana 1-2: solo respiracion y anclaje emocional. No construyas sigilos
todavia: estas entrenando el canal. Semana 3: primer sigilo, con intencion
pequena y verificable. Semana 4: segundo sigilo, otro metodo de gnosis, y
empieza la bitacora con fecha y hora.</p>
<h3>Mes 2: paradigma y carga real</h3>
<p>Semana 5-6: trabaja tu paradigma. Escribe explicitamente que significa
cada simbolo de tu sigilo dentro de tu marco, porque un simbolo que no
significa nada para ti no se carga. Semana 7: tercero y cuarto sigilo, con
intenciones distintas y por lo menos una con fecha. Semana 8: revisa la
bitacora y mira que funciono. No lo que deberia haber funcionado: lo que
paso.</p>
<h3>Mes 3: servidor y cierre de ciclo</h3>
<p>Semana 9-10: carga tu primer servidor. El
<a href="/blog/es-servitor-primer-servidor.html">manual del primer servidor</a>
esta en espanol y es la ruta mas clara. Semana 11: usa el servidor: una
peticion concreta, con instrucciones y con un plazo. Semana 12: cierra el
ciclo. Mira las tres primeras intenciones del mes 1 y comprueba cuales se
cumplieron, cuales quedaron a medias y cuales se cumplieron de otra manera.
Ese cierre es el que separa la magia del caos del coleccionismo de
intenciones.</p>
<p>Al final de los 90 dias tienes: un metodo de gnosis dominado, cuatro o
cinco sigilos con registro, un servidor en marcha, y un mapa de lo que a ti
te funciona. Ese ultimo es el activo real, y es lo que nadie te puede dar en
un libro.</p>

<h2 id="cuando-bloqueado">Cuando te bloqueas</h2>
<p>Los tres bloqueos tipicos, con su solucion:</p>
<ul>
<li><strong>"No me carga nada."</strong> O no estas cargando (falta gnosis),
o el sigilo no significa nada para ti (falta paradigma), o la intencion no
es verificable. Revisa las tres en ese orden.</li>
<li><strong>"Hice el sigilo pero no funciona."</strong> Investiga el criterio
de fallo, que es un error frecuente: el sigilo se hizo con una intencion
distinta de la que crees, el plazo paso sin que lo notaras, o el metodo de
carga estaba mal. El cuaderno es lo que te permite verlo.</li>
<li><strong>"Perdi el interes."</strong> Normal, y es el motivo por el que
esta guia tiene un itinerario con fechas en lugar de una lista de ideas. Si en
la semana 4 no tienes al menos un sigilo hecho y registrado, vuelve al mes 1
y no sigas adelante. No se avanza a un metodo que no se ha practicado.</li>
</ul>
<p>Y para los momentos en los que el bloqueo es tecnico, hay herramientas
gratitas en este sitio: el <a href="/es/tools/sigil-generator.html">generador
de sigilos en espanol</a> te da el simbolo, el
<a href="/es/tools/gnosis-timer.html">temporizador de gnosis</a> marca el
tiempo de carga, y el
<a href="/es/tools/zener-esp-trainer.html">entrenador Zener</a> entrena la
concentracion que el metodo de los cuatro elementos exige.</p>
"""

faq = [
    ("¿Por donde empiezo con la magia del caos?",
     "Por la gnosis, no por el sigilo. Las semanas 1 y 2 de este itinerario son solo respiracion y anclaje "
     "emocional. El primer sigilo llega en la semana 3, con una intencion pequeña y verificable."),
    ("¿Cuanto tiempo se necesita?",
     "Una sesion de 30 a 45 minutos, una vez por semana como minimo, durante 90 dias. Mas seguido no es mejor: "
     "el control de calidad de la gnosis se pierde con el cansancio."),
    ("¿Que intencion pongo en mi primer sigilo?",
     "Una pequena, concreta y con fecha. \"Que me escriba alguien que me interese antes del 30 de noviembre\" "
     "funciona mejor que \"que me llegue el amor\", porque tiene una accion, un plazo y un criterio de exito."),
    ("¿Necesito comprar algo para empezar?",
     "No. Las herramientas esenciales (generador de sigilos, temporizador de gnosis, trainer Zener) son gratis en "
     "este sitio. Si lo que quieres es el metodo completo por escrito, esta la guia de 9 libros, y el Codex "
     "Chaoticus en solitario cubre el marco y los ejercicios."),
    ("¿Es seguro?",
     "La magia del caos no es un ritual de riesgo fisico. Lo unico que hay que tener cuidado es con la salud "
     "durante la gnosis (mareos, hiperventilacion), y con no usar a personas que no han pedido participar como "
     "sujeto de tus sigilos. El resto es trabajo de escritorio y cuaderno."),
    ("¿Puedo practicar en espanol?",
     "Si, y este sitio esta en espanol de punta a punta: generador de sigilos, temporizador de gnosis, trainer "
     "Zener, I Ching, runas y las guias. La unica limitacion es que los libros y las apps estan en espanol y en "
     "ingles, segun el titulo."),
]

rel = [
    ("/blog/es-que-es-la-magia-del-caos.html", "Que es la magia del caos"),
    ("/blog/es-como-hacer-un-sigilo-paso-a-paso.html", "Como hacer un sigilo paso a paso"),
    ("/blog/es-gnosis-magia-del-caos.html", "Gnosis: los metodos"),
    ("/blog/es-servitor-primer-servidor.html", "Tu primer servidor"),
    ("/es/tools/gnosis-timer.html", "Temporizador de gnosis gratis"),
    ("/es/", "Centro en espanol"),
]

out = construir_es(slug, titulo, h1, lede, desc, keywords, en_href, toc, cuerpo, faq, rel,
                   fecha=FECHA)
print("escrito:", out.name, out.stat().st_size, "bytes")
