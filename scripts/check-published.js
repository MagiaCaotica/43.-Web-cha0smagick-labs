async (page) => {
  const result = await page.evaluate(() => {
    // Check for any success message
    const successEls = document.querySelectorAll('[role="status"], [aria-live="polite"], [data-test-id="toast"]');
    const successTexts = Array.from(successEls).map(el => el.textContent.trim().substring(0, 100));
    
    // Check URL
    const url = window.location.href;
    
    // Check for "Pin published" or similar text in body
    const bodyText = document.body.innerText;
    const hasPublishedText = bodyText.includes('published') || bodyText.includes('Publicado');
    
    // Check if drafts changed
    const draftCount = bodyText.includes('Borradores de Pines') ? 
      bodyText.match(/Borradores de Pines \((\d+)\)/)?.[1] : 'unknown';
    
    return {
      url,
      successMessages: successTexts,
      hasPublishedText,
      draftCount,
      bodyPreview: bodyText.substring(0, 400).replace(/\s+/g, ' ')
    };
  });
  
  return result;
}
