# -*- coding: utf-8 -*-
"""A97: Occult Apps and Privacy: What Your Data Says (Ours: Nothing)"""
from related_titles import RELATED_TITLES as RT

A97 = {
    'slug': 'occult-apps-and-privacy-what-your-data-says',
    'title': 'Occult Apps and Privacy: What Your Data Says (Ours: Nothing) (2026)',
    'index_title': 'Occult Apps and Privacy',
    'desc': 'Your divination history is intimate data. Most apps quietly collect it. Here is what your occult-app data says about you, and why ours collects nothing at all.',
    'keywords': 'occult app privacy, divination app data, magic app privacy policy, private tarot app, sigil app privacy, no tracking occult app',
    'date_iso': '2026-08-16',
    'date_display': 'August 16, 2026',
    'lastmod': '2026-08-16',
    'read_min': 9,
    'category': 'Digital Witchcraft',
    'excerpt': (
        "Every reading you log, every sigil you charge, every question you "
        "ask an oracle is intimate data. Some apps treat that as a product. "
        "Ours treat it as a secret. This guide explains what occult-app "
        "data reveals, what most apps do with it, and how to choose - and "
        "recognize - apps that collect nothing."
    ),
    'cta_apps': [['psi-gym', 'PSI GYM']],
    'related': [
        ['best-esp-training-apps-android', RT['best-esp-training-apps-android']],
        ['psi-gym-app-review', RT['psi-gym-app-review']],
        ['psi-gym-training-modes-guide', RT['psi-gym-training-modes-guide']],
        ['clairvoyance-test-online', RT['clairvoyance-test-online']],
    ],
    'references': [
        'Zuboff, S. (2019). The Age of Surveillance Capitalism.',
        'Mayer-Sch\u00f6nberger, V. (2009). Delete: The Virtue of Forgetting in the Digital Age.',
        'European Parliament (2016). General Data Protection Regulation (GDPR).',
    ],
    'howto': [
        {'name': 'Check the permission list first', 'text': 'A divination app needs almost no permissions. If it asks for contacts or location, ask why.'},
        {'name': 'Read the data section of the listing', 'text': 'Store listings declare what data an app collects. Look for "data not collected" - and treat "analytics" as a red flag.'},
        {'name': 'Test offline', 'text': 'Disable the network and use the app. If it works fully offline, your data cannot be leaving the device.'},
        {'name': 'Export before you trust', 'text': 'A privacy-respecting app lets you export your own archive. If you cannot take your data out, you do not own it.'},
    ],
    'toc': [
        ['start', 'Occult Apps and Privacy'],
        ['what-data-reveals', 'What Your Occult Data Reveals'],
        ['what-most-apps-do', 'What Most Apps Do With It'],
        ['ours-nothing', 'Ours: Nothing'],
        ['how-to-check', 'How to Check Any Occult App'],
        ['your-rights', 'Your Rights Over Your Data'],
        ['faq', 'FAQ'],
    ],
    'sections': [
        {'t': 'p', 'text': 'A tarot reading is not a shopping preference. A sigil charge is not a search query. Divination history, dream journals, and ritual logs are among the most intimate data a person can generate - they reveal beliefs, fears, and private questions. Yet most apps treat this as ordinary telemetry. This guide explains what that data says, what gets collected, and how to hold the line.', 'id': 'start'},
        {'t': 'h2', 'text': 'What Your Occult Data Reveals', 'id': 'what-data-reveals'},
        {'t': 'p', 'text': 'A log of your questions reveals what you worry about, what you hope for, and how you decide. Timestamps reveal your routines and when you are most vulnerable. Symbols and spirits you work with reveal your beliefs. Combined, it is a psychological profile with a calendar attached - exactly the data profile that advertising and insurance ecosystems pay for.'},
        {'t': 'h2', 'text': 'What Most Apps Do With It', 'id': 'what-most-apps-do'},
        {'t': 'p', 'text': 'The default in the app economy is collection: analytics SDKs, crash trackers, ad identifiers, and behavioral profiles. Even apps that never show an ad can ship those SDKs, and the data flows to third parties you never met. For intimate content like divination history, this is not acceptable engineering - it is a leak waiting to happen.'},
        {'t': 'ul', 'items': ['Analytics SDKs that log every screen and tap', 'Ad identifiers that link usage to a device profile', 'Third-party SDKs with unknown data destinations', 'Cloud sync that stores your archive on someone else\u2019s server'], 'id': 'what-most-apps-do'},
        {'t': 'h2', 'text': 'Ours: Nothing', 'id': 'ours-nothing'},
        {'t': 'p', 'text': 'Our policy is short because it is empty: we collect nothing. No analytics, no trackers, no ad identifiers, no accounts that store your archive. Your readings, sigils, and journals live on your device, under your control. There is no data to sell because there is no data to collect. Privacy here is not a feature - it is the architecture.'},
        {'t': 'h2', 'text': 'How to Check Any Occult App', 'id': 'how-to-check'},
        {'t': 'ol', 'items': ['Check the store listing\u2019s data-safety section for "data not collected"', 'Review requested permissions - divination needs almost none', 'Run the app offline and confirm full function', 'Look for export: if you cannot take data out, you do not own it', 'Search the policy for "third party" and "advertising"'], 'id': 'how-to-check'},
        {'t': 'h2', 'text': 'Your Rights Over Your Data', 'id': 'your-rights'},
        {'t': 'p', 'text': 'Under GDPR and similar laws, you have the right to know what is collected, to access it, and to demand deletion. Exercise those rights with any app that collects. For apps that collect nothing, the question dissolves - and that is the point.'},
        {'t': 'h2', 'text': 'FAQ', 'id': 'faq'},
    ],
    'faq': [
        ('How can an app work without collecting data?', 'The work - readings, sigils, journals - runs on your device. The app does not need a server for any of it. Offline processing is both more private and faster.'),
        ('What about cloud backup of my archive?', 'Only use backup you control: export to a file, or sync through a service you chose. An app silently holding your archive on its server is the data leak you are trying to avoid.'),
        ('Do free apps collect more than paid ones?', 'Often, because ads need identifiers. If a free occult app shows ads, assume it collects. Paid, offline, ad-free apps have no reason to collect anything.'),
    ],
}