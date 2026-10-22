#!/usr/bin/env python3
"""
Contenido profundo por herramienta: que mide, que NO mide, cómo funciona y
que puede esperar el usuario. Sin esto, las 58 herramientas dicen lo mismo y
el valor es relleno.

Para las 40 del motor comun se toma de su propio catalogo (method, result y
safety), que ya es especifico. Para las 15 propias, redactado aquí.

Ademas se anade el bloque E-E-A-T comun: quién la hizo, dónde van los datos,
cuándo se reviso y el enlace a la politica editorial.

  python projects/scripts/gen-toolkit-data.py
"""
import json
import sys
import unicodedata
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from toolkit_content import CONTENIDO

ROOT = Path(".").resolve()
SITE = "https://cha0smagicklabs.com"
REVISADO = "2026-10-21"


def sin_acentos(t):
    return "".join(c for c in unicodedata.normalize("NFKD", t or "") if not unicodedata.combining(c)).lower()


PRODUCTO = {
    "astrologia": ("Astral Lab en Google Play ($6.99, una vez)", f"{SITE}/apps/astral-lab.html",
                   "positions calculated with VSOP87 and ELP-2000, offline and with no account"),
    "lunar": ("Lunar Phase Calculator en Google Play ($3.99, una vez)", f"{SITE}/apps/lunar-phase-calculator.html",
               "the phase rendered in real time and the times of every phase calculated offline"),
    "tarot": ("Tarot Rider Waite en Google Play ($9.99, una vez)", f"{SITE}/apps/unofficial-rider-waite-tarot.html",
              "the 78 cards with upright and reversed meanings, offline and without ads"),
    "suenos": ("Lucid Dream en Google Play ($9.99, una vez)", f"{SITE}/apps/lucid-dream.html",
               "the dream journal, the reality checks and the session timer, working with no connection"),
    "runas": ("Norse Rune Oracle en Google Play ($3.99, una vez)", f"{SITE}/apps/norse-rune-oracle.html",
              "the 24 runes with their meanings and a full spread, offline"),
    "sigilos": ("Chaos Sigil Generator en Google Play ($3.99, una vez)", f"{SITE}/apps/chaos-sigil-generator.html",
                "the sigil drawn and saved as an image, with the charging timer, working with no connection"),
    "oraculos": ("Tarot Rider Waite en Google Play ($9.99, una vez)", f"{SITE}/apps/unofficial-rider-waite-tarawite.html",
                 "the whole deck offline, with the daily card and the spreads"),
    "rituales": ("Los 9 libros en PDF ($24.99, 59% de descuento)", f"{SITE}/landing-pages/books-bundle.html",
                 "el protocolo completo por escrito, con lo que falló incluido"),
    "correspondencias": ("Los 9 libros en PDF ($24.99, 59% de descuento)", f"{SITE}/landing-pages/books-bundle.html",
                         "las correspondencias completas, con el método y sus límites"),
    "seguimiento": ("Los 9 libros en PDF ($24.99, 59% de descuento)", f"{SITE}/landing-pages/books-bundle.html",
                    "el sistema de registro completo, con los protocolos de la práctica"),
    "seguridad": ("Los 9 libros en PDF ($24.99, 59% de descuento)", f"{SITE}/landing-pages/books-bundle.html",
                  "los protocolos de seguridad y de límites, escritos y revisados"),
    "organizacion": ("Los 9 libros en PDF ($24.99, 59% de descuento)", f"{SITE}/landing-pages/books-bundle.html",
                     "las plantillas de trabajo, listas para imprimir"),
    "símbolos": ("Chaos Sigil Generator en Google Play ($3.99, una vez)", f"{SITE}/apps/chaos-sigil-generator.html",
                 "la cifra completa, guardada cómo imagen, sin conexión"),
    "bienestar": ("Lucid Dream en Google Play ($9.99, una vez)", f"{SITE}/apps/lucid-dream.html",
                 "el temporizador y el diario de sesiones, funcionando sin conexión"),
    "paranormal": ("NOCTEM en Google Play ($14.99, una vez)", f"{SITE}/apps/noctem-tools.html",
                   "la suite completa de investigacion, con SLS, EVP y sensores, offline"),
}

VALOR = {
    "astrologia": "Guarda la lectura, revísala en 30 días y compara: eso es lo que convierte una lectura en un registro.",
    "lunar": "Anota la fecha de cada fase que uses. Con tres meses seguidos ya tienes un patrón propio, no una opinión.",
    "tarot": "Anota la carta, la pregunta y lo que decidiste después. En tres meses, el patrón se ve solo.",
    "suenos": "Escribe el sueño antes de interpretarlo. La interpretación cambia cuándo la memoria ya esta reescrita.",
    "runas": "Anota el resultado y lo que hiciste después. La runa no dice nada: la accion que la acompaña si.",
    "sigilos": "Guarda la imagen del sigilo, la fecha de carga y la acción mundana. Eso es un registro revisable.",
    "oraculos": "Pregunta, anota la respuesta y lo que cambiaste después. Sin la tercera parte no hay registro.",
    "rituales": "Anota el ritual, la intención y el resultado. Con el mismo ritual dos veces, la comparación es posible.",
    "correspondencias": "Usa la tabla cómo referencia, no cómo resultado. El valor está en volver a ella.",
    "seguimiento": "El registro solo sirve si se vuelve a leer. Ponle fecha de revisión a la entrada.",
    "seguridad": "Guarda la lista de esta sesión. Las reglas se olvidan; la lista no.",
    "organizacion": "Lo que organizas aquí es el trabajo de dentro: vuelve a él cuándo la sesión termine.",
    "símbolos": "Guarda la cifra, anota la fecha y úsala en el mundo. Una cifra sin fecha no es un registro.",
    "bienestar": "El temporizador es la parte fácil. Lo que cambia el resultado es lo que anotas al terminar.",
    "paranormal": "Guarda el audio original, la hora exacta y el control en silencio. Sin eso no hay nada que comparar.",
}

