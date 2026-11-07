package service

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"net/url"
	"time"
	"wippel-backend/internal/config"
	"wippel-backend/internal/models"
)

type ParseService struct {
	Config config.ParseConfig
}

func NewParseService(cfg config.ParseConfig) *ParseService {
	return &ParseService{Config: cfg}
}

// ---------- FetchAll: loads CV + Articles into Store ----------
func (p *ParseService) FetchAll(ctx context.Context) (*models.Store, error) {
	store := &models.Store{}

	// Fetch CV
	cvData, err := p.fetchCV(ctx)
	if err != nil {
		log.Printf("[Parse] FetchAll CV error: %v", err)
	} else {
		store.CV = cvData
	}

	// Fetch Articles
	articles, err := p.fetchArticles(ctx)
	if err != nil {
		log.Printf("[Parse] FetchAll Articles error: %v", err)
	} else {
		store.Articles = articles
	}

	return store, nil
}

func (p *ParseService) fetchCV(ctx context.Context) (models.CVData, error) {
	body, err := p.request(ctx, "GET", "/parse/classes/CV?limit=1", nil)
	if err != nil {
		return models.CVData{}, err
	}
	var resp struct {
		Results []json.RawMessage `json:"results"`
	}
	if err := json.Unmarshal(body, &resp); err != nil {
		return models.CVData{}, fmt.Errorf("parse CV response: %w", err)
	}
	if len(resp.Results) == 0 {
		return models.CVData{}, nil
	}

	var stored struct {
		CVJSON string `json:"cv_json"`
	}
	if err := json.Unmarshal(resp.Results[0], &stored); err != nil {
		return models.CVData{}, fmt.Errorf("parse CV object: %w", err)
	}
	if stored.CVJSON != "" {
		var cv models.CVData
		if err := json.Unmarshal([]byte(stored.CVJSON), &cv); err != nil {
			return models.CVData{}, fmt.Errorf("decode CV cv_json: %w", err)
		}
		return cv, nil
	}

	var cv models.CVData
	if err := json.Unmarshal(resp.Results[0], &cv); err != nil {
		return models.CVData{}, fmt.Errorf("decode direct CV fields: %w", err)
	}
	return cv, nil
}

func (p *ParseService) UpsertCV(ctx context.Context, cv models.CVData) (string, error) {
	encoded, err := json.Marshal(cv)
	if err != nil {
		return "", fmt.Errorf("encode CV: %w", err)
	}

	body, err := p.request(ctx, "GET", "/parse/classes/CV?limit=1", nil)
	if err != nil {
		return "", err
	}
	var existing struct {
		Results []struct {
			ObjectID string `json:"objectId"`
		} `json:"results"`
	}
	if err := json.Unmarshal(body, &existing); err != nil {
		return "", fmt.Errorf("parse CV lookup response: %w", err)
	}

	payload := map[string]interface{}{"cv_json": string(encoded)}
	if len(existing.Results) > 0 {
		id := existing.Results[0].ObjectID
		_, err := p.request(ctx, "PUT", "/parse/classes/CV/"+id, payload)
		return id, err
	}

	body, err = p.request(ctx, "POST", "/parse/classes/CV", payload)
	if err != nil {
		return "", err
	}
	var created struct {
		ObjectID string `json:"objectId"`
	}
	if err := json.Unmarshal(body, &created); err != nil {
		return "", fmt.Errorf("parse CV create response: %w", err)
	}
	return created.ObjectID, nil
}

func (p *ParseService) fetchArticles(ctx context.Context) ([]models.Article, error) {
	body, err := p.request(ctx, "GET", "/parse/classes/Articles?order=-createdAt&limit=100", nil)
	if err != nil {
		return nil, err
	}
	var resp struct {
		Results []json.RawMessage `json:"results"`
	}
	if err := json.Unmarshal(body, &resp); err != nil {
		return nil, fmt.Errorf("parse Articles response: %w", err)
	}
	var articles []models.Article
	for _, raw := range resp.Results {
		var a models.Article
		var parseObj struct {
			ObjectID    string `json:"objectId"`
			Title       string `json:"title"`
			URL         string `json:"url"`
			Summary     string `json:"summary"`
			Category    string `json:"category"`
			Status      string `json:"status"`
			PublishedAt string `json:"publishedAt"`
			CreatedAt   string `json:"createdAt"`
			UpdatedAt   string `json:"updatedAt"`
		}
		if err := json.Unmarshal(raw, &parseObj); err != nil {
			continue
		}
		a.ID = parseObj.ObjectID
		a.Title = parseObj.Title
		a.URL = parseObj.URL
		a.Summary = parseObj.Summary
		a.Category = parseObj.Category
		a.Status = parseObj.Status
		a.CreatedAt, _ = time.Parse(time.RFC3339, parseObj.CreatedAt)
		a.UpdatedAt, _ = time.Parse(time.RFC3339, parseObj.UpdatedAt)
		if parseObj.PublishedAt != "" {
			a.PublishedAt, _ = time.Parse(time.RFC3339, parseObj.PublishedAt)
		}
		articles = append(articles, a)
	}
	return articles, nil
}

