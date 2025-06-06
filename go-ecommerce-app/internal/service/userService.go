package service

import (
	"errors"
	"go-ecommerce-app/internal/domain"
	"go-ecommerce-app/internal/dto"
	"go-ecommerce-app/internal/helper"
	"go-ecommerce-app/internal/repository"
	"log"
)

type UserService struct {
	Repo repository.UserRepository
	Auth helper.Auth
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

func (s UserService) GetVerificationCode(e domain.User) error {
	// This method should retrieve the verification code for a user.
	return nil
}

func (s UserService) VerifyCode(id uint, code int) error {
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

func (s UserService) BecomeSeller(id uint, input any) (string, error) {
	return "", nil
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

