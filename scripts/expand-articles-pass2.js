#!/usr/bin/env node
/**
 * Article Expander - PASS 2 - cha0smagicklabs.com
 * 
 * Second expansion pass: adds more depth sections and fixes 
 * word counting for articles without <article> tags.
 * Target: 1500+ words per article.
 */

const fs = require('fs');
const path = require('path');

const BLOG_DIR = path.join(__dirname, '..', 'blog');

// ============================================================
// EXPANDED CONTENT TEMPLATES (PASS 2 - NEW SECTIONS)
// ============================================================

const pass2Sections = [
  // === TOPIC: ASTROLOGY ===
  {
    keywords: ['mars-sign', 'mercury-sign', 'rising-sign', 'moon-sign', 'venus-sign',
      'planetary-transit', 'astrology-aspect', 'natal-chart', 'astrology-app',
      'astrology-sign', 'astrology guide'],
    title: 'Integrating Astrology with Daily Magical Practice',
    id: 'astrology-magical-integration',
    html: `<p>The true power of astrology for the magical practitioner lies not in fortune-telling but in timing and resonance. Each planetary hour, day, and aspect creates a distinct energetic signature that amplifies specific types of workings.</p>
<p>The <strong>planetary hours</strong> system divides each day and night into 12 unequal hours, each ruled by a planet in Chaldean order (Saturn → Jupiter → Mars → Sun → Venus → Mercury → Moon → Saturn...). A working for protection, for instance, aligns naturally with Saturn's hour on Saturday (Saturn's day). Love workings find their peak in Venus's hour on Friday.</p>
<p>Beyond hours, the <strong>lunar phase</strong> acts as a primary timer: waxing Moon for growth and attraction workings, full Moon for manifestation and charging, waning Moon for banishment and clearing, new Moon for setting intentions. When you align planetary hour + lunar phase + your intention, the synergistic effect consistently outperforms random timing.</p>
<p>Our free <a href="../tools/lunar-phase-calculator/index.html">lunar phase calculator</a> helps you track the current Moon phase, and premium <a href="../index.html#products">astrology apps</a> automate planetary hour calculations so you never miss an optimal working window.</p>`
  },

  // === TOPIC: LUCID DREAMING ===
  {
    keywords: ['lucid-dream', 'astral-projection', 'dream-journal', 'dream-control',
      'dream-signs', 'wake-back-to-bed', 'reality-check', 'theta-waves',
      'monroe-method', 'astral-realms', 'oneironautics', 'vibrational-state',
      'silver-cord', 'energy-body', 'obe-', 'astral-travel',
      'astral-projection-safety', 'binaural-beats', 'dream-machine'],
    title: 'Building a Sustainable Dream Practice',
    id: 'sustainable-dream-practice',
    html: `<p>Most aspiring lucid dreamers and astral projectors fail not because the techniques don't work, but because they give up before their practice matures. The key to success is sustainability—building habits that fit your lifestyle rather than attempting elaborate nightly rituals that quickly become unsustainable.</p>
<p><strong>Phase 1: Foundation (Weeks 1-4)</strong> — Focus exclusively on dream recall. Keep a journal by your bed, write the moment you wake, even if you only remember fragments. This single habit doubles recall within two weeks and creates the baseline for all further work. Use our free <a href="../tools/digital-pendulum.html">digital pendulum</a> before sleep to set intention for dream recall.</p>
<p><strong>Phase 2: Reality Testing (Weeks 3-8)</strong> — Once recall is consistent, introduce reality checks throughout the day. The most effective check is the nose-pinch test: pinch your nostrils closed and try to breathe. If air passes through, you're dreaming. Integrate 10-15 reality checks daily by associating them with routine triggers (every time you walk through a doorway, check your reality).</p>
<p><strong>Phase 3: Induction Methods (Weeks 6-12)</strong> — With recall and reality testing established, add a formal induction method. The Wake-Back-to-Bed (WBTB) method—waking after 4-6 hours of sleep, staying awake 20-60 minutes, then returning to sleep—has the highest success rate in clinical studies. Combine it with MILD (Mnemonic Induction of Lucid Dreams): as you fall back asleep, repeat "I will remember I'm dreaming" while visualizing yourself becoming lucid.</p>
<p>The premium <a href="../index.html#products">dream machine app</a> provides binaural beat entrainment for each sleep phase, while the free tools on this site complement your practice with intention-setting aids and divination for dream interpretation.</p>`
  },

  // === TOPIC: TAROT ===
  {
    keywords: ['tarot-card-meanings', 'tarot-spreads', 'tarot-reading', 'tarot-suits',
      'tarot-card-combinations', 'tarot-card-reversed', 'intuitive-tarot',
      'tarot-journaling', 'daily-tarot', 'celtic-cross'],
    title: 'Tarot Spreads for Specific Purposes',
    id: 'tarot-purpose-spreads',
    html: `<p>While the Celtic Cross is the most famous tarot spread, it's not always the most effective for specific questions. Here are three targeted spreads for common situations:</p>
<p><strong>The Three-Card Compass</strong> (fast, focused): Position 1 — Situation (what's happening now), Position 2 — Action (what to do), Position 3 — Outcome (where it leads). This spread works for daily guidance, decision-making, and any question needing a clear, direct answer. It takes five minutes and covers the essential dimensions.</p>
<p><strong>The Crossroads Spread</strong> (for choices): Position 1 — Your current position, Position 2 — Option A energy, Position 3 — Option A likely outcome, Position 4 — Option B energy, Position 5 — Option B likely outcome, Position 6 — Advice from the universe. This spread illuminates two paths without bias, revealing which option aligns with your highest good rather than just your immediate desires.</p>
<p><strong>The Shadow Integration Spread</strong> (for self-work): Position 1 — Conscious self (what you know), Position 2 — Shadow self (what you avoid), Position 3 — Bridge (how to integrate), Position 4 — Gift (what integration brings). This spread draws from Jungian psychology and is excellent for monthly check-ins or during retrograde periods.</p>
<p>Pair your tarot practice with <a href="../index.html#products">premium divination apps</a> for digital readings on the go, and use our free <a href="../tools/sigil-generator.html">sigil generator</a> to create focus symbols for specific questions before drawing cards.</p>`
  },

  // === TOPIC: GPS / MANIFESTATION / SYNCHRONICITY ===
  {
    keywords: ['gps-manifestation', 'gps-intention', 'geographic-sigil', 'sigil-walking',
      'synchronicity-journal', 'synchronicity-hunting', 'liminal-space',
      'offline-manifestation', 'digital-flaneur', 'digital-shadow-work',
      'privacy-first-navigation', 'dark-cartography', 'chaos-coordinates',
      'reality-hacking', 'intention-manifestation', 'signs-universe',
      'chaos-magick-gps', 'chaos-magick-quantum', 'digital-privacy-magick',
      'sigil-walking'],
    title: 'The Sigil Walk: A Complete GPS Magick Technique',
    id: 'sigil-walk-technique',
    html: `<p>The sigil walk combines sigil magic with GPS technology into a single, powerful technique that engages body, mind, and environment simultaneously. Unlike stationary sigil charging, the sigil walk imprints your intention onto physical space itself, creating a geotagged magical charge you can revisit.</p>
<p><strong>Step 1: Design Your Path-Sigil</strong> — Open a map app and draw a route that traces the shape of your sigil across your local area. A sigil for "protection" might spiral around your home; a sigil for "abundance" might stretch toward commercial districts. The path itself is the sigil—every step charges it. Use our <a href="../tools/sigil-generator.html">sigil generator</a> to create the initial symbol, then adapt its shape to real streets and paths.</p>
<p><strong>Step 2: Enter Gnosis While Walking</strong> — Begin your walk at the starting point. As you move, maintain a light meditative focus on your intention (not the sigil shape—the feeling of the intention already fulfilled). Walking itself induces a mild rhythmic gnosis, similar to drumming or chanting. The combination of physical movement, rhythmic breathing, and focused intent creates an ideal state for charging.</p>
<p><strong>Step 3: Completion and Deployment</strong> — When you complete the path, the sigil is charged and deployed simultaneously. The intention is now anchored to those physical coordinates. Return to the starting point within a lunar cycle to reinforce the charge. Each repetition strengthens the geotagged intention.</p>
<p>The premium <a href="../index.html#products">GPS manifestation app</a> provides structured sigil walk templates, automated path logging, and geo-triggered reminders for reinforcement walks. For beginners, start with short 15-minute walks and simple sigil shapes before advancing to multi-mile routes.</p>`
  },

  // === TOPIC: CHAOS MAGICK THEORY ===
  {
    keywords: ['chaos-magick-history', 'history-of-chaos-magick', 'chaos-magick-beginners',
      'psychonaut', 'reality-hacking', 'scrying', 'cyber-paganism',
      'digital-spellcasting', 'technomancy', 'cybermancy', 'paradigm-shift',
      'belief-as-tool', 'chaos-magick-', 'magick', 'what-is-magick',
      'what-is-gnosis', 'planetary-magic', 'banish', 'egregore',
      'servitor', 'astrology-apps-android', 'lunar-phase-calculator-app',
      'candle-magic', 'elemental-magic', 'herbal-magic', 'kitchen-witchery',
      'numerology', 'chakra-balancing', 'ogham', 'divination-methods-beyond',
      'pendulum-divination', 'wheel-of-the-year', 'angel-magic',
      'crystal-magic', 'what-is-technomancy', 'what-is-cybermancy',
      'new-moon-vs-full-moon', 'bindrune', 'magical-servitors',
      'liber-lvpinux', 'ouija-cazadora', 'chaos-hunter-runes-treatise',
      'dream-machine', 'sigil-creator-online', 'chaos-sigil-generator',
      'arcana-goetia', 'rider-waite-tarot', 'i-ching-oracle',
      'norse-rune-oracle', 'lunar-phase-calculator-app'],
    title: 'Evidence-Based Magick: Tracking and Measuring Results',
    id: 'evidence-based-magick',
    html: `<p>The single most important practice separating effective magicians from perpetual dabblers is systematic result tracking. Without measurement, you have no way to know which techniques work, which conditions amplify results, and which intentions manifest reliably.</p>
<p><strong>Create a Results Database</strong> — For each working, record: date, time, lunar phase, planetary hour (if used), the specific technique (sigil, servitor, ritual, etc.), the intention verbatim, the gnosis method (meditation, sex, dancing, sensory deprivation, etc.), and a predicted outcome timeline. Then track whether the intention manifested, partially manifested, or did not manifest, and by what date.</p>
<p><strong>Calculate Your Success Rate</strong> — After 20-30 workings, review your data. You'll likely find that certain techniques have 70-80% success rates while others sit at 20-30%. This is not a judgment on the technique—it's information about what works for YOUR unique energetic signature. Double down on what works. Experiment with what doesn't.</p>
<p><strong>Identify Amplifying Conditions</strong> — Your data will reveal patterns: workings performed during specific lunar phases manifest faster, certain sigil methods produce more physical-world results while others affect psychological states, some intentions require reinforcement while others manifest instantly. These patterns become your personal magical tradition.</p>
<p>The free tools on this site—<a href="../tools/sigil-generator.html">sigil generator</a>, <a href="../tools/spell-builder.html">spell builder</a>, <a href="../tools/lunar-phase-calculator/index.html">lunar phase calculator</a>—help you execute workings consistently. Premium <a href="../index.html#products">Android apps</a> provide tracking and analytics for serious practitioners who want to measure and optimize their magical output.</p>`
  },

  // === TOPIC: FREE TOOLS ===
  {
    keywords: ['free-sigil-generator', 'free-i-ching', 'free-online-rune-reading',
      'free-lunar-phase-calculator', 'free-sigil-maker', 'free-sigil-creator',
      'sigil-creator-online', 'sigil-maker-ultimate', 'sigilscribe',
      'moon-phase-generator', 'i-ching-digital', 'i-ching-oracle',
      'i-ching-three-coin', 'i-ching-hexagram', 'norse-runes',
      'viking-oracle', 'candle-color-calculator',
      'tools guide', 'free online', 'calculator guide'],
    title: 'Choosing the Right Tool for Your Practice Level',
    id: 'tool-practice-level',
    html: `<p>One of the most common questions practitioners ask is "which tool should I use?" The answer depends entirely on your practice level and goals.</p>
<p><strong>Beginners</strong> should start with free web tools. They require no installation, work on any device, and include enough features to learn fundamentals. Use the <a href="../tools/sigil-generator.html">sigil generator</a> to understand sigil structure, the <a href="../tools/spell-builder.html">spell builder</a> to learn ritual construction, and the <a href="../tools/lunar-phase-calculator/index.html">lunar phase calculator</a> to develop timing awareness. Don't upgrade until you consistently want features the free version doesn't offer.</p>
<p><strong>Intermediate practitioners</strong> who perform regular workings benefit from premium apps. The key features that justify the upgrade are: cryptographic precision (SHA-256 sigil hashing), multiple encoding systems (Theban, Enochian, runic, etc.), planetary kamea integration, SVG export for high-quality printing, integrated charging timers, and progress tracking across multiple workings. Premium apps turn your phone into a dedicated magical device.</p>
<p><strong>Advanced practitioners</strong> and those building a Complete Collection find that the apps work synergistically—sigil data flows into manifestation tracking, lunar calculations inform ritual timing, and cross-app consistency creates a unified magical record. The <a href="../index.html#products">Complete Collection</a> offers all premium apps at a bundle discount, providing the full toolkit for serious practice.</p>`
  },

  // === TOPIC: ESP / ZENER CARDS ===
  {
    keywords: ['zener-card', 'esp-training', 'clairvoyance', 'telepathy',
      'precognition', 'psi-hitting', 'psi-missing', 'can-you-train-intuition',
      'scientific-studies-zener', 'remote-perception', 'increase-esp',
      'best-esp-training', 'remote-viewing', 'psychic-navigation'],
    title: 'The Role of Feedback in ESP Development',
    id: 'esp-feedback-role',
    html: `<p>One factor consistently emerges as critical in ESP research: immediate, accurate feedback. Studies comparing training methods show that participants who receive instant feedback after each trial improve dramatically, while those practicing without feedback show no improvement over chance.</p>
<p>The mechanism is similar to any skill acquisition. Your brain needs to know whether its "guess" was correct to calibrate the subtle perceptual processes involved in psi reception. Without feedback, you're practicing blind—you might be correctly identifying subtle cues or reinforcing incorrect strategies, and you have no way to distinguish between them.</p>
<p><strong>For solo practice</strong>, automated testing platforms are essential. Our free <a href="../tools/sigil-generator.html">Zener card test</a> provides immediate feedback and tracks your scores over time. The <a href="../index.html#products">PSI GYM app</a> extends this with structured training protocols, difficulty progression, and detailed analytics that show which conditions produce your best scores.</p>
<p><strong>For partner practice</strong>, have one person generate targets while another guesses, with immediate confirmation. Switch roles regularly. This social dimension adds accountability and often produces surprisingly strong results—psi seems to flourish in supportive, playful contexts. Record all sessions in a dedicated journal, noting environmental factors (time of day, noise level, your energy state) that correlate with higher scores.</p>`
  },

  // === GENERIC - GRIMOIRE/RECORD KEEPING (for any article still thin) ===
  {
    keywords: [],  // generic - matches everything as fallback
    title: 'The Magical Record: Your Most Important Tool',
    id: 'magical-record-importance',
    html: `<p>If you take only one piece of advice from this entire site, let it be this: keep a magical record. Not a journal of experiences (though that's valuable), but a systematic log of what you did, when you did it, and what happened afterward.</p>
<p>A proper magical record includes: (1) the date, time, and lunar phase of the working, (2) the specific technique or ritual used, (3) the exact wording of the intention, (4) the method of gnosis employed, (5) the immediate results during the working (visions, sensations, insights), (6) the results observed in the following days and weeks, and (7) a final assessment (success, partial, failure, or too early to tell).</p>
<p>After 30-50 recorded workings, patterns emerge that transform your practice. You'll discover that certain sigil methods produce 80% success while others barely reach 30%. You'll see which lunar phases amplify your workings. You'll identify the conditions—time of day, location, mental state—that correlate with your best results.</p>
<p>This evidence-based approach is the heart of modern chaos magick: test everything, keep what works, discard what doesn't. Our free <a href="../tools/sigil-generator.html">sigil generator</a> and <a href="../tools/spell-builder.html">spell builder</a> make execution consistent, but your personal record is what transforms occasional practice into a genuine magical technology. For digital record-keeping with analytics, explore the <a href="../index.html#products">premium app collection</a>.</p>`
  }
];

