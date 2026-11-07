package handlers

import (
	"net/http"
)

type LoginHandler struct {
	BaseHandler
}

func (h *LoginHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodGet {
		v := h.BaseView("login", r)
		v.PageTitle = h.Config.SiteName + " | Login"
		h.Render(w, "login", v)
		return
	}
	
	// Handle POST
	// ... authentication logic ...
}
