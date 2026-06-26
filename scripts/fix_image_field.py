import re, os
base = os.path.dirname(os.path.abspath(__file__))
target = os.path.join(base, 'generate-articles.py')
content = open(target, encoding='utf-8').read()
content = re.sub(r'    "image": "[a-z0-9_-]+",\n', '', content)
open(target, 'w', encoding='utf-8').write(content)
print('Done - removed all image fields from article data')
