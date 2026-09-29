# -*- coding: utf-8 -*-
"""Batch 01d - n=14 technomancy (A), n=15 goetia 72 (A), n=16 music (A), n=17 clarity (A)."""

ARTICLES = {}

# ---------------------------------------------------------------- n=14 technomancy / A
ARTICLES[14] = {
    "lede": (
        "Technomancy is a name for doing magic with the devices already sitting on your desk, and the name is "
        "newer than the practice. A phone that wakes you, a screen that renders a sigil, a terminal that signs "
        "a file, a speaker that plays a charge for you: each of these can be treated as an instrument rather "
        "than an obstacle. The people who use the term tend to care less about the hardware than about the "
        "gesture, because a screen makes the gesture visible, repeatable and timestamped in a way paper never "
        "was. What follows is a route in. It assumes you have done some ritual work already, or at least read "
        "enough to know that statements of intent, sigils and charge are the basic vocabulary. It does not "
        "assume you write code, though one section is about why the cryptographic analogy turns out to be "
        "closer to the truth than it first looks."
    ),
    "sections": [
        {
            "h2": "What technomancy is, stripped of the neon",
            "p": [
                "Every ritual tradition has needed a medium, whether vellum, sand, wax or paper, and each medium "
                "shaped the techniques built on top of it. A screen is a medium with unusual properties: it "
                "updates, it stores, it signs, it broadcasts, and it is already in the hand when you sit down to "
                "work. Treat it as substrate rather than as a display and the practice becomes ordinary, which "
                "is the point.",
                "The definition that earns its keep is narrow. Technomancy is the use of a computational device "
                "as a deliberate ritual medium, in a sequence the practitioner could repeat and another person "
                "could audit. Drop the deliberate and you have automation. Drop the repeatable and you have a "
                "novelty. The word is worth using only when both halves survive.",
            ],
        },
        {
            "h2": "Where the word came from, and where the movement did",
            "p": [
                "Crowley borrowed the term in a short 1910 essay that proposed treating modern technology as the "
                "next substrate for magic, which is roughly a century ahead of the people now using it as a "
                "job title. Nothing much happened for fifty years. The vocabulary that people actually mean by "
                "it arrived in the late eighties and nineties out of chaos magic, industrial music culture and "
                "the early hacker habit of treating a system as a text you can argue with.",
                "By the late nineties you had cyberpunk, technopagan networks and the first web grimoires, and "
                "the pieces had started to mix. Understanding that the word has a long unused tail and a short "
                "busy life stops you from reading a Victorian attitude into it. Crowley was reaching forward. "
                "The people who picked the word up were reaching sideways, into a machine already running.",
            ],
        },
        {
            "h2": "The device treated as an instrument, not an audience",
            "p": [
                "The most common beginner error is treating a screen as a window onto somewhere else. A better "
                "framing is that the screen is the surface of the working itself. A generated sigil is designed "
                "to be displayed rather than drawn. A charge performed by tapping, dragging or holding a contact "
                "is a gesture, and gestures are what ritual runs on. The interface is not decoration around the "
                "ritual. It is the part you are touching.",
                "Once the device is an instrument, the question of what counts as deliberate interaction becomes "
                "operational rather than philosophical. Opening an app is a decision. Timing a change to land at "
                "a specific minute is a decision. Deleting a file so the glyph can no longer be read is a "
                "decision, and a fairly aggressive one. You can check all three by asking whether you would have "
                "done it in front of someone.",
            ],
        },
        {
            "h2": "Why a screen behaves differently from paper",
            "ul": [
                "Paper is dead the moment you set it down, which makes the artifact the only record of the working.",
                "A screen is alive and interruptible, so a charge can be suspended and resumed without erasing it.",
                "Screens confirm themselves, which is a real risk and not only a convenience.",
                "Paper is private by default; screens leak into backups, clouds and screenshots.",
            ],
            "p": [
                "Four differences matter in practice. Paper is inert once you set it down, so the artifact is the "
                "only record of what happened. A screen holds state, so a charge can be interrupted and picked up "
                "an hour later without any loss. Screens also confirm themselves, which is convenient and "
                "dangerous, because a glyph that renders beautifully tells you nothing about whether it worked. "
                "And paper is private by default while a screen is not.",
                "The privacy point deserves more weight than it usually gets. A sigil in a notebook stays in the "
                "notebook. The same sigil in a photo library sits in three cloud backups and one sync folder. "
                "That is not a reason to avoid the medium. It is a reason to decide deliberately which working "
                "goes on a device and which goes on paper, and to write that decision down before you start "
                "rather than after you have already uploaded something.",
            ],
        },
        {
            "h2": "A first working you could finish in one evening",
            "ol": [
                "Pick one small, checkable intent and write it as a single imperative sentence.",
                "Reduce it to a glyph, by hand or with a generator, and check the reduction reads back.",
                "Open it on the largest screen you have, in a room where you will not be disturbed.",
                "Set a timer for ninety seconds and interact with the screen on purpose throughout.",
                "Dismiss it, close the tab, and write the log entry before you touch anything else.",
            ],
            "p": [
                "The whole thing takes less than half an hour including the log. Choose an intent small enough "
                "that you will know within a week whether it happened, because an intent that takes a year to "
                "verify teaches you nothing except that you are patient. Reduce it to one glyph, put that glyph "
                "on screen, and interact with it deliberately for a fixed span. Ninety seconds is a common "
                "choice and it is arbitrary. What matters is that the number is decided in advance.",
                "Then dismiss it properly. Closing a tab is not a dismissal. A dismissal is a small deliberate "
                "act that ends the working, and the reason to do one is that leaving a charge open on a device "
                "that keeps running is a real way to make your attention leak. The order matters too: log first, "
                "then close everything else. Otherwise the log becomes an account reconstructed three days "
                "later, and reconstruction is where honest notes turn into flattering ones.",
            ],
        },
        {
            "h2": "Why the cryptographic analogy holds up",
            "p": [
                "Sigilisation is a compression scheme. You take a sentence with redundancy in it, reduce it to a "
                "glyph that carries the same instruction in fewer marks, and store the glyph. A checksum does "
                "exactly that to a file, and a digital signature does something rather more interesting: it binds "
                "a piece of data to a key so that later verification proves the data has not changed and was not "
                "produced by someone else. The parallel to a charged sigil is close enough to be worth thinking "
                "with, and it is close enough that you should know where it fails.",
                "It fails at verification. A signature tells you a file has not been altered since the key signed "
                "it. It tells you nothing about whether the file does what its author hoped. Nor does a hash "
                "confirm that its input was worth hashing. This is the exact shape of the mistake that shows up "
                "in digital sigil practice: mistaking a coherent artifact for a demonstrated effect. The analogy "
                "sharpens the method. It does not license the conclusion, and holding both of those at once is "
                "the whole intellectual work of doing this carefully.",
            ],
        },
        {
            "h2": "Consent, and who is actually in the room",
            "p": [
                "A screen ritual has an obvious fact that a paper ritual mostly avoids. The device is connected "
                "to other people. A message sent, a post published, a purchase completed, a call placed: the "
                "working has left the room and reached someone who never consented to be involved. Consent "
                "discipline here is not politeness, it is basic accuracy about what you did.",
                "The workable rule is to separate the two halves of any digital working. The part that touches a "
                "device only you own can be as elaborate as you like. The part that touches another person's "
                "attention, data or money needs their agreement, and preferably needs it in a form you could "
                "show someone afterwards. A great many online rituals fail this quietly, by including a share "
                "button in the middle of what was supposed to be a private charge.",
            ],
        },
        {
            "h2": "Failure modes specific to screen work",
            "ul": [
                "The beautiful render that proves only that the generator works.",
                "The ritual built around a service that can quietly change or vanish.",
                "The charge performed on a device you will touch again in forty other contexts.",
                "The log kept in the same place as the notifications it should be separate from.",
            ],
            "p": [
                "Four failures recur often enough to name. The first is mistaking a competent artifact for a "
                "result, which the technology actively encourages because the artifact is the part that feels "
                "good. The second is depending on infrastructure you do not control, since an application that "
                "changes its glyph algorithm between versions will quietly alter your practice. The third is "
                "charging on a device you also use to argue with people. The fourth is keeping the log where the "
                "reminders live, so that the practice becomes a source of ambient pressure rather than of "
                "record.",
                "None of these are reasons to stop. They are reasons to write the working down in a form that "
                "outlives the tool, to keep a paper copy of anything generated, and to reserve at least one "
                "device or account for the practice that has no other job. The habit is cheap and it removes "
                "most of the ways this material goes wrong in practice.",
            ],
        },
        {
            "h2": "Recording a screen working honestly",
            "p": [
                "Write the log the same day and in the same shape you used before. Date, intent, glyph or its "
                "identifier, device, minutes, what you expected, what you noticed, and whether you would call "
                "it a result. The device field is the one people skip and the one that becomes decisive later, "
                "because it is what lets you notice that the thing that worked happened on the quiet evening and "
                "not the one where you also changed three other things.",
                "Two habits make these records worth having months later. Write down what you expected before "
                "you start, not after, so the expectation cannot drift. And record the nulls, especially the "
                "workings where nothing happened and you were busy for two weeks anyway. A log containing only "
                "successes is useless for the only question people ever actually ask a log, which is whether "
                "any of this does anything at all.",
            ],
        },
        {
            "h2": "The split inside the community",
            "p": [
                "The disagreement is not really about whether screens can be ritual. It is about whether a "
                "medium that was designed for efficiency can be made to carry attention, or whether it will "
                "always train attention away. One camp says the feed trains shallow switching, so nothing "
                "requiring sustained concentration can be done on a phone. The other says a page held still and "
                "chosen deliberately is no more fragmentary than a page of a book, and the fragmentation lives in "
                "the surrounding notifications rather than the device.",
                "Both descriptions are accurate, which means the useful response is empirical rather than "
                "argumentative. Test on a quiet device, in a room with nothing else happening, and see whether "
                "you can hold a ninety second charge. Most people can. Then test on the device you actually use "
                "during the day and see whether you can do the same thing there. The difference between those two "
                "results is the most useful thing this material has to offer you.",
            ],
        },
        {
            "h2": "What is worth building first",
            "ol": [
                "A single small intent, reduced to one glyph you can draw without looking.",
                "A quiet device or a dedicated window with notifications actually switched off.",
                "A fixed charge length decided in advance, somewhere between a minute and five.",
                "A dismissal with a physical component, so the ending is not just a gesture.",
                "A written log the same day, in a format you will still be able to read in a year.",
            ],
            "p": [
                "If you are starting, build the smallest version of this that you can actually repeat. One "
                "intent, one glyph, one device, one fixed length of time, one dismissal, one written note. None "
                "of that is impressive and all of it is load bearing, because a practice you repeat is a "
                "practice you can learn from and a practice you cannot repeat is a series of events you will "
                "misremember in your own favour. Add complexity only when the simple version has been done "
                "often enough that you are no longer noticing it.",
            ],
        },
    ],
    "faq": [
        [
            "Is technomancy real magic or just rebranding?",
            "The honest answer is that the label does not settle the question, and the practice can be evaluated "
            "without it. Whether a screen-based working produces an effect is the same empirical question as for "
            "any other method, and it is answerable with a written prediction, a deadline and an honest log. "
            "What technomancy adds is a set of conventions about using computational media deliberately, which "
            "is worth having whether or not you believe anything about the substrate underneath.",
        ],
        [
            "Why use a screen instead of drawing on paper?",
            "Three reasons, none of them mystical. A screen can render a glyph from a definition, so the "
            "reduction becomes repeatable rather than dependent on your hand. It can be timed to the minute, "
            "which makes a fixed-duration working practical. And it can be kept, copied and compared over "
            "years, which means your archive can be checked against your predictions instead of remembered.",
        ],
        [
            "Do I need to know how to code?",
            "No. Most of what gets described as technomancy is gestures, images, timing and written intent, and "
            "none of it requires programming. The programming argument belongs to a narrower line of work where "
            "code is the sigil itself, generated rather than drawn. That version is genuinely interesting and it "
            "is also a separate discipline. You can spend a year on the non-programming version and never touch it.",
        ],
        [
            "Is it safe to do workings on a device I use every day?",
            "It is safe in the ordinary sense, which is not the same as costless. The practical risks are "
            "attention fragmentation, records that end up synced somewhere you did not intend, and the slow "
            "loss of a ritual boundary once every screen becomes an altar. A dedicated device is the obvious "
            "answer and an expensive one. A dedicated window with notifications genuinely disabled achieves most "
            "of the same thing for nothing.",
        ],
        [
            "Is a paid tool worth it for a digital working?",
            "The reduction, the drawing and the timing are free and can be done with paper, a timer and a pen. "
            "What a paid tool buys is bookkeeping: a library that keeps every glyph with its date and intent, so "
            "that months later you can ask which of them coincided with what. That is the unglamorous half of "
            "the practice and the half that most people abandon first. Buying the ritual itself is rarely worth "
            "it, because the ritual was never the scarce part.",
        ],
    ],
    "related": [
        ["cyber-paganism-digital-spirituality-guide", "Cyber-Paganism: The New Techno-Spirituality Movement (2026)"],
        ["technomancy-and-cyber-occultism-technomancy-guide-6", "Technomancy: Working Sigils Through Code and Screens"],
        ["digital-spellcasting-technomancy-guide", "Digital Spellcasting: How to Build a Tech-Enhanced Ritual Technomancy Guide (2026)"],
        ["what-is-technomancy-digital-magic", "Technomancy: Digital Magic for the Modern Mage (2026)"],
        ["chaos-sigil-generator-app-review", "Chaos Sigil Generator App Review: Digital Sigil Making on Android (2026)"],
    ],
}

