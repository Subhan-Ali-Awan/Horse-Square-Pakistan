const VetInquiry = require("../models/VetInquiry");

// Same lookup table as the frontend's checkHealth() function, moved server-side
// so the "AI logic" is no longer fakeable by editing client JS, and every result is logged to DB.
const SYMPTOM_ADVICE = {
  fever: {
    result:
      "Your horse may have an infection or inflammatory condition. Ensure adequate hydration, monitor temperature every 4 hours, and contact your veterinarian immediately if temperature exceeds 39.5°C.",
    severity: "warning",
  },
  injury: {
    result:
      "Clean the wound gently with saline solution, apply antiseptic, and keep the area dry. Avoid riding. Seek veterinary care immediately if the wound is deep, bleeding heavily, or near joints.",
    severity: "info",
  },
  "foot swelling": {
    result:
      "This may indicate laminitis, abscess, or soft tissue injury. Keep the horse in a soft, clean stall, apply cold therapy, and contact your vet promptly for examination.",
    severity: "warning",
  },
  cough: {
    result:
      "Possible respiratory infection or allergic reaction. Ensure clean, dust-free stable environment. Isolate from other horses and consult your veterinarian for proper diagnosis.",
    severity: "warning",
  },
  "heavy sweating": {
    result:
      "Possible Trypanosomiasis (Surra) or acute heat stress. Isolate the horse from biting flies (vector control), provide cool water/shade, and seek immediate veterinary assistance for antiprotozoal treatment.",
    severity: "warning",
  },
  surra: {
    result:
      "Trypanosomiasis (Surra) is a serious parasitic disease common in Pakistan. Symptoms include intermittent fever, sweating, weakness, and leg swelling. Seek immediate veterinary diagnostics and treatment (e.g. Quinapyramine).",
    severity: "warning",
  },
};

// ===================================================
// POST /api/vet/check  -> "Analyze Health" button
// ===================================================
exports.checkHealth = async (req, res, next) => {
  try {
    const { horseName, symptom, details } = req.body;

    if (!horseName || !symptom) {
      return res.status(400).json({ success: false, message: "Please provide horse name and select a symptom." });
    }

    const advice = SYMPTOM_ADVICE[symptom];
    if (!advice) {
      return res.status(400).json({ success: false, message: "Please select a valid symptom for analysis." });
    }

    const images = req.files ? req.files.map((file) => `/uploads/${file.filename}`) : [];

    const inquiry = await VetInquiry.create({
      horseName,
      symptom,
      details,
      images,
      aiResult: advice.result,
      severity: advice.severity,
      submittedBy: req.user ? req.user._id : undefined,
    });

    res.status(201).json({
      success: true,
      data: {
        result: advice.result,
        severity: advice.severity,
        disclaimer:
          "⚠️ This is a preliminary assessment only. Always consult a licensed veterinarian for proper diagnosis and treatment.",
        inquiryId: inquiry._id,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ===================================================
// GET /api/vet/inquiries -> admin dashboard view of all submitted health checks
// ===================================================
exports.getInquiries = async (req, res, next) => {
  try {
    const inquiries = await VetInquiry.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: inquiries.length, data: inquiries });
  } catch (error) {
    next(error);
  }
};