// ---------- Articles CRUD ----------
func (p *ParseService) UpsertArticle(ctx context.Context, a models.Article) (string, error) {
	payload := map[string]interface{}{
		"title":    a.Title,
		"url":      a.URL,
		"summary":  a.Summary,
		"category": a.Category,
		"status":   a.Status,
	}
	if !a.PublishedAt.IsZero() {
		payload["publishedAt"] = a.PublishedAt.Format(time.RFC3339)
	}
	if a.ID != "" {
		// Update existing
		_, err := p.request(ctx, "PUT", "/parse/classes/Articles/"+a.ID, payload)
		return a.ID, err
	}
	// Create new
	body, err := p.request(ctx, "POST", "/parse/classes/Articles", payload)
	if err != nil {
		return "", err
	}
	var resp struct {
		ObjectID string `json:"objectId"`
	}
	json.Unmarshal(body, &resp)
	return resp.ObjectID, nil
}

func (p *ParseService) DeleteArticle(ctx context.Context, id string) error {
	_, err := p.request(ctx, "DELETE", "/parse/classes/Articles/"+id, nil)
	return err
}

// ---------- Generic admin content CRUD ----------
func contentClass(contentType string) (string, bool) {
	switch contentType {
	case "publications":
		return "Publications", true
	case "books":
		return "Books", true
	case "journals":
		return "Journals", true
	default:
		return "", false
	}
}

func (p *ParseService) ListContent(ctx context.Context, contentType string, limit int) ([]models.ContentItem, error) {
	className, ok := contentClass(contentType)
	if !ok {
		return nil, fmt.Errorf("unsupported content type")
	}
	path := fmt.Sprintf("/parse/classes/%s?order=-createdAt&limit=%d", className, limit)
	body, err := p.request(ctx, "GET", path, nil)
	if err != nil {
		return nil, err
	}
	var resp struct {
		Results []models.ContentItem `json:"results"`
	}
	if err := json.Unmarshal(body, &resp); err != nil {
		return nil, fmt.Errorf("parse %s response: %w", className, err)
	}
	return resp.Results, nil
}

func (p *ParseService) CreateContent(ctx context.Context, contentType string, item models.ContentItem) (string, error) {
	className, ok := contentClass(contentType)
	if !ok {
		return "", fmt.Errorf("unsupported content type")
	}
	body, err := p.request(ctx, "POST", "/parse/classes/"+className, mutableContentFields(item))
	if err != nil {
		return "", err
	}
	var resp struct {
		ObjectID string `json:"objectId"`
	}
	if err := json.Unmarshal(body, &resp); err != nil {
		return "", fmt.Errorf("parse %s create response: %w", className, err)
	}
	return resp.ObjectID, nil
}

func (p *ParseService) UpdateContent(ctx context.Context, contentType, id string, item models.ContentItem) error {
	className, ok := contentClass(contentType)
	if !ok {
		return fmt.Errorf("unsupported content type")
	}
	_, err := p.request(ctx, "PUT", "/parse/classes/"+className+"/"+id, mutableContentFields(item))
	return err
}

func (p *ParseService) DeleteContent(ctx context.Context, contentType, id string) error {
	className, ok := contentClass(contentType)
	if !ok {
		return fmt.Errorf("unsupported content type")
	}
	_, err := p.request(ctx, "DELETE", "/parse/classes/"+className+"/"+id, nil)
	return err
}

func mutableContentFields(item models.ContentItem) map[string]interface{} {
	fields := make(map[string]interface{}, len(item.Fields))
	for key, value := range item.Fields {
		switch key {
		case "objectId", "id", "createdAt", "updatedAt", "ACL":
			continue
		default:
			fields[key] = value
		}
	}
	return fields
}

// ---------- Orders CRUD ----------
func (p *ParseService) CreateOrder(ctx context.Context, o models.Order) (string, error) {
	payload := map[string]interface{}{
		"name":    o.Name,
		"email":   o.Email,
		"company": o.Company,
		"service": o.Service,
		"budget":  o.Budget,
		"message": o.Message,
		"lang":    o.Lang,
		"status":  "new",
	}
	body, err := p.request(ctx, "POST", "/parse/classes/Orders", payload)
	if err != nil {
		return "", err
	}
	var resp struct {
		ObjectID string `json:"objectId"`
	}
	json.Unmarshal(body, &resp)
	return resp.ObjectID, nil
}

