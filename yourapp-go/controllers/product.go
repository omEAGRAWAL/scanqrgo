package controllers

import (
	"context"
	"log"
	"net/http"
	"strings"
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

// CreateProductRequest represents the request body for creating a product
type CreateProductRequest struct {
	Name        string `json:"name" binding:"required"`
	AmazonASIN  string `json:"amazonAsin,omitempty"`
	FlipkartFSN string `json:"flipkartFsn,omitempty"`
	ImageURL    string `json:"imageurl,omitempty"`
}

// UpdateProductRequest represents the request body for updating a product
type UpdateProductRequest struct {
	Name        *string `json:"name,omitempty"`
	AmazonASIN  *string `json:"amazonAsin,omitempty"`
	FlipkartFSN *string `json:"flipkartFsn,omitempty"`
	ImageURL    *string `json:"imageurl,omitempty"` // Pointer to distinguish between empty and not provided
	

}

// BulkProductRequest represents the request for bulk product upload
type BulkProductRequest struct {
	Products []CreateProductRequest `json:"products" binding:"required,min=1"`
}

// CreateProduct creates a new product
func CreateProduct(c *gin.Context) {
	var req CreateProductRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		log.Printf("Validation error: %v", err)
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid request data",
		})
		return
	}

	// Validate at least one marketplace is provided
	if req.AmazonASIN == "" && req.FlipkartFSN == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "At least one marketplace is required (Amazon ASIN or Flipkart FSN)",
		})
		return
	}

	// Validate ASIN format (Amazon ASINs are typically 10 characters)
	if req.AmazonASIN != "" && len(req.AmazonASIN) != 10 {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Amazon ASIN must be a 10-character string",
		})
		return
	}

	// Validate FSN format (Flipkart FSNs are typically alphanumeric, minimum 5 characters)
	if req.FlipkartFSN != "" && len(req.FlipkartFSN) < 5 {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Flipkart FSN must be a valid string (minimum 5 characters)",
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

	// Create new product
	product := models.NewProduct()
	product.Name = req.Name
	product.Seller = userID
	product.AmazonASIN = req.AmazonASIN
	product.FlipkartFSN = req.FlipkartFSN
	product.ImageURL = req.ImageURL

	// Insert product
	result, err := db.Collection(product.CollectionName()).InsertOne(ctx, product)
	if err != nil {
		log.Printf("Database insert error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to create product"})
		return
	}

	product.ID = result.InsertedID.(primitive.ObjectID)

	c.JSON(http.StatusCreated, gin.H{
		"message": "Product created successfully",
		"product": product.ToResponse(),
	})
}

// GetProducts retrieves all products for the current user
func GetProducts(c *gin.Context) {
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

	// Find products with sorting
	findOptions := options.Find().SetSort(bson.D{{Key: "createdAt", Value: -1}})

	cursor, err := db.Collection("products").Find(ctx, bson.M{"seller": userID}, findOptions)
	if err != nil {
		log.Printf("Database error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Server error"})
		return
	}
	defer cursor.Close(ctx)

	var products []models.Product
	if err := cursor.All(ctx, &products); err != nil {
		log.Printf("Error decoding products: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Error decoding products"})
		return
	}

	// Initialize empty array if nil
	if products == nil {
		products = []models.Product{}
	}

	// Convert to response format
	productResponses := make([]*models.ProductResponse, len(products))
	for i, p := range products {
		productResponses[i] = p.ToResponse()
	}

	c.JSON(http.StatusOK, gin.H{
		"count":    len(products),
		"products": productResponses,
	})
}

// GetProductByID retrieves a specific product by ID
func GetProductByID(c *gin.Context) {
	userID, exists := middleware.GetUserID(c)
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Unauthorized"})
		return
	}

	productID, err := primitive.ObjectIDFromHex(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid product ID"})
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	db := config.GetMongoDB()
	if db == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Database connection error"})
		return
	}

	var product models.Product
	err = db.Collection("products").FindOne(ctx, bson.M{
		"_id":    productID,
		"seller": userID,
	}).Decode(&product)

	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusNotFound, gin.H{"message": "Product not found"})
		} else {
			log.Printf("Database error: %v", err)
			c.JSON(http.StatusInternalServerError, gin.H{"message": "Server error"})
		}
		return
	}

	c.JSON(http.StatusOK, product.ToResponse())
}

