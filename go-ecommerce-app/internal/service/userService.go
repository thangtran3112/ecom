package service

import (
	"errors"
	"fmt"
	"go-ecommerce-app/config"
	"go-ecommerce-app/internal/domain"
	"go-ecommerce-app/internal/dto"
	"go-ecommerce-app/internal/helper"
	"go-ecommerce-app/internal/repository"
	"go-ecommerce-app/pkg/notification"
	"log"
	"time"
)

type UserService struct {
	Repo repository.UserRepository
	Auth helper.Auth
	Config config.AppConfig
}

func (userService UserService) Signup(input dto.UserSignup) (string, error){
	log.Println("signup", input)
	hashedPassword, err := userService.Auth.CreateHashedPassword(input.Password)

	if err != nil {
		return "", err
	}

	user, err := userService.Repo.CreateUser(domain.User{
		Email:    input.Email,
		Password: hashedPassword,
		Phone:    input.Phone,
		Verified: false, // Explicitly set to false
	})

	if err != nil {
		return "", err
	}

	return userService.Auth.GenerateToken(user.ID, user.Email, user.UserType)
}

// Most Go Database ORM return a pointer to the model, so we will use a pointer here as well.
func (s UserService) findUserByEmail(email string) (*domain.User, error) {
	user, err := s.Repo.FindUser(email)

	return &user, err
}

func (s UserService) Login(email string, password string) (string, error) {
	user, err := s.findUserByEmail(email)
	if err != nil {
		return "", errors.New("user does not exist")
	}

	err = s.Auth.VerifyPassword(password, user.Password)
	if err != nil {
		return "", err
	}

	return s.Auth.GenerateToken(user.ID, user.Email, user.UserType)
}

func (userService UserService) isVerifiedUser(id uint) bool {

	currentUser, err := userService.Repo.FindUserById(id)

	return err == nil && currentUser.Verified
}

func (s UserService) GetVerificationCode(user domain.User) (string,error) {
	// if user is already verified, return an error
	if s.isVerifiedUser(user.ID) {
		return "", errors.New("user is already verified")
	}

	dbUser, _ := s.Repo.FindUserById(user.ID)

	if dbUser.Phone == "" {
		return "", errors.New("phone number is not set")
	}
	phone := dbUser.Phone

	// generate verification code
	code, err := s.Auth.GenerateCode()
	if err != nil {
		return "", err
	}

	// update user with verification code
	updatedUserInfo := domain.User{
		Expiry: time.Now().Add(time.Minute * 30),
		Code: code,
	}

	_, err = s.Repo.UpdateUser(user.ID, updatedUserInfo)
	if err != nil {
		return "", errors.New("unable to update verification code")
	}

	// send SMS
	notificationClient := notification.NewNotificationClient(s.Config)
	msg := fmt.Sprintf("Your verification code is %v", code)
	err = notificationClient.SendSMS(phone, msg)
	if err != nil {
		return "", errors.New("error on sending sms")
	}

	return code, nil
}

func (s UserService) VerifyCode(id uint, code string) error {
	
	// if user already verified
	if s.isVerifiedUser(id) {
		log.Println("verified...")
		return errors.New("user already verified")
	}

	user, err := s.Repo.FindUserById(id)

	if err != nil {
		return err
	}

	if user.Code != code {
		return errors.New("verification code does not match")
	}

	if !time.Now().Before(user.Expiry) {
		return errors.New("verification code expired")
	}

	updateUser := domain.User{
		Verified: true,
	}

	_, err = s.Repo.UpdateUser(id, updateUser)

	if err != nil {
		return errors.New("unable to verify user")
	}

	return nil
}

func (s UserService) CreateProfile(id uint, input any) error {
	return nil
}

func (s UserService) UpdateProfile(id uint, input any) error {
	return nil
}

func (userService UserService) GetProfile(id uint) (*domain.User, error) {

	user, err := userService.Repo.FindUserById(id)
	if err != nil {
		return nil, err
	}

	return &user, nil
}

func (userService UserService) BecomeSeller(id uint, input dto.SellerInput) (string, error) {
	// find existing user
	user, err := userService.Repo.FindUserById(id)

	if err != nil {
		return "", err
	}
	
	if user.UserType == domain.SELLER {
		return "", errors.New("you have already joined as a seller")
	}

	// update user with seller info
	seller, err := userService.Repo.UpdateUser(id, domain.User{
		FirstName: input.FirstName,
		LastName: input.LastName,
		Phone: input.PhoneNumber,
		UserType: domain.SELLER,
	})

	if err != nil {
		return "", err
	}

	// generate token
	token, err := userService.Auth.GenerateToken(user.ID, user.Email, seller.UserType)

	if err != nil {
		return "", err
	}

	// create bank account information
	err = userService.Repo.CreateBankAccount(domain.BankAccount{
		BankAccount: input.BankAccountNumber,
		SwiftCode:   input.SwiftCode,
		PaymentType: input.PaymentType,
		UserId:      id,
	})
	
	if err != nil {
		return "", err
	}
	
	return token, nil
}

func (s UserService) FindCart(id uint) ([]any, error) {
	return nil, nil
}

func (s UserService) CreateCart(input any, u domain.User) ([]any, error) {
	return nil, nil
}

func (s UserService) CreateOrder(u domain.User) (int, error) {
	return 0, nil
}

func (s UserService) GetOrders(u domain.User) ([]any, error) {
	return nil, nil
}

func (s UserService) GetOrderById(id uint, uId uint) ([]any, error) {
	return nil, nil
}