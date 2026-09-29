# -*- coding: utf-8 -*-
"""Batch 5a: n=131 (technomancy F), n=132 (psychonautics C), n=134 (gnosis C)."""

ARTICLES = {
    131: {
        "lede": (
            "Cibermagia is a word that arrived before anybody had decided what it should mean, "
            "and that is the whole of its problem. The term technomancy comes from a 1910 essay "
            "in which Crowley proposed that modern technology was the next substrate for magic, "
            "and the movement that grew up in the late eighties and nineties from chaos magic, "
            "industrial culture and early hacker ethics has been arguing about the definition "
            "ever since. This page takes the strong version of the claim seriously and then asks "
            "where it fails. Because it does fail, in specific and identifiable ways, and a "
            "practice that cannot say where its own edges are will eventually get somebody hurt. "
            "The argument below is arranged so that the case for the practice comes first and "
            "the objections come second, since the objections are more interesting when you have "
            "seen what the thing is actually trying to do."
        ),
        "sections": [
            {
                "h2": "Who supplied the vocabulary",
                "p": [
                    "Crowley's essay is short, speculative and almost never read in full, which is "
                    "a large part of why the term has drifted. What he proposed was modest: that "
                    "the twentieth century's own artefacts would become the material of magic, in "
                    "the way earlier centuries used their own.",
                    "Read that way, the proposal is unremarkable. Every tradition has used the "
                    "material of its own moment. The claim becomes strange only when the substrate "
                    "is treated as neutral, and it is not: a network is a very particular object "
                    "with particular properties and particular failures.",
                ],
            },
            {
                "h2": "The three things people mean by it",
                "p": [
                    "There is technomancy as a design practice, where a device interface is built "
                    "to make an action feel significant. There is technomancy as a ritual "
                    "practice, where the device is treated as the instrument and the charge happens "
                    "through deliberate interaction with the interface. And there is technomancy "
                    "as a metaphor, where encryption and networks stand in for secrecy and "
                    "transgression.",
                    "Only the middle of those three is a practice. The first is interface design "
                    "with a vocabulary borrowed from ritual. The third is literary. Conflating them "
                    "is the single most common way this material goes wrong, because a metaphor "
                    "produces impressive sentences and no observable results.",
                ],
                "ul": [
                    "As design language: interface dressed in ritual vocabulary.",
                    "As ritual practice: the device is the instrument, deliberately.",
                    "As metaphor: networks standing in for secrecy. Not a practice.",
                ],
            },
            {
                "h2": "The strongest version of the claim",
                "p": [
                    "The best argument for applied technomancy is that a screen is the best "
                    "ritual surface most people have ever had. It is emissive, high contrast, "
                    "familiar and physically unhygienic in the sense that it is not paper. You do "
                    "not have a relationship with a window on a wall the way you have one with a "
                    "sheet of paper.",
                    "The charge is then a deliberate interaction with an interface rather than a "
                    "gesture made at an object, and the design constraint that follows is real: if "
                    "the interface is doing the work, then changing the interface changes the "
                    "practice, which is exactly what a practitioner of any tradition would expect "
                    "and what almost nobody in this field is willing to test.",
                ],
            },
            {
                "h2": "The computational analogies that hold",
                "p": [
                    "Three of them are genuinely tight. Sigilisation is compression: a long "
                    "statement becomes a short glyph that means it. A sigil is a signature: it "
                    "authenticates a particular intention against a particular author. A charged "
                    "glyph is a commit: an irreversible act that changes state.",
                    "Those three are not decorative analogies and the field is entitled to them. "
                    "What they do not give you is any reason to think the compressed glyph has "
                    "reached anything. Compression and signing are operations on information. The "
                    "metaphor stops at the boundary where the question becomes whether meaning "
                    "travels, and that is where the rest of this page is.",
                ],
            },
            {
                "h2": "Where the computer comparison stops working",
                "p": [
                    "A cryptographic signature is verified. It is either valid or it is not, and "
                    "verification is a mechanical process that does not care who made it. A "
                    "sigilised intention cannot be verified by anybody, including the person who "
                    "made it, and in a practice where the maker is the only possible verifier, the "
                    "analogy quietly inverts into a claim it cannot support.",
                    "The second failure is about irreversibility. Software commits are reversible "
                    "in the ordinary sense that the repository keeps the history. A sigilised act is "
                    "reversible only in the sense that you can forget about it, and forgetting is "
                    "not the same as undoing. Any tradition built on irreversibility should be "
                    "cautious about borrowing the vocabulary of version control.",
                ],
            },
            {
                "h2": "Consent, and the fact that the device is not private",
                "p": [
                    "This is the objection that matters most and it is a boundary rather than a "
                    "measurement. A sigil on paper exists in a room you control. A sigil on a "
                    "network is on infrastructure you do not control, which is observed, logged, "
                    "sold and subpoenaed, and which is read by other people as behaviour rather "
                    "than as a symbol.",
                    "The line is other people's autonomy. Work on your own conduct, your own "
                    "availability, your own boundaries. Do not work on overriding somebody's "
                    "stated preferences, and do not assume that a device in your hand is a private "
                    "space, because the architecture says otherwise and the law agrees with the "
                    "architecture more often than practitioners like.",
                ],
            },
            {
                "h2": "How a screen-based practice fails, and in what sequence",
                "p": [
                    "The first is the interface standing in for the practice. A beautiful app is "
                    "used instead of a practice, and the practice never gets built. The second is "
                    "the platform changing. Everything the ritual depends on is one product "
                    "decision away from gone, and no amount of sincerity survives that.",
                    "The third is the account. Once the practice needs a login, the practice has a "
                    "business model, and a business model has a retention curve that will eventually "
                    "be aimed at you. The fourth is the drift into claims about the network itself, "
                    "where a metaphor about infrastructure becomes a claim about reality.",
                ],
                "ol": [
                    "The interface replaces the practice instead of carrying it.",
                    "The platform changes and takes the practice with it.",
                    "The practice acquires an account and a retention curve.",
                    "The metaphor about infrastructure hardens into a claim about reality.",
                ],
            },
            {
                "h2": "A defensible version, if you want one",
                "p": [
                    "Render the glyph on a screen if you like, charge it by a deliberate "
                    "interaction, and log it on paper. That last part is not a compromise, it is the "
                    "point: the record is the only part of the practice that is yours, and the "
                    "screen is a good enough surface for the part that does not need an audit trail.",
                    "Then export everything. If the practice cannot leave the platform in a form "
                    "you can still read in ten years, it is not a practice, it is a subscription "
                    "with a ritual attached, and the difference matters more than the aesthetics.",
                ],
            },
            {
                "h2": "What the field has not done",
                "p": [
                    "Nobody has run the obvious experiment, which is to compare a screen-charged "
                    "sigil against a paper-charged one on a pre-registered target, blind, over "
                    "enough trials to matter. It would take a season and a notebook and it would "
                    "settle a question the field has been arguing about for thirty years.",
                    "The likeliest explanation is the same one that applies throughout this area. "
                    "The experiments are dull, the results will mostly be null, and nulls are "
                    "harder to be talked about than anecdotes. That is not an argument against the "
                    "practice. It is an argument for getting on with it, and for being honest "
                    "about the parts nobody has measured.",
                ],
            },
        {
            "h2": "The interface problem, stated plainly",
            "p": [
                "Every application of this practice depends on somebody having built an interface, and the interface will have a purpose that is not yours. Products are designed for retention, and a tool that helps you finish with it is a commercially awkward object.",
                "The practical consequence is that the most polished tool in this space is likely to be the one least suited to a practice whose whole point is to produce a conclusion and move on. Judge any of them by whether it makes leaving easy, which is the one property that no retention-minded product will offer you."
            ],
            "ul": [
                "Can the whole record be exported in a format you can still read?",
                "Does the tool make it easy to stop, or easy to continue?",
                "Is anything in the interface optimising for time-on-app?",
            ],
        },
        {
            "h2": "The three failures nobody publishes",
            "p": [
                "Platform drift is the first. A practice that depends on a specific app's behaviour is one product decision away from not working, and no amount of commitment survives a changed interface. The people who still have ten-year records are the ones who wrote in a notebook.",
                "Account capture is the second. The moment a practice needs a login it has a business model, and business models eventually aim at people who have already committed, which is an unpleasant thing to have happen to something you were doing for your own sake. The third is the drift of the claim itself, where a metaphor about networks hardens into a statement about reality and nobody notices the transition because it happened gradually in conversation."
            ],
        },
        {
            "h2": "What the cryptography does and does not give you",
            "p": [
                "The compression analogy is exact and worth keeping: a long statement becomes a short glyph that means it, and anyone who can invert the reduction recovers the statement. That is a real structural parallel to what the practitioner is doing, and it is the reason the sigil tradition works as well as it does.",
                "The signature analogy is the one that fails under load, because a cryptographic signature is verified mechanically and a sigilised intention is verified by nobody. Any tradition that leans on the signature image has to handle that asymmetry honestly, and most of the material does not."
            ],
        },
        {
            "h2": "A small experiment nobody has run",
            "p": [
                "Take one pre-registered target. Charge a screen-rendered sigil for it on one schedule. Charge a hand-drawn sigil for an equivalent target on an interleaved schedule. Log both blind, so you cannot tell them apart when you write the entries.",
                "It takes a season and a notebook. It would settle a question this field has argued about for three decades, and the reason it has not been done is the reason the nulls in every corner of this area have not been published: the result is likely to be uninteresting and the conversation afterwards will be about anything else."
            ],
        },
        {
            "h2": "What the movement actually was, historically",
            "p": [
                "Technopaganism and the cybergoth scenes that carried the term into the nineties drew on chaos magic, industrial music and early hacker ethics at the same time, and all three of those had a DIY character that the term inherited. The practice was never going to be a lineage with a founding text, and it never was.",
                "That is worth stating plainly because the later literature often describes a continuous tradition where there was an interruption and a reinvention. Crowley wrote the essay, almost nobody read it, and the people who did use the word in the nineties were mostly borrowing the name and bringing their own content."
            ],
        },
        {
            "h2": "A season, laid out",
            "p": [
                "One pre-registered target, four weekly workings, four interleaved uncharged controls, one log, one review at the end of the month. Screen for half the block, paper for the rest, and do not tell yourself which was which when you write the entries.",
                "The exercise is not going to produce a dramatic result. It will produce a number, and the number is worth more than any anecdote because it is the only thing in this field that anybody could ever aggregate."
            ],
        },
        ],
        "faq": [
            [
                "Is technomancy real magic or just a metaphor?",
                "As a practice it is a coherent application of sigil method to a new substrate, and "
                "the substrate genuinely differs from paper. As a metaphor it produces good "
                "sentences and nothing else. The two get confused constantly, and the honest answer "
                "is that the ritual is real as a ritual and untested as a claim about the world.",
            ],
            [
                "Why use a screen when paper would work better?",
                "Because a screen is a better ritual surface for most people, not because it is more "
                "powerful. It is emissive, high contrast and unfamiliar in exactly the way paper has "
                "become familiar. If you prefer paper, the practice still works and you have lost "
                "nothing except the specific thing the screen contributes.",
            ],
            [
                "Is using code for magic just programming?",
                "The generative step is ordinary programming and there is no mystery in it. What "
                "makes the result magickal is the frame around it, and the frame is doing all the "
                "work. That is not a criticism, it is a description, and it means the interesting "
                "question is about the frame rather than the code.",
            ],
            [
                "What is the real risk in this material?",
                "Other people. A device in your hand is not private, and the failure mode that "
                "matters is doing work aimed at somebody else's stated preferences. Work on your own "
                "conduct, your own availability and your own boundaries, and treat any practice that "
                "requires overriding someone as a different category of activity.",
            ],
            [
                "Should I pay for an app to do this?",
                "Both the method and the record cost nothing. What money buys is tidier export and a log you "
                "can search later, and that is the least interesting half of anything. It is not worth a subscription "
                "half of any practice. It is not worth paying for a subscription to perform a "
                "working you can perform on paper, and the export requirement is the test.",
            ],
        ],
        "related": [
            [
                "cyber-paganism-digital-spirituality-guide",
                "Cyber-Paganism: The New Techno-Spirituality Movement (2026)",
            ],
            [
                "what-is-cybermancy-digital-sorcery-guide",
                "Cybermancy: Complete Guide to Digital Sorcery (2026)",
            ],
            [
                "digital-sigil-magic-guide",
                "Digital Sigil Magic Guide: Code, Cryptography & Chaos Magick",
            ],
            [
                "digital-spellcasting-technomancy-guide",
                "Digital Spellcasting: How to Build a Tech-Enhanced Ritual Technomancy Guide (2026)",
            ],
            [
                "chaos-sigil-design-charge-forget-guide",
                "Design, Charge, Forget: The Complete Chaos Sigil Workflow (2026)",
            ],
        ],
    },
    132: {
        "lede": (
            "Psychonautics is a word that sounds scientific and mostly is not, and the field it "
            "names is full of people who use the vocabulary of research to describe methods they "
            "would not submit to a research paper. That is not automatically a problem, but it does "
            "mean the useful parts and the useless parts have to be sorted before anybody starts. "
            "This page covers altered states as a category: what dissolution actually is, what "
            "set and setting do, why integration is the step everyone skips, and which of the "
            "techniques carry genuine physiological risk rather than merely unfamiliar ones. It "
            "is written for somebody who is curious and has access to the internet, which is to "
            "say somebody who can find any of these methods described in detail and should know "
            "which parts of the detail matter."
        ),
        "sections": [
            {
                "h2": "What dissolution actually is",
                "p": [
                    "It is a reported sense of the boundaries of the self becoming permeable. Not "
                    "an out-of-body experience, not an entity, not a hallucination in the medical "
                    "sense: a felt loosening of the usual hard outline around who is doing the "
                    "experiencing. It is described in the literature on meditation, on hypnosis and "
                    "on psychedelics, and in all three the description is broadly similar.",
                    "The similarity is the interesting part. Three methods with completely "
                    "different mechanisms produce something people describe in almost the same "
                    "words, which suggests either a common human capacity being expressed or a "
                    "shared vocabulary shaping the report. Psychonautics tends to assume the first "
                    "and does not test it, and the second is at least as plausible.",
                ],
            },
            {
                "h2": "Set and setting, and why they dominate the literature",
                "p": [
                    "Set is your state going in, setting is the environment, and between them they "
                    "are the most widely replicated variables affecting whether an altered state is "
                    "pleasant. Not the substance and not the technique. This is repeatedly found "
                    "across decades of work and it is not controversial.",
                    "It is also the least interesting finding to anybody who wants the substance to "
                    "be the point. There is a defensive reading available here, that the field is "
                    "dominated by clinical settings where the environment was controlled for the "
                    "patient's benefit, and that argues for the method rather than against it.",
                ],
            },
            {
                "h2": "Integration, and the step everyone omits",
                "p": [
                    "Integration is the deliberate processing of a difficult or unusual experience "
                    "afterwards, and it is strongly associated with better outcomes. It is also the "
                    "step most reliably skipped, because the interesting part is the state and not "
                    "the afterwards.",
                    "The mechanism is not mysterious. An intense experience produces material that "
                    "has not been metabolised, and unprocessed material is what later shows up as "
                    "intrusive imagery, disconnection or an inflated sense of what has been "
                    "learned. Writing it down, talking it through, sleeping on it and returning to "
                    "ordinary tasks are the whole of integration and they cost nothing.",
                ],
                "ul": [
                    "Write it down the same day, before the narrative has settled.",
                    "Sleep on it before drawing any conclusion from it.",
                    "Return to ordinary physical tasks within a day.",
                    "Do not make decisions about anything large on the strength of a state.",
                ],
            },
            {
                "h2": "Which techniques carry real physiological risk",
                "p": [
                    "Three, and they are the ones that get recommended casually. Hyperventilation "
                    "alters consciousness reliably and can drop blood carbon dioxide to a level that "
                    "produces genuine neurological symptoms. Breath-holding has killed people, "
                    "usually by accident, in a swimming pool.",
                    "Sleep deprivation reliably alters consciousness and is the mechanism behind most "
                    "accidents in this area, because a person who is tired and who has been awake "
                    "for a night is impaired in a way they cannot assess from inside. None of these "
                    "is exotic. All of them are more dangerous than most of the substances being "
                    "discussed alongside them, and they attract less caution.",
                ],
            },
            {
                "h2": "The category problem",
                "p": [
                    "Meditation, hypnosis, breathwork, sensory deprivation, substances and sleep "
                    "deprivation all produce altered states, and they have very different risk "
                    "profiles. Grouping them under one word flattens the difference, and the "
                    "flattening is done in a specific direction: towards the ones that sound most "
                    "esoteric and carry the most risk.",
                    "A useful discipline here is to ask of any method, without exception, what the "
                    "worst plausible outcome is and how likely it is. Most methods answer that "
                    "question poorly because nobody has asked it, and the methods that answer it "
                    "well are mostly the boring ones.",
                ],
                "ol": [
                    "What is the mechanism, stated without metaphor?",
                    "What is the worst plausible outcome?",
                    "What makes it reversible, and how quickly?",
                    "Who else would know if it went wrong?",
                ],
            },
            {
                "h2": "A safe first sequence",
                "p": [
                    "Start with the least intense method that still produces something, and with a "
                    "partner, in a room where somebody knows what is happening. Journaling and short "
                    "dream work are both at that level and neither carries physiological risk.",
                    "Then lengthen the duration before increasing the intensity. Most of the harm in "
                    "this area comes from escalation driven by a disappointing result, which is the "
                    "same failure mode as everywhere else in the field, and it responds to the same "
                    "remedy, which is a pre-decided stopping rule.",
                ],
            },
            {
                "h2": "The two things psychonautics gets right",
                "p": [
                    "It is right that set and setting matter more than the technique, which almost "
                    "nothing else in the field admits and which the evidence supports strongly. And "
                    "it is right that integration is necessary, which is the most useful single "
                    "piece of practical advice in the whole area and is repeated here because it is "
                    "correct.",
                    "Both of those come from the clinical literature rather than from the occult one, "
                    "which is worth noticing. The useful parts of psychonautics have mostly been "
                    "imported, and the parts that are homegrown are the parts that do not survive "
                    "contact with evidence.",
                ],
            },
            {
                "h2": "Where the field overclaims",
                "p": [
                    "Some practitioners present altered states as inherently beneficial, which the "
                    "evidence does not support and which the clinical literature actively "
                    "contradicts, since the same set and setting that produce good outcomes produce "
                    "bad ones when the state is unwanted or the person is vulnerable.",
                    "The other overclaim is about what the states show. An experience of "
                    "ineffability is evidence about the experience. It is not evidence about the "
                    "nature of reality, and treating it as such is the move that makes the whole "
                    "area unanswerable in public conversation.",
                ],
            },
        {
            "h2": "What the clinical literature actually contributes",
            "p": [
                "Three findings, and they are the transferable part. Set and setting dominate the valence of an altered state, which is the strongest and most replicated result in the area. Integration predicts better outcomes, which is the most useful piece of advice. And expectation shapes reported experience, which is a genuine effect with a clean boundary.",
                "Everything else that gets called psychonautic practice is imported from somewhere else and rarely arrives with its caveats attached. That is the pattern to watch for in any field that borrows heavily from a clinical one, and it is not unique to this one."
            ],
        },
        {
            "h2": "Why high intensity is the wrong first move",
            "p": [
                "The argument is about information, not safety. A mild method run for an hour produces a result you can describe afterwards, which means it can be logged, compared and repeated. A severe method produces something usually described as ineffable, which cannot be logged and therefore contributes nothing to anything.",
                "It also produces a worse escalation curve, because the disappointment after a severe experience is what drives somebody to go further, and the same failure mode shows up in a dozen areas where the reward is intermittent. The pattern is worth recognising early rather than after the fact."
            ],
            "ul": [
                "Start with the least intense method that still produces something.",
                "Have a partner who knows what is happening in the room.",
                "Decide the stopping rule before the session rather than during it.",
            ],
        },
        {
            "h2": "The harm that is not physical",
            "p": [
                "Physical risk is the easy part and it is well understood. The harder risk is interpretive: a state in which ordinary categories stop holding can produce a conclusion that is genuinely felt to be knowledge, and that conclusion can then govern behaviour for months afterwards.",
                "This is where the field is most careless, because the conclusion is usually not a claim about anything testable. Nobody can disprove an ineffable experience, which is exactly why it is dangerous: unfalsifiable conclusions still get acted on. The remedy is the one above, defer the interpretation and return to ordinary tasks."
            ],
        },
        {
            "h2": "A first month, described as it usually happens",
            "p": [
                "Week one, journal and a short dream practice, with a partner informed about what you are doing. Week two, keep the record and add nothing. Week three, notice what you actually wrote rather than what you remember writing.",
                "Week four, read the entries backwards and write down the version you would have given at the start of the month. The distance between those two accounts is the honest measure of how much interpretation is doing, and it is available to anybody willing to look."
            ],
        },
        {
            "h2": "The escalation curve nobody charts",
            "p": [
                "Disappointment after a severe experience is what drives somebody to go further, and the same shape shows up across a dozen areas where the reward is intermittent. The variable being rewarded is not intensity, it is the size of the discrepancy between expectation and result.",
                "Recognising the pattern early is worth more than any technique, because the pattern is invisible from inside it and obvious in description. If the response to a flat result is to increase the intensity, the process has stopped being an experiment."
            ],
        },
        {
            "h2": "What to write down afterwards, and when",
            "p": [
                "Same day, before sleep, before conversation. Three questions: what happened, what did it feel like, and what would have counted as a result in advance. The third is the one that requires having written it down beforehand, and if you did not, the other two are a mood report.",
                "Then nothing for a week. No conclusions, no reading about what the experience meant, no decisions of consequence. Most of the damage from a difficult session happens in the hours afterwards and none of it happens during it."
            ],
        },
        {
            "h2": "Where nobody in this field agrees about anything",
            "p": [
                "The disagreement is rarely about the data. It is about what counts as a result. One practitioner logs a feeling of presence, another logs a measurable physiological change, a third logs only whether the day afterwards was different, and all three write them up as successes.",
                "Nothing in the literature adjudicates this, because the literature is not in the habit of adjudicating anything. The practical fix is to declare your outcome in advance, in the unit you will actually be able to check, and then to stick to that unit when the result arrives. Most of the apparent argument in this area turns out to be two people using different definitions and both describing it as clarity."
            ],
        },
        {
            "h2": "The one habit that carries over",
            "p": [
                "Everything else in altered-state practice is contested and none of it is necessary. Writing down what happened, the same day, in words that do not flatter it, is the single habit that pays for itself and costs nothing.",
                "It is also the habit everybody drops, because the experience is more interesting than the entry and the entry is what makes the experience a practice rather than an event."
            ],
        },
        ],
        "faq": [
            [
                "Is dissolution a real phenomenon or just a description?",
                "It is reliably reported across meditation, hypnosis and psychedelics, which "
                "produces similar felt descriptions from three different mechanisms. That is real "
                "data about human capacity and it is also consistent with a shared vocabulary "
                "shaping the reports. The honest position is that something is happening and the "
                "interpretation is not settled.",
            ],
            [
                "What actually makes a bad trip more likely?",
                "Set and setting, overwhelmingly, and more than the substance. Anxiety going in, a "
                "crowded or unfamiliar environment, and doing it alone are the variables that "
                "reliably predict a difficult experience. That is well replicated and it is also "
                "under-appreciated by people who think the compound is the variable.",
            ],
            [
                "How do you integrate an experience afterwards?",
                "Write it down the same day before the story has settled, sleep on it, and return to "
                "ordinary physical tasks. It sounds too simple to be a technique and it is strongly "
                "associated with better outcomes. What you should not do is draw conclusions from "
                "the state itself or make any large decision on the strength of it.",
            ],
            [
                "Is breathwork or hyperventilation dangerous?",
                "Genuinely so, more than most people expect and more than many substances. It "
                "reliably alters consciousness, it can produce genuine neurological symptoms, and "
                "breath-holding has caused deaths, usually by accident in water. If the plan "
                "involves doing it alone, in water, or while driving soon after, that is the risk "
                "worth taking seriously.",
            ],
            [
                "Is it worth buying a course on altered states?",
                "The information is public and the clinical literature is free. A purchase is worth "
                "considering if you want a structured protocol with integration built in, because "
                "that is the part people skip and most courses that exist are better than nothing. "
                "Anything selling a substance is a different category and a different question, and "
                "nothing here replaces medical advice.",
            ],
        ],
        "related": [
            [
                "astral-projection-safety-complete-guide",
                "Astral Projection Safety: Complete Guide to Safe Out-of-Body Travel (2026)",
            ],
            [
                "binaural-beats-lucid-dreaming-guide",
                "Binaural Beats and Lucid Dreaming: What the Research Shows",
            ],
            [
                "dreams-astral-projection-and-tulpas-how-to-lucid-dream-guide",
                "Dreams, Astral Projection and Tulpas: How to Lucid Dream Guide",
            ],
            [
                "emotional-regulation-techniques-stoic-neuroscience",
                "Emotional Regulation: Complete Protocol, Stoic Philosophy Meets Modern Neuroscience",
            ],
            [
                "the-mind-science-of-practice-why-does-magic-work-placebo",
                "Why Does Magic Work? The Placebo Question Answered Properly",
            ],
        ],
    },
    134: {
        "lede": (
            "Almost every disagreement about magic in this field runs through a single word, and "
            "the word is belief. Not belief in the sense of faith, but belief in the technical "
            "sense: the stance you take toward a proposition before evidence has arrived. The "
            "argument below is arranged around that, because getting the technical sense right is "
            "what allows somebody to be fully committed and fully sceptical at the same time, which "
            "is the position most people who actually practise here end up in and almost nobody "
            "describes clearly. It covers what the parabola commits you to, how confirmation bias "
            "operates as a design constraint rather than a reproach, and what a record built to "
            "disagree with you actually looks like in practice."
        ),
        "sections": [
            {
                "h2": "Belief as a technical term, not a moral one",
                "p": [
                    "The word is usually used to mean something vaguer, which makes it useless for "
                    "argument. In its technical sense it means the credence assigned to a proposition "
                    "before the relevant evidence arrives, and that quantity can be held "
                    "consciously, revised, and reported on.",
                    "This is why the strong versions of the sceptic's position fail. They equate "
                    "practising with believing, which conflates a provisional commitment with a "
                    "closed one, and they then never have to engage with the actual results. It is "
                    "also why the believer's position is more modest than it sounds: holding a "
                    "sincere working commitment while keeping a record is not a contradiction.",
                ],
            },
            {
                "h2": "The parabola and what it does to the argument",
                "p": [
                    "Taken by itself, the parabola holds that a working has no built-in morality at all, and "
                    "that whatever character it ends up with is borrowed from the aim you brought to it. That "
                    "idea did a great deal of the practical work during the seventies and it is still the most "
                    "useful thing the tradition produced for anyone nervous about scope.",
                    "The cost is real. If nothing has an inherent character, nothing is excluded by "
                    "that fact, and the only limit is your own judgement, which is a less reliable "
                    "instrument than a rule. The parabola hands over the responsibility and then "
                    "leaves you carrying it, and that is usually a fair trade for people who would "
                    "rather not be governed by someone else's list.",
                ],
            },
            {
                "h2": "What commitment buys, and what it does not",
                "p": [
                    "Commitment buys one specific thing: you will do the steps. Write the sentence, "
                    "reduce it, charge it, log it, sit down on the appointed day. Most of what "
                    "gets attributed to belief in this field is actually the by-product of doing "
                    "those things repeatedly.",
                    "It does not buy accuracy of interpretation, and the record is what protects "
                    "you from your own reading. A committed practitioner without a log has more "
                    "access to false confirmation than a sceptic with one, because the sceptic is "
                    "not generating interpretations in the first place.",
                ],
                "ul": [
                    "Commitment produces the record. It does not interpret the record.",
                    "The steps are the mechanism, not the belief behind them.",
                    "A log plus scepticism is worth more than commitment plus none.",
                ],
            },
            {
                "h2": "A record built to argue with you",
                "p": [
                    "The effect is thoroughly documented and no reflection of character. It is what a "
                    "forecasting arrangement does whenever the rule handed to it can be met by "
                    "nearly any event. A working counts as successful once the goal is "
                    "reached, unsuccessful once the goal is dropped, and beside the point when the "
                    "target was mistaken regardless, so the rule is met by the world no matter what "
                    "the practice did.",
                    "Which makes it a design problem. The remedy is a narrow target, a "
                    "pre-registered prediction, a fixed deadline and a record containing the "
                    "misses. All four cost nothing and all four are abandoned by nearly everybody, "
                    "which is the reason this field looks the way it does from outside.",
                ],
            },
            {
                "h2": "Expectancy, with the edges marked",
                "p": [
                    "Expectancy moves reported pain measurably and touches a handful of "
                    "physiological measures. That is a real and bounded effect, and the open-label "
                    "placebo literature is the cleanest demonstration: people informed openly that "
                    "the substance does nothing sometimes report effects regardless, which makes the "
                    "claim that nothing happens without belief hard to state in its strong form.",
                    "The limit is equally clean. Expectancy does not heal disease, does not move "
                    "money and does not change another person's decisions. Every strong claim in "
                    "this area is a claim about the practitioner's own experience, and the moment a "
                    "claim is upgraded to an external effect the evidence simply is not there.",
                ],
            },
            {
                "h2": "A Bayesian practice, and why it is not a betrayal",
                "p": [
                    "Keeping a record, pre-registering a prediction and updating when the evidence "
                    "comes in is a Bayesian approach to practice, and it has nothing to do with "
                    "scepticism. You can believe a working will produce something and still be "
                    "willing to revise when it does not, and in fact that is the only version of "
                    "belief that produces any information.",
                    "The practical version is dull. Write what you expect. Write the date by which "
                    "you will check. Write what happened. Notice the direction of the result, not "
                    "its size. Repeat. Over a season this produces a rough estimate of how often "
                    "your workings land, which is a number very few people in this field have ever "
                    "calculated about themselves.",
                ],
            },
            {
                "h2": "Building the record so it can argue back",
                "p": [
                    "Four fields are enough, and the fourth is the one everybody leaves out. Date, "
                    "prediction, deadline, outcome. The outcome field must be able to hold a miss "
                    "in the same sentence as a hit, without qualification.",
                    "It should be written in the same session, in the same tone, with no narrative. "
                    "An entry rewritten afterwards into a tidy narrative is worse than leaving the page "
                    "blank, because it hands you certainty where the page was supposed to hold a question.",
                ],
                "ol": [
                    "Date the prediction before the working, not after.",
                    "Fix the deadline before the working, not at review time.",
                    "Record the outcome on the day, including what does not fit.",
                    "Revise your reading only after the deadline, and note that you did.",
                ],
            },
            {
                "h2": "Where sincerity and credulity part company",
                "p": [
                    "They part company at the moment the conclusion is allowed to arrive first. A "
                    "credulous reading is one where the desired result is treated as established by "
                    "a coincidence, and it is usually sincere, which is what makes it difficult to "
                    "spot from the inside.",
                    "The test is narrow and practical. Ask what the result would have looked like if "
                    "it had gone the other way, and whether you would have written that down. If "
                    "there was no version of the outcome that would have counted as a failure, you "
                    "did not run a test, and no amount of sincerity in the rest of the practice "
                    "compensates for that.",
                ],
            },
            {
                "h2": "What to do with all this on a Tuesday",
                "p": [
                    "One question with a checkable answer. One prediction, dated. One short working. "
                    "One line in the notebook the same evening. One review on the fixed date, "
                    "reading the entries only afterwards and revising the conclusion if they "
                    "disagree with it.",
                    "That is the entire apparatus, it takes about twenty minutes, and it is enough "
                    "to make any subsequent argument about belief considerably better informed. "
                    "Everything else in this field is elaboration on those five steps, and most of "
                    "the elaboration makes it worse rather than better.",
                ],
            },
        {
            "h2": "Belief as a number rather than a position",
            "p": [
                "The most useful move in the whole area is to treat your credence in a particular working as a quantity you could write down and revise, rather than as an identity you have. Almost nobody does this, including people who are careful about everything else.",
                "Try it once. Before a working, write how likely you think the outcome is. After the deadline, write it again. Most people find the first number was much higher than the evidence warrants and the second much higher than the first, and finding that out once is usually more persuasive than any argument anybody can make."
            ],
            "ul": [
                "What is my credence in this specific outcome, as a percentage?",
                "What would move it by ten points in either direction?",
                "Who else would have to agree before I changed it?",
            ],
        },
        {
            "h2": "Where the strong sceptic position fails",
            "p": [
                "The confident version argues that practising requires believing, which is false in the technical sense and confuses a provisional commitment with a closed position. Having made that move, the position never has to look at results at all, which is why it is so common and so rarely examined.",
                "The opposite failure belongs to some practitioners, who treat a provisional working commitment as a permanent one and then read everything afterwards as confirmation. Both errors have the same shape: a decision about how to interpret a result is made before the result exists, which is precisely what a test is supposed to prevent."
            ],
        },
        {
            "h2": "The season, laid out as a schedule",
            "p": [
                "Four months, one question at a time, nothing larger than a single afternoon's work. Each block is four weekly workings with an interleaved uncharged control, a written prediction, a fixed deadline, and one review at the end of the block.",
                "The reviews are the whole point. Read the entries before writing the conclusion and you will get a different and slightly worse answer, and doing both in that order for one block is enough to show anybody what the record is actually saying."
            ],
        },
        {
            "h2": "What the field has never done",
            "p": [
                "There is no published body of pre-registered trials in this area. Not a small one, not a bad one: none. Practitioners run workings, sometimes keep notes, and almost never publish the notes, which means the entire accumulated experience of the field exists as anecdote distributed informally and never aggregated.",
                "That is fixable at the level of one person, which is the level this page is written for. It is not fixable by argument, because there is no body of evidence to argue from. A season of your own careful record would add more to what is known than any amount of further reading, and it costs about twenty minutes a week."
            ],
        },
        {
            "h2": "The practice that produces no information and is still worth doing",
            "p": [
                "Receptive attention on a narrow, checkable target is dull and it works. Ninety seconds of sustained contact with a habitual reaction, counted and written down, produces a number about how often that reaction fires. That number is small, boring, entirely checkable, and available to nobody but you.",
                "It is also the only part of this area that a sceptic would not dispute, and it is not the part most people are looking for. Whatever else you take from a practice in this field, the trainable attention is the thing that survives contact with anybody else."
            ],
        },
        {
            "h2": "A review that can actually be defended",
            "p": [
                "Read the entries before writing the conclusion and you will get a different and slightly worse answer. Do both in that order for one block and the gap between them is the honest measure of how much interpretation is doing, which is the number very few people in this field have ever computed about themselves.",
                "The whole schedule fits in twenty minutes a week. That is the part that should make you suspicious of anybody selling you a more elaborate apparatus: if the record cannot be kept in twenty minutes, it will not be kept, and a record that is not kept is not a record."
            ],
        },
        ],
        "faq": [
            [
                "Does holding a belief make results worse?",
                "It can, and the mechanism is specific rather than mysterious. A belief about a "
                "particular outcome makes it easier to read any event as confirmation, and the "
                "result is a record that has stopped being able to disagree with you. The fix is "
                "not less commitment, it is a prediction narrow enough that failure would be "
                "visible, written down before the working.",
            ],
            [
                "Is a Bayesian approach compatible with taking the practice seriously?",
                "Yes, and it is more compatible than the alternative. A sincere commitment does not "
                "require suspending ordinary evaluation, and a practice that punishes you for "
                "checking it is asking for a kind of faith its own founders did not have. The "
                "combination most people who practise for years end up with is full commitment with "
                "an honest record.",
            ],
            [
                "What does the parabola actually commit me to?",
                "To the view that a working has no character of its own beyond the aim you gave it, "
                "which means the moral question is settled by the aim rather than by the technique. "
                "The practical cost is that the only limit left is your own judgement, so the "
                "tradition cannot supply the boundary and you have to supply it yourself.",
            ],
            [
                "How do I know whether my record is honest?",
                "Apply the failure test. Ask what the result would have looked like had it gone the "
                "other way, and whether you would have written that down. If nothing would have "
                "counted as failure, you were not running a test. If you edited an entry after the "
                "fact, the record has become a narrative and the two are not the same instrument.",
            ],
            [
                "Is there anything worth paying for in a practice like this?",
                "The practice and the record are free and should stay that way. A purchase buys the "
                "date arithmetic and somewhere durable to keep the log, which is the least interesting "
                "half, and if you keep one line a week in an ordinary notebook then nothing on sale "
                "improves it. The one exception is a timer for a receptive-attention exercise, where "
                "you genuinely cannot count duration accurately without one.",
            ],
        ],
        "related": [
            [
                "paradigm-shift-belief-as-tool",
                "Paradigm Shift & Belief as a Tool: Core Chaos Magick Concepts Explained",
            ],
            [
                "chaos-magick-for-skeptics-a-practical-intro",
                "Chaos Magick for Skeptics: A Practical Intro (2026)",
            ],
            [
                "stillness-meditation-cognitive-clarity",
                "The Power of Stillness: Complete Neuroscience Protocol for Expanding the Response Gap",
            ],
            [
                "the-mind-science-of-practice-why-does-magic-work-placebo",
                "Why Does Magic Work? The Placebo Question Answered Properly",
            ],
            [
                "sigil-failure-common-mistakes-practitioners-make",
                "Sigil Failure: Common Mistakes Practitioners Make (2026)",
            ],
        ],
    },
}
