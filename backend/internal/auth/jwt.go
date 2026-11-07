package auth

import (
	"errors"
	"fmt"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

// JWTService handles JWT token generation and validation
type JWTService struct {
	secretKey string
}

// NewJWTService creates a new JWT service
func NewJWTService(secretKey string) *JWTService {
	return &JWTService{
		secretKey: secretKey,
	}
}

// Claims represents the JWT claims
type Claims struct {
	UserID    string `json:"userId"`
	Email     string `json:"email"`
	Name      string `json:"name"`
	Role      string `json:"role"`
	TokenType string `json:"tokenType"`
	jwt.RegisteredClaims
}

// GenerateToken generates a new JWT token
func (j *JWTService) GenerateToken(userID, email, name, role string) (string, error) {
	if j.secretKey == "" {
		return "", errors.New("secret key is not configured")
	}

	claims := &Claims{
		UserID:    userID,
		Email:     email,
		Name:      name,
		Role:      role,
		TokenType: "access",
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			NotBefore: jwt.NewNumericDate(time.Now()),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString([]byte(j.secretKey))
	if err != nil {
		return "", fmt.Errorf("failed to generate token: %w", err)
	}

	return tokenString, nil
}

// GenerateRefreshToken generates a refresh token with longer expiration
func (j *JWTService) GenerateRefreshToken(userID, email, name, role string) (string, error) {
	if j.secretKey == "" {
		return "", errors.New("secret key is not configured")
	}

	claims := &Claims{
		UserID:    userID,
		Email:     email,
		Name:      name,
		Role:      role,
		TokenType: "refresh",
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(30 * 24 * time.Hour)), // 30 days
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			NotBefore: jwt.NewNumericDate(time.Now()),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString([]byte(j.secretKey))
	if err != nil {
		return "", fmt.Errorf("failed to generate refresh token: %w", err)
	}

	return tokenString, nil
}

// ValidateToken validates a JWT token and returns the claims
func (j *JWTService) ValidateToken(tokenString string) (*Claims, error) {
	if j.secretKey == "" {
		return nil, errors.New("secret key is not configured")
	}

	token, err := jwt.ParseWithClaims(tokenString, &Claims{}, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(j.secretKey), nil
	})

	if err != nil {
		return nil, fmt.Errorf("failed to parse token: %w", err)
	}

	if claims, ok := token.Claims.(*Claims); ok && token.Valid {
		return claims, nil
	}

	return nil, errors.New("invalid token")
}

// RefreshToken generates a new access token from a refresh token
func (j *JWTService) RefreshToken(refreshTokenString string) (string, error) {
	claims, err := j.ValidateToken(refreshTokenString)
	if err != nil {
		return "", err
	}
	if claims.TokenType != "refresh" {
		return "", errors.New("token is not a refresh token")
	}

	return j.GenerateToken(claims.UserID, claims.Email, claims.Name, claims.Role)
}
