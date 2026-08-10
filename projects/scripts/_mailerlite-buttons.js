/**
 * Run: node scripts/_mailerlite-buttons.js
 */
(async () => {
  const { chromium } = require('playwright');
  const fs = require('fs');
  
  // Load cookies from the previous session
  const context = await (await chromium.launch({ headless: false })).newContext();
  
  // Navigate to MailerLite automation editor
  const page = await context.newPage();
  
  // Load existing storage state if available
  try {
    const storage = JSON.parse(fs.readFileSync('.playwright-mcp/storageState.json', 'utf8'));
    await context.addCookies(storage.cookies || []);
  } catch(e) {}
  
  await page.goto('https://dashboard.mailerlite.com/automations/194259024266397145/edit', { waitUntil: 'networkidle' });
  
  // Check if logged in
  const text = await page.evaluate(() => document.body.innerText.substring(0, 500));
  console.log('PAGE TEXT:', text.substring(0, 300));
  
  // Find all buttons
  const buttons = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('button')).map(b => ({
      text: b.textContent.trim().substring(0, 80),
      disabled: b.disabled,
      visible: b.offsetParent !== null
    }));
  });
  console.log('\nBUTTONS:', JSON.stringify(buttons, null, 2));
  
  // Find all clickable elements that say "add" or "+"
  const addEls = await page.evaluate(() => {
    const all = document.querySelectorAll('*');
    const results = [];
    all.forEach(el => {
      const text = el.textContent.trim();
      if ((text === '+' || text.includes('Add') || text.includes('add') || text.includes('email') || text.includes('Email')) && el.offsetParent !== null) {
        const tag = el.tagName;
        const rect = el.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          results.push({tag, text: text.substring(0, 50), rect: `${rect.x},${rect.y},${rect.width}x${rect.height}`, class: el.className.substring(0, 60)});
        }
      }
    });
    return results.slice(0, 30);
  });
  console.log('\nADD/EMAIL ELEMENTS:', JSON.stringify(addEls, null, 2));
  
  await context.close();
})();
