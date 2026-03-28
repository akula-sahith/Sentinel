const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firebaseUid: {
    type: String,
    required: true,
    unique: true
  },

  name: {
    type: String,
    default: "User"
  },

  email: {
    type: String,
    required: true
  },

  phone: {
    type: String,
    default: null   // 🔥 IMPORTANT FIX
  }

}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);