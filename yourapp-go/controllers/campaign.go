package controllers

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"

	"yourapp/config"
	"yourapp/middleware"
	"yourapp/models"
)

// CreateCampaignRequest represents the request body for creating a campaign
type CreateCampaignRequest struct {
	Name                string                   `json:"name" binding:"required"`
	Category            string                   `json:"category" binding:"required"`
	Promotion           string                   `json:"promotion,omitempty"`
	Review              string                   `json:"review,omitempty"`
	Products            []string                 `json:"products" binding:"required,min=1"`
	FunnelSteps         []models.FunnelStep      `json:"funnelSteps"`
	ReviewMinimumLength int                      `json:"reviewMinimumLength"`
	EnableSmartFunnel   bool                     `json:"enableSmartFunnel"`
	PromotionSettings   models.PromotionSettings `json:"promotionSettings"`
	Customization       models.Customization     `json:"customization"`
}

// UpdateCampaignRequest represents the request body for updating a campaign
type UpdateCampaignRequest struct {
	Name                *string                   `json:"name,omitempty"`
	Status              *string                   `json:"status,omitempty"`
	Products            []string                  `json:"products,omitempty"`
	FunnelSteps         []models.FunnelStep       `json:"funnelSteps,omitempty"`
	ReviewMinimumLength *int                      `json:"reviewMinimumLength,omitempty"`
	EnableSmartFunnel   *bool                     `json:"enableSmartFunnel,omitempty"`
	PromotionSettings   *models.PromotionSettings `json:"promotionSettings,omitempty"`
	Customization       *models.Customization     `json:"customization,omitempty"`
}

// UpdateAnalyticsRequest represents the request body for updating analytics
type UpdateAnalyticsRequest struct {
	Scans       *int `json:"scans,omitempty"`
	Completions *int `json:"completions,omitempty"`
	Redemptions *int `json:"redemptions,omitempty"`
}

// GenerateQRCode generates a QR code URL for a campaign
func GenerateQRCode(campaignID primitive.ObjectID) string {
	return fmt.Sprintf("http://16.171.10.235:5000/campaign/%s", campaignID.Hex())
}

