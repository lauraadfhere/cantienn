package handlers

import (
	"net/http"
	"strings"
	"sync"
	"wippel-backend/internal/config"
	"wippel-backend/internal/models"
	"wippel-backend/internal/service"
)

type BaseHandler struct {
	Config          *config.Config
	TemplateService *service.TemplateService
	StoreMu         *sync.RWMutex
	Store           *models.Store
}

type ViewData struct {
	Page              string
	PageTitle         string
	Year              int
	CV                models.CVData
	SelectedCertSlug  string
	SelectedCertPDF   string
	SelectedCertTitle string
	HeroTitle         string
	HeroSubtitle      string
	ListTitle         string
	Articles          []models.Article
	Orders            []models.Order
	Error             string
	Notice            string
	IsAdmin           bool
	ClientName        string
	ClientEmail       string
	AdminEmail        string
	Lang              string
	LangPrefix        string
	Dir               string
	Path              string
	SiteURL           string
}

func (h *BaseHandler) BaseView(page string, r *http.Request) ViewData {
	h.StoreMu.RLock()
	currentCV := h.Store.CV
	h.StoreMu.RUnlock()

	lang := h.langFromRequest(r)
	langPrefix := ""
	if lang == "fr" {
		langPrefix = "/fr"
	} else if lang == "ar" {
		langPrefix = "/ar"
	}
	dir := "ltr"
	if lang == "ar" {
		dir = "rtl"
	}

	return ViewData{
		Page:       page,
		Year:       2026,
		CV:         currentCV,
		Lang:       lang,
		LangPrefix: langPrefix,
		Dir:        dir,
		Path:       r.URL.Path,
		SiteURL:    h.Config.SiteURL,
		AdminEmail: h.Config.AdminEmail,
	}
}

func (h *BaseHandler) langFromRequest(r *http.Request) string {
	if strings.HasPrefix(r.URL.Path, "/fr") {
		return "fr"
	}
	if strings.HasPrefix(r.URL.Path, "/ar") {
		return "ar"
	}
	return "en"
}

func (h *BaseHandler) Render(w http.ResponseWriter, name string, data interface{}) {
	if err := h.TemplateService.Render(w, name, data); err != nil {
		http.Error(w, "internal server error", http.StatusInternalServerError)
	}
}
