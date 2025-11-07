package controllers

import (
	"context"
	"log"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"

	"yourapp/config"
	"yourapp/middleware"
	"yourapp/models"
)

// SubmitCampaignRequest represents the request body for campaign submission
type SubmitCampaignRequest struct {
	SelectedProduct          string `json:"selectedProduct" binding:"required"`
	OrderNumber              string `json:"orderNumber" binding:"required"`
	Satisfaction             string `json:"satisfaction" binding:"required"`
	UsedMoreDays             string `json:"usedMoreDays,omitempty"`
	CustomerName             string `json:"customerName" binding:"required"`
	Email                    string `json:"email" binding:"required,email"`
	PhoneNumber              string `json:"phoneNumber,omitempty"`
	Review                   string `json:"review" binding:"required"`
	Rating                   int    `json:"rating" binding:"required,min=1,max=5"`
	ClickedMarketplaceButton bool   `json:"clickedMarketplaceButton"`
	Marketplace              string `json:"marketplace,omitempty"`
}

// CampaignResponse represents the public campaign response
type CampaignResponse struct {
	Campaign struct {
		ID                  primitive.ObjectID      `json:"_id"`
		Name                string                  `json:"name"`
		Category            string                  `json:"category"`
		Seller              interface{}             `json:"seller"`
		Products            interface{}             `json:"products"`
		Promotion           interface{}             `json:"promotion,omitempty"`
		ReviewMinimumLength int                     `json:"reviewMinimumLength"`
		Customization       models.Customization    `json:"customization"`
	} `json:"campaign"`
}

// SubmitResponse represents the campaign submission response
type SubmitResponse struct {
	Success            bool        `json:"success"`
	Message            string      `json:"message"`
	ShouldShowReviewForm bool      `json:"shouldShowReviewForm"`
	ShouldShowReward   bool        `json:"shouldShowReward"`
	Reward             interface{} `json:"reward,omitempty"`
}

// GetPublicCampaign retrieves public campaign details (no auth required)
func GetPublicCampaign(c *gin.Context) {
	campaignID, err := primitive.ObjectIDFromHex(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid campaign ID"})
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	db := config.GetMongoDB()
	if db == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Database connection error"})
		return
	}

	// Find active campaign with populated fields
	var campaign models.Campaign
	err = db.Collection("campaigns").FindOne(ctx, bson.M{
		"_id":    campaignID,
		"status": "active",
	}).Decode(&campaign)

	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusNotFound, gin.H{"message": "Campaign not found or inactive"})
		} else {
			log.Printf("Database error: %v", err)
			c.JSON(http.StatusInternalServerError, gin.H{"message": "Server error"})
		}
		return
	}

	// Increment total scans
	_, err = db.Collection("campaigns").UpdateOne(
		ctx,
		bson.M{"_id": campaignID},
		bson.M{
			"$inc": bson.M{"analytics.totalScans": 1},
			"$set": bson.M{"updatedAt": time.Now()},
		},
	)
	if err != nil {
		log.Printf("Error updating scan count: %v", err)
	}

	// Fetch populated products
	var products []models.Product
	if len(campaign.Products) > 0 {
		productCursor, err := db.Collection("products").Find(ctx, bson.M{
			"_id": bson.M{"$in": campaign.Products},
		})
		if err == nil {
			productCursor.All(ctx, &products)
		}
	}

	// Fetch populated promotion if exists
	var promotion *models.Promotion
	if campaign.Promotion != nil {
		var promo models.Promotion
		err = db.Collection("promotions").FindOne(ctx, bson.M{
			"_id": *campaign.Promotion,
		}).Decode(&promo)
		if err == nil {
			promotion = &promo
		}
	}

	// Fetch seller info
	var seller struct {
		Organization string `bson:"organization" json:"organization"`
		Name         string `bson:"name" json:"name"`
		LogoURL      string `bson:"logoUrl" json:"logoUrl"`
	}
	db.Collection("users").FindOne(ctx, bson.M{
		"_id": campaign.Seller,
	}).Decode(&seller)

	// Build response
	response := CampaignResponse{}
	response.Campaign.ID = campaign.ID
	response.Campaign.Name = campaign.Name
	response.Campaign.Category = campaign.Category
	response.Campaign.Seller = seller
	response.Campaign.Products = products
	response.Campaign.Promotion = promotion
	response.Campaign.ReviewMinimumLength = campaign.ReviewMinimumLength
	response.Campaign.Customization = campaign.Customization

	c.JSON(http.StatusOK, response)
}

