# -*- coding: utf-8 -*-
"""A133: Our Privacy Policy Explained in Plain English"""
from related_titles import RELATED_TITLES as RT

A133 = {
    'slug': 'our-privacy-policy-explained-in-plain-english',
    'title': 'Our Privacy Policy Explained in Plain English (2026)',
    'index_title': 'Our Privacy Policy in Plain English',
    'desc': 'No trackers, no analytics, no accounts, no data sold. Here is what our privacy policy actually means in plain English - and how to verify it.',
    'keywords': 'privacy policy plain english, no tracking apps, offline apps privacy, no data collection, privacy friendly apps',
    'date_iso': '2026-08-16',
    'date_display': 'August 16, 2026',
    'lastmod': '2026-08-16',
    'read_min': 7,
    'category': 'About Us',
    'excerpt': (
        'Privacy policies are written by lawyers for lawyers. Ours '
        'can be summarized in one sentence: our apps collect nothing '
        'and send nothing. No analytics, no ad trackers, no accounts, '
        'no cloud sync you did not ask for. Everything you do in the '
        'app stays on your device. This page translates the official '
        'policy into plain English so you can verify each claim '
        'yourself, because trust you cannot check is not trust at all.'
    ),
    'cta_apps': [['astral-lab', 'Astral Lab']],
    'related': [
        ['why-stop-paying-subscription-occult-apps', RT['why-stop-paying-subscription-occult-apps']],
        ['true-cost-tarot-app-subscription-vs-onetime', RT['true-cost-tarot-app-subscription-vs-onetime']],
        ['psi-gym-app-review', RT['psi-gym-app-review']],
        ['norse-rune-oracle-app-review', RT['norse-rune-oracle-app-review']],
    ],
    'references': [
        'Google Play Data Safety form requirements (2025)',
        'GDPR Article 5: purpose limitation and data minimization (2016)',
        'OWASP MASVS Privacy requirements, release 2.0 (2024)',
    ],
    'howto': [
        {'name': 'Check the permissions list', 'text': 'Open the app page, tap About this app, then App permissions. Our apps ask for nothing beyond what they need to run - usually nothing at all.'},
        {'name': 'Test airplane mode', 'text': 'Put your phone in airplane mode and use the app. If every feature works offline, there is no hidden data call. That is the single best test.'},
        {'name': 'Read the Data Safety section', 'text': 'The Google Play Data Safety form is mandatory and searchable. Ours says no data collected. A screen tap is not data - that is how strict the standard is.'},
        {'name': 'Watch the network indicator', 'text': 'Install a simple firewall app or use your router logs. A truly offline app makes zero network connections, ever, even on first launch.'},
        {'name': 'Check for an account requirement', 'text': 'No sign-up, no email, no login. If an app forces an account, it is collecting something. Ours do not and never will.'},
    ],
    'toc': [
        ['start', 'Our Privacy Policy in Plain English'],
        ['the-short-version', 'The Short Version'],
        ['what-we-collect', 'What We Collect'],
        ['what-we-never-do', 'What We Never Do'],
        ['how-to-verify', 'How to Verify'],
        ['faq', 'FAQ'],
    ],
    'sections': [
        {'t': 'p', 'text': 'Every privacy policy is a promise. Ours is deliberately short because the behavior is deliberately simple: the apps are built to work without your data. Here is what that means in plain English.'},
        {'t': 'h2', 'text': 'The Short Version', 'id': 'the-short-version'},
        {'t': 'ul', 'items': [
            'We collect nothing: no usage stats, no crash logs, no analytics',
            'We sell nothing: there is no data to sell because none exists',
            'We store nothing: no accounts, no profiles, no cloud databases',
            'Everything stays on your device: your readings, your journal, your sigils',
            'No ads: no ad SDKs, which means no ad-tracking identifiers',
        ], 'id': 'the-short-version'},
        {'t': 'h2', 'text': 'What We Collect', 'id': 'what-we-collect'},
        {'t': 'p', 'text': 'The answer is: nothing that leaves your device. The apps process everything locally - a tarot shuffle, a rune draw, a dream journal entry never touches a server. The only data that exists is the data you see on your screen.'},
        {'t': 'h2', 'text': 'What We Never Do', 'id': 'what-we-never-do'},
        {'t': 'ul', 'items': [
            'No analytics SDKs - we do not know how often you open the app',
            'No advertising identifiers - there are no ads to personalize',
            'No email capture - you can buy and use without an account',
            'No third-party sharing - there is nothing to share',
            'No surveillance - offline means offline, verified by design',
        ], 'id': 'what-we-never-do'},
        {'t': 'h2', 'text': 'How to Verify', 'id': 'how-to-verify'},
        {'t': 'ol', 'items': [
            'Open Google Play and read the Data Safety section for any of our apps',
            'Install the app and put your phone in airplane mode - everything still works',
            'Check App permissions - you will see the app asks for little to nothing',
            'Use a firewall app or router log for one week and watch for zero connections',
            'Email support if anything looks off - we answer every message',
        ], 'id': 'how-to-verify'},
        {'t': 'p', 'text': 'Privacy by architecture, not by policy. We build offline-first because it is the only design that makes promises enforceable - and the Astral Lab app is built exactly that way.'},
        {'t': 'h2', 'text': 'FAQ', 'id': 'faq'},
    ],
    'faq': [
        ('How can an app work with no data at all?', 'Divination, journaling, and sigil tools are local computations. Shuffling cards or calculating moon phases needs no internet - the app is a tool, not a service.'),
        ('What about app updates and purchases?', 'The Play Store handles delivery and payment, not us. That is Google\'s transaction, not a data collection channel, and we never see payment details.'),
        ('Could the policy change later?', 'The architecture makes the promise permanent: offline apps cannot start phoning home without a rebuild that would be visible in every update. You would see it in the release notes.'),
    ],
}