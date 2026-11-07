package config

import (
	"os"
	"strings"

	"github.com/joho/godotenv"
)

type Config struct {
	SiteName      string
	SessionSecret string
	JWTSecret     string
	AdminEmail    string
	AdminPassword string
	SiteURL       string
	Port          string
	Appwrite      AppwriteConfig
	Parse         ParseConfig
	Cloudinary    CloudinaryConfig
	SMTP          SMTPConfig
	NVAPI         NVAPIConfig
}

type AppwriteConfig struct {
	Endpoint             string
	ProjectID            string
	APIKey               string
	DatabaseID           string
	ArticlesCollectionID string
	CVCollectionID       string
	CVDocumentID         string
}

func (c *AppwriteConfig) Enabled() bool {
	return strings.TrimSpace(c.Endpoint) != "" && strings.TrimSpace(c.ProjectID) != ""
}

type ParseConfig struct {
	ServerURL string
	AppID     string
	RestKey   string
	MasterKey string
}

func (c *ParseConfig) Enabled() bool {
	return strings.TrimSpace(c.ServerURL) != "" && strings.TrimSpace(c.AppID) != ""
}

type CloudinaryConfig struct {
	CloudName string
	APIKey    string
	APISecret string
}

func (c *CloudinaryConfig) Enabled() bool {
	return strings.TrimSpace(c.CloudName) != "" && strings.TrimSpace(c.APIKey) != ""
}

type SMTPConfig struct {
	Host     string
	Port     string
	Username string
	Password string
	From     string
	AdminTo  string
}

func (s *SMTPConfig) Enabled() bool {
	return strings.TrimSpace(s.Host) != "" && strings.TrimSpace(s.Port) != ""
}

type NVAPIConfig struct {
	APIKey  string
	BaseURL string
	Model   string
}

func (n *NVAPIConfig) Enabled() bool {
	return strings.TrimSpace(n.APIKey) != "" && strings.TrimSpace(n.BaseURL) != "" && strings.TrimSpace(n.Model) != ""
}

func LoadConfig() *Config {
	_ = godotenv.Load(".env")

	return &Config{
		SiteName:      getEnv("SITE_NAME", "WIPPEL"),
		SessionSecret: os.Getenv("SESSION_SECRET"),
		JWTSecret:     os.Getenv("JWT_SECRET"),
		AdminEmail:    os.Getenv("ADMIN_EMAIL"),
		AdminPassword: os.Getenv("ADMIN_PASSWORD"),
		SiteURL:       getEnv("SITE_URL", "http://localhost:9050"),
		Port:          getEnv("PORT", "9050"),
		Appwrite: AppwriteConfig{
			Endpoint:             os.Getenv("APPWRITE_ENDPOINT"),
			ProjectID:            os.Getenv("APPWRITE_PROJECT_ID"),
			APIKey:               os.Getenv("APPWRITE_API_KEY"),
			DatabaseID:           os.Getenv("APPWRITE_DATABASE_ID"),
			ArticlesCollectionID: os.Getenv("APPWRITE_ARTICLES_COLLECTION_ID"),
			CVCollectionID:       os.Getenv("APPWRITE_CV_COLLECTION_ID"),
			CVDocumentID:         os.Getenv("APPWRITE_CV_DOCUMENT_ID"),
		},
		Parse: ParseConfig{
			ServerURL: os.Getenv("PARSE_SERVER_URL"),
			AppID:     os.Getenv("PARSE_APP_ID"),
			RestKey:   os.Getenv("PARSE_REST_KEY"),
			MasterKey: os.Getenv("PARSE_MASTER_KEY"),
		},
		Cloudinary: CloudinaryConfig{
			CloudName: os.Getenv("CLOUDINARY_CLOUD_NAME"),
			APIKey:    os.Getenv("CLOUDINARY_API_KEY"),
			APISecret: os.Getenv("CLOUDINARY_API_SECRET"),
		},
		SMTP: SMTPConfig{
			Host:     os.Getenv("SMTP_HOST"),
			Port:     os.Getenv("SMTP_PORT"),
			Username: getEnv("SMTP_USERNAME", os.Getenv("SMTP_USER")),
			Password: getEnv("SMTP_PASSWORD", os.Getenv("SMTP_PASS")),
			From:     os.Getenv("SMTP_FROM"),
			AdminTo:  os.Getenv("SMTP_ADMIN_TO"),
		},
		NVAPI: NVAPIConfig{
			APIKey:  os.Getenv("NVAPI_KEY"),
			BaseURL: getEnv("NVAPI_BASE_URL", "https://integrate.api.nvidia.com/v1"),
			Model:   getEnv("NVAPI_MODEL", "qwen/qwen3-coder-480b-a35b-instruct"),
		},
	}
}

func getEnv(key, fallback string) string {
	if value, ok := os.LookupEnv(key); ok {
		return value
	}
	return fallback
}
