function applyRules(event) {
  switch (event.type) {

    case "weather":
      if (event.raw.severity === "high") {
        return {
          impact: "High",
          reason: "Severe weather disruption"
        };
      }
      break;

    case "shipment":
      if (event.raw.status !== "delivered") {
        return {
          impact: "Medium",
          reason: "Shipment delay risk"
        };
      }
      break;

    case "supply":
      if (event.raw.production < event.raw.domesticConsumption) {
        return {
          impact: "High",
          reason: "Supply shortage"
        };
      }
      break;

    case "price":
      if (event.raw.price > 100) {
        return {
          impact: "High",
          reason: "Price surge"
        };
      }
      break;

    default:
      return null;
  }

  return null;
}

module.exports = { applyRules };