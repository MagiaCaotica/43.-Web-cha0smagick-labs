#!/usr/bin/env node
/**
 * Article Expander - cha0smagicklabs.com
 * 
 * Expands MEDIUM (15-30KB) and SHORT-EDGE (10-15KB) articles from 
 * ~300-800 words to ~1500+ words by inserting substantive content
 * sections tailored to each article's topic cluster.
 * 
 * Usage: node scripts/expand-articles.js
 */

const fs = require('fs');
const path = require('path');

const BLOG_DIR = path.join(__dirname, '..', 'blog');

// ============================================================
// CONTENT TEMPLATES PER CLUSTER
// ============================================================

const clusters = {
  // === ASTROLOGY / PLANETS ===
  astrology: {
    keywords: [
      'mars-sign', 'mercury-sign', 'rising-sign', 'moon-sign', 'venus-sign',
      'planetary-transits', 'astrology-aspects', 'natal-chart', 'astrology',
      'astrology-apps', 'astrology-sign', 'astrology-apps'
    ],
    sections: [
      {
        id: 'astrology-history-modern',
        title: 'The History and Modern Practice of Astrology',
        html: `<p>The practice of astrology spans over 4,000 years, with roots in Babylonian celestial observation, Hellenistic philosophical frameworks, and Arabic innovations during the Golden Age. Modern Western astrology—the system most apps and online tools use—descends from the Hellenistic tradition filtered through medieval Arabic astrologers like Albumasar (Abu Ma'shar) and later Renaissance figures such as William Lilly.</p>
<p>What makes astrology persist across millennia is not superstition but pattern recognition. The positions of planets at the moment of your birth create a symbolic language—a map of potentials, not a script. Modern astrologers increasingly integrate psychological frameworks inspired by Carl Jung, who wrote extensively about archetypes and synchronicity as bridges between celestial patterns and human experience.</p>
<p>For the modern practitioner, astrology serves multiple functions: self-understanding through the birth chart, timing guidance through transits and progressions, and synchronicity tracking when outer events mirror planetary configurations. Free tools like our <a href="../index.html">astrology sign calculator</a> make entry accessible, while premium apps provide deeper transit analysis and progressed chart calculations for serious students.</p>`
      },
      {
        id: 'astrology-tools-practice',
        title: 'Practical Applications for Your Astrology Practice',
        html: `<p>Integrating astrology into daily magical practice doesn't require memorizing every aspect and house. Start with three core applications:</p>
<ol>
<li><strong>Electional Timing</strong> — Choose planetary hours and days for specific workings. The Moon's phase alone dramatically affects ritual outcomes: new moon for beginnings, full moon for manifestation, waning for banishing.</li>
<li><strong>Transit Awareness</strong> — Note which sign and house each planet occupies today. When a transiting planet aspects a planet in your natal chart, energetic windows open. Mercury retrograde periods (three times yearly) are ideal for review and revision, not for initiating new projects.</li>
<li><strong>Personal Archetype Work</strong> — Your Sun, Moon, and Rising signs form your core triad. Each represents a different layer: Sun (core identity and ego direction), Moon (emotional nature and subconscious patterns), Rising (outer personality and first impressions). Understanding these three creates a foundation for all other astrological work.</li>
</ol>
<p>Apps like <a href="../index.html#products">our premium astrology collection</a> automate transit calculations and generate personalized reports, freeing you to focus on interpretation and application rather than ephemeris lookup.</p>`
      }
    ]
  },

  // === LUCID DREAMING / ASTRAL PROJECTION ===
  lucid_dreaming: {
    keywords: [
      'lucid-dream', 'astral-projection', 'dream-journal', 'dream-control',
      'dream-signs', 'wake-back-to-bed', 'reality-check', 'theta-waves',
      'monroe-method', 'astral-realms', 'oneironautics', 'vibrational-state',
      'silver-cord', 'energy-body-activation', 'obe-', 'astral-travel',
      'astral-projection-safety'
    ],
    sections: [
      {
        id: 'lucid-dreaming-science',
        title: 'The Neuroscience of Lucid Dreaming',
        html: `<p>Lucid dreaming—the state of being aware you are dreaming while remaining asleep—has moved from esoteric curiosity to legitimate neuroscientific research. fMRI studies at the Max Planck Institute for Psychiatry demonstrate that lucid dreaming corresponds to increased gamma-band activity in the frontal and temporal regions, specifically the dorsolateral prefrontal cortex, an area typically deactivated during REM sleep.</p>
<p>This neurological activation explains why lucid dreamers can perform tasks, make decisions, and remember waking-world intentions. Dr. Stephen LaBerge's pioneering work at Stanford University in the 1980s established that lucid dreamers could signal their conscious awareness through pre-arranged eye movements, proving the phenomenon was real and measurable.</p>
<p>For the magical practitioner, this scientific validation is significant: it confirms that the dreaming mind retains agency and can be trained. Techniques like reality testing (asking "am I dreaming?" throughout the day) build neural pathways that carry into the dream state. The <a href="../tools/sigil-generator.html">sigil generator</a> can be programmed with dream-intention sigils to seed lucid dream goals before sleep.</p>`
      },
      {
        id: 'astral-vs-lucid',
        title: 'Distinguishing Astral Projection from Lucid Dreaming',
        html: `<p>While lucid dreaming and astral projection share similarities, experienced practitioners distinguish them by several consistent markers:</p>
<ul>
<li><strong>Awareness Continuity:</strong> In lucid dreams, waking consciousness emerges within an already-active dream scenario. In astral projection, practitioners report a distinct "exit" phase—vibrations, the hypnagogic buzz, and a sense of separation from the physical body.</li>
<li><strong>Environmental Stability:</strong> Lucid dream environments tend to shift and morph as the dreamer's attention wanders. Astral environments, by contrast, are reported as stable and consistent across multiple visits by different practitioners.</li>
<li><strong>Sensory Fidelity:</strong> Astral projection experiences often include tactile sensations (wind, temperature, texture) with greater intensity than typical lucid dreams. Many projectors report that "astral touch" feels more vivid than physical touch.</li>
<li><strong>Verifiable Information:</strong> The gold standard for astral projection research remains verifiable remote viewing—can the projector describe a location they've never physically visited? While controversial, some well-documented cases exist in parapsychology literature.</li>
</ul>
<p>Whichever model resonates with you, consistent practice is the key. Apps like <a href="../index.html#products">PSI GYM</a> provide structured training protocols, while free tools like our <a href="../tools/digital-pendulum.html">digital pendulum</a> can aid pre-sleep meditation and focus.</p>`
      }
    ]
  },

  // === TAROT / DIVINATION ===
  tarot: {
    keywords: [
      'tarot-card-meanings', 'tarot-spreads', 'tarot-reading', 'tarot-suits',
      'tarot-card-combinations', 'tarot-card-reversed', 'intuitive-tarot',
      'tarot-journaling', 'daily-tarot', 'celtic-cross', 'tarot',
      'tarot-spread'
    ],
    sections: [
      {
        id: 'tarot-reading-depth',
        title: 'Moving Beyond Card Meanings',
        html: `<p>Most beginners approach tarot by memorizing card meanings—a necessary first step, but one that creates a ceiling on reading depth. The leap from reciting meanings to genuine intuitive reading happens when you start seeing cards as conversations rather than definitions.</p>
<p>Try this approach: instead of asking "what does The Tower mean?", ask "what is The Tower saying to The Empress in this position?" The meaning emerges from the relationship between cards, not from isolated keywords. This relational reading style mirrors how we interpret human conversations—words derive meaning from context, sequence, and delivery.</p>
<p>A powerful technique is to read the spread as a story: Card 1 is the protagonist (the situation or seeker), Card 2 is the challenge or ally, Card 3 is the turning point, and Card 4 is the resolution. This narrative frame makes even complex spreads intuitive. Our <a href="../tools/sigil-generator.html">sigil generator</a> can create personalized focus sigils for specific questions before a reading.</p>`
      },
      {
        id: 'tarot-shadow-work',
        title: 'Tarot as a Shadow Work Tool',
        html: `<p>Few divination systems match tarot's effectiveness for shadow work—the practice of exploring unconscious patterns, repressed emotions, and unintegrated aspects of the self. Cards like The Moon, The Devil, and Judgment specifically address shadow material, but every card has a shadow dimension.</p>
<p>To use tarot for shadow work, create a dedicated spread: Position 1: "What shadow pattern is active in my life right now?", Position 2: "Where did this pattern originate?", Position 3: "How does this shadow serve me (what is its gift)?", Position 4: "What first step integrates this shadow consciously?"</p>
<p>Journaling your readings is essential for tracking patterns over time. Without a record, you lose the ability to see how shadow material evolves. The synergy between tarot journaling and <a href="../index.html#products">premium divination apps</a> creates a powerful feedback loop for personal transformation.</p>`
      }
    ]
  },

  // === GPS MANIFESTATION / SYNCHRONICITY ===
  gps_manifestation: {
    keywords: [
      'gps-manifestation', 'gps-intention', 'geographic-sigil', 'sigil-walking',
      'synchronicity-journal', 'synchronicity-hunting', 'liminal-space',
      'offline-manifestation', 'digital-flaneur', 'digital-shadow-work',
      'privacy-first-navigation', 'dark-cartography', 'chaos-coordinates',
      'reality-hacking', 'intention-manifestation', 'signs-universe',
      'chaos-magick-gps', 'chaos-magick-quantum-observation',
      'digital-privacy-magick'
    ],
    sections: [
      {
        id: 'gps-magick-theory',
        title: 'The Theoretical Framework of GPS Magick',
        html: `<p>GPS magick—using geographic coordinates, location data, and digital maps as magical tools—represents one of the most innovative developments in 21st-century chaos magick. The core insight is simple: if all phenomena can carry magical intent (the chaos magick principle of association), then digital location data is as valid a magical medium as wax or parchment.</p>
<p>The theoretical underpinning draws from several sources. Austin Osman Spare's concept of "the alphabet of desire" suggested that any symbolic system could carry magical intent. Peter Carroll's concept of "belief as tool" in Liber Null extends this to include modern technological frameworks. If you genuinely believe that a GPS coordinate can anchor a magical intention, within that belief system, it works.</p>
<p>Practically, this means marking locations with specific intentions on digital maps, creating "sigil walks" where your physical path traces a sigil shape across the landscape, and using mapping apps as grimoires of geotagged intentions. Our <a href="../index.html#products">offline manifestation app</a> provides structured tools for this practice, while the free <a href="../tools/sigil-generator.html">sigil generator</a> can encode intentions for location-based deployment.</p>`
      },
      {
        id: 'synchronicity-tracking',
        title: 'Systematic Synchronicity Tracking',
        html: `<p>Synchronicities—meaningful coincidences that seem to transcend probability—are the feedback mechanism of effective magick. But without systematic tracking, it's easy to either dismiss genuine synchronicities or over-interpret random events.</p>
<p>An effective synchronicity journal records four elements for each event: (1) the intention or magical working active at the time, (2) the objective synchronicity (what happened externally), (3) your subjective interpretation (what it means to you), and (4) the probability estimate (is this genuinely unlikely, or are you seeing patterns in noise?).</p>
<p>Over time, patterns emerge: certain sigil types produce specific synchronicity clusters, particular lunar phases amplify meaningful coincidences, and some locations generate more synchronicities than others. These patterns become your personal magical grammar—evidence of what works for <em>you</em>, which is ultimately the only authority that matters in chaos magick.</p>`
      }
    ]
  },

  // === CHAOS MAGICK THEORY ===
  chaos_theory: {
    keywords: [
      'chaos-magick-history', 'history-of-chaos-magick', 'chaos-magick-beginners',
      'psychonaut', 'reality-hacking', 'scrying', 'cyber-paganism',
      'digital-spellcasting', 'technomancy', 'cybermancy', 'magick',
      'paradigm-shift', 'belief-as-tool', 'chaos-magick-'
    ],
    sections: [
      {
        id: 'chaos-theory-paradigm',
        title: 'The Core Paradigm: Belief as Tool',
        html: `<p>The central innovation of chaos magick—what separates it from every preceding magical tradition—is the concept of "belief as tool." Rather than subscribing to a single cosmological framework (Hermetic, Wiccan, Thelemic, etc.), chaos magick treats all belief systems as useful fictions that can be adopted, modified, or discarded based on their practical effectiveness.</p>
<p>This is not cynicism or nihilism. It's a pragmatic meta-position that allows the practitioner to work with any system's techniques without being bound by its dogmas. Peter Carroll, in Liber Null & Psychonaut (1987), called this "the ultimate magical method"—the ability to shift paradigms at will, entering and exiting belief systems like changing clothes.</p>
<p>The practical implication is enormous: you can use the techniques of Goetic evocation without believing in literal demons, work with Norse runes without committing to Asatru theology, or practice Catholic folk magic without being Christian. Each system's power becomes available to you because you temporarily adopt its axioms. This flexibility is what makes chaos magick uniquely suited to the modern, pluralistic world.</p>`
      },
      {
        id: 'chaos-practice-modern',
        title: 'Building a Modern Chaos Magick Practice',
        html: `<p>Unlike initiatory traditions that require years of study before practice, chaos magick offers immediate entry through its core techniques: sigilization, gnosis, and paradigm shifting. A complete beginner can create and charge a sigil in an evening and have measurable results within days or weeks.</p>
<p>A sustainable modern practice balances three elements: (1) <strong>Technical skills</strong> — sigil creation, gnosis induction, servitor construction, divination literacy; (2) <strong>Theoretical understanding</strong> — the history and philosophy behind the techniques; (3) <strong>Applied integration</strong> — using magical results to improve actual life conditions (career, relationships, health, creativity).</p>
<p>The tools on this site are designed to support this balance. Free tools like the <a href="../tools/sigil-generator.html">sigil generator</a> and <a href="../tools/spell-builder.html">spell builder</a> handle technical execution, while <a href="../index.html#products">premium apps</a> provide structured frameworks for deeper work. The <a href="index.html">blog</a> offers theory and integration guidance. Together, they form a complete practice environment.</p>`
      }
    ]
  },

  // === FREE TOOLS GUIDES ===
  free_tools: {
    keywords: [
      'free-sigil-generator', 'free-i-ching', 'free-online-rune-reading',
      'free-lunar-phase-calculator', 'free-sigil-maker', 'free-sigil-creator',
      'sigil-creator-online', 'sigil-maker-ultimate', 'sigilscribe',
      'moon-phase-generator', 'i-ching-digital', 'i-ching-oracle',
      'i-ching-three-coin', 'i-ching-hexagram', 'norse-runes',
      'viking-oracle', 'candle-color-calculator'
    ],
    sections: [
      {
        id: 'tool-magical-context',
        title: 'How Digital Tools Enhance Traditional Practice',
        html: `<p>The integration of digital tools into magical practice is not a replacement for traditional methods—it's an expansion of possibilities. A digital sigil generator doesn't replace drawn sigils; it adds capabilities that paper and ink cannot match: cryptographic precision, instant iteration, algorithmic patterning, and systematic storage.</p>
<p>Think of it this way: traditional methods excel at building personal connection through the slow, deliberate process of creation. Digital methods excel at precision, speed, and complex patterning. The wise practitioner uses both. Draw your sigils by hand for workings that require deep personal investment; use the generator for high-volume experimentation, complex encoding, or when you need a sigil quickly.</p>
<p>Our free tool is designed as a starting point—a gateway to the practice. When you need more power, flexibility, and cryptographic depth, the <a href="../index.html#products">premium app version</a> provides SHA-256 hashing, multiple alphabet systems, planetary kameas, SVG export, and an integrated charging timer. The free tool teaches you the basics; the premium tool turns you into a digital sigil engineer.</p>`
      },
      {
        id: 'tool-progression-path',
        title: 'From Free Tool to Master Practitioner',
        html: `<p>Every featured tool on this site has a progression path: the free web tool teaches fundamentals, the premium Android app enables advanced practice, and community knowledge (shared through the <a href="index.html">blog</a>) provides context and technique.</p>
<p>Start with the free tool. Use it until you understand its capabilities and limitations. When you consistently want features the free version doesn't offer—that's the signal to upgrade. This "pull" model (upgrading because your practice demands it) is far more effective than "push" (buying premium features you don't yet understand).</p>
<p>The <a href="../index.html#products">Complete Collection</a> bundles all premium apps at a substantial discount, giving you the full toolkit as your practice grows into each tool's capabilities.</p>`
      }
    ]
  },

  // === ESP / INTUITION / ZENER CARDS ===
  esp_intuition: {
    keywords: [
      'zener-card', 'esp-training', 'clairvoyance', 'telepathy',
      'precognition', 'psi-hitting', 'psi-missing', 'can-you-train-intuition',
      'scientific-studies-zener', 'remote-perception', 'increase-esp',
      'best-esp-training', 'remote-viewing', 'psychic-navigation'
    ],
    sections: [
      {
        id: 'esp-research-history',
        title: 'The Scientific Study of ESP: From Rhine to Modern Research',
        html: `<p>Quantitative ESP research began in earnest at Duke University's Parapsychology Laboratory under J.B. Rhine in the 1930s. Rhine's key innovation was the use of statistical probability to evaluate psi phenomena—specifically, the Zener card deck of five symbols (circle, square, cross, star, waves). By calculating the probability of correct guesses beyond chance expectation, Rhine created a methodology that separated parapsychology from spiritualism and anecdote.</p>
<p>Rhine's early experiments produced odds against chance in the billions-to-one range. While controversial, these results established that psi phenomena could be studied scientifically. Modern researchers at institutions like the Institute of Noetic Sciences (IONS), the Princeton Engineering Anomalies Research (PEAR) lab, and the University of Virginia's Division of Perceptual Studies continue this tradition with rigorous methodology.</p>
<p>The most fascinating modern finding is that psi appears to operate outside conventional space-time constraints. Precognition experiments show that individuals can accurately perceive events before they occur, and remote viewing data suggests that spatial distance does not degrade accuracy. This challenges fundamental assumptions about consciousness and its relationship to physical reality.</p>`
      },
      {
        id: 'esp-training-methods',
        title: 'Evidence-Based ESP Training Protocols',
        html: `<p>Research suggests that psi ability, like any skill, improves with structured practice. The most effective training protocols share several elements:</p>
<ul>
<li><strong>Regular, brief sessions</strong> — 10-15 minutes daily outperforms marathon weekly sessions. Consistency builds the neural pathways associated with psi reception.</li>
<li><strong>Immediate feedback</strong> — Knowing whether you were correct immediately after each trial reinforces successful patterns and helps correct ineffective strategies.</li>
<li><strong>Altered state induction</strong> — Brief meditation or relaxation before sessions significantly improves scores. Alpha-state training (8-12 Hz brainwave activity) appears particularly beneficial.</li>
<li><strong>Blind protocols</strong> — Having someone else generate targets or using automated systems like our free <a href="../tools/sigil-generator.html">Zener card test</a> prevents unconscious cueing.</li>
</ul>
<p>The <a href="../index.html#products">PSI GYM app</a> implements all these evidence-based protocols in a structured training program with progress tracking. For serious practitioners, combining daily app training with the techniques described in our <a href="index.html">blog posts</a> creates a comprehensive psi development practice.</p>`
      }
    ]
  }
};

