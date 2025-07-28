const express = require('express');
const mongoose = require('mongoose');
const Campaign = require('../models/Campaign');
const Product = require('../models/Product');
const FunnelVisit = require('../models/FunnelVisit');

const router = express.Router();

// GET /api/public/campaign/:id - Get public campaign details
router.get('/campaign/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid campaign ID' });
    }

    const campaign = await Campaign.findOne({
      _id: id,
      status: 'active'
    }).populate([
      { path: 'products', select: 'name marketplace marketplaceProductId' },
      { path: 'promotion', select: 'name type description provider value' },
      { path: 'seller', select: 'name' }
    ]);

    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found or inactive' });
    }

    // Increment scan count
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
        seller: campaign.seller
      }
    });

  } catch (error) {
    console.error('Get public campaign error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/public/campaign/:id/submit - Submit campaign form
router.post('/campaign/:id/submit', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      selectedProduct,
      orderNumber,
      satisfaction,
      usedMoreThan7Days,
      customerName,
      email,
      phoneNumber,
      review
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid campaign ID' });
    }

    // Validate required fields
    if (!selectedProduct || !orderNumber || !satisfaction || !customerName || !email) {
      return res.status(400).json({ 
        message: 'Please fill all required fields' 
      });
    }

    const campaign = await Campaign.findOne({
      _id: id,
      status: 'active'
    }).populate('promotion');

    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found or inactive' });
    }

    // Validate product belongs to campaign
    if (!campaign.products.includes(selectedProduct)) {
      return res.status(400).json({ message: 'Invalid product selection' });
    }

    // Validate review length if it's a review campaign
    if (campaign.category === 'review' && review) {
      if (review.length < campaign.reviewMinimumLength) {
        return res.status(400).json({ 
          message: `Review must be at least ${campaign.reviewMinimumLength} characters long` 
        });
      }
    }

    // Check if smart funnel is enabled and user is not very satisfied
    const shouldRequestReview = campaign.category === 'review' && 
      (!campaign.enableSmartFunnel || satisfaction === 'Very Satisfied');

    // Create funnel visit record
    const funnelVisit = new FunnelVisit({
      campaign: campaign._id,
      product: selectedProduct,
      scannedAt: new Date(),
      customerFeedback: satisfaction,
      stepData: {
        orderNumber,
        satisfaction,
        usedMoreThan7Days,
        customerName,
        email,
        phoneNumber,
        review: shouldRequestReview ? review : null,
        shouldRequestReview
      }
    });

    await funnelVisit.save();

    // Update campaign analytics
    campaign.analytics.totalCompletions += 1;
    if (campaign.analytics.totalScans > 0) {
      campaign.analytics.conversionRate = 
        (campaign.analytics.totalCompletions / campaign.analytics.totalScans) * 100;
    }
    await campaign.save();

    // Prepare response based on campaign type and satisfaction
    let response = {
      success: true,
      message: 'Thank you for your feedback!',
      shouldShowReward: false,
      shouldShowReviewForm: shouldRequestReview,
      promotion: null
    };

    // If it's a promotion campaign and user is satisfied, show reward
    if (campaign.category === 'promotion' && 
        (satisfaction === 'Very Satisfied' || satisfaction === 'Somewhat Satisfied')) {
      response.shouldShowReward = true;
      response.promotion = campaign.promotion;
      response.message = 'Thank you! Here\'s your reward:';
      
      // Update redemption count
      campaign.analytics.totalRedemptions += 1;
      await campaign.save();
    }

    res.json(response);

  } catch (error) {
    console.error('Submit campaign form error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
