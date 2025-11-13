const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const axios = require("axios"); // <-- added for self ping

// Load env vars
dotenv.config();

const app = express();

// Middleware for JSON
app.use(express.json());
app.use(cors());

// Import models
require("./models/User");
require("./models/Product");
require("./models/Campaign");
require("./models/Review");
require("./models/Promotion");
require("./models/FunnelVisit");

const userRoutes = require("./routes/user");
const productRoutes = require("./routes/product");
const promotionRoutes = require("./routes/promotion");
const campaignRoutes = require("./routes/campaign");
const publicReviewRoutes = require("./routes/publicReview");
const upload = require("./routes/upload");
const adminUsers = require("./routes/admin");

// -------------------------------
// MongoDB Connection
// -------------------------------
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Atlas connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// -------------------------------
// Health Route for Self-Ping
// -------------------------------
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

// -------------------------------
// API Routes
// -------------------------------
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/promotions", promotionRoutes);
app.use("/api/campaigns", campaignRoutes);
app.use("/api/public", publicReviewRoutes);
app.use("/api/upload", upload);
app.use("/api/admin", adminUsers);

// Static Frontend
app.use(express.static(path.join(__dirname, "client/dist")));

app.get("/*splat", (req, res) => {
  res.sendFile(path.join(__dirname, "client/dist", "index.html"));
});

// -------------------------------
// Start Server
// -------------------------------
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);

  // -------------------------------
  // SELF-PING TO PREVENT COLD START
  // -------------------------------
  const SELF_URL = process.env.SELF_URL || `https://scanqrgo.onrender.com`;

  console.log("Self-ping enabled → keeping Render awake");

  setInterval(async () => {
    try {
      await axios.get(`${SELF_URL}/health`);
      // console.log("Self-ping OK:", new Date().toISOString());
    } catch (err) {
      console.log("Self-ping FAILED:", err.message);
    }
  }, 1 * 60 * 1000); // every 5 minutes
});
