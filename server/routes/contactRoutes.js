const express = require("express");
const router = express.Router();
const { ContactMessage } = require("../models/Misc");
const { protect, adminOnly } = require("../middleware/auth");

// ===================================================
// POST /api/contact -> Contact Us page form
// ===================================================
router.post("/", async (req, res, next) => {
  try {
    const { name, email, phone, subject, message, userId } = req.body;
    if (!name || !message) {
      return res.status(400).json({ success: false, message: "Name and message are required" });
    }
    const contact = await ContactMessage.create({
      user: userId || undefined,
      name,
      email,
      phone,
      subject: subject || "General Inquiry",
      message,
    });
    res.status(201).json({ success: true, message: "Your message has been sent. We'll get back to you soon!", data: contact });
  } catch (error) {
    next(error);
  }
});

// ===================================================
// GET /api/contact/my -> Get logged-in user's contact queries
// ===================================================
router.get("/my", protect, async (req, res, next) => {
  try {
    const filter = {
      $or: [
        { user: req.user._id },
        { email: req.user.email },
        { phone: req.user.phone }
      ]
    };
    const messages = await ContactMessage.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: messages.length, data: messages });
  } catch (error) {
    next(error);
  }
});

// ===================================================
// GET /api/contact -> Admin: view all contact messages
// ===================================================
router.get("/", protect, adminOnly, async (req, res, next) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: messages.length, data: messages });
  } catch (error) {
    next(error);
  }
});

// ===================================================
// PUT /api/contact/:id -> Edit query (user owner or admin)
// ===================================================
router.put("/:id", protect, async (req, res, next) => {
  try {
    const { name, phone, subject, message, status } = req.body;
    const query = await ContactMessage.findById(req.params.id);
    if (!query) return res.status(404).json({ success: false, message: "Query not found" });

    // Allow if user is owner or admin
    const isOwner = query.user && query.user.toString() === req.user._id.toString() ||
                    query.email === req.user.email ||
                    query.phone === req.user.phone;
                    
    if (!isOwner && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: "Not authorized to update this query" });
    }

    if (name) query.name = name;
    if (phone) query.phone = phone;
    if (subject) query.subject = subject;
    if (message) query.message = message;
    if (status && req.user.role === 'admin') query.status = status;

    await query.save();
    res.status(200).json({ success: true, message: "Query updated successfully!", data: query });
  } catch (error) {
    next(error);
  }
});

// ===================================================
// POST /api/contact/:id/reply -> Add reply to chat thread (User or Admin)
// ===================================================
router.post("/:id/reply", protect, async (req, res, next) => {
  try {
    const { message } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: "Reply message cannot be empty" });
    }

    const query = await ContactMessage.findById(req.params.id);
    if (!query) return res.status(404).json({ success: false, message: "Query not found" });

    const isOwner = (query.user && query.user.toString() === req.user._id.toString()) ||
                    query.email === req.user.email ||
                    query.phone === req.user.phone;

    if (!isOwner && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: "Not authorized to reply to this query" });
    }

    const sender = req.user.role === 'admin' ? 'admin' : 'user';
    const senderName = req.user.firstName ? `${req.user.firstName} ${req.user.lastName || ''}`.trim() : req.user.name || (sender === 'admin' ? 'Support Admin' : 'User');

    query.replies.push({
      sender,
      senderName,
      message: message.trim(),
      createdAt: new Date(),
    });

    if (query.status !== 'resolved') {
      query.status = 'in_progress';
    }

    await query.save();
    res.status(200).json({ success: true, message: "Reply sent!", data: query });
  } catch (error) {
    next(error);
  }
});

// ===================================================
// PUT /api/contact/:id/resolve -> Mark query as resolved (User or Admin)
// ===================================================
router.put("/:id/resolve", protect, async (req, res, next) => {
  try {
    const query = await ContactMessage.findById(req.params.id);
    if (!query) return res.status(404).json({ success: false, message: "Query not found" });

    const isOwner = (query.user && query.user.toString() === req.user._id.toString()) ||
                    query.email === req.user.email ||
                    query.phone === req.user.phone;

    if (!isOwner && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: "Not authorized to resolve this query" });
    }

    query.status = 'resolved';
    await query.save();
    res.status(200).json({ success: true, message: "Query marked as resolved!", data: query });
  } catch (error) {
    next(error);
  }
});

// ===================================================
// DELETE /api/contact/:id -> Delete query (user owner or admin)
// ===================================================
router.delete("/:id", protect, async (req, res, next) => {
  try {
    const query = await ContactMessage.findById(req.params.id);
    if (!query) return res.status(404).json({ success: false, message: "Query not found" });

    const isOwner = query.user && query.user.toString() === req.user._id.toString() ||
                    query.email === req.user.email ||
                    query.phone === req.user.phone;

    if (!isOwner && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: "Not authorized to delete this query" });
    }

    await query.deleteOne();
    res.status(200).json({ success: true, message: "Query deleted successfully!" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
