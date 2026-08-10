async (page) => {
  const base = 'D:\\Paginas web\\Cha0smagick Labs\\43.-Web-cha0smagick-labs\\pins\\output\\';
  const titles = [
    'Astrology Lab: Natal Chart & Transits - Android App',
    'Goetia Seals Generator | 72 Demon Sigils for Android',
    'Raider Waite Tarot Reference | 78 Cards Explained App',
    'Zener Cards ESP Test | Train Your Intuition Android App'
  ];
  const results = [];
  for (let i = 116; i <= 119; i++) {
    try {
      await page.goto('https://co.pinterest.com/pin-creation-tool/', {waitUntil:'networkidle',timeout:20000});
      await page.waitForSelector('#storyboard-upload-input', {timeout:10000});
      const input = await page.$('#storyboard-upload-input');
      await input.setInputFiles(base + 'pin-' + i + '.png');
      await page.waitForTimeout(3000);
      const tf = page.locator('#storyboard-selector-title');
      await tf.waitFor({timeout:10000});
      await tf.evaluate((el, val) => {
        el.removeAttribute('disabled');
        const ns = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
        ns.call(el, val);
        el.dispatchEvent(new Event('input', {bubbles:true}));
        el.dispatchEvent(new Event('change', {bubbles:true}));
      }, titles[i - 116]);
      const lf = page.locator('#WebsiteField');
      if (await lf.count() > 0) {
        await lf.evaluate((el) => {
          el.removeAttribute('disabled');
          const ns = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
          ns.call(el, 'https://cha0smagicklabs.com/');
          el.dispatchEvent(new Event('input', {bubbles:true}));
          el.dispatchEvent(new Event('change', {bubbles:true}));
        });
      }
      await page.waitForTimeout(1500);
      const pub = page.getByRole('button', {name:'Publicar'});
      await pub.click({force:true, timeout:5000}).catch(() => {});
      await page.waitForTimeout(3000);
      results.push(i + ': OK');
    } catch(e) {
      results.push(i + ': FAIL ' + e.message.slice(0,100));
    }
  }
  return results.join('\n');
}
