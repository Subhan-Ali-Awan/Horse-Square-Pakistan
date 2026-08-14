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

  } catch (err) {
    console.error("Error updating Ghulam E Murtijz horse ad:", err.message);
  }
};

module.exports = updateGhulamMurtijz;
