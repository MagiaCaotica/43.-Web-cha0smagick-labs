[Sitemap](https://medium.com/sitemap/sitemap.xml)

[Open in app](https://play.google.com/store/apps/details?id=com.medium.reader&referrer=utm_source%3DmobileNavBar&source=---top_nav_layout_nav-----------------------------------------)

Sign up

[Sign in](https://medium.com/m/signin?operation=login&redirect=https%3A%2F%2Fmedium.com%2F%40jaxonevans%2F5-tools-that-got-my-indie-app-to-100-paying-customers-71fb46f544d9&source=post_page---top_nav_layout_nav-----------------------global_nav------------------)

[Medium Logo](https://medium.com/?source=---top_nav_layout_nav-----------------------------------------)

Get app

[Write](https://medium.com/m/signin?operation=register&redirect=https%3A%2F%2Fmedium.com%2Fnew-story&source=---top_nav_layout_nav-----------------------new_post_topnav------------------)

[Search](https://medium.com/search?source=---top_nav_layout_nav-----------------------------------------)

Sign up

[Sign in](https://medium.com/m/signin?operation=login&redirect=https%3A%2F%2Fmedium.com%2F%40jaxonevans%2F5-tools-that-got-my-indie-app-to-100-paying-customers-71fb46f544d9&source=post_page---top_nav_layout_nav-----------------------global_nav------------------)

![Unknown user](https://miro.medium.com/v2/resize:fill:32:32/1*dmbNkD5D-u45r44go_cf0g.png)

Indiedev

Bluesky Social

Blue Sky

Side Hustle

Flutter

# 5 Tools That Got My Indie App to 100 Paying Customers

[![Jaxon Evans](https://miro.medium.com/v2/resize:fill:32:32/1*vh8BpEiNT29F_7VlElkhiw.jpeg)](https://medium.com/@jaxonevans?source=post_page---byline--71fb46f544d9---------------------------------------)

[Jaxon Evans](https://medium.com/@jaxonevans?source=post_page---byline--71fb46f544d9---------------------------------------)

Follow

5 min read

·

Nov 11, 2025

3

[Listen](https://medium.com/m/signin?actionUrl=https%3A%2F%2Fmedium.com%2Fplans%3Fdimension%3Dpost_audio_button%26postId%3D71fb46f544d9&operation=register&redirect=https%3A%2F%2Fmedium.com%2F%40jaxonevans%2F5-tools-that-got-my-indie-app-to-100-paying-customers-71fb46f544d9&source=---header_actions--71fb46f544d9---------------------post_audio_button------------------)

Share

I launched [Boost Blue](https://onelink.to/boost-blue-me) 3 months ago, and last weekend passed a major milestone: 100 paying subscribers. It’s my first successful indie app, but far from the first I’ve built. Throughout those iterations I’ve landed on a set of tools that enable me to quickly get from 0 to 1.

### 1\. Flutter

The first tool has to be my development platform of choice: Flutter. I started my career as a native iOS developer and was firmly against cross-platform tools, until a team lead made us try Flutter for a week. I’ve never looked back. There are absolutely advantages to native development, but for indie development the additional user base made accessible by Flutter is too big an advantage to ignore.

Of course, Flutter isn’t the right choice for every app. Many indie developers make their niche “a really well-built native iOS app”. If that approach is going to carve out a comfortable user base for you on iOS, it could absolutely be worth it.

React Native offers many of the same benefits as Flutter. I just prefer Flutter personally; I find it easier and more enjoyable to build in.

### 2\. Firebase

I’m a mobile developer through and through. But apps need backends, and that requirement usually necessitates bringing on a backend engineer as a partner. That’s fine for a startup, but not ideal for an indie app you want to run solo. That’s where Firebase comes in; it’s **the** biggest cheat code for solo app developers.

Firebase’s main utility is in Firestore — its remote database. That would be enough to include it in this list, as it’s almost singlehandedly enabled me to build most of my projects, but Firebase has a whole suite of tools perfect for an indie developer. Getting them altogether, backed by Google, is just a bonus.

A Very Non Exhaustive List, and keeping explanations short:

**Authentication** Firebase Authentication supports sign-in by email or phone with confirmation codes, as well as popular providers like Google, Apple, Facebook, GitHub, etc.

**Analytics** Firebase Analytics is incredibly easy to set up. Simply initializing the library on startup will give you user and retention metrics, and from there you can log events to your heart’s content. The analytics platform is simple, and therefore a bit basic, but if you want more all of that data is also automatically imported into Google Analytics where you can dig much deeper.

**Push Notifications** There’s nothing special about Firebase Cloud Messaging, other than how easy it is to setup. It supports both bulk marketing messages and programmatically triggered notifications.

**Cloud Functions** Cloud Functions let you run backend logic with simple scripts in a few supported languages. They’re a great way to add backend functionality without fully committing to a separate backend service. Functions can be triggered by users, on a regular schedule, or in response to Firestore data changes.

## Get Jaxon Evans’s stories in your inbox

Join Medium for free to get updates from this writer.

Subscribe

Subscribe

Remember me for faster sign in

**A/B Testing** Firebase Remote Config lets you automatically segment users and compare results for any event or metric in Firebase Analytics.

### 3\. RevenueCat

RevenueCat is an incredible in-app purchase management platform. Before using RevenueCat, I implemented in-app purchases once. The experience was such a nightmare that in subsequent apps I avoided it at all costs, including skipping subscriptions as a monetization option (which was a mistake).

There’s a ton of work that goes into setting up in-app purchases from scratch — interfacing with the IAP libraries, tracking purchase or subscription status, and then building the purchase flow itself.

RevenueCat handles all of this. They provide prebuilt Paywalls you can configure to match your app’s brand. You can present them with a single line of code. That’s all you need to trigger a purchase. You can track a user’s subscription status by calling a single method. Of course you can use your own in-app payment flow in place of their paywalls. Building the UI will take more effort, but triggering a payment is just as simple.

They also provide comprehensive tracking tools to monitor all of your revenue metrics in one place, compared to the fragmented and often confusing dashboards from Apple and Google.

### 4\. Fly.io

A significant part of this list has been dedicated to avoiding the need for a backend. As an indie app developer, if you can avoid the added complexity, you should. But sometimes you can’t, or forcing functionality into Firebase ends up being more complex than doing it properly.

[Fly.io](https://fly.io/) is, in my experience, the easiest way to host a backend service. You still have to write the code, but Fly handles the handles the tricky infrastructure details. It’s a similar product to AWS or Google Cloud Platform, but way simpler — which is why I think it’s perfect for indie developers.

### 5\. Claude Code

This tool will by far be the most controversial on the list, but it’s also the one that I use the most. 6 months ago I was completely unsold on AI-assisted development. I tried several, but the quality of code mixed with subpar development environments always lost me. The day I tried Claude Code, I knew it was going to be the primary way I wrote code going forward.

To be clear, this isn’t “Vibe Coding”. I don’t just ask Claude to build me something. I give it very specific instructions on exactly what code it is to write. It isn’t replacing me. It lets me outline an idea and write hundreds of lines while I think through the next problem. I always review _every_ line it writes, since it doesn’t always follow instructions exactly..

It’s also great at finding bugs, to the point that I start my debugging process by describing the bug to Claude to see if it can find the issue first. But in keeping with the last paragraph, I’ll always make sure I understand the exact cause of the bug myself, and audit any suggested fix.

If you’ve gotten this far, thanks for reading! These tools have been indispensable in my app development, and I hope at least one of them is helpful for you. This is my first attempt at blogging in tech, something I’ve always wanted to do. If you enjoyed this feel free to follow along. You can also [connect with me on Bluesky](https://bsky.app/profile/jaxonevans.bsky.social), and please check out my latest app [Boost Blue](https://onelink.to/boost-leaflet)!

[Indiedev](https://medium.com/tag/indiedev?source=post_page---footer_tags--71fb46f544d9---------------------------------------)

[Bluesky Social](https://medium.com/tag/bluesky-social?source=post_page---footer_tags--71fb46f544d9---------------------------------------)

[Blue Sky](https://medium.com/tag/blue-sky?source=post_page---footer_tags--71fb46f544d9---------------------------------------)

[Side Hustle](https://medium.com/tag/side-hustle?source=post_page---footer_tags--71fb46f544d9---------------------------------------)

[Flutter](https://medium.com/tag/flutter?source=post_page---footer_tags--71fb46f544d9---------------------------------------)

[![Jaxon Evans](https://miro.medium.com/v2/resize:fill:48:48/1*vh8BpEiNT29F_7VlElkhiw.jpeg)](https://medium.com/@jaxonevans?source=post_page---post_author_info--71fb46f544d9---------------------------------------)

[![Jaxon Evans](https://miro.medium.com/v2/resize:fill:64:64/1*vh8BpEiNT29F_7VlElkhiw.jpeg)](https://medium.com/@jaxonevans?source=post_page---post_author_info--71fb46f544d9---------------------------------------)

Follow

[**Written by Jaxon Evans**](https://medium.com/@jaxonevans?source=post_page---post_author_info--71fb46f544d9---------------------------------------)

[82 followers](https://medium.com/@jaxonevans/followers?source=post_page---post_author_info--71fb46f544d9---------------------------------------)

· [19 following](https://medium.com/@jaxonevans/following?source=post_page---post_author_info--71fb46f544d9---------------------------------------)

Founder of Buzz Social: [https://onelink.to/xffsyf](https://onelink.to/xffsyf)

Follow

[Help](https://help.medium.com/hc/en-us?source=post_page-----71fb46f544d9---------------------------------------)

[Status](https://status.medium.com/?source=post_page-----71fb46f544d9---------------------------------------)

[About](https://medium.com/about?autoplay=1&source=post_page-----71fb46f544d9---------------------------------------)

[Careers](https://medium.com/jobs-at-medium/work-at-medium-959d1a85284e?source=post_page-----71fb46f544d9---------------------------------------)

[Press](mailto:pressinquiries@medium.com)

[Blog](https://blog.medium.com/?source=post_page-----71fb46f544d9---------------------------------------)

[Store](https://medium.com/store)

[Privacy](https://policy.medium.com/medium-privacy-policy-f03bf92035c9?source=post_page-----71fb46f544d9---------------------------------------)

[Rules](https://policy.medium.com/medium-rules-30e5502c4eb4?source=post_page-----71fb46f544d9---------------------------------------)

[Terms](https://policy.medium.com/medium-terms-of-service-9db0094a1e0f?source=post_page-----71fb46f544d9---------------------------------------)

[Text to speech](https://speechify.com/medium?source=post_page-----71fb46f544d9---------------------------------------)

reCAPTCHA

Recaptcha requires verification.

protected by **reCAPTCHA**