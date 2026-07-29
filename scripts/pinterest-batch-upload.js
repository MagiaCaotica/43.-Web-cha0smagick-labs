/**
 * Pinterest Batch Upload Script
 * 
 * Publishes ALL remaining pins from pins/pin-data.js to Pinterest
 * Requires: Node.js + playwright package
 * 
 * SETUP:
 *   1. npm install playwright
 *   2. npx playwright install chromium
 *   3. Open Pinterest in your browser and save cookies:
 *      - Install "Get cookies.txt" extension
 *      - Export cookies from co.pinterest.com
 *      - Save as cookies.json in project root
 *   4. node scripts/pinterest-batch-upload.js
 * 
 * The script reads pin-data.js, iterates through all pins,
 * uploads images from pins/output/, fills form, selects board, publishes.
 */

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const PROJECT_ROOT = path.resolve(__dirname, '..');
const OUTPUT_DIR = path.join(PROJECT_ROOT, 'pins', 'output');
const COOKIES_PATH = path.join(PROJECT_ROOT, 'cookies.json');

// Pin data - loaded from pin-data.js
function loadPinData() {
  const pinDataPath = path.join(PROJECT_ROOT, 'pins', 'pin-data.js');
  const content = fs.readFileSync(pinDataPath, 'utf-8');
  // Extract window.PIN_DATA array
  const match = content.match(/window\.PIN_DATA\s*=\s*(\[[\s\S]*?\]);/);
  if (!match) throw new Error('Could not parse PIN_DATA from pin-data.js');
  return JSON.parse(match[1]);
}

// Board name normalization (match Pinterest board names exactly)
const BOARD_MAP = {
  'Chaos Magick': 'Chaos Magick',
  'Sigil Magick': 'Sigil Magick',
  'Rune Meanings': 'Rune Meanings',
  'Tarot Divination': 'Tarot',
  'Astrology Apps': 'Astrology Apps',
  'Occult Apps': 'Occult Apps',
  'Esoteric Books': 'Esoteric Books',
  'Witchcraft Spells': 'Witchcraft Spells',
  'Lucid Dreaming': 'Lucid Dreaming',
};

// Pin index to PNG filename
function getPinFilename(index) {
  return `pin-${String(index + 1).padStart(3, '0')}.png`;
}

async function uploadSinglePin(page, pin, index) {
  const filename = getPinFilename(index);
  const imagePath = path.join(OUTPUT_DIR, filename);
  
  if (!fs.existsSync(imagePath)) {
    console.log(`  ⚠️  Image not found: ${filename} - skipping pin ${index + 1}`);
    return false;
  }

  const boardName = BOARD_MAP[pin.board] || pin.board;
  
  try {
    // 1. Navigate to pin creation tool
    await page.goto('https://co.pinterest.com/pin-creation-tool/', { 
      waitUntil: 'networkidle', 
      timeout: 30000 
    });
    
    // Wait for page to fully render
    await page.waitForTimeout(3000);

    // 2. Upload image via hidden file input
    const uploadInput = page.locator('input[type="file"]').first();
    if (!(await uploadInput.isVisible().catch(() => false))) {
      // Try to click "Crear nuevo" or upload area first
      const createBtn = page.getByRole('button', { name: /Crear nuevo|Crear|Upload|Create/i });
      if (await createBtn.isVisible().catch(() => false)) {
        await createBtn.click();
        await page.waitForTimeout(2000);
      }
    }
    
    await uploadInput.setInputFiles(imagePath);
    
    // 3. Wait for form to load and image to process
    await page.waitForTimeout(3000);
    
    // 4. Fill title
    const titleInput = page.locator('#storyboard-selector-title, [placeholder*="title" i], [placeholder*="título" i]').first();
    await titleInput.waitFor({ state: 'visible', timeout: 10000 });
    await titleInput.click();
    await titleInput.fill('');
    await titleInput.type(pin.title, { delay: 10 });
    
    // 5. Fill link
    const linkInput = page.locator('#WebsiteField, [placeholder*="link" i], [placeholder*="enlace" i]').first();
    if (await linkInput.isVisible().catch(() => false)) {
      await linkInput.click();
      await linkInput.fill('');
      await linkInput.type(pin.link || 'https://cha0smagicklabs.com/', { delay: 10 });
    }
    
    // 6. Select board via dropdown
    try {
      const boardDropdown = page.getByRole('button', { name: /Tablero|Board/i }).first();
      if (await boardDropdown.isVisible({ timeout: 3000 }).catch(() => false)) {
        await boardDropdown.click();
        await page.waitForTimeout(1000);
        
        const boardOption = page.getByRole('option', { name: new RegExp(boardName, 'i') }).first();
        if (await boardOption.isVisible({ timeout: 3000 }).catch(() => false)) {
          await boardOption.click();
          await page.waitForTimeout(500);
        }
      }
    } catch (e) {
      console.log(`  Board selection failed, trying default: ${e.message}`);
    }
    
    // 7. Click Publicar
    const publishBtn = page.getByRole('button', { name: /Publicar|Publish|Guardar|Save/i }).first();
    await publishBtn.waitFor({ state: 'visible', timeout: 5000 });
    await publishBtn.click({ force: true, timeout: 10000 });
    
    // 8. Wait for publish to complete
    await page.waitForTimeout(3000);
    
    console.log(`  ✅ Pin ${index + 1}/${TOTAL_PINS} published: "${pin.title.substring(0, 50)}..." -> ${boardName}`);
    return true;
  } catch (err) {
    console.log(`  ❌ Pin ${index + 1} FAILED: ${err.message.substring(0, 100)}`);
    // Take screenshot for debugging
    try {
      await page.screenshot({ path: path.join(OUTPUT_DIR, `error-${index + 1}.png`) });
    } catch (e) {}
    return false;
  }
}

