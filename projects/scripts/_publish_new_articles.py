#!/usr/bin/env python3
"""
Da de alta los articulos nuevos: imagen, tarjeta en el indice y enlaces desde
la pagina que ya posiciona para esas secciones.

  python projects/scripts/_publish_new_articles.py <slug> [<slug> ...]
"""
import importlib.util
import re
import sys
from pathlib import Path

ROOT = Path(".").resolve()
BLOG = ROOT / "blog"
IMG = ROOT / "assets" / "images" / "blog"

CATEGORIA = {
    "chaos-magic-common-beginner-mistakes": "basics",
    "chaos-magic-8-week-learning-path": "basics",
}

# enlaces desde la guia principal, que es la pagina con mas impressiones del sitio
ENLACES_DESDE_GUIA = {
    "chaos-magic-common-beginner-mistakes":
        "chaos-magick-beginners-complete-guide.html",
    "chaos-magic-8-week-learning-path":
        "chaos-magick-beginners-complete-guide.html",
}


def imagen(slug):
    spec = importlib.util.spec_from_file_location("genimg", ROOT / "projects" / "scripts" / "generate_blog_images.py")
    m = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(m)
    titulo = m.slug_to_title(slug)
    img = m.generate_article_image(slug, titulo, 3)
    img.save(IMG / f"{slug}.png", "PNG")
    img.save(IMG / f"{slug}.webp", "WEBP", quality=85)
    print(f"   imagen: {slug}.png / .webp")


def tarjeta(slug):
    idx = BLOG / "index.html"
    pagina = idx.read_text(encoding="utf-8", errors="ignore")
    if f'href="{slug}.html"' in pagina:
        print(f"   {slug}: ya esta en el indice")
        return
    src = (BLOG / f"{slug}.html").read_text(encoding="utf-8", errors="ignore")
    titulo = re.search(r"(?is)<h1[^>]*>(.*?)</h1>", src).group(1).strip()
    fecha = re.search(r'(?i)<time[^>]+datetime="(\d{4}-\d{2}-\d{2})"', src).group(1)
    desc = re.search(r'(?i)<meta name="description" content="([^"]*)"', src).group(1)
    excerpt = desc[:220].rsplit(" ", 1)[0].rstrip(",;:") + "."
    cat = CATEGORIA.get(slug, "basics")
    bloque = f"""<div class="post-card" data-category="{cat}">
<div class="date">{fecha}</div>
<h3><a href="{slug}.html">{titulo}</a></h3>
<div class="excerpt">{excerpt}</div>
<a class="read-more" href="{slug}.html">Read More →</a>
</div>
"""
    marca = '<div class="posts">\n'
    i = pagina.find(marca)
    if i < 0:
        print(f"   {slug}: no encuentro el contenedor .posts")
        return
    pagina = pagina[: i + len(marca)] + bloque + pagina[i + len(marca):]
    idx.write_text(pagina, encoding="utf-8")
    print(f"   tarjeta en el indice: {slug} ({cat})")


def enlace_desde_guia(slug):
    guia = BLOG / "chaos-magick-beginners-complete-guide.html"
    src = guia.read_text(encoding="utf-8", errors="ignore")
    if f"{slug}.html" in src:
        print(f"   {slug}: ya enlazado desde la guia")
        return
    # se inserta tras el primer parrafo de la seccion que le corresponde
    textos = {
        "chaos-magic-common-beginner-mistakes":
            "If you are about to start, read the ten mistakes beginners make first. It saves weeks.",
        "chaos-magic-8-week-learning-path":
            "If you would rather follow a schedule than improvise, there is an eight-week path that uses exactly "
            "this material, one working a week, with a log you can read at the end.",
    }
    anclas = {
        "chaos-magic-common-beginner-mistakes": "Common Beginner Mistakes",
        "chaos-magic-8-week-learning-path": "Suggested Learning Path",
    }
    i = src.find(anclas[slug])
    if i < 0:
        print(f"   {slug}: no encuentro la seccion '{anclas[slug]}'")
        return
    fin = src.find("</p>", i)
    if fin < 0:
        print(f"   {slug}: la seccion no tiene parrafo")
        return
    fin += 4
    extra = f'\n<p><a href="{slug}.html">{textos[slug]}</a></p>'
    src = src[:fin] + extra + src[fin:]
    guia.write_text(src, encoding="utf-8")
    print(f"   enlace desde la guia: {slug}")


for slug in sys.argv[1:]:
    print(f"--- {slug}")
    imagen(slug)
    tarjeta(slug)
    enlace_desde_guia(slug)
