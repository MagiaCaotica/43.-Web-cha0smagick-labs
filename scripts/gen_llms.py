# -*- coding: utf-8 -*-
"""Genera llms.txt y llms-full.txt escaneando los ficheros HTML reales.

Uso: python scripts/gen_llms.py
Fuente de verdad: los propios .html del repo (title + meta description).
Excluye: auto-shorts, noindex (search/buscar/404/checklist-ventas), utilidades internas.
"""
import os, re, html as htmllib

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BRAND = ' | Cha0smagick Labs'
BRAND2 = ' — Cha0smagick Labs'

SKIP = {'search.html', 'buscar.html', '404.html', 'checklist-ventas.html',
        'affiliate-dashboard.html', 'affiliate-terms.html', 'flash-sale.html'}

def scan(rel_dir):
    out = []
    d = os.path.join(ROOT, rel_dir) if rel_dir else ROOT
    if not os.path.isdir(d):
        return out
    for fn in sorted(os.listdir(d)):
        if not fn.endswith('.html') or fn in SKIP:
            continue
        p = os.path.join(d, fn)
        h = open(p, encoding='utf-8', newline='').read()
        m_robots = re.search(r'<meta name="robots" content="([^"]*)"', h)
        if m_robots and 'noindex' in m_robots.group(1):
            continue
        m = re.search(r'<title>(.*?)</title>', h, re.S)
        title = htmllib.unescape(m.group(1)).strip() if m else fn
        title = title.replace(BRAND, '').replace(BRAND2, '').strip()
        m = re.search(r'<meta name="description" content="([^"]*)"', h)
        desc = htmllib.unescape(m.group(1)).strip() if m else ''
        url = 'https://cha0smagicklabs.com/' + (rel_dir + '/' + fn if rel_dir else fn)
        out.append((title, url, desc))
    return out

tools = scan('tools')
apps = scan('apps')
books = scan('books')
blog_en = [x for x in scan('blog') if not x[1].endswith('/index.html') and '/es-' not in x[1]]
blog_es = [x for x in scan('blog') if '/es-' in x[1]]
blog_idx = [x for x in scan('blog') if x[1].endswith('/index.html')]
compare = scan('compare')
es_pages = scan('es')
lead = scan('lead-magnet')
land = [x for x in scan('landing-pages') if 'affiliate' not in x[1] and 'flash-sale' not in x[1]]
root_pages = [x for x in scan('') if x[1].endswith(('index.html', 'glossary.html', 'best-occult-apps-android.html', 'birth-chart-app.html', 'astrology-app-reviews.html', 'privacy-policy.html', 'affiliate-disclosure.html'))]

def clean_tools(lst):
    # tools/index.html ya viene incluido en scan('tools')
    return lst

def section(name, items, with_desc=False):
    if not items:
        return []
    lines = ['## %s' % name, '']
    for t, u, d in items:
        lines.append('- [%s](%s)%s' % (t, u, (': ' + d) if with_desc and d else ''))
    lines.append('')
    return lines

def gen(with_desc):
    L = [
        '# Cha0smagick Labs — Occult Apps, Technomancy & Digital Esoteric Tools',
        '',
        '> Corporate Techno-Sorcery Solutions — since 2025. 12 premium occult apps for Android, 71 free online divination tools, 9 digital grimoires, and 850+ educational articles for witches, mages, and practitioners of all magical traditions. One-time payment, no subscriptions, no tracking.',
        '',
    ]
    L += section('Free Online Tools (%d)' % len(clean_tools(tools)), clean_tools(tools), with_desc)
    L += section('Premium Android Apps (%d)' % len(apps), apps, with_desc)
    L += section('PDF Books (%d)' % len(books), books, with_desc)
    L += section('Comparisons & Buying Guides', compare + es_pages, with_desc)
    L += section('Free Guides', lead, with_desc)
    L += section('Bundles & Offers', land, with_desc)
    L += section('Core Pages', root_pages + blog_idx, with_desc)
    L += section('Blog — English (%d articles)' % len(blog_en), blog_en, with_desc)
    L += section('Blog — Español (%d artículos)' % len(blog_es), blog_es, with_desc)
    return '\n'.join(L) + '\n'

open(os.path.join(ROOT, 'llms.txt'), 'w', encoding='utf-8', newline='\n').write(gen(False))
open(os.path.join(ROOT, 'llms-full.txt'), 'w', encoding='utf-8', newline='\n').write(gen(True))
print('llms.txt: %d lineas | llms-full.txt: %d lineas' % (
    len(open(os.path.join(ROOT, 'llms.txt'), encoding='utf-8').readlines()),
    len(open(os.path.join(ROOT, 'llms-full.txt'), encoding='utf-8').readlines())))
print('tools=%d apps=%d books=%d blog_en=%d blog_es=%d' % (len(tools), len(apps), len(books), len(blog_en), len(blog_es)))
