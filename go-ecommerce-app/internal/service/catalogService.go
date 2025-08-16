package service

import (
	"errors"
	"go-ecommerce-app/config"
	"go-ecommerce-app/internal/domain"
	"go-ecommerce-app/internal/dto"
	"go-ecommerce-app/internal/helper"
	"go-ecommerce-app/internal/repository"
)

type CatalogService struct {
	Repo repository.CatalogRepository
	Auth helper.Auth
	Config config.AppConfig
}

func (service CatalogService) CreateCategory(input dto.CreateCategoryRequest) error {

	// because GORM needs a pointer to the struct, we need to pass a pointer to the struct
	err := service.Repo.CreateCategory(&domain.Category{
		Name:         input.Name,
		ImageUrl:     input.ImageUrl,
		DisplayOrder: input.DisplayOrder,
	})

	return err
}

func (s CatalogService) EditCategory(id int, input dto.CreateCategoryRequest) (*domain.Category, error) {

	existingCategory, err := s.Repo.FindCategoryById(id)
	if err != nil {
		return nil, errors.New("category does not exist")

	}

	if len(input.Name) > 0 {
		existingCategory.Name = input.Name
	}

	if input.ParentId > 0 {
		existingCategory.ParentId = input.ParentId
	}

	if len(input.ImageUrl) > 0 {
		existingCategory.ImageUrl = input.ImageUrl
	}

	if input.DisplayOrder > 0 {
		existingCategory.DisplayOrder = input.DisplayOrder
	}

	updatedCat, err := s.Repo.EditCategory(existingCategory)

	return updatedCat, err
}

func (service CatalogService) DeleteCategory(id int) error {
	err := service.Repo.DeleteCategory(id)
	if err != nil {
		return errors.New("category does not exist")
	}
	return nil
}

func (service CatalogService) GetCategories() ([]*domain.Category, error) {

	categories, err := service.Repo.FindCategories()
	if err != nil {
		return nil, errors.New("categories does not exist")
	}

	return categories, err

}

func (service CatalogService) GetCategory(id int) (*domain.Category, error) {
	category_pointer, err := service.Repo.FindCategoryById(id)
	if err != nil {
		return nil, errors.New("category does not exist")

	}
	return category_pointer, nil
}

// we do not use pointers here because we are not modifying the product reference
// copying input and user are relatively cheap
func (service CatalogService) CreateProduct(input dto.CreateProductRequest, user domain.User) (*domain.Product, error) {
	createdProduct, err := service.Repo.CreateProduct(&domain.Product{
		Name:        input.Name,
		Description: input.Description,
		Price:       input.Price,
		CategoryId:  input.CategoryId,
		ImageUrl:    input.ImageUrl,
		UserId:      int(user.ID),
		Stock:       uint(input.Stock),
	})

	if err != nil {
		return nil, err
	}

	return createdProduct, nil
}

func (service CatalogService) EditProduct(id int, input dto.CreateProductRequest, user domain.User) (*domain.Product, error) {

	exitProduct, err := service.Repo.FindProductById(id)
	if err != nil {
		return nil, errors.New("product does not exist")
	}

	// verify product owner
	if exitProduct.UserId != int(user.ID) {
		return nil, errors.New("you don't have manage rights of this product")
	}

	if len(input.Name) > 0 {
		exitProduct.Name = input.Name
	}

	if len(input.Description) > 0 {
		exitProduct.Description = input.Description
	}

	if input.Price > 0 {
		exitProduct.Price = input.Price
	}

	if input.CategoryId > 0 {
		exitProduct.CategoryId = input.CategoryId
	}

	updatedProduct, err := service.Repo.EditProduct(exitProduct)

	return updatedProduct, err
}

func (s CatalogService) DeleteProduct(id int, user domain.User) error {
	exitProduct, err := s.Repo.FindProductById(id)
	if err != nil {
		return errors.New("product does not exist")
	}

	// verify product owner
	if exitProduct.UserId != int(user.ID) {
		return errors.New("you don't have manage rights of this product")
	}

	err = s.Repo.DeleteProduct(exitProduct)
	if err != nil {
		return errors.New("product cannot delete")
	}

	return nil
}

func (s CatalogService) GetProducts() ([]*domain.Product, error) {
	products, err := s.Repo.FindProducts()
	if err != nil {
		return nil, errors.New("products does not exist")
	}

	return products, err
}

func (s CatalogService) GetProductById(id int) (*domain.Product, error) {
	product, err := s.Repo.FindProductById(id)
	if err != nil {
		return nil, errors.New("product does not exist")
	}

	return product, nil
}

func (s CatalogService) GetSellerProducts(id int) ([]*domain.Product, error) {
	products, err := s.Repo.FindSellerProducts(id)
	if err != nil {
		return nil, errors.New("products does not exist")
	}

	return products, err
}

func (s CatalogService) UpdateProductStock(e domain.Product) (*domain.Product, error) {
	product, err := s.Repo.FindProductById(int(e.ID))
	if err != nil {
		return nil, errors.New("product not found")
	}

	// verify product owner
	if product.UserId != e.UserId {
		return nil, errors.New("you don't have manage rights of this product")
	}
	product.Stock = e.Stock
	editProduct, err := s.Repo.EditProduct(product)
	if err != nil {
		return nil, err
	}
	return editProduct, nil
}