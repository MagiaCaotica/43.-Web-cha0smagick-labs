// expand-thin.js - expande artículos thin con contenido nuevo + CTA inline
const fs = require('fs');
const path = require('path');
const BASE = 'D:/Paginas web/Cha0smagick Labs/43.-Web-cha0smagick-labs/blog/';

function cta(app, appName, price, extra) {
  return '<div class="blog-cta-box" style="background:#111;border:1px solid #c0a060;border-radius:8px;padding:1.6rem;margin:2rem 0;text-align:center;">'
    + '<h3 style="color:#c0a060;margin-bottom:0.8rem;">Master ' + appName + ' with a Dedicated Tool</h3>'
    + '<p style="color:#a0a0a0;">' + extra + ' Keep this guide close and let the tools do the rest.</p>'
    + '<p><strong style="color:#fff;">' + price + ' USD &mdash; One-time payment &mdash; Instant download</strong></p>'
    + '<a href="/apps/' + app + '.html" target="_blank" style="display:inline-flex;margin-top:1rem;background:#00c853;color:#0a0a0a!important;padding:0.8rem 1.8rem;border-radius:6px;font-weight:600;text-decoration:none;">Get the ' + appName + ' App</a>'
    + '<p style="margin-top:0.8rem;font-size:0.85rem;color:#888;">Questions? Drop a comment below &mdash; we read every one.</p></div>';
}

