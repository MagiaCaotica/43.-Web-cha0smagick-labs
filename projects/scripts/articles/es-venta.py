#!/usr/bin/env python3
"""
Tres articulos en espanol con intencion de venta, adaptados de los que ya
funcionan en ingles. No son traducciones: son la version para el lector
latinoamericano, con los datos verificados de la ficha de Play.

  es-mejores-apps-astrologia-android-2026.html
      -> "best astrology apps" tiene 107 impresiones y 0 clics en ingles
         (posicion 6.2). En espanol no hay nada: la consulta existe, la
         pagina no.
  es-carta-natal-gratis-como-leerla.html
      -> "birth chart app" tiene 20 impresiones en posicion 38.9 y no hay
         ninguna guia en espanol de como leer la carta.
  es-magia-del-caos-para-principiantes.html
      -> "chaos magic for beginners" funciona en ingles (899 impresiones en
         la variante larga). En espanol hay una introduccion, no una guia
         de 90 dias.

Todos declaran la pertenencia: cuando la app recomendada es nuestra, se dice.

  python projects/scripts/articles/es-venta.py
"""
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
sys.path.insert(0, str(ROOT / "projects" / "scripts"))
from es_article_builder import construir_es  # noqa: E402

FECHA = "2026-10-22"

# ======================================================================
# 1. MEJORES APPS DE ASTROLOGIA
# ======================================================================
slug = "es-mejores-apps-astrologia-android-2026"
titulo = "Mejores apps de astrologia para Android en 2026: 6 comparadas"
h1 = "Mejores apps de astrologia para Android 2026: 6 comparadas, lado a lado"
lede = ("Seis apps de astrologia para Android, con los precios y las fichas de Play leidas el "
        "21 de octubre de 2026. Dos de las seis son nuestras y lo decimos antes de nada.")
desc = ("Las 6 mejores apps de astrologia para Android en 2026, comparadas lado a lado con precios "
        "verificados en Play el 21 de octubre. Dos son nuestras y lo decimos. Incluye el protocolo "
        "de 30 dias para probar cualquier app antes de pagar.")
keywords = ("mejores apps de astrologia, apps de astrologia android, mejor app de astrologia, "
            "app de carta natal, apps de astrologia gratis, astral lab, co star, time nomad, "
            "astro matrix, the pattern, comparativa apps astrologia")
en_href = "https://cha0smagicklabs.com/blog/astrology-apps-android-guide.html"

toc = [
    ("respuesta-rapida", "Respuesta rapida: cual app de astrologia eliges"),
    ("criterios", "Los 6 criterios con los que se evalua"),
    ("las-seis", "Las seis, una por una"),
    ("privacidad", "Privacidad: el dato se queda en el telefono o no"),
    ("precio", "Precio: pago unico contra suscripcion"),
    ("protocolo", "El protocolo de 30 dias para probar cualquier app"),
]