SIGUIENTE = {
    "astrologia": ("La misma carta, sin depender del movil",
                    "Si lo que te sirve de esta página es la carta, la app la calcula igual y la guarda contigo. No es mejor: es la misma, y además funciona sin conexión."),
    "lunar": ("La misma fase, en el aire",
               "Aquí calculas una fase. La app dibuja la luna real en tu ubicacion y te dice cuándo caen las siguientes, sin conexión."),
    "tarot": ("El mazo entero, sin conexión",
              "Aquí tienes acceso a las cartas que necesitas. La app lleva el mazo Rider-Waite completo con significados al derecho y al revés, y funciona en el metro."),
    "suenos": ("El diario, en el bolsillo",
                "La herramienta te ayuda a practicar. La app guarda el sueno, la comprobacion de realidad y el tiempo de sesión, y todo se queda en el dispositivo."),
    "runas": ("Las 24 runas, con su significado",
              "Aquí sorteas. La app trae las 24 runas con su significado y su posición, para usarlas sin internet."),
    "sigilos": ("El sigilo, guardado cómo imagen",
                "Aquí generas el símbolo. La app lo dibuja, lo guarda cómo imagen y trae el temporizador de carga, para que no dependas de la página."),
    "oraculos": ("El mazo y las tiradas, sin conexión",
                 "La app lleva las 78 cartas, la tirada de una carta y la de tres, y el estado de la partida guardados."),
    "rituales": ("El protocolo completo, por escrito",
                 "Si lo que te sirve es el procedimiento entero, esta es la versión escrita: nueve libros con los pasos, lo que falló y los límites de cada método."),
    "correspondencias": ("Las correspondencias, con su método",
                          "La tabla de esta página es la referencia. En el libro está la tabla con el método que la hace útil y el aviso de dónde falla."),
    "seguimiento": ("El sistema de registro, hecho para durar",
                    "Aquí guardas una entrada. El libro tiene el sistema completo: qué se anota, cómo se compara y cuándo se revisa."),
    "seguridad": ("Los límites, explicados",
                 "Las listas de esta página sirven. El libro explica el porqué de cada límite y cómo decidir cuándo parar."),
    "organizacion": ("Las plantillas, listas para imprimir",
                      "Aquí ordenas. En el libro están las plantillas de trabajo del grimorio, para imprimir y usar sin pantalla."),
    "símbolos": ("La cifra, guardada y lista",
                 "La app dibuja el resultado y lo deja en el carrete del teléfono, con el temporizador de carga al lado."),
    "bienestar": ("La sesión, registrada",
                  "La app guarda el tiempo de meditación, las comprobaciones y el diario, con lo que la página no puede guardarte."),
    "paranormal": ("La suite de investigacion, offline",
                   "La app lleva el SLS, el grabador EVP con control en silencio, los sensores y el registro de sesión, todo en el dispositivo y sin cuentas."),
}

