async (page) => {
  const tweets = [
    "People fear the 72 demons of the Goetia. Meanwhile they pray to gods who ignore their rent bills. The spirits respond to precision, not fear. Learn the seals. Use the enn. https://cha0smagicklabs.com/apps/arcana-goetia.html",
    "99% of demon content online is fear-bait for engagement. The other 1% is actual scholarship. 72 spirits. Seals. Enns. No candles required. https://cha0smagicklabs.com/apps/arcana-goetia.html",
    "Christians crossed themselves for protection. Vikings carved runes. Guess which one is older — and which one still works. Algiz. Thurisaz. Othala. https://cha0smagicklabs.com/apps/norse-rune-oracle.html"
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