package handlers

import (
	"log"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"wippel-backend/internal/ai"
	"wippel-backend/internal/config"
)

const (
	maxAIRequestBytes = 128 << 10
	maxAIMessageRunes = 4000
	maxAIHistoryItems = 20
	maxAIHistoryRunes = 16000
)

// AIHandler handles AI-related requests.
type AIHandler struct {
	nvapiService *ai.NVAPIService
}

// NewAIHandler creates a new AI handler.
func NewAIHandler(cfg config.NVAPIConfig) *AIHandler {
	return &AIHandler{nvapiService: ai.NewNVAPIService(cfg)}
}

// ChatRequest represents the chat request from frontend.
type ChatRequest struct {
	Message string `json:"message"`
	History []struct {
		Role    string `json:"role"`
		Content string `json:"content"`
	} `json:"history"`
}

// ChatResponse represents the chat response.
type ChatResponse struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
	Error   string `json:"error,omitempty"`
}

// Chat handles AI chat requests.
func (h *AIHandler) Chat(c *gin.Context) {
	c.Request.Body = http.MaxBytesReader(c.Writer, c.Request.Body, maxAIRequestBytes)

	var req ChatRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, ChatResponse{Success: false, Error: "Invalid request format"})
		return
	}

	req.Message = strings.TrimSpace(req.Message)
	if req.Message == "" {
		c.JSON(http.StatusBadRequest, ChatResponse{Success: false, Error: "Message is required"})
		return
	}
	if len([]rune(req.Message)) > maxAIMessageRunes {
		c.JSON(http.StatusBadRequest, ChatResponse{Success: false, Error: "Message is too long"})
		return
	}
	if len(req.History) > maxAIHistoryItems {
		c.JSON(http.StatusBadRequest, ChatResponse{Success: false, Error: "Conversation history is too long"})
		return
	}

	history := make([]ai.Message, 0, len(req.History))
	totalHistoryRunes := 0
	for _, msg := range req.History {
		role := strings.ToLower(strings.TrimSpace(msg.Role))
		content := strings.TrimSpace(msg.Content)
		if role != "user" && role != "assistant" {
			c.JSON(http.StatusBadRequest, ChatResponse{Success: false, Error: "History roles must be user or assistant"})
			return
		}
		contentRunes := len([]rune(content))
		if content == "" || contentRunes > maxAIMessageRunes {
			c.JSON(http.StatusBadRequest, ChatResponse{Success: false, Error: "History content is invalid"})
			return
		}
		totalHistoryRunes += contentRunes
		if totalHistoryRunes > maxAIHistoryRunes {
			c.JSON(http.StatusBadRequest, ChatResponse{Success: false, Error: "Conversation history is too long"})
			return
		}
		history = append(history, ai.Message{Role: role, Content: content})
	}

	response, err := h.nvapiService.GenerateProjectConsultation(req.Message, history)
	if err != nil {
		log.Printf("[AI] NVAPI request failed: %v", err)
		c.JSON(http.StatusBadGateway, ChatResponse{Success: false, Error: "AI service is currently unavailable"})
		return
	}

	c.JSON(http.StatusOK, ChatResponse{Success: true, Message: response})
}

// HealthCheck reports whether AI service configuration is complete.
func (h *AIHandler) HealthCheck(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"configured": h.nvapiService.Configured(),
		"model":      h.nvapiService.Model(),
		"service":    "NVAPI",
	})
}
