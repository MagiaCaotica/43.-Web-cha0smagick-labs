async (page) => {
  // Close the nav "Crear" dropdown first
  await page.keyboard.press('Escape');
  await page.waitForTimeout(500);
  
  // Now click the dialog's Crear button
  const result = await page.evaluate(() => {
    const dialog = document.querySelector('[role="dialog"]');
    if (!dialog) return 'no dialog';
    
    const buttons = dialog.querySelectorAll('button');
    for (const b of buttons) {
      if (b.textContent.trim() === 'Crear') {
        const isDisabled = b.hasAttribute('disabled');
        if (!isDisabled) {
          b.dispatchEvent(new MouseEvent('click', {bubbles:true,cancelable:true,view:window}));
          return 'clicked Crear in dialog';
        }
      }
    }
    return 'no Crear button in dialog found or disabled';
  });
  
  console.log(result);
  await page.waitForTimeout(3000);
  
  const state = await page.evaluate(() => {
    return {
      url: window.location.href,
      dialogs: document.querySelectorAll('[role="dialog"]').length,
      text: document.body.innerText.substring(0, 300).replace(/\s+/g, ' ')
    };
  });
  
  return state;
}
