"""Comprueba si un defecto de markup es pre-existente comparando con git HEAD.

Saca el archivo de `git show HEAD:<ruta>` como BYTES (la redireccion de
PowerShell escribe UTF-16 y rompe la lectura) y lo pasa por el mismo escaner
que `fix_orphans.py`. Util para no atribuir a una inyeccion un defecto que
ya estaba en el archivo original.
"""

import io
import os
import subprocess
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HERE, "..", "..", ".."))
sys.path.insert(0, HERE)

import fix_orphans  # noqa: E402


def at_head(path: str) -> str:
    out = subprocess.run(
        ["git", "show", "HEAD:" + path.replace("\\", "/")],
        cwd=REPO,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        check=True,
    )
    return out.stdout.decode("utf-8", "replace")


def main(argv) -> int:
    if len(argv) < 2:
        raise SystemExit("uso: _preexist.py <ruta-relativa> [...]")
    for rel in argv[1:]:
        current_path = os.path.join(REPO, rel.replace("/", os.sep))
        if not os.path.isfile(current_path):
            print("%s: no existe en disco" % rel)
            continue
        with io.open(current_path, encoding="utf-8") as fh:
            current = fh.read()
        try:
            original = at_head(rel)
        except subprocess.CalledProcessError as exc:
            print("%s: no estaba en HEAD (%s)" % (rel, exc.stderr.decode().strip()))
            continue
        a = fix_orphans.scan(original)
        b = fix_orphans.scan(current)

        def show(res) -> str:
            orphans, unclosed = res
            bits = []
            if orphans:
                bits.append(
                    "%d cierre(s) huerfano(s): %s"
                    % (len(orphans), ", ".join(sorted({o["tag"] for o in orphans})))
                )
            if unclosed:
                bits.append(
                    "%d apertura(s) sin cerrar: %s"
                    % (len(unclosed), ", ".join(sorted({u["tag"] for u in unclosed})))
                )
            return "limpio" if not bits else "; ".join(bits)

        # Se comparan SOLO los tags, nunca los offsets: al insertar texto todas
        # las lineas se desplazan y la comparacion por posicion daria siempre
        # "lo introdujo esta inyeccion" aunque el defecto sea el mismo de antes.
        def signature(res) -> tuple:
            orphans, unclosed = res
            return (
                tuple(sorted(o["tag"] for o in orphans)),
                tuple(sorted(u["tag"] for u in unclosed)),
            )

        print("%s" % rel)
        print("   HEAD  : %s" % show(a))
        print("   ahora : %s" % show(b))
        print(
            "   veredicto: %s"
            % ("PRE-EXISTENTE" if signature(a) == signature(b) else "lo introdujo esta inyeccion")
        )
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
