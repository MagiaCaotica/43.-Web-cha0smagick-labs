import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pinsPath = path.join(__dirname, '..', '..', 'gifs_animados_pinterest', 'pins.json');
const pins = JSON.parse(fs.readFileSync(pinsPath, 'utf8'));

const outputDir = path.join(__dirname, '..', '..', 'dark-fantasy');
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

// App mapping for funnel
const appFunnel = {
  'com.app.goetiansealsgeneratorapp': { name: 'Chaos Sigil Forge', url: 'https://play.google.com/store/apps/details?id=com.app.goetiansealsgeneratorapp', desc: 'Create powerful chaos magick sigils instantly. Encode intention, generate unique symbols, charge with gnosis.' },
  'com.cha0smagick.sigilgeneratorfinal': { name: 'Arcana Goetia', url: 'https://play.google.com/store/apps/details?id=com.cha0smagick.sigilgeneratorfinal', desc: '72 Goetic spirits, sigils, seals, and ritual tools. Complete Ars Goetia grimoire on Android.' },
  'com.lunarapp.app': { name: 'Moon Phases & Lunar Calendar', url: 'https://play.google.com/store/apps/details?id=com.lunarapp.app', desc: 'Track lunar phases, planetary hours, and moon magick timing. Essential for ritual planning.' },
  'com.cha0smagick.dreammachine': { name: 'Dream Machine', url: 'https://play.google.com/store/apps/details?id=com.cha0smagick.dreammachine', desc: 'Lucid dream induction, reality checks, dream journal, and astral projection training.' },
  'com.cha0smagicklabs.noctemapp': { name: 'Noctem Tools', url: 'https://play.google.com/store/apps/details?id=com.cha0smagicklabs.noctemapp', desc: 'Complete paranormal toolkit: EMF, spirit box, EVP recorder, Esbat calendar, and more.' },
  'com.cha0smagicklabs.eerieroads': { name: 'Eerie Roads', url: 'https://play.google.com/store/apps/details?id=com.cha0smagicklabs.eerieroads', desc: 'Weird encounters, liminal horror, and paranormal road trip generator for RPG and investigation.' },
  'com.app.ichingoracle': { name: 'I Ching Oracle', url: 'https://play.google.com/store/apps/details?id=com.app.ichingoracle', desc: '64 hexagrams, three-coin method, changing lines. Ancient Chinese divination on Android.' },
  'com.cha0smagicklabs.astralchart': { name: 'Astral Lab', url: 'https://play.google.com/store/apps/details?id=com.cha0smagicklabs.astralchart', desc: 'Professional natal charts, transits, aspects, planetary hours. NASA-grade ephemerides.' },
  'com.japps.norse_oracle': { name: 'Norse Rune Oracle', url: 'https://play.google.com/store/apps/details?id=com.japps.norse_oracle', desc: '24 Elder Futhark runes, rune casting, meanings, poems. Authentic Norse divination.' },
  'com.cha0smagick.unofficialraiderwaite': { name: 'Rider-Waite Tarot', url: 'https://play.google.com/store/apps/details?id=com.cha0smagick.unofficialraiderwaite', desc: 'Complete 78-card Rider-Waite deck, 12+ spreads, daily draws, card meanings.' },
  'com.cha0smagicklabs.luciddreamer': { name: 'Lucid Dream', url: 'https://play.google.com/store/apps/details?id=com.cha0smagicklabs.luciddreamer', desc: 'Astral projection training, reality checks, dream journal, lucid induction techniques.' },
  'com.cha0smagicklabs.zenercards': { name: 'PSI GYM', url: 'https://play.google.com/store/apps/details?id=com.cha0smagicklabs.zenercards', desc: 'Zener card ESP trainer with statistical tracking. Measure your psychic ability with data.' }
};

