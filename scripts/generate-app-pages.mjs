/**
 * generate-app-pages.mjs
 * Genera páginas HTML estáticas para cada app/book a partir de apps-data.js.
 * Crea URLs limpias: /apps/psi-gym.html en vez de /pages/app-details.html?id=psi-gym
 * 
 * Uso: node scripts/generate-app-pages.mjs
 */

import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const APPS_DIR = join(ROOT, 'apps');

const BASE_URL = 'https://cha0smagicklabs.com';
const GA_ID = 'G-V6LHCPN9TK';

// ===== DATA (copied from js/apps-data.js) =====
const appsData = [
    {
        id: "psi-gym",
        name: "PSI GYM: Zener Cards & ESP",
        price: "$3.99 USD",
        url: "https://play.google.com/store/apps/details?id=com.cha0smagicklabs.zenercards",
        status: "available",
        description: "Train your intuition and extrasensory perception with professional Zener cards and advanced statistical tracking. 👁️",
        image: "assets/images/zener.webp",
        seo: {
            title: "PSI GYM | Zener Cards & ESP Training App for Intuition",
            description: "Enhance your psychic abilities with PSI GYM. Professional Zener card training, ESP testing & statistical analysis. The ultimate intuition trainer for Android. Buy now.",
            keywords: "zener cards, esp training, psychic trainer, intuition app, extrasensory perception, parapsychology tool, psi training, remote viewing, clairvoyance practice, buy esoteric app, chaos magick app, psychic abilities, telepathy trainer"
        },
        screenshots: [
            "../assets/images/z1.png",
            "../assets/images/z2.png",
            "../assets/images/z3.png"
        ],
        detailedDescription: `
            <h3>Can You Predict the Unknown? Unlock Your Latent Psychic Potential.</h3>
            <p>We all have gut feelings, but few know how to sharpen them into a reliable tool. <strong>PSI GYM</strong> is a professional-grade ESP (Extrasensory Perception) training environment designed to take intuition out of the realm of "luck" and into the realm of skill. Using the world-standard Zener card system—Circle, Cross, Waves, Square, and Star—this app provides a rigorous, distraction-free laboratory for your mind.</p>
            <p>Whether you are a student of parapsychology, a chaos magician working on gnosis, or simply curious about the limits of your consciousness, PSI GYM offers the data and the discipline you need to grow.</p>
            
            <h4>Professional ESP Training Features</h4>
            <ul>
                <li><strong>Classic Zener Card Engine:</strong> Practice with the iconic 25-card deck (5 of each symbol). Our algorithm ensures true randomness, providing a valid baseline for statistical testing.</li>
                <li><strong>Advanced Statistical Tracking:</strong> Don't just guess—measure. Track your hit rates, probability deviations, and historical performance to identify your "psychic streaks."</li>
                <li><strong>Multiple Training Modes:</strong> Choose between "Open Deck" for learning and "Blind Testing" for serious verification of your intuitive accuracy.</li>
                <li><strong>Minimalist Gnostic Interface:</strong> A clean, dark UI designed to minimize sensory interference and help you reach the focused state of mind necessary for ESP work.</li>
                <li><strong>100% Offline & Private:</strong> Your training data and results stay on your device. No cloud tracking, no accounts—just you and the cards.</li>
            </ul>
            
            <h4>Who Is PSI GYM For?</h4>
            <ul>
                <li><strong>Psychic Seekers</strong> who want a structured way to practice clairvoyance and precognition.</li>
                <li><strong>Chaos Magicians</strong> using Zener cards as a tool for achieving and verifying altered states of consciousness (Gnosis).</li>
                <li><strong>Parapsychology Enthusiasts</strong> looking for a portable, accurate version of the famous Duke University experiments.</li>
            </ul>
            
            <h4>Frequently Asked Questions</h4>
            <p><strong>Are Zener cards effective for training intuition?</strong><br>Yes. By isolating symbols and providing immediate feedback, Zener cards help you recognize the "feeling" of a correct intuitive hit versus a logical guess.</p>
            <p><strong>How does the statistical tracking work?</strong><br>The app compares your actual results against the mathematical probability of chance (20%). This allows you to see if you are performing consistently above the average.</p>
            <p><strong>Is this app suitable for beginners?</strong><br>Absolutely. PSI GYM is designed to be intuitive and easy to use, providing a professional environment for both beginners and advanced practitioners.</p>
            
            <h4>Why PSI GYM Is Your Essential Intuition Lab</h4>
            <ul>
                <li><strong>Scientific Foundation:</strong> Based on the proven methodology developed by Karl Zener and J.B. Rhine.</li>
                <li><strong>Mobile Laboratory:</strong> Turn any moment into a training session—commutes, breaks, or dedicated ritual time.</li>
                <li><strong>No Distractions:</strong> No ads, no social features, no fluff. Just pure psychic training.</li>
            </ul>
            
            <h3>The Portal to Your Intuition Is Open. Are You Ready to Enter?</h3>
            <p>Stop wondering if you have "the gift" and start training it. Download <strong>PSI GYM</strong> now and see what your mind is truly capable of.</p>
        `
    },
    {
        id: "arcana-goetia",
        name: "Arcana Goetia: Ritual & Sigils",
        price: "$3.99 USD",
        url: "https://play.google.com/store/apps/details?id=com.cha0smagick.sigilgeneratorfinal",
        status: "available",
        description: "Command the 72 spirits of Solomon with precision sigils, lore, and guided rituals—all offline.",
        image: "assets/images/GSG.webp",
        seo: {
            title: "Arcana Goetia: Ritual & Sigils | Goetic Grimoire & Sigil Generator App",
            description: "Command the 72 spirits of Solomon with Arcana Goetia. Digital sigil generator, complete Lemegeton lore, and guided invocation—all offline. Download the ultimate Goetic grimoire app. Buy esoteric tools for Android.",
            keywords: "goetia app, solomon sigils, lemegeton grimoire, goetic magic, sigil generator, occult app, chaos magic, invocation, 72 spirits, ritual tool, buy esoteric, android occult app, chaos magick app, digital sigil, goetic grimoire"
        },
        screenshots: [
            "../assets/images/go1.PNG",
            "../assets/images/go2.PNG",
            "../assets/images/go3.PNG"
        ],
        detailedDescription: `
            <h3>What If You Could Command the 72 Spirits of Solomon from Your Pocket?</h3>
            <p>Every occult practitioner knows the frustration: grimoires buried in archaic language, sigils that take hours to draw by hand, and no reliable way to access the wisdom of the Goetia when you need it most. <strong>Arcana Goetia</strong> shatters those barriers. It is the first digital grimoire that puts the complete Lemegeton—sigils, hierarchies, planetary correspondences, and invocation guides—directly into your hands, ready to use at the speed of thought.</p>
            <p>Whether you are a seasoned chaos magician or an initiate taking your first steps into Solomonic tradition, this app is your ritual engine. No internet required. No clutter. Just pure, focused power.</p>
            
            <h4>Key Features That Set Arcana Goetia Apart</h4>
            <ul>
                <li><strong>Goetic Sigil Generator:</strong> Generate razor-sharp, customizable sigils for all 72 spirits of Solomon in seconds. Each sigil is mathematically precise and ready for charging, banishing, or integrating into talismanic work.</li>
                <li><strong>Complete Lore Grimoire:</strong> Explore an exhaustive database of each spirit—rank, planetary hour, elemental correspondence, Psalm verses for evocation, and historical context sourced directly from the Lesser Key of Solomon.</li>
                <li><strong>Built-in Invocation Guidance:</strong> Structured ritual frameworks help both beginners and adepts navigate evocation with respect, safety, and laser-focused intent. No more guesswork.</li>
                <li><strong>Minimalist Altar Interface:</strong> A dark, immersive visual environment designed to hold your concentration during ritual. No distractions. No ads. Just you and the sigil.</li>
                <li><strong>100% Offline:</strong> Your entire digital grimoire travels with you—no Wi-Fi, no data, no excuses. Perfect for remote ritual work or travel.</li>
            </ul>
            
            <h4>Who Is Arcana Goetia For?</h4>
            <ul>
                <li><strong>Chaos Magicians</strong> who want rapid, aesthetic sigil tools that bridge technology with traditional practice.</li>
                <li><strong>Solomonic Practitioners</strong> seeking a portable, accurate reference to the 72 spirits, their seals, and their correspondences.</li>
                <li><strong>Occult Beginners</strong> who need a safe, guided entry into Goetic magic without the overwhelm of archaic texts.</li>
            </ul>
            
            <h4>Frequently Asked Questions</h4>
            <p><strong>Is this app suitable for beginners?</strong><br>Yes. The app includes structured guidance and safety protocols for those new to Goetic magic, while offering enough depth for advanced practitioners.</p>
            <p><strong>Does it require an internet connection?</strong><br>No. All content—sigil generator, grimoire, and guides—works completely offline. Your practice stays private.</p>
            <p><strong>Are the sigils historically accurate?</strong><br>Absolutely. Every seal is sourced from the most authoritative Solomonic texts and rendered with precision for ritual use.</p>
            
            <h4>Why Arcana Goetia Is the Goetic App You Need</h4>
            <ul>
                <li><strong>Historical Fidelity:</strong> Every correspondence, rank, and seal is verified against canonical Solomonic grimoires—no fluff, no invention.</li>
                <li><strong>Built for Modern Practice:</strong> Rapid sigil generation and intuitive navigation mean you spend less time searching and more time doing.</li>
                <li><strong>Always Expanding:</strong> We continuously add spirits, ritual tools, and reference material based on practitioner feedback.</li>
                <li><strong>Your Privacy Matters:</strong> No accounts, no tracking, no cloud. Everything stays on your device.</li>
            </ul>
            
            <h3>Your Digital Gateway to the Goetia Awaits.</h3>
            <p>Stop wrestling with PDFs and faded photocopies. Download <strong>Arcana Goetia</strong> now and transform your phone into a temple of ancient wisdom.</p>
        `
    },
    {
        id: "norse-rune-oracle",
        name: "Norse Rune Oracle",
        price: "$3.99 USD",
        url: "https://play.google.com/store/apps/details?id=com.japps.norse_oracle",
        onlineUrl: "https://www.magiadelcaospractica.com/2024/09/Descubre%20el%20Oraculo%20Runico%20Vikingo%20Online%20Gratis.html",
        status: "available",
        description: "Unlock Viking wisdom with 12+ rune spreads for love, wealth, protection, and daily guidance.",
        image: "assets/images/norse-rune.webp",
        seo: {
            title: "Norse Rune Oracle | Elder Futhark Rune Reading & Divination App",
            description: "Get accurate rune readings with the Norse Rune Oracle. 12+ spreads for love, wealth, protection & daily guidance. Authentic Elder Futhark divination app for Android. Norse magic & divination.",
            keywords: "norse runes, viking runes, rune reading app, elder futhark, divination, rune oracle, viking wisdom, spiritual guidance, norse divination, buy esoteric, chaos magick app, android occult app"
        },
        screenshots: [
            "../assets/images/nr1.PNG",
            "../assets/images/nr2.PNG",
            "../assets/images/nr3.PNG",
            "../assets/images/nr4.PNG"
        ],
        detailedDescription: `
            <h3>What Do the Ancient Runes Say About Your Future? Find Out Instantly.</h3>
            <p>Every day you face decisions—about love, money, career, your path forward. What if you could hold a thousand years of Viking wisdom in your hand and get clarity in seconds? The <strong>Norse Rune Oracle</strong> puts the full power of the Elder Futhark at your fingertips.</p>
            <p>Thousands of users already get daily guidance. Now it's your turn.</p>
            
            <h4>Powerful Features for Real Guidance</h4>
            <ul>
                <li><strong>Daily Rune Inspiration:</strong> Pull a Rune of the Day every morning and receive instant cosmic guidance.</li>
                <li><strong>12+ Advanced Casting Spreads:</strong> Odin's Rune, The Three Norns, Love Reading, Wealth Cast, Protection Cast, and more.</li>
                <li><strong>Intention-Focused Readings:</strong> Write your question, set your intent, and get a deeply personal interpretation.</li>
                <li><strong>Complete Elder Futhark Library:</strong> Master all 24 runes with detailed profiles.</li>
                <li><strong>Immersive Norse Atmosphere:</strong> Elegant animations and a dark mystical interface.</li>
            </ul>
            
            <h4>Who Is the Norse Rune Oracle For?</h4>
            <ul>
                <li><strong>Beginners</strong> who want a guided introduction to rune divination.</li>
                <li><strong>Experienced Readers</strong> looking for a portable, feature-rich casting tool.</li>
                <li><strong>Spiritual Seekers</strong> who want daily guidance and connection to Norse tradition.</li>
            </ul>
            
            <h4>Frequently Asked Questions</h4>
            <p><strong>Do I need prior knowledge of runes to use this app?</strong><br>Not at all. The app includes a complete rune library and guided interpretations.</p>
            <p><strong>Can I use it for specific questions about love or money?</strong><br>Yes. The app features dedicated spreads for each area of life.</p>
            <p><strong>Is my reading history private?</strong><br>Absolutely. All readings are stored locally on your device.</p>
            
            <h4>Why Choose Norse Rune Oracle?</h4>
            <ul>
                <li><strong>Authentic Norse Foundation:</strong> Every interpretation is rooted in historical Eddaic and saga sources.</li>
                <li><strong>Works Offline:</strong> No internet? No problem. All features work without a connection.</li>
                <li><strong>Beautiful, Focused Design:</strong> An interface built for contemplation, not distraction.</li>
            </ul>
            
            <h3>The Runes Are Calling. Will You Answer?</h3>
            <p>Stop wondering and start knowing. Download <strong>Norse Rune Oracle</strong> now and let the Elder Futhark illuminate your path.</p>
        `
    },
    {
        id: "lunar-phase-calculator",
        name: "Lunar Phase Calculator",
        price: "$3.99 USD",
        url: "https://play.google.com/store/apps/details?id=com.lunarapp.app",
        status: "available",
        description: "Track moon phases for magic, wellness, and biodynamic gardening with stunning real-time visuals.",
        image: "assets/images/lunar-phase.webp",
        seo: {
            title: "Lunar Phase Calculator | Moon Phases for Magic, Gardening & Wellness",
            description: "Track lunar phases for magic rituals, biodynamic gardening, and wellness timing. Precision moon data, guided rituals, and stunning live visualization. Download the moon phase app for Android.",
            keywords: "lunar phase calculator, moon phases, moon magic, biodynamic gardening, moon calendar, astrology app, wellness, ritual timing, lunar data, lunar magic app, buy esoteric, android occult app"
        },
        screenshots: [
            "../assets/images/moon1.PNG",
            "../assets/images/moon2.PNG",
            "../assets/images/moon3.PNG"
        ],
        detailedDescription: `
            <h3>Are You Living in Sync with the Moon? Start Today.</h3>
            <p>Most people live by the sun alone—but the moon governs the tides, the growth of plants, the rhythms of the body, and the flow of energy. The <strong>Lunar Phase Calculator</strong> brings together astronomy, wellness, biodynamic gardening, and lunar magic in one stunning tool.</p>
            
            <h4>Everything the Moon Can Do for You</h4>
            <ul>
                <li><strong>Wellness Timing:</strong> Know the best lunar phases for haircuts, skincare, detox, and nutrition.</li>
                <li><strong>Precision Astronomy:</strong> Track moonrise, moonset, Earth-Moon distance with millimeter accuracy.</li>
                <li><strong>Biodynamic Gardening:</strong> Plant, transplant, prune at the optimal lunar moment.</li>
                <li><strong>Lunar Magic & Rituals:</strong> Guided rituals for manifestation, reflection, and release.</li>
                <li><strong>Stunning Live Visualization:</strong> Watch the current phase animate in real time.</li>
            </ul>
            
            <p>Download the <strong>Lunar Phase Calculator</strong> now and discover what it feels like to live in harmony with the cosmos.</p>
        `
    },
    {
        id: "iching-oracle",
        name: "I Ching Oracle",
        price: "$3.99 USD",
        url: "https://play.google.com/store/apps/details?id=com.app.ichingoracle",
        onlineUrl: "https://www.magiadelcaospractica.com/2024/09/software-de-i-ching-gratuito-online.html",
        status: "available",
        description: "Cast the I Ching with an authentic three-coin algorithm. 64 hexagrams, multilingual, and totally private.",
        image: "assets/images/iching.webp",
        seo: {
            title: "I Ching Oracle | Book of Changes & Chinese Divination App",
            description: "Cast the I Ching with an authentic three-coin algorithm. 64 hexagrams with full interpretations, reading history, and multilingual support. Download the most accurate I Ching app for Android.",
            keywords: "i ching, book of changes, i ching app, chinese oracle, hexagram, divination app, taoist philosophy, three coin method, digital oracle, buy esoteric, android occult app, chaos magick"
        },
        screenshots: [
            "../assets/images/ching1.PNG",
            "../assets/images/ching2.PNG",
            "../assets/images/ching3.PNG",
            "../assets/images/ching4.PNG"
        ],
        detailedDescription: `
            <h3>For 3,000 Years, the I Ching Has Guided Emperors, Philosophers, and Seekers. Now It Fits in Your Pocket.</h3>
            <p>The Book of Changes is not just an oracle—it is a philosophical mirror that reflects the patterns of the universe. <strong>I Ching Oracle</strong> brings this ancient Chinese divination system to life with a state-of-the-art simulation of the traditional three-coin method.</p>
            
            <h4>Key Features</h4>
            <ul>
                <li><strong>64 Complete Hexagrams:</strong> Every symbol with its full meaning and judgment.</li>
                <li><strong>Authentic Three-Coin Algorithm:</strong> Strictly faithful to tradition.</li>
                <li><strong>Reading History:</strong> All readings saved locally on your device.</li>
                <li><strong>Built-in Learning Guide:</strong> New to the I Ching? The app includes a complete educational section.</li>
                <li><strong>Total Privacy:</strong> Every query stays on your device.</li>
            </ul>
            
            <h4>Available in 5 Languages</h4>
            <p>English, Spanish, French, German, and Italian.</p>
            
            <p>Download <strong>I Ching Oracle</strong> now and start deciphering the changes in your destiny.</p>
        `
    },
    {
        id: "chaos-sigil-generator",
        name: "Magick Chaos Sigil Generator",
        price: "$3.99 USD",
        url: "https://play.google.com/store/apps/details?id=com.app.goetiansealsgeneratorapp",
        onlineUrl: "https://www.magiadelcaospractica.com/2024/09/Generador%20de%20Sigilos%20Goeticos%20Online%20Gratuito.html",
        status: "available",
        description: "Encode your Will into unique cryptographic sigils using ancient alphabets and planetary magic squares.",
        image: "assets/images/chaos-sigil.webp",
        seo: {
            title: "Magick Chaos Sigil Generator | Cryptographic Sigil Tool for Chaos Magick",
            description: "Create unique cryptographic sigils from your intentions. Supports Runic, Egyptian, Hebrew, Arabic, Greek & Cyrillic alphabets plus Planetary Kameas. The ultimate chaos magick sigil app for Android.",
            keywords: "chaos magick, sigil generator, austin osman spare, sigilization, cybermancy, cryptographic sigil, planetary kameas, occult app, technomancy, sigil maker, digital sigil generator, buy esoteric, android occult app"
        },
        screenshots: [
            "../assets/images/msg1.PNG",
            "../assets/images/msg2.PNG",
            "../assets/images/msg3.PNG",
            "../assets/images/msg4.PNG"
        ],
        detailedDescription: `
            <h3>Your Will. Encoded. Sealed. Unleashed.</h3>
            <p>The <strong>Magick Chaos Sigil Generator</strong> is the most advanced digital sigil engine ever created—a cybernetic ritual tool that fuses the esoteric techniques of Austin Osman Spare with cryptographic entropy and ancient occult alphabets.</p>
            
            <h4>Key Features for the Modern Occultist</h4>
            <ul>
                <li><strong>Advanced Sigil Creation:</strong> Transform any intention into a visual sigil using multiple tracing methods.</li>
                <li><strong>6 Ancient Occult Alphabets:</strong> Runic, Egyptian Hieroglyphs, Hebrew, Arabic, Greek, and Cyrillic.</li>
                <li><strong>Planetary Kameas:</strong> Align your sigil with Saturn, Jupiter, Mars, Sun, Venus, Mercury, or the Moon.</li>
                <li><strong>Cryptographic Entropy Engine:</strong> True randomization ensures every sigil is a unique chaotic creation.</li>
                <li><strong>Visual Flash Ritual:</strong> Seal your sigil with a one-click gnostic burst.</li>
            </ul>
            
            <p>Download the <strong>Magick Chaos Sigil Generator</strong> now and encode your Will into reality.</p>
        `
    },
    {
        id: "unofficial-rider-waite-tarot",
        name: "Unofficial Rider Waite Tarot",
        price: "$9.99 USD",
        url: "https://play.google.com/store/apps/details?id=com.cha0smagick.unofficialraiderwaite",
        status: "available",
        description: "Full Rider-Waite deck offline with 6 spreads, encyclopedia, and 7-language support.",
        image: "assets/images/tarotbutton.webp",
        seo: {
            title: "Unofficial Rider Waite Tarot | Offline Tarot Reader & Encyclopedia App",
            description: "Full Rider-Waite tarot deck offline. 6 spreads, upright & reversed meanings, searchable encyclopedia, and 7 languages. The most complete tarot app for Android.",
            keywords: "rider waite tarot, tarot app, offline tarot, tarot reader, tarot encyclopedia, tarot spreads, celtic cross, divination app, tarot learning, tarot reading app, buy esoteric, android occult app"
        },
        screenshots: [
            "../assets/images/ta1.png",
            "../assets/images/ta2.png",
            "../assets/images/ta3.png"
        ],
        detailedDescription: `
            <h3>The Full Rider-Waite Tarot in Your Pocket—No Internet, No Ads, No Distractions.</h3>
            <p>The <strong>Unofficial Rider Waite Tarot</strong> brings every card, every symbol, and every spread to your device in a premium, offline experience designed for deep contemplation.</p>
            
            <h4>Complete Deck, Complete Wisdom</h4>
            <ul>
                <li><strong>Full 78-Card Rider-Waite Deck:</strong> Major Arcana and four suits.</li>
                <li><strong>Upright & Reversed Meanings:</strong> Detailed interpretations for every card.</li>
                <li><strong>6 Professional Spreads:</strong> Card of the Day, Past-Present-Future, Celtic Cross, and more.</li>
                <li><strong>Searchable Encyclopedia:</strong> Built-in tarot reference with cross-referenced symbolism.</li>
                <li><strong>Reading History:</strong> Every reading is saved locally.</li>
            </ul>
            
            <h4>Available in 7 Languages</h4>
            <p>English, Spanish, French, German, Italian, Hindi, and Chinese.</p>
            
            <p>Download the <strong>Unofficial Rider Waite Tarot</strong> now and begin your mindful tarot practice.</p>
        `
    },
    {
        id: "dream-machine",
        name: "Dream Machine: Lucid Dreaming",
        price: "$3.99 USD",
        url: "https://play.google.com/store/apps/details?id=com.cha0smagick.dreammachine",
        status: "available",
        description: "Master the art of lucid dreaming with induction protocols, dream journal, reality checks, and binaural beats.",
        image: "assets/images/lucid.webp",
        seo: {
            title: "Dream Machine: Lucid Dreaming App | Induction, Journal & Reality Checks",
            description: "Train your mind to wake within the dream. Lucid dreaming induction, dream journal, reality checks, binaural beats and MILD/WILD techniques. Download the ultimate lucid dream app for Android.",
            keywords: "lucid dreaming, dream machine, lucid dream app, dream journal, reality checks, binaural beats, dream induction, MILD technique, WILD technique, astral projection, oneironautics, dream recall, buy esoteric, chaos magick app, android occult app, cybermancy, dream magic"
        },
        screenshots: [],
        detailedDescription: `
            <h3>What If You Could Wake Up Inside Your Dreams Tonight?</h3>
            <p><strong>Dream Machine: Lucid Dreaming</strong> gives you the keys to the cockpit of your own subconscious. This is a complete lucid dreaming training system designed to take you from zero to fully conscious dreamer.</p>
            
            <h4>Key Features for the Conscious Dreamer</h4>
            <ul>
                <li><strong>Intelligent Dream Journal:</strong> Log your dreams with a clean, fast interface.</li>
                <li><strong>Reality Check Drills:</strong> Customizable reality checks with random vibration prompts.</li>
                <li><strong>Binaural Beats & Isochronic Tones:</strong> Scientifically calibrated frequencies for REM induction.</li>
                <li><strong>MILD & WILD Induction Protocols:</strong> Step-by-step guides for the two most effective techniques.</li>
                <li><strong>Dream Statistics & Analytics:</strong> Track your lucidity rate over time.</li>
            </ul>
            
            <h4>Lucid Dreaming for Chaos Magicians</h4>
            <p>In Chaos Magick, the dream state is a primary vector for sigil firing, servitor communication, and astral temple work.</p>
            
            <p>Download <strong>Dream Machine: Lucid Dreaming</strong> now and take the reins of your night.</p>
        `
    },
    {
        id: "astral-lab",
        name: "Astral Lab: Natal Chart & Astrology",
        price: "$3.99 USD",
        url: "https://play.google.com/store/apps/details?id=com.cha0smagicklabs.astralchart",
        status: "available",
        description: "Professional natal charts, real-time transits & aspect grids — 100% offline with scientific-grade VSOP87/ELP-2000 precision.",
        image: "assets/images/astrallab.png",
        seo: {
            title: "Astral Lab | Natal Chart & Astrology App for Android — Offline, Private & Precise",
            description: "Generate professional natal charts with Astral Lab. Scientific-grade VSOP87 precision, real-time transits, aspect grids & unlimited profiles. 100% offline, zero tracking. Buy now.",
            keywords: "natal chart app, astrology app android, birth chart calculator, astral lab, horoscope app, transit tracker, aspect grid, offline astrology, private astrology, VSOP87, ELP-2000, professional astrology tool, natal chart generator, buy astrology app, chaos magick astrology"
        },
        screenshots: [],
        detailedDescription: `
            <h3>Looking for Scientific Rigor and Total Privacy in Your Astrological Work?</h3>
            <p><strong>Astral Lab</strong> is a powerful natal chart and astrology tool designed for professional astrologers and serious enthusiasts who refuse to compromise on precision. Unlike other astrology apps, Astral Lab runs <strong>100% offline</strong>. All complex mathematical calculations are performed directly on your device, ensuring that the sovereignty of your data is always our highest priority.</p>
            
            <h4>Why Choose Astral Lab?</h4>
            <ul>
                <li><strong>Absolute Privacy (Offline):</strong> The app requires zero internet permission. Your birth data, location, and saved profiles never leave your phone. No tracking, no telemetry, no external servers.</li>
                <li><strong>Scientific Precision:</strong> Powered by the high-accuracy VSOP87 and ELP-2000 algorithms. We guarantee planetary positions that match NASA ephemerides perfectly.</li>
                <li><strong>One-Time Purchase:</strong> No monthly subscriptions or hidden fees. Astral Lab is a single purchase, completely ad-free, with all premium features unlocked from day one.</li>
                <li><strong>Modern Material 3 Interface:</strong> Enjoy a premium, fluid user experience with smooth navigation, dynamic dark mode, and crisp visual aspect grids.</li>
            </ul>
            
            <h4>Key Features</h4>
            <ul>
                <li><strong>Instant Natal Charts:</strong> Detailed, high-precision natal chart calculations for any date, time, and geographic location.</li>
                <li><strong>Real-Time Transits:</strong> Track current planetary movements and easily overlay them on any natal chart.</li>
                <li><strong>Global Offline Database:</strong> Access thousands of cities worldwide with accurate historical timezone data — no GPS or mobile data required.</li>
                <li><strong>Advanced Aspect Grids:</strong> Complete, intuitive analysis of planetary relationships and angular distances.</li>
                <li><strong>Custom Profile Management:</strong> Save, organize, and manage unlimited natal charts for family, friends, or clients.</li>
            </ul>
            
            <h4>Designed for Professionals on the Move</h4>
            <p>Built for global users, Western astrologers, and mobile professionals who need a reliable, high-quality astrology and horoscope tool that works offline. It is perfect for remote areas, frequent travelers, or maintaining complete client confidentiality during consultations.</p>
            
            <p><strong>Take full control of your astrological work with a professional tool that respects your privacy, your time, and your data. Download Astral Lab today!</strong></p>
        `
    }
];

