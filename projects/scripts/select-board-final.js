async (page) => {
  // Click the board selector using proper event dispatch
  const openResult = await page.evaluate(() => {
    const boardBtn = document.querySelector('[data-test-id="board-dropdown-select-button"]');
    if (!boardBtn) return 'board dropdown not found';
    
    // Dispatch proper mouse event for React
    boardBtn.dispatchEvent(new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window
    }));
    return 'clicked board dropdown via MouseEvent';
  });
  
  console.log(openResult);
  await page.waitForTimeout(2000);
  
  // Now try to find a board without using search - scroll the list
  const selectResult = await page.evaluate(() => {
    // Look for board options that are not filtered by search
    const options = document.querySelectorAll('[role="option"]');
    console.log('Options count:', options.length);
    
    let found = null;
    for (const opt of options) {
      const text = opt.textContent.trim().toLowerCase();
      if (text === 'chaos magic') {
        found = { text: text, action: 'clicking' };
        // Use proper event dispatch
        opt.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
        break;
      }
    }
    
    if (found) return found;
    
    // Try "Tableros" section - might have different structure
    const boardItems = document.querySelectorAll('[data-test-id="board-item"], [role="menuitemradio"]');
    for (const item of boardItems) {
      const text = item.textContent.trim().toLowerCase();
      if (text === 'chaos magic') {
        item.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
        return 'clicked via board-item: chaos magic';
      }
    }
    
    return 'no chaos magic board found, options: ' + Array.from(options).slice(0, 10).map(o => '"' + o.textContent.trim() + '"').join(', ');
  });
  
  console.log('Select result:', JSON.stringify(selectResult));
  await page.waitForTimeout(1500);
  
  // Check what board is now selected
  const checkResult = await page.evaluate(() => {
    const boardDisplay = document.querySelector('[data-test-id="board-dropdown-select-button"]');
    if (boardDisplay) {
      return 'board text: ' + boardDisplay.textContent.trim().replace(/\s+/g, ' ');
    }
    return 'board element not found';
  });
  
  console.log('After selection:', checkResult);
  
  // Try publishing if board is selected
  await page.evaluate(() => {
    const pubEl = document.querySelector('[data-test-id="storyboard-creation-nav-done"]');
    if (pubEl) {
      pubEl.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
    }
  });
  
  await page.waitForTimeout(3000);
  
  const finalState = await page.evaluate(() => {
    return {
      url: window.location.href,
      text: document.body.innerText.substring(0, 400).replace(/\s+/g, ' '),
      hasPublishedPin: window.location.href.includes('pin-creation') ? false : true
    };
  });
  
  return finalState;
}
