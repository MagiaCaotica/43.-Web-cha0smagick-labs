async (page) => {
  // Fill the title
  await page.evaluate(() => {
    const titleInput = document.querySelector('input[placeholder="Explica en qué consiste tu Pin"], textarea[placeholder="Explica en qué consiste tu Pin"]');
    if (titleInput) {
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
      nativeInputValueSetter.call(titleInput, 'The 7 Laws of Chaos Magick That Actually Work');
      titleInput.dispatchEvent(new Event('input', { bubbles: true }));
      titleInput.dispatchEvent(new Event('change', { bubbles: true }));
      return 'title filled: ' + titleInput.value;
    }
    return 'title input not found';
  });
  
  await page.waitForTimeout(500);
  
  // Fill the link
  const linkResult = await page.evaluate(() => {
    const linkInput = document.querySelector('input[placeholder="Añade un enlace"]');
    if (linkInput) {
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
      nativeInputValueSetter.call(linkInput, 'https://cha0smagicklabs.com/blog/chaos-magick-beginners.html');
      linkInput.dispatchEvent(new Event('input', { bubbles: true }));
      linkInput.dispatchEvent(new Event('change', { bubbles: true }));
      return 'link filled: ' + linkInput.value;
    }
    return 'link input not found';
  });
  
  return 'title and ' + linkResult;
}
