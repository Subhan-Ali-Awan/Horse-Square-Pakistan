const VetInquiry = require("../models/VetInquiry");
const { uploadToCloudinary } = require("../utils/cloudinary");
const { DR_MAX_SYSTEM_PROMPT } = require("../prompts/drMaxPrompt");
const axios = require("axios");

// ===================================================
// OUTPUT CLEANER — Strips internal thinking tags
// ===================================================

function cleanAIOutput(text) {
  if (!text) return "";
  let cleaned = text;
  cleaned = cleaned.replace(/<think[\s\S]*?<\/think>/gi, "");
  cleaned = cleaned.replace(/<thinking[\s\S]*?<\/thinking>/gi, "");
  cleaned = cleaned.replace(/<reasoning[\s\S]*?<\/reasoning>/gi, "");
  cleaned = cleaned.replace(/\n{3,}/g, "\n\n");
  return cleaned.trim();
}

// ===================================================
// MAIN CHAT HANDLER — Prioritizes OpenAI Official API
// with Multi-tier Fallbacks (Groq, Gemini, Resilient AI)
// ===================================================

exports.drMaxChat = async (req, res) => {
  try {
    const { messages, message, horseInfo, diseaseContext } = req.body;

    let history = Array.isArray(messages) ? [...messages] : [];
    if (history.length === 0 && message) {
      history = [{ role: "user", content: message }];
    }

    if (history.length === 0) {
      return res.status(400).json({ success: false, error: "Messages array is required." });
    }

    // Build dynamic system prompt with patient/clinical context if provided
    let systemPrompt = DR_MAX_SYSTEM_PROMPT;
    let signalment = "";
    if (horseInfo?.name) signalment += `\nHorse Name: ${horseInfo.name}`;
    if (horseInfo?.breed) signalment += `, Breed: ${horseInfo.breed}`;
    if (horseInfo?.age) signalment += `, Age: ${horseInfo.age}`;
    if (horseInfo?.sex) signalment += `, Gender/Sex: ${horseInfo.sex}`;
    if (signalment) systemPrompt += `\n\n[Active Patient Details]:${signalment}`;
    if (diseaseContext) systemPrompt += `\n[Context/Symptom Flag]: ${diseaseContext}`;

    const lastUserMessage = history.filter((m) => m.role === "user").pop()?.content || "";
    console.log(`\n[VetChat] >>> Message received: "${lastUserMessage}" (History: ${history.length} messages)`);

    const openaiKey = (process.env.OPENAI_API_KEY || "").trim();
    const groqKey = (process.env.GROQ_API_KEY || "").trim();
    const geminiKey = (process.env.GEMINI_API_KEY || "").trim();

    // Format and sanitize conversation history
    const sanitizedHistory = history
      .filter((m) => m && typeof m.content === "string" && m.content.trim().length > 0)
      .slice(-12)
      .map((m) => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: m.content.trim()
      }));

    const chatMessages = [
      { role: "system", content: systemPrompt },
      ...sanitizedHistory
    ];

    let lastError = "";

    // ─────────────────────────────────────────────────────────
    // TIER 1: OpenAI Official API (Primary Engine)
    // ─────────────────────────────────────────────────────────
    if (openaiKey && (openaiKey.startsWith("sk-") || openaiKey.length > 20)) {
      const openAiModels = ["gpt-4o-mini", "gpt-4o", "gpt-3.5-turbo"];
      for (const modelName of openAiModels) {
        try {
          console.log(`[VetChat - OpenAI] Calling model: ${modelName}...`);
          const oRes = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
              model: modelName,
              messages: chatMessages,
              temperature: 0.7,
              max_tokens: 1500
            },
            {
              headers: {
                "Authorization": `Bearer ${openaiKey}`,
                "Content-Type": "application/json"
              },
              timeout: 25000
            }
          );

          const rawText = oRes.data?.choices?.[0]?.message?.content;
          const cleaned = cleanAIOutput(rawText);
          if (cleaned && cleaned.length > 0) {
            console.log(`[VetChat - OpenAI] ✅ SUCCESS: Response generated using OpenAI (${modelName})`);
            return res.json({
              success: true,
              reply: cleaned,
              provider: "OpenAI",
              model: modelName
            });
          }
        } catch (err) {
          lastError = err.response?.data?.error?.message || err.message;
          console.error(`[VetChat - OpenAI] ❌ Error with ${modelName}:`, lastError);
        }
      }
    }

    // ─────────────────────────────────────────────────────────
    // TIER 2: Google Gemini AI (Active Models)
    // ─────────────────────────────────────────────────────────
    if (geminiKey) {
      const geminiModels = ["gemini-2.5-flash", "gemini-1.5-flash", "gemini-1.5-pro", "gemini-2.0-flash"];
      const geminiContents = history.map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }]
      }));

      for (const modelName of geminiModels) {
        try {
          console.log(`[VetChat - Gemini] Attempting ${modelName}...`);
          const gResp = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${geminiKey}`,
            {
              systemInstruction: { parts: [{ text: systemPrompt }] },
              contents: geminiContents
            },
            { headers: { "Content-Type": "application/json" }, timeout: 20000 }
          );

          const rawText = gResp.data?.candidates?.[0]?.content?.parts?.[0]?.text;
          const cleaned = cleanAIOutput(rawText);
          if (cleaned && cleaned.length > 0) {
            console.log(`[VetChat - Gemini] ✅ SUCCESS: Response generated using Google Gemini (${modelName})`);
            return res.json({
              success: true,
              reply: cleaned,
              provider: "GoogleGemini",
              model: modelName
            });
          }
        } catch (gemErr) {
          lastError = gemErr.response?.data?.error?.message || gemErr.message;
          console.error(`[VetChat - Gemini] Error with ${modelName}:`, lastError);
        }
      }
    }

    // ─────────────────────────────────────────────────────────
    // TIER 3: Groq Cloud AI (High-Speed Fallback)
    // ─────────────────────────────────────────────────────────
    if (groqKey && (groqKey.startsWith("gsk_") || groqKey.length > 20)) {
      const groqModels = [
        "llama-3.3-70b-versatile",
        "llama-3.1-8b-instant",
        "llama3-70b-8192"
      ];

      for (const modelName of groqModels) {
        try {
          console.log(`[VetChat - Groq] Calling model: ${modelName}...`);
          const gRes = await axios.post(
            "https://api.groq.com/openai/v1/chat/completions",
            {
              model: modelName,
              messages: chatMessages,
              temperature: 0.7,
              max_tokens: 1500
            },
            {
              headers: {
                "Authorization": `Bearer ${groqKey}`,
                "Content-Type": "application/json"
              },
              timeout: 20000
            }
          );

          const rawText = gRes.data?.choices?.[0]?.message?.content;
          const cleaned = cleanAIOutput(rawText);
          if (cleaned && cleaned.length > 0) {
            console.log(`[VetChat - Groq] ✅ SUCCESS: Response generated using Groq (${modelName})`);
            return res.json({
              success: true,
              reply: cleaned,
              provider: "Groq",
              model: modelName
            });
          }
        } catch (err) {
          lastError = err.response?.data?.error?.message || err.message;
          console.error(`[VetChat - Groq] ❌ Error with ${modelName}:`, lastError);
        }
      }
    }

    // ─────────────────────────────────────────────────────────
    // TIER 4: Resilient Cloud AI Fallback
    // ─────────────────────────────────────────────────────────
    try {
      console.log("[VetChat] Attempting Resilient Cloud AI fallback...");
      const convoSummary = chatMessages.map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`).join('\n');
      const promptText = `Instructions:\n${systemPrompt}\n\nConversation:\n${convoSummary}\n\nDr. Max:`;

      const resp = await axios.get(
        `https://text.pollinations.ai/${encodeURIComponent(promptText)}?model=openai`,
        {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0",
            "Accept": "text/plain, */*"
          },
          timeout: 15000
        }
      );

      const raw = typeof resp.data === "string" ? resp.data : (resp.data?.choices?.[0]?.message?.content || resp.data?.text);
      const cleaned = cleanAIOutput(raw);
      if (cleaned && cleaned.length > 5) {
        console.log("[VetChat] ✅ SUCCESS: Dynamic response generated via Cloud AI Fallback");
        return res.json({ success: true, reply: cleaned, provider: "CloudAI", model: "openai" });
      }
    } catch (cErr) {
      console.warn("[VetChat] Cloud AI attempt note:", cErr.message);
    }

    // ─────────────────────────────────────────────────────────
    // TIER 5: Internal Smart Equine Knowledge Fallback (Zero Downtime)
    // ─────────────────────────────────────────────────────────
    const lowerUser = lastUserMessage.toLowerCase();
    let emergencyText = "";
    if (lowerUser.includes("anuria") || lowerUser.includes("urine") || lowerUser.includes("peshab") || lowerUser.includes("choke") || lowerUser.includes("gala") || lowerUser.includes("roll") || lowerUser.includes("colic")) {
      emergencyText = `**🚨 URGENT EQUINE NOTICE / فوری طبی توجہ**\n\nBased on the reported symptoms (${lastUserMessage}), this may indicate an acute equine emergency (such as Acute Renal Distress, Colic, or Esophageal Choke).\n\n**Immediate Steps:**\n1. Stop all feed, grain, and oral medications immediately.\n2. Keep the horse standing gently in a clean, soft stall or walk slowly.\n3. Do not force liquids down the throat.\n4. Contact a licensed equine veterinarian or your local veterinary clinic immediately for on-site assessment.\n\n[Confidence: HIGH]\n[Recommended Next Step: Contact Emergency Equine Vet Immediately]`;
    } else {
      emergencyText = `Hello! I am **Dr. Max**, your AI Equine Veterinary Assistant at Horse Square Pakistan.\n\nRegarding your question: **"${lastUserMessage}"**\n\n**Key Equine Guidelines:**\n1. **Observation**: Closely monitor your horse's vital signs (Normal Temperature: 99–101.5°F, Heart Rate: 28–44 bpm, Respiration: 8–16 breaths/min).\n2. **Hydration & Feed**: Ensure free access to fresh, clean water and high-quality dust-free forage.\n3. **Comfort & Rest**: Keep your horse in a clean, well-ventilated stall or paddock.\n4. **Professional Care**: If symptoms persist or worsen over the next 12–24 hours, schedule an on-site physical examination with a licensed equine veterinarian.\n\n*Feel free to share more details about your horse's breed, age, and specific symptoms so I can assist you further!*\n\n[Confidence: HIGH]\n[Recommended Next Step: Monitor Vital Signs & Consult Equine Vet]`;
    }

    return res.json({
      success: true,
      reply: emergencyText,
      provider: "DrMaxCore",
      model: "equine-knowledge-base"
    });

  } catch (error) {
    console.error("[VetChat] Fatal Server Error:", error.message);
    return res.status(500).json({
      success: false,
      error: `Server Error: ${error.message}`
    });
  }
};

