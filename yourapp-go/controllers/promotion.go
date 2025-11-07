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
	"go.mongodb.org/mongo-driver/mongo/options"

	"yourapp/config"
	"yourapp/middleware"
	"yourapp/models"
)

// CreatePromotionRequest represents the request body for creating a promotion
type CreatePromotionRequest struct {
	Name               string `json:"name" binding:"required"`
	OfferTitle         string `json:"offerTitle" binding:"required"`
	Type               string `json:"type" binding:"required"`
	WarrantyPeriod     string `json:"warrantyPeriod,omitempty"`
	CouponCode         string `json:"couponCode,omitempty"`
	TermsAndConditions string `json:"termsAndConditions" binding:"required"`
	Description        string `json:"description,omitempty"`
	DeliveryType       string `json:"deliveryType,omitempty"`
	Status             string `json:"status,omitempty"`
}

// UpdatePromotionRequest represents the request body for updating a promotion
type UpdatePromotionRequest struct {
	Name               *string `json:"name,omitempty"`
	OfferTitle         *string `json:"offerTitle,omitempty"`
	Type               *string `json:"type,omitempty"`
	WarrantyPeriod     *string `json:"warrantyPeriod,omitempty"`
	CouponCode         *string `json:"couponCode,omitempty"`
	TermsAndConditions *string `json:"termsAndConditions,omitempty"`
	Description        *string `json:"description,omitempty"`
	DeliveryType       *string `json:"deliveryType,omitempty"`
	Status             *string `json:"status,omitempty"`
}

// CreatePromotion creates a new promotion
func CreatePromotion(c *gin.Context) {
	var req CreatePromotionRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		log.Printf("Validation error: %v", err)
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid request data",
		})
		return
	}

	// Validate type
	if req.Type != "discount code" && req.Type != "extended warranty" {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid promotion type. Must be 'discount code' or 'extended warranty'",
		})
		return
	}

	// Validate type-specific requirements
	if req.Type == "extended warranty" && req.WarrantyPeriod == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Warranty period is required for extended warranty promotions",
		})
		return
	}

	if req.Type == "discount code" && req.CouponCode == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Coupon code is required for discount code promotions",
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

	// Create new promotion with defaults
	promotion := models.NewPromotion()
	promotion.Name = req.Name
	promotion.OfferTitle = req.OfferTitle
	promotion.Type = req.Type
	promotion.TermsAndConditions = req.TermsAndConditions
	promotion.Owner = userID

	// Set description (default if not provided)
	if req.Description != "" {
		promotion.Description = req.Description
	} else {
		promotion.Description = "No description provided"
	}

	// Set optional fields based on type
	if req.Type == "extended warranty" {
		promotion.WarrantyPeriod = req.WarrantyPeriod
	}
	if req.Type == "discount code" {
		promotion.CouponCode = req.CouponCode
	}

	// Set delivery type and status if provided
	if req.DeliveryType != "" {
		promotion.DeliveryType = req.DeliveryType
	}
	if req.Status != "" {
		promotion.Status = req.Status
	}

	// Insert promotion
	result, err := db.Collection(promotion.CollectionName()).InsertOne(ctx, promotion)
	if err != nil {
		log.Printf("Database insert error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to create promotion"})
		return
	}

	promotion.ID = result.InsertedID.(primitive.ObjectID)

	c.JSON(http.StatusCreated, gin.H{
		"message":   "Promotion created successfully",
		"promotion": promotion,
	})
}

// GetPromotions retrieves all promotions for the current user
func GetPromotions(c *gin.Context) {
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
	promotionType := c.Query("type")

	// Build filter
	filter := bson.M{"owner": userID}

	if status != "" && (status == "active" || status == "inactive") {
		filter["status"] = status
	}

	if promotionType != "" {
		filter["type"] = promotionType
	}

	// Find promotions with sorting
	findOptions := options.Find().SetSort(bson.D{{Key: "createdAt", Value: -1}})

	cursor, err := db.Collection("promotions").Find(ctx, filter, findOptions)
	if err != nil {
		log.Printf("Database error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Server error"})
		return
	}
	defer cursor.Close(ctx)

	var promotions []models.Promotion
	if err := cursor.All(ctx, &promotions); err != nil {
		log.Printf("Error decoding promotions: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Error decoding promotions"})
		return
	}

	// Initialize empty array if nil
	if promotions == nil {
		promotions = []models.Promotion{}
	}

	c.JSON(http.StatusOK, gin.H{
		"count":      len(promotions),
		"promotions": promotions,
	})
}

