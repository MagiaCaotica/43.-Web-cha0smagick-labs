#!/usr/bin/env python3
"""
Generate sitemap.xml for all pages.
"""

import glob
from pathlib import Path
from datetime import datetime

ROOT = Path(__file__).resolve().parent.parent
SITE = "https://cha0smagicklabs.com"
SITEMAP = ROOT / "sitemap.xml"

def get_lastmod(filepath):
    """Get last modified date for a file."""
    stat = filepath.stat()
    return datetime.fromtimestamp(stat.st_mtime).strftime('%Y-%m-%d')

def main():
    urls = []
    
    # Homepage
    urls.append({
        'loc': SITE + '/',
        'lastmod': get_lastmod(ROOT / 'index.html'),
        'changefreq': 'weekly',
        'priority': '1.0',
    })
    
    # Static pages
    static_pages = [
        ('/tools/', 'weekly', '0.8'),
        ('/blog/', 'daily', '0.9'),
        ('/glossary.html', 'monthly', '0.7'),
        ('/best-occult-apps-android.html', 'monthly', '0.8'),
        ('/privacy-policy.html', 'yearly', '0.5'),
        ('/terms.html', 'yearly', '0.5'),
    ]
    
    for path, freq, priority in static_pages:
        fp = ROOT / path.lstrip('/')
        if fp.exists():
            urls.append({
                'loc': SITE + path,
                'lastmod': get_lastmod(fp),
                'changefreq': freq,
                'priority': priority,
            })
    
    # App pages
    for f in sorted(ROOT.glob('apps/*.html')):
        urls.append({
            'loc': SITE + '/apps/' + f.name,
            'lastmod': get_lastmod(f),
            'changefreq': 'monthly',
            'priority': '0.9',
        })
    
    # Book pages
    for f in sorted(ROOT.glob('books/*.html')):
        urls.append({
            'loc': SITE + '/books/' + f.name,
            'lastmod': get_lastmod(f),
            'changefreq': 'monthly',
            'priority': '0.9',
        })
    
    # Blog pages
    for f in sorted(ROOT.glob('blog/*.html')):
        if f.name == 'index.html':
            continue
        urls.append({
            'loc': SITE + '/blog/' + f.name,
            'lastmod': get_lastmod(f),
            'changefreq': 'monthly',
            'priority': '0.8',
        })
    
    # Generate sitemap XML
    xml_lines = ['<?xml version="1.0" encoding="UTF-8"?>']
    xml_lines.append('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')
    
    for url in urls:
        xml_lines.append('  <url>')
        xml_lines.append(f'    <loc>{url["loc"]}</loc>')
        xml_lines.append(f'    <lastmod>{url["lastmod"]}</lastmod>')
        xml_lines.append(f'    <changefreq>{url["changefreq"]}</changefreq>')
        xml_lines.append(f'    <priority>{url["priority"]}</priority>')
        xml_lines.append('  </url>')
    
    xml_lines.append('</urlset>')
    
    SITEMAP.write_text('\n'.join(xml_lines), encoding='utf-8')
    print(f'Generated sitemap.xml with {len(urls)} URLs')

if __name__ == '__main__':
    main()