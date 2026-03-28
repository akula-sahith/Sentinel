const News = require("../models/News");
const Weather = require("../models/Weather");
const Supply = require("../models/Supply");
const Shipment = require("../models/Shipment");

async function fetchAllSources(materials) {
  const query = {
    tags: { $in: materials }
  };

  const [news, weather, supply, shipment] = await Promise.all([
    News.find(query).select("content metadata").lean().limit(200),
    Weather.find(query).select("content metadata").lean().limit(200),
    Supply.find(query).select("content metadata").lean().limit(200),
    Shipment.find(query).select("content metadata").lean().limit(200)
  ]);

  return [...news, ...weather, ...supply, ...shipment];
}

module.exports = { fetchAllSources };