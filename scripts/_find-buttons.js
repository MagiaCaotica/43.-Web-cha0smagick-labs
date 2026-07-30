const allBtns = document.querySelectorAll('button');
const results = [];
allBtns.forEach((b, i) => {
  const text = b.textContent.trim().substring(0, 80);
  const visible = b.offsetParent !== null;
  const disabled = b.disabled;
  const rect = b.getBoundingClientRect();
  results.push({i, text, visible, disabled, x: rect.x, y: rect.y, w: rect.width, h: rect.height});
});
console.log(JSON.stringify(results, null, 2));
