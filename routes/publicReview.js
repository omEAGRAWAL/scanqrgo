const express = require("express");
const mongoose = require("mongoose");
const Campaign = require("../models/Campaign");
const Product = require("../models/Product");
const FunnelVisit = require("../models/FunnelVisit");
const Review = require("../models/Review");
const auth = require("../middleware/auth");

const router = express.Router();

// GET /api/public/campaign/:id - get public campaign details
router.get("/campaign/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: "Invalid campaign ID" });

    const campaign = await Campaign.findOne({
      _id: id,
      status: "active",
    }).populate([
      { path: "products", select: "name marketplace marketplaceProductId" },
      { path: "promotion", select: "name type description provider value" },
      { path: "seller", select: "name" }, // seller is campaign owner
    ]);

    if (!campaign)
      return res
        .status(404)
        .json({ message: "Campaign not found or inactive" });

    // Increment scan count and save
    campaign.analytics.totalScans += 1;
    await campaign.save();

    res.json({
      campaign: {
        _id: campaign._id,
        name: campaign.name,
        category: campaign.category,
        products: campaign.products,
        promotion: campaign.promotion,
        reviewMinimumLength: campaign.reviewMinimumLength,
        customization: campaign.customization,
        seller: campaign.seller, // campaign owner info
      },
    });
  } catch (error) {
    console.error("Get public campaign error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/public/campaign/:id/submit - public route to submit review
router.post("/campaign/:id/submit", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      selectedProduct,
      orderNumber,
      satisfaction,
      usedMoreDays,
      customerName,
      email,
      phoneNumber,
      review,
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: "Invalid campaign ID" });

    if (
      !selectedProduct ||
      !orderNumber ||
      !satisfaction ||
      !customerName ||
      !email
    )
      return res
        .status(400)
        .json({ message: "Please fill all required fields" });

    const campaign = await Campaign.findOne({
      _id: id,
      status: "active",
    }).populate(["promotion", "seller"]);

    if (!campaign)
      return res
        .status(404)
        .json({ message: "Campaign not found or inactive" });

    if (!campaign.products.includes(selectedProduct))
      return res.status(400).json({ message: "Invalid product selection" });

    if (campaign.category === "review" && review) {
      if (review.length < campaign.reviewMinimumLength) {
        return res.status(400).json({
          message: `Review must be at least ${campaign.reviewMinimumLength} characters long`,
        });
      }
    }

    const shouldRequestReview =
      campaign.category === "review" &&
      (!campaign.enableSmartFunnel || satisfaction === "Very satisfied");

    const funnelVisit = new FunnelVisit({
      campaign: campaign._id,
      product: selectedProduct,
      scannedAt: new Date(),
      analytics: campaign.analytics,
      stepData: {
        orderNumber,
        satisfaction,
        usedMoreDays,
        customerName,
        email,
        phoneNumber,
        review: shouldRequestReview ? review : null,
        shouldRequestReview,
      },
    });

    await funnelVisit.save();

    if (shouldRequestReview && review) {
      await Review.create({
        campaign: campaign._id,
        product: selectedProduct,
        funnelVisit: funnelVisit._id,
        customerName,
        email,
        phoneNumber,
        review,
        seller: campaign.seller._id, // Updated to seller
      });
    }

    // Update campaign analytics
    campaign.analytics.totalCompletions += 1;
    if (campaign.analytics.totalScans > 0) {
      campaign.analytics.conversionRate =
        (campaign.analytics.totalCompletions / campaign.analytics.totalScans) *
        100;
    }
    await campaign.save();

    let response = {
      success: true,
      message: "Thank you for your feedback!",
      shouldShowReviewForm: shouldRequestReview,
      shouldShowReward: false,
      reward: null,
    };
    if (
      campaign.category === "promotion" &&
      (satisfaction === "Very satisfied" ||
        satisfaction === "Somewhat satisfied")
    ) {
      response.shouldShowReward = true;
      response.reward = campaign.promotion;
      response.message = "Thank you! Here is your reward:";
      campaign.analytics.totalRedemptions += 1;
      await campaign.save();
    }
    res.json(response);
  } catch (error) {
    console.error("Submit review error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// GET reviews for a campaign - only campaign owner (seller) can access

router.get("/campaign/:id/reviews", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Validate campaign ID
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid campaign ID" });
    }

    // Find campaign and ensure seller matches userId
    const campaign = await Campaign.findOne({ _id: id }).lean();
    console.log("Campaign found:", campaign);

    if (!campaign || campaign.seller.toString() !== userId) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Pagination parameters
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const skip = (page - 1) * limit;

    // Convert userId to ObjectId safely
    const sellerObjectId = new mongoose.Types.ObjectId(userId);

    // Count total reviews
    const totalReviews = await Review.countDocuments({
      campaign: id,
      seller: sellerObjectId,
    });

    // Get paginated reviews, populate product name
    const reviews = await Review.find({
      campaign: id,
      seller: sellerObjectId,
    })
      .populate("product", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    res.json({
      total: totalReviews,
      page,
      pageSize: reviews.length,
      totalPages: Math.ceil(totalReviews / limit),
      reviews,
    });
  } catch (error) {
    console.error("Get campaign reviews error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET all reviews owned by seller across campaigns (requires auth)
router.get("/reviews", auth, async (req, res) => {
  try {
    const userId = req.user.id;

    // Pagination support (optional)
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const skip = (page - 1) * limit;

    // Count total reviews
    const totalReviews = await Review.countDocuments({ seller: userId });

    // Fetch paged reviews, populate campaign and product names
    const reviews = await Review.find({ seller: userId })
      .populate("campaign", "name")
      .populate("product", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    res.json({
      total: totalReviews,
      page,
      pageSize: reviews.length,
      totalPages: Math.ceil(totalReviews / limit),
      reviews,
    });
  } catch (error) {
    console.error("Get all reviews error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
