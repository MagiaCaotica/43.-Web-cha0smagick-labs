async (page) => {
  const tweets = [
    "Thought forms are real. Servitors are programmable. If you think this is fantasy, stop reading. This is the practical manual. https://cha0smagicklabs.com/books/manual-activacion-servidores-magicos-pdf.html",
    "Mainstream rune books are historically inaccurate. The runes were never a fortune-telling system. They were weapons of change. The actual system is documented here. https://cha0smagicklabs.com/books/tratado-runas-cazadoras-caos-pdf.html",
    "Your life is decided in 0.3 seconds. Before you think. Before you choose. System 1 runs everything. If you're not training that gap, you're not in control. https://cha0smagicklabs.com/books/mind-the-gap-pdf.html"
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