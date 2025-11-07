package routes

import (
	"github.com/gin-gonic/gin"
	"yourapp/controllers"
	"yourapp/middleware"
)

// SetupUserRoutes configures all user-related routes
func SetupUserRoutes(router *gin.RouterGroup) {
	// Public routes (no authentication required)
	router.POST("/register", controllers.RegisterUser)
	router.POST("/login", controllers.LoginUser)

	// Protected routes (require authentication)
	router.GET("/profile", middleware.AuthMiddleware(), controllers.GetUserProfile)
	
	// Get all users (consider adding admin middleware if needed)
	router.GET("/userall", controllers.GetAllUsers)
}