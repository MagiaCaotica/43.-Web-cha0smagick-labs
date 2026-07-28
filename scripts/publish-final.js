async (page) => {
  // Strategy: find all React event handlers on the publish button
  const handlers = await page.evaluate(() => {
    const btn = document.querySelector('[data-test-id="storyboard-creation-nav-done"]');
    if (!btn) return 'no button';
    
    // Get react fiber
    const key = Object.keys(btn).find(k => k.startsWith('__reactFiber') || k.startsWith('__reactProps') || k.startsWith('__reactEventHandlers'));
    const props = key ? btn[key] : null;
    const reactProps = btn.__reactProps || Object.keys(btn).filter(k => k.startsWith('__reactProps')).map(k => btn[k])[0];
    
    const listeners = [];
    if (reactProps) {
      for (const prop of Object.keys(reactProps)) {
        if (prop.startsWith('on')) listeners.push(prop);
      }
    }
    
    return {
      hasReactKey: !!key,
      reactPropsKeys: listeners,
      tag: btn.tagName,
      class: btn.className,
      text: btn.textContent.trim()
    };
  });
  
  console.log('Handlers:', JSON.stringify(handlers));
  
  // Try calling onClick directly if it exists
  const clickResult = await page.evaluate(() => {
    const btn = document.querySelector('[data-test-id="storyboard-creation-nav-done"]');
    if (!btn) return 'no button';
    
    let reactProps = null;
    for (const key of Object.keys(btn)) {
      if (key.startsWith('__reactProps')) {
        reactProps = btn[key];
        break;
      }
    }
    
    if (reactProps && reactProps.onClick) {
      // Create a synthetic React event
      reactProps.onClick({ preventDefault: () => {}, stopPropagation: () => {} });
      return 'called onClick directly';
    }
    
    return 'no react onClick found';
  });
  
  console.log('Click result:', clickResult);
  await page.waitForTimeout(3000);
  
  const state = await page.evaluate(() => {
    return { url: window.location.href, text: document.body.innerText.substring(0, 300).replace(/\s+/g, ' ') };
  });
  
  return { handlers, clickResult, state };
}
