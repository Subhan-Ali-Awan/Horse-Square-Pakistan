const fs = require('fs');
const path = require('path');

try {
  const srcDir = 'C:\\Users\\Acer\\.gemini\\antigravity-ide\\brain\\9bc81547-561d-44b6-ab7f-6b6fad6fa048';
  const clientUploads = path.join(__dirname, '..', '..', 'client', 'public', 'uploads');
  const serverUploads = path.join(__dirname, '..', 'public', 'uploads');
  const serverRootUploads = path.join(__dirname, '..', 'uploads');

  [clientUploads, serverUploads, serverRootUploads].forEach(dir => {
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
      fs.copyFileSync(srcPath, path.join(serverRootUploads, dest));
      console.log(`✅ Copied image ${dest} successfully.`);
    }
  });
} catch (err) {
  console.error("Error in copyImages:", err);
}
