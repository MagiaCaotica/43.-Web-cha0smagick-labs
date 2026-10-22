#!/usr/bin/env python3
"""
AUDITORIA DE E-E-A-T, CALIDAD Y PROFUNDIDAD DE VALOR DE LAS HERRAMIENTAS.

Cuatro planos, medidos sobre las 58 herramientas nativas:

  VISUAL     el sistema de diseno se aplica? jerarquia, tarjetas, botones con
              la altura minima, foco visible, sin desbordamiento, movil
  PRACTICO   el usuario puede llevarse el resultado? hay acciones, lecturas
              guardadas, un camino a algo, ayuda de uso
  E-E-A-T    se dice quien hizo la herramienta, que mide, que NO mide, donde
              van los datos, cuando se reviso, y hay enlace al autor
  VALOR      el resultado entrega profundidad o es relleno? filas, bloques,
              pasos, preguntas y la especificidad del texto de cada una

  python projects/scripts/audit-tools-eeat.py
"""
import json
import re
from collections import Counter
from pathlib import Path

ROOT = Path(".").resolve()
CAT = json.loads((ROOT / "data" / "atomic-tools.json").read_text(encoding="utf-8"))
TOOLKIT = json.loads((ROOT / "data" / "toolkit.json").read_text(encoding="utf-8"))["tools"]
SLUGS = {v["slug"]: k for k, v in CAT["tools"].items()}

nativas = []
for p in sorted(list((ROOT / "tools").glob("*.html")) + list((ROOT / "es" / "tools").glob("*.html"))):
    if p.name == "index.html":
        continue
    s = p.read_text(encoding="utf-8", errors="ignore")
    if "<iframe" in s:
        continue
    nativas.append((p, s))

print("=" * 80)
print(f"AUDITORIA DE LAS {len(nativas)} HERRAMIENTAS NATIVAS")
print("=" * 80)

filas = []
for p, s in nativas:
    slug = p.stem
    texto = re.sub(r"(?is)<(script|style)[^>]*>.*?</\1>", " ", s)
    texto = re.sub(r"<[^>]+>", " ", texto)
    texto = re.sub(r"\s+", " ", texto).strip()
    es_motor = slug in SLUGS
    atomico = es_motor
    art = CAT["tools"].get(SLUGS.get(slug, ""), {})

    # ---------------- VISUAL ----------------
    visual = {
        "design_system": "toolkit.css" in s,
        "atomic_css": "atomic-tools.css" in s,
        "hero": bool(re.search(r'class="[^"]*(?:atomic-hero|hero)"', s)),
        "beneficios": bool(re.search(r'class="[^"]*(?:benefits|what-you-get)"', s, re.I)),
        "tarjetas": bool(re.search(r'class="[^"]*(?:atomic-card|faq-answer|compare-section|cta-box)"', s)),
        "botones": bool(re.search(r'class="[^"]*\b(?:btn|cta-button|play-store-btn|draw-btn|spread-btn|atomic-button)\b', s)),
        "viewport": bool(re.search(r'(?i)<meta[^>]+name=["\']viewport["\']', s)),
        "foco": "focus" in s,
        "reduced_motion": "prefers-reduced-motion" in s,
    }

    # ---------------- PRACTICO ----------------
    practico = {
        "acciones_resultado": "toolkit.js" in s,
        "siguiente_paso": slug in TOOLKIT,
        "guardar": "Guardar" in texto or "saved" in s,
        "ayuda": bool(re.search(r"(?i)(cómo usar|how to use|pasos|steps|método|method)", texto)),
        "esperativa": bool(re.search(r"(?i)(qué esperar|que esperar|what to expect|obtendrás|obtendras)", texto)),
        "seguridad": bool(re.search(r"(?i)(uso responsable|not.*(medical|psychological)|no sustituye|limites|límites)", texto)),
        "faq": len(re.findall(r"(?i)<details", s)) or bool(re.search(r"(?i)(preguntas frecuentes|faq)", texto)),
        "sin_cuenta": bool(re.search(r"(?i)(sin cuenta|no signup|offline|sin conexión|sin conexion)", texto)),
    }

    # ---------------- E-E-A-T ----------------
    eeat = {
        "autor": "frater-alek0s.html" in s,
        "politica_editorial": "editorial-policy" in s,
        "conflicto_intereses": "A disclosure" in s or "disclosure" in s,
        "revision": bool(re.search(r"(?i)(last reviewed|revisado|actualizado|updated|octubre|2026)", texto)),
        "metodo": bool(re.search(r"(?i)(método|method|protocolo|protocol|pasos|steps|segun|según)", texto)),
        "limites": bool(re.search(r"(?i)(no es|not a|limite|límite|no sustituye|no predice|no es una predicción|orientativ)", texto)),
        "datos_locales": bool(re.search(r"(?i)(este navegador|this browser|no se envía|no se envia|solo en tu|only on your|offline)", texto)),
    }

    # ---------------- VALOR (profundidad) ----------------
    filas_res = len(re.findall(r'class="atomic-result-grid"', s))
    bloques = len(re.findall(r'class="atomic-steps"', s))
    pasos = len(re.findall(r"(?i)<li", texto))
    valor = {
        "resultado_con_filas": filas_res > 0,
        "bloques_de_contenido": bloques,
        "items_totales": pasos,
        "preguntas": len(re.findall(r"(?i)<details", s)),
        "texto_heroe": len(re.search(r"(?is)<h1[^>]*>(.*?)</h1>", s).group(1)) if re.search(r"(?is)<h1[^>]*>", s) else 0,
        "tiene_fuente": bool(re.search(r"(?i)(fuente|source|referencia|seg\u00fan|segun)", texto)),
    }

    # especificidad: el texto de "que esperar" es generico o propio?
    generico = len(re.findall(r"(?i)(guía práctica para reflexionar|lectura simbólica|orientativ[oa] para reflexionar)", texto))
    valor["texto_generico"] = generico

    filas.append({
        "file": f"{p.parent.name}/{p.name}", "slug": slug, "motor": atomico,
        "visual": visual, "practico": practico, "eeat": eeat, "valor": valor,
        "palabras": len(texto.split()),
    })


