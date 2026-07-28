async (page) => {
  // Type in search to see boards
  const searchInput = await page.$('[data-test-id="board-dropdown-search"] input, [placeholder="Buscar"]');
  if (searchInput) {
    await searchInput.click();
    await searchInput.fill('Chaos');
    console.log('Typed Chaos in search');
  }
  
  await page.waitForTimeout(2000);
  
  // Check for boards
  const boards = await page.evaluate(() => {
    // Try multiple selectors
    const selectors = [
      '[data-test-id="board-item"]',
      '[role="option"]',
      '[role="menuitemradio"]',
      '[role="menuitemcheckbox"]',
      'ul[role="listbox"] li',
      '[data-test-id="board-item-title"]'
    ];
    
    for (const sel of selectors) {
      const items = document.querySelectorAll(sel);
      if (items.length > 0) {
        return Array.from(items).slice(0, 15).map(i => ({
          text: i.textContent.trim().replace(/\s+/g, ' ').substring(0, 80),
          tag: i.tagName,
          sel: sel
        }));
      }
    }
    
    // Dump more of the page HTML around the dropdown
    const popups = document.querySelectorAll('[data-test-id="board-dropdown"]');
    if (popups.length > 0) {
      return 'board-dropdown exists, html: ' + popups[0].outerHTML.substring(0, 1500);
    }
    
    return 'no boards found';
  });
  
  return { boards: boards };
}
