import io, json, os, sys
ROOT = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", ".."))
g = json.load(io.open(os.path.join(ROOT, "data", "link-graph.json"), encoding="utf-8"))
arts = {a["slug"]: a for a in g["articles"]}
apps = g["apps"]
mode = sys.argv[1] if len(sys.argv) > 1 else "apps"

if mode == "apps":
    for a in apps:
        print(f"{a['slug']}  |  dominios: {', '.join(a['domains'])}  |  targets: {len(a['targets'])}")
elif mode == "counts":
    from collections import Counter
    c = Counter(a["domain"] for a in arts.values())
    for d, n in c.most_common():
        print(f"{n:4d}  {d}")
elif mode == "pool":
    # pool <app> [n]  -> los n primeros articles de los dominios del app
    app = sys.argv[2]
    n = int(sys.argv[3]) if len(sys.argv) > 3 else 10
    ga = next((a for a in apps if a["slug"] == app), None)
    doms = ga["domains"] if ga else []
    per = max(3, n // max(1, len(doms)) + 1)
    for d in doms:
        rows = [a for a in arts.values() if a["domain"] == d]
        rows.sort(key=lambda a: (a.get("family") != "yt", -(len(a.get("keywords") or []))))
        print(f"### {d}  (hay {len(rows)})")
        for a in rows[:per]:
            print(f"  {a['slug']}  ::  {a['title'][:78]}")
        print()
elif mode == "find":
    # find <substring...>  -> busca en slug/title/keywords
    q = " ".join(sys.argv[2:]).lower()
    for a in arts.values():
        blob = (a["slug"] + " " + (a.get("title") or "") + " " + " ".join(a.get("keywords") or [])).lower()
        if q in blob:
            print(f"{a['slug']}  ::  {a['title'][:80]}  ::  {a['domain']}")
