const mongoose = require("mongoose");

const PromotionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: {
    type: String,
    enum: ["giftcard", "discount code", "extended warranty", "custom"],
    required: true,
  },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  description: { type: String, required: true },
  provider: { type: String }, // e.g., "Paytm", "PhonePe"
  value: mongoose.Schema.Types.Mixed, // Flexible storage (e.g., { amount: 100, currency: 'INR' })
  deliveryType: { type: String, enum: ["auto", "manual"], default: "auto" },
  status: { type: String, enum: ["active", "inactive"], default: "active" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Promotion", PromotionSchema);
