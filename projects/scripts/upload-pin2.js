async (page) => {
  // Inspect all button texts to find the upload one
  const info = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const result = [];
    for (const b of buttons) {
      const text = b.textContent.trim().substring(0, 80);
      const html = b.innerHTML.substring(0, 150);
      const cls = b.className.substring(0, 80);
      const rect = b.getBoundingClientRect();
      result.push({
        text: JSON.stringify(text),
        visible: rect.width > 0 && rect.height > 0,
        classes: cls
      });
    }
    return result;
  });
  console.log('BUTTONS:', JSON.stringify(info, null, 2));
  return 'done';
}
