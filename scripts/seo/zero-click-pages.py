#!/usr/bin/env python3
"""Lista las URLs del sitemap que no reciben ni un clic ni una impresion en N dias.

Uso:
    python scripts/seo/zero-click-pages.py [dias]
    python scripts/seo/zero-click-pages.py 90 --csv

No cambia nada: imprime (o escribe un CSV) la lista para decidir noindex o consolidacion.
Criterio: 0 clics y 0 impresiones en la ventana Y presencia en el sitemap.
"""
import csv
import json
import re
import sys
import urllib.parse
import urllib.request
from datetime import date, timedelta
from pathlib import Path

from google.auth.transport.requests import Request
from google.oauth2 import service_account

ROOT = Path(__file__).resolve().parents[2]
SITE = "https://cha0smagicklabs.com"
PROP = "sc-domain:cha0smagicklabs.com"

args = [a for a in sys.argv[1:] if not a.startswith("-")]
days = int(args[0]) if args and args[0].isdigit() else 90
write_csv = "--csv" in sys.argv

info = json.load(open(ROOT / "projects" / "playstore.json", encoding="utf-8"))
creds = service_account.Credentials.from_service_account_info(
    info, scopes=["https://www.googleapis.com/auth/webmasters"])
creds.refresh(Request())

end = date.today() - timedelta(days=1)
start = end - timedelta(days=days - 1)
url = ("https://www.googleapis.com/webmasters/v3/sites/"
       + urllib.parse.quote(PROP, safe="") + "/searchAnalytics/query")

rows = []
offset = 0
while True:
    body = {"startDate": start.isoformat(), "endDate": end.isoformat(),
            "dimensions": ["page"], "rowLimit": 25000, "startRow": offset}
    req = urllib.request.Request(url, data=json.dumps(body).encode(),
                                 headers={"Authorization": "Bearer " + creds.token,
                                          "Content-Type": "application/json"})
    chunk = json.load(urllib.request.urlopen(req, timeout=60)).get("rows", [])
    rows += chunk
    if len(chunk) < 25000:
        break
    offset += 25000

seen = {r["keys"][0].replace(SITE, ""): (r["clicks"], r["impressions"]) for r in rows}
sitemap = (ROOT / "sitemap.xml").read_text(encoding="utf-8", errors="replace")
urls = [u.replace(SITE, "") for u in re.findall(r"<loc>([^<]+)</loc>", sitemap)]

dead = [u for u in urls if seen.get(u, (0, 0)) == (0, 0)]

print(f"Ventana {start} -> {end}")
print(f"sitemap: {len(urls)} URLs | sin clic ni impresion: {len(dead)} ({len(dead) / max(len(urls), 1) * 100:.0f}%)")
for u in dead[:40]:
    print("  ", u)
if len(dead) > 40:
    print(f"   ... y {len(dead) - 40} mas")

if write_csv:
    out = ROOT / "projects" / "informe-2026" / "zero-click-pages.csv"
    out.parent.mkdir(parents=True, exist_ok=True)
    with open(out, "w", newline="", encoding="utf-8") as fh:
        w = csv.writer(fh)
        w.writerow(["url"])
        w.writerows([[u] for u in dead])
    print("csv:", out)
