package handlers

import (
	"net/http"
	"wippel-backend/internal/models"
)

type HomeHandler struct {
	BaseHandler
}

func (h *HomeHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	v := h.BaseView("home", r)
	v.PageTitle = h.Config.SiteName + " | AI & Web Development Engineer"

	h.StoreMu.RLock()
	v.Articles = h.filterArticles(h.Store.Articles, "Articles")
	v.CV = h.Store.CV
	h.StoreMu.RUnlock()

	h.Render(w, "home", v)
}

func (h *HomeHandler) filterArticles(articles []models.Article, category string) []models.Article {
	var filtered []models.Article
	for _, a := range articles {
		if a.Category == category {
			filtered = append(filtered, a)
		}
	}
	return filtered
}
