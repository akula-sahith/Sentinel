const mongoose = require("mongoose");

// 📦 Raw Material Schema
const rawMaterialSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  dependencyPercentage: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  }
}, { _id: false });

// 🛒 Product Schema
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  category: {
    type: String
  },
  price: {
    type: Number,
    required: true
  },
  costPrice: {
    type: Number
  },
  monthlySalesVolume: {
    type: Number
  },

  // 🔗 Optional: Link product to raw materials (for impact simulation)
  rawMaterialLinks: [{
    materialName: String,
    usagePercentage: Number
  }]

}, { _id: false });

// 🏢 Business Schema
const businessSchema = new mongoose.Schema({

  // 🔗 User Mapping
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  // 🏢 Profile
  profile: {
    industry: {
      type: String,
      enum: ["Food", "Energy", "Manufacturing"],
      required: true
    },
    subIndustry: String,
    location: {
      country: String,
      state: String,
      city: String
    },
    scale: {
      type: String,
      enum: ["Small", "Medium", "Large"]
    }
  },

  // 🧠 Description (AI Context)
  description: {
    type: String,
    required: true
  },

  // 💰 Financials
  financials: {
    cashReserve: Number,
    monthlyRevenue: Number,
    monthlyExpenses: Number
  },

  // 👨‍💼 Operations
  operations: {
    employees: Number,
    avgSalary: Number
  },

  // 📦 Supply Chain
  supplyChain: {
    rawMaterials: [rawMaterialSchema],
    importDependency: {
      type: Number,
      min: 0,
      max: 100
    }
  },

  // 🚢 Logistics
  logistics: {
    transportMode: [{
      type: String,
      enum: ["Road", "Sea", "Air", "Rail"]
    }],
    monthlyTransportCost: Number
  },

  // 🛒 Products
  products: [productSchema],

  // ⚠️ Risk Profile
  riskProfile: {
    inventoryDays: Number,
    alternativeSuppliers: Boolean
  }

}, { timestamps: true });

module.exports = mongoose.model("Business", businessSchema);