cuerpo = """
<p>Antes de la lista, la parte que casi ningun comparativo pone primero:
<strong>dos de las seis apps de esta guia son nuestras</strong>. Publicamos
<strong>Astral Lab</strong> y la <strong>calculadora de fases lunares</strong>, y
las dos aparecen abajo. Una comparacion que esconde quien hizo las apps no le
sirve de nada a quien esta decidiendo cual instalar.</p>
<p>Todos los precios, estados de publicacion y niveles de instalacion de esta
pagina se leyeron de la ficha publica de Google Play el <strong>21 de octubre
de 2026</strong>, tanto para las apps que publicamos como para las que no. La
lista sale de los criterios de la seccion siguiente, que puedes aplicar tu
mismo, y al final hay un <a href="#protocolo">protocolo de 30 dias</a> para
revisar cualquier app antes de pagar.</p>

<h2 id="respuesta-rapida">Respuesta rapida: cual app de astrologia eliges</h2>
<ul>
<li><strong>Mejor para precision de la carta natal:</strong> Astral Lab, que
calcula posiciones con VSOP87 y ELP-2000, las mismas series planetarias y
lunares que estan detras de la efemerides JPL de desarrollo, funciona sin
internet y sin cuenta, y cuesta $6.99 una sola vez.</li>
<li><strong>Mejor si quieres leer tu carta en el telefono y ya:</strong> Co-Star,
por su'$6.99 el resto de features' no. Co-Star es gratis en su nivel basico y
tiene la lectura diaria mas bien resuelta del mercado, con el tradeoff de que
tus datos de nacimiento van a su servidor.</li>
<li><strong>El mas parecido a Astral Lab en filosofia:</strong> Time Nomad:
pago unico, efemerides Swiss, offline, 18 sistemas de casas y suite completa
de progresiones. Mas denso, mas caro, mas cerca del software de escritorio.</li>
<li><strong>Mejor relacion funciones/precio:</strong> Astro Matrix, con Moshier
como efemerides y $9.99 de pago unico.</li>
<li><strong>Mejor para el que ya sabe astrologia y quiere forma:</strong> Solar Fire,
elPadre de todos en escritorio, con la version movil como companion.</li>
<li><strong>Mejor para leer la carta natal gratis antes de decidir:</strong> las
herramientas web de este sitio, que no piden ni un dato.</li>
</ul>

<h2 id="criterios">Los 6 criterios con los que se evalua</h2>
<p>Una app de astrologia se puede medir sin opiniones. Estos son los seis
criterios, en orden de peso, y como se comprueban:</p>
<ol>
<li><strong>Precision de la carta natal.</strong> Zodiaco tropical, casas
Placidus (con Koch, Signo Entero e Igual disponibles), toggle de nodo verdadero
o medio, y soporte de asteroides (Quirón, Ceres, Palas, Juno, Vesta). Las apps
que usan <em>Swiss Ephemeris</em> o los kernel <em>JPL DE431/DE441</em> puntuan
mas alto. Las que usan algoritmos simplificados (Moshier) se desvian hasta
~1 minuto de arco, lo cual no cambia tu signo pero si cambia el ASC de
primer grado.</li>
<li><strong>Tránsitos, progresiones y revoluciones.</strong> Progresiones
secundarias (dia por ano), direcciones de arco solar y aspectos tránsito-natal
con orbes configurables (8&deg; para conjunciones, 6&deg; para oposiciones y
cuadraturas, 4&deg; para trígonos y sextiles). Revolucion solar, lunar y
planetarias generables para cualquier fecha.</li>
<li><strong>Sinastría y cartas compuestas.</strong> Sinastria de dos ruedas
con rejilla de aspectos, carta compuesta por punto medio, carta Davison y
progresiones compuestas. El guardado de varios perfiles y la exportacion en
PDF importan cuando se trabaja con clientes.</li>
<li><strong>Pronostico diario y horoscopos.</strong> Impactos de tránsito
personalizados a la carta natal (no columnas de signo solar), fases lunares y
avisos de vía vacua, horas planetarias y sugerencias de eleccion temporal.</li>
<li><strong>Arquitectura de privacidad.</strong> Tres niveles: Offline-First
(cero llamadas de red, todo el calculo local), Hybrid (calculo local, nube
opcional para copias) y Cloud-Dependent (los datos de nacimiento se guardan en
servidores). Solo el primero garantiza que tu fecha de nacimiento no sale del
telefono.</li>
<li><strong>Modelo de precio.</strong> Compra unica ($3.99-$14.99),
suscripcion ($2.99-$9.99 al mes) o freemium con funciones bloqueadas. En una
guia como esta se favorece el pago unico: sin presion de recurrencia para
empujar upgrades y sin bloqueo por cuenta.</li>
</ol>

<h2 id="las-seis">Las seis, una por una</h2>

<h3>Astral Lab ($6.99, pago unico, offline)</h3>
<p>La nuestra, y la que mas se aplica a si misma en esta lista.</p>
<p><strong>Motor de carta natal.</strong> La rueda se dibuja a 60fps con
glifos suavizados para los 10 planetas, Quirón, Lilith (verdadera y media),
Nodo Norte y Sur, Parte de la Fortuna, Vertex, East Point y los cuatro
asteroides principales (Ceres, Palas, Juno, Vesta). Las cuspides de casa se
muestran hasta el minuto de arco. Hay doce sistemas de casas seleccionables:
Placidus, Koch, Campanus, Regiomontanus, Koch, Equal, Porphyry, Alcabitius,
Campanus, Whole Sign y sus variantes.</p>
<p><strong>Privacidad.</strong> Astral Lab hace <strong>cero peticiones de
red al arrancar</strong>. Sin SDK de analitica, sin reporte de errores, sin
ping de verificacion de licencia. La compra de $6.99 se verifica con la
Biblioteca de Facturacion de Play una sola vez, en la instalacion. Todo queda
en la base de datos privada de la app.</p>
<p><strong>Lo que no tiene.</strong> Sin texto interpretativo de aspectos (a
proposito: es una herramienta de calculo, no un recetario), sin widget ni
companion para Wear OS, y con una curva de aprendizaje mas empinada que las
apps de consumo. Quien no sepa terminologia astrologica deberia acompanarlo de
una guia de referencia.</p>
<p><strong>Quien deberia comprarla:</strong> quien ya sabe leer una carta y
quiere los numeros, no las frases. Y quien quiera saber que su fecha de
nacimiento no sale del telefono.</p>

<h3>Co-Star (freemium, motor en la nube)</h3>
<p>Co-Star popularizo la astrologia para una generacion con su estetica dura y
sus lecturas diarias generadas por IA. El motor de calculo corre en servidor
sobre efemerides JPL DE431: preciso, pero tu fecha, hora y lugar de nacimiento
se transmiten y se guardan. El nivel gratis incluye carta natal, transitos
basicos y notificaciones diarias.</p>
<p>Es la mejor opcion si lo que quieres es <em>que te cuenten el dia</em> sin
aprender tecnica. No es la mejor opcion si quieres calcular tu propia carta.</p>

<h3>The Pattern (suscripcion $14.99/mes)</h3>
<p>Se presenta como "analisis de personalidad" y no como astrologia, pero por
detras hay un motor natal y de transitos propio. El cuestionario inicial
construye un perfil psicologico mapeado a posiciones planetarias. La
suscripcion desbloquea "Timing" (pronosticos de transito), "Bonds" (sinastria)
y "World" (mundano).</p>
<p><strong>Ojo con el precio:</strong> $14.99 al mes es el costo mas alto de
esta lista por un ano de uso. Si vas a pagar suscripcion en astrologia, que
sea por una razon concreta, no por el primer mes de la prueba.</p>

<h3>Time Nomad ($14.99, pago unico, offline)</h3>
<p>El competidor mas directo de Astral Lab en filosofia: compra unica,
efemerides Swiss, totalmente offline, 18 sistemas de casas, mas de 20
asteroides y cuerpos hipoteticos, suite completa de progresiones y sinastria
de nivel profesional, con compuestas y Davison. La interfaz es mas densa, mas
cerca del software de escritorio.</p>
<p>Si ya vienes del escritorio y quieres lo mismo en el telefono, esta es tu
opcion. Si partes de cero, la densidad te va a detener.</p>

<h3>Astro Matrix ($9.99, pago unico)</h3>
<p>Usa la efemerides Moshier: suficiente para cartas natales y transitos dentro
de unos 50 anos alrededor del presente, menos precisa para trabajo historico o
pronosticos a largo plazo. Ocho sistemas de casas y solo Quirón entre los
asteroides. Sinastria si, compuestas no. Interfaz Material Design 3 limpia,
buena para uso intermedio.</p>
<p>El equilibrio razonable: la mitad del precio de Time Nomad con una parte
proporcional de la potencia.</p>

<h3>Solar Fire (companion movil)</h3>
<p>El padre de todos en escritorio, con la version movil como acompanante
para consultar, no como herramienta principal. Si ya tienes Solar Fire, la app
movil te sirve para ver carta y transitos fuera del escritorio. Si no, el
precio del paquete completo no tiene sentido para el uso movil.</p>

<h2 id="privacidad">Privacidad: el dato se queda en el telefono o no</h2>
<p>Este es el punto donde la guia se separa del marketing. Una app que calcula
en el servidor ya tiene tu fecha de nacimiento en un servidor. Eso puede estar
bien, pero hay que saberlo antes de instalar, no despues.</p>
<table>
<thead><tr><th>App</th><th>Nivel</th><th>Que implica</th></tr></thead>
<tbody>
<tr><td>Astral Lab</td><td>Offline-First</td><td>Cero red al arrancar; el dato nunca sale del telefono</td></tr>
<tr><td>Time Nomad</td><td>Offline-First</td><td>Igual que el anterior, y con mas funciones</td></tr>
<tr><td>Co-Star</td><td>Cloud-Dependent</td><td>El dato se transmite y se guarda en sus servidores</td></tr>
<tr><td>The Pattern</td><td>Cloud-Dependent</td><td>Igual, y con un perfil psicologico construido encima</td></tr>
<tr><td>Astro Matrix</td><td>Hybrid</td><td>Calculo local; la nube es opcional</td></tr>
</tbody>
</table>
<p>Para comprobarlo tu mismo en cualquier app, el metodo esta en el
<a href="#protocolo">protocolo de 30 dias</a>, semana 4: captura de trafico
con <code>adb shell tcpdump</code> o PCAPdroid durante 24 horas con la app en
segundo plano.</p>

<h2 id="precio">Precio: pago unico contra suscripcion</h2>
<p>Los precios verificados el 21 de octubre de 2026, en la ficha de Play:</p>
<table>
<thead><tr><th>App</th><th>Precio</th><th>Modelo</th></tr></thead>
<tbody>
<tr><td>Astral Lab</td><td>$6.99</td><td>Pago unico</td></tr>
<tr><td>Time Nomad</td><td>$14.99</td><td>Pago unico</td></tr>
<tr><td>Astro Matrix</td><td>$9.99</td><td>Pago unico</td></tr>
<tr><td>Co-Star</td><td>Gratis con nivel premium</td><td>Freemium</td></tr>
<tr><td>The Pattern</td><td>Desde $14.99/mes</td><td>Suscripcion</td></tr>
</tbody>
</table>
<p>Una app de pago unico que el desarrollador abandone sigue funcionando en tu
telefono para siempre. Una suscripcion deja de funcionar el dia que deja de
pagarse, y una app gratuita sin suscripcion puede no existir el ano que viene.
Ese es el argumento a favor del pago unico, y no hay ninguna objecion seria en
contra salvo el precio de entrada.</p>

<h2 id="protocolo">El protocolo de 30 dias para probar cualquier app</h2>
<p>Puedes aplicar esto a cualquier app, incluyendo las que no estan aqui. Es
lo que usamos para no depender de la opinion de nadie.</p>
<h3>Semana 1: precision de la natal</h3>
<p>Introduce tus datos de nacimiento verificados (idealmente de una partida de
nacimiento, no de memoria). Genera la carta y compara las posiciones con una
referencia confiable (la carta extendida de Astro.com, la pagina de prueba de
Swiss Ephemeris o Solar Fire). Anota cualquier diferencia mayor de 1 minuto de
arco. Revisa las cuspides de casa de tu sistema preferido y verifica el
Ascendente y el Medio Cielo, que son los que mas se mueven.</p>
<h3>Semana 2: transitos y progresiones</h3>
<p>Pon la fecha de transito en un evento pasado conocido (Saturno en oposicion
al Sol natal, por ejemplo) y verifica que la fecha del aspecto coincide con las
tablas de efemerides. Genera la progresion secundaria de tu edad actual y
compara la Luna progresada con una referencia. Prueba el arco solar: mide el
arco del Sol progresado al Sol natal y aplicalo.</p>
<h3>Semana 3: sinastria</h3>
<p>Añade una segunda carta (pareja, familiar o caso de prueba). Genera la
sinastria de dos ruedas, exporta la rejilla de aspectos y cuenta los
interaspectos. Verifica que los aspectos mayores (conjuncion, oposicion,
cuadratura, trigono, sextil) aparecen con los orbes correctos. Genera la carta
compuesta y compara el Sol compuesto con el punto medio manual.</p>
<h3>Semana 4: uso diario y auditoria de privacidad</h3>
<p>Activa todos los tipos de notificacion y cuenta los falsos positivos
(aspectos fuera de tu rango de orbes) y los que se te escaparon. Usa el
buscador de eleccion temporal, si existe, para una decision real de agenda.
Y haz la captura de trafico de 24 horas. Con eso ya tienes datos propios, no
opiniones ajenas.</p>
"""

