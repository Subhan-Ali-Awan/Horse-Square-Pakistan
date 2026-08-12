const Horse = require("../models/Horse");

const updateGhulamMurtijz = async () => {
  try {
    const updated = await Horse.updateMany(
      { name: { $regex: /murtijz/i } },
      {
        $set: {
          images: ["/uploads/ghulam_murtijz.jpg"],
          imageUrl: "/uploads/ghulam_murtijz.jpg"
        }
      }
    );
    if (updated.modifiedCount > 0) {
      console.log(`✅ Updated ${updated.modifiedCount} Ghulam E Murtijz horse ad(s) in MongoDB database.`);
    }
  } catch (err) {
    console.error("Error updating Ghulam E Murtijz horse ad:", err.message);
  }
};

module.exports = updateGhulamMurtijz;
