const Business = require("../models/Business");
const User = require("../models/User");

// ➕ Create Business
exports.createBusiness = async (req, res) => {
  try {
    // 🔥 Find user using firebaseUid
    const user = await User.findOne({ firebaseUid: req.firebaseUid });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found. Please sync first."
      });
    }

    const {
      profile,
      description,
      financials,
      operations,
      supplyChain,
      logistics,
      products,
      riskProfile
    } = req.body;

    if (!profile || !profile.industry) {
      return res.status(400).json({
        success: false,
        message: "Profile industry is required"
      });
    }

    if (!description) {
      return res.status(400).json({
        success: false,
        message: "Business description is required"
      });
    }

    const business = await Business.create({
      createdBy: user._id, // 🔥 important
      profile,
      description,
      financials,
      operations,
      supplyChain,
      logistics,
      products,
      riskProfile
    });

    res.status(201).json({
      success: true,
      business
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getMyBusinesses = async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUid: req.firebaseUid });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const businesses = await Business.find({
      createdBy: user._id
    });

    res.status(200).json({
      success: true,
      businesses
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getBusinessById = async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUid: req.firebaseUid });

    const business = await Business.findOne({
      _id: req.params.id,
      createdBy: user._id
    });

    if (!business) {
      return res.status(404).json({
        success: false,
        message: "Business not found or unauthorized"
      });
    }

    res.status(200).json({
      success: true,
      business
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.updateBusiness = async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUid: req.firebaseUid });

    const business = await Business.findOneAndUpdate(
      {
        _id: req.params.id,
        createdBy: user._id
      },
      req.body,
      { new: true, runValidators: true }
    );

    if (!business) {
      return res.status(404).json({
        success: false,
        message: "Business not found or unauthorized"
      });
    }

    res.status(200).json({
      success: true,
      business
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.deleteBusiness = async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUid: req.firebaseUid });

    const business = await Business.findOneAndDelete({
      _id: req.params.id,
      createdBy: user._id
    });

    if (!business) {
      return res.status(404).json({
        success: false,
        message: "Business not found or unauthorized"
      });
    }

    res.status(200).json({
      success: true,
      message: "Business deleted"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};