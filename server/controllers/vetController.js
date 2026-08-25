const VetInquiry = require("../models/VetInquiry");
const { uploadToCloudinary } = require("../utils/cloudinary");
const { DR_MAX_SYSTEM_PROMPT } = require("../prompts/drMaxPrompt");
const axios = require("axios");

// ===================================================
// HELPERS
// ===================================================

const OFF_TOPIC_KEYWORDS = [
  "cricket", "football", "soccer", "politics", "election", "bitcoin",
  "crypto", "stock market", "weather forecast", "recipe", "cooking",
  "my dog", "my cat", "my cow", "my goat", "my buffalo", "human",
  "pregnancy woman", "child fever", "corona", "covid", "job", "hiring",
  "capital of", "who is the president", "prime minister", "iphone",
  "android", "programming", "javascript", "python", "react", "math",
  "history of", "who invented", "movie", "song", "actor", "singer",
  "translate", "meaning of", "definition of"
];

const EQUINE_KEYWORDS = [
  "horse", "ghora", "ghore", "ghoray", "mare", "stallion", "foal", "colt", "filly",
  "gelding", "equine", "khur", "dard", "bukhar", "lameness", "colic",
  "laminitis", "surra", "hoof", "saddle", "bridle", "farrier", "vet",
  "equestrian", "dressage", "show jumping", "thoroughbred", "arabian",
  "desi", "nukra", "sindhi", "balochi", "friesian", "quarter horse",
  "breeding", "foaling", "teeth", "dental", "worm", "deworm", "vaccine",
  "inject", "medicine", "treatment", "symptom", "disease", "injury",
  "wound", "fever", "cough", "sweating", "appetite", "feed", "grain",
  "hay", "pasture", "stable", "stall", "riding", "training", "gallop",
  "trot", "canter", "shoe", "shoeing", "frog", "thrush", "abscess",
  "founder", "navicular", "arthritis", "tendon", "ligament", "fracture",
  "dose", "dosage", "medicine", "drug", "painkiller", "antibiotic", "injection",
  "rolling", "kicking", "belly", "pawing", "not eating", "eye", "aankh",
  "urine", "peshab", "swelling", "soojan", "weakness", "kamzori",
  "vomit", "puke", "throw up", "choke", "swallow", "breathing", "breath"
];

function isOffTopic(message) {
  if (!message) return false;
  const lower = message.toLowerCase();
  if (EQUINE_KEYWORDS.some(k => lower.includes(k))) return false;
  if (OFF_TOPIC_KEYWORDS.some(k => lower.includes(k))) return true;
  return false;
}

function detectLanguageHint(message) {
  if (!message) return "english";
  const lower = message.toLowerCase();
  const romanUrduMarkers = [
    "mere", "ghore", "ghora", "ghoray", "ko", "hai", "kya", "ka", "ki", "ke",
    "mein", "se", "aur", "lekin", "agar", "nahi", "bukhar", "dard",
    "ilaj", "batain", "karein", "hoon", "aap", "tum", "mera", "teri",
    "karo", "kahan", "kaise", "kyun", "kab", "kitna", "zyada", "kam",
    "theek", "behtar", "pareshan", "madad", "shukria", "allah", "hafiz",
    "janwar", "ghiza", "dawai", "doctor", "bimar", "sust", "tandrust",
    "chalna", "rukna", "doodh", "bacha", "bachra", "naak", "munh", "pet",
    "zakhmi", "soojan", "garami", "sardi", "khansi", "chot", "dhabba"
  ];
  const count = romanUrduMarkers.filter(w => lower.includes(w)).length;
  if (count >= 2) return "roman_urdu";
  if (/[\u0600-\u06FF]/.test(message)) return "urdu_script";
  return "english";
}

// ===================================================
// AGGRESSIVE OUTPUT CLEANER — Strips thinking leaks
// ===================================================

