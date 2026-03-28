// routes/businessRoutes.js

const express = require("express");
const router = express.Router();

const {
  createBusiness,
  getMyBusinesses,
  getBusinessById,
  updateBusiness,
  deleteBusiness
} = require("../controllers/businessController");

// 🔐 Assume middleware sets req.userId
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, createBusiness);
router.get("/", authMiddleware, getMyBusinesses);
router.get("/:id", authMiddleware, getBusinessById);
router.put("/:id", authMiddleware, updateBusiness);
router.delete("/:id", authMiddleware, deleteBusiness);

module.exports = router;