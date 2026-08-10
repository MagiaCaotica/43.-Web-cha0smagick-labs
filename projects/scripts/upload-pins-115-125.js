async (page) => {
  const BASE = 'D:\\Paginas web\\Cha0smagick Labs\\43.-Web-cha0smagick-labs';
  
  const pins = [
    { n: 116, t: 'Astrology Lab - Track Planetary Transits with Android App', b: 'Occult Apps' },
    { n: 117, t: 'Goetia Seals Generator App - 72 Spirits of Solomon', b: 'Occult Apps' },
    { n: 118, t: 'Raider Waite Tarot Guide - Meanings & Card Interpretation App', b: 'Occult Apps' },
    { n: 119, t: 'Zener Cards ESP Test - Test Your Psychic Ability Online', b: 'Occult Apps' },
    { n: 120, t: 'I Ching Oracle - Ancient Chinese Divination App', b: 'Occult Apps' },
    { n: 121, t: 'Candle Color Calculator - Find the Perfect Candle Magick Color', b: 'Occult Apps' },
    { n: 122, t: 'Digital Pendulum - Online Dowsing & Divination Tool', b: 'Occult Apps' },
    { n: 123, t: 'Spell Builder - Create Custom Spells with Android App', b: 'Occult Apps' },
    { n: 124, t: 'Astral Chart Calculator - Your Complete Birth Chart App', b: 'Occult Apps' },
    { n: 125, t: 'The Complete Occult Collection - 11 Android Apps & 7 Books', b: 'Occult Apps' }
  ];
  
  const results = [];
  
  for (const pin of pins) {
    const imgPath = BASE + '\\pins\\output\\pin-' + String(pin.n).padStart(3, '0') + '.png';
    
    try {
      await page.goto('https://co.pinterest.com/pin-creation-tool/', { waitUntil: 'domcontentloaded', timeout: 30000 });
      await page.waitForTimeout(2000);
      
      // Upload image from local file
      const input = await page.$('#storyboard-upload-input');
      if (!input) { results.push(`${pin.n}: NO FILE INPUT`); continue; }
      await input.setInputFiles(imgPath);
      await page.waitForTimeout(3000);
      
      // Fill title via native setter
      await page.evaluate((t) => {
        const el = document.querySelector('#storyboard-selector-title');
        if (!el) return 'no-title';
        Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(el, t);
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
      }, pin.t);
      await page.waitForTimeout(500);
      
      // Fill link
      await page.evaluate(() => {
        const el = document.querySelector('#WebsiteField');
        if (!el) return;
        Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(el, 'https://cha0smagicklabs.com/');
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
      });
      await page.waitForTimeout(500);
      
      // Try Publicar button
      let clicked = false;
      const selectors = [
        'button[data-test-id="storyboard-creation-nav-done"]',
        'button:has-text("Publicar")',
        'button[name="done"]'
      ];
      for (const sel of selectors) {
        const btn = await page.$(sel);
        if (btn) {
          const text = await btn.textContent();
          if (text && (text.includes('Publicar') || text.includes('publicar'))) {
            await btn.click({ force: true, timeout: 15000 });
            clicked = true;
            break;
          }
        }
      }
      
      if (clicked) {
        await page.waitForTimeout(3000);
        results.push(`${pin.n}: ✅ Published - ${pin.t.substring(0, 40)}`);
      } else {
        results.push(`${pin.n}: ⚠️ No publish button - ${pin.t.substring(0, 30)}`);
      }
    } catch(e) {
      results.push(`${pin.n}: ❌ ${e.message.substring(0, 80)}`);
    }
  }
  
  return results.join('\n');
}
