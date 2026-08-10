/**
 * Pin upload orchestrator - combines HTTP image server + Playwright batch
 * Start: node scripts/upload-server.js [startIndex]
 * Then use MCP browser at http://localhost:8765/control.html
 */
const http = require('http');
const fs = require('fs');
const path = require('path');

const OUT = path.resolve(__dirname, '..', 'pins', 'output');
const PORT = 8765;

// Load pin data
const DATA_PATH = path.resolve(__dirname, '..', 'pins', 'pin-data.js');
const c = fs.readFileSync(DATA_PATH, 'utf-8');
const m = c.match(/window\.PIN_DATA\s*=\s*(\[[\s\S]*?\]);/);
const pinData = JSON.parse(m[1]);
pinData.forEach((p,i) => { if(!p.title)p.title=`Pin ${i+1}`; if(!p.link)p.link='https://cha0smagicklabs.com/'; });

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.end(); return; }

  const url = req.url;

  // Image endpoint: /img/XXX
  if (url.startsWith('/img/')) {
    const name = url.substring(5);
    const filePath = path.join(OUT, name);
    if (fs.existsSync(filePath)) {
      const ext = path.extname(name).toLowerCase();
      const ct = ext === '.png' ? 'image/png' : ext === '.jpg' ? 'image/jpeg' : 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': ct, 'Cache-Control': 'max-age=3600' });
      fs.createReadStream(filePath).pipe(res);
    } else {
      res.writeHead(404); res.end('Not found: ' + name);
    }
    return;
  }

  // Pin data endpoint: /data
  if (url === '/data') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(pinData));
    return;
  }

  // Info endpoint
  if (url === '/') {
    const files = fs.readdirSync(OUT).filter(f => f.startsWith('pin-') && f.endsWith('.png')).sort();
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`<html><body>
      <h1>Pin Upload Server</h1>
      <p>${pinData.length} pins, ${files.length} images</p>
      <p>First: ${files[0]}, Last: ${files[files.length-1]}</p>
      <p>Use MCP to navigate to pin-creation-tool, then inject upload JS</p>
    </body></html>`);
    return;
  }

  // Batch control: returns JS to execute in browser for uploading N pins
  if (url.startsWith('/batch/')) {
    const parts = url.split('/');
    const startIdx = parseInt(parts[2] || '0');
    const count = parseInt(parts[3] || '5');
    const endIdx = Math.min(startIdx + count, pinData.length);
    
    const pins = [];
    for (let i = startIdx; i < endIdx; i++) {
      const fn = `pin-${String(i+1).padStart(3, '0')}.png`;
      pins.push({ index: i, filename: fn, title: pinData[i].title, link: pinData[i].link });
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ startIdx, endIdx, pins }));
    return;
  }

  res.writeHead(404); res.end();
});

server.listen(PORT, () => {
  console.log(`Pin server at http://localhost:${PORT}`);
  console.log(`${pinData.length} pins, images in ${OUT}`);
  console.log(`Use start index: ${process.argv[2] || 0}`);
});
