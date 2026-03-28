const axios = require("axios");

/**
 * Build prompt for LLM
 */
function buildPrompt(events, business) {
  return `
You are a business risk intelligence AI.

Business:
Industry: ${business.profile.industry}
Description: ${business.description}

Events:
${events.map((e, i) => `${i + 1}. ${e.text}`).join("\n")}

Give output in JSON:
{
  "impact": "...",
  "riskLevel": "...",
  "recommendedActions": ["...", "..."]
}
`;
}

/**
 * Call Groq LLM (FAST ⚡)
 */
async function callLLM(events, business) {
  try {
    const prompt = buildPrompt(events, business);

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama3-8b-8192",
        messages: [
          { role: "user", content: prompt }
        ],
        temperature: 0.3
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const output = response.data.choices[0].message.content;

    return safeJSONParse(output);

  } catch (err) {
    console.error("LLM Error:", err.message);
    return { error: "LLM failed" };
  }
}

/**
 * 🔥 Handle messy JSON from LLM
 */
function safeJSONParse(text) {
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch {}
    }
    return { raw: text };
  }
}

module.exports = { callLLM };