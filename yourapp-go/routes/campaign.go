package routes

import (
	"github.com/gin-gonic/gin"

	"yourapp/controllers"
	"yourapp/middleware"
)

// SetupCampaignRoutes sets up all campaign-related routes
func SetupCampaignRoutes(router *gin.RouterGroup) {
	// All campaign routes require authentication
	router.Use(middleware.AuthMiddleware())

	// Campaign CRUD operations
	router.POST("/", controllers.CreateCampaign)
	router.GET("/", controllers.GetCampaigns)
	router.GET("/:id", controllers.GetCampaignByID)
	router.PUT("/:id", controllers.UpdateCampaign)
	router.DELETE("/:id", controllers.DeleteCampaign)

	// Campaign statistics (must come before /:id to avoid route conflict)
	router.GET("/stats/dashboard", controllers.GetCampaignStats)

	// Campaign analytics
	router.PUT("/:id/analytics", controllers.UpdateCampaignAnalytics)
}
