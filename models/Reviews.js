const mongoose = require("mongoose");

const ReviewsSchema = new mongoose.Schema({
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

  // Order information
  orderNumber: { type: String, required: true },

  // Customer satisfaction
  satisfactionLevel: {
    type: String,
    enum: [
      "Very Satisfied",
      "Somewhat Satisfied",
      "Neither Satisfied Nor Dissatisfied",
      "Somewhat Dissatisfied",
      "Very Dissatisfied",
    ],
    required: true,
  },

  // Usage duration
  usageDuration: {
    type: String,
    enum: ["Yes", "No"], // Has been using for more than 7 days
    required: true,
  },

  // Customer information
  customerInfo: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
  },

  // Review content
  reviewText: { type: String, required: true },

  // Status tracking
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },

  // Validation flags
  isOrderVerified: { type: Boolean, default: false },
  verificationNotes: { type: String },

  // Metadata
  submittedAt: { type: Date, default: Date.now },
  ipAddress: { type: String },
  userAgent: { type: String },

  // Admin notes
  adminNotes: { type: String },
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  reviewedAt: { type: Date },
});

// Index for better query performance
ReviewSchema.index({ campaign: 1, status: 1 });
ReviewSchema.index({ product: 1 });
ReviewSchema.index({ submittedAt: -1 });
ReviewSchema.index({ "customerInfo.email": 1 });

// Virtual to check if review meets minimum length requirement
ReviewSchema.virtual("meetsMinimumLength").get(function () {
  if (!this.populated("campaign") || !this.campaign.reviewMinimumLength)
    return true;
  return this.reviewText.length >= this.campaign.reviewMinimumLength;
});

module.exports = mongoose.model("Review", ReviewsSchema);
