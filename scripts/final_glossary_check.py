"""Final verification of glossary schemas."""
import json, re, os
path = r'D:\Paginas web\Cha0smagick Labs\43.-Web-cha0smagick-labs\glossary.html'
with open(path, 'r', encoding='utf-8') as fh:
    c = fh.read()

# Count schema types
types = {}
for m in re.finditer(r'<script type="application/ld\+json">(.*?)</script>', c, re.DOTALL):
    try:
        data = json.loads(m.group(1).strip())
        t = data.get('@type', '???')
        types[t] = types.get(t, 0) + 1
    except:
        types['INVALID_JSON'] = types.get('INVALID_JSON', 0) + 1

print('Schema blocks found:')
for t, count in types.items():
    print(f'  {t}: {count}')

# Verify some specific anchors
print('\nSpot checks:')
checks = {
    'Gnosis': 'gnosis',
    'Sigil': 'sigil', 
    'Servitor': 'servitor',
    'Egregore': 'egregore',
    'Aethyr': 'aethyr',
    'Enochian Magic': 'enochian',
    'Chaos Magick': 'chaos-magick',
    'Akashic Records': 'akashic-records',
}

for m in re.finditer(r'<script type="application/ld\+json">(.*?)</script>', c, re.DOTALL):
    try:
        data = json.loads(m.group(1).strip())
        if data.get('@type') == 'DefinedTermSet':
            terms = data.get('hasDefinedTerm', [])
            term_map = {t['name'].lower(): t['url'] for t in terms}
            for name, expected_anchor in checks.items():
                key = name.lower()
                if key in term_map:
                    url = term_map[key]
                    actual = url.split('#')[1]
                    status = 'OK' if actual == expected_anchor else 'WRONG'
                    if status == 'WRONG':
                        print(f'  {name}: expected #{expected_anchor}, got #{actual}')
                else:
                    print(f'  {name}: NOT FOUND')
            break
    except:
        pass

print('\nAll checks complete!')
