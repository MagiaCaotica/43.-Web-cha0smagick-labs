# Detailed audit of references sections in blog articles
import re, os

root = r'D:\Paginas web\Cha0smagick Labs\43.-Web-cha0smagick-labs'
files = sorted(os.listdir(os.path.join(root, 'blog')))

for f in files:
    if not f.endswith('.html'): continue
    path = os.path.join(root, 'blog', f)
    with open(path, 'r', encoding='utf-8') as fh:
        content = fh.read()
    
    # Find references section heading
    m = re.search(r'(<h[23][^>]*>.*?(references|bibliography|further\s+reading|works\s+cited|sources).*?</h[23]>)', content, re.IGNORECASE | re.DOTALL)
    if m:
        heading = m.group(1)
        # Get content after heading until next heading or end
        end = re.search(r'(?=<h[23]|<section[^>]*?(?:id=|class=)[^>]*?(?:references|bibliography|further|footer)|</article|</main|</body)', content[m.end():], re.IGNORECASE)
        after = content[m.end():m.end()+(end.start() if end else 2000)]
        print(f'=== {f} ===')
        print(f'Heading: {heading.strip()[:200]}')
        # Check if it's a real reference list or just inline mentions
        if re.search(r'<li>|class="reference"', after):
            print(f'Has list (proper references section): {after.strip()[:500]}')
        else:
            print(f'NO list found, showing content: {after.strip()[:500]}')
        print()
