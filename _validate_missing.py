import os, re, json

ROOT = r"D:\Paginas web\Cha0smagick Labs\43.-Web-cha0smagick-labs"
BLOG = os.path.join(ROOT, "blog")

# Collect slugs from the generator scripts
def collect_slugs(paths):
    slugs = {}
    for p in paths:
        fp = os.path.join(ROOT, p)
        if not os.path.exists(fp):
            print("MISSING FILE:", fp)
            continue
        txt = open(fp, encoding="utf-8", errors="replace").read()
        # both double and single quote slug keys
        matches = re.findall(r'["\']slug["\']\s*:\s*["\']([^"\']+)["\']', txt)
        # dedupe preserving order
        seen = set()
        uniq = []
        for s in matches:
            if s not in seen:
                seen.add(s)
                uniq.append(s)
        slugs[os.path.basename(p)] = uniq
    return slugs

paths = [
    "scripts/new_articles_e.py",
    "scripts/new_articles_f.py",
    "scripts/new_articles_g.py",
    "new_articles_h.py",
    "new_articles_i.py",
    "new_articles_j.py",
    "new_articles_k.py",
]

slugs = collect_slugs(paths)

# Existing blog filenames (basename without .html)
existing = set()
for f in os.listdir(BLOG):
    if f.endswith(".html") and f != "index.html":
        existing.add(f[:-5])

print("=== PER-FILE SLUG vs BLOG FILENAME VALIDATION ===")
total_missing = 0
for fname, slist in slugs.items():
    missing = []
    present = []
    for s in slist:
        # article output filename = slug + ".html"
        if s in existing:
            present.append(s)
        else:
            missing.append(s)
    print(f"\n[{fname}] slugs={len(slist)} present={len(present)} missing={len(missing)}")
    if missing:
        for m in missing:
            print("   MISSING:", m)
        total_missing += len(missing)

print("\n=== TOTAL MISSING ACROSS ALL SCRIPTS:", total_missing, "===")

# Also dump the full existing basename set to a file for cross-check
with open(os.path.join(ROOT, "_existing_blog_filenames.txt"), "w") as f:
    for name in sorted(existing):
        f.write(name + "\n")
print("Wrote _existing_blog_filenames.txt with", len(existing), "entries")