# Las 15 propias: que mide, que NO mide, y que puede esperar el usuario.
PROPIAS = {
    "gnosis-timer": ("suenos", "#timerDisplay", {
        "limits": "Mide el tiempo de una sesión de gnosis. No mide si la sesión funcionó, no registra lo que viste y no es un método de inducción: es un cronometro con la respiración de fondo.",
        "faq": [
                [
                        "¿Qué es una sesión de gnosis?",
                        "Es un rato de práctica enfocada, con los ojos cerrados y una sola pregunta en la cabeza. La herramienta solo mide el tiempo y marca la pauta de respiración; el resto lo pones tú."
                ],
                [
                        "¿Cuánto debe durar?",
                        "Entre 10 y 20 minutos es lo habitual. Por eso hay tres duraciones y no una: no existe la duración correcta, existe la que puedas sostener sin forzar."
                ],
                [
                        "¿Y si no me pasa nada?",
                        "Entonces no te pasó nada, y eso también es un dato. Anótalo con la fecha. La práctica se entrena, y una sesión vacía junto a una buena informa más que una sola buena."
                ]
        ],
        "expect": "Un temporizador con la pauta de respiración. Lo que salga de ahí depende de tu práctica, no de la página.",
    }),
    "rune-drawer": ("runas", "#runeResult", {
        "limits": "Sortea una runa al azar y devuelve su significado. No es una predicción, no tiene en cuenta tu carta, tu situación ni el momento, y las runas no son adivinatorias.",
        "expect": "Una runa con su significado y una pregunta para responder. El valor está en la reflexión que hagas con ella, no en el resultado.",
    }),
    "zener-esp-trainer": ("bienestar", "#resultsPanel", {
        "limits": "Practica percepcion extrasensorial con cartas de Zener: aciertos, fallos y la serie completa. No mide telepatia ni don, y la probabilidad de acierto por azar es de una entre cinco.",
        "expect": "Una serie con aciertos, fallos y el porcentaje de acierto. Un resultado alto puede ser suerte; por eso se práctica con series largas y con control.",
    }),
    "astrology-sign-calculator": ("astrologia", "#results", {
        "limits": "Calcula el signo solar a partir de la fecha. No usa la hora ni el lugar, así que no puede decirte tu Ascendente ni tu Luna, y el signo solar cambia según el criterio que se use.",
        "expect": "Tu signo solar y su elemento en una frase. Es el punto de partida, no una carta.",
    }),
    "candle-color-calculator": ("correspondencias", "#resultDisplay", {
        "limits": "Relaciona el color de una vela con su correspondencia tradicional. Son asociaciones de tradición, no reglas universales, y el color final depende del aceite, del paves y de la luz de la habitacion.",
        "expect": "El color con su correspondencia y una justificacion para elegirlo.",
    }),
    "digital-pendulum": ("oraculos", "#answerDisplay", {
        "limits": "Simula un pendulo con una secuencia aleatoria ponderada. No mide un pendulo real, no es intuitivo y no debe usarse para decidir sobre salud, dinero ni relaciones.",
        "expect": "Una respuesta de una lista de respuestas posibles, con el matiz de cada una para que elijas tu, no la que te gusta.",
    }),
    "goetic-spirit-selector": ("rituales", "#resultsCount", {
        "limits": "Selecciona los espíritus de la Goetia a partir de criterios que tú le describes. No evoca a nadie, no verifica que el espíritu corresponda a tu caso, y la tradición goética tiene reglas propias de seguridad que hay que leer antes de usarla.",
        "expect": "Los espíritus que mejor encajan con lo que describes, con su ámbito y sus notas. Es una orientación, no una invocación.",
    }),
    "iching-changing-lines": ("oraculos", "#hexagramDisplay", {
        "limits": "Convierte monedas en líneas mutantes y en hexagramas. No consulta una secuencia autorizada, no es un oráculo con estado, y las líneas se tiran una a una y en orden.",
        "expect": "El hexagrama con sus líneas que cambian y su lectura tradicional.",
    }),
    "moon-voc": ("lunar", "#nextVocCard", {
        "limits": "Calcula la vocacion lunar de un dia: la luna y su signo, con la invitacion tradicional. Es astronomia de posición, no una predicción, y no depende de tu lugar.",
        "expect": "La luna del dia, su signo y una invitacion breve para el trabajo ritual de ese dia.",
    }),
    "planetary-hours": ("astrologia", "#locationDisplay", {
        "limits": "Calcula las horas planetarias a partir de la hora del reloj. Usa el tiempo local y no el tiempo solar, y en latitudes altas las duraciones se desvían de la regla traditional.",
        "expect": "La hora planetaria vigente, que planeta rige y hasta cuándo. Sirve para elegir el momento de un trabajo, no para decidir el contenido.",
    }),
    "planetary-kamea-sigil": ("sigilos", "#sigilDisplay", {
        "limits": "Dibuja el sigilo de una kamea planetaria concreta, con la disposicion traditional de trazos. No verifica que la kamea este bien trazada ni que el trazo sea correcto: eso se aprende a mano y se revisa.",
        "expect": "El sigilo de la kamea elegida, con el trazado paso a paso para repasarlo.",
    }),
    "reality-check-tracker": ("suenos", "#entryResult", {
        "limits": "Registra las comprobaciones de realidad de una sesión. No las evalua: no distingue una comprobacion eficaz de una que falló, y no guarda nada fuera de tu navegador.",
        "expect": "Una lista de comprobaciones con su resultado y el recuento de aciertos. El valor esta en comparar semanas.",
    }),
    "sigil-charging-timer": ("sigilos", "#resultRating", {
        "limits": "Es un temporizador de carga con una escala de intensidad para que anotes cómo la viviste. No carga nada por si mismo, no verifica la fuerza del sigilo y el resultado que anotaste es una opinion, no una medida.",
        "faq": [
                [
                        "¿El temporizador carga el sigilo?",
                        "No. El temporizador solo da una pauta de tiempo y una escala para anotar cómo lo viviste. La carga la haces tú, con la atención."
                ],
                [
                        "¿Qué intensidad debo anotar?",
                        "La que sentiste, no la que crees que debería ser. La escala sirve para compararte contigo mismo la semana pasada, no con nadie más."
                ],
                [
                        "¿Cuánto tiempo conviene cargar?",
                        "El que puedas sostener sin tensión. Más tiempo con tensión no es más carga: es más esfuerzo."
                ]
        ],
        "expect": "Un temporizador con una escala de intensidad y una nota final. La escala es tuya: lo único comparable es lo que anotaste la semana anterior.",
    }),
    "spell-builder": ("rituales", "#spellResult", {
        "limits": "Compone un hechizo a partir de elementos que eliges y te devuelve una estructura con pasos. No verifica que la combinacion tenga fundamento, no evalua si es seguro en tu caso y no es un substituto de consultar un libro de ocultismo.",
        "expect": "Un hechizo estructurado: intencion, elementos, pasos y un cierre. Útil cómo borrador, nunca cómo receta cerrada.",
    }),
    "tarot-yes-no": ("tarot", "#readingSummary", {
        "limits": "Tira una o tres cartas del Rider-Waite con su significado al derecho y al revés. No es una predicción, no sabe nada de tu situación y las cartas no tienen respuestas fijas: el significado es un punto de partida, no un veredicto.",
        "expect": "Las cartas, su interpretación y una pregunta para responder. La parte útil es la reflexión que escribas después.",
    }),
}


