"""Find all glossary anchors and check the specific mismatches."""
import re, os
path = r'D:\Paginas web\Cha0smagick Labs\43.-Web-cha0smagick-labs\glossary.html'
with open(path, 'r', encoding='utf-8') as fh:
    c = fh.read()

anchors = re.findall(r'<details[^>]*id="([^"]+)"[^>]*>', c)
print(f'Total anchors: {len(anchors)}')
print('All anchors:')
for a in sorted(anchors):
    print(f'  {a}')

# Check the 2 mismatches
for q in ['What is an Aethyr in Enochian Magic?', 'What is Enochian Magic?']:
    name = q.replace('What is ', '').replace('What are ', '').rstrip('?').strip()
    for art in ['an ', 'a ', 'the ']:
        if name.lower().startswith(art):
            name = name[len(art):]
            break
    pred = re.sub(r'[^a-z0-9\s-]', '', name.lower()).strip().replace(' ', '-')
    print(f'\nQuestion: {q}')
    print(f'Name: {name}')
    print(f'Predicted anchor: {pred}')
    # Check if this or similar exists
    if pred in anchors:
        print(f'  DIRECT MATCH: {pred}')
    else:
        # Find closest matches
        words = set(pred.split('-'))
        matches = []
        for a in anchors:
            aw = set(a.split('-'))
            score = len(words & aw)
            if score > 0:
                matches.append((score, a))
        matches.sort(reverse=True)
        print(f'  Closest matches: {matches[:5]}')
