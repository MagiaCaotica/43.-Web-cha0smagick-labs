/**
 * deepdive/inwo-illuminati.mjs
 * ---------------------------------------------------------------------------
 * Articulo largo de la pagina tools/inwo-illuminati.html.
 *
 * AUDIENCIA PRIMARIA: alguien que escribe "play INWO online", no tiene la caja
 * y lleva treinta anos dando por hecho que un juego de 1995 sin edicion
 * digital esta muerto. Este texto le dice, en la primera frase, que puede
 * jugar ahora mismo gratis.
 *
 * AUDIENCIA SECUNDARIA: alguien que ya conoce el juego y busca la baraja
 * completa o una referencia de reglas.
 *
 * REGLAS DE VERIFICACION: todo lo que se afirma aqui sale de dos fuentes, las
 * unicas verificables: el README del propio repositorio de la herramienta y
 * el motor del juego (js/cards.js, js/statsfix.js, js/engine.js). Donde el
 * propio proyecto declara limites o trabajo pendiente, se reproducen. No se
 * rellenan huecos con suposiciones sobre el juego original.
 */

export const INWO_ILLUMINATI = {
  targets: [
    'play illuminati new world order online',
    'illuminati new world order free online play',
    'how to play illuminati new world order',
    'inwo card game history and publisher',
    'inwo power and resistance rules',
    'illuminati new world order card list',
    'how many players can play inwo',
    'inwo attack formula and dice roll',
    'illuminati new world order win condition'
  ],
  sections: [
    {
      h2: 'Play Illuminati: New World Order online, free, right now',
      paras: [
        'You can play Illuminati: New World Order in your browser right now, free, without downloading anything and without creating an account. It is the full 421-card game, it runs on a desktop or a phone, and the table is waiting above this text.',
        'That matters more than it sounds. Illuminati: New World Order is a collectible card game from 1995, and for most of the thirty years since, if you had not already found a copy you almost certainly concluded it was unavailable. There was no digital edition. This one is a fan web build of the original cards, running on plain JavaScript with no server behind it.',
        'If you have never played and you were quietly assuming you missed your chance, you did not. The game did not become unavailable; it just never existed in the form you were looking for. This page is both the table and the explanation, so you can start in about a minute and understand what you are doing within five.'
      ],
      h3s: [
        {
          h3: 'The short version',
          text: 'Draw cards, place groups, attack other groups with dice, and control twelve of them including your own Illuminati. That is the whole game. The next sections explain each piece before you need it.'
        }
      ]
    },
    {
      h2: 'What INWO actually is',
      paras: [
        'Illuminati: New World Order is a card game about running a secret society in opposition to everyone else. You do not collect creatures or build armies. You draw a hand of plots and groups, place a society on the table, and then spend the rest of the game taking control of other groups from other societies, sometimes destroying them outright, until you hold enough of the board to meet your goal.',
        'The material is where the pleasure lives. Groups are the CIA, the Pentagon, the NSA, NATO, the World Bank, the Federal Reserve, the Church of Scientology, the Ku Klux Klan, multinational corporations, heavy metal fans, flat-earthers, telephone psychics, jihadi recruiters, and the Illuminati themselves. The tone is a parody played dead straight, on the understanding that everybody at the table already believes roughly half of it. The epigraph on the box is the whole design brief: everything is true, everything is conspiratorial.',
        'The result is a game that plays like an argument between people who have already had this argument, and it survives being thirty years old because the premise has not aged at all.'
      ]
    },
    {
      h2: 'The history: Steve Jackson Games, 1995, and the raid that never banned it',
      paras: [
        'Illuminati was published by Steve Jackson Games in 1995, as part of a series built on the conspiracy genre. SJG put out other titles in the same family, Illuminati: Inferno among them. Steve Jackson Games was the publisher, and thirty years on it is still one of the few companies in this genre trading on its back catalogue rather than on a backer.',
        'The part everybody half-remembers is true, and it is the best story attached to any card game. In 1990, before any of this, agents of the United States Secret Service raided the offices of Steve Jackson Games, then based in Austin, Texas, looking for a hacker. They seized computers, they went through the company records, and they put Steve Jackson under investigation.',
        'The famous part is what came of it. The company sued the United States government, and won. The government conceded that the First Amendment protected the right to publish game rules, and the case became a landmark for exactly that. And then the useful detail for anyone curious about this genre: the raid has been inflated over thirty years into a story about a conspiracy game being suppressed. It was not. Illuminati was never banned, and it was never even part of the investigation. The full account is readable in the About section of the game itself.'
      ],
      table: {
        caption: 'The history in five dates',
        head: ['Date', 'What happened'],
        rows: [
          ['1990', 'Secret Service raids SJG offices; the company later wins its First Amendment case'],
          ['1995', 'Illuminati: New World Order published by Steve Jackson Games'],
          ['1990s-2000s', 'The card game circulates as a physical product with no digital edition'],
          ['Today', 'A fan web edition runs all 421 cards in the browser, free'],
          ['Today', 'Steve Jackson Games and the original card art remain © their owners']
        ]
      },
      h3s: [
        {
          h3: 'Why there was never a digital version',
          text: 'Not censorship, and not an accident of neglect: a physical collectible card game with hand-drawn art and printed rules is a physical product, and nobody ported it because there was no commercial reason to. The cards were the point. Which is also why a fan edition using the original scans is the right shape of solution, and why it is legal to play but not to sell.'
        }
      ]
    },
    {
      h2: 'How to play illuminati new world order in sixty seconds',
      paras: [
        'The turn structure is short and the in-game tutorial walks through all of it, but here is the whole loop so you can start reading a game instead of guessing at it.',
        'At the start you choose a secret society, which is your society card and the goal you are working towards. Everything after that is a repeated four-step turn, and the dice only enter when you attack.'
      ],
      table: {
        caption: 'The turn, and what happens in it',
        head: ['Step', 'What you do'],
        rows: [
          ['1. Draw', 'Take a plot card, a group card, or both'],
          ['2. Free takeover', 'Place one group from your hand — no dice required'],
          ['3. Actions', 'Attack to control or destroy, move your groups, play resources and plots'],
          ['4. End turn', 'Pass play and wait for your next turn']
        ]
      },
      h3s: [
        {
          h3: 'Inwo attack formula and dice roll',
          text: 'An attack is arithmetic, not luck. Your strength equals the power of your attacking group, minus the resistance of the group you are attacking, adjusted by any alignment bonuses, and reduced by whatever defence the target has. Then you roll two dice and succeed if the total is equal to or under your strength. A roll of eleven or twelve always fails, whatever your strength is. That last clause is the rule people forget and the reason an overconfident attack fails.'
        },
        {
          h3: 'Illuminati new world order win condition',
          text: 'You win by controlling twelve groups, including your own Illuminati, or by completing a special goal specific to your society. The twelve-group threshold is what makes the game a race rather than a war of attrition: there are not enough turns to take everything, so every attack is a claim about what matters.'
        }
      ]
    },
    {
      h2: 'The illuminati new world order card list: 421 cards',
      paras: [
        'This edition ships every one of the 421 original cards, rendered from the printed scans, with an inspector that shows the recovered card text and a glossary of thirty or more terms. The distribution is not even, and that tells you what the game is actually about.',
        'One correction worth making explicitly, because the numbers look confusing if you go straight to the engine data: there are nine Illuminati cards, and the database records each of them in two halves, which is why a raw count of the table returns eighteen.'
      ],
      table: {
        caption: 'The 421-card deck by type',
        head: ['Card type', 'Cards', 'What it does in the game'],
        rows: [
          ['Plots', '155', 'Actions: place groups, attack, bind, control, cancel'],
          ['Groups', '116', 'The board positions: agencies, corporations, cults, countries'],
          ['Resources', '35', 'Direct effects on resources and on card flow'],
          ['Places', '27', 'Locations that modify what happens around them'],
          ['Persons', '22', 'Individuals with their own effects and agendas'],
          ['Illuminati', '9 (18 entries)', 'Your society, in two halves, each with its own goal'],
          ['Disasters', '13', 'Chaos cards that disrupt the board'],
          ['Assassinations', '5', 'The most destructive cards in the deck']
        ]
      },
      h3s: [
        {
          h3: 'What the card list is actually made of',
          text: 'Agencies and governments, financial institutions, media corporations, religions, criminal organisations, subcultures, and a long tail of extremely specific targets, from NASA to wargamers to people who believe in a flat Earth. Reading the list is genuinely part of the experience, because the joke depends on all of them being presented in the same format.'
        }
      ]
    },
    {
      h2: 'Inwo power and resistance: the two numbers that decide everything',
      paras: [
        'Every group has two numbers, and they are the entire basis of the game. Power is how strong the group is when it attacks. Resistance is how well it holds together when it is attacked. A group with high power and low resistance hits hard and falls apart. A group with low power and high resistance is a wall that takes two of your best groups to crack.',
        'This is why the card list is not just flavour. The difference between two organisations on the table is these two numbers, and the game is the accumulated consequence of everyone trying to move them in your favour.'
      ],
      table: {
        caption: 'What the two numbers mean in play',
        head: ['', 'Power', 'Resistance'],
        rows: [
          ['Used for', 'Your strength when attacking', 'How hard you are to take'],
          ['Range', 'High power, low resistance', 'High resistance, low power'],
          ['Typical role', 'The hammer', 'The wall'],
          ['On the table', 'Pushes groups up and takes new ones', 'Sits where you want it, and stays']
        ]
      },
      h3s: [
        {
          h3: 'Where the numbers come from in this edition',
          text: 'From the printed cards, where they can be read, and from recovered values where the card image is ambiguous. The database records the status per card rather than presenting an estimate as fact, and the project keeps an explicit list of the values it has not been able to confirm. You can see which is which instead of having to trust them.'
        }
      ]
    },
    {
      h2: 'Your Illuminati, and what a society is',
      paras: [
        'Your society card is the reason for playing everything else. Each Illuminati has two halves, and the first one arrives early, giving you a capability and a claim on the board; the second arrives later and carries the goal. That structure is why the society is the anchor of a game rather than a personality description.',
        'It is also why the nine of them feel different in play rather than cosmetically. Each society changes what you can do before it tells you what you are trying to do, and a group that plays the same society twice will play it differently the second time.'
      ]
    },
    {
      h2: 'How many players can play inwo',
      paras: [
        'Three ways, and none of them need a group of people in the same room.',
        'The default is against the computer, which is the fastest way to learn and the most common way to actually start. There is also hot-seat for two human players on the same device, with a privacy curtain so the hand stays private, which is the closest this gets to passing the box around a table. And there is a spectator mode where two AIs play each other, at four speeds, with a running event log, which is a genuinely strange and rather good way to watch a board game work.'
      ],
      table: {
        caption: 'The three ways to play',
        head: ['Mode', 'Players', 'Best for'],
        rows: [
          ['Against the computer', 'You + AI', 'Learning the rules and playing solo'],
          ['Hot-seat', '2 humans, one device', 'Playing with someone in the room'],
          ['Spectator', 'AI vs AI', 'Watching the game resolve without stakes']
        ]
      },
      h3s: [
        {
          h3: 'How strong is the computer opponent, honestly',
          text: 'It takes over groups, attacks, defends and reacts to some attacks, and it is a useful teacher for the first five hands. It is a heuristic opponent that plays a subset of the implemented cards, not a solved engine, and it is described by its own project as not yet rules-complete. Expect to beat it once you understand the formula. Expect it to punish a careless attack.'
        }
      ]
    },
    {
      h2: 'Why play this web edition, and what to know before you do',
      paras: [
        'For anyone who wanted the game and never got it, the reasons are straightforward. It is free, it needs nothing installed, it works on a phone, it contains the complete card set rather than an approximation, it has a built-in tutorial and an encyclopedia, and it can be translated between English and Spanish without a reload.',
        'It is also a fan project, and you should know what that means in both directions. The good: the original rules and card text are recovered from scans, so the information is real. The limitation: the rules engine is built to a specific printed handbook version, and its own documentation lists mechanics that are still pending clarification, cards whose text has been recovered but not yet mapped to an implemented effect, and value estimates that have not been confirmed. Cards in those states are held back rather than presented as playable. That is the right engineering decision and a good thing to be told about before you hit a wall at the table.'
      ],
      h3s: [
        {
          h3: 'The legal line, in one paragraph',
          text: 'This is a non-commercial fan project. Illuminati, Illuminati: New World Order and all of the card artwork are copyright Steve Jackson Games. The scans are used as personal-use game assets. If you end up loving this, the correct response is to buy the real game from Steve Jackson Games, which is cheap, still in print, and considerably more satisfying than any browser tab. The code here is MIT licensed; the assets are not.'
        }
      ]
    },
    {
      h2: 'If you got this far, you were looking for something else',
      paras: [
        'The appeal of a conspiracy card game is not really the conspiracy. It is reading a symbol and expecting it to carry weight. INWO does that with 421 images of institutions; tarot does it with 78, and does it with two thousand years of somebody else having already thought about it.',
        'If you liked the idea of a hand of cards where every card is an idea, <a href="../books/tarot-chaos-pdf.html">Tarot Chaos</a> is that idea taken apart under a method instead of a rulebook, and the <a href="../apps/unofficial-rider-waite-tarot.html">Unofficial Rider Waite Tarot app</a> puts the complete deck in your pocket with reversed meanings, combinations and offline reading.'
      ]
    }
  ],
  faq: [
    {
      q: 'Can I play Illuminati: New World Order online for free?',
      a: 'Yes. The game is playable in your browser with no download, no account and no payment. The full 421-card set is there, and it runs on a phone as well as a desktop.'
    },
    {
      q: 'I have never played this game. Can I start here?',
      a: 'Yes, and this page is written for exactly that. There is a tutorial inside the game, and the sections above explain the turn structure, the attack formula and the win condition before you need them.'
    },
    {
      q: 'Do I need to buy the physical game to play?',
      a: 'Not to play here. But this is a non-commercial fan project and the cards are copyright Steve Jackson Games. If you like it, buying the original from them is the right move.'
    },
    {
      q: 'How many players does it take?',
      a: 'Three ways to play: against the computer, hot-seat for two humans on one device with a privacy curtain, or two AIs playing each other as a spectator. The original card game is built for two or three players.'
    },
    {
      q: 'Is the computer opponent good?',
      a: 'It is a useful teacher for a beginner: it takes groups, attacks, defends and reacts. It is a heuristic opponent rather than a solved one, so it is not rules-complete and it can be beaten once you understand the attack formula.'
    },
    {
      q: 'Is this exactly the same as the printed game?',
      a: 'The cards and their text are recovered from the original scans, and the engine is built to a specific printed handbook version. The project documents which mechanics are still pending and which card texts are recovered but not yet mapped to an effect, and it holds those cards back rather than pretending they work.'
    },
    {
      q: 'What is the win condition?',
      a: 'Control twelve groups, including your own Illuminati, or complete the special goal attached to your society.'
    },
    {
      q: 'What language is the game in?',
      a: 'English and Spanish, switchable from the interface without reloading the page.'
    },
    {
      q: 'Who made the original game?',
      a: 'Illuminati: New World Order was published in 1995 by Steve Jackson Games. Steve Jackson Games is also the company whose offices were raided by the US Secret Service in 1990, the company that beat the United States in court over it, and the company the game was never banned.'
    }
  ],
  sources: [
    {
      label: 'The game itself — rules, tutorial, encyclopedia and About section',
      href: 'https://cha0smagick.github.io/Virtual-Illuminati-New-World-order-INWO-game/',
      note: 'the fan web edition this page wraps, including the full history of the raid'
    }
  ]
};