const express = require("express");
const router = express.Router();
const {
  getHorses,
  getHorseById,
  createHorse,
  updateHorse,
  deleteHorse,
  getMyHorses,
} = require("../controllers/horseController");
const upload = require("../middleware/upload");

// protect is intentionally NOT required on createHorse, since the Sell page in this FYP
// doesn't force login first. If you want only logged-in users to sell, add `protect` here.
const { protect } = require("../middleware/auth");

router.get("/", getHorses); // Home page listings + "Search Horses" filters
router.get("/my", protect, getMyHorses); // User dashboard: my listings (must be before /:id)
router.get("/:id", getHorseById);
router.post("/", upload.array("images", 5), createHorse); // Sell a Horse "Submit Listing" button
router.put("/:id", protect, upload.array("images", 5), updateHorse);
router.delete("/:id", protect, deleteHorse);

module.exports = router;
