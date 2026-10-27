import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const esDir = path.join(__dirname, '..', '..', 'es', 'dark-fantasy');
const files = fs.readdirSync(esDir).filter(f => f.endsWith('.html'));

files.forEach(file => {
  const filePath = path.join(esDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  // Fix relative paths for es/ subdirectory
  content = content.replace(/href="\.\.\//g, 'href="../../');
  content = content.replace(/src="\.\.\//g, 'src="../../');
  fs.writeFileSync(filePath, content);
  console.log(`Fixed: ${file}`);
});

console.log('All ES deep-dive pages updated with correct relative paths');