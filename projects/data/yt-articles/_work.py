"""Build the concrete rewrite work list for the corpus 8-gram gate.

The gate (``slop.scan_corpus``) fails when one 8-token run appears in more than
two articles. For each offending run we therefore need to change that run in all
but one of the articles that carry it. Changing a run means rewriting the
sentence that contains it, so this script resolves, for every offending run, the
exact sentence inside ``content/<n>.json`` that must be replaced.

Granularity notes:
  * A sentence is a piece of a single JSON field, split on ``[.!?]``.
  * FAQ entries are also indexed as the virtual pair "question + answer", because
    a shared run can straddle that boundary ("... asked questions do i have to
    believe in ..."). Such targets carry two paths.
  * Runs that cannot be attributed to any authored sentence are chrome; they are
    reported separately in ``missing`` and need a different fix.

Outputs ``_work.json`` and ``_work_report.txt`` (UTF-8, written from Python).
"""

from __future__ import annotations

import json
import re
from collections import defaultdict
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[2]

import slop  # noqa: E402

N = slop.NGRAM_N
_SPLIT_SENT = re.compile(r"(?<=[.!?])\s+")


def grams_of(text: str) -> set[str]:
    t = slop.words(text.lower())
    return {" ".join(t[i:i + N]) for i in range(len(t) - N + 1)}


def targets_of(rec: dict) -> list[dict]:
    """Every rewritable text target in one content record.

    Each target: {tid, paths: [...], text: str, grams: set[str]}
    """
    out: list[dict] = []

    def add(paths: list[str], text: str) -> None:
        if not text.strip():
            return
        out.append({"tid": f"t{len(out)}", "paths": paths, "text": text,
                    "grams": grams_of(text)})

    if isinstance(rec.get("lede"), str):
        for s in _SPLIT_SENT.split(rec["lede"]):
            add([".lede"], s)

    for i, sec in enumerate(rec.get("sections") or []):
        if isinstance(sec, str):
            for s in _SPLIT_SENT.split(sec):
                add([f".sections[{i}]"], s)
            continue
        if not isinstance(sec, dict):
            continue
        for k, v in sec.items():
            if k == "h2":
                continue
            for j, s in _iter_sentences(f".sections[{i}].{k}", v):
                add([j], s)

    for i, pair in enumerate(rec.get("faq") or []):
        if isinstance(pair, (list, tuple)) and len(pair) == 2:
            q, a = str(pair[0]), str(pair[1])
            add([f".faq[{i}][0]"], q)
            for s in _SPLIT_SENT.split(a):
                add([f".faq[{i}][1]"], s)
            # virtual cross-boundary target
            add([f".faq[{i}][0]", f".faq[{i}][1]"], f"{q} {a}")

    return out


def _iter_sentences(path: str, v):
    if isinstance(v, str):
        for s in _SPLIT_SENT.split(v):
            yield path, s
    elif isinstance(v, list):
        for j, x in enumerate(v):
            yield from _iter_sentences(f"{path}[{j}]", x)
    elif isinstance(v, dict):
        for k, x in v.items():
            yield from _iter_sentences(f"{path}.{k}", x)


def main() -> None:
    specs = json.loads((HERE / "specs.json").read_text(encoding="utf-8"))
    contents: dict[int, dict] = {}
    for s in sorted(specs, key=lambda x: int(x["n"])):
        p = HERE / "content" / f"{int(s['n'])}.json"
        if p.exists():
            contents[int(s["n"])] = json.loads(p.read_text(encoding="utf-8"))

    pairs = []
    for n, c in sorted(contents.items()):
        hp = ROOT / "blog" / f"{c['slug']}.html"
        if hp.exists():
            pairs.append((c["slug"], hp.read_text(encoding="utf-8")))
    idx = slop.ngram_index(pairs)
    offenders = [(g, sorted(s)) for g, s in idx.items() if len(s) > slop.NGRAM_MAX_ARTICLES]
    offenders.sort(key=lambda kv: (-len(kv[1]), kv[0]))
    slug_to_n = {c["slug"]: n for n, c in contents.items()}

    tcache: dict[int, list[dict]] = {}
    for n, c in contents.items():
        tcache[n] = targets_of(c)

    # gram -> {n: [tid,...]}
    gram_hits: dict[str, dict[int, list[str]]] = defaultdict(lambda: defaultdict(list))
    missing: list[dict] = []
    for g, slugs in offenders:
        ns = [slug_to_n[s] for s in slugs if s in slug_to_n]
        hit = False
        for n in ns:
            for t in tcache.get(n, []):
                if g in t["grams"]:
                    gram_hits[g][n].append(t["tid"])
                    hit = True
        if not hit:
            missing.append({"ngram": g, "ns": ns, "slugs": slugs})

    # collect the targets that must change, per article.
    # keeper rule: for each gram, the lowest article id keeps its sentence.
    must_rewrite: dict[int, dict[str, dict]] = defaultdict(dict)  # n -> tid -> target
    for g, per_n in gram_hits.items():
        ordered = sorted(per_n)
        for n in ordered[1:]:  # first article keeps the original wording
            for tid in per_n[n]:
                must_rewrite[n][tid] = tcache[n][int(tid[1:])]

    # Also: H2 collisions. Rename the H2 in all but the first article.
    h2_tasks = []
    for n in sorted(must_rewrite):
        pass

    articles = []
    total = 0
    for n in sorted(must_rewrite):
        rows = []
        for tid, t in sorted(must_rewrite[n].items(), key=lambda kv: int(kv[0][1:])):
            rows.append({"tid": tid, "paths": t["paths"], "text": t["text"]})
        total += len(rows)
        articles.append({
            "n": n,
            "slug": contents[n]["slug"],
            "h1": contents[n]["h1"],
            "cluster": specs_map(specs, n),
            "targets": rows,
        })

    payload = {
        "offender_ngrams": len(offenders),
        "targets_to_rewrite": total,
        "articles": articles,
        "missing": missing,
    }
    (HERE / "_work.json").write_text(
        json.dumps(payload, ensure_ascii=False, indent=1), encoding="utf-8"
    )

    lines = [
        f"offender 8-grams      : {len(offenders)}",
        f"articles to touch     : {len(articles)}",
        f"sentences to rewrite  : {total}",
        f"unattributed (chrome) : {len(missing)}",
        "",
    ]
    for a in articles:
        lines.append(f"=== n={a['n']} [{a['cluster']}] {a['slug']}")
        lines.append(f"    {a['h1']}")
        for t in a["targets"]:
            lines.append(f"    - {t['tid']} <{','.join(t['paths'])}>")
            lines.append(f"        {t['text']}")
        lines.append("")
    lines.append("=== UNATTRIBUTED ===")
    for m in missing:
        lines.append(f"  {m['ngram']!r} ns={m['ns']}")
    (HERE / "_work_report.txt").write_text("\n".join(lines), encoding="utf-8")
    print(f"ngrams={len(offenders)} articles={len(articles)} "
          f"targets={total} missing={len(missing)}")


_SPECS_BY_N: dict[int, dict] = {}


def specs_map(specs, n):
    if not _SPECS_BY_N:
        for s in specs:
            _SPECS_BY_N[int(s["n"])] = s
    s = _SPECS_BY_N.get(n, {})
    return f"{s.get('cluster','?')}/{s.get('domain','?')}"


if __name__ == "__main__":
    main()
