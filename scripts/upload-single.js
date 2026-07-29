async (page) => {
  const base = 'D:\\Paginas web\\Cha0smagick Labs\\43.-Web-cha0smagick-labs';
  const resp = await page.request.get('http://localhost:8766/pins/pin-data-200.json');
  const pinData = JSON.parse(await resp.text());
  const pinIdx = 115; // 0-indexed -> pin-116
  const idx = String(pinIdx + 1).padStart(3, '0');
  const pin = pinData[pinIdx];
  const imgPath = `${base}\\pins\\output\\pin-${idx}.png`;
  
  await page.goto('https://co.pinterest.com/', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(3000);
  // Use unique URL param to avoid ERR_ABORTED
  await page.goto('https://co.pinterest.com/pin-creation-tool/?t='+Date.now(), { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(3000);
  await page.locator('#storyboard-upload-input').setInputFiles(imgPath);
  await page.waitForTimeout(5000);
  
  const titleField = page.locator('#storyboard-selector-title');
  await titleField.evaluate((el, t) => {
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
    setter.call(el, ''); el.dispatchEvent(new Event('input',{bubbles:true}));
    setTimeout(() => {
      setter.call(el, t); el.dispatchEvent(new Event('input',{bubbles:true}));
      el.dispatchEvent(new Event('change',{bubbles:true}));
    }, 100);
  }, pin.title);
  await page.waitForTimeout(1000);
  
  const linkField = page.locator('#WebsiteField');
  if (await linkField.count() > 0) {
    await linkField.evaluate((el, l) => {
      const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
      setter.call(el, l); el.dispatchEvent(new Event('input',{bubbles:true}));
      el.dispatchEvent(new Event('change',{bubbles:true}));
    }, pin.link || 'https://cha0smagicklabs.com/');
  }
  await page.waitForTimeout(1000);
  
  const pubBtn = page.getByRole('button', { name: 'Publicar' });
  const pubCount = await pubBtn.count();
  if (pubCount > 0) {
    await pubBtn.click({ force: true, timeout: 30000 });
    await page.waitForTimeout(3000);
    return `${idx}: ✅ ${pin.title}`;
  }
  return `${idx}: ⚠️ No Publicar btn found`;
}
