async (page) => {
  const info = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const result = [];
    for (const b of buttons) {
      const text = b.textContent.trim().substring(0, 80);
      const rect = b.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        result.push({
          text: JSON.stringify(text),
          classes: b.className.substring(0, 80)
        });
      }
    }
    return result;
  });
  
  // Also check for file input
  const fileInput = await page.evaluate(() => {
    const inputs = document.querySelectorAll('input[type="file"]');
    return inputs.length > 0 ? 'found ' + inputs.length + ' file inputs' : 'no file inputs';
  });
  
  return { buttons: info, fileInput: fileInput };
}
