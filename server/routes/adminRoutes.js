const express = require("express");
const router = express.Router();
const {
  getDashboardStats,
  getAllUsers,
  toggleBlockUser,
  deleteUser,
  getAllHorsesAdmin,
  approveHorse,
  rejectHorse,
  markHorseSold,
  markHorseUnsold,
} = require("../controllers/adminController");
const { getAuctions, closeAuction, deleteAuction } = require("../controllers/auctionController");
const { getBreedingRequests, updateBreedingRequestStatus } = require("../controllers/breedingController");
const { getInquiries } = require("../controllers/vetController");
const { protect, adminOnly } = require("../middleware/auth");

// every route below requires a logged-in admin
router.use(protect, adminOnly);

router.get("/stats", getDashboardStats);

// Users
router.get("/users", getAllUsers);
router.put("/users/:id/block", toggleBlockUser);
router.delete("/users/:id", deleteUser);

// Horse listings moderation
router.get("/horses", getAllHorsesAdmin);
router.put("/horses/:id/approve", approveHorse);
router.put("/horses/:id/reject", rejectHorse);
router.put("/horses/:id/mark-sold", markHorseSold);
router.put("/horses/:id/mark-unsold", markHorseUnsold);

// Auctions
router.get("/auctions", getAuctions);
router.put("/auctions/:id/close", closeAuction);
router.delete("/auctions/:id", deleteAuction);

// Breeding requests
router.get("/breeding-requests", getBreedingRequests);
router.put("/breeding-requests/:id", updateBreedingRequestStatus);

// Vet inquiries
router.get("/vet-inquiries", getInquiries);

module.exports = router;
