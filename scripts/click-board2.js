async (page) => {
  // Click the board dropdown selector
  const boardBtn = await page.$('[data-test-id="board-dropdown-select-button"]');
  if (boardBtn) {
    await boardBtn.click();
    console.log('Clicked board dropdown');
  } else {
    return 'board dropdown button not found by data-test-id';
  }
  
  await page.waitForTimeout(1500);
  
  // Check for board options
  const options = await page.evaluate(() => {
    // Look for board items in the dropdown
    const boardItems = document.querySelectorAll('[data-test-id="board-item"], [role="option"], [role="menuitem"]');
    if (boardItems.length > 0) {
      return Array.from(boardItems).slice(0, 10).map(i => ({
        text: i.textContent.trim().replace(/\s+/g, ' ').substring(0, 60),
        testId: i.getAttribute('data-test-id'),
        role: i.getAttribute('role')
      }));
    }
    
    // Check for search input
    const searchInput = document.querySelector('[data-test-id="board-dropdown-search"] input, [placeholder="Buscar"]');
    if (searchInput) {
      return 'search input found: ' + searchInput.placeholder;
    }
    
    // Check popup layer
    const layers = document.querySelectorAll('[data-test-id="board-dropdown"], [role="dialog"], [role="listbox"]');
    if (layers.length > 0) {
      return 'found ' + layers.length + ' layers: ' + layers[0].className.substring(0, 100);
    }
    
    return 'no board list found after click';
  });
  
  return options;
}
