async (page) => {
  // Load pin data via page.request API
  const resp = await page.request.get('http://localhost:8766/pins/pin-data-200.json');
  const raw = await resp.text();
  const pinData = JSON.parse(raw);
  
  // Define remaining batches
  const batches = [
    [114, 118, 'Occult Apps'],
    [118, 122, 'Occult Apps'],
    [122, 126, 'Occult Apps'],
    [126, 128, 'Occult Apps'],
    [128, 132, 'Esoteric Books'],
    [132, 136, 'Esoteric Books'],
    [136, 140, 'Esoteric Books'],
    [140, 146, 'Esoteric Books'],
    [146, 150, 'Witchcraft Spells'],
    [150, 154, 'Witchcraft Spells'],
    [154, 158, 'Witchcraft Spells'],
    [158, 164, 'Witchcraft Spells'],
    [164, 168, 'Lucid Dreaming'],
    [168, 174, 'Lucid Dreaming']
  ];
  
  const results = [];
  
  for (const [start, end, board] of batches) {
    for (let i = start; i < end; i++) {
      const idx = String(i + 1).padStart(3, '0');
      const pin = pinData[i];
      const imgPath = `http://localhost:8766/pins/output/pin-${idx}.png`;
      
      try {
        await page.goto('https://co.pinterest.com/pin-creation-tool/', { waitUntil: 'networkidle', timeout: 30000 });
        await page.waitForTimeout(2000);
        
        // Upload image
        await page.locator('#storyboard-upload-input').setInputFiles(imgPath);
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
        if (await linkField.count() > 0) {
          await linkField.evaluate((el, link) => {
            const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
            setter.call(el, link);
            el.dispatchEvent(new Event('input', { bubbles: true }));
            el.dispatchEvent(new Event('change', { bubbles: true }));
          }, pin.link || 'https://cha0smagicklabs.com/');
          await page.waitForTimeout(500);
        }
        
        // Click Publicar
        const pubBtn = page.getByRole('button', { name: 'Publicar' });
        if (await pubBtn.count() > 0) {
          await pubBtn.click({ force: true, timeout: 15000 });
          await page.waitForTimeout(2000);
          results.push(`${idx}: ✅ ${board}`);
        } else {
          results.push(`${idx}: ⚠️ No btn ${board}`);
        }
      } catch (e) {
        results.push(`${idx}: ❌ ${e.message.substring(0,60)} ${board}`);
      }
    }
  }
  
  return results.join('\n');
}
