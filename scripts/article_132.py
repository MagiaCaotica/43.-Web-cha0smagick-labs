# -*- coding: utf-8 -*-
"""A132: Why We Don't Do Subscriptions (And Never Will)"""
from related_titles import RELATED_TITLES as RT

A132 = {
    'slug': 'why-we-dont-do-subscriptions-and-never-will',
    'title': "Why We Don't Do Subscriptions (And Never Will) (2026)",
    'index_title': "Why We Don't Do Subscriptions",
    'desc': 'Every Cha0smagick Labs app is a one-time purchase. No subscriptions, no ads, no account required. Here is the reasoning, the math, and the promise.',
    'keywords': 'no subscription apps, one-time purchase apps, occult apps no subscription, why no subscriptions, app pricing honesty',
    'date_iso': '2026-08-16',
    'date_display': 'August 16, 2026',
    'lastmod': '2026-08-16',
    'read_min': 7,
    'category': 'About Us',
    'excerpt': (
        'Every app we make is a one-time purchase. No subscription, '
        'no ads, no account, no \u201cpremium tier\u201d that actually '
        'contains the features you paid to unlock. This is a deliberate '
        'business decision, not an accident of generosity. Subscriptions '
        'create a permanent conflict of interest: the app stops being '
        'designed for you and starts being designed for next month\'s '
        'payment. Here is why we refuse to do it, how the math works '
        'for us, and the promise we make instead.'
    ),
    'cta_apps': [['chaos-sigil-generator', 'Chaos Sigil Generator']],
    'related': [
        ['why-stop-paying-subscription-occult-apps', RT['why-stop-paying-subscription-occult-apps']],
        ['true-cost-tarot-app-subscription-vs-onetime', RT['true-cost-tarot-app-subscription-vs-onetime']],
        ['dream-machine-app-review', RT['dream-machine-app-review']],
        ['arcana-goetia-app-review', RT['arcana-goetia-app-review']],
    ],
    'references': [
        'Google Play Billing policy on subscription disclosure (2025)',
        'FTC on negative option marketing and cancellation (2024)',
        'Cha0smagick Labs pricing FAQ, published in-app',
    ],
    'howto': [
        {'name': 'Check the price once', 'text': 'Every app shows its full price on the store page before you install. What you see is what you pay, forever.'},
        {'name': 'Verify no account needed', 'text': 'Install, open, use. No sign-up, no email, no \u201cfree trial\u201d that becomes a charge.'},
        {'name': 'Test offline', 'text': 'Our apps work in airplane mode. If a tool needs a server, it stops being yours.'},
        {'name': 'Expect updates', 'text': 'One-time purchase includes updates. We do not gate bug fixes behind a new payment.'},
        {'name': 'Read the refund policy', 'text': 'If you do not like it, you get your money back. That is the trust model.'},
    ],
    'toc': [
        ['start', 'The Subscription Trap'],
        ['the-conflict', 'The Conflict of Interest'],
        ['the-math', 'The Honest Math'],
        ['the-promise', 'The Promise'],
        ['faq', 'FAQ'],
    ],
    'sections': [
        {'t': 'p', 'text': 'Subscriptions are everywhere in the occult app space: $9.99 a month for tarot, $14.99 a month for dream tracking. After a year, a $9.99 app has cost you $120 - and you own nothing. We think that is a bad deal for you and a worse incentive for us.'},
        {'t': 'h2', 'text': 'The Conflict of Interest', 'id': 'the-conflict'},
        {'t': 'p', 'text': 'A subscription business is optimized to keep you paying, not to serve you. Features get locked behind tiers, ads get inserted to justify the \u201cfree\u201d version, and data gets collected because retention metrics demand it. Every one of those incentives is opposed to your interests as a practitioner.'},
        {'t': 'ul', 'items': [
            'Subscription apps profit from your forgetfulness - you forget to cancel',
            'Freemium apps profit from your frustration - the good features sit behind the paywall',
            'Ad-supported apps profit from your attention - they mine it and sell it',
            'We profit only when you decide the app was worth its one-time price',
        ], 'id': 'the-conflict'},
        {'t': 'h2', 'text': 'The Honest Math', 'id': 'the-math'},
        {'t': 'p', 'text': 'Our apps cost $3.99 to $14.99, once. If a $9.99 tarot app lasts you two years, that is about 42 cents a month - less than the price of a single subscription month elsewhere, and you own the app outright. We make less per user over time; we accept that because we would rather have customers who recommend us than subscribers who resent us.'},
        {'t': 'h2', 'text': 'The Promise', 'id': 'the-promise'},
        {'t': 'ol', 'items': [
            'One price, shown in full before you buy',
            'No account, no email, no data collection to justify a server',
            'No hidden tier - every feature is in the app you buy',
            'Updates included, forever',
            'No ads, now or ever',
            'A real refund if it is not for you',
        ], 'id': 'the-promise'},
        {'t': 'p', 'text': 'This is not a marketing gimmick - it is the entire business model. The Chaos Sigil Generator app, like every app we ship, is a single purchase you make once and own. That is the deal.'},
        {'t': 'h2', 'text': 'FAQ', 'id': 'faq'},
    ],
    'faq': [
        ('Will you ever add subscriptions?', 'No. The business is designed around one-time purchases. If we ever change that, we will change it in public, in writing, before anything ships.'),
        ('How do you make money then?', 'Volume and trust. A fair one-time price plus honest reviews earns recommendations, and recommendations are the only marketing we do.'),
        ('What about updates?', 'Updates are included in the purchase. We do not split the app into a base version and a paid update.'),
    ],
}