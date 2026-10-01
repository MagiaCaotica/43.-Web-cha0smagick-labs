#!/usr/bin/env python
"""Build content/<n>.json from a compact draft file.

Usage:
    python _mk.py <n> <draft.json>

The draft supplies: h1, seo_title, description, keywords, lede, sections, faq,
and `related_seed` (list of lowercase keyword strings).  The 5 `related` pairs
are auto-picked from the slugs that already exist under blog/ by scoring those
slugs against the seed words, so every related target resolves on disk.
Titles are read from the target article's own <h1>.
"""

import json
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", "..", ".."))
BLOG = os.path.join(ROOT, "blog")

STOP = {
    "the", "a", "an", "of", "and", "to", "in", "for", "on", "how", "what", "why",
    "with", "is", "are", "your", "you", "it", "that", "this", "from", "at", "by",
    "can", "do", "does", "guide", "meaning", "meaningful", "diary", "journal",
    "ritual", "rituals", "work", "working", "works", "magic", "magick",
    "magical", "chaos", "sigils", "sigil", "spell", "spells", "beginner",
}


def slug_words(slug):
    return set(re.findall(r"[a-z0-9]+", slug.lower()))


def title_for(slug):
    path = os.path.join(BLOG, slug + ".html")
    if not os.path.exists(path):
        return None
    with open(path, encoding="utf-8") as fh:
        blob = fh.read()
    m = re.search(r"<h1[^>]*>(.*?)</h1>", blob, re.S)
    if m:
        t = re.sub(r"<[^>]+>", "", m.group(1)).strip()
        t = re.sub(r"\s+", " ", t)
    else:
        return None
    if len(t.split()) < 5:
        m = re.search(r"<title>(.*?)</title>", blob, re.S)
        if m:
            t = re.sub(r"\s*\|\s*Cha0smagick Labs\s*$", "", m.group(1)).strip()
    return t


def pick_related(n, self_slug, seeds):
    seed_words = set()
    for s in seeds:
        seed_words |= {w for w in re.findall(r"[a-z0-9]+", s.lower()) if w not in STOP and len(w) > 2}
    scored = []
    for name in os.listdir(BLOG):
        if not name.endswith(".html"):
            continue
        slug = name[:-5]
        if slug == self_slug:
            continue
        w = slug_words(slug)
        score = len(w & seed_words)
        if score:
            scored.append((score, slug))
    scored.sort(key=lambda t: (-t[0], t[1]))
    for thresh in (0.55, 0.70, 0.85, 1.01):
        out = []
        chosen = []
        for score, slug in scored:
            t = title_for(slug)
            if not t or len(t.split()) < 5:
                continue
            w = slug_words(slug)
            # keep the five targets from bunching into near-duplicates
            if any(len(w & c) / max(1, len(w | c)) > thresh for c in chosen):
                continue
            chosen.append(w)
            out.append([slug, t])
            if len(out) == 5:
                break
        if len(out) == 5:
            return out
    # last resort: top up from any remaining article with a usable title
    have = {s for s, _ in out}
    for name in sorted(os.listdir(BLOG)):
        if not name.endswith(".html"):
            continue
        slug = name[:-5]
        if slug == self_slug or slug in have:
            continue
        t = title_for(slug)
        if not t or len(t.split()) < 5:
            continue
        out.append([slug, t])
        have.add(slug)
        if len(out) == 5:
            break
    return out


def main():
    n = int(sys.argv[1])
    draft_path = sys.argv[2]
    with open(draft_path, encoding="utf-8") as fh:
        draft = json.load(fh)

    specs = json.load(open(os.path.join(HERE, "specs.json"), encoding="utf-8"))
    spec = next(s for s in specs if s["n"] == n)

    slug = spec["slug"]
    related = pick_related(n, slug, draft.get("related_seed", []))
    if len(related) != 5:
        raise SystemExit("could only pick %d related slugs for n=%d" % (len(related), n))

    rec = {
        "n": n,
        "slug": slug,
        "h1": draft.get("h1") or spec["h1"],
        "seo_title": draft.get("seo_title") or spec["seo_title"],
        "description": draft.get("description") or spec["description"],
        "keywords": draft.get("keywords") or spec["keywords"],
        "published": draft.get("published", "2026-09-27"),
        "published_human": draft.get("published_human", "September 27, 2026"),
        "lede": draft["lede"],
        "sections": draft["sections"],
        "faq": draft["faq"],
        "related": related,
    }

    dest = os.path.join(HERE, "content", "%d.json" % n)
    with open(dest, "w", encoding="utf-8") as fh:
        json.dump(rec, fh, ensure_ascii=False, indent=2)
        fh.write("\n")

    body_words = len(" ".join(
        p for s in rec["sections"] for p in s.get("p", [])
    ).split()) + len(rec["lede"].split())
    print("wrote %s" % dest)
    print("sections=%d body_words~%d" % (len(rec["sections"]), body_words))
    for slug_, title in related:
        print("  related: %s | %s" % (slug_, title[:60]))


if __name__ == "__main__":
    main()
