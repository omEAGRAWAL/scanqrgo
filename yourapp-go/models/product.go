package models

import (
	"errors"
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Product struct {
	ID          primitive.ObjectID   `json:"id" bson:"_id,omitempty"`
	Name        string               `json:"name" bson:"name" validate:"required"`
	Seller      primitive.ObjectID   `json:"seller" bson:"seller" validate:"required"`
	AmazonASIN  string               `json:"amazonAsin,omitempty" bson:"amazonAsin,omitempty"`
	FlipkartFSN string               `json:"flipkartFsn,omitempty" bson:"flipkartFsn,omitempty"`
	Campaigns   []primitive.ObjectID `json:"campaigns" bson:"campaigns"`
	CreatedAt   time.Time            `json:"createdAt" bson:"createdAt"`
	ImageURL    string               `json:"imageurl,omitempty" bson:"imageurl,omitempty"`
}

// NewProduct creates a new product with default values
func NewProduct() *Product {
	return &Product{
		CreatedAt: time.Now(),
		Campaigns: []primitive.ObjectID{},
	}
}

// Validate checks that at least one marketplace is provided
func (p *Product) Validate() error {
	if p.AmazonASIN == "" && p.FlipkartFSN == "" {
		return errors.New("at least one marketplace (Amazon ASIN or Flipkart FSN) is required")
	}
	return nil
}

// AvailableMarketplaces returns a list of available marketplaces
func (p *Product) AvailableMarketplaces() []string {
	marketplaces := []string{}
	if p.AmazonASIN != "" {
		marketplaces = append(marketplaces, "Amazon")
	}
	if p.FlipkartFSN != "" {
		marketplaces = append(marketplaces, "Flipkart")
	}
	return marketplaces
}

// CollectionName returns the MongoDB collection name
func (Product) CollectionName() string {
	return "products"
}

// ProductResponse includes virtual fields for API responses
type ProductResponse struct {
	ID                    primitive.ObjectID   `json:"id"`
	Name                  string               `json:"name"`
	Seller                interface{}          `json:"seller"` // Can be User struct or ObjectID
	AmazonASIN            string               `json:"amazonAsin,omitempty"`
	FlipkartFSN           string               `json:"flipkartFsn,omitempty"`
	Campaigns             []primitive.ObjectID `json:"campaigns"`
	CreatedAt             time.Time            `json:"createdAt"`
	ImageURL              string               `json:"imageurl,omitempty"`
	AvailableMarketplaces []string             `json:"availableMarketplaces"` // Virtual field
}

// ToResponse converts Product to ProductResponse
func (p *Product) ToResponse() *ProductResponse {
	return &ProductResponse{
		ID:                    p.ID,
		Name:                  p.Name,
		Seller:                p.Seller,
		AmazonASIN:            p.AmazonASIN,
		FlipkartFSN:           p.FlipkartFSN,
		Campaigns:             p.Campaigns,
		CreatedAt:             p.CreatedAt,
		ImageURL:              p.ImageURL,
		AvailableMarketplaces: p.AvailableMarketplaces(),
	}
}