"""Fetch real orders/sales from Google Play via Android Publisher API v3 using REAL package IDs."""
import json, os, sys
from google.oauth2 import service_account
import google.auth.transport.requests
import requests

BASE = os.path.dirname(os.path.abspath(__file__))
CRED = os.path.join(BASE, "..", "playstore.json")

PKGS = [
    "com.cha0smagick.sigilgeneratorfinal",
    "com.app.goetiansealsgeneratorapp",
    "com.cha0smagick.dreammachine",
    "com.app.ichingoracle",
    "com.lunarapp.app",
    "com.japps.norse_oracle",
    "com.cha0smagick.unofficialraiderwaite",
    "com.cha0smagicklabs.astralchart",
    "com.cha0smagicklabs.eerieroads",
    "com.cha0smagicklabs.luciddreamer",
    "com.cha0smagicklabs.noctemapp",
    "com.cha0smagicklabs.zenercards",
]

SCOPES = ["https://www.googleapis.com/auth/androidpublisher"]

def main():
    creds = service_account.Credentials.from_service_account_file(CRED, scopes=SCOPES)
    creds.refresh(google.auth.transport.requests.Request())
    token = creds.token
    h = {"Authorization": f"Bearer {token}"}
    for pkg in PKGS:
        url = f"https://androidpublisher.googleapis.com/androidpublisher/v3/applications/{pkg}/orders"
        try:
            r = requests.get(url, headers=h, timeout=20)
            data = r.json() if r.headers.get("content-type", "").startswith("application/json") else r.text
            print(f"{pkg} -> HTTP {r.status_code}: {json.dumps(data)[:300]}")
        except Exception as e:
            print(f"{pkg} -> ERROR: {e}")

if __name__ == "__main__":
    main()
