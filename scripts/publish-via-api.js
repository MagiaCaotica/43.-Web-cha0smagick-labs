async (page) => {
  await page.waitForTimeout(1000);
  
  // Check if we have Pinterest API tokens available in the page
  const apiCheck = await page.evaluate(() => {
    // Check for the Pin ID from the draft
    const url = window.location.href;
    
    // Try to find React's internal state or API base
    const scripts = document.querySelectorAll('script[src*="pinterest"]');
    
    // Check for __PWS_ROOT or similar
    const pws = window.__PWS_ROOT || window.__PIN_STORE || window.__INITIAL_STATE;
    
    // Look for fetch/AJAX
    const cookieStr = document.cookie;
    const hasAuthCookie = cookieStr.includes('auth') || cookieStr.includes('token') || cookieStr.includes('session');
    
    return {
      url: url,
      hasPWS: !!pws,
      hasAuthCookie: hasAuthCookie,
      cookieLength: cookieStr.length,
      scriptCount: scripts.length
    };
  });
  
  console.log('API check:', JSON.stringify(apiCheck));
  
  // Try to use the keyboard to navigate to and activate the publish button
  await page.keyboard.press('Tab');
  await page.waitForTimeout(200);
  await page.keyboard.press('Tab');
  await page.waitForTimeout(200);
  await page.keyboard.press('Tab');
  await page.waitForTimeout(200);
  await page.keyboard.press('Enter');
  await page.waitForTimeout(3000);
  
  const state = await page.evaluate(() => {
    return {
      url: window.location.href,
      text: document.body.innerText.substring(0, 300).replace(/\s+/g, ' ')
    };
  });
  
  return { apiCheck, state };
}