// GetPromotionByID retrieves a specific promotion by ID
func GetPromotionByID(c *gin.Context) {
	userID, exists := middleware.GetUserID(c)
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Unauthorized"})
		return
	}

	promotionID, err := primitive.ObjectIDFromHex(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid promotion ID"})
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	db := config.GetMongoDB()
	if db == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Database connection error"})
		return
	}

	var promotion models.Promotion
	err = db.Collection("promotions").FindOne(ctx, bson.M{
		"_id":   promotionID,
		"owner": userID,
	}).Decode(&promotion)

	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusNotFound, gin.H{"message": "Promotion not found"})
		} else {
			log.Printf("Database error: %v", err)
			c.JSON(http.StatusInternalServerError, gin.H{"message": "Server error"})
		}
		return
	}

	c.JSON(http.StatusOK, promotion)
}

// UpdatePromotion updates a promotion
func UpdatePromotion(c *gin.Context) {
	userID, exists := middleware.GetUserID(c)
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Unauthorized"})
		return
	}

	promotionID, err := primitive.ObjectIDFromHex(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid promotion ID"})
		return
	}

	var req UpdatePromotionRequest
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

	// Get current promotion
	var promotion models.Promotion
	err = db.Collection("promotions").FindOne(ctx, bson.M{
		"_id":   promotionID,
		"owner": userID,
	}).Decode(&promotion)

	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusNotFound, gin.H{"message": "Promotion not found"})
		} else {
			log.Printf("Database error: %v", err)
			c.JSON(http.StatusInternalServerError, gin.H{"message": "Server error"})
		}
		return
	}

	// Validate type if provided
	if req.Type != nil {
		if *req.Type != "discount code" && *req.Type != "extended warranty" {
			c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid promotion type"})
			return
		}
	}

	// Validate status if provided
	if req.Status != nil && *req.Status != "active" && *req.Status != "inactive" {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid status"})
		return
	}

	// Validate delivery type if provided
	if req.DeliveryType != nil && *req.DeliveryType != "auto" && *req.DeliveryType != "manual" {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid delivery type"})
		return
	}

	// Build update document
	update := bson.M{"$set": bson.M{}}

	if req.Name != nil {
		update["$set"].(bson.M)["name"] = *req.Name
	}
	if req.OfferTitle != nil {
		update["$set"].(bson.M)["offerTitle"] = *req.OfferTitle
	}
	if req.Type != nil {
		update["$set"].(bson.M)["type"] = *req.Type
	}
	if req.WarrantyPeriod != nil {
		update["$set"].(bson.M)["warrantyPeriod"] = *req.WarrantyPeriod
	}
	if req.CouponCode != nil {
		update["$set"].(bson.M)["couponCode"] = *req.CouponCode
	}
	if req.TermsAndConditions != nil {
		update["$set"].(bson.M)["termsAndConditions"] = *req.TermsAndConditions
	}
	if req.Description != nil {
		update["$set"].(bson.M)["description"] = *req.Description
	}
	if req.DeliveryType != nil {
		update["$set"].(bson.M)["deliveryType"] = *req.DeliveryType
	}
	if req.Status != nil {
		update["$set"].(bson.M)["status"] = *req.Status
	}

	// Update promotion if there are changes
	if len(update["$set"].(bson.M)) > 0 {
		_, err = db.Collection("promotions").UpdateOne(
			ctx,
			bson.M{"_id": promotionID, "owner": userID},
			update,
		)

		if err != nil {
			log.Printf("Database update error: %v", err)
			c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to update promotion"})
			return
		}
	}

	// Fetch updated promotion
	err = db.Collection("promotions").FindOne(ctx, bson.M{
		"_id":   promotionID,
		"owner": userID,
	}).Decode(&promotion)

	if err != nil {
		log.Printf("Error fetching updated promotion: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to fetch updated promotion"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":   "Promotion updated successfully",
		"promotion": promotion,
	})
}

