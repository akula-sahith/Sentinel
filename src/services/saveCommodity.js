// services/saveCommodity.js
const RawPrice = require("../models/RawPrice");

const mapSymbolToName = (symbol) => {
  switch (symbol) {
    case "XAU": return "Gold";
    case "WTIOIL-FUT": return "Crude Oil WTI";
    case "BRENTOIL-FUT": return "Crude Oil Brent";
    case "NG-FUT": return "Natural Gas";
    default: return symbol;
  }
};

const mapCategory = (symbol) => {
  if (symbol.includes("OIL") || symbol.includes("NG")) return "Energy";
  if (symbol === "XAU") return "Metals";
  return "Other";
};

const savePricesForBusiness = async (data, businessId) => {
  if (!data || !data.rates) return;

  const rates = data.rates;
  const metadata = data.metadata;

  for (let symbol in rates) {
    await RawPrice.create({
      businessId, // 🔥 KEY ADDITION
      commodity: mapSymbolToName(symbol),
      category: mapCategory(symbol),
      price: rates[symbol],
      unit: metadata[symbol]?.unit || "N/A",
      region: "Global",
      timestamp: new Date(),
      source: "commodity_price_api"
    });
  }
};

module.exports = { savePricesForBusiness };