/**
 * deepdive/pentex-werewolf.mjs
 * ---------------------------------------------------------------------------
 * Articulo largo de la pagina tools/pentex-werewolf.html.
 *
 * Postura editorial: la informacion sobre el mundo de juego se describe a
 * nivel estructural (que tipo de organizacion es Pentex, que clase de tension
 * produce, como se usa en mesa) y no con estadisticas de clan ni listas de
 * dones, que varian por edicion. Los datos concretos que si se dan -la
 * mision de cinco frases, las cuarenta y una instalaciones, el portal
 * restringido- provienen del propio sitio y se atribuyen a el.
 */

export const PENTEX = {
  targets: [
    'pentex industries werewolf the apocalypse',
    'corporate horror campaign setting',
    'pentex company mission and facilities',
    'the wyrm and the triads in werewolf',
    'pentex restricted portal and metagame',
    'free world of darkness companion sites',
    'werewolf the apocalypse campaign resources'
  ],
  sections: [
    {
      h2: 'Pentex Industries and werewolf the apocalypse',
      paras: [
        'Pentex is the setting’s most useful villain because it is not a monster. It is a century-old materials corporation with a public relations department, a board of directors, forty-one facilities and a careers page, and in a game about a cosmic force eating the world, it is the organisation that keeps that force funded, compliant and deniable.',
        'The site wraps this as a complete in-world corporate presence: a mission statement, a leadership directory, a facilities list, a sustainability page, a newsroom, a recruitment section and a contact form. The corporate voice is maintained throughout, which is the whole technique. Nothing is announced as sinister. Everything is announced as compliance.'
      ],
      h3s: [
        {
          h3: 'The disclaimer is part of the pitch',
          text: 'The site states plainly that it is a work of fiction, and that Pentex, the Aurelian Combine and every person, place and programme named there are inventions for the White Wolf role-playing game Werewolf: The Apocalypse. It also notes that any resemblance to a real company or spill is a failure of imagination rather than an accusation. That disclaimer is doing real work: it lets the site make corporate language specific enough to be funny without pointing it at anyone.'
        }
      ]
    },
    {
      h2: 'Pentex company mission and facilities',
      paras: [
        'The mission is five sentences, unrevised since 2011, and the site gives the reason it is published: nothing to hide about what it says, a great deal to hide about what it means. That is the entire character of the corporation in one editorial decision, and it is worth reading aloud at the table because it sets the tone every other page follows.',
        'The facilities section lists forty-one sites with nine featured. A corporate site that can only show you nine of forty-one is telling you something about priorities, and a Keeper who reads the selection as carefully as the copy will find hooks in the gaps between them.'
      ],
      table: {
        caption: 'What the public record contains',
        head: ['Section', 'What it holds', 'What it is for at the table'],
        rows: [
          ['Group', 'The mission and the corporate story', 'Tone, ideology, what they think they are doing'],
          ['Leadership', 'The full directory of accountable people', 'NPCs your players can actually name'],
          ['Facilities', 'Forty-one sites, nine featured', 'Locations, missions, pressure points'],
          ['Sustainability', 'The environmental record', 'The lies that make the corporation believable'],
          ['Newsroom', 'Recent announcements', 'The public version of any disaster'],
          ['Careers', 'Recruitment for the company', 'Why anyone would join, and what they were told'],
          ['Restricted portal', 'Board material, programme dossiers, personnel records', 'The plot, unavailable to you on purpose']
        ]
      }
    },
    {
      h2: 'The portal you cannot get into is the plot',
      paras: [
        'Everything that matters in this setting is explicitly outside the site. Board material, programme dossiers, personnel records and site reports sit behind a restricted portal that only employees, accredited assessors and counsel can authenticate against. The site tells you the door exists, names what is behind it, and declines to open it.',
        'That is a better structure than most published settings manage, because it hands a group a running contradiction to play with. Your players read the public record. They meet the people in the photograph. Then they find out what those people were actually doing. The gap between the two is not a twist you reserve for later; it is the engine the campaign runs on from the first session.'
      ],
      h3s: [
        {
          h3: 'Pentex restricted portal and metagame',
          text: 'The portal is part of the fiction rather than a paywall, which is why nothing on the site is behind anything. Separately, there is a metagame page for groups who want to run Pentex as something larger than a reference: an ongoing element that persists between sessions rather than a source of names that gets used once.'
        }
      ]
    },
    {
      h2: 'The wyrm and the triads',
      paras: [
        'Underneath the corporate language is the reason the corporation exists. The Wyrm is the cosmic appetite at the centre of Werewolf: the thing that consumes, and the organisations that serve it by encouraging exactly that. The Triads are those organisations, and Pentex is the clearest example of how a Triad can look like a legitimate business from the outside.',
        'This is the structural point that makes the setting work rather than being a monster manual with politics bolted on. Pentex is not evil because it was corrupted; it is evil because it is efficient, and efficiency is what happens when a corporation is optimised against every constraint except the one that says stop. The Werewolf books are about a war between appetites that both claim to be survival, and Pentex is what the winning side looks like when it fills out an environmental report.'
      ],
      table: {
        caption: 'Corporate horror, translated into play',
        head: ['Corporate habit', 'What it means in the fiction'],
        rows: [
          ['Compliance', 'Doing the banned thing under the approved name'],
          ['Externalisation', 'The harm is somebody else’s department'],
          ['Metrics', 'What is measured defines what exists'],
          ['Disclosure', 'The public version is true and incomplete'],
          ['Plausible deniability', 'No single document proves the programme exists']
        ]
      },
      h3s: [
        {
          h3: 'Why campaigns set in corporations work',
          text: 'Because the antagonist has a phone number and an HR department. Werewolves can be fought in a car park; a Pentex programme is fought with an audit, a leak and a lawyer, which means the characters need allies inside the structure rather than only outside it. It converts a fight into an infiltration, and an infiltration is a campaign that generates itself.'
        }
      ]
    },
    {
      h2: 'Using a free world of darkness companion site',
      paras: [
        'The useful way to run this is not to memorise it. Open the mission statement and read it as your players would read it, before your players do. Read the leadership directory and pick three names that would plausibly be in a photograph together. Note which of the forty-one facilities is conspicuously absent from the nine featured, and decide why.',
        'Then run the gap. The moment a player has to choose between the version in the newsroom and the version in a dossier is the moment the campaign stopped being a monster hunt and became a story about institutions.'
      ]
    },
    {
      h2: 'What comes after Pentex on the shelf',
      paras: [
        'The written companion to this territory is <a href="../books/liber-lvpinux-pdf.html">Liber Lvpinus</a>, the lycanthropic path: the same ground in prose, with rules behind it rather than a setting reference in front of it.',
        'For the rest of the free shelf, <a href="schrecknet-nosferatu.html">SchreckNET</a> covers the Nosferatu clan and the Second Inquisition for Vampire: The Masquerade, and <a href="synthetic-gods.html">The Synthetic Gods</a> is a chronicle for Mage: The Ascension set in the 1999 web. If a campaign turns toward documentation and fieldwork rather than corporate politics, <a href="../apps/noctem-tools.html">NOCTEM</a> is the investigation suite that matches.'
      ]
    }
  ],
  faq: [
    {
      q: 'Is Pentex Industries free?',
      a: 'Yes. Every section, including the group pages, leadership, facilities, sustainability, newsroom, careers and the metagame, is browsable at no cost with no account.'
    },
    {
      q: 'Is this official Werewolf content?',
      a: 'No. It is an independent fan site. Pentex, the Aurelian Combine and the people, places and programmes named there are inventions for the White Wolf role-playing game Werewolf: The Apocalypse, and the site carries that disclaimer itself. Werewolf and World of Darkness are trademarks of their respective owners.'
    },
    {
      q: 'Do I need the Werewolf: The Apocalypse core book?',
      a: 'No. The site stands on its own as a setting reference. The core book makes it considerably more useful, but nothing here requires it.'
    },
    {
      q: 'What is behind the restricted portal?',
      a: 'In the fiction, board material, programme dossiers, personnel records and site reports. On the site, nothing: it is described and not implemented. The absence is the point, because it tells a group what the campaign is about.'
    },
    {
      q: 'What is the metagame page?',
      a: 'A section treating Pentex as something larger than a reference, for groups who want the corporation to persist between sessions rather than supply a one-off list of names.'
    },
    {
      q: 'Is the site interface in English?',
      a: 'Yes, the corporate sections are in English.'
    }
  ]
};