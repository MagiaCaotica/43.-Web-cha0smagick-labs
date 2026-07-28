async (page) => {
  const result = await page.evaluate(() => {
    // Find the board selector by looking for the dropdown arrow icon
    const dropdownImg = document.querySelector('img[alt="Abrir menú desplegable"]');
    if (dropdownImg) {
      const parentButton = dropdownImg.closest('button');
      if (parentButton) {
        parentButton.click();
        return 'clicked board button via dropdown img, text: ' + parentButton.textContent.trim().replace(/\s+/g, ' ').substring(0, 80);
      }
      return 'no parent button found for dropdown img';
    }
    
    // Fallback: try finding by containing "Selecciona" text
    const allElements = document.querySelectorAll('*');
    for (const el of allElements) {
      if (el.textContent.includes('Selecciona un tablero')) {
        const btn = el.closest('button');
        if (btn) {
          btn.click();
          return 'clicked via text search';
        }
      }
    }
    
    return 'board selector not found';
  });
  
  console.log('Board result:', result);
  await page.waitForTimeout(1500);
  
  // Check for dropdown content
  const dropdown = await page.evaluate(() => {
    const options = document.querySelectorAll('[role="option"], [role="menuitemcheckbox"], [role="menuitem"]');
    if (options.length > 0) {
      return Array.from(options).map(o => o.textContent.trim().substring(0, 60)).join(' | ');
    }
    // Any list items that appeared
    const items = document.querySelectorAll('.Jea, .zIag, li[role]');
    if (items.length > 0) {
      return 'found ' + items.length + ' items: ' + items[0].textContent.trim().substring(0, 100);
    }
    return 'no dropdown options visible';
  });
  
  return { clickResult: result, dropdown: dropdown };
}
