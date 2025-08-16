package handlers

import (
	"go-ecommerce-app/internal/api/rest"
	"go-ecommerce-app/internal/domain"
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
	selRoutes.Put("/categories/:id", handler.EditCategory)
	selRoutes.Delete("/categories/:id", handler.DeleteCategory)

	// Products
	selRoutes.Post("/products", handler.CreateProduct)
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
	id, _ := strconv.Atoi(ctx.Params("id"))
	req := dto.CreateCategoryRequest{}

	err := ctx.BodyParser(&req)
	if err != nil {
		return rest.BadRequestError(ctx, "update category request is not valid")
	}

	updatedCat, err := catalogHandler.svc.EditCategory(id, req)
	if err != nil {
		return rest.InternalError(ctx, err)
	}

	return rest.SuccessResponse(ctx, "category updated successfully", updatedCat)
}

func (catalogHandler CatalogHandler) DeleteCategory(ctx *fiber.Ctx) error {
	id, _ := strconv.Atoi(ctx.Params("id"))
	err := catalogHandler.svc.DeleteCategory(id)
	if err != nil {
		return rest.InternalError(ctx, err)
	}
	return rest.SuccessResponse(ctx, "category deleted successfully", nil)
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


func (catalogHandler CatalogHandler) CreateProduct(ctx *fiber.Ctx) error {
	req := dto.CreateProductRequest{}

	err := ctx.BodyParser(&req)
	if err != nil {
		return rest.BadRequestError(ctx, "create product request is not valid")
	}

	user := catalogHandler.svc.Auth.GetCurrentUser(ctx)
	product, err := catalogHandler.svc.CreateProduct(req, user)
	if err != nil {
		return rest.InternalError(ctx, err)
	}

	return rest.SuccessResponse(ctx, "product created successfully", product)
}

func (h CatalogHandler) GetProducts(ctx *fiber.Ctx) error {

	products, err := h.svc.GetProducts()
	if err != nil {
		return rest.ErrorMessage(ctx, 404, err)
	}

	return rest.SuccessResponse(ctx, "products", products)
}

func (h CatalogHandler) GetProduct(ctx *fiber.Ctx) error {

	id, _ := strconv.Atoi(ctx.Params("id"))

	product, err := h.svc.GetProductById(id)
	if err != nil {
		return rest.BadRequestError(ctx, "product not found")
	}

	return rest.SuccessResponse(ctx, "product", product)
}

func (catalogHandler CatalogHandler) EditProduct(ctx *fiber.Ctx) error {
	id, _ := strconv.Atoi(ctx.Params("id"))
	req := dto.CreateProductRequest{}
	err := ctx.BodyParser(&req)
	if err != nil {
		return rest.BadRequestError(ctx, "edit product request is not valid")
	}
	user := catalogHandler.svc.Auth.GetCurrentUser(ctx)
	product, err := catalogHandler.svc.EditProduct(id, req, user)
	if err != nil {
		return rest.InternalError(ctx, err)
	}
	return rest.SuccessResponse(ctx, "edit product", product)
}

func (h CatalogHandler) UpdateStock(ctx *fiber.Ctx) error {
	id, _ := strconv.Atoi(ctx.Params("id"))
	req := dto.UpdateStockRequest{}
	err := ctx.BodyParser(&req)
	if err != nil {
		return rest.BadRequestError(ctx, "update stock request is not valid")
	}
	user := h.svc.Auth.GetCurrentUser(ctx)

	product := domain.Product{
		ID:     uint(id),
		Stock:  uint(req.Stock),
		UserId: int(user.ID),
	}

	updatedProduct, _ := h.svc.UpdateProductStock(product)

	return rest.SuccessResponse(ctx, "update stock ", updatedProduct)
}

func (h CatalogHandler) DeleteProduct(ctx *fiber.Ctx) error {

	id, _ := strconv.Atoi(ctx.Params("id"))
	// need to provide user id to verify ownership
	user := h.svc.Auth.GetCurrentUser(ctx)
	err := h.svc.DeleteProduct(id, user)

	return rest.SuccessResponse(ctx, "Delete product ", err)
}