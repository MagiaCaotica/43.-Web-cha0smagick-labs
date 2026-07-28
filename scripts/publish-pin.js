async (page) => {
  await page.waitForTimeout(500);
  
  // Check board is selected
  const boardStatus = await page.evaluate(() => {
    const boardBtn = document.querySelector('[data-test-id="board-dropdown-select-button"]');
    if (boardBtn) return 'board text: ' + boardBtn.textContent.trim().replace(/\s+/g, ' ');
    return 'board not found';
  });
  console.log('Board status:', boardStatus);
  
  // Click Publish button - from DOM it's at data-test-id="storyboard-creation-nav-done"
  const publishBtn = await page.$('[data-test-id="storyboard-creation-nav-done"]');
  if (publishBtn) {
    await publishBtn.click();
    console.log('Clicked Publish');
    await page.waitForTimeout(3000);
    return 'published! checking result...';
  }
  
  // Fallback: try button with text Publicar
  const pubResult = await page.evaluate(() => {
    const buttons = document.querySelectorAll('button, div');
    for (const b of buttons) {
      if (b.textContent.trim() === 'Publicar' && b.tagName === 'BUTTON') {
        b.click();
        return 'clicked Publicar button via text';
      }
    }
    return 'no publish button found';
  });
  
  return pubResult;
}
