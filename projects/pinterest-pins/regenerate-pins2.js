async (page) => {
  const out = 'D:/Paginas web/Cha0smagick Labs/43.-Web-cha0smagick-labs/projects/pinterest-pins/output/';
  let ok = 0, fail = 0;
  for (let i = 0; i < 174; i++) {
    try {
      await page.evaluate((idx) => window.renderPinIndex(idx), i);
      const pad = String(i + 1).padStart(3, '0');
      await page.screenshot({ path: out + 'pin-' + pad + '.png', fullPage: true });
      ok++;
    } catch (e) { fail++; }
  }
  return 'ok=' + ok + ' fail=' + fail;
}
