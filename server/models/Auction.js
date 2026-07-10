const mongoose = require("mongoose");

const bidSchema = new mongoose.Schema(
  {
    bidderName: { type: String, required: true },
    amount: { type: Number, required: true },
    bidder: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // optional, if logged in
  },
  { timestamps: true }
);

const auctionSchema = new mongoose.Schema(
  {
    horseName: { type: String, required: true },
    breed: {
      type: String,
      enum: ["Arabian", "Spanish", "Desi", "Thoroughbred"],
      required: true,
    },
    location: { type: String, required: true },
    sellerName: { type: String, required: true },
    image: { type: String }, // file path

    startingBid: { type: Number, required: true },
    currentBid: { type: Number, required: true },
    highestBidder: { type: String, default: null },

    startTime: { type: Date, default: Date.now },
    endTime: { type: Date, required: true }, // e.g. now + 24 hours

    status: {
      type: String,
      enum: ["live", "ended"],
      default: "live",
    },

    bids: [bidSchema], // bid history, newest first when displayed

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Auction", auctionSchema);
