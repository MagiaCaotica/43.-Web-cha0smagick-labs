/**
 * Pinterest Batch Upload v2 - Uploads pins as drafts via MCP browser
 * Uses the already-logged-in MCP Playwright session 
 * Usage: Call uploadBatch function from browser_run_code_unsafe
 */
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const OUT = path.resolve(__dirname, '..', 'pins', 'output');
const DATA_PATH = path.resolve(__dirname, '..', 'pins', 'pin-data.js');

function loadPinData() {
  const c = fs.readFileSync(DATA_PATH, 'utf-8');
  const m = c.match(/window\.PIN_DATA\s*=\s*(\[[\s\S]*?\]);/);
  if (!m) throw new Error('Cannot parse PIN_DATA');
  const pd = JSON.parse(m[1]);
  pd.forEach((p,i) => { if (!p.title) p.title = `Pin ${i+1}`; if (!p.link) p.link='https://cha0smagicklabs.com/'; });
  return pd;
}

// Exported for use in browser_evaluate via script injection
// But actually we'll use the MCP tools directly

module.exports = { loadPinData };