# ---------------------------------------------------------------- n=15 goetia 72 / A
ARTICLES[15] = {
    "lede": (
        "The seventy-two spirits of the Ars Goetia have been badly served by the popular imagination. They arrive "
        "on book covers and television as monsters, and the historical material describes something closer to a "
        "court of officials with rigid remits, contracts and a chain of command. Both readings come from the "
        "same seventy-two entries, and the difference between them is the difference between a historical "
        "document and a brand. This is a first approach: what the text actually says, where the text came from, "
        "what the three ranks were for, and what a person should reasonably do with the whole thing. Nothing "
        "here asks you to believe anything on the basis of the source material, and the entries are worth "
        "reading precisely because they are so specific about limits."
    ),
    "sections": [
        {
            "h2": "What the seventy-two entries actually are",
            "p": [
                "Each entry gives a name, a rank, a family grouping and a short description of powers, followed "
                "by the rank's standing and the number of souls it governs. The descriptions read like a "
                "reference manual rather than a horror story. A duke of the first rank might be described as "
                "granting the arts of the liberal professions, discovering hidden things, or giving a familiar "
                "at will. There is no narrative in any of it. No one is tortured. The tone throughout is "
                "bureaucratic in a way that unsettles people who expected menace.",
                "That register is the first useful thing to notice, because it tells you what kind of text you "
                "are reading. This is a catalogue of offices. It is closer in shape to a medieval bestiary or a "
                "table of planetary hours than to anything you would call fiction. Reading it as a bestiary "
                "produces much less confusion than reading it as a horror story, and it also explains the "
                "structure: the seventy-two are not a legion, they are a court.",
            ],
        },
        {
            "h2": "Three ranks, nine thirty-six thirty",
            "p": [
                "The hierarchy is fixed and it is the spine of the whole document. Nine are Presidents, the "
                "highest rank, and they are given the more expansive powers along with the greater number of "
                "souls. Thirty-six are Dukes, who do most of the practical work. Thirty are Kings. Promotion runs "
                "in one direction. A spirit does not rise, and the text does not pretend it might.",
                "For a modern reader the ranks are best understood as a grading of capability rather than a "
                "ranking of evil. The Presidents are the specialists with the broadest remit. The Dukes are the "
                "workhorses, which is why most of the practical material online concerns Dukes. The Kings have "
                "the smallest group and the largest holdings, and several of them concern themselves with "
                "dignities, titles and rank, which is thematically consistent and also quite funny.",
            ],
            "ul": [
                "Nine Presidents, the broadest powers and the largest holdings.",
                "Thirty-six Dukes, the working rank and the one most practical material concerns.",
                "Thirty Kings, fewer in number, more self-important, often concerned with titles.",
                "One direction of travel only, and no spirit in the text is promoted.",
            ],
        },
        {
            "h2": "Where the material came from",
            "p": [
                "The seventy-two descend from Jewish and Christian demonological sources, most visibly the "
                "Pseudepigrapha Book of Enoch, in which a named group of fallen watchers is given authority over "
                "the nations. From there the list passes through medieval and early-modern compilations, "
                "including a seventeenth-century conjuration text, and finally into the printed grimoire tradition "
                "that produced the Ars Goetia. The genealogy is long, mixed and documented. It is also not "
                "ancient in the sense the popular version implies.",
                "A second layer sits on top of all this. Modern Goetia as a commercial and online category is a "
                "twenty-first-century phenomenon, built out of this older material plus nineteenth-century "
                "occult revival plus game design plus film. Calling the brand ancient is the single most common "
                "historical error in circulation. Calling the source material old and complicated is accurate, "
                "and it does not require you to accept any supernatural claim to say so.",
            ],
        },
        {
            "h2": "The classical context the media dropped",
            "p": [
                "In the demonological sources these beings were not torturers of the innocent. They were "
                "disciplinary officials, comparable to a set of powers with jurisdiction over particular "
                "sins, temptations or failures, and they operated within rules. The Goetia text says so itself: "
                "the spirits are bound, they may not harm without leave, and they are to be called according to "
                "the office they hold. That is an administrative arrangement, not a haunting.",
                "The shift happened through retellings rather than through the source text. Once the names "
                "circulated without the entries attached, the offices came off and the monsters remained. This "
                "matters practically, not merely historically, because the classical framing is the one that "
                "produces a workable practice. Work with a bound official in a defined office and you can state "
                "terms, check terms and close the arrangement. Work with a predator and all you have is fear, "
                "which is not a protocol.",
            ],
        },
        {
            "h2": "Reading an entry without getting carried away",
            "ol": [
                "Write out the rank and the office before anything else in the entry.",
                "Note the powers as a list of specific verbs, not as an impression.",
                "Note the holdings, since the text is precise about numbers.",
                "Check whether the entry says the spirit may not do something.",
                "Write your own one-line summary before reading any commentary at all.",
            ],
            "p": [
                "The entries reward a cold reading, which is surprising given how often they are read "
                "enthusiastically. Write the rank down first, because rank governs everything else. Then convert "
                "the powers into a list of verbs: grants, discovers, teaches, gives, governs, fortifies. The list "
                "is unglamorous and it is what the text says. Note the holdings too, since the numbers are "
                "specific and useful. Then note the prohibitions, which are the part almost everybody skips and "
                "which is where the practical instruction actually lives.",
                "Do the summary before the commentary, not after. Once you have read someone else's "
                "interpretation you cannot unsee it, and half the wildly different claims circulating about "
                "particular spirits are simply that person's reading pasted over the text. The one-line "
                "summary is also the thing that makes the entry usable, because an office you can state in a "
                "sentence is an office you could actually approach.",
            ],
        },
        {
            "h2": "What working with one is supposed to involve",
            "p": [
                "On the classical understanding, the interaction is a contract with a bound official. You state "
                "a request within the office's remit, you accept that the answer comes in the shape the office "
                "allows, and you close the arrangement properly afterwards. The popular version replaces all of "
                "that with a dare. Nothing in the historical material requires the dare, and the daring framing "
                "is the reason a lot of people who start with the goetia end up frightened of it.",
                "Practical consequences follow from taking the administrative framing seriously. Choose by "
                "stated office rather than by reputation, since reputation in this corpus is mostly modern "
                "invention. Stay inside the office, because asking a spirit for something outside its remit is "
                "how a working turns into an argument. And decide in advance what you are willing to accept, "
                "because an arrangement with no stated expectation is an arrangement that produces "
                "disappointment rather than results.",
            ],
        },
        {
            "h2": "The people the medium picks out",
            "p": [
                "A small number of entries are asked for constantly. Ones associated with riches. Ones "
                "associated with love. Ones associated with knowledge or with the sight of hidden things. The "
                "repetition is predictable and it is not entirely the fault of the audience, because the corpus "
                "is grouped by nation, by rank and by office, which makes it easy to look up an interest rather "
                "than an alignment.",
                "The alternative is to work backwards from the office to the question. If your actual situation "
                "is a decision you keep deferring, an entry concerning counsel or discovery is a better fit than "
                "an entry concerning wealth, even if wealth is what you said you wanted. Most people asking the "
                "wealth entries are not asking about money. They are asking about a feeling, and the entry will "
                "not supply it.",
            ],
        },
        {
            "h2": "The failure modes, named",
            "ul": [
                "Expecting the text to describe the modern version of the spirit.",
                "Asking for something outside the office the entry defines.",
                "Reading commentary instead of the entry and calling it the entry.",
                "Leaving an arrangement open because closing it felt anticlimactic.",
                "Treating a frightening name as evidence of a dangerous nature.",
            ],
            "p": [
                "Five come up repeatedly. Expecting the modern version means assuming a television character "
                "rather than an office. Asking outside the remit is the direct route to a working that produces "
                "nothing and a person who is now convinced the spirit is withholding. Reading commentary first "
                "means the interpretation sticks. Leaving arrangements open is the one that actually causes "
                "trouble, because an open contract in this material behaves like an open contract anywhere else. "
                "And treating a frightening name as evidence of danger is simply a bad inference, made "
                "consistently by people who would never make it about a colleague.",
            ],
        },
        {
            "h2": "Where the corpus is genuinely useful today",
            "p": [
                "Strip the supernatural claim and you still have a well-organised catalogue of human concerns. "
                "Nations, ranks, offices, holdings, prohibitions. It is a taxonomy of wants, written down eight "
                "hundred years ago by people who had not yet decided that wanting things was embarrassing. That "
                "is a genuinely useful document for anyone trying to get honest about what they are actually "
                "after in a working, because it makes the request concrete enough to be examined.",
                "It is also a document about limits, which is its real value. Every entry says what a spirit may "
                "not do without leave, and reading those clauses together gives a fairly complete picture of the "
                "conditions under which this material was imagined to operate. Very little modern practice "
                "quotes them, which is the clearest sign that most current usage is not engaging with the text "
                "at all and is instead using a list of names for atmosphere.",
            ],
        },
        {
            "h2": "A reasonable first contact",
            "ol": [
                "Read three entries in one rank rather than three famous names across all of them.",
                "Choose the one whose office is closest to the situation you are actually in.",
                "Write the request in a single sentence with a named deadline.",
                "State what you will accept and what counts as a refusal.",
                "Close it in writing, dated, whether or not anything happened.",
            ],
            "p": [
                "If you are approaching this for the first time, the sequence above is less about the spirits "
                "than about keeping yourself in the clear. Reading one rank rather than the famous names gives you "
                "the structure instead of the hooks. Choosing by situation rather than by reputation keeps the "
                "request honest. A single sentence with a deadline stops the arrangement from quietly expanding "
                "to cover your whole life. Stating what counts as a refusal in advance is the part that stops a "
                "null result from being felt as a personal slight. And the written close, dated either way, is "
                "what turns an atmosphere into a record.",
            ],
        },
    ],
    "faq": [
        [
            "Which demon gives money?",
            "The corpus names more than one entry connected to riches, and it is worth noticing that their stated "
            "powers are about access, discovery and the removal of obstacles rather than creation. Nothing in the "
            "historical sources describes a spirit manufacturing wealth from nothing. If your situation is a "
            "specific financial obstacle, an entry that governs discoveries or obstacles may be the better fit "
            "than the famous one, and the difference matters more than the name.",
        ],
        [
            "Who are the nine Presidents?",
            "They are the highest rank, nine in number, holding the broadest remits and the largest number of "
            "souls, and they are described in terms of offices rather than powers. A reader coming to them from "
            "film will find the descriptions dull, which is the correct reaction. The rank structure is what gives "
            "the text its shape, and understanding it early saves a lot of confusion about why a duke and a "
            "president are treated as so different in practice.",
        ],
        [
            "Are these demons in any real sense?",
            "That question has three possible answers depending on which text you consult. The source materials "
            "present them as named powers with jurisdictions, which is a claim about the structure of the "
            "spiritual world. The grimoire presents them as a court to be petitioned, which is a claim about how "
            "to get things done. Modern popular culture presents them as monsters, which is a claim about "
            "nothing in particular. You can read the first two without the third, and most of the confusion in "
            "this area comes from reading the third and assuming it is the source.",
        ],
        [
            "Is working with one of these dangerous?",
            "Not in the sense the popular material implies, but not in a way that should be waved away either. "
            "The genuine risks are psychological and contractual: an arrangement framed as a bargain with an "
            "external power can externalise your own impulses, and that is how people end up making commitments "
            "they would never make deliberately. Some entries concern themselves with authority, domination or "
            "harm to others, and those are worth leaving alone whatever the framing.",
        ],
        [
            "What does a paid application actually add here?",
            "The text is public, free, and in the public domain. A paid tool adds search, cross-referencing and "
            "a clean interface, which is convenience rather than access. The one thing that is genuinely hard to "
            "do for yourself is keeping a record of your own workings, with dates and outcomes, so you can check "
            "months later whether any of it coincided with anything. That bookkeeping is what makes the "
            "difference between a practice and a collection of memories.",
        ],
    ],
    "related": [
        ["72-goetia-demons-complete-list", "The 72 Goetia Demons: Complete List and Meanings"],
        ["goetia-cabinet-classification", "Goetia Cabinet Classification: The Three Ranks Explained"],
        ["goetia-beginners-ritual", "How to Safely Invoke a Goetic Spirit for Beginners: Step-by-Step Ritual 2026"],
        ["goetia-spirits-faq", "Goetia Spirits FAQ: The Questions People Actually Ask"],
        ["oneiros-72-demons-of-goetia", "Oneiros: The 72 Demons of Goetia"],
    ],
}

