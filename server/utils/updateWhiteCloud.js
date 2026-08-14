const Horse = require("../models/Horse");

const updateWhiteCloud = async () => {
  try {
    const updated = await Horse.updateMany(
      {
        $or: [
          { name: { $regex: /white cloud/i } },
          { price: 700001 }
        ]
      },
      {
        $set: {
          price: 7850000,
          sire: "Malik",
          dam: "Mona",
          sellerName: "Usman Khalil",
          images: ["/uploads/white_cloud.jpg"]
        }
      }
    );

  } catch (err) {
    console.error("Error updating White Cloud horse ad:", err.message);
  }
};

module.exports = updateWhiteCloud;
