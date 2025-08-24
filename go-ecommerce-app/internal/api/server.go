package api

import (
	"go-ecommerce-app/config"
	"go-ecommerce-app/internal/api/rest"
	"go-ecommerce-app/internal/api/rest/handlers"
	"go-ecommerce-app/internal/domain"
	"go-ecommerce-app/internal/helper"
	"go-ecommerce-app/pkg/payment"
	"log"
	"net/http"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func StartServer(config config.AppConfig) {
	app := BuildApp(config)
	app.Listen(config.ServerPort)
}
// BuildApp constructs and configures the Fiber app (DB, routes, middleware) without starting the listener.
func BuildApp(config config.AppConfig) *fiber.App {
	// Initialize the Fiber app
	app := fiber.New()

	db, err := gorm.Open(postgres.Open(config.Dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("Failed to connect to database: %v\n", err)
	}

	log.Println("Connected to database")

	// run the migrations
	err = db.AutoMigrate(
		&domain.User{},
		&domain.Address{},
		&domain.BankAccount{},
		&domain.Category{},
		&domain.Product{},
		&domain.Cart{},
		&domain.Order{},
		&domain.OrderItem{},
		&domain.Payment{},
	)
	if err != nil {
		log.Fatalf("Failed to migrate database: %v\n", err)
	}

	log.Println("Database migrated successfully")

	// cors configuration
	corsConfig := cors.New(cors.Config{
		AllowOrigins: "*",
		AllowHeaders: "Content-Type, Accept, Authorization",
		AllowMethods: "GET, POST, PUT, PATCH, DELETE, OPTIONS",
	})

	app.Use(corsConfig)

	auth := helper.SetupAuth(config.AppSecret)

	paymentClient := payment.NewPaymentClient(config.StripeSecretKey)

	// modify the Fiber app (like adding routes) and ensures working with 
	// the same app instance when using &
	restHandler := &rest.RestHandler{
		App: app,
		DB: db,
		Auth: auth,
		Config: config,
		PaymentClient: paymentClient,
	}
	setupRoutes(restHandler)
	return app
}
func HealthCheck(ctx *fiber.Ctx) error {
	return ctx.Status(http.StatusOK).JSON(&fiber.Map{
		"message" : "I am breathing!",
	})
}

func setupRoutes(restHandler *rest.RestHandler) {
	// user handler
	handlers.SetupUserRoutes(restHandler)
	// transactions
	handlers.SetupTransactionRoutes(restHandler)
	// catalog
	handlers.SetupCatalogRoutes(restHandler)
}