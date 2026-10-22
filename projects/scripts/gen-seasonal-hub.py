#!/usr/bin/env python3
"""
Calendario estacional: la pagina que hace que la estacionalidad no dependa
de que nadie se acuerde.

Por que una pagina y no solo articles:
  - el contenido estacional necesita 4-6 semanas de antelacion. Una pagina
    que dice "que publicar, cuando y con que ventana" convierte la estacionalidad
    de un accidente en un proceso.
  - la pagina es indexable y responde a "que hacer en halloween con magia", que
    es lo que la gente busca de verdad en esa semana.
  - desde ahi se enlaza todo el contenido de temporada, y cada articulo
    estacional enlaza de vuelta: el cluster se sostiene.

El calendario se genera desde una tabla, no desde texto escrito a mano: asi
las fechas no se desincronizan del calendario real. La pagina se construye
sobre la plantilla ES real (construir_es), no a mano: asi hereda estilo,
JSON-LD, FAQ, pie y tarjeta social.

  python projects/scripts/gen-seasonal-hub.py
  python projects/scripts/fix-acentos-es.py
"""
import json
import re
import sys
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "projects" / "scripts"))
from es_article_builder import construir_es  # noqa: E402

HOY = date(2026, 10, 22)
SLUG = "calendario-estacional-magia-caos"
SITE = "https://cha0smagicklabs.com"

# (nombre, mes, dia, mes, dia, dias_de_antelacion, slug del articulo, idioma)
TEMPORADAS = [
    ("Halloween", 10, 31, 10, 31, 6, "halloween-evp-night-how-to-run-a-public-session", "en"),
    ("Día de Muertos", 11, 2, 10, 20, 6, "", "es"),
    ("Black Friday", 11, 27, 11, 3, 6, "black-friday-occult-books-2026", "en"),
    ("Navidad", 12, 25, 11, 15, 6, "christmas-occult-books-gift-guide-2026", "en"),
    ("Año Nuevo", 1, 1, 12, 15, 5, "", "en"),
    ("San Valentín", 2, 14, 1, 15, 5, "", "es"),
    ("Equinoccio de primavera", 3, 20, 2, 20, 5, "", "en"),
    ("Solsticio de verano", 6, 21, 5, 21, 5, "", "en"),
    ("Equinoccio de otoño", 9, 22, 8, 22, 5, "", "en"),
    ("Solsticio de invierno", 12, 21, 11, 21, 5, "", "en"),
]

PAREJAS_ES = {
    "black-friday-occult-books-2026": "es-black-friday-libros-ocultismo-2026",
    "christmas-occult-books-gift-guide-2026": "es-regalos-ocultismo-navidad-2026",
}

MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio",
         "agosto", "septiembre", "octubre", "noviembre", "diciembre"]


def dias_hasta(m, d):
    """Dias que faltan para la fecha de este ano (o el siguiente si ya paso)."""
    obj = date(HOY.year, m, d)
    if obj < HOY:
        obj = date(HOY.year + 1, m, d)
    return (obj - HOY).days


