const fs = require('fs');

const raw = fs.readFileSync('cookies.json', 'utf-8');

// Find balanced outermost brackets
let depth = 0, start = -1, end = -1;
for (let i = 0; i < raw.length; i++) {
  const ch = raw[i];
  if (ch === '[') {
    if (start === -1) start = i;
    depth++;
  } else if (ch === ']') {
    depth--;
    if (depth === 0 && start !== -1) {
      end = i + 1;
      break;
    }
  }
}

if (end === -1) {
  console.log('ERROR: No balanced brackets found');
  process.exit(1);
}

const wrapperStr = raw.substring(start, end);
let wrapper;
try {
  wrapper = JSON.parse(wrapperStr);
} catch(e) {
  console.log('ERROR parsing wrapper: ' + e.message);
  process.exit(1);
}

// wrapper should be [{type:"text", text:"### Result\n\"...\""}]
if (!Array.isArray(wrapper) || !wrapper[0] || !wrapper[0].text) {
  console.log('ERROR: Unexpected wrapper structure');
  console.log(typeof wrapper, Array.isArray(wrapper));
  if (wrapper[0]) console.log('keys:', Object.keys(wrapper[0]));
  process.exit(1);
}

let text = wrapper[0].text;
// Remove "### Result\n" prefix
const prefix = '### Result\n';
if (text.startsWith(prefix)) {
  text = text.substring(prefix.length);
}

// The text should be a JSON-escaped string starting with "[ and ending with ]"
// Remove outer quotes if present
if (text.startsWith('"') && text.endsWith('"')) {
  text = text.substring(1, text.length - 1);
}

// Unescape
text = text.replace(/\\n/g, '\n').replace(/\\"/g, '"').replace(/\\\\/g, '\\');

let cookies;
try {
  cookies = JSON.parse(text);
} catch(e) {
  console.log('ERROR parsing inner JSON: ' + e.message);
  console.log('First 500 chars of inner text:', text.substring(0, 500));
  process.exit(1);
}

if (!Array.isArray(cookies)) {
  console.log('ERROR: Cookies is not array, type:', typeof cookies);
  process.exit(1);
}

fs.writeFileSync('cookies.json', JSON.stringify(cookies, null, 2));
console.log('OK: ' + cookies.length + ' cookies extracted to cookies.json');

// Show domains
const domains = {};
cookies.forEach(c => {
  domains[c.domain] = (domains[c.domain] || 0) + 1;
});
Object.entries(domains).forEach(([domain, count]) => {
  console.log('  ' + domain + ': ' + count + ' cookies');
});
