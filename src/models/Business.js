const mongoose = require("mongoose");

// 📦 Raw Material Schema
const rawMaterialSchema = new mongoose.Schema({
  name: {
  type: String,
  required: true,
  lowercase: true,
  trim: true,
  set: (val) => {
    if (typeof val === "object") {
      return String(val.name || "unknown");
    }
    return String(val);
  }
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
  required: true,
  set: (val) => {
    if (typeof val === "object" && val !== null) {
      return String(val.name || "Unknown");
    }
    return String(val);
  }
},
  category: String,
  price: {
    type: Number,
    required: true
  },
  costPrice: Number,
  monthlySalesVolume: Number,

  rawMaterialLinks: [{
    materialName: {
      type: String,
      lowercase: true,   // 🔥 normalize
      trim: true
    },
    usagePercentage: Number
  }]

}, { _id: false });

// 🏢 Business Schema
const businessSchema = new mongoose.Schema({

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true   // ⚡ fast lookup
  },

  profile: {
    industry: {
      type: String,
      enum: ["Food", "Energy", "Manufacturing"],
      required: true,
      index: true   // ⚡ filtering
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

  description: {
    type: String,
    required: true
  },

  financials: {
    cashReserve: Number,
    monthlyRevenue: Number,
    monthlyExpenses: Number
  },

  operations: {
    employees: Number,
    avgSalary: Number
  },

  supplyChain: {
    rawMaterials: [rawMaterialSchema],

    importDependency: {
      type: Number,
      min: 0,
      max: 100
    }
  },

  logistics: {
    transportMode: [{
      type: String,
      enum: ["Road", "Sea", "Air", "Rail"]
    }],
    monthlyTransportCost: Number
  },

  products: [productSchema],

  riskProfile: {
    inventoryDays: Number,
    alternativeSuppliers: Boolean
  },

  // 🔥🔥 NEW FIELD (GAME CHANGER)
  // Precomputed searchable tags for fast event matching
  tags: [{
    type: String,
    index: true
  }]

}, { timestamps: true });

module.exports = mongoose.model("Business", businessSchema);