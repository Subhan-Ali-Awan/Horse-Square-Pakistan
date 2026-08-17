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

    // Align active auctions with bids so their 24h timer strictly anchors to the first bid
    const activeAuctions = await Auction.find({ status: "live" });
    for (const auction of activeAuctions) {
      if (auction.bids && auction.bids.length > 0) {
        auction.hasStarted = true;
        // Find the earliest bid chronologically
        const chronologicalBids = [...auction.bids].sort(
          (a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0)
        );
        const earliestBidTime = chronologicalBids[0].createdAt || auction.firstBidAt || auction.createdAt || new Date();
        auction.firstBidAt = earliestBidTime;
        auction.endTime = new Date(new Date(earliestBidTime).getTime() + 24 * 60 * 60 * 1000);
        await auction.save();
      }
    }
  } catch (err) {
    console.error("Error updating auctions:", err.message);
  }
};

module.exports = updateAuctions;
