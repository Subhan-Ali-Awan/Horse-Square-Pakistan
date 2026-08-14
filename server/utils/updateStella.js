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

  } catch (err) {
    console.error("Error updating Stella horse ad:", err.message);
  }
};

module.exports = updateStella;
