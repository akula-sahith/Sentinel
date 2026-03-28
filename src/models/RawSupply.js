const mongoose = require('mongoose');

const rawSupplySchema = new mongoose.Schema({
  commodity: String,
  category: String, // Food | Energy | Manufacturing
  region: String,

  production: Number,
  imports: Number,
  exports: Number,
  domesticConsumption: Number,
  endingStock: Number,

  timestamp: Date,

  source: String
}, { timestamps: true });

module.exports = mongoose.model('RawSupply', rawSupplySchema);