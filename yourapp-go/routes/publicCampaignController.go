package routes

import (
	"github.com/gin-gonic/gin"

	"yourapp/controllers"
	"yourapp/middleware"
)

// SetupPublicRoutes sets up all public-facing routes (no auth required)
func SetupPublicRoutes(router *gin.RouterGroup) {
	// Public campaign routes (no auth required)
	router.GET("/campaign/:id", controllers.GetPublicCampaign)
	router.POST("/campaign/:id/submit", controllers.SubmitCampaign)

	// Reviews route (requires authentication)
	router.GET("/reviews", middleware.AuthMiddleware(), controllers.GetAllReviews)
}
