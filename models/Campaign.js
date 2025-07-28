const mongoose = require("mongoose");

const CampaignSchema = new mongoose.Schema({
  name: { type: String, required: true },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  status: {
    type: String,
    enum: ["active", "paused", "ended"],
    default: "active",
  },

  // Category determines the type of campaign
  category: { type: String, enum: ["review", "promotion"], required: true },

  // Conditional references based on category
  promotion: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Promotion", // Updated to match your Promotion model
    required: function () {
      return this.category === "promotion";
    },
  },
  review: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Review",
    required: function () {
      return this.category === "review";
    },
  },

  // Multiple products can be associated with a campaign
  products: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  ],

  // QR Code configuration
  qrCodeUrl: { type: String }, // Generated QR code for the campaign

  // Funnel configuration
  funnelSteps: [
    {
      stepType: { type: String }, // e.g. "collectEmail", "feedback", "reward", "review"
      config: mongoose.Schema.Types.Mixed, // Flexible configuration for each step
      order: { type: Number, default: 0 }, // Step order in the funnel
    },
  ],

  // Review-specific settings (only used when category = "review")
  reviewMinimumLength: { type: Number, default: 10 }, // Minimum length of review text
  enableSmartFunnel: { type: Boolean, default: false }, // Smart funnel for review collection

  // Promotion-specific settings (only used when category = "promotion")
  promotionSettings: {
    codeType: { type: String, enum: ["same", "unique"], default: "same" },
    codeValue: { type: String }, // Single code when codeType = "same"
    deliveryType: { type: String, enum: ["auto", "manual"], default: "auto" },
    maxRedemptions: { type: Number }, // Optional limit on total redemptions
    expiryDate: { type: Date }, // Optional expiry date for the campaign
  },

  // Analytics and tracking
  analytics: {
    totalScans: { type: Number, default: 0 },
    totalCompletions: { type: Number, default: 0 },
    totalRedemptions: { type: Number, default: 0 },
    conversionRate: { type: Number, default: 0 },
  },

  // Metadata
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },

  // Landing page customization
  customization: {
    primaryColor: { type: String, default: "#3B82F6" },
    logoUrl: { type: String },
    backgroundStyle: {
      type: String,
      enum: ["solid", "gradient"],
      default: "solid",
    },
    customMessage: { type: String },
  },
});

// Update the updatedAt field before saving
CampaignSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Virtual for calculating conversion rate
CampaignSchema.virtual("calculatedConversionRate").get(function () {
  if (this.analytics.totalScans === 0) return 0;
  return (this.analytics.totalCompletions / this.analytics.totalScans) * 100;
});

// Index for better query performance
CampaignSchema.index({ seller: 1, status: 1 });
CampaignSchema.index({ category: 1 });
CampaignSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Campaign", CampaignSchema);
