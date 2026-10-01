"""Second one-off patch: three wisdom files still below the floor."""
import json
import pathlib
import re

HERE = pathlib.Path(__file__).resolve().parent
W = HERE / "wisdom"
BLOG = HERE.parents[2] / "blog"

PATCH = {
    "chaos-sigil-generator": {
        "h3": "Two questions to ask before the first charge",
        "p": [
            "Ask whether the statement is specific enough to fail, and whether you would "
            "still write it in three months. A wish cannot fail; a command can. "
            "[Unifying the theory](chaos-magic-fundamentals-what-is-chaos-magic-guide-31) "
            "sets out why the imperative mood is the load-bearing part of a sigil rather than "
            "the shape, and [what a claim audit looks like]"
            "(supernatural-powers-claim-audit-four-question-test) gives the four questions that "
            "keep a working from drifting into something you cannot check. A page on "
            "[a four-question test for power claims]"
            "(chaos-magic-fundamentals-what-is-chaos-magic-guide-27) covers the same ground "
            "from the other direction, and [the basic terms]"
            "(chaos-magic-fundamentals-what-is-chaos-magic-guide-26) is the shortest "
            "definition of charge, office and aim you will find in one place.",
            "Then ask what the forgetting stage is doing, because that is the step the tool "
            "cannot help with at all. The method and the gap inside it are described in "
            "[a sigil design, charge and forget guide]"
            "(chaos-sigil-design-charge-forget-guide) and in [the complete theory and "
            "practice of sigil magic](sigil-magic-complete-theory-practice), which is worth "
            "reading before the second working rather than before the first.",
        ],
    },
    "psi-gym": {
        "h3": "The four questions the app never asks",
        "p": [
            "Does the score change when the answer changes, or only when the guessing "
            "changes? Could a colleague with a different deck have scored the same? What was "
            "the base rate on the day before you started? Would you have noticed a bad week? "
            "The [gnosis protocol in four questions]"
            "(gnosis-protocol-four-questions) is the shortest written form of those, and "
            "[belief as a tool rather than a cause]"
            "(gnosis-belief-and-paradigm-shift-what-is-gnosis-chaos-m-3) is the longer "
            "version. [Meditation and neuroplasticity]"
            "(meditacion-neuroplasticidad-why-does-magic-work-placebo) covers the training "
            "half of the question, and [the four questions protocol for clarity workings]"
            "(gnosis-protocol-four-questions) shows the same four questions applied to a "
            "decision rather than a card.",
            "If the honest answer to the base-rate question is that you never counted one, "
            "the fix is a deck and a notebook rather than an app. [Rune practice as the "
            "workable alternative](learning-to-read-runes-daily-practice) and "
            "[intuition as a trainable faculty]"
            "(can-you-train-intuition-science-esp-methods) both describe what a "
            "measurement-led practice looks like when you build it from scratch.",
        ],
    },
    "lucid-dream": {
        "h3": "When the practice stops being a practice",
        "p": [
            "Two failure modes deserve names. The first is the diary becoming a source of "
            "symptoms, which is covered in [the first lucid dream and how to be sure of it]"
            "(dreams-astral-projection-and-tulpas-how-to-lucid-dream--4). The second is the "
            "dreams being treated as messages to decode, which "
            "[dream interpretation as a research tool]"
            "(dream-interpretation-encyclopedia) handles honestly. Sleep itself comes first: "
            "[sleep science and lucid dreaming]"
            "(world-sleep-day-lucid-dreaming-as-sleep-science) is the page to read before "
            "you start changing your hours.",
        ],
    },
}

for name, extra in PATCH.items():
    path = W / f"{name}.json"
    data = json.loads(path.read_text(encoding="utf-8"))
    data["sections"] = [s for s in data["sections"] if s.get("h3") != extra["h3"]]
    data["sections"].append({"h3": extra["h3"], "p": extra["p"]})
    text = json.dumps(data, ensure_ascii=False)
    slugs = re.findall(r"\]\(([a-z0-9\-]+)\)", text)
    bad = sorted({s for s in slugs if not (BLOG / f"{s}.html").exists()})
    if bad:
        raise SystemExit(f"{name}: slugs inexistentes -> {bad}")
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"[OK] {name}: {len(data['sections'])} secciones, {len(slugs)} enlaces con markup")
