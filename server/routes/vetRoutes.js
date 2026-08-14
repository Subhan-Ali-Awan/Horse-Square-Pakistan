const express = require("express");
const router = express.Router();
const {
  checkHealth,
  getInquiries,
  getMyInquiries,
  deleteInquiry,
  drMaxChat,
} = require("../controllers/vetController");
const upload = require("../middleware/upload");
const { protect, adminOnly } = require("../middleware/auth");
const drMaxRateLimit = require("../middleware/rateLimit");

// ── Dr. Max AI Chat (public, rate-limited) ──────────────────────────
router.post("/chat", drMaxRateLimit, drMaxChat);

// ── Legacy health check / image analysis ────────────────────────────
router.post("/check", upload.array("images", 5), checkHealth); // "Analyze Health" button

// ── Admin / user dashboard inquiry routes ───────────────────────────
router.get("/inquiries", protect, adminOnly, getInquiries);        // admin view all
router.get("/my-inquiries", protect, getMyInquiries);              // user personal history
router.delete("/inquiries/:id", protect, deleteInquiry);           // delete own or admin

module.exports = router;
