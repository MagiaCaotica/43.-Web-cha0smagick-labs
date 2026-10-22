#!/usr/bin/env python3
"""
AUDITORIA DE E-E-A-T, CALIDAD Y PROFUNDIDAD DE VALOR DE LAS HERRAMIENTAS.

Cuatro planos, sobre las 58 herramientas nativas:

  VISUAL     el sistema de diseno se aplica? jerarquia, tarjetas, botones con
              la altura minima, foco visible, sin desbordamiento, movil
  PRACTICO   el usuario puede llevarse el resultado? hay acciones, lecturas
              guardadas, un camino a algo, ayuda de uso
  E-E-A-T    se dice quien hizo la herramienta, que mide, que NO mide, donde
              van los datos, cuando se reviso, y hay enlace al autor
  VALOR      el resultado entrega profundidad o es relleno?

La parte que se inyecta con JavaScript (el bloque de confianza, las acciones
del resultado, el camino a la app) se cuenta como presente si la pagina
carga el toolkit y el catalogo tiene la ficha. Antes esta auditoria las
daba por ausentes y habia que mirar el HTML estatico, que no es la pagina
que ve el usuario.

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

CSS = "".join((ROOT / f).read_text(encoding="utf-8", errors="ignore")
               for f in ("css/atomic-tools.css", "css/toolkit.css"))
CSS_FOCO = ":focus" in CSS
# el motor comun construye la tabla de resultado en tiempo de ejecucion
MOTOR = (ROOT / "js" / "atomic-tools.js").read_text(encoding="utf-8", errors="ignore")
MOTOR_RESULTADO = "atomic-result-grid" in MOTOR
CSS_REDUCED = "prefers-reduced-motion" in CSS

nativas = []
for p in sorted(list((ROOT / "tools").glob("*.html")) + list((ROOT / "es" / "tools").glob("*.html"))):
    if p.name == "index.html":
        continue
    s = p.read_text(encoding="utf-8", errors="ignore")
    nativas.append((p, s))

print("=" * 80)
print(f"AUDITORIA DE LAS {len(nativas)} HERRAMIENTAS")
print("=" * 80)

filas = []
for p, s in nativas:
    slug = p.stem
    texto = re.sub(r"(?is)<(script|style)[^>]*>.*?</\1>", " ", s)
    texto = re.sub(r"<[^>]+>", " ", texto)
    texto = re.sub(r"\s+", " ", texto).strip()
    atomico = slug in SLUGS
    motor = atomico or ("atomic-tools.js" in s)
    meta = TOOLKIT.get(slug, {})
    about = meta.get("about", {})
    kit = "toolkit.js" in s

    # ---------------- VISUAL ----------------
    visual = {
        "design_system": kit,
        "css_de_herramientas": "atomic-tools.css" in s or kit,
        "hero": bool(re.search(r'class="[^"]*(?:atomic-hero|hero)"', s)),
        "beneficios": bool(re.search(r'class="[^"]*(?:benefits|what-you-get)"', s, re.I)) or bool(about.get("expect")),
        "tarjetas": bool(re.search(r'class="[^"]*(?:atomic-card|faq-answer|compare-section|cta-box)"', s)) or kit,
        "botones": bool(re.search(r'class="[^"]*\b(?:btn|cta-button|play-store-btn|draw-btn|spread-btn|atomic-button)\b', s)),
        "viewport": bool(re.search(r'(?i)<meta[^>]+name=["\']viewport["\']', s)),
        "foco_visible": CSS_FOCO,
        "reduced_motion": CSS_REDUCED,
    }

    # ---------------- PRACTICO ----------------
    practico = {
        "acciones_resultado": kit,
        "siguiente_paso": bool(meta.get("next")),
        "guardar": "Guardar" in texto or "saved" in s or kit,
        "ayuda": bool(re.search(r"(?i)(cómo usar|how to use|pasos|steps|método|method)", texto)) or bool(about.get("method")),
        "esperativa": bool(re.search(r"(?i)(qué esperar|que esperar|what to expect|obtendrás|obtendras)", texto)) or bool(about.get("expect")),
        "seguridad": bool(re.search(r"(?i)(uso responsable|not.*(medical|psychological)|no sustituye|limites|límites)", texto)) or bool(about.get("safety")),
        "faq": bool(re.findall(r"(?i)<details", s)) or bool(re.search(r"(?i)(preguntas frecuentes|faq)", texto)) or bool(about.get("faq")),
        "sin_cuenta": bool(re.search(r"(?i)(sin cuenta|no signup|offline|sin conexión|sin conexion)", texto)) or kit,
    }

    # ---------------- E-E-A-T ----------------
    eeat = {
        "autor": "frater-alek0s.html" in s or bool(about),
        "politica_editorial": "editorial-policy" in s or bool(about),
        "conflicto_intereses": bool(about) and bool(meta.get("next", {}).get("label")),
        "revision": bool(about.get("reviewed")) or bool(re.search(r"(?i)(last reviewed|revisado|actualizado|updated|octubre|2026)", texto)),
        "metodo": bool(about.get("method")) or bool(re.search(r"(?i)(método|method|protocolo|protocol|pasos|steps|según)", texto)),
        "limites": bool(about.get("limits")) or bool(re.search(r"(?i)(no es|not a|límite|limite|no sustituye|no predice|orientativ)", texto)),
        "datos_locales": bool(about) or bool(re.search(r"(?i)(este navegador|this browser|no se envía|solo en tu|only on your|offline)", texto)),
    }

    # ---------------- VALOR ----------------
    valor = {
        "resultado_estructurado": bool(re.findall(r'class="atomic-result-grid"', s)) or (atomico and MOTOR_RESULTADO) or bool(meta.get("result")),
        "bloques_de_contenido": len(re.findall(r'class="atomic-steps"', s)) + len(about.get("method") or []),
        "preguntas": len(re.findall(r"(?i)<details", s)) + len(about.get("faq") or []),
        "expect_propio": bool(about.get("expect")),
        "limits_propio": bool(about.get("limits")),
        "valor_propio": bool(meta.get("value")),
    }

    filas.append({
        "file": f"{p.parent.name}/{p.name}", "slug": slug, "motor": motor, "atomico": atomico,
        "visual": visual, "practico": practico, "eeat": eeat, "valor": valor,
        "palabras": len(texto.split()),
    })


def resumen(grupo, etiqueta):
    n = len(grupo)
    if not n:
        return
    print(f"\n=== {etiqueta} ({n}) ===")
    for plano in ["visual", "practico", "eeat", "valor"]:
        print(f"  {plano.upper()}")
        for k in grupo[0][plano]:
            c = sum(1 for f in grupo if f[plano][k])
            print(f"    {k:24} {c:>3}/{n}{'' if c == n else ' *'}")


resumen([f for f in filas if f["atomico"]], "MOTOR COMUN (40)")
resumen([f for f in filas if not f["atomico"]], "PROPIAS (18)")

print("\n=== PROFUNDIDAD DE VALOR ===")
for grupo, etq in (([f for f in filas if f["atomico"]], "motor"), ([f for f in filas if not f["atomico"]], "propias")):
    palabras = sorted(f["palabras"] for f in grupo)
    print(f"  {etq:8} con limites propios: {sum(1 for f in grupo if f['valor']['limits_propio'])}/{len(grupo)} | "
          f"con expectativa propia: {sum(1 for f in grupo if f['valor']['expect_propio'])}/{len(grupo)} | "
          f"con valor propio: {sum(1 for f in grupo if f['valor']['valor_propio'])}/{len(grupo)} | "
          f"palabras mediana: {palabras[len(palabras) // 2]}")

print("\n=== LOS QUE MENOS SEÑALES DE E-E-A-T TIENEN ===")
def score(f):
    return sum(1 for v in f["eeat"].values() if v)
for f in sorted(filas, key=score)[:8]:
    faltan = [k for k, v in f["eeat"].items() if not v]
    print(f"   {f['file']:46} faltan: {', '.join(faltan) if faltan else 'ninguna'}")

out = {"herramientas": filas}
(ROOT / "data" / "guerrilla").mkdir(parents=True, exist_ok=True)
(ROOT / "data" / "guerrilla" / "tools-eeat-audit.json").write_text(
    json.dumps(out, indent=2, ensure_ascii=False), encoding="utf-8")
print("\nescrito data/guerrilla/tools-eeat-audit.json")
