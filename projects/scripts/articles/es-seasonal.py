#!/usr/bin/env python3
"""
Los dos articulos estacionales en espanol:

  es-black-friday-libros-ocultismo-2026   (27 de noviembre: 36 dias, se publica ahora)
  es-regalos-ocultismo-navidad-2026        (25 de diciembre: 64 dias, se publica ahora)

El contenido estacional necesita 4-6 semanas de antelacion para posicionar:
publicar el 22 de octubre para Black Friday del 27 de noviembre es justo el
momento. Navidad va con mas holgura, pero el pico de busqueda de regalos de
Navidad empieza en la segunda mitad de noviembre, asi que publicar ahora tambien
es el momento.

  python projects/scripts/articles/es-seasonal.py
"""
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
sys.path.insert(0, str(ROOT / "projects" / "scripts"))
from es_article_builder import construir_es  # noqa: E402

# ======================================================================
# 1. BLACK FRIDAY
# ======================================================================
slug = "es-black-friday-libros-ocultismo-2026"
titulo = "Black Friday 2026: los 9 libros de ocultismo y cual te conviene"
h1 = "Black Friday 2026: 9 libros de ocultismo, y cual de ellos te conviene de verdad"
lede = ("El bundle de los nueve grimorios baja a $24.99 hasta el 27 de noviembre: un 59% sobre "
        "los $60.91 que costarian por separado. Esta es la guia para no comprar a ciegas: que "
        "cubre cada libro, para quien es y por donde empezar.")
desc = ("Black Friday 2026: el bundle de los 9 libros de ocultismo a $24.99 (59% de descuento). "
        "Que cubre cada grimorio, para quien es, por donde empezar y lo que todavia no necesitas. "
        "Sin letras pequenas.")
keywords = ("black friday 2026, libros de ocultismo, bundle libros ocultismo, grimorios pdf, "
            "libros magia del caos en español, libros de tarot, libros de runas, libros esotericos, "
            "black friday librosmagia")
en_href = f"{'https://cha0smagicklabs.com'}/blog/black-friday-occult-books-2026.html"

toc = [
    ("la-oferta", "La oferta, sin letras pequenas"),
    ("los-nueve", "Los nueve, uno por uno"),
    ("por-donde-empezar", "Por donde empezar si partes de cero"),
    ("lo-que-aun-no-necesitas", "Lo que todavia no necesitas"),
    ("antes-de-comprar", "Antes de comprar: usa las herramientas gratis"),
    ("como-se-entrega", "Como se entrega y que pasa si no te sirve"),
]

