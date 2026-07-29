async (page) => {
  const base = 'D:\\Paginas web\\Cha0smagick Labs\\43.-Web-cha0smagick-labs';
  const resp = await page.request.get(`http://localhost:8766/pins/pin-data-200.json`);
  const pinData = JSON.parse(await resp.text());
  const results = [];
  // Small batch: pins 115-118 (0-indexed 114-117)
  for (let i = 114; i < 118; i++) {
    const idx = String(i + 1).padStart(3, '0');
    const pin = pinData[i];
    const imgPath = `${base}\\pins\\output\\pin-${idx}.png`;
    try {
      await page.goto('https://co.pinterest.com/pin-creation-tool/', { waitUntil: 'networkidle', timeout: 30000 });
      await page.waitForTimeout(2000);
      await page.locator('#storyboard-upload-input').setInputFiles(imgPath);
      await page.waitForTimeout(4000);
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
      const pubBtn = page.getByRole('button', { name: 'Publicar' });
      if (await pubBtn.count() > 0) {
        await pubBtn.click({ force: true, timeout: 15000 });
        await page.waitForTimeout(2000);
        results.push(`${idx}: ✅ ${pin.title.substring(0,50)}`);
      } else {
        results.push(`${idx}: ⚠️ No btn`);
      }
    } catch (e) {
      results.push(`${idx}: ❌ ${e.message.substring(0,60)}`);
    }
  }
  return results.join('\n');
}
