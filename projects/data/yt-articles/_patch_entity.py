# -*- coding: utf-8 -*-
"""One-off: replace lines 553-600 of build_specs.py (ENTITY_SKIP_WORDS +
extract_entity) with the stricter implementation."""
import io
import os

HERE = os.path.dirname(os.path.abspath(__file__))
P = os.path.join(HERE, "build_specs.py")

with io.open(P, "r", encoding="utf-8") as f:
    lines = f.readlines()

# locate the block boundaries by content, not fixed numbers
start = None
end = None
for i, l in enumerate(lines):
    if l.startswith("ENTITY_SKIP_WORDS"):
        start = i
    if l.startswith("def parenthesised_domain"):
        end = i
        break
if start is None or end is None:
    raise SystemExit("anchors not found: start=%r end=%r" % (start, end))
print("replacing lines %d..%d (%d lines)" % (start + 1, end, end - start))

NEW = '''ENTITY_STOPWORDS = set("""
the a an el la los las un una unos unas y o of to for and in on at with
true false real reales nuevo new faq top how what why when who is are was
does do did can could should would will shall may might must
ghost hunting protection amulet magic chaos love money tarot runes
rune moon lunar dream dreams sigil sigils ritual rituals guide manual
complete secret secrets art war black left right hand path applied hyper
accelerated futhark mental mind code program practical power basic
principles iniciacion principiante beginner thelema sigilkore
misteriosa my this that these those good bad best worst
""".split())


def extract_entity(title):
    """Pull the proper-noun entity out of a video title, or return \'\' if the
    title is a topic title rather than an entity title.

    Two accepted shapes only:
      (a) "INVOCACION A <X>"
      (b) a LEADING contiguous run of ALL-CAPS tokens (no digits, not a
          stopword) -- how the servitor/invocation videos are titled
    Fallback, short titles only: one capitalised non-stopword token.
    """
    t = title
    t = re.sub(r"^\\s*\\d+\\s*", "", t)
    t = re.sub(r"^podcast\\s+ep[^:]*:\\s*", "", t, flags=re.I)
    t = re.sub(r"^\\s*(?:\\d+[a-z]?\\s+)+", "", t, flags=re.I)
    t = t.strip()

    m = re.search(r"invocaci[o\\u00f3]n\\s+(?:a|de)\\s+(.+)$", t, flags=re.I)
    if m:
        return titlecase(m.group(1).strip())
    m = re.search(r"invocar\\s+a\\s+(.+)$", t, flags=re.I)
    if m:
        return titlecase(m.group(1).strip())

    paren = re.search(r"\\(([^)]*)\\)", t)
    head = t[: paren.start()] if paren else t
    head = head.strip().strip("-:|,*").strip()
    words = head.split()
    if not words:
        return ""

    # (b) leading contiguous ALL-CAPS run
    run = []
    for w in words:
        bare = w.strip(".,:;!?\\'"()[]")
        if (len(bare) > 1 and bare.upper() == bare
                and re.match(r"^[A-Z\\u00c1\\u00c9\\u00cd\\u00d3\\u00da\\u00d1\\u00dc]", bare)
                and not re.search(r"\\d", bare)):
            run.append(bare)
        else:
            break
    if run:
        joined = " ".join(run)
        ent = re.sub(r"^(THE|A|EL|LA|LOS|LAS)\\s+", "", joined, flags=re.I)
        ent = re.sub(r"^(THE|A|EL|LA|LOS|LAS)\\s+", "", ent, flags=re.I)
        low = ent.lower()
        if ent and len(low) >= 3 and low not in ENTITY_STOPWORDS:
            return titlecase(ent)
        return ""

    # fallback: short titles only
    if len(words) <= 3:
        fw = words[0].strip(".,:;!?\\'"()[]")
        fw = re.sub(r"^(The|El|La)\\s+", "", fw, flags=re.I)
        if (len(fw) >= 4 and fw[:1].isupper()
                and fw.lower() not in ENTITY_STOPWORDS
                and not re.search(r"\\d", fw)):
            return titlecase(fw)
    return ""


'''

out = lines[:start] + [NEW] + lines[end:]
with io.open(P, "w", encoding="utf-8", newline="") as f:
    f.write("".join(out))
print("build_specs.py rewritten, %d -> %d lines" % (len(lines), len(out)))
