async (page) => {
  const state = await page.evaluate(() => {
    // Check URL
    const url = window.location.href;
    
    // Check for any toast/notification
    const toasts = document.querySelectorAll('[role="status"], [aria-live="polite"], [data-test-id="toast"]');
    const toastTexts = Array.from(toasts).map(t => t.textContent.trim());
    
    // Check drafts count
    const draftEl = document.querySelector('[data-test-id="draft-count"], [data-test-id="storyboard-draft-count"]');
    const draftText = draftEl ? draftEl.textContent.trim() : 'no draft element';
    
    // Check for Pin created confirmation or similar
    const allText = document.body.innerText.substring(0, 500);
    
    return {
      url: url,
      toasts: toastTexts,
      drafts: draftText,
      bodyPreview: allText.replace(/\s+/g, ' ').substring(0, 300)
    };
  });
  
  return state;
}
