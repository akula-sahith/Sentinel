const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");
const authMiddleware = require("../middleware/authMiddleware");

const { uploadPDF } = require("../controllers/pdfController");

router.post("/", authMiddleware, upload.single("file"), uploadPDF);

module.exports = router;