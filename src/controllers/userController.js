const User = require("../models/User");

// 🔐 Create or Get User (SAFE)
exports.createOrGetUser = async (req, res) => {
  try {
    const firebaseUid = req.firebaseUid;
    const { email, name, phone } = req.body;

    let user = await User.findOne({ firebaseUid });

    if (!user) {
      user = await User.create({
        firebaseUid,
        email,
        name,
        phone
      });
    }

    res.status(200).json({
      success: true,
      user
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};