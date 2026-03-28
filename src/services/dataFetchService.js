const RawNews = require("../models/RawNews");
const RawWeather = require("../models/RawWeather");
const RawSupply = require("../models/RawSupply");
const RawShipment = require("../models/RawShipment");

/**
 * Extract tags from business
 */
function extractTags(business) {
  return business.tags || [];
}

/**
 * Normalize data into common format
 */
function normalize(type, data) {
  return data.map(item => ({
    id: item._id,
    type,
    content: item.content || item.title || JSON.stringify(item),
    metadata: item,
    tags: item.tags || []
  }));
}

/**
 * Fetch from all sources (PARALLEL ⚡)
 */
async function fetchRelevantEvents(business) {
  const tags = extractTags(business);

  const query = {
    tags: { $in: tags }
  };

  const [news, weather, supply, shipment] = await Promise.all([
    RawNews.find(query).lean().limit(100),
    RawWeather.find(query).lean().limit(100),
    RawSupply.find(query).lean().limit(100),
    RawShipment.find(query).lean().limit(100)
  ]);

  // 🔥 Normalize all into same structure
  const allEvents = [
    ...normalize("news", news),
    ...normalize("weather", weather),
    ...normalize("supply", supply),
    ...normalize("shipment", shipment)
  ];

  return allEvents;
}

module.exports = { fetchRelevantEvents };