// ============================================================
// GENERIC EXPANSION SECTION (for articles matching no cluster)
// ============================================================

const genericSection = {
  id: 'deepening-practice',
  title: 'Deepening Your Practice',
  html: `<p>Every magical practice, whatever its specific focus, benefits from three foundational habits: consistent daily work, systematic record-keeping, and regular review of results. Without these, practice becomes aimless experimentation rather than directed magical development.</p>
<p><strong>Daily work</strong> doesn't need to be elaborate. A 10-minute daily practice—meditation, sigil charging, or divination—builds momentum that weekly marathons cannot match. The key is consistency, not intensity. Choose a practice that fits your schedule and commit to it for 30 days before evaluating or changing it.</p>
<p><strong>Record-keeping</strong> transforms subjective experience into objective data. A magical journal (physical or digital) should record: date, time, lunar phase, the working performed, the intention clearly stated, the method of gnosis used, and the results observed. Over months, patterns emerge that would be invisible to memory alone.</p>
<p><strong>Review</strong> is what separates practitioners who grow from those who repeat. Monthly reviews of your journal reveal which techniques produce consistent results, which lunar phases amplify your work, and which intentions manifest most reliably. This evidence base becomes your personal magical tradition—more valuable than any published system because it's calibrated to your unique energy.</p>
<p>Use our free <a href="../tools/sigil-generator.html">sigil generator</a> to encode intentions, our free <a href="../tools/spell-builder.html">spell builder</a> to construct workings, and explore <a href="../index.html#products">premium apps</a> when your practice demands more sophisticated tools.</p>`
};

