"""Fetch Play financial sales reports from GCS bucket pubsite_prod_rev_{SELLER_ID}."""
import json, os, sys, zipfile, io
from google.oauth2 import service_account
import google.auth.transport.requests

BASE = os.path.dirname(os.path.abspath(__file__))
CRED = os.path.join(BASE, "..", "playstore.json")
SELLER = "7188773232285214747"
MONTHS = ["202607", "202608", "202606"]

SCOPES = ["https://www.googleapis.com/auth/devstorage.read_only"]

def http_get(url, headers):
    import requests
    return requests.get(url, headers=headers, timeout=30)

def main():
    creds = service_account.Credentials.from_service_account_file(CRED, scopes=SCOPES)
    creds.refresh(google.auth.transport.requests.Request())
    token = creds.token
    h = {"Authorization": f"Bearer {token}"}
    for m in MONTHS:
        url = f"https://storage.googleapis.com/pubsite_prod_rev_{SELLER}/sales/salesreport_{m}.zip"
        r = http_get(url, h)
        ct = r.headers.get("content-type", "")
        if r.status_code == 200 and "zip" in ct:
            z = zipfile.ZipFile(io.BytesIO(r.content))
            print(f"=== {m}: ZIP OK, files={z.namelist()}")
            for name in z.namelist():
                if name.endswith(".csv"):
                    data = z.read(name).decode("utf-8", errors="replace")
                    print(f"--- cols: {data.splitlines()[0] if data.splitlines() else 'EMPTY'}")
                    print(f"    rows (sin header): {len(data.splitlines())-1}")
                    with open(os.path.join(BASE, "..", f"salesreport_{m}.csv"), "w", encoding="utf-8") as f:
                        f.write(data)
                    print(f"    salvado -> salesreport_{m}.csv")
        else:
            snippet = r.text[:200].replace("\n"," ")
            print(f"=== {m} -> HTTP {r.status_code} ct={ct}: {snippet}")

if __name__ == "__main__":
    main()