#!/usr/bin/env python3
"""
Foco en dos clusters con demanda alta y cobertura debida:
  astrologia  43 articulos, 826 impressions, 4 clics
  paranormal  34 articulos, 254 impressions, 3 clics

Para cada uno: que queries traen, que pagina rankea, en que posicion, y que
temas tienen articulo y cuales no. La posicion decide si el trabajo es de
contenido (posicion mala) o de autoridad (posicion buena y poca clic).
"""
import json
import re
import urllib.parse
import urllib.request
from collections import Counter, defaultdict
from datetime import date, timedelta
from pathlib import Path

ROOT = Path(".").resolve()
SITE = "https://cha0smagicklabs.com"
SA = ROOT / "projects" / "playstore.json"

CLUSTERS = {
    "astrologia": ["astrolog", "zodiac", "moon-phase", "lunar", "sun-sign", "planet",
                   "natal", "birth-chart", "horoscope", "ephemeris", "rising", "mercury",
                   "venus-sign", "mars-sign", "retrograde", "ascendant", "houses",
                   "transit", "conjunction", "opposition", "trine", "square", "aspect"],
    "paranormal": ["paranormal", "ghost", "haunt", "sls", "evp", "ufo", "cryptozoolog",
                   "scam", "false-teacher", "medium", "spirit-box", "emf", "investigation",
                   "poltergeist", "demon", "entity-lore", "occult-science", "skeptical"],
}


def token():
    from google.oauth2 import service_account
    from google.auth.transport.requests import Request

    info = json.load(open(SA, encoding="utf-8"))
    c = service_account.Credentials.from_service_account_info(info, scopes=["https://www.googleapis.com/auth/webmasters"])
    c.refresh(Request())
    return c.token


def consulta(tok, prop, dims, extra=None):
    end = date.today() - timedelta(days=2)
    start = end - timedelta(days=27)
    body = {"startDate": start.isoformat(), "endDate": end.isoformat(), "dimensions": dims, "rowLimit": 25000}
    if extra:
        body.update(extra)
    q = urllib.parse.quote(prop, safe="")
    req = urllib.request.Request(f"https://www.googleapis.com/webmasters/v3/sites/{q}/searchAnalytics/query",
                                 data=json.dumps(body).encode(),
                                 headers={"Authorization": "Bearer " + tok, "Content-Type": "application/json"})
    return json.loads(urllib.request.urlopen(req, timeout=60).read()).get("rows", [])


def cluster(s):
    s = s.lower()
    for nombre, claves in CLUSTERS.items():
        if any(k in s for k in claves):
            return nombre
    return None


def main():
    tok = token()
    prop = next(s["siteUrl"] for s in json.loads(urllib.request.urlopen(
        urllib.request.Request("https://www.googleapis.com/webmasters/v3/sites",
                               headers={"Authorization": "Bearer " + tok})).read())["siteEntry"]
        if s["siteUrl"].startswith("sc-domain:cha0smagicklabs.com"))

    q_rows = consulta(tok, prop, ["query"])
    p_rows = consulta(tok, prop, ["page"])

    for nombre in CLUSTERS:
        print(f"\n{'=' * 78}\nCLUSTER: {nombre.upper()}\n{'=' * 78}")
        qs = [r for r in q_rows if cluster(r["keys"][0])]
        qs.sort(key=lambda r: -r["impressions"])
        tot_i = sum(r["impressions"] for r in qs)
        tot_c = sum(r["clicks"] for r in qs)
        print(f"queries que caen aqui: {len(qs)} | {tot_i} impresiones | {tot_c} clics")
        print("\n-- queries (impr, clics, posicion) --")
        for r in qs[:28]:
            print(f"   {r['impressions']:>5} {r['clicks']:>3} pos {r.get('position', 0):>5.1f}  {r['keys'][0]}")

        ps = [r for r in p_rows if cluster(r["keys"][0])]
        ps.sort(key=lambda r: -r["impressions"])
        print("\n-- paginas del cluster (impr, clics, posicion) --")
        for r in ps[:16]:
            print(f"   {r['impressions']:>5} {r['clicks']:>3} pos {r.get('position', 0):>5.1f}  {r['keys'][0].replace(SITE, '')}")

        # cobertura: que articulos hay del cluster
        arts = [p for p in (ROOT / "blog").glob("*.html") if cluster(p.stem)]
        print(f"\n-- cobertura: {len(arts)} articulos del cluster --")
        for p in sorted(arts, key=lambda x: x.stem)[:40]:
            print(f"      {p.stem}")

    out = {
        "queries": q_rows,
        "pages": p_rows,
    }
    p = ROOT / "data" / "guerrilla" / "gsc-clusters-detalle.json"
    p.write_text(json.dumps(out, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"\nescrito {p}")


if __name__ == "__main__":
    main()
