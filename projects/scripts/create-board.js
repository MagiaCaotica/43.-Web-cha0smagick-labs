async (page) => {
  const result = await page.evaluate(() => {
    const buttons = document.querySelectorAll('button');
    for (const b of buttons) {
      if (b.textContent.trim() === 'Crear') {
        const isDisabled = b.getAttribute('disabled') !== null;
        if (!isDisabled) {
          b.dispatchEvent(new MouseEvent('click', {bubbles:true,cancelable:true,view:window}));
          return 'clicked Crear (enabled)';
        }
      }
    }
    return 'no enabled Crear found';
  });
  
  console.log('Create result:', result);
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
