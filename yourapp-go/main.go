package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"

	"yourapp/config"
	"yourapp/routes"
)

func main() {
	// Load environment variables
	if err := godotenv.Load(); err != nil {
		log.Println("Warning: .env file not found, using system environment variables")
	}

	// Initialize MongoDB connection using config package
	if err := config.ConnectMongoDB(); err != nil {
		log.Fatalf("Failed to connect to MongoDB: %v", err)
	}
	defer config.DisconnectMongoDB()

	// Create indexes for optimization
	createIndexes()

	// Initialize Gin router
	router := setupRouter()

	// Get port from environment or default to 5000
	port := os.Getenv("PORT")
	if port == "" {
		port = "5000"
	}

	// Start server
	log.Printf("Server starting on port %s", port)
	if err := router.Run(":" + port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}

// setupRouter configures all routes and middleware
func setupRouter() *gin.Engine {
	// Set Gin mode based on environment
	if os.Getenv("GIN_MODE") == "release" {
		gin.SetMode(gin.ReleaseMode)
	}

	router := gin.Default()

	// CORS middleware - Allow all origins
	corsConfig := cors.Config{
		AllowAllOrigins:  true, // This allows all origins
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization", "Accept", "X-Requested-With"},
		ExposeHeaders:    []string{"Content-Length", "Content-Type"},
		AllowCredentials: false, // Must be false when allowing all origins
		MaxAge:           12 * time.Hour,
	}
	router.Use(cors.New(corsConfig))

	// Request logging middleware
	router.Use(requestLogger())

	// Recovery middleware (handles panics)
	router.Use(gin.Recovery())

	// API Routes - preserve exact paths from Node.js
	api := router.Group("/api")
	{
		routes.SetupUserRoutes(api.Group("/users"))
		routes.SetupProductRoutes(api.Group("/products"))
		routes.SetupPromotionRoutes(api.Group("/promotions"))
		routes.SetupCampaignRoutes(api.Group("/campaigns"))
		routes.SetupPublicRoutes(api.Group("/public"))
		// routes.SetupUploadRoutes(api.Group("/upload"))
		// routes.SetupAdminRoutes(api.Group("/admin"))
	}

	// Health check endpoint
	router.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status":  "healthy",
			"message": "Server is running",
			"time":    time.Now().Format(time.RFC3339),
		})
	})

	// Serve static files from client/dist directory
	router.Static("/assets", "./client/dist/assets")
	router.StaticFile("/favicon.ico", "./client/dist/favicon.ico")

	// Handle React routing - serve index.html for all non-API routes
	router.NoRoute(func(c *gin.Context) {
		// Don't serve index.html for API routes that don't exist
		if len(c.Request.URL.Path) >= 4 && c.Request.URL.Path[:4] == "/api" {
			c.JSON(http.StatusNotFound, gin.H{"error": "API endpoint not found"})
			return
		}
		c.File("./client/dist/index.html")
	})

	return router
}

// requestLogger is a custom middleware for detailed request logging
func requestLogger() gin.HandlerFunc {
	return func(c *gin.Context) {
		start := time.Now()
		path := c.Request.URL.Path
		method := c.Request.Method

		// Process request
		c.Next()

		// Log after request is processed
		duration := time.Since(start)
		statusCode := c.Writer.Status()

		// Log slow requests (> 1 second)
		if duration > time.Second {
			log.Printf("⚠️  SLOW REQUEST: %s %s - Status: %d - Duration: %v",
				method, path, statusCode, duration)
		}
	}
}

// createIndexes creates optimized indexes for all collections
func createIndexes() {
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	MongoDB := config.GetMongoDB()
	if MongoDB == nil {
		log.Println("Warning: Cannot create indexes - MongoDB is nil")
		return
	}

	log.Println("Creating MongoDB indexes...")

	// User indexes
	userIndexes := []mongo.IndexModel{
		{
			Keys:    map[string]interface{}{"email": 1},
			Options: options.Index().SetUnique(true),
		},
		{
			Keys: map[string]interface{}{"createdAt": -1},
		},
	}
	if _, err := MongoDB.Collection("users").Indexes().CreateMany(ctx, userIndexes); err != nil {
		log.Printf("Warning: Failed to create user indexes: %v", err)
	}

	// Product indexes
	productIndexes := []mongo.IndexModel{
		{
			Keys: map[string]interface{}{"seller": 1},
		},
		{
			Keys: map[string]interface{}{"createdAt": -1},
		},
		{
			Keys: map[string]interface{}{"seller": 1, "createdAt": -1},
		},
	}
	if _, err := MongoDB.Collection("products").Indexes().CreateMany(ctx, productIndexes); err != nil {
		log.Printf("Warning: Failed to create product indexes: %v", err)
	}

	// Campaign indexes
	campaignIndexes := []mongo.IndexModel{
		{
			Keys: map[string]interface{}{"seller": 1},
		},
		{
			Keys: map[string]interface{}{"status": 1},
		},
		{
			Keys: map[string]interface{}{"seller": 1, "createdAt": -1},
		},
		{
			Keys: map[string]interface{}{"seller": 1, "status": 1},
		},
	}
	if _, err := MongoDB.Collection("campaigns").Indexes().CreateMany(ctx, campaignIndexes); err != nil {
		log.Printf("Warning: Failed to create campaign indexes: %v", err)
	}

	// Review indexes
	reviewIndexes := []mongo.IndexModel{
		{
			Keys: map[string]interface{}{"campaign": 1},
		},
		{
			Keys: map[string]interface{}{"seller": 1},
		},
		{
			Keys: map[string]interface{}{"createdAt": -1},
		},
	}
	if _, err := MongoDB.Collection("reviews").Indexes().CreateMany(ctx, reviewIndexes); err != nil {
		log.Printf("Warning: Failed to create review indexes: %v", err)
	}

	// Promotion indexes
	promotionIndexes := []mongo.IndexModel{
		{
			Keys: map[string]interface{}{"owner": 1},
		},
		{
			Keys: map[string]interface{}{"status": 1},
		},
		{
			Keys: map[string]interface{}{"owner": 1, "createdAt": -1},
		},
	}
	if _, err := MongoDB.Collection("promotions").Indexes().CreateMany(ctx, promotionIndexes); err != nil {
		log.Printf("Warning: Failed to create promotion indexes: %v", err)
	}

	// FunnelVisit indexes
	funnelIndexes := []mongo.IndexModel{
		{
			Keys: map[string]interface{}{"campaign": 1},
		},
		{
			Keys: map[string]interface{}{"seller": 1},
		},
		{
			Keys: map[string]interface{}{"scannedAt": -1},
		},
		{
			Keys: map[string]interface{}{"campaign": 1, "scannedAt": -1},
		},
	}
	if _, err := MongoDB.Collection("funnelvisits").Indexes().CreateMany(ctx, funnelIndexes); err != nil {
		log.Printf("Warning: Failed to create funnel visit indexes: %v", err)
	}

	log.Println("✅ MongoDB indexes created successfully")
}
