package handlers

import "net/http"

type CVHandler struct {
	BaseHandler
}

func (h *CVHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	v := h.BaseView("cv", r)
	v.PageTitle = h.Config.SiteName + " | CV - " + v.CV.Name
	h.Render(w, "cv", v)
}
