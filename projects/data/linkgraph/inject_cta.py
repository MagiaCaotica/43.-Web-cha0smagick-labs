"""Inject the contextual CTA into the 466 legacy blog articles.

The 349 YouTube articles get theirs from the generator, because a re-render
would otherwise wipe anything written into the HTML by hand. These 466 are
not generated, so they are edited in place, with the same idempotent shape
inject_blog.py uses for the cross-reference block: markers replace rather
than stack, and a second run must write nothing.

Placement is the same decision inject_blog.py makes, for the same reason.
`</main>` is not reliable here, so the block goes before the related-articles
block if there is one, otherwise before the first `<footer`, otherwise before
`</body>`. The CTA belongs after the prose and before the comments, which is
where all three anchors put it.

Usage:
    python inject_cta.py            # inject everything
    python inject_cta.py --check    # report only, exit 1 on any problem
    python inject_cta.py <slug>...  # limit to specific articles
"""

import json
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.normpath(os.path.join(HERE, "..", "..", ".."))
BLOG = os.path.join(REPO, "blog")
sys.path.insert(0, HERE)

import cta  # noqa: E402


def load_articles():
    with open(cta.GRAPH, encoding="utf-8") as fh:
        graph = json.load(fh)
    return {a["slug"]: a for a in graph["articles"]}


def newline_of(html):
    return "\r\n" if "\r\n" in html else "\n"


def normalise_newlines(html):
    """Legacy files mix CRLF and LF inside one file.

    As long as both survive, an injected block can never compare equal to the
    rest of the file byte for byte and the run rewrites all 466 every time.
    Unifying to the dominant ending is the only way to make a change
    detection work here.
    """
    crlf = html.count("\r\n")
    lf = html.count("\n") - crlf
    if crlf and lf:
        nl = "\r\n" if crlf >= lf else "\n"
        return re.sub(r"\r\n|\r|\n", nl, html)
    return html


def strip_comments(html):
    """Blank out comments, preserving length, so anchor search cannot match one."""
    def repl(m):
        s = m.group(0)
        if s.startswith("<!--"):
            return " " * (len(s) - 7) + "<!---->"
        return " " * (len(s) - 2) + "//"
    return re.sub(r"(?s)<!--.*?-->|//[^\n]*", repl, html)


def find_anchor(html):
    """Offset where the block goes: after the prose, before the comments."""
    probe = strip_comments(html)
    best = -1
    for marker in (
        'class="related-articles"',
        'class="internal-links"',
        "Related Articles",
        "Related Resources",
    ):
        idx = probe.rfind(marker)
        if idx != -1:
            # back up to the opening tag of the enclosing block
            start = max(probe.rfind("<section", 0, idx), probe.rfind("<div", 0, idx))
            if start != -1:
                best = max(best, start)
    if best != -1:
        return best
    for tag in ("<footer", "</body>"):
        idx = probe.find(tag)
        if idx != -1:
            return idx
    return len(html)


def apply(html, block, nl):
    """Insert or replace the block. Returns (new_html, changed).

    head is forced to end with a newline and tail to start with one, and that
    is the whole separator: adding another nl here is what made every file
    grow by one byte per run, which is the same mistake inject_blog.py had
    once and the reason its payload carries no trailing newline.
    """
    current = cta.strip_block(html, nl)
    current = re.sub(r"(?:\r\n|\r|\n){3,}", nl + nl, current)
    pos = find_anchor(current)
    payload = re.sub(r"\r\n|\r|\n", nl, block)
    tail = current[pos:]
    if not tail.startswith(nl):
        tail = nl + tail
    head = current[:pos]
    if not head.endswith(nl):
        head = head + nl
    out = head + payload + tail
    return out, out != html


def ensure_css(html):
    if "css/wisdom.css" in html:
        return html
    m = re.search(r'(?i)(<link[^>]+href="(?:\.\./)?css/wisdom\.css"[^>]*>)', html)
    if m:
        return html
    link = '<link rel="stylesheet" href="../css/wisdom.css">'
    idx = html.lower().find("</head>")
    if idx == -1:
        return html
    return html[:idx] + link + html[idx:]


def write_atomic(path, text):
    """Write through a temp file and replace.

    On Windows an in-place open can fail with EINVAL when a scanner holds the
    file for a moment, and it can leave a half-written article on disk. Write
    beside the target and rename, which is atomic on NTFS, and retry once.
    """
    last = None
    for attempt in range(3):
        tmp = path + ".cta.tmp"
        try:
            with open(tmp, "w", encoding="utf-8", newline="") as fh:
                fh.write(text)
            os.replace(tmp, path)
            return
        except OSError as exc:
            last = exc
            if os.path.exists(tmp):
                try:
                    os.remove(tmp)
                except OSError:
                    pass
    raise last


def main(argv):
    check = "--check" in argv
    wanted = [a for a in argv if not a.startswith("-")]
    articles = load_articles()
    catalog = cta.load_catalog()

    written = 0
    skipped = 0
    problems = []
    for name in sorted(os.listdir(BLOG)):
        if not name.endswith(".html") or name == "index.html":
            continue
        slug = name[:-5]
        if wanted and slug not in wanted:
            continue
        art = articles.get(slug)
        if art is None:
            problems.append("%s: no esta en link-graph.json" % slug)
            continue
        if art.get("family") == "yt":
            # the 349 get theirs from the generator, and writing it here too
            # would leave two blocks once the generator is re-run
            continue
        path = os.path.join(BLOG, name)
        with open(path, encoding="utf-8", newline="") as fh:
            html = normalise_newlines(fh.read())
        nl = newline_of(html)
        block = cta.build(slug, art.get("domain"), art.get("title"), catalog)
        if not block:
            problems.append("%s: sin producto comprable" % slug)
            continue
        out, changed = apply(html, block, nl)
        out = ensure_css(out)
        if out != html:
            changed = True
        if changed and not check:
            write_atomic(path, out)
        if changed:
            written += 1
        else:
            skipped += 1

    verb = "verificados" if check else "inyectados"
    print("legacy procesados: %d | %s: %d | sin cambios: %d | problemas: %d"
          % (written + skipped, verb, written, skipped, len(problems)))
    for p in problems[:20]:
        print("  ! " + p)
    if problems:
        return 1
    if check and written:
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
