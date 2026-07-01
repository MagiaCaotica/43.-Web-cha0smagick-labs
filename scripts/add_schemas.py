# Add Article + HowTo schema to blog articles that lack them
import os, re, glob, json
from datetime import datetime

root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
blog_dir = os.path.join(root, 'blog')

# Article definitions: slug -> { h1, description, steps, extra_schemas }
# steps: list of {name, text} for HowTo steps
ARTICLES = {
    "astral-projection-techniques-beginners": {
        "h1": "Astral Projection for Beginners: Techniques & Safety Guide",
        "desc": "Complete guide to astral projection for beginners. Learn the rope technique, safety protocols, and digital tools for out-of-body experiences.",
        "howto": {
            "name": "Astral Projection via the Rope Technique",
            "desc": "Step-by-step guide to achieving out-of-body experience using the rope technique.",
            "steps": [
                ("Lie Down", "Lie down in a comfortable position, preferably on your back. Close your eyes."),
                ("Relax Completely", "Relax completely using progressive relaxation. Starting from your toes, tense and release each muscle group until your entire body is deeply relaxed."),
                ("Enter Hypnagogic State", "Enter the hypnagogic state — the threshold between waking and sleeping. Maintain awareness as your body falls asleep. This is the most important skill."),
                ("Visualize the Rope", "Visualize the rope hanging above you. See it clearly — its texture, color, and movement."),
                ("Pull Yourself Up", "Reach up with your astral hands and pull yourself up the rope, hand over hand. Feel the physical sensation of pulling."),
                ("Maintain Intention", "Maintain intention: 'I am separating from my physical body. I am ascending.'"),
                ("Do Not Open Eyes", "Do not open your physical eyes when you feel yourself separating. This will snap you back into your body.")
            ]
        }
    },
    "austin-osman-spare-sigil-method": {
        "h1": "Austin Osman Spare Sigilization: The Original Method Explained",
        "desc": "Master Austin Osman Spare's original sigil method. Learn the death posture, gnostic trance, and sigil firing techniques from the father of chaos magick.",
        "howto": {
            "name": "Austin Osman Spare's Sigil Creation Method",
            "desc": "The original sigilization technique developed by Austin Osman Spare.",
            "steps": [
                ("Formulate Intent", "Write a clear statement of desire in present tense. Condense it to a single sentence."),
                ("Create the Sigil", "Remove repeated letters from the statement, combine remaining letters into a unique glyph on paper."),
                ("Enter the Death Posture", "Lie down and relax completely. Hold the sigil in your mind as you enter a state of physical tension release."),
                ("Achieve Gnostic Trance", "Use breath control or sensory deprivation to reach gnosis — the 'caught-in-the-act' state between waking and sleeping."),
                ("Fire the Sigil", "At the peak of gnosis, stare at the sigil and release your intent in a single burst of will. Then immediately forget it."),
                ("Forget and Release", "Do not dwell on the sigil or its intent. Trust the subconscious to execute the program.")
            ]
        }
    },
    "complete-magickal-servitors-guide": {
        "h1": "Complete Magickal Servitors Guide: Create, Activate & Deploy Thought Forms",
        "desc": "Complete guide to creating chaos magick servitors. Learn design, activation, feeding, and dismissal of autonomous thought forms with digital tools.",
        "howto": {
            "name": "Servitor Creation and Activation",
            "desc": "Four-phase process for creating, activating, maintaining, and dismissing magical servitors.",
            "steps": [
                ("Define Purpose", "Write a clear statement of what the servitor will do. Be extremely specific: purpose, duration, operational parameters."),
                ("Design the Sigil", "Create a unique sigil encoding the servitor's purpose. This serves as the servitor's visual anchor and command core."),
                ("Create an Anchor", "This can be a physical object (a stone, paper with the sigil) or a digital file (a PNG image, digital grimoire entry)."),
                ("Enter Gnosis and Activate", "Use meditation or binaural beats to reach gnosis. Focus intent into the sigil. Speak the servitor's name and issue its command."),
                ("Feed and Maintain", "Provide daily visualization, energy offerings, or weekly sigil refresh. Neglected servitors weaken and may fail."),
                ("Dismiss When Done", "At the end of the servitor's lifespan, enter gnosis, thank it, reclaim energy, destroy the anchor, and perform a cleansing banishing.")
            ]
        }
    },
    "cryptographic-sigil-programming-code": {
        "h1": "Cryptographic Sigil Programming: Encode Your Will as Code",
        "desc": "Learn cryptographic sigil programming. Encode intentions as executable sigil code using hash functions, entropy, and digital visualization.",
        "howto": {
            "name": "Cryptographic Sigil Programming",
            "desc": "Encode your intention as a cryptographic sigil using hash functions and coordinate mapping.",
            "steps": [
                ("Encode Your Intention", "Write your statement of intent. Hash it using a cryptographic algorithm (SHA-256) to produce a unique digital fingerprint."),
                ("Generate Cryptographic Entropy", "Use the hash output as entropy source. Each character of the hash maps to a coordinate or vector in the sigil space."),
                ("Map Hash to Visual Coordinates", "Convert hash bytes to (x,y) coordinates, angles, or curve parameters. Define the mapping function that transforms bytes into visual elements."),
                ("Render the Sigil", "Plot the coordinates, connect the points, and apply symmetry. The final sigil is a unique geometric representation of your hashed intent, irreproducible and mathematically bound to your will.")
            ]
        }
    },
    "digital-sigil-magic-guide": {
        "h1": "Digital Sigil Magic: Complete Guide to Modern Sigilization",
        "desc": "Complete guide to digital sigil magic. Create powerful sigils using apps, cryptographic engines, and digital anchors. Modern sigilization for the chaos magician.",
        "howto": {
            "name": "Digital Sigil Creation Method",
            "desc": "Create and fire a digital sigil using modern tools and cryptographic methods.",
            "steps": [
                ("Write Your Intent", "Type your statement of intent in a text editor. Keep it short, present tense, and specific."),
                ("Generate the Sigil", "Use a digital sigil generator app like Chaos Sigil Generator to create a unique cryptographic sigil from your text."),
                ("Choose Your Alphabet", "Select an ancient alphabet (Runic, Hebrew, Egyptian) to infuse the sigil with historical symbolic power."),
                ("Enter Digital Gnosis", "Dim the screen, put on headphones with binaural beats, and focus on the glowing sigil on your screen."),
                ("Fire the Sigil", "Use the app's flash ritual or charged visualization. Stare at the sigil, feel the intent build, then release."),
                ("Save and Forget", "Save the sigil to a password-protected folder. Do not look at it again for at least 24 hours. Let your subconscious work.")
            ]
        }
    },
    "how-to-make-digital-sigil-complete-guide": {
        "h1": "How to Make a Digital Sigil: Complete Guide to Tech Sigilization",
        "desc": "Step-by-step guide to making digital sigils. Learn tech sigilization using apps, cryptography, and digital anchors for modern chaos magick practice.",
        "howto": {
            "name": "How to Make a Digital Sigil",
            "desc": "Complete process for creating and charging a digital sigil using technology.",
            "steps": [
                ("Define Your Intent", "Write a clear, present-tense statement of your desire. Example: 'I attract rewarding career opportunities.'"),
                ("Choose a Digital Tool", "Select a sigil generator app (Chaos Sigil Generator, Sigil Engine) or use a cryptographic hash function to encode your intent."),
                ("Input Your Intent", "Type or paste your statement into the generator. The app will create a unique geometric sigil from your text."),
                ("Customize the Sigil", "Select alphabet, colors, and planetary correspondence. Align the sigil's visual design with your magical goal."),
                ("Enter a Gnostic State", "Use binaural beats, breathwork, or meditation to reach gnosis while viewing the sigil on screen."),
                ("Charge and Fire", "Focus all your intent into the sigil. Use the app's flash ritual or stare intently until the sigil burns into your mind. Release."),
                ("Store Securely", "Save the sigil in a password-protected digital grimoire or encrypted folder. Do not share it. Let it work."),
                ("Forget and Trust", "Do not dwell on the sigil or your intent. Trust the process. The sigil is working in your subconscious.")
            ]
        }
    },
    "planetary-magic-squares-sigil-creation": {
        "h1": "Planetary Magic Squares: Complete Guide for Sigil Creation",
        "desc": "Learn planetary magic squares for sigil creation. Saturn, Jupiter, Mars, Sun, Venus, Mercury, Moon kameas for chaos magick sigil empowerment.",
        "howto": {
            "name": "Using Planetary Magic Squares for Sigil Creation",
            "desc": "Step-by-step guide to creating and empowering sigils using planetary kameas.",
            "steps": [
                ("Select the Planet", "Choose the planet that matches your intent: Saturn (protection), Jupiter (expansion), Mars (energy), Sun (success), Venus (love), Mercury (communication), Moon (intuition)."),
                ("Get the Magic Square", "Obtain the correct kamea for your chosen planet. Each is a numbered grid with specific planetary proportions."),
                ("Convert Your Intent to Numbers", "Write your statement of intent. Convert each letter to its numerical value using Hebrew gematria or a planetary alphabet table."),
                ("Plot on the Kamea", "Draw lines connecting the numbers in sequence on the magic square grid. The resulting pattern is your planetary sigil."),
                ("Charge at the Planetary Hour", "Perform the sigil charging ritual during the correct planetary hour for maximum alignment with celestial forces."),
                ("Activate and Seal", "Enter gnosis, focus on the completed planetary sigil, and release your intent. Seal the ritual with a banishing.")
            ]
        }
    },
    "remote-viewing-techniques-beginners": {
        "h1": "Remote Viewing for Beginners: Techniques, Training & Tools",
        "desc": "Learn remote viewing techniques for beginners. CRV protocol, coordinate targeting, and digital tools for developing controlled clairvoyance and psychic sight.",
        "howto": {
            "name": "Controlled Remote Viewing (CRV) Method",
            "desc": "The six-stage Controlled Remote Viewing protocol developed by Stanford Research Institute.",
            "steps": [
                ("Stage 1: Ideogram", "Receive the target coordinate. Make a quick scribble (ideogram) on paper capturing your initial impression. Note any basic sensory data: motion, color, texture."),
                ("Stage 2: Sensory Perception", "Describe basic sensory qualities: temperature, sound, texture, smell. Use adjectives like 'rough,' 'warm,' 'echoing.' Avoid naming or labeling."),
                ("Stage 3: Dimensional Tracking", "Sketch the target's dimensions. Estimate size, shape, distance. Track boundaries and surfaces. Build a spatial model."),
                ("Stage 4: Analytic Overlay", "Identify and set aside analytical overlays — preconceptions and logical deductions that contaminate pure perception."),
                ("Stage 5: Dimensional Refinement", "Refine dimensional data. Add details, proportions, and relationships between elements. Check for consistency."),
                ("Stage 6: Full Description", "Synthesize all data into a coherent description. Add sketches, colors, and final impressions. Compare with feedback material.")
            ]
        }
    },
    "scrying-techniques-mirror-crystal-digital": {
        "h1": "Scrying Techniques: Mirror, Crystal & Digital Scrying Guide",
        "desc": "Master scrying techniques for mirror scrying, crystal gazing, and digital scrying. Complete guide to developing clairvoyance through scrying practices.",
        "howto": {
            "name": "Traditional Mirror Scrying Method",
            "desc": "Step-by-step guide to performing a mirror scrying session.",
            "steps": [
                ("Prepare Your Space", "Dim the lights or use candlelight. Set up your black mirror or scrying surface at a comfortable angle. Create a calm, uninterrupted environment."),
                ("Enter a Relaxed State", "Sit comfortably. Take slow, deep breaths. Soften your gaze. Enter a light trance state."),
                ("Gaze Softly", "Look at the mirror without focusing on any specific point. Let your vision go slightly unfocused. Allow your peripheral vision to become active."),
                ("Observe Without Forcing", "Watch for shapes, colors, mists, or movements. Do not try to make something happen. Simply observe and report."),
                ("Describe What You See", "Say your impressions aloud or write them down. Descriptions can be abstract: 'I see a swirling mist,' 'A shape like a door is forming.'"),
                ("Interpret the Vision", "After the session, analyze the symbols and impressions. Context matters: a lion may mean courage to one person and warning to another.")
            ]
        }
    },
    "sigil-engine-cryptographic-guide": {
        "h1": "Sigil Engine: Cryptographic Sigil Generation for Chaos Magick",
        "desc": "Master the sigil engine approach to cryptographic sigil generation. Generate unique, mathematically-bound sigils using hash functions and entropy for chaos magick.",
        "howto": {
            "name": "Sigil Engine Cryptographic Generation",
            "desc": "Generate a cryptographic sigil using the sigil engine method.",
            "steps": [
                ("Input Your Intent", "Type your statement of intent into the sigil engine. The engine uses this text as the entropy seed for generation."),
                ("Select Algorithm", "Choose your cryptographic hash (SHA-256) and visualization style (wheel, mantra, or geometric). Each produces different sigil aesthetics."),
                ("Configure Parameters", "Select alphabet (Runic, Hebrew, etc.), planetary kamea, colors, and complexity level for the sigil."),
                ("Generate the Sigil", "The engine processes your intent through the cryptographic pipeline: hash → entropy extraction → coordinate mapping → visual rendering."),
                ("Review and Refine", "Examine the generated sigil. Each is unique and mathematically bound to your input. Adjust parameters and regenerate if needed."),
                ("Export and Charge", "Export the sigil as PNG or SVG. Use traditional gnosis methods to charge the digital sigil. The cryptographic uniqueness amplifies the magical link.")
            ]
        }
    },
    "sigil-maker-ultimate-guide": {
        "h1": "The Ultimate Sigil Maker Guide: Create Powerful Sigils Online",
        "desc": "Complete sigil maker guide. Learn how online sigil generators work, compare free vs premium tools, and master digital sigil creation for chaos magick.",
        "howto": {
            "name": "Creating Sigils with an Online Sigil Maker",
            "desc": "Step-by-step process for creating effective sigils using online sigil generators.",
            "steps": [
                ("Choose Your Sigil Maker", "Select a digital sigil creation tool. Free options work for simple sigils. Premium apps offer cryptographic generation, multiple alphabets, and planetary kameas."),
                ("Write Your Intent", "Type a clear, present-tense statement of desire. The engine uses this text to generate the sigil."),
                ("Select Options", "Choose alphabet (standard, runic, hebrew), style (wheel, mantra, geometric), and any planetary correspondences."),
                ("Generate the Sigil", "Click generate. The tool produces a unique sigil based on your intent text and selected parameters."),
                ("Review and Save", "Download or screenshot your sigil. Premium tools allow export as PNG, SVG, or PDF for printing and anchoring."),
                ("Charge the Digital Sigil", "Use standard chaos magick charging methods: gnosis, breathwork, or the app's flash ritual. The digital format does not reduce potency.")
            ]
        }
    },
    "sigilscribe-art-science-writing-sigils": {
        "h1": "Sigilscribe: The Art and Science of Writing Sigils for Chaos Magick",
        "desc": "Complete guide to sigil writing (sigilscribe). Learn Spare's original method, modern cryptographic approaches, and best practices for effective sigil creation in chaos magick.",
        "howto": {
            "name": "The Sigilscribe Method",
            "desc": "Writing and charging sigils using the complete sigilscribe process.",
            "steps": [
                ("Intention Capture", "Write a clear statement of desire in present tense. The more specific, the more powerful the sigil."),
                ("Cryptographic Encoding", "Remove vowels and repeated consonants. Arrange remaining letters into a unique glyph. Draw from left to right, top to bottom."),
                ("Sigil Refinement", "Refine the raw glyph into an aesthetically balanced sigil. Smooth sharp angles, add symmetry, and incorporate circles or lines for visual coherence."),
                ("Enter Gnosis", "Reach an altered state through your preferred method: meditation, breathwork, chanting, or sensory deprivation."),
                ("Charge and Fire", "At the peak of gnosis, focus intently on the completed sigil. Visualize it glowing, then release all attachment to the outcome."),
                ("Forget and Release", "The hardest step — genuinely forget the sigil's meaning. Trust your subconscious to execute the program without conscious interference.")
            ]
        }
    },
    "tarot-spreads-beginners-guide": {
        "h1": "Tarot Spreads for Beginners: Celtic Cross, 3-Card & More",
        "desc": "Learn tarot spreads for beginners. Master the Celtic Cross, 3-card spread, and other essential layouts. Step-by-step guide to reading tarot cards with confidence.",
        "howto": {
            "name": "How to Perform a Basic Tarot Reading",
            "desc": "Step-by-step guide to performing a three-card tarot spread.",
            "steps": [
                ("Formulate Your Question", "Write down a clear, open-ended question. Avoid yes/no questions. Example: 'What do I need to know about my career path right now?'"),
                ("Shuffle the Deck", "Shuffle while focusing on your question. Stop when you feel a natural pause. Cut the deck with your non-dominant hand."),
                ("Draw Three Cards", "Draw three cards from the top. Position 1 (Past): influences from the past. Position 2 (Present): current situation. Position 3 (Future): emerging energy."),
                ("Read Card 1 (Past)", "Examine the first card's imagery, symbolism, and traditional meaning. How does this energy relate to your past? Note both upright and reversed interpretations."),
                ("Read Card 2 (Present)", "Interpret the second card as your current situation. This is the core of the reading. Look for connections to Card 1."),
                ("Read Card 3 (Future)", "The third card shows the trajectory — not a fixed future but the most likely outcome given current energies. Synthesize all three cards into a coherent narrative.")
            ]
        }
    },
    "norse-runes-beginners-guide": {
        "h1": "Norse Runes for Beginners: Complete Elder Futhark Guide",
        "desc": "Complete beginner's guide to Norse runes. Learn Elder Futhark meanings, rune casting methods, and how to start your rune divination practice.",
        "howto": {
            "name": "How to Cast Norse Runes",
            "desc": "Beginner's guide to performing a rune casting with the Elder Futhark.",
            "steps": [
                ("Choose Your Runes", "Obtain or create a set of 24 Elder Futhark runes. Use stones, wood tiles, or the Norse Rune Oracle app for digital casting."),
                ("Formulate Your Question", "Focus on a specific question or area of life. Clear intent produces clear answers."),
                ("Cast the Runes", "Hold the rune bag or cup, focus on your question, and cast the runes onto a soft surface. Let them fall naturally."),
                ("Read the Runes That Fell", "Interpret the runes that landed face-up. Note their positions relative to each other. Runes close together may be related."),
                ("Pay Attention to Face-Down Runes", "Runes landing face-down may represent hidden influences or things not yet ready to be revealed."),
                ("Synthesize the Reading", "Connect the runic meanings into a coherent message. Consider each rune's traditional meaning, its position, and its relationship to other runes.")
            ]
        }
    }
}

