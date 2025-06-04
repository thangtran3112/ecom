package api

import (
	"go-ecommerce-app/config"
	"net/http"
	"github.com/gofiber/fiber/v2"
)

func StartServer(config config.AppConfig) {
	// Initialize the Fiber app
	app := fiber.New()
	app.Get("/health", HealthCheck)
	app.Listen(config.ServerPort)
}
func HealthCheck(ctx *fiber.Ctx) error {
	return ctx.Status(http.StatusOK).JSON(&fiber.Map{
		"message" : "I am breathing!",
	})
}