const axios = require("axios");
const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, html) => {
  const senderEmail = process.env.EMAIL_USER || "resumeanalyzer.project1@gmail.com";

  // 1. Try Brevo HTTP API (Port 443 HTTPS - Works 100% on Render without SMTP port blocks)
  if (process.env.BREVO_API_KEY) {
    try {
      const response = await axios.post(
        "https://api.brevo.com/v3/smtp/email",
        {
          sender: { name: "Resume Analyzer", email: senderEmail },
          to: [{ email: to }],
          subject,
          htmlContent: html,
        },
        {
          headers: {
            "api-key": process.env.BREVO_API_KEY,
            "content-type": "application/json",
          },
          timeout: 10000,
        }
      );
      console.log("✅ Email sent via Brevo HTTP API:", response.data?.messageId || "Success");
      return response.data;
    } catch (err) {
      console.error("Brevo API error, trying SMTP fallback:", err.response?.data || err.message);
    }
  }

  // 2. Nodemailer fallback (for local development or environments allowing SMTP)
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: senderEmail,
        pass: process.env.EMAIL_PASS || "xwmy mzzr ojme bbai",
      },
    });

    const info = await transporter.sendMail({
      from: `"Resume Analyzer" <${senderEmail}>`,
      to,
      subject,
      html,
    });

    console.log("✅ Email sent via Nodemailer:", info.messageId);
    return info;
  } catch (err) {
    console.error("❌ Email sending failed:", err);
    throw new Error(`Email sending failed: ${err.message}`);
  }
};

module.exports = sendEmail;