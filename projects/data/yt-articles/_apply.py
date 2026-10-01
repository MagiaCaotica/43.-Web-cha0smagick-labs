#!/usr/bin/env python3
"""Apply sentence rewrites from `_newtext_XX.json` into `content/<n>.json`.

Contract for the rewrite files (produced by delegated rewriting agents):
    {"117": {"t117": "new sentence text", ...}, ...}
`t117` is the target id from `_work.json`. `paths` tells where the sentence lives,
but the applier locates it by exact string match inside the serialised record,
which is robust to path renumbering.

Safety: refuses to write if the old text cannot be found, if a new text equals the
old text, or if the new text is empty. Writes UTF-8 without BOM, 2-space indent,
newline-terminated -- matching what the generator and other patchers expect.
"""
from __future__ import annotations

import json
import pathlib
import sys

sys.stdout.reconfigure(encoding="utf-8")

HERE = pathlib.Path(__file__).resolve().parent
CONTENT = HERE / "content"


def load_work() -> dict[int, dict[str, dict]]:
    """Target index. `_real.json` is `_work.json` minus the virtual targets whose
    text is not a substring of the stored record, so every lookup here can match."""
    work = json.loads((HERE / "_real.json").read_text(encoding="utf-8"))
    out: dict[int, dict[str, dict]] = {}
    for art in work["articles"]:
        out[int(art["n"])] = {t["tid"]: t for t in art["targets"]}
    return out


def string_occurrences(raw: str, needle: str) -> int:
    return raw.count(needle)


def main() -> None:
    args = sys.argv[1:]
    if not args:
        print("usage: _apply.py _newtext_01.json [...]")
        raise SystemExit(2)

    work = load_work()
    applied = 0
    skipped: list[str] = []
    per_file: dict[int, int] = {}

    for arg in args:
        batch = json.loads((HERE / arg).read_text(encoding="utf-8"))
        for n_str, tid_map in batch.items():
            n = int(n_str)
            targets = work.get(n, {})
            path = CONTENT / f"{n}.json"
            raw = path.read_text(encoding="utf-8")
            original = raw
            for tid, new_text in tid_map.items():
                tgt = targets.get(tid)
                if tgt is None:
                    skipped.append(f"n={n} {tid}: unknown target id")
                    continue
                old = tgt["text"]
                if not new_text or not new_text.strip():
                    skipped.append(f"n={n} {tid}: empty replacement")
                    continue
                if new_text == old:
                    skipped.append(f"n={n} {tid}: replacement identical to original")
                    continue
                count = string_occurrences(raw, old)
                if count != 1:
                    skipped.append(f"n={n} {tid}: found {count} occurrences in raw JSON")
                    continue
                raw = raw.replace(old, new_text)
                applied += 1
                per_file[n] = per_file.get(n, 0) + 1
            if raw != original:
                data = json.loads(raw)
                path.write_text(
                    json.dumps(data, ensure_ascii=False, indent=2) + "\n",
                    encoding="utf-8",
                )

    print(f"applied {applied} rewrites across {len(per_file)} content files")
    for n in sorted(per_file):
        print(f"  n={n:>4}  {per_file[n]} sentence(s)")
    if skipped:
        print(f"\nSKIPPED ({len(skipped)}):")
        for s in skipped:
            print(f"  {s}")
        raise SystemExit(1)


if __name__ == "__main__":
    main()
