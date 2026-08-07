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
const { getBreedingRequests, updateBreedingRequestStatus, deleteBreedingRequest } = require("../controllers/breedingController");
const { getInquiries, deleteInquiry } = require("../controllers/vetController");
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
router.delete("/breeding-requests/:id", deleteBreedingRequest);

// Vet inquiries
router.get("/vet-inquiries", getInquiries);
router.delete("/vet-inquiries/:id", deleteInquiry);

module.exports = router;
