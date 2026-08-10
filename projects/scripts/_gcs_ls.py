import json, os, requests
from google.oauth2 import service_account
import google.auth.transport.requests

CRED = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "playstore.json")
SCOPES = ['https://www.googleapis.com/auth/devstorage.read_only']
creds = service_account.Credentials.from_service_account_file(CRED, scopes=SCOPES)
creds.refresh(google.auth.transport.requests.Request())
h = {'Authorization': 'Bearer ' + creds.token}
B = 'pubsite_prod_7178773232285214747'
for prefix in ['', 'earnings/', 'stats/', 'stats/ratings/', 'reviews/']:
    url = 'https://storage.googleapis.com/storage/v1/b/{}/o?prefix={}&maxResults=5'.format(B, prefix)
    r = requests.get(url, headers=h, timeout=20)
    if r.status_code == 200:
        items = r.json().get('items', [])
        names = [i['name'] for i in items][:5]
        label = prefix if prefix else '(root)'
        print('[{}] 200 OK items={}: {}'.format(label, len(items), names))
    else:
        label = prefix if prefix else '(root)'
        print('[{}] {}: {}'.format(label, r.status_code, r.text[:150]))