cuerpo = """
<p>El descuento mas grande del ano tiene fecha, y las fechas son lo unico que
no se negocia. Este Black Friday, el bundle de los nueve libros en PDF baja a
<strong>$24.99</strong> hasta el <strong>27 de noviembre</strong> frente a los
<strong>$60.91</strong> que costarian por separado: un 59% de descuento real
sobre libros reales, sin bundles inventados ni "precio de referencia" inflado.</p>
<p>Pero antes de comprar nueve libros, conviene saber cual te sirve. Este no es
un articulo de presion: es la guia para decidir, con la respuesta honesta
incluida. Y si te das cuenta de que solo necesitas uno, al final esta el como
comprarlo suelto.</p>

<h2 id="la-oferta">La oferta, sin letras pequenas</h2>
<p><strong>Nueve libros en PDF</strong>, acceso inmediato tras la compra, sin
suscripcion y sin cuenta de la editorial que se pueda cancelar sin saberlo.
Pagas una vez, lo tienes para siempre y se lee en cualquier dispositivo.</p>
<p>Lo que la oferta <strong>no</strong> incluye: nada más. No hay curso
acompañando, no hay coaching, no hay membresía que se renueve sola. Son nueve
PDF que se descargan y se leen. Quien te prometa otra cosa te esta vendiendo
otra cosa.</p>
<p>El descuento es temporal porque el bundle tiene fecha de compra, no porque
el precio vaya a subir: cuando termine la ventana, el bundle vuelve al precio
normal y los libros individuales siguen igual.</p>

<h2 id="los-nueve">Los nueve, uno por uno</h2>
<p>Este es el reparto honesto: que cubre cada libro y para quien es. No todos
sirven para todo el mundo, y el que no te corresponde no se va a poner mas
inteligente por estar en oferta.</p>
<h3>Codex Chaoticus ($4.99)</h3>
<p>El grimorio completo de la magia del caos: sigilos, gnosis, servidores,
paradigmas y los ejercicios de cada uno. Si vas a comprar un solo libro y
quiere que sea el que mas te cubre, es este. Para el que empieza de cero es
la puerta de entrada, y para el que ya practica es la referencia que le faltaba.</p>
<h3>Magical Servitors Manual ($3.99)</h3>
<p>Creacion y trabajo con servidores magicos: diseno, frase de activacion,
alimentacion y mantenimiento. El mas corto de los nueve y el que mas rapido
produce un primer resultado, porque un servidor bien diseñado se nota en una
sesion. Para quien ya hizo sigilos y quiere algo que siga funcionando.</p>
<h3>Treatise of Chaos Hunter Runes ($3.99)</h3>
<p>El sistema de runas de caos: el alfabeto reducido, la atribucion de las
runas al planeta y al dia, y el metodo para tirar con deliberacion. Es el
complemento natural del Tarot Chaos, no su sustituto: uno trabaja con el
presente y el otro con el caracter.</p>
<h3>Tarot Chaos ($9.99)</h3>
<p>El tarot Rider-Waite completo leido desde la magia del caos: los simbolos
como mapa de la persona y no como predicciones. Para quien ya usa el tarot y
quiere el lenguaje del caos, o al reves, para quien quiere el tarot sin la
envoltura de adivinacion.</p>
<h3>Mind The Gap ($9.99)</h3>
<p>Estados alterados de forma practica: como se prep one, que hacer con cada
nivel y como no convertir la experiencia en una escalera de Huxle y demas.
Sin dogma, con protocolo. Para el practicante que ya no necesita que le
expliquen el concepto.</p>
<h3>CATHOLICONOMICON ($9.99)</h3>
<p>Magia del caos para practicantes catolicos: como encaja el trabajo simbolico
dentro de una fe, que se puede y que no, y donde esta el limite. Es el libro
que mas preguntas evita. Para el catolico que lleva su fe en serio y quiere
practicar sin romperla.</p>
<h3>Liber Lvpinux ($3.99)</h3>
<p>El libro del lobo: la filosofia y la practica del lycanthropismo en clave de
magia del caos. No es una novela: es un trabajo sobre la sombra, el hambre y la
identidad. Para quien le interesa la mitologia del lobo y la psicologia del
limite.</p>
<h3>Ouija Cazadora ($3.99)</h3>
<p>Comunicacion con espiritus a traves de la ouija, en espanol y con el
protocolo completo. Es el unico de los nueve que ya estaba en espanol, y es el
mas discutido de la coleccion. Si tu interes es la ouija, compralo aqui; si
no lo es, no lo compres porque "suena"... eso.</p>
<h3>The Complete Practical Treatise on Magical Servitors ($9.99)</h3>
<p>El grimorio largo de servidores magicos, con los metodos que el manual
corto deja fuera: variaciones, transferencia, mantenimiento largo y los
problemas que aparecen cuando un servidor lleva meses en pie. Complementa al
Manual de 3,99; no lo duplica.</p>

<h2 id="por-donde-empezar">Por donde empezar si partes de cero</h2>
<p>El orden importa mas que la cantidad. Si nunca has practicado, este es el
itinerario que funciona:</p>
<ol>
<li><strong>Codex Chaoticus</strong> para entender el marco y hacer tus
primeros sigilos. Es el libro que sostiene a los demas.</li>
<li><strong>Magical Servitors Manual</strong> cuando ya domines el sigilo: es
el primer salto de una practica que dispara a un trabajo con continuidad.</li>
<li><strong>Treatise of Chaos Hunter Runes</strong> o <strong>Tarot Chaos</strong>,
segun lo que te llame. Los dos estan al mismo nivel y no hace falta los dos
a la vez.</li>
<li>El resto cuando los necesites de verdad.</li>
</ol>
<p>Si ya tienes practica y quieres el catalogo entero, el bundle tiene sentido
por el precio, no porque necesites los nueve.</p>

<h2 id="lo-que-aun-no-necesitas">Lo que todavia no necesitas</h2>
<p>Un detalle que los descuentos esconden: en la compra de un solo libro, el
precio por libro es mayor. Comprar los nueve sale mejor por unidad, pero solo
si los vas a leer. Si dudas entre dos, comprar esos dos sueltos te deja el
presupuesto para el tercero dentro de dos meses, cuando sepas si lo quieres.</p>
<p>Y una advertencia util: <strong>no se empieza leyendo</strong>. Se empieza
haciendo. Un capitulo, una practica, un registro. Leer los nueve sin
practicar es coleccionar opiniones, y eso no lo arregla ningun descuento.</p>

<h2 id="antes-de-comprar">Antes de comprar: usa las herramientas gratis</h2>
<p>Antes de pagar, comprueba que esta corriente es la tuya. Hay
<strong>61 herramientas gratuitas</strong> en el sitio, y varias te dan el
sigilo o la lectura que buscabas:</p>
<ul>
<li><a href="/tools/sigil-generator.html">Generador de sigilos</a>: haces tu
primer sigilo en el navegador, sin cuenta y sin pagar nada.</li>
<li><a href="/es/tools/iching.html">Oraculo del I Ching</a>: una consulta
completa con las monedas, para ver si el sistema te sirve.</li>
<li><a href="/es/tools/sigil-generator.html">Generador de sigilos en espanol</a>.</li>
<li><a href="/es/tools/rune-drawer.html">Sorteo de runas</a> y
<a href="/es/tools/lunar-phase.html">calculadora de fases lunares</a>.</li>
</ul>
<p>Si despues de usar esas herramientas decides que quieres el metodo completo
por escrito, ya sabes que el bundle es para ti. Si ya sabes que si, compra
directo. Las dos opciones son validas.</p>

<h2 id="como-se-entrega">Como se entrega y que pasa si no te sirve</h2>
<p>La compra se hace en Hotmart, la plataforma de la que ya usas si has
comprado los libros sueltos. Recibes los nueve PDF de inmediato y el acceso
es permanente, sin renovacion. Si tras leer el primero de los nueve decides
que no es lo que buscabas, la garantia de satisfaccion del propio vendedor se
aplica igual: se pide la devolucion y se devuelve. Escribe a
<a href="mailto:magiacaoticapractica@gmail.com">magiacaoticapractica@gmail.com</a>
y se responde enEspañol o ingles.</p>
<p>Un detalle de la oferta: el bundle es el de la tienda en espanol. Si
prefieres los libros en ingles, se compran por separado en la version
inglesa, con el mismo descuento de temporada si esta activo.</p>
"""

