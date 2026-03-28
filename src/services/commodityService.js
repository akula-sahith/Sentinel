// services/commodityService.js
const axios = require("axios");

const fetchPricesBySymbols = async (symbolsArray) => {
  try {
    const symbols = symbolsArray.join(",");

    const response = await axios.get(
      `${process.env.COMMODITY_BASE_URL}/rates/latest?symbols=${symbols}`,
      {
        headers: {
          "x-api-key": process.env.COMMODITY_API_KEY
        }
      }
    );

    return response.data;
  } catch (err) {
    console.error("Error fetching prices:", err.message);
    return null;
  }
};

module.exports = { fetchPricesBySymbols };