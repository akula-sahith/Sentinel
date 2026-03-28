const Event = require("../models/Event");

async function streamEvents(business, processFn) {
  const materials = business.rawMaterials.map(m => m.name.toLowerCase());

  const query = {
    tags: { $in: materials }
  };

  const cursor = Event.find(query)
    .select("type content metadata impactLevel tags")
    .lean()
    .cursor();

  for (let event = await cursor.next(); event != null; event = await cursor.next()) {
    await processFn(event);
  }
}

module.exports = { streamEvents };