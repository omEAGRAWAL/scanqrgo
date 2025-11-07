package utils

// import (
// 	"golang.org/x/crypto/bcrypt"
// )

// const (
// 	// Cost for bcrypt hashing (10 is recommended, 12 is more secure but slower)
// 	bcryptCost = 12
// )

// // HashPassword generates a bcrypt hash of the password
// func HashPassword(password string) (string, error) {
// 	hashedBytes, err := bcrypt.GenerateFromPassword([]byte(password), bcryptCost)
// 	if err != nil {
// 		return "", err
// 	}
// 	return string(hashedBytes), nil
// }

// // ComparePassword compares a password with its hash
// func ComparePassword(hashedPassword, password string) error {
// 	return bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(password))
// }

// // ValidatePasswordStrength checks if password meets minimum requirements
// func ValidatePasswordStrength(password string) bool {
// 	// Minimum 6 characters (same as your Node.js validation)
// 	return len(password) >= 6
// }