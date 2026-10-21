#!/usr/bin/env python3
"""
INSPECCION DE URLs EN SEARCH CONSOLE: por que Google no indexa cada pagina.

La API de busqueda no da el estado de indexacion por URL; la de inspeccion de
URLs si. Con los dos datos juntos (impresiones reales + veredicto de Google
pagina a pagina) se deja de hablar de "las 163" y se obtiene una lista accionable.

Requiere el gate G13 (service account como usuario de la propiedad).

  python projects/scripts/gsc-inspect.py [n_muestras]
"""
import json
import os
import random
import sys
import time
import urllib.parse
import urllib.request
import urllib.error
from datetime import date, timedelta

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
SA = os.path.join(ROOT, "projects", "playstore.json")
OUT = os.path.join(ROOT, "data", "guerrilla", "gsc-inspeccion.json")
SITE = "https://cha0smagicklabs.com"
SCOPE = "https://www.googleapis.com/auth/webmasters"
INSPECT = "https://searchconsole.googleapis.com/v1/urlInspection/index:inspect"


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


def propiedad(tok):
    for s in call("https://www.googleapis.com/webmasters/v3/sites", tok).get("siteEntry", []):
        if s.get("siteUrl", "").startswith("sc-domain:cha0smagicklabs.com"):
            return s["siteUrl"]
    raise SystemExit("la service account no tiene la propiedad de cha0smagicklabs.com")


def sitemap_urls():
    sm = open(os.path.join(ROOT, "sitemap.xml"), encoding="utf-8").read()
    return [m.group(1) for m in __import__("re").finditer(r"<loc>([^<]+)</loc>", sm)]


def urls_con_impresiones(tok, prop):
    end = date.today() - timedelta(days=2)
    start = end - timedelta(days=27)
    q = urllib.parse.quote(prop, safe="")
    d = call(
        f"https://www.googleapis.com/webmasters/v3/sites/{q}/searchAnalytics/query",
        tok,
        {
            "startDate": start.isoformat(),
            "endDate": end.isoformat(),
            "dimensions": ["page"],
            "rowLimit": 1000,
        },
    )
    return [(r["keys"][0], r.get("impressions", 0), r.get("clicks", 0)) for r in d.get("rows", [])]


def inspeccionar(tok, prop, url):
    try:
        d = call(INSPECT, tok, {"inspectionUrl": url, "siteUrl": prop, "languageCode": "en-US"})
        r = d.get("inspectionResult", {}).get("indexStatusResult", {})
        return {
            "url": url,
            "verdict": r.get("verdict"),
            "coverage": r.get("coverageState"),
            "indexing": r.get("indexingState"),
            "lastCrawl": r.get("lastCrawlTime"),
            "googleCanonical": r.get("googleCanonical"),
            "userCanonical": r.get("userCanonical"),
            "crawlError": r.get("crawlError"),
            "pageFetch": r.get("pageFetchState"),
        }
    except urllib.error.HTTPError as e:
        return {"url": url, "error": f"HTTP {e.code}", "detalle": e.read()[:200].decode(errors="replace")}
    except Exception as e:
        return {"url": url, "error": str(e)[:120]}


def main():
    n = int(sys.argv[1]) if len(sys.argv) > 1 else 150
    tok = token()
    prop = propiedad(tok)
    print(f"propiedad: {prop}")

    sm = sitemap_urls()
    impr = urls_con_impresiones(tok, prop)
    print(f"urls del sitemap: {len(sm)} | urls con impresiones (28 d): {len(impr)}")

    con_impr = [u for u, _, _ in impr]
    top = [u for u, _, _ in impr[:15]]          # las que mas impressionan
    muestra = random.sample(sm, min(n, len(sm)))
    # las que ya tienen impresiones: se inspeccionan solo las 15 mejores
    # (si una de esas NO esta indexada, el problema es de otro tipo)
    objetivo = list(dict.fromkeys(top + muestra))

    print(f"inspeccionando {len(objetivo)} urls...")
    res = []
    for i, u in enumerate(objetivo):
        r = inspeccionar(tok, prop, u)
        res.append(r)
        print(
            f"  [{i + 1:>3}/{len(objetivo)}] {r.get('verdict', 'ERR'):7} {str(r.get('indexing')):16} "
            f"{str(r.get('coverage'))[:58]:58} {u.replace(SITE, '')}",
            flush=True,
        )
        time.sleep(0.08)  # bajo el limite de 600/min

    # -------- informe --------
    from collections import Counter

    def resumen(lista, etiqueta):
        print(f"\n=== {etiqueta} ({len(lista)} urls) ===")
        print("  veredicto:")
        for k, v in Counter(r.get("verdict") for r in lista).most_common():
            print(f"    {str(k):10} {v}")
        print("  motivo (coverageState):")
        for k, v in Counter(r.get("coverage") for r in lista).most_common(12):
            print(f"    {v:4}  {k}")
        print("  estado de indexacion:")
        for k, v in Counter(r.get("indexing") for r in lista).most_common():
            print(f"    {str(k):22} {v}")

    idx = [r for r in res if r.get("indexing") == "INDEXED"]
    print(f"\nindexadas: {len(idx)}/{len(res)}  ({100.0 * len(idx) / max(1, len(res)):.1f}%)")
    resumen(res, "TODAS LAS INSPECCIONADAS")
    resumen([r for r in res if r["url"] in set(con_impr)], "LAS QUE YA TIENEN IMPRESIONES")
    resumen([r for r in res if r["url"] not in set(con_impr)], "LAS QUE NO TIENEN IMPRESIONES")

    print("\ncanonical de Google != canonical declarado (muestra de 8):")
    for r in res:
        g, u = r.get("googleCanonical"), r.get("userCanonical")
        if g and u and g.rstrip("/") != u.rstrip("/"):
            print(f"    {r['url'].replace(SITE, '')}\n       google: {g}\n       pagina: {u}")

    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(
            {
                "generated": date.today().isoformat(),
                "propiedad": prop,
                "urlsInspeccionadas": len(res),
                "indexadas": len(idx),
                "detalle": res,
            },
            f,
            indent=2,
            ensure_ascii=False,
        )
    print(f"\nescrito {OUT}")


if __name__ == "__main__":
    main()
