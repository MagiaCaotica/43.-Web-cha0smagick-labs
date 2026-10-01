"""Elimina etiquetas de cierre huerfanas del HTML.

Motivo: varias paginas del sitio arrastran cierres sobrantes que el navegador
descarta en silencio pero que rompen cualquier validacion de markup y estropean
el conteo de secciones. El caso conocido es apps/iching-oracle.html, que ya
venia asi en git HEAD: un </div>, un </a>, otro </div> y un </section> sin
apertura, justo despues del bloque "You May Also Like".

El escaner es de pila y omite a proposito el contenido de <script>, <style> y
<textarea>, donde cualquier cadena con angulares parece una etiqueta. Solo se
borran cierres huerfanos: una apertura sin cerrar NO se toca, porque anadir el
cierre que falta es una decision de maquetacion, no una limpieza.

    python fix_orphans.py            # informa, no escribe
    python fix_orphans.py --write    # borra los cierres huerfanos
    python fix_orphans.py --write apps/*.html
"""
from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parents[3]
ROOT = Path(__file__).resolve().parent

VOID = {
    "area", "base", "br", "col", "embed", "hr", "img", "input", "link",
    "meta", "param", "source", "track", "wbr",
}
RAW = {"script", "style", "textarea"}
COMMENT = re.compile(r"<!--.*?-->", re.S)
DOCTYPE = re.compile(r"<![^>]*>")
TAG = re.compile(r"<(/?)([a-zA-Z][a-zA-Z0-9:-]*)([^>]*?)(/?)>", re.S)


def scan(html: str) -> tuple[list[dict], list[dict]]:
    """Devuelve (aperturas sin cerrar, cierres huerfanos) con offset y linea."""
    clean = COMMENT.sub(lambda m: " " * len(m.group(0)), html)
    clean = DOCTYPE.sub(lambda m: " " * len(m.group(0)), clean)
    for raw in RAW:
        clean = re.sub(
            rf"<{raw}\b.*?</{raw}>",
            lambda m: " " * len(m.group(0)),
            clean,
            flags=re.S | re.I,
        )

    stack: list[tuple[str, int]] = []
    unclosed: list[dict] = []
    orphans: list[dict] = []

    for m in TAG.finditer(clean):
        closing, name, attrs, selfclose = m.group(1), m.group(2).lower(), m.group(3), m.group(4)
        line = clean.count("\n", 0, m.start()) + 1
        if name in VOID or selfclose:
            continue
        if closing:
            if stack and stack[-1][0] == name:
                stack.pop()
            else:
                orphans.append({"tag": name, "start": m.start(), "end": m.end(), "line": line,
                                "raw": m.group(0), "stack_top": stack[-1][0] if stack else None})
        else:
            stack.append((name, m.start()))
            if not attrs.strip().rstrip("/"):
                pass

    for name, start in stack:
        unclosed.append({"tag": name, "start": start,
                         "line": clean.count("\n", 0, start) + 1})
    return unclosed, orphans


def strip_orphans(html: str, orphans: list[dict]) -> str:
    out = html
    for o in sorted(orphans, key=lambda x: x["start"], reverse=True):
        s, e = o["start"], o["end"]
        #absorbe el espacio en blanco y el salto de linea que preceden al cierre
        while s > 0 and out[s - 1] in " \t":
            s -= 1
        if s > 0 and out[s - 1] == "\n":
            s -= 1
        if s > 0 and out[s - 1] == "\r":
            s -= 1
        out = out[:s] + out[e:]
    return out


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--write", action="store_true", help="borra los cierres huerfanos")
    ap.add_argument("paths", nargs="*", help="archivos a revisar (por defecto apps/*.html)")
    args = ap.parse_args()

    if args.paths:
        files = [Path(p) for p in args.paths]
    else:
        files = sorted((REPO / "apps").glob("*.html"))

    total_orphans = 0
    total_unclosed = 0
    changed = []
    for f in files:
        if not f.exists():
            print(f"[SKIP] {f} no existe")
            continue
        html = f.read_text(encoding="utf-8")
        unclosed, orphans = scan(html)
        total_orphans += len(orphans)
        total_unclosed += len(unclosed)
        if not orphans and not unclosed:
            print(f"[ok]   {f.name}: markup balanceado")
            continue
        for u in unclosed:
            print(f"[ABRE] {f.name} linea {u['line']}: <{u['tag']}> sin cerrar")
        for o in orphans:
            top = o["stack_top"] or "pila vacia"
            print(f"[HUER] {f.name} linea {o['line']}: </{o['tag']}> (pila: {top})")
        if args.write and orphans:
            f.write_text(strip_orphans(html, orphans), encoding="utf-8")
            changed.append(f.name)
            print(f"       -> {f.name}: {len(orphans)} cierre(s) huerfano(s) borrado(s)")

    print(f"\nresumen: {len(files)} archivo(s), {total_orphans} cierre(s) huerfano(s), "
          f"{total_unclosed} apertura(s) sin cerrar")
    if args.write and changed:
        print("modificados: " + ", ".join(changed))
    return 0


if __name__ == "__main__":
    sys.exit(main())
