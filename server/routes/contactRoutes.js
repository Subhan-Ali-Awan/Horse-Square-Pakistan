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

// ===================================================
// RIDING SCHOOL TRIAL SESSION BOOKINGS
// ===================================================

const { RidingTrial } = require("../models/Misc");

const COURSE_BREAKDOWN = {
  "Beginner Riding Foundation": {
    fee: "Rs. 35,000 PKR",
    duration: "4 Weeks (12 Sessions)",
    badge: "Beginner Level",
    curriculum: [
      "Week 1: Mounting/dismounting balance, stirrup heel position & horse grooming fundamentals.",
      "Week 2: Reins steering control, walk-to-trot transitions & posture posture alignment.",
      "Week 3: Posting trot rhythm, arena circle turns & inside leg aids.",
      "Week 4: Independent horse control, equestrian safety evaluation & certification."
    ]
  },
  "Intermediate Horsemanship & Canter Control": {
    fee: "Rs. 52,000 PKR",
    duration: "6 Weeks (18 Sessions)",
    badge: "Intermediate Level",
    curriculum: [
      "Week 1-2: Smooth canter lead transitions & seat depth balance.",
      "Week 3-4: Trail riding navigation, outdoor terrain & obstacle handling.",
      "Week 5-6: Advanced rein releases, half-halts, rhythm control & safety jumps."
    ]
  },
  "Advanced Equestrian Tent Pegging": {
    fee: "Rs. 75,000 PKR",
    duration: "8 Weeks (24 Sessions)",
    badge: "Advanced Level",
    curriculum: [
      "Week 1-2: Full gallop lance stability, grip technique & target peg alignment.",
      "Week 3-4: Flying lead changes & high-speed arena cornering.",
      "Week 5-6: Unshielded target peg strikes & ground-to-saddle speed balance.",
      "Week 7-8: Competitive Nezabazi tournament simulation & master certification."
    ]
  }
};

