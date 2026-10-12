const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../services/sendEmail");
const { OAuth2Client } = require("google-auth-library");

const googleClient = new OAuth2Client();

// ================= REGISTER =================

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await User.create({
      name,
      email,
      password: hashedPassword,
      otp,
      otpExpires: new Date(Date.now() + 5 * 60 * 1000),
      isVerified: false,
    });

    await sendEmail(
      email,
      "Resume Analyzer - Email Verification",
      `
      <div style="font-family:Arial,sans-serif;padding:20px;">
        <h2>Email Verification</h2>

        <p>Hello <b>${name}</b>,</p>

        <p>Your verification OTP is:</p>

        <h1 style="color:#2563eb;">${otp}</h1>

        <p>This OTP is valid for <b>5 minutes</b>.</p>

      </div>
      `
    );

    return res.status(200).json({
      message: "OTP sent successfully",
      email,
    });

  } catch (err) {
    console.log(err);

    return res.status(500).json({
      message: err.message,
    });
  }
};

// ================= LOGIN =================

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (!user.isVerified) {
      return res.status(401).json({
        message: "Please verify your email before logging in.",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    return res.json({
      token,
      user,
    });

  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

// ================= VERIFY OTP =================

exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        message: "User already verified",
      });
    }

    if (user.otp !== otp) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    if (user.otpExpires < Date.now()) {
      return res.status(400).json({
        message: "OTP has expired",
      });
    }

    user.isVerified = true;
    user.otp = "";
    user.otpExpires = null;

    await user.save();

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    return res.json({
      message: "Email verified successfully",
      token,
      user,
    });

  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

// ================= FORGOT PASSWORD =================

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "No account found with this email.",
      });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    user.resetOTP = otp;
    user.resetOTPExpires = new Date(
      Date.now() + 5 * 60 * 1000
    );

    await user.save();

    await sendEmail(
      email,
      "Resume Analyzer - Password Reset OTP",
      `
      <div style="font-family:Arial;padding:20px;">
        <h2>Password Reset</h2>

        <p>Hello <b>${user.name}</b>,</p>

        <p>Your OTP for resetting your password is:</p>

        <h1 style="color:#2563eb;letter-spacing:5px;">
          ${otp}
        </h1>

        <p>This OTP is valid for <b>5 minutes</b>.</p>

        <p>If you didn't request this, simply ignore this email.</p>

        <br>

        <p>Resume Analyzer Team</p>
      </div>
      `
    );

    res.json({
      message: "Password reset OTP sent successfully.",
      email,
    });

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// ================= VERIFY RESET OTP =================

exports.verifyResetOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.resetOTP !== otp) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    if (user.resetOTPExpires < Date.now()) {
      return res.status(400).json({
        message: "OTP has expired",
      });
    }

    return res.status(200).json({
      message: "OTP verified successfully",
    });

  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

// ================= RESET PASSWORD =================

exports.resetPassword = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;

    // Clear reset OTP
    user.resetOTP = "";
    user.resetOTPExpires = null;

    await user.save();

    return res.status(200).json({
      message: "Password reset successfully",
    });

  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};
// ================= RESEND OTP =================

exports.resendOTP = async (req, res) => {
  const { email } = req.body;

  console.log("Resend OTP request:", email);

  try {
    const user = await User.findOne({ email });

    console.log("User:", user);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    if (!user.isVerified) {
      console.log("Sending signup OTP");

      user.otp = otp;
      user.otpExpires = new Date(Date.now() + 5 * 60 * 1000);

      await user.save();

      await sendEmail(
        email,
        "Resume Analyzer - Email Verification",
        `
        <h2>Email Verification</h2>
        <h1>${otp}</h1>
        `
      );

      console.log("Signup OTP sent");

      return res.json({
        message: "Verification OTP sent successfully",
      });
    }

    console.log("Sending reset OTP");

    user.resetOTP = otp;
    user.resetOTPExpires = new Date(Date.now() + 5 * 60 * 1000);

    await user.save();

    await sendEmail(
      email,
      "Resume Analyzer - Password Reset",
      `<h1>${otp}</h1>`
    );

    console.log("Reset OTP sent");

    return res.json({
      message: "Reset OTP sent successfully",
    });

  } catch (err) {
    console.log("RESEND ERROR:");
    console.log(err);

    res.status(500).json({
      message: err.message,
    });
  }
};

// ================= GOOGLE AUTH =================

exports.googleAuth = async (req, res) => {
  const { credential } = req.body;

  try {
    if (!credential) {
      return res.status(400).json({ message: "Google credential token is required" });
    }

    const clientAudience = process.env.GOOGLE_CLIENT_ID;

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      ...(clientAudience ? { audience: clientAudience } : {}),
    });

    const payload = ticket.getPayload();

    if (!payload || !payload.email) {
      return res.status(400).json({ message: "Invalid Google token payload" });
    }

    const { email, name, picture, sub } = payload;

    let user = await User.findOne({ email });

    if (user) {
      if (!user.googleId) {
        user.googleId = sub;
      }
      if (!user.profilePhoto && picture) {
        user.profilePhoto = picture;
      }
      user.isVerified = true;
      await user.save();
    } else {
      user = await User.create({
        name: name || "Google User",
        email,
        profilePhoto: picture || "",
        googleId: sub,
        isVerified: true,
        password: "",
      });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    return res.status(200).json({
      message: "Google login successful",
      token,
      user,
    });
  } catch (err) {
    console.error("Google Auth Error:", err);
    return res.status(500).json({
      message: err.message || "Google authentication failed",
    });
  }
};