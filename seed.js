const mongoose = require("mongoose");
require("dotenv").config();

// const Business = require("./models/Business");
const RawNews = require("./src/models/RawNews");
const RawWeather = require("./src/models/RawWeather");

// const businesses = [/* paste 2 businesses here */];
const news = [
   {
    "title": "Wheat prices surge due to export restrictions",
    "description": "Government imposes export ban leading to wheat shortage and price increase.",
    "category": "Financial",
    "industry": "Food",
    "source": "Reuters"
  },
  {
    "title": "Cyclone disrupts milk supply in Andhra Pradesh",
    "description": "Severe cyclone damages dairy farms affecting milk production.",
    "category": "NaturalDisaster",
    "industry": "Food",
    "source": "BBC"
  },
  {
    "title": "Cheese imports affected due to global supply chain disruptions",
    "description": "International logistics issues delay cheese shipments.",
    "category": "SupplyChain",
    "industry": "Food",
    "source": "Bloomberg"
  },
  {
    "title": "Vegetable prices spike due to heavy rainfall",
    "description": "Flooding damages crops causing shortage in vegetables.",
    "category": "Financial",
    "industry": "Food",
    "source": "Economic Times"
  },
  {
    "title": "Cooking oil prices rise due to import dependency",
    "description": "Global oil shortage increases domestic prices.",
    "category": "Geopolitical",
    "industry": "Food",
    "source": "Al Jazeera"
  },

  {
    "title": "Coal import prices rise globally",
    "description": "International demand increases coal prices.",
    "category": "Financial",
    "industry": "Manufacturing",
    "source": "Bloomberg"
  },
  {
    "title": "Port congestion in Visakhapatnam",
    "description": "Heavy shipment backlog delays raw materials.",
    "category": "SupplyChain",
    "industry": "Manufacturing",
    "source": "Reuters"
  },
  {
    "title": "Geopolitical tensions affect iron ore exports",
    "description": "Trade restrictions impact iron ore supply.",
    "category": "Geopolitical",
    "industry": "Manufacturing",
    "source": "Al Jazeera"
  }
];
const weather = [
  {
    "location": "Vijayawada",
    "category": "Food",
    "event": "heatwave",
    "severity": "high",
    "startDate": "2026-04-01",
    "endDate": "2026-04-05",
    "affectedArea": "farmland",
    "source": "IMD"
  },
  {
    "location": "Visakhapatnam",
    "category": "Manufacturing",
    "event": "cyclone",
    "severity": "high",
    "startDate": "2026-04-02",
    "endDate": "2026-04-06",
    "affectedArea": "port",
    "source": "IMD"
  },
  {
    "location": "Andhra Pradesh",
    "category": "Food",
    "event": "heavy rainfall",
    "severity": "high",
    "startDate": "2026-04-02",
    "endDate": "2026-04-06",
    "affectedArea": "vegetable farms",
    "source": "IMD"
  }
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);

  // await Business.deleteMany();
  await RawNews.deleteMany();
  await RawWeather.deleteMany();

  // await Business.insertMany(businesses);
  await RawNews.insertMany(news);
  await RawWeather.insertMany(weather);

  console.log("🔥 Data Seeded");
  process.exit();
}

seed();