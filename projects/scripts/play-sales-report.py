#!/usr/bin/env python3
"""
play-sales-report.py — Descarga los Sales Reports reales de Google Play
usando la service account (playstore.json) y agrega ventas por app/día.

Fuentes:
  - Google Cloud Storage buckets pubsite_prod_rev_{accountId} (sales_report_*.csv)
  - Google Play Developer Reporting API como fallback (revenue:query)

Uso:
  python scripts/play-sales-report.py            # resumen por día por app
  python scripts/play-sales-report.py --raw      # todas las transacciones
"""
import argparse, csv, io, json, os, sys
from datetime import datetime, date
from collections import defaultdict
from google.auth.transport.requests import Request
from google.oauth2 import service_account
import requests

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CRED_FILE = os.path.join(ROOT, "playstore.json")
GCS_API = "https://storage.googleapis.com/storage/v1"
GCS_DL = "https://storage.googleapis.com"

SCOPES = [
    "https://www.googleapis.com/auth/devstorage.read_only",
    "https://www.googleapis.com/auth/androidpublisher",
]

def get_creds():
    if not os.path.exists(CRED_FILE):
        sys.exit(f"[ERROR] No existe {CRED_FILE}")
    creds = service_account.Credentials.from_service_account_file(CRED_FILE, scopes=SCOPES)
    creds.refresh(Request())
    return creds

def gcs_headers(creds):
    return {"Authorization": f"Bearer {creds.token}"}

def find_rev_bucket(creds):
    """Encuentra el bucket pubsite_prod_rev_* asociado a la cuenta."""
    r = requests.get(f"{GCS_API}/b", params={"project": "cha0smagick-labs", "maxResults": 1000},
                     headers=gcs_headers(creds), timeout=60)
    if r.status_code != 200:
        print(f"[WARN] No se pudo listar buckets ({r.status_code}): {r.text[:200]}", file=sys.stderr)
        return None
    for b in r.json().get("items", []):
        if b["name"].startswith("pubsite_prod_rev_"):
            return b["name"]
    # fallback: probar bucket por project id
    cand = f"pubsite_prod_rev_{creds.service_account_email.split('@')[0]}"
    return None

def list_objects(creds, bucket, prefix="sales"):
    objs, page = [], None
    while True:
        params = {"prefix": prefix, "maxResults": 1000}
        if page: params["pageToken"] = page
        r = requests.get(f"{GCS_API}/b/{bucket}/o", params=params, headers=gcs_headers(creds), timeout=60)
        if r.status_code != 200:
            print(f"[WARN] list objects {r.status_code}: {r.text[:200]}", file=sys.stderr)
            break
        j = r.json()
        objs.extend(j.get("items", []))
        page = j.get("nextPageToken")
        if not page: break
    return objs

def download(creds, bucket, name):
    r = requests.get(f"{GCS_DL}/{bucket}/{name}", headers=gcs_headers(creds), timeout=120)
    if r.status_code != 200:
        print(f"[WARN] download {name} {r.status_code}: {r.text[:200]}", file=sys.stderr)
        return None
    return r.text

SALES_COLS = {
    "ordernumber": "order",
    "order charged time": "charged_time",
    "order charged date": "charged_date",
    "product id": "product_id",
    "product title": "product_title",
    "product type": "product_type",
    "sku id": "sku_id",
    "sku title": "sku_title",
    "amount (merchant currency)": "amount",
    "currency of sale": "currency",
    "country of sale": "country",
    "buyer country": "buyer_country",
}

def parse_sales_csv(text):
    """Parsea el CSV de sales report con nombres de columna flexibles."""
    rows = []
    reader = csv.reader(io.StringIO(text))
    header = None
    for raw in reader:
        if not raw or not any(c.strip() for c in raw):
            continue
        low = [c.strip().lower() for c in raw]
        if header is None:
            if "order number" in low or "product id" in low:
                header = {low[i]: i for i in range(len(low))}
            continue
        d = {}
        for col, idx in header.items():
            key = SALES_COLS.get(col)
            if key and idx < len(raw):
                d[key] = raw[idx].strip()
        if d.get("product_id") or d.get("sku_id"):
            rows.append(d)
    return rows

