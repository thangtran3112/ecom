package service

import "go-ecommerce-app/internal/domain"

type UserService struct {

}

func (s UserService) Signup(input any) (string, error){
	return "", nil
}

// Most Go Database ORM return a pointer to the model, so we will use a pointer here as well.
func (s UserService) findUserByEmail(email string) (*domain.User, error) {
	// This method should interact with the database to find a user by email.
	return nil, nil
}

func (s UserService) Login(input any) (string, error) {
	// This method should handle user login logic.
	return "", nil
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

func (s UserService) GetProfile(id uint) (*domain.User, error) {
	return nil, nil
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

