package handlers

import (
	"net/http"
)

type AdminHandler struct {
	BaseHandler
}

func (h *AdminHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	if !h.isAdmin(r) {
		http.Redirect(w, r, "/login", http.StatusFound)
		return
	}

	v := h.BaseView("admin", r)
	v.PageTitle = h.Config.SiteName + " | Admin Dashboard"
	v.IsAdmin = true

	h.StoreMu.RLock()
	v.Articles = h.Store.Articles
	h.StoreMu.RUnlock()

	h.Render(w, "admin", v)
}

func (h *AdminHandler) isAdmin(r *http.Request) bool {
	// Implement session/cookie check
	return true
}
func (h *AdminHandler) ListOrders(w http.ResponseWriter, r *http.Request) {
	if !h.isAdmin(r) {
		http.Redirect(w, r, "/login", http.StatusFound)
		return
	}
	v := h.BaseView("admin-orders", r)
	v.PageTitle = h.Config.SiteName + " | Project Inquiries"
	v.IsAdmin = true
	// Fetch orders from store or backend
	h.Render(w, "admin-orders", v)
}
