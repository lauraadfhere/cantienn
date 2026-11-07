package service

import (
	"context"
	"wippel-backend/internal/models"
)

type BackendService interface {
	FetchAll(ctx context.Context) (*models.Store, error)
	UpsertArticle(ctx context.Context, a models.Article) (string, error)
	DeleteArticle(ctx context.Context, id string) error
	CreateOrder(ctx context.Context, o models.Order) (string, error)
	ListOrders(ctx context.Context, limit int) ([]models.Order, error)
	DeleteOrder(ctx context.Context, id string) error
	EnsureAdminExists(ctx context.Context, email, password string) error
}
