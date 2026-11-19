#!/usr/bin/env python3
"""Informe semanal de CRO: una tabla con lo que entra, lo que se pulsa y lo que se vende.

Uso:
    python scripts/cro-weekly.py [dias]     (28 por defecto)

Fuentes, todas de lectura:
  - Search Console  -> clics e impresiones organicas (service account de projects/playstore.json)
  - GA4 Data API    -> sesiones por canal y eventos del embudo (misma service account)
  - Hotmart API     -> ventas reales del periodo (HOTMART_CLIENT_ID/SECRET/BASIC_TOKEN en .env)

Si una fuente falla, imprime el motivo y sigue con las demas: un informe parcial
es util, un informe inventado no.
"""
import base64
import datetime
import json
import os
import sys
import urllib.parse
import urllib.request
from datetime import date, timedelta
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SITE = "https://cha0smagicklabs.com"
GSC_PROP = "sc-domain:cha0smagicklabs.com"
SA_FILE = ROOT / "projects" / "playstore.json"
FUNNEL = ["app_store_click", "purchase_click", "begin_checkout", "outbound_click",
          "popup_view", "popup_close", "tool_funnel_view", "affiliate_click"]

days = int(sys.argv[1]) if len(sys.argv) > 1 and sys.argv[1].isdigit() else 28
end = date.today() - timedelta(days=1)
start = end - timedelta(days=days - 1)
print(f"Ventana {start} -> {end} ({days} dias)")


def load_env():
    env = {}
    path = ROOT / ".env"
    if path.exists():
        for line in path.read_text(encoding="utf-8").splitlines():
            if "=" in line and not line.strip().startswith("#"):
                k, v = line.split("=", 1)
                env[k.strip()] = v.strip()
    env.update({k: v for k, v in os.environ.items() if k not in env})
    return env


def sa_token(scope):
    from google.oauth2 import service_account
    from google.auth.transport.requests import Request
    info = json.load(open(SA_FILE, encoding="utf-8"))
    creds = service_account.Credentials.from_service_account_info(info, scopes=[scope])
    creds.refresh(Request())
    return creds.token


def http_json(url, body=None, headers=None):
    data = json.dumps(body).encode() if body is not None else None
    req = urllib.request.Request(url, data=data, headers=headers or {})
    return json.load(urllib.request.urlopen(req, timeout=30))


# --- Search Console ---------------------------------------------------------
def gsc():
    token = sa_token("https://www.googleapis.com/auth/webmasters")
    body = {"startDate": start.isoformat(), "endDate": end.isoformat(),
            "dimensions": ["page"], "rowLimit": 5}
    url = ("https://www.googleapis.com/webmasters/v3/sites/"
           + urllib.parse.quote(GSC_PROP, safe="") + "/searchAnalytics/query")
    rows = http_json(url, body, {"Authorization": "Bearer " + token,
                                 "Content-Type": "application/json"}).get("rows", [])
    clicks = sum(r["clicks"] for r in rows)
    impr = sum(r["impressions"] for r in rows)
    print(f"\n[GSC] top5: {clicks:.0f} clics / {impr:.0f} impr")
    for r in rows:
        print(f"   {r['clicks']:>5.0f} clics  {r['position']:>5.1f} pos  {r['keys'][0].replace(SITE, '')}")


# --- GA4 --------------------------------------------------------------------
def ga4():
    prop = load_env().get("GA4_PROPERTY_ID")
    if not prop:
        print("\n[GA4] falta GA4_PROPERTY_ID en .env")
        return
    token = sa_token("https://www.googleapis.com/auth/analytics.readonly")
    base = f"https://analyticsdata.googleapis.com/v1beta/properties/{prop}:runReport"
    hdr = {"Authorization": "Bearer " + token, "Content-Type": "application/json"}
    win = [{"startDate": start.isoformat(), "endDate": end.isoformat()}]

    chan = http_json(base, {"dateRanges": win, "dimensions": [{"name": "sessionDefaultChannelGroup"}],
                            "metrics": [{"name": "sessions"}],
                            "orderBys": [{"metric": {"metricName": "sessions"}, "desc": True}]}, hdr)
    total = sum(int(r["metricValues"][0]["value"]) for r in chan.get("rows", []))
    print(f"\n[GA4] {total} sesiones")
    for r in chan.get("rows", [])[:5]:
        print(f"   {r['metricValues'][0]['value']:>5}  {r['dimensionValues'][0]['value']}")

    ev = http_json(base, {"dateRanges": win, "dimensions": [{"name": "eventName"}],
                          "metrics": [{"name": "eventCount"}], "limit": 200}, hdr)
    counts = {r["dimensionValues"][0]["value"]: int(r["metricValues"][0]["value"]) for r in ev.get("rows", [])}
    print("   embudo: " + " · ".join(f"{k}={counts.get(k, 0)}" for k in FUNNEL if counts.get(k)))
    if counts.get("purchase"):
        print(f"   purchase={counts['purchase']} (van por Measurement Protocol, no por el checkout de Hotmart)")


# --- Hotmart ----------------------------------------------------------------
def hotmart():
    env = load_env()
    cid, secret = env.get("HOTMART_CLIENT_ID"), env.get("HOTMART_CLIENT_SECRET")
    if not (cid and secret):
        print("\n[Hotmart] faltan HOTMART_CLIENT_ID / HOTMART_CLIENT_SECRET en .env")
        return
    basic = base64.b64encode(f"{cid}:{secret}".encode()).decode()
    req = urllib.request.Request(
        "https://api-sec-vlc.hotmart.com/security/oauth/token?grant_type=client_credentials",
        data=b"", headers={"Content-Type": "application/x-www-form-urlencoded",
                           "Authorization": "Basic " + basic})
    token = json.load(urllib.request.urlopen(req, timeout=30))["access_token"]

    ms = lambda d: int(datetime.datetime.combine(d, datetime.time()).timestamp() * 1000)
    url = (f"https://developers.hotmart.com/payments/api/v1/sales/history"
           f"?start_date={ms(start)}&end_date={ms(end)}&max_results=500")
    rows = http_json(url, None, {"Authorization": "Bearer " + token}).get("items", [])

    paid = [i for i in rows if (i.get("purchase") or {}).get("status") == "COMPLETE"]
    print(f"\n[Hotmart] {len(paid)} ventas completas en la ventana")
    for i in paid:
        p = i.get("purchase") or {}
        price = p.get("price") or {}
        print(f"   {datetime_date(p)}  {price.get('value')} {price.get('currency_code')}  "
              f"{(i.get('product') or {}).get('name', '')[:50]}")


def datetime_date(purchase):
    import datetime
    ts = purchase.get("order_date") or purchase.get("approved_date") or 0
    return datetime.datetime.fromtimestamp(ts / 1000).date().isoformat()


for source in (gsc, ga4, hotmart):
    try:
        source()
    except Exception as exc:  # una fuente caida no invalida el resto
        print(f"\n[{source.__name__}] error: {str(exc)[:160]}")
