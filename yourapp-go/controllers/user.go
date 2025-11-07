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
	"yourapp/utils"
)

// RegisterRequest represents the registration request body
type RegisterRequest struct {
	Name             string `json:"name" binding:"required"`
	Email            string `json:"email" binding:"required,email"`
	Password         string `json:"password" binding:"required,min=6"`
	Role             string `json:"role"`
	Organization     string `json:"organization"`
	OrganizationRole string `json:"organizationRole"`
}

// LoginRequest represents the login request body
type LoginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

// AuthResponse represents the authentication response
type AuthResponse struct {
	Token string        `json:"token"`
	User  UserBasicInfo `json:"user"`
}

// UserBasicInfo represents basic user info in responses
type UserBasicInfo struct {
	ID    string `json:"id"`
	Name  string `json:"name"`
	Email string `json:"email"`
	Role  string `json:"role"`
}

// RegisterUser handles user registration
func RegisterUser(c *gin.Context) {
	var req RegisterRequest

	// Bind and validate JSON request
	if err := c.ShouldBindJSON(&req); err != nil {
		log.Printf("Validation error: %v", err)
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Please enter all required fields",
		})
		return
	}

	// Context with timeout
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Get database connection
	db := config.GetMongoDB()
	if db == nil {
		log.Printf("Database connection is nil")
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Database connection error",
		})
		return
	}

	userCollection := db.Collection("users")

	// Check if user already exists (optimized with projection)
	var existingUser struct {
		ID primitive.ObjectID `bson:"_id"`
	}
	err := userCollection.FindOne(
		ctx,
		bson.M{"email": req.Email},
	).Decode(&existingUser)

	if err == nil {
		// User exists
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Email already registered",
		})
		return
	} else if err != mongo.ErrNoDocuments {
		// Database error
		log.Printf("Database error checking existing user: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Server error",
		})
		return
	}

	// Hash password
	hashedPassword, err := utils.HashPassword(req.Password)
	if err != nil {
		log.Printf("Password hashing error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Error processing password",
		})
		return
	}

	// Set default role if not provided
	role := req.Role
	if role == "" {
		role = "seller"
	}

	// Validate role
	if role != "admin" && role != "seller" && role != "customer" {
		role = "seller"
	}

	// Create new user
	now := time.Now()
	freeTrialEnd := now.Add(30 * 24 * time.Hour) // 30 days free trial

	user := models.User{
		Name:             req.Name,
		Email:            req.Email,
		Password:         hashedPassword,
		Role:             role,
		Organization:     req.Organization,
		OrganizationRole: req.OrganizationRole,
		LogoURL:          "https://image.shutterstock.com/image-vector/tour-guide-icon-tourism-travelling-150nw-2397508365.jpg",
		CreatedAt:        now,
		Marketplaces:     []models.Marketplace{},
		Subscription: models.Subscription{
			Status:         "freeTrial",
			FreeTrialStart: now,
			FreeTrialEnd:   freeTrialEnd,
		},
	}

	// Insert user into database
	result, err := userCollection.InsertOne(ctx, user)
	if err != nil {
		log.Printf("Database insert error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Failed to create user",
		})
		return
	}

	// Get inserted user ID
	userID := result.InsertedID.(primitive.ObjectID)

	// Generate JWT token (7 days expiry)
	token, err := utils.GenerateJWTWithExpiry(userID, user.Email, user.Role, 7*24*time.Hour)
	if err != nil {
		log.Printf("JWT generation error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Error generating token",
		})
		return
	}

	// Return response
	c.JSON(http.StatusCreated, AuthResponse{
		Token: token,
		User: UserBasicInfo{
			ID:    userID.Hex(),
			Name:  user.Name,
			Email: user.Email,
			Role:  user.Role,
		},
	})
}

