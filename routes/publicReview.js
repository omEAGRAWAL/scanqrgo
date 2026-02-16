const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config(); // Essential: Loads .env file to prevent "Unregistered caller" (403) errors
const { GoogleGenerativeAI } = require("@google/generative-ai");
const Campaign = require("../models/Campaign");
const Product = require("../models/Product");
const FunnelVisit = require("../models/FunnelVisit");
const Review = require("../models/Review");
const auth = require("../middleware/auth");
const router = express.Router();
const nodemailer = require("nodemailer");
require("dotenv").config();

// ─── Callback Chain Helpers ────────────────────────────────────────────

/**
 * Resolve a dot-path like "data.token" on an object.
 * e.g. getNestedValue({ data: { token: "abc" } }, "data.token") => "abc"
 */
function getNestedValue(obj, path) {
  return path.split(".").reduce((cur, key) => {
    if (cur === null || cur === undefined) return undefined;
    return cur[key];
  }, obj);
}

/**
 * Replace {{variable}} placeholders in a string.
 *  - {{fieldId}}           => value from formData[fieldId]
 *  - {{$response[0].path}} => dot-path into a previous response JSON
 */
function interpolateTemplate(template, formData, responses) {
  if (!template) return template;
  return template.replace(/\{\{([^}]+)\}\}/g, (match, content) => {
    // Check for default value syntax: {{ variable || default }}
    let key = content;
    let defaultValue = "";
    if (content.includes("||")) {
      const parts = content.split("||");
      key = parts[0].trim();
      defaultValue = parts.slice(1).join("||").trim();
      // Remove quotes from default value if present
      if ((defaultValue.startsWith('"') && defaultValue.endsWith('"')) ||
        (defaultValue.startsWith("'") && defaultValue.endsWith("'"))) {
        defaultValue = defaultValue.slice(1, -1);
      }
    } else {
      key = content.trim();
    }

    // Handle $response[N].path
    const respMatch = key.match(/^\$response\[(\d+)\]\.?(.*)$/);
    if (respMatch) {
      const idx = parseInt(respMatch[1], 10);
      const path = respMatch[2];
      if (idx < responses.length) {
        const val = path ? getNestedValue(responses[idx], path) : responses[idx];
        const res = (val !== undefined && val !== null && val !== "") ? val : defaultValue;
        return typeof res === "object" ? JSON.stringify(res) : String(res ?? "");
      }
      return defaultValue; // Index out of range, return default
    }

    // Handle form field values
    if (formData[key] !== undefined && formData[key] !== null && formData[key] !== "") {
      const val = formData[key];
      return typeof val === "object" ? JSON.stringify(val) : String(val);
    }

    // Return default value if variable not found or empty
    if (defaultValue !== "") return defaultValue;

    return match; // leave unknown placeholders as-is if no default
  });
}

/**
 * Execute the callback chain for a campaign after form submission.
 * Runs asynchronously — errors are logged but never thrown.
 */
