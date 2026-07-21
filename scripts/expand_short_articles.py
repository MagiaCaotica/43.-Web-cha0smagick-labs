#!/usr/bin/env python3
"""Expand 23 short articles (<300w) to 400+ words by adding content under each H2 section."""
import re, os, json

BLOG = r'D:\Paginas web\Cha0smagick Labs\43.-Web-cha0smagick-labs\blog'

# Load audit results
with open('scripts/audit_results_v2.json', encoding='utf-8') as f:
    results = json.load(f)

short = [r for r in results if r['words'] < 300]

# ===== CONTENT TEMPLATES BY TOPIC =====
# Each template adds 2-3 paragraphs of relevant, SEO-rich content

def get_expansion(slug, section_title):
    """Get expansion paragraphs based on slug and section title."""
    st = section_title.lower()
    s = slug.lower()
    
    expansions = []
    
    # Dream control / lucid dreaming expansions
    if 'dream' in s or 'lucid' in s:
        if 'control' in st or 'technique' in st or 'stabilization' in st or 'stabilize' in st:
            expansions = [
                "One of the most common challenges new lucid dreamers face is maintaining stability upon gaining awareness. The transition from non-lucid to lucid dreaming is fragile. The moment you realize you are dreaming, your brain's sudden spike in conscious activity can trigger micro-awakenings that pull you out of the dream entirely. This is why stabilization techniques are not optional — they are foundational to any sustainable lucid dreaming practice.",
                "Stabilization methods work by engaging your dream senses. When you actively interact with the dream environment — touching surfaces, feeling textures, examining details — your brain allocates more neural resources to sustaining the dream state. Common techniques include rubbing your hands together, spinning your body, or dropping to your knees and pressing your palms against the ground. Each of these actions reinforces the sensory feedback loop that keeps the dream stable.",
                "Advanced practitioners combine stabilization with intention-setting. Upon achieving lucidity, they immediately state their goal: 'I will explore this dream with clarity and control.' This verbal anchoring serves a dual purpose — it stabilizes the dream through focused attention and programs the subconscious for the desired experience."
            ]
        elif 'technique' in st or 'method' in st or 'mild' in st or 'wild' in st:
            expansions = [
                "Each lucid dreaming induction technique works through a different psychological mechanism. MILD (Mnemonic Induction of Lucid Dreams) relies on prospective memory — training your brain to remember that you are dreaming while you are dreaming. WILD (Wake-Initiated Lucid Dreams) leverages the hypnagogic state, the transitional period between wakefulness and sleep where consciousness can remain active while the body falls asleep.",
                "The effectiveness of each technique varies by individual. Some practitioners naturally excel at WILD because they can maintain awareness through the hypnagogic transition. Others find MILD more accessible because it builds upon their existing dream recall practice. The key is to experiment with each method for at least two weeks, documenting your results to identify which approach resonates with your unique neurobiology.",
                "Combining techniques often produces better results than relying on any single method. A common hybrid approach involves using WBTB to interrupt sleep at the optimal REM moment, followed by MILD affirmations during the waking period, then transitioning into WILD as you return to sleep. This multi-layered strategy addresses multiple aspects of the lucid dreaming process simultaneously."
            ]
        elif 'reality check' in st or 'reality' in st:
            expansions = [
                "Reality checks are the backbone of any lucid dreaming practice. These brief, critical tests train your mind to question whether you are awake or dreaming throughout the day. When performed with genuine intention — not just as a rote habit — reality checks create a cognitive reflex that carries into your dream state.",
                "The most effective reality checks target aspects of reality that are consistently different in dreams. The nose pinch test (pinch your nostrils and try to breathe through your nose) works because dream physics often allows breathing despite a sealed airway. The hand inspection test (examine your hands closely) exploits the fact that dream hands frequently have incorrect numbers of fingers or distorted proportions.",
                "For maximum effectiveness, perform reality checks whenever you notice something unusual or whenever you think about lucid dreaming. Each check should take 3-5 seconds and be accompanied by the genuine question: 'Am I dreaming?' The goal is to automate this questioning process so it activates spontaneously when dream anomalies occur."
            ]
        elif 'dream journal' in st or 'journal' in st:
            expansions = [
                "Dream journaling is the single most effective practice for improving dream recall and lucidity rates. The act of recording dreams trains your brain to prioritize dream memory retention, signaling to your subconscious that dreaming is important. Within two weeks of consistent journaling, most practitioners report a 50-100% increase in dream recall frequency.",
                "The key to effective dream journaling is immediacy. Dreams fade from memory within minutes of waking, so keeping your journal (or the Eerie Roads synchronicity journal) within arm's reach of your bed is essential. Record fragments even if you only remember a single image or emotion. These fragments often trigger fuller recall as you write.",
                "Beyond recall, dream journals serve as pattern recognition tools. Over weeks of journaling, you will identify recurring dream signs — specific locations, characters, objects, or scenarios that appear frequently in your dreams. These dream signs are your personal lucidity triggers, and recognizing them is the most reliable path to spontaneous lucidity."
            ]
        elif 'theta' in st or 'brainwave' in st or 'binaural' in st:
            expansions = [
                "Brainwave entrainment uses rhythmic auditory or visual stimuli to guide your brain into specific frequency states. Theta waves (4-8 Hz) are particularly associated with REM sleep and the hypnagogic state, making theta entrainment a valuable tool for lucid dreaming induction. Binaural beats work by presenting slightly different frequencies to each ear; your brain perceives the difference as a third, 'beat' frequency and synchronizes to it.",
                "Research on brainwave entrainment for lucid dreaming is still emerging, but early studies suggest that theta-frequency stimulation during the sleep onset period can increase the likelihood of entering REM with maintained consciousness. The Eerie Roads app's dark, distraction-free interface makes it an ideal platform for nighttime entrainment sessions.",
                "For optimal results, combine brainwave entrainment with other induction techniques. Use theta binaural beats during the WBTB waking period to prime your brain for lucidity before returning to sleep. The entrainment creates a neural environment conducive to the very state transitions that lucid dreaming requires."
            ]
        elif 'wake back' in st or 'wbtb' in st:
            expansions = [
                "The Wake Back to Bed (WBTB) technique is widely regarded as the most effective single method for inducing lucid dreams. It involves waking up after 4-6 hours of sleep, staying awake for 20-60 minutes, then returning to sleep with the focused intention of becoming lucid. WBTB exploits the fact that REM sleep periods lengthen as the night progresses, with the final REM period often lasting 30-45 minutes.",
                "The waking period of WBTB is crucial. During this time, engage in activities that maintain focused awareness: read about lucid dreaming, repeat MILD affirmations, or meditate on your intention to recognize dreams. The goal is to keep your conscious mind active while your body remains in a sleep-ready state. When you return to sleep, your brain transitions directly into REM with your conscious intention still active.",
                "For maximum WBTB effectiveness, set an alarm that avoids waking you during deep sleep. A 4.5 or 6-hour alarm from bedtime typically aligns with a natural sleep cycle transition. Keep the waking period active but calm — bright lights and stimulating activities can make returning to sleep difficult. Many practitioners find that 20-30 minutes is the optimal balance between maintaining wakefulness and preserving sleep pressure."
            ]
        else:
            expansions = [
                "Consistent practice yields measurable results. Most dedicated practitioners report their first lucid dream within 1-3 weeks of regular reality checks, dream journaling, and induction technique practice. The key variables are consistency (daily practice is far more effective than occasional intense sessions) and documentation (tracking what works for your unique neurobiology).",
                "The Eerie Roads synchronicity journal provides an ideal platform for tracking your lucid dreaming progress. Record your induction method, sleep schedule, pre-sleep intentions, and dream recall quality each morning. Over time, patterns emerge that reveal your optimal practice parameters — the techniques, timing, and mental states that produce the most consistent results for you."
            ]
    
    # ASTRAL projection expansions
    elif 'astral' in s or 'obe' in s or 'out-of-body' in s:
        if 'technique' in st or 'method' in st or 'rope' in st:
            expansions = [
                "Astral projection techniques generally fall into two categories: active and passive. Active techniques involve visualization and mental exertion — imagining yourself floating up, rolling out of your body, or climbing an imaginary rope. Passive techniques involve relaxation and detachment — allowing your awareness to separate naturally as your body falls asleep. Both approaches are valid, and most practitioners benefit from alternating between them.",
                "The rope technique, popularized by Robert Monroe, involves visualizing a rope hanging above your sleeping position. You imagine reaching up, grasping the rope, and hand-over-hand pulling yourself upward. This kinesthetic visualization engages the motor cortex while the body remains physically still, creating a dissociation between mental movement and physical paralysis that can trigger the separation phase.",
                "The key to any astral projection technique is maintaining awareness through the vibrational state — the transitional phase where the body begins to fall asleep but consciousness remains active. This state is characterized by tingling sensations, buzzing vibrations, and sometimes auditory phenomena. Rather than fearing these sensations, welcome them as signs that separation is imminent."
            ]
        elif 'safety' in st or 'protection' in st:
            expansions = [
                "Safety in astral projection is primarily a matter of psychological preparation. Contrary to sensationalized accounts, there is no evidence that astral projection is physically dangerous. The most common risks are psychological: fear reactions during the vibrational state, difficulty returning to the body, and temporary disorientation after the experience. These are all manageable with proper preparation.",
                "The silver cord — a hypothesized energetic connection between the astral body and physical body — is described in many traditions as a safety mechanism that ensures the practitioner can always return. While not visually perceived by all practitioners, the concept serves as a useful psychological anchor. Trust that you are always connected to your physical body and can return instantly by shifting your attention back to it."
            ]
        else:
            expansions = [
                "The vibrational state is the most universally reported precursor to astral projection. Practitioners describe it as a full-body buzzing, tingling, or vibrating sensation that typically begins in the head or core and spreads outward. This state represents the threshold between physical and astral awareness — the point at which consciousness is decoupling from physical sensory input.",
                "To induce the vibrational state, practice progressive relaxation combined with focused awareness. Lie still without moving, systematically relax each muscle group, then shift your attention to the space behind your closed eyes. Maintain awareness without forcing visualization. The vibrations often arise spontaneously when the body is fully relaxed but the mind remains alert."
            ]
    
    # PSI GYM / ESP expansions
    elif any(x in s for x in ['psi', 'zener', 'esp', 'clairvoyance', 'telepathy']):
        expansions = [
            "Statistical tracking is essential for meaningful ESP practice. Without measurement, subjective impressions of psychic ability are unreliable due to confirmation bias and memory distortion. The PSI GYM app provides automated statistical analysis that compares your results against mathematical probability, giving you objective data about your performance.",
            "The Zener card deck — five symbols (circle, cross, waves, square, star) repeated five times to form a 25-card deck — has been the standard ESP testing tool since its development by Karl Zener and J.B. Rhine at Duke University. The simplicity of the system makes it ideal for digital implementation, and the statistical framework for analyzing results is well-established."
        ]
    
    # I CHING expansions
    elif 'iching' in s or 'i-ching' in s:
        expansions = [
            "The I Ching, or Book of Changes, is one of humanity's oldest continuously used divination systems. Its 64 hexagrams represent all possible combinations of yin and yang energies, providing a comprehensive symbolic framework for understanding any situation. The three-coin method, which generates each line through a random binary process, ensures that every reading is unique while remaining within the system's complete symbolic vocabulary.",
            "What distinguishes the I Ching from other divination systems is its philosophical depth. Each hexagram is not merely a prediction but a reflection of the dynamic forces at work in any situation. The changing lines — those that transform from yin to yang or vice versa — reveal the direction of movement, showing not only where you are but where you are heading and how to navigate the transition."
        ]
    
    # FREE tool guides
    elif 'free-' in s:
        expansions = [
            "Free online tools provide an accessible entry point for beginners to explore divination and magical practices before committing to premium applications. These tools typically offer core functionality with optional upgrades to full-featured mobile apps for practitioners who want deeper capabilities, offline access, and enhanced privacy.",
            "The premium version offers significant advantages: offline operation for complete privacy, enhanced features, dark interface for gnostic focus, and a one-time purchase model with no subscriptions. For serious practitioners, the investment provides tools that respect both their practice and their privacy."
        ]
    
    # Default expansion
    if not expansions:
        expansions = [
            "This practice deepens with consistent application. Practitioners who maintain a regular schedule report more reliable results, clearer insights, and a stronger connection to the underlying principles. The key is to integrate the practice into your routine rather than treating it as an occasional experiment.",
            "Documentation is essential for tracking progress. Use the Eerie Roads synchronicity journal to record your sessions, observations, and outcomes. Over time, patterns emerge that reveal your unique approach and optimal conditions for practice."
        ]
    
    return expansions


