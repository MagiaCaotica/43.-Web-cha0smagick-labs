async (page) => {
  const result = await page.evaluate(() => {
    const buttons = document.querySelectorAll('[role=button], button');
    for (const b of buttons) {
      if (b.textContent.includes('I Ching')) {
        b.dispatchEvent(new MouseEvent('click', {bubbles:true,cancelable:true,view:window}));
        return 'clicked draft: ' + b.textContent.trim().substring(0, 60).replace(/\s+/g, ' ');
      }
    }
    return 'draft not found';
  });
  
  if (result.includes('clicked')) {
    await page.waitForTimeout(2000);
    const pubBtn = page.getByRole('button', { name: 'Publicar' });
    if (await pubBtn.isVisible().catch(() => false)) {
      await pubBtn.click({ force: true });
      return 'Clicked draft and published: ' + result;
    }
    return 'Clicked draft but no Publicar: ' + result;
  }
  return result;
}