// ============================================================
// HELPERS
// ============================================================

function getArticleWordCount(html) {
  // Try <article> tag first
  const articleMatch = html.match(/<article[^>]*>([\s\S]*?)<\/article>/);
  if (articleMatch) {
    const text = articleMatch[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    return text.split(' ').length;
  }
  // Fallback: find content between <main> and footer/related-articles
  const mainMatch = html.match(/<main[^>]*>([\s\S]*?)<\/main>/);
  if (mainMatch) {
    // Exclude related-articles section from word count
    const mainContent = mainMatch[1].replace(/<section[^>]*class="related-articles[^"]*"[^>]*>[\s\S]*?<\/section>/, '');
    const text = mainContent.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    return text.split(' ').length;
  }
  // Last resort: count total body text
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/);
  if (bodyMatch) {
    const text = bodyMatch[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    return text.split(' ').length;
  }
  return 0;
}

function estimateReadTime(wordCount) {
  return Math.max(5, Math.ceil(wordCount / 150));
}

function getSectionMatch(fullHtml, sectionTitle) {
  // Check if this section was already inserted
  const id = sectionTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  return fullHtml.includes(`id="${id}"`) || fullHtml.includes(`#${id}`);
}

// ============================================================
// PASS 2: ADD DEEPER CONTENT
// ============================================================

function expandPass2(filePath) {
  const filename = path.basename(filePath);
  let html = fs.readFileSync(filePath, 'utf8');
  
  // Skip noindexed articles
  if (/noindex/i.test(html)) {
    return { skipped: true, reason: 'noindexed' };
  }
  
  const currentWords = getArticleWordCount(html);
  
  // Skip if already >= 1500 words
  if (currentWords >= 1500) {
    return { skipped: true, reason: `already ${currentWords} words` };
  }
  
  // Find matching sections for this article
  const lowerName = filename.toLowerCase();
  const lowerContent = html.toLowerCase().substring(0, 3000);
  const combined = lowerName + ' ' + lowerContent;
  
  let matchedSections = [];
  
  for (const section of pass2Sections) {
    // Generic section always applies if article still thin
    if (section.keywords.length === 0) {
      if (currentWords < 1000) {
        matchedSections.push(section);
      }
      continue;
    }
    
    for (const kw of section.keywords) {
      if (combined.includes(kw.toLowerCase())) {
        if (!matchedSections.includes(section)) {
          matchedSections.push(section);
        }
        break;
      }
    }
  }
  
  if (matchedSections.length === 0) {
    matchedSections.push(pass2Sections[pass2Sections.length - 1]); // generic section
  }
  
  let insertedCount = 0;
  const sectionsHtml = []; // collect all first, then insert
  const tocEntries = [];
  
  for (const section of matchedSections) {
    if (getSectionMatch(html, section.title)) {
      continue; // skip if already inserted
    }
    
    tocEntries.push(`            <li><a href="#${section.id}">${section.title}</a></li>`);
    sectionsHtml.push(`<h2 id="${section.id}">${section.title}</h2>\n${section.html}\n`);
    insertedCount++;
  }
  
  if (insertedCount === 0) {
    return { skipped: true, reason: 'all sections already present' };
  }
  
  // Insert TOC entries before </ol> in TOC
  if (tocEntries.length > 0) {
    html = html.replace(
      /(<\/ol>\s*<\/nav>\s*<\/details>)/,
      tocEntries.join('\n') + '\n$1'
    );
  }
  
  // Insert content sections before FAQ, or References, or Share, or end of article
  const insertHtml = '\n\n' + sectionsHtml.join('\n') + '\n';
  
  const insertPoints = [
    { pattern: /<h2[^>]*>frequently asked questions/i, useFirst: true },
    { pattern: /<h2[^>]*>references/i, useFirst: true },
    { pattern: /<div class="share-section"/, useFirst: true },
    { pattern: /<section class="related-articles"/, useFirst: true },
    { pattern: /<\/article>/i, useFirst: false }
  ];
  
  let inserted = false;
  for (const point of insertPoints) {
    const match = point.useFirst ? html.match(point.pattern) : point.pattern.exec(html);
    if (match) {
      html = html.replace(point.pattern, insertHtml + '\n$&');
      inserted = true;
      break;
    }
  }
  
  if (!inserted) {
    // Insert before </main>
    html = html.replace('</main>', insertHtml + '\n</main>');
  }
  
  // Update read time
  const newWords = getArticleWordCount(html);
  const newReadTime = estimateReadTime(newWords);
  html = html.replace(/(\d+)\s*min\s*read/i, `${newReadTime} min read`);
  
  // Update meta description
  const metaMatch = html.match(/<meta name="description"[^>]*content="([^"]+)"/i);
  if (metaMatch && metaMatch[1].length < 120) {
    const newDesc = metaMatch[1].replace(/\.\.\.*\s*$/, '').trim() + ' — expanded with practical techniques and detailed guidance.';
    html = html.replace(
      /<meta name="description"[^>]*content="([^"]+)"/i,
      `<meta name="description" content="${newDesc.substring(0, 160)}"`
    );
  }
  
  fs.writeFileSync(filePath, html, 'utf8');
  return { expanded: true, before: currentWords, after: newWords, sections: insertedCount };
}

// ============================================================
// MAIN
// ============================================================

function main() {
  const files = fs.readdirSync(BLOG_DIR)
    .filter(f => f.endsWith('.html') && f !== 'index.html')
    .sort();
  
  let expanded = 0;
  let skipped = 0;
  let totalBefore = 0;
  let totalAfter = 0;
  
  console.log(`\n=== PASS 2: Article Expansion (target: 1500+ words) ===\n`);
  
  for (const file of files) {
    const filePath = path.join(BLOG_DIR, file);
    const result = expandPass2(filePath);
    
    if (result.expanded) {
      console.log(`✓ ${file}: ${result.before}w → ${result.after}w (+${result.after - result.before}w, ${result.sections} sections)`);
      totalBefore += result.before;
      totalAfter += result.after;
      expanded++;
    } else {
      console.log(`- ${file}: ${result.reason}`);
      skipped++;
    }
  }
  
  const totalGain = totalAfter - totalBefore;
  console.log(`\n=== Done: ${expanded} expanded (+${totalGain} words), ${skipped} skipped ===`);
}

main();
