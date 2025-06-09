package api

import (
	"go-ecommerce-app/config"
	"go-ecommerce-app/internal/api/rest"
	"go-ecommerce-app/internal/api/rest/handlers"
	"go-ecommerce-app/internal/domain"
	"go-ecommerce-app/internal/helper"
	"log"
	"net/http"

	"github.com/gofiber/fiber/v2"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func StartServer(config config.AppConfig) {
	// Initialize the Fiber app
	app := fiber.New()

	db, err := gorm.Open(postgres.Open(config.Dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("Failed to connect to database: %v\n", err)
	}

	log.Println("Connected to database")

	// run the migrations
	err = db.AutoMigrate(&domain.User{}, &domain.BankAccount{})
	if err != nil {
		log.Fatalf("Failed to migrate database: %v\n", err)
	}

	log.Println("Database migrated successfully")

	auth := helper.SetupAuth(config.AppSecret)
	
	// modify the Fiber app (like adding routes) and ensures working with 
	// the same app instance when using &
	restHandler := &rest.RestHandler{
		App: app,
		DB: db,
		Auth: auth,
		Config: config,
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