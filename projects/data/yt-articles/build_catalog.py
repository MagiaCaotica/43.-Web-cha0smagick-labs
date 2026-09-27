# -*- coding: utf-8 -*-
"""
build_catalog.py - extract the sellable catalog from js/apps-data.js into
catalog.json, and verify every referenced page file exists on disk.

Run:  python build_catalog.py
Out:  catalog.json
"""
import json
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", "..", ".."))
APPS_JS = os.path.join(ROOT, "js", "apps-data.js")


def _str(txt, key):
    """Extract a double-quoted JS string value for an unquoted key."""
    m = re.search(
        r'\b' + re.escape(key) + r'\s*:\s*"((?:[^"\\]|\\.)*)"',
        txt,
    )
    if not m:
        return ""
    v = m.group(1)
    v = v.replace('\\"', '"').replace("\\'", "'")
    v = v.replace("\\\\", "\\")
    return v.strip()


def _blocks(txt, start_marker):
    """Split the array body into per-entry chunks on top-level `id:` starts."""
    i = txt.find(start_marker)
    if i < 0:
        return []
    i = txt.find("[", i)
    depth = 0
    end = len(txt)
    for j in range(i, len(txt)):
        if txt[j] == "[":
            depth += 1
        elif txt[j] == "]":
            depth -= 1
            if depth == 0:
                end = j
                break
    body = txt[i:end]
    # entries begin at a line that is exactly 4 spaces then '{'
    parts = re.split(r"\n\s{4}\{\n", "\n" + body)
    out = []
    for p in parts[1:]:
        # cut at the matching close of this entry: next occurrence of "\n    }," or "\n    }"
        m = re.search(r"\n\s{4}\}\s*,?", p)
        if m:
            out.append(p[: m.start()])
        else:
            out.append(p)
    return out


def parse_price(price_str):
    """'$3.99 USD' or '$9.99 USD (60% off)' -> (3.99, '$3.99', '(60% off)')"""
    m = re.search(r"\$([0-9]+(?:\.[0-9]+)?)", price_str or "")
    amount = float(m.group(1)) if m else None
    off = ""
    m2 = re.search(r"\(([^)]*%[^)]*)\)", price_str or "")
    if m2:
        off = m2.group(1).strip()
    pretty = ("$%.2f" % amount) if amount is not None else ""
    return amount, pretty, off


def main():
    if not os.path.isfile(APPS_JS):
        print("FATAL: %s not found" % APPS_JS)
        return 1
    with open(APPS_JS, "r", encoding="utf-8") as f:
        txt = f.read()

    apps = []
    for b in _blocks(txt, "appsData"):
        aid = _str(b, "id")
        if not aid:
            continue
        price = _str(b, "price")
        amt, pretty, off = parse_price(price)
        apps.append({
            "id": aid,
            "kind": "app",
            "name": _str(b, "name"),
            "price": price,
            "amount": amt,
            "price_pretty": pretty,
            "price_off": off,
            "url": _str(b, "url"),
            "page": "apps/%s.html" % aid,
            "description": _str(b, "description"),
            "image": _str(b, "image"),
            "status": _str(b, "status"),
        })
    # seo is a nested object; pull title/desc separately per entry
    for idx, b in enumerate(_blocks(txt, "appsData")):
        m = re.search(r"\bseo\s*:\s*\{(.*?)\}", b, re.S)
        if m:
            inner = m.group(1)
            apps[idx]["seo_title"] = _str(inner, "title")
            apps[idx]["seo_description"] = _str(inner, "description")

    books = []
    for b in _blocks(txt, "booksData"):
        bid = _str(b, "id")
        if not bid:
            continue
        price = _str(b, "price")
        amt, pretty, off = parse_price(price)
        books.append({
            "id": bid,
            "kind": "book",
            "name": _str(b, "name"),
            "author": _str(b, "author"),
            "language": _str(b, "language"),
            "price": price,
            "amount": amt,
            "price_pretty": pretty,
            "price_off": off,
            "url": _str(b, "hotmartLink"),
            "page": "books/%s.html" % bid,
            "description": _str(b, "description"),
            "image": _str(b, "image"),
            "status": _str(b, "status"),
        })
    for idx, b in enumerate(_blocks(txt, "booksData")):
        m = re.search(r"\bseo\s*:\s*\{(.*?)\}", b, re.S)
        if m:
            inner = m.group(1)
            books[idx]["seo_title"] = _str(inner, "title")
            books[idx]["seo_description"] = _str(inner, "description")

    # ---- free web tools: enumerate tools/*.html
    tools_dir = os.path.join(ROOT, "tools")
    tools = []
    if os.path.isdir(tools_dir):
        for fn in sorted(os.listdir(tools_dir)):
            if not fn.endswith(".html"):
                continue
            if fn == "index.html":
                continue
            tools.append({
                "id": fn[:-5],
                "kind": "tool",
                "name": fn[:-5].replace("-", " ").title(),
                "page": "tools/%s" % fn,
                "url": "https://cha0smagicklabs.com/tools/%s" % fn,
            })

    # ---- verify every referenced page exists
    missing = []
    for coll in (apps, books):
        for it in coll:
            fp = os.path.join(ROOT, it["page"].replace("/", os.sep))
            it["page_exists"] = os.path.isfile(fp)
            if not it["page_exists"]:
                missing.append(it["page"])
    for it in tools:
        fp = os.path.join(ROOT, it["page"].replace("/", os.sep))
        it["page_exists"] = os.path.isfile(fp)
        if not it["page_exists"]:
            missing.append(it["page"])

    cat = {
        "apps": apps,
        "books": books,
        "tools": tools,
        "all_ids": [it["id"] for it in apps + books + tools],
        "missing_pages": missing,
    }
    with open(os.path.join(HERE, "catalog.json"), "w", encoding="utf-8") as f:
        json.dump(cat, f, ensure_ascii=False, indent=1)

    print("apps  : %d  (pages ok: %d)" % (
        len(apps), sum(1 for a in apps if a["page_exists"])))
    print("books : %d  (pages ok: %d)" % (
        len(books), sum(1 for b in books if b["page_exists"])))
    print("tools : %d  (pages ok: %d)" % (
        len(tools), sum(1 for t in tools if t["page_exists"])))
    if missing:
        print("\nMISSING PAGE FILES (%d):" % len(missing))
        for m in missing:
            print("  - %s" % m)
        return 1
    print("\ncatalog.json written. ALL PAGES EXIST.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
