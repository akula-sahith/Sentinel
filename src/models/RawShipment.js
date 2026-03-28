const mongoose = require('mongoose');

const rawShipmentSchema = new mongoose.Schema({
  commodity: String,
  category: String, // Food, Energy, Metals, etc.

  originCountry: String,
  originPort: String,

  destinationCountry: String,
  destinationPort: String,

  status: String, // scheduled, loading, in_transit, delivered

  departureTime: Date,
  eta: Date,

  route: [String],

  quantity: Number,
  unit: String,

  seller: String,
  buyer: String,

  source: String
}, { timestamps: true });

module.exports = mongoose.model('RawShipment', rawShipmentSchema);