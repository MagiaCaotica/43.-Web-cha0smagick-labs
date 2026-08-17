"""
Normalize article_61..72.py to the exact schema consumed by build_10_articles.py.

Groups auto-detected from the in-memory dict structure:
  Group A (A61-A63): sections have h2 with 'anchor'+'text'; a t=="faq" section holds FAQ items.
  Group B (A64-A69): sections are {'h','anchor','body'} (old schema, no 't'); toc/faq are dicts.
  Group C (A70-A72): sections are {'a','t','v'} minified.

Builder target schema:
  related   -> list of 2-lists [slug, title]
  references-> list of strings
  howto     -> list of dicts {name, text} (Group A conserves; B/C removed)
  toc       -> list of 2-lists [anchor, label]
  faq       -> list of (q, ans) tuples (optional)
  keywords  -> string
  sections  -> list of dicts {"t":...}: h2(id+text), h3(text), p(text), ul/ol(items), table(headers+rows)

Usage:
  python scripts/normalize_b1.py            # dry run (print per-file summary, no writes)
  python scripts/normalize_b1.py --write    # apply in place
"""
import sys
import os
import re
import pprint

SCRIPTS = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, SCRIPTS)

FILES = [f"article_{i}.py" for i in range(61, 73)]


def load_related_reverse():
    import related_titles as rt
    reverse = {}
    for slug, title in rt.RELATED_TITLES.items():
        reverse.setdefault(str(title), slug)
    return reverse


def var_and_header(source):
    """Return (var_name, header_lines) where header is the text before 'VAR = {'."""
    m = re.search(r"^(\w+)\s*=\s*\{", source, re.MULTILINE)
    if not m:
        raise RuntimeError("no top-level assignment dict found")
    var = m.group(1)
    header = source[: m.start()]
    return var, header


def detect_group(sections):
    s0 = sections[0]
    if "anchor" in s0 and "t" in s0:
        return "A"
    if "h" in s0 and "anchor" in s0 and "body" in s0:
        return "B"
    if "a" in s0 and "t" in s0 and "v" in s0:
        return "C"
    raise RuntimeError(f"cannot detect group from section keys: {sorted(s0.keys())}")


def fix_section_item(item):
    """Normalize a single body/section item dict to builder shape."""
    item = dict(item)
    t = item.get("t")
    if t in ("ul", "ol"):
        if "items" not in item and "v" in item:
            item["items"] = item.pop("v")
        item.pop("text", None)
        item.pop("v", None)
    elif t in ("h2", "h3", "p"):
        if "text" not in item and "v" in item:
            item["text"] = item.pop("v")
        item.pop("v", None)
    elif t == "table":
        # expects headers + rows already
        item.pop("v", None)
    elif t == "faq":
        # handled by caller; shouldn't reach here
        pass
    return item


def to_related_pairs(related, reverse):
    """Return list of 2-lists [slug, title]. Handles already-pairs or bare-title strings."""
    out = []
    for entry in related:
        if isinstance(entry, (list, tuple)) and len(entry) == 2:
            out.append([entry[0], entry[1]])
        else:
            title = entry
            slug = reverse.get(str(title), None)
            if slug is None:
                # fallback: slugify? better keep title only is not allowed; skip with warning
                print(f"    !! no reverse slug for related title: {title[:40]!r}")
                slug = title
            out.append([slug, title])
    return out


def to_reference_strings(references):
    """Return list of strings. Accepts 2-lists, dicts {title|name, url}, or strings."""
    out = []
    for r in references:
        if isinstance(r, dict):
            out.append(str(r.get("title") or r.get("name") or r.get("url") or ""))
        elif isinstance(r, (list, tuple)):
            out.append(str(r[0]) if r else "")
        else:
            out.append(str(r))
    return out


def normalize(art, reverse):
    art = dict(art)
    sections = art["sections"]
    group = detect_group(sections)

    new_sections = []
    faq = None

    if group == "A":
        for s in sections:
            s = dict(s)
            t = s.get("t")
            if t == "faq":
                faq = [tuple(item) for item in s.get("items", [])]
                continue
            if t == "h2":
                if "id" not in s and "anchor" in s:
                    s["id"] = s.pop("anchor")
            new_sections.append(fix_section_item(s))
        # related already pairs in A; references 2-lists -> strings; howto conserve
        art["related"] = to_related_pairs(art.get("related", []), reverse)
        art["references"] = to_reference_strings(art.get("references", []))
        # keywords already string in A

    elif group == "B":
        for s in sections:
            s = dict(s)
            new_sections.append({"t": "h2", "id": s["anchor"], "text": s["h"]})
            for body_item in s.get("body", []):
                new_sections.append(fix_section_item(body_item))
        # toc dicts -> 2-lists
        toc = art.get("toc", [])
        art["toc"] = [[t["anchor"], t["label"]] for t in toc] if toc and isinstance(toc[0], dict) else toc
        # faq top-level dicts -> tuples
        faq = art.get("faq")
        if faq and isinstance(faq[0], dict):
            faq = [(f["q"], f["a"]) for f in faq]
        # related bare titles -> pairs; references dicts -> strings
        art["related"] = to_related_pairs(art.get("related", []), reverse)
        art["references"] = to_reference_strings(art.get("references", []))
        # keywords list -> string
        if isinstance(art.get("keywords"), list):
            art["keywords"] = ", ".join(str(k) for k in art["keywords"])
        # howto removed
        art.pop("howto", None)

    else:  # group C
        for s in sections:
            s = dict(s)
            t = s.get("t")
            if "id" not in s and "a" in s:
                s["id"] = s.pop("a")
            new_sections.append(fix_section_item(s))
        # toc already 2-lists
        # faq absent
        art["related"] = to_related_pairs(art.get("related", []), reverse)
        art["references"] = to_reference_strings(art.get("references", []))
        art.pop("howto", None)

    art["sections"] = new_sections
    if faq is not None:
        art["faq"] = faq
    else:
        art.pop("faq", None)
    return art, group


def main():
    write = "--write" in sys.argv
    reverse = load_related_reverse()
    print(f"reverse map: {len(reverse)} titles")
    for fname in FILES:
        path = os.path.join(SCRIPTS, fname)
        with open(path, "r", encoding="utf-8") as fh:
            source = fh.read()
        var, header = var_and_header(source)
        ns = {"__file__": path}
        exec(compile(source, path, "exec"), ns)
        art = ns[var]
        norm, group = normalize(art, reverse)
        # quick validation of normalized dict
        new_source = header + f"{var} = " + pprint.pformat(norm, width=88, sort_dicts=False) + "\n"
        # sanity: re-exec compiled new source
        ns2 = {"__file__": path}
        exec(compile(new_source, path, "exec"), ns2)
        check = ns2[var]
        nsec = len(check["sections"])
        kinds = {}
        for s in check["sections"]:
            kinds[s.get("t")] = kinds.get(s.get("t"), 0) + 1
        info = f"group={group} sections={nsec} kinds={kinds}"
        if check.get("faq"):
            info += f" faq={len(check['faq'])}"
        if write:
            with open(path, "w", encoding="utf-8") as fh:
                fh.write(new_source)
            print(f"[WROTE] {fname}: {info}")
        else:
            print(f"[DRY ] {fname}: {info}")
    print("done.")


if __name__ == "__main__":
    main()
