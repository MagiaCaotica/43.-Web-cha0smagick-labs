"""Verify lazy-load Leaflet transformation."""
import os

root = r'D:\Paginas web\Cha0smagick Labs\43.-Web-cha0smagick-labs'

files = ['index.html', 'apps/chaos-sigil-generator.html', 'apps/psi-gym.html']
for f in files:
    path = os.path.join(root, f)
    with open(path, 'r', encoding='utf-8') as fh:
        c = fh.read()
    
    checks = {
        'Leaflet CSS removed': 'leaflet.css' not in c,
        'Leaflet JS removed': 'leaflet.js' not in c,
        'loadLeaflet() present': 'loadLeaflet' in c,
        'IntersectionObserver present': 'IntersectionObserver' in c,
        'initVisitorMap() present': 'function initVisitorMap' in c,
        'Visitor data preserved': 'var visitors' in c,
        'Map center preserved': 'center: [20, 0]' in c,
    }
    
    print(f'=== {f} ===')
    for check, ok in checks.items():
        print(f'  {"OK" if ok else "FAIL"}: {check}')
    print()
