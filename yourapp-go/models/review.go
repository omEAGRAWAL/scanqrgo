package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Review struct {
	ID                        primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	Campaign                  primitive.ObjectID `json:"campaign" bson:"campaign" validate:"required"`
	Marketplace               string             `json:"marketplace,omitempty" bson:"marketplace,omitempty"`
	Product                   primitive.ObjectID `json:"product" bson:"product" validate:"required"`
	FunnelVisit               primitive.ObjectID `json:"funnelVisit,omitempty" bson:"funnelVisit,omitempty"`
	CustomerName              string             `json:"customerName,omitempty" bson:"customerName,omitempty"`
	Email                     string             `json:"email,omitempty" bson:"email,omitempty" validate:"omitempty,email"`
	PhoneNumber               string             `json:"phoneNumber,omitempty" bson:"phoneNumber,omitempty"`
	Review                    string             `json:"review" bson:"review" validate:"required"`
	Rating                    int                `json:"rating" bson:"rating" validate:"required,min=1,max=5"`
	ClickedMarketplaceButton  bool               `json:"clickedMarketplaceButton" bson:"clickedMarketplaceButton"`
	Seller                    primitive.ObjectID `json:"seller" bson:"seller" validate:"required"`
	CreatedAt                 time.Time          `json:"createdAt" bson:"createdAt"`
}

// NewReview creates a new review with default values
func NewReview() *Review {
	return &Review{
		CreatedAt:                time.Now(),
		ClickedMarketplaceButton: false,
	}
}

// CollectionName returns the MongoDB collection name
func (Review) CollectionName() string {
	return "reviews"
}

// ReviewWithPopulatedFields includes populated references for API responses
type ReviewWithPopulatedFields struct {
	ID                       primitive.ObjectID `json:"id"`
	Campaign                 interface{}        `json:"campaign"` // Can be Campaign struct or ObjectID
	Marketplace              string             `json:"marketplace,omitempty"`
	Product                  interface{}        `json:"product"` // Can be Product struct or ObjectID
	FunnelVisit              interface{}        `json:"funnelVisit,omitempty"`
	CustomerName             string             `json:"customerName,omitempty"`
	Email                    string             `json:"email,omitempty"`
	PhoneNumber              string             `json:"phoneNumber,omitempty"`
	Review                   string             `json:"review"`
	Rating                   int                `json:"rating"`
	ClickedMarketplaceButton bool               `json:"clickedMarketplaceButton"`
	Seller                   interface{}        `json:"seller"` // Can be User struct or ObjectID
	CreatedAt                time.Time          `json:"createdAt"`
}