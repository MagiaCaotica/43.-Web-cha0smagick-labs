async (page) => {
  // Wait for image
  await page.waitForTimeout(1000);
  
  // Fill title
  await page.evaluate(() => {
    const ti = document.querySelector('input[placeholder*="Explica"]');
    if (ti) {
      const s = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
      s.call(ti, 'The 7 Laws of Chaos Magick That Actually Work');
      ti.dispatchEvent(new Event('input', {bubbles:true}));
    }
  });
  
  // Fill link
  await page.evaluate(() => {
    const li = document.querySelector('input[placeholder*="Añade un enlace"]');
    if (li) {
      const s = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
      s.call(li, 'https://cha0smagicklabs.com/blog/chaos-magick-beginners.html');
      li.dispatchEvent(new Event('input', {bubbles:true}));
    }
  });
  
  await page.waitForTimeout(500);
  
  // Click board dropdown
  await page.evaluate(() => {
    const bd = document.querySelector('[data-test-id="board-dropdown-select-button"]');
    if (bd) bd.dispatchEvent(new MouseEvent('click', {bubbles:true,cancelable:true,view:window}));
  });
  
  await page.waitForTimeout(1500);
  
  // Type board name in search
  await page.evaluate(() => {
    const searchInput = document.querySelector('[data-test-id="board-dropdown-search"] input');
    if (searchInput) {
      const s = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
      s.call(searchInput, 'Chaos Magick');
      searchInput.dispatchEvent(new Event('input', {bubbles:true}));
      return;
    }
    // Try any input in the dropdown
    const allInputs = document.querySelectorAll('input[type="text"]');
    for (const inp of allInputs) {
      if (inp.placeholder === 'Buscar' || inp.placeholder.includes('board') || inp.placeholder.includes('tablero')) {
        const s = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        s.call(inp, 'Chaos Magick');
        inp.dispatchEvent(new Event('input', {bubbles:true}));
        return;
      }
    }
  });
  
  await page.waitForTimeout(2000);
  
  // Click the board option
  const selectResult = await page.evaluate(() => {
    const options = document.querySelectorAll('[role="option"]');
    for (const opt of options) {
      const text = opt.textContent.trim().toLowerCase();
      if (text.includes('chaos magick') || text === 'chaos magic') {
        opt.dispatchEvent(new MouseEvent('click', {bubbles:true,cancelable:true,view:window}));
        return 'selected: ' + text;
      }
    }
    return 'not found among ' + options.length + ' options. Texts: ' + Array.from(options).map(o => '"' + o.textContent.trim() + '"').join(', ');
  });
  
  console.log('Board select:', selectResult);
  
  // If board selected successfully, verify
  if (selectResult.includes('selected')) {
    await page.waitForTimeout(1500);
    
    const boardCheck = await page.evaluate(() => {
      const bd = document.querySelector('[data-test-id="board-dropdown-select-button"]');
      return bd ? bd.textContent.trim().replace(/\s+/g, ' ') : 'no';
    });
    console.log('Board display:', boardCheck);
    
    // Publish
    if (!boardCheck.toLowerCase().includes('selecciona')) {
      await page.evaluate(() => {
        const pb = document.querySelector('[data-test-id="storyboard-creation-nav-done"]');
        if (pb) pb.dispatchEvent(new MouseEvent('click', {bubbles:true,cancelable:true,view:window}));
      });
      
      await page.waitForTimeout(5000);
      
      const final = await page.evaluate(() => {
        return { url: window.location.href, text: document.body.innerText.substring(0, 300).replace(/\s+/g, ' ') };
      });
      return final;
    }
  }
  
  return { selectResult: selectResult, boardCheck: 'failed' };
}
