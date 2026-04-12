const mongoose = require("mongoose");

const FunnelVisitSchema = new mongoose.Schema({
  campaign: { type: mongoose.Schema.Types.ObjectId, ref: "Campaign" },
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // optional
  scannedAt: { type: Date, default: Date.now },
  customerFeedback: { type: String },

  // step data holds flexible funnel inputs
  stepData: {
    orderNumber: String,

    satisfaction: String,

    usedMoreDays: String,
    customerName: String,

    email: String,
    phoneNumber: String,
    review: String,
    rating: Number,
    marketplace: String,
    clickedMarketplaceButton: { type: Boolean, default: false },
    shouldRequestReview: { type: Boolean, default: false },
  },

  // Store arbitrary custom field data from dynamic form builder
  customFields: { type: mongoose.Schema.Types.Mixed, default: {} },
});

module.exports = mongoose.model("FunnelVisit", FunnelVisitSchema);
//