// CreateCampaign creates a new campaign
func CreateCampaign(c *gin.Context) {
	var req CreateCampaignRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		log.Printf("Validation error: %v", err)
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid request data",
		})
		return
	}

	// Validate category
	if req.Category != "promotion" && req.Category != "review" {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Category must be either 'promotion' or 'review'",
		})
		return
	}

	// Validate category-specific requirements
	if req.Category == "promotion" && req.Promotion == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Promotion ID is required for promotion campaigns",
		})
		return
	}

	// Get user ID from context
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

	// Convert product IDs to ObjectIDs
	productIDs := make([]primitive.ObjectID, len(req.Products))
	for i, pid := range req.Products {
		objID, err := primitive.ObjectIDFromHex(pid)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid product ID format"})
			return
		}
		productIDs[i] = objID
	}

	// Verify products belong to the user
	productCount, err := db.Collection("products").CountDocuments(ctx, bson.M{
		"_id":    bson.M{"$in": productIDs},
		"seller": userID,
	})
	if err != nil {
		log.Printf("Database error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Server error"})
		return
	}

	if int(productCount) != len(productIDs) {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "One or more products do not belong to you",
		})
		return
	}

	// Create new campaign with defaults
	campaign := models.NewCampaign()
	campaign.Name = req.Name
	campaign.Category = req.Category
	campaign.Seller = userID
	campaign.Products = productIDs

	// Set optional fields
	if req.ReviewMinimumLength > 0 {
		campaign.ReviewMinimumLength = req.ReviewMinimumLength
	}
	campaign.EnableSmartFunnel = req.EnableSmartFunnel

	// Merge customization settings
	if req.Customization.PrimaryColor != "" {
		campaign.Customization.PrimaryColor = req.Customization.PrimaryColor
	}
	if req.Customization.LogoURL != "" {
		campaign.Customization.LogoURL = req.Customization.LogoURL
	}
	if req.Customization.BackgroundStyle != "" {
		campaign.Customization.BackgroundStyle = req.Customization.BackgroundStyle
	}
	if req.Customization.CustomMessage != "" {
		campaign.Customization.CustomMessage = req.Customization.CustomMessage
	}

	// Merge promotion settings
	if req.PromotionSettings.CodeType != "" {
		campaign.PromotionSettings.CodeType = req.PromotionSettings.CodeType
	}
	if req.PromotionSettings.CodeValue != "" {
		campaign.PromotionSettings.CodeValue = req.PromotionSettings.CodeValue
	}
	if req.PromotionSettings.DeliveryType != "" {
		campaign.PromotionSettings.DeliveryType = req.PromotionSettings.DeliveryType
	}
	if req.PromotionSettings.MaxRedemptions > 0 {
		campaign.PromotionSettings.MaxRedemptions = req.PromotionSettings.MaxRedemptions
	}
	if req.PromotionSettings.ExpiryDate != nil {
		campaign.PromotionSettings.ExpiryDate = req.PromotionSettings.ExpiryDate
	}

	// Set funnel steps
	if req.FunnelSteps != nil {
		campaign.FunnelSteps = req.FunnelSteps
	}

	// Handle optional promotion/review IDs
	if req.Category == "promotion" && req.Promotion != "" {
		promotionID, err := primitive.ObjectIDFromHex(req.Promotion)
		if err == nil {
			campaign.Promotion = &promotionID
		}
	}

	if req.Category == "review" && req.Review != "" {
		reviewID, err := primitive.ObjectIDFromHex(req.Review)
		if err == nil {
			campaign.Review = &reviewID
		}
	}

	// Insert campaign
	result, err := db.Collection(campaign.CollectionName()).InsertOne(ctx, campaign)
	if err != nil {
		log.Printf("Database insert error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to create campaign"})
		return
	}

	campaignID := result.InsertedID.(primitive.ObjectID)

	// Generate QR code URL and update
	qrCodeURL := GenerateQRCode(campaignID)
	_, err = db.Collection(campaign.CollectionName()).UpdateOne(
		ctx,
		bson.M{"_id": campaignID},
		bson.M{"$set": bson.M{"qrCodeUrl": qrCodeURL}},
	)
	if err != nil {
		log.Printf("Failed to update QR code: %v", err)
	}

	campaign.ID = campaignID
	campaign.QRCodeURL = qrCodeURL

	c.JSON(http.StatusCreated, gin.H{
		"message":  "Campaign created successfully",
		"campaign": campaign,
	})
}

// GetCampaigns retrieves all campaigns for the current user
func GetCampaigns(c *gin.Context) {
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

	// Query parameters
	status := c.Query("status")
	category := c.Query("category")
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))

	// Build filter
	filter := bson.M{"seller": userID}

	if status != "" && (status == "active" || status == "paused" || status == "ended") {
		filter["status"] = status
	}

	if category != "" && (category == "review" || category == "promotion") {
		filter["category"] = category
	}

	skip := int64((page - 1) * limit)

	// Find campaigns
	findOptions := options.Find().
		SetSort(bson.D{{Key: "createdAt", Value: -1}}).
		SetLimit(int64(limit)).
		SetSkip(skip)

	cursor, err := db.Collection("campaigns").Find(ctx, filter, findOptions)
	if err != nil {
		log.Printf("Database error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Server error"})
		return
	}
	defer cursor.Close(ctx)

	var campaigns []models.Campaign
	if err := cursor.All(ctx, &campaigns); err != nil {
		log.Printf("Error decoding campaigns: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Error decoding campaigns"})
		return
	}

	// Initialize empty array if nil
	if campaigns == nil {
		campaigns = []models.Campaign{}
	}

	// Count total
	total, err := db.Collection("campaigns").CountDocuments(ctx, filter)
	if err != nil {
		log.Printf("Error counting documents: %v", err)
		total = 0
	}

	c.JSON(http.StatusOK, gin.H{
		"campaigns": campaigns,
		"pagination": gin.H{
			"current": page,
			"pages":   (total + int64(limit) - 1) / int64(limit),
			"total":   total,
		},
	})
}

// GetCampaignByID retrieves a specific campaign by ID
func GetCampaignByID(c *gin.Context) {
	userID, exists := middleware.GetUserID(c)
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Unauthorized"})
		return
	}

	campaignID, err := primitive.ObjectIDFromHex(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid campaign ID"})
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	db := config.GetMongoDB()
	if db == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Database connection error"})
		return
	}

	var campaign models.Campaign
	err = db.Collection("campaigns").FindOne(ctx, bson.M{
		"_id":    campaignID,
		"seller": userID,
	}).Decode(&campaign)

	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusNotFound, gin.H{"message": "Campaign not found"})
		} else {
			log.Printf("Database error: %v", err)
			c.JSON(http.StatusInternalServerError, gin.H{"message": "Server error"})
		}
		return
	}

	c.JSON(http.StatusOK, campaign)
}

