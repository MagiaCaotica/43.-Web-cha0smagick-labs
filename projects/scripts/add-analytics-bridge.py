#!/usr/bin/env python3
"""
Carga js/analytics-bridge.js en las 902 paginas que no lo tenian.

Por que: data/analytics-events.json dice, literalmente, que
"js/analytics-bridge.js is the only allowlist enforcement point. Any parameter
not present in its ALLOWED_KEYS map is dropped before the event reaches
dataLayer". Y conversion.js, que es lo que cargan esas paginas, hace:

    window.gtag('event', eventName, params || {});

Es decir, sin el bridge, los parametros llegan a GA4 SIN filtrar. La
allowlist existe para que un call site nuevo no envie por error un dato
sensible; en el 87% del sitio no habia nada que lo parase.

Ademas, el bridge es el unico que comprueba el consentimiento antes de
encolar, de modo que con el los eventos de todo el sitio pasan por la misma
conducta consent-gated.

Se inserta despues de conversion.min.js, que es el orden que ya usan las
paginas que si lo cargan.

  python projects/scripts/add-analytics-bridge.py
"""
import re
from pathlib import Path

ROOT = Path(".").resolve()
SCRIPT = '<script src="{ruta}js/analytics-bridge.js" defer></script>'

n = {"anadido": 0, "omitido": 0}

for p in sorted(ROOT.rglob("*.html")):
    s = str(p)
    if any(x in s for x in ("node_modules", ".git", "auto-shorts", "pinterest-pins", "projects/docs")):
        continue
    src = p.read_text(encoding="utf-8", errors="ignore")
    if "analytics-bridge" in src:
        n["omitido"] += 1
        continue

    # ruta relativa segun la profundidad de la pagina
    prof = len(p.relative_to(ROOT).parts) - 1
    ruta = "../" * prof
    tag = SCRIPT.format(ruta=ruta)

    # se inserta despues de conversion.min.js; si no esta, antes de </body>
    m = re.search(r'<script[^>]*src="[^"]*conversion(?:\.min)?\.js"[^>]*>\s*</script>', src)
    if m:
        src = src[:m.end()] + "\n" + tag + src[m.end():]
    else:
        m2 = re.search(r'<script[^>]*src="[^"]*shared(?:\.min)?\.js"[^>]*>\s*</script>', src)
        if m2:
            src = src[:m2.end()] + "\n" + tag + src[m2.end():]
        else:
            i = src.rfind("</body>")
            if i < 0:
                continue
            src = src[:i] + tag + "\n" + src[i:]
    p.write_text(src, encoding="utf-8")
    n["anadido"] += 1

print("=== analytics-bridge ===")
print(f"   paginas que ya lo tenian: {n['omitido']}")
print(f"   paginas actualizadas      : {n['anadido']}")
