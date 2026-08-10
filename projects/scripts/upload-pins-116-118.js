async (page) => {
  const BASE = 'D:\\Paginas web\\Cha0smagick Labs\\43.-Web-cha0smagick-labs';
  
  const pins = [
    { n: 116, t: 'Astrology Lab - Track Planetary Transits with Android App' },
    { n: 117, t: 'Goetia Seals Generator App - 72 Spirits of Solomon' },
    { n: 118, t: 'Raider Waite Tarot Guide - Meanings & Card Interpretation App' }
  ];
  
  const results = [];
  
  for (const pin of pins) {
    const imgPath = BASE + '\\pins\\output\\pin-' + String(pin.n).padStart(3, '0') + '.png';
    
    try {
      await page.goto('https://co.pinterest.com/pin-creation-tool/', { waitUntil: 'domcontentloaded', timeout: 20000 });
      await page.waitForTimeout(2000);
      
      const input = await page.$('#storyboard-upload-input');
      if (!input) { results.push(`${pin.n}: NO FILE INPUT`); continue; }
      await input.setInputFiles(imgPath);
      await page.waitForTimeout(3000);
      
      await page.evaluate((t) => {
        const el = document.querySelector('#storyboard-selector-title');
        if (!el) return;
        Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(el, t);
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
      }, pin.t);
      await page.waitForTimeout(300);
      
      await page.evaluate(() => {
        const el = document.querySelector('#WebsiteField');
        if (!el) return;
        Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(el, 'https://cha0smagicklabs.com/');
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
      });
      await page.waitForTimeout(300);
      
      const pubBtn = await page.$('button[data-test-id="storyboard-creation-nav-done"]');
      if (!pubBtn) { results.push(`${pin.n}: NO PUB BTN`); continue; }
      await pubBtn.click({ force: true, timeout: 15000 });
      await page.waitForTimeout(2000);
      
      results.push(`${pin.n}: ✅ Published`);
    } catch(e) {
      results.push(`${pin.n}: ❌ ${e.message.substring(0, 80)}`);
    }
  }
  
  return results.join('\n');
}
