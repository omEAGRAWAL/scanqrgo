package routes

import (
	"github.com/gin-gonic/gin"

	"yourapp/controllers"
	"yourapp/middleware"
)

// SetupProductRoutes sets up all product-related routes
func SetupProductRoutes(router *gin.RouterGroup) {
	// All product routes require authentication
	router.Use(middleware.AuthMiddleware())

	// Product CRUD operations
	router.POST("/", controllers.CreateProduct)
	router.GET("/", controllers.GetProducts)
	router.GET("/:id", controllers.GetProductByID)
	router.PUT("/:id", controllers.UpdateProduct)
	router.DELETE("/:id", controllers.DeleteProduct)

	// Bulk operations
	router.POST("/bulk", controllers.BulkCreateProducts)

	// Marketplace-specific products (must be after bulk to avoid route conflict)
	router.GET("/marketplace/:marketplace", controllers.GetProductsByMarketplace)
}
