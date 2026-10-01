"""Inyecta el modulo de 30 cruces en los articulos legacy de blog/.

Los 349 del catalogo de YouTube reciben el modulo desde el generador
(`projects/data/yt-articles/gen_yt_articles.py` llama a `crossrefs.build`).
Los 466 legacy no tienen generador: su HTML esta escrito y no se regenera
nunca. Este script los modifica en sitio.

Se REUTILIZA `crossrefs.build` en vez de reimplementar el markup. Es la unica
forma de que los 815 articulos compartan un solo estilo y un solo formato, y
de que arreglar un dia el formato signifique arreglar un archivo.

Idempotencia: el bloque va entre marcadores. Si ya estan, se reemplaza; si no,
se inserta. Correr el script dos veces no duplica nada, y eso importa porque
este archivo se va a volver a ejecutar cada vez que cambie el grafo.

Ancla de insercion, en orden de preferencia:
  1. la seccion o bloque que contiene el encabezado "Related Articles" o
     "Related Resources", para que el modulo quede justo encima y el bloque
     viejo siga haciendo de red de seguridad;
  2. el primer `<footer>` real (fuera de comentarios y de script);
  3. antes de `</body>`.
No se usa `</main>` como ancla porque no todos los legacy lo cierran.
"""

import io
import json
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HERE, "..", "..", ".."))
BLOG = os.path.join(REPO, "blog")
GRAPH = os.path.join(REPO, "data", "link-graph.json")
YT = os.path.join(REPO, "projects", "data", "yt-articles")

MARK_START = "<!-- linkgraph:refs:start -->"
MARK_END = "<!-- linkgraph:refs:end -->"
CSS_LINK = '<link rel="stylesheet" href="../css/wisdom.css">'
MIN_TARGETS = 30

sys.path.insert(0, YT)
import crossrefs  # noqa: E402

_COMMENT = re.compile(r"<!--.*?-->", re.S)


def strip_comments(html: str) -> str:
    """Sustituye cada comentario por espacios del mismo largo.

    Conserva los offsets, que es justo lo que hace falta: asi se puede buscar
    un tag en el texto sin comentarios y despues cortar el original.
    """
    return _COMMENT.sub(lambda m: " " * (m.end() - m.start()), html)


def normalise_newlines(html: str) -> str:
    """Unifica los finales de linea del archivo entero.

    Los legacy mezclan convenciones: la mayoria LF, unos cuantos CRLF, y
    algunos con las dos. Mientras coexistan, el bloque inyectado nunca puede
    coincidir byte a byte con el resto y la idempotencia queda rota: el script
    reescribe los 466 en cada pasada sin que nada haya cambiado. Se elige el
    final de linea dominante y se aplica a todo el archivo, que para HTML no
    significa nada y para el repositorio significa una convencion.
    """
    crlf = html.count("\r\n")
    lf = html.count("\n") - crlf
    if not crlf or not lf:
        return html
    return re.sub(r"\r\n|\r|\n", "\r\n" if crlf > lf else "\n", html)


def newline_of(html: str) -> str:
    """El fin de linea que ya usa el archivo.

    `crossrefs.build` emite `\\r\\n` porque el generador de los 349 trabaja en
    ese estilo. Los legacy se escribieron en su mayoria con `\\n`. Si no se
    adapta, cada bloque queda con finales de linea distintos de los del archivo
    que lo hospeda.
    """
    return "\r\n" if "\r\n" in html else "\n"


def insert_module(html: str, block: str) -> str:
    """Coloca el bloque, o lo reemplaza si los marcadores ya estan.

    El payload NO lleva salto de linea detras de `MARK_END`, a proposito: ese
    salto ya forma parte del archivo anfitrion (los marcadores van justo antes
    del blanco que precede al siguiente elemento). Si el payload lo trajera, la
    rama de reemplazo lo sumaria otra vez en cada pasada y el archivo creeria
    un byte por ejecucion, indefinidamente.
    """
    nl = newline_of(html)
    block = re.sub(r"\r\n|\r|\n", nl, block)
    payload = MARK_START + nl + block + nl + MARK_END
    if MARK_START in html and MARK_END in html:
        head, _, rest = html.partition(MARK_START)
        _, _, tail = rest.partition(MARK_END)
        # El blanco que sigue a MARK_END se reduce a un solo salto. Asi se
        # limpian de paso los saltos que hayan acumulado las pasadas
        # anteriores, y a partir de aqui el archivo queda estable.
        tail = re.sub(r"\A[\r\n]*", nl, tail)
        return head + payload + tail
    clean = strip_comments(html)
    at = anchor(clean)
    if at is None:
        raise SystemExit("sin punto de insercion")
    return html[:at] + payload + html[at:]


def anchor(clean: str):
    for needle in ("Related Articles", "Related Resources"):
        i = clean.find(needle)
        if i == -1:
            continue
        near = max(clean.rfind("<section", 0, i), clean.rfind("<div", 0, i))
        if near != -1:
            return near
    for pattern in (r"<footer", r"</body>"):
        m = re.search(pattern, clean)
        if m:
            return m.start()
    return None


def ensure_css(html: str) -> str:
    """Enlaza wisdom.css una sola vez."""
    if "wisdom.css" in html:
        return html
    clean = strip_comments(html)
    i = clean.rfind("</head>")
    if i == -1:
        return html
    return html[:i] + CSS_LINK + newline_of(html) + html[i:]


def main(argv) -> int:
    dry = "--check" in argv
    only = [a for a in argv[1:] if not a.startswith("-")]

    with io.open(GRAPH, encoding="utf-8") as fh:
        graph = json.load(fh)
    legacy = [a for a in graph["articles"] if a["family"] == "legacy"]
    if only:
        wanted = set(only)
        legacy = [a for a in legacy if a["slug"] in wanted]
    if not legacy:
        raise SystemExit("no hay articulos legacy que procesar")

    thin = []
    written = 0
    for art in legacy:
        slug = art["slug"]
        path = os.path.join(BLOG, slug + ".html")
        if not os.path.isfile(path):
            thin.append((slug, "no existe en blog/"))
            continue
        # `newline=""` para leer bytes crudos: en modo universal python
        # normaliza los finales de linea y la comparacion "cambio o no" deja
        # de ser fiable.
        with io.open(path, encoding="utf-8", newline="") as fh:
            html = normalise_newlines(fh.read())
        block = crossrefs.build(slug, art["title"])
        links = len(set(re.findall(r'href="\.\./blog/([^"]+)\.html"', block)))
        if links < MIN_TARGETS:
            thin.append((slug, "solo %d cruces" % links))
            continue
        new = ensure_css(insert_module(html, block))
        if new == html:
            continue
        if not dry:
            with io.open(path, "w", encoding="utf-8", newline="") as fh:
                fh.write(new)
        written += 1

    print(
        ("[check] " if dry else "")
        + "legacy procesados: %d | escritos: %d | problemas: %d"
        % (len(legacy), written, len(thin))
    )
    for slug, why in thin[:20]:
        print("  [X] %s -> %s" % (slug, why))
    return 1 if thin else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
