const fs = require("fs");
const path = require("path");

let cloudinary = null;
try {
  cloudinary = require("cloudinary").v2;
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "bmje9kof",
    api_key: process.env.CLOUDINARY_API_KEY || "338332239519563",
    api_secret: process.env.CLOUDINARY_API_SECRET || "p5cFadFGwitAjhDgYAkh2n8h_kE",
  });
} catch (e) {
  console.warn("⚠️ Cloudinary SDK not installed yet. Run: cd server && npm install cloudinary");
}

/**
 * Uploads a local file to Cloudinary and returns its secure HTTPS URL.
 * Falls back to local /uploads/ URL if Cloudinary SDK fails or is unavailable.
 */
const uploadToCloudinary = async (filePath, folder = "horsesquare") => {
  if (!cloudinary) {
    const filename = path.basename(filePath);
    return `/uploads/${filename}`;
  }

  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: folder,
      resource_type: "image",
    });
    return result.secure_url;
  } catch (error) {
    console.error("Cloudinary upload error, using local fallback:", error.message);
    const filename = path.basename(filePath);
    return `/uploads/${filename}`;
  }
};

module.exports = {
  cloudinary,
  uploadToCloudinary,
};