# ---------------------------------------------------------------- EMBEBIDAS
# Las que viven en un iframe externo. No tienen motor propio: el valor, los
# limites y el camino al producto se escriben aqui, una a una.
EMBEBIDAS = {
    "iching": {
        "name": "Oraculo del I Ching",
        "value": "Tira las monedas con la pregunta escrita y anota el hexagrama con su fecha. Con seis meses de hexagramas anotados, la practica empieza a tener memoria.",
        "limits": "El lanzador de monedas y la lectura del hexagrama. La conversion de lineas en hexagrama y su lectura tradicional se hacen con el criterio estandar del Libro de los Cambios: no es un metodo deDy(c) con pretensiones de oraculo con estado.",
        "expect": "El hexagrama con su nombre, sus lineas y la lectura tradicional de cada una.",
        "next": "El oraculo completo, sin conexion",
        "next_text": "Aqui consultas el hexagrama en el navegador. La app I Ching Oracle lleva el metodo completo, las 64 lecturas y el registro de tiradas, y funciona sin internet.",
        "label": "I Ching Oracle en Google Play ($3.99, una vez)",
        "link": "https://cha0smagicklabs.com/apps/iching-oracle.html",
        "method": [
            "Escribe la pregunta en una sola linea, con una palabra clave.",
            "Lanza las monedas seis veces, en orden, y anota el resultado.",
            "Mira el hexagrama con sus lineas y vuelve a el en 30 dias."
        ],
        "faq": [
            [
                "¿Por qué hay que tirar las monedas en orden?",
                "Porque el orden de las líneas es lo que distingue un hexagrama de su inverso. Tiradas en desorden dan un resultado que no se puede leer."
            ],
            [
                "¿El resultado depende de la pregunta?",
                "Depende de la pregunta que llevas, no del azar. Por eso el orden de la pregunta es el orden del método: primero la pregunta, después las monedas."
            ]
        ]
    },
    "lunar-phase": {
        "name": "Calculadora de fases lunares",
        "value": "Anota la fase de cada dia que ritualizas y que hiciste. Con un mes de anotaciones, la luna deja de ser un dato del calendario y pasa a ser tu propio ritmo.",
        "limits": "Calcula la fase lunar y el nombre de la fase para una fecha. No calcula la hora exacta de los cambios de fase ni la altura de la luna sobre el horizonte, que dependen del lugar.",
        "expect": "La fase, el porcentaje iluminado, la edad de la luna y los dias que faltan para la fase siguiente.",
        "next": "La luna real, en tu cielo",
        "next_text": "Aqui calculas una fase. La app Lunar Phase Calculator dibuja la luna real en tu ubicacion y te dice cuando caen las siguientes, sin conexion.",
        "label": "Lunar Phase Calculator en Google Play ($3.99, una vez)",
        "link": "https://cha0smagicklabs.com/apps/lunar-phase-calculator.html",
        "method": [
            "Elige la fecha que te interesa y comprueba la fase.",
            "Anota la fase y lo que hiciste ese dia.",
            "Al mes, mira la serie: hay un patron que no es el del calendario."
        ],
        "faq": [
            [
                "¿La fase que da la herramienta es exacta?",
                "Es aproximada: se calcula con la media de los elementos orbitales, con un margen de algunas horas. Para el instante exacto de un cambio de fase, hace falta una efeméride."
            ],
            [
                "¿Sirve para planificar rituales?",
                "Para elegir la ventana, sí. El momento exacto lo eliges tú, mirando el calendario local y el horizonte donde estés."
            ]
        ]
    },
    "sigil-generator": {
        "name": "Generador de sigilos goeticos",
        "value": "Genera el sigilo y anota, con la fecha, que accion mundana lo acompana. Un sigilo sin accion anotada no deja registro: se pierde en la memoria.",
        "limits": "Genera el sigilo de un espiritu de la Goetia con los metodos de reduccion mas comunes. Es una herramienta de foco y no una invocacion: no verifica el resultado ni su garantias.",
        "expect": "El sigilo del espiritu elegido, listo para descargar y para imprimir.",
        "next": "El sigilo, guardado y con temporizador de carga",
        "next_text": "Aqui lo generas. La app Chaos Sigil Generator lo dibuja, lo guarda como imagen y trae el temporizador de carga, para que no dependas de la pagina.",
        "label": "Chaos Sigil Generator en Google Play ($3.99, una vez)",
        "link": "https://cha0smagicklabs.com/apps/chaos-sigil-generator.html",
        "method": [
            "Elige el espiritu y comprueba que su ambito es el que buscas.",
            "Genera el sigilo y revisalo: el glifo se traza a mano, la maquina solo lo propone.",
            "Descargalo, cargalo y anota el resultado con la fecha y la accion mundana."
        ],
        "faq": [
            [
                "¿El sigilo generado sirve tal cual?",
                "Sirve como punto de partida para tu propia traza. La geometría es la propuesta de la máquina; el trazo final es tuyo, y por eso hay que rehacerlo a mano."
            ],
            [
                "¿Genera los sellos de los 72 espíritus?",
                "Sí, con los métodos de reducción más comunes. La lectura del sello y su Invocation son un trabajo aparte, con su propia guía."
            ]
        ]
    },
    "activador-servidores": {
        "name": "Activador de servidores magicos",
        "value": "Diseña el servidor con su intencion y su frase de activacion, y anota el resultado con la fecha. El diseño escrito es lo que hace comparable un servidor con otro.",
        "limits": "Ayuda a diseñar y activar un servidor magico con su intencion, su simbolo y su frase. Es una guia de trabajo, no una instruccion de un grimorio, y no verifica ningun resultado.",
        "expect": "El diseno del servidor con sus elementos, su frase de activacion y los pasos de trabajo.",
        "next": "El protocolo de servidores, por escrito",
        "next_text": "Si lo que te sirve es el metodo, el libro lo tiene completo: creacion, activacion, alimentacion y mantenimiento, con lo que fallo incluido.",
        "label": "Los 9 libros en PDF ($24.99, 59% de descuento)",
        "link": "https://cha0smagicklabs.com/landing-pages/books-bundle.html",
        "method": [
            "Define la intencion y el ambito del servidor: que hace y hasta donde llega.",
            "Disena el simbolo y la frase de activacion, y anota el trabajo.",
            "Revisalo a los 30 dias: lo que se escribe es lo que se puede comparar."
        ],
        "faq": [
            [
                "¿Un servidor necesita un ritual de activación?",
                "Necesita un momento y una frase, y sobre todo un diseño pensado. La activación ritual es la parte que se puede hacer con cuidado y con intención clara."
            ],
            [
                "¿Cuál es el error más común?",
                "Diseñar un servidor con un ambito demasiado amplio, que no se puede mantener y que acaba pesando. Un ambito pequeño y revisado funciona mejor que uno grande y olvidado."
            ]
        ]
    },
    "tengwar-transcriber": {
        "name": "Transcriptor de Tengwar",
        "value": "Transcribe tu nombre en tengwar y anota la forma que te gusta. El tengwar se aprende usandolo: tres nombres propios ya te dan mas que cualquier tabla.",
        "limits": "Transcribe del ingles al tengwar con el modo estandar. No cubre tengwar de Quenya ni de Sindarin con sus reglas propias, ni la caligrafia con staves.",
        "expect": "La palabra en tengwar, lista para copiar.",
        "next": "La comunidad, donde se habla de esto",
        "next_text": "Aqui transcribes. Donde si hay algo que ofrecerte es la comunidad: cada dia se comenta sobre scripts, tengwar y cosas parecidas.",
        "label": "La comunidad de Cha0smagick Labs (Telegram)",
        "link": "https://t.me/cha0smagicklabs",
        "method": [
            "Escribe el texto en ingles, tal como se pronunciaria.",
            "Transcribe y compara las formas: el tengwar tiene varias para el mismo sonido.",
            "Elige la que mejor te funcione y usala siempre igual."
        ],
        "faq": [
            [
                "¿Traduce a Quenya o a Sindarin?",
                "A tengwar estándar, que es el modo que se usa para escribir nombres y frases en el uso corriente. Quenya y Sindarin tienen reglas propias, más precisas y bastante distintas."
            ],
            [
                "¿Puedo usar el resultado en un tatuaje?",
                "Puedes, pero el trazo de una caligrafía con staves es otra cosa: la transcripción es plana y legible, no caligráfica. Para un tatuaje, conviene llevarla a un calígrafo que entienda el sistema."
            ]
        ]
    },
    "viking-runes": {
        "name": "Oraculo de runas vikingas",
        "value": "Sortea, lee la runa y anota que cambias despues. Las runas vikingas (Futhark joven) no son el Elder Futhark: son otro sistema con otros usos, y la diferencia importa.",
        "limits": "Oraculo de runas vikingas con el Futhark joven de 16 signos. No es el sistema del Elder Futhark de 24 runas, y no incluye los codigos Aett ni las formas runicas de inscriptions.",
        "expect": "La runa sorteada con su significado y la posicion que ocupaba en la tirada.",
        "next": "Las 24 runas del Elder Futhark, con su significado",
        "next_text": "Aqui sorteas runas vikingas. La app Norse Rune Oracle lleva el Elder Futhark completo con significados, tirada y registro, offline.",
        "label": "Norse Rune Oracle en Google Play ($3.99, una vez)",
        "link": "https://cha0smagicklabs.com/apps/norse-rune-oracle.html",
        "method": [
            "Haz la pregunta antes de tirar, con una sola palabra clave.",
            "Sortea la runa y lee su significado y su posicion en la tirada.",
            "Anota con la fecha: las runas no dicen nada por si solas."
        ],
        "faq": [
            [
                "¿Qué sistema de runas usa?",
                "El Futhark joven, de 16 signos, que es el de las inscripciones vikingas. No es el Elder Futhark de 24 runas, que es otro sistema y otra época."
            ],
            [
                "¿Las runas vikingas se usan para adivinar?",
                "En su uso histórico se grababan, no se sorteaban para adivinar. El uso oracular es moderno. Si te interesa la historia, el libro del estudio la cuenta con fuentes."
            ]
        ]
    },
    "beat-the-dealer": {
        "name": "Beat the Dealer: estrategia de blackjack",
        "value": "Apunta la mano y lo que habrias hecho. Una estrategia de blackjack se aprende con el error anotado, no con la regla memorizada.",
        "limits": "Simulador de blackjack para practicar estrategia basica. No es un casino, no hay dinero real y ninguna estrategia garantiza resultado: el azar manda en cada mano.",
        "expect": "La mano, la recomendacion basica y el resultado, con la opcion de jugar miles de manos para ver la varianza.",
        "next": "La comunidad, donde esto se comenta",
        "next_text": "Esta es una herramienta de practica y no hay nada que venderte aqui. Donde si hay contenido es la comunidad: cada dia se habla de estas cosas y de las nuestras.",
        "label": "La comunidad de Cha0smagick Labs (Telegram)",
        "link": "https://t.me/cha0smagicklabs",
        "method": [
            "Elige la mesa y la apuesta antes de repartir.",
            "Juega la mano y anota que habrias hecho distinto.",
            "Simula miles de manos: la estrategia es una esperanza, la varianza es el resultado."
        ],
        "faq": [
            [
                "¿Hay una estrategia que gane siempre?",
                "No. La estrategia básica reduce la ventaja de la casa; no la elimina. Por eso el simulador es la herramienta útil: muestra la varianza en mil manos."
            ],
            [
                "¿Sirve para jugar dinero real?",
                "Sirve para practicar. Jugar con dinero real con la estrategia del simulador no funciona: las decisiones cambian cuando hay dinero en la mesa."
            ]
        ]
    },
    "roulette-lab": {
        "name": "Roulette Lab: simulador de probabilidades",
        "value": "Simula miles de spins y anota la desviacion. Es la forma de ver la varianza con tus propios ojos en lugar de leerla en una tabla.",
        "limits": "Simulador de la ruleta europea con probabilidades calculadas. No es un casino, no hay dinero real, y ningun sistema de apuesta anula la ventaja de la casa: eso es justo lo que se ve al simular.",
        "expect": "La simulacion, las probabilidades por tipo de apuesta y el resultado a largo plazo de cada sistema.",
        "next": "La comunidad, donde esto se comenta",
        "next_text": "Herramienta de simulacion, sin nada que vender. Lo que si hay es la comunidad, donde se habla de estas cosas con detalle.",
        "label": "La comunidad de Cha0smagick Labs (Telegram)",
        "link": "https://t.me/cha0smagicklabs",
        "method": [
            "Elige la ruleta y el sistema que quieres probar.",
            "Simula el numero de spins que te interesa, no diez.",
            "Mira la desviacion final: ahi esta la leccion que no se aprende en un casino."
        ],
        "faq": [
            [
                "¿Se puede ganar en la ruleta?",
                "No con un sistema de apuestas: la ventaja de la casa es estructural y ningún sistema la cambia. La herramienta sirve para verlo, no para verificarlo."
            ],
            [
                "¿Qué ruleta usa?",
                "La europea, con un solo cero. La americana, con dos, tiene una ventaja de la casa mayor."
            ]
        ]
    },
    "pixellibre": {
        "name": "PixelLibre: editor de imagenes",
        "value": "Sirve para preparar las imagenes de tus rituales y de tus notas. Exporta y ya esta: el valor esta en tener la imagen lista, no en el editor.",
        "limits": "Editor de imagenes en el navegador: recorta, redimensiona y convierte. No es un sustituto de un editor profesional, y las imagenes se procesan en tu equipo.",
        "expect": "La imagen editada, lista para descargar en el formato que elijas.",
        "next": "La comunidad, donde esto se comenta",
        "next_text": "Es una utilidad libre y no hay nada que venderte. Donde hay contenido nuestro es la comunidad, y en YouTube cada dia de la semana.",
        "label": "La comunidad de Cha0smagick Labs (Telegram)",
        "link": "https://t.me/cha0smagicklabs",
        "method": [
            "Sube la imagen y ajusta lo que necesites.",
            "Exporta en el formato que vas a usar y guardala.",
            "La herramienta no guarda nada: el archivo exportado es tuyo."
        ],
        "faq": [
            [
                "¿Las imágenes se suben a algún sitio?",
                "El procesamiento ocurre en tu navegador. La herramienta no tiene servidor de imágenes, y el archivo exportado es tuyo."
            ],
            [
                "¿Es un sustituto de un editor profesional?",
                "No. Recorta, redimensiona y convierte. Para retoque fino, hace falta otra cosa."
            ]
        ]
    },
    "inwo-illuminati": {
        "name": "INWO: Illuminati New World Order",
        "value": "Juega una partida y anota las decisiones que te hicieron perder. El juego es un termometro: lo que te hace perder dice mas de lo que crees.",
        "limits": "Juego de rol collaborative en linea. Es una|No es un simulador de nada real, y las decisiones del grupo no predicen ninguna consecuencia fuera del juego.",
        "expect": "Una partida completa con los roles repartidos y el marcador del grupo.",
        "next": "La comunidad, donde esto se juega",
        "next_text": "El juego es lo nuestro, lo que no es nuestro es un producto que venderte. La comunidad es donde se juega esto y donde avisamos de lo demas.",
        "label": "La comunidad de Cha0smagick Labs (Telegram)",
        "link": "https://t.me/cha0smagicklabs",
        "method": [
            "Cread la partida y repartid los roles.",
            "Jugad con el registro al lado: las decisiones se anotan.",
            "Repasad en que fase se decidio: casi siempre en la primera votacion."
        ],
        "faq": [
            [
                "¿Es el juego oficial?",
                "No es el juego de mesa: es una versión web gratuita para jugar en grupo, sin caja ni componentes. El oficial tiene reglas que aquí no están."
            ],
            [
                "¿Cuántos jugadores hacen falta?",
                "Los que el grupo tenga. El reparto de roles se genera solo y las decisiones se toman por mayoría, que es donde está la gracia."
            ]
        ]
    },
    "pentex-werewolf": {
        "name": "Pentex: Werewolf the Apocalypse",
        "value": "Una partida teaches como se juega mejor que un manual. Anota en que fase se decide la partida: casi siempre en la primera votacion.",
        "limits": "Generador de personajes y gestion de partida para un juego de rol de mesa. No tiene nada que ver con la realidad ni con el mundo que estas leyendo en el resto del sitio.",
        "expect": "Los personajes repartidos, las habilidades y el estado de la partida.",
        "next": "La comunidad, donde esto se juega",
        "next_text": "Utilidad gratuita de juego, sin producto detras. Lo que si hay es la comunidad y, si te interesa el tema, los libros.",
        "label": "La comunidad de Cha0smagick Labs (Telegram)",
        "link": "https://t.me/cha0smagicklabs",
        "method": [
            "Cread la partida y repartid los personajes.",
            "Anotad las habilidades y quien las activo.",
            "Cerrad con una valoracion de la partida: el grupo aprende de eso."
        ],
        "faq": [
            [
                "¿Sirve para jugar sin libros?",
                "Sirve para gestionar la partida: reparto, habilidades y estado. Las reglas y el contenido del juego siguen estando en los libros."
            ],
            [
                "¿Tiene el juego completo?",
                "No. Es un gestor de partida para un juego de mesa concreto: el valor está en el reparto y el estado, no en las reglas."
            ]
        ]
    },
    "schrecknet-nosferatu": {
        "name": "SchreckNET: compendio de clanes",
        "value": "Sirve de referencia rapida: elige un clan y ten sus numeros a mano. Es un indice, no un manual de reglas.",
        "limits": "Compendio de consulta de clanes con sus Discharge y caracteristicas. No incluye las reglas completas del juego ni sus suplementos, y el uso de marca depende de cada editorial.",
        "expect": "La ficha del clan con sus numeros y su descripcion.",
        "next": "La comunidad, donde esto se comenta",
        "next_text": "Referencia gratuita, sin nada que vender. Donde hay contenido nuestro y de otros es la comunidad.",
        "label": "La comunidad de Cha0smagick Labs (Telegram)",
        "link": "https://t.me/cha0smagicklabs",
        "method": [
            "Elige el clan y anota su Discharge.",
            "Usa la ficha como referencia rapida en la sesion.",
            "Es un indice, no un manual: las reglas completas estan en el libro."
        ],
        "faq": [
            [
                "¿Incluye las reglas del juego?",
                "No: es un índice de clanes con sus números y sus características. Las reglas están en los libros de cada editorial."
            ],
            [
                "¿Puedo usarlo para mi personaje?",
                "Sí, como referencia rápida durante la partida. Los nombres y las descripciones son los de la edición que el estudio ha consultado."
            ]
        ]
    },
    "synthetic-gods": {
        "name": "The Synthetic Gods: cronica de Mage the Ascension",
        "value": "Lee la cronica como se lee un capitulo: con el registro de la sesion al lado. Una cronica sin anotaciones se pierde al cambiar de grupo.",
        "limits": "Cronica de campanha para jugar en grupo. Es material de ficcion y juego, no una guia de ocultismo ni de magia real, aunque el vocabulario se lo preste a la tradicion.",
        "expect": "La cronica, los personajes y el hilo de la campana.",
        "next": "La comunidad, donde esto se juega",
        "next_text": "Material de juego, sin producto detras. Lo que si hay es la comunidad, donde se juega esto y donde estan las apps del estudio.",
        "label": "La comunidad de Cha0smagick Labs (Telegram)",
        "link": "https://t.me/cha0smagicklabs",
        "method": [
            "Cread el grupo y repartid los personajes.",
            "Leed la cronica por sesiones, con el registro al lado.",
            "Anotad las decisiones del grupo: son el hilo de la campana."
        ],
        "faq": [
            [
                "¿Es una campaña completa?",
                "Es una crónica con un hilo argumental y personajes, pensada para jugar en grupo y narrator. La extensión de la campaña la ponéis vosotros."
            ],
            [
                "¿Tiene que ver con el ocultismo real?",
                "No. Es juego de rol con vocabulario de la tradición: sirve para jugar, no para saber nada de la magia ni de la historia de las仪."
            ]
        ]
    },
    "verbo-hecho-codigo": {
        "name": "The Word Made Code: campana de Mage the Ascension",
        "value": "Es un escenario para jugar con el grupo, y funciona porque el grupo escribe lo que pasa. Anota las decisiones y las consecuencias: ese es el registro.",
        "limits": "Escenario de campana para un juego de rol. Es ficcion y juego, no una guia de ocultismo ni de magia real, aunque use el vocabulario de la tradicion.",
        "expect": "El escenario con sus personajes, sus trasfondos y su premisa.",
        "next": "La comunidad, donde esto se juega",
        "next_text": "Escenario gratuito, sin nada que vender. La comunidad es donde se juega esto y donde estan nuestras apps.",
        "label": "La comunidad de Cha0smagick Labs (Telegram)",
        "link": "https://t.me/cha0smagicklabs",
        "method": [
            "Cread el grupo y leed el escenario con calma.",
            "Anotad las decisiones y las consecuencias de cada sesion.",
            "Cerrad la campana con una valoracion escrita: es la memoria del grupo."
        ],
        "faq": [
            [
                "¿Es un escenario o una campaña?",
                "Es un escenario: una premisa, un grupo de personajes y un conflicto. La campaña la construís a partir de ahí."
            ],
            [
                "¿Necesito el libro de reglas?",
                "Para jugar con el sistema, sí. El escenario no incluye las reglas, y sus datos no sustituyen a la documentación del juego."
            ]
        ]
    },
    "dashboard-colombia": {
        "name": "Panel de violencia y crimen en Colombia",
        "value": "Mira la serie de tu departamento y anota que lees en ella. Los datos frios往往 dicen mas de un titular: la tendencia es lo importante, no el dia.",
        "limits": "Visualiza datos oficiales de violencia y crimen en Colombia por departamento y año. No explica causas ni predice nada, y las cifras se quedan en lo que el registro oficial publica.",
        "expect": "Las series por departamento, con el total y laevolucion por ano.",
        "next": "La comunidad, donde esto se comenta",
        "next_text": "Panel de datos, sin producto detras. Lo que si hay es la comunidad y, si te interesa el tema, los libros del estudio.",
        "label": "La comunidad de Cha0smagick Labs (Telegram)",
        "link": "https://t.me/cha0smagicklabs",
        "method": [
            "Elige tu departamento y el rango de anos.",
            "Lee la serie y anota la tendencia, no el dia.",
            "Si quieres el contexto, los datos oficiales estan en la propia ficha."
        ],
        "faq": [
            [
                "¿De dónde salen los datos?",
                "De las series oficiales de Guanajuato y del archivo de violencia y criminalidad, tal como se publican. La ficha indica la fuente de cada serie."
            ],
            [
                "¿Sirve para sacar conclusiones sobre un caso concreto?",
                "No. Son datos agregados por departamento y año: sirven para ver tendencias, no para atribuir causas ni para investigar un caso."
            ]
        ]
    }
}