function aggressiveClean(text) {
  if (!text) return "";
  let cleaned = text;

  // Strip <think>, <thinking>, <reasoning> tags and everything inside
  cleaned = cleaned.replace(/<think[\s\S]*?<\/think>/gi, "");
  cleaned = cleaned.replace(/<thinking[\s\S]*?<\/thinking>/gi, "");
  cleaned = cleaned.replace(/<reasoning[\s\S]*?<\/reasoning>/gi, "");

  // Strip "Here's a thinking process" / "Thinking process:" and everything following up to the real response
  cleaned = cleaned.replace(/^[\s\S]*?Here'?s?\s+a?\s*thinking\s*process:?[\s\S]*?(?=\n\n(?:Hello|Assalam|Stop|Rukiye|I appreciate|I understand|Dear|Any|Colic|Dr\.))/gi, "");
  cleaned = cleaned.replace(/^[\s\S]*?Thinking\s*process:?[\s\S]*?(?=\n\n(?:Hello|Assalam|Stop|Rukiye|I appreciate|I understand|Dear|Any|Colic|Dr\.))/gi, "");

  // Strip standalone numbered analysis steps like "1.Analyze User Input", "2.Check Constraints", "4.Draft Construction"
  cleaned = cleaned.replace(/\d+\s*[.\)]\s*Analyze\s+User\s+Input:?[\s\S]*?(?=\n\d+\s*[.\)]\s*[A-Z]|\n\n[A-Z]|$)/gi, "");
  cleaned = cleaned.replace(/\d+\s*[.\)]\s*Check\s+(Against\s+)?(Constraints|Rules|for\s+Emergency)[\s\S]*?(?=\n\d+\s*[.\)]\s*[A-Z]|\n\n[A-Z]|$)/gi, "");
  cleaned = cleaned.replace(/\d+\s*[.\)]\s*Formulate\s*Response\s*(Strategy)?:?[\s\S]*?(?=\n\d+\s*[.\)]\s*[A-Z]|\n\n[A-Z]|$)/gi, "");
  cleaned = cleaned.replace(/\d+\s*[.\)]\s*Draft\s*Construction[\s\S]*?(?=\n\n(?:Hello|Assalam|Stop|Rukiye|I appreciate|I understand|Dear|Any|Colic|Dr\.)|\n\d+\s*[.\)]\s*[A-Z]|$)/gi, "");
  cleaned = cleaned.replace(/\d+\s*[.\)]\s*Self-Correction[\s\S]*?(?=\n\d+\s*[.\)]\s*[A-Z]|\n\n[A-Z]|$)/gi, "");
  cleaned = cleaned.replace(/\d+\s*[.\)]\s*Output\s*Generation[\s\S]*?(?=\n\d+\s*[.\)]\s*[A-Z]|\n\n[A-Z]|$)/gi, "");

  // Strip meta notes
  cleaned = cleaned.replace(/Mental\s*Refinement:?[\s\S]*?(?=\n\n[A-Z]|$)/gi, "");
  cleaned = cleaned.replace(/Structure:?\s*\n(?:- .*\n)+/gi, "");

  // Remove AI disclaimers
  cleaned = cleaned.replace(/As an AI language model/gi, "");
  cleaned = cleaned.replace(/As an AI/gi, "");
  cleaned = cleaned.replace(/I am a large language model/gi, "");
  cleaned = cleaned.replace(/I don't have personal experiences/gi, "");
  cleaned = cleaned.replace(/I am an AI assistant/gi, "");

  // Collapse multiple blank lines
  cleaned = cleaned.replace(/\n{3,}/g, "\n\n");

  return cleaned.trim();
}

// ===================================================
// FALLBACK ENGINE — Dual Language (English + Roman Urdu)
// ===================================================

