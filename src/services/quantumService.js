const axios = require("axios");

function buildQUBO(strategies) {
  const n = strategies.length;
  // Initialize n x n matrix with zeros
  const Q = Array.from({ length: n }, () => Array(n).fill(0));

  for (let i = 0; i < n; i++) {
    const impact = strategies[i].impact || 5;
    const cost = strategies[i].cost || 5;
    const penalty = strategies[i].penalty || 2;

    // Objective: Minimize (Cost + Penalty - Impact)
    Q[i][i] = cost + penalty - impact;
  }

  // Synergies: If strategy i and i+1 are both chosen, reduce cost by 1
  for (let i = 0; i < n - 1; i++) {
    Q[i][i + 1] = -1; 
  }

  return Q;
}

async function runQuantumCategory(strategies) {
  // If only one strategy, no need for quantum optimization
  if (!strategies || strategies.length === 0) return [];
  if (strategies.length === 1) return strategies; 

  try {
    const Q = buildQUBO(strategies);

    const response = await axios.post("https://sentinelquantumengine.onrender.com/optimize", {
      qubo: Q
    });

    const solution = response.data.solution;
    
    // Map the binary solution back to strategies
    const selected = strategies.filter((_, i) => solution[i] === 1);

    // Ensure we return at least the best one if quantum returns all zeros
    return selected.length > 0 ? selected.slice(0, 2) : [strategies[0]];

  } catch (err) {
    console.error("Quantum Error:", err.message);
    // Fallback to impact-based sorting
    return strategies
      .sort((a, b) => (b.impact || 0) - (a.impact || 0))
      .slice(0, 2);
  }
}

async function optimizeAllStrategies(analysis) {
  return {
    priceStrategy: await runQuantumCategory(analysis.priceStrategy),
    productStrategy: await runQuantumCategory(analysis.productStrategy),
    logisticsStrategy: await runQuantumCategory(analysis.logisticsStrategy),
    rawMaterialStrategy: await runQuantumCategory(analysis.rawMaterialStrategy),
    generalStrategicSuggestions: await runQuantumCategory(analysis.generalStrategicSuggestions)
  };
}

module.exports = { optimizeAllStrategies };