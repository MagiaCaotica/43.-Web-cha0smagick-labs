async (page) => {
  const fs = require('fs');
  const path = require('path');
  const outDir = 'D:/Paginas web/Cha0smagick Labs/43.-Web-cha0smagick-labs/projects/pinterest-pins/output';
  // Determinamos los índices con PNG válido existente (sin error-*)
  let valid = [];
  for (let i = 1; i <= 174; i++) {
    const p = path.join(outDir, 'pin-' + String(i).padStart(3, '0') + '.png');
    if (fs.existsSync(p)) valid.push(i - 1);
  }
  let ok = 0, fail = 0;
  for (const idx of valid) {
    try {
      await page.evaluate((i) => window.renderPinIndex(i), idx);
      const p = path.join(outDir, 'pin-' + String(idx + 1).padStart(3, '0') + '.png');
      await page.screenshot({ path: p, fullPage: true });
      ok++;
    } catch (e) { fail++; }
  }
  return 'ok=' + ok + ' fail=' + fail;
}
