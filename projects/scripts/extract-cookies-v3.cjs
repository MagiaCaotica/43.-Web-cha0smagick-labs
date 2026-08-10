const fs = require('fs');

const raw = fs.readFileSync('cookies.json', 'utf-8');

// The file contains: [{"type":"text","text":"### Result\n\"[ESCAPED_JSON]\"\n### Page URL: ..."}]
// Find the inner text field content
const parsed = JSON.parse(raw);
const text = parsed[0].text;

// Find the escaped JSON array inside text after "### Result\n""
const resultStart = text.indexOf('### Result\n');
if (resultStart === -1) { console.log('No Result marker'); process.exit(1); }
let after = text.substring(resultStart + '### Result\n'.length);

// After the marker there's a '"' then the escaped array
if (after.startsWith('"')) {
  after = after.substring(1);
}

// Now find the end of the escaped JSON array
// The escaped array looks like [\n  {\n    \"name\"...
// Find the position where the main closing " is (after the array's closing ])
// The array ends with ] then " then maybe \n then other content
// Strategy: find the ] that ends the array, then step past the closing "

// First, find a reasonable spot for the closing of the escaped array
// We know it ends with ]" then rest content
const closeIdx = after.lastIndexOf(']');
if (closeIdx === -1) { console.log('No closing bracket'); process.exit(1); }
let inner = after.substring(0, closeIdx + 1);

// Unescape
inner = inner.replace(/\\n/g, '\n').replace(/\\"/g, '"').replace(/\\\\/g, '\\');

let cookies;
try {
  cookies = JSON.parse(inner);
} catch(e) {
  console.log('Parse error: ' + e.message);
  // Try trimming content after the actual array
  // The escaped string may have content after the array
  // Let's try extracting by finding balanced brackets in the escaped text
  let depth = 0, start = -1, end = -1;
  for (let i = 0; i < inner.length; i++) {
    if (inner[i] === '[') { if (start === -1) start = i; depth++; }
    else if (inner[i] === ']') { depth--; if (depth === 0 && start !== -1) { end = i+1; break; } }
  }
  if (end === -1) { console.log('No balanced array'); process.exit(1); }
  inner = inner.substring(start, end);
  cookies = JSON.parse(inner);
}

fs.writeFileSync('cookies.json', JSON.stringify(cookies, null, 2));
console.log('OK: ' + cookies.length + ' cookies');

const domains = {};
cookies.forEach(c => { domains[c.domain] = (domains[c.domain]||0) + 1; });
Object.entries(domains).forEach(([d, n]) => console.log('  ' + d + ': ' + n));
