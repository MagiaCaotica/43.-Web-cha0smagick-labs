import json, re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
funnels = json.load(open(ROOT/"data/tool-funnels.json",encoding="utf-8"))["tools"]

# map tool category to relevant pillar page
pillar_map = {
    "Astrología": "/astrology-apps-compared.html",
    "Sigilos": "/sigil-magic-complete-guide.html",
    "Magia del caos": "/chaos-magic-guide.html",
    "Tarot": "/sigil-magic-complete-guide.html",
    "Runas": "/chaos-magic-guide.html",
}

related_guides_html = '''
<section class="related-guides" style="max-width:900px;margin:2rem auto;padding:1.2rem;background:#0d0d0d;border:1px solid #222;border-radius:8px;">
  <h3 style="color:#3DDC84;margin-bottom:0.5rem;">Related guides</h3>
  <ul style="color:#ccc;line-height:1.8;margin:0;padding-left:1.2rem;">
    <li><a href="/chaos-magic-guide.html" style="color:#3DDC84;">Chaos Magic: Complete Beginner's Guide</a></li>
    <li><a href="/sigil-magic-complete-guide.html" style="color:#3DDC84;">Sigil Magic: Complete Guide</a></li>
    <li><a href="/astrology-apps-compared.html" style="color:#3DDC84;">Astrology Apps Compared</a></li>
  </ul>
</section>
'''

count = 0
for p in sorted((ROOT/"tools").glob("*.html")):
    t = p.read_text(encoding="utf-8")
    if "related-guides" in t:
        continue
    if "</main>" not in t:
        continue
    t = t.replace("</main>", related_guides_html + "\n</main>", 1)
    p.write_text(t, encoding="utf-8")
    count += 1

print(f"updated {count} tool pages")
