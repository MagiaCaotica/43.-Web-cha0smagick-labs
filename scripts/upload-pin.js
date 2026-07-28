async (page) => {
  // Find and click the upload area
  const dropzone = await page.evaluate(() => {
    // Look for the upload area text
    const all = document.querySelectorAll('div, button, span');
    for (const el of all) {
      const text = el.textContent.trim();
      if (text === 'Carga de archivos') {
        if (el.tagName === 'BUTTON' || el.getAttribute('role') === 'button') {
          el.click();
          return 'clicked Carga de archivos button';
        }
        const parent = el.closest('button, [role="button"]');
        if (parent) {
          parent.click();
          return 'clicked parent of Carga de archivos';
        }
      }
    }
    return 'not found exact text';
  });
  console.log('Step 1:', dropzone);
  
  // Wait a moment for file chooser
  await page.waitForTimeout(1000);
  
  return 'clicked: ' + dropzone;
}
