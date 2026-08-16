const fs = require("fs");
const path = require("path");
const Horse = require("../models/Horse");
const { uploadToCloudinary } = require("./cloudinary");

const updatePasha = async () => {
  try {
    const currentBrainDir = "C:\\Users\\Acer\\.gemini\\antigravity-ide\\brain\\eba94ed4-d64b-4d9b-9003-4704c98ca35d\\.user_uploaded";
    const serverUploads = path.join(__dirname, "..", "uploads");
    const clientUploads = path.join(__dirname, "..", "..", "client", "public", "uploads");
    const serverPublicUploads = path.join(__dirname, "..", "public", "uploads");

    [serverUploads, clientUploads, serverPublicUploads].forEach((dir) => {
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    });

    const pashaFiles = [
      { src: path.join(currentBrainDir, "media_1786882976826.jpg"), name: "pasha_1.jpg" },
      { src: path.join(currentBrainDir, "media_1786882981636.jpg"), name: "pasha_2.jpg" },
      { src: path.join(currentBrainDir, "media_1786882988837.jpg"), name: "pasha_3.jpg" },
    ];

    // Ensure local copies exist first
    pashaFiles.forEach(({ src, name }) => {
      if (fs.existsSync(src)) {
        fs.copyFileSync(src, path.join(serverUploads, name));
        fs.copyFileSync(src, path.join(clientUploads, name));
        fs.copyFileSync(src, path.join(serverPublicUploads, name));
      }
    });

    // Upload to Cloudinary
    const cloudinaryUrls = [];
    for (const { src, name } of pashaFiles) {
      const localFilePath = fs.existsSync(src) ? src : path.join(serverUploads, name);
      if (fs.existsSync(localFilePath)) {
        try {
          const uploadedUrl = await uploadToCloudinary(localFilePath, "horsesquare/marketplace");
          cloudinaryUrls.push(uploadedUrl);
        } catch (uploadErr) {
          console.error(`Error uploading ${name} to Cloudinary:`, uploadErr.message);
          cloudinaryUrls.push(`/uploads/${name}`);
        }
      } else {
        cloudinaryUrls.push(`/uploads/${name}`);
      }
    }

    const finalImages = cloudinaryUrls.length > 0 ? cloudinaryUrls : [
      "/uploads/pasha_1.jpg",
      "/uploads/pasha_2.jpg",
      "/uploads/pasha_3.jpg",
    ];

    const result = await Horse.updateMany(
      { name: { $regex: /pasha/i } },
      {
        $set: {
          images: finalImages,
          imageUrl: finalImages[0],
          breed: "Arabian",
          price: 4900000,
          age: 4,
          height: "62 inches",
          location: "Hafizabad",
          spotlight: true,
          status: "approved",
        },
      }
    );

    console.log(`✅ [PASHA UPDATED IN DB WITH CLOUDINARY URLS]: ${result.modifiedCount} document(s) updated.`);
    console.log("   Cloudinary URLs:", finalImages);
  } catch (err) {
    console.error("❌ Error in updatePasha:", err.message);
  }
};

module.exports = updatePasha;
