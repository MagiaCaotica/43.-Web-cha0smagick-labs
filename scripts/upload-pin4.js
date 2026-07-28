async (page) => {
  // Try clicking the upload area div directly
  const result = await page.evaluate(() => {
    const fileInput = document.querySelector('input[type="file"]');
    if (!fileInput) return 'no file input';
    
    // Try to click the label or parent that triggers the file input
    const label = document.querySelector('label[for="' + fileInput.id + '"]');
    if (label) { label.click(); return 'clicked label: ' + fileInput.id; }
    
    // Find the parent div with upload text and click it
    const uploadArea = fileInput.closest('[role="button"], button');
    if (uploadArea) { uploadArea.click(); return 'clicked upload area parent'; }
    
    // Get the file input's parent structure
    const parent = fileInput.parentElement;
    const grandparent = parent ? parent.parentElement : null;
    if (grandparent) {
      const clickable = grandparent.querySelector('button, [role="button"]');
      if (clickable) { clickable.click(); return 'clicked grandchild button'; }
    }
    
    return 'fileInput id: ' + (fileInput.id || 'no-id') + ' class: ' + (fileInput.className || '');
  });
  console.log('Click result:', result);
  return result;
}
