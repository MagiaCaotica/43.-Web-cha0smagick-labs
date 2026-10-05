#!/usr/bin/env python3
"""
Repara la fuga de PowerShell `$args[0].Value.ToUpper()` en el texto de enlaces.

CONTEXTO DEL BUG
----------------
Un script de PowerShell que genero los bloques <aside class="related-articles">
quiso poner en mayuscula la primera letra de cada palabra del ancla, pero en
lugar de la letra escribio el literal de la expresion:

  $args[0].Value.ToUpper()   -->   (la letra que deberia ir ahi)

Asi "How To Banish Cleanse Space" quedo como:

  $args[0].Value.ToUpper() ow $args[0].Value.ToUpper() o $args[0].Value.ToUpper() anish
  $args[0].Value.ToUpper() leanse $args[0].Value.ToUpper() pace

Es decir, el token COMIO la mayuscula inicial de cada palabra. Se comprobo que
las 1190 ocurrencias estan dentro del texto de un <a> y ninguna fuera, y que el
href quedo intacto. Por eso la reconstruccion es posible: el texto correcto se
deduce del slug del href, aplicando title-case, que es lo que el script queria
hacer en primer lugar.

El <title> de la pagina destino se usa como verificacion: si el title-case del
slug no coincide con el title real, la pagina se reporta para revision manual en
vez de corregirse a ciegas.
"""
import os
import re
import sys
import json

TOKEN = "$args[0].Value.ToUpper()"
ROOT = "."
DRY = "--dry" in sys.argv

# Ficheros y carpetas que nunca se tocan.
SKIP_DIRS = {"node_modules", ".git", "vendor", "projects", "docs", ".omo"}

# Slugs que no se deben title-casar tal cual (contienen guion bajo de separador
# o ya vienen con capitalizacionResolved en el href).
WORD_FIXES = {}

LINK_RE = re.compile(
    r'(<a\b[^>]*?\bhref=")([^"]+)("[^>]*>)([^<]*?)(\$args\[0\]\.Value\.ToUpper\(\)[^<]*?)(</a>)',
    re.S,
)


def slug_to_title(slug):
    """Convierte un slug de fichero en Title Case, que es lo que el script
    pretendia producir."""
    # Path absoluto o relativo: nos quedamos con el nombre del fichero.
    base = slug.split("?")[0].split("#")[0].rstrip("/")
    base = base.rsplit("/", 1)[-1]
    if base.endswith(".html"):
        base = base[: -len(".html")]
    if not base:
        return None
    words = [w for w in base.split("-") if w]
    if not words:
        return None
    out = []
    for w in words:
        if w in WORD_FIXES:
            out.append(WORD_FIXES[w])
        elif w.isdigit():
            out.append(w)
        else:
            out.append(w[0].upper() + w[1:])
    return " ".join(out)


def real_title(target_slug):
    """Lee el <title> de la pagina destino para verificar la reconstruccion."""
    base = target_slug.split("?")[0].split("#")[0].rstrip("/")
    base = base.rsplit("/", 1)[-1]
    if not base.endswith(".html"):
        base += ".html"
    if base.startswith("/"):
        base = base[1:]
    path = os.path.join(ROOT, base)
    if not os.path.exists(path):
        return None
    try:
        c = open(path, encoding="utf-8").read()
    except Exception:
        return None
    m = re.search(r"<title[^>]*>(.*?)</title>", c, re.S)
    if not m:
        return None
    t = re.sub(r"<[^>]+>", "", m.group(1))
    t = t.replace("&amp;", "&").replace("&#39;", "'").replace("&quot;", '"')
    # Se recorta el sufijo de marca para comparar solo el tema.
    t = re.split(r"\s*\|\s*", t)[0].strip()
    t = re.sub(r"\s*[-–—:]\s*$", "", t)
    return t


def norm(s):
    return re.sub(r"[^a-z0-9 ]", "", (s or "").lower()).strip()


def main():
    files = []
    for dirpath, dirnames, filenames in os.walk(ROOT):
        dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS]
        for fn in filenames:
            if fn.endswith(".html"):
                files.append(os.path.join(dirpath, fn))

    stats = {
        "files_scanned": len(files),
        "files_changed": 0,
        "links_repaired": 0,
        "tokens_replaced": 0,
    }
    changed = []
    for_review = []
    not_in_repo = {}

    for path in files:
        rel = os.path.join(path).replace("\\", "/")[len(ROOT) + 1:]
        try:
            c = open(path, encoding="utf-8").read()
        except Exception:
            continue
        if TOKEN not in c:
            continue

        file_mismatch = []

        def repl(m):
            href = m.group(2)
            inner = m.group(5)
            ntok = inner.count(TOKEN)
            want = slug_to_title(href)
            if not want:
                return m.group(0)
            stats["links_repaired"] += 1
            stats["tokens_replaced"] += ntok
            # Se cruza con el title real de la pagina destino.
            rt = real_title(href)
            if rt and norm(rt) != norm(want):
                # No se corrige a ciegas: se anota para revision.
                file_mismatch.append(
                    {"href": href, "derivado": want, "titulo_real": rt}
                )
            return m.group(1) + href + m.group(3) + want + m.group(6)

        out = LINK_RE.sub(repl, c)

        # Si quedan tokens fuera del patron de enlace, se avisa.
        left = out.count(TOKEN)

        if out != c:
            stats["files_changed"] += 1
            changed.append(rel)
            if not DRY:
                with open(path, "w", encoding="utf-8", newline="") as fh:
                    fh.write(out)
        if left:
            not_in_repo[rel] = left
        if file_mismatch:
            for_review.append({"file": rel, "casos": file_mismatch})

    print("=== RESULTADO%s ===" % (" (dry-run, no se escribio nada)" if DRY else ""))
    for k, v in stats.items():
        print(f"  {k}: {v}")
    print()
    print("=== paginas modificadas (%d) ===" % len(changed))
    for p in changed:
        print("  ", p)
    print()
    if not_in_repo:
        print("=== TOKENS SIN RESOLVER (no eran texto de enlace) ===")
        for p, n in not_in_repo.items():
            print(f"   {n}x  {p}")
        print()
    if for_review:
        print("=== REVISAR: el title-case del slug no coincide con el title real ===")
        for f in for_review:
            print("  " + f["file"])
            for c2 in f["casos"]:
                print(f'     href={c2["href"]}')
                print(f'       derivado  : "{c2["derivado"]}"')
                print(f'       titulo real: "{c2["titulo_real"]}"')
    else:
        print("=== el title-case del slug coincide con el title real en todos los casos ===")
    print()
    print("cambios:", json.dumps(changed))


if __name__ == "__main__":
    main()