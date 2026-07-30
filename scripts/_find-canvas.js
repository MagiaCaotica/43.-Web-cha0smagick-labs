await page.evaluate(() => {
  // Check for canvas elements
  const canvases = document.querySelectorAll('canvas');
  const result = {canvases: [], mainContent: null, svgAddBtns: []};
  
  canvases.forEach((c, i) => {
    const rect = c.getBoundingClientRect();
    result.canvases.push({idx: i, w: rect.width, h: rect.height, x: rect.x, y: rect.y});
  });
  
  // Get the main content area structure
  const main = document.querySelector('main') || document.querySelector('[class*="main"]');
  if (main) {
    const rect = main.getBoundingClientRect();
    result.mainContent = {tag: main.tagName, x: rect.x, y: rect.y, w: rect.width, h: rect.height, html: main.innerHTML.substring(0, 2000)};
  }
  
  // Look for SVG elements
  const svgs = document.querySelectorAll('svg');
  result.svgs = Array.from(svgs).slice(0,10).map(s => {
    const rect = s.getBoundingClientRect();
    return {w: rect.width, h: rect.height, x: rect.x, y: rect.y, inner: s.innerHTML.substring(0,100)};
  }).filter(s => s.w > 0);
  
  return JSON.stringify(result);
});
