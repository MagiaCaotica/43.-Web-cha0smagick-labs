async (page) => {
  // Intercept fetch to find Pinterest's internal API
  const apiCalls = [];
  page.on('request', request => {
    if (request.url().includes('api') || request.method() === 'POST') {
      apiCalls.push({ url: request.url().substring(0, 200), method: request.method() });
    }
  });
  
  // Try clicking publish again and see what API calls happen
  const result = await page.evaluate(() => {
    const btn = document.querySelector('[data-test-id="storyboard-creation-nav-done"]');
    if (!btn) return 'no button';
    btn.dispatchEvent(new MouseEvent('mousedown', {bubbles:true,cancelable:true,view:window}));
    btn.dispatchEvent(new MouseEvent('mouseup', {bubbles:true,cancelable:true,view:window}));
    btn.dispatchEvent(new MouseEvent('click', {bubbles:true,cancelable:true,view:window}));
    return 'clicked with mousedown+mouseup+click';
  });
  
  await page.waitForTimeout(5000);
  
  const state = await page.evaluate(() => {
    return {
      url: window.location.href,
      text: document.body.innerText.substring(0, 300).replace(/\s+/g, ' ')
    };
  });
  
  return { clickResult: result, apiCalls: apiCalls.slice(-10), state: state };
}