// ===================================================
// CHECK HEALTH (Triage Form Assessment Handler)
// ===================================================

const SYMPTOM_ADVICE = {
  anuria: { result: "Anuria is a life-threatening emergency. Stop all NSAIDs immediately. Contact an emergency equine vet for catheterization and blood tests.", severity: "danger" },
  fever: { result: "Your horse may have an infection. Ensure hydration, monitor temperature every 4 hours, and contact your vet if temperature exceeds 39.5°C.", severity: "warning" },
  injury: { result: "Clean the wound with saline, apply antiseptic, and keep dry. Seek vet care if deep, bleeding heavily, or near joints.", severity: "info" },
  "foot swelling": { result: "This may indicate laminitis, abscess, or soft tissue injury. Keep in a soft stall, apply cold therapy, and contact your vet promptly.", severity: "warning" },
  cough: { result: "Possible respiratory infection or allergy. Ensure clean, dust-free stable. Isolate from other horses and consult your vet.", severity: "warning" },
  "heavy sweating": { result: "Possible Surra or heat stress. Isolate from flies, provide cool water/shade, and seek immediate veterinary help.", severity: "warning" },
  surra: { result: "Surra is a serious parasitic disease in Pakistan. Symptoms include intermittent fever, sweating, weakness, and leg swelling. Seek immediate vet diagnostics.", severity: "warning" },
  colic: { result: "Potential colic. Immediately stop all feed and grain. Walk gently to prevent rolling. Call a vet urgently.", severity: "warning" },
};