// [h2 title, [p1, p2, p3]] - usamos comillas dobles en TODOS los strings (escapadas en el archivo)
const CLUSTERS = {
  // ---- CHAOS / SERVITORS → chaos-sigil-generator ----
  'egregore-collective-thought-form-power': ['Egregores and Collective Thought Forms', [
    "An egregore is a thought form sustained by a group: a household, a coven, an online community. Unlike a personal servitor, it grows stronger with every member who feeds it attention, ritual, and shared belief. This guide explains how egregores form, how they differ from servitors, and how to work with them deliberately.",
    "The key discipline is intentional maintenance. A household egregore for peace grows with a weekly shared ritual; a business egregore for growth grows with daily collective focus. You do not need a complex grimoire system. You need a clear name, a clear function, and a consistent feeding schedule.",
    "Sigils are the fastest way to program the egregore's core instruction. Design one sigil for the group's purpose, charge it together, and revisit it every full moon. What the group feeds, the group gets back. This article walks the full maintenance cycle."
  ]],
  'magical-correspondences-tables-guide': ['Magical Correspondence Tables, Explained', [
    "Correspondence tables link planets, elements, colors, metals, days, and spirits into one usable system. They let you build rituals that hit the right symbolic note: Mars for force, Venus for attraction, the Moon for intuition. This guide explains how to read, use, and extend the classic tables.",
    "You do not need to memorize every column. Start with the core set: planetary hour, color, incense, and metal for your most common workings. The rest becomes reference material you consult when a specific working demands precision.",
    "Digital tools make this dramatically easier. A sigil or lunar app can compute the planetary hour and moon phase for you, removing the most error-prone part of traditional timing. Consistency beats rote memorization."
  ]],
  'servitor-creation-complete-lifecycle': ['The Complete Servitor Lifecycle', [
    "A servitor runs through a predictable lifecycle: design, birth, service, and dissolution. Most failed servitors fail because one of these stages was skipped or rushed. This guide maps the full lifecycle so you can see exactly where your practice breaks.",
    "Design defines the function and form. Birth is the charging moment where the servitor becomes conscious. Service is the working period, and dissolution is the safe ending ritual that returns the energy. Each stage has its own failure modes and corrections.",
    "The single most common error is skipping dissolution, which leaves a servitor running with no instructions until it decays unpredictably. Every servitor, no matter how small, deserves a clear off-switch. This article details safe dissolution methods."
  ]],
  'chaos-magick-ouija-board-work': ['Using the Ouija Board in Chaos Magic', [
    "The ouija board is a classic chaos magic tool because it is a direct channel: the group mind moves the planchette and the subconscious speaks. In chaos magic practice, the board becomes a spirit box for whatever intention you program before the session.",
    "The most effective protocol is short, structured sessions: define the question, ground the group, use a clear yes/no/maybe vocabulary, and close the session deliberately. Drifting sessions produce noise; structured sessions produce signal.",
    "Paper boards work as well as manufactured ones, and digital spirit-box apps can fill the same role for solo work. The tool matters less than the discipline around it. This guide gives a full session template."
  ]],
  'chaos-magick-tarot-archetypal-sigils': ['Tarot Archetypes as Sigil Fuel', [
    "Each Major Arcana card is a compressed symbol system. When you extract a single glyph from a card, simplify it, and charge it as a sigil, you inherit the archetype's entire meaning in one mark. This is archetypal sigilization, and it is one of the fastest ways to build a working sigil library.",
    "The Magician gives you a willpower sigil. The Empress gives you abundance. The Tower gives you a disruption sigil for breaking stagnation. You do not need to reinvent symbols when a thousand years of imagery already carries the charge.",
    "The process is simple: choose a card, draw the key glyph, strip it to its essence, charge with gnosis, and fire it. A tarot deck app lets you pull the right card for the job instantly."
  ]],
  'gnosis-chaos-magick-complete-techniques': ['Gnosis in Chaos Magic: The Complete Techniques', [
    "Gnosis is the altered state where the analytical mind goes quiet and the subconscious is directly accessible. Every chaos magic technique, from sigils to servitors, runs on gnosis. This guide catalogs the main ways to reach it and how to know you are there.",
    "The two classic families are inhibitory and excitatory gnosis. Inhibitory methods quiet the mind through breathwork, stillness, or sensory deprivation. Excitatory methods exhaust it through dance, drumming, or intense physical exertion until it stops its internal chatter.",
    "A practical session combines both: two minutes of breathwork to anchor, then a short excitatory burst, then the working itself. You know you have reached gnosis when self-talk stops and the act feels automatic."
  ]],
  'chaos-magick-belief-as-tool-paradigm-shifting': ['Belief as a Tool: Paradigm Shifting', [
    "The core insight of chaos magic is that belief is a tool, not a truth. You adopt a worldview for the duration of a working, extract its power, and put it down when you are done. This is paradigm shifting, and it is the engine behind most advanced results.",
    "Each belief system carries unique machinery. Christian symbolism gives you intercession; ceremonial magic gives you archangels; pop culture gives you instantly recognizable gods. You use the machinery that best fits the goal, not the one that claims exclusive truth.",
    "The discipline is in the switching: clear intent before, clean exit after, and an honest journal of what worked. Over time you build a personal toolkit of paradigms that deliver."
  ]],
  'chaos-magick-history-origins-development': ['The History of Chaos Magic', [
    "Chaos magic crystallized in the 1970s and 1980s in the UK, drawing on the work of Austin Osman Spare and the experiments of the Illuminates of Thanateros. It rejected fixed hierarchies in favor of whatever works, making it the most adaptive tradition in Western occultism.",
    "Spare's contribution was sigilization: the idea that a symbol could encode a desire and be fired through gnosis. The IOT and figures like Peter Carroll and Ray Sherwin systematized his methods into a teachable body of practice.",
    "The tradition evolved into shoaling, pop magic, and digital magic. The tools changed, but the core stance remained: treat nothing as sacred, use everything that works. This article traces the full arc."
  ]],
  'technomancy-digital-magic-complete-guide': ['Technomancy: Digital Magic, Explained', [
    "Technomancy is the practice of magic through digital tools: sigil generators, lunar phase apps, digital altars, and algorithm-augmented ritual. It treats software as a legitimate magical instrument rather than a substitute for tradition.",
    "Digital tools excel at precision. A lunar phase app removes guesswork about timing; a sigil generator removes errors in letter reduction; a journaling app makes pattern analysis possible. The machine handles the mechanical parts so the magician can focus on intention.",
    "Technomancy is not less authentic than candle-and-bell work. The energetic principles are identical; only the interface changed. This guide covers the principles and the best digital instruments."
  ]],
  'pop-magick-modern-culture-magic': ['Pop Magick: Working with Modern Culture', [
    "Pop magick treats modern mythology as valid magical material. Movie characters, memes, and brands carry enormous collective charge, which makes them powerful focal points for sigils and servitors. If a symbol reaches millions of people, it has energy to lend.",
    "The technique is the same as traditional work: choose the symbol, define the function, charge, and release. What changes is the inventory. Instead of planetary squares, you draw from the collective imagination of your era.",
    "The danger is irony, which leaks charge. The remedy is sincere engagement with the symbol for the duration of the working. Used honestly, pop magick is one of the most potent modern techniques available."
  ]],
  // ---- LUNAR → lunar-phase-calculator ----
  'moon-phases-spell-timing-guide': ['Moon Phases for Spell Timing', [
    "Lunar timing is the most reliable rhythm in practical magic. The waxing moon builds and attracts; the waning moon releases and banishes; the full moon amplifies anything; the dark moon is the gateway for deep work. This guide gives the exact spell-to-phase map.",
    "The new moon is for intentions and new beginnings. The waxing phases build momentum toward a goal. The full moon is the peak window for charging anything. The waning phases dissolve obstacles, and the dark moon supports shadow work and banishings.",
    "Precision matters more than most practitioners realize. The exact minute of the phase change shifts the energy window, and a void-of-course moon can muffle a working. A lunar phase calculator app gives you the exact minute for your timezone so your ritual lands in the true window."
  ]],
  // ---- OUIJA → libro ouija-cazadora ----
  'ouija-board-planchette-movements-interpretation': ['Ouija Planchette Movements, Interpreted', [
    "The planchette speaks in movements, not words. Slow sweeps mean resistance or deliberation; fast jabs mean strong energy; circles mean the communicator is testing the circuit. This guide teaches you to read the motion vocabulary of the board.",
    "Every session should open with calibration: yes, no, and hello. This establishes the baseline pattern of the communicator and reveals whether the movements are deliberate or random micro-muscle drift. Calibration separates signal from noise.",
    "Record the session: which letters were hit, in what pattern, and at what speed. The written record is what makes interpretation possible after the trance state fades. A structured journal turns vague sessions into actionable data."
  ]],
  'ouija-board-divination-techniques': ['Ouija Board Divination Techniques', [
    "The ouija board is a divination tool with its own grammar. Unlike tarot or runes, it does not have fixed meanings per symbol; it has a circuit that translates unconscious knowing into letters. This guide covers the techniques that make that translation reliable.",
    "The two-station technique uses one questioner and one pointer, reducing the group-mind noise. The single-operator technique uses a blindfolded solo operator for high-focus sessions. Each has its own calibration ritual.",
    "Prepare the board with protective intent, agree on the session rules aloud, and close the session deliberately every time. The discipline of the container determines the quality of the content."
  ]],
  'ouija-board-safety-protection-rituals': ['Ouija Safety and Protection Rituals', [
    "Working the board safely is a matter of protocol, not fear. This guide covers the standard safety stack: grounding before the session, protection framing, clear session rules, and a deliberate closing ritual that returns the circuit to rest.",
    "The most important rule is never to abandon a session. If the planchette becomes erratic, you do not walk away; you close the session with the agreed exit phrase and clear the board. Leaving a circuit open is the only real hazard.",
    "Protection is about intent and consistency, not elaborate paraphernalia. A candle, a clear spoken boundary, and a clean closing ritual cover the vast majority of practice. The rest is common sense and a good journal."
  ]],
  'ouija-board-history-origins-modern-practice': ['Ouija Board History and Modern Practice', [
    "The ouija board appeared in the 1890s as a commercial product riding the Spiritualist wave, and its popularity has never really faded. What began as a parlor game became a serious divination tool across many traditions, including chaos magic.",
    "The planchette itself predates the board: writing tools that pointed or wrote were used in European spirit communication for a century before the ouija name was trademarked. The board simply standardized the circuit.",
    "Modern practice ranges from traditional physical boards to digital spirit-box apps that generate letters and words. The mechanics changed, but the core practice remains: a focused circuit, clear questions, and disciplined closure."
  ]]
};

