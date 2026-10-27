import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pinsPath = path.join(__dirname, '..', '..', 'gifs_animados_pinterest', 'pins.json');
const pins = JSON.parse(fs.readFileSync(pinsPath, 'utf8'));

// Replace link with deepDiveUrl for Pinterest publishing
pins.forEach(pin => {
  if (pin.deepDiveUrl) {
    pin.link = pin.deepDiveUrl;
  }
  // Reset status for unpublished pins (except first 3)
});

fs.writeFileSync(pinsPath, JSON.stringify(pins, null, 2) + '\n');
console.log('Updated pins.json - link now points to deep-dive pages');