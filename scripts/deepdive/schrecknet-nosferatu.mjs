/**
 * deepdive/schrecknet-nosferatu.mjs
 * ---------------------------------------------------------------------------
 * Articulo largo de la pagina tools/schrecknet-nosferatu.html.
 *
 * Postura editorial: esto es un sitio de fandom, no una wiki oficial. El texto
 * no presenta reglas como definitivas cuando varian entre ediciones -la
 * organizacion de clanes y el numero de eles cambian segun la edicion- y
 * en su lugar explica la estructura que el sitio documenta.
 */

export const SCHRECKNET = {
  targets: [
    'vampire the masquerade clan compendium',
    'nosferatu clan disciplines and bane',
    'vampire the masquerade second inquisition',
    'kindred index by clan and generation',
    'prague warren and the network node map',
    'vampire rpg lore for new players',
    'camarilla versus the anarch free states',
    'vampire the masquerade clan powers and weaknesses'
  ],
  sections: [
    {
      h2: 'What SchreckNET is',
      paras: [
        'It is a companion site for Vampire: The Masquerade, and it is dressed as something it is not. The conceit is that you have found a mirror of a network that is mostly dead: eleven nodes still answer, one of them only because its caretaker has not yet been arrested, and nobody maintains the archive any more. Everything in it is presented as recovered material rather than as reference data.',
        'That framing does real work. Lore delivered as testimony reads differently from lore delivered as a wiki entry, and for a setting built on secrecy, secrecy and the difference between what a thing claims and what it does, the delivery is part of the content. The Prague Warren relay has been silent since the fourteenth and is presumed physical. Do not go looking for it.'
      ],
      h3s: [
        {
          h3: 'Access, if you want it',
          text: 'Authentication is a handle and a passphrase. Type guest and press authenticate and you read everything; you are remembered by nobody, which is the whole point of the conceit. Nothing in the content is gated behind anything.'
        }
      ]
    },
    {
      h2: 'What is inside the vampire the masquerade clan compendium',
      paras: [
        'The site is organised the way the network would organise itself, and the structure is the map of what it covers.'
      ],
      table: {
        caption: 'The directories in the network',
        head: ['Directory', 'What it holds'],
        rows: [
          ['Network status', 'A live sweep of nodes, telemetry and the Inquisition alert feed'],
          ['The Clan', 'The Nosferatu disciplines, the rites and the lies told about them'],
          ['Dossiers', 'Kindred who know what the clan is, portraits included'],
          ['Kindred index', 'Every tracked vampire by clan, sect, generation and threat'],
          ['Open sewer', 'Live threads: warnings, contracts, one argument about the Camarilla'],
          ['Field blogs', 'Long entries from nodes that stopped writing'],
          ['Red rooms', 'The part of the network that is not indexed'],
          ['File server', 'Thirty-one documents, protocols, discipline notes, Warren maps'],
          ['Cartography', 'The Prague Warren level by level and the global node map'],
          ['Sewer games', 'Four exercises in tradecraft, one unlocking a clearance badge']
        ]
      },
      h3s: [
        {
          h3: 'Vampire rpg lore for new players',
          text: 'If you are starting a campaign and have not read the sourcebooks, this is a reasonable starting position rather than a replacement for them. The clan pages, the index and the dossiers are written to be useful on their own, and the site says so plainly instead of pretending to be canonical.'
        }
      ]
    },
    {
      h2: 'The nosferatu clan disciplines and bane',
      paras: [
        'The Nosferatu are the clan the network is built for, so their page is the deepest one. Their reputation is the oldest in the game: they predate the Camarilla, they answer to nobody above them, and they came out of the movement that made the Kindred what they became. What follows is the shape of that reputation rather than a rules summary, because the numbers change between editions and a page that pretends otherwise is worse than useless.',
        'Their power set leans heavily on auspex, fortitude, obfuscation, potence and protean, which is to say: see what others cannot, endure what should destroy you, be somewhere else, hit harder than anything your size, and hold the shape you were made in. What defines them socially is the bane - the standing condition attached to being Nosferatu - and to being, in the clan flavour, unwelcome in the places where other Kindred live.',
        'Clan powers and weaknesses are the two things a character is actually built from at the table, and the dossiers are organised around both: what the clan can do, and what standing condition it charges you for doing it.'
      ],
      h3s: [
        {
          h3: 'What a bane does mechanically',
          text: 'A bane is not a penalty to work around; it is the cost that makes the power worth having. Strong clan powers are expensive precisely because the bane keeps them honest. A character whose clan gives them everything and takes nothing is not a vampire, they are a superhero with a thirst, and a table that lets that stand has lost the reason the setting exists.'
        },
        {
          h3: 'The argument about the Camarilla',
          text: 'One of the live threads on the site is about whether the Camarilla still exists as a functioning organisation. That is not a debating-post question. It is the central political fact of the setting, and it is one of the best ways into a campaign: if the sect has stopped coordinating, then every character in it is a private operator with a title and no one enforcing the title.'
        }
      ]
    },
    {
      h2: 'The vampire the masquerade second inquisition',
      paras: [
        'The Second Inquisition is the mechanism by which the sect cleans house: an internal police force whose job is to find vampires who expose the Masquerade, and whose methods are not subtle. In the chronicle framing used here, three cities have entered martial jurisdiction, Sabbat-adjacent packs move in daylight under forged warrants, and four nodes have burned.',
        'This is the single most useful piece of setting pressure for a modern campaign. It is a clock: not everybody can be found, the ones who are found get burned, and the organisations that were supposed to protect anybody have started issuing warrants for people nobody remembers seeing. A chronicle set after this is automatically about people operating without cover.'
      ],
      table: {
        caption: 'Camarilla versus the Anarch Free States, as a playable tension',
        head: ['', 'Camarilla side', 'Anarch side'],
        rows: [
          ['Organisation', 'Hierarchical, with offices and titles', 'Loose, cellular, leaderless'],
          ['Method', 'Law, treaty, ownership of territory', 'Squatting, direct action, squat and take'],
          ['Legitimacy', 'Claims the right to speak for the dead', 'Claims the right to act for the living'],
          ['Weakness', 'Bureaucracy and the Inquisition', 'No infrastructure and no memory']
        ]
      },
      h3s: [
        {
          h3: 'Why the Free States lose and keep not losing',
          text: 'They have no institution, so nothing survives the death of a charismatic person and nothing is inherited cleanly. But they also cannot be infiltrated, because there is nothing to infiltrate. An institution that does not survive its people and a movement that does not need them are the same problem in opposite directions.'
        }
      ]
    },
    {
      h2: 'Kindred index by clan and generation',
      paras: [
        'The index tracks every vampire the network still knows about, ordered by clan, sect, generation and perceived threat, and it includes ghouls and unfinished childer. Generation is the part that matters most for play, because it is a direct measure of how old someone is and therefore of how much they can have survived.',
        'An unfinished childer is a vampire killed before the embrace completed, which means the sire died with an unfinished act and left a mess. It is the most useful entry in the index for a storyteller, because it is a character who exists as an absence: the name is there, the file is there, and nothing is.'
      ]
    },
    {
      h2: 'Cartography: the Prague warren and the network node map',
      paras: [
        'The cartography section maps the Prague Warren level by level and then places every remaining node on a global map, which lets you see the relay topology: which city talks to which, which ones the network still trusts, and which one has been dark since the fourteenth. Vienna being offline is not decoration. It is a hole in the map, and holes in maps are where stories happen.',
        'If you run a chronicle in a city with a real local vampire tradition, this kind of layered mapping is the template. Build the Warren by levels, put your own locations on it, and leave one location unexplained.'
      ]
    },
    {
      h2: 'The field manual, the archives and the sewer games',
      paras: [
        'The file server holds thirty-one documents: protocols, discipline notes, a Warren map of Prague and the surviving record of Vienna. The field manual is linked from the broadcast at the top of the landing page, which is the sort of detail that makes a companion site feel like a place rather than a reference.',
        'The four sewer exercises are tradecraft drills built into the site, usable as a warm-up before a session or as downtime during one, and one of them unlocks a clearance badge. They are the part most likely to be quietly skipped by players who came for the lore, and the part a Keeper will find more useful than the lore.'
      ]
    },
    {
      h2: 'Using a compendium at the table, and what comes after it',
      paras: [
        'The practical way to use a site like this is not to read it and then close the tab. Open it in a second screen and use it the way the material wants to be used: look up a clan when a player is about to invoke a power, look up the index when someone needs a name and a threat level, look up the map when they travel.',
        'If the chronicle turns toward documentation, evidence and fieldwork rather than sect politics, <a href="../apps/noctem-tools.html">NOCTEM</a> is the investigation suite that matches the mood, and <a href="../books/codex-chaoticus-pdf.html">Codex Chaoticus</a> is the written discipline for gathering information and acting on it. For the rest of the shelf, <a href="pentex-werewolf.html">Pentex Industries</a> covers the corporate-horror end and <a href="synthetic-gods.html">The Synthetic Gods</a> the digital one.'
      ]
    }
  ],
  faq: [
    {
      q: 'Do I need the Vampire: The Masquerade books to use this?',
      a: 'No. The clan pages, kindred index and dossiers are written to be useful on their own. The books make it richer, but nothing assumes you have read them, and clan organisation differs between editions anyway.'
    },
    {
      q: 'Is it free, and do I need an account?',
      a: 'It is free. Type guest as the handle and authenticate to read everything. No registration, no email, no payment.'
    },
    {
      q: 'Is this official World of Darkness content?',
      a: 'No. It is an independent fan site. Vampire: The Masquerade and World of Darkness are trademarks of their respective owners; this is not affiliated with or endorsed by them, and no official material is reproduced.'
    },
    {
      q: 'What are the Sewer Games?',
      a: 'Four short exercises in tradecraft built into the site, usable as a warm-up before a session or as downtime during one. One of them unlocks a clearance badge.'
    },
    {
      q: 'How many clans are in the game?',
      a: 'It depends on the edition, and that is exactly the sort of question that makes a fan compendium useful: the site documents the structure without pretending one edition is permanent. Check the rules for the book you are actually using.'
    },
    {
      q: 'Who is the Nosferatu bane for?',
      a: 'Every Nosferatu character, permanently, and it is the cost that pays for what the clan can do. A bane is meant to be a standing inconvenience that shapes how a character lives rather than a punishment you route around.'
    }
  ]
};