const express = require("express");
const Campaign = require("../models/Campaign");
const Product = require("../models/Product");
const Promotion = require("../models/Promotion");
const auth = require("../middleware/auth");
const mongoose = require("mongoose");
const router = express.Router();

// Helper function to generate QR code URL (placeholder implementation)
function generateQRCode(campaignId) {
  return `http://16.171.10.235:5000/campaign/${campaignId}`;
}

// POST /api/campaigns - Create a new campaign
router.post("/", auth, async (req, res) => {
  try {
    const {
      name,
      category,
      promotion,
      review,
      products,
      funnelSteps,
      reviewMinimumLength,
      enableSmartFunnel,
      promotionSettings,
      customization,
    } = req.body;

    // Basic validation
    if (!name || !category || !products || products.length === 0) {
      return res.status(400).json({
        message: "Name, category, and at least one product are required",
      });
    }

    // Validate category-specific requirements
    if (category === "promotion" && !promotion) {
      return res.status(400).json({
        message: "Promotion ID is required for promotion campaigns",
      });
    }

    // if (category === "review" && !review) {
    //   return res.status(400).json({
    //     message: "Review configuration is required for review campaigns",
    //   });
    // }

    // Verify products belong to the user
    const userProducts = await Product.find({
      _id: { $in: products },
      seller: req.user.id,
    });

    if (userProducts.length !== products.length) {
      return res.status(400).json({
        message: "One or more products do not belong to you",
      });
    }

    // Create campaign
    const campaign = new Campaign({
      name,
      category,
      seller: req.user.id,
      promotion: category === "promotion" ? promotion : undefined,
      review: category === "review" ? review : undefined,
      products,
      funnelSteps: funnelSteps || [],
      reviewMinimumLength: reviewMinimumLength || 10,
      enableSmartFunnel: enableSmartFunnel || false,
      promotionSettings:
        category === "promotion" ? promotionSettings : undefined,
      customization: customization || {},
    });

    await campaign.save();

    // Generate QR code URL
    campaign.qrCodeUrl = generateQRCode(campaign._id);
    await campaign.save();

    // Populate references before sending response
    await campaign.populate([
      { path: "seller", select: "name email" },
      { path: "products", select: "name marketplace" },
      { path: "promotion", select: "name type description" },
    ]);

    res.status(201).json({
      message: "Campaign created successfully",
      campaign,
    });
  } catch (error) {
    console.error("Create campaign error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/campaigns - Get all campaigns for the current user
router.get("/", auth, async (req, res) => {
  try {
    const { status, category, page = 1, limit = 10 } = req.query;

    // Build filter object
    const filter = { seller: req.user.id };

    if (status && ["active", "paused", "ended"].includes(status)) {
      filter.status = status;
    }

    if (category && ["review", "promotion"].includes(category)) {
      filter.category = category;
    }

    const skip = (page - 1) * limit;

    const campaigns = await Campaign.find(filter)
      .populate([
        { path: "seller", select: "name email" },
        { path: "products", select: "name marketplace" },
        { path: "promotion", select: "name type description" },
      ])
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip(skip);

    const total = await Campaign.countDocuments(filter);

    res.json({
      campaigns,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
      },
    });
  } catch (error) {
    console.error("Get campaigns error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/campaigns/:id - Get a specific campaign by ID
router.get("/:id", auth, async (req, res) => {
  try {
    const campaign = await Campaign.findOne({
      _id: req.params.id,
      seller: req.user.id,
    }).populate([
      { path: "seller", select: "name email" },
      { path: "products", select: "name marketplace marketplaceProductId" },
      { path: "promotion", select: "name type description provider value" },
    ]);

    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }

    res.json(campaign);
  } catch (error) {
    console.error("Get campaign error:", error);
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid campaign ID" });
    }
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/campaigns/:id - Update a campaign
router.put("/:id", auth, async (req, res) => {
  try {
    const {
      name,
      status,
      products,
      funnelSteps,
      reviewMinimumLength,
      enableSmartFunnel,
      promotionSettings,
      customization,
    } = req.body;

    const campaign = await Campaign.findOne({
      _id: req.params.id,
      seller: req.user.id,
    });

    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }

    // Validate status if provided
    if (status && !["active", "paused", "ended"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    // Verify products belong to the user if products are being updated
    if (products && products.length > 0) {
      const userProducts = await Product.find({
        _id: { $in: products },
        seller: req.user.id,
      });

      if (userProducts.length !== products.length) {
        return res.status(400).json({
          message: "One or more products do not belong to you",
        });
      }
    }

    // Update fields
    if (name) campaign.name = name;
    if (status) campaign.status = status;
    if (products) campaign.products = products;
    if (funnelSteps) campaign.funnelSteps = funnelSteps;
    if (reviewMinimumLength !== undefined)
      campaign.reviewMinimumLength = reviewMinimumLength;
    if (enableSmartFunnel !== undefined)
      campaign.enableSmartFunnel = enableSmartFunnel;
    if (promotionSettings)
      campaign.promotionSettings = {
        ...campaign.promotionSettings,
        ...promotionSettings,
      };
    if (customization)
      campaign.customization = { ...campaign.customization, ...customization };

    await campaign.save();

    // Populate before sending response
    await campaign.populate([
      { path: "seller", select: "name email" },
      { path: "products", select: "name marketplace" },
      { path: "promotion", select: "name type description" },
    ]);

    res.json({
      message: "Campaign updated successfully",
      campaign,
    });
  } catch (error) {
    console.error("Update campaign error:", error);
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid campaign ID" });
    }
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE /api/campaigns/:id - change status

//update status if active make it ended  and if ended than active

router.delete("/:id", auth, async (req, res) => {
  try {
    const campaign = await Campaign.findOne({
      _id: req.params.id,
      seller: req.user.id,
    });

    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }

    //update status if active make it ended  and if ended than active
    campaign.status = campaign.status === "active" ? "ended" : "active";
    await campaign.save();

    // await Campaign.findByIdAndDelete(req.params.id);

    res.json({ message: "Campaign deleted successfully" });
  } catch (error) {
    console.error("Delete campaign error:", error);
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid campaign ID" });
    }
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/campaigns/stats/dashboard - Get campaign statistics
router.get("/stats/dashboard", auth, async (req, res) => {
  try {
    const totalCampaigns = await Campaign.countDocuments({
      seller: req.user.id,
    });
    const activeCampaigns = await Campaign.countDocuments({
      seller: req.user.id,
      status: "active",
    });
    const pausedCampaigns = await Campaign.countDocuments({
      seller: req.user.id,
      status: "paused",
    });

    // Count by category
    const campaignsByCategory = await Campaign.aggregate([
      { $match: { seller: new mongoose.Types.ObjectId(req.user.id) } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);

    // Analytics summary
    const analyticsData = await Campaign.aggregate([
      { $match: { seller: new mongoose.Types.ObjectId(req.user.id) } },
      {
        $group: {
          _id: null,
          totalScans: { $sum: "$analytics.totalScans" },
          totalCompletions: { $sum: "$analytics.totalCompletions" },
          totalRedemptions: { $sum: "$analytics.totalRedemptions" },
        },
      },
    ]);

    const analytics = analyticsData[0] || {
      totalScans: 0,
      totalCompletions: 0,
      totalRedemptions: 0,
    };

    res.json({
      summary: {
        total: totalCampaigns,
        active: activeCampaigns,
        paused: pausedCampaigns,
        ended: totalCampaigns - activeCampaigns - pausedCampaigns,
      },
      byCategory: campaignsByCategory,
      analytics,
    });
  } catch (error) {
    console.error("Get campaign stats error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/campaigns/:id/analytics - Update campaign analytics (for tracking scans/completions)
router.put("/:id/analytics", auth, async (req, res) => {
  try {
    const { scans, completions, redemptions } = req.body;

    const campaign = await Campaign.findOne({
      _id: req.params.id,
      seller: req.user.id,
    });

    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }

    // Update analytics
    if (scans !== undefined) campaign.analytics.totalScans += scans;
    if (completions !== undefined)
      campaign.analytics.totalCompletions += completions;
    if (redemptions !== undefined)
      campaign.analytics.totalRedemptions += redemptions;

    // Recalculate conversion rate
    if (campaign.analytics.totalScans > 0) {
      campaign.analytics.conversionRate =
        (campaign.analytics.totalCompletions / campaign.analytics.totalScans) *
        100;
    }

    await campaign.save();

    res.json({
      message: "Analytics updated successfully",
      analytics: campaign.analytics,
    });
  } catch (error) {
    console.error("Update analytics error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
