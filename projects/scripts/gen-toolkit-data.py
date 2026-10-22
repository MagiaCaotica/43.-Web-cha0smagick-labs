#!/usr/bin/env python3
"""
Genera data/toolkit.json: que le espera a cada usuario cuando cierra la
herramienta, y cual es la version que hace eso mismo mejor.

Regla de negocio: la puerta tiene que ser HONESTA. No se vende nada como
mejor que lo sea; se dice que la app hace lo mismo sin el movil en la mano,
con una ventaja concreta y real. La herramienta gratuita se queda como
herramienta gratuita: el valor esta en que el usuario salga con algo.

  python projects/scripts/gen-toolkit-data.py
"""
import json
import unicodedata
from pathlib import Path


def sin_acentos(t):
    return "".join(c for c in unicodedata.normalize("NFKD", t or "") if not unicodedata.combining(c)).lower()

ROOT = Path(".").resolve()
SITE = "https://cha0smagicklabs.com"

# producto por familia tematica: la app que hace esto mismo, mejor
PRODUCTO = {
    "astrologia": {
        "label": "Astral Lab en Google Play ($6.99, una vez)",
        "link": f"{SITE}/apps/astral-lab.html",
        "ventaja": "positions calculated with VSOP87 and ELP-2000, offline and with no account",
    },
    "lunar": {
        "label": "Lunar Phase Calculator en Google Play ($3.99, una vez)",
        "link": f"{SITE}/apps/lunar-phase-calculator.html",
        "ventaja": "the phase rendered in real time, and the times of every phase calculated offline",
    },
    "tarot": {
        "label": "Tarot Rider Waite en Google Play ($9.99, una vez)",
        "link": f"{SITE}/apps/unofficial-rider-waite-tarot.html",
        "ventaja": "the 78 cards with upright and reversed meanings, offline and without ads",
    },
    "suenos": {
        "label": "Lucid Dream en Google Play ($9.99, una vez)",
        "link": f"{SITE}/apps/lucid-dream.html",
        "ventaja": "the dream journal, the reality checks and the session timer, working with no connection",
    },
    "runas": {
        "label": "Norse Rune Oracle en Google Play ($3.99, una vez)",
        "link": f"{SITE}/apps/norse-rune-oracle.html",
        "ventaja": "the 24 runes with meanings and a full spread, offline",
    },
    "sigilos": {
        "label": "Chaos Sigil Generator en Google Play ($3.99, una vez)",
        "link": f"{SITE}/apps/chaos-sigil-generator.html",
        "ventaja": "the sigil drawn and saved as an image, with the charging timer, working with no connection",
    },
    "oraculos": {
        "label": "Tarot Rider Waite en Google Play ($9.99, una vez)",
        "link": f"{SITE}/apps/unofficial-rider-waite-tarot.html",
        "ventaja": "the whole deck offline, with the daily card and the spreads",
    },
    "rituales": {
        "label": "Los 9 libros en PDF ($24.99, 59% de descuento)",
        "link": f"{SITE}/landing-pages/books-bundle.html",
        "ventaja": "el protocolo completo por escrito, con lo que fallo incluido",
    },
    "correspondencias": {
        "label": "Los 9 libros en PDF ($24.99, 59% de descuento)",
        "link": f"{SITE}/landing-pages/books-bundle.html",
        "ventaja": "las correspondencias completas, con el metodo y sus limites",
    },
    "seguimiento": {
        "label": "Los 9 libros en PDF ($24.99, 59% de descuento)",
        "link": f"{SITE}/landing-pages/books-bundle.html",
        "ventaja": "el sistema de registro completo, con los protocolos de la practica",
    },
    "seguridad": {
        "label": "Los 9 libros en PDF ($24.99, 59% de descuento)",
        "link": f"{SITE}/landing-pages/books-bundle.html",
        "ventaja": "los protocolos de seguridad y de limites, escritos y revisados",
    },
    "organizacion": {
        "label": "Los 9 libros en PDF ($24.99, 59% de descuento)",
        "link": f"{SITE}/landing-pages/books-bundle.html",
        "ventaja": "las plantillas de trabajo, listas para imprimir",
    },
    "simbolos": {
        "label": "Chaos Sigil Generator en Google Play ($3.99, una vez)",
        "link": f"{SITE}/apps/chaos-sigil-generator.html",
        "ventaja": "la cifra completa, guardada como imagen, sin conexion",
    },
    "bienestar": {
        "label": "Lucid Dream en Google Play ($9.99, una vez)",
        "link": f"{SITE}/apps/lucid-dream.html",
        "ventaja": "el temporizador y el diario de sesiones, funcionando sin conexion",
    },
    "paranormal": {
        "label": "NOCTEM en Google Play ($14.99, una vez)",
        "link": f"{SITE}/apps/noctem-tools.html",
        "ventaja": "la suite completa de investigacion, con SLS, EVP y sensores, offline",
    },
}