faq = [
    ("¿Hasta cuando dura el precio de $24.99?",
     "Hasta el 27 de noviembre de 2026, que es el Black Friday. Despues, el bundle vuelve a su precio "
     "normal y los nueve libros se pueden comprar por separado a su precio habitual."),
    ("¿Son los mismos libros que se venden sueltos?",
     "Si, exactamente los mismos nueve, en la version en espanol. Lo que cambia con la oferta es el "
     "precio del conjunto, no el contenido."),
    ("¿Hay suscripcion o renovacion?",
     "No. Pagas una vez, descargas los nueve PDF y el acceso es permanente. No hay membresia que se "
     "cobre sola ni nada que haya que cancelar."),
    ("¿Y si solo quiero uno?",
     "Entonces compra ese. El bundle sale mejor por unidad, pero solo si de verdad vas a leer los nueve. "
     "El Codex Chaoticus en solitario es el que mas cubre, y el Manual de Servidores Magicos es el mas corto."),
    ("¿Se entrega en español?",
     "El bundle es la edicion en espanol, que es la que se compra en la tienda en espanol. Las versiones en "
     "ingles se venden por separado."),
    ("¿Me devuelven el dinero si no me sirve?",
     "La garantia de satisfaccion del vendedor se aplica igual al bundle que a un libro suelto: se escribe, se "
     "pide la devolucion y se devuelve."),
]

rel = [
    ("/blog/es-que-es-la-magia-del-caos.html", "Que es la magia del caos"),
    ("/blog/es-servitor-primer-servidor.html", "Como crear un servidor magico"),
    ("/es/tools/sigil-generator.html", "Generador de sigilos gratis"),
    ("/es/", "Centro en espanol"),
    ("/buscar.html", "Buscar en el sitio"),
]

out = construir_es(slug, titulo, h1, lede, desc, keywords, en_href, toc, cuerpo, faq, rel)
print("escrito:", out.name, out.stat().st_size, "bytes")

