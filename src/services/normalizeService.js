function normalizeNews(news) {
  return news.map(n => ({
    id: n._id,
    type: "news",
    content: `${n.title} ${n.description}`,
    tags: n.tags || [],
    raw: n
  }));
}

function normalizeWeather(weather) {
  return weather.map(w => ({
    id: w._id,
    type: "weather",
    content: `${w.event} in ${w.location} (${w.severity})`,
    tags: w.tags || [],
    raw: w
  }));
}

function normalizeSupply(supply) {
  return supply.map(s => ({
    id: s._id,
    type: "supply",
    content: `${s.commodity} supply in ${s.region}`,
    tags: s.tags || [],
    raw: s
  }));
}

function normalizeShipment(shipment) {
  return shipment.map(s => ({
    id: s._id,
    type: "shipment",
    content: `${s.commodity} shipment from ${s.originPort} to ${s.destinationPort}`,
    tags: s.tags || [],
    raw: s
  }));
}

function normalizePrice(price) {
  return price.map(p => ({
    id: p._id,
    type: "price",
    content: `${p.commodity} price is ${p.price}`,
    tags: p.tags || [],
    raw: p
  }));
}

module.exports = {
  normalizeNews,
  normalizeWeather,
  normalizeSupply,
  normalizeShipment,
  normalizePrice
};