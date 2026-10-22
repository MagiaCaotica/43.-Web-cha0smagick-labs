#!/usr/bin/env python3
"""
Da de alta los 7 articulos nuevos (2 EN estacionales + 5 ES):

  blog/black-friday-occult-books-2026.html        EN  reviews
  blog/christmas-occult-books-gift-guide-2026.html EN reviews
  blog/es-black-friday-libros-ocultismo-2026.html ES
  blog/es-regalos-ocultismo-navidad-2026.html      ES
  blog/es-mejores-apps-astrologia-android-2026.html ES
  blog/es-carta-natal-gratis-como-leerla.html      ES
  blog/es-magia-del-caos-para-principiantes.html   ES

Que hace:
  1. tarjeta en blog/index.html (los EN, con su categoria del filtro)
  2. tarjeta en es/index.html (los ES, en la seccion que les corresponde)
  3. enlaces cruzados entre los articles nuevos y las paginas que ya
     posicionan (para que no queden huerfanos)
  4. regenera el sitemap

Es idempotente: si algo ya esta, no lo duplica.

  python projects/scripts/_publish_seasonal_es.py
"""
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(".").resolve()
BLOG = ROOT / "blog"

# slug -> (titulo corto, subtitulo, categoria del filtro EN)
EN = {
    "black-friday-occult-books-2026": ("Black Friday 2026: 9 occult books", "Which one to start with", "reviews"),
    "christmas-occult-books-gift-guide-2026": ("Christmas occult gift guide", "Which book, and when not to", "reviews"),
}

# slug -> (titulo corto, subtitulo, seccion del indice ES)
ES = {
    "es-black-friday-libros-ocultismo-2026": ("Black Friday: los 9 libros", "Cuál te conviene de verdad", "temporada"),
    "es-regalos-ocultismo-navidad-2026": ("Regalos de ocultismo en Navidad", "Cuál de los nueve regalar", "temporada"),
    "es-mejores-apps-astrologia-android-2026": ("Mejores apps de astrologia 2026", "6 comparadas, lado a lado", "comparativas"),
    "es-carta-natal-gratis-como-leerla": ("Carta natal gratis", "Cómo leerla paso a paso", "guias"),
    "es-magia-del-caos-para-principiantes": ("Magia del caos para principiantes", "La guía de 90 días", "guias"),
}


def h1_de(slug):
    s = (BLOG / f"{slug}.html").read_text(encoding="utf-8", errors="ignore")
    return re.sub(r"<[^>]+>", "", re.search(r"(?is)<h1[^>]*>(.*?)</h1>", s).group(1)).strip()


def meta_de(slug, campo):
    s = (BLOG / f"{slug}.html").read_text(encoding="utf-8", errors="ignore")
    m = re.search(rf'(?i)<meta name="{campo}" content="([^"]*)"', s)
    return m.group(1) if m else ""


def tarjeta_en(slug, titulo, sub, cat):
    idx = BLOG / "index.html"
    pagina = idx.read_text(encoding="utf-8", errors="ignore")
    if f'href="{slug}.html"' in pagina:
        print(f"   {slug}: ya esta en el indice EN")
        return
    fecha = "2026-10-22"
    bloque = f"""<div class="post-card" data-category="{cat}">
<div class="date">{fecha}</div>
<h3><a href="{slug}.html">{titulo}</a></h3>
<div class="excerpt">{sub}</div>
<a class="read-more" href="{slug}.html">Read More →</a>
</div>
"""
    marca = '<div class="posts">\n'
    i = pagina.find(marca)
    if i < 0:
        print(f"   {slug}: no encuentro .posts")
        return
    pagina = pagina[: i + len(marca)] + bloque + pagina[i + len(marca):]
    idx.write_text(pagina, encoding="utf-8")
    print(f"   tarjeta EN: {slug} ({cat})")


def tarjeta_es(slug, titulo, sub, seccion):
    idx = ROOT / "es" / "index.html"
    pagina = idx.read_text(encoding="utf-8", errors="ignore")
    if f'href="/blog/{slug}.html"' in pagina:
        print(f"   {slug}: ya esta en el indice ES")
        return
    bloque = f'<a class="card" href="/blog/{slug}.html"><b>{titulo}</b><span>{sub}</span></a>\n'
    if seccion == "guias":
        # al principio de la seccion de guias
        ancla = '<h2>Guías completas en español</h2>'
        i = pagina.find(ancla)
        if i < 0:
            print(f"   {slug}: no encuentro la seccion de guias")
            return
        j = pagina.find('<div class="grid">', i)
        if j < 0:
            print(f"   {slug}: no encuentro el grid de guias")
            return
        j += len('<div class="grid">')
        pagina = pagina[:j] + "\n" + bloque + pagina[j:]
    else:
        # seccion de comparativas: al principio de su grid
        ancla = '<h2>Comparativas y analisis</h2>'
        i = pagina.find(ancla)
        if i < 0:
            print(f"   {slug}: no encuentro la seccion de comparativas")
            return
        j = pagina.find('<div class="grid">', i)
        j += len('<div class="grid">')
        pagina = pagina[:j] + "\n" + bloque + pagina[j:]
    idx.write_text(pagina, encoding="utf-8")
    print(f"   tarjeta ES: {slug} ({seccion})")


