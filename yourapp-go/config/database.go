package config

import (
	"context"
	"log"
	"os"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.mongodb.org/mongo-driver/mongo/readpref"
)

var (
	mongoClient *mongo.Client
	mongoDB     *mongo.Database
)

// SetMongoClient sets the global MongoDB client and database
func SetMongoClient(client *mongo.Client, db *mongo.Database) {
	mongoClient = client
	mongoDB = db
}

// GetMongoClient returns the MongoDB client instance
func GetMongoClient() *mongo.Client {
	return mongoClient
}

// GetMongoDB returns the MongoDB database instance
func GetMongoDB() *mongo.Database {
	if mongoDB == nil {
		log.Println("Warning: MongoDB database is nil")
	}
	return mongoDB
}

// ConnectMongoDB initializes MongoDB connection (for compatibility)
func ConnectMongoDB() error {
	mongoURI := os.Getenv("MONGO_URI")
	if mongoURI == "" {
		log.Fatal("MONGO_URI environment variable is not set")
	}

	dbName := os.Getenv("DB_NAME")
	if dbName == "" {
		dbName = "yourapp" // Default database name
		log.Printf("Warning: DB_NAME not set, using default: %s", dbName)
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Optimized MongoDB connection options
	clientOptions := options.Client().
		ApplyURI(mongoURI).
		SetMaxPoolSize(100).
		SetMinPoolSize(10).
		SetMaxConnIdleTime(30 * time.Second).
		SetServerSelectionTimeout(5 * time.Second).
		SetConnectTimeout(10 * time.Second).
		SetSocketTimeout(45 * time.Second).
		SetRetryWrites(true).
		SetRetryReads(true)

	// Connect to MongoDB
	client, err := mongo.Connect(ctx, clientOptions)
	if err != nil {
		return err
	}

	// Ping to verify connection
	if err := client.Ping(ctx, readpref.Primary()); err != nil {
		return err
	}

	log.Println("✅ MongoDB Atlas connected successfully")

	// Set global MongoDB client and database
	mongoClient = client
	mongoDB = client.Database(dbName)

	return nil
}

// DisconnectMongoDB gracefully closes MongoDB connection
func DisconnectMongoDB() error {
	if mongoClient != nil {
		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()

		if err := mongoClient.Disconnect(ctx); err != nil {
			log.Printf("Error disconnecting from MongoDB: %v", err)
			return err
		}
		log.Println("MongoDB connection closed")
	}
	return nil
}
