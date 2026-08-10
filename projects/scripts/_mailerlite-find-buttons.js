module.exports = async (page) => {
  // Find add-step buttons
  const addBtns = page.locator('button:has(svg), button[class*="add"], button[class*="plus"], button[aria-label*="add" i], button[aria-label*="Add"]');
  const count = await addBtns.count();
  console.log('Potential add buttons:', count);
  for (let i = 0; i < count; i++) {
    const html = await addBtns.nth(i).evaluate(el => el.outerHTML.substring(0, 300));
    const visible = await addBtns.nth(i).isVisible();
    console.log('Btn', i, 'visible:', visible, 'html:', html);
  }
  
  // Also list all buttons
  const allBtns = page.locator('button');
  const total = await allBtns.count();
  console.log('\nTotal buttons:', total);
  for (let i = 0; i < Math.min(total, 20); i++) {
    const text = await allBtns.nth(i).textContent();
    const visible = await allBtns.nth(i).isVisible();
    const disabled = await allBtns.nth(i).isDisabled();
    console.log('Button', i, 'visible:', visible, 'disabled:', disabled, 'text:', JSON.stringify(text.trim().substring(0, 50)));
  }
};
