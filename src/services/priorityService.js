function getPriority(event) {
  let score = 0;

  if (event.type === "news") score += 5;
  if (event.type === "weather") score += 4;
  if (event.type === "shipment") score += 3;

  if (event.raw?.severity === "high") score += 5;

  return score;
}

module.exports = { getPriority };