let TOTAL_PINS = 0;

async function main() {
  console.log('=== Pinterest Batch Upload ===');
  console.log(`Output dir: ${OUTPUT_DIR}`);
  
  const pinData = loadPinData();
  TOTAL_PINS = pinData.length;
  
  // Check which pin images exist
  const existingPins = pinData.map((_, i) => {
    const f = getPinFilename(i);
    return { index: i, exists: fs.existsSync(path.join(OUTPUT_DIR, f)) };
  }).filter(p => p.exists);
  
  console.log(`\n📊 Pin data loaded: ${pinData.length} entries`);
  console.log(`📦 PNGs found: ${existingPins.length}`);
  console.log(`❌ Missing PNGs: ${pinData.length - existingPins.length}`);
  console.log(`\nResume from pin: ${process.argv[2] ? parseInt(process.argv[2]) : 0}`);
  
  const START_INDEX = process.argv[2] ? parseInt(process.argv[2]) : 0;
  
  // Launch browser
  const browser = await chromium.launch({ 
    headless: false,
    args: ['--disable-blink-features=AutomationControlled']
  });
  
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    locale: 'es-CO',
  });
  
  // Load cookies if available
  if (fs.existsSync(COOKIES_PATH)) {
    const cookies = JSON.parse(fs.readFileSync(COOKIES_PATH, 'utf-8'));
    await context.addCookies(cookies);
    console.log('🍪 Cookies loaded');
  } else {
    console.log('⚠️  No cookies.json found. You will need to login manually.');
  }
  
  const page = await context.newPage();
  
  // Check if logged in
  await page.goto('https://co.pinterest.com/', { waitUntil: 'networkidle' });
  
  if (page.url().includes('login')) {
    console.log('\n🔑 Please login manually in the browser window...');
    console.log('   Email: magiacaoticapractica@gmail.com');
    await page.waitForURL('https://co.pinterest.com/**', { timeout: 120000 });
    console.log('✅ Login detected!');
    
    // Save cookies for next run
    const cookies = await context.cookies();
    fs.writeFileSync(COOKIES_PATH, JSON.stringify(cookies, null, 2));
    console.log('🍪 Cookies saved for next run');
  }
  
  // Start uploading
  let success = 0;
  let failed = 0;
  const startTime = Date.now();
  
  for (let i = START_INDEX; i < pinData.length; i++) {
    console.log(`\n--- Pin ${i + 1}/${pinData.length}: "${pinData[i].title.substring(0, 40)}..."`);
    
    const ok = await uploadSinglePin(page, pinData[i], i);
    if (ok) success++;
    else failed++;
    
    // Progress estimate
    const elapsed = (Date.now() - startTime) / 1000;
    const avgPerPin = elapsed / (i - START_INDEX + 1);
    const remaining = pinData.length - i - 1;
    const eta = Math.round(remaining * avgPerPin / 60);
    console.log(`   ⏱️  Elapsed: ${Math.round(elapsed / 60)}m | ETA: ~${eta}m | Success: ${success} | Failed: ${failed}`);
  }
  
  console.log(`\n=== BATCH COMPLETE ===`);
  console.log(`✅ Published: ${success}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`⏱️  Total: ${Math.round((Date.now() - startTime) / 60000)} minutes`);
  
  await browser.close();
}

main().catch(console.error);
