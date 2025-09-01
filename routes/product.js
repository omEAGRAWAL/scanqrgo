// const express = require("express");
// const Product = require("../models/Product");
// const auth = require("../middleware/auth");

// const router = express.Router();

// // POST /api/products - Create a new product
// router.post("/", auth, async (req, res) => {
//   try {
//     const { name, marketplace, marketplaceProductId, imageurl } = req.body; // <--- Accept imageurl

//     // Basic validation
//     if (!name) {
//       return res.status(400).json({ message: "Product name is required" });
//     }

//     // Create product with current user as seller
//     const product = new Product({
//       name,
//       seller: req.user.id, // Get from JWT token
//       marketplace,
//       marketplaceProductId,
//       campaigns: [],
//       imageurl, // <--- Save imageurl if present
//     });

//     await product.save();

//     // Populate seller info before sending response
//     await product.populate("seller", "name email");

//     res.status(201).json({
//       message: "Product created successfully",
//       product,
//     });
//   } catch (error) {
//     console.error("Create product error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // GET /api/products - Get all products for the current user
// router.get("/", auth, async (req, res) => {
//   try {
//     const products = await Product.find({ seller: req.user.id })
//       .populate("seller", "name email")
//       .populate("campaigns", "name status")
//       .sort({ createdAt: -1 });

//     res.json({
//       count: products.length,
//       products,
//     });
//   } catch (error) {
//     console.error("Get products error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // GET /api/products/:id - Get a specific product by ID
// router.get("/:id", auth, async (req, res) => {
//   try {
//     const product = await Product.findOne({
//       _id: req.params.id,
//       seller: req.user.id, // Ensure user can only access their own products
//     })
//       .populate("seller", "name email")
//       .populate("campaigns", "name status qrCodeUrl");

//     if (!product) {
//       return res.status(404).json({ message: "Product not found" });
//     }

//     res.json(product);
//   } catch (error) {
//     console.error("Get product error:", error);
//     if (error.name === "CastError") {
//       return res.status(400).json({ message: "Invalid product ID" });
//     }
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // PUT /api/products/:id - Update a product
// router.put("/:id", auth, async (req, res) => {
//   try {
//     const { name, marketplace, marketplaceProductId, imageurl } = req.body; // <--- Accept imageurl

//     // Find product and ensure it belongs to the current user
//     const product = await Product.findOne({
//       _id: req.params.id,
//       seller: req.user.id,
//     });

//     if (!product) {
//       return res.status(404).json({ message: "Product not found" });
//     }

//     // Update fields
//     if (name !== undefined) product.name = name;
//     if (marketplace !== undefined) product.marketplace = marketplace;
//     if (marketplaceProductId !== undefined)
//       product.marketplaceProductId = marketplaceProductId;
//     if (imageurl !== undefined) product.imageurl = imageurl; // <--- Update imageurl

//     await product.save();

//     // Populate before sending response
//     await product.populate("seller", "name email");
//     await product.populate("campaigns", "name status");

//     res.json({
//       message: "Product updated successfully",
//       product,
//     });
//   } catch (error) {
//     console.error("Update product error:", error);
//     if (error.name === "CastError") {
//       return res.status(400).json({ message: "Invalid product ID" });
//     }
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // DELETE /api/products/:id - Delete a product
// router.delete("/:id", auth, async (req, res) => {
//   try {
//     // Find product and ensure it belongs to the current user
//     const product = await Product.findOne({
//       _id: req.params.id,
//       seller: req.user.id,
//     });

//     if (!product) {
//       return res.status(404).json({ message: "Product not found" });
//     }

//     // Check if product has active campaigns
//     if (product.campaigns && product.campaigns.length > 0) {
//       return res.status(400).json({
//         message:
//           "Cannot delete product with active campaigns. Please delete campaigns first.",
//       });
//     }

//     await Product.findByIdAndDelete(req.params.id);

//     res.json({ message: "Product deleted successfully" });
//   } catch (error) {
//     console.error("Delete product error:", error);
//     if (error.name === "CastError") {
//       return res.status(400).json({ message: "Invalid product ID" });
//     }
//     res.status(500).json({ message: "Server error" });
//   }
// });