const booksData = [
    {
        id: "manual-activacion-servidores-magicos-pdf",
        name: "Magical Servitors Manual",
        price: "$3.99 USD (60% off)",
        hotmartLink: "https://pay.hotmart.com/D104270399P?checkoutMode=2",
        image: "assets/images/servidores.png",
        description: "Learn how to create and activate magical servitors with Chaos Magick.",
        seo: {
            title: "Magical Servitors Manual: Activation and Design Guide | Chaos Magick PDF",
            description: "Learn how to create and activate magical servitors with Chaos Magick. Practical guide by Frater Alekos. Download the PDF here. Buy esoteric books online.",
            keywords: "magical servitors, chaos magick, thought forms, egregores, sigil magic, practical occultism, frater alekos, buy esoteric books, chaos magick pdf, digital grimoire"
        },
        detailedDescription: `
            <h3>Magical Servitors: The Ultimate Manual for Creation and Activation</h3>
            <p>Looking for an effective way to influence your reality without obsolete rituals? Chaos Magick offers the most powerful tool of modern esotericism: magical servitors.</p>
            <p>This book by Frater Alekos focuses on activation technology, ensuring your creations have the necessary energy to function autonomously and safely.</p>
            
            <h4>Featured Content</h4>
            <ul>
                <li><strong>Sigil and Servitor Design:</strong> How to structure intention and physical form.</li>
                <li><strong>Activation Methods in Gnosis:</strong> Techniques to charge your entities with pure will.</li>
                <li><strong>Maintenance and Feeding:</strong> How to prevent a servitor from depleting or becoming unstable.</li>
                <li><strong>Difference between Servitors and Egregores:</strong> Understand the hierarchy of thought forms.</li>
            </ul>
            
            <p>Don't limit yourself to interpreting the future. Acquire your copy today.</p>
        `
    },
    {
        id: "tratado-runas-cazadoras-caos-pdf",
        name: "Treatise of Chaos Hunter Runes",
        price: "$3.99 USD (80% off)",
        hotmartLink: "https://pay.hotmart.com/F104270966V?checkoutMode=2",
        image: "assets/images/runascazadoras.png",
        description: "A disruptive magical system designed by Zener of Cydonia and Frater Alekos. The Alphabet of Desire for the New Age.",
        seo: {
            title: "Chaos Hunter Runes Treatise: The Alphabet of Desire | PDF",
            description: "Discover the Chaos Hunter Runes, a disruptive magical system by Zener of Cydonia. Master the 64 runic servitors and the Magic Chess Matrix. Buy esoteric books and chaos magick PDF.",
            keywords: "chaos hunter runes, chaos magick, runic system, zener of cydonia, oracular system, alphabet of desire, magic chess, buy esoteric books, chaos magick pdf, digital grimoire"
        },
        detailedDescription: `
            <h3>Treatise of Chaos Hunter Runes: The Alphabet of Desire for the New Age</h3>
            <p>The <strong>Treatise of Chaos Hunter Runes</strong> is not simply another book on divination; it is the presentation of a disruptive magical system, designed from scratch by <strong>Zener of Cydonia</strong> and edited by <strong>Frater Alekos</strong>.</p>
            
            <h4>What makes this system unique?</h4>
            <ul>
                <li><strong>The Magic Chess Matrix:</strong> Uses the strategic structure of chess to organize its 64 runic servitors.</li>
                <li><strong>64 Pre-determined Servitors:</strong> The book functions as a grimoire of entities ready to be used.</li>
                <li><strong>Cultural Synchronism:</strong> Integrates pre-Hispanic figures and ancient totems.</li>
                <li><strong>Real Activation Practice:</strong> Includes detailed methods for physical creation and charging.</li>
            </ul>
            
            <p>Acquire your copy today and start hunting your own results.</p>
        `
    },
    {
        id: "ouija-cazadora-pdf",
        name: "Ouija Cazadora: Chaos Magic Guide",
        price: "$3.99 USD (60% off)",
        hotmartLink: "https://pay.hotmart.com/B104271332D?checkoutMode=2",
        image: "assets/images/ouijacazadora.png",
        description: "A profound exploration of psychic technology designed to transform the Ouija board into a high-precision ritual instrument.",
        seo: {
            title: "Ouija Cazadora: Chaos Magic Guide to the Oracular Manual | PDF",
            description: "Master the ouija board with Chaos Magic. A practical guide by Zener de Cydonia and Frater Alekos for safe and effective rituals. Download the oracular manual PDF. Buy esoteric books.",
            keywords: "ouija board, chaos magic, zener de cydonia, oracular manual, spirit board, divination, safe ritual, buy esoteric books, chaos magick pdf, digital grimoire"
        },
        detailedDescription: `
            <h3>Ouija Cazadora: A Chaos Magic Guide to the Oracular Manual</h3>
            <p><strong>Ouija Cazadora</strong> is not just a manual; it is a profound exploration of psychic technology designed to transform the Ouija board from a "parlor game" into a high-precision ritual instrument.</p>
            
            <h4>What will you discover?</h4>
            <ul>
                <li><strong>The Science of the Oracle:</strong> Historical roots and psychological mechanisms of the Ouija.</li>
                <li><strong>The Shadow Grimoire:</strong> Specific rituals to open and close sessions safely.</li>
                <li><strong>Chaos Correspondence Systems:</strong> Phoenician, Germanic Futhark, and Theban runes.</li>
                <li><strong>Numerical Divination:</strong> Chinese and numerological perspectives for precision readings.</li>
                <li><strong>Construction & Protection:</strong> How to create your own board and cleanse the space.</li>
            </ul>
            
            <p>Master the board. Command the spirits. Own your reality.</p>
        `
    },
    {
        id: "liber-lvpinux-pdf",
        name: "Liber Lvpinux: Lycanthropic Path",
        price: "$3.99 USD (90% off)",
        hotmartLink: "https://pay.hotmart.com/O104271155J?checkoutMode=2",
        image: "assets/images/liber.png",
        description: "An operative and esoteric guide exploring lycanthropy as a path of spiritual empowerment and psychic metamorphosis.",
        seo: {
            title: "Liber Lvpinux: Lycanthropic Transformation and Chaos Magic | PDF",
            description: "Discover Liber Lvpinux by Frater Alekos. A grimoire on lycanthropy, chaos magic and the path of the animagus. Download the PDF guide. Buy esoteric books and digital grimoires.",
            keywords: "liber lvpinux, lycanthropy, chaos magic, frater alekos, animagus, spiritual transformation, left hand path, grimoire, buy esoteric books, chaos magick pdf, digital grimoire"
        },
        detailedDescription: `
            <h3>Liber Lvpinux: The Path of Lycanthropic Transformation and Chaos Magic</h3>
            <p><strong>Liber Lvpinux</strong> is much more than a treatise on mythology; it is an operative and esoteric guide that explores lycanthropy not as a curse, but as a path of spiritual empowerment and psychic metamorphosis.</p>
            
            <h4>What secrets does Liber Lvpinux reveal?</h4>
            <ul>
                <li><strong>Occult Foundations:</strong> Magical bases allowing connection with the wolf archetype.</li>
                <li><strong>Global Perspective:</strong> Lycanthropy in world cultures from Palo Mayombe to European legends.</li>
                <li><strong>The Way of the Animagus:</strong> Reclaiming instinctive power and absolute freedom.</li>
                <li><strong>Transformation Rituals:</strong> Arcane elixirs, chants of reversal, and obsidian mirror work.</li>
                <li><strong>Nganga Management:</strong> Connection with cosmic powers and spirits.</li>
            </ul>
            
            <p>Are you ready to unleash the inner beast? Acquire Liber Lvpinux and master the art of transformation.</p>
        `
    }
];

