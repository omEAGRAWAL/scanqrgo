package middleware

import (
	"context"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"

	"yourapp/config"
	"yourapp/models"
)

// JWTClaims represents the JWT token claims
type JWTClaims struct {
	UserID string `json:"id"`
	Email  string `json:"email"`
	Role   string `json:"role"`
	jwt.RegisteredClaims
}

// AuthMiddleware validates JWT token and checks user subscription
func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Get token from Authorization header
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{
				"message": "No token, authorization denied",
			})
			c.Abort()
			return
		}

		// Remove "Bearer " prefix if present
		token := strings.TrimPrefix(authHeader, "")
		if token == authHeader {
			// No "Bearer " prefix, use as-is (matches your Node.js behavior)
			token = authHeader
		}

		// Parse and validate JWT token
		jwtSecret := os.Getenv("JWT_SECRET")
		if jwtSecret == "" {
			jwtSecret = "your_jwt_secret_key" // Fallback (same as Node.js)
		}

		claims := &JWTClaims{}
		parsedToken, err := jwt.ParseWithClaims(token, claims, func(t *jwt.Token) (interface{}, error) {
			// Validate signing method
			if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, jwt.ErrSignatureInvalid
			}
			return []byte(jwtSecret), nil
		})

		if err != nil || !parsedToken.Valid {
			c.JSON(http.StatusUnauthorized, gin.H{
				"message": "Token is not valid",
			})
			c.Abort()
			return
		}

		// Convert user ID string to ObjectID
		userID, err := primitive.ObjectIDFromHex(claims.UserID)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{
				"message": "Invalid user ID in token",
			})
			c.Abort()
			return
		}

		// Verify user still exists in database with optimized query
		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()

		db := config.GetMongoDB()
		var dbUser struct {
			ID           primitive.ObjectID `bson:"_id"`
			Role         string             `bson:"role"`
			Subscription struct {
				Status string `bson:"status"`
			} `bson:"subscription"`
		}

		// Optimized projection - only fetch needed fields
		err = db.Collection(models.User{}.CollectionName()).FindOne(
			ctx,
			bson.M{"_id": userID},
			// Only select _id, role, and subscription.status
		).Decode(&dbUser)

		if err != nil {
			if err == mongo.ErrNoDocuments {
				c.JSON(http.StatusUnauthorized, gin.H{
					"message": "Account not found",
				})
			} else {
				c.JSON(http.StatusInternalServerError, gin.H{
					"message": "Database error",
				})
			}
			c.Abort()
			return
		}

		// Check subscription status
		if dbUser.Subscription.Status == "expired" {
			c.JSON(http.StatusUnauthorized, gin.H{
				"message": "Subscription expired",
			})
			c.Abort()
			return
		}

		// Store user info in context for downstream handlers
		c.Set("userID", userID)
		c.Set("userEmail", claims.Email)
		c.Set("userRole", dbUser.Role)

		// Continue to next handler
		c.Next()
	}
}

// GetUserID extracts user ID from context (helper function)
func GetUserID(c *gin.Context) (primitive.ObjectID, bool) {
	userID, exists := c.Get("userID")
	if !exists {
		return primitive.NilObjectID, false
	}
	id, ok := userID.(primitive.ObjectID)
	return id, ok
}

// GetUserRole extracts user role from context (helper function)
func GetUserRole(c *gin.Context) (string, bool) {
	role, exists := c.Get("userRole")
	if !exists {
		return "", false
	}
	roleStr, ok := role.(string)
	return roleStr, ok
}

// GetUserEmail extracts user email from context (helper function)
func GetUserEmail(c *gin.Context) (string, bool) {
	email, exists := c.Get("userEmail")
	if !exists {
		return "", false
	}
	emailStr, ok := email.(string)
	return emailStr, ok
}
