import io, os, re, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", "..", ".."))
rel = "apps/iching-oracle.html"

orig = subprocess.check_output(["git", "show", "HEAD:" + rel], cwd=ROOT).decode("utf-8", "replace")
with io.open(os.path.join(ROOT, rel), encoding="utf-8") as f:
    cur = f.read()

VOID = {"area","base","br","col","embed","hr","img","input","link","meta","param","source","track","wbr","!doctype"}

def scan(html, label):
    print("=== " + label + " (%d bytes)" % len(html))
    stack = []
    for m in re.finditer(r"<(/?)([a-zA-Z!][a-zA-Z0-9!]*)([^>]*?)(/?)>", html):
        closing, tag, attrs, selfclose = m.group(1), m.group(2).lower(), m.group(3), m.group(4)
        if tag in VOID or selfclose:
            continue
        line = html.count("\n", 0, m.start()) + 1
        if closing:
            if stack and stack[-1][0] == tag:
                stack.pop()
            else:
                # cierre huerfano o fuera de orden
                if any(t == tag for t, _, _ in stack):
                    while stack and stack[-1][0] != tag:
                        t, l, o = stack.pop()
                        print("  SIN CERRAR <%s> abierto en linea %d (offset %d)" % (t, l, o))
                    stack.pop()
                else:
                    print("  CIERRE SIN ABRIR </%s> linea %d offset %d" % (tag, line, m.start()))
        else:
            stack.append((tag, line, m.start()))
    for t, l, o in stack:
        print("  SIN CERRAR <%s> abierto en linea %d (offset %d)" % (t, l, o))
    print("  pila final: %d" % len(stack))

scan(orig, "ORIGINAL (git HEAD)")
scan(cur, "ACTUAL")
