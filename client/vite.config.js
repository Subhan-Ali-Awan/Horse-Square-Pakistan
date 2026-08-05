import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'fs'
import path from 'path'

// Copy mentor images to public folder
const sourceAvatar = 'C:\\Users\\Acer\\.gemini\\antigravity-ide\\brain\\42a98445-eeeb-42a4-821b-2269d80ecce1\\media__1785885231046.jpg';
const targetAvatar = path.resolve(__dirname, 'public/sultan_bahadar.jpg');
try {
  if (fs.existsSync(sourceAvatar)) {
    fs.copyFileSync(sourceAvatar, targetAvatar);
  }
} catch (e) {
  console.log('Copy avatar note:', e.message);
}

const sourceAvatar2 = 'C:\\Users\\Acer\\.gemini\\antigravity-ide\\brain\\42a98445-eeeb-42a4-821b-2269d80ecce1\\media__1785885613506.jpg';
const targetAvatar2 = path.resolve(__dirname, 'public/sultan_muhammad_ali.jpg');
try {
  if (fs.existsSync(sourceAvatar2)) {
    fs.copyFileSync(sourceAvatar2, targetAvatar2);
  }
} catch (e) {
  console.log('Copy avatar2 note:', e.message);
}

const sourceAvatar3 = 'C:\\Users\\Acer\\.gemini\\antigravity-ide\\brain\\42a98445-eeeb-42a4-821b-2269d80ecce1\\media__1785885834684.jpg';
const targetAvatar3 = path.resolve(__dirname, 'public/malik_ata.jpg');
try {
  if (fs.existsSync(sourceAvatar3)) {
    fs.copyFileSync(sourceAvatar3, targetAvatar3);
  }
} catch (e) {
  console.log('Copy avatar3 note:', e.message);
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
})

