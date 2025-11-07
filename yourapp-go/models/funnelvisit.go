package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type StepData struct {
	OrderNumber              string  `json:"orderNumber,omitempty" bson:"orderNumber,omitempty"`
	Satisfaction             string  `json:"satisfaction,omitempty" bson:"satisfaction,omitempty"`
	UsedMoreDays             string  `json:"usedMoreDays,omitempty" bson:"usedMoreDays,omitempty"`
	CustomerName             string  `json:"customerName,omitempty" bson:"customerName,omitempty"`
	Email                    string  `json:"email,omitempty" bson:"email,omitempty" validate:"omitempty,email"`
	PhoneNumber              string  `json:"phoneNumber,omitempty" bson:"phoneNumber,omitempty"`
	Review                   string  `json:"review,omitempty" bson:"review,omitempty"`
	Rating                   int     `json:"rating,omitempty" bson:"rating,omitempty" validate:"omitempty,min=1,max=5"`
	Marketplace              string  `json:"marketplace,omitempty" bson:"marketplace,omitempty"`
	ClickedMarketplaceButton bool    `json:"clickedMarketplaceButton" bson:"clickedMarketplaceButton"`
	ShouldRequestReview      bool    `json:"shouldRequestReview" bson:"shouldRequestReview"`
}

type FunnelVisit struct {
	ID               primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	Campaign         primitive.ObjectID `json:"campaign,omitempty" bson:"campaign,omitempty"`
	Product          primitive.ObjectID `json:"product,omitempty" bson:"product,omitempty"`
	Seller           primitive.ObjectID `json:"seller,omitempty" bson:"seller,omitempty"`
	ScannedAt        time.Time          `json:"scannedAt" bson:"scannedAt"`
	CustomerFeedback string             `json:"customerFeedback,omitempty" bson:"customerFeedback,omitempty"`
	StepData         StepData           `json:"stepData" bson:"stepData"`
}

// NewFunnelVisit creates a new funnel visit with default values
func NewFunnelVisit() *FunnelVisit {
	return &FunnelVisit{
		ScannedAt: time.Now(),
		StepData: StepData{
			ClickedMarketplaceButton: false,
			ShouldRequestReview:      false,
		},
	}
}

// CollectionName returns the MongoDB collection name
func (FunnelVisit) CollectionName() string {
	return "funnelvisits"
}