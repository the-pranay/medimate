import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the PNG file
const pngPath = path.join(__dirname, 'public', 'favicon.png');
const icoPath = path.join(__dirname, 'app', 'favicon.ico');

if (fs.existsSync(pngPath)) {
  // Copy the PNG as ICO (browsers will handle PNG data in ICO files)
  fs.copyFileSync(pngPath, icoPath);
  console.log('favicon.ico created successfully');
} else {
  console.error('favicon.png not found');
}
