async (page) => {
  // Close any overlays first
  await page.evaluate(() => {
    document.querySelectorAll('[role="dialog"], [role="listbox"]').forEach(el => {
      el.style.display = 'none';
    });
  });
  
  await page.waitForTimeout(300);
  
  // Click publish using evaluate
  const pubResult = await page.evaluate(() => {
    const publishEl = document.querySelector('[data-test-id="storyboard-creation-nav-done"]');
    if (publishEl) {
      publishEl.click();
      return 'clicked storyboard-creation-nav-done';
    }
    return 'not found';
  });
  
  console.log(pubResult);
  await page.waitForTimeout(3000);
  
  // Check result
  const state = await page.evaluate(() => {
    return {
      url: window.location.href,
      visibleText: document.body.innerText.substring(0, 300).replace(/\s+/g, ' ')
    };
  });
  
  return state;
}