const getClinicalBackup = (userInput, horseInfo, diseaseContext) => {
  const text = `${userInput || ""} ${diseaseContext || ""}`.toLowerCase();
  const name = horseInfo?.name || "your horse";

  // EMERGENCY: COLIC
  if (text.includes("colic") || text.includes("roll") || text.includes("kicking") || text.includes("paw") || text.includes("kick belly") || text.includes("pet dard") || text.includes("belly")) {
    return `Stop. This is a critical veterinary emergency. Call your veterinarian immediately — do not delay.

While you wait, immediately remove all feed, hay, and water from ${name}. Walk him slowly in hand if safe to prevent violent rolling, as rolling can twist the intestines or worsen an impaction. Keep him calm and on soft ground.

---
**اردو رہنمائی (Roman Urdu):**
Rukiye. Yeh shadeed emergency hai aur fauri taur par doctor ko bulana zaroori hai. Abhi apne veterinarian ko call karein.

Jab tak doctor pohanchay, ${name} ka sara khana, ghaas, aur pani fauri band kar dein. Ahista ahista naram zameen par chalayein taake zameen par let kar rolling na kare. Zameen par letne aur lotnay se aantoon ki rukawat mazeed barh sakti hai.

[Confidence: HIGH]
[Recommended Next Step: Emergency Vet Now]`;
  }

  // EMERGENCY: CHOKE
  if (text.includes("choke") || text.includes("swallow") || text.includes("esophag") || text.includes("na nigal") || text.includes("stuff from nose")) {
    return `Stop. This is an equine emergency. Call your veterinarian right away.

Remove all food, hay, grain, and water immediately. Keep ${name}'s head lowered so saliva and feed material can drain naturally from the nostrils to prevent inhalation pneumonia. Do not force water or try to flush the throat.

---
**اردو رہنمائی (Roman Urdu):**
Rukiye. Yeh emergency hai, fori vet doctor ko call karein.

Sara khana, ghaas, aur pani fauri hata lein. ${name} ka sar neecha rakhein taake thook aur khana naak ke raste bahar nikal sake aur phephron mein na jaye. Zabardasti pani ya dawai pilane ki koshish hargiz na karein.

[Confidence: HIGH]
[Recommended Next Step: Emergency Vet Now]`;
  }

  // EMERGENCY: CAN'T URINATE (ANURIA)
  if (text.includes("anuria") || text.includes("urine") || text.includes("urinate") || text.includes("peshab") || text.includes("peshab na")) {
    return `This is a life-threatening renal/urinary emergency — contact an equine veterinarian immediately.

STOP all NSAID painkillers like Banamine (Flunixin) or Phenylbutazone immediately as they cause severe acute kidney damage. Keep fresh water available and keep ${name} resting in a quiet stall.

---
**اردو رہنمائی (Roman Urdu):**
Yeh intehayi shadeed emergency hai — fauri equine doctor se rabta karein.

Banamine ya Phenylbutazone jaisi tamam painkiller dawaiyan FAURI BAND kar dein kyunki yeh gurday fail kar sakti hain. Saaf pani samne rakhein aur ${name} ko pursakoon astabal mein rakhein.

[Confidence: HIGH]
[Recommended Next Step: Emergency Vet Now]`;
  }

  // EMERGENCY: EYE / UVEITIS
  if (text.includes("eye") || text.includes("aankh") || text.includes("blind") || text.includes("cornea") || text.includes("tear") || text.includes("uveitis")) {
    return `Any acute eye problem in horses is considered an emergency, as untreated uveitis or ulcers can cause permanent blindness within 24–48 hours.

Keep ${name} in a dark, shaded stall away from bright sunlight and dust. Fit a clean fly mask for protection. NEVER administer steroid eye drops without an on-site fluorescein stain test by a vet.

---
**اردو رہنمائی (Roman Urdu):**
Aankh ka koi bhi masla fori emergency hai — 24 se 48 ghante mein andapan (blindness) ka khatra hota hai.

${name} ko andheray aur thanday stall mein rakhein taake tez dhoop aur dhoor se bachao ho. Fly mask lagayein. Bina doctor ke fluorescein test ke koi bhi steroid eye drop NA lagayein. Fauri doctor se rabta karein.

[Confidence: HIGH]
[Recommended Next Step: Emergency Vet Now]`;
  }

  // FOOT / HOOF / LAMINITIS
  if (text.includes("foot") || text.includes("swell") || text.includes("hoof") || text.includes("laminit") || text.includes("khur") || text.includes("lameness") || text.includes("langra")) {
    return `Foot and hoof pain in horses requires prompt, careful management.

Most commonly, this is caused by a subsolar hoof abscess, acute laminitis (founder), or a severe sole bruise. Move ${name} into a deeply bedded stall with soft shavings. Apply cold water or ice therapy for 15–20 minutes. Avoid forced walking or exercise until evaluated.

---
**اردو رہنمائی (Roman Urdu):**
Aap pareshan na hon, ${name} ke khur ke dard mein ahtiyat aur fori dekh bhal zaroori hai.

Aam wajoohāt mein khur ka infection (abscess), laminitis (khur ke andar soozish), ya sakht zameen se chot ho sakti hai. Ghore ko gehre aur naram bedding wale stall mein rakhein. Thanday pani ya barf se 15-20 minute cold therapy karein. Zabardasti sawari ya exercise na karwayein.

[Confidence: HIGH]
[Recommended Next Step: Urgent Vet Evaluation within 4h]`;
  }

  // FEVER
  if (text.includes("fever") || text.includes("bukhar") || text.includes("temp") || text.includes("temperature") || text.includes("garami")) {
    return `A horse's normal resting rectal temperature is 99.0°F to 101.5°F (37.2°C to 38.6°C). Any sustained rise indicates active infection or systemic stress.

Common causes include viral respiratory infections (Influenza/EHV), Strangles, or Surra (endemic in Pakistan). Provide fresh clean water and soaked forage. Isolate from other horses and record temperature every 4 hours. NEVER give human medications.

---
**اردو رہنمائی (Roman Urdu):**
Ghore ka normal temperature 99°F se 101.5°F hota hai. Bukhar ko halke mein na lein.

Mumkin wajoohāt: Viral nazla/zukaam, Strangles, ya Pakistan mein phailne wali Surra bimari. Taza pani aur geeli ghaas dein. Ghore ko doosray janwaron se alag rakhein aur har 4 ghante baad temperature check karein. Insanon ki paracetamol ya dawai hargiz na dein.

[Confidence: HIGH]
[Recommended Next Step: Routine Vet Visit within 24h]`;
  }

  // DEFAULT DUAL LANGUAGE
  return `I am here to assist you fully with ${name}'s health and management.

Please share details about specific signs, duration, appetite, and demeanor so I can provide tailored clinical guidance. If your horse shows acute distress, fever above 103°F, or colic signs, contact your on-site veterinarian immediately.

---
**اردو رہنمائی (Roman Urdu):**
Main ${name} ki sehat aur dekh bhal ke liye yahan poori madad ke liye hazir hoon.

Mujhe thori mazeed tafseelat batayein — jaise alamat kab se hain, khana peena kaisa hai aur ghore ki harkaat o saknaat. Agar shadeed dard, 103°F se zyada bukhar ya pet dard ho to fori doctor se rabta karein.

[Confidence: MODERATE]
[Recommended Next Step: Supportive Care & Monitor]`;
};

