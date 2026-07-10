const Auction = require("../models/Auction");

// Helper: auto-close any auction whose endTime has passed
async function autoCloseIfExpired(auction) {
  if (auction.status === "live" && auction.endTime <= new Date()) {
    auction.status = "ended";
    await auction.save();
  }
  return auction;
}

// ===================================================
// GET /api/auctions  -> Live Auctions page (list all, or filter ?status=live)
// ===================================================
exports.getAuctions = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;

    const auctions = await Auction.find(filter).sort({ createdAt: -1 });

    // close out any that expired since last check
    for (const auction of auctions) {
      await autoCloseIfExpired(auction);
    }

    res.status(200).json({ success: true, count: auctions.length, data: auctions });
  } catch (error) {
    next(error);
  }
};

// ===================================================
// GET /api/auctions/:id  -> single auction detail (drives the countdown timer + bid history)
// ===================================================
exports.getAuctionById = async (req, res, next) => {
  try {
    let auction = await Auction.findById(req.params.id);
    if (!auction) {
      return res.status(404).json({ success: false, message: "Auction not found" });
    }

    auction = await autoCloseIfExpired(auction);

    // sort bids newest-first for "Live Bid History" display, matching frontend prepend() behaviour
    const sortedBids = [...auction.bids].sort((a, b) => b.createdAt - a.createdAt);

    res.status(200).json({
      success: true,
      data: { ...auction.toObject(), bids: sortedBids },
      secondsRemaining: Math.max(0, Math.floor((auction.endTime - new Date()) / 1000)),
    });
  } catch (error) {
    next(error);
  }
};

// ===================================================
// POST /api/auctions  -> create a new auction (admin or seller)
// ===================================================
exports.createAuction = async (req, res, next) => {
  try {
    const { horseName, breed, location, sellerName, startingBid, durationHours } = req.body;

    if (!horseName || !breed || !location || !sellerName || !startingBid) {
      return res.status(400).json({ success: false, message: "Please fill in all required fields" });
    }

    const hours = Number(durationHours) || 24; // matches frontend default 24-hour timer
    const endTime = new Date(Date.now() + hours * 60 * 60 * 1000);

    const image = req.file ? `/uploads/${req.file.filename}` : undefined;

    const auction = await Auction.create({
      horseName,
      breed,
      location,
      sellerName,
      image,
      startingBid: Number(startingBid),
      currentBid: Number(startingBid),
      endTime,
      createdBy: req.user ? req.user._id : undefined,
    });

    res.status(201).json({ success: true, message: "Auction created", data: auction });
  } catch (error) {
    next(error);
  }
};

// ===================================================
// POST /api/auctions/:id/bid  -> "Place Bid" button
// Body: { bidderName, amount }
// Mirrors frontend validation: must be logged-in-name + numeric amount > currentBid, and auction must still be live
// ===================================================
exports.placeBid = async (req, res, next) => {
  try {
    const { bidderName, amount } = req.body;

    let auction = await Auction.findById(req.params.id);
    if (!auction) {
      return res.status(404).json({ success: false, message: "Auction not found" });
    }

    auction = await autoCloseIfExpired(auction);

    if (auction.status === "ended") {
      return res.status(400).json({ success: false, message: "Auction already ended." });
    }

    if (!bidderName || !amount) {
      return res.status(400).json({ success: false, message: "Please enter name and bid amount." });
    }

    const bidAmount = Number(amount);

    if (isNaN(bidAmount) || bidAmount <= auction.currentBid) {
      return res.status(400).json({ success: false, message: "Your bid must be higher than the current bid." });
    }

    auction.currentBid = bidAmount;
    auction.highestBidder = bidderName;
    auction.bids.push({
      bidderName,
      amount: bidAmount,
      bidder: req.user ? req.user._id : undefined,
    });

    await auction.save();

    res.status(200).json({
      success: true,
      message: "Bid placed successfully!",
      data: auction,
    });
  } catch (error) {
    next(error);
  }
};

// ===================================================
// PUT /api/auctions/:id/close  -> manually end an auction (admin)
// ===================================================
exports.closeAuction = async (req, res, next) => {
  try {
    const auction = await Auction.findById(req.params.id);
    if (!auction) {
      return res.status(404).json({ success: false, message: "Auction not found" });
    }

    auction.status = "ended";
    await auction.save();

    res.status(200).json({ success: true, message: "Auction closed", data: auction });
  } catch (error) {
    next(error);
  }
};

// ===================================================
// DELETE /api/auctions/:id  -> admin
// ===================================================
exports.deleteAuction = async (req, res, next) => {
  try {
    const auction = await Auction.findById(req.params.id);
    if (!auction) {
      return res.status(404).json({ success: false, message: "Auction not found" });
    }
    await auction.deleteOne();
    res.status(200).json({ success: true, message: "Auction deleted" });
  } catch (error) {
    next(error);
  }
};