// UpdateProduct updates a product
func UpdateProduct(c *gin.Context) {
	userID, exists := middleware.GetUserID(c)
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Unauthorized"})
		return
	}

	productID, err := primitive.ObjectIDFromHex(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid product ID"})
		return
	}

	var req UpdateProductRequest
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

	// Get current product
	var product models.Product
	err = db.Collection("products").FindOne(ctx, bson.M{
		"_id":    productID,
		"seller": userID,
	}).Decode(&product)

	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusNotFound, gin.H{"message": "Product not found"})
		} else {
			log.Printf("Database error: %v", err)
			c.JSON(http.StatusInternalServerError, gin.H{"message": "Server error"})
		}
		return
	}

	// Build update document
	update := bson.M{"$set": bson.M{}}

	if req.Name != nil {
		product.Name = *req.Name
		update["$set"].(bson.M)["name"] = *req.Name
	}
	if req.AmazonASIN != nil {
		product.AmazonASIN = *req.AmazonASIN
		update["$set"].(bson.M)["amazonAsin"] = *req.AmazonASIN
	}
	if req.FlipkartFSN != nil {
		product.FlipkartFSN = *req.FlipkartFSN
		update["$set"].(bson.M)["flipkartFsn"] = *req.FlipkartFSN
	}
	if req.ImageURL != nil {
		product.ImageURL = *req.ImageURL
		update["$set"].(bson.M)["imageurl"] = *req.ImageURL
	}

	// Validate at least one marketplace after update
	if err := product.Validate(); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}

	// Validate ASIN format if provided
	if product.AmazonASIN != "" && len(product.AmazonASIN) != 10 {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Amazon ASIN must be a 10-character string",
		})
		return
	}

	// Validate FSN format if provided
	if product.FlipkartFSN != "" && len(product.FlipkartFSN) < 5 {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Flipkart FSN must be a valid string (minimum 5 characters)",
		})
		return
	}

	// Update product
	if len(update["$set"].(bson.M)) > 0 {
		_, err = db.Collection("products").UpdateOne(
			ctx,
			bson.M{"_id": productID, "seller": userID},
			update,
		)

		if err != nil {
			log.Printf("Database update error: %v", err)
			c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to update product"})
			return
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Product updated successfully",
		"product": product.ToResponse(),
	})
}

// DeleteProduct deletes a product
func DeleteProduct(c *gin.Context) {
	userID, exists := middleware.GetUserID(c)
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Unauthorized"})
		return
	}

	productID, err := primitive.ObjectIDFromHex(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid product ID"})
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	db := config.GetMongoDB()
	if db == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Database connection error"})
		return
	}

	// Get current product
	var product models.Product
	err = db.Collection("products").FindOne(ctx, bson.M{
		"_id":    productID,
		"seller": userID,
	}).Decode(&product)

	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusNotFound, gin.H{"message": "Product not found"})
		} else {
			log.Printf("Database error: %v", err)
			c.JSON(http.StatusInternalServerError, gin.H{"message": "Server error"})
		}
		return
	}

	// Check if product has active campaigns
	if product.Campaigns != nil && len(product.Campaigns) > 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Cannot delete product with active campaigns. Please delete campaigns first.",
		})
		return
	}

	// Delete product
	_, err = db.Collection("products").DeleteOne(ctx, bson.M{"_id": productID})
	if err != nil {
		log.Printf("Database delete error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to delete product"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Product deleted successfully"})
}

// GetProductsByMarketplace retrieves products filtered by marketplace
func GetProductsByMarketplace(c *gin.Context) {
	userID, exists := middleware.GetUserID(c)
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Unauthorized"})
		return
	}

	marketplace := strings.ToLower(c.Param("marketplace"))

	// Validate marketplace
	if marketplace != "amazon" && marketplace != "flipkart" {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid marketplace. Use 'amazon' or 'flipkart'",
		})
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	db := config.GetMongoDB()
	if db == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Database connection error"})
		return
	}

	// Build query based on marketplace
	query := bson.M{"seller": userID}
	if marketplace == "amazon" {
		query["amazonAsin"] = bson.M{"$exists": true, "$ne": ""}
	} else if marketplace == "flipkart" {
		query["flipkartFsn"] = bson.M{"$exists": true, "$ne": ""}
	}

	// Find products with sorting
	findOptions := options.Find().SetSort(bson.D{{Key: "createdAt", Value: -1}})

	cursor, err := db.Collection("products").Find(ctx, query, findOptions)
	if err != nil {
		log.Printf("Database error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Server error"})
		return
	}
	defer cursor.Close(ctx)

	var products []models.Product
	if err := cursor.All(ctx, &products); err != nil {
		log.Printf("Error decoding products: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Error decoding products"})
		return
	}

	// Initialize empty array if nil
	if products == nil {
		products = []models.Product{}
	}

	// Convert to response format
	productResponses := make([]*models.ProductResponse, len(products))
	for i, p := range products {
		productResponses[i] = p.ToResponse()
	}

	c.JSON(http.StatusOK, gin.H{
		"marketplace": marketplace,
		"count":       len(products),
		"products":    productResponses,
	})
}

// BulkCreateProducts creates multiple products at once
func BulkCreateProducts(c *gin.Context) {
	var req BulkProductRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		log.Printf("Validation error: %v", err)
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "No products found in upload.",
		})
		return
	}

	// Get user ID from context
	userID, exists := middleware.GetUserID(c)
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Unauthorized"})
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	db := config.GetMongoDB()
	if db == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Database connection error"})
		return
	}

	// Prepare products for bulk insert
	docs := make([]interface{}, len(req.Products))
	for i, p := range req.Products {
		product := models.NewProduct()
		product.Name = p.Name
		product.Seller = userID
		product.AmazonASIN = p.AmazonASIN
		product.FlipkartFSN = p.FlipkartFSN
		product.ImageURL = p.ImageURL

		// Validate each product
		if err := product.Validate(); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"message": "Product at index " + string(rune(i)) + ": " + err.Error(),
			})
			return
		}

		docs[i] = product
	}

	// Bulk insert
	result, err := db.Collection("products").InsertMany(ctx, docs)
	if err != nil {
		log.Printf("Bulk insert error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Bulk upload failed.",
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message":        "Bulk products uploaded successfully.",
		"insertedCount":  len(result.InsertedIDs),
	})
}