# ---------------------------------------------------------------- n=16 music / A
ARTICLES[16] = {
    "lede": (
        "Music is the oldest piece of technology most occult practices still have not examined properly. It is "
        "in the ceremony, it is in the drum, it is in the chant, and for most of written history it has been the "
        "one element of ritual that nobody felt the need to justify because it plainly does something to a room "
        "full of people. That something is measurable, partly understood, and considerably more useful than most "
        "of what gets offered in its place. This is a first route into musical ritual for a practitioner who "
        "has not thought about it as a technique. It treats tempo, entrainment and attention as the working "
        "materials, and it is honest about which of the popular claims about sound have held up under testing."
    ),
    "sections": [
        {
            "h2": "Why sound is the oldest instrument",
            "p": [
                "Anthropologists who have examined ritual in most of the traditions available to them have found "
                "music doing structural work in nearly all of them, and they have found it doing the same kinds of "
                "work each time. Rhythm synchronises a group. Pitch shifts an emotional register. Repetition "
                "carries attention. A voice trained or lowered makes language harder to parse and therefore easier "
                "to feel. None of that requires a supernatural explanation, and all of it is why ritual that "
                "omits sound usually feels thinner than ritual that includes it.",
                "There is a second function which is less discussed and more interesting. In several traditions "
                "the sung or chanted text is deliberately hard to understand, whether through unusual language, "
                "layered melody or a volume that overwhelms the words. The effect is well documented. It lets a "
                "group feel something collectively without thinking about it in individual terms, which is "
                "useful in ways that pure doctrine often is not.",
            ],
        },
        {
            "h2": "Entrainment, and what it does and does not show",
            "p": [
                "Entrainment is the alignment of a neural oscillation to an external rhythm, and it is real and "
                "reasonably well studied. Movement to a beat synchronises motor activity, tempo affects arousal, "
                "and people reliably match their own pacing to external rhythm across a wide range of tempos. "
                "What is much less solid is the claim that a particular sound frequency forces a brain into a "
                "specific state. That version is the one sold heavily and it has a poor record in controlled "
                "studies.",
                "It is worth being precise, because the gap between the two is where a lot of confusion lives. "
                "Rhythmic entrainment is a substantial literature with real effects and modest magnitudes. "
                "Frequency-specific entrainment claims generally have not replicated. Most of the impressive "
                "language on the subject is borrowed from the first category and applied to the second, which "
                "produces claims that sound more scientific than the evidence base allows.",
            ],
        },
        {
            "h2": "Binaural beats, honestly assessed",
            "p": [
                "Binaural beats are a genuine perceptual phenomenon. Present two tones of slightly different "
                "frequency separately to each ear and listeners frequently report a pulsing sensation at the "
                "difference. That perception is real and its dependencies are well documented. Headphones are "
                "required, because the effect depends on the sounds arriving separately at each ear. Without "
                "them you hear two tones.",
                "The leap is from that perceptual effect to claims about altered states of consciousness, and it "
                "is where the evidence is thin. Studies claiming entrainment-driven changes in attention or "
                "brainwave state have been inconsistent, and several widely circulated trials are difficult to "
                "reproduce. That does not make binaural beats useless. It makes them a technique to try, with a "
                "sceptical eye, rather than a mechanism to explain your practice with. Testing them yourself for "
                "a fortnight costs nothing and settles more than any amount of reading.",
            ],
        },
        {
            "h2": "Tempo as the most reliable lever",
            "ol": [
                "Around fifty to sixty beats per minute for work that should feel deliberate.",
                "Around sixty to ninety for physical movement and repetitive tasks.",
                "Ninety to one hundred and twenty for anything meant to be driven.",
                "Anything above that for work meant to be abandoned and enjoyed.",
            ],
            "p": [
                "If you want one usable result from this material, it is that tempo is the reliable variable. "
                "Psychological research on musical tempo is unusually consistent: arousal tracks tempo, sustained "
                "effort tolerates a narrow band, and both effects are large enough to notice and small enough to "
                "be safe. The bands above are rough and are meant as a starting point rather than a prescription.",
                "The reason tempo is more reliable than frequency is that the body has no dedicated receptor for "
                "a particular pitch, but it has an excellent and constantly updated model of a beat. That is why "
                "a tempo can pull you along and a tone cannot. A charge performed to a fixed tempo also has the "
                "practical advantage of being countable, which means you do not have to sit there watching a "
                "clock and wondering whether the minute is up.",
            ],
        },
        {
            "h2": "Building a first musical charge",
            "p": [
                "Choose one track whose tempo you have checked rather than one you merely like. Sit with it once "
                "before the working so the tempo is familiar and the song is not a surprise in the middle. Then "
                "run the charge to the beat rather than to a stopwatch, and count internally rather than out "
                "loud, since audible counting competes with the thing you are trying to hold.",
                "Keep the length a whole number of bars so that the end lands where the music says it should. That "
                "is a small piece of structure and it changes the feel of a working considerably, because the "
                "closing is no longer an interruption of something. The instrument itself matters less than "
                "people expect, and repetition matters more, so the same track used across a run of workings is a "
                "better choice than a varied playlist.",
            ],
        },
        {
            "h2": "Voice, and the oldest instrument of all",
            "p": [
                "A sung or spoken charge does something a recorded track cannot, because the effort of producing "
                "it keeps you in the working. Chanting is exhausting in a way that is not incidental, and the "
                "exhaustion is a reliable marker that you were present for the whole of it. Breath control forces "
                "a slow pace, and a slow pace forces attention, and attention is the actual mechanism behind most "
                "of what gets called concentration in any tradition.",
                "If you have never done this, the least complicated version is a single repeated syllable on a "
                "single note, for a fixed number of breaths, at a tempo you set by tapping rather than by singing "
                "faster. The syllable does not need meaning. Tonal systems in the Western tradition were partly "
                "built for exactly this, and the fact that they were abandoned in favour of equal temperament for "
                "instrumental reasons has nothing to say about whether they work.",
            ],
        },
        {
            "h2": "Sound for dispersal and for closing",
            "p": [
                "Music is also the most efficient thing available for the moment when a working ends, and this is "
                "the half of musical ritual that is almost always handled badly. Closing work wants a change in "
                "register, and a change in register is exactly what a shift in tempo or instrumentation does. "
                "Hard cuts leave people slightly stranded. A track that moves somewhere else does not.",
                "The practical sequence that works well is to have the closing music ready before the working "
                "starts, since finding something in the moment tends to produce an internet search rather than a "
                "dispersal. Play it at a volume low enough to talk over afterwards, and let the room fill with it "
                "rather than starting it abruptly. This is theatre, which is not a criticism, and it is also the "
                "single most noticeable difference between a closing that lands and one that does not.",
            ],
        },
        {
            "h2": "Can a sigil be made out of sound?",
            "p": [
                "Yes, and the version that works is reduction rather than representation. Take a statement of "
                "intent, reduce it the way you would reduce it to a glyph, and map the result onto a short "
                "motif played on a voice or a single tone. The motif does not need to describe anything. It needs "
                "to be short enough to hold in the head and distinct enough that you know when it has occurred. "
                "That is the same requirement as a glyph, and the same discipline applies, which is that the "
                "encoding step and the activation step should not be done in one motion.",
                "What sound loses is inspection. A glyph can be looked at, photographed, shown to someone and "
                "checked later. A motif has to be remembered, and memory is unreliable in exactly the direction "
                "that matters, since you will remember the ones you liked. Writing the reduction down in "
                "notation or as a written description costs thirty seconds and is what makes the working "
                "repeatable in a way a melody you invented is not.",
            ],
        },
        {
            "h2": "Choosing music that suits the working",
            "ul": [
                "Instrumental material, since lyrics compete with anything you are trying to say.",
                "No vocal in a language you speak, unless the language is the point.",
                "A tempo you have looked up rather than one you assumed.",
                "Something you have sat with once before, so it is not a novelty.",
                "A length that divides by the length of the working.",
            ],
            "p": [
                "Five filters do most of the work, and they save a surprising amount of time compared to browsing. "
                "Instrumental material removes the competition between the track and your own intention. A vocal "
                "in a language you speak is genuinely disruptive for most people, and choosing a language you do "
                "not speak is a cheap way around that. Looking the tempo up takes twenty seconds. Sitting with a "
                "track before using it means the working starts from a known state rather than a discovery. And "
                "matching length means the end of the working is already built into the recording.",
            ],
        },
        {
            "h2": "What to record so the method improves",
            "p": [
                "Record four fields for every musical working: the track, the tempo, the length in minutes or "
                "bars, and what you were doing with your attention during it. The last field is the one that "
                "carries the information. Two workings with identical tracks and tempos can feel entirely "
                "different, and the difference is almost always whether you were counting, waiting, imagining, "
                "or listening to the words.",
                "After a dozen workings this is enough to see your own pattern, and the pattern is usually not "
                "the one you would have guessed. Most people find they hold attention well for one kind of task "
                "and badly for another, and the music reveals which. That is a finding worth having, and it comes "
                "out of a log rather than out of a doctrine about which frequencies are sacred.",
            ],
        },
    ],
    "faq": [
        [
            "Do binaural beats actually work?",
            "The perception is real and the effects are not reliably there. Two slightly different tones played "
            "separately to each ear do produce a reported pulsing sensation, and that effect is well documented. "
            "The leap from that sensation to claims about altered consciousness or brainwave states is the part "
            "that has not replicated consistently. Treat it as something worth a fortnight of your own testing "
            "rather than a mechanism that explains anything.",
        ],
        [
            "What music works best for ritual?",
            "For most people, instrumental material at a slow tempo that has been looked up rather than "
            "assumed. Slow tempos support sustained attention, instrumental tracks avoid competing with your own "
            "intention, and a checked tempo means you can work to the beat instead of watching a clock. The same "
            "track across a run of workings is better than a varied set, because familiarity removes a variable.",
        ],
        [
            "Can I make a sigil out of sound?",
            "Yes, by reduction rather than representation. Reduce your statement of intent to its essential "
            "elements, map those onto a short motif, and treat the motif as the sigil. The discipline is "
            "identical to the visual form, including the separation of the encoding step from the activation "
            "step. Write the reduction down in some form, because a melody you invented will be misremembered "
            "in the direction you prefer.",
        ],
        [
            "Does the genre or tradition of the music matter?",
            "Less than you would expect, and less than the discourse around it suggests. What carries the effect "
            "is tempo, familiarity, and whether the track competes with your intention. A piece of music from a "
            "tradition you are not part of is not made more effective by the association, and a secular piece is "
            "not made less effective by its origin. If you are working within a specific tradition then its "
            "prescriptions are the relevant constraint, because they encode real decisions about attention.",
        ],
        [
            "What am I paying for if I buy an app for musical workings?",
            "Tempo lookup, a timer that runs to bars, and a log that remembers which track you used on which "
            "date. The music itself you already have. The log is the part worth paying for, because musical "
            "workings are easy to remember as having worked and nearly impossible to check after the fact "
            "without a written record of the four fields. Anything that promises a specific frequency to "
            "specific effect is selling something the evidence does not support.",
        ],
    ],
    "related": [
        ["binaural-beats-lucid-dreaming-guide", "Binaural Beats and Lucid Dreaming: What the Research Shows"],
        ["monroe-method-hemi-sync-astral-travel", "The Monroe Method and Hemi-Sync: A Practical Assessment"],
        ["candle-magic-beginners-guide", "Candle Magic for Beginners: A Complete Starting Point"],
        ["lunar-magic-rituals-spells-complete-guide", "Lunar Magic: Complete Ritual Collection"],
        ["stillness-meditation-cognitive-clarity", "The Power of Stillness: Complete Neuroscience Protocol for Expanding the Response Gap"],
    ],
}

