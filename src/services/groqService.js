const axios = require("axios");

function safeParse(text) {
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
    return { raw: text };
  }
}

async function analyzeWithLLM(data) {
  try {
    const { business, news, weather } = data;

    const rawMaterials = business.supplyChain.rawMaterials
      .map(m => m.name)
      .join(", ");

   const prompt = `
### ROLE
You are a Strategic Risk Engine. You provide discrete decision variables (0 or 1) for a Quadratic Unconstrained Binary Optimization (QUBO) solver.

### CONTEXT
- Industry: ${business.profile.industry}
- Location: ${business.profile.location.city}
- Critical Materials: ${rawMaterials}
- External Threats: ${news.map(n => n.title).join(" | ")} & ${weather.map(w => w.event).join(" | ")}

### TASK: CANDIDATE GENERATION
Generate exactly 3 discrete, weighted options for each category. Each must have a 'cost_weight' (1-10) and an 'impact_score' (1-10).

1. **Price Strategy Candidates:** Provide 3 distinct pricing maneuvers (e.g., Dynamic Surcharge, Value-based Premium, or Defensive Discounting).
2. **Product & Production:** Options for volume adjustment or SKU rationalization.
3. **Logistics:** Options for rerouting, mode-switching, or inventory buffering.
4. **Raw Materials:** Options for alternative sourcing, pre-purchasing, or material substitution.
5. **Specific-General:** Broad organizational moves (Workforce shifts, OpEx freezes, or Facility contingencies).

### OUTPUT JSON FORMAT (STRICT)
{
  "riskLevel": "Low | Medium | High",
  
  "priceStrategy": [
    { "id": "PR1", "strategyType": "e.g. Dynamic Surcharge", "action": "string", "cost": 1-10, "impact": 1-10, "logic": "string" },
    { "id": "PR2", "strategyType": "e.g. Value-Based", "action": "string", "cost": 1-10, "impact": 1-10, "logic": "string" },
    { "id": "PR3", "strategyType": "e.g. Penetration/Defensive", "action": "string", "cost": 1-10, "impact": 1-10, "logic": "string" }
  ],

  "productStrategy": [
    { "id": "P1", "action": "string", "cost": 1-10, "impact": 1-10 },
    { "id": "P2", "action": "string", "cost": 1-10, "impact": 1-10 },
    { "id": "P3", "action": "string", "cost": 1-10, "impact": 1-10 }
  ],

  "logisticsStrategy": [
    { "id": "L1", "action": "string", "cost": 1-10, "impact": 1-10 },
    { "id": "L2", "action": "string", "cost": 1-10, "impact": 1-10 },
    { "id": "L3", "action": "string", "cost": 1-10, "impact": 1-10 }
  ],

  "rawMaterialStrategy": [
    { "id": "M1", "material": "string", "action": "string", "cost": 1-10, "impact": 1-10 },
    { "id": "M2", "material": "string", "action": "string", "cost": 1-10, "impact": 1-10 },
    { "id": "M3", "material": "string", "action": "string", "cost": 1-10, "impact": 1-10 }
  ],

  "generalStrategicSuggestions": [
    { "id": "G1", "category": "Workforce", "action": "string", "cost": 1-10, "impact": 1-10, "penalty": 1-10 },
    { "id": "G2", "category": "Financial", "action": "string", "cost": 1-10, "impact": 1-10, "penalty": 1-10 },
    { "id": "G3", "category": "Operations", "action": "string", "cost": 1-10, "impact": 1-10, "penalty": 1-10 }
  ]
}
`;
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "openai/gpt-oss-120b",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`
        }
      }
    );

    const text = response.data.choices[0].message.content;

    const parsed = safeParse(text);

    // 🔮 OPTIONAL "QUANTUM TOUCH"
    if (parsed.suggestions) {
      parsed.suggestions = parsed.suggestions.map(
        s => s + " (Optimized)"
      );
    }

    return parsed;

  } catch (error) {
    console.error("Groq Error:", error.message);

    return {
      impacts: [],
      riskLevel: "Unknown",
      rawMaterialImpact: [],
      productStrategy: {},
      logisticsStrategy: {},
      suggestions: ["System error"]
    };
  }
}

module.exports = { analyzeWithLLM };