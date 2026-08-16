async (page) => {
  const tweets = [
    "Ghost hunters spent $50M on equipment that records the same audio your phone already can. EVP is a microphone trick, not a $2,000 device. The app does EVP + spirit box + EMF for $14.99. One-time. https://cha0smagicklabs.com/apps/noctem-tools.html",
    "You can record spirits with a $1,500 spirit box. Or with a $14.99 app that does the same thing. The dead don't care how much your equipment cost. https://cha0smagicklabs.com/apps/noctem-tools.html",
    "45% of Americans report paranormal experiences. The other 55% just never tried to record one properly. EVP. ITC. Estes method. All in one app. https://cha0smagicklabs.com/apps/noctem-tools.html",
    "The SB7 spirit box costs $300 and only does one thing. This app does spirit box + EVP recorder + EMF detector + ITC analyzer. $14.99. One-time. No subscription. https://cha0smagicklabs.com/apps/noctem-tools.html",
    "Skeptics say ghosts don't exist. Yet 45% of Americans report paranormal experiences. Either half the population lies, or science hasn't caught up. Record properly. https://cha0smagicklabs.com/apps/noctem-tools.html"
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