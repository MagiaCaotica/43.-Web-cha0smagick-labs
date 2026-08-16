async (page) => {
  const tweets = [
    "Dark tourism is booming and nobody tells you WHERE. This app maps haunted roads, ghost towns and liminal spaces with the legends behind them. $9.99 one-time. https://cha0smagicklabs.com/apps/eerieroads.html",
    "Every state has a road locals refuse to drive at night. I collected them all in one app. With the stories. Before dark. Always before dark. https://cha0smagicklabs.com/apps/eerieroads.html",
    "Astrology apps collect your data and charge you monthly. This one calculates your full natal chart OFFLINE, sells nothing else, tracks nothing. $6.99. https://cha0smagicklabs.com/apps/astral-lab.html"
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