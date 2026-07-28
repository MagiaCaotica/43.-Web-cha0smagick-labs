async (page) => {
  // Find and click the "chaos magic" board option
  const result = await page.evaluate(() => {
    const options = document.querySelectorAll('[role="option"]');
    for (const opt of options) {
      const text = opt.textContent.trim().toLowerCase();
      if (text === 'chaos magic') {
        opt.click();
        return 'clicked chaos magic board';
      }
    }
    return 'chaos magic board not found, boards: ' + Array.from(options).map(o => o.textContent.trim()).join(', ');
  });
  
  console.log(result);
  await page.waitForTimeout(1000);
  return result;
}
