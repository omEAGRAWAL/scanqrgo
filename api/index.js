const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const serverless = require("serverless-http");

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB/ Connect to MongoDB Atlas mongoose .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true, }) .then(() => { console.log("MongoDB Atlas connected"); }) .catch((err) => { console.error("MongoDB connection error:", err); }); // app.get("*", (req, res) => { // res.sendFile(path.join(__dirname, "client/dist", "index.html")); // });
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

// Your routes
app.use("/api/users", require("../routes/user"));
app.use("/api/products", require("../routes/product"));
app.use("/api/promotions", require("../routes/promotion"));
app.use("/api/campaigns", require("../routes/campaign"));
app.use("/api/public", require("../routes/publicReview"));
app.use("/api/upload", require("../routes/upload"));
app.use("/api/admin", require("../routes/admin"));

app.get("/api/ping", (req, res) => res.json({ ok: true, msg: "API alive ✅" }));

module.exports = app;
module.exports.handler = serverless(app);
