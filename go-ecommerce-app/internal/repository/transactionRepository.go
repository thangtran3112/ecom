package repository

import (
	"go-ecommerce-app/internal/domain"
	"go-ecommerce-app/internal/dto"

	"gorm.io/gorm"
)

type TransactionRepository interface {
	CreatePayment(payment *domain.Payment) error
	FindInitialPayment(uId uint) (*domain.Payment, error)
	UpdatePayment(payment *domain.Payment) error
	FindOrders(uId uint) ([]domain.OrderItem, error)
	FindOrderById(uId uint, id uint) (dto.SellerOrderDetails, error)
}

type TransactionStorage struct {
	db *gorm.DB
}

func NewTransactionRepository(db *gorm.DB) TransactionRepository {
	return &TransactionStorage{db: db}
}

func (trasactionRepo TransactionStorage) UpdatePayment(payment *domain.Payment) error {
	return trasactionRepo.db.Save(payment).Error
}

func (trasactionRepo TransactionStorage) FindInitialPayment(uId uint) (*domain.Payment, error) {
	var payment *domain.Payment
	err := trasactionRepo.db.First(&payment, "user_id=? AND status=?", uId, "initial").Order("created_at desc").Error
	return payment, err
}

func (trasactionRepo TransactionStorage) CreatePayment(payment *domain.Payment) error {
	return trasactionRepo.db.Create(payment).Error
}

func (trasactionRepo TransactionStorage) FindOrders(uId uint) ([]domain.OrderItem, error) {
	//TODO implement me
	panic("implement me")
}

func (trasactionRepo TransactionStorage) FindOrderById(uId uint, id uint) (dto.SellerOrderDetails, error) {
	//TODO implement me
	panic("implement me")
}


