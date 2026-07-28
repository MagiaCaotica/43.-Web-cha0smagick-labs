async (page) => {
  const result = await page.evaluate(() => {
    const buttons = document.querySelectorAll('button');
    for (const b of buttons) {
      if (b.textContent.includes('Chaos Magick That Actually Work')) {
        b.dispatchEvent(new MouseEvent('click', {bubbles:true,cancelable:true,view:window}));
        return 'clicked draft: ' + b.textContent.trim().substring(0, 60).replace(/\s+/g, ' ');
      }
    }
    return 'draft not found';
  });
  
  console.log('Draft click:', result);
  await page.waitForTimeout(2000);
  
  const state = await page.evaluate(() => {
    const img = document.querySelector('img[alt*="subida"]');
    return {
      hasImage: img ? true : false,
      title: document.querySelector('input[placeholder*="Explica"]') ? 'has title field' : 'no title',
      textPreview: document.body.innerText.substring(0, 200).replace(/\s+/g, ' ')
    };
  });
  
  return state;
}
