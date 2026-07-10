const express = require("express");
const router = express.Router();
const { checkHealth, getInquiries } = require("../controllers/vetController");
const upload = require("../middleware/upload");
const { protect, adminOnly } = require("../middleware/auth");

router.post("/check", upload.array("images", 5), checkHealth); // "Analyze Health" button
router.get("/inquiries", protect, adminOnly, getInquiries); // admin dashboard

module.exports = router;
