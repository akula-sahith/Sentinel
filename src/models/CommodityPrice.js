// models/CommodityPrice.js

const mongoose = require("mongoose");

const commodityPriceSchema = new mongoose.Schema({

  // 🔑 Identity
  commodity: {
    type: String, // "Crude Oil", "Wheat"
    required: true
  },

  category: {
    type: String, // "Energy", "Food", "Manufacturing"
    required: true
  },

  // 💰 Pricing
  price: {
    type: Number,
    required: true
  },

  unit: {
    type: String, // "USD/barrel", "USD/ton"
    default: "USD"
  },


  // ⏱️ Time
  timestamp: {
    type: Date,
    default: Date.now
  },

  // 🔄 Source (mock / api)
  source: {
    type: String,
    default: "mock_data"
  }

}, { timestamps: true });

module.exports = mongoose.model("CommodityPrice", commodityPriceSchema);