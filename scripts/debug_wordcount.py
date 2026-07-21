#!/usr/bin/env python3
import re, os

d = r'D:\Paginas web\Cha0smagick Labs\43.-Web-cha0smagick-labs\blog'

# Test a few files with different approaches
tests = ['arcana-goetia-app-review.html', 'chaos-magick-beginners-complete-guide.html', 
         'what-is-gnosis-how-to-achieve.html', 'lucid-dreaming-guide.html',
         'intention-manifestation-guide-gps.html']

for fname in tests:
    path = os.path.join(d, fname)
    c = open(path, encoding='utf-8').read()
    
    # Approach 1: Words in <main> tag
    main_s = c.find('<main')
    main_e = c.find('</main>')
    if main_s > 0 and main_e > main_s:
        main_html = c[main_s:main_e]
        main_text = re.sub(r'<[^>]+>', ' ', main_html)
        main_text = re.sub(r'\s+', ' ', main_text).strip()
        main_words = len(main_text.split())
    else:
        main_words = 0
    
    # Approach 2: Words between H1 and </article>
    h1 = c.find('<h1>')
    art_e = c.find('</article>')
    if h1 > 0 and art_e > h1:
        body = c[h1:art_e]
        text = re.sub(r'<[^>]+>', ' ', body)
        text = re.sub(r'\s+', ' ', text).strip()
        h1_words = len(text.split())
    else:
        h1_words = 0
    
    # Approach 3: Just total HTML file size as proxy
    kb = len(c) / 1000
    
    print(f"{fname:55s} main={main_words:5d}w  h1-art={h1_words:5d}w  size={kb:5.1f}KB")
