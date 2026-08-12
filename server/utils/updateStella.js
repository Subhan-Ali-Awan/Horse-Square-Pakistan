const Horse = require("../models/Horse");

const updateStella = async () => {
  try {
    const updated = await Horse.updateMany(
      { name: { $regex: /stella/i } },
      {
        $set: {
          images: ["/uploads/stella_1.jpg", "/uploads/stella_2.jpg"],
          imageUrl: "/uploads/stella_1.jpg"
        }
      }
    );
    if (updated.modifiedCount > 0) {
      console.log(`✅ Updated ${updated.modifiedCount} Stella horse ad(s) with 2 Nukra photos in MongoDB database.`);
    }
  } catch (err) {
    console.error("Error updating Stella horse ad:", err.message);
  }
};

module.exports = updateStella;
