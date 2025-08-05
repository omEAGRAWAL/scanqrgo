const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
  campaign: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Campaign",
    required: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  funnelVisit: { type: mongoose.Schema.Types.ObjectId, ref: "FunnelVisit" },
  customerName: String,
  email: String,
  phoneNumber: String,
  review: { type: String, required: true },
  seller: { // campaign owner's userId
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Review", ReviewSchema);
