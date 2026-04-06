const axios = require("axios");

/**
 * -----------------------------
 * SAFE JSON PARSER
 * -----------------------------
 */
function safeParse(text) {
  try {
    return JSON.parse(text);
  } catch (e) {
    const match = text.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch {}
    }
    return {};
  }
}

/**
 * -----------------------------
 * GLOBAL SANITIZER
 * Ensures ALL "name" fields are strings
 * -----------------------------
 */
function sanitizeNameFields(obj) {
  if (Array.isArray(obj)) return obj.map(sanitizeNameFields);

  if (obj && typeof obj === "object") {
    const sanitized = {};

    for (const [key, value] of Object.entries(obj)) {
      if (key === "name") {
        if (typeof value === "object" && value !== null) {
          sanitized[key] = String(value.name || "Unknown");
        } else {
          sanitized[key] = String(value || "Unknown");
        }
      } else {
        sanitized[key] = sanitizeNameFields(value);
      }
    }

    return sanitized;
  }

  return obj;
}

/**
 * -----------------------------
 * MAP TO MONGOOSE SCHEMA
 * (🔥 CRITICAL FIX HERE)
 * -----------------------------
 */
function mapToBusinessSchema(raw) {
  return {
    // --- profile ---
    profile: {
      industry: raw.industry || raw.profile?.industry || "Manufacturing",
      subIndustry: raw.subIndustry || raw.profile?.subIndustry,
      location: {
        country: raw.location?.country || raw.profile?.location?.country,
        state: raw.location?.state || raw.profile?.location?.state,
        city: raw.location?.city || raw.profile?.location?.city,
      },
      scale: raw.scale || raw.profile?.scale,
    },

    description: raw.description || "",

    // --- financials ---
    financials: {
      cashReserve: raw.financials?.cashReserve || 0,
      monthlyRevenue: raw.financials?.monthlyRevenue || 0,
      monthlyExpenses: raw.financials?.monthlyExpenses || 0,
    },

    // --- operations ---
    operations: {
      employees: raw.operations?.employees || 0,
      avgSalary: raw.operations?.avgSalary || 0,
    },

    // --- supplyChain ---
    supplyChain: {
      importDependency: raw.supplyChain?.importDependency || 0,
      rawMaterials: (raw.supplyChain?.rawMaterials || []).map((m) => ({
        name: String(m.name || "unknown").toLowerCase().trim(),
        dependencyPercentage:
          m.dependencyPercentage ??
          m.dependencyPercent ??
          m.percentage ??
          0,
      })),
    },

    // --- logistics ---
    logistics: {
      transportMode: raw.logistics?.transportMode || [],
      monthlyTransportCost: raw.logistics?.monthlyTransportCost || 0,
    },

    // --- products (🔥 FIXED HARD)
    products: (raw.products || []).map((p) => {
      let productName =
        typeof p.name === "object"
          ? String(p.name?.name || "Unknown")
          : String(p.name || "Unknown");

      return {
        name: productName, // ✅ ALWAYS STRING
        category: p.category || "General",
        price: Number(p.price) || 0,
        costPrice: Number(p.costPrice) || 0,
        monthlySalesVolume: Number(p.monthlySalesVolume) || 0,

        rawMaterialLinks: (
          p.rawMaterialLinks || p.rawMaterialUsage || []
        ).map((r) => ({
          materialName: String(
            r.materialName || r.name || "unknown"
          )
            .toLowerCase()
            .trim(),
          usagePercentage: r.usagePercentage ?? r.percentage ?? 0,
        })),
      };
    }),

    // --- riskProfile ---
    riskProfile: {
      inventoryDays: raw.riskProfile?.inventoryDays || 0,
      alternativeSuppliers: raw.riskProfile?.alternativeSuppliers || 0,
    },

    // --- tags ---
    tags: raw.tags || [],
  };
}

/**
 * -----------------------------
 * MAIN FUNCTION
 * -----------------------------
 */
async function convertToBusiness(text) {
  const prompt = `Extract structured business data from the following text.
Return ONLY valid JSON. No explanation.

CRITICAL RULES:
- Every "name" field MUST be a plain string
- NEVER return object inside "name"
- Use exact field names:
  dependencyPercentage, rawMaterialLinks, materialName, usagePercentage

Text:
${text}

Return:
{
  "industry": "Manufacturing",
  "description": "string",
  "location": { "country": "string", "state": "string", "city": "string" },
  "supplyChain": {
    "rawMaterials": [
      { "name": "coal", "dependencyPercentage": 40 }
    ]
  },
  "products": [
    {
      "name": "Steel Rod",
      "price": 60000,
      "costPrice": 45000,
      "monthlySalesVolume": 200,
      "rawMaterialLinks": [
        { "materialName": "coal", "usagePercentage": 40 }
      ]
    }
  ]
}`;

  const res = await axios.post(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      model: "openai/gpt-oss-120b",
      messages: [
        {
          role: "system",
          content:
            'You are a strict JSON generator. NEVER return object inside "name".',
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.0,
      response_format: { type: "json_object" },
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  const raw = safeParse(res.data.choices[0].message.content);

  // 🔥 STEP 1: sanitize
  const sanitized = sanitizeNameFields(raw);

  // 🔥 STEP 2: map
  const mapped = mapToBusinessSchema(sanitized);

  // 🔥 STEP 3: DEBUG (VERY IMPORTANT)
  console.log("✅ FINAL PRODUCTS:");
  console.log(JSON.stringify(mapped.products, null, 2));

  return mapped;
}

module.exports = { convertToBusiness };