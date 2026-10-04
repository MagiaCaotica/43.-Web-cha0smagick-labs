// Generates assets/favicon.ico.
//
// The repo referenced assets/favicon.ico from 512 pages but the file was never
// committed, so every page was requesting a missing icon. Rather than strip the
// <link rel="icon"> from 512 files, this writes a real ICO: a 32x32 BMP-in-ICO
// with the brand amber ring on transparent ground.
//
//   node scripts/seo/make-favicon.mjs
//
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const OUT = path.join(ROOT, 'assets', 'favicon.ico');
const SIZE = 32;

// Brand palette (see theme in the marketing docs): navy #0B1026, amber #FFB03A
const AMBER = [0x3a, 0xb0, 0xff]; // BGRA
const NAVY = [0x26, 0x10, 0x0b]; // BGRA
const CLEAR = [0x00, 0x00, 0x00, 0x00];

const R_OUTER = 15.0;
const R_INNER = 10.5;
const cx = (SIZE - 1) / 2;
const cy = (SIZE - 1) / 2;

function pixel(x, y) {
  const d = Math.hypot(x - cx, y - cy);
  if (d <= R_INNER) return [...NAVY, 0xff];
  if (d <= R_OUTER) return [...AMBER, 0xff];
  return CLEAR;
}

const xor = Buffer.alloc(SIZE * SIZE * 4);
// ICO stores the bitmap bottom-up.
for (let row = 0; row < SIZE; row++) {
  const y = SIZE - 1 - row;
  for (let x = 0; x < SIZE; x++) {
    const [b, g, r, a] = pixel(x, y);
    const o = (row * SIZE + x) * 4;
    xor[o] = b; xor[o + 1] = g; xor[o + 2] = r; xor[o + 3] = a;
  }
}

// AND mask: 1 bit per pixel, rows padded to 4 bytes. 32px -> 4 bytes/row, all
// zero because transparency is carried by the alpha channel.
const andMask = Buffer.alloc(SIZE * 4, 0);

const dib = Buffer.alloc(40);
dib.writeUInt32LE(40, 0); // biSize
dib.writeInt32LE(SIZE, 4); // biWidth
dib.writeInt32LE(SIZE * 2, 8); // biHeight (XOR + AND)
dib.writeUInt16LE(1, 12); // biPlanes
dib.writeUInt16LE(32, 14); // biBitCount
dib.writeUInt32LE(0, 16); // biCompression = BI_RGB
dib.writeUInt32LE(0, 20); // biSizeImage

const image = Buffer.concat([dib, xor, andMask]);

const dir = Buffer.alloc(6);
dir.writeUInt16LE(0, 0); // reserved
dir.writeUInt16LE(1, 2); // type 1 = icon
dir.writeUInt16LE(1, 4); // one image

const entry = Buffer.alloc(16);
entry.writeUInt8(SIZE, 0);
entry.writeUInt8(SIZE, 1);
entry.writeUInt8(0, 2); // palette size (0 = no palette)
entry.writeUInt8(0, 3); // reserved
entry.writeUInt16LE(1, 4); // planes
entry.writeUInt16LE(32, 6); // bit count
entry.writeUInt32LE(image.length, 8);
entry.writeUInt32LE(dir.length + entry.length, 12);

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, Buffer.concat([dir, entry, image]));

console.log(`wrote ${path.relative(ROOT, OUT)} (${fs.statSync(OUT).size} bytes, ${SIZE}x${SIZE})`);