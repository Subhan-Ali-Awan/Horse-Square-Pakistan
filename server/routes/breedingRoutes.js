const express = require("express");
const router = express.Router();
const {
  getBreedingHorses,
  createBreedingHorse,
  updateBreedingHorse,
  deleteBreedingHorse,
  createBreedingRequest,
  getMyBreedingRequests,
  getBreedingRequests,
  updateBreedingRequestStatus,
  deleteBreedingRequest,
} = require("../controllers/breedingController");
const upload = require("../middleware/upload");
const { protect, adminOnly } = require("../middleware/auth");

// Public - breeding horse cards
router.get("/horses", getBreedingHorses);
router.post("/horses", protect, upload.array("images", 5), createBreedingHorse);
router.put("/horses/:id", protect, adminOnly, updateBreedingHorse);
router.delete("/horses/:id", protect, adminOnly, deleteBreedingHorse);

// User - view my submitted breeding requests
router.get("/my-requests", protect, getMyBreedingRequests);

// Public - "Submit Breeding Request" button (#apply form)
router.post("/requests", createBreedingRequest);

// Admin - view & manage requests
router.get("/requests", protect, adminOnly, getBreedingRequests);
router.put("/requests/:id", protect, adminOnly, updateBreedingRequestStatus);

// Delete breeding request (User owner or Admin)
router.delete("/requests/:id", protect, deleteBreedingRequest);

module.exports = router;
