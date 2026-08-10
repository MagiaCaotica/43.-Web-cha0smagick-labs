"""Remove duplicate old-style <p> reference sections, keeping new <ul> ones."""
import re, os

root = r'D:\Paginas web\Cha0smagick Labs\43.-Web-cha0smagick-labs'
files = [
    'complete-magickal-servitors-guide.html',
    'moon-phase-generator-magic-guide.html',
    'sigil-creator-online-free-vs-premium.html',
    'sigil-engine-cryptographic-guide.html',
    'sigil-maker-ultimate-guide.html',
    'sigilscribe-art-science-writing-sigils.html',
    'viking-oracle-complete-guide.html',
]

for f in files:
    path = os.path.join(root, 'blog', f)
    with open(path, 'r', encoding='utf-8') as fh:
        content = fh.read()
    
    # Find the old <p>-based references section
    old = re.search(r'<h2>References</h2>\s*(?:<p>.*?</p>\s*)+', content, re.DOTALL)
    if old:
        # End at the next heading or share section
        rest = content[old.end():]
        end_m = re.search(r'(?:<div class="share-section|<h2[^>]*>|</article>)', rest)
        if end_m:
            end_pos = old.end() + end_m.start()
        else:
            end_pos = old.end()
        
        content = content[:old.start()] + content[end_pos:]
        print(f'FIXED: {f} (removed old <p> refs)')
    else:
        print(f'NO old <p> refs found in {f}')
    
    with open(path, 'w', encoding='utf-8') as fh:
        fh.write(content)

print('Done.')