def make_slug(filename):
    return filename.replace('.html', '')

def get_existing_schemas(content):
    """Find all existing JSON-LD script blocks"""
    schemas = []
    pattern = r'<script type="application/ld\+json">(.*?)</script>'
    for m in re.finditer(pattern, content, re.DOTALL):
        try:
            data = json.loads(m.group(1))
            schemas.append((m.start(), m.end(), data))
        except json.JSONDecodeError:
            pass
    return schemas

def make_article_schema(article, slug, url_prefix):
    """Generate Article schema JSON-LD"""
    schema = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": article["h1"],
        "description": article["desc"],
        "author": {"@type": "Person", "name": "Frater Alek0s"},
        "datePublished": "2026-06-24",
        "publisher": {
            "@type": "Organization",
            "name": "Cha0smagick Labs",
            "url": "https://cha0smagicklabs.com"
        }
    }
    return schema

def make_howto_schema(article):
    """Generate HowTo schema JSON-LD from article steps"""
    if "howto" not in article:
        return None
    h = article["howto"]
    steps = []
    for i, (name, text) in enumerate(h["steps"], 1):
        steps.append({
            "@type": "HowToStep",
            "position": i,
            "name": name,
            "text": text
        })
    schema = {
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": h["name"],
        "description": h["desc"],
        "step": steps
    }
    return schema

