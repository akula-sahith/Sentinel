const mongoose = require('mongoose');

const rawWeatherSchema = new mongoose.Schema({
  location: String,
  category: String, // Food, Energy, Manufacturing

  event: String, // rainfall, cyclone, heatwave, flood
  severity: String, // low, medium, high

  startDate: Date,
  endDate: Date,

  affectedArea: String,

  source: String
}, { timestamps: true });

module.exports = mongoose.model('RawWeather', rawWeatherSchema);