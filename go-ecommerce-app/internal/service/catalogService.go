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

	exitCat, err := s.Repo.FindCategoryById(id)
	if err != nil {
		return nil, errors.New("category does not exist")

	}

	if len(input.Name) > 0 {
		exitCat.Name = input.Name
	}

	if input.ParentId > 0 {
		exitCat.ParentId = input.ParentId
	}

	if len(input.ImageUrl) > 0 {
		exitCat.ImageUrl = input.ImageUrl
	}

	if input.DisplayOrder > 0 {
		exitCat.DisplayOrder = input.DisplayOrder
	}

	updatedCat, err := s.Repo.EditCategory(exitCat)

	return updatedCat, err
}

func (service CatalogService) GetCategories() ([]*domain.Category, error) {

	categories, err := service.Repo.FindCategories()
	if err != nil {
		return nil, errors.New("categories does not exist")
	}

	return categories, err

}

func (s CatalogService) GetCategory(id int) (*domain.Category, error) {
	category_pointer, err := s.Repo.FindCategoryById(id)
	if err != nil {
		return nil, errors.New("category does not exist")

	}
	return category_pointer, nil
}