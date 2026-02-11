const mongoose = require("mongoose");

const CampaignSchema = new mongoose.Schema({
  name: { type: String, required: true },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  status: {
    type: String,
    enum: ["active", "paused", "ended"],
    default: "active",
  },

  // Remove the conditional required - make these optional
  promotion: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Promotion",
    // Remove: required: function () { return this.category === "promotion"; }
  },
  review: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Review",
    // Remove: required: function () { return this.category === "review"; }
  },

  products: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  ],

  // Review-specific settings
  reviewMinimumLength: { type: Number, default: 10 },
  enableSmartFunnel: { type: Boolean, default: false },

  // Rest of your schema...
  promotionSettings: {
    codeType: { type: String, enum: ["same", "unique"], default: "same" },
    codeValue: { type: String },
    deliveryType: { type: String, enum: ["auto", "manual"], default: "auto" },
    maxRedemptions: { type: Number },
    expiryDate: { type: Date },
  },

  analytics: {
    totalScans: { type: Number, default: 0 },
    totalCompletions: { type: Number, default: 0 },
    totalRedemptions: { type: Number, default: 0 },
    conversionRate: { type: Number, default: 0 },
  },

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

  qrCodeUrl: { type: String },
  funnelSteps: [
    {
      stepType: { type: String },
      config: mongoose.Schema.Types.Mixed,
      order: { type: Number, default: 0 },
    },
  ],

  // Dynamic form fields configuration (Google Forms-like)
  formFields: [
    {
      id: { type: String, required: true },
      type: {
        type: String,
        enum: [
          "text",
          "email",
          "tel",
          "textarea",
          "number",
          "rating",
          "select",
          "toggle",
          "product_select",
          "marketplace_select",
        ],
        required: true,
      },
      label: { type: String, required: true },
      placeholder: { type: String, default: "" },
      required: { type: Boolean, default: false },
      options: [String], // for select/toggle fields
      step: { type: Number, default: 0 },
      order: { type: Number, default: 0 },
      isSystem: { type: Boolean, default: false },
      isRemovable: { type: Boolean, default: true },
    },
  ],

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Campaign", CampaignSchema);
