const fs = require('fs');
const path = require('path');

try {
  const brainDirs = [
    'C:\\Users\\Acer\\.gemini\\antigravity-ide\\brain\\eba94ed4-d64b-4d9b-9003-4704c98ca35d\\.user_uploaded',
    'C:\\Users\\Acer\\.gemini\\antigravity-ide\\brain\\eba94ed4-d64b-4d9b-9003-4704c98ca35d',
    'C:\\Users\\Acer\\.gemini\\antigravity-ide\\brain\\9bc81547-561d-44b6-ab7f-6b6fad6fa048',
  ];
  const clientUploads = path.join(__dirname, '..', '..', 'client', 'public', 'uploads');
  const serverUploads = path.join(__dirname, '..', 'public', 'uploads');
  const serverRootUploads = path.join(__dirname, '..', 'uploads');

  [clientUploads, serverUploads, serverRootUploads].forEach(dir => {
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
    { src: 'media__1786527276270.jpg', dest: 'white_cloud.jpg' },
    { src: 'media__1786528009946.jpg', dest: 'stella_1.jpg' },
    { src: 'media__1786528015833.jpg', dest: 'stella_2.jpg' },
    { src: 'media__1786529292311.jpg', dest: 'royal_sapphire_1.jpg' },
    { src: 'media__1786529294939.jpg', dest: 'royal_sapphire_2.jpg' },
    { src: 'media__1786531044144.jpg', dest: 'ghulam_murtijz.jpg' },
  ];

  files.forEach(({ src, dest }) => {
    for (const srcDir of brainDirs) {
      const srcPath = path.join(srcDir, src);
      if (fs.existsSync(srcPath)) {
        fs.copyFileSync(srcPath, path.join(clientUploads, dest));
        fs.copyFileSync(srcPath, path.join(serverUploads, dest));
        fs.copyFileSync(srcPath, path.join(serverRootUploads, dest));
        break;
      }
    }
  });
} catch (err) {
  console.error("Error in copyImages:", err);
}