func (p *ParseService) ListOrders(ctx context.Context, limit int) ([]models.Order, error) {
	path := fmt.Sprintf("/parse/classes/Orders?order=-createdAt&limit=%d", limit)
	body, err := p.request(ctx, "GET", path, nil)
	if err != nil {
		return nil, err
	}
	var resp struct {
		Results []json.RawMessage `json:"results"`
	}
	if err := json.Unmarshal(body, &resp); err != nil {
		return nil, err
	}
	var orders []models.Order
	for _, raw := range resp.Results {
		var parseObj map[string]interface{}
		if err := json.Unmarshal(raw, &parseObj); err != nil {
			continue
		}
		o := models.Order{
			ID:      getString(parseObj, "objectId"),
			Name:    getString(parseObj, "name"),
			Email:   getString(parseObj, "email"),
			Company: getString(parseObj, "company"),
			Service: getString(parseObj, "service"),
			Budget:  getString(parseObj, "budget"),
			Message: getString(parseObj, "message"),
			Lang:    getString(parseObj, "lang"),
			Status:  getString(parseObj, "status"),
		}
		if t, err := time.Parse(time.RFC3339, getString(parseObj, "createdAt")); err == nil {
			o.CreatedAt = t
		}
		orders = append(orders, o)
	}
	return orders, nil
}

func ValidOrderStatus(status string) bool {
	switch status {
	case "new", "pending", "in_progress", "completed", "cancelled":
		return true
	default:
		return false
	}
}

func (p *ParseService) UpdateOrderStatus(ctx context.Context, id, status string) error {
	if !ValidOrderStatus(status) {
		return fmt.Errorf("invalid order status")
	}
	_, err := p.request(ctx, "PUT", "/parse/classes/Orders/"+id, map[string]interface{}{"status": status})
	return err
}

func (p *ParseService) DeleteOrder(ctx context.Context, id string) error {
	_, err := p.request(ctx, "DELETE", "/parse/classes/Orders/"+id, nil)
	return err
}

// ---------- Contacts CRUD ----------
func (p *ParseService) CreateContact(ctx context.Context, c models.Contact) (string, error) {
	payload := map[string]interface{}{
		"name":    c.Name,
		"email":   c.Email,
		"phone":   c.Phone,
		"subject": c.Subject,
		"message": c.Message,
		"status":  "new",
	}
	body, err := p.request(ctx, "POST", "/parse/classes/Contacts", payload)
	if err != nil {
		return "", err
	}
	var resp struct {
		ObjectID string `json:"objectId"`
	}
	json.Unmarshal(body, &resp)
	return resp.ObjectID, nil
}

func (p *ParseService) ListContacts(ctx context.Context, limit int) ([]models.Contact, error) {
	path := fmt.Sprintf("/parse/classes/Contacts?order=-createdAt&limit=%d", limit)
	body, err := p.request(ctx, "GET", path, nil)
	if err != nil {
		return nil, err
	}
	var resp struct {
		Results []json.RawMessage `json:"results"`
	}
	if err := json.Unmarshal(body, &resp); err != nil {
		return nil, err
	}
	var contacts []models.Contact
	for _, raw := range resp.Results {
		var parseObj map[string]interface{}
		if err := json.Unmarshal(raw, &parseObj); err != nil {
			continue
		}
		c := models.Contact{
			ID:      getString(parseObj, "objectId"),
			Name:    getString(parseObj, "name"),
			Email:   getString(parseObj, "email"),
			Phone:   getString(parseObj, "phone"),
			Subject: getString(parseObj, "subject"),
			Message: getString(parseObj, "message"),
			Status:  getString(parseObj, "status"),
		}
		if t, err := time.Parse(time.RFC3339, getString(parseObj, "createdAt")); err == nil {
			c.CreatedAt = t
		}
		contacts = append(contacts, c)
	}
	return contacts, nil
}

func ValidContactStatus(status string) bool {
	switch status {
	case "new", "read", "replied", "closed":
		return true
	default:
		return false
	}
}

func (p *ParseService) UpdateContactStatus(ctx context.Context, id, status string) error {
	if !ValidContactStatus(status) {
		return fmt.Errorf("invalid contact status")
	}
	_, err := p.request(ctx, "PUT", "/parse/classes/Contacts/"+id, map[string]interface{}{"status": status})
	return err
}

