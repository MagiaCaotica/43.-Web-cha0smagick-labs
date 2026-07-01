import re, os

root = r'D:\Paginas web\Cha0smagick Labs\43.-Web-cha0smagick-labs'
files = sorted(os.listdir(os.path.join(root, 'blog')))

has = []
no = []
for f in files:
    if not f.endswith('.html'): continue
    path = os.path.join(root, 'blog', f)
    with open(path, 'r', encoding='utf-8') as fh:
        content = fh.read()
    if re.search(r'<h2>References</h2>\s*<ul>', content):
        has.append(f)
    else:
        no.append(f)

print("=== HAVE References section ===")
for f in has:
    print(f)
print(f"\nTotal: {len(has)}")

print("\n=== MISSING References section ===")
for f in no:
    print(f)
print(f"\nTotal: {len(no)}")
