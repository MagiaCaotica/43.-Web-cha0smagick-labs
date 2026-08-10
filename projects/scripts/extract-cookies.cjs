const fs = require('fs');
const raw = fs.readFileSync('cookies.json', 'utf-8');
try {
  // Parse the tool output wrapper
  const wrapper = JSON.parse(raw);
  // wrapper is an array: [{type:"text", text:"...", ...}]
  if (Array.isArray(wrapper) && wrapper[0] && wrapper[0].text) {
    let text = wrapper[0].text;
    // Remove "### Result\n\"" prefix
    const prefix = '### Result\n"';
    if (text.startsWith(prefix)) {
      text = text.substring(prefix.length);
    }
    // Remove trailing "\n\"" or "\"" 
    if (text.endsWith('"')) {
      text = text.substring(0, text.length - 1);
    }
    // Unescape the JSON string
    text = text.replace(/\\n/g, '\n').replace(/\\"/g, '"').replace(/\\\\/g, '\\');
    // Now parse
    const inner = JSON.parse(text);
    if (Array.isArray(inner)) {
      fs.writeFileSync('cookies.json', JSON.stringify(inner, null, 2));
      console.log(`OK: ${inner.length} cookies extracted to cookies.json`);
      // List domains
      const domains = [...new Set(inner.map(c => c.domain))];
      console.log('Domains: ' + domains.join(', '));
      process.exit(0);
    }
  }
  console.log('Unexpected structure');
  console.log(wrapper && typeof wrapper);
} catch(e) {
  console.log('Error: ' + e.message.substring(0, 200));
  console.log('Raw first 200 chars: ' + raw.substring(0, 200));
}
