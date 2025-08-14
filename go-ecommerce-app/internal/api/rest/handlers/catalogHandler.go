package handlers

import (
	"go-ecommerce-app/internal/api/rest"
	"go-ecommerce-app/internal/dto"
	"go-ecommerce-app/internal/repository"
	"go-ecommerce-app/internal/service"
	"strconv"

	"github.com/gofiber/fiber/v2"
)

type CatalogHandler struct {
	svc service.CatalogService
}

func SetupCatalogRoutes(restHandler *rest.RestHandler) {
	app := restHandler.App

	// create an instance of user service & inject to handler
	svc := service.CatalogService{
		Repo:   repository.NewCatalogRepository(restHandler.DB),
		Auth:   restHandler.Auth,
		Config: restHandler.Config,
	}

	handler := CatalogHandler{
		svc: svc,
	}

	// public
	// listing products and categories
	app.Get("/products", handler.GetProducts)
	app.Get("/products/:id", handler.GetProduct)
	app.Get("/categories", handler.GetCategories)
	app.Get("/categories/:id", handler.GetCategoryById)

	// private
	// manage products and categories
	selRoutes := app.Group("/seller", restHandler.Auth.AuthorizeSeller)
	// Categories
	selRoutes.Post("/categories", handler.CreateCategories)
	selRoutes.Patch("/categories/:id", handler.EditCategory)
	selRoutes.Delete("/categories/:id", handler.DeleteCategory)

	// Products
	selRoutes.Post("/products", handler.CreateProducts)
	selRoutes.Get("/products", handler.GetProducts)
	selRoutes.Get("/products/:id", handler.GetProduct)
	selRoutes.Put("/products/:id", handler.EditProduct)
	selRoutes.Patch("/products/:id", handler.UpdateStock) // update stock
	selRoutes.Delete("/products/:id", handler.DeleteProduct)

}

func (catalogHandler CatalogHandler) CreateCategories(ctx *fiber.Ctx) error {
	req := dto.CreateCategoryRequest{}

	err := ctx.BodyParser(&req) // parse the request body into the req struct

	if err != nil {
		return rest.BadRequestError(ctx, "create category request is not valid")
	}

	err = catalogHandler.svc.CreateCategory(req)

	if err != nil {
		return rest.InternalError(ctx, err)
	}

	return rest.SuccessResponse(ctx, "category created successfully", nil)
}

func (catalogHandler CatalogHandler) EditCategory(ctx *fiber.Ctx) error {
	return rest.SuccessResponse(ctx, "category updated successfully", nil)
}

func (catalogHandler CatalogHandler) DeleteCategory(ctx *fiber.Ctx) error {
	return rest.SuccessResponse(ctx, "category deleted successfully", nil)
}

func (catalogHandler CatalogHandler) CreateProducts(ctx *fiber.Ctx) error {
	return rest.SuccessResponse(ctx, "product created successfully", nil)
}

func (catalogHandler CatalogHandler) GetProducts(ctx *fiber.Ctx) error {
	return rest.SuccessResponse(ctx, "products fetched successfully", nil)
}

func (catalogHandler CatalogHandler) GetProduct(ctx *fiber.Ctx) error {
	return rest.SuccessResponse(ctx, "product fetched successfully", nil)
}
func (catalogHandler CatalogHandler) EditProduct(ctx *fiber.Ctx) error {
	return rest.SuccessResponse(ctx, "product updated successfully", nil)
}
func (catalogHandler CatalogHandler) UpdateStock(ctx *fiber.Ctx) error {
	return rest.SuccessResponse(ctx, "product stock updated successfully", nil)
}
func (catalogHandler CatalogHandler) DeleteProduct(ctx *fiber.Ctx) error {
	return rest.SuccessResponse(ctx, "product deleted successfully", nil)
}

func (catalogHandler CatalogHandler) GetCategories(ctx *fiber.Ctx) error {
	categories, err := catalogHandler.svc.GetCategories()
	if err != nil {
		return rest.ErrorMessage(ctx, 404, err)
	}
	return rest.SuccessResponse(ctx, "categories", categories)
}

func (catalogHandler CatalogHandler) GetCategoryById(ctx *fiber.Ctx) error {
	id, _ := strconv.Atoi(ctx.Params("id"))
	category, err := catalogHandler.svc.GetCategory(id)
	if err != nil {
		return rest.ErrorMessage(ctx, 404, err)
	}
	return rest.SuccessResponse(ctx, "category", category)
}
