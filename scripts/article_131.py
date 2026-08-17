# -*- coding: utf-8 -*-
"""A131: How We Test Occult Apps: Our Methodology"""
from related_titles import RELATED_TITLES as RT

A131 = {
    'slug': 'how-we-test-occult-apps-our-methodology',
    'title': 'How We Test Occult Apps: Our Methodology (2026)',
    'index_title': 'How We Test Occult Apps: Our Methodology',
    'desc': 'Every app review on this site follows the same 7-step test. Here is the methodology we use, why it matters, and what we refuse to test.',
    'keywords': 'app testing methodology, occult app review process, how we test apps, app review criteria, fair app reviews',
    'date_iso': '2026-08-16',
    'date_display': 'August 16, 2026',
    'lastmod': '2026-08-16',
    'read_min': 8,
    'category': 'About Us',
    'excerpt': (
        'Every app review on Cha0smagick Labs follows the same '
        'seven-step test. That is not a marketing phrase - it is a '
        'promise you can verify. We install the app on a clean device, '
        'run it offline, test every core feature, check the permission '
        'list, measure battery and storage impact, and only then form '
        'an opinion. We also refuse to test anything we cannot verify: '
        'no claims about spirits, luck, or the supernatural are ever '
        'treated as features. Here is the exact methodology, in the '
        'order we apply it.'
    ),
    'cta_apps': [['unofficial-rider-waite-tarot', 'Rider-Waite Tarot']],
    'related': [
        ['best-esp-training-apps-android', RT['best-esp-training-apps-android']],
        ['best-lucid-dreaming-apps-android-2026', RT['best-lucid-dreaming-apps-android-2026']],
        ['best-tarot-apps-android-2026', RT['best-tarot-apps-android-2026']],
        ['best-ghost-hunting-apps-android-2026', RT['best-ghost-hunting-apps-android-2026']],
    ],
    'references': [
        'Google Play Developer Policy on deceptive behavior (2025)',
        'OWASP Mobile Application Security Verification Standard (2024)',
        'FTC Guides Concerning Use of Endorsements and Testimonials (2023)',
    ],
    'howto': [
        {'name': 'Clean device install', 'text': 'Every app is tested on a fresh Android install with no other apps present, so nothing contaminates the result.'},
        {'name': 'Offline test first', 'text': 'We run every core feature with airplane mode on. If an app needs network to work, that is a finding, not a feature.'},
        {'name': 'Permission audit', 'text': 'We list every permission the app requests and flag anything unrelated to its function. A tarot app does not need your contacts.'},
        {'name': 'Battery and storage', 'text': 'We measure background battery drain over 48 hours and installed size. Small, efficient apps score higher.'},
        {'name': 'Feature depth', 'text': 'We test every advertised feature twice: once per the manual, once the way a real user would discover it.'},
        {'name': 'Price honesty', 'text': 'We verify the price is truly one-time, check for hidden subscriptions, and confirm refund behavior before review.'},
    ],
    'toc': [
        ['start', 'The Methodology'],
        ['seven-steps', 'The Seven Steps'],
        ['what-we-refuse', 'What We Refuse to Test'],
        ['why-it-matters', 'Why It Matters'],
        ['faq', 'FAQ'],
    ],
    'sections': [
        {'t': 'p', 'text': 'A review is only as trustworthy as the process behind it. This page is the process. Every rating on this site came from the same seven steps, applied in the same order, by the same standards.'},
        {'t': 'h2', 'text': 'The Seven Steps', 'id': 'seven-steps'},
        {'t': 'ol', 'items': [
            'Install on a clean Android device with no other apps present',
            'Run every core feature in airplane mode and record what still works',
            'Audit the permission list and flag anything unrelated to the app\'s function',
            'Measure installed size and 48-hour background battery drain',
            'Test every advertised feature twice: by the manual, then by real-user discovery',
            'Verify pricing: one-time, no hidden subscription, no surprise upsells',
            'Write the review with the raw test log attached, not from memory',
        ], 'id': 'seven-steps'},
        {'t': 'h2', 'text': 'What We Refuse to Test', 'id': 'what-we-refuse'},
        {'t': 'p', 'text': 'We never rate the supernatural. Whether a tarot reading feels accurate, a sigil \u201cworks,\u201d or a spirit box communicates is not testable in a reproducible way, so it never enters our scoring. We review the app: its features, its honesty, its price, its privacy. The magic is yours to judge.'},
        {'t': 'ul', 'items': [
            'No scoring of accuracy, luck, or paranormal effectiveness',
            'No claims about what spirits, fate, or the universe \u201cintend\u201d',
            'No paid placements: we never charge for reviews and never accept free copies with strings',
            'No anonymous testing: the same standard applies to our own apps as to any other',
        ], 'id': 'what-we-refuse'},
        {'t': 'h2', 'text': 'Why It Matters', 'id': 'why-it-matters'},
        {'t': 'p', 'text': 'The occult app space is full of subscriptions, data harvesting, and inflated claims. A shared, published methodology is the only defense. We publish ours so you can check it, and we apply it to our own apps - the Rider-Waite Tarot app included - exactly as we would to anyone else\'s.'},
        {'t': 'p', 'text': 'If you are comparing apps, use the methodology on this page as your own checklist. It takes ten minutes and saves you from the subscription trap.'},
        {'t': 'h2', 'text': 'FAQ', 'id': 'faq'},
    ],
    'faq': [
        ('Do you get paid for reviews?', 'No. We never charge for reviews, never accept payment for placement, and disclose any relationship - including when the app is our own - in the review itself.'),
        ('Do you review your own apps?', 'Yes, and they are held to the exact same seven steps. If anything, we are harder on ourselves because the stakes are trust.'),
        ('Can an app fail the methodology?', 'Yes, and it has. Apps with irrelevant permissions, hidden subscriptions, or broken offline modes are rated down regardless of how pretty they look.'),
    ],
}