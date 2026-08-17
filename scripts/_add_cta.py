# -*- coding: utf-8 -*-
"""S6.1: inject cta-box + sticky-conversion-bar into the 2 tool pages missing them.

Extracts the byte-exact blocks from tools/sigil-generator.html (the reference
implementation), substitutes per-app copy + real Play URL, inserts before the
back-link div. Prints a diff summary. Idempotent: skips pages that already
contain class="cta-box".
"""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TOOLS = ROOT / "tools"
APPS = ROOT / "apps"
REFERENCE = TOOLS / "sigil-generator.html"

# (tool_page, app_page, h3_title, bridge_copy_inner_html, sticky_name, sticky_sub)
CONFIG = [
    {
        "tool": "tengwar-transcriber.html",
        "app": "norse-rune-oracle.html",
        "h3": "Explore Runes Anywhere, Anytime",
        "p_inner": "You've tried the free transcriber - <strong>now supercharge your practice</strong> with the Norse Rune Oracle Android app. Rune meanings, spreads, and offline reference everywhere you go.",
        "sticky_name": "Norse Rune Oracle Premium",
        "sticky_sub": "One-time - Offline - Daily draws",
    },
    {
        "tool": "activador-servidores.html",
        "app": "chaos-sigil-generator.html",
        "h3": "Activate Servitors Anywhere, Anytime",
        "p_inner": "You've tried the free activator - <strong>now supercharge your practice</strong> with the Chaos Sigil Generator Android app. Intent journaling, sigil library, ritual flash timer, and offline access everywhere you go.",
        "sticky_name": "Chaos Sigil Generator Premium",
        "sticky_sub": "One-time - Offline - Ritual timer",
    },
]

PLAY_RE = re.compile(r"https://play\.google\.com/store/apps/details\?id=[^\"'<>]+")
CTA_BLOCK_RE = re.compile(
    r"(?s)(<section class=\"cta-box\">.*?</section>\s*"
    r"<!-- FUNNEL: Sticky Conversion Bar -->\s*"
    r"<div class=\"sticky-conversion-bar\">.*?</div>)"
)
P_INNER_RE = re.compile(r"(?s)(<p>).*?(</p>)")
H3_RE = re.compile(r"(?s)(<h3>).*?(</h3>)")
BACKLINK_RE = re.compile(r"(?s)<div class=\"back-link\">", re.M)
STICKY_SUB_RE = re.compile(r"(?s)(<span class=\"sticky-text\">One-time ).*?(</span>)")


def extract_play_url(app_page: Path) -> str:
    text = app_page.read_text(encoding="latin-1")
    m = PLAY_RE.search(text)
    if not m:
        print(f"  !! NO Play URL found in {app_page.name}")
        return ""
    return m.group(0)


def main() -> int:
    ref = REFERENCE.read_text(encoding="latin-1")
    m = CTA_BLOCK_RE.search(ref)
    if not m:
        print("FATAL: could not extract cta-box block from reference page")
        return 1
    template = m.group(1)
    print(f"Template block extracted: {len(template)} chars")

    for cfg in CONFIG:
        tool_path = TOOLS / cfg["tool"]
        app_path = APPS / cfg["app"]
        html = tool_path.read_text(encoding="latin-1")
        if 'class="cta-box"' in html:
            # already injected; still fix sticky subtitle if stale
            html2 = STICKY_SUB_RE.sub(
                lambda mm: mm.group(1) + cfg["sticky_sub"] + mm.group(2),
                html, count=1,
            )
            if html2 != html:
                tool_path.write_text(html2, encoding="latin-1")
                print(f"FIXED sticky-sub {cfg['tool']}")
            else:
                print(f"OK {cfg['tool']}: cta-box present, sticky-sub already correct")
            continue
        if not BACKLINK_RE.search(html):
            print(f"FATAL {cfg['tool']}: back-link div not found")
            return 1

        play_url = extract_play_url(app_path)
        if not play_url:
            print(f"FATAL {cfg['tool']}: no Play URL for {cfg['app']}")
            return 1

        block = template
        # substitute h3 title
        block = H3_RE.sub(lambda mm: mm.group(1) + cfg["h3"] + mm.group(2), block, count=1)
        # substitute bridge copy inner html (keeps <strong> structure)
        block = P_INNER_RE.sub(
            lambda mm: mm.group(1) + cfg["p_inner"] + mm.group(2), block, count=1
        )
        # substitute Play URLs (both occurrences: cta button + sticky cta)
        block = PLAY_RE.sub(play_url, block)
        # substitute sticky subtitle (whole span content, robust to separator char)
        block = STICKY_SUB_RE.sub(
            lambda mm: mm.group(1) + cfg["sticky_sub"] + mm.group(2),
            block, count=1,
        )
        # substitute sticky app name
        block = block.replace("Chaos Sigil Generator Premium", cfg["sticky_name"])
        # price stays $3.99 for both apps

        html = BACKLINK_RE.sub(block + "\n\n<div class=\"back-link\">", html, count=1)
        tool_path.write_text(html, encoding="latin-1")
        print(f"INJECTED {cfg['tool']}: +{len(block)} chars, app={cfg['app']}, url={play_url}")

    # verification pass
    for cfg in CONFIG:
        html = (TOOLS / cfg["tool"]).read_text(encoding="latin-1")
        hits = html.count('class="cta-box"')
        sticky = html.count("sticky-conversion-bar")
        print(f"CHECK {cfg['tool']}: cta-box={hits}, sticky-bar={sticky}")
    return 0


if __name__ == "__main__":
    sys.exit(main())