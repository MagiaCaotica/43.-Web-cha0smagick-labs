"""Add the contextual-CTA styles to css/wisdom.css. Idempotent.

The CTA is the one element on the page whose job is to be clicked, so it has
to look different from the thirty cross-reference links below it: a boxed
panel with a solid amber button, not a list of inline links. Without that
distinction it reads as one more row of navigation and gets the same
treatment, which is zero clicks.
"""

import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.normpath(os.path.join(HERE, "..", "..", ".."))
CSS = os.path.join(REPO, "css", "wisdom.css")

MARK_START = "/* linkgraph:cta:styles:start */"
MARK_END = "/* linkgraph:cta:styles:end */"

BLOCK = r'''
/* linkgraph:cta:styles:start */
.cta-contextual {
  margin: 2.5rem 0;
  padding: 1.75rem 1.75rem 1.5rem;
  background: linear-gradient(180deg, rgba(255, 176, 58, 0.07), rgba(255, 176, 58, 0.02));
  border: 1px solid rgba(255, 176, 58, 0.35);
  border-radius: 10px;
}
.cta-contextual > h2 {
  margin: 0 0 1rem;
  font-size: 1.35rem;
  color: var(--accent-gold, #FFB03A);
  padding-bottom: 0.6rem;
  border-bottom: 1px solid rgba(255, 176, 58, 0.22);
}
.cta-contextual p { margin: 0 0 0.9rem; }
.cta-contextual-why {
  color: var(--text, #F5F7FF);
  font-size: 1.02rem;
  line-height: 1.62;
}
.cta-contextual-what {
  color: var(--muted, #8A93B8);
  font-size: 0.95rem;
  line-height: 1.58;
}
.cta-contextual-what strong { color: var(--text, #F5F7FF); }
.cta-off {
  display: inline-block;
  margin-left: 0.35rem;
  padding: 0.05rem 0.4rem;
  font-size: 0.78rem;
  font-weight: 600;
  color: #0B1026;
  background: #4ADE80;
  border-radius: 3px;
  vertical-align: middle;
}
.cta-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem 1.1rem;
  margin: 1.15rem 0 0;
}
.cta-actions .cta-button.primary {
  display: inline-block;
  padding: 0.7rem 1.4rem;
  font-weight: 700;
  font-size: 1rem;
  color: #0B1026;
  background: linear-gradient(180deg, #FFC46A, #FFB03A);
  border: 1px solid #FFB03A;
  border-radius: 6px;
  text-decoration: none;
  transition: transform 0.12s ease, box-shadow 0.12s ease;
}
.cta-actions .cta-button.primary:hover,
.cta-actions .cta-button.primary:focus-visible {
  transform: translateY(-1px);
  box-shadow: 0 4px 14px rgba(255, 176, 58, 0.3);
}
.cta-actions .cta-secondary {
  font-size: 0.9rem;
  color: #FFD79A;
  border-bottom: 1px solid rgba(255, 176, 58, 0.4);
  text-decoration: none;
}
.cta-actions .cta-secondary:hover,
.cta-actions .cta-secondary:focus-visible {
  color: #FFFFFF;
  border-bottom-color: #FFFFFF;
}
.cta-contextual-bundle {
  margin: 1rem 0 0;
  padding-top: 0.85rem;
  font-size: 0.9rem;
  color: var(--muted, #8A93B8);
  border-top: 1px dashed rgba(255, 176, 58, 0.22);
}
.cta-contextual-bundle a {
  color: #FFD79A;
  border-bottom: 1px solid rgba(255, 176, 58, 0.4);
  text-decoration: none;
}
.cta-contextual-bundle a:hover,
.cta-contextual-bundle a:focus-visible { color: #FFFFFF; }
@media (max-width: 640px) {
  .cta-contextual { padding: 1.25rem 1.1rem 1.1rem; }
  .cta-actions .cta-button.primary { width: 100%; text-align: center; }
}
@media (prefers-reduced-motion: reduce) {
  .cta-actions .cta-button.primary { transition: none; }
  .cta-actions .cta-button.primary:hover { transform: none; }
}
/* linkgraph:cta:styles:end */
'''


def main():
    if not os.path.exists(CSS):
        print("no existe %s" % CSS)
        return 1
    with open(CSS, encoding="utf-8", newline="") as fh:
        css = fh.read()
    if MARK_START in css:
        print("wisdom.css: los estilos del CTA ya estan")
        return 0
    nl = "\r\n" if "\r\n" in css else "\n"
    block = re.sub(r"\r\n|\r|\n", nl, BLOCK.strip("\n"))
    if not css.endswith(nl):
        css = css + nl
    with open(CSS, "w", encoding="utf-8", newline="") as fh:
        fh.write(css + block + nl)
    print("wisdom.css: +%d lineas" % len(BLOCK.strip("\n").splitlines()))
    return 0


if __name__ == "__main__":
    sys.exit(main())
