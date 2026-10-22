#!/usr/bin/env python3
"""
Genera SOLO las imagenes de articulo que faltan.

projects/scripts/generate_blog_images.py regenera las 846 imagenes del blog y
produce un diff enorme. Aqui se generan solo las que no existen: las de los
articulos nuevos y las de los 18 articulos que ya apuntaban a una imagen
inexistente (un bug que estaba en el repo desde antes).

La imagen se genera con la misma funcion y la misma paleta del generador
original, para que no se note la diferencia.

  python projects/scripts/generate_missing_images.py
"""
import importlib.util
import re
import sys
from pathlib import Path

ROOT = Path(".").resolve()
IMG_DIR = ROOT / "assets" / "images" / "blog"

spec = importlib.util.spec_from_file_location(
    "gbi", ROOT / "projects" / "scripts" / "generate_blog_images.py")
gbi = importlib.util.module_from_spec(spec)
sys.modules["gbi"] = gbi
spec.loader.exec_module(gbi)

# los indices de paleta siguen la posicion del articulo en el listado global,
# para que la imagen no cambie de estilo respecto a sus vecinas
slugs_todos = sorted(p.stem for p in (ROOT / "blog").glob("*.html") if p.stem != "index")
posicion = {s: i for i, s in enumerate(slugs_todos)}


def imagenes_faltantes():
    faltan = {}
    for p in sorted((ROOT / "blog").glob("*.html")):
        s = p.read_text(encoding="utf-8", errors="ignore")
        for nombre in set(re.findall(r"assets/images/blog/([a-z0-9\-_]+\.(?:png|webp))", s)):
            if not (IMG_DIR / nombre).exists():
                faltan.setdefault(p.stem, set()).add(nombre)
    return faltan


def main():
    faltan = imagenes_faltantes()
    if not faltan:
        print("   no falta ninguna imagen")
        return

    print(f"   {len(faltan)} articulo(s) con imagenes faltantes")
    for slug, nombres in sorted(faltan.items()):
        titulo = gbi.slug_to_title(slug)
        paleta = posicion.get(slug, 0) % len(gbi.PALETTES)
        img = gbi.generate_article_image(slug, titulo, paleta)
        if any(n.endswith(".webp") for n in nombres):
            img.save(IMG_DIR / f"{slug}.webp", "WEBP", quality=85)
        if any(n.endswith(".png") for n in nombres):
            img.save(IMG_DIR / f"{slug}.png", "PNG")
        # si el articulo pide la imagen con otro nombre, se copia
        for n in nombres:
            if n not in (f"{slug}.png", f"{slug}.webp"):
                src = IMG_DIR / (f"{slug}.webp" if n.endswith(".webp") else f"{slug}.png")
                dst = IMG_DIR / n
                if src.exists():
                    dst.write_bytes(src.read_bytes())
        print(f"      {slug}: {sorted(nombres)}")

    # comprobacion final
    faltan2 = imagenes_faltantes()
    print(f"   quedan imagenes faltantes: {len(faltan2)}")
    for k, v in list(faltan2.items())[:5]:
        print(f"      {k}: {sorted(v)}")


if __name__ == "__main__":
    main()
