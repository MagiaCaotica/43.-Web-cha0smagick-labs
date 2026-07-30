module.exports = async (page) => {
  const btns = page.locator('button');
  const count = await btns.count();
  console.log('total buttons:', count);
  const lastVisible = [];
  for (let i = 0; i < count; i++) {
    const visible = await btns.nth(i).isVisible();
    const disabled = await btns.nth(i).isDisabled();
    if (visible && !disabled) lastVisible.push(i);
  }
  console.log('last few visible buttons:', lastVisible.slice(-5));
  if (lastVisible.length >= 3) {
    const idx = lastVisible[lastVisible.length - 3];
    console.log('clicking button index:', idx);
    await btns.nth(idx).click();
    await page.waitForTimeout(2000);
    console.log('clicked');
  } else {
    console.log('not enough visible buttons');
  }
};