// SubmitCampaign handles campaign submission (no auth required)
func SubmitCampaign(c *gin.Context) {
	campaignID, err := primitive.ObjectIDFromHex(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid campaign ID"})
		return
	}

	var req SubmitCampaignRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		log.Printf("Validation error: %v", err)
		c.JSON(http.StatusBadRequest, gin.H{"message": "Please fill all required fields"})
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 15*time.Second)
	defer cancel()

	db := config.GetMongoDB()
	if db == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Database connection error"})
		return
	}

	// Find active campaign
	var campaign models.Campaign
	err = db.Collection("campaigns").FindOne(ctx, bson.M{
		"_id":    campaignID,
		"status": "active",
	}).Decode(&campaign)

	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusNotFound, gin.H{"message": "Campaign not found or inactive"})
		} else {
			log.Printf("Database error: %v", err)
			c.JSON(http.StatusInternalServerError, gin.H{"message": "Server error"})
		}
		return
	}

	// Validate product selection
	selectedProductID, err := primitive.ObjectIDFromHex(req.SelectedProduct)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid product ID"})
		return
	}

	productBelongsToCampaign := false
	for _, pid := range campaign.Products {
		if pid == selectedProductID {
			productBelongsToCampaign = true
			break
		}
	}

	if !productBelongsToCampaign {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid product selection"})
		return
	}

	// Validate review length for review campaigns
	if campaign.Category == "review" && len(req.Review) < campaign.ReviewMinimumLength {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Review must be at least " + string(rune(campaign.ReviewMinimumLength)) + " characters long",
		})
		return
	}

	// Determine if should request review
	shouldRequestReview := campaign.Category == "review" &&
		(!campaign.EnableSmartFunnel || req.Satisfaction == "Very satisfied")

	// Create funnel visit
	funnelVisit := models.NewFunnelVisit()
	funnelVisit.Campaign = campaignID
	funnelVisit.Seller = campaign.Seller
	funnelVisit.Product = selectedProductID
	funnelVisit.StepData = models.StepData{
		OrderNumber:              req.OrderNumber,
		Satisfaction:             req.Satisfaction,
		UsedMoreDays:             req.UsedMoreDays,
		CustomerName:             req.CustomerName,
		Email:                    req.Email,
		PhoneNumber:              req.PhoneNumber,
		Review:                   req.Review,
		Rating:                   req.Rating,
		Marketplace:              req.Marketplace,
		ClickedMarketplaceButton: req.ClickedMarketplaceButton,
		ShouldRequestReview:      shouldRequestReview,
	}

	funnelResult, err := db.Collection(funnelVisit.CollectionName()).InsertOne(ctx, funnelVisit)
	if err != nil {
		log.Printf("Error creating funnel visit: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Server error"})
		return
	}

	funnelVisitID := funnelResult.InsertedID.(primitive.ObjectID)

	// Create review if required
	if shouldRequestReview && req.Review != "" {
		review := models.NewReview()
		review.Campaign = campaignID
		review.Marketplace = req.Marketplace
		review.Product = selectedProductID
		review.FunnelVisit = funnelVisitID
		review.CustomerName = req.CustomerName
		review.Email = req.Email
		review.PhoneNumber = req.PhoneNumber
		review.Review = req.Review
		review.Rating = req.Rating
		review.ClickedMarketplaceButton = req.ClickedMarketplaceButton
		review.Seller = campaign.Seller

		reviewResult, err := db.Collection(review.CollectionName()).InsertOne(ctx, review)
		if err != nil {
			log.Printf("Error creating review: %v", err)
		} else {
			// Link review back to funnel visit
			reviewID := reviewResult.InsertedID.(primitive.ObjectID)
			db.Collection(funnelVisit.CollectionName()).UpdateOne(
				ctx,
				bson.M{"_id": funnelVisitID},
				bson.M{"$set": bson.M{"review": reviewID}},
			)
		}
	}

	// Update campaign analytics
	campaign.Analytics.TotalCompletions++
	campaign.CalculateConversionRate()

	updateFields := bson.M{
		"analytics.totalCompletions": campaign.Analytics.TotalCompletions,
		"analytics.conversionRate":   campaign.Analytics.ConversionRate,
		"updatedAt":                  time.Now(),
	}

	// Build response
	response := SubmitResponse{
		Success:              true,
		Message:              "Thank you for your feedback!",
		ShouldShowReviewForm: shouldRequestReview,
		ShouldShowReward:     false,
		Reward:               nil,
	}

	// Handle promotion rewards
	if campaign.Category == "promotion" &&
		(req.Satisfaction == "Very satisfied" || req.Satisfaction == "Somewhat satisfied") {
		
		// Fetch promotion details
		if campaign.Promotion != nil {
			var promotion models.Promotion
			err := db.Collection("promotions").FindOne(ctx, bson.M{
				"_id": *campaign.Promotion,
			}).Decode(&promotion)

			if err == nil {
				response.ShouldShowReward = true
				response.Reward = promotion
				response.Message = "Thank you! Here is your reward:"

				campaign.Analytics.TotalRedemptions++
				updateFields["analytics.totalRedemptions"] = campaign.Analytics.TotalRedemptions
			}
		}
	}

	// Update campaign
	_, err = db.Collection("campaigns").UpdateOne(
		ctx,
		bson.M{"_id": campaignID},
		bson.M{"$set": updateFields},
	)
	if err != nil {
		log.Printf("Error updating campaign analytics: %v", err)
	}

	c.JSON(http.StatusOK, response)
}