// POST /api/contact/riding-trial -> Submit trial session booking (AUTOMATICALLY APPROVED WITH HAFIZABAD LOCATION)
router.post("/riding-trial", async (req, res, next) => {
  try {
    const { name, phone, email, city, courseTitle, ridingLevel, preferredSlot, experienceDetails, userId } = req.body;
    if (!name || !phone || !email || !courseTitle) {
      return res.status(400).json({ success: false, message: "Name, phone, email, and course title are required" });
    }

    const courseInfo = COURSE_BREAKDOWN[courseTitle] || {
      fee: "Rs. 35,000 PKR",
      duration: "Standard Duration",
      badge: ridingLevel || "Beginner",
      curriculum: [
        "Session 1-4: Basic posture, mounting, balance & reins control.",
        "Session 5-8: Trot, canter transitions & arena obstacle navigation.",
        "Session 9-12: Advanced horsemanship, trial assessment & certification."
      ]
    };

    // Hafizabad Stud Farm Official Riding School Location
    const HAFIZABAD_LOCATION = {
      name: "Horse-Square Hafizabad Stud Farm & Riding Academy",
      address: "Hafizabad Stud Farm Complex, Hafizabad, Punjab, Pakistan",
      mapsUrl: "https://maps.app.goo.gl/6RSSd7M6WTG8r6Qy6"
    };

    const cleanPhone = phone.replace(/[^0-9]/g, "");
    const formattedPhone = cleanPhone.startsWith("0") ? `92${cleanPhone.slice(1)}` : cleanPhone;

    const whatsappMessage = `*🏇 Horse-Square Pakistan Riding Academy*
*AUTOMATICALLY APPROVED TRIAL SESSION & COURSE CURRICULUM*

Hello *${name}*, your Riding Trial Request for *${courseTitle}* has been *AUTOMATICALLY APPROVED*!

*📋 Course Details:*
• *Course:* ${courseTitle} (${courseInfo.badge})
• *Duration:* ${courseInfo.duration}
• *Fee Structure:* ${courseInfo.fee}
• *Preferred Slot:* ${preferredSlot || "Weekend Morning"}

*📍 Hafizabad Stud Farm Riding Location & Address:*
• *Academy:* ${HAFIZABAD_LOCATION.name}
• *Address:* ${HAFIZABAD_LOCATION.address}
• *Google Maps Navigation Link:* ${HAFIZABAD_LOCATION.mapsUrl}

*📚 Training Curriculum & Syllabus:*
${courseInfo.curriculum.map((c, i) => `${i + 1}. ${c}`).join("\n")}

*📍 Next Step:*
Tap the Hafizabad Stud Farm Google Maps link above (${HAFIZABAD_LOCATION.mapsUrl}) to navigate straight to our academy, and reply to this message to confirm your arrival!

_Horse-Square Pakistan Equestrian Team_`;

    const encodedWA = encodeURIComponent(whatsappMessage);
    const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodedWA}`;

    const trial = await RidingTrial.create({
      user: userId || undefined,
      name,
      phone,
      email,
      city: city || "Hafizabad",
      courseTitle,
      ridingLevel: ridingLevel || "Beginner",
      preferredSlot: preferredSlot || "Weekend Morning",
      experienceDetails: experienceDetails || "Not specified",
      status: "approved",
      approvedAt: new Date(),
      feeStructureSent: true,
      whatsappMsg: whatsappMessage
    });

    res.status(201).json({
      success: true,
      message: "Trial Session booking request approved! Full fee structure, curriculum, and Hafizabad Stud Farm map link generated.",
      data: trial,
      whatsappUrl,
      whatsappMessage
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/contact/riding-trial -> Admin: list all trial booking requests
router.get("/riding-trial", protect, adminOnly, async (req, res, next) => {
  try {
    const trials = await RidingTrial.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: trials.length, data: trials });
  } catch (error) {
    next(error);
  }
});

// PUT /api/contact/riding-trial/:id/approve -> Admin: approve trial & generate WhatsApp + Email payload
router.put("/riding-trial/:id/approve", protect, adminOnly, async (req, res, next) => {
  try {
    const trial = await RidingTrial.findById(req.params.id);
    if (!trial) return res.status(404).json({ success: false, message: "Trial request not found" });

    const courseInfo = COURSE_BREAKDOWN[trial.courseTitle] || {
      fee: "Rs. 35,000 PKR",
      duration: "Standard Duration",
      badge: trial.ridingLevel,
      curriculum: [
        "Session 1-4: Basic posture, mounting, balance & reins control.",
        "Session 5-8: Trot, canter transitions & arena obstacle navigation.",
        "Session 9-12: Advanced horsemanship, trial assessment & certification."
      ]
    };

    trial.status = "approved";
    trial.approvedAt = new Date();
    trial.feeStructureSent = true;

    // Generate formatted WhatsApp message text
    const cleanPhone = trial.phone.replace(/[^0-9]/g, "");
    const formattedPhone = cleanPhone.startsWith("0") ? `92${cleanPhone.slice(1)}` : cleanPhone;

    const CITY_ACADEMY_LOCATIONS = {
      "Lahore": {
        name: "Horse-Square Riding Academy (Bedian Complex, Lahore)",
        address: "Bedian Road, Near DHA Phase 6 Interchange, Lahore",
        mapsUrl: "https://maps.google.com/?q=31.4490,74.4380"
      },
      "Islamabad": {
        name: "Horse-Square Riding Club (Chak Shahzad, Islamabad)",
        address: "Park Road, Near Chak Shahzad Equestrian Center, Islamabad",
        mapsUrl: "https://maps.google.com/?q=33.6700,73.1200"
      },
      "Karachi": {
        name: "Horse-Square Stables (Malir Cantt Arena, Karachi)",
        address: "Malir Cantt Cavalry Grounds, Karachi",
        mapsUrl: "https://maps.google.com/?q=24.9300,67.1800"
      },
      "Sargodha": {
        name: "Horse-Square Nezabazi Grounds (Sargodha)",
        address: "Stadium Road, Near Sargodha Cavalry Club, Sargodha",
        mapsUrl: "https://maps.google.com/?q=32.0800,72.6700"
      },
      "Faisalabad": {
        name: "Horse-Square Equestrian Center (Faisalabad)",
        address: "Canal Expressway, Imperial Stables Complex, Faisalabad",
        mapsUrl: "https://maps.google.com/?q=31.4180,73.0790"
      },
      "Peshawar": {
        name: "Horse-Square Riding Arena (Peshawar)",
        address: "Ring Road Equestrian Grounds, Peshawar",
        mapsUrl: "https://maps.google.com/?q=34.0150,71.5240"
      }
    };

    const locationInfo = CITY_ACADEMY_LOCATIONS[trial.city] || {
      name: `Horse-Square Riding Academy (${trial.city})`,
      address: `Main Equestrian Complex, ${trial.city}`,
      mapsUrl: `https://maps.google.com/?q=${encodeURIComponent(trial.city + " Riding Academy")}`
    };

    const whatsappMessage = `*🏇 Horse-Square Pakistan Riding Academy*
*APPROVED TRIAL SESSION & COURSE CURRICULUM*

Hello *${trial.name}*, your Riding Trial Request has been *APPROVED* by Admin!

*📋 Course Details:*
• *Course:* ${trial.courseTitle} (${courseInfo.badge})
• *Duration:* ${courseInfo.duration}
• *Fee Structure:* ${courseInfo.fee}
• *Preferred Slot:* ${trial.preferredSlot}

*📍 Riding School Location & Address:*
• *Academy:* ${locationInfo.name}
• *Address:* ${locationInfo.address}
• *Google Maps Location Link:* ${locationInfo.mapsUrl}

*📚 Training Curriculum & Syllabus:*
${courseInfo.curriculum.map((c, i) => `${i + 1}. ${c}`).join("\n")}

*📍 Next Step:*
Click the Google Maps link above to easily navigate to our riding academy, and confirm your arrival slot timing by replying to this message!

_Horse-Square Pakistan Equestrian Team_`;

    trial.whatsappMsg = whatsappMessage;
    await trial.save();

    const encodedWA = encodeURIComponent(whatsappMessage);
    const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodedWA}`;

    res.status(200).json({
      success: true,
      message: `Trial request approved! Fee structure & curriculum generated for ${trial.name}.`,
      data: trial,
      whatsappUrl,
      whatsappMessage
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/contact/riding-trial/:id -> Admin: delete trial request
router.delete("/riding-trial/:id", protect, adminOnly, async (req, res, next) => {
  try {
    const trial = await RidingTrial.findById(req.params.id);
    if (!trial) return res.status(404).json({ success: false, message: "Trial request not found" });

    await trial.deleteOne();
    res.status(200).json({ success: true, message: "Trial request deleted successfully!" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
