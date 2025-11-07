package routes

import (
	"github.com/gin-gonic/gin"

	"yourapp/controllers"
	"yourapp/middleware"
)

// SetupPromotionRoutes sets up all promotion-related routes
func SetupPromotionRoutes(router *gin.RouterGroup) {
	// All promotion routes require authentication
	router.Use(middleware.AuthMiddleware())

	// Promotion statistics (must come before /:id to avoid route conflict)
	router.GET("/stats/summary", controllers.GetPromotionStats)

	// Promotion CRUD operations
	router.POST("/", controllers.CreatePromotion)
	router.GET("/", controllers.GetPromotions)
	router.GET("/:id", controllers.GetPromotionByID)
	router.PUT("/:id", controllers.UpdatePromotion)
	router.DELETE("/:id", controllers.DeletePromotion)
}
