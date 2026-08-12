const fs = require('fs');
const path = require('path');

const srcDir = 'C:\\Users\\Acer\\.gemini\\antigravity-ide\\brain\\9bc81547-561d-44b6-ab7f-6b6fad6fa048';
const clientUploads = 's:\\FYP pages\\client\\public\\uploads';
const serverUploads = 's:\\FYP pages\\server\\uploads';

[clientUploads, serverUploads].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const files = [
  { src: 'media__1786517844748.jpg', dest: 'pasha_1.jpg' },
  { src: 'media__1786517854006.jpg', dest: 'pasha_2.jpg' },
  { src: 'media__1786517862900.jpg', dest: 'pasha_3.jpg' },
];

files.forEach(({ src, dest }) => {
  const srcPath = path.join(srcDir, src);
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, path.join(clientUploads, dest));
    fs.copyFileSync(srcPath, path.join(serverUploads, dest));
    console.log(`Copied ${dest} successfully.`);
  } else {
    console.error(`Source path ${srcPath} not found.`);
  }
});
