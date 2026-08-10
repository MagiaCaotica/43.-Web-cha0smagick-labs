async (page) => {
  // Click the board selector to open dropdown
  const boardResult = await page.evaluate(() => {
    // Look for the board selector button
    const buttons = document.querySelectorAll('button');
    for (const b of buttons) {
      if (b.textContent.includes('Tablero') || b.textContent.includes('Board') || b.textContent.includes('Selecciona')) {
        b.click();
        return 'clicked: ' + b.textContent.trim().substring(0, 60);
      }
    }
    return 'board button not found by text';
  });
  
  console.log('Board click:', boardResult);
  await page.waitForTimeout(1000);
  
  // Check for board list/dropdown
  const boardList = await page.evaluate(() => {
    // Look for board items in dropdown
    const items = document.querySelectorAll('[role="option"], [role="menuitem"], [data-test-id="board-item"]');
    if (items.length > 0) {
      return Array.from(items).map(i => i.textContent.trim().substring(0, 50)).join(' | ');
    }
    // Check for any popup/overlay content
    const popups = document.querySelectorAll('[role="listbox"], [role="menu"], [data-test-id="board-dropdown"]');
    if (popups.length > 0) {
      return 'found ' + popups.length + ' popups, content: ' + popups[0].textContent.trim().substring(0, 200);
    }
    return 'no board list visible yet';
  });
  
  return { boardClick: boardResult, boardList: boardList };
}
