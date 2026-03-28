// controllers/analysisController.js

const Business = require("../models/Business");
const RawNews = require("../models/RawNews");
const RawShipment = require("../models/RawShipment");
const RawSupply = require("../models/RawSupply");
const RawWeather = require("../models/RawWeather");
const CommodityPrice = require("../models/CommodityPrice");
const User = require("../models/User");
const { runInference } = require("../services/inferenceService");

// 🔥 Fetch ALL events (no filtering)
const getAllEventsFromDB = async () => {
  try {
    const [news, shipments, supply, weather, prices] = await Promise.all([
      RawNews.find().limit(10),
      RawShipment.find().limit(10),
      RawSupply.find().limit(10),
      RawWeather.find().limit(10),
      CommodityPrice.find().limit(10)
    ]);

    return {
      news,
      shipments,
      supply,
      weather,
      prices
    };

  } catch (error) {
    console.error("DB Fetch Error:", error.message);
    return {
      news: [],
      shipments: [],
      supply: [],
      weather: [],
      prices: []
    };
  }
};

// 🧠 Extract Business Context
const extractBusinessContext = (business) => {
  return {
    industry: business.profile.industry,
    subIndustry: business.profile.subIndustry,
    location: business.profile.location,

    rawMaterials:
      business.supplyChain?.rawMaterials?.map(r => r.name) || [],

    dependencies:
      business.logistics?.transportMode || [],

    products:
      business.products?.map(p => p.name) || [],

    financials: business.financials,
    riskProfile: business.riskProfile,

    description: business.description
  };
};

// 🚀 MAIN ANALYSIS
exports.analyzeBusiness = async (req, res) => {
  try {
    const { businessId } = req.body;
    const user = await User.findOne({ firebaseUid: req.firebaseUid });
    if (!businessId) {
      return res.status(400).json({
        success: false,
        message: "Business ID is required"
      });
    }

    // 🔐 SECURE FETCH (no extra user query needed)
    const business = await Business.findOne({
  _id: businessId,
  createdBy: user._id
});
    if (!business) {
      return res.status(404).json({
        success: false,
        message: "Business not found or unauthorized"
      });
    }

    // 📦 Fetch ALL events
    const events = await getAllEventsFromDB();

    // 🧠 Extract context
    const context = extractBusinessContext(business);

    // ⚡ Run inference (Ollama)
    const inferenceResult = await runInference(context, events);

    res.status(200).json({
      success: true,
      businessId,
      totalEventsProcessed:
        events.news.length +
        events.shipments.length +
        events.supply.length +
        events.weather.length +
        events.prices.length,
      inference: inferenceResult
    });

  } catch (error) {
    console.error("Analysis Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Analysis failed"
    });
  }
};