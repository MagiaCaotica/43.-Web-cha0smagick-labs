#!/usr/bin/env python3
"""Audit article coverage per app and per book. Count articles that mention each product."""
import os, re

BLOG = r'D:\Paginas web\Cha0smagick Labs\43.-Web-cha0smagick-labs\blog'
ROOT = r'D:\Paginas web\Cha0smagick Labs\43.-Web-cha0smagick-labs'

# === PRODUCT DEFINITIONS ===
APPS = {
    'PSI GYM': {'id': 'psi-gym', 'keywords': ['psi gym', 'zener cards', 'zener', 'esp training', 'psi-gym', 'zenercards'], 'url': 'play.google.com/store/apps/details?id=com.cha0smagicklabs.zenercards', 'target': 20},
    'Arcana Goetia': {'id': 'arcana-goetia', 'keywords': ['arcana goetia', 'goetia', 'goetic', '72 spirits', 'lemegeton', 'sigilgeneratorfinal'], 'url': 'play.google.com/store/apps/details?id=com.cha0smagick.sigilgeneratorfinal', 'target': 20},
    'Norse Rune Oracle': {'id': 'norse-rune-oracle', 'keywords': ['norse rune oracle', 'norse rune', 'viking rune', 'elder futhark', 'norse_oracle'], 'url': 'play.google.com/store/apps/details?id=com.japps.norse_oracle', 'target': 20},
    'Lunar Phase Calc': {'id': 'lunar-phase-calculator', 'keywords': ['lunar phase calculator', 'lunar phase', 'moon phase', 'moon magic', 'lunarapp'], 'url': 'play.google.com/store/apps/details?id=com.lunarapp.app', 'target': 20},
    'I Ching Oracle': {'id': 'iching-oracle', 'keywords': ['i ching oracle', 'i ching', 'iching', 'book of changes', 'ichingoracle'], 'url': 'play.google.com/store/apps/details?id=com.app.ichingoracle', 'target': 20},
    'Chaos Sigil Gen': {'id': 'chaos-sigil-generator', 'keywords': ['chaos sigil generator', 'chaos sigil', 'sigil generator', 'sigil maker', 'goetiansealsgenerator'], 'url': 'play.google.com/store/apps/details?id=com.app.goetiansealsgeneratorapp', 'target': 20},
    'Rider Waite Tarot': {'id': 'unofficial-rider-waite-tarot', 'keywords': ['rider waite tarot', 'rider-waite tarot', 'tarot app', 'tarot reader', 'unofficialraiderwaite'], 'url': 'play.google.com/store/apps/details?id=com.cha0smagick.unofficialraiderwaite', 'target': 20},
    'Dream Machine': {'id': 'dream-machine', 'keywords': ['dream machine', 'lucid dreaming', 'lucid dream app', 'dream journal', 'dreammachine'], 'url': 'play.google.com/store/apps/details?id=com.cha0smagick.dreammachine', 'target': 20},
    'Astral Lab': {'id': 'astral-lab', 'keywords': ['astral lab', 'natal chart', 'astrology app', 'birth chart', 'astralchart'], 'url': 'play.google.com/store/apps/details?id=com.cha0smagicklabs.astralchart', 'target': 20},
    'Eerie Roads': {'id': 'eerieroads', 'keywords': ['eerie roads', 'eerieroads', 'chaos coordinates', 'gps manifestation', 'intention manifestation', 'synchronicity hunt'], 'url': 'play.google.com/store/apps/details?id=com.cha0smagicklabs.eerieroads', 'target': 20},
}

BOOKS = {
    'Magical Servitors Manual': {'id': 'manual-activacion-servidores-magicos-pdf', 'keywords': ['magical servitors', 'servitor manual', 'servitors manual', 'servidores magicos'], 'hotmart': 'pay.hotmart.com/D104270399P', 'target': 10},
    'Chaos Hunter Runes': {'id': 'tratado-runas-cazadoras-caos-pdf', 'keywords': ['chaos hunter runes', 'hunter runes', 'runas cazadoras', 'chaos hunter'], 'hotmart': 'pay.hotmart.com/F104270966V', 'target': 10},
    'Ouija Cazadora': {'id': 'ouija-cazadora-pdf', 'keywords': ['ouija cazadora', 'ouija board guide', 'ouija magic', 'ouijacazadora'], 'hotmart': 'pay.hotmart.com/B104271332D', 'target': 10},
    'Liber Lvpinux': {'id': 'liber-lvpinux-pdf', 'keywords': ['liber lvpinux', 'lvpinux', 'lycanthropy', 'lycanthropic'], 'hotmart': 'pay.hotmart.com/O104271155J', 'target': 10},
    'Codex Chaoticus': {'id': 'codex-chaoticus-pdf', 'keywords': ['codex chaoticus', 'codexchaoticus', 'complete treatise chaos magick'], 'hotmart': 'pay.hotmart.com/W106595764X', 'target': 10},
    'Tarot Chaos': {'id': 'tarot-chaos-pdf', 'keywords': ['tarot chaos', 'tarot chaos pdf', 'chaos magick tarot'], 'hotmart': 'pay.hotmart.com/J106598345U', 'target': 10},
    'Mind The Gap': {'id': 'mind-the-gap-pdf', 'keywords': ['mind the gap', 'response gap', 'mindthegap'], 'hotmart': 'pay.hotmart.com/V106730857R', 'target': 10},
}

files = sorted([f for f in os.listdir(BLOG) if f.endswith('.html') and f != 'index.html'])

print('='*120)
print('CONTENT COVERAGE AUDIT: Articles per App/Book')
print('='*120)

print('\n--- APPS (Target: 20+ articles each) ---')
print(f'{"App":25s} {"Articles":>10s} {"Target":>8s} {"Gap":>8s} {"Status":>10s}')
print('-'*65)

for app_name, app_data in APPS.items():
    count = 0
    matching = []
    for fname in files:
        path = os.path.join(BLOG, fname)
        with open(path, 'r', encoding='utf-8') as f:
            c = f.read().lower()
        for kw in app_data['keywords']:
            if kw.lower() in c:
                count += 1
                matching.append(fname.replace('.html', ''))
                break
    
    target = app_data['target']
    gap = max(0, target - count)
    status = 'OK' if count >= target else f'NEED {gap}'
    bar = '#' * min(count, target) + '.' * max(0, target - count)
    print(f'{app_name:25s} {count:10d} {target:8d} {gap:8d} {status:>10s}  [{bar}]')

print('\n--- BOOKS (Target: 10+ articles each) ---')
print(f'{"Book":30s} {"Articles":>10s} {"Target":>8s} {"Gap":>8s} {"Status":>10s}')
print('-'*70)

for book_name, book_data in BOOKS.items():
    count = 0
    matching = []
    for fname in files:
        path = os.path.join(BLOG, fname)
        with open(path, 'r', encoding='utf-8') as f:
            c = f.read().lower()
        for kw in book_data['keywords']:
            if kw.lower() in c:
                count += 1
                matching.append(fname.replace('.html', ''))
                break
    
    target = book_data['target']
    gap = max(0, target - count)
    status = 'OK' if count >= target else f'NEED {gap}'
    bar = '#' * min(count, target) + '.' * max(0, target - count)
    print(f'{book_name:30s} {count:10d} {target:8d} {gap:8d} {status:>10s}  [{bar}]')

print('\n' + '='*120)
print('GAP ANALYSIS COMPLETE')
print('='*120)
