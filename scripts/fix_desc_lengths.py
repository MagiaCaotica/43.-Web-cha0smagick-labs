# -*- coding: utf-8 -*-
"""Trim meta descriptions to <=160 chars in data files AND generated HTML.

Safe approach: key-anchored regex that only touches lines whose key is exactly
"desc", and preserves the trailing `",` tail verbatim (no line reconstruction,
no comma drop). Then patches each blog/{slug}.html <meta name="description">
with the identical trimmed value. Does NOT re-run build_10_articles.py.
"""
import ast
import html
import pathlib
import re
import sys

MAXLEN = 160
ROOT = pathlib.Path(__file__).resolve().parent.parent
DATA_FILES = [ROOT / "scripts" / "articles_a.py", ROOT / "scripts" / "articles_b.py"]
HTML_DIR = ROOT / "blog"

# key-anchored: only lines like  "desc": "..."
PAT = re.compile(r'^(\s*"desc": ")([^"]*?)(",?\s*)$', re.M)


def trim(s: str, maxlen: int = MAXLEN) -> str:
    s = s.strip()
    if len(s) <= maxlen:
        return s
    cut = s[:maxlen]
    cut = cut.rsplit(" ", 1)[0].rstrip(" ,-;:")
    if not cut:
        cut = s[:maxlen]
    return cut.rstrip() + "."


new_descs = {}  # slug -> trimmed value (raw text, not escaped)


def patch_data_file(path: pathlib.Path) -> int:
    src = path.read_text(encoding="utf-8")
    changed = 0

    def repl(m):
        nonlocal changed
        pre, val, tail = m.group(1), m.group(2), m.group(3)
        tv = trim(val)
        if tv != val:
            changed += 1
        return pre + tv + tail

    new_src = PAT.sub(repl, src)
    if new_src != src:
        path.write_text(new_src, encoding="utf-8")
    return changed


def collect_slug_desc() -> None:
    """ast.literal_eval each ARTICLES_* list, build slug->desc map."""
    for f in DATA_FILES:
        tree = ast.parse(f.read_text(encoding="utf-8"), filename=str(f))
        for node in tree.body:
            if isinstance(node, ast.Assign) and any(
                isinstance(t, ast.Name) and t.id.startswith("ARTICLES_") for t in node.targets
            ):
                data = ast.literal_eval(node.value)
                for a in data:
                    new_descs[a["slug"]] = a["desc"]


def patch_html() -> int:
    changed = 0
    for slug, desc in new_descs.items():
        f = HTML_DIR / f"{slug}.html"
        if not f.exists():
            print(f"  ! missing html: {f.name}")
            continue
        src = f.read_text(encoding="utf-8")
        esc = html.escape(desc, quote=True)
        # match the existing meta description tag
        pat = re.compile(r'(<meta name="description" content=")[^"]*(")')
        new_src, n = pat.subn(lambda m: m.group(1) + esc + m.group(2), src, count=1)
        if n:
            f.write_text(new_src, encoding="utf-8")
            changed += 1
    return changed


def verify() -> None:
    for f in DATA_FILES:
        ast.parse(f.read_text(encoding="utf-8"), filename=str(f))
    print("  ast.parse OK on both data files")
    for slug, desc in new_descs.items():
        flag = "OK " if len(desc) <= MAXLEN else "OVER"
        print(f"  {flag} {len(desc):3d} {slug}")


def main() -> None:
    print("Patching data files...")
    for f in DATA_FILES:
        n = patch_data_file(f)
        print(f"  {f.name}: {n} desc(s) changed")
    print("Collecting slug->desc...")
    collect_slug_desc()
    print("Patching HTML...")
    n = patch_html()
    print(f"  {n} html file(s) patched")
    print("Verifying...")
    verify()
    print("DONE")


if __name__ == "__main__":
    sys.exit(main())
