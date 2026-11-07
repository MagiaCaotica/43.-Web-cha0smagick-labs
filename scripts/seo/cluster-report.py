#!/usr/bin/env python3
"""Estado del cluster de sigilos en Search Console.

Uso:
    python scripts/seo/cluster-report.py [dias]

Lee la service account de projects/playstore.json (la misma que usa
scripts/verify_play_catalog.mjs). Imprime, por URL del cluster, impresiones,
clics, CTR y posicion media para la ventana pedida (28 dias por defecto) y
para los 7 dias anteriores, de modo que se vea el movimiento semana a semana.
Tambien cuenta los enlaces internos que apuntan a cada URL.

No escribe nada: solo lee GSC y el repositorio.
"""
import json
import re
import sys
import urllib.parse
import urllib.request
from datetime import date, timedelta
from pathlib import Path

from google.oauth2 import service_account
from google.auth.transport.requests import Request

ROOT = Path(__file__).resolve().parents[2]
SITE = "https://cha0smagicklabs.com"
PROP = "sc-domain:cha0smagicklabs.com"

CLUSTER = [
    "/tools/sigil-generator.html",
    "/sigil-maker.html",
    "/blog/sigil-maker-ultimate-guide.html",
    "/blog/sigil-creator-online-free-vs-premium.html",
    "/blog/free-sigil-generator-vs-chaos-sigil-generator-app.html",
    "/blog/how-to-charge-sigil-correctly.html",
]
KEYWORDS = [
    "sigil maker", "sigil generator", "chaos magic sigil generator",
    "sigil creator", "sigil maker online", "online sigil maker",
]

days = int(sys.argv[1]) if len(sys.argv) > 1 else 28

info = json.load(open(ROOT / "projects" / "playstore.json", encoding="utf-8"))
creds = service_account.Credentials.from_service_account_info(
    info, scopes=["https://www.googleapis.com/auth/webmasters"])
creds.refresh(Request())
tok = creds.token


def query(dims, start, end, filters=None):
    body = {"startDate": start.isoformat(), "endDate": end.isoformat(),
            "dimensions": dims, "rowLimit": 25000}
    if filters:
        body["dimensionFilterGroups"] = [{"filters": filters}]
    url = ("https://www.googleapis.com/webmasters/v3/sites/"
           + urllib.parse.quote(PROP, safe="") + "/searchAnalytics/query")
    req = urllib.request.Request(
        url, data=json.dumps(body).encode(),
        headers={"Authorization": "Bearer " + tok, "Content-Type": "application/json"})
    return json.loads(urllib.request.urlopen(req, timeout=90).read()).get("rows", [])


def window(off):
    end = date.today() - timedelta(days=2) - timedelta(days=days * off)
    return end - timedelta(days=days - 1), end


def totals(start, end):
    rows = query([], start, end)
    r = rows[0] if rows else {}
    return {
        "impr": int(r.get("impressions", 0)),
        "clicks": int(r.get("clicks", 0)),
        "ctr": r.get("ctr", 0) * 100,
        "pos": r.get("position", 0),
    }


def internal_links(path):
    """Enlaces internos que apuntan a `path` desde cualquier HTML del repo."""
    target = path.lstrip("/")
    needle = re.compile(r'href="[^"]*' + re.escape(target) + r'"')
    n = 0
    for p in ROOT.rglob("*.html"):
        rel = p.relative_to(ROOT).as_posix()
        if rel.startswith(("projects/", "node_modules/")) or "auto-shorts" in rel:
            continue
        try:
            t = p.read_text(encoding="utf-8", errors="ignore")
        except OSError:
            continue
        n += len(needle.findall(t))
    return n


s_now, e_now = window(0)
s_prev, e_prev = window(1)
print(f"Cluster de sigilos | ventana {days}d: {s_now} -> {e_now} "
      f"(anterior {s_prev} -> {e_prev})")
print()

row_site_now = totals(s_now, e_now)
row_site_prev = totals(s_prev, e_prev)
print(f"Sitio entero: {row_site_now['impr']:,} impr / {row_site_now['clicks']} clics "
      f"/ CTR {row_site_now['ctr']:.2f}% / pos {row_site_now['pos']:.1f}")
print(f"  anterior : {row_site_prev['impr']:,} impr / {row_site_prev['clicks']} clics "
      f"/ CTR {row_site_prev['ctr']:.2f}% / pos {row_site_prev['pos']:.1f}")
print()

print(f"{'URL':52} {'impr':>6} {'clics':>6} {'CTR':>7} {'pos':>5} {'links':>6}  {'Δ clics':>8}")
for path in CLUSTER:
    rows = query(["page"], s_now, e_now, [
        {"dimension": "page", "operator": "equals", "expression": SITE + path}])
    prev = query(["page"], s_prev, e_prev, [
        {"dimension": "page", "operator": "equals", "expression": SITE + path}])
    r = rows[0] if rows else {}
    p0 = prev[0] if prev else {}
    clicks = int(r.get("clicks", 0))
    delta = clicks - int(p0.get("clicks", 0))
    print(f"{path:52} {int(r.get('impressions', 0)):>6} {clicks:>6} "
          f"{r.get('ctr', 0) * 100:>6.2f}% {r.get('position', 0):>5.1f} "
          f"{internal_links(path):>6}  {delta:>+8}")

print()
print("Consultas del cluster:")
qrows = query(["query"], s_now, e_now)
by_query = {r["keys"][0].lower(): r for r in qrows}
for kw in KEYWORDS:
    r = by_query.get(kw)
    if not r:
        print(f"  {kw:34} sin impresiones en la ventana")
        continue
    print(f"  {kw:34} {int(r['impressions']):>5} impr {int(r['clicks']):>3} clics "
          f"pos {r['position']:>5.1f}")
