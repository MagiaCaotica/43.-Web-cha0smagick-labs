import os, re, glob

root = r"D:\Paginas web\Cha0smagick Labs\43.-Web-cha0smagick-labs"

# Files of interest
files = [
    os.path.join(root, "scripts", "new_articles_e.py"),
    os.path.join(root, "scripts", "new_articles_f.py"),
    os.path.join(root, "scripts", "new_articles_g.py"),
    os.path.join(root, "new_articles_h.py"),
    os.path.join(root, "new_articles_i.py"),
    os.path.join(root, "new_articles_j.py"),
    os.path.join(root, "new_articles_k.py"),
]

# blog html files
blog_dir = os.path.join(root, "blog")
blog_slugs = set()
for f in os.listdir(blog_dir):
    if f.endswith(".html") and f != "index.html":
        blog_slugs.add(f[:-5])

print("Total blog html (excl index):", len(blog_slugs))

# Pattern: "slug": "value"  (also handle 'slug': 'value')
slug_re = re.compile(r"""["']slug["']\s*:\s*["']([^"']+)["']""", re.IGNORECASE)

for fp in files:
    if not os.path.exists(fp):
        print("MISSING:", os.path.basename(fp))
        continue
    with open(fp, encoding="utf-8", errors="replace") as fh:
        txt = fh.read()
    slugs = slug_re.findall(txt)
    print("=" * 60)
    print(os.path.basename(fp), "->", len(slugs), "slug matches")
    # dedupe
    uniq = list(dict.fromkeys(slugs))
    print("   unique:", len(uniq))
    for s in uniq[:5]:
        print("    -", s, ("[IN BLOG]" if s in blog_slugs else "[MISSING]"))
    if len(uniq) > 5:
        print("    ... (showing first 5 of", len(uniq), ")")
