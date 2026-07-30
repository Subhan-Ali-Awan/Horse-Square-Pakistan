require("dotenv").config();
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const Horse = require("./models/Horse");

const sourceImg = "C:/Users/Acer/.gemini/antigravity-ide/brain/21a51727-f483-4294-802a-34ec284f2761/media__1785445045636.jpg";
const destImg = path.join(__dirname, "uploads", "media__1785445045636.jpg");

try {
  if (fs.existsSync(sourceImg)) {
    fs.copyFileSync(sourceImg, destImg);
    console.log("✅ Image copied successfully to server uploads:", destImg);
  }
} catch (err) {
  console.error("Image copy error:", err);
}

const updateDb = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/horse-square";
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB...");

    // Find listing for Faiz Miran or matching seller/description
    const result = await Horse.updateMany(
      {
        $or: [
          { name: /Faiz Miran/i },
          { description: /fhaiip/i },
          { sire: /ishtaq/i }
        ]
      },
      {
        $set: {
          age: 8,
          description: "Pure Desi horse with Ravi bloodline especially for nezabazi and race.",
          sire: "Asbha Siraj",
          dam: "karmawali",
          images: ["/uploads/media__1785445045636.jpg"],
          imageUrl: "/uploads/media__1785445045636.jpg"
        }
      }
    );

    console.log("DB Update Result:", result);

    // Output remaining listing details for verification
    const updatedHorses = await Horse.find({ name: /Faiz Miran/i });
    console.log("Updated Horses in DB:", updatedHorses);

    mongoose.disconnect();
  } catch (err) {
    console.error("Database update error:", err);
  }
};

updateDb();
