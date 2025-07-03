import fs from 'fs';

// Create a proper ICO file with medical cross design
function createMedicalFavicon() {
  // This is a properly formatted ICO file with a medical cross design
  // 16x16, 32-bit color depth
  const icoHeader = Buffer.from([
    0x00, 0x00, // Reserved
    0x01, 0x00, // ICO type
    0x01, 0x00  // Number of images
  ]);
  
  // Directory entry for 16x16 image
  const dirEntry = Buffer.from([
    0x10,       // Width (16)
    0x10,       // Height (16) 
    0x00,       // Color count (0 for >8bpp)
    0x00,       // Reserved
    0x01, 0x00, // Color planes
    0x20, 0x00, // Bits per pixel (32)
    0x00, 0x04, 0x00, 0x00, // Image size (1024 bytes)
    0x16, 0x00, 0x00, 0x00  // Offset to image data
  ]);
  
  // Create 16x16 RGBA pixel data for medical cross
  const pixels = new Array(16 * 16 * 4).fill(0);
  
  // Medical blue background with transparency
  for (let y = 0; y < 16; y++) {
    for (let x = 0; x < 16; x++) {
      const idx = (y * 16 + x) * 4;
      
      // Background color (medical blue)
      pixels[idx] = 3;     // Blue
      pixels[idx + 1] = 105; // Green  
      pixels[idx + 2] = 161; // Red (RGB is reversed)
      pixels[idx + 3] = 255; // Alpha
      
      // White cross
      if ((x >= 6 && x <= 9) || (y >= 6 && y <= 9)) {
        pixels[idx] = 255;   // Blue
        pixels[idx + 1] = 255; // Green
        pixels[idx + 2] = 255; // Red
        pixels[idx + 3] = 255; // Alpha
      }
      
      // Small red heart in center
      if ((x === 7 && y === 8) || (x === 8 && y === 8) || 
          (x === 7 && y === 7) || (x === 8 && y === 7)) {
        pixels[idx] = 68;    // Blue
        pixels[idx + 1] = 68;  // Green
        pixels[idx + 2] = 239; // Red
        pixels[idx + 3] = 255; // Alpha
      }
    }
  }
  
  // Create bitmap info header
  const bmpHeader = Buffer.from([
    0x28, 0x00, 0x00, 0x00, // Header size (40)
    0x10, 0x00, 0x00, 0x00, // Width (16)
    0x20, 0x00, 0x00, 0x00, // Height (32 - includes AND mask)
    0x01, 0x00,             // Planes (1)
    0x20, 0x00,             // Bits per pixel (32)
    0x00, 0x00, 0x00, 0x00, // Compression (0)
    0x00, 0x04, 0x00, 0x00, // Image size
    0x00, 0x00, 0x00, 0x00, // X pixels per meter
    0x00, 0x00, 0x00, 0x00, // Y pixels per meter
    0x00, 0x00, 0x00, 0x00, // Colors used
    0x00, 0x00, 0x00, 0x00  // Important colors
  ]);
  
  // Convert pixels to Buffer (flip vertically for BMP format)
  const pixelBuffer = Buffer.alloc(16 * 16 * 4);
  for (let y = 0; y < 16; y++) {
    for (let x = 0; x < 16; x++) {
      const srcIdx = (y * 16 + x) * 4;
      const dstIdx = ((15 - y) * 16 + x) * 4;
      
      pixelBuffer[dstIdx] = pixels[srcIdx];     // B
      pixelBuffer[dstIdx + 1] = pixels[srcIdx + 1]; // G
      pixelBuffer[dstIdx + 2] = pixels[srcIdx + 2]; // R
      pixelBuffer[dstIdx + 3] = pixels[srcIdx + 3]; // A
    }
  }
  
  // AND mask (all transparent since we use alpha channel)
  const andMask = Buffer.alloc(16 * 16 / 8); // 1 bit per pixel
  
  // Combine all parts
  const icoFile = Buffer.concat([
    icoHeader,
    dirEntry,
    bmpHeader,
    pixelBuffer,
    andMask
  ]);
  
  return icoFile;
}

// Create and save the favicon
const faviconData = createMedicalFavicon();
fs.writeFileSync('./public/favicon.ico', faviconData);

console.log('✅ Medical-themed favicon.ico created successfully!');
console.log('🏥 Features: Medical cross with blue background and red heart');
console.log('📏 Size: 16x16 pixels, 32-bit color');

// Clean up temporary files
try {
  fs.unlinkSync('./create-favicon.js');
  fs.unlinkSync('./favicon-generator.html');
  console.log('🧹 Cleaned up temporary files');
} catch (e) {
  // Files might not exist, that's okay
}
