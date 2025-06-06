package handlers

import (
	"go-ecommerce-app/internal/api/rest"
	"go-ecommerce-app/internal/dto"
	"go-ecommerce-app/internal/repository"
	"go-ecommerce-app/internal/service"
	"log"
	"net/http"

	"github.com/gofiber/fiber/v2"
)

type UserHandler struct {
	// svc UserService
	svc service.UserService
}

func SetupUserRoutes(restHandler *rest.RestHandler) {
	app := restHandler.App

	svc := service.UserService{
		Repo: repository.NewUserRepository(restHandler.DB),
		Auth: restHandler.Auth,
	}
	// create an instance of user service & inject to handler
	handler := UserHandler{
		svc: svc,
	}

	pubRoutes := app.Group("/")

	// Public endpoints
	pubRoutes.Post("/register", handler.Register)
	pubRoutes.Post("/login", handler.Login)

	privateRoutes := app.Group("/users", restHandler.Auth.Authorize)

	// Protected endpoints
	privateRoutes.Get("/verify", handler.GetVerificationCode)
	privateRoutes.Post("/verify", handler.Verify)

	privateRoutes.Post("/profile", handler.CreateProfile)
	privateRoutes.Get("/profile", handler.GetProfile)
	privateRoutes.Patch("/profile", handler.UpdateProfile)

	privateRoutes.Post("/cart", handler.AddToCart)
	privateRoutes.Get("/cart", handler.GetCart)

	privateRoutes.Get("/order", handler.GetOrders)
	privateRoutes.Get("/order/:id", handler.GetOrder)

	privateRoutes.Post("/become-seller", handler.BecomeSeller)

}

func (h *UserHandler) Register(ctx *fiber.Ctx) error {
	// to create user
	user := dto.UserSignup{}
	// parse the request body into the user pointer struct
	err := ctx.BodyParser(&user)
	if err != nil {
		return ctx.Status(http.StatusBadRequest).JSON(&fiber.Map{
			"message": "please provide valid inputs",
		})
	}
	
	token, err := h.svc.Signup(user)
	if err != nil {
		return ctx.Status(http.StatusInternalServerError).JSON(&fiber.Map{
			"message": "server error on signup",
		})
	}
	
	return ctx.Status(http.StatusOK).JSON(&fiber.Map{
		"message": "register",
		"token": token,
	})
}

func (h *UserHandler) Login(ctx *fiber.Ctx) error {
	loginInput := dto.UserLogin{}
	err := ctx.BodyParser(&loginInput)
	if err != nil {
		return ctx.Status(http.StatusBadRequest).JSON(&fiber.Map{
			"message": "please provide valid inputs",
		})
	}
	token, err := h.svc.Login(loginInput.Email, loginInput.Password)
	if err != nil {
		return ctx.Status(http.StatusUnauthorized).JSON(&fiber.Map{
			"message": "please provide valid credentials",
		})
	}

	return ctx.Status(http.StatusOK).JSON(&fiber.Map{
		"message": "login",
		"token": token,
	})
}

func (h *UserHandler) GetVerificationCode(ctx *fiber.Ctx) error {
	return ctx.Status(http.StatusOK).JSON(&fiber.Map{
		"message": "verify successful",
	})
}

func (h *UserHandler) Verify(ctx *fiber.Ctx) error {
	return ctx.Status(http.StatusOK).JSON(&fiber.Map{
		"message": "verify successful",
	})
}

func (h *UserHandler) CreateProfile(ctx *fiber.Ctx) error {
	return ctx.Status(http.StatusOK).JSON(&fiber.Map{
		"message": "profile created successfully",
	})
}

func (h *UserHandler) GetProfile(ctx *fiber.Ctx) error {

	user := h.svc.Auth.GetCurrentUser(ctx)
	log.Println(user)

	// call user service and perform get profile
	profile, err := h.svc.GetProfile(user.ID)
	if err != nil {
		return ctx.Status(http.StatusInternalServerError).JSON(&fiber.Map{
			"message": "unable to get profile",
		})
	}

	return ctx.Status(http.StatusOK).JSON(&fiber.Map{
		"message": "get profile",
		"profile": profile,
	})
}

func (h *UserHandler) UpdateProfile(ctx *fiber.Ctx) error {
	return ctx.Status(http.StatusOK).JSON(&fiber.Map{
		"message": "profile updated successfully",
	})
}
func (h *UserHandler) AddToCart(ctx *fiber.Ctx) error {
	return ctx.Status(http.StatusOK).JSON(&fiber.Map{
		"message": "item added to cart successfully",
	})
}
func (h *UserHandler) GetCart(ctx *fiber.Ctx) error {
	return ctx.Status(http.StatusOK).JSON(&fiber.Map{
		"message": "cart retrieved successfully",
	})
}
func (h *UserHandler) GetOrders(ctx *fiber.Ctx) error {
	return ctx.Status(http.StatusOK).JSON(&fiber.Map{
		"message": "orders retrieved successfully",
	})
}
func (h *UserHandler) GetOrder(ctx *fiber.Ctx) error {
	return ctx.Status(http.StatusOK).JSON(&fiber.Map{
		"message": "order retrieved successfully",
	})
}
func (h *UserHandler) BecomeSeller(ctx *fiber.Ctx) error {
	return ctx.Status(http.StatusOK).JSON(&fiber.Map{
		"message": "seller registration successful",
	})
}