const express = require("express");
const Product = require("../models/Product");
const auth = require("../middleware/auth");

const router = express.Router();

// POST /api/products - Create a new product
router.post("/", auth, async (req, res) => {
  try {
    const { name, marketplace, marketplaceProductId, imageurl } = req.body; // <--- Accept imageurl

    // Basic validation
    if (!name) {
      return res.status(400).json({ message: "Product name is required" });
    }

    // Create product with current user as seller
    const product = new Product({
      name,
      seller: req.user.id, // Get from JWT token
      marketplace,
      marketplaceProductId,
      campaigns: [],
      imageurl, // <--- Save imageurl if present
    });

    await product.save();

    // Populate seller info before sending response
    await product.populate("seller", "name email");

    res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error("Create product error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/products - Get all products for the current user
router.get("/", auth, async (req, res) => {
  try {
    const products = await Product.find({ seller: req.user.id })
      .populate("seller", "name email")
      .populate("campaigns", "name status")
      .sort({ createdAt: -1 });

    res.json({
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("Get products error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/products/:id - Get a specific product by ID
router.get("/:id", auth, async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      seller: req.user.id, // Ensure user can only access their own products
    })
      .populate("seller", "name email")
      .populate("campaigns", "name status qrCodeUrl");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    console.error("Get product error:", error);
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid product ID" });
    }
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/products/:id - Update a product
router.put("/:id", auth, async (req, res) => {
  try {
    const { name, marketplace, marketplaceProductId, imageurl } = req.body; // <--- Accept imageurl

    // Find product and ensure it belongs to the current user
    const product = await Product.findOne({
      _id: req.params.id,
      seller: req.user.id,
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Update fields
    if (name !== undefined) product.name = name;
    if (marketplace !== undefined) product.marketplace = marketplace;
    if (marketplaceProductId !== undefined)
      product.marketplaceProductId = marketplaceProductId;
    if (imageurl !== undefined) product.imageurl = imageurl; // <--- Update imageurl

    await product.save();

    // Populate before sending response
    await product.populate("seller", "name email");
    await product.populate("campaigns", "name status");

    res.json({
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error("Update product error:", error);
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid product ID" });
    }
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE /api/products/:id - Delete a product
router.delete("/:id", auth, async (req, res) => {
  try {
    // Find product and ensure it belongs to the current user
    const product = await Product.findOne({
      _id: req.params.id,
      seller: req.user.id,
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if product has active campaigns
    if (product.campaigns && product.campaigns.length > 0) {
      return res.status(400).json({
        message:
          "Cannot delete product with active campaigns. Please delete campaigns first.",
      });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Delete product error:", error);
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid product ID" });
    }
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
