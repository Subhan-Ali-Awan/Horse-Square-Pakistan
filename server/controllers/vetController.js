const VetInquiry = require("../models/VetInquiry");
const { uploadToCloudinary } = require("../utils/cloudinary");
const { DR_MAX_SYSTEM_PROMPT } = require("../prompts/drMaxPrompt");
const axios = require("axios");

// ===================================================
// POST /api/vet/chat  -> Dr. Max AI Chat (Groq API)
// ===================================================
exports.drMaxChat = async (req, res) => {
  try {
    const { messages, horseInfo, diseaseContext } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ success: false, error: "Messages array is required." });
    }

    // Build the dynamic system prompt with injected context
    let systemPrompt = DR_MAX_SYSTEM_PROMPT;

    // Inject horse signalment
    if (horseInfo?.name) systemPrompt += `\n\nThe horse's name is ${horseInfo.name}.`;
    if (horseInfo?.breed) systemPrompt += ` Breed: ${horseInfo.breed}.`;
    if (horseInfo?.age)   systemPrompt += ` Age: ${horseInfo.age}.`;
    if (horseInfo?.sex)   systemPrompt += ` Sex: ${horseInfo.sex}.`;

    // Inject disease context
    systemPrompt = systemPrompt.replace(
      "{DISEASE_CONTEXT}",
      diseaseContext || "No specific disease context selected by the user."
    );

    // Inject conversation history
    const historyText = messages.map((m) => `${m.role}: ${m.content}`).join("\n");
    systemPrompt = systemPrompt.replace("{CONVERSATION_HISTORY}", historyText || "This is the beginning of the consultation.");

    // Inject last user message
    const lastUserMessage = messages.filter((m) => m.role === "user").pop()?.content || "";
    systemPrompt = systemPrompt.replace("{USER_MESSAGE}", lastUserMessage);

    // Call Groq API
    const groqResponse = await axios.post(
      process.env.GROQ_API_URL,
      {
        model: process.env.GROQ_MODEL || "openai/gpt-oss-120b",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        temperature: 0.3,
        max_tokens: 2048,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 30000,
      }
    );

    const reply = groqResponse.data.choices[0].message.content;
    console.log(`[DR MAX] Response delivered. Tokens used: ${groqResponse.data.usage?.total_tokens || "N/A"}`);

    return res.json({ success: true, reply });

  } catch (error) {
    const errMsg = error.response?.data?.error?.message || error.message;
    console.error("[DR MAX] Groq API Error:", errMsg);

    // Graceful fallback — never crash the user experience
    return res.json({
      success: true,
      reply:
        "I apologize — I am temporarily unable to reach my clinical knowledge base. This is most likely a brief connectivity issue. For any urgent equine concern, please contact your local veterinarian immediately. I will be available again momentarily.",
      fallback: true,
    });
  }
};



const SYMPTOM_ADVICE = {
  anuria: {
    result:
      "Anuria (inability to urinate / zero urine output) is a life-threatening renal or urinary tract emergency in horses. Stop all NSAIDs immediately (Banamine/Phenylbutazone worsen kidney damage). Contact an emergency equine veterinarian immediately for urinary catheterization, renal blood panel (BUN/Creatinine), and IV fluid therapy.",
    severity: "danger",
  },
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
  colic: {
    result:
      "Potential Colic (Gastrointestinal distress). Immediately restrict all feed and grain. Walk the horse gently to prevent violent rolling, which can twist the intestines. Call a vet urgently.",
    severity: "warning",
  },
};

