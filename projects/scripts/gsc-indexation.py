#!/usr/bin/env python3
"""
MEDICION DE INDEXACION EN GOOGLE SEARCH CONSOLE.

Responde la pregunta que el repo no puede responder solo: quantas URLs ha
indexado Google de verdad, y cuales ve. Usa la service account del repo
(projects/playstore.json) con el ambito webmasters.

QUE NECESITA EL PROPIETARIO (una vez, gate G13):
  Search Console -> cha0smagicklabs.com -> Configuracion -> Usuarios y
  permisos -> Anadir usuario -> tipo "Grupo" -> email de la service account:
      cha0smagick-labs@cha0smagick-labs.iam.gserviceaccount.com
  Sin eso, la API responde 403 "User does not have sufficient permission".

  python projects/scripts/gsc-indexation.py
"""
import json
import os
import sys
import urllib.parse
import urllib.request
import urllib.error
from datetime import date, timedelta

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
SA = os.path.join(ROOT, "projects", "playstore.json")
PROP = "https://cha0smagicklabs.com/"
DOMAIN = "cha0smagicklabs.com"
SCOPE = "https://www.googleapis.com/auth/webmasters"


def token():
    from google.oauth2 import service_account
    from google.auth.transport.requests import Request

    info = json.load(open(SA, encoding="utf-8"))
    creds = service_account.Credentials.from_service_account_info(info, scopes=[SCOPE])
    creds.refresh(Request())
    return creds.token


def get(url, tok, body=None, headers=None):
    h = {"Authorization": "Bearer " + tok}
    if headers:
        h.update(headers)
    data = json.dumps(body).encode() if body is not None else None
    if data:
        h["Content-Type"] = "application/json"
    req = urllib.request.Request(url, data=data, headers=h)
    with urllib.request.urlopen(req, timeout=45) as r:
        return json.loads(r.read())


def main():
    try:
        tok = token()
    except Exception as e:
        print("No se pudo conseguir token:", str(e)[:200])
        sys.exit(2)

    print("=== SITIOS ===")
    sites = []
    try:
        sites = get("https://www.googleapis.com/webmasters/v3/sites", tok).get("siteEntry", [])
        for s in sites:
            print(f"  {s.get('siteUrl')}  |  {s.get('permissionLevel')}")
        if not sites:
            print("  (ninguno: la service account todavia no es usuario de ninguna propiedad)")
    except urllib.error.HTTPError as e:
        print("  error", e.code, e.read()[:200].decode(errors="replace"))
        return

    # La propiedad puede ser de dominio (sc-domain:...) o de prefijo de URL.
    # Se usa la que exista de verdad, si no la API responde 403.
    prop = None
    for s in sites:
        u = s.get("siteUrl", "")
        if u.startswith("sc-domain:") and DOMAIN in u:
            prop = u
            break
    if not prop:
        for s in sites:
            if s.get("siteUrl") == PROP:
                prop = PROP
                break
    if not prop:
        print("\n  No encuentro una propiedad de", DOMAIN, "-> no puedo seguir.")
        return
    print(f"\n  usando la propiedad: {prop}")
    qprop = urllib.parse.quote(prop, safe="")

    print("\n=== SITEMAPS (lo que Google ha indexado de cada uno) ===")
    url = f"https://www.googleapis.com/webmasters/v3/sites/{qprop}/sitemaps"
    try:
        for s in get(url, tok).get("sitemap", []):
            print(f"  {s.get('path')}")
            print(f"     enviadas={s.get('submitted')}  indexadas={s.get('indexed')}  errores={s.get('errors')}  ultimo={s.get('lastSubmitted')}")
    except urllib.error.HTTPError as e:
        print("  error", e.code, e.read()[:200].decode(errors="replace"))
        return

    print("\n=== ULTIMOS 28 DIAS (Search Analytics) ===")
    end = date.today() - timedelta(days=2)
    start = end - timedelta(days=27)
    body = {
        "startDate": start.isoformat(),
        "endDate": end.isoformat(),
        "dimensions": ["page"],
        "rowLimit": 1000,
    }
    try:
        d = get(
            f"https://www.googleapis.com/webmasters/v3/sites/{qprop}/searchAnalytics/query",
            tok,
            body,
        )
        rows = d.get("rows", [])
        clicks = sum(r.get("clicks", 0) for r in rows)
        impr = sum(r.get("impressions", 0) for r in rows)
        print(f"  URLs con impresiones: {len(rows)}  |  clics: {clicks}  |  impresiones: {impr}")
        print("  top 12 por impresiones:")
        for r in rows[:12]:
            print(f"    {r.get('impressions', 0):>6} impr  {r.get('clicks', 0):>3} clics  {r.get('keys', [''])[0].replace('https://cha0smagicklabs.com', '')}")
    except urllib.error.HTTPError as e:
        print("  error", e.code, e.read()[:200].decode(errors="replace"))


if __name__ == "__main__":
    main()
