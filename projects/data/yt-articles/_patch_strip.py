# -*- coding: utf-8 -*-
"""Fix the two .strip() lines that have an unescaped double quote inside."""
import ast
import io
import os

HERE = os.path.dirname(os.path.abspath(__file__))
P = os.path.join(HERE, "build_specs.py")

_STRIP_PY = '.,:;!?' + "'" + '"' + '()[]'
STRIP = "STRIPCHARS = " + repr(_STRIP_PY)


def main():
    with io.open(P, "r", encoding="utf-8") as f:
        lines = f.readlines()

    out = []
    fixed = 0
    for l in lines:
        s = l.rstrip("\r\n")
        if "bare = w.strip(" in s and "chr(" not in s:
            out.append("        bare = w.strip(STRIPCHARS)\n")
            fixed += 1
            continue
        if "fw = words[0].strip(" in s and "chr(" not in s:
            out.append("        fw = words[0].strip(STRIPCHARS)\n")
            fixed += 1
            continue
        out.append(l)

    # inject the STRIPCHARS constant right after the ENTITY_STOPWORDS block
    text = "".join(out)
    if "STRIPCHARS =" not in text:
        anchor = '""".split())\n'
        i = text.index(anchor) + len(anchor)
        text = (text[:i]
                + "\n# punctuation stripped from candidate entity tokens\n"
                + STRIP + "\n"
                + text[i:])
    else:
        # replace the placeholder if a previous run injected a broken one
        import re
        text = re.sub(r"^STRIPCHARS = .*$", STRIP, text, flags=re.M)

    with io.open(P, "w", encoding="utf-8", newline="") as f:
        f.write(text)

    ast.parse(text)
    print("fixed %d strip() lines; SYNTAX OK" % fixed)


if __name__ == "__main__":
    main()