// Book funnel
const bookFunnel = [
  { title: 'Codex Chaoticus', url: '/books/codex-chaoticus-pdf.html', desc: 'Complete treatise on chaos magick, sigils, servitors, and gnosis. The definitive guide.' },
  { title: 'Liber Lvpinux', url: '/books/liber-lvpinux-pdf.html', desc: 'Lycanthropic path through chaos magick and shadow work. Werewolf magick grimoire.' },
  { title: 'Tarot Chaos', url: '/books/tarot-chaos-pdf.html', desc: 'Chaos magick applied to the Tarot. Turn the deck into a ritual engine.' },
  { title: 'Catholiconomicon', url: '/books/catholiconomicon-pdf.html', desc: 'Chaos magick for Catholic practitioners. Ex-voto magic and sacramental symbolism.' },
  { title: 'Complete Practical Treatise on Magical Servitors', url: '/books/complete-practical-treatise-magical-servitors-pdf.html', desc: 'Build, feed, and banish thought-forms that work. 368 pages of servitor technology.' },
  { title: 'Mind The Gap', url: '/books/mind-the-gap-pdf.html', desc: 'Master the 0.3 seconds that define your life and your magic. Timing is everything.' },
  { title: 'Tratado de Runas Cazadoras del Caos', url: '/books/tratado-runas-cazadoras-caos-pdf.html', desc: 'Chaos hunter runes in Spanish. Bindrunes, galdr, and runic sigil magick.' },
  { title: 'Ouija Cazadora', url: '/books/ouija-cazadora-pdf.html', desc: 'Safe Ouija protocols, spirit communication, and chaos magick divination.' }
];

