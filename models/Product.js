
const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  // Legacy fields (kept for backward compatibility)
  amazonAsin: { type: String }, // Amazon Standard Identification Number
  flipkartFsn: { type: String }, // Flipkart Serial Number

  // New flexible marketplace system
  marketplaceSources: [{
    marketplace: { type: String, required: true }, // e.g., "Amazon India", "Flipkart", "Meesho", "Custom Store"
    productId: { type: String, required: true },    // e.g., ASIN, FSN, or custom ID
    isPrimary: { type: Boolean, default: false }    // Mark one as primary source
  }],

  campaigns: [{ type: mongoose.Schema.Types.ObjectId, ref: "Campaign" }],
  createdAt: { type: Date, default: Date.now },
  imageurl: { type: String }, // URL of the product image
});

// Custom validation to ensure at least one marketplace is provided
ProductSchema.pre('save', function (next) {
  const hasLegacyMarketplace = this.amazonAsin || this.flipkartFsn;
  const hasNewMarketplace = this.marketplaceSources && this.marketplaceSources.length > 0;

  if (!hasLegacyMarketplace && !hasNewMarketplace) {
    const error = new Error('At least one marketplace source is required');
    return next(error);
  }
  next();
});

// Virtual field to get available marketplaces (includes both legacy and new)
ProductSchema.virtual('availableMarketplaces').get(function () {
  const marketplaces = [];

  // Add legacy marketplaces
  if (this.amazonAsin) marketplaces.push('Amazon');
  if (this.flipkartFsn) marketplaces.push('Flipkart');

  // Add new marketplace sources
  if (this.marketplaceSources && this.marketplaceSources.length > 0) {
    this.marketplaceSources.forEach(source => {
      if (!marketplaces.includes(source.marketplace)) {
        marketplaces.push(source.marketplace);
      }
    });
  }

  return marketplaces;
});

// Include virtuals when converting to JSON
ProductSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model("Product", ProductSchema);
