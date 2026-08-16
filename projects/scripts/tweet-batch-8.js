async (page) => {
  const tweets = [
    "You dream 4-6 times a night. You remember 1% of it. Your subconscious talks to you constantly and you're ignoring it. Start journaling tonight. https://cha0smagicklabs.com/apps/dream-machine.html",
    "Psychic ability is a muscle. Zener cards measure it. Most people score 20% (random). Trained people score 40-60%. You can't improve what you don't measure. https://cha0smagicklabs.com/apps/psi-gym.html",
    "128+ five-star reviews. 4.7 average. 11 apps, $3.99 each, one-time, no ads, no tracking. The occult collection the Play Store didn't want you to find. https://cha0smagicklabs.com/apps/psi-gym.html"
  ];
  const results = [];
  for (const t of tweets) {
    try {
      await page.goto('https://x.com/compose/post', { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(2500);
      const ta = page.locator('[data-testid="tweetTextarea_0"]').first();
      await ta.waitFor({ timeout: 15000 });
      await ta.click();
      await page.keyboard.type(t, { delay: 4 });
      await page.waitForTimeout(800);
      await page.locator('[data-testid="tweetButton"]').first().click();
      await page.waitForTimeout(3000);
      results.push('OK');
    } catch (e) {
      results.push('FAIL:' + e.message.split('\n')[0]);
    }
  }
  return results.join(',');
}