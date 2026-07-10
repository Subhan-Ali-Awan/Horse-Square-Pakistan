const express = require("express");
const router = express.Router();
const { ContactMessage, LocationLog } = require("../models/Misc");
const { protect, adminOnly } = require("../middleware/auth");

// ===================================================
// POST /api/contact -> Contact Us page form
// ===================================================
router.post("/", async (req, res, next) => {
  try {
    const { name, email, phone, message } = req.body;
    if (!name || !message) {
      return res.status(400).json({ success: false, message: "Name and message are required" });
    }
    const contact = await ContactMessage.create({ name, email, phone, message });
    res.status(201).json({ success: true, message: "Your message has been sent. We'll get back to you soon!", data: contact });
  } catch (error) {
    next(error);
  }
});

// admin: view all contact messages
router.get("/", protect, adminOnly, async (req, res, next) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: messages.length, data: messages });
  } catch (error) {
    next(error);
  }
});

// admin: mark as read/resolved
router.put("/:id", protect, adminOnly, async (req, res, next) => {
  try {
    const { status } = req.body;
    const updated = await ContactMessage.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: "Message not found" });
    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
