const Auction = require("../models/Auction");

const updateAuctions = async () => {
  try {
    await Auction.deleteMany({
      $or: [
        { horseName: { $regex: /striker/i } },
        { horseName: { $regex: /sher-dil/i } },
        { horseName: { $regex: /sher dil/i } }
      ]
    });
  } catch (err) {
    console.error("Error updating auctions:", err.message);
  }
};

module.exports = updateAuctions;
