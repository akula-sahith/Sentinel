const Business = require("../models/Business");
const User = require("../models/User");
const RawNews = require("../models/RawNews");
const RawWeather = require("../models/RawWeather");
const { analyzeWithLLM } = require("../services/groqService");
const { optimizeAllStrategies } = require("../services/quantumService");
exports.getDashboard = async (req, res) => {
  try {
    // 🔥 1. Get Firebase UID
    const firebaseUid = req.firebaseUid;

    // 🔥 2. Find User
    const user = await User.findOne({ firebaseUid });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // 🔥 3. Find Business using user._id
    const business = await Business.findOne({
      createdBy: user._id
    }).lean();

    if (!business) {
      return res.status(404).json({ error: "Business not found" });
    }

    const industry = business.profile.industry;

    // 🔥 4. Fetch Events
    const news = await RawNews.find({ industry }).lean();
    const weather = await RawWeather.find({ category: industry }).lean();

    // 🔥 5. AI Analysis
    const analysis = await analyzeWithLLM({
      business,
      news,
      weather
    });

    const optimized = await optimizeAllStrategies(analysis);

    // 🔥 6. Response
    res.json({
      success: true,
      user,
      business,
      events: { news, weather },
      analysis,
      optimizedStrategies: optimized
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Dashboard failed" });
  }
};