const ollama = require("ollama").default;

async function testConnection() {
  console.log("🚀 Starting Ollama Connection Test...");

  try {
    // 1. Check if the model is available
    const models = await ollama.list();
    const hasGemma = models.models.some(m => m.name.includes("gemma"));
    
    if (!hasGemma) {
      console.warn("⚠️  Warning: 'gemma' model not found in your local list.");
      console.log("Current models:", models.models.map(m => m.name).join(", "));
    }

    // 2. Run a simple chat completion
    console.log("📡 Sending test message to 'gemma'...");
    
    const response = await ollama.chat({
      model: "gemma",
      messages: [{ role: "user", content: "Say 'Ollama is online' if you can hear me." }],
      stream: false,
    });

    // 3. Output results
    console.log("✅ Success! Response from LLM:");
    console.log("---------------------------------");
    console.log(response.message.content);
    console.log("---------------------------------");

  } catch (error) {
    console.error("❌ Test Failed!");
    if (error.code === 'ECONNREFUSED') {
      console.error("Error: Could not connect to Ollama. Is the Ollama app running?");
    } else {
      console.error("Error Details:", error.message);
    }
  }
}

testConnection();