# las 15 herramientas propias: familia y selector del area de resultado
PROPIAS = {
    "gnosis-timer": ("suenos", "#timerDisplay"),
    "rune-drawer": ("runas", "#runeResult"),
    "zener-esp-trainer": ("bienestar", "#resultsPanel"),
    "astrology-sign-calculator": ("astrologia", "#results"),
    "candle-color-calculator": ("correspondencias", "#resultDisplay"),
    "digital-pendulum": ("oraculos", "#answerDisplay"),
    "goetic-spirit-selector": ("rituales", "#resultsCount"),
    "iching-changing-lines": ("oraculos", "#hexagramDisplay"),
    "moon-voc": ("lunar", "#nextVocCard"),
    "planetary-hours": ("astrologia", "#locationDisplay"),
    "planetary-kamea-sigil": ("sigilos", "#sigilDisplay"),
    "reality-check-tracker": ("suenos", "#entryResult"),
    "sigil-charging-timer": ("sigilos", "#resultRating"),
    "spell-builder": ("rituales", "#spellResult"),
    "tarot-yes-no": ("tarot", "#readingSummary"),
}

VALOR = {
    "astrologia": "Guarda la lectura, revisala en 30 dias y compara: eso es lo que convierte una lectura en un registro.",
    "lunar": "Anota la fecha de cada fase que uses. Con tres meses seguidos ya tienes un patron propio, no una opinion.",
    "tarot": "Anota la carta, la pregunta y lo que decidiste despues. En tres meses, el patron se ve solo.",
    "suenos": "Escribe el sueno antes de interpretarlo. Lainterpretation cambia cuando la memoria ya esta reescrita.",
    "runas": "Anota el resultado y lo que hiciste despues. La runa no dice nada: la accion accompanying si.",
    "sigilos": "Guarda la imagen del sigilo, la fecha de carga y la accion mundana. Eso es un registro que se puede revisar.",
    "oraculos": "Pregunta, anota la respuesta y lo que cambiaste despues. Sin la tercera parte no hay registro.",
    "rituales": "Anota el ritual, la intencion y el resultado. Con el mismo ritual dos veces, la comparacion empieza a ser posible.",
    "correspondencias": "Usa la tabla como referencia, no como resultado. El valor esta en volver a ella.",
    "seguimiento": "El registro solo sirve si se vuelve a leer. Ponle fecha de revision a la entrada.",
    "seguridad": "Guarda la lista de esta sesion. Las reglas se olvidan; la lista no.",
    "organizacion": "Lo que organizas aqui es el trabajo de dentro: vuelve a el cuando la sesion termine.",
    "simbolos": "Guarda la cifra, anota la fecha y usala en el mundo. Una cifra sin fecha no es un registro.",
    "bienestar": "El temporizador es la parte facil. Lo que cambia el resultado es lo que anotas al terminar.",
    "paranormal": "Guarda el audio original, la hora exacta y el control en silencio. Sin eso no hay nada que comparar.",
}

