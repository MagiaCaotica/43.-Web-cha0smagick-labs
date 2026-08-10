async (page) => {
  const filePath = 'D:\\Paginas web\\Cha0smagick Labs\\43.-Web-cha0smagick-labs\\pins\\output\\01-chaos-magick-quote.png';
  
  // Use setInputFiles on the hidden file input
  const inputHandle = await page.$('#storyboard-upload-input');
  if (inputHandle) {
    await inputHandle.setInputFiles(filePath);
    return 'file set via setInputFiles';
  }
  
  // Fallback: try clicking and using file chooser
  const allUploadElements = await page.evaluate(() => {
    const input = document.querySelector('#storyboard-upload-input');
    if (input) {
      input.click();
      return 'clicked file input directly';
    }
    return 'file input not found';
  });
  
  return 'fallback: ' + allUploadElements;
}
