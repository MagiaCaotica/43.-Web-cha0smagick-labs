/**
 * deepdive/verbo-hecho-codigo.mjs
 * ---------------------------------------------------------------------------
 * Articulo largo de la pagina tools/verbo-hecho-codigo.html.
 *
 * El puente editorial: el capitulo 2 de la campaña es sobre gematria, que es
 * exactamente la operacion que hace la magia caotica cuando reduce una
 * declaracion de intencion a sus letras estructurales. La conexion no es una
 * metafora forzada, es la misma operacion, y por eso este texto la desarrolla
 * en lugar de mencionarla de pasada.
 *
 * El material de la campaña esta en espanol; esta pagina es la guia en ingles.
 */

export const VERBO_HECHO_CODIGO = {
  targets: [
    'mage the ascension homebrew campaign free',
    'world of darkness campaign in latin america',
    'gematria and sigils in tabletop play',
    'urban fantasy rpg campaign in bogota and sao paulo',
    'mage campaign with bestiary and npc roster',
    'hebrew gematria and chaos magick sigils',
    'how to run a world of darkness campaign',
    'latin american horror roleplaying setting'
  ],
  sections: [
    {
      h2: 'What the campaign is',
      paras: [
        'The Word Made Code is a nine-chapter campaign for Mage: The Ascension, set in contemporary Iberoamerica rather than in the usual North American cities. Its premise is a singularity: YHWH, a god made of numbers, is about to be born, and three powerful factions are fighting over who gets to be its father, its midwife or its executioner.',
        'In the middle are the People of the Network - awakened mages who hear the countdown in every transaction, every prayer and every piece of data. The site’s own description of the tone is worth quoting in spirit: no clean sides, only decisions that carry weight, and one night when the Word stops being code and becomes flesh.',
        'What makes it interesting for a group is that it is a consulting site rather than a purchase. Everything - chapters, bestiary, roster, characters - is readable while you play, which is how a campaign reference is supposed to work and how most published ones do not.'
      ]
    },
    {
      h2: 'The nine chapters of the campaign',
      paras: [
        'The structure is a reading order rather than a scenario list, and the nine chapters take a chronicle from premise to playable material.'
      ],
      table: {
        caption: 'Chapter order and what each one gives the group',
        head: ['Chapter', 'Content', 'Use at the table'],
        rows: [
          ['1. The Word Made Code', 'The thesis of the number and the scale of the Descent', 'The premise, in one session'],
          ['2. The Alphabet of God', 'Hebrew gematria across the three systems', 'Deep lore, and the campaign’s engine'],
          ['3. The Geography of the Name', 'Sacred geography of Iberoamerica, coded streets and markets', 'Setting the map before play'],
          ['4. The Masters of the Birth', 'Factions and traditions competing for control', 'Choosing sides, or refusing to'],
          ['5. The People of the Network', 'Mentors, allies, antagonists and the hidden faces', 'NPC material'],
          ['6. Seven Boards, One Birth', 'Seven city nodes with full session structures', 'Running the campaign'],
          ['7. Play and Magic Opportunities', 'Routes, costed rituals, gematria, Network Potencies', 'Rules the group needs mid-session'],
          ['8. Appendices', 'Glossary, encoded bibliography, condensed GM rules', 'Reference at speed'],
          ['9. The Background Network', 'The hidden network, the chaos mages of São Paulo, intimate characters', 'The edge that turns a chronicle into yours']
        ]
      },
      h3s: [
        {
          h3: 'Why chapter 9 matters most',
          text: 'It brings the chaos mages of São Paulo into the story, and it does it as a part of the established network rather than as a bolt-on. A group that has played eight chapters without knowing that this thread existed discovers that the campaign was running their characters the whole time.'
        }
      ]
    },
    {
      h2: 'Gematria: where the campaign meets the sigil tradition',
      paras: [
        'Chapter 2 is about Hebrew gematria: the practice of assigning a numerical value to each letter and reading a word as its total. Whatever else the campaign does with it, it has put at the centre of a roleplaying game the exact operation that chaos magick calls a sigil.',
        'The parallel is structural, not decorative. A sigil tradition reduces a statement of intent to the structural consonants that survive the reduction. Gematria takes a name and assigns it a value. Both are moves of the same kind: take a meaningful sequence, strip or reinterpret it according to a rule, and let the reduced form carry the meaning forward as something that is no longer ordinary language. The secrecy in both cases is not for secrecy’s sake. A reduction that stayed in ordinary words would be a sentence, and a sentence has to be interpreted. A reduction that lands as a number or a glyph is a handle.',
        'This is why the chapter pairs naturally with practice rather than only with lore. <a href="sigil-generator.html">The sigil generator</a> performs the reduction interactively, the <a href="../apps/chaos-sigil-generator.html">generator app</a> does the full cycle with a library and an intent journal, and <a href="../books/codex-chaoticus-pdf.html">Codex Chaoticus</a> covers the written method including charging and timing.'
      ]
    },
    {
      h2: 'Hebrew gematria and chaos magick sigils compared',
      paras: [
        'It helps to be precise about where the two traditions differ, because the overlap is often overstated by people selling courses about it.',
        'In gematria, the value is assigned to letters of an existing word, usually a proper name, and the sum is the point - it is used to compare names, to find equivalences, to derive judgements. The letters stay letters. In the sigil tradition, the letters are reduced and then arranged into a shape, and the shape is what gets carried. One produces a number; the other produces an image.'
      ],
      table: {
        caption: 'Gematria and sigil practice, side by side',
        head: ['', 'Gematria', 'Sigil reduction'],
        rows: [
          ['Input', 'A name or word', 'A statement of intent'],
          ['Operation', 'Assign each letter a value and sum', 'Remove vowels and duplicates, keep structure'],
          ['Output', 'A number', 'A glyph'],
          ['Used for', 'Comparison, equivalence, judgement', 'Carrying, hiding, acting on the intent'],
          ['Shared logic', 'A fixed rule applied to meaning', 'A fixed rule applied to meaning']
        ]
      }
    },
    {
      h2: 'The bestiary and the roster of 23 npc characters',
      paras: [
        'The creature material is complete rather than decorative: three creatures of the hidden world with full sheets, their weaknesses, and the role each one plays in the story. That matters for play, because a creature with a stated weakness is a puzzle the group can solve and a creature without one is an obstacle the group has to survive.',
        'The roster is twenty-three faces - mentors, allies, antagonists and neutrals - each with a sheet, points and a piece of history. Twenty-three is enough that a group running a long campaign will not exhaust it, and the histories are what let a Keeper connect them rather than use them individually.'
      ]
    },
    {
      h2: 'Seven city boards across Iberoamerica',
      paras: [
        'The campaign is built around seven nodes, and each one has its own session structure rather than being a location on a map. That is the right design for a travelling chronicle: the group moves, and the geography changes what the story is about.'
      ],
      table: {
        caption: 'The seven nodes and what each contributes',
        head: ['Node', 'Character of the setting'],
        rows: [
          ['Bogotá', 'The centre of gravity, and the politics around it'],
          ['Medellín', 'The valley, and what the network does with it'],
          ['Lima', 'The coastal money and the older layers beneath it'],
          ['Mexico City', 'Scale, distance and its own centres of power'],
          ['São Paulo', 'The largest node, and where the chaos mages appear'],
          ['Buenos Aires', 'The southern end of the route'],
          ['The Caribbean', 'The offshore layer where the data hides']
        ]
      },
      h3s: [
        {
          h3: 'Urban fantasy rpg campaign in Bogotá and São Paulo',
          text: 'The two most distinct nodes are Bogotá, which is where the political weight sits, and São Paulo, which is both the largest and the one the background network has claimed. A group that plays Bogotá as a campaign about institutions and São Paulo as a campaign about people is playing the same story from two ends, and the crossover in chapter 9 pays off both.'
        }
      ]
    },
    {
      h2: 'Player characters: background, arete, spheres and hooks',
      paras: [
        'The archetype section gives ready-to-play characters with a background, an Arete rating, spheres and a hook. For a new group that is the difference between running a session and running a campaign: nobody spends forty minutes inventing a person before the plot starts.',
        'The hooks are the part to read first. A hook is what connects a character to the premise without requiring the player to have designed one, and it is what makes a stranger at the table able to care about the birth of a numerical god by the second session.'
      ]
    },
    {
      h2: 'How to run a world of darkness campaign from this',
      paras: [
        'Read chapter 1 in session one and do not summarise it. Let the group read it; the premise is better absorbed than briefed. Pick one node and run it to its natural ending before moving, because the boards are written as complete arcs and a group that skips ahead loses the structure that makes the travel mean something.',
        'Use the roster deliberately rather than as an emergency supply of names. Pick three antagonists whose histories touch the node you are running, and let the players meet one of them before they understand what they are. Keep the bestiary’s weaknesses visible from the first fight. And keep chapter 9 closed until the arc is finished, because its whole function is to reframe what came before.',
        'One practical note: the material is in Spanish, so the group needs a shared vocabulary for the terms. <a href="../glossary.html">The glossary</a> covers the occult vocabulary the campaign assumes, which is the fastest way to get past it.'
      ]
    },
    {
      h2: 'The same shelf, approached from other directions',
      paras: [
        'If you want the same game in English, <a href="synthetic-gods.html">The Synthetic Gods</a> is a Mage: The Ascension chronicle set in the 1999 web, with a working sigil workshop inside it. On the other side of the World of Darkness, <a href="pentex-werewolf.html">Pentex Industries</a> is the corporate-horror megacorp for Werewolf: The Apocalypse and <a href="schrecknet-nosferatu.html">SchreckNET</a> the clan compendium for Vampire: The Masquerade.',
        'And if what you want is to stop reading and start building, the <a href="../apps/chaos-sigil-generator.html">Magick Chaos Sigil Generator</a> runs the whole intent cycle offline, and <a href="../books/codex-chaoticus-pdf.html">Codex Chaoticus</a> is the written system. For one of the campaign’s own cities, there is also a free panel of violence and crime data for Colombia in the <a href="dashboard-colombia.html">crime data dashboard</a>.'
      ]
    }
  ],
  faq: [
    {
      q: 'Do I need the World of Darkness books to play?',
      a: 'Not strictly. The campaign explains its own system as it goes, and the reference material is complete. The books add context and options rather than unlocking anything.'
    },
    {
      q: 'Is it free for my group?',
      a: 'Yes. It is readable online, with no registration and no payment, and all seven boards are available while you play.'
    },
    {
      q: 'Is the campaign material in English?',
      a: 'No. The chapters, bestiary, roster, characters, factions and appendices are in Spanish. This page is an English guide to the structure and the material.'
    },
    {
      q: 'Is this official White Wolf content?',
      a: 'No. It is a work of fandom about Mage: The Ascension and World of Darkness, with no editorial affiliation and no official backing. Mage: The Ascension and World of Darkness are trademarks of their respective owners.'
    },
    {
      q: 'How long is a session?',
      a: 'The structure is written per node, so each board is designed as a self-contained arc within the nine-chapter campaign. The scenes chapter sets out the session structure for each one.'
    },
    {
      q: 'What is gematria and why is it central?',
      a: 'It is the practice of assigning a numerical value to each letter and reading a word as its total. The campaign uses it as its central system, and it maps closely onto sigil practice, where a statement of intent is reduced to its structural letters by a fixed rule.'
    }
  ]
};