// ===== HELPER FUNCTIONS =====

function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/**
 * Build a <picture> element with WebP source + PNG fallback.
 * If src is already .png, returns a plain <img> (no WebP source).
 * @param {string} src - Relative image path (e.g. "assets/images/zener.webp")
 * @param {string} alt - Alt text
 * @param {string} className - CSS class
 * @param {number|string} width - Image width
 * @param {number|string} height - Image height
 * @param {string} loading - loading attribute ("lazy" or "eager")
 * @param {string} [prefix="../"] - Path prefix (default "../")
 * @returns {string} HTML string
 */
function buildPictureHtml(src, alt, className, width, height, loading, prefix = '../') {
    const isWebp = src.endsWith('.webp');
    const fullWebp = prefix + src;
    const fullPng = prefix + (isWebp ? src.replace(/\.webp$/i, '.png') : src);
    const imgTag = `<img src="${fullPng}" alt="${alt}" loading="${loading}" class="${className}" width="${width}" height="${height}">`;
    if (isWebp) {
        return `<picture>\n    <source srcset="${fullWebp}" type="image/webp">\n    ${imgTag}\n</picture>`;
    }
    return imgTag;
}

function buildBreadcrumbSchema(items) {
    return JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": items.map((item, i) => ({
            "@type": "ListItem",
            "position": i + 1,
            "name": item.name,
            "item": item.url
        }))
    }, null, 2);
}

