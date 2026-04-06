const { extractText } = require("../services/pdfService");
const { convertToBusiness } = require("../services/pdfToBusinessService");

const Business = require("../models/Business");
const User = require("../models/User");

exports.uploadPDF = async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // 🔥 1. Extract text
    const text = await extractText(file.buffer);

    // 🔥 2. Convert using LLM
    const data = await convertToBusiness(text);

    // 🔥 3. Get user
    const user = await User.findOne({
      firebaseUid: req.firebaseUid
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // 🔥 4. Save business
    const business = new Business({
      createdBy: user._id,

      profile: {
        industry: data.industry || "Food",
        location: data.location || { city: "Unknown" }
      },

      description: data.description || "Auto extracted business",

      supplyChain: {
        rawMaterials: (data.rawMaterials || []).map(name => ({
          name,
          dependencyPercentage: 20
        }))
      },

      products: (data.products || []).map(name => ({
        name,
        price: 100,
        costPrice: 60
      }))
    });

    await business.save();

    res.json({
      success: true,
      message: "Business created from PDF",
      business
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "PDF processing failed" });
  }
};