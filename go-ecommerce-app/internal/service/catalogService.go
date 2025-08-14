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
func (service CatalogService) CreateProduct(input dto.CreateProductRequest, user domain.User) error {
	err := service.Repo.CreateProduct(&domain.Product{
		Name:        input.Name,
		Description: input.Description,
		Price:       input.Price,
		CategoryId:  input.CategoryId,
		ImageUrl:    input.ImageUrl,
		UserId:      int(user.ID),
		Stock:       uint(input.Stock),
	})

	return err
}