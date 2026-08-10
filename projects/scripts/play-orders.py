#!/usr/bin/env python3
"""
play-orders.py — Descarga órdenes de pago reales vía Android Publisher API v3
(orders.list) para cada paquete y agrega ventas por app/día.

Uso:
  python scripts/play-orders.py            # resumen por día por app
  python scripts/play-orders.py --full     # por orden individual
"""
import argparse, csv, json, os, sys
from datetime import datetime, timezone
from collections import defaultdict
from google.auth.transport.requests import Request
from google.oauth2 import service_account
import requests

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CRED_FILE = os.path.join(ROOT, "playstore.json")
PUB_API = "https://androidpublisher.googleapis.com/androidpublisher/v3"

PACKAGES = [
    "com.cha0smagicklabs.astralchart",
    "com.cha0smagicklabs.chaossigilgenerator",
    "com.cha0smagicklabs.dreammachine",
    "com.cha0smagicklabs.eerieroads",
    "com.cha0smagicklabs.goetia",
    "com.cha0smagicklabs.iching",
    "com.cha0smagicklabs.luciddreamer",
    "com.cha0smagicklabs.lunarphase",
    "com.cha0smagicklabs.noctemapp",
    "com.cha0smagicklabs.norseruneoracle",
    "com.cha0smagicklabs.riderwaitetarot",
    "com.cha0smagicklabs.unofficialriderwaitetarot",
    "com.cha0smagicklabs.zenercards",
]

def get_creds():
    if not os.path.exists(CRED_FILE):
        sys.exit(f"[ERROR] No existe {CRED_FILE}")
    creds = service_account.Credentials.from_service_account_file(
        CRED_FILE, scopes=["https://www.googleapis.com/auth/androidpublisher"])
    creds.refresh(Request())
    return creds

def fetch_orders(creds, pkg):
    """Paginación completa de orders.list."""
    orders = []
    token = None
    while True:
        params = {"maxResults": 100}
        if token:
            params["token"] = token
        r = requests.get(f"{PUB_API}/applications/{pkg}/orders",
                         params=params,
                         headers={"Authorization": f"Bearer {creds.token}"},
                         timeout=60)
        if r.status_code == 404:
            return None, None  # app no encontrada / sin acceso
        if r.status_code != 200:
            return None, r.text[:200]
        j = r.json()
        orders.extend(j.get("orders", []))
        token = j.get("token")
        if not token:
            break
    return orders, None

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--full", action="store_true")
    args = ap.parse_args()

    creds = get_creds()
    all_orders = []
    for pkg in PACKAGES:
        orders, err = fetch_orders(creds, pkg)
        if err:
            print(f"[ERR] {pkg}: {err}", file=sys.stderr)
            continue
        if orders is None:
            print(f"[SKIP] {pkg}: no encontrada/sin acceso", file=sys.stderr)
            continue
        print(f"[OK] {pkg}: {len(orders)} órdenes", file=sys.stderr)
        for o in orders:
            o["_pkg"] = pkg
            all_orders.append(o)

    print(f"\n[INFO] TOTAL órdenes: {len(all_orders)}", file=sys.stderr)

    if args.full:
        for o in all_orders:
            ts = o.get("purchaseTimeMillis")
            dt = datetime.fromtimestamp(int(ts)/1000, tz=timezone.utc).strftime("%Y-%m-%d") if ts else "?"
            print(f"{dt}  {o['_pkg']:48s} prod={o.get('productId','?'):20s} "
                  f"state={o.get('orderState' if 'orderState' in o else 'purchaseState','?')} "
                  f"id={o.get('orderId','?')[:24]}")
        return

    # Agregar por día por app
    agg = defaultdict(lambda: {"units": 0, "products": set()})
    for o in all_orders:
        ts = o.get("purchaseTimeMillis")
        if not ts:
            continue
        dt = datetime.fromtimestamp(int(ts)/1000, tz=timezone.utc).strftime("%Y-%m-%d")
        pkg = o["_pkg"]
        agg[(dt, pkg)]["units"] += 1
        agg[(dt, pkg)]["products"].add(o.get("productId", "?"))

    print("\n=== ÓRDENES POR DÍA Y APP ===")
    print(f"{'Fecha':<12} {'App':<48} {'Unid':>4} {'ProdIds'}")
    for (dt, pkg) in sorted(agg.keys()):
        u = agg[(dt, pkg)]["units"]
        prods = ",".join(sorted(agg[(dt, pkg)]["products"]))
        print(f"{dt:<12} {pkg:<48} {u:>4}  {prods}")

    by_day = defaultdict(lambda: {"units": 0})
    for (dt, _pkg) in agg.keys():
        by_day[dt]["units"] += agg[(dt, _pkg)]["units"]

    print("\n=== RESUMEN POR DÍA ===")
    for dt in sorted(by_day.keys()):
        print(f"{dt}: {by_day[dt]['units']} unidades")

    tot = sum(by_day[d]["units"] for d in by_day)
    print(f"\n=== TOTAL: {tot} unidades ===")

if __name__ == "__main__":
    main()
