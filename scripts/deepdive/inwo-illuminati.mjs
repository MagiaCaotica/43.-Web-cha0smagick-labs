/**
 * deepdive/inwo-illuminati.mjs
 * ---------------------------------------------------------------------------
 * Articulo largo de la pagina tools/inwo-illuminati.html.
 *
 * NOTA SOBRE LOS DATOS: las cifras de la baraja de este articulo no estan
 * inventadas. Salen de leer el propio motor del juego que envuelve la pagina
 * (js/cards.js y js/cardstats_known.js del repositorio de la herramienta),
 * que genera 421 imagenes de carta y las declara por tipo oficial.
 *
 * Cuando una regla concreta no se puede comprobar contra ese codigo, el texto
 * lo dice y remite a la ayuda de reglas que trae el propio juego, en vez de
 * completarla de memoria.
 */

export const INWO_ILLUMINATI = {
  targets: [
    'how to play illuminati new world order',
    'inwo card game rules and groups',
    'inwo power and resources explained',
    'illuminati new world order card list',
    'free card game to play in browser',
    'card game with an automatic opponent',
    'secret society card game with groups',
    'inwo plot cards and illuminati cards'
  ],
  sections: [
    {
      h2: 'What Illuminati: New World Order is',
      paras: [
        'INWO is a card game about secret societies competing for control of the world. Each player is running a hidden agenda, and the whole table is covered with groups that everybody wants to manoeuvre, attack or ally with. You do not win by having the best hand. You win by completing your own project while your opponents are still consolidating theirs.',
        'That inversion is what separates it from every other trick-taking game. Cards in your hand are not tricks; they are positions on a shared board. A hand full of powerful cards is worthless if the groups it controls are fragile, and a modest hand can win if it controls the right group at the right level.'
      ],
      h3s: [
        {
          h3: 'How to play illuminati new world order, in outline',
          text: 'Take turns drawing and playing cards, place groups on the board, and use action cards to attack, bind or gain control of other groups. Groups move up through the levels as they grow. Keep working towards your own project until you complete it. The exact turn order and scoring for any given edition live in the rules panel built into the game, which is worth reading once before your first hand.'
        }
      ]
    },
    {
      h2: 'The illuminati new world order card list',
      paras: [
        'This digital edition ships a deck of 421 distinct cards, drawn from scanned physical cards and entered into the engine one by one. The distribution is not even, and that is informative: the game is mostly about doing things and moving groups around rather than about collecting a small set of rare prizes.',
        'The card categories below are taken from the game engine itself, which tags each card with its official printed type.'
      ],
      table: {
        caption: 'The 421-card deck by official card type',
        head: ['Card type', 'Cards', 'What it does in the game'],
        rows: [
          ['Plots', '155', 'Actions and societies: place groups, attack, bind, control'],
          ['Groups', '116', 'The positions on the board: organisations, governments, cults'],
          ['Resources', '35', 'Direct resource or funding effects'],
          ['Places', '27', 'Locations that modify what happens around them'],
          ['Persons', '22', 'Individuals with their own agendas and effects'],
          ['Illuminati', '18', 'Powerful society cards, each in two halves'],
          ['Disasters', '13', 'Chaos cards that disrupt the board'],
          ['Assassinations', '5', 'The most destructive cards in the deck']
        ]
      },
      h3s: [
        {
          h3: 'What the deck is actually made of',
          text: 'Groups are the subject matter: the CIA, the Pentagon, Greenpeace, multinational corporations, the World Bank, Las Vegas, heavy metal fans, telephone psychics, flat-earthers, monks. Persons are individuals. Places are locations. It is a conspiracy board game written by people who clearly enjoy the genre and who understand that a group of DJs can be as dangerous as a government.'
        }
      ]
    },
    {
      h2: 'Groups, and inwo power and resources explained',
      paras: [
        'Every group on the board carries two numbers. The first is Power: how many members the group has, which is what determines whether it can survive an attack. The second is Resources: how much money it has, which is what it can spend. A group with high power and no money is a fortress that cannot act. A group with money and no people is a bank account with nobody to withdraw it.',
        'The numbers in the deck range from zero upward. Several groups sit at zero power, because a secret society that has just been founded has no members yet and is about to be destroyed by anything that looks at it sideways. The largest groups in the game, the states and alliances, sit at the top of the range on both axes.'
      ],
      h3s: [
        {
          h3: 'Why the two numbers create the real decisions',
          text: 'Because they run on different clocks. Power grows slowly and is hard to reverse; resources are spent and must be replenished. Most of the tension in a hand comes from a group that is strong enough to hold its position but poor enough that you cannot afford to protect it, which is exactly the situation a real conspiracy spends its whole career in.'
        }
      ]
    },
    {
      h2: 'The three levels of the board',
      paras: [
        'Groups do not sit on one flat surface. The board is arranged in levels, and a group occupying a higher level is in a stronger position with respect to the groups below it. Moving a group up is the most valuable thing you can do with a card, and defending a level is where a position becomes worth holding.',
        'This is the structural reason the game produces tense decisions rather than simple optimisation. A group that is merely large is replaceable; a group that is large and sitting on the right level with the right card attached is the position the whole table is fighting over.'
      ]
    },
    {
      h2: 'Plot cards and illuminati cards',
      paras: [
        'Plot cards are the bulk of the deck and the reason it is 155 cards rather than 20. They cover everything a player can do: place a new group, move one you control, attack another, bind it, gain control of a neutral one, and so on. Playing well is largely about which plot fits the situation in front of you rather than about which card sounds strongest.',
        'The Illuminati cards are the rare ones, and they are structured differently from everything else: each one arrives in two halves, numbered one and two. Adepts of Hermes, the Bavarian Illuminati, the Bermuda Triangle and the Discordian Society all follow that pattern in the deck. The two-step construction is the point — these are not effects, they are long projects that take more than one turn to complete, which changes how you plan a hand several turns ahead.'
      ]
    },
    {
      h2: 'A free card game to play in the browser',
      paras: [
        'The reason this exists in a browser rather than only on a table is straightforward: the physical game needs a deck, a play surface, a group of people in the same room and roughly forty minutes. The digital version removes all four requirements. Nothing to download, nothing to install, no account, and the full deck is already there.',
        'It is also the fastest way to teach the game. Somebody who has played five hands online understands the turn structure, the levels and the difference between a group and an action well enough to sit down at a real table and start immediately, which is not true of someone reading a rulebook.'
      ]
    },
    {
      h2: 'Playing against an automatic opponent',
      paras: [
        'The digital opponent plays the same rules you do and does not cheat, which makes it a genuinely useful teacher rather than a slot machine. You can lose to it slowly over several hands, notice which of your groups it keeps attacking, and revise. That loop is exactly what a group of people does to each other, minus the travel.',
        'For a game whose whole appeal is watching another player overcommit to a group, the solo mode is the honest test of whether you understand the positions on the board. If you are winning by holding groups the computer cannot reach, you are playing the game. If you are winning because it did not see your project, you are not.'
      ]
    },
    {
      h2: 'Why a secret society card game is a good gateway to card symbolism',
      paras: [
        'There is a specific reason this particular hobby keeps attracting people who then end up somewhere unexpected. A conspiracy card game is an exercise in reading symbols: every card is an image standing for a concept, and the whole table is a conversation conducted in pictures rather than words. Once that habit is installed, the jump to a system where a symbol is meant to carry meaning is a much smaller step than it looks.',
        '<a href="../books/tarot-chaos-pdf.html">Tarot Chaos</a> is that next step in written form: the same idea of working with images that carry weight, taken apart and reassembled under a method instead of a rulebook. And if you want the whole deck in your pocket with reversed meanings, combinations and offline reading, the <a href="../apps/unofficial-rider-waite-tarot.html">Unofficial Rider Waite Tarot app</a> is the same object, made portable.'
      ]
    }
  ],
  faq: [
    {
      q: 'Is it free to play INWO online?',
      a: 'Yes. The game runs in your browser with no installation, no registration and no payment. Open the link and play.'
    },
    {
      q: 'Do I need the physical deck?',
      a: 'No. This version includes the full deck, the board, the actions and the play log. The physical deck is only necessary if you prefer playing around a real table.'
    },
    {
      q: 'Who do I play against?',
      a: 'An automatic opponent that follows the same rules you do. It is the quickest way to learn how the positions on the board actually work.'
    },
    {
      q: 'How many cards are in the deck?',
      a: '421 distinct cards: 155 plots, 116 groups, 35 resources, 27 places, 22 persons, 18 Illuminati cards, 13 disasters and 5 assassinations. Those counts come from the game engine itself.'
    },
    {
      q: 'What is the interface language?',
      a: 'The game is in Spanish, as it was originally built. The rules panel inside the game is available while you play, and this page explains the structure in English.'
    },
    {
      q: 'Can I play INWO with friends online?',
      a: 'This version is single player against the computer. For multiplayer you would need the physical game and players in the same room.'
    }
  ]
};