package ai

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strings"
	"time"
	"wippel-backend/internal/config"
)

// NVAPIService handles AI interactions via NVIDIA API.
type NVAPIService struct {
	config config.NVAPIConfig
	client *http.Client
}

// Message represents a chat message.
type Message struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

// ChatRequest represents the request to NVAPI.
type ChatRequest struct {
	Model       string    `json:"model"`
	Messages    []Message `json:"messages"`
	Temperature float64   `json:"temperature,omitempty"`
	MaxTokens   int       `json:"max_tokens,omitempty"`
	Stream      bool      `json:"stream"`
}

// ChatResponse represents the response from NVAPI.
type ChatResponse struct {
	ID      string   `json:"id"`
	Object  string   `json:"object"`
	Created int64    `json:"created"`
	Model   string   `json:"model"`
	Choices []Choice `json:"choices"`
	Usage   Usage    `json:"usage"`
}

// Choice represents a choice in the response.
type Choice struct {
	Index        int     `json:"index"`
	Message      Message `json:"message"`
	FinishReason string  `json:"finish_reason"`
}

// Usage represents token usage.
type Usage struct {
	PromptTokens     int `json:"prompt_tokens"`
	CompletionTokens int `json:"completion_tokens"`
	TotalTokens      int `json:"total_tokens"`
}

// NewNVAPIService creates a new NVAPI service from application configuration.
func NewNVAPIService(cfg config.NVAPIConfig) *NVAPIService {
	cfg.BaseURL = strings.TrimRight(cfg.BaseURL, "/")
	return &NVAPIService{
		config: cfg,
		client: &http.Client{
			Timeout: 60 * time.Second,
		},
	}
}

func (s *NVAPIService) Configured() bool {
	return s != nil && s.config.Enabled()
}

func (s *NVAPIService) Model() string {
	if s == nil {
		return ""
	}
	return s.config.Model
}

// Chat sends a chat completion request to NVAPI.
func (s *NVAPIService) Chat(messages []Message) (string, error) {
	if !s.Configured() {
		return "", fmt.Errorf("NVAPI is not configured")
	}

	requestBody := ChatRequest{
		Model:       s.config.Model,
		Messages:    messages,
		Temperature: 0.7,
		MaxTokens:   2048,
		Stream:      false,
	}

	jsonBody, err := json.Marshal(requestBody)
	if err != nil {
		return "", fmt.Errorf("marshal NVAPI request: %w", err)
	}

	req, err := http.NewRequest(http.MethodPost, s.config.BaseURL+"/chat/completions", bytes.NewReader(jsonBody))
	if err != nil {
		return "", fmt.Errorf("create NVAPI request: %w", err)
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+s.config.APIKey)

	resp, err := s.client.Do(req)
	if err != nil {
		return "", fmt.Errorf("send NVAPI request: %w", err)
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(io.LimitReader(resp.Body, 2<<20))
	if err != nil {
		return "", fmt.Errorf("read NVAPI response: %w", err)
	}
	if resp.StatusCode != http.StatusOK {
		return "", fmt.Errorf("NVAPI request failed with status %d", resp.StatusCode)
	}

	var response ChatResponse
	if err := json.Unmarshal(body, &response); err != nil {
		return "", fmt.Errorf("decode NVAPI response: %w", err)
	}
	if len(response.Choices) == 0 {
		return "", fmt.Errorf("NVAPI response contained no choices")
	}

	return response.Choices[0].Message.Content, nil
}

// GenerateProjectConsultation generates AI consultation for project ideas.
func (s *NVAPIService) GenerateProjectConsultation(userMessage string, conversationHistory []Message) (string, error) {
	systemPrompt := Message{
		Role: "system",
		Content: `You are ParsiAI, an intelligent project consultant for WIPPEL. Your role is to help users evaluate, refine, and perfect their project ideas before submission.

Your expertise includes:
- Technical feasibility analysis
- Budget and timeline estimation
- Technology stack recommendations
- Feature prioritization
- Risk assessment
- Best practices guidance

When analyzing project ideas:
1. Ask clarifying questions if details are missing
2. Provide specific, actionable recommendations
3. Consider both technical and business aspects
4. Suggest modern, scalable solutions
5. Be honest about potential challenges
6. Maintain a professional yet friendly tone

Keep responses concise (under 200 words) and focused on helping the user make informed decisions.`,
	}

	messages := []Message{systemPrompt}
	messages = append(messages, conversationHistory...)
	messages = append(messages, Message{Role: "user", Content: userMessage})

	return s.Chat(messages)
}
