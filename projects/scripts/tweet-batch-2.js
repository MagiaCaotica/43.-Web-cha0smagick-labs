async (page) => {
  const tweets = [
    "Your ex didn't leave by accident. The cards show what they're hiding from you. Most people are too scared to ask. You're not most people. $9.99 one-time. https://cha0smagicklabs.com/apps/unofficial-rider-waite-tarot.html",
    "The Church banned tarot for 500 years. You know what that means? It works. 78 cards. 0 prayers required. $9.99. https://cha0smagicklabs.com/apps/unofficial-rider-waite-tarot.html",
    "You can't read for yourself, they say. That's a gatekeeping myth. The best readers I know read for themselves daily. https://cha0smagicklabs.com/blog/ex-tarot-spread.html",
    "Tarot isn't fortune-telling. It's a mirror for the mind that won't lie to you. 78 archetypes. One deck. The app does the heavy lifting. https://cha0smagicklabs.com/apps/unofficial-rider-waite-tarot.html",
    "Clinton Road. Shades of Death. Zombie Road. America is full of roads where people disappear — and locals just drive them anyway. The stories are mapped. Explore before dark. https://cha0smagicklabs.com/apps/eerieroads.html"
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