def main():
    filas = []
    for nombre, m, d, pm, pd, antelacion, slug, idioma in TEMPORADAS:
        pub = date(HOY.year, pm, pd)
        if pub < HOY:
            pub = date(HOY.year + 1, pm, pd)
        filas.append({
            "nombre": nombre,
            "fecha": f"{d} de {MESES[m-1]}",
            "dias": dias_hasta(m, d),
            "publicar": f"{pd} de {MESES[pm-1]}",
            "antelacion": antelacion,
            "slug": slug,
            "idioma": idioma,
            "par_es": PAREJAS_ES.get(slug, ""),
        })

    out = construir_es(
        slug=SLUG,
        titulo="Calendario estacional de magia del caos 2026-2027",
        h1="Calendario estacional de magia del caos 2026-2027",
        lede=("El contenido de temporada no se escribe cuando llega la temporada: se escribe con "
              "seis semanas de antelacion, porque ahi es cuando Google lo rastrea y lo indexa. "
              "Esta es la tabla, con la fecha exacta de publicacion de cada pieza."),
        desc=("Calendario de las temporadas de ocultismo para 2026-2027: Halloween, Black Friday, "
              "Navidad, San Valentin y los solsticios, con la fecha de publicacion de cada articulo "
              "y su ventana de antelacion."),
        keywords="calendario estacional, contenido de temporada, black friday ocultismo, navidad ocultismo, san valentin magia",
        en_href=f"{SITE}/blog/{SLUG}.html",
        toc=[("la-tabla", "La tabla"), ("por-que-la-antelacion", "Por que la antelacion son seis semanas"),
             ("que-hay-ya", "Que hay publicado"), ("lo-que-viene", "Lo que viene y donde esta el hueco"),
             ("como-se-usa", "Como se usa esta tabla")],
        cuerpo=cuerpo(filas),
        faq=[
            ("¿Con cuanta antelacion hay que publicar un articulo estacional?",
             "Seis semanas para las temporadas de regalo (Black Friday, Navidad) y cinco para las "
             "demas. Un articulo nuevo tarda entre dos y seis semanas en consolidarse en el indice; "
             "publicar la semana del pico es llegar cuando la decision ya esta tomada."),
            ("¿Que pasa si no hay articulo para una temporada?",
             "Que se pierde la unica busqueda del ano con intencion de compra clara. La tabla marca "
             "el hueco: la fila sin enlace es la que hay que escribir antes de la fecha de publicacion."),
            ("¿Esto es una promocion con fecha limite?",
             "No. La tabla dice cuando publicar, no cuando comprar. Los precios de los libros y las "
             "apps son los que estan en cada pagina; no hay cuenta atras ni precio que suba por mirar."),
        ],
        rel=[("/blog/black-friday-occult-books-2026.html", "Black Friday 2026: los nueve libros"),
             ("/blog/es-regalos-ocultismo-navidad-2026.html", "Regalos de ocultismo en Navidad"),
             ("/blog/es-fases-de-la-luna-significado.html", "Fases de la luna"),
             ("/es/tools/lunar-phase.html", "Calculadora de fases lunares"),
             ("/es/", "Centro en espanol")],
    )

    # pagina solo en espanol: sin par en ingles, el unico alternate es x-default
    t = out.read_text(encoding="utf-8")
    t = re.sub(r'(?i)\s*<link rel="alternate"[^>]*hreflang="(?:en|es)"[^>]*>', "", t)
    out.write_text(t, encoding="utf-8")
    print(f"   escrito: blog/{SLUG}.html ({out.stat().st_size} bytes)")

    (ROOT / "data" / "seasonal-calendar.json").write_text(
        json.dumps({"generated": HOY.isoformat(), "seasons": filas}, ensure_ascii=False, indent=1),
        encoding="utf-8")
    print("   escrito: data/seasonal-calendar.json")