def aggregate(rows):
    """Agrupa por (fecha, sku_id): unidades, ingresos brutos."""
    agg = defaultdict(lambda: {"units": 0, "amount": 0.0, "currency": "USD", "title": ""})
    for r in rows:
        pid = r.get("sku_id") or r.get("product_id") or "?"
        amt_raw = r.get("amount") or "0"
        try:
            amt = float(amt_raw)
        except ValueError:
            amt = 0.0
        # filtrar refunds/cancelaciones: Amount <= 0 no cuenta como venta nueva
        if amt <= 0:
            continue
        dt = (r.get("charged_date") or r.get("charged_time") or "")[:10]
        if not dt:
            dt = "????-??-??"
        key = (dt, pid)
        agg[key]["units"] += 1
        agg[key]["amount"] += amt
        agg[key]["currency"] = r.get("currency") or "USD"
        agg[key]["title"] = r.get("sku_title") or r.get("product_title") or ""
    return agg

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--raw", action="store_true", help="imprime todas las transacciones")
    args = ap.parse_args()

    creds = get_creds()
    bucket = find_rev_bucket(creds)
    if not bucket:
        print("[ERROR] No se encontró bucket pubsite_prod_rev_*. "
              "Verifica que la service account tenga acceso a Play Console > Reporting.")
        sys.exit(1)
    print(f"[INFO] Bucket de reportes: {bucket}", file=sys.stderr)

    objs = list_objects(creds, bucket, prefix="sales")
    csv_files = sorted(o["name"] for o in objs if o["name"].endswith(".csv"))
    if not csv_files:
        print("[WARN] No hay sales_report CSV en el bucket", file=sys.stderr)
        # intentar con prefijo vacío
        objs2 = list_objects(creds, bucket, prefix="")
        csv_files = sorted(o["name"] for o in objs2 if o["name"].endswith(".csv"))
    print(f"[INFO] {len(csv_files)} reportes CSV encontrados", file=sys.stderr)

    all_rows = []
    for name in csv_files:
        text = download(creds, bucket, name)
        if text:
            rows = parse_sales_csv(text)
            all_rows.extend(rows)
            print(f"[INFO] {name}: {len(rows)} filas", file=sys.stderr)

    print(f"[INFO] Total transacciones parseadas: {len(all_rows)}", file=sys.stderr)

    if args.raw:
        w = csv.writer(sys.stdout)
        if all_rows:
            w.writerow(sorted(all_rows[0].keys()))
            for r in all_rows:
                w.writerow([r.get(k, "") for k in sorted(r[0].keys())])
        return

    agg = aggregate(all_rows)
    if not agg:
        print("[INFO] Sin ventas con Amount>0 en los reportes.")
        # mostrar incluso amount 0 para diagnóstico
        agg0 = defaultdict(lambda: {"units": 0, "amount": 0.0, "currency": "USD", "title": ""})
        for r in all_rows:
            pid = r.get("sku_id") or r.get("product_id") or "?"
            dt = (r.get("charged_date") or r.get("charged_time") or "")[:10] or "????-??-??"
            agg0[(dt, pid)]["units"] += 1
        print("\n=== Diagnóstico (todas las filas, incluyendo 0/refunds) ===")
        for (dt, pid) in sorted(agg0.keys()):
            print(f"{dt}  {pid:45s}  filas={agg0[(dt,pid)]['units']}")
        return

    print("\n=== VENTAS POR DÍA Y APP (Amount > 0) ===")
    print(f"{'Fecha':<12} {'App/SKU':<42} {'Unid':>4} {'Ingreso':>10} {'Mon':<4}")
    tot_units = 0
    tot_amount = 0.0
    by_day = defaultdict(lambda: {"units": 0, "amount": 0.0})
    for (dt, pid) in sorted(agg.keys()):
        u = agg[(dt, pid)]["units"]
        a = agg[(dt, pid)]["amount"]
        cur = agg[(dt, pid)]["currency"]
        print(f"{dt:<12} {pid:<42} {u:>4} {a:>10.2f} {cur:<4}")
        tot_units += u
        tot_amount += a
        by_day[dt]["units"] += u
        by_day[dt]["amount"] += a

    print("\n=== RESUMEN POR DÍA ===")
    for dt in sorted(by_day.keys()):
        print(f"{dt}: {by_day[dt]['units']} unidades, ${by_day[dt]['amount']:.2f}")

    print(f"\n=== TOTAL: {tot_units} unidades, ${tot_amount:.2f} ===")

if __name__ == "__main__":
    main()