# ===== MAIN LOOP =====
fixed = 0
for r in short:
    slug = r['slug']
    path = os.path.join(BLOG, slug + '.html')
    
    if not os.path.exists(path):
        continue
    
    with open(path, 'r', encoding='utf-8') as f:
        c = f.read()
    
    original = c
    
    # Find all H2 sections in the article content
    # We work within the <article> tag
    art_s = c.find('<article')
    art_e = c.find('</article>')
    
    if art_s < 0 or art_e < 0:
        continue
    
    article_content = c[art_s:art_e]
    
    # Find all H2 positions
    h2_positions = []
    pos = 0
    while True:
        h2_start = article_content.find('<h2', pos)
        if h2_start < 0:
            break
        h2_end = article_content.find('</h2>', h2_start)
        if h2_end < 0:
            break
        h2_text = re.sub(r'<[^>]+>', '', article_content[h2_start:h2_end+5]).strip()
        h2_positions.append((h2_start, h2_end+5, h2_text))
        pos = h2_end + 5
    
    # Skip the FAQ section (usually the last H2)
    # We expand content before the FAQ
    if len(h2_positions) <= 1:
        continue
    
    # Work backwards, adding content before the FAQ section
    # Find the FAQ H2
    faq_idx = None
    for i, (start, end, text) in enumerate(h2_positions):
        if 'frequently asked' in text.lower() or 'faq' in text.lower():
            faq_idx = i
            break
    
    sections_to_expand = h2_positions
    if faq_idx is not None:
        sections_to_expand = h2_positions[:faq_idx]
    
    # Add content after each section (except FAQ)
    added_any = False
    modified_content = article_content
    
    for i, (h2_start, h2_end, h2_text) in enumerate(reversed(sections_to_expand)):
        # Find the next H2 or end of content
        if i == 0:
            next_boundary = modified_content.find('<h2', h2_end + 1)
        else:
            # Find next section start
            next_boundary = len(modified_content)
            for prev_s, prev_e, prev_t in sections_to_expand:
                if prev_s > h2_end and prev_s < next_boundary:
                    next_boundary = prev_s
        
        if next_boundary < 0:
            next_boundary = len(modified_content)
        
        # Get expansion content
        expansions = get_expansion(slug, h2_text)
        
        if not expansions:
            continue
        
        # Insert expansions before the next H2
        para_insert = '\n'.join([f'<p>{ep}</p>' for ep in expansions])
        
        # Find a good insertion point: after the last <p> or <ul> before next_boundary
        section_content = modified_content[h2_end:next_boundary]
        
        # Insert after the last closing tag before the boundary
        insert_pos = h2_end
        
        modified_content = modified_content[:insert_pos] + '\n' + para_insert + '\n' + modified_content[insert_pos:]
        added_any = True
    
    if added_any:
        # Reconstruct the full HTML
        c = c[:art_s] + modified_content + c[art_e:]
        
        # Count words to verify improvement
        main_s = c.find('<main')
        main_e = c.find('</main>')
        if main_s > 0 and main_e > main_s:
            body_text = re.sub(r'<[^>]+>', ' ', c[main_s:main_e])
            body_text = re.sub(r'\s+', ' ', body_text).strip()
            new_words = len(body_text.split())
        
        with open(path, 'w', encoding='utf-8') as f:
            f.write(c)
        print(f'  Expanded {slug}: {r["words"]}w -> {new_words}w')
        fixed += 1

print(f'\nTotal articles expanded: {fixed}')