// UpdateCampaign updates a campaign
func UpdateCampaign(c *gin.Context) {
	userID, exists := middleware.GetUserID(c)
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Unauthorized"})
		return
	}

	campaignID, err := primitive.ObjectIDFromHex(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid campaign ID"})
		return
	}

	var req UpdateCampaignRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid request data"})
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	db := config.GetMongoDB()
	if db == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Database connection error"})
		return
	}

	// Validate status
	if req.Status != nil && *req.Status != "active" && *req.Status != "paused" && *req.Status != "ended" {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid status"})
		return
	}

	// Build update document
	update := bson.M{
		"$set": bson.M{
			"updatedAt": time.Now(),
		},
	}

	if req.Name != nil {
		update["$set"].(bson.M)["name"] = *req.Name
	}
	if req.Status != nil {
		update["$set"].(bson.M)["status"] = *req.Status
	}
	if req.FunnelSteps != nil {
		update["$set"].(bson.M)["funnelSteps"] = req.FunnelSteps
	}
	if req.ReviewMinimumLength != nil {
		update["$set"].(bson.M)["reviewMinimumLength"] = *req.ReviewMinimumLength
	}
	if req.EnableSmartFunnel != nil {
		update["$set"].(bson.M)["enableSmartFunnel"] = *req.EnableSmartFunnel
	}
	if req.PromotionSettings != nil {
		update["$set"].(bson.M)["promotionSettings"] = req.PromotionSettings
	}
	if req.Customization != nil {
		update["$set"].(bson.M)["customization"] = req.Customization
	}

	// Handle products update
	if req.Products != nil && len(req.Products) > 0 {
		productIDs := make([]primitive.ObjectID, len(req.Products))
		for i, pid := range req.Products {
			objID, err := primitive.ObjectIDFromHex(pid)
			if err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid product ID format"})
				return
			}
			productIDs[i] = objID
		}

		// Verify products
		productCount, err := db.Collection("products").CountDocuments(ctx, bson.M{
			"_id":    bson.M{"$in": productIDs},
			"seller": userID,
		})
		if err != nil || int(productCount) != len(productIDs) {
			c.JSON(http.StatusBadRequest, gin.H{"message": "One or more products do not belong to you"})
			return
		}

		update["$set"].(bson.M)["products"] = productIDs
	}

	// Update campaign
	result, err := db.Collection("campaigns").UpdateOne(
		ctx,
		bson.M{"_id": campaignID, "seller": userID},
		update,
	)

	if err != nil {
		log.Printf("Database update error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to update campaign"})
		return
	}

	if result.MatchedCount == 0 {
		c.JSON(http.StatusNotFound, gin.H{"message": "Campaign not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Campaign updated successfully"})
}

