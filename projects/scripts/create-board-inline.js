async (page) => {
  // Find and click "Crear tablero" inside the popover
  const result = await page.evaluate(() => {
    const popover = document.querySelector('[role="dialog"][aria-label="Popover"]');
    if (popover) {
      const all = popover.querySelectorAll('*');
      for (const el of all) {
        if (el.textContent.trim() === 'Crear tablero' && (el.tagName === 'BUTTON' || el.getAttribute('role') === 'button')) {
          el.click();
          return 'clicked via popover scan';
        }
      }
    }
    // Broader search
    const allElements = document.querySelectorAll('*');
    for (const el of allElements) {
      if (el.textContent.trim() === 'Crear tablero') {
        if (el.tagName === 'BUTTON' || el.getAttribute('role') === 'button' || (el.parentElement && el.parentElement.tagName === 'BUTTON')) {
          (el.tagName === 'BUTTON' ? el : el.parentElement).click();
          return 'clicked via broad scan';
        }
      }
    }
    return 'not found';
  });
  
  console.log(result);
  await page.waitForTimeout(2000);
  
  const state = await page.evaluate(() => {
    return {
      url: window.location.href,
      dialogs: document.querySelectorAll('[role="dialog"]').length,
      hasBoardNameInput: !!document.querySelector('input[placeholder*="tablero"]'),
      text: document.body.innerText.substring(0, 400).replace(/\s+/g, ' ')
    };
  });
  
  return state;
}
