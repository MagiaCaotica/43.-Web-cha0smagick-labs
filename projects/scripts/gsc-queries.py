#!/usr/bin/env python3
"""
Las queries exactas que Google ya esta mostrando. Cada fila es una demanda
medida, con su pagina y sus clics: el contenido que falta no se inventa, se
deduce de lo que la gente ya busca y encuentra.

Salida:
  - las queries con impresiones y sin clics (contenido que falta)
  - las queries con muchas impresiones y CTR bajo (titulo/descripcion que no
    funcionan)
"""
import json
import urllib.parse
import urllib.request
from datetime import date, timedelta
from pathlib import Path

ROOT = Path(".").resolve()
SITE = "https://cha0smagicklabs.com"
SA = ROOT / "projects" / "playstore.json"


def token():
    from google.oauth2 import service_account
    from google.auth.transport.requests import Request

    info = json.load(open(SA, encoding="utf-8"))
    creds = service_account.Credentials.from_service_account_info(info, scopes=["https://www.googleapis.com/auth/webmasters"])
    creds.refresh(Request())
    return creds.token


def consulta(tok, prop, dims, extra=None):
    end = date.today() - timedelta(days=2)
    start = end - timedelta(days=27)
    body = {"startDate": start.isoformat(), "endDate": end.isoformat(), "dimensions": dims, "rowLimit": 25000}
    if extra:
        body.update(extra)
    q = urllib.parse.quote(prop, safe="")
    req = urllib.request.Request(
        f"https://www.googleapis.com/webmasters/v3/sites/{q}/searchAnalytics/query",
        data=json.dumps(body).encode(),
        headers={"Authorization": "Bearer " + tok, "Content-Type": "application/json"})
    return json.loads(urllib.request.urlopen(req, timeout=60).read()).get("rows", [])


def main():
    tok = token()
    prop = next(s["siteUrl"] for s in json.loads(urllib.request.urlopen(
        urllib.request.Request("https://www.googleapis.com/webmasters/v3/sites",
                               headers={"Authorization": "Bearer " + tok})).read())["siteEntry"]
        if s["siteUrl"].startswith("sc-domain:cha0smagicklabs.com"))

    print("=== TOP 40 QUERIES (demanda real, 28 dias) ===")
    rows = consulta(tok, prop, ["query"])
    for r in rows[:40]:
        print(f"   {r.get('impressions', 0):>6} impr  {r.get('clicks', 0):>3} clics  {r.get('keys', [''])[0]}")

    print("\n=== QUERIES CON MUCHAS IMPRESIONES Y CASI NINGUN CLIC (el hueco real) ===")
    huecos = [r for r in rows if r.get("impressions", 0) >= 8 and r.get("clicks", 0) / max(1, r["impressions"]) < 0.04]
    for r in sorted(huecos, key=lambda x: -x["impressions"])[:30]:
        print(f"   {r.get('impressions', 0):>6} impr  {r.get('clicks', 0):>3} clics  {r.get('keys', [''])[0]}")

    print("\n=== PAGINAS TOP: que queries traen (para reescribir titulo y contenido) ===")
    for target in ["/blog/astrology-apps-android-guide.html",
                   "/blog/chaos-magick-beginners-complete-guide.html",
                   "/blog/tarot-card-meaning-guide-essentials-beginners.html",
                   "/blog/moon-phases-meaning-8-phases-explained.html",
                   "/blog/sigil-creator-online-free-vs-premium.html",
                   "/blog/best-chaos-magick-books-essential-reading.html"]:
        sub = consulta(tok, prop, ["query"], {"dimensionFilterGroups": [{"filters": [{"dimension": "page", "operator": "equals", "expression": SITE + target}]}]})
        if not sub:
            print(f"\n   {target}: (sin datos)")
            continue
        tot_i = sum(r.get("impressions", 0) for r in sub)
        tot_c = sum(r.get("clicks", 0) for r in sub)
        print(f"\n   {target}  ({tot_i} impr, {tot_c} clics, {100.0 * tot_c / max(1, tot_i):.1f}% ctr)")
        for r in sorted(sub, key=lambda x: -x["impressions"])[:6]:
            print(f"      {r.get('impressions', 0):>5} impr {r.get('clicks', 0):>3} clics  {r.get('keys', [''])[0]}")

    out = {"queries": rows[:200], "huecos": huecos}
    p = ROOT / "data" / "guerrilla" / "gsc-queries.json"
    p.write_text(json.dumps(out, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"\nescrito {p}")


if __name__ == "__main__":
    main()
