# -*- coding: utf-8 -*-
"""
DOMAIN LIBRARY - EXTENDED (part 2 of 2)
========================================
Companion to domains_core.py. Same record shape. Merged by domains.py.

OG names used here are all from the verified 71-image allowlist.
`cat` values are all from the 13 canonical blog/index.html filter values:
  sigils, divination, dreaming, goetia, runes, moon, tarot, iching,
  basics, reviews, free-tools, advanced
"""

DOMAINS_EXT = {

    # ------------------------------------------------------- ENTITY LORE
    "entity-lore": {
        "label": "Entity Lore and Invocation",
        "intent": "informational",
        "cat": "goetia",
        "og": "arcana-goetia-guide",
        "products": ["arcana-goetia", "noctem-tools", "manual-activacion-servidores-magicos-pdf", "eerieroads"],
        "terms": [
            "invocation ritual entity", "how to work with a spirit",
            "chaos magic entity invocation", "servitor vs spirit",
            "demon invocation guide", "theoretical entity working",
            "evocation protocol", "working with named spirits",
        ],
        "h2": [
            "Two Traditions Wearing the Same Word: Evocation and Invocation",
            "The Classical Frame: Names, Offices and Domains",
            "Why the Name Matters More Than the Description",
            "The Classical Evocation Protocol in Brief",
            "The Chaos Magic Frame: Entities as Pattern Interrupters",
            "Servitor, Thoughtform, or Neither",
            "Grounding After Contact",
            "Mistakes That Flatten the Results",
            "Ethical Limits on Wealth Magic",
            "Frequently Asked Questions",
        ],
        "facts": [
            "In classical ceremonial usage, 'evocation' means calling a spirit to appear, while "
            "'invocation' means inviting its influence to operate through the operator - a distinction "
            "most modern usage collapses.",
            "The Ars Goetia presents each of the 72 spirits with a rank, a visible form, an office, and "
            "specific powers, which makes it the most structured entity catalogue in Western grimoire "
            "literature.",
            "Modern chaos magic deliberately relaxes the classical framework, treating entities as "
            "independent pattern fragments useful for disrupting a repetitive thought structure.",
            "Peter Carroll's influential definition held that entities in chaos magic are best regarded as "
            "aspects of the magician's own mind rather than as external beings - a position that "
            "neutralises most of the risk without requiring scepticism.",
        ],
        "faq": [
            ("Should I work with demons?",
             "There is no reliable evidence of external danger, and working with a name you have never "
             "researched is the real hazard. Read the entity's stated office first and confirm it matches "
             "the domain you need."),
            ("What is the difference between evocation and invocation?",
             "Evocation calls the entity to manifest. Invocation asks it to operate through you. Classical "
             "practice treats these as different operations with different risks."),
            ("Do I need a full ritual circle?",
             "No. Chaos magic reduced ritual apparatus drastically on purpose. A defined intention, a "
             "sigil, and a stated frame are historically sufficient."),
        ],
        "risk": "grounding-discipline",
    },

    "servitor-craft": {
        "label": "Servitor Craft and Management",
        "intent": "commercial",
        "cat": "advanced",
        "og": "how-to-create-magickal-servitor",
        "products": ["noctem-tools", "manual-activacion-servidores-magicos-pdf", "chaos-sigil-generator", "codex-chaoticus-pdf"],
        "terms": [
            "how to create a magical servitor", "servitor management",
            "servitor feeding and dismissal", "how many servitors can you have",
            "thoughtform creation", "egress and dismissal ritual",
            "servitor charge and store", "tulpa vs servitor",
        ],
        "h2": [
            "What a Servitor Is: A Task-Bound Thoughtform",
            "The Design Problem: One Servitor, One Job",
            "The Construction Protocol",
            "Storing, Feeding and the Charge Schedule",
            "Reviewing and Dismissing: The Forgotten Half",
            "How Many Can You Realistically Run?",
            "Failure Signs and When to Rest",
            "Mistakes That Flatten the Results",
            "Ethical Limits on Wealth Magic",
            "Frequently Asked Questions",
        ],
        "facts": [
            "The magickal servitor concept was popularised in 19th and 20th century ceremonial literature "
            "and was further developed by Austin Osman Spare, who framed entities as displaced parts of "
            "the self available for tasks.",
            "The servitor technique draws on the older notion of the tutelary genius - a protective "
            "attendant spirit - and inherits its vocabulary of charge, feeding and dismissal.",
            "A 'feeding' in servitor practice is a visualisation of a completed task; the ritual feeds the "
            "servitor on the memory of the work it has done.",
            "Modern magic has largely dropped the prohibition on a fixed number of servitors, but "
            "practitioners consistently report a practical ceiling well below what folklore suggests, "
            "because each active servitor occupies attention.",
        ],
        "faq": [
            ("How many servitors can I have at once?",
             "Practitioners report 3 to 5 as a realistic working maximum, occasionally more for trivial "
             "tasks. The limit is attention, not metaphysics."),
            ("What happens if I stop feeding a servitor?",
             "In the classical frame it weakens and may disperse; in the modern frame the habitual "
             "thought-pattern fades on its own. Nothing dramatic happens in either reading."),
            ("Should I tell people about my servitors?",
             "Historically no - the material was guarded. Practically, the modern recommendation is to "
             "mention it only to people who will not treat it as a cry for help."),
        ],
        "risk": "grounding-discipline",
    },

    # ------------------------------------------------------------ GOETIA
    "goetia-demons": {
        "label": "The 72 Spirits of Goetia",
        "intent": "informational",
        "cat": "goetia",
        "og": "goetic-magic-beginners-guide",
        "products": ["arcana-goetia", "noctem-tools", "eerieroads", "codex-chaoticus-pdf"],
        "terms": [
            "72 demons of goetia", "ars goetia spirit guide", "goetia spirit domains",
            "which demon for wealth", "goetia spirit families", "claurizan sanamon",
            "great presidents of the goetia", "malphas vs flauros",
        ],
        "h2": [
            "Where the 72 Come From",
            "The Structure of the Catalogue: Rank, Family, Office",
            "The Nine Presidents, Thirty-six Dukes, Thirty Kings",
            "Choosing by Office, Not by Reputation",
            "A Working Method for One Spirit",
            "The Families and Their Broader Spheres",
            "Common Misassignments and How to Avoid Them",
            "Mistakes That Flatten the Results",
            "Ethical Limits on Wealth Magic",
            "Frequently Asked Questions",
        ],
        "facts": [
            "The Ars Goetia presents 72 spirits organised into three ranks - nine Presidents, "
            "thirty-six Dukes and thirty Kings - and further grouped into families of two, three or four.",
            "The material descends from Jewish and Christian demonological sources, particularly the "
            "Pseudepigrapha Book of Enoch, via the 17th century Conjuratio Ben-Maimon and the "
            "Lemuria.",
            "Modern 'Goetia' as a brand - the video essays, the app, the grimoire commentary - is a 21st "
            "century phenomenon layered over that older material.",
            "The media-heavy focus on Goetia has pushed the spirits out of their classical context: they "
            "were adminstrative or disciplinary officials in the original scheme, not torturers of the "
            "innocent.",
        ],
        "faq": [
            ("Which demon gives money?",
             "In the Ars Goetia, Mammon is the spirit of wealth, and Clauneck is a duke said to grant "
             "riches. Paimon grants dignities and confirmations of favour. Always read the stated office "
             "in the source text."),
            ("What are the 9 Presidents of Goetia?",
             "Bael, Agares, Vassago, Samigina, Marbas, Valefor, Aamon, Belphegor and Saleos - each with "
             "a documented rank, appearance and area of power."),
            ("Are the Goetia spirits demons in any real sense?",
             "Historically they are entries in a demonological catalogue with no evidence of real "
             "agency. Practically, they are a rich and usable symbolic vocabulary."),
        ],
        "risk": "grounding-discipline",
    },

    # ---------------------------------------------------- ASTRAL/DREAMS
    "astral-dreams": {
        "label": "Dreams, Astral Projection and Tulpas",
        "intent": "commercial",
        "cat": "dreaming",
        "og": "lucid-dreaming-guide",
        "products": ["dream-machine", "astral-lab", "lucid-dream", "psi-gym", "noctem-tools"],
        "terms": [
            "how to lucid dream", "astral projection guide", "what is a tulpa",
            "remote viewing technique", "how to astral project", "lucid dreaming tips",
            "out of body experience how to", "tulpa creation guide",
        ],
        "h2": [
            "The Scientific Case for Tracking Dreams",
            "Sleep Architecture and Why Doors Are Open at Dawn",
            "Lucid Dreaming: The Realistic Starting Path",
            "The Reality Check Method",
            "Out of Body Experiences Without Expecting Them",
            "Remote Viewing as a Disciplined Exercise",
            "Tulpas: History, Method and the Ethics",
            "Mistakes That Flatten the Results",
            "Ethical Limits on Wealth Magic",
            "Frequently Asked Questions",
        ],
        "facts": [
            "Lucid dreaming is a well-documented phenomenon with a measurable population base and reliable "
            "induction techniques, making it the most scientifically tractable item in this domain.",
            "REM sleep periods lengthen through the night, which is why morning waking is the highest-"
            "yield window for lucid recall.",
            "Out of body experiences are reported by a small percentage of the population and tend to occur "
            "near sleep onset or during illness and meditation - not usually at will.",
            "Remote viewing as practised at research institutes such as Stargate is disputed; the "
            "prospective results have not replicated reliably, though the training does improve visual "
            "description ability.",
            "Tulpa practice comes from Tibetan Buddhist traditions, where the method is used for "
            "visualisation and deity yoga rather than for creating a separate being.",
        ],
        "faq": [
            ("Can anyone learn to lucid dream?",
             "Yes. It is a trainable skill and the standard induction methods have high reported success "
             "rates, usually after several weeks of consistent practice."),
            ("What is a tulpa really?",
             "A visualisation sustained across meditation sessions until it acquires some degree of "
             "autonomy. The Tibetan originals are deity-visualisation practices, not servant creation."),
            ("Is astral projection dangerous?",
             "It is unusual rather than dangerous. Most people report neutral or pleasant experiences. If "
             "you are sleep-deprived, unwell, or prone to dissociation, prioritise ground routine first."),
        ],
        "risk": "grounding-discipline",
    },

    "dream-journal": {
        "label": "Dream Recall and Dreamwork",
        "intent": "commercial",
        "cat": "dreaming",
        "og": "lucid-dreaming-guide",
        "products": ["dream-machine", "astral-lab", "lucid-dream", "psi-gym"],
        "terms": [
            "how to remember dreams", "dream journal method",
            "dream interpretation guide", "keeping a dream log",
            "how to improve dream recall", "lucid dream journal",
            "nightmare journaling", "dreamwork practice",
        ],
        "h2": [
            "Why Most People Forget Their Dreams",
            "The 30-Second Morning Protocol",
            "Building a Journal That Survives Contact With Reality",
            "Pattern Tracking Over Time",
            "From Journal to Interpretation",
            "Nightmares and the Apparent Message",
            "Using a Dream Log With Cards or Runes",
            "Mistakes That Flatten the Results",
            "Ethical Limits on Wealth Magic",
            "Frequently Asked Questions",
        ],
        "facts": [
            "Dream recall improves dramatically with intention to recall, which is one of the few "
            "personally-verifiable effects in dream research.",
            "Most dreams are forgotten within minutes of waking; the memory loss is a function of sleep "
            "chemistry rather than effort, which is why the waking moment is the critical one.",
            "Pattern identification across dozens of entries is far more informative than any single "
            "dream, which is the core methodological claim of most dreamwork systems.",
            "Sleep environments, alcohol and medication all measurably affect dream vividness and "
            "content, which is worth logging alongside the dream itself.",
        ],
        "faq": [
            ("How do I remember dreams?",
             "Write within 30 seconds of waking, before standing up. The single highest-yield change is a "
             "paper journal by the bed rather than an intention to remember later."),
            ("Is dream interpretation objective?",
             "No, and it is not meant to be. The value is in producing a working interpretation you can "
             "test against your own behaviour."),
            ("Can a dream journal cure nightmares?",
             "Nightmare-focused imagery therapy has reasonable evidence, and journalling is a reasonable "
             "component. Severe or distressing nightmares warrant professional support."),
        ],
        "risk": "grounding-discipline",
    },

    # ------------------------------------------------------- DIVINATION
    "divination": {
        "label": "Divination as a Thinking Practice",
        "intent": "commercial",
        "cat": "divination",
        "og": "clairvoyance-test-online",
        "products": ["iching-oracle", "norse-rune-oracle", "psi-gym", "tarot-chaos-pdf", "noctem-tools"],
        "terms": [
            "how to use divination", "learn to read tarot", "divination for beginners",
            "rune reading guide", "i ching divination", "how to read oracle cards",
            "is divination real", "divination decision making",
        ],
        "h2": [
            "What Divination Is For",
            "The Two Competing Models: Prediction and Projection",
            "Learning a System Properly",
            "A Four-Step Reading Protocol",
            "Handling Ambiguity and Multiple Answers",
            "Divination as a Decision Framework",
            "What You Should Never Use Divination For",
            "Mistakes That Flatten the Results",
            "Ethical Limits on Wealth Magic",
            "Frequently Asked Questions",
        ],
        "facts": [
            "Cold reading techniques documented in psychology overlap substantially with the interpretive "
            "moves that make divinatory readings feel accurate, including the Barnum effect.",
            "Learned systems of divination improve accuracy well above chance for their own internal "
            "consistency, which is a different claim from predicting external events.",
            "The I Ching was used in China for several thousand years as both a divinatory and a "
            "philosophical text, and its 64 hexagrams encode a systematic vocabulary of situations.",
            "The Elder Futhark runic alphabet was in use across northern Europe for several centuries, and "
            "the runes served writing, naming and divination roles rather than purely mystical ones.",
        ],
        "faq": [
            ("Is divination real?",
             "There is no evidence of predictive access to future events. There is good evidence that "
             "structured random systems produce useful thinking prompts, which is how this guide uses "
             "them."),
            ("What is the easiest system to learn?",
             "For sheer speed, the I Ching. For the richest interpretive vocabulary, tarot. For the "
             "strongest link to your own context, rune casting."),
            ("Should I ask about the future?",
             "Ask about the present, where you actually have information. Future-tense questions mostly "
             "reveal your current anxieties."),
        ],
        "risk": "clarity-discipline",
    },

    "tarot": {
        "label": "Tarot Reading and Interpretation",
        "intent": "commercial",
        "cat": "tarot",
        "og": "rider-waite-tarot-beginners-guide",
        "products": ["unofficial-rider-waite-tarot", "tarot-chaos-pdf", "psi-gym", "noctem-tools"],
        "terms": [
            "how to read tarot cards", "tarot for beginners", "tarot spread guide",
            "rider waite tarot meanings", "learn tarot interpretation", "tarot cards explained",
            "three card tarot spread", "tarot reading guide",
        ],
        "h2": [
            "The Rider-Waite System and Why It Teaches So Well",
            "Structure: 22 Major Arcana, 40 Minor",
            "Court Cards Are People, Suit Cards Are Situations",
            "Position Matters More Than Card",
            "A Four-Step Reading Protocol",
            "The Spreads Worth Learning",
            "Reading for Yourself Versus Reading for Others",
            "Mistakes That Flatten the Results",
            "Ethical Limits on Wealth Magic",
            "Frequently Asked Questions",
        ],
        "facts": [
            "The Rider-Waite-Smith deck was designed in 1909 specifically so that the imagery encoded the "
            "meanings, making it the first widely used teaching deck rather than purely a codex.",
            "Rider-Waite courts are deliberately arranged with attendants facing the viewer's position, "
            "which supports the 'court cards are people' reading convention.",
            "The Major Arcana are derived largely from the Hermetic tarot attributed to Marsilio Ficino, "
            "which itself draws on Jewish and Christian esoteric sources.",
            "A deck is sold as a tool of fortune, so the commercial framing is a deliberate part of the "
            "tradition rather than a distortion of it.",
        ],
        "faq": [
            ("Is the Rider-Waite deck a real fortune-telling deck?",
             "It is primarily a teaching deck. Its card meanings are designed to be learnable, which is "
             "why it dominates study traditions."),
            ("How many cards should I learn first?",
             "The 22 Major Arcana first, then the four suits as patterns, then the courts. Reading "
             "position-by-position works before card-by-card does."),
            ("What is the best beginner spread?",
             "Three cards: situation, obstacle, direction. It is easy to interpret and hard to "
             "over-interpret."),
        ],
        "risk": "clarity-discipline",
    },

    "runes": {
        "label": "Rune Casting and the Futhark",
        "intent": "commercial",
        "cat": "runes",
        "og": "norse-runes-beginners-guide",
        "products": ["norse-rune-oracle", "noctem-tools", "psi-gym", "tarot-chaos-pdf"],
        "terms": [
            "how to read runes", "elder futhark guide", "rune meanings",
            "rune casting for beginners", "bindrune magic", "rune divination",
            "norse rune oracle review", "rune staff instructions",
        ],
        "h2": [
            "The Elder Futhark and Its Three Aettir",
            "Aettir as a Reading Structure",
            "Drawing and Laying Out",
            "Single Rune, Three Runes, and the Cross",
            "Runes as Sigils: The Modern Adaptation",
            "Bindrunes and Combined Characters",
            "What Runes Never Were",
            "Mistakes That Flatten the Results",
            "Ethical Limits on Wealth Magic",
            "Frequently Asked Questions",
        ],
        "facts": [
            "The Elder Futhark comprises 24 characters arranged in three aettir of eight, a structure that "
            "predates the Anglo-Saxon and Younger Futhark alphabets.",
            "The word 'rune' in Old Norse appears in both a writing context and an explicitly mystical "
            "one, though modern esoteric readings considerably exceed what the historical sources state.",
            "Bindrunes - characters combined into single compound glyphs - are attested in the historical "
            "record and are the direct ancestor of modern sigilisation.",
            "The Younger Futhark used 16 characters, and the Anglo-Saxon futhorc added several for "
            "sounds the original did not cover.",
        ],
        "faq": [
            ("Which runes should I learn first?",
             "The 24-rune Elder Futhark, in aettir order. Anglo-Saxon runes are an addition, not a "
             "requirement."),
            ("Do I need a rune staff?",
             "No. Casting from a bag or drawing from a spread works identically; a staff is an aesthetic "
             "and a handling aid."),
            ("Are runes divination or alphabet?",
             "Historically both - the same characters served writing and divination. Modern rune "
             "divination is a revival that borrows from both traditions."),
        ],
        "risk": "clarity-discipline",
    },

    "iching": {
        "label": "I Ching Reading",
        "intent": "commercial",
        "cat": "iching",
        "og": "iching-guide",
        "products": ["iching-oracle", "psi-gym", "noctem-tools", "norse-rune-oracle"],
        "terms": [
            "i ching how to read", "iching for beginners", "hexagram meanings",
            "i ching coin toss method", "iching consultation", "changing lines i ching",
            "hexagram 1 qian", "i ching interpretation",
        ],
        "h2": [
            "The Structure: Eight Trigrams, Sixty-Four Hexagrams",
            "The Coin Method, Properly Done",
            "Primary and Secondary Readings",
            "Changing Lines and How to Read Them",
            "Working With the Judgement and the Images",
            "Recording Readings for Later Review",
            "Using the I Ching for Decisions",
            "Mistakes That Flatten the Results",
            "Ethical Limits on Wealth Magic",
            "Frequently Asked Questions",
        ],
        "facts": [
            "The I Ching is a Chinese classic of 64 hexagrams, each built from two trigrams, that has "
            "been used for several thousand years as a divinatory and philosophical text.",
            "Three coins are traditionally tossed six times to produce a primary hexagram, with the "
            "individual coin results determining solid or broken lines.",
            "The 'changing lines' are the lines that flipped; the resulting secondary hexagram describes "
            "the situation in motion rather than the situation at rest.",
            "The probability distribution of three-coin tosses is not uniform, which is why good I Ching "
            "guides discuss which hexagrams are over-represented in practice.",
        ],
        "faq": [
            ("How many coins do I need?",
             "Three. Six throws, one per line, read from the bottom up."),
            ("What does a changing line mean?",
             "That the situation is not static - the hexagram is describing movement toward the secondary "
             "hexagram formed by the flipped lines."),
            ("Can I use an app for I Ching?",
             "Yes. The coin method is simple enough that an app is a convenience, and the app's real "
             "value is the saved journal."),
        ],
        "risk": "clarity-discipline",
    },

    # ---------------------------------------------------------- LUNAR
    "lunar": {
        "label": "Lunar and Planetary Magic",
        "intent": "commercial",
        "cat": "moon",
        "og": "lunar-phase-magic-guide",
        "products": ["lunar-phase-calculator", "astral-lab", "noctem-tools", "chaos-sigil-generator", "psi-gym"],
        "terms": [
            "moon magic rituals", "lunar phase magic", "planetary magic hours",
            "new moon ritual", "full moon workings", "planetary hours guide",
            "when to do moon magic", "lunar magic for beginners",
        ],
        "h2": [
            "What the Moon Actually Governs in Practice",
            "The Four Main Phases and Their Work",
            "Planetary Days and the Traditional Week",
            "Planetary Hours: A Practical System",
            "Building a Lunar Sigil",
            "The Astrological Conditions Worth Checking",
            "What Timing Adds and What It Does Not",
            "Mistakes That Flatten the Results",
            "Ethical Limits on Wealth Magic",
            "Frequently Asked Questions",
        ],
        "facts": [
            "Lunar phase timing is a genuine, observable variable: the moon's phase determines the "
            "proportion of its visible face that is lit, which correlates with illumination and timing of "
            "sunrise and sunset.",
            "The seven-day planetary week traces back to Babylonian and Roman practice, mapping weekdays "
            "to Chaldean order planets and to the corresponding deities.",
            "Planetary hours divide day and night into twelve segments each, with the segment rulers "
            "rotating from hour to hour - a system inherited from medieval astrology.",
            "Lunar and planetary timing adds a small, real increase to probability of coincidence, and a "
            "large increase in practitioner focus, which is the more significant effect.",
        ],
        "faq": [
            ("Do I need to know my birth chart?",
             "For lunar and planetary work, no. Astrological timing helps but is not a prerequisite for "
             "the basic practice."),
            ("Which moon phase is best for money?",
             "The waxing phases for beginning work, full moon for culmination and visibility, waning for "
             "transformation, new moon for endings and restarts."),
            ("What are planetary hours used for?",
             "They partition the day into themed windows so you can match the activity to the hour - "
             "work, communication, money and rest each have their own."),
        ],
        "risk": "grounding-discipline",
    },

    # -------------------------------------------------- REALITY HACKING
    "reality-hacking": {
        "label": "Gnosis, Belief and Paradigm Shift",
        "intent": "informational",
        "cat": "basics",
        "og": "paradigm-shift-belief-as-tool",
        "products": ["psi-gym", "mind-the-gap-pdf", "codex-chaoticus-pdf", "noctem-tools"],
        "terms": [
            "what is gnosis chaos magic", "paradigm shift", "belief as a tool",
            "how does belief change reality", "chaos magic belief system",
            "reality hacking self experiment", "placebo effect magic",
            "confirmation bias occult",
        ],
        "h2": [
            "Gnosis: Receptive Attention, Not Wishful Thinking",
            "Belief as Tool, Not as Requirement",
            "The Parabola Framework",
            "The Confirmatory Trap and How to Avoid It",
            "Running Your Own Experiment",
            "Placebo, Expectation and Honest Measurement",
            "What the Skeptical Position Gets Right",
            "Mistakes That Flatten the Results",
            "Ethical Limits on Wealth Magic",
            "Frequently Asked Questions",
        ],
        "facts": [
            "The parabola concept - magic as having no reality of its own, serving whatever end you apply "
            "it to - was central to early chaos magic theory in the 1970s.",
            "The confirmation bias effect is robust and well documented; practices that reward noticing "
            "successes and ignoring failures will appear effective almost regardless of mechanism.",
            "Expectancy effects have real measured influence on reported pain and some physiological "
            "outcomes, which is a genuine and limited effect - distinct from healing disease.",
            "A Bayesian approach to practice - keeping a record, updating on disconfirming evidence - is "
            "entirely compatible with a sincere occult commitment and markedly improves its reliability.",
        ],
        "faq": [
            ("Do you have to believe in magic for it to work?",
             "No - the standard chaos magic position is that belief is optional and useful, and a "
             "non-believer can work symbolically and get the behavioural results."),
            ("How do I avoid fooling myself?",
             "Pre-register a specific, falsifiable prediction and a deadline before you start. Then record "
             "failures as carefully as successes."),
            ("What is the difference between gnosis and visualisation?",
             "Gnosis is receptive attention to what is actually occurring. Visualisation generates the "
             "content. Most beginners overuse the second and underuse the first."),
        ],
        "risk": "epistemics-discipline",
    },

    "mind-science": {
        "label": "The Mind Science of Practice",
        "intent": "informational",
        "cat": "basics",
        "og": "zener-cards-probability-statistical-significance",
        "products": ["psi-gym", "astral-lab", "mind-the-gap-pdf", "dream-machine"],
        "terms": [
            "why does magic work placebo", "placebo effect and ritual",
            "ritual and the nervous system", "how does the placebo effect work",
            "statistical significance and spiritual claims", "costs and benefits ritual",
            "ritual for anxiety neuroscience", "the psychology of occult practice",
        ],
        "h2": [
            "Ritual Does Something Measurable to the Body",
            "The Placebo Mechanism, Stated Precisely",
            "Predictive Processing and Belief",
            "Statistical Significance and the Small-N Problem",
            "Zener Cards as a Teaching Tool",
            "Ritual as a Control Strategy",
            "Where the Skeptical Account Is Incomplete",
            "Mistakes That Flatten the Results",
            "Ethical Limits on Wealth Magic",
            "Frequently Asked Questions",
        ],
        "facts": [
            "Open-label placebo studies indicate that belief in a treatment is not always required for it "
            "to produce a measurable physiological effect, which complicates the simple 'it's all belief' "
            "account.",
            "Predictive processing accounts of the brain treat perception as hypothesis management, which "
            "provides a mechanistic account for why expectation changes experience without requiring a "
            "conscious lie to oneself.",
            "Ritual reliably produces measurable autonomic changes - lowered heart-rate variability, "
            "changed respiration - and these changes are the well-evidenced part of the 'ritual works' "
            "claim.",
            "The Zener card deck used in Rhine's ESP research has a 5-card design with a 20% hit rate by "
            "chance, which makes it a clean teaching example for statistical reasoning about psychic claims.",
        ],
        "faq": [
            ("Is magic just placebo?",
             "The placebo account captures part of the effect and misses the ritual and symbolic components, "
             "which work through commitment and attention rather than expectation of a medical outcome."),
            ("How do I know a result is real?",
             "You usually cannot from a single instance. Pre-register a falsifiable prediction, set a "
             "deadline, and count all attempts including failures."),
            ("Does ritual help anxiety?",
             "There is reasonable evidence that structured ritual reduces anxiety, and the mechanism is "
             "mostly predictability plus behavioural commitment rather than anything occult."),
        ],
        "risk": "epistemics-discipline",
    },

    # ----------------------------------------------------------- SIGILS
    "sigils": {
        "label": "Sigils: Theory and Technique",
        "intent": "informational",
        "cat": "sigils",
        "og": "how-to-make-digital-sigil-complete-guide",
        "products": ["chaos-sigil-generator", "noctem-tools", "psi-gym", "astral-lab", "codex-chaoticus-pdf"],
        "terms": [
            "how to make a sigil", "sigil creation method", "sigil charge method",
            "sigil letter reduction", "how to charge a sigil", "sigil design guide",
            "sigil activation ritual", "digital sigil generator",
        ],
        "h2": [
            "Where Sigils Come From",
            "The Two-Stage Method: Encode, Then Charge",
            "Letter Reduction Step by Step",
            "Geometric Construction: Circle, Line, Cross",
            "Charging Methods Compared",
            "Digital Sigils and Algorithmic Construction",
            "Derivatives and Consistency",
            "Mistakes That Flatten the Results",
            "Ethical Limits on Wealth Magic",
            "Frequently Asked Questions",
        ],
        "facts": [
            "Letter reduction is documented in Austin Osman Spare's 1904 'A Book of Gates', which "
            "presents a method for reducing a statement to a glyph.",
            "The visual language of sigils - circle for unity, line for the element of intent, cross at "
            "the centre - is consistent across grimoire tradition, though meanings vary by source.",
            "A digitally generated sigil is an algorithmic compression of a statement of intent into a "
            "minimal glyph, which makes it a direct application of information theory to symbolic practice.",
            "The two-stage method - reduce the statement, then charge the glyph - separates encoding from "
            "activation, and this separation is characteristic of the practice.",
        ],
        "faq": [
            ("How do I charge a sigil?",
             "Common methods include gazing, tracing with the blood or ink trace, burning, burying, and "
             "composing music. All are used; the method matters less than the state of focus."),
            ("Do I need to be good at drawing?",
             "No. The most frequently used method is deliberately rough, and digitally generated sigils "
             "are entirely standard now."),
            ("What is a derivative?",
             "A variant generated from the same letter reduction, used to keep a consistent visual "
             "identity across many operations - the same logic as a brand mark."),
        ],
        "risk": "clarity-discipline",
    },

    # ------------------------------------------------ CHAOS MAGIC BASICS
    "chaos-basics": {
        "label": "Chaos Magic Fundamentals",
        "intent": "informational",
        "cat": "basics",
        "og": "chaos-magick-beginners-guide",
        "products": ["codex-chaoticus-pdf", "noctem-tools", "chaos-sigil-generator", "psi-gym", "tarot-chaos-pdf"],
        "terms": [
            "what is chaos magic", "chaos magic for beginners", "chaos magic basic principles",
            "how to start chaos magic", "chaos magic explained", "chaos magic history",
            "chaos magic vs traditional magic", "how to become a chaos magician",
        ],
        "h2": [
            "The One Sentence Definition",
            "Where Chaos Magic Came From",
            "The Parabola Principle",
            "Belief: Optional, Useful, Instrumental",
            "The Method: Gnosis, Sigil, Declare",
            "What Chaos Magic Dropped and Why",
            "The Delusion Problem",
            "Mistakes That Flatten the Results",
            "Ethical Limits on Wealth Magic",
            "Frequently Asked Questions",
        ],
        "facts": [
            "Chaos magic emerged in the early 1970s, with the 1976 founding of the Ordo Templi "
            "Ouroborus as the conventional starting point of the modern movement.",
            "Its foundational texts are Peter Carroll's Liber Null and psi and John Crowley's Liber Kaos, "
            "both of which insisted on experiment over doctrine.",
            "The name is a play on 'chaos magic' and the Chaos enthroned motif of Aleister Crowley's "
            "book The Book of the Law, which the movement took as deliberate affiliation.",
            "Chaos magic's most durable contribution is methodological rather than metaphysical: it "
            "made it acceptable to test claims rather than inherit them.",
        ],
        "faq": [
            ("Do I have to believe in magic?",
             "No. The movement's standard position is that belief is optional, and a sceptic can practise "
             "the methods and keep the results."),
            ("Is chaos magic dangerous?",
             "Not inherently. The risks are the same as any intense self-directed practice: fixation, "
             "isolation, and sleep disruption."),
            ("What do I need to start?",
             "A statement of intent, a way to reduce it to a sigil, and a private place to charge it. "
             "That is genuinely the whole toolkit."),
        ],
        "risk": "epistemics-discipline",
    },

    # --------------------------------------------------------- TECHNOMANCY
    "technomancy": {
        "label": "Technomancy and Cyber Occultism",
        "intent": "informational",
        "cat": "advanced",
        "og": "what-is-cybermancy-digital-sorcery-guide",
        "products": ["chaos-sigil-generator", "astral-lab", "psi-gym", "noctem-tools", "codex-chaoticus-pdf"],
        "terms": [
            "technomancy", "cyberpunk magic", "cyber pagans", "digital sorcery",
            "what is technomancy", "code as ritual", "techno-sorcery",
            "cyber occultism explained", "digital magic applied",
        ],
        "h2": [
            "Defining Technomancy Without the Hype",
            "The Three Families: Applied, Cybergoth and Technopagan",
            "Why Code Is a Legitimate Sigil Medium",
            "Ritual Hardware: Setting Up the Space",
            "Signals, Feedback and Loop Rituals",
            "A Worked Example: A Self-Modifying Sigil",
            "Ethics of Working With Systems You Do Not Own",
            "Mistakes That Flatten the Results",
            "Ethical Limits on Wealth Magic",
            "Frequently Asked Questions",
        ],
        "facts": [
            "The term 'technomancy' was borrowed from Aleister Crowley's 1910 essay of the same name, "
            "where he proposed that modern technology was the next substrate for magic.",
            "Technopaganism and cybergoth movements emerged in the late 1980s and 1990s, drawing on "
            "chaos magic, industrial culture and early hacker ethics.",
            "Applied technomancy treats devices as ritual instruments - the sigil is designed to be "
            "displayed on a screen, the charge is a deliberate interaction with the interface.",
            "Cryptographic signing, generative code and algorithmic art are all direct computational "
            "analogs of sigilisation, compression, and signature respectively.",
        ],
        "faq": [
            ("Is technomancy real magic?",
             "It is a coherent application of sigil and ritual method to a new substrate. Whether the "
             "substrate changes the effect is the interesting question, and it is testable."),
            ("Why use a screen instead of paper?",
             "A screen has a distinctive perceptual quality - emissive, high-contrast, and physically "
             "unfamiliar as a ritual surface - which many practitioners find useful for focus."),
            ("Is using code for magic just programming?",
             "Partly. The generative step is ordinary code; the ritual frame around it is what makes it "
             "magickal, and the frame is doing the work."),
        ],
        "risk": "consent-discipline",
    },

    # -------------------------------------------------------- RITUAL CRAFT
    "ritual-craft": {
        "label": "Ritual Materials and Correspondences",
        "intent": "informational",
        "cat": "basics",
        "og": "how-to-charge-sigil-correctly",
        "products": ["noctem-tools", "chaos-sigil-generator", "astral-lab", "tarot-chaos-pdf"],
        "terms": [
            "incense in ritual", "ritual correspondences", "magickal tools and supplies",
            "planetary hours incense", "elements in ritual", "cannabis in magic",
            "ritual of the eye", "how to set up an altar",
        ],
        "h2": [
            "Why Materials Matter More Than Expected",
            "The Four Elements as Working Frame",
            "Instruments: Wand, Cup, Sword, Pentacle",
            "Incorrespondence: Why Smell Is the Underrated Sense",
            "Planetary Incenses and the Table",
            "Colors, Numbers and Correspondences",
            "Substance Work: Tradition, Caution and Legality",
            "Mistakes That Flatten the Results",
            "Ethical Limits on Wealth Magic",
            "Frequently Asked Questions",
        ],
        "facts": [
            "Correspondence - the linking of planets, metals, colours, numbers and days - is the "
            "organising principle of Western ceremonial magic and is codified in tables going back to "
            "the Agrippa's Three Books of Occult Philosophy in the 16th century.",
            "Agrippa's three books, published 1533, were the first major printed Western synthesis of "
            "planetary, angelic and demonic hierarchies and remain a primary source for the tables.",
            "Olfactory memory is unusually durable and largely independent of verbal memory, which "
            "explains why a distinctive incense becomes an effective ritual anchor.",
            "Cannabis has documented use in multiple religious and magical traditions including some "
            "Hindu, Rastafarian and folk-Christian contexts - and its legal status varies sharply by "
            "jurisdiction, which is a real practical constraint.",
        ],
        "faq": [
            ("Do I need expensive ritual tools?",
             "No. A pen, paper, and a private hour are sufficient for nearly all chaos magic work. "
             "Traditional apparatus is largely aesthetic and frame-setting."),
            ("Why does everyone say match instead of candle?",
             "A match gives a small controllable flame plus a visible extinguishing action, which maps "
             "neatly onto the charge-and-dismiss structure. Candles work equally well."),
            ("Do correspondences matter mechanically?",
             "They matter as a memory and coherence system. Using them consistently gives you a stable "
             "structure to build work inside."),
        ],
        "risk": "grounding-discipline",
    },

    # ------------------------------------------------------------ HISTORY
    "history-occult": {
        "label": "History of the Occult",
        "intent": "informational",
        "cat": "advanced",
        "og": "history-of-chaos-magick",
        "products": ["codex-chaoticus-pdf", "tarot-chaos-pdf", "liber-lvpinux-pdf", "noctem-tools"],
        "terms": [
            "history of occultism", "history of magic grimoires", "satanic panic history",
            "ceremonial magic history", "hermetic tradition history", "magic history timeline",
            "western esotericism explained", "grimmoire history",
        ],
        "h2": [
            "Three Thousand Years in One Outline",
            "Mesopotamian, Egyptian and Greek Roots",
            "The Grimoire Tradition",
            "The Renaissance and the Hermetic Corpus",
            "The Golden Dawn and the Order of the Golden Dawn",
            "The 20th Century: Crowley, Spare, and the Chaos Current",
            "Reading a Primary Source Without Fooling Yourself",
            "Mistakes That Flatten the Results",
            "Ethical Limits on Wealth Magic",
            "Frequently Asked Questions",
        ],
        "facts": [
            "The Ars Notoria, Ars Almadel and the Lemuria are among the earliest grimoires, compiled in "
            "medieval to early-modern Western Europe and drawing on Arabic, Jewish and Latin sources.",
            "The Hermetic Corpus was translated into Latin in the 15th century and synthesised with "
            "Judaic and Christian material, producing the Renaissance magicians as we understand them.",
            "The Golden Dawn, founded in 1888, was the most significant British occult order of the 19th "
            "century and its initiatory material shaped most later ceremonial practice.",
            "The term 'occult' entered English in the 16th century from 'occultare' - to hide - which is a "
            "transcription of the same Latin root as 'occult science', a term now associated with "
            "hidden knowledge rather than hidden arts.",
        ],
        "faq": [
            ("What is a grimoire?",
             "A book of practical instruction, originally a term of disparagement - 'grimoire' comes from "
             "the Greek grimoire, grim, 'a black book'."),
            ("Which grimoires matter most?",
             "The Ars Goetia, the Lemuria, the Lesser Key of Solomon and the Grimorium Verum, plus the "
             "modern Liber Null and Liber Kaos for practice."),
            ("Is occult history mostly fraud?",
             "Partly. There is genuine scholarly work in the field, and it is worth reading by people who "
             "interrogate their sources."),
        ],
        "risk": "epistemics-discipline",
    },

    # ------------------------------------------------------- COMPARATIVE
    "comparative": {
        "label": "Comparing Magical Traditions",
        "intent": "informational",
        "cat": "basics",
        "og": "chaos-magick-beginners-guide",
        "products": ["codex-chaoticus-pdf", "tarot-chaos-pdf", "noctem-tools", "psi-gym"],
        "terms": [
            "chaos magic vs thelema", "chaos magic vs wicca", "chaos vs ceremonial magic",
            "differences between magic traditions", "chaos magic vs theosophy",
            "left hand path vs right hand", "which type of magic to practice",
            "comparing western magic traditions",
        ],
        "h2": [
            "Why Comparison Is the Fastest Way to Decide",
            "The Axes That Actually Distinguish Traditions",
            "Chaos Magic vs Thelema",
            "Chaos Magic vs Ceremonial Magic",
            "Chaos Magic vs Wicca and Modern Paganism",
            "Left-Hand and Right-Hand Paths",
            "Choosing Your Own Combination",
            "Mistakes That Flatten the Results",
            "Ethical Limits on Wealth Magic",
            "Frequently Asked Questions",
        ],
        "facts": [
            "The Thelema was founded by Aleister Crowley in 1904 following his receipt of the Book of the "
            "Law, and remains an initiatory tradition with a formal grade structure.",
            "Wicca as a modern craft was largely reconstructed in the 1950s by occultists including "
            "Gerard Gardner, and its own history is a subject of ongoing scholarly dispute.",
            "The left-hand path and right-hand path distinction is a modern esoteric framework rather than "
            "a historical one, though it maps loosely onto initiatory versus public-access models.",
            "Crowley's dictum 'do what thou wilt' is quoted more often and understood less often than any "
            "other line in modern esotericism.",
        ],
        "faq": [
            ("Is chaos magic compatible with Wicca?",
             "They are compatible in practice and different in structure. Wicca is initiatory and "
             "seasonal; chaos magic is self-directed and non-initiatory."),
            ("Do I have to pick one tradition?",
             "Almost nobody who takes this seriously sticks to one. The synthesis is the norm in "
             "contemporary practice."),
            ("What is the left-hand path?",
             "A modern term for individualistic practice without initiatory structure, self-directed and "
             "often experimental. It is a description, not a lineage."),
        ],
        "risk": "epistemics-discipline",
    },

    # ---------------------------------------------------------- MYTHOLOGY
    "mythology-ancient": {
        "label": "Ancient Mythology and Speculation",
        "intent": "informational",
        "cat": "advanced",
        "og": "history-of-chaos-magick",
        "products": ["codex-chaoticus-pdf", "norse-rune-oracle", "astral-lab", "noctem-tools"],
        "terms": [
            "annunaki", "ancient astronauts theory", "atlantis debunked",
            "ancient gods of money", "mythology and modern magic", "forbidden archaeology",
            "ancient mystery traditions", "mythological origins explained",
        ],
        "h2": [
            "What the Sources Actually Say",
            "The Annunaki: Mesopotamian Context",
            "Forbidden Archaeology and Its Methodology",
            "Atlantis: Plato, and Two Thousand Years of Invention",
            "Ancient Gods of Money: A Working Hypothesis",
            "How to Read a Mythological Claim Without Fooling Yourself",
            "What Remains Worth Studying",
            "Mistakes That Flatten the Results",
            "Ethical Limits on Wealth Magic",
            "Frequently Asked Questions",
        ],
        "facts": [
            "The Annunaki appear in the Sumerian Enuma Elish, where they are described as a group of "
            "deities from a distant planet who created humans as labour - a reading that was popularised "
            "by the 'ancient astronaut' hypothesis.",
            "Sumerian and Akkadian tablets were excavated and deciphered in the nineteenth and twentieth "
            "centuries, and the translations are public and checkable.",
            "Atlantis appears in Plato's Timaeus and Critias as a literary device, and no contemporary "
            "source mentions it; it became a cultural invention after 19th century use.",
            "The Epic of Gilgamesh, the Egyptian Book of the Dead, the Norse Eddas and the Hindu "
            "Mahabharata all contain large corpora of ritual and mythological material in translation.",
        ],
        "faq": [
            ("Is Atlantis real?",
             "No evidence for a historical Atlantis exists. It is a philosophical allegory in Plato, "
             "though it generated a large and interesting literary tradition."),
            ("Were the Annunaki aliens?",
             "The ancient source says gods from a distant land. Reading that as spacecraft is a 20th "
             "century addition to a mythological text."),
            ("How do I read old sources?",
             "Find a translation, check the translator's notes, and read two versions. Never rely on a "
             "quotation without its surrounding context."),
        ],
        "risk": "epistemics-discipline",
    },

    # -------------------------------------------------------- PHILOSOPHY
    "philosophy": {
        "label": "Philosophy of the Occult",
        "intent": "informational",
        "cat": "advanced",
        "og": "what-is-magick-how-spells-work",
        "products": ["codex-chaoticus-pdf", "mind-the-gap-pdf", "liber-lvpinux-pdf", "noctem-tools"],
        "terms": [
            "nothing is true everything is permitted", "occult philosophy",
            "belief and magic philosophy", "is magic real philosophy",
            "chaos magic controversies", "delusion in occult practice",
            "philosophy of magic", "free will and magic",
        ],
        "h2": [
            "Is Nothing True, Everything Permitted?",
            "The Problem of Belief",
            "Delusion: Where the Line Sits",
            "Free Will and Responsibility Under the Parabola",
            "Ethics Without Authority",
            "The Skeptic's Legitimate Objections",
            "What Survives the Objections",
            "Mistakes That Flatten the Results",
            "Ethical Limits on Wealth Magic",
            "Frequently Asked Questions",
        ],
        "facts": [
            "The phrase 'nothing is true, everything is permitted' appears in Aleister Crowley's Book of "
            "the Law, third stanza of verse I - quoted far more often than its context, which asserts a "
            "discipline of sincerity rather than a licence.",
            "Philosophical idealism, Gnostic dualism and mystical monism have each provided different "
            "framings for the relationship between practitioner and world across the traditions.",
            "Epistemological relativism, moral nihilism and practical occultism are three quite different "
            "positions routinely collapsed into that single Crowleyan line.",
            "The paraconsistent position - that some propositions need not resolve to true or false - has "
            "interesting application to magical frameworks, and is a live topic in philosophy of "
            "language.",
        ],
        "faq": [
            ("Does nothing is true mean anything goes?",
             "No, and that reading is a misquotation. Crowley framed it as a demand for sincerity, not "
             "an exemption from ethics."),
            ("How do I know when I am being delusional?",
             "Delusion involves firm belief that contradicts reality despite evidence and despite your "
             "wanting to believe. Occult practice at its most effective is interpretive, not delusional."),
            ("Is the parabola cynical?",
             "It is a framing device. Read it as a constraint on your own attachments rather than a "
             "claim about cosmic deception."),
        ],
        "risk": "epistemics-discipline",
    },

    # ------------------------------------------------------------ SCAMS
    "scams-skepticism": {
        "label": "Spotting Scams and False Teachers",
        "intent": "informational",
        "cat": "reviews",
        "og": "best-chaos-magick-books-essential-reading",
        "products": ["codex-chaoticus-pdf", "tarot-chaos-pdf", "liber-lvpinux-pdf", "psi-gym"],
        "terms": [
            "how to spot a magic scam", "false spiritual teacher signs",
            "spiritual grifting", "how to tell if a tarot reader is a fraud",
            "occult scam warning signs", "cult dynamics in esoteric spaces",
            "how to identify fake healers", "esoteric red flags",
        ],
        "h2": [
            "The Four Canonical Scam Shapes",
            "Urgency and Isolation",
            "Paid Initiation and Rank Inflation",
            "The Curse That Requires a Cure",
            "Sycophancy and the Info-Treadmill",
            "How to Vet a Teacher or Book",
            "When to Leave a Community",
            "Mistakes That Flatten the Results",
            "Ethical Limits on Wealth Magic",
            "Frequently Asked Questions",
        ],
        "facts": [
            "Charismatic cult dynamics have a well-developed research literature describing identity "
            "consolidation, insulation from outside critique, and incremental commitment escalation.",
            "Cognitive dissonance reduction is the standard mechanism cited for why members become "
            "increasingly committed to claims that would otherwise be obviously weak.",
            "A common pattern in fraudulent healing is a diagnosis that only the practitioner can resolve "
            "and whose resolution requires continued payment.",
            "Esoteric communities tend to be unusually vulnerable because the epistemic standards of the "
            "field are already loose, which lowers the cost of a sophisticated con.",
        ],
        "faq": [
            ("How do I know if my teacher is legitimate?",
             "They do not require payment for basic information, do not isolate you, do not claim "
             "unfalsifiability, and do not make you feel broken in order to sell a cure."),
            ("Is buying courses a scam?",
             "Not inherently. It is a scam if the sales framing depends on fear of a curse, on rank "
             "escalation, or on you being unable to leave."),
            ("What should I do if I've been scammed?",
             "Disengage from the material first, because the interpretive frame is the mechanism. Then "
             "deal with the financial and, if there is coercion, the legal dimension."),
        ],
        "risk": "epistemics-discipline",
    },

    # ------------------------------------------------------- OCCULT CULTURE
    "occult-culture": {
        "label": "Occult Culture and Modern Practice",
        "intent": "informational",
        "cat": "basics",
        "og": "cyber-paganism-digital-spirituality-guide",
        "products": ["codex-chaoticus-pdf", "tarot-chaos-pdf", "noctem-tools", "psi-gym"],
        "terms": [
            "occult culture today", "south america witchcraft", "punk magic diy occult",
            "modern witch movement", "chaos magic in popular culture", "occult internet culture",
            "witchcraft in latin america", "contemporary occult scene",
        ],
        "h2": [
            "How the Occult Went Online",
            "Regional Variation Is Real",
            "Punk, DIY and Anti-Institutional Practice",
            "The Meme as Sigil",
            "Comics, Film and the Public Image",
            "Do's and Don'ts for a New Practitioner",
            "Building a Practice That Survives Attention",
            "Mistakes That Flatten the Results",
            "Ethical Limits on Wealth Magic",
            "Frequently Asked Questions",
        ],
        "facts": [
            "The contemporary occult audience is overwhelmingly online, and the search-and-forum model "
            "of discovery has replaced most older initiatory routes.",
            "Witchcraft traditions in Peru, Mexico, Brazil and the Caribbean differ substantially from "
            "Northern European reconstruction, often preserving plant knowledge and family practice that "
            "never passed through Wicca.",
            "Punk occult and industrial subcultures have been a consistent site of DIY magical practice "
            "since the late 1970s, running parallel to formal orders.",
            "Meme-based practices such as the KEK archetype function as genuinely shared symbolic objects, "
            "and their spread is a live case study in collective reinforcement.",
        ],
        "faq": [
            ("Should I follow a single teacher?",
             "Not indefinitely. A teacher is useful for a defined skill; a single figure for a decade is "
             "the most common structural risk in the field."),
            ("What books are worth reading first?",
             "Liber Null and Liber Kaos for method, plus one good history book to keep you honest about "
             "provenance."),
            ("Is it ok to be public about it?",
             "Completely. Contemporary practice is largely public, and obscurity is no longer a "
             "protection."),
        ],
        "risk": "epistemics-discipline",
    },

    # --------------------------------------------------------- HORROR LORE
    "horror-lore": {
        "label": "Horror Fiction and Weird Cosmology",
        "intent": "informational",
        "cat": "advanced",
        "og": "psychonaut-guide-consciousness-exploration",
        "products": ["eerieroads", "astral-lab", "noctem-tools", "codex-chaoticus-pdf"],
        "terms": [
            "lovecraft cthulhu explained", "weird fiction cosmology", "the call of cthulhu",
            "eldritch horror explained", "lovecraft and chaos magic",
            "cosmic horror philosophy", "weird tales authors", "cthulhu system explained",
        ],
        "h2": [
            "The Weird Tale as a Literary Form",
            "Lovecraft's Cosmology",
            "Influence on Modern Occult Practice",
            "The Outsider as an Archetype",
            "Fear as a Cognitive Tool",
            "Where Lovecraft's Metaphors Still Land",
            "Reading Without Endorsement",
            "Mistakes That Flatten the Results",
            "Ethical Limits on Wealth Magic",
            "Frequently Asked Questions",
        ],
        "facts": [
            "H. P. Lovecraft's mythos is a shared fictional cosmology developed across his stories and "
            "extended by later writers, centred on non-human intelligences older than humanity.",
            "The 1928 essay ' Supernatural Horror in Literature' is Lovecraft's own statement of the weird "
            "tale as a distinct literary mode, and it is short and worth reading.",
            "Lovecraft's racial views are explicit in his private correspondence, which is relevant to "
            "reading his work critically rather than nostalgically.",
            "The influence of the mythos on modern occult practice is largely a matter of imagery and "
            "vocabulary rather than structured ritual content.",
        ],
        "faq": [
            ("Is Lovecraft worth reading today?",
             "As a stylist yes, with the caveat that his worldview is genuinely repugnant and he was "
             "aware of it."),
            ("Does the Cthulhu system exist?",
             "No. It is a fictional cosmology with no historical basis, and it is often mistaken for one "
             "because it is so widely referenced."),
            ("What is cosmic horror?",
             "A literary mode in which the truth of the universe is frightening rather than comforting, "
             "and human significance is a local illusion."),
        ],
        "risk": "epistemics-discipline",
    },

    # ------------------------------------------------------------ PRAYER
    "prayer": {
        "label": "Devotional and Protective Prayer",
        "intent": "informational",
        "cat": "basics",
        "og": "how-to-banish-cleanse-space",
        "products": ["noctem-tools", "manual-activacion-servidores-magicos-pdf", "arcana-goetia", "psi-gym"],
        "terms": [
            "prayer to saint cyprian", "prayer for protection from enemies",
            "saint marta prayer", "prayer for money", "protective prayer traditional",
            "oracion de proteccion", "how to pray for victory", "popular magic prayer",
        ],
        "h2": [
            "What These Prayers Are Doing Structurally",
            "Saint Cyprian and the Destructive Frame",
            "Saint Martha and the Transactional Frame",
            "Writing Your Own Petition",
            "Recitation, Rhythm and Repetition",
            "Adaptation Without Dishonesty",
            "When Prayer and Sigil Practice Combine",
            "Mistakes That Flatten the Results",
            "Ethical Limits on Wealth Magic",
            "Frequently Asked Questions",
        ],
        "facts": [
            "The Saint Cyprian and Saint Martha prayers circulate in Spanish and Portuguese folk magic, "
            "and both involve the framing of a problem for removal or resolution rather than a request "
            "for favour.",
            "In the folk frame, Saint Cyprian is associated with breaking hexes and the Saint Martha prayer "
            "with victory over obstacles - an allocation that reflects their devotional origins.",
            "Repeated recitation functions as a cognitive availability primer, keeping a defined set of "
            "instructions active and reducing decision load.",
            "Many of these prayers are explicitly framed as 'if you are willing to do this work' - a "
            "condition that the traditional reading treats as part of the operative text.",
        ],
        "faq": [
            ("Do these prayers work?",
             "As structured focus practices they work reliably, and the folk tradition that produced them "
             "has clear mechanisms of behavioural change built in."),
            ("Can I adapt them?",
             "Traditional practice permits adaptation within a fairly loose structure, though changing the "
             "saint or removing the condition is considered significant."),
            ("Is this the same as magic?",
             "Functionally similar, structurally different. Prayer petitions; sigils command. The "
             "difference matters more than most practitioners admit."),
        ],
        "risk": "consent-discipline",
    },

    # ------------------------------------------------------------- MUSIC
    "music-magick": {
        "label": "Music as Magickal Technology",
        "intent": "informational",
        "cat": "advanced",
        "og": "astral-projection-techniques-beginners",
        "products": ["astral-lab", "psi-gym", "noctem-tools", "dream-machine"],
        "terms": [
            "musical ritual", "cthulhu orchestra", "binaural beats and magic",
            "soundscape for ritual", "music for astral projection", "binaural frequencies gnosis",
            "ritual ambient", "music as sigil",
        ],
        "h2": [
            "Sound as the Fastest Ritual Carrier",
            "The Mapping: Pitch, Rhythm, Duration",
            "Why Binaural Beats Are Contested",
            "Composing a Sigil in Sound",
            "Music for Gnosis: Drone, Entrainment and Repetition",
            "Working With the Demonoi soundtrack as a Series",
            "Practical Listening and Recording Notes",
            "Mistakes That Flatten the Results",
            "Ethical Limits on Wealth Magic",
            "Frequently Asked Questions",
        ],
        "facts": [
            "Binaural beats require headphones and produce a perceived pitch difference between ears; the "
            "claimed entrainment and cognitive effects remain poorly replicated in controlled studies.",
            "Entrainment - the tendency for neural oscillation to align with external rhythm - is a real "
            "and reasonably studied phenomenon, though its behavioural consequences are modest.",
            "Music has been a structural component of ritual in most traditions examined by "
            "anthropologists, and its role in masking speech that must be heard but not understood is "
            "well documented.",
            "Musical ritual works through predictable physiological coupling with tempo, which makes it one "
            "of the more reliable non-pharmacological state-shifters available.",
        ],
        "faq": [
            ("Do binaural beats work?",
             "The perceptual effect is real with headphones. The cognitive claims are weakly supported. "
             "Treat them as atmosphere, not technology."),
            ("What music works best for ritual?",
             "Something with a strong, regular pulse and no lyrical content competing for attention."),
            ("Can I make a sigil out of sound?",
             "Yes, and this is one of the most underused approaches - encode the statement as rhythm and "
             "interval, and the audio becomes the glyph."),
        ],
        "risk": "self-care-discipline",
    },

    # ----------------------------------------------------------- CREATURES
    "creatures-vampire": {
        "label": "Vampirism and Creature Lore",
        "intent": "informational",
        "cat": "advanced",
        "og": "psychonaut-guide-consciousness-exploration",
        "products": ["eerieroads", "noctem-tools", "codex-chaoticus-pdf", "astral-lab"],
        "terms": [
            "becoming a vampire", "vampire lore explained", "werewolf ritual",
            "vampirism practice modern", "creature transformation magick",
            "mythological creatures and magic", "vampire energy work",
        ],
        "h2": [
            "Vampirism in Folklore and in Practice",
            "What the Literary Vampire Is Not",
            "Blood and Energy: The Two Traditions",
            "Practice-Oriented Approach",
            "Werewolves and the Continental Tradition",
            "Why Transformation Practice Is Risky",
            "Reading Creature Lore Without Identity Absorption",
            "Mistakes That Flatten the Results",
            "Ethical Limits on Wealth Magic",
            "Frequently Asked Questions",
        ],
        "facts": [
            "The European literary vampire is a relatively modern literary construction, assembled from "
            "several folk traditions in the 18th and 19th centuries rather than from a single ancient "
            "source.",
            "The Liber Lvpinux does not contain a werewolf transformation ritual; the claim that it does "
            "is a recurring error in online occult content.",
            "Vampiric energy practice as a modern occult technique borrows from both the vampire's "
            "life-energy motif and from a broader tradition of energy-work framing.",
            "Identity-absorbing practice - ritual work around becoming a creature - carries documented "
            "psychological risk, particularly in the context of dissociation or psychotic vulnerability.",
        ],
        "faq": [
            ("Can you become a vampire?",
             "As a practice and an identity, yes. As a physical transformation, no - there is no "
             "mechanism and the historical sources do not support it."),
            ("Is vampirism harmful?",
             "For most people, framed as energy and boundary practice, no. The risk is in treating it as "
             "a literal identity replacement, which is a psychological rather than occult danger."),
            ("Does Liber Lvpinux cover werewolves?",
             "No, and any source claiming it does should be read with suspicion."),
        ],
        "risk": "medical-boundary",
    },

    # --------------------------------------------------------- PSYCHONAUT
    "psychonaut": {
        "label": "Psychonautics and Altered States",
        "intent": "informational",
        "cat": "dreaming",
        "og": "psychonaut-guide-consciousness-exploration",
        "products": ["astral-lab", "psi-gym", "dream-machine", "noctem-tools", "lucid-dream"],
        "terms": [
            "psychonautics guide", "how to explore consciousness", "hypnosis and occultism",
            "altered states of consciousness", "psychedelics and magic",
            "psychonaut methods", "consciousness exploration beginner",
        ],
        "h2": [
            "Psychonautics as a Practice, Not a Subculture",
            "The Safety Framework That Comes First",
            "Gnosis, Dream and Meditation as Core Methods",
            "Hypnosis: What It Is and Is Not",
            "The Dissolution Experience",
            "Set and Setting, Honestly",
            "Integration: The Part Everyone Skips",
            "Mistakes That Flatten the Results",
            "Ethical Limits on Wealth Magic",
            "Frequently Asked Questions",
        ],
        "facts": [
            "Dissolution - a reported sense of ego boundaries becoming permeable - is a well-documented "
            "element of altered states across meditation, hypnosis and psychedelics.",
            "Set and setting are the most widely replicated variables affecting the valence of an altered "
            "state experience.",
            "Integration - the deliberate processing of a difficult or unusual experience afterwards - is "
            "strongly associated with better outcomes, and is the step most often omitted.",
            "Hyperventilation, breath-holding and sleep deprivation all reliably alter consciousness and "
            "all carry genuine physiological risk.",
        ],
        "faq": [
            ("Is psychonautics safe?",
             "Mostly, if you avoid the riskier methods and integrate properly. Breath-holding and "
             "sleep-deprivation techniques carry real, non-psychological danger."),
            ("Does hypnosis give you real power?",
             "It reliably gives you access to attention, imagery and suggestion - which is substantial, but "
             "not supernatural."),
            ("What is integration?",
             "Deliberately reviewing and making sense of an unusual experience in a sober state. Skipping it "
             "is associated with worse outcomes."),
        ],
        "risk": "medical-boundary",
    },

    # --------------------------------------------------------------- TIME
    "time": {
        "label": "Time and Causality",
        "intent": "informational",
        "cat": "advanced",
        "og": "what-is-magick-how-spells-work",
        "products": ["chaos-sigil-generator", "noctem-tools", "psi-gym", "lunar-phase-calculator"],
        "terms": [
            "time magic ritual", "dominate time chaos magic", "sigils of time",
            "time manipulation occult", "causality in magic", "chrono magic",
            "accelerate manifestation", "time and ritual practice",
        ],
        "h2": [
            "What 'Time Magic' Usually Means",
            "Three Interpretations: Urgency, Sequence and Control",
            "The Urgency Practice",
            "Sequencing as the Real Mechanism",
            "Ritual and Perceived Duration",
            "What Cannot Be Changed",
            "Building a Time Sigil Honestly",
            "Mistakes That Flatten the Results",
            "Ethical Limits on Wealth Magic",
            "Frequently Asked Questions",
        ],
        "facts": [
            "Subjective time perception is famously elastic under attention, boredom, and threat, and "
            "retrieval practice confirms that elapsed time is remembered rather than stored.",
            "Sequencing - establishing an order of operations - is the component of time work with the most "
            "practical payoff, and it is what ritual instruction mostly encodes.",
            "The observer effect in quantum mechanics concerns measurement, not macroscopic practical "
            "causation, and conflating the two is a common error in popular occult writing.",
            "Ritual duration is often prescribed in units that differ from clock time - candles, "
            "repetitions, tides - which is a structuring device rather than a metaphysical claim.",
        ],
        "faq": [
            ("Can I speed up manifestation?",
             "You can remove the delay caused by indecision, which is most of the perceived wait. The "
             "remaining delay is genuinely about the world, not about you."),
            ("What is a time sigil for?",
             "Marking a beginning. Use it at the moment you start, not to reverse a schedule."),
            ("Is quantum mechanics the same as magic?",
             "No. Quantum effects are real but apply at scales and conditions where magic is irrelevant."),
        ],
        "risk": "epistemics-discipline",
    },

    # ---------------------------------------------------------- LANGUAGE
    "language-speech": {
        "label": "Language, Speech and Expression",
        "intent": "informational",
        "cat": "advanced",
        "og": "what-is-magick-how-spells-work",
        "products": ["noctem-tools", "chaos-sigil-generator", "codex-chaoticus-pdf", "psi-gym"],
        "terms": [
            "sigil for eloquence", "language magic ritual", "sigils for learning a language",
            "speech and confidence ritual", "communication sigil chaos",
            "tongue and words magic", "vocabulary improvement ritual",
        ],
        "h2": [
            "Speech as the Original Sigil",
            "Building a Sigil for Eloquence",
            "Sigils for Language Learning",
            "The Relationship Between Words and Influx",
            "Tongue, Throat and Will in the Correspondence Tables",
            "Practice Protocols: Reading Aloud, Writing Daily",
            "When Ritual Is Not Enough",
            "Mistakes That Flatten the Results",
            "Ethical Limits on Wealth Magic",
            "Frequently Asked Questions",
        ],
        "facts": [
            "Language is the most directly magickal technology humans have, because it is a symbolic system "
            "that reliably changes non-speakers' behaviour.",
            "The correspondence tradition associates the throat and tongue with creative expression and "
            "will, which is a symbolic rather than anatomical claim.",
            "Spaced repetition and deliberate retrieval are among the most robustly replicated findings in "
            "second-language acquisition, and a sigil serves well as a commitment to them.",
            "Speech rate and fluency are reliably affected by anxiety, and the anxiety reduction that "
            "accompanies successful ritual practice tends to improve both.",
        ],
        "faq": [
            ("Can a sigil help me learn a language?",
             "It can commit you to a daily practice, which is the only variable that matters for language "
             "acquisition."),
            ("What sigil is good for speaking well?",
             "Build it from an imperative about your own speech - fluency, clarity, poise - rather than "
             "about the audience's reaction."),
            ("Why is speech considered magical?",
             "Because it changes minds. That is a real causal power and it needs no metaphysics to be "
             "significant."),
        ],
        "risk": "clarity-discipline",
    },

    # --------------------------------------------------------- LARVAE etc
    "astral-parasites": {
        "label": "Astral Larvae and Entity Removal",
        "intent": "informational",
        "cat": "dreaming",
        "og": "lucid-dreaming-guide",
        "products": ["astral-lab", "noctem-tools", "lucid-dream", "psi-gym", "eerieroads"],
        "terms": [
            "astral larvae", "how to remove astral parasites", "entity attachment removal",
            "parasite spirit ritual", "astral cleansing", "nightmare entity removal",
            "energetic cleansing astral", "how to clear astral body",
        ],
        "h2": [
            "Where the Idea Comes From",
            "Modern 'Astral Larva' as a Practitioner Concept",
            "Interpretation: Sleep Paralysis, Intrusions, and Stress",
            "The Removal Protocol",
            "Banishing, Cleansing and Grounding Distinguished",
            "Sigils for Clearing",
            "When It Is Actually a Sleep Problem",
            "Mistakes That Flatten the Results",
            "Ethical Limits on Wealth Magic",
            "Frequently Asked Questions",
        ],
        "facts": [
            "Sleep paralysis - a waking state with retained muscle atonia - is a well-documented REM sleep "
            "phenomenon with a substantial prevalence, and it is frequently interpreted as an intruder "
            "experience.",
            "Hypnagogic and hypnopompic hallucinations, common around sleep onset and waking, are "
            "neurophysiological and are the most common source of perceived intrusive entities.",
            "The 'astral parasite' concept is not a standard term in classical occult literature and "
            "appears to be a 20th and 21st century practitioner coinage.",
            "Night terrors, which occur in deep non-REM sleep, are a different phenomenon from REM "
            "intrusions and occur predominantly in childhood.",
        ],
        "faq": [
            ("Are astral larvae real?",
             "The experiences that generate the belief are real and well understood neurologically. The "
             "entity interpretation is a culturally specific frame placed over them."),
            ("How do I remove one?",
             "Improve sleep regularity, address sleep position and stress, and use your banishing ritual as "
             "a settling practice. The ritual helps; the sleep work is what actually resolves it."),
            ("Should I worry?",
             "Rarely. If the experience is recurrent and distressing, treat it as a sleep disorder and see "
             "a clinician rather than escalating the occult framing."),
        ],
        "risk": "medical-boundary",
    },

    # ------------------------------------------------------ SECRET KNOWLEDGE
    "secret-knowledge": {
        "label": "Hidden, Lost and Forbidden Knowledge",
        "intent": "informational",
        "cat": "advanced",
        "og": "best-chaos-magick-books-essential-reading",
        "products": ["codex-chaoticus-pdf", "liber-lvpinux-pdf", "tarot-chaos-pdf", "noctem-tools"],
        "terms": [
            "occult secrets", "hidden knowledge grimoires", "forbidden books of magic",
            "lost esoteric texts", "the book of enoch explained", "liber null pdf",
            "necronomicon explained", "secret teachings magic", "ancient grimoire list",
        ],
        "h2": [
            "Where 'Forbidden' Text Comes From",
            "How to Evaluate a Claim of Hidden Knowledge",
            "The Survival of Texts: Why Grimoires Persist",
            "Building a Personal Canon",
            "Recommendation Is Not Truth",
            "The 'Top 10' Problem",
            "Reading Primary Sources Properly",
            "Mistakes That Flatten the Results",
            "Ethical Limits on Wealth Magic",
            "Frequently Asked Questions",
        ],
        "facts": [
            "The Book of Enoch is among the oldest surviving fragments of Jewish apocalyptic literature, "
            "partly preserved in the Dead Sea Scrolls and known to some church fathers before it was "
            "excluded from most modern Bibles.",
            "Liber Null and psi, published by Peter Carroll in 1977, is short, inexpensive, and still the "
            "most widely used entry point into chaos magic practice.",
            "The Kybalion, published anonymously in 1908, is not attributed to any known author and its "
            "provenance claims are unsupported - a fact worth knowing before taking its seven principles "
            "as historical.",
            "Grasping for a single definitive book is the most common error in self-directed occult study, "
            "because the tradition is inherently plural.",
        ],
        "faq": [
            ("What is the best book to start with?",
             "Liber Null for practice, a solid history for context, and a good introduction to one "
             "divinatory system. No single book covers the field."),
            ("Is the Kybalion real Hermeticism?",
             "No. It was published in 1908 under no author attribution and its claims of provenance do not "
             "hold up."),
            ("How do I know a grimoire is genuine?",
             "You usually cannot, and that is a normal condition of the field. Work with what is useful and "
             "keep your epistemic claims modest."),
        ],
        "risk": "epistemics-discipline",
    },

    # ------------------------------------------------------------- TRAVEL
    "travel-movement": {
        "label": "Travel, Crossing and Movement",
        "intent": "informational",
        "cat": "advanced",
        "og": "bindrune-wealth-protection-fehu-algiz-othala",
        "products": ["lunar-phase-calculator", "astral-lab", "noctem-tools", "norse-rune-oracle"],
        "terms": [
            "travel protection sigil", "safe journey ritual", "crossing between worlds",
            "astral travel practice", "protection while travelling occult", "threshold magic",
            "journey ritual protection", "banishing before travel",
        ],
        "h2": [
            "Thresholds as the Oldest Occult Problem",
            "Protection Before, During and After",
            "Between Places: Astral and Imaginal Crossing",
            "Building a Journey Sigil",
            "Runes for Safe Passage",
            "Why Departure Rituals Are Underrated",
            "Practical Preparation Over Symbol",
            "Mistakes That Flatten the Results",
            "Ethical Limits on Wealth Magic",
            "Frequently Asked Questions",
        ],
        "facts": [
            "Threshold protection rituals appear independently across Mediterranean, Germanic, Norse, "
            "Hindu and Mesoamerican traditions, which is strong evidence the function rather than the "
            "form is universal.",
            "The Elder Futhark contains runes explicitly associated with travel and safety, and their "
            "combination for journeys is traditional rather than modern invention.",
            "Norse tradition held house-spirit duties at thresholds, and the practice of leaving the home "
            "ritually clean before departure appears in multiple northern traditions.",
            "Preparatory ritual in general outperforms improvisational ritual, because the planning stage "
            "is where most practical risk reduction happens.",
        ],
        "faq": [
            ("What should I do before a flight?",
             "Banish, then set a sigil for the specific journey, then check your actual documents. In that "
             "order, and the last step matters most."),
            ("Is astral travel a real method?",
             "It is a real practice with a real literature, though controlled verification of "
             "out-of-body claims remains outstanding."),
            ("Why banish before travelling?",
             "To close the current situation cleanly so you are not carrying unfinished state into an "
             "uncontrolled environment."),
        ],
        "risk": "grounding-discipline",
    },

    # ------------------------------------------------------------- BINDING
    "binding-relationships": {
        "label": "Binding, Contracts and Agreements",
        "intent": "informational",
        "cat": "advanced",
        "og": "how-to-banish-cleanse-space",
        "products": ["noctem-tools", "manual-activacion-servidores-magicos-pdf", "chaos-sigil-generator"],
        "terms": [
            "binding ritual", "magickal contract", "binding of love",
            "how to bind someone chaos magic", "contract magic", "oath and binding",
            "binding sigil", "protection from betrayal",
        ],
        "h2": [
            "The Ethics of Binding Before the Technique",
            "Where Bindings Come From",
            "The Classical Binding Structure",
            "Sigils for Fidelity and Honesty",
            "The Asymmetry Problem",
            "Binding Yourself as the Safer Operation",
            "Release and Discharge",
            "Mistakes That Flatten the Results",
            "Ethical Limits on Wealth Magic",
            "Frequently Asked Questions",
        ],
        "facts": [
            "Binding ritual is one of the oldest documented categories in the grimoire tradition and is "
            "present in the Ars Notoria, the Lemuria and later ceremonial sources.",
            "The 'lesser banishing' and the 'crossing of the quarters' in ceremonial practice both serve "
            "the function of establishing a defined, sealed space for the operation.",
            "Binding practices are among the most ethically contested in the field, and the historical "
            "sources are explicit that they are used against the target's will.",
            "Tension-release and half-life rules are documented in classical binding material, which "
            "implies the practitioners who wrote it knew the operation was not permanent.",
        ],
        "faq": [
            ("Is binding a person against their will unethical?",
             "Yes, and it is one of the clearest ethical lines in the tradition. Most contemporary "
             "practitioners consider it off-limits for exactly that reason."),
            ("What about binding yourself?",
             "Self-binding to a commitment you have already made is a standard and defensible practice - "
             "it removes the option of reneging rather than overriding anyone else."),
            ("Does binding actually work?",
             "Historically, reported bindings lapsed according to the stated tension-release rules, which "
             "is itself evidence that the mechanism was never permanent."),
        ],
        "risk": "consent-discipline",
    },

    # -------------------------------------------------------- KNOWLEDGE/WISDOM
    "wisdom-memory": {
        "label": "Wisdom, Memory and Understanding",
        "intent": "informational",
        "cat": "basics",
        "og": "what-is-gnosis-how-to-achieve",
        "products": ["psi-gym", "noctem-tools", "astral-lab", "mind-the-gap-pdf"],
        "terms": [
            "wisdom sigil", "memory and recall ritual", "deep understanding magic",
            "how to learn faster occult", "sigils for intelligence",
            "memory improvement ritual", "wisdom and knowledge sigil",
        ],
        "h2": [
            "Wisdom as a Target Is Unusually Tractable",
            "Memory: What Sigils Can and Cannot Do",
            "Building a Study Sigil",
            "Building an Understanding Sigil",
            "The Retrieval Connection",
            "Making the Commitment Concrete",
            "When the Answer Is Already Known",
            "Mistakes That Flatten the Results",
            "Ethical Limits on Wealth Magic",
            "Frequently Asked Questions",
        ],
        "facts": [
            "Testing effect, or retrieval practice, is among the most robustly replicated findings in "
            "cognitive psychology, and it substantially outperforms rereading.",
            "Distributed practice - spacing study sessions - is likewise among the most replicated effects, "
            "with a large advantage over massed practice.",
            "The generation effect - recalling an answer before seeing it - improves retention more than "
            "recognition does, which makes self-testing central to effective revision.",
            "Wisdom is a poor retrieval target because it is not a discrete fact; the operationalisation "
            "has to be 'the decision I want to make well' rather than 'to be wise'.",
        ],
        "faq": [
            ("Can a sigil improve memory?",
             "Not directly. It can commit you to a retrieval-practice schedule, which is the intervention "
             "that actually improves memory."),
            ("What is the most effective study ritual?",
             "Close the book, write down what you remember, then check. That single loop outperforms most "
             "other techniques."),
            ("Should I ask for wisdom?",
             "Aim at a specific decision instead. 'What do I do about this specific problem' is workable; "
             "'be wise' is not."),
        ],
        "risk": "clarity-discipline",
    },
}
