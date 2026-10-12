const User = require("../models/User");
const Resume = require("../models/Resume");

// ================= GET PROFILE =================

exports.getProfile = async (req, res) => {
  try {
    console.log("req.user:", req.user);
    console.log("req.user.id:", req.user.id);

    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const totalResumes = await Resume.countDocuments({
      user: req.user.id,
    });

    res.status(200).json({
      success: true,
      user,
      totalResumes,
    });

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// ================= UPDATE PROFILE =================

exports.updateProfile = async (req, res) => {
  try {
    const { name, phone } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.name = name || user.name;
    user.phone = phone || user.phone;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user,
    });

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

    // ================= UPLOAD PROFILE PHOTO =================

exports.uploadProfilePhoto = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    user.profilePhoto = req.file.path;

    await user.save();

    res.json({
      success: true,
      image: req.file.path,
    });

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
// ================= Remove PROFILE PHOTO =================
exports.removeProfilePhoto = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.profilePhoto = "";

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile photo removed successfully",
    });

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};