package middleware

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// RequireAdmin ensures the user has admin role
func RequireAdmin() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Get user role from context (set by AuthMiddleware)
		role, exists := GetUserRole(c)
		
		if !exists || role != "admin" {
			c.JSON(http.StatusForbidden, gin.H{
				"message": "Admin only",
			})
			c.Abort()
			return
		}

		// User is admin, continue
		c.Next()
	}
}

// RequireSeller ensures the user has seller role
func RequireSeller() gin.HandlerFunc {
	return func(c *gin.Context) {
		role, exists := GetUserRole(c)
		
		if !exists || role != "seller" {
			c.JSON(http.StatusForbidden, gin.H{
				"message": "Seller access only",
			})
			c.Abort()
			return
		}

		c.Next()
	}
}

// RequireAdminOrSeller allows both admin and seller roles
func RequireAdminOrSeller() gin.HandlerFunc {
	return func(c *gin.Context) {
		role, exists := GetUserRole(c)
		
		if !exists || (role != "admin" && role != "seller") {
			c.JSON(http.StatusForbidden, gin.H{
				"message": "Admin or Seller access only",
			})
			c.Abort()
			return
		}

		c.Next()
	}
}