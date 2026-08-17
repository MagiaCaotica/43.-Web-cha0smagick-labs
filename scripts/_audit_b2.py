import glob, re, os

# desc<=160 audit across all article files
files = sorted(glob.glob('scripts/article_*.py'), key=lambda x: int(re.search(r'\d+', x).group()))
bad = []
for f in files:
    src = open(f, encoding='utf-8').read()
    m = re.search(r"""['"]desc['"]\s*:\s*['"](.*?)['"]""", src, re.S)
    if m and len(m.group(1)) > 160:
        bad.append((f, len(m.group(1))))
print('total article files:', len(files))
print('desc>160 violations:', bad if bad else 'NONE')

# Zero-slop audit on B2 HTML: look for placeholder lorem/xxx/placeholder text
b2_slugs = ['what-actually-happens-in-an-evp-session','goetia-for-beginners-what-no-one-tells-you-first',
'is-it-dangerous-to-make-a-money-sigil','why-people-fear-the-death-card','am-i-haunted-or-is-it-pareidolia',
'astral-projection-safety-what-can-actually-go-wrong','ouija-vs-digital-spirit-box-fear-compared',
'can-you-get-stuck-out-of-body-the-truth','the-dark-moon-isnt-scary-a-witchs-perspective',
'sigil-backfire-myth-psychology-or-real']
slop = re.compile(r'lorem ipsum|XXX|PLACEHOLDER|\[insert|TODO|FIXME', re.I)
slop_hits = []
for s in b2_slugs:
    fp = os.path.join('blog', s + '.html')
    if os.path.exists(fp):
        html = open(fp, encoding='utf-8').read()
        if slop.search(html):
            slop_hits.append(s)
print('B2 slop hits:', slop_hits if slop_hits else 'NONE')

# Dead-link audit for B2: internal hrefs to /blog/... must exist as blog/<slug>.html
dead = []
for s in b2_slugs:
    fp = os.path.join('blog', s + '.html')
    html = open(fp, encoding='utf-8').read()
    for href in re.findall(r'href="(/[^"#]+)"', html):
        if '/blog/' in href:
            target = href.split('/blog/')[-1].rstrip('/')
            if not os.path.exists(os.path.join('blog', target)):
                dead.append((s, href))
print('B2 dead internal links:', dead if dead else 'NONE')

# Index and sitemap counts
idx = open('index.html', encoding='utf-8').read()
print('index.html contains B2 slug count:', sum(1 for s in b2_slugs if s in idx))
smap = open('sitemap.xml', encoding='utf-8').read()
print('sitemap total url count:', smap.count('<url>'))
