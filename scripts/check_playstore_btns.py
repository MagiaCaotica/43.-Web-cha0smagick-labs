"""Find Play Store URLs and CTA button patterns in app pages."""
import os, re

root = r'D:\Paginas web\Cha0smagick Labs\43.-Web-cha0smagick-labs'

# Check a few app pages for play store links
for app in ['chaos-sigil-generator', 'norse-rune-oracle', 'iching-oracle']:
    path = os.path.join(root, 'apps', app + '.html')
    with open(path, 'r', encoding='utf-8') as f:
        c = f.read()
    
    # Find all Play Store URLs
    urls = re.findall(r'https?://play\.google\.com[^\s"\'<>]+', c)
    print(f'=== {app}.html ===')
    print(f'Play Store URLs found: {len(urls)}')
    for u in urls[:3]:
        print(f'  {u}')
    
    # Find all google-play-btn spans
    btns = re.findall(r'<span[^>]*google-play-btn[^>]*>(.*?)</span>', c)
    print(f'google-play-btn spans: {len(btns)}')
    for b in btns:
        print(f'  Text: {b.strip()[:80]}')
    
    # Check for the surrounding structure (parent div, link, etc.)
    # Find the pattern: <span class="cta-button primary google-play-btn"...
    spans = list(re.finditer(r'<span[^>]*class="[^"]*google-play-btn[^"]*"[^>]*>.*?</span>', c))
    for s in spans[:1]:
        # What's before it?
        before = c[max(0, s.start()-200):s.start()]
        print(f'  Context before span: ...{before[-100:]}')
    print()
