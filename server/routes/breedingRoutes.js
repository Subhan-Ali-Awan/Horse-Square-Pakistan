const express = require("express");
const router = express.Router();
const {
  getBreedingHorses,
  createBreedingHorse,
  updateBreedingHorse,
  deleteBreedingHorse,
  createBreedingRequest,
  getBreedingRequests,
  updateBreedingRequestStatus,
} = require("../controllers/breedingController");
const upload = require("../middleware/upload");
const { protect, adminOnly } = require("../middleware/auth");

// Public - breeding horse cards
router.get("/horses", getBreedingHorses);
router.post("/horses", protect, adminOnly, upload.single("image"), createBreedingHorse);
router.put("/horses/:id", protect, adminOnly, updateBreedingHorse);
router.delete("/horses/:id", protect, adminOnly, deleteBreedingHorse);

// Public - "Submit Breeding Request" button (#apply form)
router.post("/requests", createBreedingRequest);

// Admin - view & manage requests
router.get("/requests", protect, adminOnly, getBreedingRequests);
router.put("/requests/:id", protect, adminOnly, updateBreedingRequestStatus);

module.exports = router;
