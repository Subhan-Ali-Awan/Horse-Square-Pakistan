const express = require("express");
const router = express.Router();
const {
  getAuctions,
  getAuctionById,
  createAuction,
  placeBid,
  closeAuction,
  deleteAuction,
} = require("../controllers/auctionController");
const upload = require("../middleware/upload");
const { protect } = require("../middleware/auth");

router.get("/", getAuctions); // Live Auctions page list
router.get("/:id", getAuctionById); // single auction + countdown + bid history
router.post("/", protect, upload.single("image"), createAuction);
router.post("/:id/bid", placeBid); // "Place Bid" button
router.put("/:id/close", protect, closeAuction);
router.delete("/:id", protect, deleteAuction);

module.exports = router;
