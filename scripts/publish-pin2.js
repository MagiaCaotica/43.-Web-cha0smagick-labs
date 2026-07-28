async (page) => {
  // Close any overlays first by pressing Escape
  await page.keyboard.press('Escape');
  await page.waitForTimeout(500);
  await page.keyboard.press('Escape');
  await page.waitForTimeout(500);
  
  // Click publish via evaluate to bypass overlay
  const result = await page.evaluate(() => {
    // Try data-test-id approach
    const publishDiv = document.querySelector('[data-test-id="storyboard-creation-nav-done"]');
    if (publishDiv) {
      publishDiv.click();
      return 'clicked via storyboard-creation-nav-done';
    }
    
    // Fallback: find by text
    const all = document.querySelectorAll('button, div');
    for (const el of all) {
      if (el.textContent.trim() === 'Publicar' && (el.tagName === 'BUTTON' || el.getAttribute('role') === 'button')) {
        el.click();
        return 'clicked via text: ' + el.tagName;
      }
    }
    return 'no publish found';
  });
  
  console.log('Publish click:', result);
  await page.waitForTimeout(3000);
  
  // Check what happened
  const pageState = await page.evaluate(() => {
    const url = window.location.href;
    const notif = document.querySelector('[role="status"], [data-test-id="toast"], [aria-live="polite"]');
    return {
      url: url,
      notification: notif ? notif.textContent.trim().substring(0, 100) : 'none',
      title: document.title
    };
  });
  
  return pageState;
}