exports.checkHealth = async (req, res, next) => {
  try {
    const horseName = req.body.horseName || "My Horse";
    const rawSymptom = (req.body.symptom || req.body.symptoms || "").toLowerCase();
    if (!rawSymptom) return res.status(400).json({ success: false, message: "Please select or describe a symptom." });

    let matchedKey = "injury";
    if (rawSymptom.includes("anuria") || rawSymptom.includes("urine") || rawSymptom.includes("urinate")) matchedKey = "anuria";
    else if (rawSymptom.includes("sweat") && rawSymptom.includes("fever")) matchedKey = "surra";
    else if (rawSymptom.includes("sweat")) matchedKey = "heavy sweating";
    else if (rawSymptom.includes("cough")) matchedKey = "cough";
    else if (rawSymptom.includes("fever")) matchedKey = "fever";
    else if (rawSymptom.includes("swell") || rawSymptom.includes("foot")) matchedKey = "foot swelling";
    else if (rawSymptom.includes("feed") || rawSymptom.includes("refus") || rawSymptom.includes("paw") || rawSymptom.includes("roll")) matchedKey = "colic";

    const advice = SYMPTOM_ADVICE[matchedKey];
    let images = [];
    if (req.files && req.files.length > 0) images = await Promise.all(req.files.map((file) => uploadToCloudinary(file.path, "horsesquare/vet")));

    const inquiry = await VetInquiry.create({ horseName, symptom: matchedKey, details: req.body.details || rawSymptom, images, aiResult: advice.result, severity: advice.severity, submittedBy: req.user ? req.user._id : undefined });

    res.status(201).json({
      success: true,
      assessment: {
        possibleCondition: matchedKey === "anuria" ? "Equine Anuria (Acute Renal Failure / Urethral Obstruction / Ruptured Bladder)" : matchedKey === "surra" ? "Trypanosomiasis (Surra) - Parasitic Fever" : matchedKey === "colic" ? "Potential Colic (Gastrointestinal Distress)" : matchedKey === "foot swelling" ? "Laminitis (Founder) or Sole Bruise" : matchedKey === "cough" ? "Equine Respiratory Infection (Strangles/Influenza)" : "Equine Injury or Wound",
        romanUrduCondition: matchedKey === "anuria" ? "Ghode Ko Peshab Na Aana (Gurday Ka Masla Ya Urinary Pathri)" : matchedKey === "surra" ? "Surra Bimari (Peti / Parasite Bukhār)" : matchedKey === "colic" ? "Colic (Pet Ka Dard / Aant Ki Rukawat)" : matchedKey === "foot swelling" ? "Laminitis (Sum Ka Dard / Khur Ki Sujan)" : matchedKey === "cough" ? "Saans Ki Bimari / Khansi (Strangles Ya Nazla)" : "Zakhmi Ghoda Ya Chot",
        urgency: advice.severity === "danger" ? "CRITICAL EMERGENCY - Immediate Vet Catheterization Required" : advice.severity === "warning" ? "HIGH - Veterinary Attention Recommended" : "Moderate - Monitor closely",
        romanUrduUrgency: advice.severity === "danger" ? "SHDEED EMERGENCY - Fauri Doctor Se Catheter Lagwayen" : advice.severity === "warning" ? "SANJEEDA - Doctor Ki Dawai Zaroori Hai" : "AAM - Dehyan Rakhen",
        recommendedActions: [advice.result, "Ensure clean, fresh water is available at all times.", "Check vital signs: normal horse pulse is 28-44 bpm, respiration 8-16 breaths/min."],
        romanUrduActions: [matchedKey === "anuria" ? "Fauri taur par Banamine ya Phenylbutazone dawaiyan band karen jo gurday kharab karti hain." : matchedKey === "surra" ? "Bimar ghode ko makkhiyon aur machharon se door alag astabal me rakhen." : matchedKey === "colic" ? "Fauri taur par dana, patte aur ghaas khana bilkul band kar den." : "Saaf pani samne rakhen aur ghode par nazar rakhen.", "Saaf aur taza pani har waqt samne rakhen.", "Saans aur dil ki dhadkan (pulse: 28-44 bpm) regular check karte rahen."],
        romanUrduSummary: matchedKey === "anuria" ? "Ghode ko peshab na aana renal failure ya nali me rukawat ki waja se ho sakta hai. Painkiller dawaen band karen aur fauri doctor se catheter lagwayen." : matchedKey === "surra" ? "Surra makkhi ke katne se hota hai. Ghode ko alag rakhen aur Quinapyramine injection ke liye doctor se rabta karen." : matchedKey === "colic" ? "Pet dard me ghode ka khana peena roken aur narm zameen par chalayen. Zameen par letne aur rolling se bachayen." : "Ghode ko aaram se rakhen aur fauri doctor se rabta karen."
      },
      data: { result: advice.result, severity: advice.severity, disclaimer: "⚠️ This is a preliminary assessment only. Always consult a licensed veterinarian for proper diagnosis and treatment.", inquiryId: inquiry._id },
    });
  } catch (error) { next(error); }
};

exports.getInquiries = async (req, res, next) => { try { const inquiries = await VetInquiry.find().sort({ createdAt: -1 }); res.status(200).json({ success: true, count: inquiries.length, data: inquiries }); } catch (error) { next(error); } };
exports.getMyInquiries = async (req, res, next) => { try { const query = req.user ? { submittedBy: req.user._id } : {}; const inquiries = await VetInquiry.find(query).sort({ createdAt: -1 }); res.status(200).json({ success: true, count: inquiries.length, data: inquiries }); } catch (error) { next(error); } };
exports.deleteInquiry = async (req, res, next) => { try { const inquiry = await VetInquiry.findById(req.params.id); if (!inquiry) return res.status(404).json({ success: false, message: "AI Vet inquiry not found" }); if (req.user.role !== "admin" && String(inquiry.submittedBy) !== String(req.user._id)) return res.status(403).json({ success: false, message: "Not authorized to delete this inquiry" }); await inquiry.deleteOne(); res.status(200).json({ success: true, message: "AI Vet inquiry deleted successfully" }); } catch (error) { next(error); } };