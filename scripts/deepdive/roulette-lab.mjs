/**
 * deepdive/roulette-lab.mjs
 * ---------------------------------------------------------------------------
 * Articulo largo de la pagina tools/roulette-lab.html.
 *
 * El tesis del articulo, y el motivo por el que la pagina se titula "lab" y
 * no "casino": el margen de la casa no depende del tipo de apuesta, depende
 * de la rueda. Todas las apuestas de la mesa tienen la misma esperanza
 * negativa, y entenderlo es mas util que cualquier sistema para ganar.
 *
 * Sin promesas de ganar. Este texto explica por que no se puede.
 */

export const ROULETTE_LAB = {
  targets: [
    'roulette house edge european versus american',
    'roulette odds and payouts for every bet',
    'why does the martingale fail at roulette',
    'roulette five number bet house edge',
    'roulette la partage and plein jeu rules',
    'are roulette spins independent of each other',
    'red and black odds at roulette',
    'roulette wheel layout and pocket order',
    'roulette expected value of even money bets'
  ],
  sections: [
    {
      h2: 'The roulette wheel layout and why the zeros matter',
      paras: [
        'A roulette wheel is a wheel of fortune: a static wheel with a rotor turning one way and a ball spinning the other way along an outer track, dropping into numbered pockets as it slows. The numbers run zero to thirty-six, and the only structural fact that matters for your money is that the wheel is not an even number of outcomes.',
        'The European layout has 37 pockets. The American layout adds a second zero and has 38. Everything else — the arrangement, the colours, the shape of the table — is presentation built around those two numbers. This is worth sitting with, because it means the single most consequential decision about roulette is not which bet you place, it is which wheel you sit at.'
      ],
      table: {
        caption: 'Wheel variants and the resulting house edge',
        head: ['Layout', 'Pockets', 'House edge on most bets'],
        rows: [
          ['European (single zero)', '37 (0-36)', '2.70%'],
          ['American (double zero)', '38 (0, 00, 1-36)', '5.26%'],
          ['French, en prison / la partage', '37 (0-36)', '1.35% on even-money bets'],
          ['French, plein jeu', '37 (0-36)', '1.25% on all bets']
        ]
      },
      h3s: [
        {
          h3: 'Where the edge comes from, in one line',
          text: 'A straight-up bet pays 35:1, which looks generous. But you are betting on one number out of 37 or 38, so you keep 36 units of a 37 or 38 unit stake. The missing fraction is 2.70% in Europe and 5.26% in America. That gap is the house edge, and it is not added on top of the game — it is built into the payout.'
        },
        {
          h3: 'Pocket order and the table layout are two different things',
          text: 'The number sequence around the wheel is not the sequence of numbers on the betting layout, and the arrangement of colours on the table is not random either. These are deliberate arrangements designed so that numbers which sit next to each other on one surface are far apart on the other. It is the reason roulette has a visual structure at all, and it is why "hot" and "cold" numbers are a property of human pattern-seeking rather than of the wheel.'
        }
      ]
    },
    {
      h2: 'Roulette odds and payouts for every bet',
      paras: [
        'Here is the thing that surprises people the first time they see the whole table at once: every standard bet has exactly the same house edge. Straight-up, split, street, corner, six line, column, dozen, red, black, odd, even, high, low — all of them return the same percentage on every layout, because the payouts are all scaled to the probability in the same way.',
        'That is the entire answer to "which roulette bet is best". There is no best one. The only bet on the table that is measurably worse is the American five number bet, which covers the zeros plus one, two and three and pays only six to one — a bet that costs the player several times the house edge of everything else.'
      ],
      table: {
        caption: 'Every bet type, its coverage, its payout and its edge',
        head: ['Bet', 'Numbers covered', 'Pays', 'House edge'],
        rows: [
          ['Straight up', '1', '35:1', '2.70% / 5.26%'],
          ['Split', '2', '17:1', '2.70% / 5.26%'],
          ['Street', '3', '11:1', '2.70% / 5.26%'],
          ['Corner', '4', '8:1', '2.70% / 5.26%'],
          ['Six line', '6', '5:1', '2.70% / 5.26%'],
          ['Column', '12', '2:1', '2.70% / 5.26%'],
          ['Dozen', '12', '2:1', '2.70% / 5.26%'],
          ['Red or black', '18', '1:1', '2.70% / 5.26%'],
          ['Odd or even', '18', '1:1', '2.70% / 5.26%'],
          ['High or low', '18', '1:1', '2.70% / 5.26%'],
          ['Five number (American only)', '5', '6:1', 'roughly 7.9%']
        ]
      },
      h3s: [
        {
          h3: 'Roulette expected value of even money bets',
          text: 'On a single-zero wheel, red or black wins eighteen times out of thirty-seven and loses nineteen, because the zero belongs to neither. The expected return per unit staked is 18/37, which is 0.973. The variance is straightforward: each bet wins or loses exactly one unit, so the standard deviation is one unit per spin. Steady, predictable bleeding — which is a different profile from the large rare losses of a single-number bet.'
        },
        {
          h3: 'Roulette la partage and plein jeu rules',
          text: 'The French layout is the only one that reduces the edge, and it does so by changing what happens to an even-money bet when zero lands. Under la partage you get half your stake back, which is mathematically a half-loss instead of a full loss, halving the effective edge. Under plein jeu the zero plays out against all bets rather than only the even-money ones, reducing it further. Rule variants differ between casinos, so check what is actually on the placard.'
        }
      ]
    },
    {
      h2: 'Roulette red and black odds on the American wheel',
      paras: [
        'This is where the double zero quietly costs you twice. On an American wheel there are eighteen reds and eighteen blacks but thirty-eight pockets, so an even-money bet wins 18 out of 38 times. The extra pocket is not neutral — it is another outcome that beats you, and it is why the American edge of 5.26% is almost exactly double the European one.',
        'If you are going to play roulette at all, this single choice is worth more than any system you can buy. One wheel instead of the other doubles the rate at which the money leaves, with no change in how the game feels or how often you win in the short run.'
      ]
    },
    {
      h2: 'Why does the martingale fail at roulette',
      paras: [
        'The martingale is the most popular losing system ever written because it feels like mathematics. You double after every loss, so one win recovers everything you staked plus your original bet. The flaw is not mathematical at all — the system works exactly as described on every individual sequence. The flaw is that it requires unlimited money and an unlimited table of bets.',
        'Work it out honestly. Starting from one unit, losing twelve in a row means you have staked one, two, four, up to 2,048 units on the twelfth spin, and you have won back nothing. A twelve-loss run in an even-money bet is not exotic: it happens with a probability around one in four thousand over four thousand spins, which is a few hours of ordinary play. Every martingale session ends exactly the same way, and the house edge decides how long it takes.'
      ],
      h3s: [
        {
          h3: 'The same mathematics kills every other progression',
          text: 'Reverse martingale, Fibonacci, Labouchere, D Alembert: all convert many small wins into one catastrophic loss. They do not change the expected value, because the expected value of a sequence of bets is the sum of their expected values. They change the shape of the distribution, and the shape is what kills you.'
        },
        {
          h3: 'What a free simulator can honestly tell you',
          text: 'It can show you frequencies over large samples, and it can demonstrate that results are independent of each other. It cannot predict. A simulated streak feels real precisely because it is produced by the same mathematics that produces real streaks, and that mathematics has no memory to exploit.'
        }
      ]
    },
    {
      h2: 'Are roulette spins independent of each other?',
      paras: [
        'Yes, in theory and to any practical depth. Each spin is determined by where the ball physically lands in the pocket, and there is no mechanism by which a past result changes the distribution of the next one. The wheel has no memory and the ball has no memory.',
        'Independent does not mean evenly distributed in the short run, and this is where most intuition breaks. Independent events produce clumps: a run of five reds has nothing remarkable about it, and the probability of exactly that run somewhere in a few hundred spins is close to one. Human beings notice clumps because a streak feels like a signal, but the only thing a streak actually tells you is that you are watching a random process in real time.'
      ],
      table: {
        caption: 'What a streak does and does not mean',
        head: ['Claim', 'What the maths says'],
        rows: [
          ['Red is due because black has run long', 'False. Independence means no memory at all'],
          ['A run of five is unusual', 'No. It is close to inevitable across a few hundred spins'],
          ['Patterns repeat predictably', 'Only patterns human eyes select after the fact'],
          ['A long streak changes the next spin', 'No. The next spin has the same distribution as the first']
        ]
      }
    },
    {
      h2: 'Reading a layout instead of reading a pattern',
      paras: [
        'What you can actually learn at a roulette table is the layout: which numbers sit together, which bets are cheap to cover and which are expensive, how a street and a column differ in coverage, and how a single number differs in variance from an even-money bet. That knowledge is real, and it is worth knowing even if you never place a stake.',
        'It is also the part that transfers. Deliberating about probabilities before committing to an outcome, resisting the pull of a pattern that only exists in your attention, and accepting a negative expectation while staying engaged are the same four habits. <a href="../books/codex-chaoticus-pdf.html">Codex Chaoticus</a> is the written version for systems built on chance and intent, and <a href="beat-the-dealer.html">Beat the Dealer</a> is the same arithmetic applied where counting genuinely changes the answer.',
        'This page and the tool it wraps are educational. There is no money anywhere on either, and nothing described here makes the edge go away.'
      ]
    }
  ],
  sources: [
    {
      label: 'Gambling Therapy',
      href: 'https://www.gamblingtherapy.org/',
      note: 'free and confidential support for gambling problems, in several languages'
    }
  ],
  faq: [
    {
      q: 'What is the house edge in roulette?',
      a: 'It is 2.70% on a single-zero European wheel and 5.26% on a double-zero American wheel, and those numbers are identical for straight-up, split, street, corner, column, dozen and even-money bets. French rules with la partage or plein jeu reduce it further, on even-money bets or on all bets respectively.'
    },
    {
      q: 'Which roulette bet pays the best?',
      a: 'All of them pay in proportion to the probability, so they all carry the same house edge. The only measurably worse bet is the American five number bet covering zero, double zero, one, two and three, which costs the player roughly seven to eight percent.'
    },
    {
      q: 'Can a martingale or any system beat the house edge?',
      a: 'No. The expected value of a sequence of bets is the sum of the expected values of each bet, so no progression changes it. What a progression changes is the shape of the loss distribution, converting frequent small wins into one large loss that ends the session.'
    },
    {
      q: 'Should I play American or European roulette?',
      a: 'European, if you are choosing a table at all. The single zero versus double zero roughly doubles the house edge, and it is the single largest variable you control. French rules with la partage are better still.'
    },
    {
      q: 'Do roulette numbers repeat in patterns?',
      a: 'Spins are independent, so a past result has no bearing on the next one. Clumps and streaks are a normal property of random events over a long sequence, not evidence that the wheel is in a phase.'
    },
    {
      q: 'Is the roulette lab itself gambling?',
      a: 'No. The lab is a simulation and a calculator. No money is staked, no account is required and nothing on the page can be won or lost.'
    },
    {
      q: 'What is the most common roulette mistake?',
      a: 'Playing the double-zero wheel, or placing side bets such as insurance-style proposals and the five number bet. Both are decisions that raise the house edge while feeling more sophisticated than the even-money bet.'
    }
  ]
};