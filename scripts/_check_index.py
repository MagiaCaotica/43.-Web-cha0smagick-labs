import re
h = open('index.html', encoding='utf-8').read()
links = re.findall(r'href="(/blog/[^"]+)"', h)
print('index blog link count:', len(links))
print('first 5:', links[:5])
print('last 5:', links[-5:])
