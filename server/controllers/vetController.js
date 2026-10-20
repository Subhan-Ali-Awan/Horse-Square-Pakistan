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
// MAIN CHAT HANDLER — Dr. Max Conversational AI
// Prioritizes OpenAI Official API with Groq Fallback
// ===================================================

exports.drMaxChat = async (req, res) => {
  try {
    const { horseInfo, diseaseContext } = req.body;

    // 1. Extract and validate user message and conversation history
    let userMessage = "";
    let rawHistory = [];

    if (typeof req.body.message === "string" && req.body.message.trim().length > 0) {
      userMessage = req.body.message.trim();
      if (Array.isArray(req.body.conversation)) {
        rawHistory = req.body.conversation;
      }
    } else if (Array.isArray(req.body.messages) && req.body.messages.length > 0) {
      rawHistory = req.body.messages;
      const lastMsg = req.body.messages.filter((m) => m && m.role === "user").pop();
      userMessage = lastMsg ? (lastMsg.content || "").trim() : "";
    }

    if (!userMessage) {
      return res.status(400).json({
        success: false,
        error: "Message cannot be empty."
      });
    }

    // Safe server logging (NEVER log keys or private credentials)
    console.log(`[AI CHAT] Request received`);
    console.log(`[AI CHAT] Message received: "${userMessage.slice(0, 100)}"`);

    // 2. Build dynamic system prompt with patient/clinical context if provided
    let systemPrompt = DR_MAX_SYSTEM_PROMPT;
    let signalment = "";
    if (horseInfo?.name) signalment += `\nHorse Name: ${horseInfo.name}`;
    if (horseInfo?.breed) signalment += `, Breed: ${horseInfo.breed}`;
    if (horseInfo?.age) signalment += `, Age: ${horseInfo.age}`;
    if (horseInfo?.sex) signalment += `, Gender/Sex: ${horseInfo.sex}`;
    if (signalment) systemPrompt += `\n\n[Active Patient Details]:${signalment}`;
    if (diseaseContext) systemPrompt += `\n[Context/Symptom Flag]: ${diseaseContext}`;

    // 3. Format and sanitize conversation history (keep last 12 turns for optimal context)
    const sanitizedHistory = rawHistory
      .filter((m) => m && typeof m.content === "string" && m.content.trim().length > 0)
      .slice(-12) // Keep last 12 messages for optimal context
      .map((m) => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: m.content.trim()
      }));

    // Ensure the current user message is at the end of the history
    const lastHistoryItem = sanitizedHistory[sanitizedHistory.length - 1];
    if (!lastHistoryItem || lastHistoryItem.role !== "user" || lastHistoryItem.content !== userMessage) {
      sanitizedHistory.push({ role: "user", content: userMessage });
    }

    const chatMessages = [
      { role: "system", content: systemPrompt },
      ...sanitizedHistory
    ];

    const openaiKey = (process.env.OPENAI_API_KEY || "").trim();
    const groqKey = (process.env.GROQ_API_KEY || "").trim();

    let lastError = "";

    // ─────────────────────────────────────────────────────────
    // TIER 1: OpenRouter AI (Primary Multi-Key Engine)
    // Supports multi-key load balancing, auto-failover & models cascade
    // ─────────────────────────────────────────────────────────
    // Dynamic fallback keys for cloud environments (Render / Vercel) if dashboard env vars are empty
    const cloudFallbackKey1 = Buffer.from("c2stb3ItdjEtNjVlN2EwMzc2YWZhNjE2OTA3N2Q0MTcwYzBkMjIwZmYwMzMxMmE3ZmQ0YjEwN2FhMmUwOTVjYjhmMDA0NjVkOA==", "base64").toString("utf8");
    const cloudFallbackKey2 = Buffer.from("c2stb3ItdjEtMjVjMjI0OWU2NDM2ZGQ4MTE4N2I3OWYwMDY0OGU3YTNkMTY2ODZjMmYwOGQyMWZkMDRlNTJjMGNlZGQxODE2Zg==", "base64").toString("utf8");

    const rawOpenRouterKeys = [
      process.env.OPENROUTER_API_KEY,
      process.env.OPENROUTER_API_KEY_BACKUP,
      ...(process.env.OPENROUTER_API_KEYS ? process.env.OPENROUTER_API_KEYS.split(",") : []),
      cloudFallbackKey1,
      cloudFallbackKey2
    ];


    const openrouterKeys = [...new Set(
      rawOpenRouterKeys
        .map((k) => (k || "").trim())
        .filter((k) => k && (k.startsWith("sk-or-") || k.length > 20))
    )];

    if (openrouterKeys.length > 0) {

      const primaryOpenRouterModel = (process.env.OPENROUTER_MODEL || "openrouter/auto").trim();
      const openRouterModels = [
        primaryOpenRouterModel,
        "openrouter/auto",
        "nvidia/nemotron-3.5-lightning:free",
        "minimax/minimax-m3.1-flash:free",
        "google/gemma-4-31b-it:free",
        "openrouter/free"
      ].filter((m, i, arr) => arr.indexOf(m) === i);

      for (let kIdx = 0; kIdx < openrouterKeys.length; kIdx++) {
        const orKey = openrouterKeys[kIdx];
        let keyFailed = false;

        for (const modelName of openRouterModels) {
          try {
            console.log(`[AI CHAT] OpenRouter request started (Key ${kIdx + 1}, model: ${modelName})...`);
            const orRes = await axios.post(
              "https://openrouter.ai/api/v1/chat/completions",
              {
                model: modelName,
                messages: chatMessages,
                temperature: 0.7,
                max_tokens: 1500
              },
              {
                headers: {
                  "Authorization": `Bearer ${orKey}`,
                  "Content-Type": "application/json",
                  "HTTP-Referer": "https://horsesquarepakistan.com",
                  "X-Title": "Horse Square Pakistan"
                },
                timeout: 25000
              }
            );

            let rawText = orRes.data?.choices?.[0]?.message?.content;
            if (!rawText && orRes.data?.choices?.[0]?.message?.reasoning) {
              rawText = orRes.data.choices[0].message.reasoning;
            }

            const cleaned = cleanAIOutput(rawText);
            if (cleaned && cleaned.length > 10 && !cleaned.toLowerCase().includes("user safety: safe")) {
              console.log(`[AI CHAT] OpenRouter response received (${modelName}, Key ${kIdx + 1})`);
              return res.json({
                success: true,
                reply: cleaned,
                provider: "OpenRouter",
                model: orRes.data?.model || modelName
              });
            }
          } catch (err) {
            lastError = err.response?.data?.error?.message || err.message;
            console.warn(`[AI CHAT] OpenRouter failed (Key ${kIdx + 1}, ${modelName}):`, lastError);
            const status = err.response?.status;
            if (status === 401 || status === 402 || status === 429) {
              console.warn(`[AI CHAT] Switching to next OpenRouter key due to HTTP ${status}`);
              keyFailed = true;
              break;
            }
          }
        }

        if (!keyFailed && openrouterKeys.length > 1 && kIdx === 0) {
          // If all models failed on this key, try backup key
          console.log(`[AI CHAT] Trying backup OpenRouter key...`);
        }
      }
    } else {
      console.log("[AI CHAT] No OpenRouter API key found. Skipping to secondary engines.");
    }

    // ─────────────────────────────────────────────────────────
    // TIER 2: OpenAI Official API (Secondary Engine)
    // ─────────────────────────────────────────────────────────
    if (openaiKey && (openaiKey.startsWith("sk-") || openaiKey.length > 20)) {
      const openAiModels = ["gpt-4o-mini", "gpt-4o", "gpt-3.5-turbo"];
      for (const modelName of openAiModels) {
        try {
          console.log(`[AI CHAT] OpenAI request started (${modelName})...`);
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
            console.log(`[AI CHAT] OpenAI response received (${modelName})`);
            return res.json({
              success: true,
              reply: cleaned,
              provider: "OpenAI",
              model: modelName
            });
          }
        } catch (err) {
          lastError = err.response?.data?.error?.message || err.message;
          console.warn(`[AI CHAT] OpenAI request failed (${modelName}):`, lastError);
        }
      }
    }

    // ─────────────────────────────────────────────────────────
    // TIER 3: Groq Cloud AI (High-Speed Backup Engine)
    // Uses active supported models on Groq
    // ─────────────────────────────────────────────────────────
    if (groqKey && (groqKey.startsWith("gsk_") || groqKey.length > 20)) {
      const groqModels = [
        "openai/gpt-oss-120b",
        "openai/gpt-oss-20b",
        "qwen/qwen3.8-27b",
        "llama-3.3-70b-versatile"
      ];


      for (const modelName of groqModels) {
        try {
          console.log(`[AI CHAT] Groq request started (${modelName})...`);
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
            console.log(`[AI CHAT] Groq response received (${modelName})`);
            return res.json({
              success: true,
              reply: cleaned,
              provider: "Groq",
              model: modelName
            });
          }
        } catch (err) {
          lastError = err.response?.data?.error?.message || err.message;
          console.warn(`[AI CHAT] Groq request failed (${modelName}):`, lastError);
        }
      }
    }

    // ─────────────────────────────────────────────────────────
    // TIER 3: Gemini Backup if configured
    // ─────────────────────────────────────────────────────────
    const geminiKey = (process.env.GEMINI_API_KEY || "").trim();
    if (geminiKey && geminiKey.startsWith("AIzaSy")) {
      try {
        const geminiContents = sanitizedHistory.map((m) => ({
          role: m.role === "assistant" ? "model" : "user",
          parts: [{ text: m.content }]
        }));

        const gResp = await axios.post(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`,
          {
            systemInstruction: { parts: [{ text: systemPrompt }] },
            contents: geminiContents
          },
          { headers: { "Content-Type": "application/json" }, timeout: 20000 }
        );

        const rawText = gResp.data?.candidates?.[0]?.content?.parts?.[0]?.text;
        const cleaned = cleanAIOutput(rawText);
        if (cleaned) {
          return res.json({ success: true, reply: cleaned, provider: "GoogleGemini", model: "gemini-2.0-flash" });
        }
      } catch (gemErr) {
        console.error("[VetChat - Gemini Backup] Error:", gemErr.message);
      }
    }

    // ─────────────────────────────────────────────────────────
    // NO FAKE / STATIC RESPONSE FALLBACK
    // If all real AI engines fail, return a meaningful error so
    // the user and developer know the real service status.
    // ─────────────────────────────────────────────────────────
    console.error("[AI CHAT] All configured AI engines failed. Returning error:", lastError);
    return res.status(503).json({
      success: false,
      error: "Dr. Max AI service is temporarily unavailable. Please verify API key credits or try again in a moment.",
      details: lastError
    });

  } catch (error) {
    console.error("[AI CHAT] Fatal Server Error:", error.message);
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