const express = require("express");
const router = express.Router();
const sendEmail = require("../services/sendEmail");

router.get("/", async (req, res) => {
  try {
    await sendEmail(
      process.env.EMAIL_USER,
      "Resume Analyzer Test",
      `
        <h2>🎉 Congratulations!</h2>
        <p>Your email configuration is working successfully.</p>
      `
    );

    res.json({
      message: "Email sent successfully",
    });

  } catch (error) {
    console.error("Email Error:");
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;