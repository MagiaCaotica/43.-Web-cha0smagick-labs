#!/usr/bin/env python3
"""Check which articles contain specific product keywords."""
import os

d = r'D:\Paginas web\Cha0smagick Labs\43.-Web-cha0smagick-labs\blog'

checks = {
    'codex chaoticus': ['gnosis-chaos', 'sigil-magic', 'servitor-creation', 'egregore', 'chaos-magick-belief', 'pop-magick', 'technomancy', 'chaos-magick-history', 'neuroplasticity'],
    'tarot chaos': ['chaos-magick-tarot', 'tarot-as-gnosis', 'tarot-servitor-creation', 'chaos-tarot-spreads', 'tarot-paradigm'],
    'astral lab': ['natal-chart', 'planetary-transits', 'astrology-aspects', 'rising-sign', 'moon-sign'],
}

for product, prefixes in checks.items():
    print(f'\n--- {product.upper()} ---')
    for prefix in prefixes:
        found = False
        for f in os.listdir(d):
            if f.startswith(prefix) and f.endswith('.html'):
                c = open(os.path.join(d, f), encoding='utf-8').read()
                if product in c.lower():
                    print(f'  OK {f}')
                else:
                    print(f'  MISSING keyword in {f}')
                found = True
                break
        if not found:
            print(f'  NOT FOUND {prefix}')