function buildProductSchema(item, itemUrl, imageUrl) {
    const priceMatch = item.price.match(/[\d.]+/);
    const price = priceMatch ? priceMatch[0] : "3.99";
    return JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Product",
        "@id": itemUrl + "#product",
        "name": item.name,
        "description": item.seo.description,
        "image": imageUrl,
        "brand": { "@type": "Brand", "name": "Cha0smagick Labs" },
        "offers": {
            "@type": "Offer",
            "price": price,
            "priceCurrency": "USD",
            "availability": "https://schema.org/InStock",
            "url": item.url || item.hotmartLink
        },
    }, null, 2);
}

function buildSoftwareSchema(item, itemUrl, imageUrl) {
    const priceMatch = item.price.match(/[\d.]+/);
    const price = priceMatch ? priceMatch[0] : "0.00";
    return JSON.stringify({
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "@id": itemUrl + "#softwareapplication",
        "name": item.name,
        "operatingSystem": "Android",
        "applicationCategory": "LifestyleApplication",
        "applicationSubCategory": "Esoteric Application",
        "image": imageUrl,
        "description": item.seo.description,
        "url": item.url,
        "downloadUrl": item.url,
        "softwareVersion": "1.0",
        "offers": {
            "@type": "Offer",
            "price": price,
            "priceCurrency": "USD",
            "availability": "https://schema.org/InStock",
            "url": item.url
        },
        "author": { "@type": "Organization", "name": "Cha0smagick Labs", "url": BASE_URL },
        "publisher": { "@type": "Organization", "name": "Cha0smagick Labs" },
        "requirements": "Android 6.0+"
    }, null, 2);
}