async function executeCallbackChain(callbackUrls, formData) {
  if (!callbackUrls || callbackUrls.length === 0) return;

  const sorted = [...callbackUrls].sort((a, b) => (a.order || 0) - (b.order || 0));
  const responses = [];

  for (const cb of sorted) {
    try {
      const url = interpolateTemplate(cb.url, formData, responses);
      const method = (cb.method || "POST").toUpperCase();

      // Interpolate headers
      const headers = {};
      if (cb.headers && typeof cb.headers === "object") {
        for (const [k, v] of Object.entries(cb.headers)) {
          headers[k] = interpolateTemplate(v, formData, responses);
        }
      }

      // Interpolate body
      let body = undefined;
      if (cb.body && method !== "GET") {
        body = interpolateTemplate(cb.body, formData, responses);
      }

      // Set Content-Type if not explicitly set
      if (body && !headers["Content-Type"] && !headers["content-type"]) {
        headers["Content-Type"] = "application/json";
      }

      console.log(`🔗 Callback [${cb.name || "Unnamed"}]: ${method} ${url}`);
      console.log(`  📤 Headers:`, JSON.stringify(headers, null, 2));
      if (body) console.log(`  📤 Body:`, body);

      // Add default headers to prevent some 'fetch failed' issues
      if (!headers["User-Agent"]) headers["User-Agent"] = "ScanQRGo/1.0";
      if (!headers["Connection"]) headers["Connection"] = "keep-alive";

      const fetchOptions = {
        method,
        headers,
        // Increase timeout to 30s (requires AbortController but fetch defaults are loose in Node)
      };
      if (body) fetchOptions.body = body;



      // Retry logic (3 attempts)
      let resp;
      let attempt = 0;
      const maxRetries = 3;

      while (attempt < maxRetries) {
        try {
          if (attempt > 0) console.log(`  🔄 Retry attempt ${attempt}/${maxRetries}...`);
          resp = await fetch(url, fetchOptions);
          break; // Success, exit loop
        } catch (err) {
          attempt++;
          if (attempt >= maxRetries) throw err; // Final failure
          await new Promise(r => setTimeout(r, 1000 * attempt)); // Linear backoff: 1s, 2s
        }
      }

      let respData;
      const contentType = resp.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        respData = await resp.json();
      } else {
        respData = { _text: await resp.text(), _status: resp.status };
      }

      responses.push(respData);
      console.log(`  ✅ [${cb.name || "Unnamed"}] ${resp.status}`, JSON.stringify(respData).slice(0, 200));
    } catch (err) {
      console.error(`  ❌ Callback [${cb.name || "Unnamed"}] failed after retries:`, err.message);
      responses.push({ _error: err.message });
    }
  }
}
// Initialize Gemini
// Ensure GEMINI_API_KEY is set in your .env file
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// --- Email Configuration ---
// Make sure these are in your .env file:
// EMAIL_HOST=smtp.gmail.com (or your provider)
// EMAIL_PORT=587
// EMAIL_USER=your-email@gmail.com
// EMAIL_PASS=your-app-password
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: parseInt(process.env.EMAIL_PORT) || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false, // Accept self-signed certificates (for dev)
    ciphers: 'SSLv3'
  },
  connectionTimeout: 10000, // 10 seconds timeout
  greetingTimeout: 10000,
  socketTimeout: 10000,
});

