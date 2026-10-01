"""Anade el modulo de 30 cruces al CSS compartido y lo enlaza desde la plantilla.

Los 349 articulos del catalogo de YouTube salen de `_template.json`, asi que su
`<head>` se decide ahi. Los legacy llevan su propio head ya escrito, y de ahi
los enlaza `inject_blog.py`. Los dos terminan SHAREANDO las mismas reglas: si las
duplicamos, el dia que se toque un color aparecen dos versiones distintas.

El modulo no se estiliza con `style.min.css` a proposito: ese archivo esta
minificado y regenerado, y anadir reglas ahi se pierde en la siguiente
minificacion. `wisdom.css` es un archivo nuestro, legible y con su propio ciclo
de cambios.
"""

import io
import json
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HERE, "..", "..", ".."))
CSS = os.path.join(REPO, "css", "wisdom.css")
TPL = os.path.join(REPO, "projects", "data", "yt-articles", "_template.json")

LINK = '<link rel="stylesheet" href="../css/wisdom.css">'

RULES = """
/* ------------------------------------------------------------------ *
 * Modulo de 30 cruces: la entrada al resto de la biblioteca.
 *
 * Aparece al final de los 815 articulos de blog/. Es navegacion, no
 * prosa, y por eso vive en `<ol class="crossrefs-list">` y no en
 * parrafos sueltos: asi el gate de calidad de slop.py puede excluirlo
 * entero con una regla de recorte en lugar de tener que distinguirlo
 * frase a frase.
 *
 * El color de enlace es el mismo ambar que usan los vinculos del cuerpo
 * de los articulos, para que una referenciabibliografica no parezca un
 * boton.
 * ------------------------------------------------------------------ */
.crossrefs {
  margin: 3rem 0;
  padding: 1.75rem 1.5rem;
  background: var(--bg-card, #131a3a);
  border: 1px solid var(--border-subtle, rgba(255, 255, 255, 0.08));
  border-left: 3px solid var(--accent-gold, #ffb03a);
  border-radius: 8px;
}

.crossrefs > h2 {
  color: #f5f7ff;
  font-size: 1.35rem;
  line-height: 1.3;
  margin: 0 0 0.75rem;
  padding-bottom: 0.65rem;
  border-bottom: 1px solid var(--border-subtle, rgba(255, 255, 255, 0.08));
}

.crossrefs-lede {
  color: #8a93b8;
  font-size: 0.98rem;
  line-height: 1.65;
  margin: 0 0 1.25rem;
}

.crossrefs-list {
  list-style: none;
  margin: 0;
  padding: 0;
  counter-reset: xref;
  display: grid;
  gap: 0.55rem;
}

.crossrefs-list li {
  counter-increment: xref;
  display: grid;
  grid-template-columns: 2.1rem 1fr;
  gap: 0 0.5rem;
  align-items: baseline;
  margin: 0;
  padding: 0.4rem 0;
  border-top: 1px solid rgba(255, 255, 255, 0.04);
}

.crossrefs-list li::before {
  content: counter(xref, decimal-leading-zero);
  color: #8a93b8;
  font-size: 0.8rem;
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.04em;
}

.crossrefs-list li > a {
  font-weight: 600;
  text-decoration: none;
}

.crossrefs-list .xref-domain {
  display: inline-block;
  margin-left: 0.4rem;
  color: #35c4d9;
  font-size: 0.7rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  white-space: nowrap;
  vertical-align: 0.12em;
}

.crossrefs-desc {
  display: block;
  color: #8a93b8;
  font-size: 0.88rem;
  line-height: 1.55;
  margin-top: 0.1rem;
}

/* Un unico acento para los vinculos de referencia, en tema claro y oscuro. */
.crossrefs-list a[href^="../blog/"],
.crossrefs-list a[href="./"] {
  color: #ffd79a;
  border-bottom: 1px solid rgba(255, 179, 58, 0.35);
  transition: color 0.15s ease, border-color 0.15s ease;
}

.crossrefs-list a[href^="../blog/"]:hover,
.crossrefs-list a[href^="../blog/"]:focus-visible {
  color: #ffffff;
  border-bottom-color: #ffb03a;
}

@media (max-width: 640px) {
  .crossrefs {
    padding: 1.25rem 1rem;
  }
  .crossrefs > h2 {
    font-size: 1.15rem;
  }
  .crossrefs-list li {
    grid-template-columns: 1fr;
  }
  .crossrefs-list li::before {
    display: none;
  }
  .crossrefs-list .xref-domain {
    display: block;
    margin-left: 0;
    margin-top: 0.15rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .crossrefs-list a[href^="../blog/"] {
    transition: none;
  }
}
"""


def patch_css() -> str:
    if not os.path.isfile(CSS):
        raise SystemExit("falta css/wisdom.css: %s" % CSS)
    with io.open(CSS, encoding="utf-8") as fh:
        text = fh.read()
    if ".crossrefs-list" in text:
        return "wisdom.css ya tiene reglas de .crossrefs: sin cambios"
    if not text.endswith("\n"):
        text += "\n"
    text += RULES.lstrip("\n")
    with io.open(CSS, "w", encoding="utf-8", newline="\n") as fh:
        fh.write(text)
    return "wisdom.css: +%d lineas" % (RULES.count("\n"))


def patch_template() -> str:
    if not os.path.isfile(TPL):
        raise SystemExit("falta _template.json: %s" % TPL)
    with io.open(TPL, encoding="utf-8") as fh:
        data = json.load(fh)
    current = data.get("cssLink", "")
    if "wisdom.css" in current:
        return "_template.json ya enlaza wisdom.css: sin cambios"
    data["cssLink"] = current + "\r\n" + LINK
    with io.open(TPL, "w", encoding="utf-8", newline="\n") as fh:
        json.dump(data, fh, indent=2, ensure_ascii=False)
        fh.write("\n")
    return "_template.json: cssLink ahora enlaza wisdom.css"


def main() -> int:
    print(patch_css())
    print(patch_template())
    return 0


if __name__ == "__main__":
    sys.exit(main())