function buildBookSchema(item, itemUrl, imageUrl) {
    const priceMatch = item.price.match(/[\d.]+/);
    const price = priceMatch ? priceMatch[0] : "3.99";
    return JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Book",
        "@id": itemUrl,
        "name": item.name,
        "description": item.seo.description,
        "image": imageUrl,
        "url": itemUrl,
        "inLanguage": "es",
        "bookFormat": "https://schema.org/EBook",
        "offers": {
            "@type": "Offer",
            "url": item.hotmartLink,
            "price": price,
            "priceCurrency": "USD",
            "availability": "https://schema.org/InStock"
        }
    }, null, 2);
}

function buildAlsoLikeSection(currentId, items) {
    const others = items.filter(a => a.id !== currentId).slice(0, 3);
    if (others.length === 0) return '';
    
    const cards = others.map(app => {
        const priceShort = app.price.replace(/\sUSD.*$/, '').replace(/\(.*?\)/, '').trim();
        return `
            <a href="${app.id}.html" class="app-card">
                <div class="card-image-wrapper">
                    ${buildPictureHtml(app.image, app.name, 'app-image', 300, 220, 'lazy')}
                </div>
                <div class="card-content">
                    <h4>${app.name}</h4>
                    <p>${app.description.replace(/<[^>]*>/g, '').substring(0, 120)}...</p>
                    <div class="card-footer">
                        <div class="status-container">
                            <span class="status-indicator ${app.status}"></span>
                            <span class="status-text">${app.status === 'available' ? 'Available' : 'Coming Soon'}</span>
                        </div>
                        <span class="card-price">${app.price}</span>
                    </div>
                    <span class="cta-button primary google-play-btn" style="display:block;text-align:center;margin-top:1rem;">Buy Now ${priceShort}</span>
                </div>
            </a>
        `;
    }).join('');

    return `
    <section id="also-like-section" style="max-width:1000px;margin:3rem auto;padding:0 2rem;">
        <h2 style="color:#e0e0e0;font-family:'JetBrains Mono',monospace;text-transform:uppercase;letter-spacing:2px;font-size:1.3rem;margin-bottom:2rem;text-align:center;">You May Also Like</h2>
        <div class="apps-grid">${cards}</div>
    </section>`;
}

