package api

import (
	"go-ecommerce-app/config"
	"go-ecommerce-app/internal/api/rest"
	"net/http"
	"go-ecommerce-app/internal/api/rest/handlers"
	"github.com/gofiber/fiber/v2"
)

func StartServer(config config.AppConfig) {
	// Initialize the Fiber app
	app := fiber.New()
	// modify the Fiber app (like adding routes) and ensures working with 
	// the same app instance when using &
	restHandler := &rest.RestHandler{
		App: app,
	}
	setupRoutes(restHandler)
	app.Listen(config.ServerPort)
}
func HealthCheck(ctx *fiber.Ctx) error {
	return ctx.Status(http.StatusOK).JSON(&fiber.Map{
		"message" : "I am breathing!",
	})
}

func setupRoutes(rh *rest.RestHandler) {
	// user handler
	handlers.SetupUserRoutes(rh)
	// transactions
	// catalog
}