async (page) => {
  // STEP 1: Wait for image to load
  await page.waitForTimeout(2000);
  
  const imgCheck = await page.evaluate(() => {
    const img = document.querySelector('img[alt*="subida"]');
    return img ? 'image loaded' : 'no image yet';
  });
  console.log('Step 1:', imgCheck);
  
  // STEP 2: Fill title if not already filled
  const titleResult = await page.evaluate(() => {
    const titleInput = document.querySelector('input[placeholder*="Explica"]');
    if (!titleInput) return 'no title input';
    if (titleInput.value && titleInput.value.length > 5) return 'already filled: ' + titleInput.value;
    const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
    nativeSetter.call(titleInput, 'The 7 Laws of Chaos Magick That Actually Work');
    titleInput.dispatchEvent(new Event('input', {bubbles:true}));
    return 'title set';
  });
  console.log('Step 2:', titleResult);
  
  // STEP 3: Fill link
  const linkResult = await page.evaluate(() => {
    const linkInput = document.querySelector('input[placeholder*="Añade un enlace"]');
    if (!linkInput) return 'no link input';
    const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
    nativeSetter.call(linkInput, 'https://cha0smagicklabs.com/blog/chaos-magick-beginners.html');
    linkInput.dispatchEvent(new Event('input', {bubbles:true}));
    return 'link set';
  });
  console.log('Step 3:', linkResult);
  
  // STEP 4: Wait a moment then click board selector
  await page.waitForTimeout(1000);
  
  const boardClick = await page.evaluate(() => {
    const boardBtn = document.querySelector('[data-test-id="board-dropdown-select-button"]');
    if (!boardBtn) return 'no board button';
    boardBtn.dispatchEvent(new MouseEvent('click', {bubbles:true,cancelable:true,view:window}));
    return 'board dropdown clicked';
  });
  console.log('Step 4:', boardClick);
  
  await page.waitForTimeout(2000);
  
  // STEP 5: Select "Chaos Magick" board from options
  const boardSelect = await page.evaluate(() => {
    const options = document.querySelectorAll('[role="option"]');
    let found = null;
    for (const opt of options) {
      const text = opt.textContent.trim().toLowerCase();
      if (text === 'chaos magic') {
        opt.dispatchEvent(new MouseEvent('click', {bubbles:true,cancelable:true,view:window}));
        found = 'selected: chaos magic';
        break;
      }
    }
    if (!found) {
      found = 'chaos magic not found. Options: ' + Array.from(options).slice(0,5).map(o => '"' + o.textContent.trim() + '"').join(', ');
    }
    return found;
  });
  console.log('Step 5:', boardSelect);
  
  await page.waitForTimeout(2000);
  
  // STEP 6: Check if board was selected
  const boardCheck = await page.evaluate(() => {
    const boardDisplay = document.querySelector('[data-test-id="board-dropdown-select-button"]');
    return boardDisplay ? boardDisplay.textContent.trim().replace(/\s+/g, ' ') : 'no display';
  });
  console.log('Step 6 - Board display:', boardCheck);
  
  // STEP 7: Click Publish ONLY if board is selected
  if (!boardCheck.toLowerCase().includes('selecciona')) {
    const pubResult = await page.evaluate(() => {
      const pubBtn = document.querySelector('[data-test-id="storyboard-creation-nav-done"]');
      if (pubBtn) {
        pubBtn.dispatchEvent(new MouseEvent('click', {bubbles:true,cancelable:true,view:window}));
        return 'published';
      }
      return 'no publish btn';
    });
    console.log('Step 7:', pubResult);
    
    await page.waitForTimeout(5000);
    
    const finalCheck = await page.evaluate(() => {
      return {
        url: window.location.href,
        text: document.body.innerText.substring(0, 200).replace(/\s+/g, ' ')
      };
    });
    console.log('Final:', JSON.stringify(finalCheck));
    return finalCheck;
  } else {
    return { error: 'board not selected', boardDisplay: boardCheck };
  }
}