// Helper Function: Send Confirmation Email
async function sendConfirmationEmail(
  recipientEmail,
  customerName,
  campaignName,
  reward
) {
  try {
    let subject = `Thank you for your feedback on ${campaignName}!`;
    let htmlContent = `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h2>Hi ${customerName},</h2>
        <p>Thank you for taking the time to share your feedback with us regarding <strong>${campaignName}</strong>.</p>
        <p>We truly appreciate your input as it helps us improve our products and services.</p>
    `;

    // Append Reward Info if applicable
    if (reward) {
      htmlContent += `
        <div style="background-color: #f0fdf4; padding: 15px; border-radius: 8px; border: 1px solid #bbf7d0; margin: 20px 0;">
          <h3 style="color: #166534; margin-top: 0;">🎁 Here is your Reward!</h3>
          <p><strong>Offer:</strong> ${reward.offerTitle}</p>
          ${reward.type === "discount code"
          ? `<p style="font-size: 18px; font-weight: bold; letter-spacing: 1px;">Code: ${reward.couponCode}</p>`
          : `<p><strong>Warranty:</strong> ${reward.warrantyPeriod} Months Extended Warranty Activated</p>`
        }
          <p style="font-size: 12px; color: #666;">${reward.termsAndConditions || ""
        }</p>
        </div>
      `;
    }

    htmlContent += `
        <p>Best Regards,<br/>The ${campaignName} Team</p>
      </div>
    `;

    await transporter.sendMail({
      from: `"Customer Support" <${process.env.EMAIL_USER}>`,
      to: recipientEmail,
      subject: subject,
      html: htmlContent,
    });
    console.log(`✅ Email sent successfully to ${recipientEmail}`);
  } catch (error) {
    console.error("❌ Error sending email:", error);
    console.error("⚠️  Email error details:", {
      code: error.code,
      command: error.command,
      response: error.response,
    });

    // Log helpful troubleshooting info
    if (error.code === 'EAUTH') {
      console.error('🔐 Gmail Authentication Failed!');
      console.error('   Please check:');
      console.error('   1. 2-Step Verification is enabled on your Google account');
      console.error('   2. You generated an App Password (not your regular password)');
      console.error('   3. The App Password in .env has no spaces');
      console.error('   4. Visit: https://myaccount.google.com/apppasswords');
    }
    // Don't throw error here to prevent blocking the HTTP response
  }
}

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
      { path: "products", select: "name amazonAsin flipkartFsn marketplaceSources imageurl" },
      {
        path: "promotion",
        select:
          "name offerTitle type warrantyPeriod couponCode termsAndConditions",
      },
      { path: "seller", select: "organization name  logoUrl" },
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
        inlinePromotion: campaign.inlinePromotion,
        reviewMinimumLength: campaign.reviewMinimumLength,
        customization: campaign.customization,
        formFields: campaign.formFields || [],
        callbackUrls: campaign.callbackUrls || [],
      },
    });
  } catch (error) {
    console.error("Get public campaign error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// router.post("/campaign/:id/submit", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const {
//       selectedProduct,
//       orderNumber,
//       satisfaction,
//       usedMoreDays,
//       customerName,
//       email,
//       phoneNumber,
//       review,
//       rating,
//       clickedMarketplaceButton,
//       marketplace,
//     } = req.body;

//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({ message: "Invalid campaign ID" });
//     }

//     // validate required fields
//     if (
//       !selectedProduct ||
//       !orderNumber ||
//       !satisfaction ||
//       !customerName ||
//       !email ||
//       !review ||
//       rating === undefined
//     ) {
//       return res
//         .status(400)
//         .json({ message: "Please fill all required fields" });
//     }

//     const campaign = await Campaign.findOne({
//       _id: id,
//       status: "active",
//     }).populate(["promotion", "seller"]);

//     if (!campaign) {
//       return res
//         .status(404)
//         .json({ message: "Campaign not found or inactive" });
//     }

//     // check if product belongs to this campaign
//     const productIds = campaign.products.map((p) => p.toString());
//     if (!productIds.includes(String(selectedProduct))) {
//       return res.status(400).json({ message: "Invalid product selection" });
//     }

//     // validate review length
//     if (campaign.category === "review" && review) {
//       if (review.length < campaign.reviewMinimumLength) {
//         return res.status(400).json({
//           message: `Review must be at least ${campaign.reviewMinimumLength} characters long`,
//         });
//       }
//     }

//     const shouldRequestReview =
//       campaign.category === "review" &&
//       (!campaign.enableSmartFunnel || satisfaction === "Very satisfied");

//     const funnelVisit = new FunnelVisit({
//       campaign: campaign._id,
//       seller: campaign.seller._id,
//       product: new mongoose.Types.ObjectId(selectedProduct),
//       scannedAt: new Date(),
//       analytics: campaign.analytics,
//       stepData: {
//         orderNumber,
//         satisfaction,
//         usedMoreDays,
//         customerName,
//         email,
//         phoneNumber,
//         review: review,
//         rating,
//         marketplace: marketplace || null,
//         clickedMarketplaceButton: clickedMarketplaceButton || false,
//         shouldRequestReview,
//       },
//     });
//     await funnelVisit.save();

//     // create review if required
//     if (shouldRequestReview && review) {
//       const newReview = await Review.create({
//         campaign: campaign._id,
//         marketplace: marketplace || null,
//         product: new mongoose.Types.ObjectId(selectedProduct),
//         funnelVisit: funnelVisit._id,
//         customerName,
//         email,
//         phoneNumber,
//         review,
//         clickedMarketplaceButton: clickedMarketplaceButton || false,
//         rating,
//         seller: campaign.seller._id,
//       });

//       // link review back to funnelVisit
//       await funnelVisit.updateOne({ $set: { review: newReview._id } });
//     }

//     // update analytics
//     campaign.analytics.totalCompletions += 1;
//     if (campaign.analytics.totalScans > 0) {
//       campaign.analytics.conversionRate =
//         (campaign.analytics.totalCompletions / campaign.analytics.totalScans) *
//         100;
//     }
//     await campaign.save();

//     // response
//     let response = {
//       success: true,
//       message: "Thank you for your feedback!",
//       shouldShowReviewForm: shouldRequestReview,
//       shouldShowReward: false,
//       reward: null,
//     };

//     if (
//       campaign.category === "promotion" &&
//       (satisfaction === "Very satisfied" ||
//         satisfaction === "Somewhat satisfied")
//     ) {
//       response.shouldShowReward = true;
//       response.reward = campaign.promotion;
//       response.message = "Thank you! Here is your reward:";
//       campaign.analytics.totalRedemptions += 1;
//       await campaign.save();
//     }

//     res.json(response);
//   } catch (error) {
//     console.error("Submit review error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// });
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
      customFields,
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid campaign ID" });
    }

    // validate only essential fields - accept any other input
    if (!selectedProduct) {
      return res
        .status(400)
        .json({ message: "Please select a product" });
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
        review: review,
        rating,
        marketplace: marketplace || null,
        clickedMarketplaceButton: clickedMarketplaceButton || false,
        shouldRequestReview,
      },
      customFields: customFields || {},
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

    // Determine reward logic
    let reward = null;
    let successMessage = "Thank you for your feedback!";
    let shouldShowReward = false;

    if (
      campaign.category === "promotion" &&
      (satisfaction === "Very satisfied" ||
        satisfaction === "Somewhat satisfied")
    ) {
      shouldShowReward = true;
      reward = campaign.promotion || campaign.inlinePromotion;
      successMessage = "Thank you! Here is your reward:";
      campaign.analytics.totalRedemptions += 1;
      await campaign.save();
    }

    // --- TRIGGER EMAIL ---
    // We send the email asynchronously so the user doesn't have to wait for SMTP
    // TODO: Uncomment after configuring Gmail App Password
    // sendConfirmationEmail(email, customerName, campaign.name, reward);
    console.log('📧 Email sending disabled - configure Gmail App Password to enable');
    // ---------------------

    res.json({
      success: true,
      message: successMessage,
      shouldShowReviewForm: shouldRequestReview,
      shouldShowReward: shouldShowReward,
      reward: reward,
    });

    // --- TRIGGER CALLBACK CHAIN (async, after response) ---
    if (campaign.callbackUrls && campaign.callbackUrls.length > 0) {
      const formData = {
        selectedProduct,
        orderNumber,
        satisfaction,
        usedMoreDays,
        customerName,
        email,
        phoneNumber,
        review,
        rating,
        marketplace,
        ...(customFields || {}),
      };
      executeCallbackChain(campaign.callbackUrls, formData).catch((err) =>
        console.error("Callback chain error:", err)
      );
    }
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

// GET reviews for a specific campaign (requires auth)
router.get("/campaign/:id/reviews", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Validate campaign ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid campaign ID" });
    }

    // Find funnel visits for this campaign and seller
    const funnelVisits = await FunnelVisit.find({
      campaign: id,
      seller: userId
    })
      .populate("campaign", "name")
      .populate("product", "name amazonAsin flipkartFsn imageurl")
      .sort({ createdAt: -1 })
      .lean();

    res.json(funnelVisits);
  } catch (error) {
    console.error("Get campaign reviews error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/analyze-reviews - Send data to Gemini for analysis
router.post("/analyze-reviews", auth, async (req, res) => {
  try {
    // Check API key again
    if (!process.env.GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY is missing from environment variables.");
      return res
        .status(500)
        .json({ message: "Server Error: AI Configuration Missing" });
    }

    const userId = req.user.id;

    // 1. Fetch relevant reviews (limit to last 50 to manage token limits)
    const visits = await FunnelVisit.find({
      seller: userId,
      "stepData.review": { $exists: true, $ne: "" }, // Only get entries with text reviews
    })
      .sort({ createdAt: -1 })
      .limit(50)
      .select("stepData.review stepData.rating stepData.satisfaction")
      .lean();

    if (!visits || visits.length === 0) {
      return res
        .status(404)
        .json({ message: "No text reviews found to analyze." });
    }

    // 2. Format data for the AI prompt
    const reviewsText = visits
      .map(
        (v, i) =>
          `Review ${i + 1}: [Rating: ${v.stepData.rating}/5, Satisfaction: ${v.stepData.satisfaction
          }] "${v.stepData.review}"`
      )
      .join("\n\n");

    // 3. Construct Prompt
    const prompt = `
      You are an expert Customer Experience Analyst. 
      Analyze the following ${visits.length} customer reviews and ratings.
      
      Provide a detailed report in Markdown format with these exact sections:
      1. 📊 **Executive Summary**: A 2-sentence overview of general sentiment.
      2. ⭐ **Key Strengths**: Bullet points of what customers love most.
      3. ⚠️ **Critical Pain Points**: Specific issues that keep appearing.
      4. 💡 **Actionable Recommendations**: 3 specific things the seller should do to improve ratings.
      
      Here are the reviews:
      ${reviewsText}
    `;

    // 4. Call Gemini API
    // Using gemini-1.5-flash as it is stable.
    // If you specifically have access to gemini-2.0-flash, you can change this string back.
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ analysis: text });
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    res.status(500).json({
      message: "Failed to generate analysis",
      error: error.message,
    });
  }
});

module.exports = router;
