#!/usr/bin/env python3
"""
Analisis de huecos de cluster: donde hay demanda real y no hay contenido.

Cruz tres fuentes:
  1. lo que Google ya muestra con impresiones (la demanda medida)
  2. todos los articulos del blog (la oferta)
  3. las paginas comerciales (apps y libros: el dinero)

Salida: clusters donde la demanda existe y la cobertura no la sostiene, y
clusters que la sostienen pero no tienen pagina de entrada.
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
    "sigil": ["sigil", "chaos-sigil", "sigils"],
    "goetia": ["goetia", "goetic", "arcona-goetia", "arcana-goetia", "servitor", "egregore", "demon", "entity", "abraxas", "demonic"],
    "tarot": ["tarot", "rider-waite", "deck", "spread", "arcana", "lupa"],
    "runes": ["rune", "futhark", "elder-futhark", "runic", "norse"],
    "iching": ["iching", "i-ching", "hexagram"],
    "suenos": ["dream", "lucid", "astral", "sleep", "hypnagog"],
    "astrologia": ["astrolog", "zodiac", "moon", "sun", "planet", "horoscope", "natal", "ephemeris", "retrograde"],
    "paranormal": ["paranormal", "ghost", "sls", "evp", "ufo", "cryptozoolog", "haunt", "scam", "medium", "spirit"],
    "sigilo-psiquico": ["esp", "psi", "zener", "kinaesthetic", "psychokinesis", "auras", "chakra"],
    "magia-ritual": ["ritual", "banish", "cleans", "protection", "invocation", "spell", "candle", "incense", "pendulum", "smoke"],
    "libros": ["book", "books", "library", "reading", "grimoire", "manual", "treatise", "codex", "liber"],
    "apps": ["app", "apps", "android", "play", "download", "install", "review"],
}


def cluster_de(slug):
    s = slug.lower()
    for nombre, claves in CLUSTERS.items():
        if any(k in s for k in claves):
            return nombre
    return "otros"


def token():
    from google.oauth2 import service_account
    from google.auth.transport.requests import Request

    info = json.load(open(SA, encoding="utf-8"))
    creds = service_account.Credentials.from_service_account_info(info, scopes=["https://www.googleapis.com/auth/webmasters"])
    creds.refresh(Request())
    return creds.token


def main():
    tok = token()
    prop = next(s["siteUrl"] for s in json.loads(urllib.request.urlopen(
        urllib.request.Request("https://www.googleapis.com/webmasters/v3/sites",
                               headers={"Authorization": "Bearer " + tok})).read())["siteEntry"]
        if s["siteUrl"].startswith("sc-domain:cha0smagicklabs.com"))
    q = urllib.parse.quote(prop, safe="")
    end = date.today() - timedelta(days=2)
    start = end - timedelta(days=27)
    req = urllib.request.Request(
        f"https://www.googleapis.com/webmasters/v3/sites/{q}/searchAnalytics/query",
        data=json.dumps({"startDate": start.isoformat(), "endDate": end.isoformat(),
                         "dimensions": ["page"], "rowLimit": 1000}).encode(),
        headers={"Authorization": "Bearer " + tok, "Content-Type": "application/json"})
    rows = json.loads(urllib.request.urlopen(req, timeout=45).read()).get("rows", [])

    demanda = defaultdict(lambda: {"urls": 0, "impr": 0, "clics": 0})
    paginas_completa = []
    for r in rows:
        u = r["keys"][0]
        slug = u.replace(SITE, "").strip("/").split("/")[-1] or "(home)"
        c = cluster_de(slug)
        demanda[c]["urls"] += 1
        demanda[c]["impr"] += r.get("impressions", 0)
        demanda[c]["clics"] += r.get("clicks", 0)
        paginas_completa.append((u.replace(SITE, ""), r.get("impressions", 0), r.get("clicks", 0)))

    oferta = Counter()
    for p in (ROOT / "blog").glob("*.html"):
        if p.name == "index.html":
            continue
        oferta[cluster_de(p.stem)] += 1

    print("=== DEMANDA MEDIDA vs COBERTURA DE CONTENIDO (28 dias) ===")
    print(f"{'cluster':18} {'articulos':>10} {'con impr.':>10} {'impres.':>9} {'clics':>6} {'cobertura':>10}")
    filas = sorted(demanda.items(), key=lambda kv: -kv[1]["impr"])
    for c, d in filas:
        n = oferta.get(c, 0)
        cov = f"{100.0 * d['urls'] / n:.0f}%" if n else "n/d"
        print(f"{c:18} {n:>10} {d['urls']:>10} {d['impr']:>9} {d['clics']:>6} {cov:>10}")

    print("\n=== TOP 25 paginas por impresiones (donde funciona la demanda) ===")
    for u, i, c in sorted(paginas_completa, key=lambda x: -x[1])[:25]:
        print(f"   {i:>6} impr  {c:>3} clics  {u}")

    print("\n=== paginas comerciales (apps y libros) sin apoyo editorial ===")
    apps = [p.stem for p in (ROOT / "apps").glob("*.html") if p.stem != "index"]
    for a in apps:
        slug = a.replace(".html", "")
        # articulos que mencionan la app
        menciones = 0
        for p in (ROOT / "blog").glob("*.html"):
            if slug in p.read_text(encoding="utf-8", errors="ignore"):
                menciones += 1
        if menciones < 4:
            print(f"   apps/{slug}.html  -> {menciones} articulos que la mencionan")

    out = {
        "generated": date.today().isoformat(),
        "demanda": {k: dict(v) for k, v in demanda.items()},
        "oferta": dict(oferta),
        "top": [{"url": u, "impresiones": i, "clicks": c} for u, i, c in sorted(paginas_completa, key=lambda x: -x[1])[:60]],
    }
    p = ROOT / "data" / "guerrilla" / "cluster-gaps.json"
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(json.dumps(out, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"\nescrito {p}")


if __name__ == "__main__":
    main()