function buildMapData() {
    // This is the visitor data from index.html
    return [
        [34.0584, -118.2780, 130, 'Los Angeles, US'],
        [3.4372, -76.5225, 89, 'Santiago de Cali, Colombia'],
        [37.4043, -122.0748, 76, 'Mountain View, US'],
        [37.7510, -97.8220, 73, 'United States'],
        [51.2993, 9.4910, 69, 'Germany'],
        [51.4964, -0.1224, 61, 'United Kingdom'],
        [52.5155, 13.4062, 41, 'Berlin, Germany'],
        [13.0878, 80.2785, 34, 'Chennai, India'],
        [40.4172, -3.6840, 28, 'Spain'],
        [55.7123, 12.0564, 28, 'Denmark'],
        [53.2851, -6.3713, 25, 'Dublin, Ireland'],
        [60.0000, -95.0000, 17, 'Canada'],
        [36.6865, -6.1361, 14, 'Jerez de la Frontera, Spain'],
        [52.3824, 4.8995, 14, 'Netherlands'],
        [54.6816, 25.3225, 11, 'Vilnius, Lithuania'],
        [38.7057, -9.1359, 9, 'Portugal'],
        [35.6980, 51.4115, 9, 'Iran'],
        [50.0833, 16.7667, 9, 'Czechia'],
        [23.0000, -102.0000, 9, 'Mexico'],
        [51.5077, -0.1190, 8, 'London, UK'],
        [42.8333, 12.8333, 8, 'Italy'],
        [37.3824, -5.9761, 8, 'Seville, Spain'],
        [46.4355, 30.4104, 7, 'Ukraine'],
        [52.3759, 4.8975, 6, 'Amsterdam, Netherlands'],
        [50.8509, 4.3447, 6, 'Belgium'],
        [4.6358, -73.4664, 6, 'La Mesa, Colombia'],
        [40.7876, -74.0600, 6, 'Secaucus, US'],
        [19.3837, -99.1757, 5, 'Mexico City, Mexico'],
        [49.6850, 11.4150, 5, 'Betzenstein, Germany'],
        [-27.0000, 133.0000, 4, 'Australia'],
        [44.8166, 20.4721, 4, 'Belgrade, Serbia'],
        [40.4165, -3.7026, 3, 'Madrid, Spain'],
        [53.4663, -2.1342, 3, 'Manchester, UK'],
        [25.0000, 45.0000, 2, 'Saudi Arabia'],
        [1.3248, 103.8566, 2, 'Singapore'],
        [-34.0000, -64.0000, 2, 'Argentina'],
        [41.0214, 28.9948, 2, 'Turkey'],
        [-34.8272, -58.3956, 2, 'Florencio Varela, Argentina'],
        [-33.7967, -59.5208, 1, 'Baradero, Argentina'],
        [-29.0000, 24.0000, 1, 'South Africa'],
        [18.4667, -69.9000, 1, 'Santo Domingo, Dominican Rep.'],
        [-4.3000, 15.3000, 1, 'Kinshasa, DR Congo'],
        [47.4984, 19.0404, 1, 'Budapest, Hungary'],
        [45.8293, 15.9793, 1, 'Zagreb, Croatia'],
        [-21.9065, -47.8747, 1, 'Sao Carlos, Brazil'],
        [14.6328, -90.5199, 1, 'Guatemala City'],
        [-10.3383, -62.8954, 1, 'Cacaulandia, Brazil'],
        [-30.1146, -51.1639, 1, 'Porto Alegre, Brazil'],
        [-36.8506, 174.7679, 1, 'Auckland, New Zealand'],
        [-6.1750, 106.8286, 1, 'Indonesia'],
        [45.4643, 9.1895, 1, 'Milan, Italy'],
        [-10.0000, -55.0000, 1, 'Brazil'],
        [55.8822, 26.5268, 1, 'Latvia'],
        [52.2394, 21.0362, 1, 'Poland'],
        [59.3247, 18.0560, 1, 'Sweden'],
        [33.8740, 35.5089, 1, 'Beirut, Lebanon'],
        [37.5647, 15.0631, 1, 'Gravina di Catania, Italy'],
        [43.6426, -79.4002, 1, 'Toronto, Canada']
    ];
}

