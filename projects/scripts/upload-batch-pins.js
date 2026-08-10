async (page) => {
  const resp = await fetch('http://localhost:8765/pins/pin-data-200.json');
  const pinData = await resp.json();
  
  // Define batches: [startIdx (0-based), endIdx (exclusive), boardName]
  const batches = [
    [114, 128, 'Occult Apps'],
    [128, 146, 'Esoteric Books'],
    [146, 164, 'Witchcraft Spells'],
    [164, 174, 'Lucid Dreaming']
  ];
  
  const results = [];
  
  for (const [start, end, board] of batches) {
    for (let i = start; i < end; i++) {
      const idx = String(i + 1).padStart(3, '0');
      const pin = pinData[i];
      const imgPath = `http://localhost:8765/pins/output/pin-${idx}.png`;
      
      try {
        await page.goto('https://co.pinterest.com/pin-creation-tool/', { waitUntil: 'networkidle', timeout: 30000 });
        await page.waitForTimeout(2000);
        
        // Upload image
        const fileInput = page.locator('#storyboard-upload-input');
        await fileInput.setInputFiles(imgPath);
        await page.waitForTimeout(4000);
        
        // Fill title using native setter
        const titleField = page.locator('#storyboard-selector-title');
        await titleField.evaluate((el, title) => {
          const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
          setter.call(el, '');
          el.dispatchEvent(new Event('input', { bubbles: true }));
          el.dispatchEvent(new Event('change', { bubbles: true }));
          setTimeout(() => {
            setter.call(el, title);
            el.dispatchEvent(new Event('input', { bubbles: true }));
            el.dispatchEvent(new Event('change', { bubbles: true }));
          }, 100);
        }, pin.title);
        await page.waitForTimeout(800);
        
        // Fill link
        const linkField = page.locator('#WebsiteField');
        const linkCount = await linkField.count();
        if (linkCount > 0) {
          await linkField.evaluate((el, link) => {
            const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
            setter.call(el, link);
            el.dispatchEvent(new Event('input', { bubbles: true }));
            el.dispatchEvent(new Event('change', { bubbles: true }));
          }, pin.link || 'https://cha0smagicklabs.com/');
          await page.waitForTimeout(500);
        }
        
        // Select board if available
        const boardBtn = page.getByRole('button', { name: /Tablero/i });
        const boardBtnCount = await boardBtn.count();
        if (boardBtnCount > 0) {
          const boardText = await boardBtn.textContent();
          if (boardText && !boardText.toLowerCase().includes(board.toLowerCase().slice(0, 8))) {
            await boardBtn.click();
            await page.waitForTimeout(1000);
            const boardOption = page.getByText(board, { exact: true });
            const optCount = await boardOption.count();
            if (optCount > 0) {
              await boardOption.click();
              await page.waitForTimeout(500);
            }
          }
        }
        
        // Click Publicar
        const pubBtn = page.getByRole('button', { name: 'Publicar' });
        const pubCount = await pubBtn.count();
        if (pubCount > 0) {
          await pubBtn.click({ force: true, timeout: 15000 });
          await page.waitForTimeout(2000);
          results.push(`${idx}: ✅ Published to ${board}`);
        } else {
          results.push(`${idx}: ⚠️ No Publicar btn (${board})`);
        }
      } catch (e) {
        results.push(`${idx}: ❌ Error - ${e.message} (${board})`);
      }
    }
  }
  
  return results.join('\n');
}
