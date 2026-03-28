const ollama = require("ollama").default;

/**
 * Splits large arrays into chunks for processing
 */
const chunkArray = (arr, size) => {
  if (!Array.isArray(arr) || size <= 0) return [];
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
};

/**
 * Parses JSON even if the LLM wraps it in markdown or text
 */
const extractJSON = (text) => {
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch (e) {
        return null;
      }
    }
    return null;
  }
};

/**
 * Builds the text prompt for the LLM
 */
const buildPrompt = (context, eventChunk) => {
  return `
You are an advanced Business Risk Intelligence AI.

⚠️ IMPORTANT:
- Return ONLY valid JSON
- Do NOT include explanations, text, or markdown
- Ensure JSON is syntactically correct

Business Profile:
${JSON.stringify(context)}

Events:
${JSON.stringify(eventChunk)}

Return STRICT JSON ONLY:
{
  "relevantEvents": [
    {
      "event": "...",
      "reason": "...",
      "impactLevel": "low | medium | high"
    }
  ]
}
`;
};

/**
 * MAIN INFERENCE FUNCTION
 */
const runInference = async (context, events) => {
  // Guard against empty input
  if (!events || typeof events !== 'object' || Object.keys(events).length === 0) {
    return { totalRelevantEvents: 0, relevantEvents: [] };
  }

  try {
    let allResults = [];
    const categories = Object.keys(events);

    for (const category of categories) {
      const data = Array.isArray(events[category]) ? events[category] : [];
      if (data.length === 0) continue;

      const chunks = chunkArray(data, 8);

      for (const chunk of chunks) {
        const promptText = buildPrompt(context, { [category]: chunk });

        try {
          // Using the official ollama library's chat method
          const response = await ollama.chat({
            model: "gemma", // Ensure this matches your downloaded model
            messages: [{ role: "user", content: promptText }],
            stream: false,
            options: {
              temperature: 0.1,
              num_predict: 1200,
            }
          });

          if (response && response.message && response.message.content) {
            const parsed = extractJSON(response.message.content);
            if (parsed && Array.isArray(parsed.relevantEvents)) {
              allResults.push(...parsed.relevantEvents);
            }
          }
        } catch (chunkError) {
          console.error(`Ollama Error in ${category} chunk:`, chunkError.message);
        }
      }
    }

    // Deduplication logic
    const unique = [];
    const seen = new Set();

    for (const ev of allResults) {
      if (!ev || !ev.event) continue;
      const key = ev.event.toLowerCase().trim();
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(ev);
      }
    }

    return {
      totalRelevantEvents: unique.length,
      relevantEvents: unique,
    };

  } catch (error) {
    console.error("Critical Inference Error:", error.message);
    return {
      totalRelevantEvents: 0,
      relevantEvents: [],
    };
  }
};

module.exports = { runInference };