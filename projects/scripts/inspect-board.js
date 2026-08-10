async (page) => {
  const result = await page.evaluate(() => {
    // The board selector button from the snapshot says "Tablero Selecciona un tablero Abrir menú desplegable"
    // Let's look for buttons containing specific text
    const buttons = document.querySelectorAll('button');
    const allTexts = [];
    for (const b of buttons) {
      const text = b.textContent.trim().substring(0, 80).replace(/\s+/g, ' ');
      const cls = b.className.substring(0, 60);
      const rect = b.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        allTexts.push({ text: text, cls: cls, w: rect.width, h: rect.height });
      }
    }
    return allTexts;
  });
  
  return result;
}