// DeletePromotion deletes a promotion
func DeletePromotion(c *gin.Context) {
	userID, exists := middleware.GetUserID(c)
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Unauthorized"})
		return
	}

	promotionID, err := primitive.ObjectIDFromHex(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid promotion ID"})
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	db := config.GetMongoDB()
	if db == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Database connection error"})
		return
	}

	// Check if promotion exists and belongs to user
	var promotion models.Promotion
	err = db.Collection("promotions").FindOne(ctx, bson.M{
		"_id":   promotionID,
		"owner": userID,
	}).Decode(&promotion)

	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusNotFound, gin.H{"message": "Promotion not found"})
		} else {
			log.Printf("Database error: %v", err)
			c.JSON(http.StatusInternalServerError, gin.H{"message": "Server error"})
		}
		return
	}

	// Optional: Check if promotion is being used in any active campaigns
	// Uncomment if you want to prevent deletion of promotions with active campaigns
	/*
	campaignCount, err := db.Collection("campaigns").CountDocuments(ctx, bson.M{
		"promotion": promotionID,
		"status": "active",
	})
	if err != nil {
		log.Printf("Error checking campaigns: %v", err)
	}
	if campaignCount > 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Cannot delete promotion with active campaigns",
		})
		return
	}
	*/

	// Delete promotion
	_, err = db.Collection("promotions").DeleteOne(ctx, bson.M{"_id": promotionID})
	if err != nil {
		log.Printf("Database delete error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to delete promotion"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Promotion deleted successfully"})
}

// GetPromotionStats retrieves promotion statistics for dashboard
func GetPromotionStats(c *gin.Context) {
	userID, exists := middleware.GetUserID(c)
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "User not authenticated"})
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	db := config.GetMongoDB()
	if db == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Database connection error"})
		return
	}

	// Count promotions by status
	total, err := db.Collection("promotions").CountDocuments(ctx, bson.M{"owner": userID})
	if err != nil {
		log.Printf("Error counting total promotions: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "DATABASE_ERROR",
			"error":   "Unable to fetch promotion statistics",
		})
		return
	}

	active, err := db.Collection("promotions").CountDocuments(ctx, bson.M{
		"owner":  userID,
		"status": "active",
	})
	if err != nil {
		log.Printf("Error counting active promotions: %v", err)
		active = 0
	}

	inactive, err := db.Collection("promotions").CountDocuments(ctx, bson.M{
		"owner":  userID,
		"status": "inactive",
	})
	if err != nil {
		log.Printf("Error counting inactive promotions: %v", err)
		inactive = 0
	}

	// Promotions by type aggregation
	typePipeline := mongo.Pipeline{
		{{Key: "$match", Value: bson.D{{Key: "owner", Value: userID}}}},
		{{Key: "$group", Value: bson.D{
			{Key: "_id", Value: "$type"},
			{Key: "count", Value: bson.D{{Key: "$sum", Value: 1}}},
		}}},
		{{Key: "$sort", Value: bson.D{{Key: "count", Value: -1}}}},
	}

	typeCursor, err := db.Collection("promotions").Aggregate(ctx, typePipeline)
	if err != nil {
		log.Printf("Aggregation error: %v", err)
	}

	var typeResults []bson.M
	if err == nil {
		typeCursor.All(ctx, &typeResults)
	}
	if typeResults == nil {
		typeResults = []bson.M{}
	}

	// Calculate completion rate (active/total percentage)
	var completionRate float64
	if total > 0 {
		completionRate = (float64(active) / float64(total)) * 100
	}

	// Calculate percentages
	var activePercentage, inactivePercentage float64
	if total > 0 {
		activePercentage = (float64(active) / float64(total)) * 100
		inactivePercentage = (float64(inactive) / float64(total)) * 100
	}

	c.JSON(http.StatusOK, gin.H{
		"total":          total,
		"active":         active,
		"inactive":       inactive,
		"completionRate": completionRate,
		"byType":         typeResults,
		"summary": gin.H{
			"hasPromotions":      total > 0,
			"activePercentage":   activePercentage,
			"inactivePercentage": inactivePercentage,
		},
	})
}
