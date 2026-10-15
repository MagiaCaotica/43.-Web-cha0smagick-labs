/**
 * deepdive/beat-the-dealer.mjs
 * ---------------------------------------------------------------------------
 * Articulo largo de la pagina tools/beat-the-dealer.html.
 *
 * Criterio editorial de esta pieza:
 *   - Enseñar el motivo detras de cada regla. Una tabla de estrategia que
 *     alguien memoriza sin entender por qué se rompe en cuanto la mesa cambia.
 *   - No hay ninguna promesa de ganar dinero. La aritmética que se explica aqui
 *     dice exactamente lo contrario, y esconderlo sería escribir contra el
 *     lector.
 *   - Los long-tail objetivo son los encabezados. Si el titular es la pregunta
 *     que alguien escribe en Google, la pagina la cubre de verdad y no la
 *     declara cubierta.
 */

export const BEAT_THE_DEALER = {
  targets: [
    'how to count cards in blackjack',
    'why does blackjack have a house edge',
    'blackjack 3:2 payout versus 6:5 odds',
    'true count versus running count',
    'card counting bankroll and bet spread',
    'blackjack insurance odds and cost',
    'double down or split in blackjack',
    'blackjack basic strategy hard 16 stand',
    'is card counting illegal at casinos',
    'blackjack dealer must hit on 16'
  ],
  sections: [
    {
      h2: 'What blackjack actually is before any strategy matters',
      paras: [
        'Blackjack is the only casino game where the rules are fixed enough to be worth memorising. You get two cards face up, the dealer gets one face down and one face up, and then everybody plays against the same published set of decisions. The dealer follows rules you cannot deviate from, which is precisely what makes the game a problem in probability rather than a game of nerve.',
        'Face cards are worth ten, aces are worth one or eleven depending on the hand, and everything else is its pip value. The dealer must draw to sixteen and must stand on seventeen or more — that single constraint is where most of the house edge lives. A dealer who drew to a soft seventeen would be a different game with different numbers, which is why the table below matters more than any strategy card.'
      ],
      h3s: [
        {
          h3: 'The decisions that make up the game',
          text: 'Hit, stand, double down, split, take insurance, surrender if the table allows it. That is the whole menu. Every blackjack strategy ever printed is a decision procedure over those six options, and every strategy error is a decision taken at the wrong moment for the dealer upcard you are actually looking at.'
        }
      ],
      table: {
        caption: 'The six decisions in blackjack, and when each one is on the table',
        head: ['Decision', 'What it does', 'Available when'],
        rows: [
          ['Hit', 'Draw one more card', 'Any time, unless standing would be better'],
          ['Stand', 'Keep your total and stop drawing', 'Any time your total is competitive'],
          ['Double down', 'Double your bet, take exactly one card, then stand', 'Usually first two cards; rules vary'],
          ['Split', 'Separate a pair into two hands and play each', 'On a matching pair; rules vary'],
          ['Insurance', 'Side bet that the dealer has blackjack', 'Only when the dealer upcard is an ace'],
          ['Surrender', 'Give up half the bet and walk', 'Only on some tables, usually early']
        ]
      }
    },
    {
      h2: 'Why blackjack has a house edge',
      paras: [
        'Short answer: because the dealer deals second, from the same deck you play from, and because you have to make your decisions with less information than the dealer acts on. The dealer will eventually see a blackjack and pay you three to two. You have to be right more often than the odds allow, on cards the dealer has already seen.',
        'The edge is small, which is what makes blackjack interesting and also what makes bad advice expensive. In a favourable single-deck game with a three-to-two payout, the edge can fall under half a percent. Add a six-to-five payout instead and it jumps by more than a percentage point — which is why the payout rule is the single most important line on any table rules placard.'
      ],
      table: {
        caption: 'How much the house edge moves with the rules',
        head: ['Rule variant', 'Effect on the house edge'],
        rows: [
          ['Blackjack pays 3:2', 'Baseline; the good version'],
          ['Blackjack pays 6:5', 'Adds well over one percentage point of edge'],
          ['Dealer hits soft 17 (H17)', 'Costs the player a further slice of edge'],
          ['Dealer stands on all 17s (S17)', 'The more common and cheaper variant'],
          ['Double any two cards', 'Worth roughly half a percent to the player'],
          ['Double only 10-11', 'Gives part of that value back to the house'],
          ['Insurance offered', 'A separate bet that is close to pure loss on its own']
        ]
      },
      h3s: [
        {
          h3: 'The dealer must hit on 16, and that is the whole game',
          text: 'A dealer who must hit on sixteen has a bust built into the rules, so they bust often enough that standing on a weak hand against a dealer ten is correct far more often than intuition suggests. Almost every basic-strategy anomaly — stand on sixteen against a ten, hit a twelve against a two or three — falls out of that one asymmetry once you work backwards from it.'
        }
      ]
    },
    {
      h2: 'Blackjack basic strategy: hard 16, stand or hit',
      paras: [
        'Basic strategy is the decision procedure that maximises expected return given only the cards you can see. It is not a set of rules about which cards are good. It is a table indexed by your total and the dealer upcard, and every entry in it is a comparison between two expected values rather than a judgement about value.',
        'The hardest entry to accept is standing on a hard sixteen against a dealer ten or an ace. It feels wrong because a hit can instantly destroy the hand. But the dealer busts often enough from sixteen that the better line is the passive one. Learn it as arithmetic first and as instinct later, and never override it because the table feels hot.'
      ],
      table: {
        caption: 'The hard hands that trip up beginners',
        head: ['Your hard total', 'Against dealer 2-6', 'Against dealer 7-9', 'Against dealer 10-A'],
        rows: [
          ['16', 'Stand', 'Stand', 'Stand (this is the surprising one)'],
          ['15', 'Stand', 'Stand', 'Hit'],
          ['14', 'Stand', 'Stand', 'Hit'],
          ['13', 'Stand', 'Stand', 'Hit'],
          ['12', 'Stand', 'Hit', 'Hit'],
          ['11', 'Double', 'Double', 'Double'],
          ['10 or less', 'Double if allowed', 'Double if allowed', 'Hit or double']
        ]
      },
      h3s: [
        {
          h3: 'Soft hands are decided by the dealer upcard, not by your number',
          text: 'A soft eighteen — say a hand of ace plus seven — is only eighteen against a dealer ten, because the ace can drop to one. Against a dealer nine or a ten that weak ace is often a reason to hit, which is the opposite of the hard-hand instinct and one of the first places self-taught players go wrong.'
        }
      ]
    },
    {
      h2: 'Double down or split in blackjack',
      paras: [
        'Both decisions commit more money, so both need a rule that is more than a feeling. The classic test is the remaining deck: if the cards still in the shoe make your hand a favourite against the dealer upcard, doubling adds the value of that advantage; if your hand is a dog either way, splitting usually does more.',
        'The rule of thumb most tables agree on: split twos and threes when the dealer is not an ace, split eights always, never split aces and eights against a ten in a game where you double any two, and double eleven against everything except an ace. The exceptions exist because the deck composition and the table rules shift the numbers, which is exactly why memorising the procedure beats reasoning about it live.'
      ],
      h3s: [
        {
          h3: 'Why splitting nines or tens fails',
          text: 'Splitting a pair that is already strong throws away the fact that tens and nines dominate the deck. You get two weaker hands instead of one strong one, and the expected return falls. Splitting is for pairs whose individual value is poor enough that two mediocre chances beat one mediocre chance.'
        }
      ]
    },
    {
      h2: 'How to count cards in blackjack',
      paras: [
        'Card counting is not magic and it is not a system for beating randomness. It is a bookkeeping method. You assign each card a small positive or negative value, add those values up as the deck deals, and use the running total to estimate how rich or how depleted the remaining shoe is — and therefore which basic-strategy decisions are now different.',
        'The part everybody skips is that the shift is small. Counting changes which moves are correct and, at the right moment, which bet to place. It does not turn a negative game into a positive one by magic; it moves the edge toward zero and, in a good game with enough penetration, slightly past it.'
      ],
      h3s: [
        {
          h3: 'The simplest system that works: Hi-Lo',
          text: 'Tag the small cards two, three, four, five and six as positive one. Tag tens, jacks, queens and kings as negative one. Count twos through nines as zero. A positive running count means more small cards and fewer big ones have come out, which is the shoe getting worse for the house.'
        },
        {
          h3: 'True count versus running count',
          text: 'The running count is the raw total. The true count divides that total by the number of decks still undealt — so a running count of plus eight in a six-deck shoe is a true count of only about plus one. Three. Making decisions on the running count rather than the true count is the most common counting error, and it is the difference between a small edge and no edge at all.'
        },
        {
          h3: 'Why penetration matters more than system',
          text: 'A system that depends on cards rarely seen because the shoe is shuffled too early will not deliver, however good the tags are. Penetration — the share of the shoe dealt before the shuffle — sets the ceiling on what any counting method can achieve. Rules and shuffle habits therefore matter more to a counter than the choice of counting system.'
        }
      ],
      table: {
        caption: 'Hi-Lo values, the whole system in eight rows',
        head: ['Card', 'Value', 'Card', 'Value'],
        rows: [
          ['2', '+1', '7', '0'],
          ['3', '+1', '8', '0'],
          ['4', '+1', '9', '0'],
          ['5', '+1', '10', '-1'],
          ['6', '+1', 'Jack', '-1'],
          ['Ace', '0 (and +1 on aces split)', 'Queen', '-1'],
          ['Ten', '-1', 'King', '-1']
        ]
      }
    },
    {
      h2: 'Card counting bankroll and bet spread',
      paras: [
        'Almost nobody fails at counting because the tags are wrong. They fail because the outcome of a correct method is a long series of small wins punctuated by rare, large losses, and they do not have the bankroll to survive one. A true advantage is not the same as a comfortable month, and the arithmetic of variance is what turns a fair method into bankruptcy.',
        'Bet spreading is the response: bet the table minimum when the count is low and scale up in proportion to the advantage when it is high. The Kelly criterion gives the theoretically optimal fraction, but most players stake a fraction of Kelly precisely because full Kelly assumes perfect discipline and a long horizon.'
      ],
      h3s: [
        {
          h3: 'Is card counting illegal at casinos?',
          text: 'In most jurisdictions, counting cards with your own brain is not a crime and no statute prohibits it. What casinos can and do do is ban you from the property for any reason they like, and in a few states using or possessing an electronic counting device at a table is itself an offence. The practical rule is that the method is legal and the welcome is not.'
        },
        {
          h3: 'Online blackjack is a different problem entirely',
          text: 'With a continuously shuffled deck generated by a random number algorithm there is no shoe to count, so counting cannot work. Any site offering a live blackjack game with a fixed deck and a visible count is either a mistake or an advertisement for itself.'
        }
      ]
    },
    {
      h2: 'Blackjack insurance odds and cost',
      paras: [
        'Insurance is a side bet that the dealer has blackjack when their upcard is an ace. The payout is conventionally two to one, but the true probability of the dealer holding blackjack is about four and a half in one hundred, and the insurance stake is paid on top of your original bet. The maths is lopsided enough that insurance carries a cost to the player of roughly seven percent of whatever is staked.',
        'It is the clearest example on the table of a bet whose payout looks generous and whose arithmetic is not. The same reasoning applies to any side bet offered at a blackjack table: the house is pricing it, and the price is set above fair.'
      ]
    },
    {
      h2: 'Why a written method beats a table of numbers',
      paras: [
        'Every rule above is derived from two facts: the dealer must hit on sixteen, and the payout is three to two. Change either fact and the table changes. That is the argument for understanding the derivation rather than memorising a chart, because the chart is the answer to a question you will eventually be asked again.',
        'The same discipline shows up in every system built on probability rather than on hope. <a href="../books/codex-chaoticus-pdf.html">Codex Chaoticus</a> is the written version for sigils and dice: act deliberately, accept that the result is not guaranteed by sincerity, and size your commitment so a bad run does not end you. If you want the attention half of the training, the <a href="../apps/psi-gym.html">PSI GYM app</a> runs Zener card drills in the same discipline. The <a href="roulette-lab.html">Roulette Lab</a> shows the same arithmetic from the other side of the table, where the edge is large enough to be obvious.',
        'This page is educational. No money is involved anywhere on it, and no system described here changes the fact that the house edge is negative in the long run.'
      ]
    }
  ],
  faq: [
    {
      q: 'Does basic strategy guarantee a profit at blackjack?',
      a: 'No. Basic strategy reduces the house edge to its smallest practical value, which is usually well under half a percent and sometimes a fraction of that. It cannot make the game positive. Only a method that changes bet size with the count, on a good rule set with deep penetration, can move the expectation past zero — and even then by a small margin.'
    },
    {
      q: 'How do you know when to stand on a hard 16?',
      a: 'Stand. It feels wrong because a hit can destroy the hand, but the dealer busts often enough from sixteen that standing is the higher expected value against a dealer ten or an ace. The reasoning follows directly from the dealer having to hit on sixteen, which is the rule that creates the dealer busts in the first place.'
    },
    {
      q: 'What is the difference between the running count and the true count?',
      a: 'The running count is the raw sum of the card tags. The true count divides that by the approximate number of undealt decks, so the same running count is worth more in a single-deck shoe than in an eight-deck one. Decisions should use the true count; using the running count in a multi-deck shoe is the most common counting mistake.'
    },
    {
      q: 'Do card counting systems work in online blackjack?',
      a: 'Not against a continuously shuffled digital deck. There is no fixed shoe and no visible sequence to count, so the method has nothing to measure. It applies to real tables, and to any digital game that genuinely uses a fixed, partially dealt deck.'
    },
    {
      q: 'How much money do I need to count cards safely?',
      a: 'Enough to survive the worst realistic run at your table minimum, which for most published results means several hundred units, with more needed at short tables or with poor rules. Anyone quoting a small fixed figure is describing a bankroll for a system that mostly does not work.'
    },
    {
      q: 'Why does the course use tables computed in the browser?',
      a: 'Because copied strategy tables are frequently wrong or quietly adjusted to flatter a casino. Every table on the free course is derived live from the rules of the game being demonstrated, so the numbers on screen are the numbers the page just computed rather than something copied from an unknown source.'
    },
    {
      q: 'Can I win at blackjack without counting cards?',
      a: 'You can play competently and lose slowly instead of quickly, which is the honest version. Playing basic strategy with good rules, avoiding insurance and side bets, and controlling bet size is what keeps a recreational player in the game for longer. It does not create an edge.'
    }
  ]
};