"""Verificacion estructural de las 12 paginas de app tras la inyeccion."""
import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parents[3]
APPS = ROOT / "apps"
BLOG = ROOT / "blog"

TAGS = ["html", "head", "body", "main", "section", "div", "a", "details", "dl", "h2", "h3"]
rows = []
for p in sorted(APPS.glob("*.html")):
    h = p.read_text(encoding="utf-8")
    h1 = re.search(r"<h1[^>]*>(.*?)</h1>", h, re.S)
    h1t = re.sub(r"\s+", " ", re.sub(r"<[^>]+>", "", h1.group(1))).strip() if h1 else "-"
    blog = re.findall(r'href="\.\./blog/([a-z0-9\-]+)\.html"', h)
    uniq = len(set(blog))
    # enlaces en texto: los que estan dentro de section.wisdom (fuera de details)
    wm = re.search(r"<!-- linkgraph:wisdom:start -->(.*?)<!-- linkgraph:wisdom:end -->", h, re.S)
    prose = wm.group(1) if wm else ""
    prose_nodetails = re.sub(r"<details.*?</details>", "", prose, flags=re.S)
    intext = len(set(re.findall(r'href="\.\./blog/([a-z0-9\-]+)\.html"', prose_nodetails)))
    bad = sorted({s for s in set(blog) if not (BLOG / f"{s}.html").exists()})
    bal = []
    for t in TAGS:
        o = len(re.findall(rf"<{t}[\s>]", h))
        c = len(re.findall(rf"</{t}>", h))
        if o != c:
            bal.append(f"{t} {o}/{c}")
    flags = []
    if "\ufffd" in h:
        flags.append("U+FFFD")
    if not h.rstrip().endswith("</html>"):
        flags.append("no-cierra-html")
    if bad:
        flags.append(f"slugs-rotos:{len(bad)}")
    if bal:
        flags.append("tags:" + ",".join(bal))
    if "wisdom.css" not in h:
        flags.append("sin-wisdom.css")
    if "Cha0smagick Labs" in h1t:
        flags.append("h1-sigue-sitio")
    rows.append((p.name, len(h), intext, uniq, h1t[:46], "; ".join(flags) or "ok"))

print(f"{'archivo':<38}{'bytes':>7}{'en-texto':>9}{'uniq':>6}  h1 / estado")
for r in rows:
    print(f"{r[0]:<38}{r[1]:>7}{r[2]:>9}{r[3]:>6}  {r[4]}  [{r[5]}]")
bad = [r for r in rows if r[5] != "ok" or r[2] < 30]
print()
print("todas >=30 en texto" if not bad else f"FALLOS: {[r[0] for r in bad]}")
print("min en-texto:", min(r[2] for r in rows), "| total en-texto:", sum(r[2] for r in rows))