// ============================================================
// HELPER FUNCTIONS
// ============================================================

function detectCluster(filename, content) {
  const lowerName = filename.toLowerCase();
  const lowerContent = content.toLowerCase();
  const combined = lowerName + ' ' + lowerContent.substring(0, 3000);
  
  let bestMatch = null;
  let bestScore = 0;
  
  for (const [clusterName, cluster] of Object.entries(clusters)) {
    let score = 0;
    for (const kw of cluster.keywords) {
      if (combined.includes(kw.toLowerCase())) {
        score += kw.length; // longer keyword match = more specific
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = clusterName;
    }
  }
  
  return bestMatch;
}

function extractReadTime(html) {
  const match = html.match(/(\d+)\s*min\s*read/i);
  return match ? parseInt(match[1]) : null;
}

function estimateReadTime(wordCount) {
  return Math.max(5, Math.ceil(wordCount / 150));
}

function countArticleWords(html) {
  const match = html.match(/<article[^>]*>([\s\S]*?)<\/article>/);
  if (!match) return 0;
  const text = match[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  return text.split(' ').length;
}

function updateReadTime(html, newMinutes) {
  return html.replace(
    /(\d+)\s*min\s*read/i,
    `${newMinutes} min read`
  );
}

function updateMetaDescription(html, newDesc) {
  // Find meta description and update it to mention the expanded content scope
  // but only if we can find it cleanly
  return html;
}

// ============================================================
// MAIN EXPANSION ENGINE
// ============================================================

function expandArticle(filePath) {
  const filename = path.basename(filePath);
  let html = fs.readFileSync(filePath, 'utf8');
  
  // Skip if already indexed (noindex)
  if (/noindex/i.test(html)) {
    console.log(`SKIP: ${filename} - noindexed`);
    return false;
  }
  
  const currentWords = countArticleWords(html);
  
  // Only expand MEDIUM and SHORT-EDGE articles
  if (currentWords >= 1000 && filename.endsWith('.html')) {
    // Check if it's a MEDIUM article (not long - long articles already have content)
    const fileSize = Buffer.byteLength(html, 'utf8');
    if (fileSize >= 30000) {
      console.log(`SKIP: ${filename} - already ${currentWords} words, ${fileSize} bytes`);
      return false;
    }
  }
  
  if (currentWords >= 1200) {
    console.log(`SKIP: ${filename} - already ${currentWords} words (target met)`);
    return false;
  }
  
  // Detect cluster
  const clusterName = detectCluster(filename, html);
  
  // Get sections to insert
  let sections = [];
  if (clusterName && clusters[clusterName]) {
    sections = clusters[clusterName].sections;
    console.log(`EXPAND: ${filename} - ${currentWords}w -> cluster: ${clusterName}`);
  } else {
    sections = [genericSection];
    console.log(`EXPAND: ${filename} - ${currentWords}w -> generic`);
  }
  
  // Build sections HTML
  let sectionsHtml = '';
  for (const section of sections) {
    // Add TOC entry
    const tocEntry = `            <li><a href="#${section.id}">${section.title}</a></li>\n`;
    
    // Insert TOC entry before </ol> in the TOC
    html = html.replace(
      /(<\/ol>\s*<\/nav>\s*<\/details>)/,
      tocEntry + '$1'
    );
    
    sectionsHtml += `<h2 id="${section.id}">${section.title}</h2>\n${section.html}\n\n`;
  }
  
  // Insert sections before FAQ
  const faqMatch = html.match(/<h2[^>]*>frequently asked questions/i);
  if (faqMatch) {
    html = html.replace(
      /(<h2[^>]*>frequently asked questions)/i,
      sectionsHtml + '\n\n$1'
    );
  } else {
    // No FAQ - insert before references or share section
    const refMatch = html.match(/<h2[^>]*>references/i);
    if (refMatch) {
      html = html.replace(
        /(<h2[^>]*>references)/i,
        sectionsHtml + '\n\n$1'
      );
    } else {
      // Insert before share section
      html = html.replace(
        /(<div class="share-section")/,
        sectionsHtml + '\n\n$1'
      );
    }
  }
  
  // Update read time
  const newWords = countArticleWords(html);
  const newReadTime = estimateReadTime(newWords);
  html = updateReadTime(html, newReadTime);
  
  // Update meta description to include coverage of new sections
  // Extract first paragraph of new content for a better meta description
  const firstNewPara = sectionsHtml.match(/<p>(.*?)<\/p>/);
  if (firstNewPara) {
    const excerpt = firstNewPara[1].replace(/<[^>]+>/g, '').substring(0, 40);
    // Append to meta description if short enough
    const currentDesc = html.match(/<meta name="description"[^>]*content="([^"]+)"/i);
    if (currentDesc && currentDesc[1].length < 120) {
      const newDesc = currentDesc[1].replace(/\.\.\.*\s*$/, '').trim() + ' — ' + excerpt.substring(0, 50);
      html = html.replace(
        /<meta name="description"[^>]*content="([^"]+)"/i,
        `<meta name="description" content="${newDesc.substring(0, 160)}"`
      );
    }
  }
  
  // Update JSON-LD FAQ section to include more entries if applicable
  // This is article-specific and hard to automate, skip automated FAQ expansion
  
  // Update OG description
  const ogMatch = html.match(/<meta property="og:description"[^>]*content="([^"]+)"/i);
  if (ogMatch && ogMatch[1].length < 120) {
    const newDesc = ogMatch[1].replace(/\.\.\.*\s*$/, '').trim();
    html = html.replace(
      /<meta property="og:description"[^>]*content="([^"]+)"/i,
      `<meta property="og:description" content="${newDesc} — expanded guide with practical techniques and theoretical foundations."`
    );
  }
  
  fs.writeFileSync(filePath, html, 'utf8');
  console.log(`  -> ${newWords} words (${newReadTime} min read)`);
  return true;
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
  
  console.log(`\n=== Article Expansion: ${files.length} total articles ===\n`);
  
  for (const file of files) {
    const filePath = path.join(BLOG_DIR, file);
    if (expandArticle(filePath)) {
      expanded++;
    } else {
      skipped++;
    }
  }
  
  console.log(`\n=== Done: ${expanded} expanded, ${skipped} skipped ===`);
}

main();
