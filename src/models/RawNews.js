const mongoose = require('mongoose');

const rawNewsSchema = new mongoose.Schema({
  externalId: String,
  title: String,
  description: String,
  category: String,
  source: String,
}, { timestamps: true });

module.exports = mongoose.model('RawNews', rawNewsSchema);