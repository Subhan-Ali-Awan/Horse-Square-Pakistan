const axios = require('axios');

const questions = [
  "What is React?",
  "What is logistic regression?",
  "Write a Python program to sort numbers.",
  "What is MongoDB?",
  "My horse is refusing feed.",
  "What causes heavy sweating in horses?",
  "What is anuria in horses?",
  "Explain machine learning in simple words.",
  "Tell me about horse breeding."
];

async function runTests() {
  console.log("Starting Dr. Max AI Verification Tests...\n");
  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    try {
      const start = Date.now();
      const res = await axios.post("http://localhost:5000/api/vet/chat", {
        messages: [{ role: "user", content: q }]
      }, { timeout: 30000 });

      const duration = ((Date.now() - start) / 1000).toFixed(2);
      console.log(`[TEST ${i + 1}] Question: "${q}"`);
      console.log(`Provider: ${res.data.provider} | Model: ${res.data.model} | Latency: ${duration}s`);
      console.log(`Response Snippet:\n${res.data.reply.slice(0, 180)}...\n`);
      console.log("-".repeat(60));
    } catch (err) {
      console.error(`[TEST ${i + 1}] FAILED: "${q}" ->`, err.response?.data || err.message);
    }
  }

  // Follow-up test
  console.log("\n[TEST 10: Follow-up Test]");
  try {
    const history = [
      { role: "user", content: "What is React?" },
      { role: "assistant", content: "React is a popular JavaScript library for building user interfaces..." },
      { role: "user", content: "What are its main advantages?" }
    ];
    const res2 = await axios.post("http://localhost:5000/api/vet/chat", {
      messages: history
    }, { timeout: 30000 });
    console.log(`Follow-up Question: "What are its main advantages?"`);
    console.log(`Provider: ${res2.data.provider} | Model: ${res2.data.model}`);
    console.log(`Response Snippet:\n${res2.data.reply.slice(0, 200)}...\n`);
  } catch (err) {
    console.error("[TEST 10] FAILED ->", err.response?.data || err.message);
  }
}

runTests();
