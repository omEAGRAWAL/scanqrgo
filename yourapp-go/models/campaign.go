package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type PromotionSettings struct {
	CodeType       string     `json:"codeType" bson:"codeType" validate:"oneof=same unique"`
	CodeValue      string     `json:"codeValue,omitempty" bson:"codeValue,omitempty"`
	DeliveryType   string     `json:"deliveryType" bson:"deliveryType" validate:"oneof=auto manual"`
	MaxRedemptions int        `json:"maxRedemptions,omitempty" bson:"maxRedemptions,omitempty"`
	ExpiryDate     *time.Time `json:"expiryDate,omitempty" bson:"expiryDate,omitempty"` // Pointer for optional date
}

type Analytics struct {
	TotalScans       int     `json:"totalScans" bson:"totalScans"`
	TotalCompletions int     `json:"totalCompletions" bson:"totalCompletions"`
	TotalRedemptions int     `json:"totalRedemptions" bson:"totalRedemptions"`
	ConversionRate   float64 `json:"conversionRate" bson:"conversionRate"`
}

type Customization struct {
	PrimaryColor    string `json:"primaryColor" bson:"primaryColor"`
	LogoURL         string `json:"logoUrl,omitempty" bson:"logoUrl,omitempty"`
	BackgroundStyle string `json:"backgroundStyle" bson:"backgroundStyle" validate:"oneof=solid gradient"`
	CustomMessage   string `json:"customMessage,omitempty" bson:"customMessage,omitempty"`
}

type FunnelStep struct {
	StepType string                 `json:"stepType" bson:"stepType"`
	Config   map[string]interface{} `json:"config" bson:"config"` // Use map for better type safety
	Order    int                    `json:"order" bson:"order"`
}

type Campaign struct {
	ID                   primitive.ObjectID   `json:"id" bson:"_id,omitempty"`
	Name                 string               `json:"name" bson:"name" validate:"required"`
	Category             string               `json:"category" bson:"category" validate:"required,oneof=promotion review"` // Added category field
	Seller               primitive.ObjectID   `json:"seller" bson:"seller" validate:"required"`
	Status               string               `json:"status" bson:"status" validate:"oneof=active paused ended"`
	Promotion            *primitive.ObjectID  `json:"promotion,omitempty" bson:"promotion,omitempty"` // Pointer for optional
	Review               *primitive.ObjectID  `json:"review,omitempty" bson:"review,omitempty"`       // Pointer for optional
	Products             []primitive.ObjectID `json:"products" bson:"products" validate:"required,min=1"`
	ReviewMinimumLength  int                  `json:"reviewMinimumLength" bson:"reviewMinimumLength"`
	EnableSmartFunnel    bool                 `json:"enableSmartFunnel" bson:"enableSmartFunnel"`
	PromotionSettings    PromotionSettings    `json:"promotionSettings,omitempty" bson:"promotionSettings,omitempty"`
	Analytics            Analytics            `json:"analytics" bson:"analytics"`
	Customization        Customization        `json:"customization" bson:"customization"`
	QRCodeURL            string               `json:"qrCodeUrl,omitempty" bson:"qrCodeUrl,omitempty"`
	FunnelSteps          []FunnelStep         `json:"funnelSteps" bson:"funnelSteps"`
	CreatedAt            time.Time            `json:"createdAt" bson:"createdAt"`
	UpdatedAt            time.Time            `json:"updatedAt" bson:"updatedAt"`
}

// NewCampaign creates a new campaign with default values
func NewCampaign() *Campaign {
	now := time.Now()
	return &Campaign{
		Status:              "active",
		ReviewMinimumLength: 10,
		EnableSmartFunnel:   false,
		PromotionSettings: PromotionSettings{
			CodeType:     "same",
			DeliveryType: "auto",
		},
		Analytics: Analytics{
			TotalScans:       0,
			TotalCompletions: 0,
			TotalRedemptions: 0,
			ConversionRate:   0,
		},
		Customization: Customization{
			PrimaryColor:    "#3B82F6",
			BackgroundStyle: "solid",
		},
		FunnelSteps: []FunnelStep{},
		Products:    []primitive.ObjectID{},
		CreatedAt:   now,
		UpdatedAt:   now,
	}
}

// CollectionName returns the MongoDB collection name
func (Campaign) CollectionName() string {
	return "campaigns"
}

// UpdateTimestamp updates the updatedAt field
func (c *Campaign) UpdateTimestamp() {
	c.UpdatedAt = time.Now()
}

// CalculateConversionRate recalculates the conversion rate
func (c *Campaign) CalculateConversionRate() {
	if c.Analytics.TotalScans > 0 {
		c.Analytics.ConversionRate = (float64(c.Analytics.TotalCompletions) / float64(c.Analytics.TotalScans)) * 100
	} else {
		c.Analytics.ConversionRate = 0
	}
}

// IsActive checks if the campaign is active
func (c *Campaign) IsActive() bool {
	return c.Status == "active"
}

// ToggleStatus toggles between active and ended
func (c *Campaign) ToggleStatus() {
	if c.Status == "active" {
		c.Status = "ended"
	} else {
		c.Status = "active"
	}
	c.UpdateTimestamp()
}
