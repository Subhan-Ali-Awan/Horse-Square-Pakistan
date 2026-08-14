const Auction = require("../models/Auction");

// Helper: auto-close any auction whose endTime has passed
async function autoCloseIfExpired(auction) {
  if (auction.status === "live" && auction.endTime <= new Date()) {
    auction.status = "ended";

    // Transfer ownership to the winning bidder
    if (auction.bids && auction.bids.length > 0) {
      const sortedBids = [...auction.bids].sort((a, b) => b.amount - a.amount);
      const winningBid = sortedBids[0];
      if (winningBid && winningBid.bidder) {
        const Horse = require("../models/Horse");
        const horse = await Horse.findOne({ name: auction.horseName });
        if (horse) {
          horse.postedBy = winningBid.bidder;
          await horse.save();
        }
      }
    }

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

    const formattedAuctions = [];
    for (const auction of auctions) {
      const closedAuction = await autoCloseIfExpired(auction);
      const auctionObj = closedAuction.toObject();
      // sort bids highest first
      auctionObj.bids.sort((a, b) => b.amount - a.amount);
      formattedAuctions.push(auctionObj);
    }

    res.status(200).json({ success: true, count: formattedAuctions.length, data: formattedAuctions });
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

    // sort bids highest-first so that the highest bid is on top
    const sortedBids = [...auction.bids].sort((a, b) => b.amount - a.amount);

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

    let image;
    if (req.file) {
      image = await uploadToCloudinary(req.file.path, "horsesquare/auctions");
    } else if (req.files && req.files.length > 0) {
      image = await uploadToCloudinary(req.files[0].path, "horsesquare/auctions");
    }

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
    const { amount } = req.body;

    // Resolve bidderName from logged-in user since route is protected
    const bidderName = req.user ? `${req.user.firstName} ${req.user.lastName}`.trim() : req.body.bidderName || "Anonymous";

    let auction = await Auction.findById(req.params.id);
    if (!auction) {
      return res.status(404).json({ success: false, message: "Auction not found" });
    }

    auction = await autoCloseIfExpired(auction);

    if (auction.status === "ended") {
      return res.status(400).json({ success: false, message: "Auction already ended." });
    }

    if (!amount) {
      return res.status(400).json({ success: false, message: "Please enter bid amount." });
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

    // Sort bids descending by amount so highest is on top
    const updatedAuction = auction.toObject();
    updatedAuction.bids.sort((a, b) => b.amount - a.amount);

    res.status(200).json({
      success: true,
      message: "Bid placed successfully!",
      data: updatedAuction,
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

    // Transfer ownership to the winning bidder
    if (auction.bids && auction.bids.length > 0) {
      const sortedBids = [...auction.bids].sort((a, b) => b.amount - a.amount);
      const winningBid = sortedBids[0];
      if (winningBid && winningBid.bidder) {
        const Horse = require("../models/Horse");
        const horse = await Horse.findOne({ name: auction.horseName });
        if (horse) {
          horse.postedBy = winningBid.bidder;
          await horse.save();
        }
      }
    }

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

// ===================================================
// GET /api/auctions/my-bids  (protected) -> auctions this user has bid on
// ===================================================
exports.getMyBids = async (req, res, next) => {
  try {
    const auctions = await Auction.find({ "bids.bidder": req.user._id }).sort({ updatedAt: -1 });

    // Auto-close expired ones and attach the user's highest bid for display
    const result = [];
    for (const auction of auctions) {
      await autoCloseIfExpired(auction);
      const myBids = auction.bids.filter(
        (b) => b.bidder && b.bidder.toString() === req.user._id.toString()
      );
      const myHighestBid = myBids.length
        ? Math.max(...myBids.map((b) => b.amount))
        : 0;
      result.push({ ...auction.toObject(), myHighestBid });
    }

    res.status(200).json({ success: true, count: result.length, data: result });
  } catch (error) {
    next(error);
  }
};

