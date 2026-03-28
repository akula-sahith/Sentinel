const RawNews = require("../models/RawNews");
const RawWeather = require("../models/RawWeather");
const RawSupply = require("../models/RawSupply");
const RawShipment = require("../models/RawShipment");
const CommodityPrice = require("../models/CommodityPrice");

const {
  normalizeNews,
  normalizeWeather,
  normalizeSupply,
  normalizeShipment,
  normalizePrice
} = require("./normalizeService");

/**
 * Fetch all event sources in parallel
 */
async function fetchAllEvents(business) {
  const tags = business.tags || [];

  const query = {
    tags: { $in: tags }
  };

  const [
    news,
    weather,
    supply,
    shipment,
    prices
  ] = await Promise.all([
    RawNews.find(query).lean().limit(50),
    RawWeather.find(query).lean().limit(50),
    RawSupply.find(query).lean().limit(50),
    RawShipment.find(query).lean().limit(50),
    CommodityPrice.find(query).lean().limit(50)
  ]);

  return [
    ...normalizeNews(news),
    ...normalizeWeather(weather),
    ...normalizeSupply(supply),
    ...normalizeShipment(shipment),
    ...normalizePrice(prices)
  ];
}

module.exports = { fetchAllEvents };