// LoginUser handles user login
func LoginUser(c *gin.Context) {
	var req LoginRequest

	// Bind and validate JSON request
	if err := c.ShouldBindJSON(&req); err != nil {
		log.Printf("Validation error: %v", err)
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Please enter all required fields",
		})
		return
	}

	// Context with timeout
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Get database connection
	db := config.GetMongoDB()
	if db == nil {
		log.Printf("Database connection is nil")
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Database connection error",
		})
		return
	}

	userCollection := db.Collection("users")

	// Find user by email (optimized projection - only fetch needed fields)
	var user struct {
		ID       primitive.ObjectID `bson:"_id"`
		Name     string             `bson:"name"`
		Email    string             `bson:"email"`
		Password string             `bson:"password"`
		Role     string             `bson:"role"`
	}

	err := userCollection.FindOne(
		ctx,
		bson.M{"email": req.Email},
	).Decode(&user)

	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusBadRequest, gin.H{
				"message": "Invalid credentials",
			})
		} else {
			log.Printf("Database error finding user: %v", err)
			c.JSON(http.StatusInternalServerError, gin.H{
				"message": "Server error",
			})
		}
		return
	}

	// Compare password - note the order: hashed password first, plain password second
	if err := utils.ComparePassword(user.Password, req.Password); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid credentials",
		})
		return
	}

	// Generate JWT token (7 days expiry)
	token, err := utils.GenerateJWTWithExpiry(user.ID, user.Email, user.Role, 7*24*time.Hour)
	if err != nil {
		log.Printf("JWT generation error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Error generating token",
		})
		return
	}

	// Return response
	c.JSON(http.StatusOK, AuthResponse{
		Token: token,
		User: UserBasicInfo{
			ID:    user.ID.Hex(),
			Name:  user.Name,
			Email: user.Email,
			Role:  user.Role,
		},
	})
}

// GetUserProfile returns the authenticated user's profile
func GetUserProfile(c *gin.Context) {
	// Get user ID from context (set by auth middleware)
	userID, exists := middleware.GetUserID(c)
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"message": "Unauthorized",
		})
		return
	}

	// Context with timeout
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	db := config.GetMongoDB()
	if db == nil {
		log.Printf("Database connection is nil")
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Database connection error",
		})
		return
	}

	userCollection := db.Collection("users")

	// Find user with projection (only needed fields)
	var user struct {
		ID           primitive.ObjectID  `bson:"_id" json:"_id"`
		Name         string              `bson:"name" json:"name"`
		Email        string              `bson:"email" json:"email"`
		Role         string              `bson:"role" json:"role"`
		Subscription models.Subscription `bson:"subscription" json:"subscription"`
	}

	err := userCollection.FindOne(
		ctx,
		bson.M{"_id": userID},
	).Decode(&user)

	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusNotFound, gin.H{
				"message": "User not found",
			})
		} else {
			log.Printf("Database error: %v", err)
			c.JSON(http.StatusInternalServerError, gin.H{
				"message": "Server error",
			})
		}
		return
	}

	c.JSON(http.StatusOK, user)
}

// GetAllUsers returns a list of all users
func GetAllUsers(c *gin.Context) {
	// Context with timeout
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	db := config.GetMongoDB()
	if db == nil {
		log.Printf("Database connection is nil")
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Database connection error",
		})
		return
	}

	userCollection := db.Collection("users")

	// Find all users
	cursor, err := userCollection.Find(ctx, bson.M{})
	if err != nil {
		log.Printf("Database error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Server error",
		})
		return
	}
	defer cursor.Close(ctx)

	// Decode results
	var users []struct {
		ID           primitive.ObjectID `bson:"_id" json:"_id"`
		Name         string             `bson:"name" json:"name"`
		Email        string             `bson:"email" json:"email"`
		Role         string             `bson:"role" json:"role"`
		Subscription struct {
			Status string `bson:"status" json:"status"`
		} `bson:"subscription" json:"subscription"`
	}

	if err := cursor.All(ctx, &users); err != nil {
		log.Printf("Error decoding users: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Error decoding users",
		})
		return
	}

	c.JSON(http.StatusOK, users)
}