let ok = 0, fail = 0;
for (const slug of Object.keys(CLUSTERS)) {
  const f = BASE + slug + '.html';
  try {
    let h = fs.readFileSync(f, 'utf8');
    const [title, secs] = CLUSTERS[slug];
    let html = '<h2 id="expanded-guide">' + title + '</h2>\n';
    for (const s of secs) html += '<p>' + s + '</p>\n';
    let app = 'chaos-sigil-generator', appName = 'Chaos Sigil Generator', price = '$3.99';
    if (slug === 'moon-phases-spell-timing-guide') { app = 'lunar-phase-calculator'; appName = 'Lunar Phase Calculator'; price = '$3.99'; }
    if (slug.indexOf('ouija') === 0) {
      html += '<div class="blog-cta-box" style="background:#111;border:1px solid #c0a060;border-radius:8px;padding:1.6rem;margin:2rem 0;text-align:center;">'
        + '<h3 style="color:#c0a060;margin-bottom:0.8rem;">Deepen Your Practice with the Ouija Cazadora Guide</h3>'
        + '<p style="color:#a0a0a0;">The complete Spanish-language manual for safe, effective board work.</p>'
        + '<p><strong style="color:#fff;">$3.99 USD &mdash; One-time payment &mdash; Instant download</strong></p>'
        + '<a href="https://pay.hotmart.com/B104271332D?checkoutMode=2" target="_blank" style="display:inline-flex;margin-top:1rem;background:#ff6b35;color:#fff!important;padding:0.8rem 1.8rem;border-radius:6px;font-weight:600;text-decoration:none;">Get the Ouija Cazadora Guide</a>'
        + '<p style="margin-top:0.8rem;font-size:0.85rem;color:#888;">Questions? Drop a comment below &mdash; we read every one.</p></div>';
    } else {
      html += cta(app, appName, price, 'The practice is ready when you are.');
    }
    let idx = h.indexOf('<aside');
    if (idx < 0) idx = h.lastIndexOf('</main>');
    if (idx < 0) idx = h.lastIndexOf('</article>');
    if (idx < 0) { fail++; console.log('FAIL no anchor:', slug); continue; }
    h = h.slice(0, idx) + html + h.slice(idx);
    fs.writeFileSync(f, h);
    ok++;
    const words = h.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().split(' ').length;
    console.log('OK', slug, 'words~', words);
  } catch (e) { fail++; console.log('ERR', slug, e.message); }
}
console.log('TOTAL ok:', ok, 'fail:', fail);
