const fs = require('fs');
const path = require('path');

const src = "C:/Users/Acer/.gemini/antigravity-ide/brain/e0ae4ece-4960-4040-b4d1-51dbe6a92856/rustam_white_stallion_1786271996920.png";

if (fs.existsSync(src)) {
  const targetServer = path.join(__dirname, 'uploads', 'rustam_desi_stallion.png');
  const targetClient = path.join(__dirname, '..', 'client', 'public', 'uploads', 'rustam_desi_stallion.png');
  
  fs.copyFileSync(src, targetServer);
  fs.copyFileSync(src, targetClient);
  console.log('✅ WHITE STALLION IMAGE COPIED TO BOTH SERVER & CLIENT UPLOADS!');
} else {
  console.log('❌ Source image not found at', src);
}
