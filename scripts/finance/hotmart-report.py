#!/usr/bin/env python3
"""Informe de ventas de Hotmart desde la API oficial.

Uso:
    python scripts/finance/hotmart-report.py [YYYY-MM-DD] [YYYY-MM-DD]

Lee HOTMART_CLIENT_ID, HOTMART_CLIENT_SECRET y HOTMART_BASIC_TOKEN de .env.
El token se pide al host legacy (api-sec-vlc), que es el que responde; el de
developers.hotmart.com devuelve 403 de CloudFront desde esta red.

Ojo con los parametros: el endpoint usa `max_results`, no `results_per_page`.
Con `results_per_page` devuelve 400 invalid_parameter y parece que las fechas
estan mal. Las fechas van en milisegundos.
"""
import json
import subprocess
import sys
import tempfile
import time
from collections import Counter, defaultdict
from datetime import date, timedelta
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
TMP = Path(tempfile.gettempdir())


def env(key):
    for line in (ROOT / ".env").read_text(encoding="utf-8", errors="ignore").splitlines():
        if line.startswith(key + "="):
            return line.split("=", 1)[1].strip()
    raise SystemExit(f"falta {key} en .env")


def ms(day: str) -> int:
    return int(time.mktime(time.strptime(day, "%Y-%m-%d")) * 1000)


start = sys.argv[1] if len(sys.argv) > 1 else (date.today() - timedelta(days=365)).isoformat()
end = sys.argv[2] if len(sys.argv) > 2 else date.today().isoformat()

token_body = "grant_type=client_credentials&client_id=%s&client_secret=%s" % (
    env("HOTMART_CLIENT_ID"), env("HOTMART_CLIENT_SECRET"))
token = json.loads(subprocess.run(
    ["curl.exe", "-s", "--max-time", "60", "-X", "POST",
     "https://api-sec-vlc.hotmart.com/security/oauth/token",
     "-H", "Authorization: " + env("HOTMART_BASIC_TOKEN"),
     "-H", "Content-Type: application/x-www-form-urlencoded",
     "--data", token_body],
    capture_output=True, text=True).stdout)["access_token"]

cfg = TMP / "hotmart-curlrc.txt"
cfg.write_text('header = "Authorization: Bearer %s"\nheader = "Accept: application/json"\n'
               'user-agent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/124.0"\n' % token,
               encoding="ascii")

BASE = "https://developers.hotmart.com/payments/api/v1/sales/history"
items, page_token = [], ""
for _ in range(50):
    url = f"{BASE}?start_date={ms(start)}&end_date={ms(end)}&max_results=100"
    if page_token:
        url += "&page_token=" + page_token
    out = TMP / "hotmart-page.json"
    code = subprocess.run(["curl.exe", "-s", "--config", str(cfg), "--max-time", "90",
                           "-o", str(out), "-w", "%{http_code}", url],
                          capture_output=True, text=True).stdout.strip()
    if code != "200":
        raise SystemExit("Hotmart HTTP " + code + ": " + out.read_text(encoding="utf-8", errors="replace")[:200])
    page = json.loads(out.read_text(encoding="utf-8"))
    batch = page.get("items", [])
    items.extend(batch)
    page_token = page.get("page_info", {}).get("next_page_token") or ""
    if not page_token or not batch:
        break

by_month = defaultdict(lambda: defaultdict(float))
counts = Counter()
status = Counter()
products = Counter()
for it in items:
    purchase = it.get("purchase", {})
    month = time.strftime("%Y-%m", time.gmtime(purchase.get("order_date", 0) / 1000))
    currency = purchase.get("price", {}).get("currency_code", "?")
    price = float(purchase.get("price", {}).get("value", 0) or 0)
    fee = float(purchase.get("hotmart_fee", {}).get("total", 0) or 0)
    by_month[month][currency + "_gross"] += price
    by_month[month][currency + "_net"] += price - fee
    counts[month] += 1
    status[purchase.get("status")] += 1
    products[it.get("product", {}).get("name", "?")] += 1

print(f"Ventas {start} -> {end}: {len(items)}")
print("\nPor mes (bruto / neto por moneda):")
for month in sorted(by_month):
    values = ", ".join(f"{k}={v:.2f}" for k, v in sorted(by_month[month].items()))
    print(f"  {month}: {counts[month]} ventas | {values}")
print("\nEstados:", dict(status))
print("\nProductos:")
for name, n in products.most_common():
    print(f"  {n:>2}  {name}")

