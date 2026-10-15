/**
 * deepdive/synthetic-gods.mjs
 * ---------------------------------------------------------------------------
 * Articulo largo de la pagina tools/synthetic-gods.html.
 *
 * El puente editorial de esta pagina es el termino "egregore": un pensamiento
 * sostenido por la atencion colectiva. El juego de rol lo usa para un dios
 * digital; la magia caotica lo usa desde hace un siglo para el mismo
 * mecanismo. Ese solape es honesto - las dos acepciones son la misma idea - y
 * es el gancho honesto hacia el producto.
 *
 * El contenido es un trabajo de fandom con material narrativo original, tal
 * como declara la propia cronica.
 */

export const SYNTHETIC_GODS = {
  targets: [
    'mage the ascension traditions and paradigms',
    'what is an egregore in chaos magick',
    'astrosomas and digital gods',
    'virtual adepts and code magick',
    'encoding a sigil in html and javascript',
    'technocracy new world order coalition mage',
    'egregore warfare and seo as battle magic',
    'geocities and the 1999 web mage the ascension'
  ],
  sections: [
    {
      h2: 'What The Synthetic Gods is',
      paras: [
        'It is a chronicle for Mage: The Ascension set in the early web of the late 1990s, written in the voice of the period it describes. The premise is that the chaotic, unmonitored frontier of Geocities neighbourhoods, IRC channels and newsgroups was a genuine metaphysical space, and that mages there were building something the older Traditions had no vocabulary for.',
        'The chronicle runs in three acts. The first is about encoding intent into code as a sigil. The second is about webrands and forums that accumulate attention until they become egregores, and what happens when those egregores fight. The third is about astrosomas: the threshold a thought-form has to cross to stop being sustained by its community and start being a god in its own right.'
      ],
      h3s: [
        {
          h3: 'Why the 1999 web specifically',
          text: 'Because it was the last period of the internet nobody controlled. The site recreates the aesthetic deliberately -guestbooks, frames, under construction bars, hit counters, web rings- because the setting is not "the internet" in general, it is the specific window in which publishing a page at all was an act with consequences, and in which a crawler indexing you was a genuinely new kind of danger.'
        }
      ]
    },
    {
      h2: 'Mage the Ascension traditions and paradigms',
      paras: [
        'Every mage works from a Paradigm: a conviction about what reality is made of and what therefore counts as changing it. That conviction is not flavour. It determines what a mage is even capable of perceiving as a target, which is why two mages who agree about objective reality can still disagree about whether anything happened.',
        'The Traditions are the organised lineages that carry those Paradigms, and the chronicle includes dossiers on the factions most relevant to the setting. The rest of the nine are worth knowing by name, because a character who belongs to one of them can do things the Virtual Adepts cannot.'
      ],
      table: {
        caption: 'The nine Traditions and their core convictions',
        head: ['Tradition', 'Conviction', 'Sees magic as'],
        rows: [
          ['Hermetic Order', 'The will shapes the world', 'Ritual, will and correspondence'],
          ['Verbena', 'The primal world is alive', 'Ritual, blood and instinct'],
          ['Cult of Ecstasy', 'Reality is reached by leaving it', 'Rapture and altered states'],
          ['Euthanatos', 'Entropy is a cycle, death completes it', 'Death as an act of order'],
          ['Sons of Ether', 'Science is the truest magic', 'Experiment and revelation'],
          ['Virtual Adepts', 'Information is the fabric of the world', 'Code, data and networks'],
          ['Hollow Ones', 'Nothing in the world is what it appears', 'Illusion and the unseen'],
          ['Akathari', 'The world is maintained by balance', 'Order, wards and boundaries'],
          ['Orphans', 'No paradigm, only survival', 'Whatever is at hand']
        ]
      },
      h3s: [
        {
          h3: 'The Technocracy sits on the other side',
          text: 'The opposing faction is the Technocracy, whose New World Order Coalition and its Synthetica subdivisions want to end magic by ending the belief in it. Their method is mundane, not mystical: regulation, documentation, standards and above all measurement, because a thing that is measured and standardised stops being believed to be miraculous. The chronicle writes them as the people who watched, indexed and defined the early web.'
        }
      ]
    },
    {
      h2: 'What is an egregore in chaos magick',
      paras: [
        'An egregore is a thought-form sustained by attention. Not a ghost, not a demon: a shape in the mind that persists because people keep feeding it, and that acquires apparent will once enough people have agreed to feed it for long enough. The word comes from Greek and means a collective idea given form.',
        'Chaos magick has used the concept for a very long time, usually in a sceptical register: an egregore is what happens when a group projects an intention outward and keeps reinforcing it, whether through ritual or through the far cheaper mechanism of a group chat that will not let a question die. The chronicle uses the same word for the same mechanism, one generation earlier and with the internet attached.',
        'The three components are the same in both traditions. There is a vessel: the space that holds it, whether that is a web page, a forum or a temple. There is fuel: the attention, the visits, the belief, the daily return. And there is an anchor: the symbol, the name or the mythos that makes the thing recognisable as itself. Remove any one of the three and the entity does not hold together.'
      ],
      table: {
        caption: 'The components of an egregore in both readings',
        head: ['Component', 'In the chronicle', 'In practical magic'],
        rows: [
          ['Vessel', 'The webring, forum or guestbook', 'The temple, the lodge, the recurring circle'],
          ['Fuel', 'Daily visits and returning readers', 'Ritual attention and repeated assertion'],
          ['Anchor', 'The site itself, its mascot and its mythos', 'The sigil, the name, the shared story'],
          ['Power', 'How strong the attention has become', 'How consistently the intention is sustained'],
          ['Resistance', 'How hard it is to abandon', 'How costly the group finds it to stop']
        ]
      },
      h3s: [
        {
          h3: 'The four phases of cultivation',
          text: 'Seed, Sprout, Bloom, Symbiosis. A group starts privately, becomes reachable, starts acting on its own recognisable habits, and eventually becomes something the members could not stop even if they tried. The chronicle notes what to watch for at each stage, and the warning signs in it are the ones any long-running online community will recognise immediately.'
        }
      ]
    },
    {
      h2: 'Virtual adepts and code magick',
      paras: [
        'The Virtual Adepts hold the conviction that information is not a representation of reality but the substance of it. Under that paradigm, code is not a tool for altering the world; code is the layer of the world being altered. A spell is something you write, and writing it makes it part of the structure.',
        'The chronicle turns that conviction into a working practice by asking a simple question: what happens if you encode a statement of intent the way a sigil encodes one? Remove the vowels. Keep the structural consonants. Draw what remains. And then bury the result where nobody is looking.'
      ],
      h3s: [
        {
          h3: 'Encoding a sigil in html and javascript',
          text: 'Four practical placements, from most visible to least. A hidden div with a style that hides it. A meta tag carrying a correspondence nobody reads. A comment, the classic hiding place. Or a line of JavaScript that assembles the glyph at runtime, so it never exists as plain text anywhere in the source. The chronicle treats this as stealth rather than paranoia, and it is worth reading with the modern caveat that a crawler now indexes far more than it used to.'
        },
        {
          h3: 'The four steps, which are the real thing',
          text: 'Define the intent in a single declarative sentence. Reduce it to essence. Visualise the result. Encode it. Anyone who has read a chaos magick primer will recognise those four steps immediately, which is the strongest possible argument for the bridge between the two traditions: the mechanic is identical, only the medium changed.'
        }
      ]
    },
    {
      h2: 'Egregore warfare and seo as battle magic',
      paras: [
        'The second act treats the web as territory and does not soften the metaphor: territory is finite, and the finite things are bandwidth, attention and search ranking. In that framing, keyword flooding becomes siege warfare, guestbook raids become harassment, hijacking a navigation table becomes a supply-line cut, and a meme crafted to carry a name becomes propaganda.',
        'The defences are the interesting part, because they are mostly ordinary operations done deliberately. Counter-sigils embedded where machines read them. Human guardians who hold administrative access. And the one nobody expects: offline backups of the thing that matters, the member list and the shared lore, on physical media, because a thing that exists in exactly one place is a thing that can be taken.'
      ],
      h3s: [
        {
          h3: 'The last instruction, and it is sound advice',
          text: 'The chronicle ends its webring warfare chapter with three words: grow organic, grow slow, grow real. For a game document written in 1999 about the early web, that is an unusually durable piece of advice about search engines.'
        }
      ]
    },
    {
      h2: 'Astrosomas and digital gods',
      paras: [
        'An astrosoma is what an egregore becomes when it stops depending on the people who made it. The threshold the chronicle sets is deliberately high and deliberately mechanical: a critical mass of genuine daily attention, long enough persistence to be impossible to attribute to a trend, a documented miraculous effect, autonomous behaviour that survives the creators disagreeing with it, and finally self-sustaining fuel that no longer needs donations.',
        'The named astrosomas are the best part of the chapter. The Archivist grants perfect recall in exchange for one forgotten truth per month. The Router grants untraceable connections on condition that you never take the same path twice. The Glitch grants inspiration through error. The Counter grants knowledge of who is watching you, and demands that you witness everything. Each one is a bargain in the classical sense: real power, real condition, and a price that is behavioural rather than financial.'
      ],
      h3s: [
        {
          h3: 'The unfinished example',
          text: 'The chronicle works through a god being born in real time: a domain that must be native to the digital rather than imported from the physical, thirteen mages at minimum, a mirrored temple, a daily liturgy, a three-hour ritual window that only opens on schedule, and a final working that every participant has to roll at once. The example stops at the point where the threshold is nearly crossed, which is a better ending than resolving it.'
        }
      ]
    },
    {
      h2: 'What to read alongside it, and what to take from it',
      paras: [
        'If the chronicle has done its job, you now have a vocabulary for something that was already available to you in practice: the page you visit daily, the thread you keep returning to, the sigil you encode and hide. The written version of that vocabulary is <a href="../books/codex-chaoticus-pdf.html">Codex Chaoticus</a>, and the working version is the <a href="../apps/chaos-sigil-generator.html">Magick Chaos Sigil Generator app</a>, which adds the library, the intent journal and the ritual timer that a chronicle can only describe.',
        'For the same game approached from a completely different angle, <a href="verbo-hecho-codigo.html">The Word Made Code</a> is a Mage campaign in which the reduction of a word to a number is the plot, and <a href="pentex-werewolf.html">Pentex Industries</a> covers the corporate-horror end of the same shelf.'
      ]
    }
  ],
  faq: [
    {
      q: 'Is this official Mage: The Ascension content?',
      a: 'No. It is a fan work written for the Mage: The Ascension 20th Anniversary Edition and compatible with Digital Web 2.0. Mage: The Ascension and World of Darkness are trademarks of their respective owners, no official material is reproduced, and all narrative content is original.'
    },
    {
      q: 'Do I need the Mage books to read the chronicle?',
      a: 'No. Paradigm, Consensus, the Traditions, sigil practice, egregore components and astrosoma thresholds are all explained inside the text. The books make it richer, not necessary.'
    },
    {
      q: 'Is the sigil workshop really interactive?',
      a: 'Yes. Type an intent into the form and the page reduces it to its structural letters and renders five arrangements. It runs locally, with no signup and no account.'
    },
    {
      q: 'What is an egregore?',
      a: 'A thought-form sustained by collective attention. It needs a vessel to live in, fuel in the form of repeated attention, and an anchor such as a symbol or a shared story. The chronicle uses the term for early webrings and forums; chaos magick uses the same term for a group-held intention sustained the same way.'
    },
    {
      q: 'Why does the site look like it was made in 1999?',
      a: 'Deliberately. The aesthetic is recreated with authentic period web techniques because the Digital Web of that period is the setting: unmonitored, anarchic and outside Technocratic reach. The layout is part of the fiction.'
    },
    {
      q: 'Can I use these techniques for real?',
      a: 'The four-step practice of defining, reducing, visualising and encoding is standard sigil practice, and you can do it without leaving the page. For the full cycle including charging, timing and recording, the generator app and the written method cover it.'
    }
  ]
};