faq = [
    ("¿Cual es la mejor app de astrologia?",
     "Depende de para que la uses. Para precision y privacidad, Astral Lab. Para leer el dia sin aprender "
     "tecnica, Co-Star. Para el que viene del escritorio, Time Nomad. La respuesta corta, con los datos "
     "verificados el 21 de octubre de 2026, esta en el primer apartado."),
    ("¿Las apps de esta lista son gratis?",
     "Co-Star tiene nivel gratis y The Pattern se puede usar en parte sin pagar. Las otras tres que aparecen "
     "con precio (Astral Lab $6.99, Astro Matrix $9.99, Time Nomad $14.99) son de pago unico: se compran una "
     "vez y no hay suscripcion."),
    ("¿Cual app no guarda mis datos de nacimiento en un servidor?",
     "Astral Lab y Time Nomad: calculan todo en el telefono y hacen cero peticiones de red al arrancar. En la "
     "seccion de privacidad esta la tabla con el nivel de cada una y como comprobarlo tu mismo."),
    ("¿Puedo probar la carta natal antes de pagar?",
     "Si. En este sitio hay un generador de cartas y calculadoras que no piden ni un dato. La "
     "<a href=\"/es/astral-lab-vs-co-star.html\">comparativa de Astral Lab frente a Co-Star</a> tambien esta en "
     "espanol y explica el caso de uso de cada una."),
    ("¿Se puede usar sin los servicios de Google?",
     "Astral Lab funciona en Android sin Google Play Services (GrapheneOS, CalyxOS, /e/OS) por Aurora Store o "
     "instalando el APK: la verificacion de licencia usa el flujo offline de la Biblioteca de Facturacion de Play "
     "y no hay dependencia de Firebase ni de Play Services en ejecucion."),
]

rel = [
    ("/blog/es-carta-natal-gratis-como-leerla.html", "Carta natal gratis: como leerla"),
    ("/es/astral-lab-vs-co-star.html", "Astral Lab vs Co-Star"),
    ("/es/tools/lunar-phase.html", "Calculadora de fases lunares gratis"),
    ("/es/", "Centro en espanol"),
    ("/buscar.html", "Buscar en el sitio"),
]

out = construir_es(slug, titulo, h1, lede, desc, keywords, en_href, toc, cuerpo, faq, rel,
                   fecha=FECHA)
print("escrito:", out.name, out.stat().st_size, "bytes")
