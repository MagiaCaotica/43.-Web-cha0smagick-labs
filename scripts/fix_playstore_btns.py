"""
Batch 3 - Item 2: Fix google-play-btn span -> a for accessibility.
Converts <span> CTA buttons to real <a> links with Play Store URLs.
"""
import os, re

ROOT = r'D:\Paginas web\Cha0smagick Labs\43.-Web-cha0smagick-labs'

APP_PAGES = [
    'arcana-goetia.html',
    'dream-machine.html',
    'chaos-sigil-generator.html',
    'iching-oracle.html',
    'liber-lvpinux-pdf.html',
    'lunar-phase-calculator.html',
    'manual-activacion-servidores-magicos-pdf.html',
    'norse-rune-oracle.html',
    'ouija-cazadora-pdf.html',
    'tratado-runas-cazadoras-caos-pdf.html',
    'unofficial-rider-waite-tarot.html',
    'psi-gym.html',
]

def process_app(filename):
    path = os.path.join(ROOT, 'apps', filename)
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    original = content
    
    # Find first purchase URL in the page (Play Store or Hotmart)
    url_match = re.search(r'https://play\.google\.com/store/apps/details\?id=[\w.]+', content)
    if not url_match:
        url_match = re.search(r'https://pay\.hotmart\.com/[A-Z0-9]+\?checkoutMode=2', content)
    if not url_match:
        # Try Gumroad or any other purchase link
        url_match = re.search(r'https://[^\s"\'<>]*(?:gumroad|payhip|buy\.stripe)[^\s"\'<>]*', content, re.IGNORECASE)
    if not url_match:
        print(f'  ERROR: No purchase URL found in {filename}')
        return False
    store_url = url_match.group(0)
    
    # Replace all google-play-btn spans with anchor tags
    # Pattern: <span class="cta-button primary google-play-btn" ...>TEXT</span>
    # We need to preserve any inline style and other attributes
    pattern = r'<span([^>]*class="[^"]*google-play-btn[^"]*"[^>]*)>(.*?)</span>'
    replacement = fr'<a\1 href="{store_url}" target="_blank" rel="noopener">\2</a>'
    content = re.sub(pattern, replacement, content)
    
    if content != original:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'OK: {filename} (URL: {store_url})')
        return True
    else:
        print(f'NO CHANGE: {filename}')
        return False

def main():
    processed = 0
    for page in APP_PAGES:
        result = process_app(page)
        if result:
            processed += 1
    print(f'\nProcessed: {processed}/{len(APP_PAGES)}')

if __name__ == '__main__':
    main()
