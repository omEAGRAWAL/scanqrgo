package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Marketplace struct {
	Platform string `json:"platform" bson:"platform"`
	SellerID string `json:"sellerId" bson:"sellerId"`
}

type Subscription struct {
	Status         string    `json:"status" bson:"status" validate:"oneof=freeTrial active expired"`
	FreeTrialStart time.Time `json:"freeTrialStart" bson:"freeTrialStart"`
	FreeTrialEnd   time.Time `json:"freeTrialEnd" bson:"freeTrialEnd"`
	ActiveUntil    time.Time `json:"activeUntil,omitempty" bson:"activeUntil,omitempty"`
}

type User struct {
	ID               primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	Name             string             `json:"name" bson:"name" validate:"required"`
	Email            string             `json:"email" bson:"email" validate:"required,email"`
	Password         string             `json:"-" bson:"password" validate:"required,min=6"` // Never return password in JSON
	Role             string             `json:"role" bson:"role" validate:"oneof=admin seller customer"`
	LogoURL          string             `json:"logoUrl" bson:"logoUrl"`
	Organization     string             `json:"organization,omitempty" bson:"organization,omitempty"`
	OrganizationRole string             `json:"organizationRole,omitempty" bson:"organizationRole,omitempty"`
	CreatedAt        time.Time          `json:"createdAt" bson:"createdAt"`
	Marketplaces     []Marketplace      `json:"marketplaces" bson:"marketplaces"`
	Subscription     Subscription       `json:"subscription" bson:"subscription"`
}

// NewUser creates a new user with default values
func NewUser() *User {
	now := time.Now()
	return &User{
		Role:      "seller",
		LogoURL:   "https://image.shutterstock.com/image-vector/tour-guide-icon-tourism-travelling-150nw-2397508365.jpg",
		CreatedAt: now,
		Subscription: Subscription{
			Status:         "freeTrial",
			FreeTrialStart: now,
			FreeTrialEnd:   now.AddDate(0, 0, 10), // 10 days from now
		},
		Marketplaces: []Marketplace{},
	}
}

// CollectionName returns the MongoDB collection name
func (User) CollectionName() string {
	return "users"
}

// UserResponse is for API responses (excludes sensitive data)
type UserResponse struct {
	ID               primitive.ObjectID `json:"id"`
	Name             string             `json:"name"`
	Email            string             `json:"email"`
	Role             string             `json:"role"`
	LogoURL          string             `json:"logoUrl"`
	Organization     string             `json:"organization,omitempty"`
	OrganizationRole string             `json:"organizationRole,omitempty"`
	CreatedAt        time.Time          `json:"createdAt"`
	Marketplaces     []Marketplace      `json:"marketplaces"`
	Subscription     Subscription       `json:"subscription"`
}

// ToResponse converts User to UserResponse
func (u *User) ToResponse() *UserResponse {
	return &UserResponse{
		ID:               u.ID,
		Name:             u.Name,
		Email:            u.Email,
		Role:             u.Role,
		LogoURL:          u.LogoURL,
		Organization:     u.Organization,
		OrganizationRole: u.OrganizationRole,
		CreatedAt:        u.CreatedAt,
		Marketplaces:     u.Marketplaces,
		Subscription:     u.Subscription,
	}
}