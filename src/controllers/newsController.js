const RawNews = require('../models/RawNews');

const addNews = async (req, res) => {
  try {
    // 🔥 Generate externalId
    const externalId = `news_${Date.now()}`;

    const newsData = {
      ...req.body,
      externalId
    };

    const news = await RawNews.create(newsData);

    res.status(201).json(news);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getNews = async (req, res) => {
  try {
    const news = await RawNews.find().sort({ createdAt: -1 });
    res.json(news);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { addNews, getNews };