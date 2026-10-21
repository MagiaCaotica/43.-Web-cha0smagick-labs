#!/usr/bin/env python3
"""
Cruza los datos de Search Console con el sitemap:
  - URLs que Google ya muestra pero NO declaramos (noindex, huerfanas o 404)
  - URLs del sitemap que no generan ni una impresion (candidatos a impulso)
  - paginas con muchas impresiones y pocos clics (CTR bajo: titulo/descripcion)

  python projects/scripts/gsc-gap.py
"""
import json
import os
import re
import urllib.parse
import urllib.request
from datetime import date, timedelta

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
SA = os.path.join(ROOT, "projects", "playstore.json")
SITE = "https://cha0smagicklabs.com"
SCOPE = "https://www.googleapis.com/auth/webmasters"


def token():
    from google.oauth2 import service_account
    from google.auth.transport.requests import Request

    info = json.load(open(SA, encoding="utf-8"))
    creds = service_account.Credentials.from_service_account_info(info, scopes=[SCOPE])
    creds.refresh(Request())
    return creds.token


def call(url, tok, body=None):
    h = {"Authorization": "Bearer " + tok}
    data = None
    if body is not None:
        data = json.dumps(body).encode()
        h["Content-Type"] = "application/json"
    req = urllib.request.Request(url, data=data, headers=h)
    with urllib.request.urlopen(req, timeout=45) as r:
        return json.loads(r.read())


def main():
    tok = token()
    prop = next(s["siteUrl"] for s in call("https://www.googleapis.com/webmasters/v3/sites", tok)["siteEntry"]
                if s["siteUrl"].startswith("sc-domain:cha0smagicklabs.com"))
    q = urllib.parse.quote(prop, safe="")
    end = date.today() - timedelta(days=2)
    start = end - timedelta(days=27)

    sm = set(re.findall(r"<loc>([^<]+)</loc>", open(os.path.join(ROOT, "sitemap.xml"), encoding="utf-8").read()))
    rows = call(
        f"https://www.googleapis.com/webmasters/v3/sites/{q}/searchAnalytics/query",
        tok,
        {"startDate": start.isoformat(), "endDate": end.isoformat(), "dimensions": ["page"], "rowLimit": 1000},
    ).get("rows", [])

    mostradas = {r["keys"][0] for r in rows}
    print(f"propiedad {prop} | {start} a {end}")
    print(f"urls del sitemap: {len(sm)} | urls que Google muestra: {len(mostradas)}")
    print(f"clics: {sum(r.get('clicks', 0) for r in rows)} | impresiones: {sum(r.get('impressions', 0) for r in rows)}")

    fuera = sorted(mostradas - sm)
    print(f"\n== URLs que Google muestra y NO estan en el sitemap: {len(fuera)} ==")
    for u in fuera[:20]:
        r = next((x for x in rows if x["keys"][0] == u), {})
        print(f"   {r.get('impressions', 0):>5} impr  {u.replace(SITE, '')}")

    sin = sorted(sm - mostradas)
    print(f"\n== URLs del sitemap SIN ni una impresion en 28 dias: {len(sin)} ==")
    print("   (candidatos a impulso: enlace interno mas fuerte, titulo mejor, o consolidar)")
    for u in sin[:15]:
        print(f"   {u.replace(SITE, '')}")

    ctr_bajo = sorted(
        [r for r in rows if r.get("impressions", 0) >= 30 and r.get("clicks", 0) / r["impressions"] < 0.05],
        key=lambda r: -r.get("impressions", 0),
    )
    print(f"\n== Con muchas impresiones y menos del 5% de clics: {len(ctr_bajo)} ==")
    for r in ctr_bajo[:12]:
        ctr = 100.0 * r.get("clicks", 0) / r["impressions"]
        print(f"   {r['impressions']:>5} impr  {ctr:>5.1f}% ctr  {r['keys'][0].replace(SITE, '')}")

    out = {
        "generated": date.today().isoformat(),
        "periodo": [start.isoformat(), end.isoformat()],
        "urlsEnSitemap": len(sm),
        "urlsQueGoogleMuestra": len(mostradas),
        "clics": sum(r.get("clicks", 0) for r in rows),
        "impresiones": sum(r.get("impressions", 0) for r in rows),
        "fueraDelSitemap": fuera,
        "sinImpresiones": sin,
        "ctrBajo": [{"url": r["keys"][0], "impressions": r.get("impressions", 0), "clicks": r.get("clicks", 0)} for r in ctr_bajo],
    }
    p = os.path.join(ROOT, "data", "guerrilla", "gsc-gap.json")
    os.makedirs(os.path.dirname(p), exist_ok=True)
    json.dump(out, open(p, "w", encoding="utf-8"), indent=2, ensure_ascii=False)
    print(f"\nescrito {p}")


if __name__ == "__main__":
    main()
