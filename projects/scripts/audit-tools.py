#!/usr/bin/env python3
"""
AUDITORIA DE VALOR DE LAS HERRAMIENTAS GRATUITAS.

Que sea bonita es el vehiculo. Lo que se mide aqui es el VALOR que entrega
cada herramienta y si deja un camino claro al siguiente paso:

  resultado   ¿muestra un resultado util?
  guardar     ¿el usuario puede llevarselo (copiar, guardar, exportar, imprimir)?
  siguiente   ¿hay un camino al producto de pago?
  guia        ¿explica como usarla?
  movil       ¿esta pensada para el movil?
  a11y        ¿tiene etiquetas, foco visible y orden de titulos?
  diseno      ¿comparte el sistema visual del resto?

  python projects/scripts/audit-tools.py
"""
import json
import re
from collections import Counter
from pathlib import Path

ROOT = Path(".").resolve()
TOOLS = sorted(list((ROOT / "tools").glob("*.html")) + list((ROOT / "es" / "tools").glob("*.html")))

EMBED = re.compile(r"<iframe", re.I)
COPIAR = re.compile(r"(copy|clipboard|writeText|descargar|download|export|print|imprimir|guardar|save|compartir|share)", re.I)
SIGUIENTE = re.compile(r"(apps/|books/|play\.google|landing-pages/)", re.I)
GUIA = re.compile(r"(how to use|how to|c\xf3mo se usa|instruc|steps|guide|gu\xeda|read the)", re.I)
INPUT = re.compile(r"<(input|select|textarea|button)\b", re.I)
LABEL = re.compile(r"<label\b", re.I)
ARIA = re.compile(r"aria-(label|labelledby|describedby|role|live)", re.I)
FOCO = re.compile(r":focus", re.I)
H1 = re.compile(r"(?i)<h1\b")
H2 = re.compile(r"(?i)<h2\b")
VIEWPORT = re.compile(r'(?i)<meta[^>]+name=["\']viewport["\']')
MEDIA = re.compile(r"@media", re.I)
CANVAS = re.compile(r"<(canvas|svg)\b", re.I)

filas = []
for p in TOOLS:
    s = p.read_text(encoding="utf-8", errors="ignore")
    texto = re.sub(r"(?is)<(script|style)[^>]*>.*?</\1>", " ", s)
    texto = re.sub(r"<[^>]+>", " ", texto)
    texto = re.sub(r"\s+", " ", texto).strip()
    titulo = (re.search(r"(?is)<title[^>]*>(.*?)</title>", s) or ["", ""])[1].strip()
    h1 = (re.search(r"(?is)<h1[^>]*>(.*?)</h1>", s) or ["", ""])[1]
    h1 = re.sub(r"<[^>]+>", " ", h1).strip()
    filas.append({
        "fichero": str(p.relative_to(ROOT)).replace("\\", "/"),
        "titulo": titulo[:70],
        "h1": h1[:60],
        "embed": bool(EMBED.search(s)),
        "palabras": len(texto.split()),
        "controles": len(INPUT.findall(s)),
        "resultado": bool(re.search(r"(?i)(result|resultado|output|your |tu |generated|calculado)", texto)),
        "guardar": bool(COPIAR.search(s)),
        "siguiente": bool(SIGUIENTE.search(s)),
        "guia": bool(GUIA.search(s)),
        "viewport": bool(VIEWPORT.search(s)),
        "canvas": bool(CANVAS.search(s)),
        "label": bool(LABEL.search(s)),
        "aria": bool(ARIA.search(s)),
        "h2": len(H2.findall(s)),
        "atomic_css": "atomic-tools.css" in s,
    })

nativas = [f for f in filas if not f["embed"]]
embebidas = [f for f in filas if f["embed"]]


def resumen(conjunto, etiqueta):
    if not conjunto:
        return
    n = len(conjunto)
    print(f"\n=== {etiqueta}: {n} herramientas ===")
    for campo in ["resultado", "guardar", "siguiente", "guia", "viewport", "label", "aria", "atomic_css", "canvas"]:
        c = sum(1 for f in conjunto if f[campo])
        print(f"   con {campo:12} {c:>3}/{n}  ({100.0 * c / n:>5.1f}%)")
    ctrl = [f["controles"] for f in conjunto]
    print(f"   controles interactivos: mediana {sorted(ctrl)[len(ctrl) // 2]}, min {min(ctrl)}, max {max(ctrl)}")
    print(f"   palabras: mediana {sorted(f['palabras'] for f in conjunto)[n // 2]}")


print("=" * 78)
print("AUDITORIA DE VALOR DE LAS HERRAMIENTAS GRATUITAS")
print("=" * 78)
resumen(nativas, "NATIVAS (las que hay que rediseñar)")
resumen(embebidas, "EMBEBIDAS (iframe, quedan fuera por instruccion)")

print("\n=== LAS HERRAMIENTAS NATIVAS SIN 'SIGUIENTE PASO' AL PRODUCTO ===")
sin = [f for f in nativas if not f["siguiente"]]
print(f"   {len(sin)} de {len(nativas)}")
for f in sin[:24]:
    print(f"      {f['fichero']:52} resultado={str(f['resultado']):5} guardar={str(f['guardar']):5} guia={f['guia']}")

print("\n=== LAS HERRAMIENTAS NATIVAS SIN PODER GUARDAR EL RESULTADO ===")
sing = [f for f in nativas if not f["guardar"]]
print(f"   {len(sing)} de {len(nativas)}")

print("\n=== ESTRUCTURA VISUAL: Plantillas distintas ===")
plantillas = Counter()
for f in nativas:
    s = (ROOT / f["fichero"]).read_text(encoding="utf-8", errors="ignore")
    clases = []
    for c in re.findall(r'(?i)<(?:main|section|div)[^>]*class="([^"]{0,60})"', s):
        clases.extend(x for x in c.split() if x.startswith(("tool", "card", "panel", "result", "controls", "app")))
    plantillas[tuple(sorted(set(clases))[:4])] += 1
for k, v in plantillas.most_common(8):
    print(f"   {v:>3}x  {', '.join(k) if k else '(sin clases propias)'}")

out = {"generado": "", "nativas": filas}
(ROOT / "data" / "guerrilla").mkdir(parents=True, exist_ok=True)
(ROOT / "data" / "guerrilla" / "tools-audit.json").write_text(
    json.dumps({"nativas": nativas, "embebidas": embebidas}, indent=2, ensure_ascii=False), encoding="utf-8")
print("\nescrito data/guerrilla/tools-audit.json")