def resumen(grupo, etiqueta):
    n = len(grupo)
    if not n:
        return
    print(f"\n=== {etiqueta} ({n}) ===")
    for plano in ["visual", "practico", "eeat"]:
        print(f"  {plano.upper()}")
        for k in grupo[0][plano]:
            c = sum(1 for f in grupo if f[plano][k])
            marca = "  " if c == n else " *"
            print(f"    {k:22} {c:>3}/{n}{marca}")


resumen([f for f in filas if f["motor"]], "MOTOR COMUN (40)")
resumen([f for f in filas if not f["motor"]], "PROPIAS (18)")

print("\n=== PROFUNDIDAD DE VALOR ===")
for grupo, etq in (([f for f in filas if f["motor"]], "motor"), ([f for f in filas if not f["motor"]], "propias")):
    filas_res = sum(1 for f in grupo if f["valor"]["resultado_con_filas"])
    generico = sum(1 for f in grupo if f["valor"]["texto_generico"] > 2)
    palabras = sorted(f["palabras"] for f in grupo)
    print(f"  {etq:8} con resultado en tabla: {filas_res}/{len(grupo)} | texto generico: {generico}/{len(grupo)} | palabras mediana: {palabras[len(palabras) // 2]} | rango {palabras[0]}-{palabras[-1]}")

print("\n=== LOS PEORES EN E-E-A-T (menos señales de las 5) ===")
def score(f):
    return sum(1 for v in f["eeat"].values() if v)
peores = sorted(filas, key=score)[:12]
for f in peores:
    faltan = [k for k, v in f["eeat"].items() if not v]
    print(f"   {f['file']:46} faltan: {', '.join(faltan)}")

print("\n=== LOS PEORES EN PRACTICO (menos de 4) ===")
def score2(f):
    return sum(1 for v in f["practico"].values() if v)
for f in sorted(filas, key=score2)[:12]:
    faltan = [k for k, v in f["practico"].items() if not v]
    print(f"   {f['file']:46} faltan: {', '.join(faltan)}")

out = {"generado": "", "herramientas": filas}
(ROOT / "data" / "guerrilla").mkdir(parents=True, exist_ok=True)
(ROOT / "data" / "guerrilla" / "tools-eeat-audit.json").write_text(
    json.dumps({"herramientas": filas}, indent=2, ensure_ascii=False), encoding="utf-8")
print("\nescrito data/guerrilla/tools-eeat-audit.json")