def main():
    cat = json.loads((ROOT / "data" / "atomic-tools.json").read_text(encoding="utf-8"))
    tools = {}

    # --- 40 del motor comun: su propio catalogo ya tiene metodo, resultado y seguridad ---
    for key, t in cat["tools"].items():
        slug = t["slug"]
        cat_norm = sin_acentos(t.get("category"))
        familia = next((f for f in PRODUCTO if f in cat_norm), "rituales")
        metodo = list(t.get("method") or [])
        seguridad = t.get("safety") or ""
        resultado = t.get("result") or ""
        tools[slug] = {
            "name": t.get("name", slug),
            "family": familia,
            "result": "#atomic-result",
            "value": VALOR[familia],
            "about": {
                "limits": "Lo que sale de aquí es una lectura simbólica para reflexionar, no una predicción. No hay acertado ni equivocado, y esta página no sustituye atención médica, psicológica, jurídica ni financiera.",
                "method": metodo,
                "expect": resultado,
                "safety": seguridad,
                "reviewed": REVISADO,
            },
            "next": {
                "title": SIGUIENTE[familia][0],
                "text": SIGUIENTE[familia][1],
                "label": PRODUCTO[familia][0],
                "link": PRODUCTO[familia][1],
                "external": False,
            },
        }

    # --- 15 propias: contenido redactado aqui ---
    for slug, (familia, selector, extra) in PROPIAS.items():
        metodo = extra.get("method") or [
            "Escribe lo que quieres saber antes de usar la herramienta.",
            "Haz la operación y anota el resultado con la fecha.",
            "Vuelve a ella en 30 dias: el patrón aparece en la repetición.",
        ]
        tools[slug] = {
            "name": slug.replace("-", " "),
            "family": familia,
            "result": selector,
            "value": VALOR[familia],
            "about": {
                "limits": extra["limits"],
                "method": metodo,
                "expect": extra["expect"],
                "safety": "No uses esta herramienta para sustituir decisiones importantes, ni para obtener datos de terceros sin su consentimiento. Lo que sale de aquí es material de reflexión.",
                "faq": extra.get("faq", []),
                "reviewed": REVISADO,
            },
            "next": {
                "title": SIGUIENTE[familia][0],
                "text": SIGUIENTE[familia][1],
                "label": PRODUCTO[familia][0],
                "link": PRODUCTO[familia][1],
                "external": False,
            },
        }

    # las embebidas: ficha propia y camino segun la familia
    for slug, e in EMBEBIDAS.items():
        tools[slug] = {
            "name": e["name"],
            "family": "embebida",
            "result": "iframe",
            "value": e["value"],
            "about": {
                "limits": e["limits"],
                "method": e.get("method", []),
                "faq": e.get("faq", []),
                "expect": e["expect"],
                "safety": "Esta herramienta es gratuita y no guarda nada en tus cuentas. No sustituye criterio propio ni ayuda profesional.",
                "reviewed": REVISADO,
            },
            "next": {
                "title": e["next"],
                "text": e["next_text"],
                "label": e["label"],
                "link": e["link"],
                "external": "cha0smagicklabs.com" not in e["link"],
            },
        }

    # contenido ad hoc: cada herramienta con su limite, su expectativa y su
    # valor. Lo que no este escrito aqui, se conserva del catalogo.
    for slug, c in CONTENIDO.items():
        if slug not in tools:
            continue
        t = tools[slug]
        t.setdefault("about", {})
        for campo in ("value", "limits", "expect"):
            if c.get(campo):
                if campo == "value":
                    t["value"] = c[campo]
                else:
                    t["about"][campo] = c[campo]
        if c.get("method"):
            t["about"]["method"] = c["method"]
    out = {"version": 3, "site": SITE, "tools": tools}
    (ROOT / "data" / "toolkit.json").write_text(json.dumps(out, indent=1, ensure_ascii=False), encoding="utf-8")
    print(f"data/toolkit.json: {len(tools)} herramientas con bloque E-E-A-T")


if __name__ == "__main__":
    main()
