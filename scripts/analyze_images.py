"""
Analyze current image usage in blog articles and generator.
"""
import re, os, glob

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# 1. Extract image assignments from generator
src = open(os.path.join(ROOT, "scripts", "generate-articles.py"), "r", encoding="utf-8").read()
gen_images = re.findall(r"'image':\s*'([^']+)'", src)
print("=== Generator image assignments ===")
for img in sorted(set(gen_images)):
    count = gen_images.count(img)
    names = [a for a in re.findall(r"'slug':\s*'([^']+)',\s*\n\s*'title'", src)]
    print(f"  {img}: {count} article(s)")

# 2. Check what images are referenced in blog HTML files
print("\n=== Existing blog HTML image refs ===")
blog_dir = os.path.join(ROOT, "blog")
for fp in sorted(glob.glob(os.path.join(blog_dir, "*.html"))):
    h = open(fp, "r", encoding="utf-8").read()
    # Find OG image
    m = re.search(r'og:image.*?blog/(\w+)\.png', h)
    if m:
        img = m.group(1)
        # Check if the image file exists
        png_path = os.path.join(ROOT, "assets", "images", "blog", f"{img}.png")
        webp_path = os.path.join(ROOT, "assets", "images", "blog", f"{img}.webp")
        exists = os.path.exists(png_path) and os.path.exists(webp_path)
        status = "OK" if exists else "MISSING"
        print(f"  {os.path.basename(fp):55s} -> {img:35s} [{status}]")

# 3. Check which articles do NOT have a generator entry (manual articles)
print("\n=== Blog files not in generator ===")
gen_slugs = re.findall(r"'slug':\s*'([^']+)'", src)
for fp in sorted(glob.glob(os.path.join(blog_dir, "*.html"))):
    slug = os.path.splitext(os.path.basename(fp))[0]
    if slug == "index":
        continue
    if slug not in gen_slugs:
        h = open(fp, "r", encoding="utf-8").read()
        m = re.search(r'og:image.*?blog/(\w+)\.png', h)
        img = m.group(1) if m else "NO-IMAGE"
        print(f"  {slug:55s} -> {img}")
