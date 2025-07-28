const express = require("express");
const Promotion = require("../models/Promotion");
const auth = require("../middleware/auth");
const mongoose = require("mongoose");
const router = express.Router();

// POST /api/promotions - Create a new promotion
router.post("/", auth, async (req, res) => {
  try {
    const { name, type, description, provider, value, deliveryType } = req.body;

    // Basic validation
    if (!name || !type || !description) {
      return res.status(400).json({
        message: "Name, type, and description are required",
      });
    }

    // Validate type
    const validTypes = [
      "giftcard",
      "discount code",
      "extended warranty",
      "custom",
    ];
    if (!validTypes.includes(type)) {
      return res.status(400).json({
        message: "Invalid promotion type",
      });
    }

    // Create promotion with current user as owner
    const promotion = new Promotion({
      name,
      type,
      description,
      provider,
      value,
      deliveryType: deliveryType || "auto",
      owner: req.user.id,
    });

    await promotion.save();

    // Populate owner info before sending response
    await promotion.populate("owner", "name email");

    res.status(201).json({
      message: "Promotion created successfully",
      promotion,
    });
  } catch (error) {
    console.error("Create promotion error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/promotions - Get all promotions for the current user
router.get("/", auth, async (req, res) => {
  try {
    const { status, type } = req.query;

    // Build filter object
    const filter = { owner: req.user.id };

    if (status && ["active", "inactive"].includes(status)) {
      filter.status = status;
    }

    if (type) {
      filter.type = type;
    }

    const promotions = await Promotion.find(filter)
      .populate("owner", "name email")
      .sort({ createdAt: -1 });

    res.json({
      count: promotions.length,
      promotions,
    });
  } catch (error) {
    console.error("Get promotions error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/promotions/:id - Get a specific promotion by ID
router.get("/:id", auth, async (req, res) => {
  try {
    const promotion = await Promotion.findOne({
      _id: req.params.id,
      owner: req.user.id, // Ensure user can only access their own promotions
    }).populate("owner", "name email");

    if (!promotion) {
      return res.status(404).json({ message: "Promotion not found" });
    }

    res.json(promotion);
  } catch (error) {
    console.error("Get promotion error:", error);
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid promotion ID" });
    }
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/promotions/:id - Update a promotion
router.put("/:id", auth, async (req, res) => {
  try {
    const { name, type, description, provider, value, deliveryType, status } =
      req.body;

    // Find promotion and ensure it belongs to the current user
    const promotion = await Promotion.findOne({
      _id: req.params.id,
      owner: req.user.id,
    });

    if (!promotion) {
      return res.status(404).json({ message: "Promotion not found" });
    }

    // Validate type if provided
    if (type) {
      const validTypes = [
        "giftcard",
        "discount code",
        "extended warranty",
        "custom",
      ];
      if (!validTypes.includes(type)) {
        return res.status(400).json({ message: "Invalid promotion type" });
      }
    }

    // Validate status if provided
    if (status && !["active", "inactive"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    // Validate deliveryType if provided
    if (deliveryType && !["auto", "manual"].includes(deliveryType)) {
      return res.status(400).json({ message: "Invalid delivery type" });
    }

    // Update fields
    if (name) promotion.name = name;
    if (type) promotion.type = type;
    if (description) promotion.description = description;
    if (provider !== undefined) promotion.provider = provider;
    if (value !== undefined) promotion.value = value;
    if (deliveryType) promotion.deliveryType = deliveryType;
    if (status) promotion.status = status;

    await promotion.save();

    // Populate before sending response
    await promotion.populate("owner", "name email");

    res.json({
      message: "Promotion updated successfully",
      promotion,
    });
  } catch (error) {
    console.error("Update promotion error:", error);
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid promotion ID" });
    }
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE /api/promotions/:id - Delete a promotion
router.delete("/:id", auth, async (req, res) => {
  try {
    // Find promotion and ensure it belongs to the current user
    const promotion = await Promotion.findOne({
      _id: req.params.id,
      owner: req.user.id,
    });

    if (!promotion) {
      return res.status(404).json({ message: "Promotion not found" });
    }

    // Optional: Check if promotion is being used in any active campaigns
    // You can add this check based on your Campaign schema relationships

    await Promotion.findByIdAndDelete(req.params.id);

    res.json({ message: "Promotion deleted successfully" });
  } catch (error) {
    console.error("Delete promotion error:", error);
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid promotion ID" });
    }
    res.status(500).json({ message: "Server error" });
  }
});
// GET /api/promotions/stats/summary - Get promotion statistics (bonus endpoint)
router.get("/stats/summary", auth, async (req, res) => {
  try {
    // Validate user ID
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(req.user.id)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    // Run all queries concurrently for better performance
    const [
      totalPromotions,
      activePromotions,
      inactivePromotions,
      promotionsByType,
    ] = await Promise.all([
      Promotion.countDocuments({
        owner: req.user.id,
      }),
      Promotion.countDocuments({
        owner: req.user.id,
        status: "active",
      }),
      Promotion.countDocuments({
        owner: req.user.id,
        status: "inactive",
      }),
      Promotion.aggregate([
        {
          $match: {
            owner: new mongoose.Types.ObjectId(req.user.id),
          },
        },
        {
          $group: {
            _id: "$type",
            count: { $sum: 1 },
          },
        },
        {
          $sort: { count: -1 }, // Sort by count descending
        },
      ]),
    ]);

    // Validate results
    if (totalPromotions < 0 || activePromotions < 0 || inactivePromotions < 0) {
      throw new Error("Invalid count results from database");
    }

    // Ensure promotionsByType is an array
    const safePromotionsByType = Array.isArray(promotionsByType)
      ? promotionsByType
      : [];

    // Calculate additional stats
    const completionRate =
      totalPromotions > 0
        ? ((activePromotions / totalPromotions) * 100).toFixed(1)
        : 0;

    res.json({
      total: totalPromotions,
      active: activePromotions,
      inactive: inactivePromotions,
      completionRate: parseFloat(completionRate),
      byType: safePromotionsByType,
      summary: {
        hasPromotions: totalPromotions > 0,
        activePercentage:
          totalPromotions > 0
            ? parseFloat(
                ((activePromotions / totalPromotions) * 100).toFixed(1)
              )
            : 0,
        inactivePercentage:
          totalPromotions > 0
            ? parseFloat(
                ((inactivePromotions / totalPromotions) * 100).toFixed(1)
              )
            : 0,
      },
    });
  } catch (error) {
    console.error("Get promotion stats error:", error);

    // Handle specific error types
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid data format in request",
        error: "INVALID_DATA_FORMAT",
      });
    }

    if (error.name === "MongoError" || error.name === "MongoServerError") {
      return res.status(503).json({
        message: "Database temporarily unavailable",
        error: "DATABASE_ERROR",
      });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Data validation failed",
        error: "VALIDATION_ERROR",
      });
    }

    // Generic server error
    res.status(500).json({
      message: "Unable to fetch promotion statistics",
      error: "INTERNAL_SERVER_ERROR",
    });
  }
});

module.exports = router;
