const axios = require('axios');

const BASE_URL = process.env.TEST_API_URL || 'http://localhost:5001';

async function runDrMaxTests() {
  console.log("==================================================");
  console.log("🐎 STARTING DR. MAX AI VERIFICATION TESTS");
  console.log(`Target Server: ${BASE_URL}`);
  console.log("==================================================\n");

  const singleTests = [
    {
      id: "TEST 1",
      question: "How are you?",
      expectedCheck: (r) => !r.includes("Key Equine Guidelines") && r.length > 5,
      description: "Natural conversational greeting"
    },
    {
      id: "TEST 2",
      question: "What is the normal temperature of a horse?",
      expectedCheck: (r) => (r.includes("99") || r.includes("101") || r.includes("temperature") || r.includes("37")) && !r.includes("Key Equine Guidelines"),
      description: "Equine TPR normal temperature"
    },
    {
      id: "TEST 3",
      question: "What should I feed my horse?",
      expectedCheck: (r) => (r.toLowerCase().includes("forage") || r.toLowerCase().includes("hay") || r.toLowerCase().includes("grass") || r.toLowerCase().includes("feed")) && !r.includes("Key Equine Guidelines"),
      description: "Equine nutrition and feeding"
    },
    {
      id: "TEST 4",
      question: "My horse has diarrhea.",
      expectedCheck: (r) => (r.toLowerCase().includes("diarrhea") || r.toLowerCase().includes("hydration") || r.toLowerCase().includes("vet")) && !r.includes("Key Equine Guidelines"),
      description: "Equine symptom and veterinary guidance"
    },
    {
      id: "TEST 5",
      question: "What is the capital of Pakistan?",
      expectedCheck: (r) => r.toLowerCase().includes("islamabad") && !r.includes("Key Equine Guidelines"),
      description: "General knowledge question (Islamabad)"
    }
  ];

  let passed = 0;
  let failed = 0;

  for (const t of singleTests) {
    try {
      const start = Date.now();
      // Test both endpoints (/api/vet/chat and /api/chat)
      const endpoint = t.id === "TEST 5" ? `${BASE_URL}/api/chat` : `${BASE_URL}/api/vet/chat`;
      const res = await axios.post(endpoint, {
        message: t.question,
        messages: [{ role: "user", content: t.question }]
      }, { timeout: 35000 });

      const duration = ((Date.now() - start) / 1000).toFixed(2);
      const reply = res.data?.reply || "";
      const isOk = t.expectedCheck(reply);

      console.log(`[${t.id}] "${t.question}" (${t.description})`);
      console.log(`Endpoint: ${endpoint} | Provider: ${res.data.provider || "N/A"} (${res.data.model || "N/A"}) | Time: ${duration}s`);
      console.log(`Response Snippet:\n"${reply.slice(0, 180).trim()}..."`);

      if (isOk) {
        console.log(`Result: ✅ PASS\n`);
        passed++;
      } else {
        console.log(`Result: ❌ FAIL (Output did not match expected criteria or contained static template)\n`);
        failed++;
      }
      console.log("-".repeat(60));
    } catch (err) {
      console.error(`[${t.id}] ❌ ERROR:`, err.response?.data || err.message);
      failed++;
      console.log("-".repeat(60));
    }
  }

  // TEST 6: Multi-turn Conversation Memory Test
  console.log("\n[TEST 6: Multi-Turn Conversation Memory]");
  console.log("Turn 1: 'My horse has a fever.'");
  console.log("Turn 2: 'It is 103°F.' (Expected: AI connects 'It' to the fever/temperature)\n");

  try {
    const history = [
      { role: "user", content: "My horse has a fever." },
      { role: "assistant", content: "What is your horse's current temperature, and are you noticing any other symptoms such as sweating, lethargy, or nasal discharge?" },
      { role: "user", content: "It is 103°F and he is not eating." }
    ];

    const res2 = await axios.post(`${BASE_URL}/api/chat`, {
      message: "It is 103°F and he is not eating.",
      conversation: history
    }, { timeout: 35000 });

    const reply2 = res2.data?.reply || "";
    console.log(`Turn 2 Provider: ${res2.data.provider} (${res2.data.model})`);
    console.log(`Turn 2 Response Snippet:\n"${reply2.slice(0, 220).trim()}..."\n`);

    const hasContextUnderstanding = (reply2.includes("103") || reply2.toLowerCase().includes("fever") || reply2.toLowerCase().includes("high") || reply2.toLowerCase().includes("vet")) && !reply2.includes("Key Equine Guidelines");

    if (hasContextUnderstanding) {
      console.log(`Result: ✅ PASS (Conversation context successfully understood!)\n`);
      passed++;
    } else {
      console.log(`Result: ❌ FAIL (Context not reflected in response)\n`);
      failed++;
    }
  } catch (err) {
    console.error("[TEST 6] ❌ ERROR:", err.response?.data || err.message);
    failed++;
  }

  console.log("==================================================");
  console.log(`SUMMARY: ${passed} PASSED, ${failed} FAILED (Total: ${passed + failed})`);
  console.log("==================================================");

  if (failed > 0) process.exit(1);
}

runDrMaxTests();