func (p *ParseService) DeleteContact(ctx context.Context, id string) error {
	_, err := p.request(ctx, "DELETE", "/parse/classes/Contacts/"+id, nil)
	return err
}

// ---------- Admin ----------
func (p *ParseService) EnsureAdminExists(ctx context.Context, email, password string) error {
	// Check if admin user exists
	where, err := json.Marshal(map[string]string{"email": email})
	if err != nil {
		return fmt.Errorf("encode admin lookup: %w", err)
	}
	path := "/parse/classes/_User?where=" + url.QueryEscape(string(where)) + "&limit=1"
	body, err := p.request(ctx, "GET", path, nil)
	if err != nil {
		return err
	}
	var resp struct {
		Results []json.RawMessage `json:"results"`
	}
	json.Unmarshal(body, &resp)
	if len(resp.Results) > 0 {
		return nil // already exists
	}
	// Create admin user
	payload := map[string]interface{}{
		"username": email,
		"email":    email,
		"password": password,
		"role":     "admin",
	}
	_, err = p.request(ctx, "POST", "/parse/users", payload)
	return err
}

// ---------- Authentication ----------
func (p *ParseService) LoginUser(ctx context.Context, email, password string) (*models.User, error) {
	payload := map[string]interface{}{
		"username": email,
		"password": password,
	}
	body, err := p.request(ctx, "POST", "/parse/login", payload)
	if err != nil {
		return nil, err
	}
	var resp struct {
		ObjectID string `json:"objectId"`
		Username string `json:"username"`
		Email    string `json:"email"`
		Role     string `json:"role"`
	}
	if err := json.Unmarshal(body, &resp); err != nil {
		return nil, fmt.Errorf("parse login response: %w", err)
	}
	name := resp.Username
	if name == "" {
		name = resp.Email
	}
	return &models.User{
		ID:       resp.ObjectID,
		Email:    resp.Email,
		Name:     name,
		Role:     resp.Role,
		Username: resp.Username,
	}, nil
}

func (p *ParseService) RegisterUser(ctx context.Context, fullName, email, password string) (*models.User, error) {
	payload := map[string]interface{}{
		"username": email,
		"email":    email,
		"password": password,
		"fullName": fullName,
		"role":     "user",
	}
	body, err := p.request(ctx, "POST", "/parse/users", payload)
	if err != nil {
		return nil, err
	}
	var resp struct {
		ObjectID string `json:"objectId"`
		Username string `json:"username"`
		Email    string `json:"email"`
		FullName string `json:"fullName"`
		Role     string `json:"role"`
	}
	if err := json.Unmarshal(body, &resp); err != nil {
		return nil, fmt.Errorf("parse register response: %w", err)
	}

	if resp.Username == "" {
		resp.Username = email
	}
	if resp.Email == "" {
		resp.Email = email
	}
	if resp.FullName == "" {
		resp.FullName = fullName
	}
	if resp.FullName == "" {
		resp.FullName = resp.Username
	}
	if resp.Role == "" {
		resp.Role = "user"
	}

	return &models.User{
		ID:       resp.ObjectID,
		Email:    resp.Email,
		Name:     resp.FullName,
		Role:     resp.Role,
		Username: resp.Username,
	}, nil
}

// ---------- HTTP helper ----------
func (p *ParseService) request(ctx context.Context, method, path string, body interface{}) ([]byte, error) {
	url := p.Config.ServerURL + path
	var bodyReader io.Reader
	if body != nil {
		jsonBody, _ := json.Marshal(body)
		bodyReader = bytes.NewBuffer(jsonBody)
	}

	req, err := http.NewRequestWithContext(ctx, method, url, bodyReader)
	if err != nil {
		return nil, fmt.Errorf("create request: %w", err)
	}
	req.Header.Set("X-Parse-Application-Id", p.Config.AppID)
	req.Header.Set("X-Parse-REST-API-Key", p.Config.RestKey)
	if p.Config.MasterKey != "" {
		req.Header.Set("X-Parse-Master-Key", p.Config.MasterKey)
	}
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{Timeout: 30 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("parse request %s %s: %w", method, path, err)
	}
	defer resp.Body.Close()

	data, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("read response: %w", err)
	}

	if resp.StatusCode >= 400 {
		return data, fmt.Errorf("parse API %s %s returned %d: %s", method, path, resp.StatusCode, string(data))
	}

	return data, nil
}

// ---------- Utility ----------
func getString(m map[string]interface{}, key string) string {
	if v, ok := m[key]; ok {
		if s, ok := v.(string); ok {
			return s
		}
	}
	return ""
}
