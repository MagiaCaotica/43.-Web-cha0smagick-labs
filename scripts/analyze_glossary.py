"""Analyze glossary QAPage schema and content structure."""
import json, re, os

path = r'D:\Paginas web\Cha0smagick Labs\43.-Web-cha0smagick-labs\glossary.html'
with open(path, 'r', encoding='utf-8') as fh:
    c = fh.read()

# Find and analyze all JSON-LD blocks
for m in re.finditer(r'<script type="application/ld\+json">(.*?)</script>', c, re.DOTALL):
    try:
        data = json.loads(m.group(1).strip())
        t = data.get('@type', '???')
        
        if t == 'QAPage':
            entities = data.get('mainEntity', [])
            print(f'QAPage: {len(entities)} questions')
            q_words = []
            for e in entities:
                q = e.get('name', '')
                a = e.get('acceptedAnswer', {}).get('text', '')
                q_words.append(len(q.split()))
                # Check if questions start with typical voice-search patterns
                if q.lower().startswith('what is') or q.lower().startswith('what are') or q.lower().startswith('how'):
                    pass
                else:
                    pass  # all seem to be "What is X?" format
            print(f'  Avg question length: {sum(q_words)/len(q_words):.1f} words')
            print(f'  Min: {min(q_words)}, Max: {max(q_words)}')
            
        elif t == 'CollectionPage':
            print(f'CollectionPage: name={data.get("name")}')
            print(f'  Keys: {list(data.keys())}')
            
    except Exception as e:
        print(f'Error: {e}')
