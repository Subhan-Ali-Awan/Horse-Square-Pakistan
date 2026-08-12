const Horse = require("../models/Horse");

const updateRoyalSapphire = async () => {
  try {
    const updated = await Horse.updateMany(
      { name: { $regex: /royal sapphire/i } },
      {
        $set: {
          sire: "Sultan",
          dam: "Anisa",
          sellerName: "Ayesha Ahmad Khan",
          images: ["/uploads/royal_sapphire_1.jpg", "/uploads/royal_sapphire_2.jpg"],
          imageUrl: "/uploads/royal_sapphire_1.jpg"
        }
      }
    );
    if (updated.modifiedCount > 0) {
      console.log(`✅ Updated ${updated.modifiedCount} Royal Sapphire (Mare) horse ad(s) in MongoDB database.`);
    }
  } catch (err) {
    console.error("Error updating Royal Sapphire horse ad:", err.message);
  }
};

module.exports = updateRoyalSapphire;
