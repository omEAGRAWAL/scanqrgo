
const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  
  // Amazon marketplace
  amazonAsin: { type: String }, // Amazon Standard Identification Number
  
  // Flipkart marketplace  
  flipkartFsn: { type: String }, // Flipkart Serial Number
  
  campaigns: [{ type: mongoose.Schema.Types.ObjectId, ref: "Campaign" }],
  createdAt: { type: Date, default: Date.now },
  imageurl: { type: String }, // URL of the product image
});

// Custom validation to ensure at least one marketplace is provided
ProductSchema.pre('save', function(next) {
  if (!this.amazonAsin && !this.flipkartFsn) {
    const error = new Error('At least one marketplace (Amazon ASIN or Flipkart FSN) is required');
    return next(error);
  }
  next();
});

// Virtual field to get available marketplaces
ProductSchema.virtual('availableMarketplaces').get(function() {
  const marketplaces = [];
  if (this.amazonAsin) marketplaces.push('Amazon');
  if (this.flipkartFsn) marketplaces.push('Flipkart');
  return marketplaces;
});

// Include virtuals when converting to JSON
ProductSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model("Product", ProductSchema);
