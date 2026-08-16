async (page) => {
  const tweets = [
    "11 Android apps + 7 books. $52.93 separately. $19.99 bundled. That's the whole occult library of a serious practitioner, for the price of one dinner. https://cha0smagicklabs.com/",
    "Unpopular opinion: sigils work better than affirmations because you stop thinking about the result. The forgetting is the magic. I built a tool for it. $3.99. One-time. https://cha0smagicklabs.com/apps/chaos-sigil-generator.html",
    "Applied for 100 jobs with no reply? Stop sending resumes. Start sending sigils. The universe opens doors for intention, not desperation. https://cha0smagicklabs.com/apps/chaos-sigil-generator.html"
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