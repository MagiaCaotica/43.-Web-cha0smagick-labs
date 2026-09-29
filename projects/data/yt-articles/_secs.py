# -*- coding: utf-8 -*-
"""Report the section count and body words of each record in a bNNx.py file."""
import ast
import io
import sys

PATH = sys.argv[1] if len(sys.argv) > 1 else "content/_src/b04g.py"
mod = ast.parse(io.open(PATH, encoding="utf-8").read())
for node in mod.body:
    if not isinstance(node, ast.Assign):
        continue
    for name, value in zip(node.targets, [node.value]):
        if getattr(name, "id", "") != "ARTICLES":
            continue
        for key in sorted(value.keys, key=lambda k: k.value):
            n = key.value
            art = value[key]
            secs = art["sections"]
            w = 0
            for s in secs:
                for p in s.get("p", []):
                    w += len(p.split())
                for k in ("ol", "ul"):
                    for it in s.get(k, []):
                        w += len(it.split())
            faq = sum(len(a.split()) for _q, a in art["faq"])
            print(
                "n=%-4d sections=%-3d body=%-5d (+faq %d = %d)"
                % (n, len(secs), w, faq, w + faq)
            )