// ===================================================
// POST /api/vet/check  -> "Analyze Health" button
// ===================================================
exports.checkHealth = async (req, res, next) => {
  try {
    const horseName = req.body.horseName || "My Horse";
    const rawSymptom = (req.body.symptom || req.body.symptoms || "").toLowerCase();

    if (!rawSymptom) {
      return res.status(400).json({ success: false, message: "Please select or describe a symptom." });
    }

    let matchedKey = "injury";
    if (rawSymptom.includes("anuria") || rawSymptom.includes("urine") || rawSymptom.includes("urinate")) {
      matchedKey = "anuria";
    } else if (rawSymptom.includes("sweat") && rawSymptom.includes("fever")) {
      matchedKey = "surra";
    } else if (rawSymptom.includes("sweat")) {
      matchedKey = "heavy sweating";
    } else if (rawSymptom.includes("cough")) {
      matchedKey = "cough";
    } else if (rawSymptom.includes("fever")) {
      matchedKey = "fever";
    } else if (rawSymptom.includes("swell") || rawSymptom.includes("foot")) {
      matchedKey = "foot swelling";
    } else if (rawSymptom.includes("feed") || rawSymptom.includes("refus") || rawSymptom.includes("paw") || rawSymptom.includes("roll")) {
      matchedKey = "colic";
    }

    const advice = SYMPTOM_ADVICE[matchedKey];
    let images = [];
    if (req.files && req.files.length > 0) {
      images = await Promise.all(req.files.map((file) => uploadToCloudinary(file.path, "horsesquare/vet")));
    }

    const inquiry = await VetInquiry.create({
      horseName,
      symptom: matchedKey,
      details: req.body.details || rawSymptom,
      images,
      aiResult: advice.result,
      severity: advice.severity,
      submittedBy: req.user ? req.user._id : undefined,
    });

    res.status(201).json({
      success: true,
      assessment: {
        possibleCondition: matchedKey === "anuria"
          ? "Equine Anuria (Acute Renal Failure / Urethral Obstruction / Ruptured Bladder)"
          : matchedKey === "surra" 
            ? "Trypanosomiasis (Surra) - Parasitic Fever" 
            : matchedKey === "colic" 
              ? "Potential Colic (Gastrointestinal Distress)" 
              : matchedKey === "foot swelling"
                ? "Laminitis (Founder) or Sole Bruise"
                : matchedKey === "cough"
                  ? "Equine Respiratory Infection (Strangles/Influenza)"
                  : "Equine Injury or Wound",
        romanUrduCondition: matchedKey === "anuria"
          ? "Ghode Ko Peshab Na Aana (Gurday Ka Masla Ya Urinary Pathri)"
          : matchedKey === "surra"
            ? "Surra Bimari (Peti / Parasite Bukhār)"
            : matchedKey === "colic"
              ? "Colic (Pet Ka Dard / Aant Ki Rukawat)"
              : matchedKey === "foot swelling"
                ? "Laminitis (Sum Ka Dard / Khur Ki Sujan)"
                : matchedKey === "cough"
                  ? "Saans Ki Bimari / Khansi (Strangles Ya Nazla)"
                  : "Zakhmi Ghoda Ya Chot",
        urgency: advice.severity === "danger"
          ? "CRITICAL EMERGENCY - Immediate Vet Catheterization Required"
          : advice.severity === "warning" 
            ? "HIGH - Veterinary Attention Recommended" 
            : "Moderate - Monitor closely",
        romanUrduUrgency: advice.severity === "danger"
          ? "SHDEED EMERGENCY - Fauri Doctor Se Catheter Lagwayen"
          : advice.severity === "warning"
            ? "SANJEEDA - Doctor Ki Dawai Zaroori Hai"
            : "AAM - Dehyan Rakhen",
        recommendedActions: [
          advice.result,
          "Ensure clean, fresh water is available at all times.",
          "Check vital signs: normal horse pulse is 28-44 bpm, respiration 8-16 breaths/min."
        ],
        romanUrduActions: [
          matchedKey === "anuria"
            ? "Fauri taur par Banamine ya Phenylbutazone dawaiyan band karen jo gurday kharab karti hain."
            : matchedKey === "surra"
              ? "Bimar ghode ko makkhiyon aur machharon se door alag astabal me rakhen."
              : matchedKey === "colic"
                ? "Fauri taur par dana, patte aur ghaas khana bilkul band kar den."
                : "Saaf pani samne rakhen aur ghode par nazar rakhen.",
          "Saaf aur taza pani har waqt samne rakhen.",
          "Saans aur dil ki dhadkan (pulse: 28-44 bpm) regular check karte rahen."
        ],
        romanUrduSummary: matchedKey === "anuria"
          ? "Ghode ko peshab na aana renal failure ya nali me rukawat ki waja se ho sakta hai. Painkiller dawaen band karen aur fauri doctor se catheter lagwayen."
          : matchedKey === "surra"
            ? "Surra makkhi ke katne se hota hai. Ghode ko alag rakhen aur Quinapyramine injection ke liye doctor se rabta karen."
            : matchedKey === "colic"
              ? "Pet dard me ghode ka khana peena roken aur narm zameen par chalayen. Zameen par letne aur rolling se bachayen."
              : "Ghode ko aaram se rakhen aur fauri doctor se rabta karen."
      },
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

// ===================================================
// GET /api/vet/my-inquiries (protected) -> user dashboard view
// ===================================================
exports.getMyInquiries = async (req, res, next) => {
  try {
    const query = req.user ? { submittedBy: req.user._id } : {};
    const inquiries = await VetInquiry.find(query).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: inquiries.length, data: inquiries });
  } catch (error) {
    next(error);
  }
};

// ===================================================
// DELETE /api/vet/inquiries/:id -> delete AI Vet inquiry (Admin or Owner)
// ===================================================
exports.deleteInquiry = async (req, res, next) => {
  try {
    const inquiry = await VetInquiry.findById(req.params.id);
    if (!inquiry) {
      return res.status(404).json({ success: false, message: "AI Vet inquiry not found" });
    }

    if (req.user.role !== "admin" && String(inquiry.submittedBy) !== String(req.user._id)) {
      return res.status(403).json({ success: false, message: "Not authorized to delete this inquiry" });
    }

    await inquiry.deleteOne();
    res.status(200).json({ success: true, message: "AI Vet inquiry deleted successfully" });
  } catch (error) {
    next(error);
  }
};
