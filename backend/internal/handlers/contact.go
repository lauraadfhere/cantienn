package handlers

import (
	"crypto/rand"
	"encoding/json"
	"fmt"
	"math/big"
	"net/http"

	"wippel-backend/internal/service"
)

type MathCaptcha struct {
	Question string
	Answer   int
}

type ContactHandler struct {
	BaseHandler
	EmailService *service.EmailService
}

func (h *ContactHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodGet {
		v := h.BaseView("contact", r)
		v.PageTitle = h.Config.SiteName + " | Contact"
		// v.MathCaptcha = h.generateMathCaptcha()
		h.Render(w, "contact", v)
		return
	}

	// Handle POST
	if r.Method == http.MethodPost {
		var contactData struct {
			Name    string `json:"name"`
			Email   string `json:"email"`
			Subject string `json:"subject"`
			Message string `json:"message"`
		}

		if err := json.NewDecoder(r.Body).Decode(&contactData); err != nil {
			http.Error(w, "Invalid request", http.StatusBadRequest)
			return
		}

		// Send notification email to admin
		if h.EmailService != nil {
			emailData := service.EmailData{
				SiteName: h.Config.SiteName,
				SiteURL:  h.Config.SiteURL,
				Name:     contactData.Name,
				Email:    contactData.Email,
				Subject:  contactData.Subject,
				Message:  contactData.Message,
			}
			if err := h.EmailService.SendContactNotification(emailData); err != nil {
				// Log error but don't fail the request
				fmt.Printf("Failed to send contact notification: %v\n", err)
			}
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(map[string]string{"status": "success"})
		return
	}
}

func (h *ContactHandler) generateMathCaptcha() MathCaptcha {
	n1, _ := rand.Int(rand.Reader, big.NewInt(10))
	n2, _ := rand.Int(rand.Reader, big.NewInt(10))
	a := int(n1.Int64())
	b := int(n2.Int64())
	return MathCaptcha{
		Question: fmt.Sprintf("%d + %d =", a, b),
		Answer:   a + b,
	}
}