SIGUIENTE = {
    "astrologia": ("La misma carta, sin depender del movil",
                    "Si lo que te sirve de esta pagina es la carta, la app la calcula igual y la guarda contigo. No es mejor: es la misma, y ademas funciona sin conexion."),
    "lunar": ("La misma fase, en el aire",
               "Aqui calculas una fase. La app dibuja la luna real en tu ubicacion y te dice cuando caen las siguientes, sin conexion."),
    "tarot": ("El mazo entero, sin conexion",
              "Aqui tienes acceso a las cartas que necesitas. La app lleva el mazo Rider-Waite completo con meanings al derecho y al reves, y funciona en el metro."),
    "suenos": ("El diario, en el bolsillo",
                "La herramienta te ayuda a practicar. La app guarda el sueno, la comprobacion de realidad y el tiempo de sesion, y todo se queda en el dispositivo."),
    "runas": ("Las 24 runas, con su significado",
              "Aqui sorteas. La app trae las 24 runas con su significado y su posicion, para usarlas sin internet."),
    "sigilos": ("El sigilo, guardado como imagen",
                "Aqui generas el simbolo. La app lo dibuja, lo guarda como imagen y trae el temporizador de carga, para que no dependas de la pagina."),
    "oraculos": ("El mazo y las tiradas, sin conexion",
                 "La app lleva las 78 cartas, la tirada de una carta y la de tres, y el estado de la partida guardados."),
    "rituales": ("El protocolo completo, por escrito",
                 "Si lo que te sirve es el procedimiento entero, esta es la version escrita: nueve libros con los pasos, lo que fallo y los limites de cada metodo."),
    "correspondencias": ("Las correspondencias, con su metodo",
                          "La tabla de esta pagina es la referencia. En el libro esta la tabla con el metodo que la hace util y el aviso de donde falla."),
    "seguimiento": ("El sistema de registro, hecho para durar",
                    "Aqui guardas una entrada. El libro tiene el sistema completo: que se anota, como se compara y cuando se revisa."),
    "seguridad": ("Los limites, explicados",
                 "Las listas de esta pagina sirven. El libro explica el porque de cada limite y como decidir cuando parar."),
    "organizacion": ("Las plantillas, listas para imprimir",
                      "Aqui ordenas. En el libro estan las plantillas de trabajo del grimorio, para imprimir y usar sin pantalla."),
    "simbolos": ("La cifra, guardada y lista",
                 "La app dibuja el resultado y lo deja en el carrete del telefono, con el temporizador de carga al lado."),
    "bienestar": ("La sesion, registrada",
                  "La app guarda el tiempo de meditacion, las comprobaciones y el diario, con lo que la pagina no puede guardarte."),
    "paranormal": ("La suite de investigacion, offline",
                   "La app lleva el SLS, el grabador EVP con control en silencio, los sensores y el registro de sesion, todo en el dispositivo y sin cuentas."),
}


def construir():
    cat = json.loads((ROOT / "data" / "atomic-tools.json").read_text(encoding="utf-8"))
    tools = {}

    # 1) las 40 del motor comun
    for key, t in cat["tools"].items():
        slug = t["slug"]
        cat_norm = sin_acentos(t.get("category"))
        familia = next((f for f in PRODUCTO if f in cat_norm), "rituales")
        tools[slug] = {
            "name": t.get("name", slug),
            "family": familia,
            "result": "#atomic-result",
            "value": VALOR.get(familia, VALOR["rituales"]),
            "next": {
                "title": SIGUIENTE[familia][0],
                "text": SIGUIENTE[familia][1],
                "label": PRODUCTO[familia]["label"],
                "link": PRODUCTO[familia]["link"],
                "external": False,
            },
        }

    # 2) las 15 propias
    for slug, (familia, selector) in PROPIAS.items():
        tools[slug] = {
            "name": slug.replace("-", " "),
            "family": familia,
            "result": selector,
            "value": VALOR.get(familia, VALOR["rituales"]),
            "next": {
                "title": SIGUIENTE[familia][0],
                "text": SIGUIENTE[familia][1],
                "label": PRODUCTO[familia]["label"],
                "link": PRODUCTO[familia]["link"],
                "external": False,
            },
        }

    # 3) las copias en espanol heredan lo de su version inglesa
    for slug in list(tools):
        if slug in PROPIAS:
            es = tools[slug].copy()
            es["value"] = "Guarda la lectura y revisala en 30 dias: eso convierte una lectura en un registro."
            tools[slug] = es

    out = {
        "version": 1,
        "site": SITE,
        "tools": tools,
    }
    (ROOT / "data" / "toolkit.json").write_text(json.dumps(out, indent=1, ensure_ascii=False), encoding="utf-8")
    print(f"data/toolkit.json: {len(tools)} herramientas")


if __name__ == "__main__":
    construir()
