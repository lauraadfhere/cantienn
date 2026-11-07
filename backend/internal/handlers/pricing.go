package handlers

import "net/http"

type PricingHandler struct {
	BaseHandler
}

func (h *PricingHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	v := h.BaseView("pricing", r)
	v.PageTitle = h.Config.SiteName + " | Pricing"
	h.Render(w, "pricing", v)
}
