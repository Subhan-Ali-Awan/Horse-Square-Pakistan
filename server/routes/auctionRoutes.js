const express = require("express");
const router = express.Router();
const {
  getAuctions,
  getAuctionById,
  createAuction,
  placeBid,
  closeAuction,
  deleteAuction,
  getMyBids,
} = require("../controllers/auctionController");
const upload = require("../middleware/upload");
const { protect } = require("../middleware/auth");

router.get("/", getAuctions); // Live Auctions page list
router.get("/my-bids", protect, getMyBids); // User dashboard: auctions I've bid on (must be before /:id)
router.get("/:id", getAuctionById); // single auction + countdown + bid history
router.post("/", upload.any(), createAuction);
router.post("/:id/bid", protect, placeBid); // "Place Bid" button
router.put("/:id/close", protect, closeAuction);
router.delete("/:id", protect, deleteAuction);

module.exports = router;
