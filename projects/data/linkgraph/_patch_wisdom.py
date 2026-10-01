"""One-off patch: 4 wisdom files were below the 30 in-text link floor.

- chaos-sigil-generator: typo'd slug + too few links
- psi-gym / lucid-dream / norse-rune-oracle: 20 / 25 / 28 links

Appends one extra prose section to each and fixes the typo.
"""
import json
import pathlib
import re

HERE = pathlib.Path(__file__).resolve().parent
W = HERE / "wisdom"
BLOG = HERE.parents[2] / "blog"

PATCH = {
    "chaos-sigil-generator": {
        "h3": "The parts of the page worth reading as instructions",
        "p": [
            "The output is a picture, so the only thing to read on it is the statement you "
            "typed. Keep that statement in front of you while the glyph is being built, "
            "because the generator will not tell you what it dropped. A reduction that "
            "collapses a preposition into a line and a negation into nothing can be correct "
            "and still be unreadable a fortnight later. The spell is not the image; it is the "
            "sentence, and the image is a handle you put on the sentence. The distinction is "
            "the whole reason the technique has a charge step at all, and it is spelled out "
            "in [How to make a sigil from first principles]"
            "(sigils-theory-and-technique-how-to-make-a-sigil-guide-4), where the same "
            "letter-reduction rules are walked through by hand so you can see which letters "
            "survive. Read that page once and the generator stops being a novelty.",
            "Before you generate anything, decide the office in a single sentence and write "
            "it down. An office is what the thoughtform is for, and it is the field that can "
            "be checked later; everything else about a sigil is either convention or taste. "
            "The pages on [designing a sigil and charging it]"
            "(chaos-sigil-design-charge-forget-guide) and on [what a sigil claim survives]"
            "(hyper-accelerated-sigils-what-the-claim-survives) both come back to that same "
            "point from different directions. If you take one habit from a tool that does "
            "nothing else for you, take the habit of naming the office first.",
        ],
    },
    "psi-gym": {
        "h3": "What the app is training, and what it is only measuring",
        "p": [
            "Read the app as a motor drill rather than a test. The daily score moves for at "
            "least three reasons that have nothing to do with knowing anything: you memorised "
            "the order of the rig, you learned to feel for the tell, and you got better at "
            "guessing. Only the third is even arguably skill, and it is a real one, but it is "
            "not the one the app claims. The longer treatment of that gap is in "
            "[Can anyone learn ESP]"
            "(can-anyone-learn-esp-the-science-says-maybe) and in [how the mind keeps a "
            "practice honest](abraxas-what-is-gnosis-chaos-magic), which is the same "
            "epistemological problem wearing different clothes.",
            "The training schedule is the part of the product that carries the claim, and it "
            "is worth reading as a written method rather than as a feature list. "
            "[The best daily ESP schedule](best-esp-training-schedule-daily-psi-practice) "
            "and [thirty days of scored practice]"
            "(zener-training-30-day-score-journey) both set out a shape you could reproduce on "
            "paper with a deck, which is the honest test of whether you need the app at all. "
            "If you want the statistical background behind the deck itself, "
            "[what a Zener card is and where the number comes from]"
            "(what-is-a-zener-card-definition-history-statistics) is the shortest route.",
        ],
    },
    "lucid-dream": {
        "h3": "Keeping the record once the technique stops being news",
        "p": [
            "The weeks after the first lucid dream are where the practice either becomes a "
            "skill or becomes a story about having had one. The difference is entirely in "
            "whether you wrote anything down at the time of waking, and the specific format "
            "that helps is described in [dream journalling for lucid dreaming]"
            "(dream-journaling-lucid-dreaming-complete-guide) and compared across apps in "
            "[the journalling methods comparison]"
            "(dream-journaling-methods-best-apps-2026). Three lines is enough: where you were, "
            "what happened, and how you knew you were dreaming.",
            "If you want to know what a stabilised practice actually feels like from the "
            "inside rather than what it is supposed to feel like, the long reviews are the "
            "right place to look. [Dream Machine after a long run]"
            "(dream-machine-long-term-review) and [three weeks to a first lucid dream]"
            "(first-lucid-dream-3-weeks-dream-machine) both report the ordinary weeks "
            "between the exciting ones, which is where most people quietly stop.",
        ],
    },
    "norse-rune-oracle": {
        "h3": "What to do with a set you have had for a year",
        "p": [
            "Eventually the point at which you draw stops being interesting is not a failure "
            "of the practice, it is the point at which the set has been consulted too often "
            "to be read honestly. The maintenance side of the work is covered in "
            "[cleansing and charging a rune set](how-to-cleanse-and-charge-runes), and the "
            "reading side in [rune casting methods for beginners]"
            "(rune-casting-methods-tips-beginners) if the mechanics are still slippery. A set "
            "that is well looked after and drawn without hurry beats a rare set consulted in a "
            "panic.",
        ],
    },
}

BAD = "sigs-theory-and-technique-how-to-make-a-sigil-guide"

for name, extra in PATCH.items():
    path = W / f"{name}.json"
    raw = path.read_text(encoding="utf-8")
    if BAD in raw:
        raw = raw.replace(BAD, "sigils-theory-and-technique-how-to-make-a-sigil-guide")
    data = json.loads(raw)

    h3s = [s.get("h3", "") for s in data["sections"]]
    if extra["h3"] in h3s:
        data["sections"] = [s for s in data["sections"] if s.get("h3") != extra["h3"]]
    data["sections"].append({"h3": extra["h3"], "p": extra["p"]})

    missing = re.findall(r"\]\(([a-z0-9\-]+)\)", json.dumps(data, ensure_ascii=False))
    bad = sorted({s for s in missing if not (BLOG / f"{s}.html").exists()})
    if bad:
        raise SystemExit(f"{name}: slugs inexistentes -> {bad}")

    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"[OK] {name}: {len(data['sections'])} secciones, {len(missing)} enlaces con markup")
