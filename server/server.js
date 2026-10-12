const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");


// Load .env FIRST
dotenv.config();
const authRoutes = require("./routes/authRoutes");
const connectDB = require("./config/db");
const testEmailRoute = require("./routes/testEmailRoute");
const profileRoutes = require("./routes/profileRoutes");

connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Home Route
app.get("/", (req, res) => {
  res.send("🚀 Resume Analyzer Backend is Running");
});

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/resumes", require("./routes/resumeRoutes"));
app.use("/api/test-email", testEmailRoute);
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