// ===================================================
// MAIN CHAT HANDLER
// ===================================================

exports.drMaxChat = async (req, res) => {
  try {
    const { messages, horseInfo, diseaseContext } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ success: false, error: "Messages array is required." });
    }

    const lastUserMessage = messages.filter((m) => m.role === "user").pop()?.content || "";

    // Scope guard (Dual Language)
    if (isOffTopic(lastUserMessage)) {
      const refusalDual = `I appreciate your message, but I am Dr. Max Hartwell, an equine veterinarian specializing exclusively in horse health and care on Horse-Square Pakistan. I can only assist with questions related to horses, foals, breeding, nutrition, and management.\n\n---\n**اردو رہنمائی (Roman Urdu):**\nMain Dr. Max Hartwell hoon — Horse-Square Pakistan par sirf ghoron ki sehat aur ilaj ka specialist. Main sirf ghoron ke baray mein rehnumai de sakta hoon. Agar aap ke ghoray ka koi masla hai to zaroor batayein.`;
      return res.json({ success: true, reply: refusalDual, scopeBlocked: true });
    }

    // Build system prompt
    let systemPrompt = DR_MAX_SYSTEM_PROMPT;
    let signalment = "";
    if (horseInfo?.name) signalment += `\nHorse: ${horseInfo.name}`;
    if (horseInfo?.breed) signalment += `, ${horseInfo.breed}`;
    if (horseInfo?.age) signalment += `, ${horseInfo.age}`;
    if (horseInfo?.sex) signalment += `, ${horseInfo.sex}`;
    if (signalment) systemPrompt += `\nPatient:${signalment}`;
    systemPrompt += `\nContext: ${diseaseContext || "None selected"}`;
    systemPrompt += `\n\nCRITICAL REQUIREMENT: Always respond in BOTH English and Roman Urdu (English section first, followed by '---' and the Roman Urdu section).`;

    // Call API
    const apiUrl = process.env.GROQ_API_URL || "https://api.groq.com/openai/v1/chat/completions";
    const apiKey = process.env.GROQ_API_KEY;
    const models = [process.env.GROQ_MODEL || "llama-3.3-70b-versatile", "llama-3.3-70b-versatile", "llama-3.1-70b-versatile"];

    if (apiKey) {
      for (const model of [...new Set(models)]) {
        for (let attempt = 1; attempt <= 2; attempt++) {
          try {
            const resp = await axios.post(
              apiUrl,
              {
                model,
                messages: [{ role: "system", content: systemPrompt }, ...messages],
                temperature: 0.35,
                max_tokens: 2048,
              },
              { headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" }, timeout: 25000 }
            );

            let raw = resp.data.choices?.[0]?.message?.content;
            let reply = aggressiveClean(raw);

            if (reply && reply.length > 15) {
              console.log(`[DR MAX] OK: ${model}`);
              return res.json({ success: true, reply, modelUsed: model });
            }
          } catch (err) {
            console.warn(`[DR MAX] ${model} fail: ${err.response?.status || err.code}`);
            if (attempt === 1 && (err.response?.status === 429 || err.code === "ECONNABORTED")) {
              await new Promise(r => setTimeout(r, 1200));
            } else break;
          }
        }
      }
    }

    // Fallback
    console.log("[DR MAX] Fallback activated");
    const backup = getClinicalBackup(lastUserMessage, horseInfo, diseaseContext);
    return res.json({ success: true, reply: backup, fallbackEngine: true });

  } catch (error) {
    console.error("[DR MAX] Fatal:", error.message);
    const last = req.body?.messages?.filter?.((m) => m.role === "user")?.pop()?.content || "";
    return res.json({ success: true, reply: getClinicalBackup(last, req.body?.horseInfo, req.body?.diseaseContext), fallbackEngine: true });
  }
};

// ===================================================
// CHECK HEALTH (Analyze Health button)
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