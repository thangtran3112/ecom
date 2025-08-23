package handlers

import (
	"encoding/json"
	"errors"
	"fmt"
	"go-ecommerce-app/config"
	"go-ecommerce-app/internal/api/rest"
	"go-ecommerce-app/internal/domain"
	"go-ecommerce-app/internal/dto"
	"go-ecommerce-app/internal/helper"
	"go-ecommerce-app/internal/repository"
	"go-ecommerce-app/internal/service"
	"go-ecommerce-app/pkg/payment"
	"net/http"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)
type TransactionHandler struct {
	TransactionSvc           service.TransactionService
	UserSvc       service.UserService
	PaymentClient payment.PaymentClient
	Config        config.AppConfig
}

func initializeTransactionService(db *gorm.DB, auth helper.Auth) service.TransactionService {
	return service.TransactionService{
		Auth: auth,
		Repo: repository.NewTransactionRepository(db),
	}
}

func SetupTransactionRoutes(restHandler *rest.RestHandler) {
	app := restHandler.App

	svc := initializeTransactionService(restHandler.DB, restHandler.Auth)
	useSvc := service.UserService{
		Repo:   repository.NewUserRepository(restHandler.DB),
		CatalogRepo:  repository.NewCatalogRepository(restHandler.DB),
		Auth:   restHandler.Auth,
		Config: restHandler.Config,
	}

	handler := TransactionHandler{
		TransactionSvc:           svc,
		PaymentClient: restHandler.PaymentClient,
		UserSvc:       useSvc,
		Config:        restHandler.Config,
	}

	secRoute := app.Group("/buyer", restHandler.Auth.Authorize)
	secRoute.Get("/payment", handler.MakePayment)
	secRoute.Get("/verify", handler.VerifyPayment)

	sellerRoute := app.Group("/seller", restHandler.Auth.AuthorizeSeller)
	sellerRoute.Get("/orders", handler.GetOrders)
	sellerRoute.Get("/orders/:id", handler.GetOrderDetails)
}

func (transactionHandler *TransactionHandler) MakePayment(ctx *fiber.Ctx) error {
		//1 grab authorized user
		user := transactionHandler.TransactionSvc.Auth.GetCurrentUser(ctx)

		pubKey := transactionHandler.Config.PubKey
	
		// 2. Check if user has an active payment session then return the payment url
		activePayment, _ := transactionHandler.TransactionSvc.GetActivePayment(user.ID)
		// if active payment is found, print out the payment url
		// TODO: remove this. Frontend will handle the payment url as we wants customize the payment form
		fmt.Println("activePayment", activePayment.PaymentUrl)
		if activePayment.ID > 0 {
			return ctx.Status(http.StatusOK).JSON(&fiber.Map{
				"message": "create payment",
				"pubKey":  pubKey,
				"secret":  activePayment.ClientSecret,
			})
		}
	
		//3. call user service get cart data to aggregate the total amount and collect payment
		_, amount, _ := transactionHandler.UserSvc.FindCart(user.ID)
	
		orderId, err := helper.RandomNumbers(8)
		if err != nil {
			return rest.InternalError(ctx, errors.New("error generating order id"))
		}
	
		// 4. Create a new payment session on stripe
		paymentResult, _ := transactionHandler.PaymentClient.CreatePayment(amount, user.ID, orderId)
	
		//5. Store payment session in db to create to store payment info
		err = transactionHandler.TransactionSvc.StoreCreatedPayment(dto.CreatePaymentRequest{
			UserId:       user.ID,
			Amount:       amount,
			ClientSecret: paymentResult.ClientSecret,
			PaymentId:    paymentResult.ID,
			OrderId:      orderId,
		})
	
		if err != nil {
			return ctx.Status(400).JSON(err)
		}
		return ctx.Status(http.StatusOK).JSON(&fiber.Map{
			"message": "create payment",
			"pubKey":  pubKey, // used for frontend together with secret to show the payment form
			"secret":  paymentResult.ClientSecret, // for frontend to show the payment form
		})
}

func (transactionHandler *TransactionHandler) VerifyPayment(ctx *fiber.Ctx) error {
	// grab authorized user
	user := transactionHandler.TransactionSvc.Auth.GetCurrentUser(ctx)

	// do we have active payment session to verify?
	activePayment, err := transactionHandler.TransactionSvc.GetActivePayment(user.ID)
	if err != nil || activePayment.ID == 0 {
		return ctx.Status(400).JSON(errors.New("no active payment exist"))
	}

	// fetch payment status from stripe
	paymentRes, err := transactionHandler.PaymentClient.GetPaymentStatus(activePayment.PaymentId)
	paymentJson, _ := json.Marshal(paymentRes)
	paymentLogs := string(paymentJson)
	paymentStatus := domain.PaymentStatusFailed

	// if payment then create order
	if domain.PaymentStatus(paymentRes.Status) == domain.PaymentStatusSuccess {
		// create Order
		paymentStatus = domain.PaymentStatusSuccess
		err = transactionHandler.UserSvc.CreateOrder(user.ID, activePayment.OrderId, activePayment.PaymentId, activePayment.Amount)
	}

	if err != nil {
		return rest.InternalError(ctx, err)
	}

	// update payment status
	transactionHandler.TransactionSvc.UpdatePayment(user.ID, paymentStatus, paymentLogs)

	return ctx.Status(http.StatusOK).JSON(&fiber.Map{
		"message":  "create payment",
		"response": paymentRes,
	})
}

func (h *TransactionHandler) GetOrders(ctx *fiber.Ctx) error {
	return ctx.Status(200).JSON("success")
}

func (h *TransactionHandler) GetOrderDetails(ctx *fiber.Ctx) error {
	return ctx.Status(200).JSON("success")
}