def cuerpo(filas):
    trs = []
    for f in filas:
        estado = "pasada" if f["dias"] < 0 else ("ahora" if f["dias"] <= 21 else "en preparacion")
        links = []
        if f["slug"]:
            links.append(f'<a href="{f["slug"]}.html">la guia en ingles</a>')
        if f["par_es"]:
            links.append(f'<a href="{f["par_es"]}.html">la version en espanol</a>')
        enlaces = " y ".join(links) if links else "sin articulo todavia: es el hueco"
        trs.append(f"""<tr>
<td><strong>{f['nombre']}</strong></td>
<td>{f['fecha']}</td>
<td>{f['dias']} dias</td>
<td>{f['publicar']} (con {f['antelacion']} semanas de antelacion)</td>
<td>{estado}</td>
<td>{enlaces}</td>
</tr>""")

    return f"""<p>La razon de que exista esta pagina es simple: la estacionalidad es la unica parte del
trabajo de contenido que se puede planear con exactitud. El resto se mide despues. Aqui
esta lo que se puede medir antes.</p>

<h2 id="la-tabla">La tabla</h2>
<table>
<thead><tr><th>Temporada</th><th>Fecha</th><th>En</th><th>Publicar el</th><th>Estado</th><th>Articulo</th></tr></thead>
<tbody>
{chr(10).join(trs)}
</tbody>
</table>

<h2 id="por-que-la-antelacion">Por que la antelacion son seis semanas</h2>
<p>Un articulo estacional no se posiciona el dia de la temporada. La secuencia real es:</p>
<ol>
<li><strong>Publicacion.</strong> Google lo rastrea en los dias siguientes. Un articulo
nuevo puede tardar entre dos y seis semanas en entrar al indice.</li>
<li><strong>Indexacion y confianza.</strong> Las semanas dos y tres son las que
deciden si la pagina va a aparecer el dia que la gente empieza a buscar.</li>
<li><strong>Pico de demanda.</strong> La consulta sube cuando la gente empieza a
planificar: la segunda semana antes de la fecha, para Black Friday y Navidad; el dia
mismo para Halloween y San Valentin.</li>
</ol>
<p>Por eso la fecha de publicacion va antes de la fecha de la temporada, y no
despues: publicar el articulo de Black Friday el 28 de noviembre es publicar tarde.</p>

<h2 id="que-hay-ya">Que hay publicado</h2>
<ul>
<li><a href="/blog/halloween-evp-night-how-to-run-a-public-session.html">Halloween:
sesion publica de EVP</a>, en ingles.</li>
<li><a href="/blog/black-friday-occult-books-2026.html">Black Friday: los nueve
libros y cual empezar</a>, en ingles y en
<a href="/blog/es-black-friday-libros-ocultismo-2026.html">espanol</a>.</li>
<li><a href="/blog/christmas-occult-books-gift-guide-2026.html">Navidad: que libro
regalar</a>, en ingles y en
<a href="/blog/es-regalos-ocultismo-navidad-2026.html">espanol</a>.</li>
<li><a href="/blog/es-fases-de-la-luna-significado.html">Fases de la luna</a> y
<a href="/blog/es-carta-natal-gratis-como-leerla.html">carta natal</a>, en espanol:
las dos consultas de temporada eterna que funcionan todo el ano.</li>
</ul>

<h2 id="lo-que-viene">Lo que viene y donde esta el hueco</h2>
<p>Las temporadas con hueco son las que no tienen articulo todavia. Anadirlo cuando
llega la ventana de publicacion, no despues:</p>
<ul>
<li><strong>San Valentin (14 de febrero).</strong> Publicar a partir del 15 de enero.
La consulta real es "regalo de magia para el" y "sigilo de amor para el dia de San
Valentin": la segunda es la que se puede escribir sin caer en la promesa vacia.</li>
<li><strong>Año Nuevo.</strong> Publicar a partir del 15 de diciembre. El hueco es
el balance anual y el programa de 30 dias, que es donde se puede anclar la venta del
bundle de libros.</li>
<li><strong>Equinoccios y solsticios.</strong> Son las ventanas del calendario
lunar y de las horas planetarias, que ya estan publicadas en espanol y solo necesitan
el articulo de temporada que las conecte con el resto.</li>
</ul>

<h2 id="como-se-usa">Como se usa esta tabla</h2>
<p>La ventana de publicacion de cada fila es la fecha en la que hay que tener el
articulo escrito, revisado y enlazado. No la fecha en la que se escribe: la
redaccion lleva dos semanas antes. Si una fila dice "publicar el 15 de enero", el
borrador tiene que estar listo el 1 de enero.</p>
<p>Y una regla que no se negocia: <strong>el contenido estacional no se inventa en la
temporada</strong>. Se escribe con meses de vista y se revisa en la semana de la
temporada con los datos que ya se tienen (precios, fechas, disponibilidad). Un
articulo estacional escrito a prisas se nota, y se nota mal.</p>"""


if __name__ == "__main__":
    main()