// GetAllReviews retrieves all funnel visits for authenticated seller
func GetAllReviews(c *gin.Context) {
	userID, exists := middleware.GetUserID(c)
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Unauthorized"})
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	db := config.GetMongoDB()
	if db == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Database connection error"})
		return
	}

	// Use aggregation pipeline to populate fields
	pipeline := mongo.Pipeline{
		{{Key: "$match", Value: bson.D{{Key: "seller", Value: userID}}}},
		{{Key: "$sort", Value: bson.D{{Key: "scannedAt", Value: -1}}}},
		{{Key: "$lookup", Value: bson.D{
			{Key: "from", Value: "campaigns"},
			{Key: "localField", Value: "campaign"},
			{Key: "foreignField", Value: "_id"},
			{Key: "as", Value: "campaignInfo"},
		}}},
		{{Key: "$lookup", Value: bson.D{
			{Key: "from", Value: "products"},
			{Key: "localField", Value: "product"},
			{Key: "foreignField", Value: "_id"},
			{Key: "as", Value: "productInfo"},
		}}},
		{{Key: "$unwind", Value: bson.D{
			{Key: "path", Value: "$campaignInfo"},
			{Key: "preserveNullAndEmptyArrays", Value: true},
		}}},
		{{Key: "$unwind", Value: bson.D{
			{Key: "path", Value: "$productInfo"},
			{Key: "preserveNullAndEmptyArrays", Value: true},
		}}},
		{{Key: "$project", Value: bson.D{
			{Key: "_id", Value: 1},
			{Key: "campaign", Value: bson.D{
				{Key: "_id", Value: "$campaignInfo._id"},
				{Key: "name", Value: "$campaignInfo.name"},
			}},
			{Key: "product", Value: bson.D{
				{Key: "_id", Value: "$productInfo._id"},
				{Key: "name", Value: "$productInfo.name"},
				{Key: "amazonAsin", Value: "$productInfo.amazonAsin"},
				{Key: "flipkartFsn", Value: "$productInfo.flipkartFsn"},
				{Key: "imageurl", Value: "$productInfo.imageurl"},
			}},
			{Key: "scannedAt", Value: 1},
			{Key: "stepData", Value: 1},
			{Key: "customerFeedback", Value: 1},
		}}},
	}

	cursor, err := db.Collection("funnelvisits").Aggregate(ctx, pipeline)
	if err != nil {
		log.Printf("Aggregation error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Server error"})
		return
	}
	defer cursor.Close(ctx)

	var funnelVisits []bson.M
	if err := cursor.All(ctx, &funnelVisits); err != nil {
		log.Printf("Error decoding funnel visits: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Error decoding results"})
		return
	}

	if funnelVisits == nil {
		funnelVisits = []bson.M{}
	}

	c.JSON(http.StatusOK, funnelVisits)
}