def anadir_enlace(ruta, ancla_html, html_enlace, etiqueta):
    """Inserta un enlace tras un ancla, si no esta ya."""
    p = ROOT / ruta
    if not p.exists():
        print(f"   {ruta}: no existe")
        return
    s = p.read_text(encoding="utf-8", errors="ignore")
    if html_enlace in s:
        print(f"   {ruta}: ya enlaza a {etiqueta}")
        return
    i = s.find(ancla_html)
    if i < 0:
        print(f"   {ruta}: no encuentro el ancla '{ancla_html[:40]}'")
        return
    fin = s.find("</p>", i)
    if fin < 0:
        fin = i + len(ancla_html)
    else:
        fin += 4
    s = s[:fin] + "\n" + html_enlace + s[fin:]
    p.write_text(s, encoding="utf-8")
    print(f"   {ruta}: enlace a {etiqueta}")


def main():
    print("--- tarjetas en el indice EN")
    for slug, (t, sub, cat) in EN.items():
        tarjeta_en(slug, t, sub, cat)

    print("--- tarjetas en el indice ES")
    for slug, (t, sub, sec) in ES.items():
        tarjeta_es(slug, t, sub, sec)

    # ---- enlaces cruzados: que no queden huerfanos ----
    print("--- enlaces cruzados")

    # el articulo EN de magiaprimeros enlaza con sus pares ES
    anadir_enlace(
        "blog/black-friday-occult-books-2026.html",
        "If you want the whole method in writing after using those, the bundle is",
        '<p><a href="es-black-friday-libros-ocultismo-2026.html">La misma guía, en español</a></p>',
        "black friday ES")

    anadir_enlace(
        "blog/christmas-occult-books-gift-guide-2026.html",
        "If you genuinely do not know which book fits, there is a way to find out",
        '<p><a href="es-regalos-ocultismo-navidad-2026.html">La misma guía de regalos, en español</a></p>',
        "navidad ES")

    anadir_enlace(
        "blog/es-black-friday-libros-ocultismo-2026.html",
        "Si despues de usar esas herramientas decides que quieres el metodo completo",
        '<p><a href="/blog/black-friday-occult-books-2026.html">The same guide, in English</a></p>',
        "black friday EN")

    anadir_enlace(
        "blog/es-regalos-ocultismo-navidad-2026.html",
        "Si de verdad no sabes cual va con quien, hay una forma de averiguarlo sin",
        '<p><a href="/blog/christmas-occult-books-gift-guide-2026.html">The same gift guide, in English</a></p>',
        "navidad EN")

    # la guia EN de principiantes (899 impresiones) enlaza al itinerario ES
    anadir_enlace(
        "blog/chaos-magick-beginners-complete-guide.html",
        "If you are about to start, read the ten mistakes beginners make first.",
        '<p><a href="es-magia-del-caos-para-principiantes.html">La misma guía de 90 días, en español</a></p>',
        "principiantes ES")

    # la guia ES de astrologia (la de mas impresiones) enlaza al comparativo ES
    anadir_enlace(
        "blog/astrology-apps-android-guide.html",
        "A disclosure before anything else.",
        '<p><a href="es-mejores-apps-astrologia-android-2026.html">La misma comparativa, en español</a></p>',
        "apps astrologia ES")

    # las comparativas ES de la seccion "Comparativas" enlazan al articulo ES nuevo
    anadir_enlace(
        "es/astral-lab-vs-co-star.html",
        "<h1>",
        '<p>Para el comparativo completo de las 6 apps de astrologia con precios verificados, '
        '<a href="/blog/es-mejores-apps-astrologia-android-2026.html">la guia en español</a>.</p>',
        "comparativa apps ES")

    # ---- sitemap ----
    print("--- sitemap")
    r = subprocess.run([sys.executable, "scripts/generate_sitemap.py"], cwd=ROOT,
                       capture_output=True, text=True, encoding="utf-8")
    print("   " + (r.stdout or r.stderr).strip().split("\n")[0])

    sm = (ROOT / "sitemap.xml").read_text(encoding="utf-8")
    nuevos = list(EN.keys()) + list(ES.keys())
    print("   en el sitemap:")
    for n in nuevos:
        print(f"      {n}: {'si' if n in sm else 'NO'}")


if __name__ == "__main__":
    main()