function slugify(str) {
  return str.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

pins.forEach(pin => {
  const file = pin.file;
  const title = pin.title;
  const description = pin.description;
  const appPkg = pin.link.match(/id=([^&]+)/)?.[1];
  const app = appPkg ? appFunnel[appPkg] : null;
  
  // Determine theme/category for deep-dive content
  const themes = {
    'Septic Scythe': { theme: 'Death Magick & Sigil Craft', category: 'Chaos Magick', lore: 'The reaper as archetypal death energy. In chaos magick, death is not an end but a transformation operator. The scythe cuts through attachment, harvesting what no longer serves.' },
    'Black Tower': { theme: 'Solitary Practice & Tower Magick', category: 'Occult Worldbuilding', lore: 'The isolated tower represents the magician\'s solitary work. Like the Tower card, it signifies necessary destruction of false structures.' },
    'Catacombs': { theme: 'Ancestral Work & Necromancy', category: 'Necromancy', lore: 'Catacombs hold the bones of forgotten kings. In magick, ancestral work accesses power lines beyond individual memory.' },
    'Witching Hour': { theme: 'Witchcraft Timing & Lunar Magick', category: 'Witchcraft', lore: 'The witching hour (3 AM) is when the veil thins. Traditional timing for spellwork, spirit contact, and gnosis.' },
    'March of the Skeleton Army': { theme: 'Necromantic Legions & Command', category: 'Necromancy', lore: 'Skeleton armies represent commanded death energy. The necromancer doesn\'t beg — they command. Authority over the dead.' },
    'Blood Moon': { theme: 'Lunar Magick & Blood Rituals', category: 'Lunar Magick', lore: 'Blood moons amplify chthonic forces. Traditional time for blood offerings, binding spells, and shadow work.' },
    'Drowned Dungeon': { theme: 'Water Element & Abyssal Magick', category: 'Elemental Magick', lore: 'Drowned places hold memory. Water retains imprint — the dungeon\'s flooding preserves psychic residue for scrying.' },
    'Gnoll War Drums': { theme: 'Rhythm & Trance Induction', category: 'Gnosis Techniques', lore: 'Drumming induces gnosis through entrainment. The gnoll\'s primitive rhythm bypasses intellect, accessing raw power.' },
    'Troll Bridge': { theme: 'Liminal Spaces & Threshold Guardians', category: 'Threshold Magick', lore: 'Bridges are thresholds. The troll demands toll — payment for crossing between worlds. Every transition requires sacrifice.' },
    'Magus Last Spell': { theme: 'Final Gambit & Desperation Magick', category: 'Chaos Magick', lore: 'The last spell holds all accumulated power. Desperation focuses will into a single point — the ultimate gnosis state.' },
    'Acid Rain': { theme: 'Corrosive Magick & Entropy', category: 'Entropy Magick', lore: 'Acid dissolves structure. In magick, controlled corrosion breaks down rigid patterns, allowing new forms to emerge.' },
    'Procession of the Damned': { theme: 'Processional Ritual & Order', category: 'Ritual Magick', lore: 'Ordered procession creates collective gnosis. The damned walk in rhythm — discipline channels chaotic energy.' },
    'Frozen Throne': { theme: 'Stasis & Cryomancy', category: 'Ice Magick', lore: 'Frozen power is stored power. The throne waits. Cryomancy preserves intent until the moment of release.' },
    'Duende\'s Hollow': { theme: 'Folklore Spirits & Land Wights', category: 'Animism', lore: 'Duendes are land spirits. The hollow is their door. Offering and respect open communication with genius loci.' },
    'Gargoyle\'s Lament': { theme: 'Architectural Magick & Stone Guardians', category: 'Guardian Magick', lore: 'Gargoyles are bound servitors. Stone remembers. Their lament is the weight of centuries of unfulfilled watch.' },
    'Necromancer Laboratory': { theme: 'Alchemical Preparation & Components', category: 'Alchemy', lore: 'The laboratory is where raw materials become magickal tools. Jars, diagrams, bodies — each component holds specific virtue.' },
    'Siege of Iron Keep': { theme: 'Defensive Magick & Warding', category: 'Protection Magick', lore: 'Iron repels. The siege tests wards. True protection isn\'t passive — it\'s active counter-measure.' },
    'Abyssal Chasm': { theme: 'Void Magick & Cosmic Horror', category: 'Void Magick', lore: 'The abyss gazes back. Void magick uses absence as operator. The chasm is not empty — it\'s pregnant with unmanifest potential.' },
    'Phantom Knight': { theme: 'Oathbound Service & Spectral Guardians', category: 'Servitor Magick', lore: 'The phantom knight is a servitor bound by oath. Death doesn\'t end service — it perfects it. Loyalty becomes eternal.' },
    'Last Light': { theme: 'Hope in Darkness & Endurance', category: 'Survival Magick', lore: 'One torch in endless dark. The last light is the practitioner\'s will. As long as one flame burns, the work continues.' }
  };

  // Match theme by title
  let themeData = { theme: 'Dark Fantasy Art', category: 'Occult Art', lore: 'Dark fantasy imagery as magickal focus. Visual anchors for gnosis, ritual, and worldbuilding.' };
  for (const [key, val] of Object.entries(themes)) {
    if (title.includes(key)) { themeData = val; break; }
  }

  const slug = slugify(title.replace('|', '').replace('Dark Fantasy', '').trim());
  const pageUrl = `/dark-fantasy/${slug}.html`;
  
  // Update pin link to point to deep-dive page
  pin.deepDiveUrl = `https://cha0smagicklabs.com${pageUrl}`;
  
  // Generate deep-dive page
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title} | Dark Fantasy Deep Dive | Cha0smagick Labs</title>
<meta name="description" content="${description.replace(/"/g, '"')}. Deep dive into the magickal lore, symbolism, and practical applications. Includes animated GIF, chaos magick analysis, and funnel to relevant apps and grimoires.">
<meta name="keywords" content="dark fantasy art, animated gif, ${themeData.category.toLowerCase()}, chaos magick, sigil magick, goetia, occult art, rpg art">
<meta name="robots" content="index, follow, max-image-preview:large">
<link rel="canonical" href="https://cha0smagicklabs.com${pageUrl}">
<meta property="og:type" content="article">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta property="og:image" content="https://cha0smagicklabs.com/gifs/${file}">
<meta name="twitter:card" content="summary_large_image">
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "${title}",
  "description": "${description.replace(/"/g, '"')}",
  "image": "https://cha0smagicklabs.com/gifs/${file}",
  "author": { "@type": "Organization", "name": "Cha0smagick Labs", "url": "https://cha0smagicklabs.com/" },
  "publisher": { "@type": "Organization", "name": "Cha0smagick Labs", "logo": { "@type": "ImageObject", "url": "https://cha0smagicklabs.com/assets/images/Banner.png" } },
  "mainEntityOfPage": { "@type": "WebPage", "@id": "https://cha0smagicklabs.com${pageUrl}" }
}
</script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;700&display=swap">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../css/style.min.css?v=305788b32d">
<style>
  .deepdive-section { max-width: 900px; margin: 0 auto; padding: 2rem 1rem; }
  .deepdive-hero { text-align: center; margin-bottom: 2rem; }
  .deepdive-gif { max-width: 100%; height: auto; border-radius: var(--radius-lg); border: 1px solid var(--border-card); box-shadow: 0 8px 32px rgba(0,0,0,0.4); }
  .deepdive-title { font-size: clamp(1.5rem, 4vw, 2.5rem); margin-bottom: 0.5rem; color: var(--text-primary); }
  .deepdive-meta { color: var(--text-muted); font-size: 0.9rem; margin-bottom: 2rem; }
  .deepdive-content { line-height: 1.8; color: var(--text-body); }
  .deepdive-content h2 { color: var(--accent-gold); margin-top: 2rem; margin-bottom: 1rem; font-family: var(--font-mono); }
  .deepdive-content h3 { color: var(--text-primary); margin-top: 1.5rem; margin-bottom: 0.5rem; }
  .funnel-section { background: var(--bg-card); border: 1px solid var(--border-card); border-radius: var(--radius-lg); padding: 2rem; margin-top: 3rem; }
  .funnel-title { color: var(--accent-gold); font-family: var(--font-mono); margin-bottom: 1.5rem; text-align: center; }
  .funnel-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; margin-top: 1.5rem; }
  .funnel-card { background: var(--bg-body); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 1.5rem; transition: border-color var(--transition-fast); }
  .funnel-card:hover { border-color: var(--accent-gold); }
  .funnel-card h4 { color: var(--accent-gold); margin-bottom: 0.5rem; font-size: 1.1rem; }
  .funnel-card p { color: var(--text-body); font-size: 0.9rem; margin-bottom: 1rem; }
  .btn-funnel { display: inline-block; background: var(--accent-gold); color: #030303; padding: 0.6rem 1.2rem; border-radius: var(--radius-sm); text-decoration: none; font-weight: 600; font-size: 0.85rem; transition: background var(--transition-fast); }
  .btn-funnel:hover { background: var(--accent-light); }
  .tag-row { display: flex; flex-wrap: wrap; gap: 0.5rem; justify-content: center; margin-bottom: 1.5rem; }
  .tag { background: rgba(192,160,96,0.15); color: var(--accent-gold); padding: 0.3rem 0.8rem; border-radius: 999px; font-size: 0.75rem; font-weight: 600; }
  @media (max-width: 600px) { .deepdive-title { font-size: 1.5rem; } }
</style>
</head>
<body itemscope itemtype="https://schema.org/WebPage">
<header>
  <picture>
    <source srcset="../assets/images/Banner.webp" type="image/webp">
    <img src="../assets/images/Banner.png" alt="Cha0smagick Labs - Occult Apps for Android" class="header-logo" width="200" height="200" loading="eager">
  </picture>
  <div itemscope itemtype="https://schema.org/Organization">
    <span class="site-title" itemprop="name" role="heading" aria-level="1">Cha0smagick Labs</span>
    <p itemprop="description">Corporate Techno-Sorcery Solutions | Occult Apps | Cybermancy | Cyberpaganism</p>
    <meta itemprop="url" content="https://cha0smagicklabs.com/">
    <meta itemprop="foundingDate" content="2026">
    <meta itemprop="founder" content="Frater Alek0s">
  </div>
</header>

<nav aria-label="Main navigation">
  <ul>
    <li><a href="../#home">↑ Home</a></li>
    <li><a href="../#about">About Us</a></li>
    <li><a href="../tools/">Free Tools</a></li>
    <li><a href="../#products">Apps & Services</a></li>
    <li><a href="../#books-section">Books</a></li>
    <li><a href="../blog/">Blog</a></li>
    <li><a href="../glossary.html">Glossary</a></li>
    <li><a href="../best-occult-apps-android.html">Best Apps</a></li>
    <li><a href="../dark-fantasy-gallery.html">🎨 Dark Fantasy Gallery</a></li>
    <li><a href="../#paranormal-division">Paranormal R&D</a></li>
    <li><a href="../search.html">🔍 Search</a></li>
    <li><a href="../es/">🇪🇸 Español</a></li>
    <li><a href="https://t.me/cha0smagicklabs" target="_blank">Community</a></li>
    <li><a href="../#contact">Contact</a></li>
  </ul>
</nav>

<nav aria-label="Breadcrumb" class="breadcrumb-nav">
  <ol class="breadcrumb-list">
    <li><a href="https://cha0smagicklabs.com/">Home</a></li>
    <li><a href="../dark-fantasy-gallery.html">Dark Fantasy Gallery</a></li>
    <li aria-current="page">${title}</li>
  </ol>
</nav>

<main>
  <section class="deepdive-section" itemscope itemtype="https://schema.org/Article">
    <div class="deepdive-hero">
      <h1 class="deepdive-title" itemprop="headline">${title}</h1>
      <p class="deepdive-meta"><strong>${themeData.category}</strong> • <strong>${themeData.theme}</strong></p>
      <div class="tag-row">
        <span class="tag">Animated GIF</span>
        <span class="tag">Deep Dive</span>
        <span class="tag">${themeData.category}</span>
        <span class="tag">Chaos Magick</span>
      </div>
    </div>

    <figure style="text-align:center; margin-bottom:2rem;">
      <img src="../gifs/${file}" alt="${description}" class="deepdive-gif" width="512" height="512" loading="eager" itemprop="image">
      <figcaption style="margin-top:0.75rem; color:var(--text-muted); font-size:0.9rem;">Animated dark fantasy art — view full motion above</figcaption>
    </figure>

    <div class="deepdive-content" itemprop="articleBody">
      <h2>Visual Analysis</h2>
      <p>${description}</p>
      
      <h2>Magickal Lore: ${themeData.theme}</h2>
      <p>${themeData.lore}</p>
      
      <h2>Practical Applications</h2>
      <ul>
        <li><strong>Gnosis Anchor:</strong> Use the animated GIF as a visual focus for trance induction. The looping motion entrains brainwaves toward theta/gamma states.</li>
        <li><strong>Sigil Charging:</strong> Gaze at the animation while projecting intention. The motion carries the charge into the subconscious.</li>
        <li><strong>Ritual Atmosphere:</strong> Display on screen during ritual to maintain thematic resonance.</li>
        <li><strong>Dream Incubation:</strong> View before sleep to seed lucid dream content with the imagery.</li>
        <li><strong>Worldbuilding:</strong> Reference for RPG campaigns, fiction writing, or occult journaling.</li>
      </ul>
      
      <h2>Correspondences</h2>
      <table style="width:100%; border-collapse:collapse; margin:1rem 0; font-size:0.9rem;">
        <tr style="border-bottom:1px solid var(--border-subtle);"><td style="padding:0.5rem; color:var(--accent-gold);"><strong>Element</strong></td><td style="padding:0.5rem;">${themeData.category.includes('Necro') || themeData.category.includes('Death') ? 'Earth/Water' : themeData.category.includes('Lunar') ? 'Water' : themeData.category.includes('Fire') || themeData.category.includes('Blood') ? 'Fire' : themeData.category.includes('Ice') ? 'Water/Earth' : themeData.category.includes('Void') || themeData.category.includes('Cosmic') ? 'Spirit/Void' : themeData.category.includes('Air') ? 'Air' : 'All'}</td></tr>
        <tr style="border-bottom:1px solid var(--border-subtle);"><td style="padding:0.5rem; color:var(--accent-gold);"><strong>Planetary</strong></td><td style="padding:0.5rem;">${themeData.category.includes('Lunar') ? 'Moon' : themeData.category.includes('Death') || themeData.category.includes('Necro') ? 'Saturn/Pluto' : themeData.category.includes('Blood') ? 'Mars' : themeData.category.includes('Void') ? 'Pluto' : themeData.category.includes('Astrology') ? 'Saturn' : 'Variable'}</td></tr>
        <tr style="border-bottom:1px solid var(--border-subtle);"><td style="padding:0.5rem; color:var(--accent-gold);"><strong>Chakra</strong></td><td style="padding:0.5rem;">${themeData.category.includes('Root') || themeData.category.includes('Death') ? 'Root' : themeData.category.includes('Heart') ? 'Heart' : themeData.category.includes('Third Eye') || themeData.category.includes('Void') ? 'Third Eye/Crown' : 'Solar Plexus'}</td></tr>
        <tr><td style="padding:0.5rem; color:var(--accent-gold);"><strong>Timing</strong></td><td style="padding:0.5rem;">${themeData.category.includes('Lunar') ? 'Full/New Moon, Lunar Hour' : themeData.category.includes('Death') || themeData.category.includes('Necro') ? 'Saturday, Saturn Hour' : themeData.category.includes('Blood') ? 'Tuesday, Mars Hour' : themeData.category.includes('Void') ? 'Dark Moon, Pluto Hour' : 'As needed'}</td></tr>
      </table>
    </div>

    <!-- FUNNEL SECTION -->
    <section class="funnel-section">
      <h2 class="funnel-title">🔮 Tools & Grimoires for This Work</h2>
      <p style="text-align:center; color:var(--text-muted); margin-bottom:1.5rem;">The imagery is the gate. These tools walk you through it.</p>
      
      <div class="funnel-grid">
        ${app ? `
        <article class="funnel-card">
          <h4>📱 ${app.name}</h4>
          <p>${app.desc}</p>
          <a href="${app.url}" class="btn-funnel" target="_blank" rel="noopener">Get on Google Play →</a>
        </article>
        ` : ''}
        
        ${bookFunnel.slice(0, 3).map(book => `
        <article class="funnel-card">
          <h4>📖 ${book.title}</h4>
          <p>${book.desc}</p>
          <a href="${book.url}" class="btn-funnel">Read Details →</a>
        </article>
        `).join('')}
        
        <article class="funnel-card">
          <h4>📚 Complete Esoteric Library</h4>
          <p>All 9 PDF grimoires at 59% off. Chaos magick, Goetia, runes, tarot, servitors, lycanthropy, and more.</p>
          <a href="../landing-pages/books-bundle.html" class="btn-funnel">View Bundle →</a>
        </article>
      </div>
    </section>

    <!-- RELATED GALLERY -->
    <section style="margin-top:3rem;">
      <h2 style="color:var(--accent-gold); font-family:var(--font-mono); margin-bottom:1.5rem;">🎨 More Dark Fantasy</h2>
      <p style="text-align:center; color:var(--text-muted); margin-bottom:1.5rem;">Explore the full animated gallery — 21 pieces, each with its own deep dive.</p>
      <div style="text-align:center;">
        <a href="../dark-fantasy-gallery.html" class="btn-funnel">View Full Gallery →</a>
      </div>
    </section>
  </section>
</main>

<footer>
  <div class="footer-grid">
    <div class="footer-section"><h2>Tools</h2><ul><li><a href="../tools/">Free Tools</a></li><li><a href="../apps/">Android Apps</a></li><li><a href="../landing-pages/books-bundle.html">Books Bundle</a></li></ul></div>
    <div class="footer-section"><h2>Resources</h2><ul><li><a href="../blog/">Blog & Guides</a></li><li><a href="../glossary.html">Glossary</a></li><li><a href="../buscar.html">Search</a></li></ul></div>
    <div class="footer-section"><h2>Community</h2><ul><li><a href="https://t.me/cha0smagicklabs" target="_blank">Telegram</a></li><li><a href="https://discord.gg/6vNSCaPgPd" target="_blank">Discord</a></li><li><a href="https://www.youtube.com/channel/UCglU9np0SqGcnrCMLyVOqKA" target="_blank">YouTube</a></li></ul></div>
    <div class="footer-section"><h2>Legal</h2><ul><li><a href="../privacy-policy.html">Privacy</a></li><li><a href="../terms.html">Terms</a></li><li><a href="../refund-policy.html">Refunds</a></li></ul></div>
  </div>
  <div class="footer-bottom"><p>&copy; 2026 Cha0smagick Labs · Corporate Cybermancy Solutions</p></div>
</footer>

<script src="../js/shared.min.js?v=b003b45ce1" defer></script>
<script src="../js/analytics-bridge.js?v=0326db9440" defer></script>
</body>
</html>`;

  fs.writeFileSync(path.join(outputDir, `${slug}.html`), html);
  console.log(`Generated: ${slug}.html`);
});

// Save updated pins.json
fs.writeFileSync(pinsPath, JSON.stringify(pins, null, 2) + '\n');
console.log('\nAll deep-dive pages generated. pins.json updated with deepDiveUrl.');