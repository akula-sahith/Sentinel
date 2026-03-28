// routes/analysisRoutes.js

const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const { getDashboard } = require("../controllers/dashboardController");

// 🚀 Analyze Business (AI Inference)
router.post("/analyze", authMiddleware, getDashboard);

module.exports = router;