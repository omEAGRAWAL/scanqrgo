const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  marketplace: { type: String }, // e.g., "Amazon India"
  marketplaceProductId: { type: String }, // marketplace-specific product ID
  campaigns: [{ type: mongoose.Schema.Types.ObjectId, ref: "Campaign" }],
  createdAt: { type: Date, default: Date.now },
  imageurl: { type: String }, // URL of the product image
});

module.exports = mongoose.model("Product", ProductSchema);