function generatePage(item, type) {
    const itemUrl = `${BASE_URL}/apps/${item.id}.html`;
    const cleanImage = item.image.replace('../', '');
    const absoluteImageUrl = `${BASE_URL}/${cleanImage}`;
    
    const isBook = type === 'book';
    const isNew = item.id === 'psi-gym' || item.id === 'dream-machine' || item.id === 'astral-lab';
    
    // Screenshots (only for apps)
    let screenshotsHtml = '';
    if (item.screenshots && item.screenshots.length > 0 && !isBook) {
        const imgs = item.screenshots.map(src =>
            `<img src="${src.replace('../', '../')}" alt="${item.name} screenshot" loading="lazy" class="screenshot-item">`
        ).join('');
        screenshotsHtml = `
            <div class="screenshot-gallery">
                <div class="screenshot-grid">${imgs}</div>
            </div>`;
    }
    
    // Action button
    let actionButton = '';
    if (isBook) {
        actionButton = `<a href="${item.hotmartLink}" class="hotmart-fb hotmart__button-checkout" target="_blank"><img src="https://static.hotmart.com/img/btn-buy-green.png" alt="Buy on Hotmart"></a>`;
    } else {
        const priceShort = item.price.replace(/\sUSD.*$/, '').replace(/\(.*?\)/, '').trim();
        actionButton = `<a href="${item.url}" class="cta-button primary" target="_blank">Buy Now ${priceShort}</a>`;
        if (item.onlineUrl) {
            actionButton += ` <a href="${item.onlineUrl}" class="cta-button secondary" target="_blank" style="margin-left:10px;">Try Free Online</a>`;
        }
    }
    
    const centeredActionButton = `<div class="cta-centered-wrapper">${actionButton}</div>`;
    
    // Schema.org (each schema in its own script tag)
    const breadcrumbSchema = buildBreadcrumbSchema([
        { name: "Home", url: BASE_URL + "/" },
        { name: item.name, url: itemUrl }
    ]);
    
    let schemaTags = `<script type="application/ld+json">\n${breadcrumbSchema}\n</script>`;
    if (isBook) {
        schemaTags += `\n    <script type="application/ld+json">\n${buildBookSchema(item, itemUrl, absoluteImageUrl)}\n</script>`;
    } else {
        schemaTags += `\n    <script type="application/ld+json">\n${buildSoftwareSchema(item, itemUrl, absoluteImageUrl)}\n</script>`;
        schemaTags += `\n    <script type="application/ld+json">\n${buildProductSchema(item, itemUrl, absoluteImageUrl)}\n</script>`;
    }
    
    // Also-like section
    const alsoLikeHtml = buildAlsoLikeSection(item.id, appsData);
    
    // Detailed description
    const fullDescription = item.detailedDescription || '';
    
    // Build the page
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="theme-color" content="#050505">
    <meta name="robots" content="index, follow">
    <meta name="author" content="Cha0smagick Labs - Frater Alek0s">
    
    <title>${escapeHtml(item.seo.title)}</title>
    <meta name="description" content="${escapeHtml(item.seo.description.length > 160 ? item.seo.description.substring(0, 157) + '...' : item.seo.description)}">
    <meta name="keywords" content="${escapeHtml(item.seo.keywords)}">
    <link rel="canonical" href="${itemUrl}">
    
    <link rel="alternate" href="${itemUrl}" hreflang="en" />
    <link rel="alternate" href="${itemUrl}" hreflang="x-default" />
    
    <meta property="og:title" content="${escapeHtml(item.seo.title)}">
    <meta property="og:description" content="${escapeHtml(item.seo.description)}">
    <meta property="og:image" content="${absoluteImageUrl}">
    <meta property="og:url" content="${itemUrl}">
    <meta property="og:type" content="${isBook ? 'book' : 'website'}">
    <meta property="og:locale" content="en_US">
    <meta property="og:site_name" content="Cha0smagick Labs">
    
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${escapeHtml(item.seo.title)}">
    <meta name="twitter:description" content="${escapeHtml(item.seo.description)}">
    <meta name="twitter:image" content="${absoluteImageUrl}">
    
    <link rel="icon" type="image/x-icon" href="../assets/favicon.ico">
    <link rel="apple-touch-icon" href="../assets/images/Banner.png">
    <link rel="manifest" href="../manifest.json">
    
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="preconnect" href="https://unpkg.com" crossorigin>
    <link rel="preconnect" href="https://www.googletagmanager.com" crossorigin>
    <link rel="preconnect" href="https://*.basemaps.cartocdn.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
    
    <link rel="stylesheet" href="../css/style.css">
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" crossorigin="">
    
    <script async src="https://www.googletagmanager.com/gtag/js?id=${GA_ID}"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${GA_ID}');
    </script>
    
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" crossorigin=""></script>
    
    ${schemaTags}
</head>
<body>
    <header>
        <a href="../index.html" style="text-decoration:none;color:inherit;">
            <h1>Cha0smagick Labs</h1>
            <p>Cybermancy • Techno-Sorcery • Cyberpaganism</p>
        </a>
    </header>
    
    <nav aria-label="Main navigation">
        <ul>
            <li><a href="../index.html">Home</a></li>
            <li><a href="../index.html#about">About Us</a></li>
            <li><a href="../index.html#products">Apps & Services</a></li>
            <li><a href="../index.html#books-section">Books</a></li>
            <li><a href="../index.html#contact">Contact</a></li>
        </ul>
    </nav>
    
    <main>
        <section class="app-details">
            <div class="detail-header-layout">
                ${buildPictureHtml(cleanImage, escapeHtml(item.name), 'detail-main-image', 120, 120, 'eager')}
                <div class="detail-header-info">
                    <h2>${item.name}${isNew ? ' <span class="discount-badge">NEW!</span>' : ''}</h2>
                    <p class="lead-text">${item.description}</p>
                    <div class="detail-price">${item.price}</div>
                </div>
            </div>
            ${centeredActionButton}
            ${screenshotsHtml}
        </section>
        
        <section class="app-detailed-info" id="app-detailed-info">
            ${fullDescription}
            ${centeredActionButton}
        </section>
        
        ${alsoLikeHtml}
    </main>
    
    <footer>
        <div class="footer-parallel-container">
            <div class="footer-left-side">
                <div class="map-wrapper" id="map-wrapper">
                    <div id="visitor-map" class="visitor-leaflet-map"></div>
                </div>
                <div class="visitor-counter">
                    <span class="counter-label">Number of Ascended Ones:</span>
                    <span id="visitor-count" class="counter-value">000000</span>
                </div>
            </div>
            <div class="footer-right-side">
                <div class="footer-content">
                    <div class="footer-links">
                        <h4>Cha0smagick Labs</h4>
                        <ul>
                            <li><a href="https://magiadelcaospractica.com">Official Blog</a></li>
                            <li><a href="https://cha0smagicklabs.blogspot.com/">Privacy & Legal</a></li>
                            <li><a href="https://play.google.com/store/apps/dev?id=5224914033326414083">Google Play Developer</a></li>
                        </ul>
                    </div>
                    <div class="footer-social">
                        <h4>Community</h4>
                        <ul>
                            <li><a href="https://t.me/magiacaotica" target="_blank">Telegram</a></li>
                            <li><a href="https://www.youtube.com/channel/UCglU9np0SqGcnrCMLyVOqKA" target="_blank">YouTube</a></li>
                            <li><a href="https://www.instagram.com/cha0smagick.labs/" target="_blank">Instagram</a></li>
                            <li><a href="https://discord.gg/6vNSCaPgPd" target="_blank">Discord</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <p>&copy; 2026 Cha0smagick Labs. All rights reserved. Designed with digital magic.</p>
    </footer>
    
    <script src="../js/app-render.js"></script>
    <script>
    // Service Worker registration
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
            navigator.serviceWorker.register('../sw.js');
        });
    }
    
    // Initialize visitor counter
    document.addEventListener('DOMContentLoaded', function() {
        var el = document.getElementById('visitor-count');
        if (el) {
            var count = localStorage.getItem('chaos_visit_count_v2');
            if (!count) count = 1;
            else count = parseInt(count) + 1;
            localStorage.setItem('chaos_visit_count_v2', count);
            el.textContent = count.toString().padStart(6, '0');
        }
    });
    
    // Leaflet map
    document.addEventListener('DOMContentLoaded', function() {
        var mapEl = document.getElementById('visitor-map');
        if (!mapEl || typeof L === 'undefined') return;
        
        var tileUrl = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
        var tileAttr = '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>';
        
        var map = L.map('visitor-map', {
            center: [20, 0],
            zoom: 1,
            zoomControl: true,
            scrollWheelZoom: true,
            dragging: true,
            doubleClickZoom: false,
            touchZoom: true,
            keyboard: false,
            attributionControl: true,
            worldCopyJump: true
        });
        
        L.tileLayer(tileUrl, { attribution: tileAttr, maxZoom: 8, minZoom: 1 }).addTo(map);
        
        var visitors = ${JSON.stringify(buildMapData())};
        var maxVisits = 130;
        
        visitors.forEach(function(v) {
            var lat = v[0], lng = v[1], visits = v[2], loc = v[3];
            var radius = 3 + (visits / maxVisits) * 10;
            var opacity = 0.4 + (visits / maxVisits) * 0.6;
            L.circleMarker([lat, lng], {
                radius: radius,
                fillColor: '#ff4444', color: '#ff4444', weight: 1,
                fillOpacity: opacity, opacity: 0.8
            }).bindTooltip(loc + ' — ' + visits + ' visits', {
                direction: 'top', offset: [0, -radius], className: 'visitor-tooltip'
            }).addTo(map);
        });
        
        setTimeout(function() { map.invalidateSize(); }, 500);
        window.addEventListener('resize', function() { map.invalidateSize(); });
    });
    </script>
<div id="google_translate_element" style="position:fixed;bottom:1rem;right:1rem;z-index:9999;"></div>
<script>
function googleTranslateElementInit() {
  new google.translate.TranslateElement({pageLanguage: 'en', layout: google.translate.TranslateElement.InlineLayout.SIMPLE}, 'google_translate_element');
}
</script>
<script src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"></script>
</body>
</html>`;

    return html;
}

// ===== MAIN =====
function main() {
    if (!existsSync(APPS_DIR)) {
        mkdirSync(APPS_DIR, { recursive: true });
    }
    
    let generated = 0;
    
    // Generate app pages
    for (const app of appsData) {
        const html = generatePage(app, 'app');
        const filePath = join(APPS_DIR, `${app.id}.html`);
        writeFileSync(filePath, html, 'utf-8');
        console.log(`  ✓ apps/${app.id}.html`);
        generated++;
    }
    
    // Generate book pages
    for (const book of booksData) {
        const html = generatePage(book, 'book');
        const filePath = join(APPS_DIR, `${book.id}.html`);
        writeFileSync(filePath, html, 'utf-8');
        console.log(`  ✓ apps/${book.id}.html`);
        generated++;
    }
    
    console.log(`\nDone! ${generated} pages generated in apps/`);
}

main();
