import sharp from 'sharp';
import fs from 'fs';

async function createFavicon() {
  try {
    // Read the SVG file
    const svgBuffer = fs.readFileSync('./public/favicon.svg');
    
    // Convert SVG to PNG at different sizes and then to ICO
    const sizes = [16, 32, 48];
    const images = [];
    
    for (const size of sizes) {
      const pngBuffer = await sharp(svgBuffer)
        .resize(size, size)
        .png()
        .toBuffer();
      images.push(pngBuffer);
    }
    
    // For now, we'll just create a 32x32 PNG and rename it to ico
    // This is a simplified approach - for a proper ICO, you'd need a specialized library
    const favicon = await sharp(svgBuffer)
      .resize(32, 32)
      .png()
      .toBuffer();
    
    // Write as PNG (browsers support PNG favicons)
    fs.writeFileSync('./public/favicon.png', favicon);
    
    // Also create a 16x16 version
    const favicon16 = await sharp(svgBuffer)
      .resize(16, 16)
      .png()
      .toBuffer();
    
    fs.writeFileSync('./public/favicon-16x16.png', favicon16);
    
    console.log('✅ Favicon files created successfully!');
    console.log('📁 Files created:');
    console.log('   - favicon.svg (vector)');
    console.log('   - favicon.png (32x32)');
    console.log('   - favicon-16x16.png (16x16)');
    
  } catch (error) {
    console.error('❌ Error creating favicon:', error.message);
    
    // Fallback: create a simple base64 ICO
    createFallbackFavicon();
  }
}

function createFallbackFavicon() {
  // Create a simple 16x16 favicon using base64 encoded data
  // This is a medical cross icon
  const icoData = Buffer.from(`
    AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAAAQAABILAAASCwAAAAAAAAAAAAD///8A
    ////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////
    AAAAAAD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AAAA
    AAD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AAAAAAAA
    ////AP///wD///8A////AEqKywBKissBSorLAUqKywH///8A////AP///wD///8A////AP///wD///8A////
    AEqKywBKissASorLAEqKywBKissASorLAUqKywFKissB////AP///wD///8A////AP///wD///8A////AEqK
    ywBKissASorLAEqKywBKissASorLAUqKywFKissB////AP///wD///8A////AP///wD///8A////AEqKywBK
    issASorLAEqKywBKissASorLAUqKywFKissB////AP///wD///8A////AP///wD///8A////AEqKywBKissA
    SorLAEqKywBKissASorLAUqKywFKissB////AP///wD///8A////AP///wD///8A////AEqKywBKissASorL
    AEqKywBKissASorLAUqKywFKissB////AP///wD///8A////AP///wD///8A////AEqKywBKissASorLAEqK
    ywBKissASorLAUqKywFKissB////AP///wD///8A////AP///wD///8A////AEqKywBKissASorLAEqKywBK
    issASorLAUqKywFKissB////AP///wD///8A////AP///wD///8A////AEqKywBKissASorLAEqKywBKissA
    SorLAUqKywFKissB////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////
    AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP//
    /wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD/
    //8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A
    ////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////
    AP///wAAAAA=
  `, 'base64');
  
  try {
    fs.writeFileSync('./public/favicon.ico', icoData);
    console.log('✅ Fallback favicon.ico created!');
  } catch (error) {
    console.error('❌ Error creating fallback favicon:', error);
  }
}

createFavicon();
