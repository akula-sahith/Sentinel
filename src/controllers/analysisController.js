const Business = require("../models/Business");

const { fetchAllEvents } = require("../services/eventFetchService");
const { applyRules } = require("../services/ruleEngine");
const { getPriority } = require("../services/priorityService");
const { chunkArray } = require("../services/batchProcessor");
const { callLLM } = require("../services/llmService");

exports.analyze = async (req, res) => {
  try {
    // 🔥 1. Get business
    const business = await Business.findOne({
      createdBy: req.user.id
    }).lean();

    // 🔥 2. Fetch events (FAST)
    const events = await fetchAllEvents(business);

    const results = [];
    const llmQueue = [];

    // 🔥 3. Rule + Priority
    for (let event of events) {

      const rule = applyRules(event);

      if (rule) {
        results.push({ eventId: event.id, ...rule });
        continue;
      }

      const priority = getPriority(event);

      if (priority >= 7) {
        llmQueue.push(event);
      } else {
        results.push({
          eventId: event.id,
          impact: "Low",
          reason: "Low priority"
        });
      }
    }

    // 🔥 4. Batch LLM
    const batches = chunkArray(llmQueue, 5);

    for (let batch of batches) {
      const formatted = batch.map(e => ({ text: e.content }));

      const llmResult = await callLLM(formatted, business);

      results.push({
        type: "AI_ANALYSIS",
        result: llmResult
      });
    }

    res.json({
      success: true,
      totalEvents: events.length,
      results
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Analysis failed" });
  }
};