const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
//allow cors

const cors = require("cors");

// ... the rest of your middleware and routes

// Load env vars
dotenv.config();

const app = express();

// Middleware for JSON
app.use(express.json());
app.use(cors());
// app.set("trust proxy", true);

// Import your models
require("./models/User");
require("./models/Product");
require("./models/Campaign");
require("./models/Review");
require("./models/Promotion");
require("./models/FunnelVisit");
// require("./models/Reviews");
const userRoutes = require("./routes/user"); // Adjust the path accordingly
const productRoutes = require("./routes/product"); // Add this line
const promotionRoutes = require("./routes/promotion");
const campaignRoutes = require("./routes/campaign");
const publicReviewRoutes = require("./routes/publicReview");
// Connect to MongoDB Atlas
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB Atlas connected");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// Test route
app.get("/", (req, res) => {
  res.send("Backend is running!");
});

app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/promotions", promotionRoutes);
app.use("/api/campaigns", campaignRoutes);
app.use("/api/public", publicReviewRoutes);
// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
