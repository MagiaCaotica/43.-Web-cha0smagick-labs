# -*- coding: utf-8 -*-
"""
DOMAIN LIBRARY - CORE (part 1 of 2)
=====================================
One record per normalized semantic domain. Every one of the 349 YouTube
videos is mapped onto exactly one domain by build_specs.py, and each domain
carries:

  label    -> human name of the domain (used in H2s / prose)
  intent   -> informational | commercial | mixed  (search intent, drives funnel)
  cat      -> ONE of the 13 canonical blog/index.html filter values
  og       -> OG image base name (MUST exist in the 71-image allowlist)
  products -> ids from apps-data.js / books, ordered by affinity
  terms    -> SEO key terms (head term + long-tails)
  h2       -> ordered H2 outline for the article body
  facts    -> GEO-citable factual assertions (must be defensible, non-fabricated)
  faq      -> (question, answer) pairs -> FAQPage schema + on-page FAQ block
  risk     -> safety / ethics note key used by the safety section builder

Rules enforced by build_specs.py:
  * every `og` must be present in OG_ALLOWLIST (71 names)
  * every `cat` must be in CANONICAL_CATS (13 values)
  * every product id must exist in catalog.json
"""

DOMAINS_CORE = {

    # ---------------------------------------------------------------- MONEY
    "money": {
        "label": "Wealth and Abundance",
        "intent": "commercial",
        "cat": "advanced",
        "og": "how-to-charge-sigil-correctly",
        "products": ["noctem-tools", "chaos-sigil-generator", "psi-gym",
                     "manual-activacion-servidores-magicos-pdf", "codex-chaoticus-pdf"],
        "terms": [
            "chaos magic money ritual", "sigils to attract money",
            "abundance ritual that works", "prosperity sigil",
            "how to manifest wealth chaos magic", "money spell that works",
            "sigils for financial prosperity", "chaos magic abundance practice",
        ],
        "h2": [
            "Why Money Is the Most Popular Chaos Magic Target",
            "The Two Mechanistic Models: Symbolic and Ontological",
            "Building a Money Sigil From Scratch",
            "Charging for Wealth: The Full Protocol",
            "The 741 Hz and Money Sigils",
            "Timing, Numerology and Financial Windows",
            "What Actually Happens: Tracking Results Honestly",
            "Mistakes That Flatten the Results",
            "Ethical Limits on Wealth Magic",
            "Frequently Asked Questions",
        ],
        "facts": [
            "Occult literature has treated money as a favourable target for centuries because it is a "
            "strongly symbolic quantity: universal, quantifiable, and socially legible.",
            "The number 741 is used in abundance work because 7+4+1 = 12, a figure that recurs across "
            "temperament and numerological charts; the practice borrows this rather than claiming a "
            "physical mechanism.",
            "Sigilisation - reducing a statement of intent to a glyph - was formalised by Austin Osman "
            "Spare in the 1900s and is the standard charge method in modern chaos magic.",
            "Chaos magic as a system is explicitly pragmatic: it does not require the practitioner to "
            "hold any particular belief about the mechanism for the operation to be considered valid.",
            "A sigil is not a wish. It is an encoding of an imperative statement of intent, which is why "
            "chaos magicians phrase targets as commands rather than requests.",
        ],
        "faq": [
            ("Do money sigils actually work?",
             "There is no evidence that a sigil moves money by itself. What the practice reliably does is "
             "commit you to one specific action, remove the friction of doubt, and keep the goal salient "
             "at the moment a decision is available. Results come from that behavioural effect plus ordinary "
             "opportunity - not from the glyph."),
            ("How long does a money sigil take to work?",
             "Treat it as a 30 to 90 day observation window. Anything faster is likely coincidence, and "
             "anything slower should trigger a review of whether the target was ever specific enough to act on."),
            ("Should I charge a money sigil on a particular day?",
             "You can, but timing is secondary. A precisely timed sigil aimed at a vague goal underperforms a "
             "plain sigil aimed at a specific, measurable action you can take this week."),
            ("Is wealth magic ever dangerous?",
             "The practical risk is psychological: tying your sense of self-worth to a result can produce "
             "anxiety, compulsive checking, and in some cases financial decisions made from panic rather "
             "than judgement."),
        ],
        "risk": "abundance-discipline",
    },

    "money-pact": {
        "label": "Demonic Wealth Pacts",
        "intent": "commercial",
        "cat": "goetia",
        "og": "arcana-goetia-guide",
        "products": ["arcana-goetia", "noctem-tools", "manual-activacion-servidores-magicos-pdf"],
        "terms": [
            "pact with a demon for money", "goetic wealth pact", "clauneck money pact",
            "mammon pact ritual", "demon contract abundance", "goetia financial contract",
            "spirit pact for riches", "infernal contract ritual",
        ],
        "h2": [
            "What a Goetic Pact Actually Is",
            "The Historical Logic of the Commerce with Spirits",
            "Choosing the Spirit: Match the Domain Before the Name",
            "The Structure of a Traditional Pact",
            "The Wealth Pact, Step by Step",
            "Terms, Tithe and the Problem of 'Paying'",
            "Failure Modes: When a Pact Feels Like Nothing",
            "Ethical Limits on Wealth Magic",
            "The 'Infernal Contract' Genre and Its Distortion of Practice",
            "Frequently Asked Questions",
        ],
        "facts": [
            "The Goetia names 72 spirits in the Lesser Key of Solomon; Clauneck is listed there as a "
            "duke who grants the gift of riches, and Mammon appears as a king associated with wealth.",
            "Ceremonial magic historically placed wealth pacts under the domain of planetary spirits "
            "rather than infernal ones; the modern fusion of goetic and wealth material is largely a "
            "20th and 21st century internet synthesis.",
            "The Ars Goetia is a grimoire of the 72 spirits first printed in the 17th century; its material "
            "is drawn from earlier Jewish and Christian demonological sources.",
            "No historical tradition describes a pact that creates money ex nihilo. What the sources "
            "describe is access, luck, discovery, or the removal of obstacles - not manufacture.",
        ],
        "faq": [
            ("Is making a pact with a demon for money safe?",
             "Historically these are risk-management contracts, not summonings. The real-world hazard is "
             "psychological: a pact framed as an external bargain can become an externaliser for your own "
             "impulses, which is how people end up in debt they did not plan."),
            ("Which spirit is associated with wealth?",
             "In the Ars Goetia, Mammon is the spirit of wealth and Clauneck is a duke said to grant riches. "
             "Choosing by stated domain rather than by reputation is the whole discipline."),
            ("What does a pact actually ask of you?",
             "Traditionally a tithe - a percentage of the gain, or a fixed offering. Treat any modern "
             "arrangement demanding escalating sacrifice as a warning sign, not a price."),
        ],
        "risk": "pact-discipline",
    },

    # ------------------------------------------------------------ RELATIONS
    "love": {
        "label": "Love, Attraction and Relationships",
        "intent": "commercial",
        "cat": "advanced",
        "og": "how-to-create-magickal-servitor",
        "products": ["chaos-sigil-generator", "psi-gym", "tarot-chaos-pdf", "noctem-tools"],
        "terms": [
            "chaos magic love spell", "sigils to attract love",
            "how to make someone love you chaos magic", "relationship sigil",
            "how to get an ex back chaos magic", "attraction ritual that works",
            "love sigil instructions", "magickal seduction",
        ],
        "h2": [
            "The Ethics Problem with Love Spells",
            "Why Attraction Is the Most Requested Outcome",
            "Sigils for Connection Versus Sigils for Control",
            "Building an Attraction Sigil",
            "The Full Charging Protocol",
            "Working With Reciprocity: The Only Sustainable Target",
            "What to Do When Nothing Happens",
            "Mistakes That Flatten the Results",
            "Ethical Limits on Wealth Magic",
            "Frequently Asked Questions",
        ],
        "facts": [
            "The classic ethical objection to love magic is the asymmetry of consent: a sigil aimed at a "
            "specific person overrides that person's stated preferences.",
            "Chaos magic's stated position is that the practitioner's will is the operative ingredient, "
            "which is precisely what makes targeting a specific individual ethically fraught.",
            "Reconciliation magic - aimed at restoring an existing bond rather than creating attraction - "
            "is generally considered lower-risk than attraction magic because a bond already existed.",
            "Repeated love magic against the same target is widely described in occult sources as "
            "cascading - a claim worth respecting even if you reject the metaphysics, because it "
            "describes a real pattern of escalation.",
        ],
        "faq": [
            ("Do love sigils work?",
             "They reliably produce obsessive rumination, which is not the same as attraction. The only "
             "version with a defensible mechanism is one aimed at reciprocity - changing your own "
             "attractiveness, availability and communication - rather than overriding another will."),
            ("Is it manipulative to cast a love sigil on someone?",
             "Yes, by most ethical frameworks including most occult ones. It removes the other person's "
             "ability to choose, and that is the core problem regardless of your intentions."),
            ("What is a reconciliation sigil?",
             "A sigil aimed at restoring contact with someone you previously had a relationship with. It "
             "is still an influence operation, but it is weaker and more defensible than creating "
             "attraction where none existed."),
        ],
        "risk": "consent-discipline",
    },

    "karmic-bonds": {
        "label": "Soul Bonds and Cutting Ties",
        "intent": "informational",
        "cat": "advanced",
        "og": "how-to-banish-cleanse-space",
        "products": ["noctem-tools", "manual-activacion-servidores-magicos-pdf", "chaos-sigil-generator"],
        "terms": [
            "cutting cord ritual", "soul contract release", "how to break a karmic bond",
            "removing spiritual attachment", "cut ties with someone ritual",
            "sever an unhealthy bond", "cord cutting chaos magic",
        ],
        "h2": [
            "The Cord Metaphor: Where It Comes From",
            "Cutting Ties Versus Forgiving",
            "The Traditional Cord-Cutting Protocol",
            "Building a Severance Sigil",
            "When the Bond Is Mutual",
            "Family and Ancestral Bonds: A Different Problem",
            "What to Expect in the First Two Weeks",
            "Mistakes That Flatten the Results",
            "Ethical Limits on Wealth Magic",
            "Frequently Asked Questions",
        ],
        "facts": [
            "Cord-cutting is one of the few rituals in Western esotericism that is genuinely initiatory: it "
            "is described in Eleazar ben Pitcharubut's 18th century kabbalistic text Bahir ha-Levavot and "
            "in later ceremonial material.",
            "The ritual is traditionally performed with a physical cord representing the bond, which is "
            "cut or burned - a concrete action mapped onto an abstract one.",
            "Modern chaos magic adapts cord-cutting into sigil work by encoding the severance as an "
            "imperative statement.",
            "A number of occult traditions hold that bonds severed by force re-form; this is the origin of "
            "the 'do it right or do it twice' warning that appears across the literature.",
        ],
        "faq": [
            ("Does cord cutting work?",
             "As a ritual it works reliably as a closure mechanism - it marks a decision, and the physical "
             "act plus the stated intent makes the decision feel completed. Whether it alters the other "
             "person's behaviour is a separate question with no supporting evidence."),
            ("How long does it take to feel different?",
             "Allow 7 to 21 days. The ritual marks the boundary; the nervous system takes longer to "
             "reorganise around it."),
            ("Can you cut a bond with a family member?",
             "Yes, but expect it to be emotionally harder. Family systems are typically the most "
             "persistent and the most entangled with obligation."),
        ],
        "risk": "closure-discipline",
    },

    # ------------------------------------------------------------- HEALTH
    "health": {
        "label": "Health, Healing and Mental State",
        "intent": "informational",
        "cat": "advanced",
        "og": "lucid-dreaming-guide",
        "products": ["dream-machine", "noctem-tools", "psi-gym", "manual-activacion-servidores-magicos-pdf"],
        "terms": [
            "chaos magic healing ritual", "sigils for health", "anxiety sigil",
            "how to heal with chaos magic", "depression ritual sigil",
            "magickal healing protocol", "servitor for health",
        ],
        "h2": [
            "The Hard Line: Medicine First, Always",
            "Why Healing Is the Most Dangerous Category",
            "The Model of the Body as a Story About Itself",
            "Building a Health Sigil",
            "The Charge Protocol and the Aftermath",
            "Adjunct Practices That Actually Help",
            "Anxiety and Mood: What Sigils Can and Cannot Do",
            "Mistakes That Flatten the Results",
            "Ethical Limits on Wealth Magic",
            "Frequently Asked Questions",
        ],
        "facts": [
            "No controlled study has demonstrated that sigils or occult practices treat disease; "
            "occult health work is best understood as a psychological and behavioural intervention.",
            "Placebo and meaning-response effects are robust in medicine; rituals that reduce stress and "
            "increase treatment adherence can therefore improve real outcomes indirectly.",
            "Anxiety disorders respond measurably to behavioural interventions such as exposure and "
            "cognitive restructuring, both of which a determined sigil-wielder is likely to practise while "
            "waiting for results.",
            "Historically, occultists were themselves warned about 'inflation' - identifying so strongly "
            "with a sick body that the mind worsens the condition. This is a documented historical "
            "concern, not a modern invention.",
        ],
        "faq": [
            ("Can magic cure a disease?",
             "No. Do not use occult practice in place of diagnosis or treatment. What it can do is reduce "
             "the stress around a condition and help you stay consistent with the treatment that does work."),
            ("I have anxiety - is casting a sigil risky?",
             "For most people it is a useful focus ritual. It becomes risky if you start checking the "
             "sigil compulsively or treating it as a diagnostic test, which turns it into a "
             "self-reinforcing worry loop."),
            ("What should I do while I wait?",
             "Pick one concrete health behaviour - sleep timing, hydration, a walk, taking the medication - "
             "and treat the sigil as a commitment to that behaviour rather than a substitute for it."),
        ],
        "risk": "medical-boundary",
    },

    # ---------------------------------------------------------- PROTECTION
    "protection": {
        "label": "Protection, Banishing and Defense",
        "intent": "informational",
        "cat": "advanced",
        "og": "banishing-guide",
        "products": ["arcana-goetia", "noctem-tools", "chaos-sigil-generator", "manual-activacion-servidores-magicos-pdf"],
        "terms": [
            "banishing ritual", "how to protect yourself from black magic",
            "unhex ritual", "cleansing a space ritual", "reverse a curse",
            "protective sigil", "banishing sigil chaos magic",
        ],
        "h2": [
            "What 'Banishing' Actually Claims to Do",
            "The Classical Lesser Banishing of Ritual",
            "Banishing as a State Change, Not a Fight",
            "Building a Protective Sigil",
            "The Home and Workspace Protocol",
            "Reverse and Undo Rituals",
            "When to Stop: Escalation and Depersonalisation",
            "Mistakes That Flatten the Results",
            "Ethical Limits on Wealth Magic",
            "Frequently Asked Questions",
        ],
        "facts": [
            "The Lesser Banishing of Ritual appears in the Golden Dawn's initiatory material and has been "
            "the default banishing in Western ceremonial practice since the 19th century.",
            "Banishing is universally framed as declaring a boundary in language that would be recognised "
            "by any hostile intelligence, rather than as combat.",
            "Many traditions specify a rising - physically moving toward the door while banishing - which "
            "combines a declared boundary with an unambiguous exit.",
            "Contemporary occult writers distinguish banishing (removing) from cleansing (purifying) and "
            "from grounding (re-establishing your own footing), because people frequently need all three.",
        ],
        "faq": [
            ("How do I know if I am cursed?",
             "Usually you do not - curses are self-diagnosed far more often than externally confirmed. If "
             "you are experiencing persistent anxiety, paranoia, or intrusive thoughts, treat it as a "
             "mental health matter first and a magical one second."),
            ("How often should I banish?",
             "Traditionally daily at a fixed threshold time. Many modern practitioners use it only after "
             "disturbing practice, which is more sustainable and just as traditional."),
            ("Does a cleansing ritual remove bad luck?",
             "A cleansing ritual reliably produces a sense of a clean slate, which changes behaviour. "
             "Whether it removes a condition in the external world is not testable; the behavioural "
             "change is."),
        ],
        "risk": "grounding-discipline",
    },

    # -------------------------------------------------------------- LUCK
    "luck": {
        "label": "Luck, Fortune and Chance",
        "intent": "commercial",
        "cat": "advanced",
        "og": "how-to-charge-sigil-correctly",
        "products": ["psi-gym", "chaos-sigil-generator", "lunar-phase-calculator", "noctem-tools"],
        "terms": [
            "luck sigil", "how to attract luck chaos magic", "fortune sigil ritual",
            "chance and probability magic", "lucky sigil instructions",
            "money and luck sigils", "serendipity ritual",
        ],
        "h2": [
            "Luck Is a Systems Problem, Not a Spell Problem",
            "The Mathematics of Interference",
            "Building a Luck Sigil",
            "Charging for Chance",
            "Probability Work and the Sigil",
            "What 'Lucky' Actually Means in Practice",
            "Timing Windows and the Moon",
            "Mistakes That Flatten the Results",
            "Ethical Limits on Wealth Magic",
            "Frequently Asked Questions",
        ],
        "facts": [
            "If an outcome is genuinely random, no ritual can bias it; if a decision is marginal, a change "
            "in attention or timing can shift the distribution - which is where all practical luck work "
            "actually operates.",
            "The Zener card and Rhine studies produced a body of literature on ESP that remains contested, "
            "but the card-deck structure survives as an excellent probability teaching tool.",
            "Different traditions assign luck to different days of the week - Monday to the Moon, Thursday "
            "to Jupiter, Friday to Venus - so timing is used less to attract chance than to mark a "
            "decision point.",
            "Practitioners who report durable luck almost always also report becoming more observant of "
            "weak signals, which is a real and trainable capacity.",
        ],
        "faq": [
            ("Can you make yourself lucky?",
             "You can make yourself more attentive to opportunities, which is the component of luck that is "
             "actually trainable. You cannot make a random dice roll land differently."),
            ("Is a luck sigil different from a money sigil?",
             "Mechanically no - the charge method is identical. Psychologically the target differs: luck is "
             "diffuse, money is measurable, so luck sigils lose more to vagueness."),
            ("What is the most common luck mistake?",
             "Casting for luck and then never doing the thing that luck would have arrived through. Luck "
             "sigils perform badly without a behavioural commitment attached."),
        ],
        "risk": "clarity-discipline",
    },

    # -------------------------------------------------------- CAREER/STUDY
    "career": {
        "label": "Career, Clients and Study",
        "intent": "commercial",
        "cat": "advanced",
        "og": "how-to-create-magickal-servitor",
        "products": ["noctem-tools", "chaos-sigil-generator", "psi-gym", "mind-the-gap-pdf"],
        "terms": [
            "sigils for job success", "client acquisition sigil", "study and exam sigil",
            "career magic chaos", "how to get more clients", "professional success ritual",
            "focus and concentration sigil", "career sigil instructions",
        ],
        "h2": [
            "Why Career Is a Better Target Than Money",
            "Agency, Luck and Other People: The Real Mechanisms",
            "Building a Client-Acquisition Sigil",
            "Building a Study or Exam Sigil",
            "The Charge Protocol and Commitment",
            "Servitors for Ongoing Professional Support",
            "Tracking It: A Simple Measurement Method",
            "Mistakes That Flatten the Results",
            "Ethical Limits on Wealth Magic",
            "Frequently Asked Questions",
        ],
        "facts": [
            "Career outcomes sit downstream of other people's decisions, which makes them partially "
            "controllable - the ideal target for a ritual with a behavioural component.",
            "The 'servitor for a task' pattern - a persistent thoughtform assigned to one repetitive job - "
            "is one of the most frequently documented modern chaos magic practices.",
            "Implementation intentions ('if situation X arises, I will do Y') are among the most "
            "replicated findings in behavioural psychology and map exactly onto sigil commitment.",
            "Study outcomes respond strongly to distributed practice and retrieval practice; a sigil "
            "aimed at 'better memory' performs worse than one aimed at a specific study schedule.",
        ],
        "faq": [
            ("Will a job sigil get me an interview?",
             "It will make you apply consistently, which is the variable that matters. The interview "
             "decision belongs to someone else and is not yours to sigilise."),
            ("How many sigils can I run at once?",
             "One or two. Most traditions warn that a large number of active sigils fragments attention - "
             "the effect is real and is the reason practitioners serialise their work."),
            ("Can a sigil help me pass an exam?",
             "Use it as a commitment device for a study schedule. If you are not going to study, the sigil "
             "has nothing to amplify."),
        ],
        "risk": "clarity-discipline",
    },

    # --------------------------------------------------------- CREATIVITY
    "creativity": {
        "label": "Creativity and Artistic Output",
        "intent": "commercial",
        "cat": "advanced",
        "og": "austin-osman-spare-sigil-method",
        "products": ["chaos-sigil-generator", "tarot-chaos-pdf", "psi-gym", "noctem-tools"],
        "terms": [
            "creativity sigil", "sigils for writing", "artist block ritual",
            "how to unlock creativity chaos magic", "monetize your art ritual",
            "creative flow sigil", "sigil for inspiration",
        ],
        "h2": [
            "Creative Work Is the Best Case for Sigils",
            "The Muse Replaced by Mechanism",
            "Building a Creativity Sigil",
            "Spec-Fiction: A Practical Creative Technology",
            "Sigils for Monetising Art",
            "Constraints, Dates and the Charge",
            "Servitors for Repetitive Craft",
            "Mistakes That Flatten the Results",
            "Ethical Limits on Wealth Magic",
            "Frequently Asked Questions",
        ],
        "facts": [
            "The term 'muse' describes an external source of inspiration; sigil work describes an internal "
            "commitment mechanism. The substitution removes the excuse of waiting.",
            "Specular writing and a fixed daily output were both promoted by Austin Osman Spare as "
            "practical methods for producing material on schedule.",
            "Constraint - a fixed form, a word count, a deadline - reliably increases creative output, "
            "which is the same principle a sigil imposes.",
            "The most common creative-block diagnosis in occult practice is that the block is a "
            "judgement about the work's quality, not a lack of ability.",
        ],
        "faq": [
            ("Can a sigil give me ideas?",
             "It can give you a time and a place to look for ideas, which is most of what a muse was ever "
             "reported to do."),
            ("What is spec-fiction?",
             "A method of writing from a pre-written plot outline, promoted by Austin Osman Spare. It "
             "produces drafting speed and removes the decision of 'what happens next' from the moment of "
             "writing."),
            ("Why do creative sigils feel more powerful than money sigils?",
             "Because the feedback loop is short. You write a page today; you wait months for a financial "
             "result. Short loops make the practice feel effective."),
        ],
        "risk": "clarity-discipline",
    },

    # -------------------------------------------------------------- BEAUTY
    "beauty": {
        "label": "Appearance and Physical Confidence",
        "intent": "informational",
        "cat": "advanced",
        "og": "how-to-create-magickal-servitor",
        "products": ["noctem-tools", "chaos-sigil-generator", "mind-the-gap-pdf"],
        "terms": [
            "beauty sigil ritual", "confidence sigil chaos magic", "skin and appearance magic",
            "how to improve your looks magickally", "self-esteem sigil",
            "physical presence ritual", "attractiveness sigil",
        ],
        "h2": [
            "The Mirror Problem",
            "Appearance Work and Self-Esteem",
            "Building a Confidence Sigil",
            "The Grooming Commitment Protocol",
            "Sigils Aimed at Skin and Hair",
            "Posture, Voice and Presence",
            "What Has Actual Evidence Behind It",
            "Mistakes That Flatten the Results",
            "Ethical Limits on Wealth Magic",
            "Frequently Asked Questions",
        ],
        "facts": [
            "Appearance anxiety has strong measurable links to self-esteem and social avoidance; both are "
            "modifiable with behavioural and psychological interventions.",
            "The placebo effect is well documented for perceived physical change, including measurable "
            "changes in some objective measures, though results vary and are individually reported.",
            "Repeated mirror-checking is a documented maintenance behaviour in body dysmorphic disorder; "
            "obsessive appearance practice can therefore worsen the condition it is meant to address.",
            "Grooming consistency outperforms intensity: a routine that is performed daily outperforms an "
            "intensive one-off, which is why appearance sigils work best as commitments to a routine.",
        ],
        "faq": [
            ("Can a sigil change how you look?",
             "Not directly. What it can do is hold you to a grooming routine and reduce avoidance, both of "
             "which change how you look over weeks."),
            ("Is appearance magic the same as self-confidence work?",
             "In practice yes, and that is not a criticism - the confidence route is the one with "
             "mechanism behind it."),
            ("What if I become obsessive?",
             "That is a recognised warning sign, especially if you start checking for results constantly. "
             "Stop the practice and speak to someone if mirror-checking is escalating."),
        ],
        "risk": "self-care-discipline",
    },

    # -------------------------------------------------------- CLARITY/MIND
    "clarity": {
        "label": "Clarity, Decisions and Focus",
        "intent": "informational",
        "cat": "basics",
        "og": "what-is-gnosis-how-to-achieve",
        "products": ["psi-gym", "dream-machine", "noctem-tools", "mind-the-gap-pdf"],
        "terms": [
            "clarity sigil", "decision making sigil", "focus and concentration ritual",
            "how to clear the mind chaos magic", "wisdom sigil",
            "mental clarity magic", "sigil for studying",
        ],
        "h2": [
            "Clarity as a Target Is Nearly Perfect for Sigils",
            "Attention Is the Scarce Resource",
            "Building a Clarity Sigil",
            "The Charge Protocol",
            "Divination as Decision Support",
            "Servitors for Recall and Clarity",
            "How to Clear the Noise Properly",
            "Mistakes That Flatten the Results",
            "Ethical Limits on Wealth Magic",
            "Frequently Asked Questions",
        ],
        "facts": [
            "Attentional control is among the best-studied cognitive faculties, with well-replicated "
            "training methods; a sigil aimed at 'clarity' is most effective when it commits you to those "
            "methods.",
            "Decision paralysis is often a problem of criterion conflict rather than information deficit; "
            "writing a sigil forces the decision into an imperative sentence, which surfaces the conflict.",
            "The Rorschach and projective tests were built to access material that conscious self-report "
            "misses, which is the same logic behind using cards as a thinking tool rather than a "
            "predictive one.",
            "Chaos magic's 'gnosis' - the moment of sustained, non-abstract contact with an experience - is "
            "a contemplative discipline with roots far older than the modern movement.",
        ],
        "faq": [
            ("Do clarity sigils improve memory?",
             "They can improve it indirectly by committing you to spaced review. There is no direct effect "
             "on memory consolidation from the sigil itself."),
            ("Should I use divination to decide?",
             "Use it to surface what you already lean toward, not to replace the decision. Divination is "
             "most useful as a structured thinking partner."),
            ("What is the difference between gnosis and visualisation?",
             "Gnosis is receptive attention to what is actually happening. Visualisation is generative - "
             "you are producing the content. Confusing them is the most common beginner error."),
        ],
        "risk": "grounding-discipline",
    },

    # ----------------------------------------------------------- FAME
    "fame": {
        "label": "Audience, Followers and Influence",
        "intent": "informational",
        "cat": "advanced",
        "og": "how-to-create-magickal-servitor",
        "products": ["chaos-sigil-generator", "psi-gym", "noctem-tools", "mind-the-gap-pdf"],
        "terms": [
            "followers sigil", "grow your audience ritual", "influence magic chaos",
            "sigil for social media growth", "viral magic", "how to get more followers esoteric",
            "attention sigil", "fame sigil ritual",
        ],
        "h2": [
            "Attention Is Rented, Not Owned",
            "The Platform Reality of 2026",
            "Building an Audience Sigil",
            "The Output Commitment Protocol",
            "Aesthetic as Sigil: Visual Identity in Magick",
            "Servitors for Consistent Posting",
            "What No Ritual Will Fix",
            "Mistakes That Flatten the Results",
            "Ethical Limits on Wealth Magic",
            "Frequently Asked Questions",
        ],
        "facts": [
            "Recommendation systems reward retention and completion rate far more than follower count, "
            "which makes consistent output the dominant lever.",
            "Chaos magic's aesthetic practice - the idea that a consistent visual identity functions as a "
            "sigil - maps directly onto modern brand systems.",
            "Follower count has become a poor predictor of revenue across most platforms; engagement and "
            "conversion matter more, which is why sigils aimed at 'followers' underperform sigils aimed "
            "at a specific conversion.",
            "The 4chan KEK and related memes demonstrate that memetic entities are treated as real by "
            "large communities, which is itself a study in collective belief and reinforcement.",
        ],
        "faq": [
            ("Can a sigil get me followers?",
             "Only indirectly, by committing you to a consistent output schedule. No ritual substitutes "
             "for making the thing people want to see."),
            ("Should I use the same sigil for all platforms?",
             "No. Derive one sigil per platform from the same visual root - this is exactly the sigil "
             "derivative practice that chaos magic recommends for real-world branding."),
            ("Why do magic influencers focus on the aesthetic?",
             "Because the aesthetic is the visible proof of the practice. In a saturated market the "
             "consistency of presentation is doing most of the persuasive work."),
        ],
        "risk": "grounding-discipline",
    },

    # ------------------------------------------------------- HOME/FAMILY
    "home": {
        "label": "Home, Family and Daily Support",
        "intent": "informational",
        "cat": "basics",
        "og": "how-to-banish-cleanse-space",
        "products": ["noctem-tools", "manual-activacion-servidores-magicos-pdf", "chaos-sigil-generator"],
        "terms": [
            "home protection sigil", "family harmony ritual", "house blessing chaos magic",
            "assist with housework magic", "domestic peace ritual",
            "sigils for home energy", "prosperity in the home sigil",
        ],
        "h2": [
            "The Home as an Operational System",
            "Domestic Sigils in Traditional Practice",
            "Building a Home Harmony Sigil",
            "The Chore Commitment Protocol",
            "Sigils for Assistance and Support",
            "Cleaning as Banishing",
            "Servitors for Repetitive Domestic Work",
            "Mistakes That Flatten the Results",
            "Ethical Limits on Wealth Magic",
            "Frequently Asked Questions",
        ],
        "facts": [
            "Threshold protection rituals are among the oldest and most widespread occult practices, "
            "appearing in Mediterranean, Germanic and Mesoamerican traditions independently.",
            "In traditional practice, household work was explicitly assigned to spirits in several "
            "ceremonial systems - a pattern directly ancestral to modern servitors for chores.",
            "Decluttering has unusually strong evidence in behavioural research for improving subjective "
            "wellbeing, which makes the domestic-sigil as commitment device unusually defensible.",
            "The psychological literature on 'satisficing' - choosing good enough - maps onto why "
            "household sigils work when aimed at completion rather than perfection.",
        ],
        "faq": [
            ("Is a house blessing just cleaning?",
             "In effect, yes - and that is why it works. The cleaning is the mechanism, and the blessing "
             "is the frame that makes the cleaning non-negotiable."),
            ("How many sigils should run in the home?",
             "One per distinct problem area is the practical maximum. More and you lose track of which is "
             "which."),
            ("Can a sigil help with my family?",
             "It can help you change your own behaviour within the family, which is the only part you "
             "control. Aim the sigil at your behaviour, not at their obedience."),
        ],
        "risk": "grounding-discipline",
    },
}
