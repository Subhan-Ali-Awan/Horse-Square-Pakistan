const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9) + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

function fileFilter(req, file, cb) {
  const allowedExts = /jpeg|jpg|png|webp|gif|mp4|webm|mov|mkv|avi|m4v/;
  const isVideoMime = file.mimetype.startsWith("video/");
  const isImageMime = file.mimetype.startsWith("image/");
  const isValidExt = allowedExts.test(path.extname(file.originalname).toLowerCase());

  if (isValidExt && (isVideoMime || isImageMime)) {
    cb(null, true);
  } else {
    cb(new Error("Only image files (jpg, jpeg, png, webp, gif) and video files (mp4, webm, mov, mkv, avi) are allowed"));
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB to support 20-second videos comfortably
});

module.exports = upload;
