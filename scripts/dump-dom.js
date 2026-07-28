async (page) => {
  const result = await page.evaluate(() => {
    // Get the overall structure of the pin creation form area
    const formArea = document.querySelector('[data-test-id="pin-builder"], [data-test-id="pin-creation"]');
    if (formArea) {
      return 'found form area, HTML: ' + formArea.outerHTML.substring(0, 2000);
    }
    
    // Try finding by main region
    const mainElements = document.querySelectorAll('main');
    const results = [];
    for (const m of mainElements) {
      const children = m.children;
      for (const c of children) {
        results.push({
          tag: c.tagName,
          className: c.className.substring(0, 100),
          textPreview: c.textContent.trim().replace(/\s+/g, ' ').substring(0, 100)
        });
      }
    }
    
    // Also check what the board dropdown/selector area looks like
    // Looking for aria-label or data attributes
    const all = document.querySelectorAll('[aria-label*="board" i], [aria-label*="tablero" i], [data-test-id*="board" i], [data-test-id*="tablero" i]');
    const labeled = Array.from(all).map(el => ({
      tag: el.tagName,
      aria: el.getAttribute('aria-label'),
      dataTestId: el.getAttribute('data-test-id'),
      text: el.textContent.trim().replace(/\s+/g, ' ').substring(0, 60)
    }));
    
    return { mainResults: results, boardLabels: labeled };
  });
  
  return result;
}
