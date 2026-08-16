const fs = require('fs');
const path = require('path');

const brainDirs = [
  'C:\\Users\\Acer\\.gemini\\antigravity-ide\\brain\\eba94ed4-d64b-4d9b-9003-4704c98ca35d\\.user_uploaded',
  'C:\\Users\\Acer\\.gemini\\antigravity-ide\\brain\\eba94ed4-d64b-4d9b-9003-4704c98ca35d',
  'C:\\Users\\Acer\\.gemini\\antigravity-ide\\brain\\9bc81547-561d-44b6-ab7f-6b6fad6fa048',
];
const clientUploads = 's:\\FYP pages\\client\\public\\uploads';
const serverUploads = 's:\\FYP pages\\server\\uploads';

[clientUploads, serverUploads].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const files = [
  { src: 'media_1786882976826.jpg', dest: 'pasha_1.jpg' },
  { src: 'media_1786882981636.jpg', dest: 'pasha_2.jpg' },
  { src: 'media_1786882988837.jpg', dest: 'pasha_3.jpg' },
  { src: 'media__1786517844748.jpg', dest: 'pasha_1.jpg' },
  { src: 'media__1786517854006.jpg', dest: 'pasha_2.jpg' },
  { src: 'media__1786517862900.jpg', dest: 'pasha_3.jpg' },
];

files.forEach(({ src, dest }) => {
  for (const srcDir of brainDirs) {
    const srcPath = path.join(srcDir, src);
    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, path.join(clientUploads, dest));
      fs.copyFileSync(srcPath, path.join(serverUploads, dest));
      console.log(`Copied ${dest} successfully.`);
      break;
    }
  }
});
