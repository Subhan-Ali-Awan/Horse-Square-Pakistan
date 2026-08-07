const express = require("express");
const router = express.Router();
const { checkHealth, getInquiries, getMyInquiries, deleteInquiry } = require("../controllers/vetController");
const upload = require("../middleware/upload");
const { protect, adminOnly } = require("../middleware/auth");

router.post("/check", upload.array("images", 5), checkHealth); // "Analyze Health" button
router.get("/inquiries", protect, adminOnly, getInquiries); // admin dashboard
router.get("/my-inquiries", protect, getMyInquiries); // user dashboard
router.delete("/inquiries/:id", protect, deleteInquiry); // delete inquiry (user owner or admin)

module.exports = router;
