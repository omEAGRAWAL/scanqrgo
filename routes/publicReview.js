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
      { path: "products", select: "name amazonAsin flipkartFsn imageurl" },
      { path: "promotion", select: "name type description provider value" },
      { path: "seller", select: "organization name" },
    ]);

    if (!campaign)
      return res
        .status(404)
        .json({ message: "Campaign not found or inactive" });

    campaign.analytics.totalScans += 1;
    await campaign.save();

    res.json({
      campaign: {
        _id: campaign._id,
        name: campaign.name,
        seller: campaign.seller,
        category: campaign.category,
        products: campaign.products,
        promotion: campaign.promotion,
        reviewMinimumLength: campaign.reviewMinimumLength,
        customization: campaign.customization,
      },
    });
  } catch (error) {
    console.error("Get public campaign error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

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
      rating,
      clickedMarketplaceButton,
      marketplace,
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid campaign ID" });
    }

    // validate required fields
    if (
      !selectedProduct ||
      !orderNumber ||
      !satisfaction ||
      !customerName ||
      !email ||
      !review ||
      rating === undefined
    ) {
      return res
        .status(400)
        .json({ message: "Please fill all required fields" });
    }

    const campaign = await Campaign.findOne({
      _id: id,
      status: "active",
    }).populate(["promotion", "seller"]);

    if (!campaign) {
      return res
        .status(404)
        .json({ message: "Campaign not found or inactive" });
    }

    // check if product belongs to this campaign
    const productIds = campaign.products.map((p) => p.toString());
    if (!productIds.includes(String(selectedProduct))) {
      return res.status(400).json({ message: "Invalid product selection" });
    }

    // validate review length
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

    // // create funnel visit
    // const funnelVisit = new FunnelVisit({
    //   campaign: campaign._id,
    //   product: new mongoose.Types.ObjectId(selectedProduct),
    //   scannedAt: new Date(),
    //   analytics: campaign.analytics,
    //   stepData: {
    //     orderNumber,
    //     satisfaction,
    //     usedMoreDays,
    //     customerName,
    //     email,
    //     phoneNumber,
    //     review: shouldRequestReview ? review : null,
    //     shouldRequestReview,
    //   },
    // });
    // await funnelVisit.save();
    const funnelVisit = new FunnelVisit({
      campaign: campaign._id,
      seller: campaign.seller._id,
      product: new mongoose.Types.ObjectId(selectedProduct),
      scannedAt: new Date(),
      analytics: campaign.analytics,
      stepData: {
        orderNumber,
        satisfaction,
        usedMoreDays,
        customerName,
        email,
        phoneNumber,
        review: review, // still respect funnel logic
        rating,
        marketplace: marketplace || null,
        clickedMarketplaceButton: clickedMarketplaceButton || false,
        shouldRequestReview,
      },
    });
    await funnelVisit.save();

    // create review if required
    if (shouldRequestReview && review) {
      const newReview = await Review.create({
        campaign: campaign._id,
        marketplace: marketplace || null,
        product: new mongoose.Types.ObjectId(selectedProduct),
        funnelVisit: funnelVisit._id,
        customerName,
        email,
        phoneNumber,
        review,
        clickedMarketplaceButton: clickedMarketplaceButton || false,
        rating,
        seller: campaign.seller._id,
      });

      // link review back to funnelVisit
      await funnelVisit.updateOne({ $set: { review: newReview._id } });
    }

    // update analytics
    campaign.analytics.totalCompletions += 1;
    if (campaign.analytics.totalScans > 0) {
      campaign.analytics.conversionRate =
        (campaign.analytics.totalCompletions / campaign.analytics.totalScans) *
        100;
    }
    await campaign.save();

    // response
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

// GET all reviews owned by seller across campaigns (requires auth)
router.get("/reviews", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    //search in funnelvisit for the seller as user id and return all info
    const funnelVisits = await FunnelVisit.find({ seller: userId })
      .populate("campaign", "name")
      .populate("product", "name amazonAsin flipkartFsn imageurl")
      .sort({ createdAt: -1 })
      .lean();

    res.json(funnelVisits);
  } catch (error) {
    console.error("Get all reviews error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
