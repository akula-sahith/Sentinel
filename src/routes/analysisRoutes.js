// routes/analysisRoutes.js

const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const { analyzeBusiness } = require("../controllers/analysisController");

// 🚀 Analyze Business (AI Inference)
router.post("/analyze", authMiddleware, analyzeBusiness);

module.exports = router;