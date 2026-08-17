const Auction = require("../models/Auction");
const User = require("../models/User");
const { uploadToCloudinary } = require("../utils/cloudinary");
const { broadcastNewListingEmail, sendAuctionWinnerEmail } = require("../utils/emailService");

// Helper: auto-close any auction whose endTime has passed (once started)
async function autoCloseIfExpired(auction) {
  const isStarted = auction.hasStarted || (auction.bids && auction.bids.length > 0);
  if (auction.status === "live" && isStarted && auction.endTime && auction.endTime <= new Date()) {
    auction.status = "ended";

    // Identify winning bidder
    if (auction.bids && auction.bids.length > 0) {
      const sortedBids = [...auction.bids].sort((a, b) => b.amount - a.amount);
      const winningBid = sortedBids[0];
      
      if (winningBid && winningBid.bidder) {
        auction.winningBidder = winningBid.bidder;

        // Transfer horse ownership if exists
        try {
          const Horse = require("../models/Horse");
          const horse = await Horse.findOne({ name: auction.horseName });
          if (horse) {
            horse.postedBy = winningBid.bidder;
            await horse.save();
          }
        } catch (hErr) {
          console.error("[AUCTION HORSE OWNERSHIP TRANSFER ERROR]:", hErr.message);
        }

        // Send Winner Congratulations Email & WhatsApp Notification once
        if (!auction.winnerEmailSent) {
          try {
            const winnerUser = await User.findById(winningBid.bidder);
            let sellerUser = null;
            if (auction.createdBy) {
              sellerUser = await User.findById(auction.createdBy);
            }

            if (winnerUser && winnerUser.email) {
              console.log(`🏆 [AUCTION WINNER NOTIFICATION] Dispatching congratulation email to winner: ${winnerUser.email} for horse: ${auction.horseName}`);
              sendAuctionWinnerEmail({
                winner: winnerUser,
                auction,
                seller: sellerUser,
              }).catch((e) => console.error("[WINNER EMAIL ERROR]:", e.message));

              auction.winnerEmailSent = true;
            }

            // WhatsApp Notification log & state
            if (winnerUser && winnerUser.phone) {
              const cleanPhone = winnerUser.phone.replace(/[^0-9]/g, "");
              const waMsg = `🏆 *CONGRATULATIONS FROM HORSE SQUARE PAKISTAN!* 🐎%0A%0ADear ${winnerUser.firstName} ${winnerUser.lastName}, you have WON the Live Auction for *${auction.horseName}* with the highest bid of *PKR ${Number(auction.currentBid).toLocaleString()}*!%0A%0AOur support team and seller have been notified. For questions or transfer assistance, reply to this message or email horsesquarepakistan@gmail.com.`;
              console.log(`📱 [AUCTION WINNER WHATSAPP] Prepared message for ${cleanPhone}: https://wa.me/${cleanPhone}?text=${waMsg}`);
              auction.winnerWhatsAppSent = true;
            }
          } catch (notifErr) {
            console.error("[WINNER NOTIFICATION DISPATCH ERROR]:", notifErr.message);
          }
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

    const auctions = await Auction.find(filter)
      .populate("winningBidder", "firstName lastName email phone")
      .sort({ createdAt: -1 });

    const formattedAuctions = [];
    for (const auction of auctions) {
      const closedAuction = await autoCloseIfExpired(auction);
      const auctionObj = closedAuction.toObject();
      // sort bids highest first
      if (auctionObj.bids) {
        auctionObj.bids.sort((a, b) => b.amount - a.amount);
      }
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
    let auction = await Auction.findById(req.params.id).populate("winningBidder", "firstName lastName email phone");
    if (!auction) {
      return res.status(404).json({ success: false, message: "Auction not found" });
    }

    auction = await autoCloseIfExpired(auction);

    // sort bids highest-first so that the highest bid is on top
    const sortedBids = [...auction.bids].sort((a, b) => b.amount - a.amount);

    res.status(200).json({
      success: true,
      data: { ...auction.toObject(), bids: sortedBids },
      secondsRemaining: auction.hasStarted ? Math.max(0, Math.floor((auction.endTime - new Date()) / 1000)) : 86400,
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

    const hours = Number(durationHours) || 24; // 24-hour default timer
    const endTime = new Date(Date.now() + hours * 60 * 60 * 1000);

    let image;
    if (req.file) {
      image = await uploadToCloudinary(req.file.path, "horsesquare/auctions");
    } else if (req.files && req.files.length > 0) {
      image = await uploadToCloudinary(req.files[0].path, "horsesquare/auctions");
    } else if (req.body.image) {
      image = req.body.image;
    }

    let createdBy = req.user ? req.user._id : undefined;
    if (!createdBy && req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      try {
        const token = req.headers.authorization.split(" ")[1];
        const jwt = require("jsonwebtoken");
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        createdBy = decoded.id;
      } catch (err) {
        console.error("Token verification failed in createAuction:", err);
      }
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
      hasStarted: false,
      createdBy,
    });

    // Broadcast email notification to all registered users from horsesquarepakistan@gmail.com
    broadcastNewListingEmail({
      type: "Live Auction",
      title: auction.horseName,
      breed: auction.breed,
      price: `Starting PKR ${Number(startingBid).toLocaleString()}`,
      location: auction.location,
      details: `Live auction posted by ${sellerName}. Place your first bid to start the 24-hour countdown!`,
      imageUrl: auction.image || "",
      link: "http://localhost:5173/live-auctions",
    }).catch((err) => {
      console.error("[BROADCAST EMAIL ERROR in createAuction]:", err.message);
    });

    res.status(201).json({ success: true, message: "Auction created", data: auction });
  } catch (error) {
    next(error);
  }
};

// ===================================================
// POST /api/auctions/:id/bid  -> "Place Bid" button
// Body: { bidderName, amount }
// First bid starts the 24-hour countdown timer
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

    // Check if this is the very first bid placed on this auction
    const hasPriorBids = (auction.bids && auction.bids.length > 0) || Boolean(auction.firstBidAt);

    if (!hasPriorBids) {
      // First bid: Activate auction and start the fixed 24-hour countdown timer
      auction.hasStarted = true;
      auction.firstBidAt = new Date();
      auction.endTime = new Date(Date.now() + 24 * 60 * 60 * 1000); // exactly 24 hours from first bid
    } else {
      // Subsequent bids: Ensure hasStarted remains true and PRESERVE original timer
      auction.hasStarted = true;
      if (!auction.firstBidAt && auction.bids && auction.bids.length > 0) {
        auction.firstBidAt = auction.bids[0].createdAt || auction.createdAt || new Date();
      }
      if (!auction.endTime) {
        auction.endTime = new Date(new Date(auction.firstBidAt).getTime() + 24 * 60 * 60 * 1000);
      }
    }

    auction.currentBid = bidAmount;
    auction.highestBidder = bidderName;
    auction.winningBidder = req.user ? req.user._id : undefined;
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
      message: !hasPriorBids
        ? "Bid placed successfully! The 24-hour countdown timer is now running."
        : "Bid placed successfully! You are now the highest bidder.",
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

