async (page) => {
  const tweets = [
    "The full moon doesn't care about your intentions. The new moon is for planting. The eclipse is for destroying. You've been manifesting on the wrong phase for years. https://cha0smagicklabs.com/apps/lunar-phase-calculator.html",
    "Your gut feeling is not mystical. It's pattern recognition your conscious brain can't access. The I Ching externalizes it. 64 hexagrams. Stop asking friends. https://cha0smagicklabs.com/apps/iching-oracle.html",
    "Nightmares are the mind rehashing trauma. Lucid dreaming is the only therapy that lets you fight back inside the dream. Tried in clinical studies. Works. https://cha0smagicklabs.com/apps/lucid-dream.html"
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