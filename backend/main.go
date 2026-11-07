package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"time"

	"wippel-backend/internal/auth"
	"wippel-backend/internal/config"
	"wippel-backend/internal/handlers"
	"wippel-backend/internal/middleware"
	"wippel-backend/internal/models"
	"wippel-backend/internal/service"

	"github.com/gin-gonic/gin"
)

func main() {
	// Load configuration
	cfg := config.LoadConfig()

	// Initialize services
	emailService := service.NewEmailService(cfg)
	jwtService := auth.NewJWTService(cfg.JWTSecret)
	aiHandler := handlers.NewAIHandler(cfg.NVAPI)

	// Initialize rate limiter (5 requests per minute for auth endpoints)
	rateLimiter := middleware.NewRateLimiter(5, time.Minute)

	var parseService *service.ParseService

	if cfg.Parse.Enabled() {
		parseService = service.NewParseService(cfg.Parse)
		log.Printf("[Parse] Connected to %s (AppID: %s)", cfg.Parse.ServerURL, cfg.Parse.AppID)

		// Ensure the configured admin exists; no default credentials are created.
		if cfg.AdminEmail != "" && cfg.AdminPassword != "" {
			if err := parseService.EnsureAdminExists(context.Background(), cfg.AdminEmail, cfg.AdminPassword); err != nil {
				log.Printf("[Parse] EnsureAdminExists warning: %v", err)
			}
		}
	} else {
		log.Println("[Parse] NOT configured — running with local fallback data. Set PARSE_SERVER_URL and PARSE_APP_ID to enable.")
	}

	r := gin.Default()

	// CORS middleware
	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Parse-Application-Id, X-Parse-REST-API-Key")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	})

	api := r.Group("/api")
	{
		// ---- Health ----
		api.GET("/health", func(c *gin.Context) {
			parseStatus := "not configured"
			if parseService != nil {
				parseStatus = "connected"
			}
			c.JSON(http.StatusOK, gin.H{
				"status": "ok",
				"parse":  parseStatus,
			})
		})

		// ---- Auth (with rate limiting) ----
		authGroup := api.Group("/auth")
		authGroup.Use(middleware.RateLimit(rateLimiter))
		{
			authGroup.POST("/login", func(c *gin.Context) {
				var loginReq struct {
					Email      string `json:"email"`
					Password   string `json:"password"`
					RememberMe bool   `json:"rememberMe"`
				}
				if err := c.ShouldBindJSON(&loginReq); err != nil {
					c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid request"})
					return
				}

				var userID, userEmail, userName, userRole string

				// Try Back4App/Parse authentication first
				if parseService != nil {
					user, err := parseService.LoginUser(c.Request.Context(), loginReq.Email, loginReq.Password)
					if err == nil {
						userID = user.ID
						userEmail = user.Email
						userName = user.Name
						userRole = user.Role
						log.Printf("[Auth] Parse login successful for %s", loginReq.Email)
					} else {
						log.Printf("[Auth] Parse login failed for %s: %v", loginReq.Email, err)
					}
				}

				// Fallback to admin login from .env configuration
				if userID == "" && cfg.AdminEmail != "" && cfg.AdminPassword != "" && loginReq.Email == cfg.AdminEmail && loginReq.Password == cfg.AdminPassword {
					userID = "1"
					userEmail = loginReq.Email
					userName = "Admin User"
					userRole = "admin"
					log.Printf("[Auth] Admin login successful for %s", loginReq.Email)
				}

				if userID == "" {
					c.JSON(http.StatusUnauthorized, gin.H{"message": "Invalid email or password"})
					return
				}

				// Generate JWT token
				token, err := jwtService.GenerateToken(userID, userEmail, userName, userRole)
				if err != nil {
					log.Printf("[Auth] Failed to generate token: %v", err)
					c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to generate authentication token"})
					return
				}

				// Generate refresh token if remember me is checked
				var refreshToken string
				if loginReq.RememberMe {
					refreshToken, _ = jwtService.GenerateRefreshToken(userID, userEmail, userName, userRole)
				}

				c.JSON(http.StatusOK, gin.H{
					"success":      true,
					"token":        token,
					"refreshToken": refreshToken,
					"user": gin.H{
						"id":    userID,
						"email": userEmail,
						"name":  userName,
						"role":  userRole,
					},
				})
			})

			authGroup.POST("/register", func(c *gin.Context) {
				var registerReq struct {
					FullName string `json:"fullName"`
					Email    string `json:"email"`
					Password string `json:"password"`
				}
				if err := c.ShouldBindJSON(&registerReq); err != nil {
					c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid request"})
					return
				}

				// Try Back4App/Parse registration
				if parseService != nil {
					user, err := parseService.RegisterUser(c.Request.Context(), registerReq.FullName, registerReq.Email, registerReq.Password)
					if err == nil {
						// Generate JWT token immediately after registration
						token, err := jwtService.GenerateToken(user.ID, user.Email, user.Name, user.Role)
						if err != nil {
							log.Printf("[Auth] Failed to generate token after registration: %v", err)
							c.JSON(http.StatusInternalServerError, gin.H{"message": "Registration successful but failed to generate token"})
							return
						}

						c.JSON(http.StatusOK, gin.H{
							"success": true,
							"token":   token,
							"user": gin.H{
								"id":    user.ID,
								"email": user.Email,
								"name":  user.Name,
								"role":  user.Role,
							},
						})
						return
					}
					log.Printf("[Auth] Parse registration failed for %s: %v", registerReq.Email, err)
					c.JSON(http.StatusConflict, gin.H{"message": "User already exists or registration failed"})
					return
				}

				c.JSON(http.StatusServiceUnavailable, gin.H{"message": "Registration service unavailable"})
			})

			authGroup.POST("/refresh", func(c *gin.Context) {
				var req struct {
					RefreshToken string `json:"refreshToken"`
				}
				if err := c.ShouldBindJSON(&req); err != nil {
					c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid request"})
					return
				}

				newToken, err := jwtService.RefreshToken(req.RefreshToken)
				if err != nil {
					c.JSON(http.StatusUnauthorized, gin.H{"message": "Invalid refresh token"})
					return
				}

				c.JSON(http.StatusOK, gin.H{
					"success": true,
					"token":   newToken,
				})
			})
		}

		// ---- CV ----
		api.GET("/cv", func(c *gin.Context) {
			if parseService != nil {
				store, err := parseService.FetchAll(c.Request.Context())
				if err == nil && store.CV.Name != "" {
					c.JSON(http.StatusOK, store.CV)
					return
				}
				log.Printf("[CV] Parse fetch error or empty: %v", err)
			}
			// Fallback
			c.JSON(http.StatusOK, models.CVData{
				Name:     "WIPPEL",
				Title:    "Web Platforms",
				Location: "Algeria",
				Profile:  []string{"From idea to production-ready web platforms."},
			})
		})

		// ---- Articles ----
		api.GET("/articles", func(c *gin.Context) {
			if parseService != nil {
				store, err := parseService.FetchAll(c.Request.Context())
				if err == nil && len(store.Articles) > 0 {
					c.JSON(http.StatusOK, store.Articles)
					return
				}
				log.Printf("[Articles] Parse fetch error or empty: %v", err)
			}
			// Fallback
			c.JSON(http.StatusOK, []models.Article{
				{ID: "1", Title: "Building with Next.js", URL: "/articles/nextjs", Summary: "Learn how to build modern web apps.", Category: "Tech"},
			})
		})

		// ---- Orders ----
		api.POST("/order", func(c *gin.Context) {
			var order struct {
				Name    string `json:"name"`
				Email   string `json:"email"`
				Company string `json:"company"`
				Service string `json:"service"`
				Budget  string `json:"budget"`
				Message string `json:"message"`
			}
			if err := c.ShouldBindJSON(&order); err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
				return
			}
			log.Printf("Received order: %+v", order)

			// Save to Parse
			if parseService != nil {
				o := models.Order{
					Name: order.Name, Email: order.Email, Company: order.Company,
					Service: order.Service, Budget: order.Budget, Message: order.Message,
				}
				id, err := parseService.CreateOrder(c.Request.Context(), o)
				if err != nil {
					log.Printf("[Order] Parse save error: %v", err)
				} else {
					log.Printf("[Order] Saved to Parse: %s", id)
				}
			}

			// Send emails
			emailData := service.EmailData{
				SiteName: cfg.SiteName, SiteURL: cfg.SiteURL,
				Name: order.Name, Email: order.Email, Company: order.Company,
				Service: order.Service, Budget: order.Budget, Message: order.Message,
			}
			if err := emailService.SendOrderNotification(emailData); err != nil {
				log.Printf("Failed to send order notification: %v", err)
			}
			if err := emailService.SendThankYouEmail(emailData); err != nil {
				log.Printf("Failed to send thank you email: %v", err)
			}

			c.JSON(http.StatusOK, gin.H{"message": "Order received successfully"})
		})

		// ---- Contacts ----
		api.POST("/contacts", func(c *gin.Context) {
			var contact models.Contact
			if err := c.ShouldBindJSON(&contact); err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
				return
			}
			log.Printf("Received contact: %+v", contact)

			if parseService != nil {
				id, err := parseService.CreateContact(c.Request.Context(), contact)
				if err != nil {
					log.Printf("[Contact] Parse save error: %v", err)
					c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save contact"})
					return
				}
				c.JSON(http.StatusOK, gin.H{"objectId": id, "message": "Contact saved"})
				return
			}

			// Send email notification as fallback
			emailData := service.EmailData{
				SiteName: cfg.SiteName, SiteURL: cfg.SiteURL,
				Name: contact.Name, Email: contact.Email,
				Subject: contact.Subject, Message: contact.Message,
			}
			if err := emailService.SendContactNotification(emailData); err != nil {
				log.Printf("Failed to send contact notification: %v", err)
			}
			c.JSON(http.StatusOK, gin.H{"message": "Message sent successfully"})
		})

		// Legacy contact endpoint (same behavior)
		api.POST("/contact", func(c *gin.Context) {
			var contact models.Contact
			if err := c.ShouldBindJSON(&contact); err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
				return
			}
			log.Printf("Received contact: %+v", contact)

			if parseService != nil {
				id, err := parseService.CreateContact(c.Request.Context(), contact)
				if err != nil {
					log.Printf("[Contact] Parse save error: %v", err)
				} else {
					log.Printf("[Contact] Saved to Parse: %s", id)
				}
			}

			emailData := service.EmailData{
				SiteName: cfg.SiteName, SiteURL: cfg.SiteURL,
				Name: contact.Name, Email: contact.Email,
				Subject: contact.Subject, Message: contact.Message,
			}
			if err := emailService.SendContactNotification(emailData); err != nil {
				log.Printf("Failed to send contact notification: %v", err)
			}
			c.JSON(http.StatusOK, gin.H{"message": "Message sent successfully"})
		})

		// ---- Admin (protected) ----
		adminGroup := api.Group("/admin")
		adminGroup.Use(jwtService.AuthMiddleware())
		adminGroup.Use(auth.RequireRole("admin"))
		{
			adminGroup.GET("/articles", func(c *gin.Context) {
				if parseService == nil {
					c.JSON(http.StatusServiceUnavailable, gin.H{"error": "Parse not configured"})
					return
				}
				store, err := parseService.FetchAll(c.Request.Context())
				if err != nil {
					c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to load articles"})
					return
				}
				c.JSON(http.StatusOK, store.Articles)
			})

			adminGroup.POST("/articles", func(c *gin.Context) {
				var article models.Article
				if err := c.ShouldBindJSON(&article); err != nil {
					c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid article"})
					return
				}
				if parseService == nil {
					c.JSON(http.StatusServiceUnavailable, gin.H{"error": "Parse not configured"})
					return
				}
				id, err := parseService.UpsertArticle(c.Request.Context(), article)
				if err != nil {
					c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
					return
				}
				c.JSON(http.StatusOK, gin.H{"id": id, "message": "Article saved"})
			})

			adminGroup.PUT("/articles/:id", func(c *gin.Context) {
				var article models.Article
				if err := c.ShouldBindJSON(&article); err != nil {
					c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid article"})
					return
				}
				if parseService == nil {
					c.JSON(http.StatusServiceUnavailable, gin.H{"error": "Parse not configured"})
					return
				}
				article.ID = c.Param("id")
				id, err := parseService.UpsertArticle(c.Request.Context(), article)
				if err != nil {
					c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update article"})
					return
				}
				c.JSON(http.StatusOK, gin.H{"id": id, "message": "Article updated"})
			})

			adminGroup.DELETE("/articles/:id", func(c *gin.Context) {
				if parseService == nil {
					c.JSON(http.StatusServiceUnavailable, gin.H{"error": "Parse not configured"})
					return
				}
				if err := parseService.DeleteArticle(c.Request.Context(), c.Param("id")); err != nil {
					c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
					return
				}
				c.JSON(http.StatusOK, gin.H{"message": "Article deleted"})
			})

			adminGroup.PUT("/cv", func(c *gin.Context) {
				var cv models.CVData
				if err := c.ShouldBindJSON(&cv); err != nil {
					c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid CV"})
					return
				}
				if parseService == nil {
					c.JSON(http.StatusServiceUnavailable, gin.H{"error": "Parse not configured"})
					return
				}
				id, err := parseService.UpsertCV(c.Request.Context(), cv)
				if err != nil {
					c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
					return
				}
				c.JSON(http.StatusOK, gin.H{"id": id, "message": "CV saved"})
			})

			adminGroup.GET("/content/:type", func(c *gin.Context) {
				contentType := c.Param("type")
				if !isAllowedContentType(contentType) {
					c.JSON(http.StatusBadRequest, gin.H{"error": "Unsupported content type"})
					return
				}
				if parseService == nil {
					c.JSON(http.StatusServiceUnavailable, gin.H{"error": "Parse not configured"})
					return
				}
				items, err := parseService.ListContent(c.Request.Context(), contentType, 100)
				if err != nil {
					c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
					return
				}
				c.JSON(http.StatusOK, items)
			})

			adminGroup.POST("/content/:type", func(c *gin.Context) {
				contentType := c.Param("type")
				if !isAllowedContentType(contentType) {
					c.JSON(http.StatusBadRequest, gin.H{"error": "Unsupported content type"})
					return
				}
				var item models.ContentItem
				if err := c.ShouldBindJSON(&item); err != nil {
					c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid content item"})
					return
				}
				if parseService == nil {
					c.JSON(http.StatusServiceUnavailable, gin.H{"error": "Parse not configured"})
					return
				}
				id, err := parseService.CreateContent(c.Request.Context(), contentType, item)
				if err != nil {
					c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
					return
				}
				c.JSON(http.StatusCreated, gin.H{"id": id})
			})

			adminGroup.PUT("/content/:type/:id", func(c *gin.Context) {
				contentType := c.Param("type")
				if !isAllowedContentType(contentType) {
					c.JSON(http.StatusBadRequest, gin.H{"error": "Unsupported content type"})
					return
				}
				var item models.ContentItem
				if err := c.ShouldBindJSON(&item); err != nil {
					c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid content item"})
					return
				}
				if parseService == nil {
					c.JSON(http.StatusServiceUnavailable, gin.H{"error": "Parse not configured"})
					return
				}
				if err := parseService.UpdateContent(c.Request.Context(), contentType, c.Param("id"), item); err != nil {
					c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
					return
				}
				c.JSON(http.StatusOK, gin.H{"message": "Content updated"})
			})

			adminGroup.DELETE("/content/:type/:id", func(c *gin.Context) {
				contentType := c.Param("type")
				if !isAllowedContentType(contentType) {
					c.JSON(http.StatusBadRequest, gin.H{"error": "Unsupported content type"})
					return
				}
				if parseService == nil {
					c.JSON(http.StatusServiceUnavailable, gin.H{"error": "Parse not configured"})
					return
				}
				if err := parseService.DeleteContent(c.Request.Context(), contentType, c.Param("id")); err != nil {
					c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
					return
				}
				c.JSON(http.StatusOK, gin.H{"message": "Content deleted"})
			})

			adminGroup.GET("/orders", func(c *gin.Context) {
				if parseService != nil {
					orders, err := parseService.ListOrders(c.Request.Context(), 50)
					if err != nil {
						c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
						return
					}
					c.JSON(http.StatusOK, orders)
					return
				}
				c.JSON(http.StatusOK, []interface{}{})
			})

			adminGroup.PATCH("/orders/:id", func(c *gin.Context) {
				var request struct {
					Status string `json:"status" binding:"required"`
				}
				if err := c.ShouldBindJSON(&request); err != nil || !service.ValidOrderStatus(request.Status) {
					c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid order status"})
					return
				}
				if parseService != nil {
					if err := parseService.UpdateOrderStatus(c.Request.Context(), c.Param("id"), request.Status); err != nil {
						c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
						return
					}
					c.JSON(http.StatusOK, gin.H{"message": "Order status updated"})
					return
				}
				c.JSON(http.StatusServiceUnavailable, gin.H{"error": "Parse not configured"})
			})

			adminGroup.DELETE("/orders/:id", func(c *gin.Context) {
				id := c.Param("id")
				if parseService != nil {
					if err := parseService.DeleteOrder(c.Request.Context(), id); err != nil {
						c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
						return
					}
					c.JSON(http.StatusOK, gin.H{"message": "Order deleted"})
					return
				}
				c.JSON(http.StatusServiceUnavailable, gin.H{"error": "Parse not configured"})
			})

			// ---- Admin: Contacts (protected) ----
			adminGroup.GET("/contacts", func(c *gin.Context) {
				if parseService != nil {
					contacts, err := parseService.ListContacts(c.Request.Context(), 50)
					if err != nil {
						c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
						return
					}
					c.JSON(http.StatusOK, contacts)
					return
				}
				c.JSON(http.StatusOK, []interface{}{})
			})

			adminGroup.PATCH("/contacts/:id", func(c *gin.Context) {
				var request struct {
					Status string `json:"status" binding:"required"`
				}
				if err := c.ShouldBindJSON(&request); err != nil || !service.ValidContactStatus(request.Status) {
					c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid contact status"})
					return
				}
				if parseService != nil {
					if err := parseService.UpdateContactStatus(c.Request.Context(), c.Param("id"), request.Status); err != nil {
						c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
						return
					}
					c.JSON(http.StatusOK, gin.H{"message": "Contact status updated"})
					return
				}
				c.JSON(http.StatusServiceUnavailable, gin.H{"error": "Parse not configured"})
			})

			adminGroup.DELETE("/contacts/:id", func(c *gin.Context) {
				id := c.Param("id")
				if parseService != nil {
					if err := parseService.DeleteContact(c.Request.Context(), id); err != nil {
						c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
						return
					}
					c.JSON(http.StatusOK, gin.H{"message": "Contact deleted"})
					return
				}
				c.JSON(http.StatusServiceUnavailable, gin.H{"error": "Parse not configured"})
			})
		}

		// ---- AI Chat ----
		api.POST("/ai/chat", aiHandler.Chat)
		api.GET("/ai/health", aiHandler.HealthCheck)
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = cfg.Port
	}

	log.Printf("Backend listening on port %s", port)
	log.Printf("Parse enabled: %v", parseService != nil)
	r.Run(":" + port)
}

func isAllowedContentType(contentType string) bool {
	switch contentType {
	case "publications", "books", "journals":
		return true
	default:
		return false
	}
}
