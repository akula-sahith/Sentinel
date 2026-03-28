function matchEvents(events, business) {
  const businessTags = business.tags || [];

  return events.filter(event =>
    event.tags.some(tag => businessTags.includes(tag))
  );
}

module.exports = { matchEvents };