"""Check PDF app pages for purchase URLs."""
import os, re
root = r'D:\Paginas web\Cha0smagick Labs\43.-Web-cha0smagick-labs'
for f in ['liber-lvpinux-pdf.html', 'manual-activacion-servidores-magicos-pdf.html', 'ouija-cazadora-pdf.html', 'tratado-runas-cazadoras-caos-pdf.html']:
    path = os.path.join(root, 'apps', f)
    with open(path, 'r', encoding='utf-8') as fh:
        c = fh.read()
    print(f'=== {f} ===')
    # Find all google-play-btn spans
    for m in re.finditer(r'<span[^>]*google-play-btn[^>]*>', c):
        before = c[max(0,m.start()-400):m.start()]
        # Find hrefs in the context
        hrefs = re.findall(r'href="([^"]+)"', before)
        print(f'  Nearby hrefs: {hrefs}')
    # Also check for any Hotmart, Gumroad, or purchase links
    for url in re.findall(r'https?://[^\s"\'<>]*(?:hotmart|gumroad|payhip|buy\.|purchase|checkout)[^\s"\'<>]*', c, re.IGNORECASE):
        print(f'  Purchase link: {url}')
    print()
