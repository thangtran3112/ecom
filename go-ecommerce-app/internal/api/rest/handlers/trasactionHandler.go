package handlers

import (
	"go-ecommerce-app/internal/api/rest"
	"go-ecommerce-app/internal/helper"
	"go-ecommerce-app/internal/service"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)
type TransactionHandler struct {
	Svc           service.TransactionService
}

func initializeTransactionService(db *gorm.DB, auth helper.Auth) service.TransactionService {
	return service.TransactionService{
		Auth: auth,
	}
}

func SetupTransactionRoutes(as *rest.RestHandler) {
	app := as.App

	svc := initializeTransactionService(as.DB, as.Auth)


	handler := TransactionHandler{
		Svc:           svc,
	}

	secRoute := app.Group("/buyer", as.Auth.Authorize)
	secRoute.Get("/payment", handler.MakePayment)
	secRoute.Get("/verify", handler.VerifyPayment)

	sellerRoute := app.Group("/seller", as.Auth.AuthorizeSeller)
	sellerRoute.Get("/orders", handler.GetOrders)
	sellerRoute.Get("/orders/:id", handler.GetOrderDetails)
}

func (h *TransactionHandler) MakePayment(c *fiber.Ctx) error {
	return nil
}

func (h *TransactionHandler) VerifyPayment(c *fiber.Ctx) error {
	return nil
}

func (h *TransactionHandler) GetOrders(c *fiber.Ctx) error {
	return nil
}

func (h *TransactionHandler) GetOrderDetails(c *fiber.Ctx) error {
	return nil
}