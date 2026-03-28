const mongoose = require('mongoose');

const rawNewsSchema = new mongoose.Schema({
  externalId: String,
  title: String,
  description: String,

  category: {
    type: String,
    enum: ["Financial", "Geopolitical", "SupplyChain", "NaturalDisaster"]
  },

  industry: {
    type: String,
    enum: ["Food", "Manufacturing"]
  },

  source: String,

}, { timestamps: true });

module.exports = mongoose.model('RawNews', rawNewsSchema);