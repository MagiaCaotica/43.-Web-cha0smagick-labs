#!/usr/bin/env python3
"""Informe de PageSpeed Insights con dato de campo (CrUX) y laboratorio.

Uso:
    python scripts/seo/psi-report.py [mobile|desktop|both]

Lee PSI_API_KEY de .env. Guarda data/metrics-psi.json e imprime:
  - campo (CrUX, percentil 75): LCP, CLS, INP, FCP, TTFB y categoria
  - laboratorio (Lighthouse): rendimiento, LCP, CLS, TBT

El dato de campo es el que Google usa para ranking; si una URL no tiene
suficiente trafico, PSI devuelve `loadingExperience` vacio y solo hay lab.
"""
import json
import sys
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
URLS = [
    "/",
    "/tools/sigil-generator.html",
    "/blog/chaos-magick-beginners-complete-guide.html",
    "/apps/chaos-sigil-generator.html",
    "/books/tarot-chaos-pdf.html",
]


def env(key):
    for line in (ROOT / ".env").read_text(encoding="utf-8", errors="ignore").splitlines():
        if line.startswith(key + "="):
            return line.split("=", 1)[1].strip()
    raise SystemExit(f"falta {key} en .env")


KEY = env("PSI_API_KEY")
mode = sys.argv[1] if len(sys.argv) > 1 else "both"
strategies = ["mobile", "desktop"] if mode == "both" else [mode]

out = []
for path in URLS:
    url = "https://cha0smagicklabs.com" + path
    for strategy in strategies:
        query = urllib.parse.urlencode([
            ("url", url), ("strategy", strategy), ("key", KEY),
            ("category", "performance"), ("category", "accessibility"), ("category", "seo"),
        ])
        try:
            req = urllib.request.Request(
                "https://www.googleapis.com/pagespeedonline/v5/runPagespeed?" + query,
                headers={"User-Agent": "cha0smagick-cwv"})
            data = json.loads(urllib.request.urlopen(req, timeout=180).read())
        except Exception as exc:
            print(f"{path:48} {strategy:7} ERROR {type(exc).__name__} {str(exc)[:80]}")
            continue

        lh = data.get("lighthouseResult", {})
        audits = lh.get("audits", {})
        field = data.get("loadingExperience", {}).get("metrics", {})
        overall = data.get("loadingExperience", {}).get("overall_category")

        def f(name):
            m = field.get(name)
            return f"{m.get('percentile')} ({m.get('category')})" if m else "-"

        row = {
            "path": path,
            "strategy": strategy,
            "field_overall": overall,
            "field_lcp": f("LARGEST_CONTENTFUL_PAINT_MS"),
            "field_cls": f("CUMULATIVE_LAYOUT_SHIFT_SCORE"),
            "field_inp": f("INTERACTION_TO_NEXT_PAINT"),
            "lab_performance": round((lh.get("categories", {}).get("performance", {}).get("score") or 0) * 100),
            "lab_lcp_s": round((audits.get("largest-contentful-paint", {}).get("numericValue") or 0) / 1000, 2),
            "lab_cls": round(audits.get("cumulative-layout-shift", {}).get("numericValue") or 0, 3),
            "lab_tbt_ms": round(audits.get("total-blocking-time", {}).get("numericValue") or 0),
        }
        out.append(row)
        print(f"{path:48} {strategy:7} campo={overall or 'sin datos':12} "
              f"LCP={row['field_lcp']:14} INP={row['field_inp']:14} "
              f"lab={row['lab_performance']:>3} LCP={row['lab_lcp_s']}s")

(ROOT / "data" / "metrics-psi.json").write_text(json.dumps({
    "$comment": "PageSpeed Insights: loadingExperience es dato de campo (CrUX p75); lighthouseResult es laboratorio. Generado por scripts/seo/psi-report.py.",
    "captured_at": __import__("datetime").date.today().isoformat(),
    "results": out,
}, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print("\nescrito data/metrics-psi.json")
