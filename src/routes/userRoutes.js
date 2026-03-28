// routes/userRoutes.js

const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { createOrGetUser } = require("../controllers/userController");

// Firebase login sync
router.post("/sync", authMiddleware, createOrGetUser);

module.exports = router;