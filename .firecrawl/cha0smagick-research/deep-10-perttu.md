[Skip to main content](https://perttu.dev/articles/how-to-make-money-with-your-android-app#main-content)

![How to make money with your Android app](https://perttu.dev/_next/image?url=%2Fimages%2Farticles%2Fhow-to-make-money-with-your-android-app%2Fcover.jpg&w=3840&q=75)

[![Perttu Lähteenlahti](https://perttu.dev/_next/image?url=%2Fimages%2Favatar.jpg&w=96&q=75)Perttu LähteenlahtiBuilding mobile apps and monetizing them · Cognitive scientist](https://perttu.dev/about)

![](https://perttu.dev/_next/static/media/claude.88e6de0e.svg)

Contents

- [Introduction](https://perttu.dev/articles/how-to-make-money-with-your-android-app#introduction)
- [I'm too lazy to read, show me the video](https://perttu.dev/articles/how-to-make-money-with-your-android-app#im-too-lazy-to-read-show-me-the-video)
- [Why monetizing an app is hard, especially when it’s on android](https://perttu.dev/articles/how-to-make-money-with-your-android-app#why-monetizing-an-app-is-hard-especially-when-its-on-android)
- [1\. Users expect free apps](https://perttu.dev/articles/how-to-make-money-with-your-android-app#1-users-expect-free-apps)
- [2\. Implementation complexity](https://perttu.dev/articles/how-to-make-money-with-your-android-app#2-implementation-complexity)
- [3\. Android apps earn less on average](https://perttu.dev/articles/how-to-make-money-with-your-android-app#3-android-apps-earn-less-on-average)
- [Options for monetizing on Android](https://perttu.dev/articles/how-to-make-money-with-your-android-app#options-for-monetizing-on-android)
- [1\. Advertising: simple but scale-dependent](https://perttu.dev/articles/how-to-make-money-with-your-android-app#1-advertising-simple-but-scale-dependent)
- [2\. One-time purchases: simple value exchange](https://perttu.dev/articles/how-to-make-money-with-your-android-app#2-one-time-purchases-simple-value-exchange)
- [3\. Subscriptions: the gold standard](https://perttu.dev/articles/how-to-make-money-with-your-android-app#3-subscriptions-the-gold-standard)
- [4\. Virtual Currencies: build your own economy](https://perttu.dev/articles/how-to-make-money-with-your-android-app#4-virtual-currencies-build-your-own-economy)
- [Hybrid monetization strategies](https://perttu.dev/articles/how-to-make-money-with-your-android-app#hybrid-monetization-strategies)
- [Building your subscriptions infrastructure](https://perttu.dev/articles/how-to-make-money-with-your-android-app#building-your-subscriptions-infrastructure)
- [Buying your subscription infrastructure](https://perttu.dev/articles/how-to-make-money-with-your-android-app#buying-your-subscription-infrastructure)
- [Adding RevenueCat to your Android project](https://perttu.dev/articles/how-to-make-money-with-your-android-app#adding-revenuecat-to-your-android-project)
- [Keep more revenue by purchasing on web](https://perttu.dev/articles/how-to-make-money-with-your-android-app#keep-more-revenue-by-purchasing-on-web)
- [Final thoughts](https://perttu.dev/articles/how-to-make-money-with-your-android-app#final-thoughts)
- [Related articles](https://perttu.dev/articles/how-to-make-money-with-your-android-app#related-articles)

## Introduction

Building a great Android app takes time, creativity, and persistence. But once your app is live, there’s one question every developer eventually faces: **how do I actually make money from this?**

Android developers often struggle with monetization more than iOS developers. Not only are [Android users statistically less likely to pay for apps](https://wezom.com/blog/iphone-vs-android-users-key-differences-in-2025), but implementing in-app purchases or subscriptions comes with technical and operational hurdles that can overwhelm solo devs or small teams.

This guide breaks down **every major Android monetization model that brings in recurring revenue**, explains why some apps succeed while others fail, and walks through practical implementation strategies using RevenueCat.

I work for RevenueCat and this article has a section outlining why you should use RevenueCat to handle in-app purchases. You can of course implement monetization in your app in multiple ways. However if you decide to go with RevenueCat, and need help setting up, don't be afraid to get in touch.

## I'm too lazy to read, show me the video

I got ya, here is the video version of this article from Droidcon London 2025 and Droidcon Berlin 2025:

Monetize your Android app the right way - Perttu Lähteenlahti \| droidcon London 2025 - YouTube

Tap to unmute

[Monetize your Android app the right way - Perttu Lähteenlahti \| droidcon London 2025](https://www.youtube.com/watch?v=RG1qMNt9vuo) [nextapp devCon](https://www.youtube.com/channel/UCF4O2pQ8vBV8YmSAWb5QRPw)

nextapp devCon5.64K subscribers

Monetize your Android app the right way - Perttu Lähteenlahti \| droidcon Berlin 2025 - YouTube

Tap to unmute

[Monetize your Android app the right way - Perttu Lähteenlahti \| droidcon Berlin 2025](https://www.youtube.com/watch?v=fNsIYaR8jcE) [nextapp devCon](https://www.youtube.com/channel/UCF4O2pQ8vBV8YmSAWb5QRPw)

![thumbnail-image](https://yt3.ggpht.com/N_brjBikLVMvdohpr3SauwH1550-iKQBnqLdGptgxDqtl9v0C9NU4sQ9inQ6J3vrc3alLpdDhQ=s68-c-k-c0x00ffffff-no-rj)

nextapp devCon5.64K subscribers

## Why monetizing an app is hard, especially when it’s on android

There are three main challenges developers face when trying to earn money from Android apps.

### 1\. Users expect free apps

Unlike iOS users, Android users have been conditioned to expect free experiences. Many come from markets where disposable income is lower, and a large portion of the Android ecosystem runs on ad-supported or open-source apps.

Looking at top selling Android phones, which are usually priced in a few hundreds dollars, it’s no wonder most users expect apps in their phones for free. When compared, a 50 dollar yearly subscription feels way more expensive on a Samsung A16 costing 150 dollars, than on the cheapest iPhone (16E) priced at 600 dollars.

Possibly for this reason developers on Android often see one-star reviews the moment they move previously free features behind a paywall. It’s more than likely that these reviews come from users who genuinely like the app, but resent being asked to pay. Winning over these users requires convincing users your app is worth supporting.

### 2\. Implementation complexity

Monetizing users is hard, but adding monetization to your app isn’t easy either. Even adding in-app purchases or subscriptions isn’t a plug-and-play process, often requiring:

- A backend service for validating receipts.
- Logic for managing active and expired subscriptions.
- Handling user authentication and cross-device restoration.
- Keeping up with Google Play Billing API changes.
- Navigating regulatory requirements like EU subscription rules.

It is not uncommon to come across large teams in big companies, whose sole purpose is to develop and maintain the in-app purchase infrastructure of the company’s Android app. Google Play Billing provides a lot of functionality out of the box, but you still need to build a lot around that API to provide a great purchasing experience.

Even if you build it perfectly once, you’ll need to maintain it as well, which will likely be an even bigger time sink. Every API change or edge case can break your monetization flow and cost you real money. For indie developers, this kills a lot of momentum from delivering features, not to mention the way it eats up motivation, when you’re forced to build “boring stuff” (you have to be a real sicko to enjoy working with Google Play Billing API’s).

### 3\. Android apps earn less on average

Combing through the data of RevenueCat’s State of Subscription Apps highlights the difficulties of monetizing Android apps through subscriptions. Even with similar user bases, Android apps tend to earn less than their iOS counterparts:

[![Trial Start Rate, By Store chart from RevenueCat State of Subscription Apps 2025](https://perttu.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fsosa.64474c0e.png&w=3840&q=75&dpl=dpl_J2uSo3AaVax7N7VL33mkPzeeopSq)](https://www.revenuecat.com/state-of-subscription-apps-2025/)

**Fewer people start trials on Google Play** than on the App Store. Even at the high end, only about 14% of users start a trial on Google Play, compared to roughly 23% on the App Store. Revenue per install is also significantly lower on Android apps than iOS in general. However top performers on Android do see comparable revenue to iOS.

So even though monetizing Android apps is certainly possible, it is way way harder than on iOS. Boringly, the playbook for making money is the same on both platforms: building high quality apps, addressing a real need, and having the right monetization strategy. Let’s look at the last point in the next section.

## Options for monetizing on Android

Right off the bat: there is no single perfect monetization method. What works, when and how, depends on a variety of things. Successful apps often combine several different strategies. Here’s how to think about each approach.

### 1\. Advertising: simple but scale-dependent

Everyone on Android knows ads. As an iOS person it feels like every Android app has ads in it. When I’ve done roundtables in Android conferences, it seems that more devs have ads in their apps than in-app purchases. Ads are the easiest way to start earning money. Integrate AdMob, AppLovin, or another ad network, and you’ll begin to see small amounts of revenue per user.

However, the problem with ads is the scale they require to turn any meaningful revenue. If you take the [1,000 true fans hypothesis](https://kk.org/thetechnium/1000-true-fans/) and make those fans pay in the form of ad clicks, you’re making only between $1 and $10 every month.

If your app has a viral or casual audience — games, wallpapers, entertainment — ads can work well. For productivity or paid tools, they tend to feel intrusive.

**Pros:**

- Easy to implement.
- Works for completely free apps.
- Passive, recurring income.

**Cons:**

- You need massive user volume to make meaningful money.
- Ads can hurt the UX and damage your brand.
- Doesn’t scale well for niche or professional apps.

### 2\. One-time purchases: simple value exchange

Google Play Store supports two types of **One-time products, consumables** and **non-consumables**; former you can use for recurring revenue, latter for one time unlocks .

- **Consumables:** Can be purchased multiple times (e.g., extra lives, credits, tokens, tips).
- **Non-consumables:** Unlock permanent features (e.g., dark mode, ad removal). \

Non-consumable purchases don’t generate recurring income, and they cap your revenue at the number of users willing to pay once. The mental model of it is similar to that of the old boxed software, where you would release a new version of the app one a year, and people who needed the new features would upgrade. In the time of monthly server costs (few apps can do without a backend), this model just doesn’t work anymore.

Consumables can bring you the much needed recurring revenue, but work very poorly for unlocking features. The repeated buying of consumables makes them great for games, where purchasing allows users to continue playing, for example, by buying additional lives.

### 3\. Subscriptions: the gold standard

Subscriptions power the most profitable apps in the world. They give you predictable, recurring income and create a healthy incentive loop: the more value you provide over time, the longer users stay. They do also come with downsides:

- Since everything is now a subscription, “subscription fatigue” can make customers lose interest
- Dark patterns in getting users to subscribe to for example weekly subscriptions, can deter users from making a purchase if your app doesn’t have a good reason for paying for usage that often.

It’s important to select the right type of subscription periods for your app. One way to think of these:

- **Weekly:** Low commitment, popular in certain lifestyle categories.
- **Monthly:** Common baseline for SaaS-like apps.
- **Yearly:** Encourages long-term commitment, often with a discount.

Health, fitness, productivity, and education apps do especially well here. Users perceive them as ongoing journeys — and are more willing to commit for a full year.

The key is **delivering consistent value.** A subscription app that stops improving or engaging users will quickly see churn.

### 4\. Virtual Currencies: build your own economy

This one has nothing to do with cryptos, virtual currencies are a flexible custom in-app economy. Instead of selling specific features, you sell credits that users can spend inside your app. There are other names for this as well such as credits, tokens, minutes.

Virtual currencies are easiest to explain through an example: if you build an AI-powered photo enhancer, you might sell 100 credits for $5, where each image generation costs 1 credit. You can even combine this with subscriptions: subscribers get monthly credits and can top up via consumable purchases.

This approach works beautifully for:

- AI/ML apps.
- Games.
- Creative tools with usage-based costs.

I feel that there’s a huge unexplored potential with virtual currencies.

### Hybrid monetization strategies

The best way to go with monetizing is still to combine multiple strategies. Should be careful though, people can smell when you’re trying to just squeeze money out of them in multiple ways. Monetization should always make sense; people pay you because they feel they are getting the amount of value that they are paying for you or more. The more they end up paying, the more they expect to receive value in return. So make sure all your monetization has a purpose.

**1\. Ads + Subscription**

Show ads to free users. When someone subscribes, remove the ads. If they cancel, ads return automatically once their entitlement expires. People subscribe for two reasons, at least technically:

1. Get rid of the annoying ads
2. Because they actually like the product

**2\. Subscription + credits**

Give subscribers a monthly credit allowance (e.g., 100 exports). Heavy users can top up with one-time purchases. You capture value from both subscriptions, as well power users using your app more.

## Building your subscriptions infrastructure

One word: don’t

## Buying your subscription infrastructure

Ok, maybe this counts as a bit of an ad, _but you should go with [RevenueCat](https://www.revenuecat.com/)_ , and I’m certainly biased since I work there so take whatever I say with a modicum of salt.

There are very few rare cases where you should build your own subscription infrastructure, or even go with anything else. For starters Google Play Store APIs are generally not fun to work with: they are constantly changing, at times poorly documented, and well… built by Google 🤷‍♂️. Receipt validation, subscription status, and billing errors are just some of the things you will end up having to figure out. From personal experience I can say that there are way more fun things to do in app development.

There are other reasons for not building your subscription infrastructure yourself. The laws, rulings, and regulations around in-app purchases change constantly and you would have to keep up with all the markets your app is available in. Your development time is also limited, and I personally think developers should focus on bringing value to their users – not on the mechanics of extracting value from their users. \

Now all those horrible things I’ve told you about, RevenueCat takes care of them all. So give it a try, it’s free until you make $2,500/month, then pay 1% of tracked revenue. If you have any questions, just reach out to me.

## Adding RevenueCat to your Android project

This article is already rather long and I still have a few points to consider, so I’m not going to add a tutorial here about adding RevenueCat to your Android app, but instead I’m going to link a few sources.

1. The best source for getting started with RevenueCat is their docs. Specifically this [RevenueCat Android SDK setup](https://www.revenuecat.com/docs/getting-started/installation/android).
2. [RevenueCat Codelab](https://revenuecat.github.io/) gives you much of the same stuff but slightly more interactively.

## Keep more revenue by purchasing on web

So far we’ve only talked about in-app purchases, where Google handles the underlying payment infrastructure. Google requires that all digital purchases made apps have to make use of their in-app infrastructure. For that honor they take a \*\*15–30% \*\*cut of all in-app purchase transactions. That’s fine early on, but when your app starts to grow, that cut will start to feel quite big.

However, it’s just a matter of time before purchasing through alternative payment providers becomes available for the Play Store. At least in the way it is for the App Store already in the US and soon in Japan.

So build your own web payment solution or use [RevenueCat Web billing](https://www.revenuecat.com/billing/) to do that. Let users pay via Stripe or Paddle, where commissions are 3–4%, and then just synchronize the purchase with your app. To stay compliant with store rules:

- Don’t link directly to external payments in your app (unless allowed by law).
- Use email or in-app messaging to direct users to your web checkout.
- When they complete the purchase, deep-link back to your app and associate the transaction. \

Easiest way is to use the web purchases for **win-back campaigns**. When a user cancels, automatically send them a discount link via email — e.g., “Come back and save 30%.” Since the transaction happens on the web, you don’t lose 30% to Google. If you’re interested in learning more, I’ve written a tutorial about [web-based win-back campaigns with RevenueCat](https://www.revenuecat.com/blog/growth/how-to-build-a-win-back-campaign-with-revenuecat-web-billing/).

## Final thoughts

Making money on Android isn’t easy, but it’s absolutely possible. Users are more comfortable with paying for apps they love to use nowadays, and in tricky cases you can always rely on the power of hybrid monetization models e.g. ads + subscriptions.

To emphasize the point I made earlier in this blog post: the best strategy for making money with your Android app is to build something people want and need. That means features and bug fixes, not wrestling in-app purchases infrastructure. After you've built something that people want, and monetized it in a way that makes sense, you can start looking into tweaking your monetization with web purchases for example.

* * *

## Related articles

- [React Native in-app purchases: iOS & Android guide](https://perttu.dev/articles/in-app-purchases-rn) \- Comprehensive in-app purchases overview

* * *

## Comments

No comments yet. Be the first to share your thoughts.

### Leave a comment

Website

Post comment

Comments are moderated before they appear.

## More to read

### [How not to ship slop](https://perttu.dev/articles/how-not-to-ship-slop)

June 25, 2026

AI is useful, but it will happily help you ship average work with a finished-looking surface — here is how to keep it from setting your bar.

### [App.js 2026 recap](https://perttu.dev/articles/appjs-2026-recap)

June 15, 2026

A recap of App.js 2026 with a sponsor's, speaker's, and participant's perspective.

People found this searching for

- android app monetization
- how to monetize android app
- monetize your android app

## Contents

- [Introduction](https://perttu.dev/articles/how-to-make-money-with-your-android-app#introduction)
- [I'm too lazy to read, show me the video](https://perttu.dev/articles/how-to-make-money-with-your-android-app#im-too-lazy-to-read-show-me-the-video)
- [Why monetizing an app is hard, especially when it’s on android](https://perttu.dev/articles/how-to-make-money-with-your-android-app#why-monetizing-an-app-is-hard-especially-when-its-on-android)
- [1\. Users expect free apps](https://perttu.dev/articles/how-to-make-money-with-your-android-app#1-users-expect-free-apps)
- [2\. Implementation complexity](https://perttu.dev/articles/how-to-make-money-with-your-android-app#2-implementation-complexity)
- [3\. Android apps earn less on average](https://perttu.dev/articles/how-to-make-money-with-your-android-app#3-android-apps-earn-less-on-average)
- [Options for monetizing on Android](https://perttu.dev/articles/how-to-make-money-with-your-android-app#options-for-monetizing-on-android)
- [1\. Advertising: simple but scale-dependent](https://perttu.dev/articles/how-to-make-money-with-your-android-app#1-advertising-simple-but-scale-dependent)
- [2\. One-time purchases: simple value exchange](https://perttu.dev/articles/how-to-make-money-with-your-android-app#2-one-time-purchases-simple-value-exchange)
- [3\. Subscriptions: the gold standard](https://perttu.dev/articles/how-to-make-money-with-your-android-app#3-subscriptions-the-gold-standard)
- [4\. Virtual Currencies: build your own economy](https://perttu.dev/articles/how-to-make-money-with-your-android-app#4-virtual-currencies-build-your-own-economy)
- [Hybrid monetization strategies](https://perttu.dev/articles/how-to-make-money-with-your-android-app#hybrid-monetization-strategies)
- [Building your subscriptions infrastructure](https://perttu.dev/articles/how-to-make-money-with-your-android-app#building-your-subscriptions-infrastructure)
- [Buying your subscription infrastructure](https://perttu.dev/articles/how-to-make-money-with-your-android-app#buying-your-subscription-infrastructure)
- [Adding RevenueCat to your Android project](https://perttu.dev/articles/how-to-make-money-with-your-android-app#adding-revenuecat-to-your-android-project)
- [Keep more revenue by purchasing on web](https://perttu.dev/articles/how-to-make-money-with-your-android-app#keep-more-revenue-by-purchasing-on-web)
- [Final thoughts](https://perttu.dev/articles/how-to-make-money-with-your-android-app#final-thoughts)
- [Related articles](https://perttu.dev/articles/how-to-make-money-with-your-android-app#related-articles)