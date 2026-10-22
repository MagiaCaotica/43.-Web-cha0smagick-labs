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
import unicodedata
from pathlib import Path

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

    out = {"version": 2, "site": SITE, "tools": tools}
    (ROOT / "data" / "toolkit.json").write_text(json.dumps(out, indent=1, ensure_ascii=False), encoding="utf-8")
    print(f"data/toolkit.json: {len(tools)} herramientas con bloque E-E-A-T")


if __name__ == "__main__":
    main()
