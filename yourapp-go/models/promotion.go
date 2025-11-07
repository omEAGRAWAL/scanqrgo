package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Promotion struct {
	ID                  primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	Name                string             `json:"name" bson:"name" validate:"required"`
	OfferTitle          string             `json:"offerTitle" bson:"offerTitle" validate:"required"`
	Type                string             `json:"type" bson:"type" validate:"required,oneof=discount code extended warranty"`
	WarrantyPeriod      string             `json:"warrantyPeriod,omitempty" bson:"warrantyPeriod,omitempty"`
	CouponCode          string             `json:"couponCode,omitempty" bson:"couponCode,omitempty"`
	TermsAndConditions  string             `json:"termsAndConditions,omitempty" bson:"termsAndConditions,omitempty"`
	Owner               primitive.ObjectID `json:"owner" bson:"owner" validate:"required"`
	Description         string             `json:"description" bson:"description" validate:"required"`
	DeliveryType        string             `json:"deliveryType" bson:"deliveryType" validate:"oneof=auto manual"`
	Status              string             `json:"status" bson:"status" validate:"oneof=active inactive"`
	CreatedAt           time.Time          `json:"createdAt" bson:"createdAt"`
	CodeValue           string             `json:"codeValue,omitempty" bson:"codeValue,omitempty"`
}

// NewPromotion creates a new promotion with default values
func NewPromotion() *Promotion {
	return &Promotion{
		DeliveryType: "auto",
		Status:       "active",
		CreatedAt:    time.Now(),
	}
}

// CollectionName returns the MongoDB collection name
func (Promotion) CollectionName() string {
	return "promotions"
}

// PromotionWithOwner includes populated owner for API responses
type PromotionWithOwner struct {
	ID                 primitive.ObjectID `json:"id"`
	Name               string             `json:"name"`
	OfferTitle         string             `json:"offerTitle"`
	Type               string             `json:"type"`
	WarrantyPeriod     string             `json:"warrantyPeriod,omitempty"`
	CouponCode         string             `json:"couponCode,omitempty"`
	TermsAndConditions string             `json:"termsAndConditions,omitempty"`
	Owner              interface{}        `json:"owner"` // Can be User struct or ObjectID
	Description        string             `json:"description"`
	DeliveryType       string             `json:"deliveryType"`
	Status             string             `json:"status"`
	CreatedAt          time.Time          `json:"createdAt"`
	CodeValue          string             `json:"codeValue,omitempty"`
}