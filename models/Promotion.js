const mongoose = require("mongoose");

const PromotionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  offerTitle: { type: String, required: true },
  type: {
    type: String,
    enum: ["discount code", "extended warranty"],
    required: true,
  },
  warrantyPeriod: { type: String }, // in months, for extended warranty
  couponCode: { type: String }, // for discount codes
  termsAndConditions: { type: String }, // Fixed field name

  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  description: { type: String, required: true },

  deliveryType: { type: String, enum: ["auto", "manual"], default: "auto" },
  status: { type: String, enum: ["active", "inactive"], default: "active" },
  createdAt: { type: Date, default: Date.now },
  codeValue: { type: String }, // For discount codes
});

module.exports = mongoose.model("Promotion", PromotionSchema);
