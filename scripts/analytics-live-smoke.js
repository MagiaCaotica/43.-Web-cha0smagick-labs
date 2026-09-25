const { chromium } = require('playwright');

function argument(name, fallback) {
  const index = process.argv.indexOf(name);
  return index >= 0 && process.argv[index + 1] ? process.argv[index + 1] : fallback;
}

(async () => {
  const url = argument('--url', process.env.PUBLIC_SITE_URL || 'https://cha0smagicklabs.com');
  const waitMs = Number(argument('--wait', '2500'));
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage();
  const hosts = new Map();
  const events = new Set();
  page.on('request', (request) => {
    try {
      const host = new URL(request.url()).hostname;
      if (/google-analytics\.com|googletagmanager\.com|doubleclick\.net|facebook\.net|hotmart/i.test(host)) {
        hosts.set(host, (hosts.get(host) || 0) + 1);
      }
    } catch (_) {
      // Ignore malformed request URLs.
    }
  });

  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
  const consent = page.getByRole('button', { name: /accept|aceptar|consentir/i }).first();
  if (await consent.count()) {
    try {
      if (await consent.isVisible()) await consent.click();
    } catch (_) {
      // Consent is optional for this diagnostic smoke test.
    }
  }
  await page.waitForTimeout(waitMs);
  const dataLayerEvents = await page.evaluate(() => {
    if (!Array.isArray(window.dataLayer)) return [];
    return window.dataLayer.map((entry) => entry && entry.event).filter(Boolean);
  });
  dataLayerEvents.forEach((event) => events.add(String(event)));
  const result = {
    url,
    title: await page.title(),
    dataLayerAvailable: dataLayerEvents.length > 0,
    dataLayerEventCount: dataLayerEvents.length,
    dataLayerEventNames: [...events].slice(0, 20),
    telemetryHosts: Object.fromEntries(hosts),
    status: 'observed-public-browser-behavior'
  };
  console.log(JSON.stringify(result, null, 2));
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(JSON.stringify({ error: error.message }));
  process.exitCode = 1;
});