// module.exports = router;
const express = require("express");
const Product = require("../models/Product");
const auth = require("../middleware/auth");

const router = express.Router();

// POST /api/products - Create a new product
router.post("/", auth, async (req, res) => {
  try {
    const { name, amazonAsin, flipkartFsn, imageurl } = req.body;

    // Basic validation
    if (!name) {
      return res.status(400).json({ message: "Product name is required" });
    }

    // Validate at least one marketplace is provided
    if (!amazonAsin && !flipkartFsn) {
      return res.status(400).json({ 
        message: "At least one marketplace is required (Amazon ASIN or Flipkart FSN)" 
      });
    }

    // Validate ASIN format (Amazon ASINs are typically 10 characters)
    if (amazonAsin && (typeof amazonAsin !== 'string' || amazonAsin.length !== 10)) {
      return res.status(400).json({ 
        message: "Amazon ASIN must be a 10-character string" 
      });
    }

    // Validate FSN format (Flipkart FSNs are typically alphanumeric)
    if (flipkartFsn && (typeof flipkartFsn !== 'string' || flipkartFsn.length < 5)) {
      return res.status(400).json({ 
        message: "Flipkart FSN must be a valid string (minimum 5 characters)" 
      });
    }

    // Create product with current user as seller
    const product = new Product({
      name,
      seller: req.user.id,
      amazonAsin,
      flipkartFsn,
      campaigns: [],
      imageurl,
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
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    
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
      seller: req.user.id,
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
    const { name, amazonAsin, flipkartFsn, imageurl } = req.body;

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
    if (amazonAsin !== undefined) product.amazonAsin = amazonAsin;
    if (flipkartFsn !== undefined) product.flipkartFsn = flipkartFsn;
    if (imageurl !== undefined) product.imageurl = imageurl;

    // Validate at least one marketplace after update
    if (!product.amazonAsin && !product.flipkartFsn) {
      return res.status(400).json({ 
        message: "At least one marketplace is required (Amazon ASIN or Flipkart FSN)" 
      });
    }

    // Validate ASIN format if provided
    if (product.amazonAsin && (typeof product.amazonAsin !== 'string' || product.amazonAsin.length !== 10)) {
      return res.status(400).json({ 
        message: "Amazon ASIN must be a 10-character string" 
      });
    }

    // Validate FSN format if provided
    if (product.flipkartFsn && (typeof product.flipkartFsn !== 'string' || product.flipkartFsn.length < 5)) {
      return res.status(400).json({ 
        message: "Flipkart FSN must be a valid string (minimum 5 characters)" 
      });
    }

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
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
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

// GET /api/products/marketplace/:marketplace - Get products by marketplace
router.get("/marketplace/:marketplace", auth, async (req, res) => {
  try {
    const { marketplace } = req.params;
    let query = { seller: req.user.id };

    if (marketplace.toLowerCase() === 'amazon') {
      query.amazonAsin = { $exists: true, $ne: null };
    } else if (marketplace.toLowerCase() === 'flipkart') {
      query.flipkartFsn = { $exists: true, $ne: null };
    } else {
      return res.status(400).json({ message: "Invalid marketplace. Use 'amazon' or 'flipkart'" });
    }

    const products = await Product.find(query)
      .populate("seller", "name email")
      .populate("campaigns", "name status")
      .sort({ createdAt: -1 });

    res.json({
      marketplace,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("Get products by marketplace error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// In your products routes file
router.post("/bulk", auth, async (req, res) => {
  try {
    const products = req.body.products;
    if (!Array.isArray(products) || products.length === 0)
      return res.status(400).json({ message: "No products found in upload." });

    // Further validation can be done here
    const docs = products.map(({ name, flipkartFsn, amazonAsin, imageurl }) => ({
      name,
      flipkartFsn,
      amazonAsin,
      imageurl,
      seller: req.user.id,
    }));
    await Product.insertMany(docs);
    res.json({ message: "Bulk products uploaded successfully." });
  } catch (err) {
    res.status(500).json({ message: err.message || "Bulk upload failed." });
  }
});

module.exports = router;