// DeleteCampaign toggles campaign status between active and ended
func DeleteCampaign(c *gin.Context) {
	userID, exists := middleware.GetUserID(c)
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Unauthorized"})
		return
	}

	campaignID, err := primitive.ObjectIDFromHex(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid campaign ID"})
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	db := config.GetMongoDB()
	if db == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Database connection error"})
		return
	}

	// Get current campaign
	var campaign models.Campaign
	err = db.Collection("campaigns").FindOne(ctx, bson.M{
		"_id":    campaignID,
		"seller": userID,
	}).Decode(&campaign)

	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusNotFound, gin.H{"message": "Campaign not found"})
		} else {
			log.Printf("Database error: %v", err)
			c.JSON(http.StatusInternalServerError, gin.H{"message": "Server error"})
		}
		return
	}

	// Use the model method to toggle status
	campaign.ToggleStatus()

	_, err = db.Collection("campaigns").UpdateOne(
		ctx,
		bson.M{"_id": campaignID},
		bson.M{"$set": bson.M{"status": campaign.Status, "updatedAt": campaign.UpdatedAt}},
	)

	if err != nil {
		log.Printf("Database update error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to update campaign"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Campaign status updated successfully"})
}

// GetCampaignStats retrieves campaign statistics for dashboard
func GetCampaignStats(c *gin.Context) {
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

	// Count campaigns by status
	total, _ := db.Collection("campaigns").CountDocuments(ctx, bson.M{"seller": userID})
	active, _ := db.Collection("campaigns").CountDocuments(ctx, bson.M{"seller": userID, "status": "active"})
	paused, _ := db.Collection("campaigns").CountDocuments(ctx, bson.M{"seller": userID, "status": "paused"})
	ended := total - active - paused

	// Campaigns by category aggregation
	categoryPipeline := mongo.Pipeline{
		{{Key: "$match", Value: bson.D{{Key: "seller", Value: userID}}}},
		{{Key: "$group", Value: bson.D{
			{Key: "_id", Value: "$category"},
			{Key: "count", Value: bson.D{{Key: "$sum", Value: 1}}},
		}}},
	}

	categoryCursor, err := db.Collection("campaigns").Aggregate(ctx, categoryPipeline)
	if err != nil {
		log.Printf("Aggregation error: %v", err)
	}

	var categoryResults []bson.M
	if err == nil {
		categoryCursor.All(ctx, &categoryResults)
	}
	if categoryResults == nil {
		categoryResults = []bson.M{}
	}

	// Analytics summary aggregation
	analyticsPipeline := mongo.Pipeline{
		{{Key: "$match", Value: bson.D{{Key: "seller", Value: userID}}}},
		{{Key: "$group", Value: bson.D{
			{Key: "_id", Value: nil},
			{Key: "totalScans", Value: bson.D{{Key: "$sum", Value: "$analytics.totalScans"}}},
			{Key: "totalCompletions", Value: bson.D{{Key: "$sum", Value: "$analytics.totalCompletions"}}},
			{Key: "totalRedemptions", Value: bson.D{{Key: "$sum", Value: "$analytics.totalRedemptions"}}},
		}}},
	}

	analyticsCursor, err := db.Collection("campaigns").Aggregate(ctx, analyticsPipeline)
	analytics := gin.H{
		"totalScans":       0,
		"totalCompletions": 0,
		"totalRedemptions": 0,
	}

	if err == nil && analyticsCursor.Next(ctx) {
		var result bson.M
		analyticsCursor.Decode(&result)
		if result != nil {
			analytics = gin.H(result)
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"summary": gin.H{
			"total":  total,
			"active": active,
			"paused": paused,
			"ended":  ended,
		},
		"byCategory": categoryResults,
		"analytics":  analytics,
	})
}

// UpdateCampaignAnalytics updates campaign analytics
func UpdateCampaignAnalytics(c *gin.Context) {
	userID, exists := middleware.GetUserID(c)
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Unauthorized"})
		return
	}

	campaignID, err := primitive.ObjectIDFromHex(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid campaign ID"})
		return
	}

	var req UpdateAnalyticsRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid request data"})
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	db := config.GetMongoDB()
	if db == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Database connection error"})
		return
	}

	// Get current campaign
	var campaign models.Campaign
	err = db.Collection("campaigns").FindOne(ctx, bson.M{
		"_id":    campaignID,
		"seller": userID,
	}).Decode(&campaign)

	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusNotFound, gin.H{"message": "Campaign not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"message": "Server error"})
		}
		return
	}

	// Update analytics
	update := bson.M{}
	if req.Scans != nil {
		campaign.Analytics.TotalScans += *req.Scans
		update["analytics.totalScans"] = campaign.Analytics.TotalScans
	}
	if req.Completions != nil {
		campaign.Analytics.TotalCompletions += *req.Completions
		update["analytics.totalCompletions"] = campaign.Analytics.TotalCompletions
	}
	if req.Redemptions != nil {
		campaign.Analytics.TotalRedemptions += *req.Redemptions
		update["analytics.totalRedemptions"] = campaign.Analytics.TotalRedemptions
	}

	// Use model method to calculate conversion rate
	campaign.CalculateConversionRate()
	update["analytics.conversionRate"] = campaign.Analytics.ConversionRate
	update["updatedAt"] = time.Now()

	_, err = db.Collection("campaigns").UpdateOne(
		ctx,
		bson.M{"_id": campaignID},
		bson.M{"$set": update},
	)

	if err != nil {
		log.Printf("Database update error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to update analytics"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":   "Analytics updated successfully",
		"analytics": campaign.Analytics,
	})
}