# ======================================================================
# 2. NAVIDAD
# ======================================================================
slug2 = "es-regalos-ocultismo-navidad-2026"
titulo2 = "Regalos de ocultismo en Navidad 2026: 9 libros y cual regalar"
h1_2 = "Regalos de ocultismo en Navidad 2026: cual de los nueve libros regalar"
lede2 = ("ElBundle de los nueve grimorios sigue a $24.99 hasta el 27 de noviembre. Esta es la "
         "guia para regalar: que libro va con quien, y cuando regalar un libro de ocultismo "
         "es una mala idea.")
desc2 = ("Regalos de ocultismo en Navidad 2026: los 9 libros en PDF a $24.99 y cual regalar segun "
         "quien es. Incluye cuando NO regalar un libro de ocultismo, que es la parte que nadie dice.")
keywords2 = ("regalos de ocultismo, regalos de magia del caos, libros de ocultismo en español, regalo de "
             "tarot, regalo de runas, bundle libros navidad, libros de ocultismo para regalar, "
             "regalos de navidad esotericos")
en_href2 = "https://cha0smagicklabs.com/blog/christmas-occult-books-gift-guide-2026.html"

toc2 = [
    ("el-bundle", "El bundle, y por que el descuento dura hasta el 27 de noviembre"),
    ("para-quien", "Que libro va con quien"),
    ("cuando-no", "Cuando regalar un libro de ocultismo es mala idea"),
    ("como-se-regala", "Como se regala sin que se pierda"),
    ("si-no-sabes", "Si no sabes por donde empezar"),
]

cuerpo2 = """
<p>Regalar un libro de ocultismo tiene una dificultad que ningun otro regalo
tiene: <strong>depende por completo de quien lo recibe</strong>. A la misma
persona, un grimorio puede ser el regalo perfecto o un incomodo. A la misma
persona, el equivocado se siente como que le estas diciendo algo.</p>
<p>Este bundle de los nueve libros en PDF sigue a <strong>$24.99 hasta el 27 de
noviembre</strong> (un 59% sobre los $60.91 sueltos), asi que hay ventana
para decidir y para llegar antes de que se agote.</p>

<h2 id="el-bundle">El bundle, y por que el descuento dura hasta el 27 de noviembre</h2>
<p>Nueve PDF, acceso inmediato, pago unico, sin suscripcion y con devolucion
si no convence. Los nueve covers: Codex Chaoticus, el Manual de Servidores
Magicos, el Tratado de Runas Cazadoras del Caos, Tarot Chaos, Mind The Gap,
CATHOLICONOMICON, Liber Lvpinux, Ouija Cazadora y el Tratado Practico Completo
sobre Servidores Magicos.</p>
<p>Si ya sabes a quien se lo regalas, un libro suelto suele ser mejor regalo
que el bundle: se siente mas personal y no le da a alguien nueve cosas que
lebro. El bundle tiene sentido cuando regalas a un grupo, o cuando sabes que
quien lo recibe quiere el metodo entero.</p>

<h2 id="para-quien">Que libro va con quien</h2>
<table>
<thead><tr><th>A quien se lo regalas</th><th>Libro</th><th>Por que</th></tr></thead>
<tbody>
<tr><td>Al que ya practices magia del caos</td><td>CATHOLICONOMICON</td><td>Es el que mas preguntas resuelve de las que se hacen por dentro de una fe, y no se parece a nada que ya tenga</td></tr>
<tr><td>A quien empieza de cero</td><td>Codex Chaoticus</td><td>El unico que se sostiene solo: sigilos, gnosis, servidores y ejercicios</td></tr>
<tr><td>A quien le gusta el tarot</td><td>Tarot Chaos</td><td>El mismo mazo de siempre, leido desde otro sitio</td></tr>
<tr><td>A quien le gustan las runas</td><td>Treatise of Chaos Hunter Runes</td><td>El sistema completo, no solo el alfabeto</td></tr>
<tr><td>A quien ya tiene sigilos y quiere algo que dure</td><td>The Complete Practical Treatise on Magical Servitors</td><td>El grimorio largo, con el mantenimiento que el corto deja fuera</td></tr>
<tr><td>A quien esta con los estados alterados</td><td>Mind The Gap</td><td>Protocolo, no teoria</td></tr>
<tr><td>A quien le interesa la sombra y el lobo</td><td>Liber Lvpinux</td><td>Filosofia y practica, no novela</td></tr>
<tr><td>A quien le interesa la ouija</td><td>Ouija Cazadora</td><td>El unico que ya estaba en espanol, con el protocolo completo</td></tr>
</tbody>
</table>

<h2 id="cuando-no">Cuando regalar un libro de ocultismo es mala idea</h2>
<p>Hay tres casos en los que el bundle de nueve libros es exactamente la
decision equivocada, y conviene decirlos con claridad:</p>
<ul>
<li><strong>A alguien que no te ha dicho que le interesa.</strong> Un grimorio
regalado a un escéptico no es un regalo con intención: es una afirmación sobre
la otra persona. Si no lo ha pedido, regala algo que pueda abrir sin
comprometerse con nada.</li>
<li><strong>A alguien en un proceso vulneral o de duelo.</strong> No es
censoría, es cuidado: nada de lo que hay aquí va a ayudar en ese momento, y
una carta con sigilos puede doler más que alleviate.</li>
<li><strong>A una pareja que no comparte esto.</strong> Un ritual de amor
regalado con esa intencion, cuando la otra persona no cree en el, es una
presion con forma de tech.</li>
</ul>
<p>En los tres casos, el mismo dinero en un libro que se lee por placer
funciona mejor, y elBundle de nueve solo tiene sentido si la otra persona ya
esta dentro.</p>

<h2 id="como-se-regala">Como se regala sin que se pierda</h2>
<p>Los PDF se descargan y se leen en cualquier dispositivo, asi que hay dos
formas de regalar:</p>
<ul>
<li><strong>El enlace de descarga con una nota.</strong> Es lo habitual y
funciona: llega el PDF, la persona lo abre cuando quiera y el regalo no se
pierde en un buzon.</li>
<li><strong>La lectura en voz alta de un fragmento.</strong> Si el libro es
para alguien con quien ya compartes esto, dedicarle veinte minutos del
capitulo que mas te gusta, antes de que lo abra, es lo que convierte un PDF
en un regalo.</li>
</ul>
<p>Y un consejo de fecha: el bundle esta en precio hasta el 27 de noviembre,
pero el pico de las compras de Navidad es la segunda semana de diciembre.
Si lo regalas para Navidad, compralo antes del 27 para que llegue con margen
y puedas reimprimirlo.</p>

<h2 id="si-no-sabes">Si no sabes por donde empezar</h2>
<p>Si de verdad no sabes cual va con quien, hay una forma de averiguarlo sin
comprar nada: las herramientas gratuitas del sitio funcionan con la misma
logica que los libros. <a href="/es/tools/sigil-generator.html">Genera un
sigilo</a>, <a href="/es/tools/iching.html">tira unas monedas</a> o
<a href="/es/tools/rune-drawer.html">sortea unas runas</a> y mira si la
persona se queda enganchada con la idea. Si se queda, el bundle es para ella.
Si no, un libro de witchcraft te va a salir mejor.</p>
"""