# ---------------------------------------------------------------- n=17 clarity / A
ARTICLES[17] = {
    "lede": (
        "Clarity is the most underrated of the practical aims of magic, and the most reliably achievable. Not "
        "because sigils sharpen the mind, but because the act of reducing a vague wish to a single imperative "
        "sentence forces a decision that you were quietly avoiding. A sigil for focus does almost nothing to "
        "your attention. A sigil for clarity does something to your attention, because you cannot write one until "
        "you have said what you actually want. This is a first route in for someone whose problems are "
        "crystallising rather than catastrophic. It assumes a working knowledge of sigils and charge, and it "
        "spends most of its time on the parts that are unglamorous: naming the decision, writing it properly, "
        "and recording what happened so that the next one is better informed."
    ),
    "sections": [
        {
            "h2": "The part of this that is not magic at all",
            "p": [
                "Before anything else, notice that a clarity sigil is mostly a writing exercise. You take a wish "
                "such as I want to focus better, which cannot be acted on, and turn it into a sentence with a "
                "verb and an object that you could in principle do. That conversion is the work, and the reduction "
                "to a glyph is the part that follows it. Most people who feel a clarity sigil did something are "
                "responding to the two minutes spent writing the sentence honestly.",
                "This is not a deflation. It means the method is cheap, repeatable and available to anyone, and "
                "it also means the version of this practice worth doing is the one where the sentence is honest. "
                "If the sigil is a decoration on a sentence you did not really mean, there is no mechanism to "
                "operate and no amount of charging will produce anything worth reporting.",
            ],
        },
        {
            "h2": "Decision paralysis is usually criterion conflict",
            "p": [
                "The commonest form of this difficulty is not a shortage of information. It is two or three "
                "legitimate values that cannot all be satisfied at once, which no amount of further data will "
                "resolve. Someone deciding between a stable income and time with their family is not gathering "
                "facts badly. They are holding a genuine conflict and looking for information in the hope that "
                "some fact will dissolve it.",
                "The reason sigils help here is structural. The reduction forces the wish into a single "
                "imperative sentence, and most criterion conflicts are invisible until you have to make one "
                "choice rather than express a preference. Try writing the sentence. If you cannot, you have found "
                "the actual problem, and it was never a shortage of information. That is a genuinely useful "
                "result, and it arrives before any ritual has been performed.",
            ],
        },
        {
            "h2": "Why cards and dice work as thinking tools",
            "p": [
                "Projective methods were built to reach material that conscious self-report misses. The Rorschach "
                "and its successors assume that the association a person has to an ambiguous image contains "
                "information they did not know they were reporting. That assumption is contested and worth "
                "reading critically, but the practical effect is reliable enough that most people would keep "
                "using the cards if the deeper claim were withdrawn entirely.",
                "The reason is that a randomly drawn card is a commitment device. You cannot reverse-engineer "
                "your own answer if the card was in the deck, and you therefore find yourself considering "
                "possibilities you would not have raised, because you would not have wanted to raise them. This "
                "is exactly what a sigil for clarity is missing, since a sigil is entirely your own "
                "construction. Divination and sigilisation fail in opposite directions, which is why combining "
                "them is more useful than either alone.",
            ],
        },
        {
            "h2": "Gnosis, and the difference from visualisation",
            "p": [
                "Gnosis is a sustained, non-abstract contact with an experience, and the term is considerably "
                "older than the movement that popularised it. Visualisation is representational. You build an "
                "image of what you want and you hold it, which is useful and well suited to rehearsal, since it "
                "is a rehearsal of a scene. Gnosis is not a rehearsal of anything. It is the attempt to be fully "
                "in contact with a quality of experience rather than a picture of it.",
                "The distinction is the difference between rehearsing a conversation and having the conversation. "
                "Rehearsal is measurable and reliable, and it is what most people are doing when they picture an "
                "outcome. Gnosis is harder, less controllable, and considerably better at changing behaviour, "
                "because a rehearsed scene can be abandoned the moment it becomes uncomfortable, while a quality "
                "of attention that has actually been in contact with something tends to persist afterwards.",
            ],
        },
        {
            "h2": "Attentional control is trainable",
            "p": [
                "This is the least mystical part of the whole subject and the part with the strongest evidence. "
                "Sustained attention is trainable, the training methods are well replicated, and the effects are "
                "measurable in ordinary tasks rather than in life-changing ones. People who practise attentional "
                "control report finding it easier to stay with a boring task, and that is about the size of the "
                "benefit you should expect from any method.",
                "So a clarity sigil works best when it commits you to something rather than merely describing a "
                "state. I will work on this for twenty minutes is a commitment. I will be more focused is a "
                "wish. The first can be practised on a Tuesday and reviewed on a Wednesday. The second cannot, "
                "and that is not a moral failing, it is just an unusable instruction.",
            ],
            "ol": [
                "Name the decision in a single sentence with a verb in it.",
                "Name the criterion you will use to judge it, before you look at any options.",
                "Set a date by which you will have acted, and write the date down.",
                "Reduce the sentence to a glyph and charge it in one short sitting.",
                "Record the decision and the date, so the review has something to check.",
            ],
        },
        {
            "h2": "A short working for a decision you have deferred",
            "p": [
                "Take the decision you have been putting off and write it as a question that could be answered "
                "with yes or no by something other than your own preference. Keep at it until you reach a version "
                "that is genuinely answerable, because a question about your own desire has no answer and you "
                "will notice immediately. Then reduce that question, charge it, and leave it. Set a review date.",
                "If nothing has happened by the review date, that is information. Either the question was not "
                "answerable, or it was answered and you did not notice, or the method did not do anything. Write "
                "down which of those you think it was before you find out. This is the entire practical value of "
                "the exercise and it takes about ten minutes including the charge.",
            ],
        },
        {
            "h2": "The difference between asking and deciding",
            "p": [
                "The most common misuse of divination for clarity is using it to avoid choosing. If the question "
                "is what should I do, no arrangement of cards will help, because the answer is going to be a "
                "preference you already hold and the method will simply launder it. The cards become a way of "
                "deferring while appearing to have acted, which is worse than either deciding or deferring "
                "plainly.",
                "The version that works narrows the question until it can be wrong. Which of these two dates do "
                "I want to have committed to by the fifteenth. The answer arrives, it is a preference, and now "
                "you know the preference without having to own having known it. That is a real use of the "
                "method, and it requires a question narrow enough that your own bias cannot be the whole answer.",
            ],
        },
        {
            "h2": "Memory sigils and what they actually do",
            "p": [
                "A sigil for memory is usually a request to recall something, and it can pay off by ordinary "
                "means. Retrieval practice is one of the better-established findings in "
                "cognitive psychology: recalling information strengthens it considerably more than rereading it. "
                "Writing a sigil for a fact forces you to state precisely what you want to recall, which "
                "surfaces what you are actually trying to hold, and stating is the first step of retrieval.",
                "So the honest description of a memory sigil is a retrieval prompt that has been compressed into "
                "a glyph and therefore lost most of its usefulness. The compression works for intent, which "
                "carries a whole action, and works badly for content, which needs to be reproduced exactly. If "
                "you want to remember a passage, write the passage down. If you want to remember to return to a "
                "piece of work, a glyph is fine.",
            ],
        },
        {
            "h2": "Recording the sequence rather than the outcome",
            "p": [
                "For clarity work the log should capture the decision, the criterion, the date and what you did, "
                "which is four items rather than the usual one. The reason is that the interesting question is "
                "not whether the sigil worked but whether your own stated criterion predicted your later "
                "satisfaction, and that becomes visible only if you wrote the criterion down before you knew the "
                "outcome.",
                "Review such a log after a handful of decisions and you will usually find one of two things. "
                "Either your criteria are sound and your execution is the problem, or your criteria are a "
                "rationalisation written after the choice was already made. The second is much more common and "
                "much more useful to discover. Either way the log is doing work that the sigil was never going "
                "to do, which is fine, because the sigil was the thing that got you to write it.",
            ],
        },
        {
            "h2": "When clarity work stops being useful",
            "p": [
                "Two situations. The first is when the decision being deferred is one you should delegate "
                "entirely, and the ritual becomes a way of feeling in control of something that is not yours. The "
                "second is when the practice has started to be more about the working than the question, which is "
                "easy to miss because it feels productive. A practice that produces beautiful glyphs and the same "
                "deferred decision in six months is not working.",
                "The check is simple. Write down what the clarity sigil is for, in one sentence, and the date. If "
                "the date passes and you have not acted, the honest move is to stop adding techniques and ask why "
                "the decision is hard rather than whether your focus is good enough. Sometimes the answer is that "
                "you already know and are waiting for permission, and no amount of ritual apparatus is going to "
                "issue it.",
            ],
        },
    ],
    "faq": [
        [
            "Do clarity sigils actually improve memory?",
            "For recalling a specific fact, almost certainly not, because the glyph compresses away the content "
            "you needed. For remembering to return to something, quite possibly, since that is a matter of "
            "carrying an intention and a glyph does that well. The strongest result in this area comes from "
            "stating precisely what you want to recall, which the sigil forces you to do and which works "
            "through ordinary retrieval practice rather than anything else.",
        ],
        [
            "Should I use divination to make a decision?",
            "Only once the question is narrow enough that your own preference cannot be the whole answer. A "
            "question about what you should do will return a preference laundered as insight, which feels like "
            "deciding while avoiding the ownership. A question about which of two concrete options you want "
            "committed by a date is answerable, and the answer being unsurprising does not make it useless.",
        ],
        [
            "What is the difference between gnosis and visualisation?",
            "Visualisation is rehearsal. You build a picture of an outcome and hold it, which is good practice "
            "for preparing yourself and measurable in that it makes you more comfortable with a scene. Gnosis is "
            "sustained contact with a quality of experience rather than a picture of one. Rehearsal can be "
            "abandoned when it becomes uncomfortable, and gnosis generally changes behaviour afterwards because "
            "it was never a picture in the first place.",
        ],
        [
            "Why is writing the sentence the hardest part?",
            "Because the vague version feels true and the specific version can be checked. I want to focus better "
            "cannot be acted on or falsified. I will work on the draft for twenty minutes at eight can be done and "
                "judged. The resistance you feel when trying to write the second version is usually the signal that "
                "you have found the actual problem, most often a conflict between two criteria rather than a "
                "shortage of effort.",
        ],
        [
            "Does buying software change what I can do with clarity work?",
            "The record. The sentences, the criteria, the dates and the outcomes, kept somewhere you can look at "
            "them together after a year. That is the only genuinely hard part of this practice, and it is the "
            "part that a bookmark and a text file do badly and an app does well. Any offer of a technique that "
            "guarantees a particular kind of insight is selling something the underlying research does not "
            "support.",
        ],
    ],
    "related": [
        ["stillness-meditation-cognitive-clarity", "The Power of Stillness: Complete Neuroscience Protocol for Expanding the Response Gap"],
        ["direction-clarity-purpose-framework", "Direction and Clarity: A Practical Framework"],
        ["habit-formation-neuroscience-willpower", "Habit Formation and the Neuroscience of Willpower"],
        ["iching-career-questions", "I Ching for Career Questions: Work Decisions Explained (2026)"],
        ["chaos-sigil-design-charge-forget-guide", "Design, Charge, Forget: The Complete Chaos Sigil Workflow (2026)"],
    ],
}
