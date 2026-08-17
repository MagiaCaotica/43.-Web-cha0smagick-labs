# -*- coding: utf-8 -*-
"""A139: App Security: Where Your Data Lives (It Doesn't)"""
from related_titles import RELATED_TITLES as RT

A139 = {
    'slug': 'app-security-where-your-data-lives-it-doesnt',
    'title': "App Security: Where Your Data Lives (It Doesn't) (2026)",
    'index_title': "App Security: Where Your Data Lives (It Doesn't)",
    'desc': 'The honest answer to where your data lives in our apps: it does not. No servers, no accounts, no cloud. Here is the security model in plain terms.',
    'keywords': 'app security, data storage, no cloud apps, offline app security, where is my data, app data privacy, local storage app',
    'date_iso': '2026-08-16',
    'date_display': 'August 16, 2026',
    'lastmod': '2026-08-16',
    'read_min': 7,
    'category': 'About Us',
    'excerpt': (
        'Most apps store your data somewhere: a server, a cloud '
        'account, a marketing database. Our apps do not, because '
        'there is nowhere to store it. The data lives on your '
        'device, in your hands, and nowhere else. That is the '
        'whole security model, and it is worth explaining in '
        'plain terms - what stays on your phone, what never '
        'leaves it, and how you can verify both claims in about '
        'five minutes.'
    ),
    'cta_apps': [['arcana-goetia', 'Arcana Goetia']],
    'related': [
        ['arcana-goetia-app-review', RT['arcana-goetia-app-review']],
        ['goetia-seals-and-sigils-guide', RT['goetia-seals-and-sigils-guide']],
        ['why-stop-paying-subscription-occult-apps', RT['why-stop-paying-subscription-occult-apps']],
        ['true-cost-tarot-app-subscription-vs-onetime', RT['true-cost-tarot-app-subscription-vs-onetime']],
    ],
    'references': [
        'OWASP Mobile Application Security Verification Standard (2024)',
        'Google Play Data Safety policy (2025)',
        'GDPR Article 5: Principles relating to processing of personal data (2016)',
    ],
    'howto': [
        {'name': 'Check the permission list', 'text': 'Before installing, look at what the app asks for. A divination app should not need contacts, location, or microphone access. Ours ask for nothing but storage for optional exports.'},
        {'name': 'Test in airplane mode', 'text': 'Turn on airplane mode, open the app, and use every feature. If it all works, the app does not depend on a server. That is the fastest security check there is.'},
        {'name': 'Read the Data Safety section', 'text': 'The Play Store listing has a Data Safety section on every app. It will say whether data is collected, shared, or encrypted. Read it before you install, not after.'},
        {'name': 'Watch the network indicator', 'text': 'Your phone shows a network icon when apps send data. A local-only app never lights it up during normal use. If you see traffic, ask why.'},
        {'name': 'Know your export options', 'text': 'When you can back up, it should be your choice and your file. Our apps offer optional exports you control - never automatic uploads to a service you did not pick.'},
    ],
    'toc': [
        ['start', 'App Security: Where Your Data Lives'],
        ['the-model', 'The Security Model'],
        ['what-stays-local', 'What Stays on Your Device'],
        ['what-never-happens', 'What Never Happens'],
        ['how-to-verify', 'How to Verify It Yourself'],
        ['faq', 'FAQ'],
    ],
    'sections': [
        {'t': 'p', 'text': 'The shortest version of our security model: your data lives on your device, and nowhere else. This page explains what that means in practice, what the apps never do, and how you can verify it yourself in about five minutes.'},
        {'t': 'h2', 'text': 'The Security Model', 'id': 'the-model'},
        {'t': 'p', 'text': 'Security is usually a list of defenses: encryption, firewalls, audits. Ours is simpler - there is nothing to protect on a server because there is no server. When an app processes a tarot spread, a sigil, or a dream log, the computation happens on your phone and the result stays there. The absence of infrastructure is the security measure.'},
        {'t': 'ul', 'items': [
            'No servers, no cloud sync, no accounts to hack',
            'All processing happens locally on your device',
            'Data is stored only in the app sandbox on your phone',
            'Backups are optional exports that you create and control',
            'No analytics SDKs, no ad SDKs, no third-party trackers',
        ], 'id': 'the-model'},
        {'t': 'h2', 'text': 'What Stays on Your Device', 'id': 'what-stays-local'},
        {'t': 'p', 'text': 'The intimate stuff - your readings, your sigils, your dream journal, your ESP scores - stays in the app sandbox. That is the same private storage area every Android app gets, readable only by the app itself. If you uninstall the app, the data goes with it unless you exported it first.'},
        {'t': 'ul', 'items': [
            'Reading history and journals: app sandbox only',
            'Sigils and charged intentions: app sandbox only',
            'Dream logs and projection notes: app sandbox only',
            'ESP session scores and progress: app sandbox only',
            'Optional exports: files you create and store where you choose',
        ], 'id': 'what-stays-local'},
        {'t': 'h2', 'text': 'What Never Happens', 'id': 'what-never-happens'},
        {'t': 'p', 'text': 'It helps to state the negatives explicitly, because most apps do these things. Ours do not - by design, not by policy. The architecture makes them impossible, which is stronger than a promise.'},
        {'t': 'ul', 'items': [
            'Never uploaded to a company server',
            'Never synced to a cloud account you did not create',
            'Never sold, shared, or used for advertising profiles',
            'Never read by us - we have no way to reach your device data',
            'Never locked behind an account that can be shut down',
        ], 'id': 'what-never-happens'},
        {'t': 'h2', 'text': 'How to Verify It Yourself', 'id': 'how-to-verify'},
        {'t': 'ol', 'items': [
            'Open the Play Store listing and read the Data Safety section',
            'Check the permission list - ours request nothing sensitive',
            'Install the app, enable airplane mode, and use every feature',
            'Watch for network activity during normal use (there will be none)',
            'Export and delete your data to confirm you control it',
        ], 'id': 'how-to-verify'},
        {'t': 'p', 'text': 'Arcana Goetia is a good example of the model in practice: an offline reference for the 72 spirits, their seals, and working notes. Everything you record stays on your phone. If your practice involves names, seals, and notes you would rather keep private, that is exactly the kind of data that belongs nowhere but your pocket.'},
        {'t': 'h2', 'text': 'FAQ', 'id': 'faq'},
    ],
    'faq': [
        ('Where exactly is my data stored?', 'In the app sandbox on your own device - the private storage area Android gives each app. There is no server copy anywhere.'),
        ('What happens if I uninstall an app?', 'The local data is removed with the app, unless you exported it first. Exports are files you create and control, so your record survives if you want it to.'),
        ('Can you see my data if I email support?', 'No. We have no access to your device or its sandbox. If you email us about a reading or a log, only what you choose to paste into the email reaches us.'),
    ],
}