faq2 = [
    ("¿El bundle de nueve libros es un buen regalo?",
     "Es un buen regalo para alguien que ya esta dentro de la magia del caos y quiere el metodo completo. "
     "Para alguien que no ha mencionado esto, un libro suelto que se pueda abrir sin compromiso es mejor regalo."),
    ("¿Hasta cuando esta el precio de $24.99?",
     "Hasta el 27 de noviembre de 2026. Despues, el bundle vuelve a su precio y los libros sueltos siguen igual."),
    ("¿Y si no le gusta?",
     "La garantia de satisfaccion se aplica igual: se escribe a magiacaoticapractica@gmail.com, se pide la "
     "devolucion y se devuelve. El bundle no tiene letra pequena."),
    ("¿Hay suscripcion?",
     "No. Es un pago unico con descarga inmediata y acceso permanente."),
    ("¿Los libros son los mismos en espanol que en ingles?",
     "El bundle es la edicion en espanol. Las versiones en ingles se venden por separado, con el mismo "
     "descuento de temporada si esta activo."),
]

rel2 = [
    ("/blog/es-black-friday-libros-ocultismo-2026.html", "Black Friday: los 9 libros y cual te conviene"),
    ("/blog/es-que-es-la-magia-del-caos.html", "Que es la magia del caos"),
    ("/es/tools/rune-drawer.html", "Sorteo de runas gratis"),
    ("/es/", "Centro en espanol"),
    ("/buscar.html", "Buscar en el sitio"),
]

out2 = construir_es(slug2, titulo2, h1_2, lede2, desc2, keywords2, en_href2, toc2, cuerpo2, faq2, rel2)
print("escrito:", out2.name, out2.stat().st_size, "bytes")
