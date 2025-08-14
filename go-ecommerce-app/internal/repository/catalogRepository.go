package repository

import (
	"errors"
	"go-ecommerce-app/internal/domain"
	"log"

	"gorm.io/gorm"
)

type CatalogRepository interface {
	CreateCategory(e *domain.Category) error
	FindCategories() ([]*domain.Category, error)
	FindCategoryById(id int) (*domain.Category, error)
	EditCategory(e *domain.Category) (*domain.Category, error)
	DeleteCategory(id int) error

	CreateProduct(e *domain.Product) error
	FindProducts() ([]*domain.Product, error)
	FindProductById(id int) (*domain.Product, error)
	FindSellerProducts(id int) ([]*domain.Product, error)
	EditProduct(e *domain.Product) (*domain.Product, error)
	DeleteProduct(e *domain.Product) error
}

type catalogRepository struct {
	db *gorm.DB
}

func (repo catalogRepository) CreateProduct(product *domain.Product) error {
	err := repo.db.Model(&domain.Product{}).Create(product).Error
	if err != nil {
		log.Printf("err: %v", err)
		return errors.New("cannot create product")
	}
	return nil
}

func (repo catalogRepository) FindProducts() ([]*domain.Product, error) {
	var products []*domain.Product
	err := repo.db.Find(&products).Error
	if err != nil {
		return nil, err
	}
	return products, nil
}

func (repo catalogRepository) FindProductById(id int) (*domain.Product, error) {
	var product *domain.Product
	err := repo.db.First(&product, id).Error
	if err != nil {
		log.Printf("db_err: %v", err)
		return nil, errors.New("product does not exist")
	}
	return product, nil
}

func (c catalogRepository) FindSellerProducts(id int) ([]*domain.Product, error) {
	var products []*domain.Product
	err := c.db.Where("user_id=?", id).Find(&products).Error
	if err != nil {
		return nil, err
	}
	return products, nil
}

func (c catalogRepository) EditProduct(e *domain.Product) (*domain.Product, error) {
	err := c.db.Save(&e).Error
	if err != nil {
		log.Printf("db_err: %v", err)
		return nil, errors.New("fail to update product")
	}
	return e, nil
}

func (c catalogRepository) DeleteProduct(e *domain.Product) error {
	err := c.db.Delete(&domain.Product{}, e.ID).Error
	if err != nil {
		return errors.New("product cannot delete")
	}
	return nil
}

func (repo catalogRepository) CreateCategory(category *domain.Category) error {
	err := repo.db.Create(&category).Error
	if err != nil {
		log.Printf("db_err: %v", err)
		return errors.New("create category failed")
	}
	// success
	return nil
}

func (repo catalogRepository) FindCategories() ([]*domain.Category, error) {
	var categories []*domain.Category

	err := repo.db.Find(&categories).Error

	if err != nil {
		return nil, err
	}

	// categories with error = nil
	return categories, nil
}

func (repo catalogRepository) FindCategoryById(id int) (*domain.Category, error) {
	var category *domain.Category

	// equivalent to repo.db.First(&category, 'id = ?', id)
	err := repo.db.First(&category, id).Error

	if err != nil {
		log.Printf("db_err: %v", err)
		return nil, errors.New("category does not exist")
	}

	return category, nil
}

func (repo catalogRepository) EditCategory(e *domain.Category) (*domain.Category, error) {
	err := repo.db.Save(&e).Error

	if err != nil {
		log.Printf("db_err: %v", err)
		return nil, errors.New("fail to update category")
	}

	return e, nil
}

func (repo catalogRepository) DeleteCategory(id int) error {

	err := repo.db.Delete(&domain.Category{}, id).Error

	if err != nil {
		log.Printf("db_err: %v", err)
		return errors.New("fail to delete category")
	}

	return nil

}

func NewCatalogRepository(db *gorm.DB) CatalogRepository {
	return &catalogRepository{
		db: db,
	}
}