def format_json_html(schema):
    """Format schema as compact JSON-LD script tag"""
    return f'<script type="application/ld+json">{json.dumps(schema, ensure_ascii=False)}</script>'

# Process each article
count_article = 0
count_howto = 0

for filename in sorted(os.listdir(blog_dir)):
    if not filename.endswith('.html'):
        continue
    slug = make_slug(filename)
    if slug not in ARTICLES:
        continue
    
    filepath = os.path.join(blog_dir, filename)
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    article = ARTICLES[slug]
    existing = get_existing_schemas(content)
    
    existing_types = set()
    for _, _, data in existing:
        t = data.get('@type', '')
        existing_types.add(t)
    
    new_schemas = []
    
    # Add Article schema if missing
    if 'Article' not in existing_types:
        article_schema = make_article_schema(article, slug, filename)
        new_schemas.append(article_schema)
        count_article += 1
    
    # Add HowTo schema if defined and missing
    if 'HowTo' not in existing_types:
        howto = make_howto_schema(article)
        if howto:
            new_schemas.append(howto)
            count_howto += 1
    
    if not new_schemas:
        continue
    
    # Inject after the last existing schema, or before </head>
    if existing:
        inject_point = existing[-1][1]  # after last schema
    else:
        inject_point = content.find('</head>')
    
    # Build injection string
    injection = '\n' + '\n'.join(format_json_html(s) for s in new_schemas) + '\n'
    content = content[:inject_point] + injection + content[inject_point:]
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"  {filename}: +{len(new_schemas)} schemas (Article: {'Article' not in existing_types}, HowTo: {'HowTo' not in existing_types})")

print(f'\nDone. Added Article schema to {count_article} articles, HowTo schema to {count_howto} articles.')
