# -*- coding: utf-8 -*-
"""A122: ESP Test Statistics Explained for Beginners"""
from related_titles import RELATED_TITLES as RT

A122 = {
    'slug': 'esp-test-statistics-explained-for-beginners',
    'title': 'ESP Test Statistics Explained for Beginners (2026)',
    'index_title': 'ESP Test Statistics Explained for Beginners',
    'desc': 'ESP test statistics sound harder than they are. Chance is 1 in 5; here is how to read a score, what p-values mean, and what research shows.',
    'keywords': 'esp statistics, esp test, zener card statistics, p value esp, psi research, chance baseline esp',
    'date_iso': '2026-08-16',
    'date_display': 'August 16, 2026',
    'lastmod': '2026-08-16',
    'read_min': 8,
    'category': 'ESP & Science',
    'excerpt': (
        'ESP test statistics intimidate beginners, but the core ideas fit on one page. '
        'In a Zener card test you have a 1-in-5 chance per guess, so a 25-card run '
        'has an expected score of 5 hits. Any deviation above or below 5 is measured '
        'against how often luck would produce it. This guide explains the chance '
        'baseline, how to read a score, what p-values mean in plain English, and '
        'what the research actually shows.'
    ),
    'cta_apps': [
        ['psi-gym', 'PSI GYM'],
    ],
    'related': [
        ['scientific-studies-zener-cards-esp-validation', RT['scientific-studies-zener-cards-esp-validation']],
        ['zener-card-test-score-meaning', RT['zener-card-test-score-meaning']],
        ['zener-cards-esp-training-guide', RT['zener-cards-esp-training-guide']],
        ['psi-gym-training-modes-guide', RT['psi-gym-training-modes-guide']],
    ],
    'references': [
        'Rhine, J. B. (1934). Extra-Sensory Perception. Boston Society for Psychic Research.',
        'Utts, J. (1991). Replication and meta-analysis in parapsychology. Statistical Science, 6(4), 363-387.',
        'Bem, D. J. (2011). Feeling the future. Journal of Personality and Social Psychology, 100(3), 407-425.',
    ],
    'howto': [
        {'name': 'Know the baseline', 'text': 'In any 5-choice ESP test, luck alone scores 20%. Everything else is measured as deviation from that baseline.'},
        {'name': 'Run a full session', 'text': 'A standard session is 25 trials. Expected hits are 5. Record your actual hits and the difference.'},
        {'name': 'Do not trust one run', 'text': 'One high run is weak evidence. Luck produces impressive streaks constantly; only repeated runs count.'},
        {'name': 'Compute simple deviation', 'text': 'Keep a running total of hits minus expected hits across sessions. A steady climb is the pattern that matters.'},
        {'name': 'Understand p-values loosely', 'text': 'A p-value below 0.05 means the result would happen by chance less than 5% of the time - a threshold, not proof.'},
        {'name': 'Log everything', 'text': 'Record date, protocol, and score for every session. Apps like PSI GYM keep this history automatically.'},
    ],
    'toc': [
        ['start', 'ESP Test Statistics Explained'],
        ['the-chance-baseline', 'The Chance Baseline'],
        ['reading-a-score', 'Reading a Score'],
        ['p-values-in-plain-english', 'P-Values in Plain English'],
        ['what-the-research-shows', 'What the Research Shows'],
        ['your-own-numbers', 'Your Own Numbers'],
        ['faq', 'FAQ'],
    ],
    'sections': [
        {'t': 'p', 'text': 'ESP test statistics come down to one question: how often would this score happen by luck alone? If a score is far enough from chance, researchers take it seriously. If it sits near chance, it is ordinary fluctuation. The math is simple once you know the baseline.'},
        {'t': 'h2', 'text': 'The Chance Baseline', 'id': 'the-chance-baseline'},
        {'t': 'p', 'text': 'In the classic Zener card test, each guess has five possible answers and one correct symbol, so the chance of a hit is exactly 1 in 5, or 20%. Over a 25-card run, luck alone produces an average of 5 hits. That number - 5 out of 25 - is the reference point for everything else.'},
        {'t': 'table', 'headers': ['Term', 'Plain Meaning'], 'rows': [
            ['Chance baseline', 'The score expected by luck alone (5 of 25, or 20%)'],
            ['Hit', 'A correct guess in one trial'],
            ['Deviation', 'Actual hits minus expected hits (+3 means 8 hits in 25)'],
            ['p-value', 'The probability that luck alone produced the score'],
            ['Significant', 'Research shorthand for p below 0.05'],
        ]},
        {'t': 'h2', 'text': 'Reading a Score', 'id': 'reading-a-score'},
        {'t': 'p', 'text': 'Suppose you score 8 hits in a 25-card run. Your deviation is +3. Is that meaningful? Alone, no: luck produces a deviation of +3 or more in about one in five runs. You need many runs. If you keep scoring 8 out of 25 across ten sessions, the combined pattern becomes statistically interesting.'},
        {'t': 'h2', 'text': 'P-Values in Plain English', 'id': 'p-values-in-plain-english'},
        {'t': 'p', 'text': 'A p-value answers: if there were no ESP at all, how often would chance produce a result at least this extreme? A p-value of 0.01 means a 1% chance. Researchers use 0.05 as the conventional cutoff. A low p-value does not prove ESP; it says the result is unlikely under the luck-only model, which forces a closer look at method and replication.'},
        {'t': 'h2', 'text': 'What the Research Shows', 'id': 'what-the-research-shows'},
        {'t': 'ul', 'items': [
            'Early Rhine-era studies reported striking above-chance results, but later replications were mixed and criticized for sensory leakage and selective reporting.',
            'Meta-analyses of forced-choice ESP studies (Utts, 1991) found a small but consistent overall effect, with a vocal debate about file-drawer bias.',
            'Bem (2011) reported significant retroactive priming effects across nine experiments; replication attempts produced mixed results.',
            'The mainstream scientific consensus remains that no repeatable, protocol-proof ESP effect has been demonstrated.',
            'For a practitioner, the honest takeaway is: train consistently, log rigorously, and let the long-run numbers - not single sessions - speak.',
        ]},
        {'t': 'h2', 'text': 'Your Own Numbers', 'id': 'your-own-numbers'},
        {'t': 'p', 'text': 'The same statistics apply to your personal practice. Run 25-trial sessions, record the score, and watch your cumulative deviation. If you want the math handled for you, PSI GYM automates scoring and tracks your history across hundreds of sessions so you can see the long-run pattern without doing arithmetic.'},
        {'t': 'h2', 'text': 'FAQ', 'id': 'faq'},
    ],
    'faq': [
        ('What is a good ESP test score?', 'A good score is one you can replicate. Chance is 5 of 25; anything above that is above-chance, but a single session proves nothing. Consistent positive deviation across hundreds of trials is what matters.'),
        ('What does a p-value of 0.05 mean?', 'It means that, if there were no real effect, luck alone would produce a result at least this extreme only 5% of the time. It is a research threshold, not proof of ESP.'),
        ('Can I train my ESP score?', 'You can train the protocol: focus, consistency, and honest logging. Whether that raises true ESP or simply reduces noise, a steady practice with feedback is the only way to find out.'),
    ],    'verified_by': [
        ('p below 0.05 marks significance', 'Standard statistics'),
        ('Small but consistent meta-analytic effect', 'Utts, Statistical Science (1991)'),
    ],
}