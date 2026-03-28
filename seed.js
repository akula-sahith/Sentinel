require('dotenv').config();
const mongoose = require('mongoose');
const RawNews = require('./src/models/CommodityPrice');

const data = require('./data/cp.json'); // your file

const importData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const formatted = data.map(item => ({
      ...item,
      // externalId: `news_${Date.now()}_${Math.floor(Math.random()*1000)}`
    }));

    await RawNews.insertMany(formatted);

    console.log(`✅ ${formatted.length} News Inserted`);
    process.exit();

  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

importData();