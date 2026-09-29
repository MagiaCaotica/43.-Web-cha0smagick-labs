# -*- coding: utf-8 -*-
"""Report section count and body words per record in a bNNx.py file (via import)."""
import importlib.util
import os
import sys

PATH = sys.argv[1] if len(sys.argv) > 1 else "content/_src/b04g.py"
name = os.path.splitext(os.path.basename(PATH))[0] + "_secs_probe"
spec = importlib.util.spec_from_file_location(name, PATH)
mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mod)

for n in sorted(mod.ARTICLES):
    art = mod.ARTICLES[n]
    w = 0
    for s in art["sections"]:
        for p in s.get("p", []):
            w += len(p.split())
        for k in ("ol", "ul"):
            for it in s.get(k, []):
                w += len(it.split())
    fw = sum(len(a.split()) for _q, a in art["faq"])
    print("n=%-4d sections=%-3d body=%-5d (+faq %d = %d)" % (
        n, len(art["sections"]), w, fw, w + fw))
