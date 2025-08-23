package service

import (
	"go-ecommerce-app/internal/domain"
	"go-ecommerce-app/internal/dto"
	"go-ecommerce-app/internal/helper"
	"go-ecommerce-app/internal/repository"
)

type TransactionService struct {
	Repo repository.TransactionRepository
	Auth helper.Auth
}

func (transactionService TransactionService) GetOrders(u domain.User) ([]domain.OrderItem, error) {
	orders, err := transactionService.Repo.FindOrders(u.ID)
	if err != nil {
		return nil, err
	}
	return orders, nil
}

func (transactionService TransactionService) GetOrderDetails(u domain.User, id uint) (dto.SellerOrderDetails, error) {
	order, err := transactionService.Repo.FindOrderById(u.ID, id)
	if err != nil {
		return dto.SellerOrderDetails{}, err
	}
	return order, nil
}

func (transactionService TransactionService) GetActivePayment(uId uint) (*domain.Payment, error) {
	return transactionService.Repo.FindInitialPayment(uId)
}

func (transactionService TransactionService) StoreCreatedPayment(input dto.CreatePaymentRequest) error {
	payment := domain.Payment{
		UserId:       input.UserId,
		Amount:       input.Amount,
		Status:       domain.PaymentStatusInitial,
		PaymentId:    input.PaymentId,
		ClientSecret: input.ClientSecret,
		OrderId:      input.OrderId,
	}

	return transactionService.Repo.CreatePayment(&payment)
}

func (transactionService TransactionService) UpdatePayment(userId uint, status domain.PaymentStatus, paymentLog string) error {
	payment, err := transactionService.GetActivePayment(userId)
	if err != nil {
		return err
	}
	payment.Status = domain.PaymentStatus(status)
	payment.Response = paymentLog
	return transactionService.Repo.UpdatePayment(payment)
}

func NewTransactionService(transactionRepo repository.TransactionRepository, auth helper.Auth) *TransactionService {
	return &TransactionService{
		Repo: transactionRepo,
		Auth: auth,
	}
}