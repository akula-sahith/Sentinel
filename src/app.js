const express = require('express');
const cors = require('cors');
const pdfRoutes = require("./routes/pdfRoutes");
const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/news', require('./routes/newsRoutes'));
app.use('/api/user',require('./routes/userRoutes'));
app.use('/api/business',require('./routes/businessRoutes'));
app.use('/api/businessAnalysis',require('./routes/analysisRoutes'));
app.use("/api/pdf", pdfRoutes);

module.exports = app;